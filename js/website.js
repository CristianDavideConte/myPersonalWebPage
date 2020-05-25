var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var windowInnerHeight;															//A shortcut for the DOM element window.innerHeight
//var windowPosition;																//The scrollTop value of the window, used to prevent the DOM from scrolling after a screen orientation change 						
var documentBodyElement;														//A shortcut for the HTML element document.body 
var currentPageIndex;															//The index of the HTML element with class "page" that is currently being displayed the most: if the page is 50% or on the screen, than it's currently being displayed
var transitionTimeMedium;														//The --transition-time-medium css variable, used to know the duration of the normal speed-transitioning elements
var mobileMode; 																//Indicates if the css for mobile is currently beign applied
var headerElement;																//The HTML element with the id "header", used as the website navbar 
var hamburgerMenuElement;														//The HTML element with the id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px 								
var pageLinksElements; 															//All HTML elements with the class "pageLink", shown in the header to navigate through the website' sections
var contentElement;																//The HTML element with the id "content", used as the website main container
var carouselButtons;															//All HTML elements with the class "carouselButton", used to scroll the websitePreview carousel
var websiteShowcase;															//The HTML element with the id "websiteShowcase", children of the websitePreviewCarousel HTML element and used as container for all the websitePreviews
var websitePreviews;															//All HTML elements with the class "websitePreview", used as a clickable previews for all the projects inside the websitePreviewShowcase 
var websitePreviewExpandedMap; 													//A map which contains all the already expanded websitePreviews HTML elements, used for not having to recalculate them every time the user wants to see them

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {	
	variableInitialization();													//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();										//Initializes all the mouse and keyboard eventHandlers 

	imageLoading();																//Initializes all the HTML img elements' contents  
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	//setTimeout(lagTest, 10000);
	//setTimeout(() => scrollTest(directionScroll), 5000);
}

/* This Function initializes all the public variables */
function variableInitialization() {
	documentBodyElement = document.body;
	
	headerElement = document.getElementById("header");
	hamburgerMenuElement = document.getElementById("hamburgerMenu");	
	pageLinksElements = document.getElementsByClassName("pageLink");	
	contentElement = document.getElementById("content");
	carouselButtons = document.getElementsByClassName("carouselButton");	
	websiteShowcase = document.getElementById("websiteShowcase");
	websitePreviews = document.getElementsByClassName("websitePreview");
	
	transitionTimeMedium = getComputedStyle(documentBodyElement).getPropertyValue("--transition-time-medium").replace("s", "") * 1000;
	websitePreviewExpandedMap = new Map();
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	window.addEventListener("resize", updateWindowSize, {passive:true});										//Updates the height and the width whenever the window's resized
	/* The user can use the arrow keys to navigate the website.
	 * Controls for the original event keydown target are added to avoid accidental page scroll.
	 */
	documentBodyElement.addEventListener("keydown", event => {
		if(event.target.tagName == "BODY") {
			let keyName = event.key;
			if(keyName == "ArrowUp" || keyName == "ArrowLeft") {
				contentElement.scrollTop -= windowInnerHeight;
				event.preventDefault();
			} else if(keyName == "ArrowDown" || keyName == "ArrowRight") {
				contentElement.scrollTop += windowInnerHeight;
				event.preventDefault();
			}
		}
	}, {passive:false});

	headerElement.addEventListener("wheel", event => event.stopPropagation(), {passive:true});					//Scroll on the header is not allowed		
	hamburgerMenuElement.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});					//When the hamburgerMenu is pressed it expands by calling the toggleExpandHamburgerMenu function 
	
	/* When the website is in mobile mode the page links are hidden under the hamburgerMenu 
	 * which can be expanded by toggling the class "mobileExpanded" on the header.
	 * Once it's expanded the pageLinks can be clicked to go to the relative website section.
	 * Whenever a link is clicked and the contentElement is scrolled, it's convenient to hide all the links under the hamburgerMenu.
	 * This is done the same way the hamburgerMenu expands when clicked directly (see above in the comment).
	 */
	for(const pageLinkElement of pageLinksElements)															
		pageLinkElement.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});											
	
	/* All the */
	document.getElementById("githubContact").addEventListener("click", () => window.open("https://github.com/CristianDavideConte"), {passive:true});
	document.getElementById("instagramContact").addEventListener("click", () => window.open("https://www.instagram.com/cristiandavideconte/?hl=it"), {passive:true});
	document.getElementById("facebookContact").addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"), {passive:true});		
	document.getElementById("mailContact").addEventListener("click", () => window.open("mailto:cristiandavideconte@gmail.com", "mail"), {passive:true});
	
	let isFingerDown = false;
	contentElement.addEventListener("touchstart", () => isFingerDown = true, {passive:true});
	contentElement.addEventListener("touchend", () => isFingerDown = false, {passive:true});
	
	let firstScrollYPosition = null;
	let lastScrollYPosition; 	
	let smoothScrollTimeout;
	contentElement.addEventListener("scroll", event => {
			if(firstScrollYPosition == null)
				firstScrollYPosition = contentElement.scrollTop;	
			else 		
				clearTimeout(smoothScrollTimeout);	 
			
			smoothScrollTimeout = setTimeout(function checkFingerDown() {
				if(isFingerDown) 
					smoothScrollTimeout = setTimeout(checkFingerDown, 100);
				else {
					lastScrollYPosition = contentElement.scrollTop;
					smoothPageScroll(Math.sign(lastScrollYPosition - firstScrollYPosition), lastScrollYPosition);
					firstScrollYPosition = null;
				}
			}, 100);
	}, {passive:true});

	websiteShowcase.addEventListener("wheel", (event) => {
		let scrollDirection = Math.sign(event.deltaY);					//1 if the scrolling is going downwards -1 otherwise
		let totalScrollAmmount = windowInnerWidth/20;					//The total ammount of pixel horizontally scrolled by the smoothScroll function 
		let scrollDistance = windowInnerWidth/150;						//The ammount of pixel scrolled at each smoothScroll call
		let partialScrollAmmount = 0;									//scrollDistance * number of smoothScroll function calls
		
		/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
		 * and so that is 1/20th of the window's innerWidth at any given resolution.
		 * If the wheel is scrolled from top to bottom the scroll direction will be from right to left, it will be inverted otherwise.
		 */
		function smoothScroll() {
			websiteShowcase.scrollLeft += scrollDirection * scrollDistance;		
			partialScrollAmmount += scrollDistance;
			if(partialScrollAmmount < totalScrollAmmount)
				window.requestAnimationFrame(smoothScroll);
		}
		
		window.requestAnimationFrame(smoothScroll);
	}, {passive:true});
														
	let carouselButtonScrollEnabled = false;
	/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
	 * and so that is +1/100th of the window's innerWidth at any given resolution.
	 * The + sign means the scroll direction is from left to right. 
	 */
	function scrollFromRightToLeft() {
		websiteShowcase.scrollLeft -= windowInnerWidth/100;
		if(carouselButtonScrollEnabled)
			window.requestAnimationFrame(scrollFromRightToLeft);
	}
	
	/* The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth 
	 * and so that is +1/100th of the window's innerWidth at any given resolution.
	 * The + sign means the scroll direction is from left to right. 
	 */
	function scrollFromLeftToRight() {
		websiteShowcase.scrollLeft += windowInnerWidth/100;
		if(carouselButtonScrollEnabled)
			window.requestAnimationFrame(scrollFromLeftToRight);
	}
	
	carouselButtons[0].addEventListener("mousedown", () => {
		carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(scrollFromRightToLeft);
	}, {passive:true});
	
	carouselButtons[1].addEventListener("mousedown", () => {
		carouselButtonScrollEnabled = true;
		window.requestAnimationFrame(scrollFromLeftToRight);
	}, {passive:true});
	
	carouselButtons[0].addEventListener("mouseup", () => carouselButtonScrollEnabled = false, {passive:true});
	carouselButtons[1].addEventListener("mouseup", () => carouselButtonScrollEnabled = false, {passive:true});
	
	for(const websitePreview of websitePreviews) {
		/* First all the websitePreviewExpanded basic components are created */
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
			viewCodeButton.addEventListener("click", event => {
				event.stopPropagation();
				window.open(dataCode);
			}, {passive:true});
			viewButtonsSection.appendChild(viewCodeButton);
		}
		
		let dataDemo = websitePreview.getAttribute("data-demo");
		if(dataDemo != null) {													//There could be a project that hasn't got a demo ready yet
			let viewDemoButton = document.createElement("button");
			viewDemoButton.innerHTML = "View Demo";
			viewDemoButton.className = "websitePreviewExpandedButton";
			viewDemoButton.addEventListener("click", event => {
				event.stopPropagation();
				window.open(dataDemo);
			}, {passive:true});
			viewButtonsSection.appendChild(viewDemoButton);
		}	
		
		websitePreviewExpanded.appendChild(viewButtonsSection);
		
		let backgroundContent = document.createElement("div");
		backgroundContent.id = "websitePreviewExpandedBackgroundContent";
		backgroundContent.className = "page";		
		backgroundContent.appendChild(websitePreviewExpanded);
		
		/*The listenersAlreadyTriggered variable is used to prevent the user to execute the backgroundContent eventListener 
		 * more than one time while the animation is still happening.
		 * Otherwise the document.body would try to remove the backgroundContent multiple times generating errors in the browser console.
		 * Note that this bug wouldn't cause the page to instantly crash.
		 */
		let listenersAlreadyTriggered = false;																			
		backgroundContent.addEventListener("click", () => {
			event.stopPropagation();
			if(!listenersAlreadyTriggered) {
				listenersAlreadyTriggered = true;				
				setTimeout(() => {
					listenersAlreadyTriggered = false;
					headerElement.style = ""; 
					websitePreview.classList.remove("expandedState");
					documentBodyElement.removeChild(backgroundContent);
				}, transitionTimeMedium);
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
				
				websitePreviewExpanded.className = "";
			}
		}, {passive:true});
		
		websitePreviewExpandedMap.set(websitePreview, backgroundContent);
		
		websitePreview.addEventListener("click", () => {
			event.stopPropagation();																				//Prevents the click to instantly remove the previewExpanded element that is going to be created next		
			setTimeout(() => {
				websitePreviewExpanded.className = "expandedState";
				websitePreview.classList.add("expandedState");
			}, 20);
				
			/* The websitePreview is scaled while hovered.
			 * The top and left offset have to take the scaling into consideration otherwise 
			 * the final position of the websitePreviewExpanded will be slightly off due to the scaling factor.
			 * The initial position is instead calculated adding the hover effect's expansion.
			 */			
			let websitePreviewBoundingRectangle = websitePreview.getBoundingClientRect();
			let documentBodyElementStyle = documentBodyElement.style;		
			documentBodyElement.insertBefore(websitePreviewExpandedMap.get(websitePreview), documentBodyElement.firstChild);

			documentBodyElementStyle.setProperty("--websitePreview-original-top-position", websitePreviewBoundingRectangle.top + "px");
			documentBodyElementStyle.setProperty("--websitePreview-original-left-position", websitePreviewBoundingRectangle.left + "px");
			documentBodyElementStyle.setProperty("--websitePreview-current-size", websitePreviewBoundingRectangle.height + "px");
			
			headerElement.style.pointerEvents = "none";	
		}, {passive:true});
	}		
}

var test = 0;
function lagTest() {
	websitePreview = document.getElementsByClassName("websitePreview")[0];
    var event = document.createEvent('Events');
    event.initEvent("click", true, false);
	if(test < 100) {
		if(test % 2 == 0) 
			websitePreview.dispatchEvent(event);
		else 
			documentBodyElement.firstChild.dispatchEvent(event);
		
		setTimeout(lagTest, transitionTimeMedium);
		test++;
	}
}
/*
var scroll = 0;
var directionScroll = 1;
function scrollTest(directionScroll) {
	if(scroll < 10){
		contentElement.scrollTop += directionScroll * windowInnerHeight / 4 + directionScroll;
		scroll++;
		setTimeout(() => scrollTest(-directionScroll), 2000);
	}
}
*/

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

/* This Function toggle the class mobileExpanded in the hamburgerMenu element if the page is in mobileMode.
 * Mobile mode is triggered on the window's resize event.
 */
function toggleExpandHamburgerMenu() {		
	if(mobileMode)
		headerElement.classList.toggle("mobileExpanded");	
}

/* This Function emulates the smooth scroll behaviour provided by css 
 * taking into consideration the current page position.
 * It triggers after a scroll is completed.
 * If at the end of the scroll, the current page is not alligned, it gets:
 * - alligned if it covers 3/4 of the windowInnerHeight or more
 * - scrolled, following the original user's scroll direction, otherwise 
 */
function smoothPageScroll(direction, contentElementScrollTop) {
	currentPageIndex = Math.round(contentElementScrollTop / windowInnerHeight);
	let pageOffset = direction * (currentPageIndex * windowInnerHeight - contentElementScrollTop);	//The offset measure by how much the page is not alligned with the screen: pageOffset is always negative 
	
	if(pageOffset != 0)
		if(-pageOffset < windowInnerHeight / 4)															//Case 1: The user scroll too little
			contentElement.scrollTop += direction * pageOffset;			
		else 																							//Case 2: The user scrolled enought for the next page to be visible on 1/4 of the windowInnerHeight
			contentElement.scrollTop += direction * (windowInnerHeight + pageOffset);
}

/* This Function:
 * - scrolls the contentElement if needed to avoid pages offset creation during resizing
 * - udates the windowInnerHeight and windowInnerWidth variables with the new window' values.
 * - resets the body height to that of the inner browser: this is used to fix the different height behaviour of the mobile browsers' navigation bars 
 * - check if the page can go to the mobileMode and set the javascript mobileMode variable.
 * - doesn't trigger any style recalulation nor activate any of the previously described updates until the resize is finished and 1s is passed 
 */
let windowResizeTimeout = null;															
function updateWindowSize(){
	if(windowResizeTimeout != null)  
		clearTimeout(windowResizeTimeout);

	windowResizeTimeout = setTimeout(() => {
		//contentElement.scrollTop += windowInnerHeight - window.innerHeight;							//Here windowInnerHeight hasn't been updated yet so it contains the old height value	
		windowInnerWidth = window.innerWidth;
		windowInnerHeight = window.innerHeight;
		document.documentElement.style.setProperty("--vh", windowInnerHeight * 0.01 + "px");
		if(windowInnerWidth < 1081)
			mobileMode = 1
		else 
			mobileMode = 0;
	}, 100);
}