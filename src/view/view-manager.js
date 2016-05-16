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

ViewManager.prototype.append = function (data) {
    var self = this;
    if (!data && !data.length) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var imgNode = document.createElement('img');
        imgNode.src = data[i].thumbSrc;
        imgNode.alt = data[i].title;
        imgNode.style.margin = '5px';
        self._imageViewData.push(imgNode);
    }
    self.render();
};

ViewManager.prototype.createViewElement = function () {
    var self = this;
    var divNode = document.createElement('div');
    divNode.class = 'gallery';
    self._viewElement = divNode;
    self._selector.appendChild(divNode);
};

module.exports = ViewManager;
