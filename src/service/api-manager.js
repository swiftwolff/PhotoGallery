'use strict';
var APIS = require('./api/api');

function APIManager (context) {
    var self = this;
    self._apis = [];
    self._apis.push(new APIS.FlickrAPI());
    self._context = context;
}

APIManager.prototype.search = function (keyword) {
    var self = this;
    console.log('searching');
    self._apis.forEach(function (api) {
        var reqObj = api.search(keyword);
        var url = self._context._loadManager.buildUrl(api._url, reqObj);
        self._context._loadManager.load(url, api.imageDataGenerator);
    });
};

APIManager.prototype.numPerPage = function () {
    console.log('searching');
};

APIManager.prototype.nextPage = function () {
    console.log('nextBatch');
};

module.exports = APIManager;