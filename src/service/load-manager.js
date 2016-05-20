/* global window */
'use strict';

/**
* Load manager calls api endpoint with xhr
* @param {PhotoGalleryMediator} mediator
* @class
*/
function LoadManager (mediator) {
    var self = this;
    self._mediator = mediator;
    self._xhr = new window.XMLHttpRequest();
}

/**
* Makes api call
* @param {string} url
* @param {loadCallback} callback - A callback to build image data
* @public
*/
LoadManager.prototype.load = function (url, cb) {
    var self = this;
    self._xhr.onreadystatechange = function () {
        if (self._xhr.status && self._xhr.status < 200 || self._xhr.status >= 300) {
            self._mediator._viewManager.showWarning('No data available!', 2);
        }
        if (self._xhr.status && self._xhr.readyState == 4 && self._xhr.status == 200) {
            var respObj = JSON.parse(self._xhr.responseText);
            self._mediator._dataManager.append(respObj, cb);
            self._mediator._viewManager.hideLoadingBar();
        }
    };
    self._xhr.open('GET', url, true);
    self._xhr.send();
    self._mediator._viewManager.showLoadingBar();
};

/**
* Builds api end point
* @param {string} url
* @param {object} parameters - request parameters object
* @public
*/
LoadManager.prototype.buildUrl = function (url, parameters) {
    var qs = '';
    for (var key in parameters) {
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1);
        url = url + '?' + qs;
    }
    return url;
};

/**
* Destroy LoadManager
* @public
*/
LoadManager.prototype.destroy = function () {
    var self = this;
    self._mediator = null;
    self._xhr = null;
};

module.exports = LoadManager;
