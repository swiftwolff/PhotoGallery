/* globals window */
/* globals document */
'use strict';

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

LightBoxManager.prototype.init = function () {
    var self = this;
    self._whiteOverlay = self.createWhiteOverlay();
    self._blackOverlay = self.createBlackOverlay();
    self._nextNav = self.createNextNav();
    self._prevNav = self.createPrevNav();
    self._titleBar = self.createTitleBar();

    self._selector.appendChild(self._whiteOverlay);
    self._selector.appendChild(self._blackOverlay);
    self._selector.appendChild(self._nextNav);
    self._selector.appendChild(self._prevNav);
    self._selector.appendChild(self._titleBar);

};

LightBoxManager.prototype.createNextNav = function () {
    var self = this;
    if (self._nextNav) {
        return;
    }
    var nextNav = self._document.createElement('div');
    nextNav.className = 'next_arrow';
    nextNav.onclick = self.navToNextPhoto.bind(this);
    return nextNav;
};

LightBoxManager.prototype.createPrevNav = function () {
    var self = this;
    if (self._prevNav) {
        return;
    }
    var prevNav = self._document.createElement('div');
    prevNav.className = 'prev_arrow';
    prevNav.onclick = self.navToPrevPhoto.bind(this);
    return prevNav;
};

LightBoxManager.prototype.navToNextPhoto = function () {
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

LightBoxManager.prototype.navToPrevPhoto = function () {
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

LightBoxManager.prototype.createTitleBar = function () {
    var self = this;
    if (self._titleBar) {
        return;
    }
    var titleBar = self._document.createElement('div');
    titleBar.className = 'title_bar';

    return titleBar;
};

LightBoxManager.prototype.createWhiteOverlay = function () {
    var self = this;
    if (self._whiteOverlay) {
        return;
    }
    var whiteOverylay = self._document.createElement('div');
    whiteOverylay.className = 'white_content';

    return whiteOverylay;
};

LightBoxManager.prototype.createBlackOverlay = function () {
    var self = this;
    if (self._blackOverlay) {
        return;
    }
    var blackOverlay = self._document.createElement('div');
    blackOverlay.className = 'black_overlay';

    return blackOverlay;
};

LightBoxManager.prototype.detachImageFromLightBox = function () {
    var self = this;
    var child = self._whiteOverlay.firstChild;
    if (child) {
        self._whiteOverlay.removeChild(child);
    }
};

LightBoxManager.prototype.enableNavigation = function () {
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

LightBoxManager.prototype.render = function (linkNode) {
    var self = this;
    if (!self._selector.children[0] || !linkNode) {
        return;
    }

    self.detachImageFromLightBox();
    var img;

    if (linkNode.firstChild) {
        self._currentViewingImageIndex = parseInt(linkNode.firstChild.getAttribute('data-index'));
    }

    if (self._lightBoxImageMap[self._currentViewingImageIndex]) {
        // we've already visited this image before, just append it, no creation and fetching
        img = self._lightBoxImageMap[self._currentViewingImageIndex];
        self._whiteOverlay.appendChild(img);
        self.turnOnLightBox(img);
        return;
    }

    img = self._document.createElement('img');
    img.src = linkNode.href;
    img.alt = linkNode.firstChild ? linkNode.firstChild.alt : '';

    img.onload = self.imgOnLoadCallBack.bind(self, img);
    self._viewManager.showLoadingBar();
    // save img node to map, so we don't have to fetch again if user clicks on the same image
    self._lightBoxImageMap[self._currentViewingImageIndex] = img;
    self._whiteOverlay.appendChild(img);
};

LightBoxManager.prototype.turnOnLightBox = function (imgNode) {
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
    self.enableNavigation();
    self._titleBar.style.display = 'block';
    // lock the scroll
    self._document.body.style.overflow = 'hidden';
}

LightBoxManager.prototype.turnOffLightBox = function () {
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

LightBoxManager.prototype.imgOnLoadCallBack = function () {
    var self = this;

    var args = Array.prototype.slice.call(arguments);
    var imgNode = args[0];

    if (imgNode.complete || imgNode.height && imgNode.height > 0) {
        self.turnOnLightBox(imgNode);
        self._blackOverlay.onclick = self.turnOffLightBox.bind(this);
    }
};

LightBoxManager.prototype.destroyLightBoxImageMap = function () {
    var self = this;
    self._lightBoxImageMap = {};
};

module.exports = LightBoxManager;
