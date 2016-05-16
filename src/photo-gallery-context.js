'use strict';

var APIManager = require('./service/api-manager');
var LoadManager = require('./service/load-manager');
var DataManager = require('./model/data-manager');
var ViewManager = require('./view/view-manager');

function PhotoGalleryContext (selector) {
    var self = this;
    self._apiManager = new APIManager(self);
    self._dataManager = new DataManager(self);
    self._viewManager = new ViewManager(self, selector);
    self._loadManager = new LoadManager(self);
}

PhotoGalleryContext.prototype.search = function (keyword) {
    var self = this;
    self._apiManager.search(keyword);
};

module.exports = PhotoGalleryContext;