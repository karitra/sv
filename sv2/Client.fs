namespace sv2

open WebSharper

module MainView =

    open WebSharper.JavaScript
    open WebSharper.Html.Client

    open Server
    open Backend

    [<Require(typeof<Resources.JQuery19>)>]
    [<Require(typeof<Resources.Bootstrap3CSS>)>]
    [<Require(typeof<Resources.Bootstrap3JS>)>]
    [<JavaScript>]
    let MainBody () =

        let removePfx (ks:string) = 
            ks.Remove(0, String.length Backend.GEEKY_PFX)

        let npsInput = 
            Input [ Class "form-control"; Attr.PlaceHolder "Хост:Порт"; Attr.Value "127.0.0.1:9943" ]

        let codeInput =
            Input [ Class "form-control"; Attr.PlaceHolder "Код атрибута" ] 

        let ksGroup = 
            Div [ Class "list-group"; Attr.Id "ks.grp" ]

        let cbProcInput (ks:string list) =
            ksGroup.Clear()
            for k in ks do 
                Console.Log(k)
                ksGroup.Append( 
                    Div [ Class "radio"] -<
                        [ 
                          Input [ 
                                    Class "list-group-item"
                                    Type "radio"
                                    Attr.Value k
                                    Attr.Name "ksOption"
                                    Attr.Checked "yes"
                                    Attr.Id "ks.name"
                                ] -< [ Text (removePfx k) ]
                        ])

        Div [ Class "container" ] -<
            [ Div [ Class "row" ] -< 
                [ Div [ Class "col-md-16" ] -< [ H2 [ Text "Сегменты" ] ] ]
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
                [
                    Div [ Class "col-md-8" ] -< [ ksGroup ]
                    (* Div [ Class "col-md-8" ] -<
                        [
                            codeInput.OnKeyPress
                              (fun ev key ->
                                match key.CharacterCode with
                                |13 -> async {
                                   let! r = Server.GetSegments npsInput.Value "s" (int codeInput.Value)
                                   return (fun x -> () ) r } |> Async.Start
                                | _  -> () )
                        ] *)
                ]
            ]


    type SegmentsView() =
        inherit WebSharper.Web.Control ()

        [<JavaScript>]
        override this.Body = MainBody () :> _
