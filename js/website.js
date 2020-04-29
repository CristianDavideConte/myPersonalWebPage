function init() {	
	resetHeight();																						//Initially sets the height (fixes mobile top search bar behavior)
	window.addEventListener("resize", resetHeight);														//Resets the height whenever the window's resized
	
	let profilePic = document.getElementById("profilePic");
	profilePic.src = "https://instagram.fmxp3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/75252749_1705239399607205_9103749054403182592_n.jpg?_nc_ht=instagram.fmxp3-1.fna.fbcdn.net&_nc_ohc=wsB9gkHxBb0AX8l194O&oh=87e350c2332eb8af36e79c5e1b7ced6b&oe=5EC8DF25";
	profilePic.alt = "";				
	
	let instagramLink = document.getElementById("instagramLink");
	instagramLink.src = "./images/instagramLink.jpg";
	instagramLink.alt = "";
	instagramLink.addEventListener("click", () => window.open("https://www.instagram.com/cristian_davide_conte/?hl=it"));
	
	let facebookLink = document.getElementById("facebookLink");
	facebookLink.src = "./images/facebookLink.jpg";
	facebookLink.alt = "";	
	facebookLink.addEventListener("click", () => window.open("https://www.facebook.com/cristiandavide.conte/"));		

	let hamburgerMenu = document.getElementsByClassName("hamburgerMenu")[0];		
	let pageLinks = document.getElementsByClassName("pageLink");	
	for(const pageLink of pageLinks)
		pageLink.addEventListener("mouseup", () => toggleExpandHamburgerMenu(hamburgerMenu), {passive:false});
	hamburgerMenu.addEventListener("mousedown", event => toggleExpandHamburgerMenu(hamburgerMenu), {passive:false});
	
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
	event.preventDefault();	
	if(window.innerWidth <= 1080) {
		hamburgerMenu.classList.toggle("changeHamburgerMenuState")
		document.getElementsByClassName("header")[0].classList.toggle("mobileExpanded");
	}
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