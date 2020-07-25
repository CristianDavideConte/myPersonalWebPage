const STANDARD_WINDOW_INNER_HEIGHT = 937;							//The standard browser inner height, usually about 937px at 1920x1080
const MIN_SCROLLING_ANIMATION_FRAMES_DIVIDER = 10;		//The minumum number of frames that the smoothScrollVertically function can use to scroll the contentElement if the windowInnerHeight = STANDARD_WINDOW_INNER_HEIGHT
const MAX_SCROLLING_ANIMATION_FRAMES_DIVIDER = 60;		//The maximum number of frames that the smoothScrollVertically function can use to scroll the contentElement if the windowInnerHeight = STANDARD_WINDOW_INNER_HEIGHT
const MIN_SPEED_INCREASE = 1;													//The minumum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function
const MAX_SPEED_INCREASE = 6;													//The maximum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function
const MAX_PAGES_GAP_NUMBER = 3;												//The maximum number of pages of the contentElement
var MIN_SCROLLING_ANIMATION_FRAMES;										//The minumum number of frames that the smoothScrollVertically function can use to scroll the contentElement for the current windowInnerHeight value
var MAX_SCROLLING_ANIMATION_FRAMES;										//The maximum number of frames that the smoothScrollVertically function can use to scroll the contentElement for the current windowInnerHeight value

var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var windowInnerHeight;														//A shortcut for the DOM element window.innerHeight
//var windowPosition;															//The scrollTop value of the window, used to prevent the DOM from scrolling after a screen orientation change
var documentBodyElement;													//A shortcut for the HTML element document.body
var currentPageIndex;															//The index of the HTML element with class "page" that is currently being displayed the most: if the page is 50% or on the screen, than it's currently being displayed
var transitionTimeMedium;													//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var mobileMode; 																	//Indicates if the css for mobile is currently beign applied
var headerBackgroundElement;											//The HTML element with the id "headerBackground", used as the website's navbar background
var headerElement;																//The HTML element with the id "header", used as the website navbar
var hamburgerMenuElement;													//The HTML element with the id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px
var pageLinksElements; 														//All HTML elements with the class "pageLink", shown in the header to navigate through the website' sections
var contentElement;																//The HTML element with the id "content", used as the website main container
var carouselButtons;															//All HTML elements with the class "carouselButton", used to scroll the websitePreview carousel
var websiteShowcase;															//The HTML element with the id "websiteShowcase", children of the websitePreviewCarousel HTML element and used as container for all the websitePreviews
var websitePreviews;															//All HTML elements with the class "websitePreview", used as a clickable previews for all the projects inside the websitePreviewShowcase
var websitePreviewExpandedMap; 										//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var contactMeFormSendButtonElement;								//The HTML element with the id "contactMeFormSendButton", used to send an email request to the Madrill API
var safariBrowserUsed;														//A Boolean which is true if the browser used is Apple's Safari, false otherwise

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {
	variableInitialization();												//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();						//Initializes all the mouse and keyboard eventHandlers

	imageLoading();																	//Initializes all the HTML img elements' contents
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width

	//setTimeout(lagTest, 10000);
	//setTimeout(lagTestHeader, 10000);
	//setTimeout(() => scrollTest(_scrollDirectionTest), 5000);
}

/* This Function initializes all the public variables */
function variableInitialization() {
	documentBodyElement = document.body;

	headerBackgroundElement = document.getElementById("headerBackground");
	headerElement = document.getElementById("header");
	hamburgerMenuElement = document.getElementById("hamburgerMenu");
	pageLinksElements = document.getElementsByClassName("pageLink");
	contentElement = document.getElementById("content");
	carouselButtons = document.getElementsByClassName("carouselButton");
	websiteShowcase = document.getElementById("websiteShowcase");
	websitePreviews = document.getElementsByClassName("websitePreview");
	contactMeFormSendButtonElement = document.getElementById("contactMeFormSendButton");

	let _computedStyle = getComputedStyle(documentBodyElement);
	transitionTimeMedium = _computedStyle.getPropertyValue("--transition-time-medium").replace("s", "") * 1000;
	websitePreviewExpandedMap = new Map();
	windowInnerHeight = 0;
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	window.addEventListener("resize", updateWindowSize, {passive:true});										//Updates the height and the width whenever the window's resized
	/*
	 * The user can use the arrow keys to navigate the website.
	 * Pressing the Arrow-up or the Arrow-left keys will trigger a scroll upwards by a scrollDistance of windowInnerHeight
 	 * Pressing the Arrow-down or the Arrow-right keys will trigger a scroll downwards by a scrollDistance of windowInnerHeight
	 * Safari support is added by using the smoothScrollVertically function.
	 */
	if(!safariBrowserUsed)
		documentBodyElement.addEventListener("keydown", event => {
			if(event.target.tagName == "BODY") {
				let _keyName = event.key;
				if(_keyName == "ArrowUp" || _keyName == "ArrowLeft") {
					contentElement.scrollTop -= windowInnerHeight;
					event.preventDefault();
				} else if(_keyName == "ArrowDown" || _keyName == "ArrowRight") {
					contentElement.scrollTop += windowInnerHeight;
					event.preventDefault();
				}
			}
		}, {passive:false});
	else
		documentBodyElement.addEventListener("keydown", event => {
			if(event.target.tagName == "BODY") {
				let _keyName = event.key;
				if(_keyName == "ArrowUp" || _keyName == "ArrowLeft") {
					smoothScrollVertically(-1, windowInnerHeight);
					event.preventDefault();
				} else if(_keyName == "ArrowDown" || _keyName == "ArrowRight") {
					smoothScrollVertically(1, windowInnerHeight);
					event.preventDefault();
				}
			}
		}, {passive:false});

	/*
	 * When a scroll triggered by mouse wheel, a trackpad or touch gesture is detected
	 * on the header or its background it's immediatly stopped.
	 * Any type of scroll-event is not allowed over the header section.
	 */
	headerBackgroundElement.addEventListener("wheel", event => event.preventDefault(), {passive:false});
	headerBackgroundElement.addEventListener("touchmove", event => event.preventDefault(), {passive:false});
	headerElement.addEventListener("wheel", event => event.preventDefault(), {passive:false});
	headerElement.addEventListener("touchmove", event => event.preventDefault(), {passive:false});

	/* When the hamburgerMenu is pressed it expands by calling the toggleExpandHamburgerMenu function */
	hamburgerMenuElement.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});

	/*
	 * When the website is in mobile mode the page links are hidden under the hamburgerMenu
	 * which can be expanded by toggling the class "mobileExpanded" on the header.
	 * Once it's expanded the pageLinks can be clicked to go to the relative website section.
	 * Whenever a link is clicked and the contentElement is scrolled, it's convenient to hide all the links under the hamburgerMenu.
	 * This is done the same way the hamburgerMenu expands when clicked directly (see above in the comment).
	 * Plus, if safari needs a manual implementation for the smoothScroll CSS attribute.
	 */
  if(!safariBrowserUsed)
  	for(const pageLink of pageLinksElements)
			 pageLink.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});
	else
		for(const pageLink of pageLinksElements) {
	 		pageLink.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});
 			pageLink.addEventListener("click", () => pageLinksSmoothScroll(pageLink), {passive:false});
		}

	/* All the social networks icons are linked to the corresponding website */
	document.getElementById("githubContact").addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
	document.getElementById("instagramContact").addEventListener("click", () => window.open("https://www.instagram.com/cristiandavideconte/?hl=it"), {passive:true});
	document.getElementById("facebookContact").addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"), {passive:true});
	document.getElementById("mailContact").addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});

	let _isFingerDown = false;
	contentElement.addEventListener("touchstart", () => _isFingerDown = true, {passive:true});
	contentElement.addEventListener("touchend", () => _isFingerDown = false, {passive:true});

	let _firstScrollYPosition = null;
	let _smoothWebsiteShowcaseWheelScrollTimeout;
	contentElement.addEventListener("scroll", event => {
			if(_firstScrollYPosition == null)
				_firstScrollYPosition = contentElement.scrollTop;
			else
				clearTimeout(_smoothWebsiteShowcaseWheelScrollTimeout);

			_smoothWebsiteShowcaseWheelScrollTimeout = setTimeout(function checkFingerDown() {
				if(_isFingerDown)
					_smoothWebsiteShowcaseWheelScrollTimeout = setTimeout(checkFingerDown, 100);
				else {
					smoothPageScroll(_firstScrollYPosition, contentElement.scrollTop);
					_firstScrollYPosition = null;
				}
			}, 100);
	}, {passive:true});

	websiteShowcase.addEventListener("wheel", event => {
		let _scrollDirection = Math.sign(event.deltaY);					//1 if the scrolling is going downwards -1 otherwise
		let _totalScrollAmmount = windowInnerWidth/20;						//The total ammount of pixel horizontally scrolled by the _smoothWebsiteShowcaseWheelScroll function
		let _scrollDistance = windowInnerWidth/150;							//The ammount of pixel scrolled at each _smoothWebsiteShowcaseWheelScroll call
		let _partialScrollAmmount = 0;														//scrollDistance * number of _smoothWebsiteShowcaseWheelScroll function calls

		/*
		 * This function should only be called inside the websiteShowcases wheelEvent listeners.
		 * The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth
		 * and so that is 1/20th of the window's innerWidth at any given resolution.
		 * If the wheel is scrolled from top to bottom the scroll direction will be from right to left, it will be inverted otherwise.
		 */
		function _smoothWebsiteShowcaseWheelScroll() {
			websiteShowcase.scrollLeft += _scrollDirection * _scrollDistance;
			_partialScrollAmmount += _scrollDistance;
			if(_partialScrollAmmount < _totalScrollAmmount)
				window.requestAnimationFrame(_smoothWebsiteShowcaseWheelScroll);
		}

		window.requestAnimationFrame(_smoothWebsiteShowcaseWheelScroll);
	}, {passive:true});

	/*
	 * The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth
	 * and so that is +1/100th of the window's innerWidth at any given resolution.
	 * If the direction is > 0  the scroll direction is from left to right, it's from right to left otherwise.
	 */
	let _carouselButtonScrollEnabled = false;
	function smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection) {
		websiteShowcase.scrollLeft += scrollDirection * windowInnerWidth / 100;
		if(_carouselButtonScrollEnabled)
			window.requestAnimationFrame(() => smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection));
	}

	carouselButtons[0].addEventListener("mousedown", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => smoothWebsiteShowcaseWheelScrollHorizzontally(-1));
	}, {passive:true});

	carouselButtons[1].addEventListener("mousedown", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => smoothWebsiteShowcaseWheelScrollHorizzontally(1));
	}, {passive:true});

	carouselButtons[0].addEventListener("mouseup", () => _carouselButtonScrollEnabled = false, {passive:true});
	carouselButtons[1].addEventListener("mouseup", () => _carouselButtonScrollEnabled = false, {passive:true});

	for(const websitePreview of websitePreviews) {
		/* First, all the websitePreviewExpanded basic components are created */
		let _websitePreviewExpanded = document.createElement("div");
		_websitePreviewExpanded.id = "websitePreviewExpanded";

		let _websitePreviewExpandedImage = websitePreview.firstElementChild.cloneNode(true);
		_websitePreviewExpandedImage.className = "websitePreviewExpandedImage";
		_websitePreviewExpanded.appendChild(_websitePreviewExpandedImage);

		let _dataTitle = websitePreview.getAttribute("data-title");
		if(_dataTitle != null) {
			let _websitePreviewExpandedTitle = document.createElement("div");
			_websitePreviewExpandedTitle.className = "websitePreviewExpandedTitle";
			_websitePreviewExpandedTitle.innerHTML = _dataTitle;
			_websitePreviewExpanded.appendChild(_websitePreviewExpandedTitle);
		}

		let _viewButtonsSection = document.createElement("div");
		_viewButtonsSection.id = "websitePreviewExpandedButtonSection";

		let _dataCode = websitePreview.getAttribute("data-code");
		if(_dataCode != null) {													//There could be a project that isn't open-source
			let _viewCodeButton = document.createElement("button");
			_viewCodeButton.innerHTML = "View Code";
			_viewCodeButton.className = "websitePreviewExpandedButton";
			_viewCodeButton.addEventListener("click", event => {
				event.stopPropagation();
				window.open(_dataCode);
			}, {passive:true});
			_viewButtonsSection.appendChild(_viewCodeButton);
		}

		let _dataDemo = websitePreview.getAttribute("data-demo");
		if(_dataDemo != null) {													//There could be a project that hasn't got a demo ready yet
			let _viewDemoButton = document.createElement("button");
			_viewDemoButton.innerHTML = "View Demo";
			_viewDemoButton.className = "websitePreviewExpandedButton";
			_viewDemoButton.addEventListener("click", event => {
				event.stopPropagation();
				window.open(_dataDemo);
			}, {passive:true});
			_viewButtonsSection.appendChild(_viewDemoButton);
		}

		_websitePreviewExpanded.appendChild(_viewButtonsSection);

		let _backgroundContent = document.createElement("div");
		_backgroundContent.id = "websitePreviewExpandedBackgroundContent";
		_backgroundContent.className = "page";
		_backgroundContent.appendChild(_websitePreviewExpanded);

		/*
		 * The listenersAlreadyTriggered variable is used to prevent the user to execute the backgroundContent eventListener
		 * more than one time while the animation is still happening.
		 * Otherwise the document.body would try to remove the backgroundContent multiple times generating errors in the browser console.
		 * Note that this bug wouldn't cause the page to instantly crash.
		 */
		let _listenersAlreadyTriggered = false;
		_backgroundContent.addEventListener("click", () => {
			event.stopPropagation();
			if(!_listenersAlreadyTriggered) {
				_listenersAlreadyTriggered = true;
				setTimeout(() => {
					_listenersAlreadyTriggered = false;
					headerElement.style = "";
					websitePreview.classList.remove("expandedState");
					documentBodyElement.removeChild(_backgroundContent);
				}, transitionTimeMedium);
				/*
				 * The websitePreview is scaled while hovered.
				 * The top and left offset have to take the scaling into consideration otherwise
				 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
				 * The initial position is instead calculated adding the hover effect's expansion.
				 */
				let _websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
				let _documentBodyElementStyle = documentBodyElement.style;
				_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewBoundingRectangle.height + "px");

				_websitePreviewExpanded.className = "";
			}
		}, {passive:true});

		websitePreviewExpandedMap.set(websitePreview, _backgroundContent);

		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next
			setTimeout(() => {
				_websitePreviewExpanded.className = "expandedState";
				websitePreview.classList.add("expandedState");
			}, 20);

			/*
			 * The websitePreview is scaled while hovered.
			 * The top and left offset have to take the scaling into consideration otherwise
			 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
			 * The initial position is instead calculated adding the hover effect's expansion.
			 */
			let _websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
			let _documentBodyElementStyle = documentBodyElement.style;
			documentBodyElement.insertBefore(websitePreviewExpandedMap.get(websitePreview), documentBodyElement.firstChild);

			_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + "px");
			_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
			_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewBoundingRectangle.height + "px");

			headerElement.style.pointerEvents = "none";
		}, {passive:true});
	}

	/* ----------------------------ABORT------------------------------------
	 * If clicked the contactMeFormSendButton sends a POST request to the Mandrill API
	 * with the contactMeFormName, contactMeFormSubject and the contactMeFormBody as the request's data.
	 * All the datas are first extracted from the form's fields.
	 * A data object is then created using the just extracted datas.
	 * A POST request is created. And the page asyncronusly waits for the server's response.
	 * The server response is used to give a feedback to the user.
	 /
	contactMeFormSendButtonElement.addEventListener("click", () => {
		let request = new XMLHttpRequest();
		let data = {
    "key": "KEY HERE",
    "message": {
      "subject": "Your copy of the message",
      "from_email": "cristiandavideconte@gmail.com",
      "to": [
          {
            "email": "cristiandavideconte@gmail.com",
            "name": "Contact Request from myPersonalWebPage",
            "type": "to"
          },
					{
						"email": "SENDER MAIL",
						"name": "",
						"type": "to"
					}
        ],
      "autotext": "true",
      "subject": "SENDER SUBJECT",
      "html": "MAIL BODY"
    }
  }
		request.onreadystatechange = () => {
				//Check if the request is compete and was successful
				if(this.readyState === 4 && this.status === 200) {
					console.log(this.responseText);
				} else
					console.log("ERRORE");
		};
		request.open("POST", "https://mandrillapp.com/api/1.0/messages/send.json", true);
		request.send(data);
	}, {passive:true});*/
}

/*
 * This Function toggles the mobileExpanded class of the hamburgerMenu HTML element if the page is in mobileMode.
 * Mobile mode is triggered by the window's resize event.
 */
function toggleExpandHamburgerMenu() {
	if(mobileMode) {
		headerBackgroundElement.classList.toggle("mobileExpanded");
		headerElement.classList.toggle("mobileExpanded");
	}
}

/* Returns true if the user's browser is Safari, false otherwise */
function browserIsSafari() {
	safariBrowserUsed = navigator.vendor && navigator.vendor.indexOf("Apple") > -1 &&
									   	navigator.userAgent &&
									   	navigator.userAgent.indexOf("CriOS") == -1 &&
									   	navigator.userAgent.indexOf("FxiOS") == -1;
	return safariBrowserUsed;
}

/*
 * This Function emulates the smooth scroll behaviour provided by css
 * taking into consideration the current page position.
 * It triggers after a scroll is completed.
 * If at the end of the scroll, the current page is not alligned, it gets:
 * - alligned if it covers 3/4 of the windowInnerHeight or more
 * - scrolled, following the original user's scroll direction, otherwise
 */
if(!browserIsSafari()) {
	function smoothPageScroll(firstScrollYPosition, lastScrollYPosition) {
		currentPageIndex = Math.round(lastScrollYPosition / windowInnerHeight);
		let _scrollYAmmount = lastScrollYPosition - firstScrollYPosition;																			//How much the y position has changed due to the user's scroll
		if(_scrollYAmmount > windowInnerHeight / 2 || _scrollYAmmount < -windowInnerHeight / 2) {								//The helping behavior is triggered only if the user scrolls more than windowInnerHeight / 2
			let _scrollDirection = Math.sign(_scrollYAmmount);																										//1 if the scrolling is going downwards -1 otherwise.
			let _pageOffset = _scrollDirection * (currentPageIndex * windowInnerHeight - lastScrollYPosition);		//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

			if(_pageOffset != 0)
				if(-_pageOffset < windowInnerHeight / 3)																														//Case 1: The user scroll too little (less than 1/4 of the page height)
					contentElement.scrollTop += _scrollDirection * _pageOffset;
				else 																																															//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowInnerHeight
					contentElement.scrollTop += _scrollDirection * (windowInnerHeight + _pageOffset);
		}
	}
} else {
	/*
	 * If the browser used is Safari, which doesn't support the CSS3 scroll-behavior:smooth getAttribute
	 * the smoothPageScroll function is redifined and the smooth scrolling is done by using:
	 * - smoothScrollVertically for a generic smooth scroll of the contentElement
	 * - pageLinksSmoothScroll for the specific case of a pageLink clicked
	 */
	function smoothPageScroll(firstScrollYPosition, lastScrollYPosition) {
		currentPageIndex = Math.round(lastScrollYPosition / windowInnerHeight);
		let _scrollYAmmount = lastScrollYPosition - firstScrollYPosition;																			//How much the y position has changed due to the user's scroll
		if(_scrollYAmmount > windowInnerHeight / 2 || _scrollYAmmount < -windowInnerHeight / 2) {								//The helping behavior is triggered only if the user scrolls more than windowInnerHeight / 2
			let _scrollDirection = Math.sign(_scrollYAmmount);																										//1 if the scrolling is going downwards -1 otherwise.
			let _pageOffset = _scrollDirection * (currentPageIndex * windowInnerHeight - lastScrollYPosition);		//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

			if(_pageOffset != 0)
				if(-_pageOffset < windowInnerHeight / 3)																														//Case 1: The user scroll too little (less than 1/4 of the page height)
					smoothScrollVertically(Math.sign(_scrollDirection * _pageOffset), Math.abs(_pageOffset));
				else  																																														//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowInnerHeight
					smoothScrollVertically(Math.sign(_scrollDirection * (windowInnerHeight + _pageOffset)), windowInnerHeight + _pageOffset);
		}
	}

	/*
	 * This funcion replaces the scroll-behavior:smooth css rules for the safari browser that doesn't support it.
	 * scrollDirection is 1 if the scrolling is going downwards -1 otherwise.
	 * totalScrollAmmount is the total ammount of pixel vertically scrolled by the smoothScrollVertically function: MUST ALWAYS BE >= 0
	 */
	function smoothScrollVertically(scrollDirection, totalScrollAmmount) {
		/*
		 * The velocity of the scrolling (scrollDistance) is calculated by following this formula:
		 * scrollDistance = totalScrollAmmount / maxAnimationFramesNumber
		 * maxAnimationFramesNumber = maxAnimationFramesNumber - speedIncrease -> until MAX_SCROLLING_ANIMATION_FRAMES is reached (Max velocity)
		 * contentElement.scrollTop = scrollDirection * scrollDistance
		 * Where:
		 * totalScrollAmmount = the absolute value of the offset the contentElement has to scroll vertically
		 * maxAnimationFramesNumber = the highest number of frame the scrolling animation can use
		 * speedIncrease = a number which grows exponentially (speedIncrease(n) = speedIncrease(n-1)^2): it's value is contained between MIN_SPEED_INCREASE and MAX_SPEED_INCREASE
		 */
		let _maxAnimationFramesNumber = MAX_SCROLLING_ANIMATION_FRAMES;
		let _partialScrollAmmount = 0;																									//The ammount of pixed scrolled from the first _safariSmoothPageScroll call
		let _scrollDistance = totalScrollAmmount / _maxAnimationFramesNumber;						//The ammount of pixel scrolled at each _safariSmoothPageScroll call
		let _currentPagesGapNumber = totalScrollAmmount / windowInnerHeight;						//How many pages there are between the current page and the one the user wants to land on
		let _speedIncrease = MAX_SPEED_INCREASE - (_currentPagesGapNumber * (MAX_SPEED_INCREASE - MIN_SPEED_INCREASE) / MAX_PAGES_GAP_NUMBER);

		/*
		 * This function should only be called inside the smoothScrollVertically function.
		 * It physically scrolls the contentElement by scrollDistance in the given scrollDirection at each function call.
		 */
		function _safariSmoothPageScroll() {
			contentElement.scrollTop += scrollDirection * _scrollDistance;
			_partialScrollAmmount += _scrollDistance;

			let _scrollRemaningDistance = totalScrollAmmount - _partialScrollAmmount;		//Never negative because the totalScrollAmmount is given by its absolute value
			if(_scrollRemaningDistance > 0) {
				if(_maxAnimationFramesNumber - _speedIncrease > MIN_SCROLLING_ANIMATION_FRAMES)
					_maxAnimationFramesNumber = Math.round(_maxAnimationFramesNumber - _speedIncrease);
				else
					_maxAnimationFramesNumber = MIN_SCROLLING_ANIMATION_FRAMES;

				_speedIncrease = (_speedIncrease * _speedIncrease < MAX_SPEED_INCREASE) ? _speedIncrease * _speedIncrease : MAX_SPEED_INCREASE;
				_scrollDistance = Math.round(_scrollRemaningDistance / _maxAnimationFramesNumber);

				if(_scrollDistance > 0)
					window.requestAnimationFrame(_safariSmoothPageScroll);
			}
		}

		window.requestAnimationFrame(_safariSmoothPageScroll);
	}

	/*
	 * This function adds the smooth scroll for the href pageLinks HTML elements
	 * It's done by comparing the current page's index and the
	 * page index of the page the user wants to land to.
	 * The actual scrolling is delegated to the smoothScrollVertically function.
	 */
	function pageLinksSmoothScroll(pageLink) {
		event.preventDefault();
		let _contentElementScrollTop = contentElement.scrollTop;
		currentPageIndex = Math.round(_contentElementScrollTop / windowInnerHeight);
		let _targetPageIndex = pageLink.dataset.pageNumber;																							//The index of the page the passed pageLink refers
		let _totalScrollAmmount = _targetPageIndex * windowInnerHeight - _contentElementScrollTop;
		smoothScrollVertically(Math.sign(_totalScrollAmmount), Math.abs(_totalScrollAmmount));						// Only defined if the browser used is Safari
	}
}

/*
 * This function asyncronusly load the content of the DOM img elements
 * The full image is loaded when ready and not at the initial page loading.
 * Instead a lower resolution and blurry version of the image is loaded in the css file.
 * This allows the user to interact much quicker with the page and lowers the probability of a page crash.
 * Whenever the full image is ready the two images are swapped with a transition in between.
 */
function imageLoading() {
	let backgroundElement = document.getElementById("bodyBackground");
	let backgroundElementLoaded = backgroundElement.cloneNode(true);
	let backgroundImage = new Image();
	backgroundImage.src = "./images/backgroundImages/LakeAndMountains.jpg";
	backgroundImage.addEventListener("load", () => window.requestAnimationFrame(() => {
		backgroundElementLoaded.style.backgroundImage = "url(" + backgroundImage.src + ")"; //Setting the src wouldn't allow the new image to use the css style already calculated
		backgroundElement.before(backgroundElementLoaded);
		documentBodyElement.removeChild(backgroundElement);
	}), {passive:true});

	let profilePicElement = document.getElementById("profilePic");
	let profileImageLoaded = new Image();
	profileImageLoaded.src = "./images/profilePictures/profilePicture.jpg";
	profileImageLoaded.addEventListener("load", () => window.requestAnimationFrame(() => profilePicElement.src = profileImageLoaded.src), {passive:true});
}

/*
 * This Function:
 * - udates the windowInnerHeight and windowInnerWidth variables with the new window' values
 * - resets the body height to that of the inner browser: this is used to fix the different height behaviour of the mobile browsers' navigation bars
 * - check if the page can go to the mobileMode and set the javascript mobileMode variable accordingly
 */
function updateWindowSize(){
	window.requestAnimationFrame(() => {
		if(window.innerHeight > windowInnerHeight) {
			windowInnerHeight = window.innerHeight;
			document.documentElement.style.setProperty("--vh", windowInnerHeight * 0.01 + "px");
			MAX_SCROLLING_ANIMATION_FRAMES = windowInnerHeight * MAX_SCROLLING_ANIMATION_FRAMES_DIVIDER / STANDARD_WINDOW_INNER_HEIGHT;
			MIN_SCROLLING_ANIMATION_FRAMES = windowInnerHeight * MIN_SCROLLING_ANIMATION_FRAMES_DIVIDER / STANDARD_WINDOW_INNER_HEIGHT;
		} else if(window.innerWidth > windowInnerWidth) {		//If the window's height has reduced and the width has increased: the device has switched to Landscape mode
			windowInnerHeight = window.innerHeight;
			document.documentElement.style.setProperty("--vh", windowInnerHeight * 0.01 + "px");
			MAX_SCROLLING_ANIMATION_FRAMES = windowInnerHeight * MAX_SCROLLING_ANIMATION_FRAMES_DIVIDER / STANDARD_WINDOW_INNER_HEIGHT;
			MIN_SCROLLING_ANIMATION_FRAMES = windowInnerHeight * MIN_SCROLLING_ANIMATION_FRAMES_DIVIDER / STANDARD_WINDOW_INNER_HEIGHT;
		}

		windowInnerWidth = window.innerWidth;
		mobileMode = (windowInnerWidth < 1081 || windowInnerHeight < 601) ? 1 : 0;
	});
}

/* -------------------------------------------------------- 						TESTING CODE SECTION     					------------------------------------------------------------------*/
var _test = 0;
function lagTest() {
	websitePreview = document.getElementsByClassName("websitePreview")[0];
    var _testEvent = document.createEvent('Events');
    _testEvent.initEvent("click", true, false);
	if(_test < 100) {
		if(_test % 2 == 0)
			websitePreview.dispatchEvent(_testEvent);
		else
			documentBodyElement.firstChild.dispatchEvent(_testEvent);

		setTimeout(lagTest, transitionTimeMedium);
		_test++;
	}
}

var _test2 = 0;
function lagTestHeader() {
	var _testEvent = document.createEvent('Events');
    _testEvent.initEvent("click", true, false);
	if(_test2 < 100) {
		hamburgerMenuElement.dispatchEvent(_testEvent);
		setTimeout(lagTestHeader, transitionTimeMedium);
		_test2++;
	}
}

var _scroll = 0;
var _scrollDirectionTest = 1;
function scrollTest(_scrollDirectionTest) {
	if(_scroll < 10){
		contentElement.scrollTop += _scrollDirectionTest * windowInnerHeight / 4 + _scrollDirectionTest;
		_scroll++;
		setTimeout(() => scrollTest(-_scrollDirectionTest), 2000);
	}
}
