namespace sv2

open WebSharper

module Site =

    open WebSharper.Sitelets
    open WebSharper.Html.Server

    type EndPoint =
        | [<EndPoint "/">] Index

    [<Website>]
    let Main =
        Sitelet.Infer <| fun context endpoint ->
            match endpoint with
                | Index ->
                    Content.Page(
                          Title = "Индекс ГИКРЯ",
                          Body  = [ new MainView.SegmentsView () ]
                        )
