'use strict';

var imageDataModel = require('./imageDataModel');

function DataManager (context) {
    var self = this;
    self._imageData = [];
    self._context = context;
    self._startImageDataIndex = 0;
}

DataManager.prototype.append = function (resp, cb) {
    var self = this;
    var imageData = cb(resp, imageDataModel);
    // we cannot replace it here, we have to add one by one
    // bc there might be multiple calls, if we replace
    // it will be wiped out
    for (var i = 0; i < imageData.length; i++) {
        self._imageData.push(imageData[i]);
    }
    self._context._viewManager.append(self._imageData, self._startImageDataIndex);
    self._startImageDataIndex = self._imageData.length;
};

DataManager.prototype.clearImageData = function () {
    var self = this;
    self._imageData = [];
    self._startImageDataIndex = 0;
};

DataManager.prototype.numPerPage = function () {
    console.log('searching');
};

DataManager.prototype.nextPage = function () {
    console.log('nextBatch');
};

module.exports = DataManager;
