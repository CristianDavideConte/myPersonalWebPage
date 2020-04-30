var header;
var hamburgerMen;

function init() {	
	resetHeight();																						//Initially sets the height (fixes mobile top search bar behavior)
	window.addEventListener("resize", resetHeight);														//Resets the height whenever the window's resized
	
	header = document.getElementById("header");
	hamburgerMenu = document.getElementById("hamburgerMenu");	
	hamburgerMenu.addEventListener("mousedown", () => toggleExpandHamburgerMenu(hamburgerMenu), {passive:true});
	let pageLinks = document.getElementsByClassName("pageLink");	
	for(const pageLink of pageLinks)
		pageLink.addEventListener("mouseup", () => toggleExpandHamburgerMenu(hamburgerMenu), {passive:true});
	
	let websiteShowcase = document.getElementsByClassName("websiteShowcase")[0];
	websiteShowcase.addEventListener("wheel", (event) => {
		websiteShowcase.scrollLeft -= (-event.deltaY/3);
		event.preventDefault();
	}, {passive:false});
	
	var carouselButtonMouseDownInterval;
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

function imageLoading() {
	let backgroundImage = new Image();
	backgroundImage.onload = () => { 
		let backgroundElement = document.getElementById("background");
		backgroundElement.style.backgroundImage = "none";
		backgroundElement.src = backgroundImage.src;
	}
	backgroundImage.src = "./images/backgroundImages/LakeAndMountains.jpg";
	
	let instagramLinkElement = document.getElementById("instagramLink");
	instagramLinkElement.addEventListener("click", () => window.open("https://www.instagram.com/cristian_davide_conte/?hl=it"));
	let instagramLinkImage = new Image();
	instagramLinkImage.onload = () => { 
		instagramLinkElement.style.backgroundImage = "none";
		instagramLinkElement.src = instagramLinkImage.src;
	}
	instagramLinkImage.src = "./images/socialNetworksLinks/instagramLink.jpg";
	
	
	let facebookLinkElement = document.getElementById("facebookLink");
	facebookLinkElement.addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"));		
	let facebookLinkImage = new Image();
	facebookLinkImage.onload = () => { 
		facebookLinkElement.style.backgroundImage = "none";
		facebookLinkElement.src = facebookLinkImage.src;
	}
	facebookLinkImage.src = "./images/socialNetworksLinks/facebookLink.jpg";
	
	let profilePicImage = new Image();
	profilePicImage.onload = () => { 
		let profilePic = document.getElementById("profilePic");
		profilePic.style.backgroundImage = "none";
		profilePic.src = profilePicImage.src;
	}
	profilePicImage.src = "./images/profilePictures/profilePicture.jpg";	
}

function toggleExpandHamburgerMenu(hamburgerMenu) {
	if(window.innerWidth <= 1080) 
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
function resetHeight(){
	document.body.style.height = window.innerHeight + "px";
}