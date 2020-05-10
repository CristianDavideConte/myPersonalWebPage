var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var windowPosition;																//The scrollTop value of the window, used to prevent the DOM from scrolling after a screen orientation change 						
var documentBodyElement;														//A shortcut for the HTML element document.body 
var header;																		//The HTML element with the id "header", used as the site navbar 
var hamburgerMenu;																//The HTML element with the	id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px 								
var pageLinks; 																	//All HTML element with the class "pageLink", shown in the header to navigate through the website' sections
var websitePreviewExpandedMap; 													//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them
var transitionTimeMedium;														//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var mobileDevice; 																//The --mobile-device css variable, used to know if the css styling for mobile is currently applied

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {	
	variableInitialization();													//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();										//Initializes all the mouse and keyboard eventHandlers 
		
	//if ("ontouchstart" in window) 											//If the device is touch capable the support to the touchstartEvent is added
		//mobileEventListenerInitialization();									//Initializes all the touch related eventHandlers 

	imageLoading();																//Initializes all the HTML img elements' contents  
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	//setTimeout(lagTest, 10000);
}

/* This Function initializes all the javascript file's public variables */
function variableInitialization() {
	windowInnerWidth = window.innerWidth;
	documentBodyElement = document.body;
	
	header = document.getElementById("header");
	hamburgerMenu = document.getElementById("hamburgerMenu");	
	pageLinks = document.getElementsByClassName("pageLink");	
	
	transitionTimeMedium = getComputedStyle(documentBodyElement).getPropertyValue("--transition-time-medium").replace("s", "") * 1000;
	mobileDevice = getComputedStyle(documentBodyElement).getPropertyValue("--mobile-device");
	
	websitePreviewExpandedMap = new Map();
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	window.addEventListener("resize", updateWindowSize);															//Updates the height and the width whenever the window's resized
	hamburgerMenu.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});							//When the hamburgerMenu is pressed it expands by calling the toggleExpandHamburgerMenu function 
	
	for(const pageLink of pageLinks)															
		pageLink.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});							//Whenever a HTML element with the class "pageLink" is pressed the DOM is scrolled to the corresponding section 
	
	let websiteShowcase = document.getElementsByClassName("websiteShowcase")[0];
	websiteShowcase.addEventListener("wheel", (event) => {
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is 1/20th of the window's innerWidth at any given resolution.
		 * If the wheel is scrolled from top to bottom the scroll direction will be from right to left, will be inverted otherwise.
		 */
		let scrollDirection = Math.sign(event.deltaY);
		let totalScrollAmmount = windowInnerWidth/20;
		let scrollDistance = windowInnerWidth/100;
		let partialScrollAmmount = 0;
		
		smoothScroll(); 
		function smoothScroll() {
			websiteShowcase.scrollLeft += scrollDirection*scrollDistance;		
			partialScrollAmmount += scrollDistance;
			if(partialScrollAmmount < totalScrollAmmount)
				setTimeout(smoothScroll, 10);
		}
	}, {passive:false});
	
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
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
	
	carouselButtons[1].addEventListener("mousedown", () => {
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is -1/100th of the window's innerWidth at any given resolution
		 * The - sign means the scroll direction is from right to left. 
		 */
		websiteShowcase.scrollLeft += windowInnerWidth/100														
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[1]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
	
				
	/* This Function tracks an animation duration.
	 * It updates every transitionDurationTimeoutFrequency milliseconds and when the transitionTimeMedium milliseconds ammount is reached it stops updating.
	 * Used to calculate how much time a closing animation should last if the opening animation was interrupted. 
	 * This way the opening and closing animation of an element last the same ammount of milliseconds.
	 */
	let transitionDurationTimeout;
	let transitionDuration = 0;
	let transitionDurationTimeoutFrequency = 20;
	function checkAnimationDuration () {
		if(transitionDuration < transitionTimeMedium) {
			transitionDuration += transitionDurationTimeoutFrequency;
			transitionDurationTimeout = setTimeout(checkAnimationDuration, transitionDurationTimeoutFrequency);
		}
		else 
			clearTimeout(transitionDurationTimeout);
	}
	
	websitePreviews = document.getElementsByClassName("websitePreview");
	for(const websitePreview of websitePreviews)
		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next
			
			/* The websitePreview is scaled while hovered.
			 * The top and left offset have to take the scaling into consideration otherwise 
			 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor
			 */
			let websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
			let scalingFactor = getComputedStyle(documentBodyElement).getPropertyValue("--scaling-factor-increase");
			let websitePreviewTopOffset = websitePreviewBoundingRectangle.top + (websitePreviewBoundingRectangle.height * scalingFactor - websitePreviewBoundingRectangle.height) / 2;				
			let websitePreviewLeftOffset = websitePreviewBoundingRectangle.left + (websitePreviewBoundingRectangle.width * scalingFactor - websitePreviewBoundingRectangle.width) / 2;
			documentBodyElement.style.setProperty("--websitePreview-original-top-position", websitePreviewTopOffset + "px");
			documentBodyElement.style.setProperty("--websitePreview-original-left-position", websitePreviewLeftOffset + "px");
			
			let backgroundContent;
			let storedBackgroundContent = websitePreviewExpandedMap.get(websitePreview);
			
			if(storedBackgroundContent != null) {
				backgroundContent = storedBackgroundContent;
			} else {
				let websitePreviewExpanded = document.createElement("div");
				websitePreviewExpanded.id = "websitePreviewExpanded";	
				
				let websitePreviewExpandedTitleSectionContent = websitePreview.firstElementChild.cloneNode(true);
				websitePreviewExpandedTitleSectionContent.className = "websitePreviewExpandedTitleSectionContent";
				websitePreviewExpanded.appendChild(websitePreviewExpandedTitleSectionContent);
				
				let dataTitle = websitePreview.getAttribute("data-title");
				if(dataTitle != null) {
					let websitePreviewExpandedTitleSection = document.createElement("div");
					websitePreviewExpandedTitleSection.className = "websitePreviewExpandedTitleSection";
					websitePreviewExpandedTitleSection.innerHTML = dataTitle;			
					websitePreviewExpanded.appendChild(websitePreviewExpandedTitleSection);
				}
				
				let viewButtonsSection = document.createElement("div");
				viewButtonsSection.id = "websitePreviewExpandedButtonSection";
				
				let dataCode = websitePreview.getAttribute("data-code");
				if(dataCode != null) {
					let viewCodeButton = document.createElement("button");
					viewCodeButton.innerHTML = "View Code";
					viewCodeButton.className = "websitePreviewExpandedButton";
					viewCodeButton.addEventListener("click", () => window.open(dataCode), {passive:true});
					viewButtonsSection.appendChild(viewCodeButton);
				}
				
				let dataDemo = websitePreview.getAttribute("data-demo");
				if(dataDemo != null) {
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
						if(transitionDuration < transitionTimeMedium) 
							clearTimeout(transitionDurationTimeout);
								
						websitePreviewExpanded.className = "";
						setTimeout(() => {
							listenersAlreadyTriggered = false;
							websitePreview.classList.remove("expandedState");
							documentBodyElement.removeChild(backgroundContent);
							setTimeout(() => {
								websitePreview.style = null;
								header.style = null; 
							}, 20);
						}, transitionDuration);
					}
				}, {passive:true});
			
				websitePreviewExpandedMap.set(websitePreview, backgroundContent);
			}
				
			header.style.pointerEvents = "none";
			websitePreview.style.transition = "0s";	
			documentBodyElement.insertBefore(backgroundContent, documentBodyElement.firstChild);
			
			checkAnimationDuration();
			setTimeout(() => {										//This is done in order to make the original 
				websitePreviewExpanded.className = "expandedState";
				websitePreview.classList.add("expandedState");
			}, transitionDurationTimeoutFrequency);				
		}, {passive:true});
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

/* This function binds all the HTML elements that can be interacted to their touch related eventHandlers /
function mobileEventListenerInitialization() {
	hamburgerMenu.addEventListener("touchend", event => {
		toggleExpandHamburgerMenu();
		event.preventDefault();
	}, {passive:false});
	
	for(const pageLink of pageLinks)															
		pageLink.addEventListener("touchend", toggleExpandHamburgerMenu, {passive:true});							
}
*/

/* This Function asyncronusly load the content of the DOM img elements */
function imageLoading() {
	let backgroundImage = new Image();
	/* The full background image is loaded when ready and not at the initial page loading.
	 * Instead a lower resolution and blurry version of the background image is loaded in the css file.
	 * This allows the user to interact much quicker with the page and lesser the probability of a page crash.
	 * Whenever the full image is ready the two images are swapped with a transition in between.
	 */
	backgroundImage.onload = () => { 
		let backgroundElement = document.getElementById("background");
		let backgroundElementLoaded = backgroundElement.cloneNode(true);
		backgroundElementLoaded.style.backgroundImage = "url(" + backgroundImage.src + ")";
		backgroundElement.before(backgroundElementLoaded);
		backgroundElement.classList.add("contentLoaded");
		setTimeout(() => {
			backgroundElement.parentElement.removeChild(backgroundElement);
		}, 500); 
	}
	backgroundImage.src = "./images/backgroundImages/LakeAndMountains.jpg";
	
	let githubLinkElement = document.getElementById("githubLink");
	githubLinkElement.src = "./images/socialNetworksLinks/githubLink.jpg";
	githubLinkElement.addEventListener("click", () => window.open("https://github.com/CristianDavideConte"));
	
	let instagramLinkElement = document.getElementById("instagramLink");
	instagramLinkElement.src = "./images/socialNetworksLinks/instagramLink.jpg";
	instagramLinkElement.addEventListener("click", () => window.open("https://www.instagram.com/cristian_davide_conte/?hl=it"));
	
	
	let facebookLinkElement = document.getElementById("facebookLink");
	facebookLinkElement.src = "./images/socialNetworksLinks/facebookLink.jpg";
	facebookLinkElement.addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"));		
	
	let profilePicElement = document.getElementById("profilePic");
	profilePicElement.src = "./images/profilePictures/profilePicture.jpg";	
}

/* This Function toggle the class mobileExpanded in the hamburgerMenu element */
function toggleExpandHamburgerMenu() {		
	if(mobileDevice == "1")
		header.classList.toggle("mobileExpanded");	
}

/* This Function returns true if the browser used is the Microsoft Old Edge, false otherwise.
 * The result is determined by looking at the browser's user agent
 */
function isBrowserEdge() {
	let chrome = navigator.userAgent.search("Chrome") == 81;
	return chrome && navigator.userAgent.search("Edge") == 116;
}

/* This Function resets the body height to that of the inner browser
 * This is used to fix the different height behaviour of the mobile browsers' navigation bars 
 */
function updateWindowSize(){
	documentBodyElement.style.height = window.innerHeight + "px";
	windowInnerWidth = window.innerWidth;
	mobileDevice = getComputedStyle(documentBodyElement).getPropertyValue("--mobile-device");
}