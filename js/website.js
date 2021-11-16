var mobileMode; 																		//Indicates if the css for mobile is currently being applied
var websitePreviewExpandedMap; 											//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var websitePreviewListenerDebounce;
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
var websitePreviews;																//All HTML elements with the class "websitePreview", used as a clickable previews for all the projects inside the websitePreviewShowcase
var contactMeFormElement;														//The HTML element with the id "contactMeForm", used to keep the contact informations until the contactMeFormSendButton is pressed
var contactMeFormEmailElement;											//The HTML element with the id "contactMeFormEmail", used to store the user's email when the contactMeForm is being filled
var contactMeFormBodyElement;												//The HTML element with the id "contactMeFormBody",used to store the user's message when the contactMeForm is being filled
var contactMeFormSendButtonElement;									//The HTML element with the id "contactMeFormSendButton", used to send a contact request based on the contactMeForm fields

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {
	window.location.href = "#home";		//The page always starts from the the #home page
	variableInitialization();			//Binds the js variables to the corresponding HTML elements
	scrollInit();
	
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
	updateWindowSize();			   //Initially sets the 100vh css measure (var(--100vh)) which is updated only when the window's height grows
}

/* This Function initializes all the public variables */
function variableInitialization() {
	documentBodyElement = document.body;

	websitePreviewExpandedMap = new Map();
	websitePreviewListenerDebounce = false;

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
	websitePreviews = document.getElementsByClassName("websitePreview");
	contactMeFormElement = document.getElementById("contactMeForm");
	contactMeFormEmailElement = document.getElementById("contactMeFormEmail");
	contactMeFormBodyElement = document.getElementById("contactMeFormBody");
	contactMeFormSendButtonElement = document.getElementById("contactMeFormSendButton");
}

/* This function binds all the HTML elements that can be interacted to the corresponding eventHandlers */
function eventListenersInitialization() {
	//Allows the page to always start from the #home page
	window.addEventListener("beforeunload", () => history.replaceState({}, "", "/index.html"), {passive:false});
	window.addEventListener("resize", updateWindowSize, {passive:true});

	documentBodyElement.addEventListener("mousedown", event => {
		if(event.button === 1) {
			event.preventDefault();
			event.stopPropagation();
		}
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

	headerElement.addEventListener("touchend", event => event.stopPropagation(), {passive:true});
	headerBackgroundElement.addEventListener("touchend", event => event.stopPropagation(), {passive:true});

	/* When the hamburgerMenu is pressed it expands by calling the toggleHeaderExpandedState function */
	hamburgerMenuElement.addEventListener("click", toggleHeaderExpandedState, {passive:false});




	/* All the social networks icons are linked to the corresponding website */
	document.getElementById("githubContact").addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
	document.getElementById("stackoverflowContact").addEventListener("click", () => window.open("https://stackoverflow.com/users/13938363/cristian-davide-conte?tab=profile"), {passive:true});
	document.getElementById("instagramContact").addEventListener("click", () => window.open("https://www.instagram.com/cristiandavideconte/?hl=it"), {passive:true});
	document.getElementById("mailContact").addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});






	for(const websitePreview of websitePreviews) {
		/* First, all the websitePreviewExpanded basic components are created */
		let _websitePreviewExpanded = document.createElement("div");
		_websitePreviewExpanded.id = "websitePreviewExpanded";
		_websitePreviewExpanded.addEventListener("click", event => {event.stopPropagation()}, {passive:true});

		const _websitePreviewImage = websitePreview.firstElementChild;
		let _websitePreviewExpandedImage = _websitePreviewImage.cloneNode(true);
		_websitePreviewExpandedImage.className = "websitePreviewExpandedImage";
		_websitePreviewImage.addEventListener("load", () => {
			_websitePreviewExpandedImage.src = _websitePreviewImage.src;
			_websitePreviewExpanded.insertBefore(_websitePreviewExpandedImage, _websitePreviewExpanded.lastChild);
		});

		const _dataTitle = websitePreview.getAttribute("data-title");
		if(_dataTitle != null) {
			let _websitePreviewExpandedTitle = document.createElement("div");
			_websitePreviewExpandedTitle.className = "websitePreviewExpandedTitle";
			_websitePreviewExpandedTitle.innerHTML = _dataTitle;
			_websitePreviewExpanded.appendChild(_websitePreviewExpandedTitle);
		}

		let _viewButtonsSection = document.createElement("div");
		_viewButtonsSection.id = "websitePreviewExpandedButtonSection";

		const _dataCode = websitePreview.getAttribute("data-code");
		if(_dataCode != null) {													//There could be a project that isn't open-source
			let _viewCodeButton = document.createElement("button");
			_viewCodeButton.innerHTML = "CODE";
			_viewCodeButton.className = "websitePreviewExpandedButton";
			_viewCodeButton.addEventListener("click", () => window.open(_dataCode), {passive:true});
			_viewButtonsSection.appendChild(_viewCodeButton);
		}

		const _dataDemo = websitePreview.getAttribute("data-demo");
		if(_dataDemo != null) {													//There could be a project that hasn't got a demo ready yet
			let _viewDemoButton = document.createElement("button");
			_viewDemoButton.innerHTML = "DEMO";
			_viewDemoButton.className = "websitePreviewExpandedButton";
			_viewDemoButton.addEventListener("click", () => window.open(_dataDemo), {passive:true});
			_viewButtonsSection.appendChild(_viewDemoButton);
		}

		_websitePreviewExpanded.appendChild(_viewButtonsSection);

		/* Then the websitePreviewExpanded are mapped to their websitePreview counterparts */
		websitePreviewExpandedMap.set(_websitePreviewExpanded, websitePreview);

		/* At the end of the process each websitePreview is given a listener for the back-to-normal-state animation */
		websitePreview.addEventListener("click", (event) => {
			event.stopPropagation(); //Prevents the click to instantly remove the previewExpanded element that is going to be created next
			if(websitePreviewListenerDebounce) return;
			websitePreviewListenerDebounce = true;
			uss.setXStepLengthCalculator(EASE_OUT_QUART(450), document.getElementById("websiteShowcase"));
			uss.scrollIntoViewIfNeeded(websitePreview, false, () => {
				websitePreviewListenerDebounce = false;
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
	 * The websitePreviewListenerDebounce variable is used to prevent the user to execute the backgroundContent eventListener
	 * more than one time while the animation is still happening.
	 * Otherwise the document.body would try to remove the backgroundContent multiple times generating errors in the browser console.
	 * Note that this bug wouldn't cause the page to instantly crash.
	 */
	websitePreviewExpandedBackgroundContentElement.addEventListener("click", (event) => {
		event.stopPropagation();
		if(websitePreviewListenerDebounce) return;
		websitePreviewListenerDebounce = true;

		window.requestAnimationFrame(() => {
			const _currentWebsitePreviewExpanded = document.getElementById("websitePreviewExpanded");
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
				window.requestAnimationFrame(() => {
					websitePreviewExpandedBackgroundContentElement.style.pointerEvents = "";
					_currentWebsitePreview.classList.remove("expandedState");
					websitePreviewExpandedBackgroundContentElement.removeChild(_currentWebsitePreviewExpanded);
					websitePreviewListenerDebounce = false;
				});
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
}

/*
 * This Function toggles the mobileExpanded class of the headerElement and  headerBackgroundElement HTML elements.
 * This behaviour is triggered only if the page is in mobileMode.
 * The mobileMode is triggered by the window's resize event if window's width > 1080px.
 */
function toggleHeaderExpandedState() {
	if(!mobileMode) return;
	window.requestAnimationFrame(() => {
		headerBackgroundElement.classList.toggle("mobileExpanded");
		headerElement.classList.toggle("mobileExpanded");
	});
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
		valid = (valid !== "validData<br>") ?  "Fill the form first !" : valid + "Your message can't be empty";
	return valid;
}

	/* Success function for after the form is submitted */
function _ajaxResponceStatusSuccess() {
  contactMeFormElement.reset();
  contactMeFormEmailElement.disabled = true;
  contactMeFormEmailElement.labels[0].classList.add("disabled");
  contactMeFormBodyElement.disabled = true;
  contactMeFormBodyElement.labels[0].classList.add("disabled");
  contactMeFormSendButtonElement.disabled = true;
	contactMeFormElement.removeEventListener("submit", _submitForm, {passive:false});
	contactMeFormElement.removeAttribute("action");
	contactMeFormElement.removeAttribute("method");
	_showMessage("Message Sent!");
}

/* Error function for after the form is submitted */
function _ajaxResponceStatusError(status, response, responseType) {				
	contactMeFormEmailElement.disabled = false;
	contactMeFormEmailElement.labels[0].classList.remove("disabled");
	contactMeFormBodyElement.disabled = false;
	contactMeFormBodyElement.labels[0].classList.remove("disabled");
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
	contactMeFormEmailElement.disabled = true;
	contactMeFormEmailElement.labels[0].classList.add("disabled");
	contactMeFormBodyElement.disabled = true;
	contactMeFormBodyElement.labels[0].classList.add("disabled");
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
			window.setTimeout(() => {
				contactMeFormEmailElement.disabled = false;
				contactMeFormEmailElement.labels[0].classList.remove("disabled");
				contactMeFormBodyElement.disabled = false;
				contactMeFormBodyElement.labels[0].classList.remove("disabled");
				contactMeFormSendButtonElement.disabled = false;
			}, 6000); //Every message on screen is shown for 6seconds
		});
	else {
		_showMessage(validData.replace("validData<br>", ""));
		window.setTimeout(() => {
			contactMeFormEmailElement.disabled = false;
			contactMeFormEmailElement.labels[0].classList.remove("disabled");
			contactMeFormBodyElement.disabled = false;
			contactMeFormBodyElement.labels[0].classList.remove("disabled");
			contactMeFormSendButtonElement.disabled = false;
		}, 6000); //Every message on screen is shown for 6seconds
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
