'use strict';

var imageDataModel = require('./imageDataModel');

/**
* Data manager saves current fetched api data
* in form of imageDataModel
* @param {PhotoGalleryMediator} mediator
* @class
*/
function DataManager (mediator) {
    var self = this;
    self._imageData = [];
    self._mediator = mediator;
    self._startImageDataIndex = 0;
}

/**
* Add new data into current data array
* @param {object} resp - response object
* @param {appendCallback} callback - A callback to build image data
* @public
*/
DataManager.prototype.append = function (resp, cb) {
    var self = this;
    var imageData = cb(resp, imageDataModel);

    for (var i = 0; i < imageData.length; i++) {
        self._imageData.push(imageData[i]);
    }
    self._mediator._viewManager.append(self._imageData, self._startImageDataIndex);
    self._startImageDataIndex = self._imageData.length;
};

/**
* Clear image data array and reset the starting image index
* @public
*/
DataManager.prototype.destroy = function () {
    var self = this;
    self._imageData = [];
    self._startImageDataIndex = 0;
};

module.exports = DataManager;
