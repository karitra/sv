namespace sv2

open WebSharper

module MainView =

    open WebSharper.JavaScript
    open WebSharper.JQuery
    open WebSharper.Html.Client

    open Server
    open Backend
    open Segment

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0,0')">]
    let strWithSep (x:int) = X<string>

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0,0')">]
    let strWithSepInt64 (x:int64) = X<string>

    [<Require(typeof<Resources.NumeralJS>)>]
    [<Inline "numeral($x).format('0 b')">]
    let strForBytesInt64 (x:int64) = X<string>

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

        let ksGroup = 
            Div [ Class "list-group"; Attr.Id "ks_grp" ]

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
                ]
              ]

        let cbProcSegments (si:SegmentsInfo) =
            JQuery.Of(".segTbRow").Remove().Ignore
            JQuery.Of("#segTb").RemoveClass("hidden").Ignore
            for s in si.segs do
                segmentsTable.Append(
                    TR [ Attr.Class "segTbRow" ] -< [
                        TD [ Text <| string s.bin ]
                        TD [ Text <| strWithSepInt64 s.from_doc ]
                        TD [ Text <| strWithSepInt64 s.to_doc ]
                        TD [ Text <| strWithSep s.doc_count ]
                        TD [ Text <| strWithSep s.total_count ]
                        TD [ Text <| strForBytesInt64 s.data_size ]
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

        let codeDiv =
            Div [ Class "form-group" ] -<
                [
                    Label  [Text "Код атрибута"]
                    codeInput.OnKeyPress 
                        (fun ev key ->
                            match key.CharacterCode with 
                                | 13 -> async {
                                            let sel = JQuery.Of("#ks_grp input[type='radio'][name='ksOption']:checked").First().Val()
                                            let! r = Server.GetSegments npsInput.Value (sel.ToString()) (int codeInput.Value)
                                            return cbProcSegments r } |> Async.Start
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
                            ]
                        ]
                    ]
                ]
              Div [ Class "row"] -< 
                [
                    Div [ Class "col-md-12" ] -<
                        [
                            segmentsTable
                        ]
                ]
            ]


    type SegmentsView() =
        inherit WebSharper.Web.Control ()

        [<JavaScript>]
        override this.Body = MainBody () :> _
