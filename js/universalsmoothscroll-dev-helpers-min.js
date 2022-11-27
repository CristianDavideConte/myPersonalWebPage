export async function isValidStepLengthCalculator(e,t={container:uss._pageScroller,totalScrollAmount:100,timeout:5e3,debugString:"isValidStepLengthCalculator"}){if(null===t||"object"!=typeof t||Array.isArray(t))return uss._errorLogger("isValidStepLengthCalculator","the options parameter to be an object",t),!1;if(t.debugString=t.debugString||"isValidStepLengthCalculator","function"!=typeof e)return uss._errorLogger(t.debugString,"the stepLengthCalculator to be a function",e),!1;if(t.container!==window&&!(t.container instanceof Element))return uss._errorLogger(t.debugString,"the options.container parameter to be an Element or the Window",t.container),!1;if(!Number.isFinite(t.totalScrollAmount)||t.totalScrollAmount<0)return uss._errorLogger(t.debugString,"the options.totalScrollAmount parameter to be a positive number",t.totalScrollAmount),!1;if(!Number.isFinite(t.timeout)||t.timeout<0)return uss._errorLogger(t.debugString,"the options.timeout parameter to be a positive number",t.timeout),!1;let r=performance.now(),n=t.totalScrollAmount,o=t.timeout,i=n,a=!1,u,g=(l,s)=>{u=performance.now();let m=e(i,r,u,n,n-i,n,t.container);if(!Number.isFinite(m)){s(m);return}if(i-=m,a=u-r>o,i<=0||a){l();return}window.requestAnimationFrame(()=>g(l,s))};try{await new Promise((e,t)=>{window.requestAnimationFrame(()=>g(e,t))})}catch(l){try{uss._errorLogger(t.debugString,"the stepLengthCalculator to return a valid stepLength value",l)}catch(s){}return!1}return a&&uss._warningLogger(e.name||"the passed function","didn't complete the test scroll-animation within "+o+"ms",!1),!0}export async function getBrowserRefreshRate(e={debugString:"getBrowserRefreshRate"}){if(!Array.isArray(uss._framesTimes))return uss._errorLogger(e.debugString,"uss._framesTimes to be an array of numbers",uss._framesTimes),NaN;if(e.requestPhase=0,uss._framesTimes.length>0)return 1e3/uss.getFramesTime(!1,null,e);let t=60;try{uss._warningLogger("uss._framesTime","hasn't been calculated yet at the time of invocation"),await new Promise((e,r)=>{let n=()=>{if(uss._framesTimes[-1]){setTimeout(n,1e3);return}let r=()=>{t>0?(t--,uss.calcFramesTimes(void 0,void 0,r)):e()};r()};n()})}catch(r){try{uss._errorLogger(e.debugString,"to not throw any exception",r)}catch(n){}return NaN}return 1e3/uss.getFramesTime(!1,null,e)}