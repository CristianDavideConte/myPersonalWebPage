var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
var DEFAULTXSTEPLENGTH=50*window.innerWidth/1920,DEFAULTYSTEPLENGTH=50*window.innerHeight/937,DEFAULTMINANIMATIONFRAMES=5,DEFAULTSCROLLCALCULATORTESTVALUE=100,uss={_xMapContainerAnimationID:new Map,_yMapContainerAnimationID:new Map,_xStepLengthCalculator:new Map,_yStepLengthCalculator:new Map,_xStepLength:DEFAULTXSTEPLENGTH,_yStepLength:DEFAULTYSTEPLENGTH,_minAnimationFrame:DEFAULTMINANIMATIONFRAMES,_reducedMotion:"matchMedia"in window&&window.matchMedia("(prefers-reduced-motion)").matches,isXscrolling:function(a){a=
void 0===a?window:a;a=uss._xMapContainerAnimationID.get(a);return"undefined"!==typeof a&&0<a.length},isYscrolling:function(a){a=void 0===a?window:a;a=uss._yMapContainerAnimationID.get(a);return"undefined"!==typeof a&&0<a.length},isScrolling:function(a){a=void 0===a?window:a;return uss.isXscrolling(a)||uss.isYscrolling(a)},getXStepLengthCalculator:function(a){a=void 0===a?window:a;return uss._xStepLengthCalculator.get(a)},getYStepLengthCalculator:function(a){a=void 0===a?window:a;return uss._yStepLengthCalculator.get(a)},
getXStepLength:function(){return uss._xStepLength},getYStepLength:function(){return uss._yStepLength},getMinAnimationFrame:function(){return uss._minAnimationFrame},getReducedMotionState:function(){return uss._reducedMotion},setXStepLengthCalculator:function(a,b){b=void 0===b?window:b;if("function"!==typeof a)console.error("USS Error:",a,"is not a function");else{var c=DEFAULTSCROLLCALCULATORTESTVALUE;c=a(c,0,c,0,c,b);Number.isFinite(c)?uss._xStepLengthCalculator.set(b,a):console.error("USS Error:",
a.name||"Anonymous function","didn't return a valid step value")}},setYStepLengthCalculator:function(a,b){b=void 0===b?window:b;if("function"!==typeof a)console.error("USS Error:",a,"is not a function");else{var c=DEFAULTSCROLLCALCULATORTESTVALUE;c=a(c,0,c,0,c,b);Number.isFinite(c)?uss._yStepLengthCalculator.set(b,a):console.error("USS Error:",a.name||"Anonymous function","didn't return a valid step value")}},setStepLengthCalculator:function(a,b){b=void 0===b?window:b;if("function"!==typeof a)console.error("USS Error:",
a,"is not a function");else{var c=DEFAULTSCROLLCALCULATORTESTVALUE;c=a(c,0,c,0,c,b);Number.isFinite(c)?(uss._xStepLengthCalculator.set(b,a),uss._yStepLengthCalculator.set(b,a)):console.error("USS Error:",a.name||"Anonymous function","didn't return a valid step value")}},setXStepLength:function(a){Number.isFinite(a)?0>=a?console.error("USS Error:",a,"must be a positive number"):uss._xStepLength=a:console.error("USS Error:",a,"is not a number")},setYStepLength:function(a){Number.isFinite(a)?0>=a?console.error("USS Error:",
a,"must be a positive number"):uss._yStepLength=a:console.error("USS Error:",a,"is not a number")},setStepLength:function(a){Number.isFinite(a)?0>=a?console.error("USS Error:",a,"must be a positive number"):(uss._xStepLength=a,uss._yStepLength=a):console.error("USS Error:",a,"is not a number")},setMinAnimationFrame:function(a){Number.isFinite(a)?0>=a?console.error("USS Error:",a,"must be a positive number"):uss._minAnimationFrame=a:console.error("USS Error:",a,"is not a number")},calcXStepLength:function(a){return a>=
(uss._minAnimationFrame-1)*uss._xStepLength?uss._xStepLength:Math.round(a/uss._minAnimationFrame)},calcYStepLength:function(a){return a>=(uss._minAnimationFrame-1)*uss._yStepLength?uss._yStepLength:Math.round(a/uss._minAnimationFrame)},getScrollXCalculator:function(a){a=void 0===a?window:a;return a===window?function(){return a.scrollX}:a instanceof HTMLElement?function(){return a.scrollLeft}:function(){console.error("USS Error: cannot determine the ScrollXCalculator of",a,"because it's neither an HTMLElement nor the window");
throw"USS error";}},getScrollYCalculator:function(a){a=void 0===a?window:a;return a===window?function(){return a.scrollY}:a instanceof HTMLElement?function(){return a.scrollTop}:function(){console.error("USS Error: cannot determine the ScrollYCalculator of",a,"because it's neither an HTMLElement nor the window");throw"USS error";}},getMaxScrollX:function(a){a=void 0===a?window:a;var b=document.documentElement,c=document.body;return a instanceof HTMLElement?a.scrollWidth-a.clientWidth:Math.max(c.scrollWidth,
c.offsetWidth,c.clientWidth,b.clientWidth,b.scrollWidth,b.offsetWidth)-b.clientWidth},getMaxScrollY:function(a){a=void 0===a?window:a;var b=document.documentElement,c=document.body;return a instanceof HTMLElement?a.scrollHeight-a.clientHeight:Math.max(c.scrollHeight,c.offsetHeight,c.clientHeight,b.clientHeight,b.scrollHeight,b.offsetHeight)-b.clientHeight},getScrollableParent:function(a,b){a=void 0===a?window:a;b=void 0===b?!1:b;if(a===window)return window;try{var c=getComputedStyle(a);if("fixed"===
c.position)return window;var d="absolute"===c.position,e=b?/(auto|scroll|hidden)/:/(auto|scroll)/,g;for(g=a;g=g.parentElement;)if(c=getComputedStyle(g),(!d||"static"!==c.position)&&e.test(c.overflow+c.overflowY+c.overflowX)&&(g.scrollWidth>g.clientWidth||g.scrollHeight>g.clientHeight))return g;return window}catch(m){return console.error("USS Error: Couldn't get the parent container of the element",a),window}},scrollXTo:function(a,b,c,d){function e(k){h=uss._xMapContainerAnimationID.get(b);h.shift();
var n=g(),p=(a-n)*f;if(0>=p)uss._xMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0);else{if(t){if(k=r(p,k,l,n,a,b),!Number.isFinite(k)||0>k)k=q}else k=q;p<=k?(b.scroll(a,m()),uss._xMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0)):(b.scroll(n+k*f,m()),n===g()?(uss._xMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0)):(h.push(window.requestAnimationFrame(e)),uss._xMapContainerAnimationID.set(b,h)))}}b=void 0===b?
window:b;c=void 0===c?function(){}:c;d=void 0===d?!1:d;if(Number.isFinite(a))if(0>=uss.getMaxScrollX(b))"function"===typeof c&&window.setTimeout(c,0);else{0>a&&(a=0);var g=uss.getScrollXCalculator(b),m=uss.getScrollYCalculator(b),l=a-g(),f=0<l?1:-1;l*=f;if(0>=l)"function"===typeof c&&window.setTimeout(c,0);else if(uss._reducedMotion)b.scroll(a,m()),"function"===typeof c&&window.setTimeout(c,0);else{var q=uss.calcXStepLength(l);!1===d&&uss.stopScrollingX(b,null);var h=uss._xMapContainerAnimationID.get(b);
"undefined"===typeof h&&(h=[]);h.push(window.requestAnimationFrame(e));uss._xMapContainerAnimationID.set(b,h);var r=uss._xStepLengthCalculator.get(b),t="function"===typeof r}}else console.error("USS Error:",a,"is not a number")},scrollYTo:function(a,b,c,d){function e(k){h=uss._yMapContainerAnimationID.get(b);h.shift();var n=m(),p=(a-n)*f;if(0>=p)uss._yMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0);else{if(t){if(k=r(p,k,l,n,a,b),!Number.isFinite(k)||0>k)k=q}else k=q;
p<=k?(b.scroll(g(),a),uss._yMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0)):(b.scroll(g(),n+k*f),n===m()?(uss._yMapContainerAnimationID.set(b,h),"function"===typeof c&&window.setTimeout(c,0)):(h.push(window.requestAnimationFrame(e)),uss._yMapContainerAnimationID.set(b,h)))}}b=void 0===b?window:b;c=void 0===c?function(){}:c;d=void 0===d?!1:d;if(Number.isFinite(a))if(0>=uss.getMaxScrollY(b))"function"===typeof c&&window.setTimeout(c,0);else{0>a&&(a=0);var g=uss.getScrollXCalculator(b),
m=uss.getScrollYCalculator(b),l=a-m(),f=0<l?1:-1;l*=f;if(0>=l)"function"===typeof c&&window.setTimeout(c,0);else if(uss._reducedMotion)b.scroll(g(),a),"function"===typeof c&&window.setTimeout(c,0);else{var q=uss.calcYStepLength(l);!1===d&&uss.stopScrollingY(b,null);var h=uss._yMapContainerAnimationID.get(b);"undefined"===typeof h&&(h=[]);h.push(window.requestAnimationFrame(e));uss._yMapContainerAnimationID.set(b,h);var r=uss._yStepLengthCalculator.get(b),t="function"===typeof r}}else console.error("USS Error:",
a,"is not a number")},scrollXBy:function(a,b,c,d){b=void 0===b?window:b;c=void 0===c?function(){}:c;d=void 0===d?!1:d;Number.isFinite(a)?0===a?"function"===typeof c&&window.setTimeout(c,0):uss.scrollXTo(uss.getScrollXCalculator(b)()+a,b,c,d):console.error("USS Error:",a,"is not a number")},scrollYBy:function(a,b,c,d){b=void 0===b?window:b;c=void 0===c?function(){}:c;d=void 0===d?!1:d;Number.isFinite(a)?0===a?"function"===typeof c&&window.setTimeout(c,0):uss.scrollYTo(uss.getScrollYCalculator(b)()+
a,b,c,d):console.error("USS Error:",a,"is not a number")},scrollTo:function(a,b,c,d,e){c=void 0===c?window:c;d=void 0===d?function(){}:d;e=void 0===e?!1:e;var g={__requiredSteps:1,__currentSteps:0,__function:"function"===typeof d?function(){g.__currentSteps<g.__requiredSteps?g.__currentSteps++:d()}:null};uss.scrollXTo(a,c,g.__function,e);uss.scrollYTo(b,c,g.__function,e)},scrollBy:function(a,b,c,d,e){c=void 0===c?window:c;d=void 0===d?function(){}:d;e=void 0===e?!1:e;Number.isFinite(a)?Number.isFinite(b)?
0===a&&0===b?"function"===typeof d&&window.setTimeout(d,0):0===a?uss.scrollYBy(b,c,d,e):0===b?uss.scrollXBy(a,c,d,e):uss.scrollTo(uss.getScrollXCalculator(c)()+a,uss.getScrollYCalculator(c)()+b,c,d,e):console.error("USS Error:",b,"is not a number"):console.error("USS Error:",a,"is not a number")},scrollIntoView:function(a,b,c,d,e){function g(){uss.scrollBy(u,v,w,function(){w===window?(a.focus(),k.__function()):(f=m.getBoundingClientRect(),n=f.left,p=f.top,u=n-x,v=p-y,0<u*z||0<v*A?(w=uss.getScrollableParent(w,
e),window.setTimeout(g,0)):(a.focus(),k.__function()))})}a=void 0===a?window:a;b=void 0===b?!0:b;c=void 0===c?!0:c;d=void 0===d?function(){}:d;e=void 0===e?!1:e;if(a!==window)if(a instanceof HTMLElement){var m=uss.getScrollableParent(a,e),l=a.getBoundingClientRect(),f=m!==window?m.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight},q=l.left-f.left,h=l.top-f.top,r=!0===b?0:!1===b?f.width-l.width:.5*(f.width-l.width),t=!0===c?0:!1===c?f.height-l.height:.5*(f.height-
l.height),k={__requiredSteps:0,__currentSteps:0,__function:"function"===typeof d?function(){k.__currentSteps<k.__requiredSteps?k.__currentSteps++:d()}:function(){}};window.setTimeout(function(){uss.scrollBy(q-r,h-t,m,k.__function)},0);if(m!==window){var n=f.left,p=f.top,x=!0===b?0:!1===b?window.innerWidth-f.width:.5*(window.innerWidth-f.width),y=!0===c?0:!1===c?window.innerHeight-f.height:.5*(window.innerHeight-f.height),u=n-x,v=p-y,z=0<u?1:-1,A=0<v?1:-1,w=uss.getScrollableParent(m,e);k.__requiredSteps++;
window.setTimeout(g,0)}}else console.error("USS Error:",a,"is not an HTML element")},stopScrollingX:function(a,b){a=void 0===a?window:a;b=void 0===b?function(){}:b;var c=uss._xMapContainerAnimationID.get(a);"undefined"!==typeof c&&0!==c.length&&(c.forEach(function(d){return window.cancelAnimationFrame(d)}),uss._xMapContainerAnimationID.set(a,[]));"function"===typeof b&&window.setTimeout(b,0)},stopScrollingY:function(a,b){a=void 0===a?window:a;b=void 0===b?function(){}:b;var c=uss._yMapContainerAnimationID.get(a);
"undefined"!==typeof c&&0!==c.length&&(c.forEach(function(d){return window.cancelAnimationFrame(d)}),uss._yMapContainerAnimationID.set(a,[]));"function"===typeof b&&window.setTimeout(b,0)},stopScrolling:function(a,b){a=void 0===a?window:a;b=void 0===b?function(){}:b;uss.stopScrollingX(a,null);uss.stopScrollingY(a,b)},hrefSetup:function(a,b,c,d,e){a=void 0===a?!0:a;b=void 0===b?!0:b;c=void 0===c?function(){}:c;d=void 0===d?function(){}:d;e=void 0===e?!1:e;var g="function"===typeof c?c:function(){},
m=document.links;c=document.URL.split("#")[0];var l={};m=$jscomp.makeIterator(m);for(var f=m.next();!f.done;l={$jscomp$loop$prop$_elementToReach$2:l.$jscomp$loop$prop$_elementToReach$2},f=m.next())_pageLink=f.value,f=_pageLink.href.split("#"),f[0]===c&&(l.$jscomp$loop$prop$_elementToReach$2=document.getElementById(f[1]),null===l.$jscomp$loop$prop$_elementToReach$2?console.warn("USS Error:",_pageLink,"doesn't have a valid destination element"):_pageLink.addEventListener("click",function(q){return function(h){h.preventDefault();
g(_pageLink,q.$jscomp$loop$prop$_elementToReach$2);uss.scrollIntoView(q.$jscomp$loop$prop$_elementToReach$2,a,b,d,e)}}(l),{passive:!1}))}};window.matchMedia("(prefers-reduced-motion)").addEventListener("change",function(){return uss._reducedMotion=!uss._reducedMotion});
