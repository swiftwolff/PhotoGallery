/* globals document */
'use strict';
var LightBoxManager = require('./lightbox-manager');

function ViewManager (context, selector) {
    var self = this;

    self._document = window.document;
    self._context = context;
    self._imageViewData = [];
    self._imageDetailData = [];
    self._selector = selector;
    self._viewElement = null;
    self._loadingBar = self.createLoadingBar();
    self._selector.appendChild(self._loadingBar);
    self._lightboxManager = new LightBoxManager(selector, self);
}

ViewManager.prototype.createLoadingBar = function () {
    var self = this;
    if (self._loadingBar) {
        return;
    }
    var loadingBar = self._document.createElement('div');
    loadingBar.id = 'loading';

    return loadingBar;
};

ViewManager.prototype.showLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'block';
    self._loadingBar.style.marginTop = window.scrollY;
};

ViewManager.prototype.hideLoadingBar = function () {
    var self = this;
    self._loadingBar.style.display = 'none';
};

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
        var linkNode = document.createElement('a');
        linkNode.href = newData[i].imageSrc;
        linkNode.onclick = self.createDetailImage.bind(self, linkNode);
        var img = document.createElement('img');
        img.src = newData[i].thumbSrc;
        img.alt = newData[i].title;
        img.className = 'thumbnail';
        img.setAttribute('data-index', i + startIndex);
        linkNode.appendChild(img);
        self._imageViewData.push(linkNode);
    }
    self.renderGallery(startIndex);
};

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

ViewManager.prototype.createViewElement = function () {
    var self = this;
    var divNode = document.createElement('div');
    divNode.className = 'gallery';
    self._viewElement = divNode;
    self._selector.appendChild(divNode);
};

ViewManager.prototype.clearImageView = function () {
    var self = this;
    if (self._viewElement) {
        self._viewElement.remove();
        self._viewElement = null;
        self._imageViewData = [];
        self._lightboxManager.destroyLightBoxImageMap();
    }
};

ViewManager.prototype.renderGallery = function (startIndex) {
    var self = this;
    if (!self._viewElement) {
        self.createViewElement();
    }
    for (var i = startIndex; i < self._imageViewData.length; i++) {
        self._viewElement.appendChild(self._imageViewData[i]);
    }
};

module.exports = ViewManager;
