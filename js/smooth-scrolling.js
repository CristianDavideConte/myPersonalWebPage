function scrollInit() {
    const _profilePic = document.getElementById("profilePic");
    const _presentationCard = document.getElementById("presentationCard");
    const _websiteShowcase = document.getElementById("websiteShowcase");
    const _contactMeFormBodyElement = document.getElementById("contactMeFormBody");
    const _carouselButtons = document.getElementsByClassName("carouselButton");
    const _websitePreviewExpandedBackgroundContentElement = document.getElementById("websitePreviewExpandedBackgroundContent");
	
	let _documentBodyFirstYPosition = null;
	let _documentBodyLastYPosition  = null;
	let _presentationCardLastYPosition = null;
	let _presentationCardScrollPropagation = true;

    const _defaultEasing = (remaning) => {return remaning / 20 + 1;};

    
    //If the direction is === -1  the scroll direction is from right to left, it's from left to right otherwise.
	function _smoothWebsiteShowcaseWheelScrollHorizzontally(scrollDirection) {
		const finalPos = scrollDirection < 0 ? 0 : uss.getMaxScrollX(_websiteShowcase);
		uss.setXStepLengthCalculator(EASE_IN_OUT_QUAD(700), _websiteShowcase);
		uss.scrollXTo(finalPos, _websiteShowcase, null);
	}
    
	uss.setPageScroller(document.body);
	uss.setYStepLengthCalculator(_defaultEasing);
	uss.hrefSetup(null, null, (pageLink, destination) => {
		uss.setYStepLengthCalculator(EASE_OUT_QUINT(800));

		/*
		 * When the website is in mobile mode the page links are hidden under the hamburgerMenu
		 * which can be expanded by toggling the class "mobileExpanded" on the headerElement and the headerBackgroundElement.
		 * Once it's expanded the pageLinks can be clicked to go to the relative website section.
		 * Whenever a pageLink is clicked, the hamburgerMenu is hidden.
		 * This is done the same way the hamburgerMenu expands.
		 */
		if(pageLink.id != "scrollDownButton") toggleHeaderExpandedState();
	}, null, true);


    /* 
     * WHEEL EVENT-LISTENERS 
     */




    document.body.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		if(websitePreviewListenerDebounce || websitePreviewExpandedBackgroundContentElement.classList.contains("expandedState")) return;
		if(_documentBodyFirstYPosition === null) _documentBodyFirstYPosition = document.body.scrollTop;
		if(uss.getYStepLengthCalculator() !== _defaultEasing) {
			uss.setYStepLengthCalculator(_defaultEasing);
			uss.stopScrollingY();
		}
		uss.scrollYBy(event.deltaY,
                      document.body,
                      () => {
                        smoothPageScroll(_documentBodyFirstYPosition, document.body.scrollTop);
                        _documentBodyFirstYPosition = null;
                      },
                      false);
	}, {passive:false});




    function _scrollPresentationCard(event) {
        const _scrollTop = _presentationCard.scrollTop;
        const _delta = event.deltaY;
        if((_scrollTop <= 0 && _delta < 0) || (_scrollTop >= uss.getMaxScrollY(_presentationCard) && _delta > 0)) return;
        event.preventDefault();
        event.stopPropagation();
        uss.scrollYBy(event.deltaY / 2, _presentationCard, null, false);
	}

	_profilePic.addEventListener("wheel", _scrollPresentationCard, {passive:false});
	_presentationCard.addEventListener("wheel", _scrollPresentationCard, {passive:false});



	_websiteShowcase.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		uss.setXStepLengthCalculator(_defaultEasing, _websiteShowcase);
		uss.scrollXBy(event.deltaY / 2, _websiteShowcase, null, false);
	}, {passive:false});



    _contactMeFormBodyElement.addEventListener("wheel", event => {
		event.preventDefault();
		event.stopPropagation();
		uss.scrollYBy(Math.sign(event.deltaY) * windowHeight / 10, _contactMeFormBodyElement, null, false);
	}, {passive:false});
    
	uss.setYStepLengthCalculator(_defaultEasing, _contactMeFormBodyElement);




    /* 
     * TOUCH EVENT-LISTENERS 
     */
    

	document.body.addEventListener("touchstart", event => {
		if(event.touches.length > 1) return;
		uss.stopScrollingY();
		uss.setYStepLengthCalculator(_defaultEasing);
		_documentBodyFirstYPosition = document.body.scrollTop;
		_documentBodyLastYPosition = null;
	},{passive:true});

	document.body.addEventListener("touchend", event => {
		if(event.touches.length > 1) return;
		uss.stopScrollingY();
		smoothPageScroll(_documentBodyFirstYPosition, document.body.scrollTop, 20, EASE_OUT_QUINT());
		_documentBodyFirstYPosition = null;
		_documentBodyLastYPosition = null;
	}, {passive:true});

	document.body.addEventListener("touchmove", event => {
		if(websitePreviewListenerDebounce || websitePreviewExpandedBackgroundContentElement.classList.contains("expandedState")) return false;
		if(event.cancelable) event.preventDefault();
		event.stopPropagation();
		if(event.touches.length > 1) return;

		if(_documentBodyLastYPosition === null) _documentBodyLastYPosition = event.changedTouches[0].clientY;
		const _originalDeltaY = _documentBodyLastYPosition - event.changedTouches[0].clientY;
		_documentBodyLastYPosition -= _originalDeltaY;
		const _absDeltaY = Math.abs(_originalDeltaY);

		uss.scrollYBy(_absDeltaY <= 1 ? _originalDeltaY : _originalDeltaY * Math.log(1e8 * _absDeltaY));
	}, {passive:false});


    

	_presentationCard.addEventListener("touchstart", event => {_presentationCardLastYPosition = event.touches[0].clientY}, {passive:true});
	_presentationCard.addEventListener("touchend",   event => {_presentationCardLastYPosition = null; _presentationCardScrollPropagation = true;}, {passive: true});
	_presentationCard.addEventListener("touchmove",  event => {
		const _delta = event.changedTouches[0].clientY - _presentationCardLastYPosition;
		_presentationCardLastYPosition += _delta;
		const _scrollTop = _presentationCard.scrollTop;
		const _maxScrollY = uss.getMaxScrollY(_presentationCard);

		if((_scrollTop <= 0 && _delta > 0) || (_scrollTop >= _maxScrollY && _delta < 0)) {
			_presentationCardScrollPropagation = false;
			return;
		} else if(!_presentationCardScrollPropagation && (_scrollTop <= 0 || _scrollTop >= _maxScrollY)) {
			return 
		}
		event.stopPropagation();
		_documentBodyLastYPosition = null;
	}, {passive:false});
	uss.setYStepLengthCalculator(_defaultEasing, _presentationCard);



    
	_websiteShowcase.addEventListener("touchmove", event => event.stopPropagation(), {passive:true});
	_contactMeFormBodyElement.addEventListener("touchmove", event => event.stopPropagation(), {passive:true});


    _carouselButtons[0].addEventListener("touchstart", () => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1), {passive:false});
	_carouselButtons[1].addEventListener("touchstart", () => _smoothWebsiteShowcaseWheelScrollHorizzontally(+1), {passive:false});
	_carouselButtons[0].addEventListener("touchend", () => uss.stopScrollingX(_websiteShowcase), {passive:false});
	_carouselButtons[1].addEventListener("touchend", () => uss.stopScrollingX(_websiteShowcase), {passive:false});




    /* 
     * MOUSE EVENT-LISTENERS
     */
	_carouselButtons[0].addEventListener("mousedown",  () => _smoothWebsiteShowcaseWheelScrollHorizzontally(-1), {passive:false});
	_carouselButtons[1].addEventListener("mousedown",  () => _smoothWebsiteShowcaseWheelScrollHorizzontally(+1), {passive:false});
	_carouselButtons[0].addEventListener("mouseup",  () => uss.stopScrollingX(_websiteShowcase), {passive:false});
	_carouselButtons[1].addEventListener("mouseup",  () => uss.stopScrollingX(_websiteShowcase), {passive:false});
	_carouselButtons[0].addEventListener("mouseout", () => uss.stopScrollingX(_websiteShowcase), {passive:false});
	_carouselButtons[1].addEventListener("mouseout", () => uss.stopScrollingX(_websiteShowcase), {passive:false});






    /*
     * KEYBOARD EVENT-LISTENERS
     */

	document.body.addEventListener("keydown", event => {
		if(uss.isYscrolling() || event.target.tagName !== "BODY") return;
		const _websitePreviewIsExpanded = _websitePreviewExpandedBackgroundContentElement.classList.contains("expandedState") || websitePreviewListenerDebounce;
		const _keyName = event.key;
		if(_keyName === "ArrowUp" || _keyName === "ArrowLeft" || _keyName === "PageUp") {
			if(!_websitePreviewIsExpanded) {
				const _firstY = document.body.scrollTop;
				uss.setYStepLengthCalculator(EASE_OUT_QUINT(800));
				uss.scrollYBy(-windowHeight, document.body, () => smoothPageScroll(_firstY, document.body.scrollTop), true);
			}
			return false;
		} else if(_keyName === "ArrowDown" || _keyName === "ArrowRight" || _keyName === "PageDown") {
			if(!_websitePreviewIsExpanded) {
				const _firstY = document.body.scrollTop;
				uss.setYStepLengthCalculator(EASE_OUT_QUINT(800));
				uss.scrollYBy(+windowHeight, document.body, () => smoothPageScroll(_firstY, document.body.scrollTop), true);
			}
			return false;
		} else if(_keyName === "Home") {
            if(!_websitePreviewIsExpanded) {
				uss.setYStepLengthCalculator(EASE_OUT_QUINT(800));
				uss.scrollYTo(0);
            }
			return false;
        } else if(_keyName === "End") {
            if(!_websitePreviewIsExpanded) {
				uss.setYStepLengthCalculator(EASE_OUT_QUINT(800));
				uss.scrollYTo(uss.getMaxScrollY());
            }
			return false;
		}
	}, {passive:false});

}





/*
 * If at the end of the scroll, the current page is not alligned, it gets:
 * - alligned if it covers 3/4 of the windowHeight or more (same as scrollIntoView).
 * - scrolled, following the original user's scroll direction, otherwise (same as scrollIntoView on the previous/nextPage).
 */
function smoothPageScroll(firstScrollYPosition, lastScrollYPosition, threshold = windowHeight / 4, easing) {
	const _currentPageIndex = Math.round(lastScrollYPosition / windowHeight);
	const _scrollDirection  = Math.sign(lastScrollYPosition - firstScrollYPosition); //1 if the scrolling is going downwards -1 otherwise.
	const _pageOffset = _scrollDirection * (_currentPageIndex * windowHeight - lastScrollYPosition); //The offset measure by how much the page is not alligned with the screen: pageOffset is always negative

	if(-_pageOffset < threshold) {//The user didn't scroll enough pixels 
		uss.setYStepLengthCalculator(easing || EASE_IN_OUT_QUAD(700));
		uss.scrollYBy(_scrollDirection * _pageOffset);
	} else {
		uss.setYStepLengthCalculator(easing || EASE_IN_OUT_QUINT(700));
		uss.scrollYBy(_scrollDirection * (windowHeight + _pageOffset));
	}
}