var windowScrollYBy; 																//A shorthand for the y => zenscroll.toY(window.scrollY + y) function, used to scroll the window without the user's interaction
var mobileMode; 																		//Indicates if the css for mobile is currently being applied
var currentPageIndex;																//The index of the HTML element with class "page" that is currently being displayed the most: if the page is 50% or on the screen, than it's currently being displayed
var websitePreviewExpandedMap; 											//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var computedStyle;																	//All the computed styles for the document.body element
var websitePreviewExpandedSize;											//The --websitePreview-expanded-size css variable, used to calculate the scale factor of the websitePreviews expansion animation
var transitionTimeMedium;														//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var documentElement; 																//A shorthand for document.documentElement (<html> element), used for getting the browser's inner dimensions and computed styles
var windowWidth;																		//A shortcut for the DOM element window.innerWidth
var windowHeight;																		//A shortcut for the DOM element window.innerHeight
var windowHeightOffset;															//The difference between the previous windowHeight  and the current window.innerHeight, used only when the browser's height lowers by less than 1/3 of the current height to calculate the offset
var documentBodyElement;														//A shortcut for the HTML element document.body
var popUpMessageElement;														//The HTML element with the id "popUpMessage", used as a pop-up message container: a modal
var popUpMessageTextElement;												//The HTML element with the id "popUpMessageText", used as the text shown in the popUpMessage HTML element
var websitePreviewExpandedBackgroundContentElement; //The HTML element with the id "websitePreviewExpandedBackgroundContent", used as a layer between a websitePreviewExpanded and the page beneath
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
var pageElementstepCalculatorUntimed;               //A functions that calculates the length of each uss.scroll[...] animation's step, it follows a non linear behavior for smoother animations.

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {
	window.location.href = "#home";		//The page always starts from the the #home page
	variableInitialization();					//Binds the js variables to the corresponding HTML elements

	uss.hrefSetup(null, null, (pageLink, destination) => {
		uss.setYStepLengthCalculator(EASE_OUT_QUINT(1000));

		/*
		 * When the website is in mobile mode the page links are hidden under the hamburgerMenu
		 * which can be expanded by toggling the class "mobileExpanded" on the headerElement and the headerBackgroundElement.
		 * Once it's expanded the pageLinks can be clicked to go to the relative website section.
		 * Whenever a pageLink is clicked, the hamburgerMenu is hidden.
		 * This is done the same way the hamburgerMenu expands.
		 */
		if(pageLink.id != "scrollDownButton") toggleHeaderExpandedState();
	});
	uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed);

	if(window.Worker) { //Initializes all the data-lazy HTML img elements' contents
		const lazyImages = document.getElementsByClassName("lazyLoad");
		for(lazyImage of lazyImages) {
			const worker = new Worker("js/worker.js");
			const image = lazyImage;
			worker.addEventListener("message", message => {
				const imageObject = message.data;
				const url = window.URL.createObjectURL(imageObject.image);

				image.onload = () => {
					window.URL.revokeObjectURL(url);
				};

				window.requestAnimationFrame(() => {
					image.setAttribute("src", url);
					image.classList.add("lazyLoadElementAnimation");
				});
			});
			worker.postMessage(image.getAttribute("data-lazy"));
		}
	}
	eventListenersInitialization() //Initializes all the eventHandlers
	updateWindowSize();			       //Initially sets the 100vh css measure (var(--100vh)) which is updated only when the window's height grows
}

/* This Function initializes all the public variables */
function variableInitialization() {
	pageElementstepCalculatorUntimed = (remaning) => {return remaning / 20 + 1;};
	windowScrollYBy = (y, onDone = null, stillStart = true) => uss.scrollYBy(y, window, onDone, stillStart);
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

/* This function binds all the HTML elements that can be interacted to the corresponding eventHandlers */
function eventListenersInitialization() {
	window.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		if(_firstScrollYPosition == undefined) _firstScrollYPosition = window.scrollY;
		if(uss.getYStepLengthCalculator() !== pageElementstepCalculatorUntimed) {
			uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed);
			uss.stopScrollingY();
		}
		uss.scrollYBy(event.deltaY,
									window,
									() => {
										smoothPageScroll(_firstScrollYPosition, window.scrollY);
										_firstScrollYPosition = undefined;
									},
									false);
	}, {passive:false});


	//Smooth scrolling for touch devices
	let _Y = null;
	let _firstScrollYPosition = undefined;

	function _triggerSmoothScroll() {
		if(_Y !== null || uss.isYscrolling()) return;

		smoothPageScroll(_firstScrollYPosition, window.scrollY);
		uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed);
		_firstScrollYPosition = undefined;
	}

	window.addEventListener("touchstart", event => {
		if(event.touches.length > 1) return;
		_Y = null;
		if(uss.getYStepLengthCalculator() !== pageElementstepCalculatorUntimed) {
			uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed);
		}
		uss.stopScrollingY();
		_firstScrollYPosition = window.scrollY;
	},{passive:true});

	window.addEventListener("touchend", event => {
		if(event.touches.length > 1) return;
		_Y = null;
		_triggerSmoothScroll();
	}, {passive:true});

	window.addEventListener("touchmove", event => {
		if(event.cancelable) event.preventDefault();
		event.stopPropagation();
		if(event.touches.length > 1) return;

		if(_Y === null) _Y = event.changedTouches[0].clientY;
		const _originalDeltaY = _Y - event.changedTouches[0].clientY;
		_Y -= _originalDeltaY;
		const _absDeltaY = Math.abs(_originalDeltaY);
		const _deltaY = _absDeltaY <= 1 ? _originalDeltaY : _originalDeltaY * Math.log(1e6 * _absDeltaY);

		uss.scrollYBy(_deltaY, window, _triggerSmoothScroll, true);
	}, {passive:false});

	//Allows the page to always start from the #home page
	window.addEventListener("beforeunload", () => history.replaceState({}, "", "/index.html"), {passive:false});
	window.addEventListener("resize", updateWindowSize, {passive:true});

	window.addEventListener("mousedown", event => {
		if(event.button === 1) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, {passive:false});

	/*
	 * The user can use the arrow keys to navigate the website.
	 * Pressing the Arrow-up or the Arrow-left or the PageUp keys will trigger a scroll upwards by a scrollDistance of windowHeight.
 	 * Pressing the Arrow-down or the Arrow-right or the PageDown keys will trigger a scroll downwards by a scrollDistance of windowHeight.
   */
	window.addEventListener("keydown", event => {
		if(event.target.tagName !== "BODY") return;
		const websitePreviewIsExpanded = websitePreviewExpandedBackgroundContentElement.classList.contains("expandedState") || _websitePreviewExpandedBackgroundListenerTriggered;
		const _keyName = event.key;
		if(_keyName === "ArrowUp" || _keyName === "ArrowLeft" || _keyName === "PageUp") {
			event.preventDefault();
			if(websitePreviewIsExpanded) return;
			const _firstY = window.scrollY;
			windowScrollYBy(-windowHeight, () => smoothPageScroll(_firstY, window.scrollY), true);
		} else if(_keyName === "ArrowDown" || _keyName === "ArrowRight" || _keyName === "PageDown") {
			event.preventDefault();
			if(websitePreviewIsExpanded) return;
			const _firstY = window.scrollY;
			windowScrollYBy(windowHeight, () => smoothPageScroll(_firstY, window.scrollY), true);
		} else if(_keyName === "Home" || _keyName === "End")
				if(websitePreviewIsExpanded) event.preventDefault();
	}, {passive:false});



	/*
	 * When a scroll triggered by mouse wheel, a trackpad or touch gesture is detected
	 * on the header or its background:
	 * if the scroll direction is opposite to the header's (and its background's) state
	 * (i.e. header is expanded and the scroll would is upwards) the toggleHeaderExpandedState function is called.
	 */
	headerElement.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		let _className = headerElement.className;
		const _direction = event.deltaY;
		if(_className === "mobileExpanded" && _direction > 0 || _className !== "mobileExpanded" && _direction < 0)
			toggleHeaderExpandedState();
	}, {passive:false});

	headerBackgroundElement.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		const _className = headerBackgroundElement.className;
		const _direction = event.deltaY;
		if(_className === "mobileExpanded" && _direction > 0 || _className !== "mobileExpanded" && _direction < 0)
			toggleHeaderExpandedState();
	}, {passive:false});

	let _firstTouchPosition = null;
	headerElement.addEventListener("touchstart", event => {
		event.stopPropagation();
		_firstTouchPosition = event.touches[0].clientY;
	}, {passive:false});
	headerBackgroundElement.addEventListener("touchstart", event => {
		event.stopPropagation();
		_firstTouchPosition = event.touches[0].clientY;
	}, {passive:false});

	headerElement.addEventListener("touchmove", event => {
		event.preventDefault();
		event.stopPropagation();
		const _className = headerElement.className;
		const _direction = event.touches[0].clientY - _firstTouchPosition; /* >0 downwards <0 upwards */
		if(_className === "mobileExpanded" && _direction < 0 || _className !== "mobileExpanded" && _direction > 0)
			toggleHeaderExpandedState();
	}, {passive:false});

	headerBackgroundElement.addEventListener("touchmove", event => {
		event.preventDefault();
		event.stopPropagation();
		const _className = headerBackgroundElement.className;
		const _direction = event.touches[0].clientY - _firstTouchPosition; /* >0 downwards <0 upwards */
		if(_className === "mobileExpanded" && _direction < 0 || _className !== "mobileExpanded" && _direction > 0)
			toggleHeaderExpandedState();
	}, {passive:false});

	/* When the hamburgerMenu is pressed it expands by calling the toggleHeaderExpandedState function */
	hamburgerMenuElement.addEventListener("click", toggleHeaderExpandedState, {passive:false});

	/* All the social networks icons are linked to the corresponding website */
	document.getElementById("githubContact").addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
	document.getElementById("stackoverflowContact").addEventListener("click", () => window.open("https://stackoverflow.com/users/13938363/cristian-davide-conte?tab=profile"), {passive:true});
	document.getElementById("instagramContact").addEventListener("click", () => window.open("https://www.instagram.com/cristiandavideconte/?hl=it"), {passive:true});
	document.getElementById("mailContact").addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});

	//This allows for a smoother scrolling experience inside the presentationCard
	let _presentationCard = document.getElementById("presentationCard");
	let _profilePic = document.getElementById("profilePic");
	function _scrollPresentationCard(event) {
		const _scrollTop = _presentationCard.scrollTop;
		const _direction = event.deltaY;
		if((_scrollTop <= 0 && _direction < 0) || (_scrollTop >= uss.getMaxScrollY(_presentationCard) && _direction > 0)) return;
		event.preventDefault();
		event.stopPropagation();
		uss.stopScrollingY();
		uss.scrollYBy(event.deltaY / 2, _presentationCard, null, false);
	}

	_profilePic.addEventListener("wheel", _scrollPresentationCard, {passive:false});
	_presentationCard.addEventListener("wheel", _scrollPresentationCard, {passive:false});

	let _presentationCardLastYPosition = null;
	_presentationCard.addEventListener("touchstart", event => {_presentationCardLastYPosition = event.touches[0].clientY}, {passive:true});
	_presentationCard.addEventListener("touchend",   event => {_presentationCardLastYPosition = null}, {passive: true});
	_presentationCard.addEventListener("touchmove",  event => {
		const _direction = event.changedTouches[0].clientY - _presentationCardLastYPosition;
		_presentationCardLastYPosition = event.changedTouches[0].clientY;
		const _scrollTop = _presentationCard.scrollTop;
		if((_scrollTop <= 0 && _direction > 0) || (_scrollTop >= uss.getMaxScrollY(_presentationCard) && _direction < 0)) return;
		_Y = null;
		event.stopPropagation();
	}, {passive:false});
	uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed, _presentationCard);

	//This allows for a smoother scrolling experience inside the websiteShowcase
	websiteShowcase.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		uss.scrollXBy(event.deltaY / 3, websiteShowcase, null, false);
	}, {passive:false});
	websiteShowcase.addEventListener("touchmove", event => event.stopPropagation(), {passive:true});
	uss.setXStepLengthCalculator(pageElementstepCalculatorUntimed, websiteShowcase);


	//If the direction is === -1  the scroll direction is from right to left, it's from left to right otherwise.
	function _smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection) {
		let finalXPosition = (scrollDirection === -1) ? 0 : (websiteShowcase.scrollWidth - websiteShowcase.clientWidth);
		uss.scrollXTo(finalXPosition, websiteShowcase, null);
	}

	carouselButtons[0].addEventListener("mousedown",  () => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1), {passive:false});
	carouselButtons[0].addEventListener("touchstart", () => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1), {passive:false});
	carouselButtons[1].addEventListener("mousedown",  () => _smoothWebsiteShowcaseWheelScrollHorizzontally(+1), {passive:false});
	carouselButtons[1].addEventListener("touchstart", () => _smoothWebsiteShowcaseWheelScrollHorizzontally(+1), {passive:false});

	carouselButtons[0].addEventListener("mouseup",  () => uss.stopScrollingX(websiteShowcase), {passive:false});
	carouselButtons[0].addEventListener("mouseout", () => uss.stopScrollingX(websiteShowcase), {passive:false});
	carouselButtons[0].addEventListener("touchend", () => uss.stopScrollingX(websiteShowcase), {passive:false});
	carouselButtons[1].addEventListener("mouseup",  () => uss.stopScrollingX(websiteShowcase), {passive:false});
	carouselButtons[1].addEventListener("mouseout", () => uss.stopScrollingX(websiteShowcase), {passive:false});
	carouselButtons[1].addEventListener("touchend", () => uss.stopScrollingX(websiteShowcase), {passive:false});



	for(const websitePreview of websitePreviews) {
		/* First, all the websitePreviewExpanded basic components are created */
		let _websitePreviewExpanded = document.createElement("div");
		_websitePreviewExpanded.id = "websitePreviewExpanded";
		_websitePreviewExpanded.addEventListener("click", event => event.stopPropagation(), {passive:true});

		let _websitePreviewImage = websitePreview.firstElementChild;
		let _websitePreviewExpandedImage = _websitePreviewImage.cloneNode(true);
		_websitePreviewExpandedImage.className = "websitePreviewExpandedImage";
		_websitePreviewImage.addEventListener("load", () => {
			_websitePreviewExpandedImage.src = _websitePreviewImage.src;
			_websitePreviewExpanded.appendChild(_websitePreviewExpandedImage);
		});

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
				let _documentBodyElementStyle = documentBodyElement.style;
				const _websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
				const _websitePreviewImageBoundingRectangle = _websitePreviewImage.getBoundingClientRect();
				const _websitePreviewCurrentSize = _websitePreviewBoundingRectangle.height;
				const _websitePreviewExpandedSizeValue = (windowHeight < windowWidth) ? (windowHeight + windowHeightOffset) * websitePreviewExpandedSize / 100 : windowWidth * websitePreviewExpandedSize / 100;

				_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
				_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewCurrentSize + "px");
				_documentBodyElementStyle.setProperty("--scale3dFactor",  _websitePreviewExpandedSizeValue / _websitePreviewCurrentSize);
				_documentBodyElementStyle.setProperty("--websitePreviewImage-current-size", _websitePreviewImageBoundingRectangle.height + "px");

				websitePreviewExpandedBackgroundContentElement.appendChild(_websitePreviewExpanded);
				websitePreviewExpandedBackgroundContentElement.style.pointerEvents = "auto";
				websitePreview.classList.add("expandedState");

				window.requestAnimationFrame(() => websitePreviewExpandedBackgroundContentElement.classList.add("expandedState"));
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
	websitePreviewExpandedBackgroundContentElement.addEventListener("wheel", event => {event.preventDefault(); event.stopPropagation();}, {passive:false});
	websitePreviewExpandedBackgroundContentElement.addEventListener("click", () => {
		event.stopPropagation();
		if(_websitePreviewExpandedBackgroundListenerTriggered) return;
		_websitePreviewExpandedBackgroundListenerTriggered = true;

		window.requestAnimationFrame(() => {
			const _currentWebsitePreviewExpanded = websitePreviewExpandedBackgroundContentElement.firstChild;
			const _currentWebsitePreview = websitePreviewExpandedMap.get(_currentWebsitePreviewExpanded);
			/*
			 * The websitePreview is scaled while hovered.
			 * The top and left offset have to take the scaling into consideration otherwise
			 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
			 * The initial position is instead calculated adding the hover effect's expansion.
			 */
			let _documentBodyElementStyle = documentBodyElement.style;
			const _websitePreviewBoundingRectangle = _currentWebsitePreview.getBoundingClientRect();
			const _currentWebsitePreviewImageBoundingRectangle = _currentWebsitePreview.firstElementChild.getBoundingClientRect();
			const _websitePreviewCurrentSize = _websitePreviewBoundingRectangle.height;
			const _websitePreviewExpandedSizeValue = (windowHeight < windowWidth) ? (windowHeight + windowHeightOffset) * websitePreviewExpandedSize / 100 : windowWidth * websitePreviewExpandedSize / 100;

			_documentBodyElementStyle.setProperty("--websitePreview-original-top-position", _websitePreviewBoundingRectangle.top + "px");
			_documentBodyElementStyle.setProperty("--websitePreview-original-left-position", _websitePreviewBoundingRectangle.left + "px");
			_documentBodyElementStyle.setProperty("--websitePreview-current-size", _websitePreviewCurrentSize + "px");
			_documentBodyElementStyle.setProperty("--scale3dFactor", _websitePreviewExpandedSizeValue / _websitePreviewCurrentSize);
			_documentBodyElementStyle.setProperty("--websitePreviewImage-current-size", _currentWebsitePreviewImageBoundingRectangle.height + "px");

			websitePreviewExpandedBackgroundContentElement.classList.remove("expandedState");

			window.setTimeout(() => {
				websitePreviewExpandedBackgroundContentElement.style.pointerEvents = "";
				websitePreviewExpandedBackgroundContentElement.removeChild(_currentWebsitePreviewExpanded);
				_currentWebsitePreview.classList.remove("expandedState");
				_websitePreviewExpandedBackgroundListenerTriggered = false;
			}, transitionTimeMedium);
		});
	}, {passive:true});

	/*
	 * If clicked, the contactMeFormSendButton triggers a call to the _submitForm functon
	 * which locally checks if the contactMeForm fields are valid and if so triggers an ajax request to the Formspree API.
	 * The API will send an email to the registered receiver address.
	 * The receiver address is my email.
	 * The sender address is the contactMeFormEmail content.
	 * The body is the contactMeFormBody content.
	 */
  contactMeFormElement.addEventListener("submit", _submitForm, {passive:false});
	contactMeFormBodyElement.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		uss.scrollYBy(Math.sign(event.deltaY) * windowHeight / 10, contactMeFormBodyElement, null, false);
	}, {passive:false});
	contactMeFormBodyElement.addEventListener("touchmove", event => event.stopPropagation(), {passive:true});
	uss.setYStepLengthCalculator(pageElementstepCalculatorUntimed, contactMeFormBodyElement);
}

/*
 * This Function toggles the mobileExpanded class of the headerElement and  headerBackgroundElement HTML elements.
 * This behaviour is triggered only if the page is in mobileMode.
 * The mobileMode is triggered by the window's resize event if window's width > 1080px.
 */
function toggleHeaderExpandedState() {
	if(mobileMode)
		window.requestAnimationFrame(() => {
			headerBackgroundElement.classList.toggle("mobileExpanded");
			headerElement.classList.toggle("mobileExpanded");
		});
}

/*
 * If at the end of the scroll, the current page is not alligned, it gets:
 * - alligned if it covers 3/4 of the windowHeight or more (same as scrollIntoView).
 * - scrolled, following the original user's scroll direction, otherwise (same as scrollIntoView on the previous/nextPage).
 */
function smoothPageScroll(firstScrollYPosition, lastScrollYPosition) {
	currentPageIndex = Math.round(lastScrollYPosition / windowHeight);
	const _scrollYAmmount = lastScrollYPosition - firstScrollYPosition;	//How much the y position has changed due to the user's scroll

	//The helping behavior is triggered only if the user scrolls more than windowHeight / 2
	if(_scrollYAmmount > windowHeight / 2 || _scrollYAmmount < -windowHeight / 2) {
		const _scrollDirection = Math.sign(_scrollYAmmount); //1 if the scrolling is going downwards -1 otherwise.
		const _pageOffset = _scrollDirection * (currentPageIndex * windowHeight - lastScrollYPosition);	//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

		if(_pageOffset !== 0) {
			if(-_pageOffset < windowHeight / 3)	{//Case 1: The user scroll too little (less than 1/4 of the page height)
				uss.setYStepLengthCalculator(EASE_IN_OUT_QUAD(800));
				windowScrollYBy(_scrollDirection * _pageOffset);
			} else {//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowHeight
				uss.setYStepLengthCalculator(EASE_IN_OUT_QUINT(800));
				windowScrollYBy(_scrollDirection * (windowHeight + _pageOffset));
			}
		}
	}
}

/*
 * This function animates the popUpMessageElement and modifies the text shown.
 * It also avoids the spam of this function by using a timeout which gets resetted at each function call.
 */
let _popUpMessageTimeout = null;
function _showMessage(message) {
	popUpMessageTextElement.innerHTML = message;
	popUpMessageElement.className = "messageOnScreen";

	if(_popUpMessageTimeout != null)
		clearTimeout(_popUpMessageTimeout);

	_popUpMessageTimeout = window.setTimeout(() => popUpMessageElement.className = "", 6000);			//Every message on screen is shown for 6seconds
}

/*
 * This function returns:
 * case1: "validData" if both the contactMeFormEmail && contactMeFormBody are valid
 * case2: an error message if at least one of the two contactMeForm fields is not valid
 * It uses a regular expression to check if the email field is correctly formatted, no further investigation is done.
 */
function _checkContactMeFormDataIntegrity() {
	let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let valid = (regExp.test(contactMeFormEmailElement.value.toLowerCase())) ? "validData<br>" : "Insert a valid email address";
	if(contactMeFormBodyElement.value === "")
		valid = (valid !== "validData<br>") ?  "Fill the form first !" : valid + "Your message cannot by empty";
	return valid;
}

	/* Success function for after the form is submitted */
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

/* Error function for after the form is submitted */
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
function _submitForm(event) {
	event.preventDefault();
    contactMeFormSendButtonElement.disabled = true;
	let validData = _checkContactMeFormDataIntegrity();
	if(validData === "validData<br>")
		_ajax("GET", "https://json.geoiplookup.io", null,
		(data, type) => { //Success callback
			let _formData = new FormData(contactMeFormElement);
			_formData.append("informations", data);
			_ajax(contactMeFormElement.method, contactMeFormElement.action, _formData, _ajaxResponceStatusSuccess, _ajaxResponceStatusError);
		},
		() => { //Error callback
			_showMessage("Ops, something went wrong...");
			window.setTimeout(() => contactMeFormSendButtonElement.disabled = false, 6000);			//Every message on screen is shown for 6seconds
		});
	else {
		_showMessage(validData.replace("validData<br>", ""));
		window.setTimeout(() => contactMeFormSendButtonElement.disabled = false, 6000);			//Every message on screen is shown for 6seconds
	}
}

/*
 * This Function:
 * - calls the _update function when necessary in order to udate:
 *     -windowHeight
 *     -windowHeightOffset
 *     - computedStyle
 *     - websitePreviewExpandedSize
 *     - var(--100vh) css variable
 * - checks if the page can go to the mobileMode
 * - if needed calculates the windowHeightOffset without triggering any layout shift
 * - updates windowWidth
 */
function updateWindowSize() {
	function _update(currentWindowHeight) {
		windowHeightOffset = 0;
		windowHeight = currentWindowHeight;

		window.requestAnimationFrame(() => {
			documentElement.style.setProperty("--100vh", currentWindowHeight + "px");
			computedStyle = getComputedStyle(documentBodyElement);
			websitePreviewExpandedSize = computedStyle.getPropertyValue("--websitePreview-expanded-size").replace("vmin", "");
		});
	}

	const _currentWindowHeight = window.innerHeight;
	const _currentwindowWidth = window.innerWidth;

	mobileMode = (_currentwindowWidth < 1081) ? 1 : 0;

	if(mobileMode) {
		if(_currentWindowHeight > windowHeight)		//If the window gets higher all the variables are always updated
			_update(_currentWindowHeight);
		else if(_currentwindowWidth > windowWidth && _currentwindowWidth >= _currentWindowHeight) 		//If the window's height has reduced and the width has increased: the device has switched to Landscape mode
			_update(_currentWindowHeight);
		else 			//If the change is too small we probably are in a mobile browser where the url bar shrunk the innerHeight
			windowHeightOffset = _currentWindowHeight - windowHeight;
	} else
		_update(_currentWindowHeight);

	windowWidth = _currentwindowWidth;
	window.requestAnimationFrame(() => documentElement.style.setProperty("--window-inner-height-offset", windowHeightOffset + "px")); //Fixes mobile browsers' url bar inconsistency that can be encountered when windowHeightOffset != 0
}
