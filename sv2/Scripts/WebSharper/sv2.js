(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Strings,List,Html,Client,Attr,Tags,Enumerator,console,Operators,Concurrency,Remoting,AjaxRemotingProvider,EventsPervasives,sv2,MainView;
 Runtime.Define(Global,{
  sv2:{
   Backend:{
    IncorrectEndPointFormat:Runtime.Class({})
   },
   MainView:{
    MainBody:function()
    {
     var removePfx,x,npsInput,x1,codeInput,x2,ksGroup,cbProcInput,arg103,arg104,arg105,arg106,arg107,arg108,arg109,arg10a,arg00,arg10b,arg10c,arg10d,arg002;
     removePfx=function(ks)
     {
      return Strings.Remove(ks,0,Strings.length("geekrya_"));
     };
     x=List.ofArray([Attr.Attr().NewAttr("class","form-control"),Attr.Attr().NewAttr("placeholder","\u0425\u043e\u0441\u0442:\u041f\u043e\u0440\u0442"),Attr.Attr().NewAttr("value","127.0.0.1:9943")]);
     npsInput=Tags.Tags().NewTag("input",x);
     x1=List.ofArray([Attr.Attr().NewAttr("class","form-control"),Attr.Attr().NewAttr("placeholder","\u041a\u043e\u0434 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430")]);
     codeInput=Tags.Tags().NewTag("input",x1);
     x2=List.ofArray([Attr.Attr().NewAttr("class","list-group"),Attr.Attr().NewAttr("id","ks.grp")]);
     ksGroup=Tags.Tags().NewTag("div",x2);
     cbProcInput=function(ks)
     {
      var enumerator,_,k,arg10,arg101,arg102,x3;
      ksGroup["HtmlProvider@33"].Clear(ksGroup.get_Body());
      enumerator=Enumerator.Get(ks);
      try
      {
       while(enumerator.MoveNext())
        {
         k=enumerator.get_Current();
         if(console)
          {
           console.log(k);
          }
         arg10=List.ofArray([Attr.Attr().NewAttr("class","radio")]);
         arg101=List.ofArray([Attr.Attr().NewAttr("class","list-group-item"),Attr.Attr().NewAttr("type","radio"),Attr.Attr().NewAttr("value",k),Attr.Attr().NewAttr("name","ksOption"),Attr.Attr().NewAttr("checked","yes"),Attr.Attr().NewAttr("id","ks.name")]);
         x3=removePfx(k);
         arg102=List.ofArray([Tags.Tags().text(x3)]);
         ksGroup.AppendI(Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Tags.Tags().NewTag("input",arg101),Tags.Tags().NewTag("label",arg102)])));
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     };
     arg103=List.ofArray([Attr.Attr().NewAttr("class","container-fluid")]);
     arg104=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg105=List.ofArray([Attr.Attr().NewAttr("class","col-md-18")]);
     arg106=List.ofArray([Tags.Tags().text("\u0421\u0435\u0433\u043c\u0435\u043d\u0442\u044b")]);
     arg107=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg108=List.ofArray([Attr.Attr().NewAttr("class","col-md-6")]);
     arg109=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
     arg10a=List.ofArray([Tags.Tags().text("\u0421\u043f\u0438\u0441\u043e\u043a \u0445\u043e\u0441\u0442\u043e\u0432 \u043a\u043b\u0430\u0441\u0442\u0435\u0440\u0430")]);
     arg00=function()
     {
      return function(key)
      {
       var matchValue,_,arg001;
       matchValue=key.CharacterCode;
       if(matchValue===13)
        {
         arg001=Concurrency.Delay(function()
         {
          return Concurrency.Bind(AjaxRemotingProvider.Async("sv2:0",[npsInput.get_Value()]),function(_arg1)
          {
           return Concurrency.Return(cbProcInput(_arg1));
          });
         });
         _=Concurrency.Start(arg001,{
          $:0
         });
        }
       else
        {
         _=null;
        }
       return _;
      };
     };
     EventsPervasives.Events().OnKeyPress(arg00,npsInput);
     arg10b=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg10c=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg10d=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg002=function()
     {
      return function(key)
      {
       var matchValue,_,arg001;
       matchValue=key.CharacterCode;
       if(matchValue===13)
        {
         arg001=Concurrency.Delay(function()
         {
          return Concurrency.Bind(AjaxRemotingProvider.Async("sv2:1",[npsInput.get_Value(),"s",codeInput.get_Value()<<0]),function()
          {
           return Concurrency.Return(null);
          });
         });
         _=Concurrency.Start(arg001,{
          $:0
         });
        }
       else
        {
         _=null;
        }
       return _;
      };
     };
     EventsPervasives.Events().OnKeyPress(arg002,codeInput);
     return Operators.add(Tags.Tags().NewTag("div",arg103),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg104),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg105),List.ofArray([Tags.Tags().NewTag("h1",arg106)]))])),Operators.add(Tags.Tags().NewTag("div",arg107),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg108),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg109),List.ofArray([Tags.Tags().NewTag("label",arg10a),npsInput]))]))])),Operators.add(Tags.Tags().NewTag("div",arg10b),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10c),List.ofArray([ksGroup])),Operators.add(Tags.Tags().NewTag("div",arg10d),List.ofArray([codeInput]))]))]));
    },
    SegmentsView:Runtime.Class({
     get_Body:function()
     {
      return MainView.MainBody();
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Attr=Runtime.Safe(Client.Attr);
  Tags=Runtime.Safe(Client.Tags);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  console=Runtime.Safe(Global.console);
  Operators=Runtime.Safe(Client.Operators);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  sv2=Runtime.Safe(Global.sv2);
  return MainView=Runtime.Safe(sv2.MainView);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
