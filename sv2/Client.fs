namespace sv2

open WebSharper

module MainView =

    open WebSharper.JavaScript
    open WebSharper.JQuery
    open WebSharper.Html.Client

    open Server
    open Backend
    open Segment

    [<Literal>]
    let DEFAULT_CODE_INFO_MSG = "Информация по коду"

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0,0')">]
    let strWithSep (x:int) = X<string>

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0,0')">]
    let strWithSepInt64 (x:int64) = X<string>

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0 b')">]
    let strForBytesInt64 (x:int64) = X<string>

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0 b')">]
    let strForBytesFloat (x:float) = X<string>


    [<Require(typeof<Resources.JQuery19>)>]
    [<Require(typeof<Resources.Bootstrap3CSS>)>]
    [<Require(typeof<Resources.Bootstrap3JS>)>]
    [<JavaScript>]
    let MainBody () =

        let procKSname (ks:string) =
            let removePfx (ks:string) = 
                ks.Remove(0, String.length Backend.GEEKY_PFX)

            let replaceUnder (ks:string) =
                ks.Replace("_", ".")

            ks |> removePfx |> replaceUnder

        let npsInput = 
            Input [ Class "form-control"; Attr.PlaceHolder "Хост:Порт"; Attr.Value "127.0.0.1:9943" ]
        
        let codeInput =
            Input [ Class "form-control"; Attr.PlaceHolder "Код" ]

        let userInput =
            Input [ Class "form-control"; Attr.PlaceHolder "Пользователь" ]

        let nameInput =
            Input [ Class "form-control"; Attr.PlaceHolder "Имя" ]
        
        let ksGroup = 
            Div [ Class "list-group"; Attr.Id "ks_grp" ]

        let segsInfoGroup =
            UL [ Class "list-group"; Attr.Id "segsInfo" ]

        let segsStatList =
            UL [  Class "list-group hidden"; Attr.Id "segsStat" ] 
     
        let getSelectedKs () =
            JQuery.Of("#ks_grp input[type='radio'][name='ksOption']:checked").First().Val().ToString()

        let segmentsTable =
            Table [Class "table table-hover hidden"; Attr.Id "segTb" ] -< 
              [
                Tags.Caption [ Text "Информация по сегментам" ] 
                TR [
                    TH [Text "#"]
                    TH [Text "С док. #"]
                    TH [Text "По док. #"]
                    TH [Text "Число документов"]
                    TH [Text "Число позиций"]
                    TH [Text "Размер"]
                    TH [Text "Выполнить"]
                    TH [Text "Результат"]
                ]
              ]
        
        let formatCodeInfoStr (c:int) = 
                sprintf "%s %d" DEFAULT_CODE_INFO_MSG c

        let formatNameInfoStr(n:string) (u:string)  =
                sprintf "%s: %s, пользователь %s" DEFAULT_CODE_INFO_MSG n u

        let addStatListItem (msg:string) (cnt:string) =
                LI [ Class "list-group-item" ]
                    -< [
                            Tags.Span [ Class "badge" ] -< [ Text cnt ]
                            Tags.Span [ Text msg ]
                       ]

        let cbProcStatList (sl: (int * Segment.SegmentsStat) list) =

                let makeCodeStatItem (id:int, stat:Segment.SegmentsStat) = 
                    Console.Log("Item " + (string id))
                    LI [ Class "list-group-item" ] 
                           -< [
                               Div [
                                 H3 [ Text (sprintf "Атрибут %d" id) ]
                                 UL [ Class "list-group" ] 
                                    -< [
                                        addStatListItem "Число сегментов" (string stat.binsCount)
                                        addStatListItem "Первый документ" (strWithSepInt64 stat.minDoc)
                                        addStatListItem "Последний документ" (strWithSepInt64 stat.maxDoc)
                                        addStatListItem "Документов в интервале" (strWithSepInt64 (stat.maxDoc - stat.minDoc) )
                                        addStatListItem "Число документов" (strWithSepInt64 stat.totalDocs)
                                        addStatListItem "Число позиций" (strWithSepInt64 stat.totalPos)
                                        addStatListItem "Средняя длина сегмента" (strForBytesFloat stat.avgSize)
                                        addStatListItem "Суммарный размер" (strForBytesFloat stat.totalSize)
                                       ] ] ]

                JQuery.Of(".segTbRow").Remove().Ignore
                JQuery.Of("#segInfo" ).AddClass("hidden").Ignore
                JQuery.Of("#segTb"   ).AddClass("hidden").Ignore
                JQuery.Of("#segsStat").RemoveClass("hidden").Ignore

                Console.Log("Items count: " + (string sl.Length))

                segsStatList.Clear()
                sl |> List.iter (fun el ->
                    segsStatList.Append(makeCodeStatItem el) )

        let cbProcSegments (si:SegmentsInfo) (c:Segment.Attr) =

                match c with
                    | Segment.AttrByCode(ic) -> JQuery.Of("#codeMsg").Text(formatCodeInfoStr ic).Ignore
                    | Segment.AttrByName(n, u) -> JQuery.Of("#codeMsg").Text(formatNameInfoStr n u).Ignore

                let stat = si.stat 

                segsInfoGroup.Clear()
                segsInfoGroup.Append( addStatListItem "Число сегментов" (string stat.binsCount) )
                segsInfoGroup.Append( addStatListItem "Первый документ" (strWithSepInt64 stat.minDoc) )
                segsInfoGroup.Append( addStatListItem "Последний документ" (strWithSepInt64 stat.maxDoc) )
                segsInfoGroup.Append( addStatListItem "Документов в интервале" (strWithSepInt64 (stat.maxDoc - stat.minDoc) ) )
                segsInfoGroup.Append( addStatListItem "Число документов" (strWithSepInt64 stat.totalDocs)  )
                segsInfoGroup.Append( addStatListItem "Число позиций" (strWithSepInt64 stat.totalPos) )
                segsInfoGroup.Append( addStatListItem "Средняя длина сегмента" (strForBytesFloat stat.avgSize) )
                segsInfoGroup.Append( addStatListItem "Суммарный размер" (strForBytesFloat stat.totalSize) )

                JQuery.Of(".segTbRow").Remove().Ignore
                JQuery.Of("#segInfo" ).RemoveClass("hidden").Ignore
                JQuery.Of("#segTb"   ).RemoveClass("hidden").Ignore
                JQuery.Of("#segsStat").AddClass("hidden").Ignore

                let rowClickedCb (bin:int) (avg:float) =
                    Console.Log(sprintf "avg: %f" avg)
                    JQuery.Of(sprintf "#segRes%d" bin).Text(sprintf "%0.3f" avg).Ignore

                for s in si.segs do
                    segmentsTable.Append(
                        TR [ Attr.Class "segTbRow" ] -< [
                            TD [ Text <| string s.bin ]
                            TD [ Text <| strWithSepInt64 s.from_doc ]
                            TD [ Text <| strWithSepInt64 s.to_doc ]
                            TD [ Text <| strWithSep s.doc_count ]
                            TD [ Text <| strWithSep s.total_count ]
                            TD [ Text <| strForBytesInt64 s.data_size ]
                            TD [ 
                                (Button  [ Class "btn btn-xs"; Attr.Id (sprintf "roBtn%d" s.bin) ] -< [ Text "ρW" ]).OnClick 
                                    ( fun el ev ->
                                        async {
                                                let b = int (el.Id.Substring("roBtn".Length))
                                                let! r = Server.GetSegmentDensity npsInput.Value (getSelectedKs ()) c b
                                                return rowClickedCb b r } |> Async.Start )
                                ]
                            TD [ Span [ Class "badge"; Attr.Id ("segRes" + (string s.bin)) ] -< [ Text "" ] ]
                        ]
                    )

        let cbProcInput (ks:string list) =
            ksGroup.Clear()
            for k in ks do 
                ksGroup.Append( 
                    Div [ Class "radio" ] -<
                        [ 
                          Label [
                            Input [ 
                                    Class "list-group-item"
                                    Type "radio"
                                    Attr.Value k
                                    Attr.Name "ksOption"
                                    Attr.Id "ks_name"
                            ]
                            Span [ Text (procKSname k) ]
                          ]
                        ])
        
        let hostDiv =
            Div [ Class "form-group" ] -<
                [ 
                    Label  [Text "Список хостов кластера"]
                    npsInput.OnKeyPress 
                      (fun ev key ->
                            match key.CharacterCode with
                            | 13 -> async {
                                   let! r = Server.GetKsList npsInput.Value
                                   return cbProcInput r } |> Async.Start
                            | _  -> () ) 
                ]

        let requestSegments (code:Segment.Attr) (remote: string -> string -> Segment.Attr -> Async<Segment.SegmentsInfo>) = 
            async {
                let! r = remote npsInput.Value (getSelectedKs ()) code
                return cbProcSegments r code }

        let codeDiv =

            let runSimple code = requestSegments (Segment.AttrByCode code) Server.GetSegments
            let runComposite codes =
                async {
                    let! r = Server.GetSegsStat npsInput.Value (getSelectedKs ()) (List.ofArray codes)
                    return cbProcStatList r
                }

            Div [ Class "form-group" ] -<
                [
                    Label  [Text "Код атрибута (можно списком через запятую)"]
                    codeInput.OnKeyPress 
                        (fun ev key ->
                            match key.CharacterCode with
                                | 13 ->
                                    let cds = codeInput.Value.Split(',')
                                    Console.Log("Codes: " + cds.ToString())
                                    Console.Log("Codes len: " + cds.Length.ToString())
                                    (if cds.Length = 1 then
                                        runSimple (int codeInput.Value)
                                    else
                                        cds |> Array.map (fun c -> Segment.AttrByCode (int c))
                                            |> runComposite ) |> Async.Start
                                | _  -> () )
                ]

        let nameDiv =
            Div [ Class "form-group" ] -<
                [
                    Label  [Text "Имя пользователя"]
                    userInput
                    Label  [Text "Имя атрибута"]
                    nameInput.OnKeyPress 
                        (fun ev key ->
                            match key.CharacterCode with
                                | 13 -> requestSegments (Segment.AttrByName (nameInput.Value, userInput.Value) ) Server.GetSegments |> Async.Start
                                | _  -> () )
                ]

        Div [ Class "container-fluid" ] -< 
            [
              Div [ Class "row" ] -<
                [ Div [ Class "col-md-12" ] -< 
                    [ H2 [ Text "Просмотр сегментов" ] ] 
                ]
              HR []
              Div [ Class "row" ] -<
                [ Div [ Class "col-md-12" ] -<
                    [ 
                        hostDiv 
                    ] 
                ]
              Div [ Class "row"] -<
                [ Div [ Class "col-md-12" ] -<
                    [ Div [ Class "panel panel-default"] -<
                        [
                            Div [ Class "panel-heading" ] -< [ H4 [ Text "Доступные индексы" ] ]
                            Div [ Class "panel-body" ] -< 
                            [
                                ksGroup
                                codeDiv
                                nameDiv
                            ]
                        ]
                    ]
                ]

              Div [ Class "row"] -< 
                [
                    Div [ Class "col-md-6" ] -<
                            [ Div [ Class "well hidden"; Attr.Id "segInfo" ] -<
                                [
                                    Span [ Class "label label-info"; Attr.Id "codeMsg" ] -<
                                        [ Text DEFAULT_CODE_INFO_MSG ]
                                    segsInfoGroup
                                    ] ]
                ]

              Div [ Class "row"] -< 
                [
                    Div [ Class "col-md-10" ] -<
                        [ segmentsTable ]
                ]

              Div [ Class "row"] -< 
                [
                    Div [ Class "col-md-4" ] -<
                        [ segsStatList ]
                ]

            ]


    type SegmentsView() =
        inherit WebSharper.Web.Control ()

        [<JavaScript>]
        override this.Body = MainBody () :> _
