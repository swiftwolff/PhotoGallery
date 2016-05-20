/* globals document */
'use strict';
var LightBoxManager = require('./lightbox-manager');

/**
* View manager is in charge of building and rendering
* view in dom level
* @param {PhotoGalleryMediator} mediator
* @param {HTMLElement} selector
* @class
*/
function ViewManager (mediator, selector) {
    var self = this;

    self._document = window.document;
    self._mediator = mediator;
    self._imageViewData = [];
    self._imageDetailData = [];
    self._selector = selector;
    self._viewElement = null;
    self._fragment = null;
    self._loadingBar = self.createLoadingBar();
    self._warningDiv = self.createWarningDiv();
    self._selector.appendChild(self._loadingBar);
    self._selector.appendChild(self._warningDiv);
    self._lightboxManager = new LightBoxManager(selector, self);
}

/**
* Make loading bar
* @public
*/
ViewManager.prototype.createLoadingBar = function () {
    var self = this;
    if (self._loadingBar) {
        return;
    }
    var loadingBar = self._document.createElement('div');
    loadingBar.id = 'loading';

    return loadingBar;
};

/**
* Make loading bar
* @public
*/
ViewManager.prototype.createWarningDiv = function () {
    var self = this;
    if (self._warningDiv) {
        return;
    }
    var warningDiv = self._document.createElement('div');
    warningDiv.id = 'warning';

    return warningDiv;
};

/**
* Shows loading bar
* @public
*/
ViewManager.prototype.showLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'block';
    self._loadingBar.style.marginTop = window.scrollY;
};

/**
* Hides loading bar
* @public
*/
ViewManager.prototype.hideLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'none';
};

/**
* Create image view and render gallery
* @param {object} data - image data
* @param {number} startIndex - start index of the image data
* @public
*/
ViewManager.prototype.append = function (data, startIndex) {
    var self = this;
    if (!data && !data.length) {
        return;
    }
    var newData = data.slice(startIndex);
    for (var i = 0; i < newData.length; i++) {
        if (!newData[i].imageSrc || !newData[i].imageSrc.length) {
            continue;
        }
        var linkNode = self._document.createElement('a');
        linkNode.href = newData[i].imageSrc;
        linkNode.onclick = self.createDetailImage.bind(self, linkNode);
        var img = self._document.createElement('img');
        img.src = newData[i].thumbSrc;
        img.alt = newData[i].title;
        img.className = 'thumbnail';
        img.setAttribute('data-index', i + startIndex);
        linkNode.appendChild(img);
        self._imageViewData.push(linkNode);
    }
    self.renderGallery(startIndex);
};

/**
* Creates detailed image view
* @public
*/
ViewManager.prototype.createDetailImage = function () {
    var self = this;

    var args = Array.prototype.slice.call(arguments);
    var linkNode = args[0];
    var event = args[1];

    event.preventDefault();
    event.stopPropagation();

    if (!linkNode.href || !linkNode.href.length) {
        return;
    }
    // render the view in lightbox
    self._lightboxManager.render(linkNode);
};

/**
* Creates view element that will contain gallery of photos
* @public
*/
ViewManager.prototype.createViewElement = function () {
    var self = this;
    var divNode = self._document.createElement('div');
    divNode.className = 'gallery';
    self._viewElement = divNode;
    self._selector.appendChild(divNode);
};

/**
* Destroy gallery of photos and lightbox cached photos
* @public
*/
ViewManager.prototype.clearImageView = function () {
    var self = this;
    if (self._viewElement) {
        // remove all the children
        while (self._viewElement.firstChild) {
            self._viewElement.removeChild(self._viewElement.firstChild);
        }
        self._viewElement = null;
        self._imageViewData = [];
        self._lightboxManager.destroyLightBoxImageMap();
    }
};

/**
* Render gallery of photos
* @public
*/
ViewManager.prototype.renderGallery = function (startIndex) {
    var self = this;
    if (!self._viewElement) {
        self.createViewElement();
    }
    self._fragment = self._document.createDocumentFragment();
    for (var i = startIndex; i < self._imageViewData.length; i++) {
        self._fragment.appendChild(self._imageViewData[i]);
    }
    self._viewElement.appendChild(self._fragment);
};

/**
* Show warning message for a period of time
* @param {string} description - description of the warning
* @param {duration} duration - duration of the warning in sec
* @private
*/
ViewManager.prototype.showWarning = function (description, sec) {
    var self = this;
    self._warningDiv.innerHTML = description;
    self._warningDiv.style.display = 'block';
    self._warningDiv.style.marginTop = window.scrollY;
    var callback = function () {
        self._hideWarning();
    };
    setTimeout(callback, sec * 1000);
};

/**
* Hide warning message
* @private
*/
ViewManager.prototype._hideWarning = function () {
    var self = this;
    self._warningDiv.style.display = 'none';
};

/**
* Destroy View Manager
* @private
*/
ViewManager.prototype.destroy = function () {
    var self = this;
    self._selector.removeChild(self._loadingBar);
    self._selector.removeChild(self._warningDiv);
    if (self._viewElement) {
        self._selector.removeChild(self._viewElement);
    }
    self.clearImageView();
    self._lightboxManager.destroy();
    self._document = null;
    self._mediator = null;
    self._imageViewData = null;
    self._imageDetailData = null;
    self._selector = null;
    self._viewElement = null;
    self._loadingBar = null;
    self._warningDiv = null;
    self._lightboxManager = null;
    self._fragment = null;
};

module.exports = ViewManager;
