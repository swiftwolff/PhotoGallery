/* globals document */
'use strict';

function ViewManager (context, selector) {
    var self = this;
    self._context = context;
    self._imageViewData = [];
    self._selector = selector;
    self._viewElement = null;
}

ViewManager.prototype.render = function () {
    var self = this;
    if (!self._viewElement) {
        self.createViewElement();
    }
    for (var i = 0; i < self._imageViewData.length; i++) {
        self._viewElement.appendChild(self._imageViewData[i]);
    }
};

ViewManager.prototype.append = function (data, startIndex) {
    var self = this;
    if (!data && !data.length) {
        return;
    }
    var newData = data.slice(startIndex);
    for (var i = 0; i < newData.length; i++) {
        var imgNode = document.createElement('img');
        imgNode.src = newData[i].thumbSrc;
        imgNode.alt = newData[i].title;
        self._imageViewData.push(imgNode);
    }
    self.render();
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
    }
};

module.exports = ViewManager;
