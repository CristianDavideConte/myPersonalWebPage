//Returns true if the browser used is Apple's Safari, false otherwisee
let safariBrowserUsed;
function browserIsSafari() {
	safariBrowserUsed = navigator.vendor && navigator.vendor.indexOf("Apple") > -1 &&
									   	navigator.userAgent &&
									   	navigator.userAgent.indexOf("CriOS") == -1 &&
									   	navigator.userAgent.indexOf("FxiOS") == -1;
	return safariBrowserUsed;
}

//Performs a stress test for the headerElement and the headerBackgroundElement
var _stressTestHeaderCounter = 0;
function _stressTestHeader() {
	var _testEvent = document.createEvent('Events');
	_testEvent.initEvent("click", true, false);
	if(_stressTestHeaderCounter < 100) {
		hamburgerMenuElement.dispatchEvent(_testEvent);
		window.setTimeout(_stressTestHeader, transitionTimeMedium);
		_stressTestHeaderCounter++;
	}
}

var _stressTestWebsitePreviewCounter = 0;
function _stressTestWebsitePreview() {
  let _testEvent = document.createEvent('Events');
  _testEvent.initEvent("click", true, false);
	if(_stressTestWebsitePreviewCounter < 100) {
		if(_stressTestWebsitePreviewCounter % 2 == 0)
			document.getElementsByClassName("websitePreview")[1].dispatchEvent(_testEvent);
		else
			websitePreviewExpandedBackgroundContentElement.dispatchEvent(_testEvent);

		window.setTimeout(_stressTestWebsitePreview, transitionTimeMedium + 100);
		_stressTestWebsitePreviewCounter++;
	}
}

//Performs a very fast (resource intensive) scroll test
var _stressTestVeryFastScrollCounter = 0;
function _stressTestVeryFastScroll() {
	if(_stressTestVeryFastScrollCounter < 100){
		let _scrollAmmount = (_stressTestVeryFastScrollCounter % 2 === 0) ? windowHeight / 4 : -windowHeight / 4;
		windowScrollYBy(_scrollAmmount, _stressTestVeryFastScroll);
		_stressTestVeryFastScrollCounter++;
	}
}

//Performs a scrolling test scrolling the whole document
var _stressTestFullDocumentScrollCounter = 0;
function _stressTestFullDocumentScroll() {
	if(_stressTestFullDocumentScrollCounter < 20) {
		let _scrollAmmount = (_stressTestFullDocumentScrollCounter % 2 === 0) ? windowHeight * 4 : -windowHeight * 4;
		windowScrollYBy(_scrollAmmount, _stressTestFullDocumentScroll);
		_stressTestFullDocumentScrollCounter++;
	}
}
