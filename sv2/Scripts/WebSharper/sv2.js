(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Strings,List,Html,Client,Attr,Tags,Enumerator,Operators,T,Concurrency,Remoting,AjaxRemotingProvider,EventsPervasives,jQuery,String,console,sv2,MainView;
 Runtime.Define(Global,{
  sv2:{
   Backend:{
    IncorrectEndPointFormat:Runtime.Class({})
   },
   MainView:{
    MainBody:function()
    {
     var procKSname,x,npsInput,x1,codeInput,x2,ksGroup,cbProcSegments,cbProcInput,arg104,arg105,arg106,arg107,arg108,arg109,arg10a,arg10b,arg10c,arg00,arg10d,arg10e,arg10f,arg1010,arg1011,arg1012,arg1013,arg1014,arg1015,arg1016,arg002;
     procKSname=function(ks)
     {
      var removePfx,replaceUnder;
      removePfx=function(ks1)
      {
       return Strings.Remove(ks1,0,Strings.length("geekrya_"));
      };
      replaceUnder=function(ks1)
      {
       return Strings.Replace(ks1,"_",".");
      };
      return replaceUnder(removePfx(ks));
     };
     x=List.ofArray([Attr.Attr().NewAttr("class","form-control"),Attr.Attr().NewAttr("placeholder","\u0425\u043e\u0441\u0442:\u041f\u043e\u0440\u0442"),Attr.Attr().NewAttr("value","127.0.0.1:9943")]);
     npsInput=Tags.Tags().NewTag("input",x);
     x1=List.ofArray([Attr.Attr().NewAttr("class","form-control"),Attr.Attr().NewAttr("placeholder","\u041a\u043e\u0434")]);
     codeInput=Tags.Tags().NewTag("input",x1);
     x2=List.ofArray([Attr.Attr().NewAttr("class","list-group"),Attr.Attr().NewAttr("id","ks_grp")]);
     ksGroup=Tags.Tags().NewTag("div",x2);
     cbProcSegments=function()
     {
     };
     cbProcInput=function(ks)
     {
      var enumerator,_,k,arg10,arg101,arg102,arg103,x3;
      ksGroup["HtmlProvider@33"].Clear(ksGroup.get_Body());
      enumerator=Enumerator.Get(ks);
      try
      {
       while(enumerator.MoveNext())
        {
         k=enumerator.get_Current();
         arg10=List.ofArray([Attr.Attr().NewAttr("class","radio")]);
         arg102=List.ofArray([Attr.Attr().NewAttr("class","list-group-item"),Attr.Attr().NewAttr("type","radio"),Attr.Attr().NewAttr("value",k),Attr.Attr().NewAttr("name","ksOption"),Attr.Attr().NewAttr("id","ks_name")]);
         x3=procKSname(k);
         arg103=List.ofArray([Tags.Tags().text(x3)]);
         arg101=List.ofArray([Tags.Tags().NewTag("input",arg102),Tags.Tags().NewTag("span",arg103)]);
         ksGroup.AppendI(Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Tags.Tags().NewTag("label",arg101)])));
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     };
     arg104=List.ofArray([Attr.Attr().NewAttr("class","container")]);
     arg105=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg106=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg107=List.ofArray([Tags.Tags().text("\u0421\u0435\u0433\u043c\u0435\u043d\u0442\u044b")]);
     arg108=Runtime.New(T,{
      $:0
     });
     arg109=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg10a=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg10b=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
     arg10c=List.ofArray([Tags.Tags().text("\u0421\u043f\u0438\u0441\u043e\u043a \u0445\u043e\u0441\u0442\u043e\u0432 \u043a\u043b\u0430\u0441\u0442\u0435\u0440\u0430")]);
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
     arg10d=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg10e=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg10f=List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")]);
     arg1010=List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]);
     arg1011=List.ofArray([Tags.Tags().text("\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u0438\u043d\u0434\u0435\u043a\u0441\u044b")]);
     arg1012=List.ofArray([Attr.Attr().NewAttr("class","panel-body")]);
     arg1013=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg1014=List.ofArray([Attr.Attr().NewAttr("class","col-md-8")]);
     arg1015=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
     arg1016=List.ofArray([Tags.Tags().text("\u041a\u043e\u0434 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430")]);
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
          var objectArg,sel,objectArg1,t,a,a1;
          objectArg=jQuery("#ks_grp input[type='radio'][name='ksOption']:checked");
          sel=function(arg003)
          {
           return objectArg.val(arg003);
          };
          objectArg1=jQuery("#ks_grp input[type='radio'][name='ksOption']:checked");
          t=function(arg003)
          {
           return objectArg1.text(arg003);
          };
          a=String(sel);
          console?console.log(a):undefined;
          if(console)
           {
            console.log(sel);
           }
          a1=String(t);
          console?console.log(a1):undefined;
          if(console)
           {
            console.log(t);
           }
          return Concurrency.Bind(AjaxRemotingProvider.Async("sv2:1",[npsInput.get_Value(),"s",codeInput.get_Value()<<0]),function(_arg2)
          {
           return Concurrency.Return(cbProcSegments(_arg2));
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
     return Operators.add(Tags.Tags().NewTag("div",arg104),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg105),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg106),List.ofArray([Tags.Tags().NewTag("h2",arg107)]))])),Tags.Tags().NewTag("hr",arg108),Operators.add(Tags.Tags().NewTag("div",arg109),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10a),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10b),List.ofArray([Tags.Tags().NewTag("label",arg10c),npsInput]))]))])),Operators.add(Tags.Tags().NewTag("div",arg10d),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10e),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10f),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1010),List.ofArray([Tags.Tags().NewTag("h4",arg1011)])),Operators.add(Tags.Tags().NewTag("div",arg1012),List.ofArray([ksGroup]))]))]))])),Operators.add(Tags.Tags().NewTag("div",arg1013),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1014),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1015),List.ofArray([Tags.Tags().NewTag("label",arg1016),codeInput]))]))]))]));
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
  Operators=Runtime.Safe(Client.Operators);
  T=Runtime.Safe(List.T);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  jQuery=Runtime.Safe(Global.jQuery);
  String=Runtime.Safe(Global.String);
  console=Runtime.Safe(Global.console);
  sv2=Runtime.Safe(Global.sv2);
  return MainView=Runtime.Safe(sv2.MainView);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
