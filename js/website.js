function init() {	
	resetHeight();												//Initially sets the height (fixes mobile top search bar behavior)
	window.addEventListener("resize", resetHeight);																		//Resets the height whenever the window's resized
			
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
}

function expandHamburgerMenu(hamburgerMenu) {
	let menu = document.getElementsByClassName("hamburgerMenu")[0];
	menu.removeEventListener("click", expandHamburgerMenu);
	let header = document.getElementsByClassName("header")[0];
	let children = header.children;
	let secondHeaderChild = children[1];
	
	if(secondHeaderChild.id == "mail") {
		console.log("NuovaVersione");
		console.log(navigator.userAgent.search("Chrome"));
		console.log(navigator.userAgent.search("Chrome"));
		if (navigator.userAgent.search("Chrome")) {
			secondHeaderChild.animate([
				{ offset: 0, transform: "translateY(0%)" },
				{ offset: 1, transform: "translateY(-100%)" }
			], {
				duration: 200
			});
		}
		setTimeout(() => header.removeChild(secondHeaderChild), 100);
	} else {
		let div = document.createElement("div");
		let mail = document.createElement("p");
		mail.innerHTML = "email: cristiandavideconte@gmail.com";
		mail.style.margin = "0 auto 0 0";
		
		div.setAttribute("id", "mail");
		div.appendChild(mail);
		
		children[0].after(div);

		if (navigator.userAgent.search("Chrome")) {		
			div.animate([
				{ offset: 0, transform: "translateY(-100%)" },
				{ offset: 1, transform: "translateY(0%)" }
			], {
				duration: 200
			});
		}
	}	
	
	hamburgerMenu.classList.toggle("changeHamburgerMenuState");
	menu.addEventListener("click", expandHamburgerMenu);	
}

/* This Function resets the body height to that of the inner browser
* This is used to fix the different height behaviour of the mobile browsers' navigation bars 
*/
function resetHeight(){
	document.body.style.height = window.innerHeight + "px";
}