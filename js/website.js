var header;
var hamburgerMen;

function init() {	
	resetHeight();																						//Initially sets the height (fixes mobile top search bar behavior)
	window.addEventListener("resize", resetHeight);														//Resets the height whenever the window's resized

	let instagramLink = document.getElementById("instagramLink");
	instagramLink.src = "./images/socialNetworksLinks/instagramLink.jpg";
	instagramLink.alt = "";
	instagramLink.addEventListener("click", () => window.open("https://www.instagram.com/cristian_davide_conte/?hl=it"));
	
	let facebookLink = document.getElementById("facebookLink");
	facebookLink.src = "./images/socialNetworksLinks/facebookLink.jpg";
	facebookLink.alt = "";	
	facebookLink.addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"));		
	
	let profilePic = document.getElementById("profilePic");
	profilePic.src = "./images/profilePictures/profilePicture.jpg";
	profilePic.alt = "";				
	
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