var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var documentBodyElement;														//A shortcut for the HTML element document.body 
var header;																		//The HTML element with the id "header", used as the site navbar 
var hamburgerMenu;																//The HTML element with the	id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px 								
var pageLinks; 																	//All HTML element with the class "pageLink", shown in the header to navigate through the website' sections
var transitionTimeQuick;														//The --transition-time-quick css variable

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {	
	variableInitialization();													//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();										//Initializes all the mouse and keyboard eventHandlers 
		
	//if ("ontouchstart" in window) 												//If the device is touch capable the support to the touchstartEvent is added
		//mobileEventListenerInitialization();									//Initializes all the touch related eventHandlers 

	imageLoading();																//Initializes all the HTML img elements' contents  
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	setTimeout(lagTest, 10000);
}

/* This Function initializes all the javascript file's public variables */
function variableInitialization() {
	windowInnerWidth = window.innerWidth;
	documentBodyElement = document.body;
	header = document.getElementById("header");
	hamburgerMenu = document.getElementById("hamburgerMenu");	
	pageLinks = document.getElementsByClassName("pageLink");	
	transitionTimeQuick	= getComputedStyle(documentBodyElement).getPropertyValue("--transition-time-medium").replace("s", "") * 1000;
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
	
	websitePreviews = document.getElementsByClassName("websitePreview");
	for(const websitePreview of websitePreviews)
		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next
			let projectPage = document.getElementById("projects");
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
			
			let websitePreviewExpanded = document.createElement("div");
			websitePreviewExpanded.id = "websitePreviewExpanded";	
			
			let websitePreviewExpandedTitleSectionContent = websitePreview.firstElementChild.cloneNode(true);
			websitePreviewExpandedTitleSectionContent.className = "websitePreviewExpandedTitleSectionContent";
			websitePreviewExpanded.appendChild(websitePreviewExpandedTitleSectionContent);
			
			let websitePreviewExpandedTitleSection = document.createElement("div");
			websitePreviewExpandedTitleSection.className = "websitePreviewExpandedTitleSection";
			websitePreviewExpandedTitleSection.innerHTML = websitePreview.getAttribute("data-title");			
			websitePreviewExpanded.appendChild(websitePreviewExpandedTitleSection);
			
			let viewCodeButton = document.createElement("button");
			viewCodeButton.innerHTML = "View Code";
			viewCodeButton.className = "websitePreviewExpandedButton";
			
			let viewDemoButton = document.createElement("button");
			viewDemoButton.innerHTML = "View Demo";
			viewDemoButton.className = "websitePreviewExpandedButton";
			
			let viewButtonsSection = document.createElement("div");
			viewButtonsSection.id = "websitePreviewExpandedButtonSection";
			viewButtonsSection.appendChild(viewCodeButton);
			viewButtonsSection.appendChild(viewDemoButton);
			
			websitePreviewExpanded.appendChild(viewButtonsSection);
			websitePreviewExpanded.addEventListener("click", event => event.stopPropagation());
			
			let backgroundContent = document.createElement("div");
			backgroundContent.id = "websitePreviewExpandedBackgroundContent";
			backgroundContent.className = "page";		
			documentBodyElement.insertBefore(backgroundContent, documentBodyElement.firstChild);
			backgroundContent.appendChild(websitePreviewExpanded);
			
			let transitionDuration = 0;
			let transitionDurationIntervalFrequency = 20;
			let checkAnimationDuration = function () {
				if(transitionDuration < transitionTimeQuick)
					transitionDuration += transitionDurationIntervalFrequency;
				else 
					clearInterval(transitionDurationInterval);
			}
			let transitionDurationInterval = setInterval(checkAnimationDuration, transitionDurationIntervalFrequency);
			
			setTimeout(() => websitePreviewExpanded.className = "expandedState", transitionDurationIntervalFrequency);	
			setTimeout(function() {
				viewCodeButton.addEventListener("click", () => window.open(websitePreview.getAttribute("data-code")));
				viewDemoButton.addEventListener("click", () => window.open(websitePreview.getAttribute("data-demo")));
			}, transitionTimeQuick + transitionDurationIntervalFrequency);
			
			backgroundContent.addEventListener("click", function removePreviewExpanded(event) {
				event.preventDefault();
				event.stopPropagation();
				clearInterval(transitionDurationInterval);
				backgroundContent.removeEventListener("click", removePreviewExpanded, {passive: false});
				websitePreviewExpanded.className = "";
				setTimeout(() => documentBodyElement.removeChild(backgroundContent), transitionDuration);
			}, {passive: false});
		});
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
		
		setTimeout(lagTest, transitionTimeQuick);
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
}