var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var windowInnerHeight;															//A shortcut for the DOM element window.innerHeight
var windowPosition;																//The scrollTop value of the window, used to prevent the DOM from scrolling after a screen orientation change 						
var documentBodyElement;														//A shortcut for the HTML element document.body 
var headerElement;																//The HTML element with the id "header", used as the website navbar 
var hamburgerMenuElement;														//The HTML element with the	id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px 								
var pageLinksElements; 															//All HTML element with the class "pageLink", shown in the header to navigate through the website' sections
var contentElement;																//The HTML element with the id "content", used as the website main container
var currentPageIndex;															//The index of the HTML element with class "page" that is currently being displayed the most: if the page is 50% or on the screen, than it's currently being displayed
var websitePreviewExpandedMap; 													//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var transitionTimeMedium;														//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var mobileMode; 																//Indicates if the css for mobile is currently beign applied
var supportsTouch;

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {	
	variableInitialization();													//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();										//Initializes all the mouse and keyboard eventHandlers 

	imageLoading();																//Initializes all the HTML img elements' contents  
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	//setTimeout(lagTest, 10000);
}

/* This Function initializes all the javascript file's public variables */
function variableInitialization() {
	windowInnerWidth = window.innerWidth;
	documentBodyElement = document.body;
	
	headerElement = document.getElementById("header");
	hamburgerMenuElement = document.getElementById("hamburgerMenu");	
	pageLinksElements = document.getElementsByClassName("pageLink");	
	contentElement = document.getElementById("content");
	
	transitionTimeMedium = getComputedStyle(documentBodyElement).getPropertyValue("--transition-time-medium").replace("s", "") * 1000;
	supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;
	websitePreviewExpandedMap = new Map();
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	window.addEventListener("resize", updateWindowSize, {passive:true});										//Updates the height and the width whenever the window's resized
	headerElement.addEventListener("wheel", event => event.stopPropagation(), {passive:false});
			
	documentBodyElement.addEventListener("keydown", event => {
		if(event.target.tagName == "BODY") {
			let keyName = event.key;
			if(keyName == "ArrowUp" || keyName == "ArrowLeft") {
				smoothPageScroll(-1);
				event.preventDefault();
				return;
			}else if(keyName == "ArrowDown" || keyName == "ArrowRight") {
				smoothPageScroll(1);
				event.preventDefault();
				return;
			}
		}
	}, {passive:false});

	let smoothScrollTimeout;
	
	if(supportsTouch) {
		let firstTouchYPosition = null;
		let lastTouchYPosition = null;
		let pageIsScrolling = false;
		contentElement.addEventListener("scroll", event => {
			if(!pageIsScrolling) {
				if(firstTouchYPosition != null) 
					lastTouchYPosition = firstTouchYPosition;
				
				firstTouchYPosition = contentElement.scrollTop;
				
				clearTimeout(smoothScrollTimeout);
				smoothScrollTimeout = setTimeout(() => {
					pageIsScrolling = true;
					smoothPageScroll(Math.sign(firstTouchYPosition - lastTouchYPosition));
					setTimeout(() => pageIsScrolling = false, 1000);
				},300);
			}
		}, {passive:false});
	} else {	
		contentElement.addEventListener("wheel", event => {	
			clearTimeout(smoothScrollTimeout);
			smoothScrollTimeout = setTimeout( () => {
				smoothPageScroll(Math.sign(event.deltaY));
			}, 300);
		}, {passive:true});
	}
	
	hamburgerMenuElement.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});					//When the hamburgerMenu is pressed it expands by calling the toggleExpandHamburgerMenu function 
	
	for(const pageLinkElement of pageLinksElements)															
		pageLinkElement.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});				//Whenever a HTML element with the class "pageLink" is pressed the DOM is scrolled to the corresponding section 						
	
	let websiteShowcase = document.getElementsByClassName("websiteShowcase")[0];
	websiteShowcase.addEventListener("wheel", (event) => {
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is 1/20th of the window's innerWidth at any given resolution.
		 * If the wheel is scrolled from top to bottom the scroll direction will be from right to left, will be inverted otherwise.
		 */
		let scrollDirection = Math.sign(event.deltaY);
		let totalScrollAmmount = windowInnerWidth/20;
		let scrollDistance = windowInnerWidth/200;
		let partialScrollAmmount = 0;
		
		smoothScroll(); 
		function smoothScroll() {
			websiteShowcase.scrollLeft += scrollDirection*scrollDistance;		
			partialScrollAmmount += scrollDistance;
			if(partialScrollAmmount < totalScrollAmmount)
				setTimeout(smoothScroll, 10);
		}
	}, {passive:true});
	
	let carouselButtonMouseDownInterval;
	function carouselButtonMouseDownIntervalSet(carouselButtons) {
		carouselButtons.dispatchEvent(new MouseEvent("mousedown"));
	}
	
	function carouselButtonMouseDownIntervalReset() {
		clearInterval(carouselButtonMouseDownInterval);
		carouselButtonMouseDownInterval = null;
		this.removeEventListener("mouseup", carouselButtonMouseDownIntervalReset, {passive:true});				/* There's no need for the window to keep listening to this event after the user stops interacting with the carouselButton */
	}
	
	let carouselButtons = document.getElementsByClassName("carouselButton");														
	carouselButtons[0].addEventListener("mousedown", () => {
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is +1/100th of the window's innerWidth at any given resolution.
		 * The + sign means the scroll direction is from left to right. 
		 */
		websiteShowcase.scrollLeft -= windowInnerWidth/100														
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[0]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset, {passive:true});	
	}, {passive:true});
	
	carouselButtons[1].addEventListener("mousedown", () => {
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is -1/100th of the window's innerWidth at any given resolution
		 * The - sign means the scroll direction is from right to left. 
		 */
		websiteShowcase.scrollLeft += windowInnerWidth/100														
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[1]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset, {passive:true});	
	}, {passive:true});
	
	websitePreviews = document.getElementsByClassName("websitePreview");
	for(const websitePreview of websitePreviews)
		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next
			
			/* The websitePreview is scaled while hovered.
			 * The top and left offset have to take the scaling into consideration otherwise 
			 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
			 * The initial position is instead calculated adding the hover effect's expansion.
			 */			
			let websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
			let documentBodyElementStyle = documentBodyElement.style;
			documentBodyElementStyle.setProperty("--websitePreview-original-top-position", websitePreviewBoundingRectangle.top + "px");
			documentBodyElementStyle.setProperty("--websitePreview-original-left-position", websitePreviewBoundingRectangle.left + "px");
			documentBodyElementStyle.setProperty("--websitePreview-current-size", websitePreviewBoundingRectangle.height + "px");
			
			let backgroundContent;
			let storedBackgroundContent = websitePreviewExpandedMap.get(websitePreview);
			
			if(storedBackgroundContent != null) {
				backgroundContent = storedBackgroundContent;
			} else {
				let websitePreviewExpanded = document.createElement("div");
				websitePreviewExpanded.id = "websitePreviewExpanded";	
				
				let websitePreviewExpandedImage = websitePreview.firstElementChild.cloneNode(true);
				websitePreviewExpandedImage.className = "websitePreviewExpandedImage";
				websitePreviewExpanded.appendChild(websitePreviewExpandedImage);
				
				let dataTitle = websitePreview.getAttribute("data-title");
				if(dataTitle != null) {
					let websitePreviewExpandedTitle = document.createElement("div");
					websitePreviewExpandedTitle.className = "websitePreviewExpandedTitle";
					websitePreviewExpandedTitle.innerHTML = dataTitle;			
					websitePreviewExpanded.appendChild(websitePreviewExpandedTitle);
				}
				
				let viewButtonsSection = document.createElement("div");
				viewButtonsSection.id = "websitePreviewExpandedButtonSection";
				
				let dataCode = websitePreview.getAttribute("data-code");
				if(dataCode != null) {													//There could be a project that isn't open-source
					let viewCodeButton = document.createElement("button");
					viewCodeButton.innerHTML = "View Code";
					viewCodeButton.className = "websitePreviewExpandedButton";
					viewCodeButton.addEventListener("click", () => window.open(dataCode), {passive:true});
					viewButtonsSection.appendChild(viewCodeButton);
				}
				
				let dataDemo = websitePreview.getAttribute("data-demo");
				if(dataDemo != null) {													//There could be a project that hasn't got a demo ready yet
					let viewDemoButton = document.createElement("button");
					viewDemoButton.innerHTML = "View Demo";
					viewDemoButton.className = "websitePreviewExpandedButton";
					viewDemoButton.addEventListener("click", () => window.open(dataDemo), {passive:true});
					viewButtonsSection.appendChild(viewDemoButton);
				}	
				
				websitePreviewExpanded.appendChild(viewButtonsSection);
				websitePreviewExpanded.addEventListener("click", event => event.stopPropagation(), {passive:true});
				
				backgroundContent = document.createElement("div");
				backgroundContent.id = "websitePreviewExpandedBackgroundContent";
				backgroundContent.className = "page";		
				backgroundContent.appendChild(websitePreviewExpanded);
				
				/*This variable is used to prevent the user to execute the backgroundContent eventListener 
				 * more than one time while the animation is still happening.
				 * Otherwise the document.body would try to remove the backgroundContent multiple times generating errors in the browser console.
				 * Note that this bug wouldn't cause the page to instantly crash.
				 */
				let listenersAlreadyTriggered = false;																	
				
				backgroundContent.addEventListener("click", function removePreviewExpanded(event) {
					event.stopPropagation();
					if(!listenersAlreadyTriggered) {
						listenersAlreadyTriggered = true;
						/* The websitePreview is scaled while hovered.
						 * The top and left offset have to take the scaling into consideration otherwise 
						 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
						 * The initial position is instead calculated adding the hover effect's expansion.
						 */
						websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();						
						documentBodyElementStyle.setProperty("--websitePreview-original-top-position", websitePreviewBoundingRectangle.top + "px");
						documentBodyElementStyle.setProperty("--websitePreview-original-left-position", websitePreviewBoundingRectangle.left + "px");
						documentBodyElementStyle.setProperty("--websitePreview-current-size", websitePreviewBoundingRectangle.height + "px");
									
						websitePreviewExpanded.className = "";
						setTimeout(() => {
							listenersAlreadyTriggered = false;
							headerElement.style = null; 
							websitePreview.classList.remove("expandedState");
							documentBodyElement.removeChild(backgroundContent);
							setTimeout(() => {
								websitePreview.style = null;
							}, 20);
						}, transitionTimeMedium);
					}
				}, {passive:true});
			
				websitePreviewExpandedMap.set(websitePreview, backgroundContent);
			}
				
			headerElement.style.pointerEvents = "none";
			websitePreview.style.transition = "0s";	
			documentBodyElement.insertBefore(backgroundContent, documentBodyElement.firstChild);
			
			setTimeout(() => {										//This is done in order to make the original 
				websitePreviewExpanded.className = "expandedState";
				websitePreview.classList.add("expandedState");
			}, 20);				
		}, {passive:true});
			
		let githubContactElement = document.getElementById("githubContact");
		githubContactElement.addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
		
		let instagramContactElement = document.getElementById("instagramContact");
		instagramContactElement.addEventListener("click", () => window.open("https://www.instagram.com/cristian_davide_conte/?hl=it"), {passive:true});
			
		let facebookContactElement = document.getElementById("facebookContact");
		facebookContactElement.addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"), {passive:true});		
		
		let mailContactElement = document.getElementById("mailContact");
		mailContactElement.addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});
}

var test = 0;
function lagTest() {
	websitePreview = document.getElementsByClassName("websitePreview")[0];
    var event = document.createEvent('Events');
    event.initEvent("click", true, false);
	if(test < 200) {
		if(test % 2 == 0) 
			websitePreview.dispatchEvent(event);
		else 
			documentBodyElement.firstChild.dispatchEvent(event);
		
		setTimeout(lagTest, transitionTimeMedium);
		test++;
	}
}

/* This Function asyncronusly load the content of the DOM img elements */
function imageLoading() {
	/* The full background image is loaded when ready and not at the initial page loading.
	 * Instead a lower resolution and blurry version of the background image is loaded in the css file.
	 * This allows the user to interact much quicker with the page and lesser the probability of a page crash.
	 * Whenever the full image is ready the two images are swapped with a transition in between.
	 */
	let backgroundElement = document.getElementById("background");
	let backgroundElementLoaded = backgroundElement.cloneNode(true);
	let backgroundImage = new Image();
	backgroundImage.src = "./images/backgroundImages/LakeAndMountains.jpg";
	backgroundImage.addEventListener("load", function() { 
		backgroundElementLoaded.style.backgroundImage = "url(" + backgroundImage.src + ")"; //Setting the src wouldn't allow the new image to use the css style already calculated
		backgroundElement.before(backgroundElementLoaded);
		backgroundElement.classList.add("contentLoaded");
		setTimeout(() => documentBodyElement.removeChild(backgroundElement), transitionTimeMedium); 
	}, {passive:true});
	
	/* The full profile image is loaded when ready and not at the initial page loading.
	 * Instead a lower resolution and blurry version of the image is loaded in the html file.
	 * This allows the user to interact much quicker with the page and lesser the probability of a page crash.
	 * Whenever the full image is ready the two images are swapped with no transition in between.
	 */
	let profilePicElement = document.getElementById("profilePic");
	let profileImageLoaded = new Image();
	profileImageLoaded.src = "./images/profilePictures/profilePicture.jpg";	
	profileImageLoaded.addEventListener("load", () => profilePicElement.src = profileImageLoaded.src, {passive:true});
}

/* This Function toggle the class mobileExpanded in the hamburgerMenu element */
function toggleExpandHamburgerMenu() {		
	if(mobileMode)
		headerElement.classList.toggle("mobileExpanded");	
}

/* This Function emulates the smooth scroll behaviour provided by css 
 * taking into consideration the current page position.
 * If the page is perfectly alligned with the screen 
 * the scroll will change the displayed page.
 * Otherwise the scroll will allign the page so that 
 * the next scroll will be a page change.
 * This is done to prevent the user to scroll on elements, change the offset of the page and then 
 * keep that offset throughout the pages scrolling.
 */
function smoothPageScroll(direction) {
	let contentElementscrollTop = contentElement.scrollTop;
	currentPageIndex = Math.round(contentElementscrollTop / windowInnerHeight);
	let pageOffset = currentPageIndex * windowInnerHeight - contentElementscrollTop;			//The offset measure by how much the page is not alligned with the screen

	if(pageOffset == 0) 																		//Case 1: the page is already alligned with the screen height
		contentElement.scrollTop += direction * windowInnerHeight;								//Then the page is changed with the previous or next one according to the scroll direction
	else 																						//Case 2: a previous scroll has changed the current page offset and the page isn't alligned yet
		if(direction * pageOffset > 0 || pageOffset <= windowInnerHeight / 5)					//Case 2/a: part of the next page is in the screen or the user scroll too little
			contentElement.scrollTop += pageOffset;			
		else 																					//Case 2/b: part of the previous page is in the screen
			contentElement.scrollTop += direction * (windowInnerHeight + direction * pageOffset);
}

/* This Function:
 * scrolls the contentElement if needed to avoid pages offset creation during resizing
 * udates the windowInnerHeight and windowInnerWidth variables with the new window' values.
 * resets the body height to that of the inner browser: this is used to fix the different height behaviour of the mobile browsers' navigation bars 
 * check if the page can go to the mobileMode and activate the javascript related functions
 */
function updateWindowSize(){
	//contentElement.scrollTop += window.innerHeight - windowInnerHeight;				//Here windowInnerHeight hasn't been updated yet so it contains the old height value
		
	windowInnerWidth = window.innerWidth;
	windowInnerHeight = window.innerHeight;
	documentBodyElement.style.height = windowInnerHeight + "px";
	if(windowInnerWidth < 1081)
		mobileMode = 1
	else 
		mobileMode = 0;
}