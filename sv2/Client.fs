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
            Tags.UL [ Class "list-group"; Attr.Id "segsInfo" ]

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
        
        let formatCodeInfoStr (c:int) = 
                sprintf "%s %d" DEFAULT_CODE_INFO_MSG c

        let formatNameInfoStr(n:string) (u:string)  =
                sprintf "%s: %s, пользователь %s" DEFAULT_CODE_INFO_MSG n u

        let cbProcSegments (si:SegmentsInfo) (c:Segment.Attr) =
                let addStatItem msg cnt =
                    LI [ Class "list-group-item" ] 
                        -< [
                                Tags.Span [ Class "badge" ] -< [ Text cnt ]
                                Tags.Span [ Text msg ]
                            ]

                match c with
                    | Segment.AttrByCode(ic) -> JQuery.Of("#codeMsg").Text(formatCodeInfoStr ic).Ignore
                    | Segment.AttrByName(n, u) -> JQuery.Of("#codeMsg").Text(formatNameInfoStr n u).Ignore

                segsInfoGroup.Clear()
                segsInfoGroup.Append(
                    addStatItem "Число сегментов" (string si.binsCount) )
                segsInfoGroup.Append(
                    addStatItem "Число документов" (strWithSepInt64 si.totalDocs) )
                segsInfoGroup.Append(
                    addStatItem "Число позиций" (strWithSepInt64 si.totalPos) )
                segsInfoGroup.Append(
                    addStatItem "Средняя длина сегмента" (strForBytesFloat si.avgSize) )

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

        let getSelectedKs () =
            JQuery.Of("#ks_grp input[type='radio'][name='ksOption']:checked").First().Val().ToString()

        let requestSegments (code:Segment.Attr) (remote: string -> string -> Segment.Attr -> Async<Segment.SegmentsInfo>) = 
            async {
                let! r = remote npsInput.Value (getSelectedKs ()) code
                return cbProcSegments r code } 

        let codeDiv =
            Div [ Class "form-group" ] -<
                [
                    Label  [Text "Код атрибута"]
                    codeInput.OnKeyPress 
                        (fun ev key ->
                            // let intCode = int codeInput.Value
                            match key.CharacterCode with
                                | 13 -> requestSegments (Segment.AttrByCode (int codeInput.Value)) Server.GetSegments |> Async.Start
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
                            [ Div [ Class "well" ] -<
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
            ]


    type SegmentsView() =
        inherit WebSharper.Web.Control ()

        [<JavaScript>]
        override this.Body = MainBody () :> _
