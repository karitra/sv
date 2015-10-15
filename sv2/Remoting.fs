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

    type Segment =
        {
            bin: int
            from_doc: int64
            to_doc: int64
            doc_count : int
            total_count : int
            rng_cout: int
            data_size : int64
        }

    type SegmentsInfo =
        {
           binsCount : int
           totalDocs: int64
           totalPos : int64
           avgSize : float
           segs : Segment array
        }
            
    let getUUID (ss:ISession) (code:int) =
        let rs = ss.Execute(sprintf "select id from codes where code = %d" code)
        [for c in rs -> c.GetValue<System.Guid>(0).ToString() ] |> List.head

    let composeSegsQuery id =
        sprintf "select bin, from_doc, to_doc, doc_count, total_count, rng_count, data_size from segments where id = %s" (id.ToString())

    let LoadSegmentsInfo (np:string) (ks:string) (code:int) =
        let ss = GetSession np ks
        let id = getUUID ss code

        System.Diagnostics.Trace.WriteLine(sprintf "Code is %s" (id.ToString()) )

        let segments =
            [| for s in ss.Execute(composeSegsQuery id) 
                -> {
                    bin         = s.GetValue<int>(0)
                    from_doc    = s.GetValue<int64>(1)
                    to_doc      = s.GetValue<int64>(2)
                    doc_count   = s.GetValue<int>(3)
                    total_count = s.GetValue<int>(4)
                    rng_cout    = s.GetValue<int>(5)
                    data_size   = s.GetValue<int64>(6)
                }
            |]

        let totalDocsRef = ref (int64 0)
        let totalPosRef  = ref (int64 0)
        let avgSizeRef = ref 0.0

        let gatherStat sg =
            totalPosRef  := !totalPosRef  + int64 sg.total_count
            totalDocsRef := !totalDocsRef + int64 sg.doc_count
            avgSizeRef := !avgSizeRef + float sg.data_size        
        
        Array.iter gatherStat segments
        let cnt = Array.length segments
        {
            binsCount = cnt
            totalDocs = !totalDocsRef
            totalPos = !totalPosRef
            avgSize = if cnt = 0 then 0.0 else !avgSizeRef / float cnt
            segs = segments }

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
    let GetSegments (np:string) (ks:string) (code:int) =
        async {
            return Segment.LoadSegmentsInfo np ks code
        }
