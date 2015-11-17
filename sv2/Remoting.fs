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
                                .WithQueryTimeout(120000)
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
    open System.IO

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
            data : byte array
        }

    type SegmentsStat = 
        {
           binsCount : int
           minDoc : int64
           maxDoc : int64
           totalDocs: int64
           totalPos : int64
           avgSize : float
           totalSize : float
        }

    type SegmentsInfo =
        {
           stat : SegmentsStat
           segs : Segment array
        }

    (* Segment header mapping 
        enum ... {
            VER,  
            DOCS_COUNT,
            FROM_DOCID,
            TO_DOCID,
            DTBL_OFF,   
            POS_COUNT, 
            RNG_COUNT,
            TOTAL_COUNT,
            RESERVE_2,
            RESERVE_3,   
            RESERVE_4,
            FLAGS,
            RESERVE_5,
            RESERVE_6,
            RESERVE_7,
            RESERVE_8,
            SIZE
        };
    *)

    type SegmentHDRField = 
        | SFVersion     = 0
        | SFDocsCount   = 1
        | SFDocFrom     = 2
        | SFDocTo       = 3
        | SFDocTbOffset = 4
        | SFPosCount    = 5
        | SFRngCount    = 6
        | SFTotalCount  = 7
        | SFReserve2    = 8
        | SFReserve3    = 9
        | SFReserve4    = 10
        | SFFlags       = 11
        | SFReserve5    = 12
        | SFReserve6    = 13
        | SFReserve7    = 14
        | SFReserve8    = 15
        | SFHdrSize     = 16

    type SegmentHDR = {
        ver: int
        docsCount : int
        docFrom : int
        docTo : int
        docsOffset : int
        posCount : int
        rngCount : int
        totalCount : int
    }

    (* enum ... {
            ID,
            POS_SHIFT,
            POS_COUNT,
            RNG_SHIFT, 
            RNG_COUNT,
            OFF1,
            OFF2,
            RES_1,
            RES_2,
            TOTAL_POS_COUNT,
            TD_REC_SIZE
        };
    *)

    type DocHDRField =
        | DFId       = 0 
        | DFPosShift = 1
        | DFPosCount = 2
        | DFRngShift = 3
        | DFRngCount = 4
        | DFOff1     = 5
        | DFOff2     = 6
        | DFRes1     = 7
        | DFRes2     = 8
        | DFTotal    = 9
        | DFHdrSize  = 10

    type DocHDR = {
        id : int
        posShift : int
        posCount : int
        rngShift : int
        rngCount : int
        total : int
    }

    let getUUIDByCode (ss:ISession) (ks:string) (code:int) =
        let m = new Mapper(ss)
        m.Single<System.Guid>(sprintf "select id from %s.codes where code = ?" ks, code)

    let getUUIDByName (ss:ISession) (ks:string) (name:string) (user:string) =
        let m  = new Mapper(ss)
        m.Single<System.Guid>(sprintf "select id from %s.vinames where name = ? and user = ?" ks, name, user)

    let composeSegsQuery id =
        sprintf "select id, bin, from_doc, to_doc, doc_count, total_count, rng_count, data_size from segments where id = %s" id

    let inline getSegmentWithPayload (ss:ISession) (ks:string) (id:string) (bin:int) =
        let m = new Mapper(ss)
        m.Single<Segment>(sprintf "select id, bin, from_doc, to_doc, doc_count, total_count, rng_count, data_size, data from segments where id = %s and bin = %d" id bin)

    let inline getSegments (ss:ISession) (id:string) = 
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
                    data        = Array.empty<byte>
                }
         |]

    let gatherStat segs = 

        let minDocRef = ref 0L
        let maxDocRef = ref 0L
        let totalDocsRef = ref 0L
        let totalPosRef  = ref 0L
        let avgSizeRef = ref 0.0

        let inline gatherSingleStat sg =
            totalPosRef  := !totalPosRef  + int64 sg.total_count
            totalDocsRef := !totalDocsRef + int64 sg.doc_count
            avgSizeRef := !avgSizeRef + float sg.data_size
        
        Array.iter gatherSingleStat segs
        let cnt = Array.length segs

        {   binsCount = cnt
            minDoc = if cnt = 0 then (int64 0) else segs.[0].from_doc
            maxDoc = if cnt = 0 then (int64 0) else (Array.last segs).to_doc
            totalDocs = !totalDocsRef
            totalPos = !totalPosRef
            avgSize = if cnt = 0 then 0.0 else !avgSizeRef / float cnt 
            totalSize  = !avgSizeRef }

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

    let readHdr (br:BinaryReader) = 
        let binHdr = Array.init (int SegmentHDRField.SFHdrSize) ( fun _ -> br.ReadInt32() )
        {
            ver        = binHdr.[int SegmentHDRField.SFVersion]
            docsCount  = binHdr.[int SegmentHDRField.SFDocsCount]
            docFrom    = binHdr.[int SegmentHDRField.SFDocFrom]
            docTo      = binHdr.[int SegmentHDRField.SFDocTo]
            docsOffset = binHdr.[int SegmentHDRField.SFDocTbOffset]
            posCount   = binHdr.[int SegmentHDRField.SFPosCount]
            rngCount   = binHdr.[int SegmentHDRField.SFRngCount]
            totalCount = binHdr.[int SegmentHDRField.SFTotalCount]
        }

    let readDocTb (br:BinaryReader) =
        let binHdr = Array.init (int DocHDRField.DFHdrSize) ( fun _ -> br.ReadInt32() )
        {
            id       = binHdr.[int DocHDRField.DFId] 
            posShift = binHdr.[int DocHDRField.DFPosShift] 
            posCount = binHdr.[int DocHDRField.DFPosCount] 
            rngShift = binHdr.[int DocHDRField.DFRngShift] 
            rngCount = binHdr.[int DocHDRField.DFRngCount]
            total    = binHdr.[int DocHDRField.DFTotal] 
        }

    let readDocsTbList (br:BinaryReader) cnt =
        List.init cnt (fun _ -> readDocTb br)

    (* TODO: Скорее всего порядок вычисления для полей кортежа не гарантироуется *)
    let readMetaData (br:BinaryReader) =
        let hdr = readHdr br
        System.Diagnostics.Trace.WriteLine(sprintf "Docs count is %d" hdr.docsCount )
        let docs = readDocsTbList br hdr.docsCount
        (hdr, docs)

    let CountAvgDensity (np:string) (ks:string) (code:Attr) (bin:int) =

        let ss = GetSession np ks
        let id = match code with 
                    | AttrByCode(c)   -> getUUIDByCode ss ks c   |> string
                    | AttrByName(n,u) -> getUUIDByName ss ks n u |> string

        let seg = getSegmentWithPayload ss ks id bin

        use ms = new MemoryStream(seg.data)
        use br = new BinaryReader(ms)

        let (hdr, docs) = readMetaData br
        let sum = List.fold (fun acc doc -> acc + (uint64 doc.total)) 0UL docs

        System.Diagnostics.Trace.WriteLine(sprintf "Pos sum is is %d" sum )

        if docs.IsEmpty then 0.0 else (float sum) / (float docs.Length)

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

    [<Rpc>]
    let GetSegmentDensity (np:string) (ks:string) (codes:Attr) (bin:int) =
        async { return Segment.CountAvgDensity np ks codes bin }
