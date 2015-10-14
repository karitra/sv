// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2015 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
		if (typeof b !== "function") return;
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Array,Arrays,Operators,List,Enumerator,T,Enumerable,Seq,Seq1,Arrays1,Ref,AggregateException,Exception,ArgumentException,Number,IndexOutOfRangeException,List1,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,Scheduler,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,HtmlContentExtensions,SingleNode,InvalidOperationException,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,String,RegExp;
 Runtime.Define(Global,{
  Arrays:{
   contains:function(item,arr)
   {
    var c,i,l;
    c=true;
    i=0;
    l=arr.length;
    while(c?i<l:false)
     {
      Unchecked.Equals(arr[i],item)?c=false:i=i+1;
     }
    return!c;
   },
   mapFold:function(f,zero,arr)
   {
    var r,acc,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    for(i=0;i<=arr.length-1;i++){
     patternInput=(f(acc))(Arrays.get(arr,i));
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   mapFoldBack:function(f,arr,zero)
   {
    var r,acc,len,j,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    len=arr.length;
    for(j=1;j<=len;j++){
     i=len-j;
     patternInput=(f(Arrays.get(arr,i)))(acc);
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   sortInPlaceByDescending:function(f,arr)
   {
    return arr.sort(function(x,y)
    {
     return-Operators.Compare(f(x),f(y));
    });
   },
   splitInto:function(count,arr)
   {
    var len,_,count1,res,minChunkSize,startIndex,i,i1;
    count<=0?Operators.FailWith("Count must be positive"):null;
    len=Arrays.length(arr);
    if(len===0)
     {
      _=[];
     }
    else
     {
      count1=Operators.Min(count,len);
      res=Array(count1);
      minChunkSize=len/count1>>0;
      startIndex=0;
      for(i=0;i<=len%count1-1;i++){
       Arrays.set(res,i,Arrays.sub(arr,startIndex,minChunkSize+1));
       startIndex=startIndex+minChunkSize+1;
      }
      for(i1=len%count1;i1<=count1-1;i1++){
       Arrays.set(res,i1,Arrays.sub(arr,startIndex,minChunkSize));
       startIndex=startIndex+minChunkSize;
      }
      _=res;
     }
    return _;
   },
   tryFindBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:Arrays.get(arr,i)
      }:null;
      i=i-1;
     }
    return res;
   },
   tryFindIndexBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:i
      }:null;
      i=i-1;
     }
    return res;
   }
  },
  List:{
   map3:function(f,l1,l2,l3)
   {
    var array;
    array=Arrays.map2(function(func)
    {
     return function(arg1)
     {
      return func(arg1);
     };
    },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
    return List.ofArray(array);
   },
   skip:function(i,l)
   {
    var res,j,_,t;
    res=l;
    for(j=1;j<=i;j++){
     if(res.$==0)
      {
       _=Operators.FailWith("Input list too short.");
      }
     else
      {
       t=res.$1;
       _=res=t;
      }
    }
    return res;
   },
   skipWhile:function(predicate,list)
   {
    var rest;
    rest=list;
    while(!(rest.$==0)?predicate(List.head(rest)):false)
     {
      rest=List.tail(rest);
     }
    return rest;
   }
  },
  Seq:{
   chunkBySize:function(size,s)
   {
    var getEnumerator;
    size<=0?Operators.FailWith("Chunk size must be positive"):null;
    getEnumerator=function()
    {
     var _enum,dispose,next;
     _enum=Enumerator.Get(s);
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,res,value;
      if(_enum.MoveNext())
       {
        res=[_enum.get_Current()];
        while(Arrays.length(res)<size?_enum.MoveNext():false)
         {
          value=res.push(_enum.get_Current());
         }
        e.c=res;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   compareWith:function(f,s1,s2)
   {
    var e1,_,e2,_1,r,loop,matchValue;
    e1=Enumerator.Get(s1);
    try
    {
     e2=Enumerator.Get(s2);
     try
     {
      r=0;
      loop=true;
      while(loop?r===0:false)
       {
        matchValue=[e1.MoveNext(),e2.MoveNext()];
        matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
       }
      _1=r;
     }
     finally
     {
      e2.Dispose!=undefined?e2.Dispose():null;
     }
     _=_1;
    }
    finally
    {
     e1.Dispose!=undefined?e1.Dispose():null;
    }
    return _;
   },
   contains:function(el,s)
   {
    var e,_,r;
    e=Enumerator.Get(s);
    try
    {
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=Unchecked.Equals(e.get_Current(),el);
      }
     _=r;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   countBy:function(f,s)
   {
    var generator;
    generator=function()
    {
     var d,e,_,keys,k,h,_1,mapping,array,x;
     d={};
     e=Enumerator.Get(s);
     try
     {
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _1=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _1=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      _=x;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    };
    return Seq.delay(generator);
   },
   distinct:function(s)
   {
    return Seq1.distinctBy(function(x)
    {
     return x;
    },s);
   },
   distinctBy:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var k,h,cont,_,_1,value;
      k=f(c);
      h=Unchecked.Hash(k);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[k];
        _=true;
       }
      else
       {
        if(Arrays1.contains(k,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(k);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   except:function(itemsToExclude,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,enumerator,_2,i,value1,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var h,cont,_,_1,value;
      h=Unchecked.Hash(c);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[c];
        _=true;
       }
      else
       {
        if(Arrays1.contains(c,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(c);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     enumerator=Enumerator.Get(itemsToExclude);
     try
     {
      while(enumerator.MoveNext())
       {
        i=enumerator.get_Current();
        value1=add(i);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   groupBy:function(f,s)
   {
    return Seq.delay(function()
    {
     var d,d1,keys,e,_,c,k,h;
     d={};
     d1={};
     keys=[];
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      _=Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    });
   },
   insufficient:function()
   {
    return Operators.FailWith("The input sequence has an insufficient number of elements.");
   },
   last:function(s)
   {
    var e,_,value,_1;
    e=Enumerator.Get(s);
    try
    {
     value=e.MoveNext();
     if(!value)
      {
       _1=Seq1.insufficient();
      }
     else
      {
       while(e.MoveNext())
        {
        }
       _1=e.get_Current();
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   nonNegative:function()
   {
    return Operators.FailWith("The input must be non-negative.");
   },
   pairwise:function(s)
   {
    var mapping,source;
    mapping=function(x)
    {
     return[Arrays.get(x,0),Arrays.get(x,1)];
    };
    source=Seq1.windowed(2,s);
    return Seq.map(mapping,source);
   },
   truncate:function(n,s)
   {
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var i;
      i=[0];
      return Seq.enumWhile(function()
      {
       return e.MoveNext()?i[0]<n:false;
      },Seq.delay(function()
      {
       Ref.incr(i);
       return[e.get_Current()];
      }));
     });
    });
   },
   tryHead:function(s)
   {
    var e,_;
    e=Enumerator.Get(s);
    try
    {
     _=e.MoveNext()?{
      $:1,
      $0:e.get_Current()
     }:{
      $:0
     };
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   tryItem:function(i,s)
   {
    var _,j,e,_1,go;
    if(i<0)
     {
      _={
       $:0
      };
     }
    else
     {
      j=0;
      e=Enumerator.Get(s);
      try
      {
       go=true;
       while(go?j<=i:false)
        {
         e.MoveNext()?j=j+1:go=false;
        }
       _1=go?{
        $:1,
        $0:e.get_Current()
       }:{
        $:0
       };
      }
      finally
      {
       e.Dispose!=undefined?e.Dispose():null;
      }
      _=_1;
     }
    return _;
   },
   tryLast:function(s)
   {
    var e,_,_1;
    e=Enumerator.Get(s);
    try
    {
     if(e.MoveNext())
      {
       while(e.MoveNext())
        {
        }
       _1={
        $:1,
        $0:e.get_Current()
       };
      }
     else
      {
       _1={
        $:0
       };
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   unfold:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var next;
     next=function(e)
     {
      var matchValue,_,t,s1;
      matchValue=f(e.s);
      if(matchValue.$==0)
       {
        _=false;
       }
      else
       {
        t=matchValue.$0[0];
        s1=matchValue.$0[1];
        e.c=t;
        e.s=s1;
        _=true;
       }
      return _;
     };
     return T.New(s,null,next,function()
     {
     });
    };
    return Enumerable.Of(getEnumerator);
   },
   windowed:function(windowSize,s)
   {
    windowSize<=0?Operators.FailWith("The input must be positive."):null;
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var q;
      q=[];
      return Seq.append(Seq.enumWhile(function()
      {
       return q.length<windowSize?e.MoveNext():false;
      },Seq.delay(function()
      {
       q.push(e.get_Current());
       return Seq.empty();
      })),Seq.delay(function()
      {
       return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
       {
        return Seq.enumWhile(function()
        {
         return e.MoveNext();
        },Seq.delay(function()
        {
         q.shift();
         q.push(e.get_Current());
         return[q.slice(0)];
        }));
       })):Seq.empty();
      }));
     });
    });
   }
  },
  WebSharper:{
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    chunkBySize:function(size,array)
    {
     var source;
     source=Seq1.chunkBySize(size,array);
     return Seq.toArray(source);
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    compareWith:function(f,a1,a2)
    {
     return Seq1.compareWith(f,a1,a2);
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    contains:function(el,a)
    {
     return Seq1.contains(el,a);
    },
    countBy:function(f,a)
    {
     var source;
     source=Seq1.countBy(f,a);
     return Seq.toArray(source);
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toArray(source);
    },
    distinctBy:function(f,a)
    {
     var source;
     source=Seq1.distinctBy(f,a);
     return Seq.toArray(source);
    },
    exactlyOne:function(ar)
    {
     return Arrays.length(ar)===1?Arrays.get(ar,0):Operators.FailWith("The input does not have precisely one element.");
    },
    except:function(itemsToExclude,a)
    {
     var source;
     source=Seq1.except(itemsToExclude,a);
     return Seq.toArray(source);
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    groupBy:function(f,a)
    {
     var mapping,source,array;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toArray(s)];
     };
     source=Seq1.groupBy(f,a);
     array=Seq.toArray(source);
     return Arrays.map(mapping,array);
    },
    head:function(ar)
    {
     return List.head(List.ofArray(ar));
    },
    indexed:function(ar)
    {
     return Arrays.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },ar);
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    last:function(ar)
    {
     return Seq1.last(ar);
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    map3:function(f,l1,l2,l3)
    {
     var list;
     list=List1.map3(f,List.ofArray(l1),List.ofArray(l2),List.ofArray(l3));
     return Arrays.ofSeq(list);
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum,_;
     q=[];
     _enum=Enumerator.Get(xs);
     try
     {
      while(_enum.MoveNext())
       {
        q.push(_enum.get_Current());
       }
      _=q;
     }
     finally
     {
      _enum.Dispose!=undefined?_enum.Dispose():null;
     }
     return _;
    },
    pairwise:function(a)
    {
     var source;
     source=Seq1.pairwise(a);
     return Seq.toArray(source);
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    replicate:function(size,value)
    {
     return Arrays.create(size,value);
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    skip:function(i,ar)
    {
     return i<0?Seq1.nonNegative():i>Arrays.length(ar)?Seq1.insufficient():ar.slice(i);
    },
    skipWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(i);
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortByDescending:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return-Operators.Compare(f(x),f(y));
     });
    },
    sortDescending:function(arr)
    {
     return Arrays.sortByDescending(function(x)
     {
      return x;
     },arr);
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    splitAt:function(n,ar)
    {
     return[Arrays.take(n,ar),Arrays.skip(n,ar)];
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tail:function(ar)
    {
     return Arrays.skip(1,ar);
    },
    take:function(n,ar)
    {
     return n<0?Seq1.nonNegative():n>Arrays.length(ar)?Seq1.insufficient():ar.slice(0,n);
    },
    takeWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(0,i);
    },
    truncate:function(n,ar)
    {
     return ar.slice(n);
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryHead:function(arr)
    {
     return Arrays.length(arr)===0?{
      $:0
     }:{
      $:1,
      $0:arr[0]
     };
    },
    tryItem:function(i,arr)
    {
     return(Arrays.length(arr)<=i?true:i<0)?{
      $:0
     }:{
      $:1,
      $0:arr[i]
     };
    },
    tryLast:function(arr)
    {
     var len;
     len=Arrays.length(arr);
     return len===0?{
      $:0
     }:{
      $:1,
      $0:arr[len-1]
     };
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toArray(source);
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    windowed:function(windowSize,s)
    {
     var source;
     source=Seq1.windowed(windowSize,s);
     return Seq.toArray(source);
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        Lazy.Force(sub1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     return Concurrency.Using(Enumerator.Get(s),function(ie)
     {
      return Concurrency.While(function()
      {
       return ie.MoveNext();
      },Concurrency.Delay(function()
      {
       return b(ie.get_Current());
      }));
     });
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r)
    {
     var r1;
     r1=function(c)
     {
      var cached,queue,action,r2,r21;
      cached=[{
       $:0
      }];
      queue=[];
      action=function()
      {
       return r({
        k:function(res)
        {
         cached[0]={
          $:1,
          $0:res
         };
         while(queue.length>0)
          {
           (queue.shift())(res);
          }
         return;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r2=function(c2)
      {
       var matchValue,_,x;
       matchValue=cached[0];
       if(matchValue.$==0)
        {
         _=queue.push(c2.k);
        }
       else
        {
         x=matchValue.$0;
         _=c2.k.call(null,x);
        }
       return _;
      };
      r21=Concurrency.checkCancel(r2);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    LongDate:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleDateString({},{
      year:"numeric",
      month:"long",
      day:"numeric",
      weekday:"long"
     });
    },
    LongTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hour12:false
     });
    },
    Parse:function(s)
    {
     var d;
     d=Date.parse(s);
     return Global.isNaN(d)?Operators.FailWith("Failed to parse date string."):d;
    },
    ShortTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
     });
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     Dispose:function()
     {
      return this.d.call(null,this);
     },
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n,d)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      r.d=d;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   Html:{
    Client:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var _,meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         _=meta?jQuery(document).ready(function()
         {
          var text,obj,action,array;
          text=meta.getAttribute("content");
          obj=Json.Activate(JSON.parse(text));
          action=function(tupledArg)
          {
           var k,v,p,old;
           k=tupledArg[0];
           v=tupledArg[1];
           p=v.get_Body();
           old=document.getElementById(k);
           return p.ReplaceInDom(old);
          };
          array=JSModule.GetFields(obj);
          return Arrays.iter(action,array);
         }):null;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
     },
     HtmlContentExtensions:{
      "IControlBody.SingleNode.Static":function(node)
      {
       return SingleNode.New(node);
      },
      SingleNode:Runtime.Class({
       ReplaceInDom:function(old)
       {
        var value;
        value=this.node.parentNode.replaceChild(this.node,old);
        return;
       }
      },{
       New:function(node)
       {
        var r;
        r=Runtime.New(this,{});
        r.node=node;
        return r;
       }
      })
     }
    }
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,_,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      try
      {
       while(enumerator.MoveNext())
        {
         forLoopVar=enumerator.get_Current();
         v=forLoopVar[1];
         k=forLoopVar[0];
         r[k]=v;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      },function()
      {
      });
     },
     GetSlice:function(start,finish)
     {
      var matchValue,_,_1,i,j,count,source,source1,i1,_2,j1,count1,source2;
      matchValue=[start,finish];
      if(matchValue[0].$==1)
       {
        if(matchValue[1].$==1)
         {
          i=matchValue[0].$0;
          j=matchValue[1].$0;
          count=j-i+1;
          source=List1.skip(i,this);
          source1=Seq.take(count,source);
          _1=List.ofSeq(source1);
         }
        else
         {
          i1=matchValue[0].$0;
          _1=List1.skip(i1,this);
         }
        _=_1;
       }
      else
       {
        if(matchValue[1].$==1)
         {
          j1=matchValue[1].$0;
          count1=j1+1;
          source2=Seq.take(count1,this);
          _2=List.ofSeq(source2);
         }
        else
         {
          _2=this;
         }
        _=_2;
       }
      return _;
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    },{
     Construct:function(head,tail)
     {
      return Runtime.New(T1,{
       $:1,
       $0:head,
       $1:tail
      });
     },
     get_Nil:function()
     {
      return Runtime.New(T1,{
       $:0
      });
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    chunkBySize:function(size,list)
    {
     var mapping,source,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.chunkBySize(size,list);
     list1=Seq.toList(source);
     return List.map(mapping,list1);
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    compareWith:function(f,l1,l2)
    {
     return Seq1.compareWith(f,l1,l2);
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    contains:function(el,l)
    {
     return Seq1.contains(el,l);
    },
    countBy:function(f,l)
    {
     var source;
     source=Seq1.countBy(f,l);
     return Seq.toList(source);
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toList(source);
    },
    distinctBy:function(f,l)
    {
     var source;
     source=Seq1.distinctBy(f,l);
     return Seq.toList(source);
    },
    exactlyOne:function(list)
    {
     var _,_1,head;
     if(list.$==1)
      {
       if(list.$1.$==0)
        {
         head=list.$0;
         _1=head;
        }
       else
        {
         _1=Operators.FailWith("The input does not have precisely one element.");
        }
       _=_1;
      }
     else
      {
       _=Operators.FailWith("The input does not have precisely one element.");
      }
     return _;
    },
    except:function(itemsToExclude,l)
    {
     var source;
     source=Seq1.except(itemsToExclude,l);
     return Seq.toList(source);
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=List.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    groupBy:function(f,l)
    {
     var mapping,source,list;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toList(s)];
     };
     source=Seq1.groupBy(f,l);
     list=Seq.toList(source);
     return List.map(mapping,list);
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    indexed:function(list)
    {
     return List.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },list);
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    last:function(list)
    {
     return Seq1.last(list);
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    mapFold:function(f,zero,list)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Arrays.ofSeq(list));
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapFoldBack:function(f,list,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Arrays.ofSeq(list),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var res,last,e,_,next;
     res=Runtime.New(T1,{
      $:0
     });
     last=res;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        last.$=1;
        next=Runtime.New(T1,{
         $:0
        });
        last.$0=e.get_Current();
        last.$1=next;
        last=next;
       }
      last.$=0;
      _=res;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    pairwise:function(l)
    {
     var source;
     source=Seq1.pairwise(l);
     return Seq.toList(source);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    singleton:function(x)
    {
     return List.ofArray([x]);
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortByDescending:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return-Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortDescending:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays1.sortInPlaceByDescending(function(x)
     {
      return x;
     },a);
     return List.ofArray(a);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    splitAt:function(n,list)
    {
     return[List.ofSeq(Seq.take(n,list)),List1.skip(n,list)];
    },
    splitInto:function(count,list)
    {
     var mapping,array1,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     array1=Arrays1.splitInto(count,Arrays.ofSeq(list));
     list1=List.ofArray(array1);
     return List.map(mapping,list1);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    tryFindBack:function(ok,l)
    {
     return Arrays1.tryFindBack(ok,Arrays.ofSeq(l));
    },
    tryHead:function(list)
    {
     var _,head;
     if(list.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       head=list.$0;
       _={
        $:1,
        $0:head
       };
      }
     return _;
    },
    tryItem:function(n,list)
    {
     return Seq1.tryItem(n,list);
    },
    tryLast:function(list)
    {
     return Seq1.tryLast(list);
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toList(source);
    },
    unzip:function(l)
    {
     var x,y,enumerator,_,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,_,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        c=forLoopVar[2];
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
        z.push(c);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    windowed:function(windowSize,s)
    {
     var mapping,source,source1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.windowed(windowSize,s);
     source1=Seq.map(mapping,source);
     return Seq.toList(source1);
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   Nullable:{
    get:function(x)
    {
     return x==null?Operators.FailWith("Nullable object must have a value."):x;
    },
    getOrValue:function(x,v)
    {
     return x==null?v:x;
    }
   },
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     var count;
     count=1+max-min;
     return count<=0?Seq.empty():Seq.init(count,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    filter:function(f,o)
    {
     var _,v;
     if(o.$==1)
      {
       v=o.$0;
       _=f(v)?{
        $:1,
        $0:v
       }:{
        $:0
       };
      }
     else
      {
       _={
        $:0
       };
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    ofObj:function(o)
    {
     return o==null?{
      $:0
     }:{
      $:1,
      $0:o
     };
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    },
    toObj:function(o)
    {
     var _,v;
     if(o.$==0)
      {
      }
     else
      {
       v=o.$0;
       _=v;
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err,function()
      {
       return Remoting.ajax(true,url,headers,data,ok,err,undefined);
      });
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      },function()
      {
       return Remoting.ajax(false,url,headers,data,function(x)
       {
        res[0]=x;
       },function(e)
       {
        return Operators.Raise(e);
       },undefined);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err,$csrf)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     var csrf=Global.document.cookie.replace(new Global.RegExp("(?:(?:^|.*;)\\s*csrftoken\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1");
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     if(csrf)
      {
       xhr.setRequestHeader("x-csrftoken",csrf);
      }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       if($csrf&&xhr.status==403&&xhr.responseText=="CSRF")
        {
         $csrf();
        }
       else
        {
         var msg="Response status is not 200: ";
         $err(new Global.Error(msg+xhr.status));
        }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1,first;
      e1=Enumerator.Get(s1);
      first=[true];
      return T.New(e1,null,function(x)
      {
       var _,x1,_1,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         x1=x.s;
         !Unchecked.Equals(x1,null)?x1.Dispose():null;
         x.s=null;
         if(first[0])
          {
           first[0]=false;
           x.s=Enumerator.Get(s2);
           if(x.s.MoveNext())
            {
             x.c=x.s.get_Current();
             _2=true;
            }
           else
            {
             x.s.Dispose();
             x.s=null;
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      },function(x)
      {
       var x1;
       x1=x.s;
       return!Unchecked.Equals(x1,null)?x1.Dispose():null;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=[Enumerator.Get(s)];
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,en,_1,_2;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         en=_enum[0];
         if(Unchecked.Equals(en,null))
          {
           _1=false;
          }
         else
          {
           if(en.MoveNext())
            {
             e.s=e.s+1;
             e.c=en.get_Current();
             cache.push(e.get_Current());
             _2=true;
            }
           else
            {
             en.Dispose();
             _enum[0]=null;
             _2=false;
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           outerE.Dispose();
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.Dispose();
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(st)
      {
       var x;
       x=st.s;
       !Unchecked.Equals(x,null)?x.Dispose():null;
       return!Unchecked.Equals(outerE,null)?outerE.Dispose():null;
      });
     });
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e)
      {
       f(null);
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return f(null);
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumUsing:function(x,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(f(x));
      }
      catch(e)
      {
       x.Dispose();
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return x.Dispose();
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,_1,_2;
       matchValue=en.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(f(null))
          {
           en.s=Enumerator.Get(s);
           _1=next(en);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           en.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           matchValue.Dispose();
           en.s=null;
           _2=next(en);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(en)
      {
       var x;
       x=en.s;
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    exists:function(p,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r=false;
      while(!r?e.MoveNext():false)
       {
        r=p(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    exists2:function(p,s1,s2)
    {
     var e1,_,e2,_1,r;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       r=false;
       while((!r?e1.MoveNext():false)?e2.MoveNext():false)
        {
         r=(p(e1.get_Current()))(e2.get_Current());
        }
       _1=r;
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,dispose,next;
      _enum=Enumerator.Get(s);
      dispose=function()
      {
       return _enum.Dispose();
      };
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e,_;
     r=x;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    fold2:function(f,s,s1,s2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    foldBack:function(f,s,state)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(s),state);
    },
    foldBack2:function(f,s1,s2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2),s);
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    head:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=e.MoveNext()?e.get_Current():Seq1.insufficient();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    indexed:function(s)
    {
     return Seq.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },s);
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    isEmpty:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=!e.MoveNext();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,_,e2,_1;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       while(e1.MoveNext()?e2.MoveNext():false)
        {
         (p(e1.get_Current()))(e2.get_Current());
        }
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    iteri:function(p,s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        (p(i))(e.get_Current());
        i=i+1;
       }
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iteri2:function(f,s1,s2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    length:function(s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        i=i+1;
       }
      _=i;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      dispose=function()
      {
       e1.Dispose();
       return e2.Dispose();
      };
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map3:function(f,s1,s2,s3)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,e3,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      e3=Enumerator.Get(s3);
      dispose=function()
      {
       e1.Dispose();
       e2.Dispose();
       return e3.Dispose();
      };
      next=function(e)
      {
       var _;
       if((e1.MoveNext()?e2.MoveNext():false)?e3.MoveNext():false)
        {
         e.c=((f(e1.get_Current()))(e2.get_Current()))(e3.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapFold:function(f,zero,s)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Seq.toArray(s));
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapFoldBack:function(f,s,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Seq.toArray(s),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapi:function(f,s)
    {
     return Seq.map2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     return Seq.map3(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s1,s2);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e,_;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     try
     {
      while(pos<index)
       {
        !e.MoveNext()?Seq1.insufficient():null;
        pos=pos+1;
       }
      _=e.get_Current();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    permute:function(f,s)
    {
     return Seq.delay(function()
     {
      return Arrays.permute(f,Arrays.ofSeq(s));
     });
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,_,r;
     e=Enumerator.Get(source);
     try
     {
      !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
      r=e.get_Current();
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    reduceBack:function(f,s)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(s));
    },
    replicate:function(size,value)
    {
     size<0?Seq1.nonNegative():null;
     return Seq.delay(function()
     {
      return Seq.map(function()
      {
       return value;
      },Operators.range(0,size-1));
     });
    },
    rev:function(s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Seq.toArray(s).slice().reverse();
      return array;
     });
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    scanBack:function(f,l,s)
    {
     return Seq.delay(function()
     {
      return Arrays.scanBack(f,Arrays.ofSeq(l),s);
     });
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,i,_1;
       if(e.s)
        {
         for(i=1;i<=n;i++){
          !_enum.MoveNext()?Seq1.insufficient():null;
         }
         _=void(e.s=false);
        }
       else
        {
         _=null;
        }
       if(_enum.MoveNext())
        {
         e.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,go,empty,_1,_2,_3;
       if(e.s)
        {
         go=true;
         empty=false;
         while(go)
          {
           if(_enum.MoveNext())
            {
             _1=!f(_enum.get_Current())?go=false:null;
            }
           else
            {
             go=false;
             _1=empty=true;
            }
          }
         e.s=false;
         if(empty)
          {
           _2=false;
          }
         else
          {
           e.c=_enum.get_Current();
           _2=true;
          }
         _=_2;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.c=_enum.get_Current();
           _3=true;
          }
         else
          {
           _3=false;
          }
         _=_3;
        }
       return _;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sortByDescending:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays1.sortInPlaceByDescending(f,array);
      return array;
     });
    },
    sortDescending:function(s)
    {
     return Seq.sortByDescending(function(x)
     {
      return x;
     },s);
    },
    sortWith:function(f,s)
    {
     return Seq.delay(function()
     {
      var a;
      a=Arrays.ofSeq(s);
      Arrays.sortInPlaceWith(f,a);
      return a;
     });
    },
    splitInto:function(count,s)
    {
     count<=0?Operators.FailWith("Count must be positive"):null;
     return Seq.delay(function()
     {
      var source;
      source=Arrays1.splitInto(count,Arrays.ofSeq(s));
      return source;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    tail:function(s)
    {
     return Seq.skip(1,s);
    },
    take:function(n,s)
    {
     n<0?Seq1.nonNegative():null;
     return Enumerable.Of(function()
     {
      var e;
      e=[Enumerator.Get(s)];
      return T.New(0,null,function(_enum)
      {
       var _,en,_1,_2,_3;
       _enum.s=_enum.s+1;
       if(_enum.s>n)
        {
         _=false;
        }
       else
        {
         en=e[0];
         if(Unchecked.Equals(en,null))
          {
           _1=Seq1.insufficient();
          }
         else
          {
           if(en.MoveNext())
            {
             _enum.c=en.get_Current();
             if(_enum.s===n)
              {
               en.Dispose();
               _3=void(e[0]=null);
              }
             else
              {
               _3=null;
              }
             _2=true;
            }
           else
            {
             en.Dispose();
             e[0]=null;
             _2=Seq1.insufficient();
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      },function()
      {
       var x;
       x=e[0];
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,_,e;
     q=[];
     enumerator=Enumerator.Get(s);
     try
     {
      while(enumerator.MoveNext())
       {
        e=enumerator.get_Current();
        q.push(e);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    tryFind:function(ok,s)
    {
     var e,_,r,x;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(r.$==0?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?r={
         $:1,
         $0:x
        }:null;
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryFindIndex:function(ok,s)
    {
     var e,_,loop,i,x;
     e=Enumerator.Get(s);
     try
     {
      loop=true;
      i=0;
      while(loop?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?loop=false:i=i+1;
       }
      _=loop?{
       $:0
      }:{
       $:1,
       $0:i
      };
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryPick:function(f,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(Unchecked.Equals(r,{
       $:0
      })?e.MoveNext():false)
       {
        r=f(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    zip:function(s1,s2)
    {
     return Seq.map2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.map2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    Filter:function(f,s)
    {
     var chooser,source;
     chooser=function(c)
     {
      return f(c)?{
       $:1,
       $0:String.fromCharCode(c)
      }:{
       $:0
      };
     };
     source=Seq.choose(chooser,s);
     return Arrays.ofSeq(source).join("");
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s:$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?$s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c)):$s;
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   Unchecked:{
    Compare:function(a,b)
    {
     var objCompare,_2,matchValue,_3,matchValue1;
     objCompare=function(a1)
     {
      return function(b1)
      {
       var cmp;
       cmp=[0];
       JSModule.ForEach(a1,function(k)
       {
        var _,_1;
        if(!a1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!b1.hasOwnProperty(k))
           {
            cmp[0]=1;
            _1=true;
           }
          else
           {
            cmp[0]=Unchecked.Compare(a1[k],b1[k]);
            _1=cmp[0]!==0;
           }
          _=_1;
         }
        return _;
       });
       cmp[0]===0?JSModule.ForEach(b1,function(k)
       {
        var _,_1;
        if(!b1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!a1.hasOwnProperty(k))
           {
            cmp[0]=-1;
            _1=true;
           }
          else
           {
            _1=false;
           }
          _=_1;
         }
        return _;
       }):null;
       return cmp[0];
      };
     };
     if(a===b)
      {
       _2=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="function")
        {
         _3=Operators.FailWith("Cannot compare function values.");
        }
       else
        {
         if(matchValue==="boolean")
          {
           _3=a<b?-1:1;
          }
         else
          {
           if(matchValue==="number")
            {
             _3=a<b?-1:1;
            }
           else
            {
             if(matchValue==="string")
              {
               _3=a<b?-1:1;
              }
             else
              {
               if(matchValue==="object")
                {
                 _3=a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):(objCompare(a))(b);
                }
               else
                {
                 matchValue1=typeof b;
                 _3=matchValue1==="undefined"?0:-1;
                }
              }
            }
          }
        }
       _2=_3;
      }
     return _2;
    },
    Equals:function(a,b)
    {
     var objEquals,_,matchValue;
     objEquals=function(a1)
     {
      return function(b1)
      {
       var eqR;
       eqR=[true];
       JSModule.ForEach(a1,function(k)
       {
        eqR[0]=!a1.hasOwnProperty(k)?true:b1.hasOwnProperty(k)?Unchecked.Equals(a1[k],b1[k]):false;
        return!eqR[0];
       });
       eqR[0]?JSModule.ForEach(b1,function(k)
       {
        eqR[0]=!b1.hasOwnProperty(k)?true:a1.hasOwnProperty(k);
        return!eqR[0];
       }):null;
       return eqR[0];
      };
     };
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?(((a===null?true:a===undefined)?true:b===null)?true:b===undefined)?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):(objEquals(a))(b):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Array=Runtime.Safe(Global.Array);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  List=Runtime.Safe(Global.WebSharper.List);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  T=Runtime.Safe(Enumerator.T);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Seq1=Runtime.Safe(Global.Seq);
  Arrays1=Runtime.Safe(Global.Arrays);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  List1=Runtime.Safe(Global.List);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Activator.Activate();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,_,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).bind(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).bind(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function(ev)
        {
         return(f(el))(ev);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).prop(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,_,pl;
       enumerator=Enumerator.Get(inner);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,_,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Json,Encode,Date,List,Arrays,Unchecked,Operators,Collections,FSharpSet,BalancedTree,Dictionary,JavaScript,JSModule,FSharpMap,Seq,Enumerator,MapModule,window;
 Runtime.Define(Global,{
  WebSharper:{
   Json:{
    Decode:{
     Array:function(decEl)
     {
      return Encode.Array(decEl);
     },
     DateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).getTime();
       };
      };
     },
     List:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return List.init(Arrays.length(a),function(i)
        {
         return decEl1(Arrays.get(a,i));
        });
       };
      };
     },
     Record:function(t,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o=t===undefined?{}:new t();
        action=function(tupledArg)
        {
         var name,dec,kind;
         name=tupledArg[0];
         dec=tupledArg[1];
         kind=tupledArg[2];
         return Unchecked.Equals(kind,0)?void(o[name]=(dec(null))(x[name])):Unchecked.Equals(kind,1)?void(o[name]=x.hasOwnProperty(name)?{
          $:1,
          $0:(dec(null))(x[name])
         }:{
          $:0
         }):Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(dec(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     Set:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return FSharpSet.New1(BalancedTree.OfSeq(Arrays.map(decEl1,a)));
       };
      };
     },
     StringDictionary:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var d;
        d=Dictionary.New12();
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         d.set_Item(k,o[k]);
         return false;
        });
        return d;
       };
      };
     },
     StringMap:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var m;
        m=[FSharpMap.New1([])];
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         m[0]=m[0].Add(k,o[k]);
         return false;
        });
        return m[0];
       };
      };
     },
     Tuple:function(decs)
     {
      return Encode.Tuple(decs);
     },
     Union:function(t,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,_1,tagName,predicate,r,tuple,x1,action;
        if(typeof x==="object")
         {
          o=t===undefined?{}:new t();
          if(Unchecked.Equals(typeof discr,"string"))
           {
            tagName=x[discr];
            predicate=function(tupledArg)
            {
             var name;
             name=tupledArg[0];
             tupledArg[1];
             return name===tagName;
            };
            _1=Arrays.findINdex(predicate,cases);
           }
          else
           {
            r=[undefined];
            JSModule.ForEach(discr,function(k)
            {
             var _2;
             if(x.hasOwnProperty(k))
              {
               r[0]=discr[k];
               _2=true;
              }
             else
              {
               _2=false;
              }
             return _2;
            });
            _1=r[0];
           }
          tag=_1;
          o.$=tag;
          tuple=Arrays.get(cases,tag);
          x1=tuple[1];
          action=function(tupledArg)
          {
           var from,to,dec,kind;
           from=tupledArg[0];
           to=tupledArg[1];
           dec=tupledArg[2];
           kind=tupledArg[3];
           return from===null?void(o.$0=(dec(null))(x)):Unchecked.Equals(kind,0)?void(o[from]=(dec(null))(x[to])):Unchecked.Equals(kind,1)?void(o[from]=x.hasOwnProperty(to)?{
            $:1,
            $0:(dec(null))(x[to])
           }:{
            $:0
           }):Operators.FailWith("Invalid field option kind");
          };
          Arrays.iter(action,x1);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     }
    },
    Encode:{
     Array:function(encEl)
     {
      return function()
      {
       return function(a)
       {
        var encEl1;
        encEl1=encEl(null);
        return Arrays.map(encEl1,a);
       };
      };
     },
     DateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).toISOString();
       };
      };
     },
     Id:function()
     {
      return function(x)
      {
       return x;
      };
     },
     List:function(encEl)
     {
      return function()
      {
       return function(l)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,l);
        return a;
       };
      };
     },
     Record:function(_arg1,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o={};
        action=function(tupledArg)
        {
         var name,enc,kind,_,matchValue,_1,x1;
         name=tupledArg[0];
         enc=tupledArg[1];
         kind=tupledArg[2];
         if(Unchecked.Equals(kind,0))
          {
           _=void(o[name]=(enc(null))(x[name]));
          }
         else
          {
           if(Unchecked.Equals(kind,1))
            {
             matchValue=x[name];
             if(matchValue.$==0)
              {
               _1=null;
              }
             else
              {
               x1=matchValue.$0;
               _1=void(o[name]=(enc(null))(x1));
              }
             _=_1;
            }
           else
            {
             _=Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(enc(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
            }
          }
         return _;
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     Set:function(encEl)
     {
      return function()
      {
       return function(s)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,s);
        return a;
       };
      };
     },
     StringDictionary:function(encEl)
     {
      return function()
      {
       return function(d)
       {
        var o,encEl1,enumerator,_,forLoopVar,activePatternResult,v,k;
        o={};
        encEl1=encEl(null);
        enumerator=Enumerator.Get(d);
        try
        {
         while(enumerator.MoveNext())
          {
           forLoopVar=enumerator.get_Current();
           activePatternResult=Operators.KeyValue(forLoopVar);
           v=activePatternResult[1];
           k=activePatternResult[0];
           o[k]=encEl1(v);
          }
        }
        finally
        {
         enumerator.Dispose!=undefined?enumerator.Dispose():null;
        }
        return o;
       };
      };
     },
     StringMap:function(encEl)
     {
      return function()
      {
       return function(m)
       {
        var o,encEl1,action;
        o={};
        encEl1=encEl(null);
        action=function(k)
        {
         return function(v)
         {
          o[k]=encEl1(v);
         };
        };
        MapModule.Iterate(action,m);
        return o;
       };
      };
     },
     Tuple:function(encs)
     {
      return function()
      {
       return function(args)
       {
        return Arrays.map2(function(f)
        {
         return function(x)
         {
          return(f(null))(x);
         };
        },encs,args);
       };
      };
     },
     Union:function(_arg1,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,patternInput,tagName,fields,action;
        if(typeof x==="object")
         {
          o={};
          tag=x.$;
          patternInput=Arrays.get(cases,tag);
          tagName=patternInput[0];
          fields=patternInput[1];
          Unchecked.Equals(typeof discr,"string")?void(o[discr]=tagName):null;
          action=function(tupledArg)
          {
           var from,to,enc,kind,_1,record,_2,matchValue,_3,x1;
           from=tupledArg[0];
           to=tupledArg[1];
           enc=tupledArg[2];
           kind=tupledArg[3];
           if(from===null)
            {
             record=(enc(null))(x.$0);
             _1=JSModule.ForEach(record,function(f)
             {
              o[f]=record[f];
              return false;
             });
            }
           else
            {
             if(Unchecked.Equals(kind,0))
              {
               _2=void(o[to]=(enc(null))(x[from]));
              }
             else
              {
               if(Unchecked.Equals(kind,1))
                {
                 matchValue=x[from];
                 if(matchValue.$==0)
                  {
                   _3=null;
                  }
                 else
                  {
                   x1=matchValue.$0;
                   _3=void(o[to]=(enc(null))(x1));
                  }
                 _2=_3;
                }
               else
                {
                 _2=Operators.FailWith("Invalid field option kind");
                }
              }
             _1=_2;
            }
           return _1;
          };
          Arrays.iter(action,fields);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     }
    }
   },
   Web:{
    InlineControl:Runtime.Class({
     get_Body:function()
     {
      var f;
      f=Arrays.fold(function(obj)
      {
       return function(field)
       {
        return obj[field];
       };
      },window,this.funcName);
      return f.apply(null,this.args);
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  Json=Runtime.Safe(Global.WebSharper.Json);
  Encode=Runtime.Safe(Json.Encode);
  Date=Runtime.Safe(Global.Date);
  List=Runtime.Safe(Global.WebSharper.List);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  MapModule=Runtime.Safe(Collections.MapModule);
  return window=Runtime.Safe(Global.window);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,Seq1,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq1.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq1.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq1.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,_,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         x1=x.K;
         r.data[r.hash.call(null,x1)]=x.V;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq1.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq1.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq1.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq1.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq1.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq1.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Remove(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq1.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,_,item,_1,value,value1;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         if(this.Contains(item))
          {
           value=this.Remove(item);
           _1=void value;
          }
         else
          {
           value1=this.Add(item);
           _1=void value1;
          }
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     UnionWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Add(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,_,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         value=r.add(x);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq1.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq1.filter(predicate,source);
      data=Seq1.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq1.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq1.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq1.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq1.toArray(Seq1.delay(function()
      {
       return Seq1.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq1.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq1.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq1.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq1.toArray(Seq1.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq1.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq1.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq1.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  Seq1=Runtime.Safe(Global.WebSharper.Seq);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Concurrency,Array,Seq,Arrays,UI,Next,Abbrev,Fresh,Collections,HashSetProxy,HashSet,JQueue,Slot1,Unchecked,An,AppendList1,Anims,window,Lazy,Array1,Trans,Option,View,Client,Attrs,DomUtility,AttrProxy,List,Attr,AnimatedAttrNode,DynamicAttrNode,document,Docs,View1,Mailbox,Doc,UINextPagelet,Elt,Seq1,Operators,NodeSet,DocElemNode,DomNodes,Var1,Var,RegExp,Html,Client1,Pagelet,Attr1,Tags,jQuery,Easing,Easings,FlowBuilder,Flow,Input,T,DoubleInterpolation,Key,ListModels,RefImpl1,ListModel,Model1,Model,Strings,encodeURIComponent,decodeURIComponent,Route,Routing,Router1,Trie1,Dictionary,Snap1,Async,Submitter,Enumerator,ResizeArray,ResizeArrayProxy,MapModule,FSharpMap,RefImpl;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     Abbrev:{
      Async:{
       Schedule:function(f)
       {
        return Concurrency.Start(Concurrency.Delay(function()
        {
         return Concurrency.Return(f(null));
        }),{
         $:0
        });
       },
       StartTo:function(comp,k)
       {
        return Concurrency.StartWithContinuations(comp,k,function()
        {
        },function()
        {
        },{
         $:0
        });
       }
      },
      Dict:{
       ToKeyArray:function(d)
       {
        var arr;
        arr=Array(d.count);
        Seq.iteri(function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.K);
         };
        },d);
        return arr;
       },
       ToValueArray:function(d)
       {
        var arr;
        arr=Array(d.count);
        Seq.iteri(function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.V);
         };
        },d);
        return arr;
       }
      },
      Fresh:{
       Id:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return"uid"+Global.String(Fresh.counter());
       },
       Int:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return Fresh.counter();
       },
       counter:Runtime.Field(function()
       {
        return 0;
       })
      },
      HashSet:{
       Except:function(excluded,included)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(included));
        set.ExceptWith(HashSet.ToArray(excluded));
        return set;
       },
       Filter:function(ok,set)
       {
        return HashSetProxy.New(Arrays.filter(ok,HashSet.ToArray(set)));
       },
       Intersect:function(a,b)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(a));
        set.IntersectWith(HashSet.ToArray(b));
        return set;
       },
       ToArray:function(set)
       {
        var arr;
        arr=Array(set.get_Count());
        set.CopyTo(arr);
        return arr;
       }
      },
      JQueue:{
       Add:function($x,$q)
       {
        var $0=this,$this=this;
        return $q.push($x);
       },
       Count:function(q)
       {
        return q.length;
       },
       Dequeue:function($q)
       {
        var $0=this,$this=this;
        return $q.shift();
       },
       Iter:function(f,q)
       {
        return Arrays.iter(f,JQueue.ToArray(q));
       },
       ToArray:function(q)
       {
        return q.slice();
       }
      },
      Mailbox:{
       StartProcessor:function(proc)
       {
        var mail,isActive,work;
        mail=[];
        isActive=[false];
        work=Concurrency.Delay(function()
        {
         return Concurrency.Combine(Concurrency.While(function()
         {
          return JQueue.Count(mail)>0;
         },Concurrency.Delay(function()
         {
          return Concurrency.Bind(proc(JQueue.Dequeue(mail)),function()
          {
           return Concurrency.Return(null);
          });
         })),Concurrency.Delay(function()
         {
          return Concurrency.Return(void(isActive[0]=false));
         }));
        });
        return function(msg)
        {
         JQueue.Add(msg,mail);
         if(!isActive[0])
          {
           isActive[0]=true;
           return Concurrency.Start(work,{
            $:0
           });
          }
         else
          {
           return null;
          }
        };
       }
      },
      Slot:Runtime.Class({},{
       Create:function(key,value)
       {
        return Slot1.New(key,value);
       }
      }),
      Slot1:Runtime.Class({
       Equals:function(o)
       {
        return Unchecked.Equals(this.key.call(null,this.value),this.key.call(null,o.get_Value()));
       },
       GetHashCode:function()
       {
        return Unchecked.Hash(this.key.call(null,this.value));
       },
       get_Value:function()
       {
        return this.value;
       }
      },{
       New:function(key,value)
       {
        var r;
        r=Runtime.New(this,{});
        r.key=key;
        r.value=value;
        return r;
       }
      }),
      U:function()
      {
       return;
      }
     },
     An:Runtime.Class({},{
      Append:function(_arg2,_arg1)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Append(_arg2.$0,_arg1.$0)
       });
      },
      Concat:function(xs)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Concat(Seq.map(function(_arg00_)
        {
         return Anims.List(_arg00_);
        },xs))
       });
      },
      Const:function(v)
      {
       return Anims.Const(v);
      },
      Delayed:function(inter,easing,dur,delay,x,y)
      {
       return{
        Compute:function(t)
        {
         return t<=delay?x:inter.Interpolate(easing.TransformTime.call(null,(t-delay)/dur),x,y);
        },
        Duration:dur+delay
       };
      },
      Map:function(f,anim)
      {
       var f1;
       f1=anim.Compute;
       return Anims.Def(anim.Duration,function(x)
       {
        return f(f1(x));
       });
      },
      Pack:function(anim)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:1,
         $0:anim
        })
       });
      },
      Play:function(anim)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(An.Run(function()
        {
        },Anims.Actions(anim)),function()
        {
         return Concurrency.Return(Anims.Finalize(anim));
        });
       });
      },
      Run:function(k,anim)
      {
       var dur;
       dur=anim.Duration;
       return Concurrency.FromContinuations(function(tupledArg)
       {
        var ok,start,loop;
        ok=tupledArg[0];
        start=function()
        {
         window.requestAnimationFrame(function(t)
         {
          return loop(t,t);
         });
        };
        loop=function(start1,now)
        {
         var t;
         t=now-start1;
         k(anim.Compute.call(null,t));
         return t<=dur?void window.requestAnimationFrame(function(t1)
         {
          return loop(start1,t1);
         }):ok(null);
        };
        return start(null);
       });
      },
      Simple:function(inter,easing,dur,x,y)
      {
       return{
        Compute:function(t)
        {
         return inter.Interpolate(easing.TransformTime.call(null,t/dur),x,y);
        },
        Duration:dur
       };
      },
      WhenDone:function(f,main)
      {
       return An.Append(Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:0,
         $0:f
        })
       }),main);
      },
      get_Empty:function()
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Empty()
       });
      }
     }),
     Anims:{
      Actions:function(_arg1)
      {
       return Anims.ConcatActions(Arrays.choose(function(_arg2)
       {
        return _arg2.$==1?{
         $:1,
         $0:_arg2.$0
        }:{
         $:0
        };
       },AppendList1.ToArray(_arg1.$0)));
      },
      ConcatActions:function(xs)
      {
       var xs1,matchValue,dur,xs2;
       xs1=Seq.toArray(xs);
       matchValue=Arrays.length(xs1);
       if(matchValue===0)
        {
         return Anims.Const(null);
        }
       else
        {
         if(matchValue===1)
          {
           return Arrays.get(xs1,0);
          }
         else
          {
           dur=Seq.max(Seq.map(function(anim)
           {
            return anim.Duration;
           },xs1));
           xs2=Arrays.map(function(anim)
           {
            return Anims.Prolong(dur,anim);
           },xs1);
           return Anims.Def(dur,function(t)
           {
            return Arrays.iter(function(anim)
            {
             return anim.Compute.call(null,t);
            },xs2);
           });
          }
        }
      },
      Const:function(v)
      {
       return Anims.Def(0,function()
       {
        return v;
       });
      },
      Def:function(d,f)
      {
       return{
        Compute:f,
        Duration:d
       };
      },
      Finalize:function(_arg1)
      {
       return Arrays.iter(function(_arg2)
       {
        return _arg2.$==0?_arg2.$0.call(null,null):null;
       },AppendList1.ToArray(_arg1.$0));
      },
      List:function(_arg1)
      {
       return _arg1.$0;
      },
      Prolong:function(nextDuration,anim)
      {
       var comp,dur,last;
       comp=anim.Compute;
       dur=anim.Duration;
       last=Lazy.Create(function()
       {
        return anim.Compute.call(null,anim.Duration);
       });
       return{
        Compute:function(t)
        {
         return t>=dur?last.eval():comp(t);
        },
        Duration:nextDuration
       };
      }
     },
     AppendList1:{
      Append:function(x,y)
      {
       var matchValue;
       matchValue=[x,y];
       return matchValue[0].$==0?matchValue[1]:matchValue[1].$==0?matchValue[0]:{
        $:2,
        $0:x,
        $1:y
       };
      },
      Concat:function(xs)
      {
       var a;
       a=Seq.toArray(xs);
       return Array1.MapReduce(function(x)
       {
        return x;
       },AppendList1.Empty(),function(_arg00_)
       {
        return function(_arg10_)
        {
         return AppendList1.Append(_arg00_,_arg10_);
        };
       },a);
      },
      Empty:function()
      {
       return{
        $:0
       };
      },
      FromArray:function(xs)
      {
       var matchValue;
       matchValue=xs.length;
       return matchValue===0?{
        $:0
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(xs,0)
       }:{
        $:3,
        $0:xs.slice()
       };
      },
      Single:function(x)
      {
       return{
        $:1,
        $0:x
       };
      },
      ToArray:function(xs)
      {
       var out,loop;
       out=[];
       loop=function(xs1)
       {
        var y;
        if(xs1.$==1)
         {
          return JQueue.Add(xs1.$0,out);
         }
        else
         {
          if(xs1.$==2)
           {
            y=xs1.$1;
            loop(xs1.$0);
            return loop(y);
           }
          else
           {
            return xs1.$==3?Arrays.iter(function(v)
            {
             return JQueue.Add(v,out);
            },xs1.$0):null;
           }
         }
       };
       loop(xs);
       return JQueue.ToArray(out);
      }
     },
     Array:{
      MapReduce:function(f,z,re,a)
      {
       var loop;
       loop=function(off,len)
       {
        var l2,a1,b,l21,a2,b1;
        if(len<=0)
         {
          return z;
         }
        else
         {
          if(len===1)
           {
            if(off>=0?off<Arrays.length(a):false)
             {
              return f(Arrays.get(a,off));
             }
            else
             {
              l2=len/2>>0;
              a1=loop(off,l2);
              b=loop(off+l2,len-l2);
              return(re(a1))(b);
             }
           }
          else
           {
            l21=len/2>>0;
            a2=loop(off,l21);
            b1=loop(off+l21,len-l21);
            return(re(a2))(b1);
           }
         }
       };
       return loop(0,Arrays.length(a));
      }
     },
     Client:{
      AnimatedAttrNode:Runtime.Class({
       GetChangeAnim:function(parent)
       {
        var matchValue,a=this;
        matchValue=[this.visible,this.logical];
        return An.WhenDone(function()
        {
         return a.sync(parent);
        },matchValue[0].$==1?matchValue[1].$==1?a.dirty?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):An.get_Empty():An.get_Empty():An.get_Empty());
       },
       GetEnterAnim:function(parent)
       {
        var matchValue,a=this;
        matchValue=[this.visible,this.logical];
        return An.WhenDone(function()
        {
         return a.sync(parent);
        },matchValue[0].$==1?matchValue[1].$==1?a.dirty?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty());
       },
       GetExitAnim:function(parent)
       {
        var matchValue,a=this;
        matchValue=this.visible;
        return An.WhenDone(function()
        {
         a.dirty=true;
         a.visible={
          $:0
         };
         return;
        },matchValue.$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans.AnimateExit(a.tr,matchValue.$0))):An.get_Empty());
       },
       Init:function()
       {
        return null;
       },
       Sync:function()
       {
        return null;
       },
       get_Changed:function()
       {
        return this.updates;
       },
       pushVisible:function(el,v)
       {
        this.visible={
         $:1,
         $0:v
        };
        this.dirty=true;
        return(this.push.call(null,el))(v);
       },
       sync:function(p)
       {
        if(this.dirty)
         {
          Option.iter(this.push.call(null,p),this.logical);
          this.visible=this.logical;
          this.dirty=false;
          return;
         }
        else
         {
          return null;
         }
       }
      },{
       New:function(tr,view,push)
       {
        var r;
        r=Runtime.New(this,{});
        r.tr=tr;
        r.push=push;
        r.logical={
         $:0
        };
        r.visible={
         $:0
        };
        r.dirty=true;
        r.updates=View.Map(function(x)
        {
         r.logical={
          $:1,
          $0:x
         };
         r.dirty=true;
         return;
        },view);
        return r;
       }
      }),
      Attr:{
       Animated:function(name,tr,view,attr)
       {
        return Attrs.Animated(tr,view,function(el)
        {
         return function(v)
         {
          return DomUtility.SetAttr(el,name,attr(v));
         };
        });
       },
       AnimatedStyle:function(name,tr,view,attr)
       {
        return Attrs.Animated(tr,view,function(el)
        {
         return function(v)
         {
          return DomUtility.SetStyle(el,name,attr(v));
         };
        });
       },
       Class:function(name)
       {
        return Attrs.Static(function(el)
        {
         return DomUtility.AddClass(el,name);
        });
       },
       CustomValue:function(_var,toString,fromString)
       {
        var onChange;
        onChange=function(el)
        {
         return function()
         {
          return _var.UpdateMaybe(function(v)
          {
           return!Unchecked.Equals(el.value,v)?fromString(el.value):{
            $:0
           };
          });
         };
        };
        return AttrProxy.Concat(List.ofArray([Attr.Handler("change",onChange),Attr.Handler("input",onChange),Attrs.Dynamic(_var.get_View(),function()
        {
        },function(e)
        {
         return function(v)
         {
          var vl;
          vl=toString(v);
          return vl!==e.value?void(e.value=vl):null;
         };
        })]));
       },
       Dynamic:function(name,view)
       {
        return Attrs.Dynamic(view,function()
        {
        },function(el)
        {
         return function(v)
         {
          return DomUtility.SetAttr(el,name,v);
         };
        });
       },
       DynamicClass:function(name,view,ok)
       {
        return Attrs.Dynamic(view,function()
        {
        },function(el)
        {
         return function(v)
         {
          return ok(v)?DomUtility.AddClass(el,name):DomUtility.RemoveClass(el,name);
         };
        });
       },
       DynamicCustom:function(set,view)
       {
        return Attrs.Dynamic(view,function()
        {
        },set);
       },
       DynamicPred:function(name,predView,valView)
       {
        var viewFn;
        viewFn=function(el)
        {
         return function(tupledArg)
         {
          var v;
          v=tupledArg[1];
          return tupledArg[0]?DomUtility.SetAttr(el,name,v):DomUtility.RemoveAttr(el,name);
         };
        };
        return Attrs.Dynamic(View.Map2(function(pred)
        {
         return function(value)
         {
          return[pred,value];
         };
        },predView,valView),function()
        {
        },viewFn);
       },
       DynamicProp:function(name,view)
       {
        return Attrs.Dynamic(view,function()
        {
        },function(el)
        {
         return function(v)
         {
          el[name]=v;
         };
        });
       },
       DynamicStyle:function(name,view)
       {
        return Attrs.Dynamic(view,function()
        {
        },function(el)
        {
         return function(v)
         {
          return DomUtility.SetStyle(el,name,v);
         };
        });
       },
       Handler:function(name,callback)
       {
        return Attrs.Static(function(el)
        {
         return el.addEventListener(name,callback(el),false);
        });
       },
       HandlerView:function(name,view,callback)
       {
        var id;
        id=Fresh.Id();
        return Attrs.Dynamic(view,function(el)
        {
         var callback1;
         callback1=callback(el);
         return el.addEventListener(name,function(ev)
         {
          return(callback1(ev))(el[id]);
         },false);
        },function(el)
        {
         return function(x)
         {
          el[id]=x;
         };
        });
       },
       OnAfterRender:function(callback)
       {
        return Attrs.Mk(0,{
         $:4,
         $0:callback
        });
       },
       Style:function(name,value)
       {
        return Attrs.Static(function(el)
        {
         return DomUtility.SetStyle(el,name,value);
        });
       },
       Value:function(_var)
       {
        return Attr.CustomValue(_var,function(x)
        {
         return x;
        },function(x)
        {
         return{
          $:1,
          $0:x
         };
        });
       }
      },
      AttrProxy:Runtime.Class({},{
       Append:function(a,b)
       {
        return Attrs.Mk(a.Flags|b.Flags,Attrs.AppendTree(a.Tree,b.Tree));
       },
       Concat:function(xs)
       {
        var a;
        a=Seq.toArray(xs);
        return Array1.MapReduce(function(x)
        {
         return x;
        },AttrProxy.get_Empty(),function(arg00)
        {
         return function(arg10)
         {
          return AttrProxy.Append(arg00,arg10);
         };
        },a);
       },
       Create:function(name,value)
       {
        return Attrs.Static(function(el)
        {
         return DomUtility.SetAttr(el,name,value);
        });
       },
       Handler:function(event,q)
       {
        return Attrs.Static(function(el)
        {
         return el.addEventListener(event,q(el),false);
        });
       },
       get_Empty:function()
       {
        return Attrs.EmptyAttr();
       }
      }),
      Attrs:{
       Animated:function(tr,view,set)
       {
        var node,flags;
        node=AnimatedAttrNode.New(tr,view,set);
        flags=4;
        if(Trans.CanAnimateEnter(tr))
         {
          flags=flags|1;
         }
        if(Trans.CanAnimateExit(tr))
         {
          flags=flags|2;
         }
        return Attrs.Mk(flags,{
         $:1,
         $0:node
        });
       },
       AppendTree:function(a,b)
       {
        var matchValue;
        matchValue=[a,b];
        return matchValue[0].$==0?matchValue[1]:matchValue[1].$==0?matchValue[0]:{
         $:2,
         $0:a,
         $1:b
        };
       },
       Dynamic:function(view,init,set)
       {
        return Attrs.Mk(0,{
         $:1,
         $0:DynamicAttrNode.New(view,init,set)
        });
       },
       EmptyAttr:Runtime.Field(function()
       {
        return Attrs.Mk(0,{
         $:0
        });
       }),
       GetAnim:function(dyn,f)
       {
        return An.Concat(Arrays.map(function(n)
        {
         return(f(n))(dyn.DynElem);
        },dyn.DynNodes));
       },
       GetChangeAnim:function(dyn)
       {
        return Attrs.GetAnim(dyn,function(n)
        {
         return function(arg00)
         {
          return n.GetChangeAnim(arg00);
         };
        });
       },
       GetEnterAnim:function(dyn)
       {
        return Attrs.GetAnim(dyn,function(n)
        {
         return function(arg00)
         {
          return n.GetEnterAnim(arg00);
         };
        });
       },
       GetExitAnim:function(dyn)
       {
        return Attrs.GetAnim(dyn,function(n)
        {
         return function(arg00)
         {
          return n.GetExitAnim(arg00);
         };
        });
       },
       HasChangeAnim:function(attr)
       {
        return(attr.DynFlags&4)!==0;
       },
       HasEnterAnim:function(attr)
       {
        return(attr.DynFlags&1)!==0;
       },
       HasExitAnim:function(attr)
       {
        return(attr.DynFlags&2)!==0;
       },
       Insert:function(elem,tree)
       {
        var nodes,oar,loop;
        nodes=[];
        oar=[];
        loop=function(node)
        {
         var n,b;
         if(node.$==1)
          {
           n=node.$0;
           n.Init(elem);
           return JQueue.Add(n,nodes);
          }
         else
          {
           if(node.$==2)
            {
             b=node.$1;
             loop(node.$0);
             return loop(b);
            }
           else
            {
             return node.$==3?node.$0.call(null,elem):node.$==4?JQueue.Add(node.$0,oar):null;
            }
          }
        };
        loop(tree.Tree);
        return Runtime.DeleteEmptyFields({
         DynElem:elem,
         DynFlags:tree.Flags,
         DynNodes:JQueue.ToArray(nodes),
         OnAfterRender:(JQueue.Count(oar)===0?{
          $:0
         }:{
          $:1,
          $0:function(el)
          {
           return JQueue.Iter(function(f)
           {
            return f(el);
           },oar);
          }
         }).$0
        },["OnAfterRender"]);
       },
       Mk:function(flags,tree)
       {
        return Runtime.New(AttrProxy,{
         Flags:flags,
         Tree:tree
        });
       },
       Static:function(attr)
       {
        return Attrs.Mk(0,{
         $:3,
         $0:attr
        });
       },
       Sync:function(elem,dyn)
       {
        return Arrays.iter(function(d)
        {
         return d.Sync(elem);
        },dyn.DynNodes);
       },
       Updates:function(dyn)
       {
        var p,a;
        p=function(x)
        {
         return function(y)
         {
          return View.Map2(function()
          {
           return function()
           {
            return null;
           };
          },x,y);
         };
        };
        a=dyn.DynNodes;
        return Array1.MapReduce(function(x)
        {
         return x.get_Changed();
        },View.Const(null),p,a);
       }
      },
      Doc:Runtime.Class({
       ReplaceInDom:function(elt)
       {
        var ldelim,rdelim,parent,st,arg10,_this=this;
        ldelim=document.createTextNode("");
        rdelim=document.createTextNode("");
        parent=elt.parentNode;
        parent.replaceChild(rdelim,elt);
        parent.insertBefore(ldelim,rdelim);
        Docs.LinkPrevElement(rdelim,this.docNode);
        st=Docs.CreateDelimitedRunState(ldelim,rdelim,this.docNode);
        arg10=this.updates;
        return View1.Sink(Mailbox.StartProcessor(function()
        {
         return Docs.PerformAnimatedUpdate(st,_this.docNode);
        }),arg10);
       },
       get_DocNode:function()
       {
        return this.docNode;
       },
       get_ToDynDoc:function()
       {
        return;
       },
       get_Updates:function()
       {
        return this.updates;
       }
      },{
       Append:function(a,b)
       {
        var x;
        x=View.Map2(function()
        {
         return function()
         {
          return null;
         };
        },a.get_Updates(),b.get_Updates());
        return Doc.Mk({
         $:0,
         $0:a.get_DocNode(),
         $1:b.get_DocNode()
        },x);
       },
       AsPagelet:function(doc)
       {
        return UINextPagelet.New(doc);
       },
       BindView:function(f,view)
       {
        return Doc.EmbedView(View.Map(f,view));
       },
       Button:function(caption,attrs,action)
       {
        var attrs1;
        attrs1=AttrProxy.Concat(attrs);
        return Elt.New(Doc.Clickable("button",action),attrs1,Doc.TextNode(caption));
       },
       ButtonView:function(caption,attrs,view,action)
       {
        var attrs1;
        attrs1=AttrProxy.Concat(Seq.append([Attr.HandlerView("click",view,function()
        {
         return function()
         {
          return action;
         };
        })],attrs));
        return Elt.New(DomUtility.CreateElement("button"),attrs1,Doc.TextNode(caption));
       },
       CheckBox:function(attrs,chk)
       {
        var el;
        el=DomUtility.CreateElement("input");
        el.addEventListener("click",function()
        {
         return chk.Set(el.checked);
        },false);
        return Elt.New(el,AttrProxy.Concat(Seq.toList(Seq.delay(function()
        {
         return Seq.append(attrs,Seq.delay(function()
         {
          return Seq.append([AttrProxy.Create("type","checkbox")],Seq.delay(function()
          {
           return[Attr.DynamicProp("checked",chk.get_View())];
          }));
         }));
        }))),Doc.get_Empty());
       },
       CheckBoxGroup:function(attrs,item,chk)
       {
        var rvi,predicate,checkedView,attrs1,el;
        rvi=chk.get_View();
        predicate=function(x)
        {
         return Unchecked.Equals(x,item);
        };
        checkedView=View.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },rvi);
        attrs1=AttrProxy.Concat(List.append(List.ofArray([AttrProxy.Create("type","checkbox"),AttrProxy.Create("name",chk.get_Id()),AttrProxy.Create("value",Fresh.Id()),Attr.DynamicProp("checked",checkedView)]),List.ofSeq(attrs)));
        el=DomUtility.CreateElement("input");
        el.addEventListener("click",function()
        {
         var chkd;
         chkd=el.checked;
         return chk.Update(function(obs)
         {
          return Seq.toList(Seq1.distinct(chkd?List.append(obs,List.ofArray([item])):List.filter(function(x1)
          {
           return!Unchecked.Equals(x1,item);
          },obs)));
         });
        },false);
        return Elt.New(el,attrs1,Doc.get_Empty());
       },
       Clickable:function(elem,action)
       {
        var el;
        el=DomUtility.CreateElement(elem);
        el.addEventListener("click",function(ev)
        {
         ev.preventDefault();
         return action(null);
        },false);
        return el;
       },
       Concat:function(xs)
       {
        var a;
        a=Seq.toArray(xs);
        return Array1.MapReduce(function(x)
        {
         return x;
        },Doc.get_Empty(),function(arg00)
        {
         return function(arg10)
         {
          return Doc.Append(arg00,arg10);
         };
        },a);
       },
       Convert:function(render,view)
       {
        return Doc.Flatten(View.Convert(render,view));
       },
       ConvertBy:function(key,render,view)
       {
        return Doc.Flatten(View.ConvertBy(key,render,view));
       },
       ConvertSeq:function(render,view)
       {
        return Doc.Flatten(View.ConvertSeq(render,view));
       },
       ConvertSeqBy:function(key,render,view)
       {
        return Doc.Flatten(View.ConvertSeqBy(key,render,view));
       },
       Element:function(name,attr,children)
       {
        var attr1,arg20;
        attr1=AttrProxy.Concat(attr);
        arg20=Doc.Concat(children);
        return Elt.New(DomUtility.CreateElement(name),attr1,arg20);
       },
       EmbedView:function(view)
       {
        var node,x;
        node=Docs.CreateEmbedNode();
        x=View.Map(function()
        {
        },View.Bind(function(doc)
        {
         Docs.UpdateEmbedNode(node,doc.get_DocNode());
         return doc.get_Updates();
        },view));
        return Doc.Mk({
         $:2,
         $0:node
        },x);
       },
       Flatten:function(view)
       {
        return Doc.EmbedView(View.Map(function(arg00)
        {
         return Doc.Concat(arg00);
        },view));
       },
       FloatInput:function(attr,_var)
       {
        return Doc.InputInternal(attr,Attr.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },function(s)
        {
         var pd;
         pd=Global.parseFloat(s);
         return Global.isNaN(pd)?{
          $:0
         }:{
          $:1,
          $0:pd
         };
        }),{
         $:1,
         $0:"number"
        });
       },
       Input:function(attr,_var)
       {
        return Doc.InputInternal(attr,Attr.Value(_var),{
         $:0
        });
       },
       InputArea:function(attr,_var)
       {
        return Doc.InputInternal(attr,Attr.Value(_var),{
         $:2
        });
       },
       InputInternal:function(attr,value,inputTy)
       {
        var patternInput,attrN;
        patternInput=inputTy.$==1?[AttrProxy.Append(AttrProxy.Create("type",inputTy.$0),AttrProxy.Concat(attr)),"input"]:inputTy.$==2?[AttrProxy.Concat(attr),"textarea"]:[AttrProxy.Concat(attr),"input"];
        attrN=patternInput[0];
        return Elt.New(DomUtility.CreateElement(patternInput[1]),AttrProxy.Append(attrN,value),Doc.get_Empty());
       },
       IntInput:function(attr,_var)
       {
        return Doc.InputInternal(attr,Attr.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },function(s)
        {
         var pd;
         pd=Global.parseInt(s,10);
         return Global.isNaN(pd)?{
          $:0
         }:{
          $:1,
          $0:pd
         };
        }),{
         $:1,
         $0:"number"
        });
       },
       Link:function(caption,attrs,action)
       {
        var arg10,attrs1;
        arg10=AttrProxy.Concat(attrs);
        attrs1=AttrProxy.Append(AttrProxy.Create("href","#"),arg10);
        return Elt.New(Doc.Clickable("a",action),attrs1,Doc.TextNode(caption));
       },
       LinkView:function(caption,attrs,view,action)
       {
        var attrs1;
        attrs1=AttrProxy.Concat(Seq.append([Attr.HandlerView("click",view,function()
        {
         return function()
         {
          return action;
         };
        }),AttrProxy.Create("href","#")],attrs));
        return Elt.New(DomUtility.CreateElement("a"),attrs1,Doc.TextNode(caption));
       },
       Mk:function(node,updates)
       {
        return Doc.New(node,updates);
       },
       New:function(docNode,updates)
       {
        var r;
        r=Runtime.New(this,{});
        r.docNode=docNode;
        r.updates=updates;
        return r;
       },
       PasswordBox:function(attr,_var)
       {
        return Doc.InputInternal(attr,Attr.Value(_var),{
         $:1,
         $0:"password"
        });
       },
       Radio:function(attrs,value,_var)
       {
        var el,valAttr,op_EqualsEqualsGreater;
        el=DomUtility.CreateElement("input");
        el.addEventListener("click",function()
        {
         return _var.Set(value);
        },false);
        valAttr=Attr.DynamicProp("checked",View.Map(function(x)
        {
         return Unchecked.Equals(x,value);
        },_var.get_View()));
        op_EqualsEqualsGreater=function(k,v)
        {
         return AttrProxy.Create(k,v);
        };
        return Elt.New(el,AttrProxy.Concat(List.append(List.ofArray([op_EqualsEqualsGreater("type","radio"),op_EqualsEqualsGreater("name",_var.get_Id()),valAttr]),List.ofSeq(attrs))),Doc.get_Empty());
       },
       Run:function(parent,doc)
       {
        var d,st;
        d=doc.get_DocNode();
        Docs.LinkElement(parent,d);
        st=Docs.CreateRunState(parent,d);
        return View1.Sink(Mailbox.StartProcessor(function()
        {
         return Docs.PerformAnimatedUpdate(st,d);
        }),doc.get_Updates());
       },
       RunById:function(id,tr)
       {
        var matchValue;
        matchValue=DomUtility.Doc().getElementById(id);
        return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.Run(matchValue,tr);
       },
       Select:function(attrs,show,options,current)
       {
        var setSelectedItem,el1,x,selectedItemAttr,optionElements;
        setSelectedItem=function(el)
        {
         return function(item)
         {
          el.selectedIndex=Seq.findIndex(function(y)
          {
           return Unchecked.Equals(item,y);
          },options);
         };
        };
        el1=DomUtility.CreateElement("select");
        x=current.get_View();
        selectedItemAttr=Attr.DynamicCustom(setSelectedItem,x);
        el1.addEventListener("change",function()
        {
         return current.Set(options.get_Item(el1.selectedIndex));
        },false);
        optionElements=Doc.Concat(List.mapi(function(i)
        {
         return function(o)
         {
          var t;
          t=Doc.TextNode(show(o));
          return Doc.Element("option",List.ofArray([AttrProxy.Create("value",Global.String(i))]),List.ofArray([t]));
         };
        },options));
        return Elt.New(el1,AttrProxy.Append(selectedItemAttr,AttrProxy.Concat(attrs)),optionElements);
       },
       Static:function(el)
       {
        return Elt.New(el,AttrProxy.get_Empty(),Doc.get_Empty());
       },
       SvgElement:function(name,attr,children)
       {
        var attr1,arg20;
        attr1=AttrProxy.Concat(attr);
        arg20=Doc.Concat(children);
        return Elt.New(DomUtility.CreateSvgElement(name),attr1,arg20);
       },
       TextNode:function(v)
       {
        return Doc.Mk({
         $:5,
         $0:DomUtility.CreateText(v)
        },View.Const(null));
       },
       TextView:function(txt)
       {
        var node,x;
        node=Docs.CreateTextNode();
        x=View.Map(function(t)
        {
         return Docs.UpdateTextNode(node,t);
        },txt);
        return Doc.Mk({
         $:4,
         $0:node
        },x);
       },
       get_Empty:function()
       {
        return Doc.Mk({
         $:3
        },View.Const(null));
       }
      }),
      DocElemNode:Runtime.Class({
       Equals:function(o)
       {
        return this.ElKey===o.ElKey;
       },
       GetHashCode:function()
       {
        return this.ElKey;
       }
      }),
      Docs:{
       ComputeChangeAnim:function(st,cur)
       {
        var arg00,relevant;
        arg00=function(n)
        {
         return Attrs.HasChangeAnim(n.Attr);
        };
        relevant=function(arg10)
        {
         return NodeSet.Filter(arg00,arg10);
        };
        return An.Concat(Arrays.map(function(n)
        {
         return Attrs.GetChangeAnim(n.Attr);
        },NodeSet.ToArray(NodeSet.Intersect(relevant(st.PreviousNodes),relevant(cur)))));
       },
       ComputeEnterAnim:function(st,cur)
       {
        return An.Concat(Arrays.map(function(n)
        {
         return Attrs.GetEnterAnim(n.Attr);
        },NodeSet.ToArray(NodeSet.Except(st.PreviousNodes,NodeSet.Filter(function(n)
        {
         return Attrs.HasEnterAnim(n.Attr);
        },cur)))));
       },
       ComputeExitAnim:function(st,cur)
       {
        return An.Concat(Arrays.map(function(n)
        {
         return Attrs.GetExitAnim(n.Attr);
        },NodeSet.ToArray(NodeSet.Except(cur,NodeSet.Filter(function(n)
        {
         return Attrs.HasExitAnim(n.Attr);
        },st.PreviousNodes)))));
       },
       CreateDelimitedElemNode:function(ldelim,rdelim,attr,children)
       {
        var el,attr1;
        el=ldelim.parentNode;
        Docs.LinkPrevElement(rdelim,children);
        attr1=Attrs.Insert(el,attr);
        return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
         Attr:attr1,
         Children:children,
         Delimiters:[ldelim,rdelim],
         El:el,
         ElKey:Fresh.Int(),
         Render:Runtime.GetOptional(attr1.OnAfterRender).$0
        },["Render"]));
       },
       CreateDelimitedRunState:function(ldelim,rdelim,doc)
       {
        return{
         PreviousNodes:NodeSet.get_Empty(),
         Top:Docs.CreateDelimitedElemNode(ldelim,rdelim,AttrProxy.get_Empty(),doc)
        };
       },
       CreateElemNode:function(el,attr,children)
       {
        var attr1;
        Docs.LinkElement(el,children);
        attr1=Attrs.Insert(el,attr);
        return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
         Attr:attr1,
         Children:children,
         El:el,
         ElKey:Fresh.Int(),
         Render:Runtime.GetOptional(attr1.OnAfterRender).$0
        },["Render"]));
       },
       CreateEmbedNode:function()
       {
        return{
         Current:{
          $:3
         },
         Dirty:false
        };
       },
       CreateRunState:function(parent,doc)
       {
        return{
         PreviousNodes:NodeSet.get_Empty(),
         Top:Docs.CreateElemNode(parent,AttrProxy.get_Empty(),doc)
        };
       },
       CreateTextNode:function()
       {
        return{
         Text:DomUtility.CreateText(""),
         Dirty:false,
         Value:""
        };
       },
       DoSyncElement:function(el)
       {
        var parent,ins,parent1,matchValue;
        parent=el.El;
        ins=function(doc,pos)
        {
         var d;
         if(doc.$==1)
          {
           return{
            $:1,
            $0:doc.$0.El
           };
          }
         else
          {
           if(doc.$==2)
            {
             d=doc.$0;
             if(d.Dirty)
              {
               d.Dirty=false;
               return Docs.InsertDoc(parent,d.Current,pos);
              }
             else
              {
               return ins(d.Current,pos);
              }
            }
           else
            {
             return doc.$==3?pos:doc.$==4?{
              $:1,
              $0:doc.$0.Text
             }:doc.$==5?{
              $:1,
              $0:doc.$0
             }:ins(doc.$0,ins(doc.$1,pos));
            }
          }
        };
        parent1=el.El;
        DomNodes.Iter(function(el1)
        {
         return DomUtility.RemoveNode(parent1,el1);
        },DomNodes.Except(DomNodes.DocChildren(el),DomNodes.Children(el.El,Runtime.GetOptional(el.Delimiters))));
        matchValue=Runtime.GetOptional(el.Delimiters);
        ins(el.Children,matchValue.$==1?{
         $:1,
         $0:matchValue.$0[1]
        }:{
         $:0
        });
        return;
       },
       DomNodes:Runtime.Class({},{
        Children:function(elem,delims)
        {
         var rdelim,ldelim,a,n,objectArg;
         if(delims.$==1)
          {
           rdelim=delims.$0[1];
           ldelim=delims.$0[0];
           a=Array.prototype.constructor.apply(Array,[]);
           n=ldelim.nextSibling;
           while(n!==rdelim)
            {
             a.push(n);
             n=n.nextSibling;
            }
           return Runtime.New(DomNodes,{
            $:0,
            $0:a
           });
          }
         else
          {
           objectArg=elem.childNodes;
           return Runtime.New(DomNodes,{
            $:0,
            $0:Arrays.init(elem.childNodes.length,function(arg00)
            {
             return objectArg[arg00];
            })
           });
          }
        },
        DocChildren:function(node)
        {
         var q,loop;
         q=[];
         loop=function(doc)
         {
          var b;
          if(doc.$==2)
           {
            return loop(doc.$0.Current);
           }
          else
           {
            if(doc.$==1)
             {
              return JQueue.Add(doc.$0.El,q);
             }
            else
             {
              if(doc.$==3)
               {
                return null;
               }
              else
               {
                if(doc.$==5)
                 {
                  return null;
                 }
                else
                 {
                  if(doc.$==4)
                   {
                    return JQueue.Add(doc.$0.Text,q);
                   }
                  else
                   {
                    b=doc.$1;
                    loop(doc.$0);
                    return loop(b);
                   }
                 }
               }
             }
           }
         };
         loop(node.Children);
         return Runtime.New(DomNodes,{
          $:0,
          $0:JQueue.ToArray(q)
         });
        },
        Except:function(_arg2,_arg1)
        {
         var excluded;
         excluded=_arg2.$0;
         return Runtime.New(DomNodes,{
          $:0,
          $0:Arrays.filter(function(n)
          {
           return Seq.forall(function(k)
           {
            return!(n===k);
           },excluded);
          },_arg1.$0)
         });
        },
        FoldBack:function(f,_arg4,z)
        {
         return Arrays.foldBack(f,_arg4.$0,z);
        },
        Iter:function(f,_arg3)
        {
         return Arrays.iter(f,_arg3.$0);
        }
       }),
       InsertDoc:function(parent,doc,pos)
       {
        var d;
        if(doc.$==1)
         {
          return Docs.InsertNode(parent,doc.$0.El,pos);
         }
        else
         {
          if(doc.$==2)
           {
            d=doc.$0;
            d.Dirty=false;
            return Docs.InsertDoc(parent,d.Current,pos);
           }
          else
           {
            return doc.$==3?pos:doc.$==4?Docs.InsertNode(parent,doc.$0.Text,pos):doc.$==5?Docs.InsertNode(parent,doc.$0,pos):Docs.InsertDoc(parent,doc.$0,Docs.InsertDoc(parent,doc.$1,pos));
           }
         }
       },
       InsertNode:function(parent,node,pos)
       {
        DomUtility.InsertAt(parent,pos,node);
        return{
         $:1,
         $0:node
        };
       },
       LinkElement:function(el,children)
       {
        Docs.InsertDoc(el,children,{
         $:0
        });
       },
       LinkPrevElement:function(el,children)
       {
        Docs.InsertDoc(el.parentNode,children,{
         $:1,
         $0:el
        });
       },
       NodeSet:Runtime.Class({},{
        Except:function(_arg3,_arg2)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet.Except(_arg3.$0,_arg2.$0)
         });
        },
        Filter:function(f,_arg1)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet.Filter(f,_arg1.$0)
         });
        },
        FindAll:function(doc)
        {
         var q,loop;
         q=[];
         loop=function(node)
         {
          var b,el;
          if(node.$==0)
           {
            b=node.$1;
            loop(node.$0);
            return loop(b);
           }
          else
           {
            if(node.$==1)
             {
              el=node.$0;
              JQueue.Add(el,q);
              return loop(el.Children);
             }
            else
             {
              return node.$==2?loop(node.$0.Current):null;
             }
           }
         };
         loop(doc);
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSetProxy.New(JQueue.ToArray(q))
         });
        },
        Intersect:function(_arg5,_arg4)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet.Intersect(_arg5.$0,_arg4.$0)
         });
        },
        IsEmpty:function(_arg6)
        {
         return _arg6.$0.get_Count()===0;
        },
        ToArray:function(_arg7)
        {
         return HashSet.ToArray(_arg7.$0);
        },
        get_Empty:function()
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSetProxy.New11()
         });
        }
       }),
       PerformAnimatedUpdate:function(st,doc)
       {
        return Concurrency.Delay(function()
        {
         var cur,change,enter;
         cur=NodeSet.FindAll(doc);
         change=Docs.ComputeChangeAnim(st,cur);
         enter=Docs.ComputeEnterAnim(st,cur);
         return Concurrency.Bind(An.Play(An.Append(change,Docs.ComputeExitAnim(st,cur))),function()
         {
          Docs.SyncElemNode(st.Top);
          return Concurrency.Bind(An.Play(enter),function()
          {
           return Concurrency.Return(void(st.PreviousNodes=cur));
          });
         });
        });
       },
       Sync:function(doc)
       {
        var sync;
        sync=function(doc1)
        {
         var el,d,b;
         if(doc1.$==1)
          {
           el=doc1.$0;
           Docs.SyncElement(el);
           return sync(el.Children);
          }
         else
          {
           if(doc1.$==2)
            {
             return sync(doc1.$0.Current);
            }
           else
            {
             if(doc1.$==3)
              {
               return null;
              }
             else
              {
               if(doc1.$==5)
                {
                 return null;
                }
               else
                {
                 if(doc1.$==4)
                  {
                   d=doc1.$0;
                   if(d.Dirty)
                    {
                     d.Text.nodeValue=d.Value;
                     d.Dirty=false;
                     return;
                    }
                   else
                    {
                     return null;
                    }
                  }
                 else
                  {
                   b=doc1.$1;
                   sync(doc1.$0);
                   return sync(b);
                  }
                }
              }
            }
          }
        };
        return sync(doc);
       },
       SyncElemNode:function(el)
       {
        Docs.SyncElement(el);
        return Docs.Sync(el.Children);
       },
       SyncElement:function(el)
       {
        var dirty,matchValue;
        Attrs.Sync(el.El,el.Attr);
        dirty=function(doc)
        {
         var b,d;
         if(doc.$==0)
          {
           b=doc.$1;
           return dirty(doc.$0)?true:dirty(b);
          }
         else
          {
           if(doc.$==2)
            {
             d=doc.$0;
             return d.Dirty?true:dirty(d.Current);
            }
           else
            {
             return false;
            }
          }
        };
        if(dirty(el.Children))
         {
          Docs.DoSyncElement(el);
         }
        matchValue=Runtime.GetOptional(el.Render);
        if(matchValue.$==1)
         {
          matchValue.$0.call(null,el.El);
          delete el.Render;
          return;
         }
        else
         {
          return null;
         }
       },
       UpdateEmbedNode:function(node,upd)
       {
        node.Current=upd;
        node.Dirty=true;
        return;
       },
       UpdateTextNode:function(n,t)
       {
        n.Value=t;
        n.Dirty=true;
        return;
       }
      },
      DynamicAttrNode:Runtime.Class({
       GetChangeAnim:function()
       {
        return An.get_Empty();
       },
       GetEnterAnim:function()
       {
        return An.get_Empty();
       },
       GetExitAnim:function()
       {
        return An.get_Empty();
       },
       Init:function(parent)
       {
        return this.init.call(null,parent);
       },
       Sync:function(parent)
       {
        if(this.dirty)
         {
          (this.push.call(null,parent))(this.value);
          this.dirty=false;
          return;
         }
        else
         {
          return null;
         }
       },
       get_Changed:function()
       {
        return this.updates;
       }
      },{
       New:function(view,init,push)
       {
        var r;
        r=Runtime.New(this,{});
        r.init=init;
        r.push=push;
        r.value=Abbrev.U();
        r.dirty=true;
        r.updates=View.Map(function(x)
        {
         r.value=x;
         r.dirty=true;
         return;
        },view);
        return r;
       }
      }),
      Elt:Runtime.Class({
       AddClass:function($cls)
       {
        var $this=this;
        return $this.elt.className+=" "+$cls;
       },
       Append:function(doc)
       {
        var e;
        e=this.get_DocElemNode();
        e.Children={
         $:0,
         $0:e.Children,
         $1:doc.get_DocNode()
        };
        Var1.Set(this.rvUpdates,View.Map2(function()
        {
         return function()
         {
          return null;
         };
        },Var.Get(this.rvUpdates),doc.get_Updates()));
        Docs.InsertDoc(this.elt,doc.get_DocNode(),{
         $:0
        });
        return;
       },
       Clear:function()
       {
        this.get_DocElemNode().Children={
         $:3
        };
        Var1.Set(this.rvUpdates,View.Const(null));
        while(this.elt.hasChildNodes())
         {
          this.elt.removeChild(this.elt.firstChild);
         }
        return;
       },
       GetAttribute:function(name)
       {
        return this.elt.getAttribute(name);
       },
       GetProperty:function(name)
       {
        return this.elt[name];
       },
       GetText:function()
       {
        return this.elt.textContent;
       },
       GetValue:function()
       {
        return this.elt.value;
       },
       HasAttribute:function(name)
       {
        return this.elt.hasAttribute(name);
       },
       HasClass:function(cls)
       {
        return(new RegExp("(\\s|^)"+cls+"(\\s|$)")).test(this.elt.className);
       },
       Html:function()
       {
        return this.elt.outerHTML;
       },
       Id:function()
       {
        return this.elt.id;
       },
       OnAfterRender:function(cb)
       {
        var matchValue,_,f;
        matchValue=Runtime.GetOptional(this.get_DocElemNode().Render);
        if(matchValue.$==1)
         {
          f=matchValue.$0;
          _={
           $:1,
           $0:function(el)
           {
            f(el);
            return cb(el);
           }
          };
         }
        else
         {
          _={
           $:1,
           $0:cb
          };
         }
        Runtime.SetOptional(this.get_DocElemNode(),"Render",_);
        return this;
       },
       Prepend:function(doc)
       {
        var e,matchValue,pos;
        e=this.get_DocElemNode();
        e.Children={
         $:0,
         $0:doc.get_DocNode(),
         $1:e.Children
        };
        Var1.Set(this.rvUpdates,View.Map2(function()
        {
         return function()
         {
          return null;
         };
        },Var.Get(this.rvUpdates),doc.get_Updates()));
        matchValue=this.elt.firstChild;
        pos=Unchecked.Equals(matchValue,null)?{
         $:0
        }:{
         $:1,
         $0:matchValue
        };
        Docs.InsertDoc(this.elt,doc.get_DocNode(),pos);
        return;
       },
       RemoveAttribute:function(name)
       {
        return this.elt.removeAttribute(name);
       },
       RemoveClass:function(cls)
       {
        this.elt.className=this.elt.className.replace(new RegExp("(\\s|^)"+cls+"(\\s|$)")," ");
       },
       SetAttribute:function(name,value)
       {
        return this.elt.setAttribute(name,value);
       },
       SetProperty:function(name,value)
       {
        this.elt[name]=value;
       },
       SetStyle:function(style,value)
       {
        this.elt.style[style]=value;
       },
       SetText:function(v)
       {
        this.get_DocElemNode().Children={
         $:3
        };
        Var1.Set(this.rvUpdates,View.Const(null));
        this.elt.textContent=v;
        return;
       },
       SetValue:function(v)
       {
        this.elt.value=v;
       },
       get_DocElemNode:function()
       {
        var matchValue;
        matchValue=this.docNode1;
        return matchValue.$==1?matchValue.$0:Operators.FailWith("Elt: Invalid docNode");
       },
       get_Element:function()
       {
        return this.elt;
       },
       on:function(ev,cb)
       {
        this.elt.addEventListener(ev,cb(this.elt),false);
        return this;
       }
      },{
       New:function(el,attr,children)
       {
        var node,rvUpdates,attrUpdates,arg00,updates;
        node=Docs.CreateElemNode(el,attr,children.get_DocNode());
        rvUpdates=Var.Create(children.get_Updates());
        attrUpdates=Attrs.Updates(node.Attr);
        arg00=function()
        {
         return function()
         {
          return null;
         };
        };
        updates=View.Bind(function(arg20)
        {
         return View.Map2(arg00,attrUpdates,arg20);
        },rvUpdates.get_View());
        return Elt.New1({
         $:1,
         $0:node
        },updates,el,rvUpdates,attrUpdates);
       },
       New1:function(docNode,updates,elt,rvUpdates)
       {
        var r;
        r=Runtime.New(this,Doc.New(docNode,updates));
        r.docNode1=docNode;
        r.elt=elt;
        r.rvUpdates=rvUpdates;
        return r;
       }
      }),
      UINextPagelet:Runtime.Class({
       Render:function()
       {
        return Doc.RunById(this.divId,this.doc);
       },
       get_Body:function()
       {
        return this.body;
       }
      },{
       New:function(doc)
       {
        var r,arg10,arg101;
        r=Runtime.New(this,Pagelet.New());
        r.doc=doc;
        r.divId=Fresh.Id();
        arg101=r.divId;
        arg10=List.ofArray([Attr1.Attr().NewAttr("id",arg101)]);
        r.body=Tags.Tags().NewTag("div",arg10).get_Body();
        return r;
       }
      })
     },
     DomUtility:{
      AddClass:function(element,cl)
      {
       jQuery(element).addClass(cl);
      },
      AppendTo:function(ctx,node)
      {
       ctx.appendChild(node);
      },
      Clear:function(ctx)
      {
       while(ctx.hasChildNodes())
        {
         ctx.removeChild(ctx.firstChild);
        }
       return;
      },
      ClearAttrs:function(ctx)
      {
       while(ctx.hasAttributes())
        {
         ctx.removeAttributeNode(ctx.attributes.item(0));
        }
       return;
      },
      CreateAttr:function(name,value)
      {
       var a;
       a=DomUtility.Doc().createAttribute(name);
       a.value=value;
       return a;
      },
      CreateElement:function(name)
      {
       return DomUtility.Doc().createElement(name);
      },
      CreateSvgElement:function(name)
      {
       return DomUtility.Doc().createElementNS("http://www.w3.org/2000/svg",name);
      },
      CreateText:function(s)
      {
       return DomUtility.Doc().createTextNode(s);
      },
      Doc:Runtime.Field(function()
      {
       return document;
      }),
      InsertAt:function(parent,pos,node)
      {
       var _,matchValue,matchValue1;
       if(node.parentNode===parent)
        {
         matchValue=node.nextSibling;
         matchValue1=[pos,Unchecked.Equals(matchValue,null)?{
          $:0
         }:{
          $:1,
          $0:matchValue
         }];
         _=matchValue1[0].$==1?matchValue1[1].$==1?matchValue1[0].$0===matchValue1[1].$0:false:matchValue1[1].$==0?true:false;
        }
       else
        {
         _=false;
        }
       return!_?pos.$==1?void parent.insertBefore(node,pos.$0):void parent.appendChild(node):null;
      },
      RemoveAttr:function(el,attrName)
      {
       return el.removeAttribute(attrName);
      },
      RemoveClass:function(element,cl)
      {
       jQuery(element).removeClass(cl);
      },
      RemoveNode:function(parent,el)
      {
       return el.parentNode===parent?void parent.removeChild(el):null;
      },
      SetAttr:function(el,name,value)
      {
       return el.setAttribute(name,value);
      },
      SetProperty:function($target,$name,$value)
      {
       var $0=this,$this=this;
       return $target.setProperty($name,$value);
      },
      SetStyle:function(el,name,value)
      {
       return DomUtility.SetProperty(el.style,name,value);
      }
     },
     DoubleInterpolation:Runtime.Class({
      Interpolate:function(t,x,y)
      {
       return x+t*(y-x);
      }
     }),
     Easing:Runtime.Class({},{
      Custom:function(f)
      {
       return Runtime.New(Easing,{
        TransformTime:f
       });
      },
      get_CubicInOut:function()
      {
       return Easings.CubicInOut();
      }
     }),
     Easings:{
      CubicInOut:Runtime.Field(function()
      {
       return Runtime.New(Easing,{
        TransformTime:function(t)
        {
         var t2;
         t2=t*t;
         return 3*t2-2*(t2*t);
        }
       });
      })
     },
     Flow:Runtime.Class({},{
      Bind:function(m,k)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(m.Render.call(null,_var))(function(r)
          {
           return(k(r).Render.call(null,_var))(cont);
          });
         };
        }
       };
      },
      Map:function(f,x)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(x.Render.call(null,_var))(function(r)
          {
           return cont(f(r));
          });
         };
        }
       };
      },
      Return:function(x)
      {
       return{
        Render:function()
        {
         return function(cont)
         {
          return cont(x);
         };
        }
       };
      },
      get_Do:function()
      {
       return FlowBuilder.New();
      }
     }),
     Flow1:Runtime.Class({},{
      Define:function(f)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return Var1.Set(_var,f(cont));
         };
        }
       };
      },
      Embed:function(fl)
      {
       var _var;
       _var=Var.Create(Doc.get_Empty());
       (fl.Render.call(null,_var))(function()
       {
       });
       return Doc.EmbedView(_var.get_View());
      },
      Static:function(doc)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          Var1.Set(_var,doc);
          return cont(null);
         };
        }
       };
      }
     }),
     FlowBuilder:Runtime.Class({
      Bind:function(comp,func)
      {
       return Flow.Bind(comp,func);
      },
      Return:function(value)
      {
       return Flow.Return(value);
      },
      ReturnFrom:function(inner)
      {
       return inner;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Html:{
      attr:Runtime.Class({},{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     Input:{
      ActivateButtonListener:Runtime.Field(function()
      {
       var _buttonListener_39_1,_;
       _buttonListener_39_1=function(evt,down)
       {
        var matchValue;
        matchValue=evt.button;
        return matchValue===0?Var1.Set(Input.MouseBtnSt1().Left,down):matchValue===1?Var1.Set(Input.MouseBtnSt1().Middle,down):matchValue===2?Var1.Set(Input.MouseBtnSt1().Right,down):null;
       };
       if(!Input.MouseBtnSt1().Active)
        {
         Input.MouseBtnSt1().Active=true;
         document.addEventListener("mousedown",function(evt)
         {
          return _buttonListener_39_1(evt,true);
         },false);
         _=document.addEventListener("mouseup",function(evt)
         {
          return _buttonListener_39_1(evt,false);
         },false);
        }
       else
        {
         _=null;
        }
       return _;
      }),
      ActivateKeyListener:Runtime.Field(function()
      {
       var _;
       if(!Input.KeyListenerState().KeyListenerActive)
        {
         jQuery(document).keydown(function(evt)
         {
          var keyCode,xs;
          keyCode=evt.which;
          Var1.Set(Input.KeyListenerState().LastPressed,keyCode);
          xs=Var.Get(Input.KeyListenerState().KeysPressed);
          return!Seq.exists(function(x)
          {
           return x===keyCode;
          },xs)?Var1.Set(Input.KeyListenerState().KeysPressed,List.append(xs,List.ofArray([keyCode]))):null;
         });
         _=void jQuery(document).keyup(function(evt)
         {
          var keyCode,predicate,arg10;
          keyCode=evt.which;
          predicate=function(x)
          {
           return x!==keyCode;
          };
          arg10=function(list)
          {
           return List.filter(predicate,list);
          };
          return Var1.Update(Input.KeyListenerState().KeysPressed,arg10);
         });
        }
       else
        {
         _=null;
        }
       return _;
      }),
      KeyListenerState:Runtime.Field(function()
      {
       return{
        KeysPressed:Var.Create(Runtime.New(T,{
         $:0
        })),
        KeyListenerActive:false,
        LastPressed:Var.Create(-1)
       };
      }),
      Keyboard:Runtime.Class({},{
       IsPressed:function(key)
       {
        var predicate;
        Input.ActivateKeyListener();
        predicate=function(x)
        {
         return x===key;
        };
        return View.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },Input.KeyListenerState().KeysPressed.get_View());
       },
       get_KeysPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().KeysPressed.get_View();
       },
       get_LastPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().LastPressed.get_View();
       }
      }),
      Mouse:Runtime.Class({},{
       get_LeftPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Left.get_View();
       },
       get_MiddlePressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Middle.get_View();
       },
       get_MousePressed:function()
       {
        Input.ActivateButtonListener();
        return View1.Apply(View1.Apply(View1.Apply(View.Const(function(l)
        {
         return function(m)
         {
          return function(r)
          {
           return(l?true:m)?true:r;
          };
         };
        }),Input.MouseBtnSt1().Left.get_View()),Input.MouseBtnSt1().Middle.get_View()),Input.MouseBtnSt1().Right.get_View());
       },
       get_Position:function()
       {
        var onMouseMove;
        onMouseMove=function(evt)
        {
         return Var1.Set(Input.MousePosSt1().PosV,[evt.clientX,evt.clientY]);
        };
        if(!Input.MousePosSt1().Active)
         {
          document.addEventListener("mousemove",onMouseMove,false);
          Input.MousePosSt1().Active=true;
         }
        return Input.MousePosSt1().PosV.get_View();
       },
       get_RightPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Right.get_View();
       }
      }),
      MouseBtnSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        Left:Var.Create(false),
        Middle:Var.Create(false),
        Right:Var.Create(false)
       };
      }),
      MousePosSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        PosV:Var.Create([0,0])
       };
      })
     },
     Interpolation1:Runtime.Class({},{
      get_Double:function()
      {
       return Runtime.New(DoubleInterpolation,{
        $:0
       });
      }
     }),
     Key:Runtime.Class({},{
      Fresh:function()
      {
       return Runtime.New(Key,{
        $:0,
        $0:Fresh.Int()
       });
      }
     }),
     ListModel:Runtime.Class({
      Add:function(item)
      {
       var v,m=this;
       v=Var.Get(this.Var);
       if(!ListModels.Contains(this.key,item,v))
        {
         v.push(item);
         return Var1.Set(this.Var,v);
        }
       else
        {
         Arrays.set(v,Arrays.findINdex(function(it)
         {
          return Unchecked.Equals(m.key.call(null,it),m.key.call(null,item));
         },v),item);
         return Var1.Set(m.Var,v);
        }
      },
      Clear:function()
      {
       return Var1.Set(this.Var,[]);
      },
      ContainsKey:function(key)
      {
       var m=this;
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },Var.Get(m.Var));
      },
      ContainsKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Seq.exists(predicate,array);
       },m.Var.get_View());
      },
      Find:function(pred)
      {
       return Arrays.find(pred,Var.Get(this.Var));
      },
      FindAsView:function(pred)
      {
       return View.Map(function(array)
       {
        return Arrays.find(pred,array);
       },this.Var.get_View());
      },
      FindByKey:function(key)
      {
       var m=this;
       return Arrays.find(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },Var.Get(m.Var));
      },
      FindByKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Arrays.find(predicate,array);
       },m.Var.get_View());
      },
      Iter:function(fn)
      {
       return Arrays.iter(fn,Var.Get(this.Var));
      },
      Lens:function(key)
      {
       return RefImpl1.New(this,key,function(x)
       {
        return x;
       },function()
       {
        return function(x)
        {
         return x;
        };
       });
      },
      Remove:function(item)
      {
       var v,keyFn,k;
       v=Var.Get(this.Var);
       if(ListModels.Contains(this.key,item,v))
        {
         keyFn=this.key;
         k=keyFn(item);
         return Var1.Set(this.Var,Arrays.filter(function(i)
         {
          return!Unchecked.Equals(keyFn(i),k);
         },v));
        }
       else
        {
         return null;
        }
      },
      RemoveBy:function(f)
      {
       return Var1.Set(this.Var,Arrays.filter(function(x)
       {
        return!f(x);
       },Var.Get(this.Var)));
      },
      RemoveByKey:function(key)
      {
       var m=this;
       return Var1.Set(this.Var,Arrays.filter(function(i)
       {
        return!Unchecked.Equals(m.key.call(null,i),key);
       },Var.Get(m.Var)));
      },
      Set:function(lst)
      {
       return Var1.Set(this.Var,Arrays.ofSeq(lst));
      },
      TryFind:function(pred)
      {
       return Arrays.tryFind(pred,Var.Get(this.Var));
      },
      TryFindAsView:function(pred)
      {
       return View.Map(function(array)
       {
        return Arrays.tryFind(pred,array);
       },this.Var.get_View());
      },
      TryFindByKey:function(key)
      {
       var m=this;
       return Arrays.tryFind(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },Var.Get(m.Var));
      },
      TryFindByKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Arrays.tryFind(predicate,array);
       },m.Var.get_View());
      },
      UpdateAll:function(fn)
      {
       return Var1.Update(this.Var,function(a)
       {
        Arrays.iteri(function(i)
        {
         return function(x)
         {
          return Option.iter(function(y)
          {
           return Arrays.set(a,i,y);
          },fn(x));
         };
        },a);
        return a;
       });
      },
      UpdateBy:function(fn,key)
      {
       var v,matchValue,m=this,index,matchValue1;
       v=Var.Get(this.Var);
       matchValue=Arrays.tryFindIndex(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },v);
       if(matchValue.$==1)
        {
         index=matchValue.$0;
         matchValue1=fn(Arrays.get(v,index));
         if(matchValue1.$==1)
          {
           Arrays.set(v,index,matchValue1.$0);
           return Var1.Set(m.Var,v);
          }
         else
          {
           return null;
          }
        }
       else
        {
         return null;
        }
      },
      get_Key:function()
      {
       return this.key;
      },
      get_Length:function()
      {
       return Arrays.length(Var.Get(this.Var));
      },
      get_LengthAsView:function()
      {
       return View.Map(function(arr)
       {
        return Arrays.length(arr);
       },this.Var.get_View());
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(key,init)
      {
       var _var;
       _var=Var.Create(Seq.toArray(Seq1.distinctBy(key,init)));
       return Runtime.New(ListModel,{
        key:key,
        Var:_var,
        view:View.Map(function(x)
        {
         return x.slice();
        },_var.get_View())
       });
      },
      FromSeq:function(xs)
      {
       return ListModel.Create(function(x)
       {
        return x;
       },xs);
      },
      View:function(m)
      {
       return m.view;
      }
     }),
     ListModel1:Runtime.Class({},{
      Key:function(m)
      {
       return m.key;
      }
     }),
     ListModels:{
      Contains:function(keyFn,item,xs)
      {
       var t;
       t=keyFn(item);
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(keyFn(it),t);
       },xs);
      }
     },
     Model:Runtime.Class({
      get_View:function()
      {
       return Model1.View(this);
      }
     },{
      Create:function(proj,init)
      {
       var _var;
       _var=Var.Create(init);
       return Runtime.New(Model,{
        $:0,
        $0:_var,
        $1:View.Map(proj,_var.get_View())
       });
      }
     }),
     Model1:Runtime.Class({},{
      Update:function(update,_arg1)
      {
       return Var1.Update(_arg1.$0,function(x)
       {
        update(x);
        return x;
       });
      },
      View:function(_arg2)
      {
       return _arg2.$1;
      }
     }),
     RefImpl:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.baseRef.Get());
      },
      Set:function(v)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(v);
       });
      },
      Update:function(f)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(f(_this.get.call(null,t)));
       });
      },
      UpdateMaybe:function(f)
      {
       var _this=this;
       return this.baseRef.UpdateMaybe(function(t)
       {
        return Option.map(_this.update.call(null,t),f(_this.get.call(null,t)));
       });
      },
      get_Id:function()
      {
       return this.id;
      },
      get_View:function()
      {
       return View.Map(this.get,this.baseRef.get_View());
      }
     },{
      New:function(baseRef,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.baseRef=baseRef;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     RefImpl1:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.m.FindByKey(this.key));
      },
      Set:function(v)
      {
       var r=this;
       return this.m.UpdateBy(function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(v)
        };
       },r.key);
      },
      Update:function(f)
      {
       var r=this;
       return this.m.UpdateBy(function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(f(r.get.call(null,i)))
        };
       },r.key);
      },
      UpdateMaybe:function(f)
      {
       var r=this;
       return this.m.UpdateBy(function(i)
       {
        return Option.map(r.update.call(null,i),f(r.get.call(null,i)));
       },r.key);
      },
      get_Id:function()
      {
       return this.id;
      },
      get_View:function()
      {
       return View.Map(this.get,this.m.FindByKeyAsView(this.key));
      }
     },{
      New:function(m,key,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.m=m;
       r.key=key;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     Route:{
      Append:function(_arg2,_arg1)
      {
       return{
        $:0,
        $0:AppendList1.Append(_arg2.$0,_arg1.$0)
       };
      },
      FromList:function(xs)
      {
       return{
        $:0,
        $0:AppendList1.FromArray(Arrays.ofSeq(xs))
       };
      },
      MakeHash:function(_arg1)
      {
       return Strings.concat("/",Arrays.map(function(x)
       {
        return encodeURIComponent(x);
       },AppendList1.ToArray(_arg1.$0)));
      },
      NoHash:function(s)
      {
       return Strings.StartsWith(s,"#")?s.substring(1):s;
      },
      ParseHash:function(hash)
      {
       return{
        $:0,
        $0:AppendList1.FromArray(Arrays.map(function(x)
        {
         return decodeURIComponent(x);
        },Strings.SplitChars(Route.NoHash(hash),[47],1)))
       };
      },
      SameHash:function(a,b)
      {
       return Route.NoHash(a)===Route.NoHash(b);
      },
      ToList:function(_arg1)
      {
       return List.ofArray(AppendList1.ToArray(_arg1.$0));
      }
     },
     RouteMap1:Runtime.Class({},{
      Create:function(ser,des)
      {
       return{
        Des:des,
        Ser:ser
       };
      },
      Install:function(map)
      {
       return Routing.InstallMap(map);
      }
     }),
     Router:Runtime.Class({},{
      Dir:function(prefix,sites)
      {
       return Router1.Prefix(prefix,Router1.Merge(sites));
      },
      Install:function(key,site)
      {
       return Routing.Install(key,site);
      }
     }),
     Router1:Runtime.Class({},{
      Merge:function(sites)
      {
       return Routing.MergeRouters(sites);
      },
      Prefix:function(prefix,_arg1)
      {
       return{
        $:0,
        $0:_arg1.$0,
        $1:Trie1.Prefix(prefix,_arg1.$1)
       };
      },
      Route:function(r,init,render)
      {
       return Routing.DefineRoute(r,init,render);
      }
     }),
     Routing:{
      ComputeBodies:function(trie)
      {
       var d;
       d=Dictionary.New12();
       Arrays.iter(function(body)
       {
        return d.set_Item(body.RouteId,body);
       },Trie1.ToArray(trie));
       return d;
      },
      DefineRoute:function(r,init,render)
      {
       var state,id,site,t;
       state=Var.Create(init);
       id=Fresh.Int();
       site=(render({
        $:0,
        $0:id
       }))(state);
       t=Trie1.Leaf({
        $:0,
        $0:id,
        $1:function(ctx)
        {
         View1.Sink(function(va)
         {
          return ctx.UpdateRoute.call(null,Routing.DoLink(r,va));
         },state.get_View());
         return{
          OnRouteChanged:function(route)
          {
           return Var1.Set(state,Routing.DoRoute(r,route));
          },
          OnSelect:function()
          {
           return ctx.UpdateRoute.call(null,Routing.DoLink(r,Var.Get(state)));
          },
          RouteId:id,
          RouteValue:site
         };
        }
       });
       return{
        $:0,
        $0:{
         $:1,
         $0:site
        },
        $1:t
       };
      },
      DoLink:function(map,va)
      {
       return Route.FromList(map.Ser.call(null,va));
      },
      DoRoute:function(map,route)
      {
       return map.Des.call(null,Route.ToList(route));
      },
      Install:function(key,_arg1)
      {
       var va,site,currentRoute,state,siteTrie,parseRoute,matchValue,glob,site1,updateRoute;
       va=_arg1.$0;
       site=_arg1.$1;
       currentRoute=Routing.InstallMap({
        Des:function(xs)
        {
         return Route.FromList(xs);
        },
        Ser:function(_arg00_)
        {
         return Route.ToList(_arg00_);
        }
       });
       state={
        Bodies:Abbrev.U(),
        CurrentRoute:currentRoute,
        CurrentSite:0,
        Selection:Abbrev.U()
       };
       siteTrie=Trie1.Map(function(prefix)
       {
        return function(_arg11)
        {
         var id;
         id=_arg11.$0;
         return _arg11.$1.call(null,{
          UpdateRoute:function(rest)
          {
           return Routing.OnInternalSiteUpdate(state,id,prefix,rest);
          }
         });
        };
       },site);
       state.Bodies=Routing.ComputeBodies(siteTrie);
       parseRoute=function(route)
       {
        return Trie1.Lookup(siteTrie,Route.ToList(route));
       };
       matchValue=parseRoute(Var.Get(currentRoute));
       if(matchValue.$==0)
        {
         site1=matchValue.$0;
         state.CurrentSite=site1.RouteId;
         glob=Var.Create(site1.RouteValue);
        }
       else
        {
         glob=Var.Create(va.$==1?va.$0:Operators.FailWith("Site.Install fails on empty site"));
        }
       state.Selection=glob;
       View1.Sink(function(site2)
       {
        return Routing.OnSelectSite(state,key(site2));
       },glob.get_View());
       updateRoute=function(route)
       {
        var matchValue1;
        matchValue1=parseRoute(route);
        return matchValue1.$==1?null:Routing.OnGlobalRouteChange(state,matchValue1.$0,Route.FromList(matchValue1.$1));
       };
       updateRoute(Var.Get(currentRoute));
       View1.Sink(updateRoute,currentRoute.get_View());
       return glob;
      },
      InstallMap:function(rt)
      {
       var cur,_var,onUpdate;
       cur=function()
       {
        return rt.Des.call(null,Route.ToList(Route.ParseHash(window.location.hash)));
       };
       _var=Var.Create(cur(null));
       onUpdate=function()
       {
        var value;
        value=cur(null);
        return!Unchecked.Equals(rt.Ser.call(null,Var.Get(_var)),rt.Ser.call(null,value))?Var1.Set(_var,value):null;
       };
       window.onpopstate=onUpdate;
       window.onhashchange=onUpdate;
       View1.Sink(function(loc)
       {
        var ha;
        ha=Route.MakeHash(Route.FromList(rt.Ser.call(null,loc)));
        return!Route.SameHash(window.location.hash,ha)?void(window.location.hash=ha):null;
       },_var.get_View());
       return _var;
      },
      MergeRouters:function(sites)
      {
       var sites1,merged,value;
       sites1=Seq.toArray(sites);
       merged=Trie1.Merge(Seq.map(function(_arg1)
       {
        return _arg1.$1;
       },sites1));
       value=Seq.tryPick(function(_arg2)
       {
        return _arg2.$0;
       },sites1);
       return merged.$==1?{
        $:0,
        $0:value,
        $1:merged.$0
       }:Operators.FailWith("Invalid Site.Merge: need more prefix disambiguation");
      },
      OnGlobalRouteChange:function(state,site,rest)
      {
       if(state.CurrentSite!==site.RouteId)
        {
         state.CurrentSite=site.RouteId;
         Var1.Set(state.Selection,site.RouteValue);
        }
       return site.OnRouteChanged.call(null,rest);
      },
      OnInternalSiteUpdate:function(state,ix,prefix,rest)
      {
       return state.CurrentSite===ix?Routing.SetCurrentRoute(state,Route.Append(Route.FromList(prefix),rest)):null;
      },
      OnSelectSite:function(state,_arg1)
      {
       var id;
       id=_arg1.$0;
       if(state.CurrentSite!==id)
        {
         state.CurrentSite=id;
         return state.Bodies.get_Item(id).OnSelect.call(null,null);
        }
       else
        {
         return null;
        }
      },
      SetCurrentRoute:function(state,route)
      {
       return!Unchecked.Equals(Var.Get(state.CurrentRoute),route)?Var1.Set(state.CurrentRoute,route):null;
      }
     },
     Snap1:{
      Bind:function(f,snap)
      {
       var res,onObs;
       res=Snap1.Create();
       onObs=function()
       {
        return Snap1.MarkObsolete(res);
       };
       Snap1.When(snap,function(x)
       {
        var y;
        y=f(x);
        return Snap1.When(y,function(v)
        {
         return(Snap1.IsForever(y)?Snap1.IsForever(snap):false)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
        },onObs);
       },onObs);
       return res;
      },
      Create:function()
      {
       return Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
      },
      CreateForever:function(v)
      {
       return Snap1.Make({
        $:0,
        $0:v
       });
      },
      CreateWithValue:function(v)
      {
       return Snap1.Make({
        $:2,
        $0:v,
        $1:[]
       });
      },
      IsForever:function(snap)
      {
       return snap.State.$==0?true:false;
      },
      IsObsolete:function(snap)
      {
       return snap.State.$==1?true:false;
      },
      Make:function(st)
      {
       return{
        State:st
       };
      },
      Map:function(fn,sn)
      {
       var matchValue,res;
       matchValue=sn.State;
       if(matchValue.$==0)
        {
         return Snap1.CreateForever(fn(matchValue.$0));
        }
       else
        {
         res=Snap1.Create();
         Snap1.When(sn,function(x)
         {
          return Snap1.MarkDone(res,sn,fn(x));
         },function()
         {
          return Snap1.MarkObsolete(res);
         });
         return res;
        }
      },
      Map2:function(fn,sn1,sn2)
      {
       var matchValue,y,y1,res,v1,v2,obs,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           y=matchValue[1].$0;
           return Snap1.CreateForever((fn(matchValue[0].$0))(y));
          }
         else
          {
           return Snap1.Map(fn(matchValue[0].$0),sn2);
          }
        }
       else
        {
         if(matchValue[1].$==0)
          {
           y1=matchValue[1].$0;
           return Snap1.Map(function(x)
           {
            return(fn(x))(y1);
           },sn1);
          }
         else
          {
           res=Snap1.Create();
           v1=[{
            $:0
           }];
           v2=[{
            $:0
           }];
           obs=function()
           {
            v1[0]={
             $:0
            };
            v2[0]={
             $:0
            };
            return Snap1.MarkObsolete(res);
           };
           cont=function()
           {
            var matchValue1,x,y2;
            matchValue1=[v1[0],v2[0]];
            if(matchValue1[0].$==1)
             {
              if(matchValue1[1].$==1)
               {
                x=matchValue1[0].$0;
                y2=matchValue1[1].$0;
                return(Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.MarkForever(res,(fn(x))(y2)):Snap1.MarkReady(res,(fn(x))(y2));
               }
              else
               {
                return null;
               }
             }
            else
             {
              return null;
             }
           };
           Snap1.When(sn1,function(x)
           {
            v1[0]={
             $:1,
             $0:x
            };
            return cont(null);
           },obs);
           Snap1.When(sn2,function(y2)
           {
            v2[0]={
             $:1,
             $0:y2
            };
            return cont(null);
           },obs);
           return res;
          }
        }
      },
      MapAsync:function(fn,snap)
      {
       var res;
       res=Snap1.Create();
       Snap1.When(snap,function(v)
       {
        return Async.StartTo(fn(v),function(v1)
        {
         return Snap1.MarkDone(res,snap,v1);
        });
       },function()
       {
        return Snap1.MarkObsolete(res);
       });
       return res;
      },
      MarkDone:function(res,sn,v)
      {
       return Snap1.IsForever(sn)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
      },
      MarkForever:function(sn,v)
      {
       var matchValue,q;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q=matchValue.$0;
         sn.State={
          $:0,
          $0:v
         };
         return JQueue.Iter(function(k)
         {
          return k(v);
         },q);
        }
       else
        {
         return null;
        }
      },
      MarkObsolete:function(sn)
      {
       var matchValue,ks,ks1;
       matchValue=sn.State;
       if(matchValue.$==1)
        {
         return null;
        }
       else
        {
         if(matchValue.$==2)
          {
           ks=matchValue.$1;
           sn.State={
            $:1
           };
           return JQueue.Iter(function(k)
           {
            return k(null);
           },ks);
          }
         else
          {
           if(matchValue.$==3)
            {
             ks1=matchValue.$1;
             sn.State={
              $:1
             };
             return JQueue.Iter(function(k)
             {
              return k(null);
             },ks1);
            }
           else
            {
             return null;
            }
          }
        }
      },
      MarkReady:function(sn,v)
      {
       var matchValue,q1;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q1=matchValue.$0;
         sn.State={
          $:2,
          $0:v,
          $1:matchValue.$1
         };
         return JQueue.Iter(function(k)
         {
          return k(v);
         },q1);
        }
       else
        {
         return null;
        }
      },
      SnapshotOn:function(sn1,sn2)
      {
       var matchValue,res,v,triggered,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[1].$==0)
        {
         return Snap1.CreateForever(matchValue[1].$0);
        }
       else
        {
         res=Snap1.Create();
         v=[{
          $:0
         }];
         triggered=[false];
         cont=function()
         {
          var matchValue1;
          if(triggered[0])
           {
            matchValue1=v[0];
            return matchValue1.$==1?Snap1.IsForever(sn2)?Snap1.MarkForever(res,matchValue1.$0):matchValue1.$==1?Snap1.MarkReady(res,matchValue1.$0):null:matchValue1.$==1?Snap1.MarkReady(res,matchValue1.$0):null;
           }
          else
           {
            return null;
           }
         };
         Snap1.When(sn1,function()
         {
          triggered[0]=true;
          return cont(null);
         },function()
         {
          v[0]={
           $:0
          };
          return Snap1.MarkObsolete(res);
         });
         Snap1.When(sn2,function(y)
         {
          v[0]={
           $:1,
           $0:y
          };
          return cont(null);
         },function()
         {
         });
         return res;
        }
      },
      When:function(snap,avail,obsolete)
      {
       var matchValue,v,q2;
       matchValue=snap.State;
       if(matchValue.$==1)
        {
         return obsolete(null);
        }
       else
        {
         if(matchValue.$==2)
          {
           v=matchValue.$0;
           JQueue.Add(obsolete,matchValue.$1);
           return avail(v);
          }
         else
          {
           if(matchValue.$==3)
            {
             q2=matchValue.$1;
             JQueue.Add(avail,matchValue.$0);
             return JQueue.Add(obsolete,q2);
            }
           else
            {
             return avail(matchValue.$0);
            }
          }
        }
      }
     },
     Submitter:Runtime.Class({
      Trigger:function()
      {
       return Var1.Set(this["var"],null);
      },
      get_Input:function()
      {
       return this.input;
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(input,init)
      {
       return Submitter.New(input,init);
      },
      New:function(input,init)
      {
       var r,arg20;
       r=Runtime.New(this,{});
       r.input=input;
       r["var"]=Var.Create(null);
       arg20=r.input;
       r.view=View.SnapshotOn(init,r["var"].get_View(),arg20);
       return r;
      }
     }),
     Submitter1:Runtime.Class({},{
      Input:function(s)
      {
       return s.get_Input();
      },
      Trigger:function(s)
      {
       return s.Trigger();
      },
      View:function(s)
      {
       return s.get_View();
      }
     }),
     Trans:Runtime.Class({},{
      AnimateChange:function(tr,x,y)
      {
       return(tr.TChange.call(null,x))(y);
      },
      AnimateEnter:function(tr,x)
      {
       return tr.TEnter.call(null,x);
      },
      AnimateExit:function(tr,x)
      {
       return tr.TExit.call(null,x);
      },
      CanAnimateChange:function(tr)
      {
       return(tr.TFlags&1)!==0;
      },
      CanAnimateEnter:function(tr)
      {
       return(tr.TFlags&2)!==0;
      },
      CanAnimateExit:function(tr)
      {
       return(tr.TFlags&4)!==0;
      },
      Trivial:function()
      {
       return{
        TChange:function()
        {
         return function(y)
         {
          return An.Const(y);
         };
        },
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:0
       };
      }
     }),
     Trans1:Runtime.Class({},{
      Change:function(ch,tr)
      {
       return{
        TChange:ch,
        TEnter:tr.TEnter,
        TExit:tr.TExit,
        TFlags:tr.TFlags|1
       };
      },
      Create:function(ch)
      {
       return{
        TChange:ch,
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:1
       };
      },
      Enter:function(f,tr)
      {
       return{
        TChange:tr.TChange,
        TEnter:f,
        TExit:tr.TExit,
        TFlags:tr.TFlags|2
       };
      },
      Exit:function(f,tr)
      {
       return{
        TChange:tr.TChange,
        TEnter:tr.TEnter,
        TExit:f,
        TFlags:tr.TFlags|4
       };
      }
     }),
     Trie1:{
      AllSome:function(xs)
      {
       var e,r,ok,matchValue;
       e=Enumerator.Get(xs);
       r=ResizeArrayProxy.New2();
       ok=true;
       while(ok?e.MoveNext():false)
        {
         matchValue=e.get_Current();
         if(matchValue.$==1)
          {
           r.Add(matchValue.$0);
          }
         else
          {
           ok=false;
          }
        }
       return ok?{
        $:1,
        $0:r.ToArray()
       }:{
        $:0
       };
      },
      Empty:function()
      {
       return{
        $:1
       };
      },
      IsLeaf:function(t)
      {
       return t.$==2?true:false;
      },
      Leaf:function(v)
      {
       return{
        $:2,
        $0:v
       };
      },
      Look:function(key,trie)
      {
       var matchValue,ks,matchValue1;
       matchValue=[trie,key];
       if(matchValue[0].$==2)
        {
         return{
          $:0,
          $0:matchValue[0].$0,
          $1:key
         };
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             ks=matchValue[1].$1;
             matchValue1=MapModule.TryFind(matchValue[1].$0,matchValue[0].$0);
             return matchValue1.$==0?{
              $:1
             }:Trie1.Look(ks,matchValue1.$0);
            }
           else
            {
             return{
              $:1
             };
            }
          }
         else
          {
           return{
            $:1
           };
          }
        }
      },
      Lookup:function(trie,key)
      {
       return Trie1.Look(Seq.toList(key),trie);
      },
      Map:function(f,trie)
      {
       return Trie1.MapLoop(Runtime.New(T,{
        $:0
       }),f,trie);
      },
      MapLoop:function(loc,f,trie)
      {
       var x;
       if(trie.$==1)
        {
         return{
          $:1
         };
        }
       else
        {
         if(trie.$==2)
          {
           x=trie.$0;
           return{
            $:2,
            $0:(f(loc))(x)
           };
          }
         else
          {
           return Trie1.TrieBranch(MapModule.Map(function(k)
           {
            return function(v)
            {
             return Trie1.MapLoop(List.append(loc,List.ofArray([k])),f,v);
            };
           },trie.$0));
          }
        }
      },
      Mapi:function(f,trie)
      {
       var counter;
       counter=[0];
       return Trie1.Map(function(x)
       {
        var c;
        c=counter[0];
        counter[0]=c+1;
        return(f(c))(x);
       },trie);
      },
      Merge:function(ts)
      {
       var ts1,matchValue;
       ts1=Seq.toArray(ts);
       matchValue=Arrays.length(ts1);
       return matchValue===0?{
        $:1,
        $0:{
         $:1
        }
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(ts1,0)
       }:Seq.exists(function(t)
       {
        return Trie1.IsLeaf(t);
       },ts1)?{
        $:0
       }:Option.map(function(xs)
       {
        return Trie1.TrieBranch(xs);
       },Trie1.MergeMaps(function(_arg00_)
       {
        return Trie1.Merge(_arg00_);
       },Seq.choose(function(_arg1)
       {
        return _arg1.$==0?{
         $:1,
         $0:_arg1.$0
        }:{
         $:0
        };
       },ts1)));
      },
      MergeMaps:function(merge,maps)
      {
       var x;
       x=Seq.collect(function(table)
       {
        return MapModule.ToSeq(table);
       },maps);
       return Option.map(function(elements)
       {
        return MapModule.OfArray(Seq.toArray(elements));
       },Trie1.AllSome(Seq.map(function(tupledArg)
       {
        var k;
        k=tupledArg[0];
        return Option.map(function(v)
        {
         return[k,v];
        },merge(tupledArg[1]));
       },MapModule.ToSeq(Seq.fold(function(s)
       {
        return function(tupledArg)
        {
         return Trie1.MultiAdd(tupledArg[0],tupledArg[1],s);
        };
       },FSharpMap.New1([]),x)))));
      },
      MultiAdd:function(key,value,map)
      {
       return map.Add(key,Runtime.New(T,{
        $:1,
        $0:value,
        $1:Trie1.MultiFind(key,map)
       }));
      },
      MultiFind:function(key,map)
      {
       return Operators.DefaultArg(MapModule.TryFind(key,map),Runtime.New(T,{
        $:0
       }));
      },
      Prefix:function(key,trie)
      {
       return Trie1.TrieBranch(FSharpMap.New1(List.ofArray([[key,trie]])));
      },
      ToArray:function(trie)
      {
       var all;
       all=[];
       Trie1.Map(function()
       {
        return function(v)
        {
         return JQueue.Add(v,all);
        };
       },trie);
       return JQueue.ToArray(all);
      },
      TrieBranch:function(xs)
      {
       return xs.get_IsEmpty()?{
        $:1
       }:{
        $:0,
        $0:xs
       };
      }
     },
     Var:Runtime.Class({
      Get:function()
      {
       return Var.Get(this);
      },
      Set:function(v)
      {
       return Var1.Set(this,v);
      },
      Update:function(f)
      {
       return Var1.Update(this,f);
      },
      UpdateMaybe:function(f)
      {
       var matchValue;
       matchValue=f(Var.Get(this));
       return matchValue.$==1?Var1.Set(this,matchValue.$0):null;
      },
      get_Id:function()
      {
       return"uinref"+Global.String(Var1.GetId(this));
      },
      get_View:function()
      {
       var _this=this;
       return{
        $:0,
        $0:function()
        {
         return Var1.Observe(_this);
        }
       };
      },
      get_View1:function()
      {
       return this.get_View();
      }
     },{
      Create:function(v)
      {
       return Runtime.New(Var,{
        Const:false,
        Current:v,
        Snap:Snap1.CreateWithValue(v),
        Id:Fresh.Int()
       });
      },
      Get:function(_var)
      {
       return _var.Current;
      }
     }),
     Var1:Runtime.Class({},{
      GetId:function(_var)
      {
       return _var.Id;
      },
      Lens:function(iref,get,update)
      {
       return RefImpl.New(iref,get,update);
      },
      Observe:function(_var)
      {
       return _var.Snap;
      },
      Set:function(_var,value)
      {
       if(_var.Const)
        {
         return null;
        }
       else
        {
         Snap1.MarkObsolete(_var.Snap);
         _var.Current=value;
         _var.Snap=Snap1.CreateWithValue(value);
         return;
        }
      },
      SetFinal:function(_var,value)
      {
       if(_var.Const)
        {
         return null;
        }
       else
        {
         _var.Const=true;
         _var.Current=value;
         _var.Snap=Snap1.CreateForever(value);
         return;
        }
      },
      Update:function(_var,fn)
      {
       return Var1.Set(_var,fn(Var.Get(_var)));
      }
     }),
     View:Runtime.Class({},{
      Bind:function(fn,view)
      {
       return View.Join(View.Map(fn,view));
      },
      Const:function(x)
      {
       var o;
       o=Snap1.CreateForever(x);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      Convert:function(conv,view)
      {
       return View.ConvertBy(function(x)
       {
        return x;
       },conv,view);
      },
      ConvertBy:function(key,conv,view)
      {
       var state;
       state=[Dictionary.New12()];
       return View.Map(function(xs)
       {
        var prevState,newState,result;
        prevState=state[0];
        newState=Dictionary.New12();
        result=Arrays.map(function(x)
        {
         var k,res;
         k=key(x);
         res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
         newState.set_Item(k,res);
         return res;
        },Seq.toArray(xs));
        state[0]=newState;
        return result;
       },view);
      },
      ConvertSeq:function(conv,view)
      {
       return View.ConvertSeqBy(function(x)
       {
        return x;
       },function()
       {
        return function(v)
        {
         return conv(v);
        };
       },view);
      },
      ConvertSeqBy:function(key,conv,view)
      {
       var state;
       state=[Dictionary.New12()];
       return View.Map(function(xs)
       {
        var prevState,newState,result;
        prevState=state[0];
        newState=Dictionary.New12();
        result=Arrays.map(function(x)
        {
         var k,node,n;
         k=key(x);
         if(prevState.ContainsKey(k))
          {
           n=prevState.get_Item(k);
           Var1.Set(n.NVar,x);
           node=n;
          }
         else
          {
           node=View.ConvertSeqNode(function(v)
           {
            return(conv(k))(v);
           },x);
          }
         newState.set_Item(k,node);
         return node.NValue;
        },Seq.toArray(xs));
        state[0]=newState;
        return result;
       },view);
      },
      ConvertSeqNode:function(conv,value)
      {
       var _var,view;
       _var=Var.Create(value);
       view=_var.get_View();
       return{
        NValue:conv(view),
        NVar:_var,
        NView:view
       };
      },
      CreateLazy:function(observe)
      {
       var cur;
       cur=[{
        $:0
       }];
       return{
        $:0,
        $0:function()
        {
         var matchValue,sn,sn1;
         matchValue=cur[0];
         if(matchValue.$==1)
          {
           if(!Snap1.IsObsolete(matchValue.$0))
            {
             return matchValue.$0;
            }
           else
            {
             sn=observe(null);
             cur[0]={
              $:1,
              $0:sn
             };
             return sn;
            }
          }
         else
          {
           sn1=observe(null);
           cur[0]={
            $:1,
            $0:sn1
           };
           return sn1;
          }
        }
       };
      },
      CreateLazy2:function(snapFn,_arg3,_arg2)
      {
       var o1,o2;
       o1=_arg3.$0;
       o2=_arg2.$0;
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        return(snapFn(s1))(s2);
       });
      },
      Join:function(_arg7)
      {
       var observe;
       observe=_arg7.$0;
       return View.CreateLazy(function()
       {
        return Snap1.Bind(function(_arg2)
        {
         return _arg2.$0.call(null,null);
        },observe(null));
       });
      },
      Map:function(fn,_arg1)
      {
       var observe;
       observe=_arg1.$0;
       return View.CreateLazy(function()
       {
        return Snap1.Map(fn,observe(null));
       });
      },
      Map2:function(fn,v1,v2)
      {
       return View.CreateLazy2(function(_arg10_)
       {
        return function(_arg20_)
        {
         return Snap1.Map2(fn,_arg10_,_arg20_);
        };
       },v1,v2);
      },
      MapAsync:function(fn,_arg4)
      {
       var observe;
       observe=_arg4.$0;
       return View.CreateLazy(function()
       {
        return Snap1.MapAsync(fn,observe(null));
       });
      },
      SnapshotOn:function(def,_arg6,_arg5)
      {
       var o1,o2,res,init;
       o1=_arg6.$0;
       o2=_arg5.$0;
       res=Snap1.CreateWithValue(def);
       init=[false];
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        if(init[0])
         {
          return Snap1.SnapshotOn(s1,s2);
         }
        else
         {
          Snap1.When(Snap1.SnapshotOn(s1,s2),function()
          {
           return null;
          },function()
          {
           if(!init[0])
            {
             init[0]=true;
             return Snap1.MarkObsolete(res);
            }
           else
            {
             return null;
            }
          });
          return res;
         }
       });
      },
      UpdateWhile:function(def,v1,v2)
      {
       var value;
       value=[def];
       return View.Map2(function(pred)
       {
        return function(v)
        {
         if(pred)
          {
           value[0]=v;
          }
         return value[0];
        };
       },v1,v2);
      },
      get_Do:function()
      {
       return{
        $:0
       };
      }
     }),
     View1:Runtime.Class({},{
      Apply:function(fn,view)
      {
       return View.Map2(function(f)
       {
        return function(x)
        {
         return f(x);
        };
       },fn,view);
      },
      Sink:function(act,_arg8)
      {
       var observe,loop;
       observe=_arg8.$0;
       loop=function()
       {
        return Snap1.When(observe(null),act,function()
        {
         return Async.Schedule(loop);
        });
       };
       return Async.Schedule(loop);
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Abbrev=Runtime.Safe(Next.Abbrev);
  Fresh=Runtime.Safe(Abbrev.Fresh);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  HashSet=Runtime.Safe(Abbrev.HashSet);
  JQueue=Runtime.Safe(Abbrev.JQueue);
  Slot1=Runtime.Safe(Abbrev.Slot1);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  An=Runtime.Safe(Next.An);
  AppendList1=Runtime.Safe(Next.AppendList1);
  Anims=Runtime.Safe(Next.Anims);
  window=Runtime.Safe(Global.window);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  Array1=Runtime.Safe(Next.Array);
  Trans=Runtime.Safe(Next.Trans);
  Option=Runtime.Safe(Global.WebSharper.Option);
  View=Runtime.Safe(Next.View);
  Client=Runtime.Safe(Next.Client);
  Attrs=Runtime.Safe(Client.Attrs);
  DomUtility=Runtime.Safe(Next.DomUtility);
  AttrProxy=Runtime.Safe(Client.AttrProxy);
  List=Runtime.Safe(Global.WebSharper.List);
  Attr=Runtime.Safe(Client.Attr);
  AnimatedAttrNode=Runtime.Safe(Client.AnimatedAttrNode);
  DynamicAttrNode=Runtime.Safe(Client.DynamicAttrNode);
  document=Runtime.Safe(Global.document);
  Docs=Runtime.Safe(Client.Docs);
  View1=Runtime.Safe(Next.View1);
  Mailbox=Runtime.Safe(Abbrev.Mailbox);
  Doc=Runtime.Safe(Client.Doc);
  UINextPagelet=Runtime.Safe(Client.UINextPagelet);
  Elt=Runtime.Safe(Client.Elt);
  Seq1=Runtime.Safe(Global.Seq);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  NodeSet=Runtime.Safe(Docs.NodeSet);
  DocElemNode=Runtime.Safe(Client.DocElemNode);
  DomNodes=Runtime.Safe(Docs.DomNodes);
  Var1=Runtime.Safe(Next.Var1);
  Var=Runtime.Safe(Next.Var);
  RegExp=Runtime.Safe(Global.RegExp);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client1=Runtime.Safe(Html.Client);
  Pagelet=Runtime.Safe(Client1.Pagelet);
  Attr1=Runtime.Safe(Client1.Attr);
  Tags=Runtime.Safe(Client1.Tags);
  jQuery=Runtime.Safe(Global.jQuery);
  Easing=Runtime.Safe(Next.Easing);
  Easings=Runtime.Safe(Next.Easings);
  FlowBuilder=Runtime.Safe(Next.FlowBuilder);
  Flow=Runtime.Safe(Next.Flow);
  Input=Runtime.Safe(Next.Input);
  T=Runtime.Safe(List.T);
  DoubleInterpolation=Runtime.Safe(Next.DoubleInterpolation);
  Key=Runtime.Safe(Next.Key);
  ListModels=Runtime.Safe(Next.ListModels);
  RefImpl1=Runtime.Safe(Next.RefImpl1);
  ListModel=Runtime.Safe(Next.ListModel);
  Model1=Runtime.Safe(Next.Model1);
  Model=Runtime.Safe(Next.Model);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  encodeURIComponent=Runtime.Safe(Global.encodeURIComponent);
  decodeURIComponent=Runtime.Safe(Global.decodeURIComponent);
  Route=Runtime.Safe(Next.Route);
  Routing=Runtime.Safe(Next.Routing);
  Router1=Runtime.Safe(Next.Router1);
  Trie1=Runtime.Safe(Next.Trie1);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Snap1=Runtime.Safe(Next.Snap1);
  Async=Runtime.Safe(Abbrev.Async);
  Submitter=Runtime.Safe(Next.Submitter);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  return RefImpl=Runtime.Safe(Next.RefImpl);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Elt,Doc);
  Runtime.Inherit(UINextPagelet,Pagelet);
  Input.MousePosSt1();
  Input.MouseBtnSt1();
  Input.KeyListenerState();
  Input.ActivateKeyListener();
  Input.ActivateButtonListener();
  Easings.CubicInOut();
  DomUtility.Doc();
  Attrs.EmptyAttr();
  Fresh.counter();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Testing,Pervasives,SubtestBuilder,Random,Sample,Runner,Concurrency,Math,Unchecked,List,TestBuilder,QUnit,TestCategoryBuilder,Arrays,NaN1,Infinity1,Seq,Operators,String,Runner1,RunnerControlBody,document;
 Runtime.Define(Global,{
  WebSharper:{
   Testing:{
    Pervasives:{
     Do:Runtime.Field(function()
     {
      return SubtestBuilder.New();
     }),
     PropertyWith:function(name,gen,f)
     {
      var _builder_;
      _builder_=Pervasives.Test(name);
      return _builder_.Run(_builder_.PropertyWithSample(_builder_.Yield(null),function()
      {
       return Sample.Make(gen,100);
      },function()
      {
       return f;
      }));
     },
     PropertyWithSample:function(name,set,f)
     {
      var _builder_;
      _builder_=Pervasives.Test(name);
      return _builder_.Run(_builder_.PropertyWithSample(_builder_.Yield(null),function()
      {
       return set;
      },function()
      {
       return f;
      }));
     },
     Runner:{
      AddTest:function(t,r,asserter)
      {
       var f,x;
       f=function(args)
       {
        (t(asserter))(args);
        return args;
       };
       x=r(asserter);
       return Runner.Map(f,x);
      },
      AddTestAsync:function(t,r,asserter)
      {
       var f,x;
       f=function(args)
       {
        return Concurrency.Delay(function()
        {
         return Concurrency.Bind((t(asserter))(args),function()
         {
          return Concurrency.Return(args);
         });
        });
       };
       x=r(asserter);
       return Runner.MapAsync(f,x);
      },
      Bind:function(f,x)
      {
       var _,args,args1;
       if(x.$==1)
        {
         args=x.$0;
         _={
          $:1,
          $0:Concurrency.Delay(function()
          {
           return Concurrency.Bind(args,function(_arg1)
           {
            return Runner.ToAsync(f(_arg1));
           });
          })
         };
        }
       else
        {
         args1=x.$0;
         _=f(args1);
        }
       return _;
      },
      Map:function(f,x)
      {
       var _,args,args1;
       if(x.$==1)
        {
         args=x.$0;
         _={
          $:1,
          $0:Concurrency.Delay(function()
          {
           return Concurrency.Bind(args,function(_arg1)
           {
            return Concurrency.Return(f(_arg1));
           });
          })
         };
        }
       else
        {
         args1=x.$0;
         _={
          $:0,
          $0:f(args1)
         };
        }
       return _;
      },
      MapAsync:function(f,x)
      {
       var _,args,args1;
       if(x.$==1)
        {
         args=x.$0;
         _={
          $:1,
          $0:Concurrency.Delay(function()
          {
           return Concurrency.Bind(args,function(_arg1)
           {
            return f(_arg1);
           });
          })
         };
        }
       else
        {
         args1=x.$0;
         _={
          $:1,
          $0:f(args1)
         };
        }
       return _;
      },
      ToAsync:function(x)
      {
       var _,args,args1;
       if(x.$==1)
        {
         args=x.$0;
         _=args;
        }
       else
        {
         args1=x.$0;
         _=Concurrency.Delay(function()
         {
          return Concurrency.Return(args1);
         });
        }
       return _;
      }
     },
     SubtestBuilder:Runtime.Class({
      ApproxEqual:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Math.abs(actual1-expected1)<0.0001,actual1,expected1);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      ApproxEqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg9)
          {
           return Concurrency.Return(asserter.push(Math.abs(_arg9-expected1)<0.0001,_arg9,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      ApproxEqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Math.abs(actual1-expected1)<0.0001,actual1,expected1,message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      ApproxEqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg10)
          {
           return Concurrency.Return(asserter.push(Math.abs(_arg10-expected1)<0.0001,_arg10,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      Bind:function(a,f)
      {
       return function(asserter)
       {
        return{
         $:1,
         $0:Concurrency.Delay(function()
         {
          return Concurrency.Bind(a,function(_arg21)
          {
           var matchValue,_,b,b1;
           matchValue=(f(_arg21))(asserter);
           if(matchValue.$==1)
            {
             b=matchValue.$0;
             _=b;
            }
           else
            {
             b1=matchValue.$0;
             _=Concurrency.Return(b1);
            }
           return _;
          });
         })
        };
       };
      },
      DeepEqual:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.deepEqual(actual(args),expected(args));
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      DeepEqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg7)
          {
           return Concurrency.Return(asserter.deepEqual(_arg7,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      DeepEqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.deepEqual(actual(args),expected(args),message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      DeepEqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg8)
          {
           return Concurrency.Return(asserter.deepEqual(_arg8,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      Equal:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Unchecked.Equals(actual1,expected1),actual1,expected1);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      EqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg1)
          {
           return Concurrency.Return(asserter.push(Unchecked.Equals(_arg1,expected1),_arg1,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      EqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Unchecked.Equals(actual1,expected1),actual1,expected1,message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      EqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg2)
          {
           return Concurrency.Return(asserter.push(Unchecked.Equals(_arg2,expected1),_arg2,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      Expect:function(r,assertionCount)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.expect(assertionCount(args));
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      For:function(sample,f)
      {
       return function(asserter)
       {
        var loop,_,_1,_2,l,e,r,f1,x,_3;
        loop=[];
        _=sample.get_Data();
        _1={
         $:0,
         $0:undefined
        };
        loop[2]=_;
        loop[1]=_1;
        loop[0]=1;
        while(loop[0])
         {
          if(loop[2].$==1)
           {
            l=loop[2].$1;
            e=loop[2].$0;
            r=f(e);
            f1=function()
            {
             return r(asserter);
            };
            x=loop[1];
            _3=Runner.Bind(f1,x);
            loop[2]=l;
            loop[1]=_3;
            _2=void(loop[0]=1);
           }
          else
           {
            loop[0]=0;
            _2=void(loop[1]=loop[1]);
           }
         }
        return loop[1];
       };
      },
      For1:function(gen,f)
      {
       return this.For(Sample.New(gen),f);
      },
      For2:function(r,y)
      {
       return function(asserter)
       {
        var matchValue,_,a,a1;
        matchValue=r(asserter);
        if(matchValue.$==1)
         {
          a=matchValue.$0;
          _={
           $:1,
           $0:Concurrency.Delay(function()
           {
            return Concurrency.Bind(a,function(_arg22)
            {
             var matchValue1,_1,b,b1;
             matchValue1=(y(_arg22))(asserter);
             if(matchValue1.$==1)
              {
               b=matchValue1.$0;
               _1=b;
              }
             else
              {
               b1=matchValue1.$0;
               _1=Concurrency.Return(b1);
              }
             return _1;
            });
           })
          };
         }
        else
         {
          a1=matchValue.$0;
          _=(y(a1))(asserter);
         }
        return _;
       };
      },
      ForEach:function(r,src,attempt)
      {
       return function(asserter)
       {
        var loop,f2,x1;
        loop=function(attempt1,acc,src1)
        {
         var _,l,e,r1,f;
         if(src1.$==1)
          {
           l=src1.$1;
           e=src1.$0;
           r1=attempt1(e);
           f=function(args)
           {
            var f1,x;
            f1=function()
            {
             return args;
            };
            x=r1(asserter);
            return Runner.Map(f1,x);
           };
           _=loop(attempt1,Runner.Bind(f,acc),l);
          }
         else
          {
           _=acc;
          }
         return _;
        };
        f2=function(args)
        {
         return loop(attempt(args),{
          $:0,
          $0:args
         },List.ofSeq(src(args)));
        };
        x1=r(asserter);
        return Runner.Bind(f2,x1);
       };
      },
      IsFalse:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.ok(!value(args));
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      IsFalseAsync:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          return Concurrency.Bind(value(args),function(_arg15)
          {
           return Concurrency.Return(asserter.ok(!_arg15));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      IsFalseAsync1:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          return Concurrency.Bind(value(args),function(_arg16)
          {
           return Concurrency.Return(asserter.ok(!_arg16,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      IsFalseMsg:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.ok(!value(args),message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      IsTrue:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.ok(value(args));
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      IsTrueAsync:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          return Concurrency.Bind(value(args),function(_arg13)
          {
           return Concurrency.Return(asserter.ok(_arg13));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      IsTrueMsg:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.ok(value(args),message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      IsTrueMsgAsync:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          return Concurrency.Bind(value(args),function(_arg14)
          {
           return Concurrency.Return(asserter.ok(_arg14,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      JsEqual:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.equal(actual(args),expected(args));
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      JsEqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg5)
          {
           return Concurrency.Return(asserter.equal(_arg5,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      JsEqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return asserter.equal(actual(args),expected(args),message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      JsEqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg6)
          {
           return Concurrency.Return(asserter.equal(_arg6,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      NotApproxEqual:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Math.abs(actual1-expected1)>0.0001,actual1,expected1);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      NotApproxEqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg11)
          {
           return Concurrency.Return(asserter.push(Math.abs(_arg11-expected1)>0.0001,_arg11,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      NotApproxEqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(Math.abs(actual1-expected1)>0.0001,actual1,expected1,message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      NotApproxEqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg12)
          {
           return Concurrency.Return(asserter.push(Math.abs(_arg12-expected1)>0.0001,_arg12,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      NotEqual:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(!Unchecked.Equals(actual1,expected1),actual1,expected1);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      NotEqualAsync:function(r,actual,expected)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg3)
          {
           return Concurrency.Return(asserter.push(!Unchecked.Equals(_arg3,expected1),_arg3,expected1));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      NotEqualMsg:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var actual1,expected1;
         actual1=actual(args);
         expected1=expected(args);
         return asserter.push(!Unchecked.Equals(actual1,expected1),actual1,expected1,message);
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      NotEqualMsgAsync:function(r,actual,expected,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         return Concurrency.Delay(function()
         {
          var expected1;
          expected1=expected(args);
          return Concurrency.Bind(actual(args),function(_arg4)
          {
           return Concurrency.Return(asserter.push(!Unchecked.Equals(_arg4,expected1),_arg4,expected1,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      PropertyWithSample:function(r,sample,attempt)
      {
       return function(asserter)
       {
        var loop,f2,x1;
        loop=function(attempt1,acc,src)
        {
         var _,l,e,r1,f;
         if(src.$==1)
          {
           l=src.$1;
           e=src.$0;
           r1=attempt1(e);
           f=function(args)
           {
            var f1,x;
            f1=function()
            {
             return args;
            };
            x=r1(asserter);
            return Runner.Map(f1,x);
           };
           _=loop(attempt1,Runner.Bind(f,acc),l);
          }
         else
          {
           _=acc;
          }
         return _;
        };
        f2=function(args)
        {
         var sample1;
         sample1=sample(args);
         return loop(attempt(args),{
          $:0,
          $0:args
         },sample1.get_Data());
        };
        x1=r(asserter);
        return Runner.Bind(f2,x1);
       };
      },
      Raises:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var _,value1,matchValue;
         try
         {
          value1=value(args);
          _=asserter.ok(false,"Expected raised exception");
         }
         catch(matchValue)
         {
          _=asserter.ok(true);
         }
         return _;
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      RaisesAsync:function(r,value)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var value1;
         value1=value(args);
         return Concurrency.Delay(function()
         {
          return Concurrency.TryWith(Concurrency.Delay(function()
          {
           return Concurrency.Bind(value1,function()
           {
            return Concurrency.Return(asserter.ok(false,"Expected raised exception"));
           });
          }),function()
          {
           return Concurrency.Return(asserter.ok(true));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      RaisesMsg:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var _,value1,matchValue;
         try
         {
          value1=value(args);
          _=asserter.ok(false,message);
         }
         catch(matchValue)
         {
          _=asserter.ok(true,message);
         }
         return _;
        };
       };
       return function(asserter)
       {
        return Runner.AddTest(t,r,asserter);
       };
      },
      RaisesMsgAsync:function(r,value,message)
      {
       var t;
       t=function(asserter)
       {
        return function(args)
        {
         var value1;
         value1=value(args);
         return Concurrency.Delay(function()
         {
          return Concurrency.TryWith(Concurrency.Delay(function()
          {
           return Concurrency.Bind(value1,function()
           {
            return Concurrency.Return(asserter.ok(false,message));
           });
          }),function()
          {
           return Concurrency.Return(asserter.ok(true,message));
          });
         });
        };
       };
       return function(asserter)
       {
        return Runner.AddTestAsync(t,r,asserter);
       };
      },
      Return:function(x)
      {
       return function()
       {
        return{
         $:0,
         $0:x
        };
       };
      },
      RunSubtest:function(r,subtest)
      {
       return function(asserter)
       {
        var f,x;
        f=function(a)
        {
         return(subtest(a))(asserter);
        };
        x=r(asserter);
        return Runner.Bind(f,x);
       };
      },
      Yield:function(x)
      {
       return function()
       {
        return{
         $:0,
         $0:x
        };
       };
      },
      Zero:function()
      {
       return function()
       {
        return{
         $:0,
         $0:undefined
        };
       };
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Test:function(name)
     {
      return TestBuilder.New(name);
     },
     TestBuilder:Runtime.Class({
      Run:function(e)
      {
       return QUnit.test(this.name,function(asserter)
       {
        var _,matchValue,_1,asy,done,arg00,e1;
        try
        {
         matchValue=e(asserter);
         if(matchValue.$==1)
          {
           asy=matchValue.$0;
           done=asserter.async();
           arg00=Concurrency.Delay(function()
           {
            return Concurrency.TryFinally(Concurrency.Delay(function()
            {
             return Concurrency.TryWith(Concurrency.Delay(function()
             {
              return Concurrency.Bind(asy,function()
              {
               return Concurrency.Return(null);
              });
             }),function(_arg2)
             {
              return Concurrency.Return(asserter.equal(_arg2,null,"Test threw an unexpected asynchronous exception"));
             });
            }),function()
            {
             return done(null);
            });
           });
           _1=Concurrency.Start(arg00,{
            $:0
           });
          }
         else
          {
           _1=null;
          }
         _=_1;
        }
        catch(e1)
        {
         _=asserter.equal(e1,null,"Test threw an unexpected synchronous exception");
        }
        return _;
       });
      }
     },{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,SubtestBuilder.New());
       r.name=name;
       return r;
      }
     }),
     TestCategory:function(name)
     {
      return TestCategoryBuilder.New(name);
     },
     TestCategoryBuilder:Runtime.Class({},{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,{});
       r.name=name;
       return r;
      }
     })
    },
    Random:{
     Anything:Runtime.Field(function()
     {
      return Random.MixManyWithoutBases(Random.allTypes());
     }),
     ArrayOf:function(generator)
     {
      return{
       Base:[[]],
       Next:function()
       {
        var len;
        len=Random.Natural().Next.call(null,null)%100;
        return Arrays.init(len,function()
        {
         return generator.Next.call(null,null);
        });
       }
      };
     },
     Boolean:Runtime.Field(function()
     {
      return{
       Base:[true,false],
       Next:function()
       {
        return Random.StandardUniform().Next.call(null,null)>0.5;
       }
      };
     }),
     Choose:function(gens,f)
     {
      var f1,gen,gengen;
      f1=function(i)
      {
       return Arrays.get(gens,i);
      };
      gen=Random.Within(0,Arrays.length(gens)-1);
      gengen=Random.Map(f1,gen);
      return{
       Base:[],
       Next:function()
       {
        var gen1;
        gen1=gengen.Next.call(null,null);
        return f(gen1).Next.call(null,null);
       }
      };
     },
     Const:function(x)
     {
      return{
       Base:[x],
       Next:function()
       {
        return x;
       }
      };
     },
     Exponential:function(lambda)
     {
      return{
       Base:[],
       Next:function()
       {
        var p;
        p=Random.StandardUniform().Next.call(null,null);
        return-Math.log(1-p)/lambda;
       }
      };
     },
     Float:Runtime.Field(function()
     {
      return{
       Base:[0],
       Next:function()
       {
        var sign;
        sign=Random.Boolean().Next.call(null,null)?1:-1;
        return sign*Random.Exponential(0.1).Next.call(null,null);
       }
      };
     }),
     FloatExhaustive:Runtime.Field(function()
     {
      return{
       Base:[0,NaN1,Infinity1,-Infinity1],
       Next:function()
       {
        return Random.Float().Next.call(null,null);
       }
      };
     }),
     FloatWithin:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return low+(hi-low)*Math.random();
       }
      };
     },
     Implies:function(a,b)
     {
      return!a?true:b;
     },
     Imply:function(a,b)
     {
      return Random.Implies(a,b);
     },
     Int:Runtime.Field(function()
     {
      return{
       Base:[0,1,-1],
       Next:function()
       {
        return Math.round(Random.Float().Next.call(null,null))<<0;
       }
      };
     }),
     ListOf:function(generator)
     {
      var f,gen;
      f=function(array)
      {
       return List.ofArray(array);
      };
      gen=Random.ArrayOf(generator);
      return Random.Map(f,gen);
     },
     Map:function(f,gen)
     {
      var f1;
      f1=gen.Next;
      return{
       Base:Arrays.map(f,gen.Base),
       Next:function(x)
       {
        return f(f1(x));
       }
      };
     },
     Mix:function(a,b)
     {
      var left;
      left=[false];
      return{
       Base:a.Base.concat(b.Base),
       Next:function()
       {
        left[0]=!left[0];
        return left[0]?a.Next.call(null,null):b.Next.call(null,null);
       }
      };
     },
     MixMany:function(gs)
     {
      var i;
      i=[0];
      return{
       Base:Arrays.concat(Seq.toArray(Seq.delay(function()
       {
        return Seq.map(function(g)
        {
         return g.Base;
        },gs);
       }))),
       Next:function()
       {
        i[0]=(i[0]+1)%Arrays.length(gs);
        return Arrays.get(gs,i[0]).Next.call(null,null);
       }
      };
     },
     MixManyWithoutBases:function(gs)
     {
      var i;
      i=[0];
      return{
       Base:[],
       Next:function()
       {
        i[0]=(i[0]+1)%Arrays.length(gs);
        return Arrays.get(gs,i[0]).Next.call(null,null);
       }
      };
     },
     Natural:Runtime.Field(function()
     {
      var g;
      g=Random.Int().Next;
      return{
       Base:[0,1],
       Next:function(x)
       {
        var value;
        value=g(x);
        return Math.abs(value);
       }
      };
     }),
     OneOf:function(seeds)
     {
      var index;
      index=Random.Within(1,Arrays.length(seeds));
      return{
       Base:seeds,
       Next:function()
       {
        return Arrays.get(seeds,index.Next.call(null,null)-1);
       }
      };
     },
     OptionOf:function(generator)
     {
      return Random.Mix(Random.Const({
       $:0
      }),Random.Map(function(arg0)
      {
       return{
        $:1,
        $0:arg0
       };
      },generator));
     },
     Sample:Runtime.Class({
      get_Data:function()
      {
       return this.data;
      }
     },{
      Make:function(generator,count)
      {
       return Sample.New1(generator,count);
      },
      New:function(generator)
      {
       return Runtime.New(this,Sample.New1(generator,100));
      },
      New1:function(generator,count)
      {
       var data;
       data=Seq.toList(Seq.delay(function()
       {
        return Seq.append(Seq.map(function(i)
        {
         return Arrays.get(generator.Base,i);
        },Operators.range(0,Arrays.length(generator.Base)-1)),Seq.delay(function()
        {
         return Seq.map(function()
         {
          return generator.Next.call(null,null);
         },Operators.range(1,count));
        }));
       }));
       return Runtime.New(this,Sample.New4(data));
      },
      New4:function(data)
      {
       var r;
       r=Runtime.New(this,{});
       r.data=data;
       return r;
      }
     }),
     StandardUniform:Runtime.Field(function()
     {
      return{
       Base:[],
       Next:function()
       {
        return Math.random();
       }
      };
     }),
     String:Runtime.Field(function()
     {
      return{
       Base:[""],
       Next:function()
       {
        var len,cs;
        len=Random.Natural().Next.call(null,null)%100;
        cs=Arrays.init(len,function()
        {
         return Random.Int().Next.call(null,null)%256;
        });
        return String.fromCharCode.apply(undefined,cs);
       }
      };
     }),
     StringExhaustive:Runtime.Field(function()
     {
      return{
       Base:[null,""],
       Next:Random.String().Next
      };
     }),
     Tuple2Of:function(a,b)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.map(function(y)
         {
          return[x,y];
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null)];
       }
      };
     },
     Tuple3Of:function(a,b,c)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.collect(function(y)
         {
          return Seq.map(function(z)
          {
           return[x,y,z];
          },c.Base);
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null),c.Next.call(null,null)];
       }
      };
     },
     Within:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return Random.Natural().Next.call(null,null)%(hi-low)+low;
       }
      };
     },
     allTypes:Runtime.Field(function()
     {
      var _bases_273_1,_compose_280_3,composed;
      _bases_273_1=[Random.Int(),Random.Float(),Random.Boolean(),Random.String()];
      _compose_280_3=function(gs)
      {
       return Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(g)
        {
         return Seq.append(Seq.collect(function(h)
         {
          return Seq.append([Random.Tuple2Of(g,h)],Seq.delay(function()
          {
           return Seq.map(function(i)
           {
            return Random.Tuple3Of(g,h,i);
           },gs);
          }));
         },gs),Seq.delay(function()
         {
          return Seq.append([Random.ListOf(g)],Seq.delay(function()
          {
           return[Random.ArrayOf(g)];
          }));
         }));
        },gs);
       }));
      };
      composed=_compose_280_3(_bases_273_1);
      return _bases_273_1.concat(composed);
     })
    },
    Runner:{
     RunnerControl:Runtime.Class({
      get_Body:function()
      {
       return RunnerControlBody.New();
      }
     }),
     RunnerControlBody:Runtime.Class({
      ReplaceInDom:function(e)
      {
       var fixture,qunit,parent,value,value1;
       fixture=document.createElement("div");
       fixture.setAttribute("id","qunit-fixture");
       qunit=document.createElement("div");
       qunit.setAttribute("id","qunit");
       parent=e.parentNode;
       value=parent.replaceChild(fixture,e);
       value1=parent.insertBefore(qunit,fixture);
       return;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Testing=Runtime.Safe(Global.WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  SubtestBuilder=Runtime.Safe(Pervasives.SubtestBuilder);
  Random=Runtime.Safe(Testing.Random);
  Sample=Runtime.Safe(Random.Sample);
  Runner=Runtime.Safe(Pervasives.Runner);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Math=Runtime.Safe(Global.Math);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  List=Runtime.Safe(Global.WebSharper.List);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  QUnit=Runtime.Safe(Global.QUnit);
  TestCategoryBuilder=Runtime.Safe(Pervasives.TestCategoryBuilder);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  String=Runtime.Safe(Global.String);
  Runner1=Runtime.Safe(Testing.Runner);
  RunnerControlBody=Runtime.Safe(Runner1.RunnerControlBody);
  return document=Runtime.Safe(Global.document);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(TestBuilder,SubtestBuilder);
  Random.allTypes();
  Random.StringExhaustive();
  Random.String();
  Random.StandardUniform();
  Random.Natural();
  Random.Int();
  Random.FloatExhaustive();
  Random.Float();
  Random.Boolean();
  Random.Anything();
  Pervasives.Do();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,Error,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,jQuery,UI,Next,Var,List,Client,Doc,View,ListModel,sv,Client1,Var1,Arrays,AttrProxy,Attr;
 Runtime.Define(Global,{
  sv:{
   Client:{
    Main:Runtime.Field(function()
    {
     var newName,ListContainer,Add;
     jQuery("#main").empty();
     newName=Var.Create("");
     ListContainer=List.ofArray([Doc.Convert(function(name)
     {
      var Name;
      Name=View.Const(name);
      return Doc.Concat([Doc.Element("li",[],[Doc.TextView(Name)])]);
     },ListModel.View(Client1.People()))]);
     Add=function()
     {
      return function()
      {
       Client1.People().Add(Var.Get(newName));
       return Var1.Set(newName,"");
      };
     };
     return Doc.RunById("main",Doc.Concat([Doc.Element("ul",[],Arrays.ofSeq(ListContainer)),Doc.Element("div",[],[Doc.Input([AttrProxy.Create("placeholder","Name")],newName),Doc.Element("button",[Attr.Handler("click",Add)],[Doc.TextNode("Add")]),Doc.Element("div",[],[Doc.TextNode("You are about to add: "),Doc.TextView(newName.get_View())])])]));
    }),
    People:Runtime.Field(function()
    {
     return ListModel.FromSeq(List.ofArray(["John","Paul"]));
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  jQuery=Runtime.Safe(Global.jQuery);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Var=Runtime.Safe(Next.Var);
  List=Runtime.Safe(Global.WebSharper.List);
  Client=Runtime.Safe(Next.Client);
  Doc=Runtime.Safe(Client.Doc);
  View=Runtime.Safe(Next.View);
  ListModel=Runtime.Safe(Next.ListModel);
  sv=Runtime.Safe(Global.sv);
  Client1=Runtime.Safe(sv.Client);
  Var1=Runtime.Safe(Next.Var1);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  AttrProxy=Runtime.Safe(Client.AttrProxy);
  return Attr=Runtime.Safe(Client.Attr);
 });
 Runtime.OnLoad(function()
 {
  Client1.People();
  Client1.Main();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
