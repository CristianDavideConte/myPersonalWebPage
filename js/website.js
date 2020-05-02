var windowInnerWidth;															//A shortcut for the DOM element window.innerWidth
var documentBodyElement;														//A shortcut for the HTML element document.body 
var header;																		//The HTML element with the id "header", used as the site navbar 
var hamburgerMenu;																//The HTML element with the	id "hamburgerMenu", used to interact with the navbar when the width of the window is below 1081px 								
var pageLinks; 																	//All HTML element with the class "pageLink", shown in the header to navigate through the website' sections

/* This Function calls all the necessary functions that are needed to initialize the page */
function init() {	
	variableInitialization();													//Binds the js variables to the corresponding HTML elements
	desktopEventListenerInitialization();										//Initializes all the mouse and keyboard eventHandlers 
		
	//if ("ontouchstart" in window) 												//If the device is touch capable the support to the touchstartEvent is added
		//mobileEventListenerInitialization();									//Initializes all the touch related eventHandlers 

	imageLoading();																//Initializes all the HTML img elements' contents  
	updateWindowSize();															//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
}

/* This Function initializes all the javascript file's public variables */
function variableInitialization() {
	windowInnerWidth = window.innerWidth;
	documentBodyElement = document.body;
	header = document.getElementById("header");
	hamburgerMenu = document.getElementById("hamburgerMenu");	
	pageLinks = document.getElementsByClassName("pageLink");													
}

/* This function binds all the HTML elements that can be interacted to their mouse and keyboard eventHandlers */
function desktopEventListenerInitialization() {
	window.addEventListener("resize", updateWindowSize);															//Updates the height and the width whenever the window's resized
	hamburgerMenu.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});							//When the hamburgerMenu is pressed it expands by calling the toggleExpandHamburgerMenu function 
	
	for(const pageLink of pageLinks)															
		pageLink.addEventListener("click", toggleExpandHamburgerMenu, {passive:true});							//Whenever a HTML element with the class "pageLink" is pressed the DOM is scrolled to the corresponding section 
	
	let websiteShowcase = document.getElementsByClassName("websiteShowcase")[0];
	websiteShowcase.addEventListener("wheel", (event) => {
		websiteShowcase.scrollLeft += Math.sign(event.deltaY)*windowInnerWidth*50/1920								//The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth and so that at 1920px the scroll is 50px
		event.preventDefault();
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
		websiteShowcase.scrollLeft -= windowInnerWidth*30/1920												//The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth and so that at 1920px the scroll is 30px
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[0]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
	
	carouselButtons[1].addEventListener("mousedown", () => {
		websiteShowcase.scrollLeft += windowInnerWidth*30/1920												//The number of the pixel scrolled on the x-axis, it's calculated dynamically based on the windowInnerWidth and so that at 1920px the scroll is -30px
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[1]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
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