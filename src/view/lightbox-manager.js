/* globals window */
/* globals document */
'use strict';

/**
* LightBoxManager is in charge of rendering detailed
* photo in lightbox experience
* @param {HTMLElement} selector
* @param {ViewManager} viewManager
* @class
*/
function LightBoxManager (selector, viewManager) {
    var self = this;

    self._selector = selector;
    self._viewManager = viewManager;
    self._document = window.document;
    self._whiteOverlay = null;
    self._blackOverlay = null;
    self._nextNav = null;
    self._prevNav = null;
    self._titleBar = null;
    self._currentViewingImageIndex = -1;
    self._lightBoxImageMap = {};
    self.init();
}

/**
* Initializes LightBoxManager, building required
* dom node
* @public
*/
LightBoxManager.prototype.init = function () {
    var self = this;
    self._whiteOverlay = self._createWhiteOverlay();
    self._blackOverlay = self._createBlackOverlay();
    self._nextNav = self._createNextNav();
    self._prevNav = self._createPrevNav();
    self._titleBar = self._createTitleBar();

    self._selector.appendChild(self._whiteOverlay);
    self._selector.appendChild(self._blackOverlay);
    self._selector.appendChild(self._nextNav);
    self._selector.appendChild(self._prevNav);
    self._selector.appendChild(self._titleBar);

};

/**
* Creates next photo nav
* @private
*/
LightBoxManager.prototype._createNextNav = function () {
    var self = this;
    if (self._nextNav) {
        return;
    }
    var nextNav = self._document.createElement('div');
    nextNav.className = 'next_arrow';
    nextNav.onclick = self._navToNextPhoto.bind(this);
    return nextNav;
};

/**
* Creates previous photo nav
* @private
*/
LightBoxManager.prototype._createPrevNav = function () {
    var self = this;
    if (self._prevNav) {
        return;
    }
    var prevNav = self._document.createElement('div');
    prevNav.className = 'prev_arrow';
    prevNav.onclick = self._navToPrevPhoto.bind(this);
    return prevNav;
};

/**
* Creates title bar
* @private
*/
LightBoxManager.prototype._createTitleBar = function () {
    var self = this;
    if (self._titleBar) {
        return;
    }
    var titleBar = self._document.createElement('div');
    titleBar.className = 'title_bar';

    return titleBar;
};

/**
* Creates white overlay
* @private
*/
LightBoxManager.prototype._createWhiteOverlay = function () {
    var self = this;
    if (self._whiteOverlay) {
        return;
    }
    var whiteOverylay = self._document.createElement('div');
    whiteOverylay.className = 'white_content';

    return whiteOverylay;
};

/**
* Creates black overlay
* @private
*/
LightBoxManager.prototype._createBlackOverlay = function () {
    var self = this;
    if (self._blackOverlay) {
        return;
    }
    var blackOverlay = self._document.createElement('div');
    blackOverlay.className = 'black_overlay';

    return blackOverlay;
};

/**
* Navigate to next photo
* @private
*/
LightBoxManager.prototype._navToNextPhoto = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var event = args[0];

    event.preventDefault();
    event.stopPropagation();

    if (self._currentViewingImageIndex < 0) {
        return;
    }
    var linkNode = self._viewManager._imageViewData[++self._currentViewingImageIndex];
    self.render(linkNode);
};

/**
* Navigate to prev photo
* @private
*/
LightBoxManager.prototype._navToPrevPhoto = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var event = args[0];

    event.preventDefault();
    event.stopPropagation();

    if (self._currentViewingImageIndex < 0) {
        return;
    }
    if (self._currentViewingImageIndex - 1 < 0) {
        hidePrevNav
        return;
    }
    var linkNode = self._viewManager._imageViewData[--self._currentViewingImageIndex];
    self.render(linkNode);
};

/**
* Detach current photo in the lightbox
* @private
*/
LightBoxManager.prototype._detachImageFromLightBox = function () {
    var self = this;
    var child = self._whiteOverlay.firstChild;
    if (child) {
        self._whiteOverlay.removeChild(child);
    }
};

/**
* Enable prev and next photo navigation
* @private
*/
LightBoxManager.prototype._enableNavigation = function () {
    var self = this;

    if (self._currentViewingImageIndex === 0) {
        self._prevNav.style.display = 'none';
    } else {
        self._prevNav.style.display = 'block';
    }

    if (self._currentViewingImageIndex ===
        self._viewManager._imageViewData.length - 1) {
        self._nextNav.style.display = 'none';
    } else {
        self._nextNav.style.display = 'block';
    }
};

/**
* Render detailed photo in lightbox
* @param {HTMLElement} linkNode
* @public
*/
LightBoxManager.prototype.render = function (linkNode) {
    var self = this;
    if (!self._selector.children[0] || !linkNode) {
        return;
    }

    self._detachImageFromLightBox();
    var img;

    if (linkNode.firstChild) {
        self._currentViewingImageIndex = parseInt(linkNode.firstChild.getAttribute('data-index'));
    }

    if (self._lightBoxImageMap[self._currentViewingImageIndex]) {
        // we've already visited this image before, just append it, no creation and fetching
        img = self._lightBoxImageMap[self._currentViewingImageIndex];
        self._whiteOverlay.appendChild(img);
        self._turnOnLightBox(img);
        return;
    }

    img = self._document.createElement('img');
    img.src = linkNode.href;
    img.alt = linkNode.firstChild ? linkNode.firstChild.alt : '';

    img.onload = self._imgOnLoadCallBack.bind(self, img);
    self._viewManager.showLoadingBar();
    // save img node to map, so we don't have to fetch again if user clicks on the same image
    self._lightBoxImageMap[self._currentViewingImageIndex] = img;
    self._whiteOverlay.appendChild(img);
};

/**
* Enable and adjust lightbox once the image is downloaded
* @param {HTMLElement} imgNode
* @private
*/
LightBoxManager.prototype._turnOnLightBox = function (imgNode) {
    var self = this;
    // adjust the size on whiteOverlay
    self._whiteOverlay.setAttribute('style', 'top: 50%; left: 50%; width: ' + imgNode.width +
                              '; height: ' + imgNode.height + '; margin-top: ' +
                              (-parseInt(imgNode.height / 2) + window.scrollY) + '; margin-left: ' +
                              -parseInt(imgNode.width / 2) + '; opacity: 1;');

    self._titleBar.setAttribute('style', 'top: 50%; left: 50%; width: ' + imgNode.width +
                              '; height: ' + 20 + '; margin-top: ' +
                              (-parseInt(imgNode.height / 2) + window.scrollY + imgNode.height) + '; margin-left: ' +
                              -parseInt(imgNode.width / 2) + ';');
    // set the title
    self._titleBar.innerHTML = imgNode.alt;
    self._blackOverlay.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._nextNav.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._prevNav.setAttribute('style', 'margin-top: ' + scrollY + ';');
    self._viewManager.hideLoadingBar();
    // turn on both whiteOverlay and blackOverlay
    self._whiteOverlay.style.display = 'block';
    self._blackOverlay.style.display = 'block';
    self._enableNavigation();
    self._titleBar.style.display = 'block';
    // lock the scroll
    self._document.body.style.overflow = 'hidden';
}

/**
* Remove lightbox effect
* @param {HTMLElement} imgNode
* @private
*/
LightBoxManager.prototype._turnOffLightBox = function () {
    var self = this;
    // enable the scroll
    self._document.body.style.overflow = 'auto';
    // turn off both whiteOverlay and blackOverlay
    self._whiteOverlay.style.display = 'none';
    self._blackOverlay.style.display = 'none';
    self._nextNav.style.display = 'none';
    self._prevNav.style.display = 'none';
    self._titleBar.style.display = 'none';
    self.detachImageFromLightBox();
}

/**
* Turn on the light box once image finished loading
* @public
*/
LightBoxManager.prototype._imgOnLoadCallBack = function () {
    var self = this;

    var args = Array.prototype.slice.call(arguments);
    var imgNode = args[0];

    if (imgNode.complete || imgNode.height && imgNode.height > 0) {
        self._turnOnLightBox(imgNode);
        self._blackOverlay.onclick = self._turnOffLightBox.bind(this);
    }
};

/**
* Destroy cached image view data
* @public
*/
LightBoxManager.prototype.destroyLightBoxImageMap = function () {
    var self = this;
    self._lightBoxImageMap = {};
};

module.exports = LightBoxManager;
