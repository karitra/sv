namespace sv2

module Resources =

    open WebSharper.Core.Resources

    type Bootstrap3CSS () =
        inherit BaseResource("Content/bootstrap.min.css")

    type Bootstrap3JS () =
        inherit BaseResource("Scripts/bootstrap.min.js")

    type JQuery19 () =
        inherit BaseResource("Scripts/jquery-1.9.1.min.js")

    type NumeralJS () =
        inherit BaseResource("Scripts/numeral/numeral.min.js")

