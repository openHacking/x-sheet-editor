!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["x-sheet"]=t():e["x-sheet"]=t()}(self,(function(){return(()=>{"use strict";var e,t,r={7049:(e,t,r)=>{var o=r(4924),n=r(8134),s=r(9457);self.addEventListener("message",(e=>{const{data:t}=e,r=new s.n({data:t});let i=0,a=0;r.each((e=>{if(e)if(e.hasFormula()){const t=e.getComputeText();n.F.isNumber(t)&&(i+=n.F.parseFloat(t),a++)}else if(e.contentType===o.b.TYPE.NUMBER)i+=e.getComputeText(),a++})),self.postMessage({total:i,number:a})}))}},o={};function n(e){var t=o[e];if(void 0!==t)return t.exports;var s=o[e]={exports:{}};return r[e](s,s.exports,n),s.exports}return n.m=r,n.x=()=>{var e=n.O(void 0,[924,457],(()=>n(7049)));return e=n.O(e)},e=[],n.O=(t,r,o,s)=>{if(!r){var i=1/0;for(f=0;f<e.length;f++){for(var[r,o,s]=e[f],a=!0,p=0;p<r.length;p++)(!1&s||i>=s)&&Object.keys(n.O).every((e=>n.O[e](r[p])))?r.splice(p--,1):(a=!1,s<i&&(i=s));if(a){e.splice(f--,1);var c=o();void 0!==c&&(t=c)}}return t}s=s||0;for(var f=e.length;f>0&&e[f-1][2]>s;f--)e[f]=e[f-1];e[f]=[r,o,s]},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>"js/"+e+".js",n.miniCssF=e=>{},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e+"../"})(),(()=>{var e={49:1};n.f.i=(t,r)=>{e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkx_sheet=self.webpackChunkx_sheet||[],r=t.push.bind(t);t.push=t=>{var[o,s,i]=t;for(var a in s)n.o(s,a)&&(n.m[a]=s[a]);for(i&&i(n);o.length;)e[o.pop()]=1;r(t)}})(),t=n.x,n.x=()=>Promise.all([n.e(924),n.e(457)]).then(t),n.x()})()}));
//# sourceMappingURL=49.js.map