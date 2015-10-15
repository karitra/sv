namespace sv2

open WebSharper

module MainView =

    open WebSharper.JavaScript
    open WebSharper.JQuery
    open WebSharper.Html.Client

    open Server
    open Backend
    open Segment

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

        let cbProcSegments (si:SegmentsInfo) =
            ignore ()

        let cbProcInput (ks:string list) =
            ksGroup.Clear()
            for k in ks do 
                // Console.Log(k)
                ksGroup.Append( 
                    Div [ Class "radio" ] -<
                        [ 
                          Label [
                            Input [ 
                                    Class "list-group-item"
                                    Type "radio"
                                    Attr.Value k
                                    Attr.Name "ksOption"
                                    // Attr.Checked "yes"
                                    Attr.Id "ks_name"
                            ]
                            Span [ Text (procKSname k) ]
                          ]
                        ])

        Div [ Class "container" ] -<
            [ Div [ Class "row" ] -< 
                [ Div [ Class "col-md-8" ] -< 
                    [ H2 [ Text "Сегменты" ] ] 
                ]
              HR []
              Div [ Class "row" ] -<
                [ Div [ Class "col-md-8" ] -< 
                    [ Div [ Class "form-group" ] -<
                        [ Label  [Text "Список хостов кластера"]
                          npsInput.OnKeyPress 
                              (fun ev key -> 
                                match key.CharacterCode with
                                |13 -> async {
                                   let! r = Server.GetKsList npsInput.Value
                                   return cbProcInput r } |> Async.Start
                                | _  -> () )
                        ] ] ]

              Div [ Class "row"] -<
                   [ Div [ Class "col-md-8" ] -< 
                     [ Div [ Class "panel panel-default"] -< 
                            [ 
                                Div [ Class "panel-heading" ] -< [ H4 [ Text "Доступные индексы" ] ]
                                Div [ Class "panel-body" ] -< [ ksGroup ]
                            ]
                    ] ]

              Div [ Class "row"] -<
                  [  Div [ Class "col-md-8" ] -<
                        [ Div [ Class "form-group" ] -<
                            [ Label  [Text "Код атрибута"]
                              codeInput.OnKeyPress
                                (fun ev key ->
                                  match key.CharacterCode with
                                  |13 -> async {
                                     let sel = JQuery.Of("#ks_grp input[type='radio'][name='ksOption']:checked").Val
                                     let t = JQuery.Of("#ks_grp input[type='radio'][name='ksOption']:checked").Text
                                     Console.Log(sel.ToString())
                                     Console.Log(sel)
                                     Console.Log(t.ToString())
                                     Console.Log(t)
                                     let! r = Server.GetSegments npsInput.Value "s" (int codeInput.Value)
                                     return cbProcSegments r } |> Async.Start
                                  | _  -> () )
                            ]
                        ]
                ] ]


    type SegmentsView() =
        inherit WebSharper.Web.Control ()

        [<JavaScript>]
        override this.Body = MainBody () :> _
