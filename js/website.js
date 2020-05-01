var header;
var hamburgerMen;
var documentBodyElement;
var windowInnerWidth;

function init() {	
	variableInitialization();
	updateWindowSize();																							//Initially sets the height (fixes mobile top search bar behavior) and stores the window's inner width
	window.addEventListener("resize", updateWindowSize);														//Resets the height whenever the window's resized
	
	hamburgerMenu.addEventListener("mousedown", () => toggleExpandHamburgerMenu(hamburgerMenu), {passive:true});
	let pageLinks = document.getElementsByClassName("pageLink");	
	for(const pageLink of pageLinks)
		pageLink.addEventListener("mouseup", () => toggleExpandHamburgerMenu(hamburgerMenu), {passive:true});
	
	let websiteShowcase = document.getElementsByClassName("websiteShowcase")[0];
	websiteShowcase.addEventListener("wheel", (event) => {
		websiteShowcase.scrollLeft -= (-event.deltaY/3);
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
		websiteShowcase.dispatchEvent(new WheelEvent("wheel", {
			deltaY: -30
		}));
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[0]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
	
	carouselButtons[1].addEventListener("mousedown", () => {
		websiteShowcase.dispatchEvent(new WheelEvent("wheel", {
			deltaY: 30	
		}));
		
		if(carouselButtonMouseDownInterval == null)
			carouselButtonMouseDownInterval = setInterval(() => carouselButtonMouseDownIntervalSet(carouselButtons[1]), 10);
		window.addEventListener("mouseup", carouselButtonMouseDownIntervalReset);	
	}, {passive:true});
	
	imageLoading();	
}

function variableInitialization() {
	windowInnerWidth = window.innerWidth;
	documentBodyElement = document.body;
	header = document.getElementById("header");
	hamburgerMenu = document.getElementById("hamburgerMenu");	
}

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
function toggleExpandHamburgerMenu(hamburgerMenu) {
	if(windowInnerWidth < 1081) 
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