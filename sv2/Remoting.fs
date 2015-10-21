(* 
    TODO: сообщать об ошибках клиенту
*)
namespace sv2

open WebSharper

module Backend =

    open Cassandra
    open System.Net
    open System.Collections.Generic

    exception IncorrectEndPointFormat

    [<Literal>]
    let DEFAULT_PORT = 9042
    [<Literal>]
    let SESSION_PFX = "__session__:"
    [<Literal>]
    let CLUSTER_PFX = "__cluster__:"
    [<Literal>]
    let SYSTEM_KS = "system"
    [<Literal>]
    let GEEKY_PFX = "geekrya_"

    let composeClusterKey s =
        CLUSTER_PFX + s

    let composeSessionKey np ss = 
        SESSION_PFX + np + ":" + ss

    let appCache = System.Runtime.Caching.MemoryCache.Default

    let GetNodePoints (nps:string) =
        [ for host in nps.Split(',') do 
            let sa = host.Split(':')
            match sa.Length with
                | 2 -> yield new IPEndPoint( IPAddress.Parse(sa.[0]), int sa.[1] ) 
                | 1 -> yield new IPEndPoint( IPAddress.Parse(sa.[0]), DEFAULT_PORT) 
                | _ -> raise IncorrectEndPointFormat ]

    let GetCluster (nps:string) =
        match appCache.Get(composeClusterKey nps) with
            | :? Cassandra.Cluster as cl -> cl
            | _ ->
                   let cl = Cluster.Builder()
                                .AddContactPoints(GetNodePoints nps)
                                .Build()
                   appCache.[composeClusterKey nps] <- cl
                   cl

    let GetSession (nps:string) (ks:string) =
        match appCache.Get(composeSessionKey nps ks) with
            | :? Cassandra.ISession as s -> s
            | _ ->  let cl = GetCluster nps
                    let s = cl.Connect(ks)
                    appCache.[composeSessionKey nps ks] <- s
                    s.ChangeKeyspace(ks)
                    s
    
module Segment =

    open Backend
    open Cassandra
    open Cassandra.Mapping
    open System.Collections.Generic

    type Attr = | AttrByCode of int 
                | AttrByName of name:string * user:string

    type Code =
        {
            code: int
            id: System.Guid
        }

    type Query =
        {
            name: string
            user: string
            id: System.Guid
        }

    type Segment =
        {
            id: System.Guid
            bin: int
            from_doc: int64
            to_doc: int64
            doc_count : int
            total_count : int
            rng_cout: int
            data_size : int64
        }

    type SegmentsStat = 
        {
           binsCount : int
           totalDocs: int64
           totalPos : int64
           avgSize : float
        }

    type SegmentsInfo =
        {
           stat : SegmentsStat
           segs : Segment array
        }

    let getUUIDByCode (ss:ISession) (ks:string) (code:int) =
        let m = new Mapper(ss)
        m.Single<System.Guid>(sprintf "select id from %s.codes where code = ?" ks, code)

    let getUUIDByName (ss:ISession) (ks:string) (name:string) (user:string) =
        let m  = new Mapper(ss)
        m.Single<System.Guid>(sprintf "select id from %s.vinames where name = ? and user = ?" ks, name, user)

    let composeSegsQuery id =
        sprintf "select id, bin, from_doc, to_doc, doc_count, total_count, rng_count, data_size from segments where id = %s" id

    let getSegments (ss:ISession) (id:string) = 
         [| for s in ss.Execute(composeSegsQuery id) 
                -> {
                    id          = s.GetValue<System.Guid>(0)
                    bin         = s.GetValue<int>(1)
                    from_doc    = s.GetValue<int64>(2)
                    to_doc      = s.GetValue<int64>(3)
                    doc_count   = s.GetValue<int>(4)
                    total_count = s.GetValue<int>(5)
                    rng_cout    = s.GetValue<int>(6)
                    data_size   = s.GetValue<int64>(7)
                }
         |]

    let gatherStat segs = 

        let totalDocsRef = ref (int64 0)
        let totalPosRef  = ref (int64 0)
        let avgSizeRef = ref 0.0

        let gatherStat sg =
            totalPosRef  := !totalPosRef  + int64 sg.total_count
            totalDocsRef := !totalDocsRef + int64 sg.doc_count
            avgSizeRef := !avgSizeRef + float sg.data_size        
        
        Array.iter gatherStat segs
        let cnt = Array.length segs

        {   binsCount = cnt
            totalDocs = !totalDocsRef
            totalPos = !totalPosRef
            avgSize = if cnt = 0 then 0.0 else !avgSizeRef / float cnt }

    let LoadSegmentsStat (np:string) (ks:string) (codes:Attr list) =

        let dc = new Dictionary<string, int>()
        let ss = GetSession np ks
        codes |> List.map 
                (fun c -> match c with
                           | AttrByCode(c)   -> 
                               let sc = getUUIDByCode ss ks c   |> string
                               dc.Add(sc, c); sc
                           | AttrByName(n,u) -> getUUIDByName ss ks n u |> string ) 
              |> List.map (fun id -> (dc.[id], (gatherStat (getSegments ss id))) )

    let LoadSegmentsArray (np:string) (ks:string) (code:Attr) =

        let ss = GetSession np ks
        let id = match code with 
                    | AttrByCode(c) -> getUUIDByCode ss ks c |> string
                    | AttrByName(n,u) -> getUUIDByName ss ks n u |> string

        System.Diagnostics.Trace.WriteLine(sprintf "Code is %s" id )

        let segs = getSegments ss id

        let cnt = Array.length segs
        {
            stat = gatherStat segs
            segs = segs }

module Server =

    open Backend
    open Segment

    [<Rpc>]
    let GetKsList (np:string) =
        async {
            let ss = Backend.GetSession np SYSTEM_KS
            return 
                [ for ks in ss.Execute("select keyspace_name from schema_keyspaces")
                    -> ks.GetValue<string>(0) 
                ] |> List.filter (fun x -> x.StartsWith(Backend.GEEKY_PFX) )
        }

    [<Rpc>]
    let GetSegments (np:string) (ks:string) (code:Attr) =
        async { return Segment.LoadSegmentsArray np ks code }

    [<Rpc>]
    let GetSegsStat (np:string) (ks:string) (codes:Attr list) =
        async { return Segment.LoadSegmentsStat np ks codes }
