/* global window */
'use strict';

function LoadManager (context) {
    var self = this;
    self._context = context;
    self._xhr = new window.XMLHttpRequest();
}
LoadManager.prototype.load = function (url, cb) {
    var self = this;
    self._xhr.onreadystatechange = function () {
        if (self._xhr.readyState == 4 && self._xhr.status == 200) {
            var respObj = JSON.parse(self._xhr.responseText);
            self._context._dataManager.append(respObj, cb);
        }
    };
    self._xhr.open('GET', url, true);
    self._xhr.send();
};

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

module.exports = LoadManager;