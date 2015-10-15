(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Strings,List,Html,Client,Attr,Tags,Operators,jQuery,Arrays,numeral,Enumerator,Concurrency,Remoting,AjaxRemotingProvider,EventsPervasives,String,T,sv2,MainView;
 Runtime.Define(Global,{
  sv2:{
   Backend:{
    IncorrectEndPointFormat:Runtime.Class({})
   },
   MainView:{
    MainBody:function()
    {
     var procKSname,x,npsInput,x1,codeInput,x2,ksGroup,segmentsTable,arg10,arg101,arg102,arg103,arg104,arg105,arg106,arg107,cbProcSegments,cbProcInput,hostDiv,arg10f,arg1010,arg00,codeDiv,arg1011,arg1012,arg002,arg1013,arg1014,arg1015,arg1016,arg1017,arg1018,arg1019,arg101a,arg101b,arg101c,arg101d,arg101e,arg101f,arg1020,arg1021;
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
     arg10=List.ofArray([Attr.Attr().NewAttr("class","table table-hover hidden"),Attr.Attr().NewAttr("id","segTb")]);
     arg102=List.ofArray([Tags.Tags().text("#")]);
     arg103=List.ofArray([Tags.Tags().text("\u0421 \u0434\u043e\u043a. #")]);
     arg104=List.ofArray([Tags.Tags().text("\u041f\u043e \u0434\u043e\u043a. #")]);
     arg105=List.ofArray([Tags.Tags().text("\u0427\u0438\u0441\u043b\u043e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432")]);
     arg106=List.ofArray([Tags.Tags().text("\u0427\u0438\u0441\u043b\u043e \u043f\u043e\u0437\u0438\u0446\u0438\u0439")]);
     arg107=List.ofArray([Tags.Tags().text("\u0420\u0430\u0437\u043c\u0435\u0440")]);
     arg101=List.ofArray([Tags.Tags().NewTag("th",arg102),Tags.Tags().NewTag("th",arg103),Tags.Tags().NewTag("th",arg104),Tags.Tags().NewTag("th",arg105),Tags.Tags().NewTag("th",arg106),Tags.Tags().NewTag("th",arg107)]);
     segmentsTable=Operators.add(Tags.Tags().NewTag("table",arg10),List.ofArray([Tags.Tags().NewTag("caption",List.ofArray([Tags.Tags().text("\u0418\u043d\u043e\u0444\u0440\u043c\u0430\u0446\u0438\u044f \u043f\u043e \u0441\u0435\u0433\u043c\u0435\u043d\u0442\u0430\u043c")])),Tags.Tags().NewTag("tr",arg101)]));
     cbProcSegments=function(si)
     {
      var arr,idx,s,arg108,arg109,x3,arg10a,x4,arg10b,x5,arg10c,x6,arg10d,x7,arg10e,x8;
      jQuery(".segTbRow").remove();
      jQuery("#segTb").removeClass("hidden");
      arr=si.segs;
      for(idx=0;idx<=arr.length-1;idx++){
       s=Arrays.get(arr,idx);
       arg108=List.ofArray([Attr.Attr().NewAttr("class","segTbRow")]);
       x3=numeral(s.bin).format("0,0");
       arg109=List.ofArray([Tags.Tags().text(x3)]);
       x4=numeral(s.from_doc).format("0,0");
       arg10a=List.ofArray([Tags.Tags().text(x4)]);
       x5=numeral(s.to_doc).format("0,0");
       arg10b=List.ofArray([Tags.Tags().text(x5)]);
       x6=numeral(s.doc_count).format("0,0");
       arg10c=List.ofArray([Tags.Tags().text(x6)]);
       x7=numeral(s.total_count).format("0,0");
       arg10d=List.ofArray([Tags.Tags().text(x7)]);
       x8=numeral(s.data_size).format("0 b");
       arg10e=List.ofArray([Tags.Tags().text(x8)]);
       segmentsTable.AppendI(Operators.add(Tags.Tags().NewTag("tr",arg108),List.ofArray([Tags.Tags().NewTag("td",arg109),Tags.Tags().NewTag("td",arg10a),Tags.Tags().NewTag("td",arg10b),Tags.Tags().NewTag("td",arg10c),Tags.Tags().NewTag("td",arg10d),Tags.Tags().NewTag("td",arg10e)])));
      }
      return;
     };
     cbProcInput=function(ks)
     {
      var enumerator,_,k,arg108,arg109,arg10a,arg10b,x3;
      ksGroup["HtmlProvider@33"].Clear(ksGroup.get_Body());
      enumerator=Enumerator.Get(ks);
      try
      {
       while(enumerator.MoveNext())
        {
         k=enumerator.get_Current();
         arg108=List.ofArray([Attr.Attr().NewAttr("class","radio")]);
         arg10a=List.ofArray([Attr.Attr().NewAttr("class","list-group-item"),Attr.Attr().NewAttr("type","radio"),Attr.Attr().NewAttr("value",k),Attr.Attr().NewAttr("name","ksOption"),Attr.Attr().NewAttr("id","ks_name")]);
         x3=procKSname(k);
         arg10b=List.ofArray([Tags.Tags().text(x3)]);
         arg109=List.ofArray([Tags.Tags().NewTag("input",arg10a),Tags.Tags().NewTag("span",arg10b)]);
         ksGroup.AppendI(Operators.add(Tags.Tags().NewTag("div",arg108),List.ofArray([Tags.Tags().NewTag("label",arg109)])));
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     };
     arg10f=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
     arg1010=List.ofArray([Tags.Tags().text("\u0421\u043f\u0438\u0441\u043e\u043a \u0445\u043e\u0441\u0442\u043e\u0432 \u043a\u043b\u0430\u0441\u0442\u0435\u0440\u0430")]);
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
     hostDiv=Operators.add(Tags.Tags().NewTag("div",arg10f),List.ofArray([Tags.Tags().NewTag("label",arg1010),npsInput]));
     arg1011=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
     arg1012=List.ofArray([Tags.Tags().text("\u041a\u043e\u0434 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430")]);
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
          var sel;
          sel=jQuery("#ks_grp input[type='radio'][name='ksOption']:checked").first().val();
          return Concurrency.Bind(AjaxRemotingProvider.Async("sv2:1",[npsInput.get_Value(),String(sel),codeInput.get_Value()<<0]),function(_arg2)
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
     codeDiv=Operators.add(Tags.Tags().NewTag("div",arg1011),List.ofArray([Tags.Tags().NewTag("label",arg1012),codeInput]));
     arg1013=List.ofArray([Attr.Attr().NewAttr("class","container-fluid")]);
     arg1014=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg1015=List.ofArray([Attr.Attr().NewAttr("class","col-md-12")]);
     arg1016=List.ofArray([Tags.Tags().text("\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0441\u0435\u0433\u043c\u0435\u043d\u0442\u043e\u0432")]);
     arg1017=Runtime.New(T,{
      $:0
     });
     arg1018=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg1019=List.ofArray([Attr.Attr().NewAttr("class","col-md-12")]);
     arg101a=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg101b=List.ofArray([Attr.Attr().NewAttr("class","col-md-12")]);
     arg101c=List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")]);
     arg101d=List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]);
     arg101e=List.ofArray([Tags.Tags().text("\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u0438\u043d\u0434\u0435\u043a\u0441\u044b")]);
     arg101f=List.ofArray([Attr.Attr().NewAttr("class","panel-body")]);
     arg1020=List.ofArray([Attr.Attr().NewAttr("class","row")]);
     arg1021=List.ofArray([Attr.Attr().NewAttr("class","col-md-12")]);
     return Operators.add(Tags.Tags().NewTag("div",arg1013),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1014),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1015),List.ofArray([Tags.Tags().NewTag("h2",arg1016)]))])),Tags.Tags().NewTag("hr",arg1017),Operators.add(Tags.Tags().NewTag("div",arg1018),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1019),List.ofArray([hostDiv]))])),Operators.add(Tags.Tags().NewTag("div",arg101a),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg101b),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg101c),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg101d),List.ofArray([Tags.Tags().NewTag("h4",arg101e)])),Operators.add(Tags.Tags().NewTag("div",arg101f),List.ofArray([ksGroup,codeDiv]))]))]))])),Operators.add(Tags.Tags().NewTag("div",arg1020),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg1021),List.ofArray([segmentsTable]))]))]));
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
  Operators=Runtime.Safe(Client.Operators);
  jQuery=Runtime.Safe(Global.jQuery);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  numeral=Runtime.Safe(Global.numeral);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  String=Runtime.Safe(Global.String);
  T=Runtime.Safe(List.T);
  sv2=Runtime.Safe(Global.sv2);
  return MainView=Runtime.Safe(sv2.MainView);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
