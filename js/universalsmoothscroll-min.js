var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
var __ussInit=function(){uss.getPageScroller(!0);uss.getScrollbarsMaxDimension(!0);var a=0,b=3,c=60,d=performance.now();window.requestAnimationFrame(function p(f){c--;0<c?window.requestAnimationFrame(p):(b--,a+=(f-d)/60,0<b?(c=60,d=performance.now(),window.requestAnimationFrame(p)):uss._framesTime=Math.min(DEFAULT_FRAME_TIME,a/3))})},onResize=function(){window.removeEventListener("pointerover",onResize,{passive:!0});window.removeEventListener("pointerdown",onResize,{passive:!0});window.removeEventListener("touchstart",
onResize,{passive:!0});window.removeEventListener("mousemove",onResize,{passive:!0});window.removeEventListener("keydown",onResize,{passive:!0});window.removeEventListener("focus",onResize,{passive:!0});_resizeHandled=!1;uss._windowWidth=window.innerWidth;uss._windowHeight=window.innerHeight;for(var a=$jscomp.makeIterator(uss._containersData.values()),b=a.next();!b.done;b=a.next())b=b.value,b[16]=null,b[17]=null,b[18]=null,b[19]=null,b[20]=null,b[21]=null,b[22]=null,b[23]=null;a=$jscomp.makeIterator(uss._onResizeEndCallbacks);
for(b=a.next();!b.done;b=a.next())b=b.value,b()},INITIAL_WINDOW_WIDTH=window.innerWidth,INITIAL_WINDOW_HEIGHT=window.innerHeight,DEFAULT_XSTEP_LENGTH=16+7/1508*(INITIAL_WINDOW_WIDTH-412),DEFAULT_YSTEP_LENGTH=Math.max(1,Math.abs(38-20/140*(INITIAL_WINDOW_HEIGHT-789))),DEFAULT_MIN_ANIMATION_FRAMES=INITIAL_WINDOW_HEIGHT/DEFAULT_YSTEP_LENGTH,DEFAULT_FRAME_TIME=16.6,DEFAULT_XSTEP_LENGTH_CALCULATOR=function(a,b,c,d,e,f,p){a=d/uss._minAnimationFrame;return 1>a?1:a>uss._xStepLength?uss._xStepLength:a},DEFAULT_YSTEP_LENGTH_CALCULATOR=
function(a,b,c,d,e,f,p){a=d/uss._minAnimationFrame;return 1>a?1:a>uss._yStepLength?uss._yStepLength:a},DEFAULT_ERROR_LOGGER=function(a,b,c){if(!/disabled/i.test(uss._debugMode)){var d="string"===typeof c;if(!d)if(null===c||void 0===c)c=String(c);else if(c===window)c="window";else if(Array.isArray(c))c="["+c.toString()+"]";else if(c instanceof Element){var e=c.id?"#"+c.id:"",f=c.className?"."+c.className:"";c=c.tagName.toLowerCase()+e+f}else c=c.name||c.toString().replace(RegExp("\n","g"),"");40<c.length&&
(c=c.slice(0,40)+" ...");d&&(c='"'+c+'"');if(/legacy/i.test(uss._debugMode))throw console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n"),console.error("USS ERROR\n",a,"was expecting",b+", but received",c+"."),"USS fatal error (execution stopped)";console.group("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");console.log("%cUSS ERROR","font-family:system-ui; font-weight:800; font-size:40px; background:#eb445a; color:black; border-radius:5px; padding:0.4vh 0.5vw; margin:1vh 0");
console.log("%c"+a+"%cwas expecting "+b,"font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#2dd36f; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px","font-family:system-ui; font-weight:600; font-size:17px; background:#2dd36f; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw");console.log("%cBut received%c"+c,"font-family:system-ui; font-weight:600; font-size:17px; background:#eb445a; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px",
"font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#eb445a; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw");console.groupCollapsed("%cStack Trace","font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px");console.trace("");console.groupEnd("Stack Trace");console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)");
throw"USS fatal error (execution stopped)";}},DEFAULT_WARNING_LOGGER=function(a,b,c){c=void 0===c?!0:c;if(!/disabled/i.test(uss._debugMode)){var d="string"===typeof a;if(!d)if(null===a||void 0===a)a=String(a);else if(a===window)a="window";else if(Array.isArray(a))a="["+a.toString()+"]";else if(a instanceof Element){var e=a.id?"#"+a.id:"",f=a.className?"."+a.className:"";a=a.tagName.toLowerCase()+e+f}else a=a.name||a.toString().replace(RegExp("\n","g"),"");40<a.length&&(a=a.slice(0,40)+" ...");d&&
c&&(a='"'+a+'"');/legacy/i.test(uss._debugMode)?(console.log("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)\n"),console.warn("USS WARNING\n",a,b+".")):(console.groupCollapsed("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)"),console.log("%cUSS WARNING","font-family:system-ui; font-weight:800; font-size:40px; background:#fcca03; color:black; border-radius:5px; padding:0.4vh 0.5vw; margin:1vh 0"),
console.log("%c"+a+"%c"+b,"font-style:italic; font-family:system-ui; font-weight:700; font-size:17px; background:#fcca03; color:black; border-radius:5px 0px 0px 5px; padding:0.4vh 0.5vw; margin-left:13px","font-family:system-ui; font-weight:600; font-size:17px; background:#fcca03; color:black; border-radius:0px 5px 5px 0px; padding:0.4vh 0.5vw"),console.groupCollapsed("%cStack Trace","font-family:system-ui; font-weight:500; font-size:17px; background:#3171e0; color:#f5f6f9; border-radius:5px; padding:0.3vh 0.5vw; margin-left:13px"),
console.trace(""),console.groupEnd("Stack Trace"),console.groupEnd("UniversalSmoothScroll API (documentation at: https://github.com/CristianDavideConte/universalSmoothScroll)"))}};
window.uss={_containersData:new Map,_xStepLength:DEFAULT_XSTEP_LENGTH,_yStepLength:DEFAULT_YSTEP_LENGTH,_minAnimationFrame:DEFAULT_MIN_ANIMATION_FRAMES,_windowWidth:INITIAL_WINDOW_WIDTH,_windowHeight:INITIAL_WINDOW_HEIGHT,_scrollbarsMaxDimension:null,_framesTime:DEFAULT_FRAME_TIME,_pageScroller:null,_reducedMotion:"matchMedia"in window&&window.matchMedia("(prefers-reduced-motion)").matches,_onResizeEndCallbacks:[],_debugMode:"",_errorLogger:DEFAULT_ERROR_LOGGER,_warningLogger:DEFAULT_WARNING_LOGGER,
isXScrolling:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"isXScrolling"}:b;if(a===window||a instanceof Element)return!!(uss._containersData.get(a)||[])[0];uss._errorLogger(b.debugString,"the container to be an Element or the Window",a)},isYScrolling:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"isYScrolling"}:b;if(a===window||a instanceof Element)return!!(uss._containersData.get(a)||[])[1];uss._errorLogger(b.debugString,"the container to be an Element or the Window",
a)},isScrolling:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"isScrolling"}:b;if(a===window||a instanceof Element){var c=uss._containersData.get(a)||[];return!!c[0]||!!c[1]}uss._errorLogger(b.debugString,"the container to be an Element or the Window",a)},getFinalXPosition:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"getFinalXPosition"}:b;var c=uss._containersData.get(a)||[];return 0===c[2]?0:c[2]||uss.getScrollXCalculator(a,b)()},getFinalYPosition:function(a,
b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"getFinalYPosition"}:b;var c=uss._containersData.get(a)||[];return 0===c[3]?0:c[3]||uss.getScrollYCalculator(a,b)()},getScrollXDirection:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"getScrollXDirection"}:b;if(a===window||a instanceof Element)return(uss._containersData.get(a)||[])[4]||0;uss._errorLogger(b.debugString,"the container to be an Element or the Window",a)},getScrollYDirection:function(a,b){a=void 0===
a?uss._pageScroller:a;b=void 0===b?{debugString:"getScrollYDirection"}:b;if(a===window||a instanceof Element)return(uss._containersData.get(a)||[])[5]||0;uss._errorLogger(b.debugString,"the container to be an Element or the Window",a)},getXStepLengthCalculator:function(a,b,c){a=void 0===a?uss._pageScroller:a;b=void 0===b?!1:b;c=void 0===c?{debugString:"getXStepLengthCalculator"}:c;if(a===window||a instanceof Element)return a=uss._containersData.get(a)||[],b?a[14]:a[12];uss._errorLogger(c.debugString,
"the container to be an Element or the Window",a)},getYStepLengthCalculator:function(a,b,c){a=void 0===a?uss._pageScroller:a;b=void 0===b?!1:b;c=void 0===c?{debugString:"getYStepLengthCalculator"}:c;if(a===window||a instanceof Element)return a=uss._containersData.get(a)||[],b?a[15]:a[13];uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},getXStepLength:function(){return uss._xStepLength},getYStepLength:function(){return uss._yStepLength},getMinAnimationFrame:function(){return uss._minAnimationFrame},
getWindowHeight:function(){return uss._windowHeight},getWindowWidth:function(){return uss._windowWidth},getScrollbarsMaxDimension:function(a){if((void 0===a?0:a)||!Number.isFinite(uss._scrollbarsMaxDimension)){a=document.createElement("style");var b=document.createElement("div");b.id="__uss-ScrollBox";a.appendChild(document.createTextNode("#__uss-ScrollBox { display:block; width:100px; height:100px; overflow-x:scroll; border:none; padding:0px; }#__uss-ScrollBox::-webkit-scrollbar { display:block; width:initial; height:initial; }"));
document.head.appendChild(a);document.body.appendChild(b);uss._scrollbarsMaxDimension=b.offsetHeight-b.clientHeight;document.body.removeChild(b);document.head.removeChild(a)}return uss._scrollbarsMaxDimension},getPageScroller:function(a,b){b=void 0===b?{debugString:"getPageScroller"}:b;if((void 0===a||!a)&&uss._pageScroller)return uss._pageScroller;var c=uss.getMaxScrollX(document.documentElement,!0,b),d=uss.getMaxScrollY(document.documentElement,!0,b),e=uss.getMaxScrollX(document.body,!0,b),f=uss.getMaxScrollY(document.body,
!0,b);uss._pageScroller=c>e&&d>=f||c>=e&&d>f?document.documentElement:e>c&&f>=d||e>=c&&f>d?document.body:document.scrollingElement||window;return uss._pageScroller},getReducedMotionState:function(){return uss._reducedMotion},getOnResizeEndCallbacks:function(){return uss._onResizeEndCallbacks},getDebugMode:function(){return uss._debugMode},setXStepLengthCalculator:function(a,b,c,d){a=void 0===a?DEFAULT_XSTEP_LENGTH_CALCULATOR:a;b=void 0===b?uss._pageScroller:b;c=void 0===c?!1:c;d=void 0===d?{debugString:"setXStepLengthCalculator"}:
d;if("function"!==typeof a)uss._errorLogger(d.debugString,"the newCalculator to be a function",a);else if(b===window||b instanceof Element){var e=(d=uss._containersData.get(b))||[];c?e[14]=a:(e[12]=a,e[14]&&(e[14]=null));d||uss._containersData.set(b,e)}else uss._errorLogger(d.debugString,"the container to be an Element or the Window",b)},setYStepLengthCalculator:function(a,b,c,d){a=void 0===a?DEFAULT_YSTEP_LENGTH_CALCULATOR:a;b=void 0===b?uss._pageScroller:b;c=void 0===c?!1:c;d=void 0===d?{debugString:"setYStepLengthCalculator"}:
d;if("function"!==typeof a)uss._errorLogger(d.debugString,"the newCalculator to be a function",a);else if(b===window||b instanceof Element){var e=(d=uss._containersData.get(b))||[];c?e[15]=a:(e[13]=a,e[15]&&(e[15]=null));d||uss._containersData.set(b,e)}else uss._errorLogger(d.debugString,"the container to be an Element or the Window",b)},setStepLengthCalculator:function(a,b,c,d){b=void 0===b?uss._pageScroller:b;c=void 0===c?!1:c;d=void 0===d?{debugString:"setStepLengthCalculator"}:d;if("function"!==
typeof a)uss._errorLogger(d.debugString,"the newCalculator to be a function",a);else if(b===window||b instanceof Element){var e=(d=uss._containersData.get(b))||[];c?(e[14]=a,e[15]=a):(e[12]=a,e[13]=a,e[14]&&(e[14]=null),e[15]&&(e[15]=null));d||uss._containersData.set(b,e)}else uss._errorLogger(d.debugString,"the container to be an Element or the Window",b)},setXStepLength:function(a,b){a=void 0===a?DEFAULT_XSTEP_LENGTH:a;b=void 0===b?{debugString:"setXStepLength"}:b;!Number.isFinite(a)||0>=a?uss._errorLogger(b.debugString,
"the newXStepLength to be a positive number",a):uss._xStepLength=a},setYStepLength:function(a,b){a=void 0===a?DEFAULT_YSTEP_LENGTH:a;b=void 0===b?{debugString:"setYStepLength"}:b;!Number.isFinite(a)||0>=a?uss._errorLogger(b.debugString,"the newYStepLength to be a positive number",a):uss._yStepLength=a},setStepLength:function(a,b){b=void 0===b?{debugString:"setStepLength"}:b;!Number.isFinite(a)||0>=a?uss._errorLogger(b.debugString,"the newStepLength to be a positive number",a):(uss._xStepLength=a,
uss._yStepLength=a)},setMinAnimationFrame:function(a,b){a=void 0===a?DEFAULT_MIN_ANIMATION_FRAMES:a;b=void 0===b?{debugString:"setMinAnimationFrame"}:b;!Number.isFinite(a)||0>=a?uss._errorLogger(b.debugString,"the newMinAnimationFrame to be a positive number",a):uss._minAnimationFrame=a},setPageScroller:function(a,b){b=void 0===b?{debugString:"setPageScroller"}:b;a===window||a instanceof Element?uss._pageScroller=a:uss._errorLogger(b.debugString,"the newPageScroller to be an Element or the Window",
a)},addOnResizeEndCallback:function(a,b){b=void 0===b?{debugString:"addOnResizeEndCallback"}:b;"function"!==typeof a?uss._errorLogger(b.debugString,"the newCallback to be a function",a):uss._onResizeEndCallbacks.push(a)},setDebugMode:function(a,b){a=void 0===a?"":a;b=void 0===b?{debugString:"setDebugMode"}:b;"string"===typeof a?uss._debugMode=a:console.error("USS ERROR\n",b.debugString,'was expecting the newDebugMode to be "disabled", "legacy" or any other string, but received',a+".")},setErrorLogger:function(a,
b){a=void 0===a?DEFAULT_ERROR_LOGGER:a;b=void 0===b?{debugString:"setErrorLogger"}:b;"function"!==typeof a?uss._errorLogger(b.debugString,"the newErrorLogger to be a function",a):uss._errorLogger=a},setWarningLogger:function(a,b){a=void 0===a?DEFAULT_WARNING_LOGGER:a;b=void 0===b?{debugString:"setWarningLogger"}:b;"function"!==typeof a?uss._errorLogger(b.debugString,"the newWarningLogger to be a function",a):uss._warningLogger=a},calcXScrollbarDimension:function(a,b,c){b=void 0===b?!1:b;c=void 0===
c?{debugString:"calcXScrollbarDimension"}:c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[18]))return e[18];a===window&&(a=uss.getPageScroller());if(a instanceof HTMLElement||a instanceof SVGElement){if(a===window||0===uss.getScrollbarsMaxDimension(!1))return e[18]=0,d||uss._containersData.set(a,e),0;var f=window.getComputedStyle(a),p=Number.parseInt(f.width);b=a.clientWidth;c=a.style.overflowY;var h=a.scrollLeft;a.style.overflowY="hidden";f=Number.parseInt(f.width)-p;0===f?f=
a.clientWidth-b:0>f&&(f=0);a.style.overflowY=c;a.scrollLeft=h;e[18]=f;d||uss._containersData.set(a,e);return f}uss._errorLogger(c.debugString,"the element to be an HTMLElement, an SVGElement or the Window",a)},calcYScrollbarDimension:function(a,b,c){b=void 0===b?!1:b;c=void 0===c?{debugString:"calcYScrollbarDimension"}:c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[19]))return e[19];a===window&&(a=uss.getPageScroller());if(a instanceof HTMLElement||a instanceof SVGElement){if(a===
window||0===uss.getScrollbarsMaxDimension(!1))return e[19]=0,d||uss._containersData.set(a,e),0;var f=window.getComputedStyle(a),p=Number.parseInt(f.height);b=a.clientHeight;c=a.style.overflowX;var h=a.scrollTop;a.style.overflowX="hidden";f=Number.parseInt(f.height)-p;0===f?f=a.clientHeight-b:0>f&&(f=0);a.style.overflowX=c;a.scrollTop=h;e[19]=f;d||uss._containersData.set(a,e);return f}uss._errorLogger(c.debugString,"the element to be an HTMLElement, an SVGElement or the Window",a)},calcScrollbarsDimensions:function(a,
b,c){b=void 0===b?!1:b;c=void 0===c?{debugString:"calcScrollbarsDimensions"}:c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[18])&&Number.isFinite(e[19]))return[e[18],e[19]];a===window&&(a=uss.getPageScroller());if(a instanceof HTMLElement||a instanceof SVGElement){if(a===window||0===uss.getScrollbarsMaxDimension(!1))return e[18]=0,e[19]=0,d||uss._containersData.set(a,e),[0,0];b=[];c=window.getComputedStyle(a);var f=Number.parseInt(c.width),p=Number.parseInt(c.height),h=a.clientWidth,
l=a.clientHeight,g=a.style.overflowX,k=a.style.overflowY,n=a.scrollLeft,v=a.scrollTop;a.style.overflowX="hidden";a.style.overflowY="hidden";b[0]=Number.parseInt(c.width)-f;b[1]=Number.parseInt(c.height)-p;0===b[0]?b[0]=a.clientWidth-h:0>b[0]&&(b[0]=0);0===b[1]?b[1]=a.clientHeight-l:0>b[1]&&(b[1]=0);a.style.overflowX=g;a.style.overflowY=k;a.scrollLeft=n;a.scrollTop=v;e[18]=b[0];e[19]=b[1];d||uss._containersData.set(a,e);return b}uss._errorLogger(c.debugString,"the element to be an HTMLElement, an SVGElement or the Window",
a)},calcBordersDimensions:function(a,b,c){b=void 0===b?!1:b;c=void 0===c?{debugString:"calcBordersDimensions"}:c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[20])&&Number.isFinite(e[21])&&Number.isFinite(e[22])&&Number.isFinite(e[23]))return[e[20],e[21],e[22],e[23]];a===window&&(a=uss.getPageScroller());if(a instanceof Element)return a===window?b=[0,0,0,0]:(b=window.getComputedStyle(a),b=[Number.parseInt(b.borderTopWidth),Number.parseInt(b.borderRightWidth),Number.parseInt(b.borderBottomWidth),
Number.parseInt(b.borderLeftWidth)]),e[20]=b[0],e[21]=b[1],e[22]=b[2],e[23]=b[3],d||uss._containersData.set(a,e),b;uss._errorLogger(c.debugString,"the element to be an Element or the Window",a)},getScrollXCalculator:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"getScrollXCalculator"}:b;if(a===window)return function(){return window.scrollX};if(a instanceof Element)return function(){return a.scrollLeft};uss._errorLogger(b.debugString,"the container to be an Element or the Window",
a)},getScrollYCalculator:function(a,b){a=void 0===a?uss._pageScroller:a;b=void 0===b?{debugString:"getScrollYCalculator"}:b;if(a===window)return function(){return window.scrollY};if(a instanceof Element)return function(){return a.scrollTop};uss._errorLogger(b.debugString,"the container to be an Element or the Window",a)},getMaxScrollX:function(a,b,c){a=void 0===a?uss._pageScroller:a;b=void 0===b?!1:b;c=void 0===c?{debugString:"getMaxScrollX"}:c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[16]))return e[16];
if(a===window)return b=window.scrollX,a.scroll(1073741824,window.scrollY),c=window.scrollX,a.scroll(b,window.scrollY),e[16]=c,d||uss._containersData.set(a,e),c;if(a instanceof Element)return b=a.scrollLeft,a.scrollLeft=1073741824,c=a.scrollLeft,a.scrollLeft=b,e[16]=c,d||uss._containersData.set(a,e),c;uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},getMaxScrollY:function(a,b,c){a=void 0===a?uss._pageScroller:a;b=void 0===b?!1:b;c=void 0===c?{debugString:"getMaxScrollY"}:
c;var d=uss._containersData.get(a),e=d||[];if(!b&&Number.isFinite(e[17]))return e[17];if(a===window)return b=window.scrollY,a.scroll(window.scrollX,1073741824),c=window.scrollY,a.scroll(window.scrollX,b),e[17]=c,d||uss._containersData.set(a,e),c;if(a instanceof Element)return b=a.scrollTop,a.scrollTop=1073741824,c=a.scrollTop,a.scrollTop=b,e[17]=c,d||uss._containersData.set(a,e),c;uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},getXScrollableParent:function(a,b,c){b=
void 0===b?!1:b;c=void 0===c?{debugString:"getXScrollableParent"}:c;if(a===window)return null;if(a instanceof Element){var d=window.getComputedStyle(a);if("fixed"===d.position)return null;c=document.body;var e=document.documentElement,f=b?/(auto|scroll|hidden)/:/(auto|scroll)/,p="absolute"!==d.position;for(a=a.parentElement;a&&a!==c&&a!==e;){d=window.getComputedStyle(a);if((p||"static"!==d.position)&&f.test(d.overflowX)&&1<=uss.getMaxScrollX(a))return a;if("fixed"===d.position)return null;a=a.parentElement}b=
b?/(visible|auto|scroll|hidden)/:/(visible|auto|scroll)/;return a===c&&b.test(window.getComputedStyle(c).overflowX)&&1<=uss.getMaxScrollX(c)?c:a&&b.test(window.getComputedStyle(e).overflowX)&&1<=uss.getMaxScrollX(e)?e:1<=uss.getMaxScrollX(window)?window:null}uss._errorLogger(c.debugString,"the element to be an Element or the Window",a)},getYScrollableParent:function(a,b,c){b=void 0===b?!1:b;c=void 0===c?{debugString:"getYScrollableParent"}:c;if(a===window)return null;if(a instanceof Element){var d=
window.getComputedStyle(a);if("fixed"===d.position)return null;c=document.body;var e=document.documentElement,f=b?/(auto|scroll|hidden)/:/(auto|scroll)/,p="absolute"!==d.position;for(a=a.parentElement;a&&a!==c&&a!==e;){d=window.getComputedStyle(a);if((p||"static"!==d.position)&&f.test(d.overflowY)&&1<=uss.getMaxScrollY(a))return a;if("fixed"===d.position)return null;a=a.parentElement}b=b?/(visible|auto|scroll|hidden)/:/(visible|auto|scroll)/;return a===c&&b.test(window.getComputedStyle(c).overflowY)&&
1<=uss.getMaxScrollY(c)?c:a&&b.test(window.getComputedStyle(e).overflowY)&&1<=uss.getMaxScrollY(e)?e:1<=uss.getMaxScrollY(window)?window:null}uss._errorLogger(c.debugString,"the element to be an Element or the Window",a)},getScrollableParent:function(a,b,c){b=void 0===b?!1:b;c=void 0===c?{debugString:"getScrollableParent"}:c;if(a===window)return null;if(a instanceof Element){var d=window.getComputedStyle(a);if("fixed"===d.position)return null;c=document.body;var e=document.documentElement,f=b?/(auto|scroll|hidden)/:
/(auto|scroll)/,p="absolute"!==d.position,h=function(l){return 1<=uss.getMaxScrollX(l)||1<=uss.getMaxScrollY(l)};for(a=a.parentElement;a&&a!==c&&a!==e;){d=window.getComputedStyle(a);if((p||"static"!==d.position)&&f.test(d.overflow)&&h(a))return a;if("fixed"===d.position)return null;a=a.parentElement}b=b?/(visible|auto|scroll|hidden)/:/(visible|auto|scroll)/;return a===c&&b.test(window.getComputedStyle(c).overflow)&&h(c)?c:a&&b.test(window.getComputedStyle(e).overflow)&&h(e)?e:h(window)?window:null}uss._errorLogger(c.debugString,
"the element to be an Element or the Window",a)},getAllScrollableParents:function(a,b,c,d){b=void 0===b?!1:b;d=void 0===d?{debugString:"getAllScrollableParents"}:d;if(a===window)return[];if(a instanceof Element){var e=window.getComputedStyle(a);if("fixed"===e.position)return[];d=document.body;var f=document.documentElement,p=[],h=b?/(auto|scroll|hidden)/:/(auto|scroll)/,l="absolute"!==e.position,g="function"===typeof c?c:function(){};c=function(n){return 1<=uss.getMaxScrollX(n)||1<=uss.getMaxScrollY(n)};
var k=function(n){p.push(n);g(n)};for(a=a.parentElement;a&&a!==d&&a!==f;){e=window.getComputedStyle(a);(l||"static"!==e.position)&&h.test(e.overflow)&&c(a)&&k(a);if("fixed"===e.position)return p;a=a.parentElement}b=b?/(visible|auto|scroll|hidden)/:/(visible|auto|scroll)/;a===d&&b.test(window.getComputedStyle(d).overflow)&&c(d)&&k(d);a&&b.test(window.getComputedStyle(f).overflow)&&c(f)&&k(f);c(window)&&k(window);return p}uss._errorLogger(d.debugString,"the element to be an Element or the Window",a)},
scrollXTo:function(a,b,c,d){function e(k){var n=g[2],v=g[4],w=f(),q=(n-w)*v;if(1>q)uss.stopScrollingX(b,g[10]);else{g[8]||(g[8]=k);var r=g[0],m=g[14]?g[14](q,g[8],k,g[6],w,n,b):g[12]?g[12](q,g[8],k,g[6],w,n,b):DEFAULT_XSTEP_LENGTH_CALCULATOR(q,g[8],k,g[6],w,n,b);r===g[0]&&(n!==g[2]?g[0]=window.requestAnimationFrame(e):(Number.isFinite(m)||(uss._warningLogger(m,"is not a valid step length",!0),m=DEFAULT_XSTEP_LENGTH_CALCULATOR(q,g[8],k,g[6],w,n,b)),q<=m?(h(n),uss.stopScrollingX(b,g[10])):(h(w+m*v),
0!==m&&w===f()?uss.stopScrollingX(b,g[10]):g[0]=window.requestAnimationFrame(e))))}}b=void 0===b?uss._pageScroller:b;d=void 0===d?{debugString:"scrollXTo"}:d;if(Number.isFinite(a))if(1>uss.getMaxScrollX(b,!1,d))uss._warningLogger(b,"is not scrollable on the x-axis",!1),uss.stopScrollingX(b,c);else{var f=uss.getScrollXCalculator(b);d=a-f();var p=0<d?1:-1;d*=p;if(1>d)uss.stopScrollingX(b,c);else{var h=b!==window?function(k){return b.scrollLeft=k}:function(k){return b.scroll(k,window.scrollY)};if(uss._reducedMotion)h(a),
uss.stopScrollingX(b,c);else{var l=uss._containersData.get(b),g=l||[];g[2]=a;g[4]=p;g[6]=d;g[8]=null;g[10]=c;g[0]||(g[0]=window.requestAnimationFrame(e),l||uss._containersData.set(b,g))}}}else uss._errorLogger(d.debugString,"the finalXPosition to be a number",a)},scrollYTo:function(a,b,c,d){function e(k){var n=g[3],v=g[5],w=f(),q=(n-w)*v;if(1>q)uss.stopScrollingY(b,g[11]);else{g[9]||(g[9]=k);var r=g[1],m=g[15]?g[15](q,g[9],k,g[7],w,n,b):g[13]?g[13](q,g[9],k,g[7],w,n,b):DEFAULT_YSTEP_LENGTH_CALCULATOR(q,
g[9],k,g[7],w,n,b);r===g[1]&&(n!==g[3]?g[1]=window.requestAnimationFrame(e):(Number.isFinite(m)||(uss._warningLogger(m,"is not a valid step length",!0),m=DEFAULT_YSTEP_LENGTH_CALCULATOR(q,g[9],k,g[7],w,n,b)),q<=m?(h(n),uss.stopScrollingY(b,g[11])):(h(w+m*v),0!==m&&w===f()?uss.stopScrollingY(b,g[11]):g[1]=window.requestAnimationFrame(e))))}}b=void 0===b?uss._pageScroller:b;d=void 0===d?{debugString:"scrollYTo"}:d;if(Number.isFinite(a))if(1>uss.getMaxScrollY(b,!1,d))uss._warningLogger(b,"is not scrollable on the y-axis",
!1),uss.stopScrollingY(b,c);else{var f=uss.getScrollYCalculator(b);d=a-f();var p=0<d?1:-1;d*=p;if(1>d)uss.stopScrollingY(b,c);else{var h=b!==window?function(k){return b.scrollTop=k}:function(k){return b.scroll(window.scrollX,k)};if(uss._reducedMotion)h(a),uss.stopScrollingY(b,c);else{var l=uss._containersData.get(b),g=l||[];g[3]=a;g[5]=p;g[7]=d;g[9]=null;g[11]=c;g[1]||(g[1]=window.requestAnimationFrame(e),l||uss._containersData.set(b,g))}}}else uss._errorLogger(d.debugString,"the finalYPosition to be a number",
a)},scrollXBy:function(a,b,c,d,e){b=void 0===b?uss._pageScroller:b;d=void 0===d?!0:d;e=void 0===e?{debugString:"scrollXBy"}:e;if(Number.isFinite(a)){var f=uss.getScrollXCalculator(b,e)();if(!d&&(d=uss._containersData.get(b)||[],d[0])){if(0!==a){e=d[2]+a;f=(e-f)*d[4];if(1>f*f){uss.stopScrollingX(b,c);return}if(0>f){uss.scrollXTo(e,b,c);return}a=d[6]*d[4]+a;d[2]=e;d[4]=0<a?1:-1;d[6]=a*d[4]}d[8]=null;d[10]=c;return}uss.scrollXTo(f+a,b,c)}else uss._errorLogger(e.debugString,"the deltaX to be a number",
a)},scrollYBy:function(a,b,c,d,e){b=void 0===b?uss._pageScroller:b;d=void 0===d?!0:d;e=void 0===e?{debugString:"scrollYBy"}:e;if(Number.isFinite(a)){var f=uss.getScrollYCalculator(b,e)();if(!d&&(d=uss._containersData.get(b)||[],d[1])){if(0!==a){e=d[3]+a;f=(e-f)*d[5];if(1>f*f){uss.stopScrollingY(b,c);return}if(0>f){uss.scrollYTo(e,b,c);return}a=d[7]*d[5]+a;d[3]=e;d[5]=0<a?1:-1;d[7]=a*d[5]}d[9]=null;d[11]=c;return}uss.scrollYTo(f+a,b,c)}else uss._errorLogger(e.debugString,"the deltaY to be a number",
a)},scrollTo:function(a,b,c,d,e){c=void 0===c?uss._pageScroller:c;e=void 0===e?{debugString:"scrollTo"}:e;if("function"!==typeof d)uss.scrollXTo(a,c,null,e),uss.scrollYTo(b,c,null,e);else{var f=function(){var l=uss._containersData.get(c)||[];h||l[11]===p||d()},p=function(){var l=uss._containersData.get(c)||[];h||l[10]===f||d()},h=!0;uss.scrollXTo(a,c,f,e);h=!1;uss.scrollYTo(b,c,p,e)}},scrollBy:function(a,b,c,d,e,f){c=void 0===c?uss._pageScroller:c;e=void 0===e?!0:e;f=void 0===f?{debugString:"scrollBy"}:
f;if("function"!==typeof d)uss.scrollXBy(a,c,null,e,f),uss.scrollYBy(b,c,null,e,f);else{var p=function(){var g=uss._containersData.get(c)||[];l||g[11]===h||d()},h=function(){var g=uss._containersData.get(c)||[];l||g[10]===p||d()},l=!0;uss.scrollXBy(a,c,p,e,f);l=!1;uss.scrollYBy(b,c,h,e,f)}},scrollIntoView:function(a,b,c,d,e,f){function p(r){var m=window.scrollX,t=window.scrollY,x=r.scrollLeft,u=r.scrollTop;window.scroll(0,0);r.scroll(0,0);window.scroll(100,100);var y=r.scrollLeft===window.scrollX&&
r.scrollTop===window.scrollY;y||r.scroll(x,u);window.scroll(m,t);return y}function h(){var r=uss.calcScrollbarsDimensions(v,!1),m=uss.calcBordersDimensions(v,!1),t=v!==window?v.getBoundingClientRect():{left:0,top:0,width:uss._windowWidth,height:uss._windowHeight},x=t.width,u=t.height,y=w.getBoundingClientRect(),C=y.width,z=y.height,B=y.left-t.left;t=y.top-t.top;if("nearest"===b){y=Math.abs(x-B-C);var A=Math.abs(.5*(x-C)-B);k=(0<B?B:-B)<A?!0:y<A?!1:null}"nearest"===c&&(y=Math.abs(u-t-z),A=Math.abs(.5*
(u-z)-t),n=(0<t?t:-t)<A?!0:y<A?!1:null);x=Math.round(B-(!0===k?m[3]:!1===k?x-C-r[0]-m[1]:.5*(x-C-r[0]-m[1]+m[3])));r=Math.round(t-(!0===n?m[0]:!1===n?u-z-r[1]-m[2]:.5*(u-z-r[1]-m[2]+m[0])));m=0!==x&&1<=uss.getMaxScrollX(v);u=0!==r&&1<=uss.getMaxScrollY(v);m&&u?uss.scrollBy(x,r,v,q):m?uss.scrollXBy(x,v,q):u?uss.scrollYBy(r,v,q):q()}b=void 0===b?!0:b;c=void 0===c?!0:c;f=void 0===f?{debugString:"scrollIntoView"}:f;var l=-1,g=uss.getAllScrollableParents(a,void 0===e?!1:e,function(){return l++},f);if(0>
l)"function"===typeof d&&d();else{g[l]===window&&(e=document.documentElement,f=document.body,g[l-1]===e&&p(e)&&(l--,g.splice(l,1)),g[l-1]===f&&p(f)&&(l--,g.splice(l,1)));var k=b,n=c,v=g[l],w=g[l-1]||a,q=function(){1>l?"function"===typeof d&&d():(l--,v=g[l],w=g[l-1]||a,h())};h()}},scrollIntoViewIfNeeded:function(a,b,c,d,e){function f(q){var r=window.scrollX,m=window.scrollY,t=q.scrollLeft,x=q.scrollTop;window.scroll(0,0);q.scroll(0,0);window.scroll(100,100);var u=q.scrollLeft===window.scrollX&&q.scrollTop===
window.scrollY;u||q.scroll(t,x);window.scroll(r,m);return u}function p(){var q=uss.calcScrollbarsDimensions(n,!1),r=uss.calcBordersDimensions(n,!1),m=n!==window?n.getBoundingClientRect():{left:0,top:0,width:uss._windowWidth,height:uss._windowHeight},t=m.width,x=m.height,u=v.getBoundingClientRect(),y=u.width,C=u.height,z=u.left-m.left;m=u.top-m.top;u=0>=z&&0<=z+y-t+q[0];var B=0>=m&&0<=m+C-x+q[1],A=v===a;u=-1<z&&1>z+y-t+q[0]||A&&u;B=-1<m&&1>m+C-x+q[1]||A&&B;if(u&&B)A?"function"===typeof c&&c():(h--,
n=l[h],v=1>h?a:l[h-1],p());else{if(A&&!0===b)B=u=!1;else{if(!u){A=Math.abs(t-z-y);var D=Math.abs(.5*(t-y)-z);g=(0<z?z:-z)<D?!0:A<D?!1:null}B||(A=Math.abs(x-m-C),D=Math.abs(.5*(x-C)-m),k=(0<m?m:-m)<D?!0:A<D?!1:null)}t=Math.round(z-(u?z:!0===g?r[3]:!1===g?t-y-q[0]-r[1]:.5*(t-y-q[0]-r[1]+r[3])));q=Math.round(m-(B?m:!0===k?r[0]:!1===k?x-C-q[1]-r[2]:.5*(x-C-q[1]-r[2]+r[0])));r=0!==t&&1<=uss.getMaxScrollX(n);x=0!==q&&1<=uss.getMaxScrollY(n);r&&x?uss.scrollBy(t,q,n,w):r?uss.scrollXBy(t,n,w):x?uss.scrollYBy(q,
n,w):w()}}b=void 0===b?!0:b;e=void 0===e?{debugString:"scrollIntoViewIfNeeded"}:e;var h=-1,l=uss.getAllScrollableParents(a,void 0===d?!1:d,function(){return h++},e);if(0>h)"function"===typeof c&&c();else{l[h]===window&&(d=document.documentElement,e=document.body,l[h-1]===d&&f(d)&&(h--,l.splice(h,1)),l[h-1]===e&&f(e)&&(h--,l.splice(h,1)));var g=null,k=null,n=l[h],v=l[h-1]||a,w=function(){1>h?"function"===typeof c&&c():(h--,n=l[h],v=l[h-1]||a,p())};p()}},stopScrollingX:function(a,b,c){a=void 0===a?
uss._pageScroller:a;c=void 0===c?{debugString:"stopScrollingX"}:c;if(a===window||a instanceof Element){c=uss._containersData.get(a)||[];window.cancelAnimationFrame(c[0]);c[0]=null;c[10]=null;if(!c[1]){var d=[];c[12]&&(d[12]=c[12]);c[13]&&(d[13]=c[13]);Number.isFinite(c[16])&&(d[16]=c[16]);Number.isFinite(c[17])&&(d[17]=c[17]);Number.isFinite(c[18])&&(d[18]=c[18]);Number.isFinite(c[19])&&(d[19]=c[19]);Number.isFinite(c[20])&&(d[20]=c[20]);Number.isFinite(c[21])&&(d[21]=c[21]);Number.isFinite(c[22])&&
(d[22]=c[22]);Number.isFinite(c[23])&&(d[23]=c[23]);uss._containersData.set(a,d)}"function"===typeof b&&b()}else uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},stopScrollingY:function(a,b,c){a=void 0===a?uss._pageScroller:a;c=void 0===c?{debugString:"stopScrollingY"}:c;if(a===window||a instanceof Element){c=uss._containersData.get(a)||[];window.cancelAnimationFrame(c[1]);c[1]=null;c[11]=null;if(!c[0]){var d=[];c[12]&&(d[12]=c[12]);c[13]&&(d[13]=c[13]);Number.isFinite(c[16])&&
(d[16]=c[16]);Number.isFinite(c[17])&&(d[17]=c[17]);Number.isFinite(c[18])&&(d[18]=c[18]);Number.isFinite(c[19])&&(d[19]=c[19]);Number.isFinite(c[20])&&(d[20]=c[20]);Number.isFinite(c[21])&&(d[21]=c[21]);Number.isFinite(c[22])&&(d[22]=c[22]);Number.isFinite(c[23])&&(d[23]=c[23]);uss._containersData.set(a,d)}"function"===typeof b&&b()}else uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},stopScrolling:function(a,b,c){a=void 0===a?uss._pageScroller:a;c=void 0===c?{debugString:"stopScrolling"}:
c;if(a===window||a instanceof Element){c=uss._containersData.get(a)||[];window.cancelAnimationFrame(c[0]);window.cancelAnimationFrame(c[1]);c[0]=null;c[1]=null;c[10]=null;c[11]=null;var d=[];c[12]&&(d[12]=c[12]);c[13]&&(d[13]=c[13]);Number.isFinite(c[16])&&(d[16]=c[16]);Number.isFinite(c[17])&&(d[17]=c[17]);Number.isFinite(c[18])&&(d[18]=c[18]);Number.isFinite(c[19])&&(d[19]=c[19]);Number.isFinite(c[20])&&(d[20]=c[20]);Number.isFinite(c[21])&&(d[21]=c[21]);Number.isFinite(c[22])&&(d[22]=c[22]);Number.isFinite(c[23])&&
(d[23]=c[23]);uss._containersData.set(a,d);"function"===typeof b&&b()}else uss._errorLogger(c.debugString,"the container to be an Element or the Window",a)},stopScrollingAll:function(a){for(var b=$jscomp.makeIterator(uss._containersData.entries()),c=b.next();!c.done;c=b.next()){var d=$jscomp.makeIterator(c.value);c=d.next().value;d=d.next().value;window.cancelAnimationFrame(d[0]);window.cancelAnimationFrame(d[1]);d[0]=null;d[1]=null;d[10]=null;d[11]=null;var e=[];d[12]&&(e[12]=d[12]);d[13]&&(e[13]=
d[13]);Number.isFinite(d[16])&&(e[16]=d[16]);Number.isFinite(d[17])&&(e[17]=d[17]);Number.isFinite(d[18])&&(e[18]=d[18]);Number.isFinite(d[19])&&(e[19]=d[19]);Number.isFinite(d[20])&&(e[20]=d[20]);Number.isFinite(d[21])&&(e[21]=d[21]);Number.isFinite(d[22])&&(e[22]=d[22]);Number.isFinite(d[23])&&(e[23]=d[23]);uss._containersData.set(c,e)}"function"===typeof a&&a()},hrefSetup:function(a,b,c,d,e,f){a=void 0===a?!0:a;b=void 0===b?!0:b;e=void 0===e?!1:e;f=void 0===f?!1:f;var p="function"===typeof c?c:
function(){};c=window.location.href.split("#")[0];var h=f&&!!(window.history&&window.history.pushState&&window.history.scrollRestoration);h&&(f=function(){var k=window.location.hash.slice(1,-1);k?(k=document.getElementById(k)||document.querySelector("a[name='"+k+"']"))&&!1!==p(null,k)&&uss.scrollIntoView(k,a,b,d,e):!1!==p(null,uss._pageScroller)&&uss.scrollTo(0,0,uss._pageScroller,d)},window.history.scrollRestoration="manual",window.addEventListener("popstate",f,{passive:!0}),window.addEventListener("unload",
function(k){return k.preventDefault()},{passive:!1,once:!0}),"complete"===document.readyState?f():window.addEventListener("load",f,{passive:!0,once:!0}));f={};for(var l=$jscomp.makeIterator(document.links),g=l.next();!g.done;f={$jscomp$loop$prop$_pageLink$12:f.$jscomp$loop$prop$_pageLink$12,$jscomp$loop$prop$_elementToReach$13:f.$jscomp$loop$prop$_elementToReach$13,$jscomp$loop$prop$_fragment$14:f.$jscomp$loop$prop$_fragment$14},g=l.next())f.$jscomp$loop$prop$_pageLink$12=g.value,f.$jscomp$loop$prop$_pageLink$12.href.split("#")[0]===
c&&(f.$jscomp$loop$prop$_fragment$14=f.$jscomp$loop$prop$_pageLink$12.hash.substring(1),""===f.$jscomp$loop$prop$_fragment$14?f.$jscomp$loop$prop$_pageLink$12.addEventListener("click",function(k){return function(n){n.preventDefault();n.stopPropagation();!1!==p(k.$jscomp$loop$prop$_pageLink$12,uss._pageScroller)&&(h&&""!==window.history.state&&window.history.pushState("","","#"),uss.scrollTo(0,0,uss._pageScroller,d))}}(f),{passive:!1}):(f.$jscomp$loop$prop$_elementToReach$13=document.getElementById(f.$jscomp$loop$prop$_fragment$14)||
document.querySelector("a[name='"+f.$jscomp$loop$prop$_fragment$14+"']"),f.$jscomp$loop$prop$_elementToReach$13?f.$jscomp$loop$prop$_pageLink$12.addEventListener("click",function(k){return function(n){n.preventDefault();n.stopPropagation();!1!==p(k.$jscomp$loop$prop$_pageLink$12,k.$jscomp$loop$prop$_elementToReach$13)&&(h&&window.history.state!==k.$jscomp$loop$prop$_fragment$14&&window.history.pushState(k.$jscomp$loop$prop$_fragment$14,"","#"+k.$jscomp$loop$prop$_fragment$14+"."),uss.scrollIntoView(k.$jscomp$loop$prop$_elementToReach$13,
a,b,d,e))}}(f),{passive:!1}):uss._warningLogger("#"+f.$jscomp$loop$prop$_fragment$14,"is not a valid anchor's destination",!0)))}};var _resizeHandled=!1;
window.addEventListener("resize",function(){_resizeHandled||(window.addEventListener("pointerover",onResize,{passive:!0}),window.addEventListener("pointerdown",onResize,{passive:!0}),window.addEventListener("touchstart",onResize,{passive:!0}),window.addEventListener("mousemove",onResize,{passive:!0}),window.addEventListener("keydown",onResize,{passive:!0}),window.addEventListener("focus",onResize,{passive:!0}),_resizeHandled=!0)},{passive:!0});
"complete"===document.readyState?__ussInit():window.addEventListener("load",__ussInit,{passive:!0,once:!0});try{window.matchMedia("(prefers-reduced-motion)").addEventListener("change",function(){uss._reducedMotion=window.matchMedia("(prefers-reduced-motion)").matches;uss.stopScrollingAll()},{passive:!0})}catch(a){window.matchMedia("(prefers-reduced-motion)").addListener(function(){uss._reducedMotion=window.matchMedia("(prefers-reduced-motion)").matches;uss.stopScrollingAll()},{passive:!0})};