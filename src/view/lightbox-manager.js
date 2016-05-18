/* globals window */
/* globals document */
'use strict';

function LightBoxManager (selector) {
    var self = this;

    self.DETAIL_PRELOAD_NUM = 5;
    self._selector = selector;
    self._document = window.document;
    self._whiteOverlay = null;
    self._blackOverlay = null;
    self._nextNav = null;
    self._prevNav = null;
    self._titleBar = null;
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

    return nextNav;
};

LightBoxManager.prototype.createPrevNav = function () {
    var self = this;
    if (self._prevNav) {
        return;
    }
    var prevNav = self._document.createElement('div');
    prevNav.className = 'prev_arrow';

    return prevNav;
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

LightBoxManager.prototype.render = function (linkNode) {
    var self = this;
    if (!self._selector.children[0] || !linkNode) {
        return;
    }

    var img = self._document.createElement('img');
    img.src = linkNode.href;
    // set the image title
    if (linkNode.firstChild) {
        img.alt = linkNode.firstChild.alt;
    }
    img.onload = self.imgOnLoadCallBack.bind(self, img);

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
    // turn on both whiteOverlay and blackOverlay
    self._whiteOverlay.style.display = 'block';
    self._blackOverlay.style.display = 'block';
    self._nextNav.style.display = 'block';
    self._prevNav.style.display = 'block';
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
    while (self._whiteOverlay.firstChild) {
        self._whiteOverlay.removeChild(self._whiteOverlay.firstChild);
    }
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

module.exports = LightBoxManager;
