//Returns true if the browser used is Apple's Safari, false otherwisee
//Source: https://stackoverflow.com/questions/7944460/detect-safari-browser
function browserIsSafari(window) {
	return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
}

//Performs a stress test for the headerElement and the headerBackgroundElement
var _stressTestHeaderCounter = 0;
function stressTestHeader() {
	var _testEvent = document.createEvent('Events');
	_testEvent.initEvent("click", true, false);
	if(_stressTestHeaderCounter < 100) {
		hamburgerMenuElement.dispatchEvent(_testEvent);
		window.setTimeout(stressTestHeader, transitionTimeMedium);
		_stressTestHeaderCounter++;
	}
}

var _stressTestWebsitePreviewCounter = 0;
function stressTestWebsitePreview() {
  let _testEvent = document.createEvent('Events');
  _testEvent.initEvent("click", true, false);
	if(_stressTestWebsitePreviewCounter < 100) {
		if(_stressTestWebsitePreviewCounter % 2 == 0)
			document.getElementsByClassName("websitePreview")[1].dispatchEvent(_testEvent);
		else
			websitePreviewExpandedBackgroundContentElement.dispatchEvent(_testEvent);

		window.setTimeout(stressTestWebsitePreview, transitionTimeMedium + 100);
		_stressTestWebsitePreviewCounter++;
	}
}

//Performs a very fast (resource intensive) scroll test
var _stressTestVeryFastScrollCounter = 0;
function stressTestVeryFastScroll() {
	if(_stressTestVeryFastScrollCounter < 100){
		let _scrollAmmount = _stressTestVeryFastScrollCounter % 2 === 0 ? uss.getMaxScrollY() / 4 : -uss.getMaxScrollY() / 4;
		uss.scrollYBy(_scrollAmmount, uss.getPageScroller(), stressTestVeryFastScroll);
		_stressTestVeryFastScrollCounter++;
	} else _stressTestVeryFastScrollCounter = 0;
}

//Performs a scrolling test scrolling the whole document
var _stressTestFullDocumentScrollCounter = 0;
function stressTestFullDocumentScroll() {
	if(_stressTestFullDocumentScrollCounter < 100) {
		let _scrollAmmount = _stressTestFullDocumentScrollCounter % 2 === 0 ? uss.getMaxScrollY() : -uss.getMaxScrollY();
		uss.scrollYBy(_scrollAmmount, uss.getPageScroller(), stressTestFullDocumentScroll);
		_stressTestFullDocumentScrollCounter++;
	} else _stressTestFullDocumentScrollCounter = 0;
}

var _stressTestScrollIntoView = 0;
var _page1 = document.getElementById("home");
var _page4 = document.getElementById("contactMe");
function stressTestScrollIntoView() {
	if(_stressTestScrollIntoView < 50) {
		let page = (_stressTestScrollIntoView % 2 === 0) ? _page4 : _page1;
		uss.scrollIntoView(page, null, null, stressTestScrollIntoView, true);
		_stressTestScrollIntoView++;
	} else _stressTestScrollIntoView = 0;
}

function ussSpeedTest(n, el) {
    uss._containersData = new Map();
    let totalTime = 0;
    for(let i = 0; i < n; i++) {
        const startTime = performance.now();
        uss.isXScrolling(el);
        uss.isYScrolling(el);
        uss.isScrolling(el);
        uss.getScrollXDirection(el);
        uss.getScrollYDirection(el);
        uss.getXStepLengthCalculator(el);
        uss.getYStepLengthCalculator(el);
        uss.setXStepLengthCalculator(() => {}, el)
        uss.setYStepLengthCalculator(() => {}, el)
        uss.setStepLengthCalculator(() => {}, el)
        uss.calcXScrollbarDimension(el, true)
        uss.calcXScrollbarDimension(el, false)
        uss.calcYScrollbarDimension(el, true)
        uss.calcYScrollbarDimension(el, false)
        uss.calcScrollbarsDimensions(el, true)
        uss.calcScrollbarsDimensions(el, false)
        uss.calcBordersDimensions(el, true)
        uss.calcBordersDimensions(el, false)
        uss.stopScrollingX(el)
        uss.stopScrollingY(el)
        uss.stopScrollingY(el)
        uss.stopScrollingAll()
        totalTime += performance.now() - startTime;
    }

    const averageTime = totalTime / n;
    console.log("Iterations:", n, "\n",
                "Total Time:", totalTime + "ms\n", 
                "Average Time:", averageTime + "ms\n");
    return averageTime;
}