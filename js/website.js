const STANDARD_WINDOW_INNER_HEIGHT = 937;							//The standard browser inner height, usually about 937px at 1920x1080
const MIN_SCROLLING_ANIMATION_FRAMES_STANDARD = 7;		//The minumum number of frames that the smoothScrollVertically function can use to scroll the window if the windowHeight = STANDARD_WINDOW_INNER_HEIGHT
const MAX_SCROLLING_ANIMATION_FRAMES_STANDARD = 25;		//The maximum number of frames that the smoothScrollVertically function can use to scroll the window if the windowHeight = STANDARD_WINDOW_INNER_HEIGHT
const MIN_SPEED_INCREASE_STANDARD = 1;								//The minumum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function if the windowHeight = STANDARD_WINDOW_INNER_HEIGHT
const MAX_SPEED_INCREASE_STANDARD = 4;								//The maximum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function if the windowHeight = STANDARD_WINDOW_INNER_HEIGHT
const MAX_PAGES_GAP_NUMBER = 3;												//The maximum number of pages of the window
var MIN_SCROLLING_ANIMATION_FRAMES;										//The minumum number of frames that the smoothScrollVertically function can use to scroll the window for the current windowHeight value
var MAX_SCROLLING_ANIMATION_FRAMES;										//The maximum number of frames that the smoothScrollVertically function can use to scroll the window for the current windowHeight value
var MIN_SPEED_INCREASE;																//The minumum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function for the current windowHeight value
var MAX_SPEED_INCREASE;																//The maximum number of frames that are subtracted to the scrolling animation frames in the smoothScrollVertically function for the current windowHeight value

var windowScrollYBy; 																//A shorthand for the y => window.scroll(0, window.scrollY + y) function, used to scroll the window without the user's interaction
var mobileMode; 																		//Indicates if the css for mobile is currently being applied
var safariBrowserUsed;															//A Boolean which is true if the browser used is Apple's Safari, false otherwise
var currentPageIndex;																//The index of the HTML element with class "page" that is currently being displayed the most: if the page is 50% or on the screen, than it's currently being displayed
var websitePreviewExpandedMap; 											//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var computedStyle;																	//All the computed styles for the document.body element
var websitePreviewExpandedSize;											//The --websitePreview-expanded-size css variable, used to calculate the scale factor of the websitePreviews expansion animation
var transitionTimeMedium;														//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var documentElement; 																//A shorthand for document.documentElement, used for getting the browser's inner dimensions and computed styles
var windowWidth;																		//A shortcut for the DOM element window.innerWidth
var windowHeight;																		//A shortcut for the DOM element window.innerHeight
var windowHeightOffset;															//The difference between the previous windowHeight  and the current window.innerHeight, used only when the browser's height lowers by less than 1/3 of the current height to calculate the offset
var documentBodyElement;														//A shortcut for the HTML element document.body
var popUpMessageElement;														//The HTML element with the id "popUpMessage", used as a pop-up message container: a modal
var popUpMessageTextElement;												//The HTML element with the id "popUpMessageText", used as the text shown in the popUpMessage HTML element
var websitePreviewExpandedBackgroundContentElement; //The HTML element with the id "websitePreviewExpandedBackgroundContent", used as a layer between a websitePreviewExpanded and the page beneath
var backgroundElement;															//The HTML element with the id "backgroundElement", used as the website body background
var headerBackgroundElement;												//The HTML element with the id "headerBackground", used as the website's navbar background
var headerElement;																	//The HTML element with the id "header", used as the website navbar
var hamburgerMenuElement;														//The HTML element with the id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px
var pageLinksElements; 															//All HTML elements with the class "pageLink", shown in the header to navigate through the website' sections
var websiteShowcase;																//The HTML element with the id "websiteShowcase", children of the websitePreviewCarousel HTML element and used as container for all the websitePreviews
var carouselButtons;																//All HTML elements with the class "carouselButton", used to scroll the websitePreview carousel
var websitePreviews;																//All HTML elements with the class "websitePreview", used as a clickable previews for all the projects inside the websitePreviewShowcase
var contactMeFormElement;														//The HTML element with the id "contactMeForm", used to keep the contact informations until the contactMeFormSendButton is pressed
var contactMeFormEmailElement;											//The HTML element with the id "contactMeFormEmail", used to store the user's email when the contactMeForm is being filled
var contactMeFormBodyElement;												//The HTML element with the id "contactMeFormBody",used to store the user's message when the contactMeForm is being filled
var contactMeFormSendButtonElement;									//The HTML element with the id "contactMeFormSendButton", used to send a contact request based on the contactMeForm fields

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {
	variableInitialization();												//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();						//Initializes all the mouse and keyboard eventHandlers

	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	imageLoading();																	//Initializes all the HTML img elements' contents
}

/* This Function initializes all the public variables */
function variableInitialization() {
	windowScrollYBy = (y) => window.scroll(0, window.scrollY + y);
	documentBodyElement = document.body;

	websitePreviewExpandedMap = new Map();

	computedStyle = getComputedStyle(documentBodyElement);
	websitePreviewExpandedSize = computedStyle.getPropertyValue("--websitePreview-expanded-size").replace("vmin", "");
	transitionTimeMedium = computedStyle.getPropertyValue("--transition-time-medium").replace("s", "") * 1000;

	documentElement = document.documentElement;

	windowWidth = 0;
	windowHeight = 0;
	windowHeightOffset = 0;

	popUpMessageElement = document.getElementById("popUpMessage");
	popUpMessageTextElement = document.getElementById("popUpMessageText");
	websitePreviewExpandedBackgroundContentElement = document.getElementById("websitePreviewExpandedBackgroundContent");

	backgroundElement = document.getElementById("bodyBackground");
	headerBackgroundElement = document.getElementById("headerBackground");
	headerElement = document.getElementById("header");
	hamburgerMenuElement = document.getElementById("hamburgerMenu");
	pageLinksElements = document.getElementsByClassName("pageLink");
	websiteShowcase = document.getElementById("websiteShowcase");
	carouselButtons = document.getElementsByClassName("carouselButton");
	websitePreviews = document.getElementsByClassName("websitePreview");
	contactMeFormElement = document.getElementById("contactMeForm");
	contactMeFormEmailElement = document.getElementById("contactMeFormEmail");
	contactMeFormBodyElement = document.getElementById("contactMeFormBody");
	contactMeFormSendButtonElement = document.getElementById("contactMeFormSendButton");
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	let _isFingerDown = false;
	documentBodyElement.addEventListener("touchstart", () => _isFingerDown = true, {passive:true});
	documentBodyElement.addEventListener("touchend", () => _isFingerDown = false, {passive:true});

	let _firstScrollYPosition = null;
	let _smoothPageScrollTimeout = 0;
	window.addEventListener("scroll", event => {
			if(_firstScrollYPosition == null)
				_firstScrollYPosition = window.scrollY;
			else
				clearTimeout(_smoothPageScrollTimeout);

			_smoothPageScrollTimeout = setTimeout(function _checkFingerDown() {
					if(_isFingerDown)
						_smoothPageScrollTimeout = window.requestAnimationFrame(_checkFingerDown);
					else {
						smoothPageScroll(_firstScrollYPosition, window.scrollY);
						_firstScrollYPosition = null;
					}
			}, 66);
	}, {passive:false});

	window.addEventListener("resize", updateWindowSize, {passive:true});

	/*
	 * The user can use the arrow keys to navigate the website.
	 * Pressing the Arrow-up or the Arrow-left keys will trigger a scroll upwards by a scrollDistance of windowHeight
 	 * Pressing the Arrow-down or the Arrow-right keys will trigger a scroll downwards by a scrollDistance of windowHeight
	 * Safari support is added by using the smoothScrollVertically function.
	 */
	if(!safariBrowserUsed)
		documentBodyElement.addEventListener("keydown", event => {
			if(event.target.tagName == "BODY") {
				let _keyName = event.key;
				if(_keyName == "ArrowUp" || _keyName == "ArrowLeft") {
					windowScrollYBy(-windowHeight);
					event.preventDefault();
				} else if(_keyName == "ArrowDown" || _keyName == "ArrowRight") {
					windowScrollYBy(windowHeight);
					event.preventDefault();
				}
			}
		}, {passive:false});
	else
		documentBodyElement.addEventListener("keydown", event => {
			if(event.target.tagName == "BODY") {
				let _keyName = event.key;
				if(_keyName == "ArrowUp" || _keyName == "ArrowLeft") {
					smoothScrollVertically(-1, windowHeight);
					event.preventDefault();
				} else if(_keyName == "ArrowDown" || _keyName == "ArrowRight") {
					smoothScrollVertically(1, windowHeight);
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
	 * Whenever a link is clicked and the window is scrolled, it's convenient to hide all the links under the hamburgerMenu.
	 * This is done the same way the hamburgerMenu expands when clicked directly (see above in the comment).
	 * Plus, if safari needs a manual implementation for the smoothScroll CSS attribute.
	 */
  if(!safariBrowserUsed)
  	for(const pageLink of pageLinksElements)
			 pageLink.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});
	else {
		document.getElementById("scrollDownButton").addEventListener("click", event => {
			event.preventDefault();
			smoothScrollVertically(1, windowHeight);
		}, {passive:false});

		for(const pageLink of pageLinksElements)
 			pageLink.addEventListener("click", event => {
				event.preventDefault();
				if(!pageLinkClicked) {
					pageLinkClicked = true;
					toggleExpandHamburgerMenu();
					pageLinksSmoothScroll(pageLink);
				}
			}, {passive:false});
	}

	/* All the social networks icons are linked to the corresponding website */
	document.getElementById("githubContact").addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
	document.getElementById("stackoverflowContact").addEventListener("click", () => window.open("https://stackoverflow.com/users/13938363/cristian-davide-conte?tab=profile"), {passive:true});
	document.getElementById("instagramContact").addEventListener("click", () => window.open("https://www.instagram.com/cristiandavideconte/?hl=it"), {passive:true});
	document.getElementById("mailContact").addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});

	websiteShowcase.addEventListener("wheel", event => {
		event.preventDefault();
		let _scrollDirection = Math.sign(event.deltaY);					//1 if the scrolling is going downwards -1 otherwise
		let _totalScrollAmmount = windowWidth/20;						//The total ammount of pixel horizontally scrolled by the _smoothWebsiteShowcaseWheelScroll function
		let _scrollDistance = windowWidth/150;							//The ammount of pixel scrolled at each _smoothWebsiteShowcaseWheelScroll call
		let _partialScrollAmmount = 0;														//scrollDistance * number of _smoothWebsiteShowcaseWheelScroll function calls

		/*
		 * This function should only be called inside the websiteShowcases wheelEvent listeners.
		 * The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowWidth
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
	}, {passive:false});

	/*
	 * The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowWidth
	 * and so that is +1/100th of the window's innerWidth at any given resolution.
	 * If the direction is > 0  the scroll direction is from left to right, it's from right to left otherwise.
	 */
	let _carouselButtonScrollEnabled = false;
	function _smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection) {
		websiteShowcase.scrollLeft += scrollDirection * windowWidth / 100;
		if(_carouselButtonScrollEnabled)
			window.requestAnimationFrame(() => _smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection));
	}

	carouselButtons[0].addEventListener("mousedown", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1));
	}, {passive:true});

	carouselButtons[0].addEventListener("touchstart", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1));
	}, {passive:true});

	carouselButtons[1].addEventListener("mousedown", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => _smoothWebsiteShowcaseWheelScrollHorizzontally(1));
	}, {passive:true});

	carouselButtons[1].addEventListener("touchstart", () => {
		_carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(() => _smoothWebsiteShowcaseWheelScrollHorizzontally(1));
	}, {passive:true});

	carouselButtons[0].addEventListener("mouseup", () => _carouselButtonScrollEnabled = false, {passive:true});
	carouselButtons[0].addEventListener("touchend", () => _carouselButtonScrollEnabled = false, {passive:true});
	carouselButtons[1].addEventListener("mouseup", () => _carouselButtonScrollEnabled = false, {passive:true});
	carouselButtons[1].addEventListener("touchend", () => _carouselButtonScrollEnabled = false, {passive:true});

	for(const websitePreview of websitePreviews) {
		/* First, all the websitePreviewExpanded basic components are created */
		let _websitePreviewExpanded = document.createElement("div");
		_websitePreviewExpanded.id = "websitePreviewExpanded";
		_websitePreviewExpanded.addEventListener("click", event => event.stopPropagation(), {passive:true});

		let _websitePreviewImage = websitePreview.firstElementChild;
		let _websitePreviewExpandedImage = _websitePreviewImage.cloneNode(true);
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
			_viewCodeButton.innerHTML = "VIEW CODE";
			_viewCodeButton.className = "websitePreviewExpandedButton";
			_viewCodeButton.addEventListener("click", () => window.open(_dataCode), {passive:true});
			_viewButtonsSection.appendChild(_viewCodeButton);
		}

		let _dataDemo = websitePreview.getAttribute("data-demo");
		if(_dataDemo != null) {													//There could be a project that hasn't got a demo ready yet
			let _viewDemoButton = document.createElement("button");
			_viewDemoButton.innerHTML = "PLAY DEMO";
			_viewDemoButton.className = "websitePreviewExpandedButton";
			_viewDemoButton.addEventListener("click", () => window.open(_dataDemo), {passive:true});
			_viewButtonsSection.appendChild(_viewDemoButton);
		}

		_websitePreviewExpanded.appendChild(_viewButtonsSection);

		/* Then the websitePreviewExpanded are mapped to their websitePreview counterparts */
		websitePreviewExpandedMap.set(_websitePreviewExpanded, websitePreview);

		/* At the end of the process each websitePreview is given a listener for the back-to-normal-state animation */
		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next
			window.requestAnimationFrame(() => {
				/*
				 * The websitePreview is scaled while hovered.
				 * The top and left offset have to take the scaling into consideration otherwise
				 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
				 * The initial position is instead calculated adding the hover effect's expansion.
				 */
				let _websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
				let _documentBodyElementStyle = documentBodyElement.style;
				let _websitePreviewCurrentSize = _websitePreviewBoundingRectangle.height;
				let _websitePreviewExpandedSizeValue = (windowHeight < windowWidth) ? (windowHeight + windowHeightOffset) * websitePreviewExpandedSize / 100 : windowWidth * websitePreviewExpandedSize / 100;

				_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + windowHeightOffset + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewCurrentSize + "px");
				_documentBodyElementStyle.setProperty("--scale3dFactor",  _websitePreviewExpandedSizeValue / _websitePreviewCurrentSize);

				let _websitePreviewImageBoundingRectangle = _websitePreviewImage.getBoundingClientRect();
				_documentBodyElementStyle.setProperty("--websitePreviewImage-current-size", _websitePreviewImageBoundingRectangle.height + "px");

				websitePreviewExpandedBackgroundContentElement.appendChild(_websitePreviewExpanded);

				window.requestAnimationFrame(() => {
					websitePreview.classList.add("expandedState");
					websitePreviewExpandedBackgroundContentElement.classList.add("expandedState");
					websitePreviewExpandedBackgroundContentElement.style.pointerEvents = "auto";
				});
			});
		}, {passive:true});
	}

	/*
	 * The listenersAlreadyTriggered variable is used to prevent the user to execute the backgroundContent eventListener
	 * more than one time while the animation is still happening.
	 * Otherwise the document.body would try to remove the backgroundContent multiple times generating errors in the browser console.
	 * Note that this bug wouldn't cause the page to instantly crash.
	 */
	let _websitePreviewExpandedBackgroundListenerTriggered = false;
	websitePreviewExpandedBackgroundContentElement.addEventListener("touchmove", event => event.preventDefault(), {passive:false});
	websitePreviewExpandedBackgroundContentElement.addEventListener("wheel", event => event.preventDefault(), {passive:false});
	websitePreviewExpandedBackgroundContentElement.addEventListener("click", () => {
		event.stopPropagation();
		if(!_websitePreviewExpandedBackgroundListenerTriggered) {
			_websitePreviewExpandedBackgroundListenerTriggered = true;

			window.requestAnimationFrame(() => {
				let _currentWebsitePreviewExpanded = websitePreviewExpandedBackgroundContentElement.firstChild;
				let _currentWebsitePreview = websitePreviewExpandedMap.get(_currentWebsitePreviewExpanded);
				let _currentWebsitePreviewImage = _currentWebsitePreview.firstElementChild;
				/*
				 * The websitePreview is scaled while hovered.
				 * The top and left offset have to take the scaling into consideration otherwise
				 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
				 * The initial position is instead calculated adding the hover effect's expansion.
				 */
				let _websitePreviewBoundingRectangle = _currentWebsitePreview.getBoundingClientRect();
				let _documentBodyElementStyle = documentBodyElement.style;
				let _websitePreviewCurrentSize = _websitePreviewBoundingRectangle.height;
				let _websitePreviewExpandedSizeValue = (windowHeight < windowWidth) ? (windowHeight + windowHeightOffset) * websitePreviewExpandedSize / 100 : windowWidth * websitePreviewExpandedSize / 100;

				_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + windowHeightOffset + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewCurrentSize + "px");
				_documentBodyElementStyle.setProperty("--scale3dFactor", _websitePreviewExpandedSizeValue / _websitePreviewCurrentSize);

				let _currentWebsitePreviewImageBoundingRectangle = _currentWebsitePreviewImage.getBoundingClientRect();
				_documentBodyElementStyle.setProperty("--websitePreviewImage-current-size", _currentWebsitePreviewImageBoundingRectangle.height + "px");

				websitePreviewExpandedBackgroundContentElement.classList.remove("expandedState");

				setTimeout(() => {
					window.requestAnimationFrame(() => {
						_websitePreviewExpandedBackgroundListenerTriggered = false;
						websitePreviewExpandedBackgroundContentElement.style.pointerEvents = "";
						_currentWebsitePreview.classList.remove("expandedState");
						websitePreviewExpandedBackgroundContentElement.removeChild(_currentWebsitePreviewExpanded);
					});
				}, transitionTimeMedium);

			});
		}
	}, {passive:true});

	/*
	 * This function animates the popUpMessageElement and modifies the text shown.
	 * It also avoids the spam of this function by using a timeout which gets resetted at each function call.
	 */
	let _popUpMessageTimeout = null;
	function _showMessage(message) {
		window.requestAnimationFrame(() => {
			popUpMessageTextElement.innerHTML = message;
			popUpMessageElement.className = "messageOnScreen";

			if(_popUpMessageTimeout != null)
				clearTimeout(_popUpMessageTimeout);

			_popUpMessageTimeout = setTimeout(() => window.requestAnimationFrame(() => popUpMessageElement.className = ""), 6000);			//Every message on screen is shown for 6seconds
		});
	}

	/*
	 * This function returns:
	 * case1: "validData" if both the contactMeFormEmail && contactMeFormBody are valid
	 * case2: an error message if at least one of the two contactMeForm fields is not valid
	 * It uses a regular expression to check if the email field is correctly formatted, no further investigation is done
	 */
	function _checkContactMeFormDataIntegrity() {
		let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let valid = (regExp.test(contactMeFormEmailElement.value.toLowerCase())) ? "validData<br>" : "Type a valid email address";
		if(contactMeFormBodyElement.value == "")
			valid = (valid != "validData<br>") ?  "Fill the form first !" : valid + "Your message cannot by empty";
		return valid;
	}

 	// Success and Error functions for after the form is submitted
  function _ajaxResponceStatusSuccess() {
    contactMeFormElement.reset();
    contactMeFormEmailElement.disabled = true;
    contactMeFormBodyElement.disabled = true;
    contactMeFormSendButtonElement.disabled = true;
		contactMeFormElement.removeEventListener("submit", _submitForm, {passive:false});
		contactMeFormElement.removeAttribute("action");
		contactMeFormElement.removeAttribute("method");
		_showMessage("Message Sent!");
  }

  function _ajaxResponceStatusError(status, response, responseType) {
		contactMeFormSendButtonElement.disabled = false;
		_showMessage("Oops! There was a problem, try again later");
		console.log("Request rejected from server.\nStatus: " + status + "\nResponseType: " + responseType + "\nResponse: " + response);
  }

  /*
	 * This function:
	 * - creates an XMLHttpRequest
	 * - sends the message request
	 * - calls the _ajaxResponceStatusSuccess function when a positive response is returned (Code == 200)
	 * - calls the _ajaxResponceStatusError function when a negative response is returned (Code != 200)
	 */
  function _ajax(method, url, data, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE)
				return;
      if (xhr.status === 200)
        success(xhr.response, xhr.responseType);
      else
        error(xhr.status, xhr.response, xhr.responseType);
    };
    xhr.send(data);
  }

	/*
	 * This function:
	 * - acquires the contactMeForm data
	 * - calls _checkContactMeFormDataIntegrity in order to prevent the spam of invalid emails
	 * - if the form data is valid calls _ajax to create the request, tells the user to fill the form fields with valid data otherwise
	 */
	function _submitForm() {
		event.preventDefault();
    contactMeFormSendButtonElement.disabled = true;
		let validData = _checkContactMeFormDataIntegrity();
		if(validData == "validData<br>")
			_ajax(contactMeFormElement.method, contactMeFormElement.action, new FormData(contactMeFormElement), _ajaxResponceStatusSuccess, _ajaxResponceStatusError);
		else {
			_showMessage(validData.replace("validData<br>", ""));
			setTimeout(() => window.requestAnimationFrame(() => contactMeFormSendButtonElement.disabled = false), 6000);			//Every message on screen is shown for 6seconds
		}
	}

	/*
	 * If clicked, the contactMeFormSendButton triggers a call to the _submitForm functon
	 * which locally checks if the contactMeForm fields are valid and if so triggers an ajax request to the Formspree API.
	 * The API will send an email to the registered receiver address.
	 * The receiver address is always "cristiandavideconte@gmail.com"
	 * The sender address is the contactMeFormEmail content
	 * The body is the contactMeFormBody content
	 */
  contactMeFormElement.addEventListener("submit", _submitForm, {passive:false});
}

/*
 * This Function toggles the mobileExpanded class of the hamburgerMenu HTML element if the page is in mobileMode.
 * Mobile mode is triggered by the window's resize event.
 */
function toggleExpandHamburgerMenu() {
	if(mobileMode)
		window.requestAnimationFrame(() => {
			headerBackgroundElement.classList.toggle("mobileExpanded");
			headerElement.classList.toggle("mobileExpanded");
		});
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
 * - alligned if it covers 3/4 of the windowHeight or more
 * - scrolled, following the original user's scroll direction, otherwise
 */
if(!browserIsSafari()) {
	function smoothPageScroll(firstScrollYPosition, lastScrollYPosition) {
		currentPageIndex = Math.round(lastScrollYPosition / windowHeight);
		let _scrollYAmmount = lastScrollYPosition - firstScrollYPosition;																			//How much the y position has changed due to the user's scroll
		if(_scrollYAmmount > windowHeight / 2 || _scrollYAmmount < -windowHeight / 2) {								//The helping behavior is triggered only if the user scrolls more than windowHeight / 2
			let _scrollDirection = Math.sign(_scrollYAmmount);																										//1 if the scrolling is going downwards -1 otherwise.
			let _pageOffset = _scrollDirection * (currentPageIndex * windowHeight - lastScrollYPosition);		//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

			if(_pageOffset != 0)
				if(-_pageOffset < windowHeight / 3)																														//Case 1: The user scroll too little (less than 1/4 of the page height)
					windowScrollYBy(_scrollDirection * _pageOffset);
				else 																																															//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowHeight
					windowScrollYBy(_scrollDirection * (windowHeight + _pageOffset));
		}
	}
} else {
	/*
	 * If the browser used is Safari, which doesn't support the CSS3 scroll-behavior:smooth getAttribute
	 * the smoothPageScroll function is redifined and the smooth scrolling is done by using:
	 * - smoothScrollVertically for a generic smooth scroll of the window
	 * - pageLinksSmoothScroll for the specific case of a pageLink clicked
	 */
	function smoothPageScroll(firstScrollYPosition, lastScrollYPosition) {
		currentPageIndex = Math.round(lastScrollYPosition / windowHeight);
		let _scrollYAmmount = lastScrollYPosition - firstScrollYPosition;																			//How much the y position has changed due to the user's scroll
		if(_scrollYAmmount > windowHeight / 2 || _scrollYAmmount < -windowHeight / 2) {								//The helping behavior is triggered only if the user scrolls more than windowHeight / 2
			let _scrollDirection = Math.sign(_scrollYAmmount);																										//1 if the scrolling is going downwards -1 otherwise.
			let _pageOffset = _scrollDirection * (currentPageIndex * windowHeight - lastScrollYPosition);		//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

			if(_pageOffset != 0)
				if(-_pageOffset < windowHeight / 3)																														//Case 1: The user scroll too little (less than 1/4 of the page height)
					smoothScrollVertically(Math.sign(_scrollDirection * _pageOffset), Math.abs(_pageOffset));
				else  																																														//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowHeight
					smoothScrollVertically(Math.sign(_scrollDirection * (windowHeight + _pageOffset)), windowHeight + _pageOffset);
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
		 * _scrollDistance = remaningScrollAmmount / _maxAnimationFramesNumber
		 * _maxAnimationFramesNumber = _maxAnimationFramesNumber - _speedIncrease -> until MAX_SCROLLING_ANIMATION_FRAMES is reached (Max velocity)
		 * Where:
		 * remaningScrollAmmount = totalScrollAmmount - _partialScrollAmmount, ALWAYS POSITIVE
		 * totalScrollAmmount = the absolute value of the offset that the window has to scroll vertically
		 * _partialScrollAmmount = the ammount of pixed scrolled from the first _safariSmoothPageScroll call
		 * _maxAnimationFramesNumber = the highest number of frame the scrolling animation can use
		 * _speedIncrease = a number which grows exponentially (_speedIncrease(n) = _speedIncrease(n-1)^2): it's value is contained between MIN_SPEED_INCREASE and MAX_SPEED_INCREASE
		 * _scrollDistance = the ammount of pixel scrolled at each _safariSmoothPageScroll call
		 * _currentPagesGapNumber = the number of pages there are between the current page and the one the user wants to land on
		 */
		let _maxAnimationFramesNumber = MAX_SCROLLING_ANIMATION_FRAMES;
		let _scrollDistance = totalScrollAmmount / _maxAnimationFramesNumber;
		let _currentPagesGapNumber = totalScrollAmmount / windowHeight;

		let _speedIncrease = MAX_SPEED_INCREASE - (_currentPagesGapNumber * (MAX_SPEED_INCREASE - MIN_SPEED_INCREASE) / MAX_PAGES_GAP_NUMBER);

		let _partialScrollAmmount = 0;
		/*
		 * This function should only be called inside the smoothScrollVertically function.
		 * It physically scrolls the window by scrollDistance in the given scrollDirection at each function call.
		 */
		function _safariSmoothPageScroll() {
			if(_scrollDistance > 0) {
				windowScrollYBy(scrollDirection * _scrollDistance);
				_partialScrollAmmount += _scrollDistance;

				if(_maxAnimationFramesNumber - _speedIncrease > MIN_SCROLLING_ANIMATION_FRAMES)
					_maxAnimationFramesNumber = Math.round(_maxAnimationFramesNumber - _speedIncrease);
				else
					_maxAnimationFramesNumber = MIN_SCROLLING_ANIMATION_FRAMES;

				_speedIncrease = (_speedIncrease * _speedIncrease < MAX_SPEED_INCREASE) ? _speedIncrease * 2 : MAX_SPEED_INCREASE;
				_scrollDistance = Math.round((totalScrollAmmount - _partialScrollAmmount) / _maxAnimationFramesNumber);

				window.requestAnimationFrame(_safariSmoothPageScroll);
			} else
				pageLinkClicked = false;																								//Used to avoid the spam of pageLinksSmoothScroll function calls
		}

		window.requestAnimationFrame(_safariSmoothPageScroll);
	}

	/*
	 * This function adds the smooth scroll for the href pageLinks HTML elements
	 * It's done by comparing the current page's index and the
	 * page index of the page the user wants to land to.
	 * The actual scrolling is delegated to the smoothScrollVertically function.
	 */
	var pageLinkClicked = false;
	function pageLinksSmoothScroll(pageLink) {
		let _windowScrollY = window.scrollY;
		currentPageIndex = Math.round(_windowScrollY / windowHeight);
		let _targetPageIndex = pageLink.dataset.pageNumber;																								//The index of the page that the passed pageLink refers to
		let _totalScrollAmmount = _targetPageIndex * windowHeight - _windowScrollY;
		smoothScrollVertically(Math.sign(_totalScrollAmmount), Math.abs(_totalScrollAmmount));						// Only defined if the browser used is Safari
	}
}

/*
 * This function, accordingly to the user's preferred theme, asyncronusly load:
 * - the src content of the <img> elements
 * - background-image of the "title" classed elements
 * The full image is loaded when ready and not at the initial page loading.
 * Instead a lower resolution and blurry version of the image is loaded in the css file.
 * This allows the user to interact much quicker with the page and lowers the probability of a page crash.
 * Whenever the full image is ready the two images are swapped with a transition in between.
 */
function imageLoading() {
	function _changeWebsiteBackgroundTheme() {
		let backgroundImageUrl = computedStyle.getPropertyValue("--theme-background-image-base-url");
		let backgroundImageUrlCompressed = backgroundImageUrl + "_Compressed.jpg";

		backgroundElement.style.backgroundImage = "url(" + backgroundImageUrlCompressed + ")";

		let _backgroundImage = new Image();
		_backgroundImage.src = backgroundImageUrl + ".jpg";
		_backgroundImage.addEventListener("load", () => window.requestAnimationFrame(() => backgroundElement.style.backgroundImage = "url(" + _backgroundImage.src + ")"), {passive:true});
}

	window.matchMedia("(prefers-color-scheme:light)").addListener(_changeWebsiteBackgroundTheme);
	window.requestAnimationFrame(() => {
		let svgPageTitleMainTitleShadowImagePath = computedStyle.getPropertyValue("--main-title-svg-path").trim();
		document.getElementById("svgPageTitleMainTitleShadowImage").setAttribute("href", svgPageTitleMainTitleShadowImagePath);

		let svgPageTitleMyProjectsShadowImagePath = computedStyle.getPropertyValue("--my-projects-svg-path").trim();
		document.getElementById("svgPageTitleMyProjectsShadowImage").setAttribute("href", svgPageTitleMyProjectsShadowImagePath);

		_changeWebsiteBackgroundTheme();

		let _profilePicElement = document.getElementById("profilePic");
		let _profileImageLoaded = new Image();
		_profileImageLoaded.src = "./images/profilePictures/profilePicture.jpg";
		_profileImageLoaded.addEventListener("load", () => window.requestAnimationFrame(() => _profilePicElement.src = _profileImageLoaded.src), {passive:true});
	});
}

/*
 * This Function:
 * - calls the _update function when necessary in order to udate the windowHeight and windowWidth values
 * - checks if the page can go to the mobileMode and set the javascript mobileMode variable accordingly
 * - if needed calculates the window's offset between the previous height and the new one to adjust animation without triggering any layout shift
 */
function updateWindowSize(){
	function _update(currentWindowHeight) {
			windowHeightOffset = 0;
			windowHeight = currentWindowHeight;
			documentElement.style.setProperty("--vh", windowHeight * 0.01 + "px");
			documentElement.style.setProperty("--body-background-height", currentWindowHeight + "px");
			MAX_SCROLLING_ANIMATION_FRAMES = STANDARD_WINDOW_INNER_HEIGHT * MAX_SCROLLING_ANIMATION_FRAMES_STANDARD / windowHeight;
			MIN_SCROLLING_ANIMATION_FRAMES = STANDARD_WINDOW_INNER_HEIGHT * MIN_SCROLLING_ANIMATION_FRAMES_STANDARD / windowHeight;
			MIN_SPEED_INCREASE = STANDARD_WINDOW_INNER_HEIGHT * MIN_SPEED_INCREASE_STANDARD / windowHeight;
			MAX_SPEED_INCREASE = STANDARD_WINDOW_INNER_HEIGHT * MAX_SPEED_INCREASE_STANDARD / windowHeight;
			computedStyle = getComputedStyle(documentBodyElement);
			websitePreviewExpandedSize = computedStyle.getPropertyValue("--websitePreview-expanded-size").replace("vmin", "");
	}

	window.requestAnimationFrame(() => {
		let _currentWindowHeight = documentElement.clientHeight;
		let _currentwindowWidth = documentElement.clientWidth;

		mobileMode = (_currentwindowWidth < 1081) ? 1 : 0;

		if(mobileMode) {
			if(_currentWindowHeight >= windowHeight + windowHeightOffset)		//If the window gets higher all the variables are always updated
				_update(_currentWindowHeight);
			else if(_currentwindowWidth > windowWidth && _currentwindowWidth >= _currentWindowHeight) 		//If the window's height has reduced and the width has increased: the device has switched to Landscape mode
				_update(_currentWindowHeight);
			else 			//If the change is too small we probably are in a mobile browser where the url bar shrunk the innerHeight
				windowHeightOffset = _currentWindowHeight - windowHeight;
		} else
			_update(_currentWindowHeight);

		documentElement.style.setProperty("--window-inner-height-offset", windowHeightOffset + "px"); //Fixes mobile browsers' url bar inconsistency that can be encountered when windowHeightOffset != 0
		windowWidth = _currentwindowWidth;
	});
}

/* -------------------------------------------------------- 						TESTING CODE SECTION     					------------------------------------------------------------------*/
var _test = 0;
function lagTest() {
	websitePreview = document.getElementsByClassName("websitePreview")[1];
    var _testEvent = document.createEvent('Events');
    _testEvent.initEvent("click", true, false);
	if(_test < 100) {
		if(_test % 2 == 0)
			websitePreview.dispatchEvent(_testEvent);
		else
			websitePreviewExpandedBackgroundContentElement.dispatchEvent(_testEvent);

		setTimeout(lagTest, transitionTimeMedium + 100);
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
		windowScrollYBy(_scrollDirectionTest * windowHeight / 4 + _scrollDirectionTest);
		_scroll++;
		setTimeout(() => scrollTest(-_scrollDirectionTest), 2000);
	}
}

var _fastScroll = 0;
function _fastPagesScrollTest() {
	if(_fastScroll < 20) {
		let _scrollAmmount = (_fastScroll % 2 == 0) ? windowHeight * 4 : windowHeight * -4;
		windowScrollYBy(_scrollAmmount);
		_fastScroll++;
		setTimeout( _fastPagesScrollTest, 1000);
	}
}

/*
 * Performs a scrolling test
 */
let _testScrolledTimes = 0;
function testScrollingSmoothness() {
	if(_testScrolledTimes == 0) {
		window.scroll(0, window.scrollY - window.innerHeight / 2);
		_testScrolledTimes++;
		setTimeout(testScrollingSmoothness, 650);
	} else if(_testScrolledTimes < 50) {
		let _scrollAmmount = (_testScrolledTimes % 2 == 0) ? window.scrollY - window.innerHeight : window.scrollY + window.innerHeight;
		window.scroll(0, _scrollAmmount);
		_testScrolledTimes++;
		setTimeout(testScrollingSmoothness, 650);
	}
}
