'use strict';
var APIS = require('./api/api');

/**
* API manager will iterate the current 'installed' apis. (Strategy Design Pattern)
* The 'installed' api classes are required to implement two methods
* (1) search (2) imageDataGenerator.  This makes it easy to add multiple
* vendors' API in the future
* @param {PhotoGalleryMediator} mediator
* @public
* @class
*/
function APIManager (mediator) {
    var self = this;
    self._apis = [];
    self._apis.push(new APIS.FlickrAPI());
    self._mediator = mediator;
}
/**
* Fetch meta data of photos from the image api
* @param {string} keyword
* @public
*/
APIManager.prototype.search = function (keyword) {
    var self = this;
    self._apis.forEach(function (api) {
        var reqObj = api.search(keyword);
        var url = self._mediator._loadManager.buildUrl(api._url, reqObj);
        console.log(url);
        self._mediator._loadManager.load(url, api.imageDataGenerator);
    });
};

module.exports = APIManager;