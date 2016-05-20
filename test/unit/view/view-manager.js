/*globals window*/
'use strict';

require('../globals');
var test = require('tape');
var proxyquire = require('proxyquire');
var Mocks = require('../mocks');
var ViewManager = require('../../../src/view/view-manager');

var stub = {
    './lightbox-manager': Mocks.MockLightBoxManager
}
var ViewManager = proxyquire('../../../src/view/view-manager.js', stub);

test('[ViewManager][Constructor]', function (t) {
    t.plan(2);
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    mockSelector.appendChild = function () {
        t.pass('append child to selector elem');
    }
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    t.end();
});

test('[ViewManager][createLoadingBar]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    var loadingBar = viewManager.createLoadingBar();
    console.log(loadingBar);
    t.equal(viewManager._loadingBar.id, 'loading', 'loadingBar created');
    t.end();
});

test('[ViewManager][createWarningDiv]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    var warningDiv = viewManager.createWarningDiv();
    t.equal(viewManager._warningDiv.id, 'warning', 'warningDiv created');
    t.end();
});

test('[ViewManager][showLoadingBar]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._loadingBar = { style: {} };
    viewManager.showLoadingBar();
    t.equal(viewManager._loadingBar.style.display, 'block', 'showing loading bar');
    t.equal(viewManager._loadingBar.style.marginTop, 0, 'adjust to scrolling height');
    t.end();
});

test('[ViewManager][hideLoadingBar]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._loadingBar = { style: {} };
    viewManager.hideLoadingBar();
    t.equal(viewManager._loadingBar.style.display, 'none', 'hiding loading bar');
    t.end();
});

test('[ViewManager][append]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager.renderGallery = function () {
        t.pass('rendering Gallery');
    }
    var data = [{imageSrc:[1]}, {imageSrc:[1]}, {imageSrc:[1]}];
    viewManager.append(data, 0);
    t.equal(viewManager._imageViewData.length, 3, 'create correct number of image view data');
    t.end();
});

test('[ViewManager][createDetailImage]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    var event = {
        preventDefault: function () {},
        stopPropagation: function () {}
    };
    var linkNode = { href:'abc.com' };
    viewManager._lightboxManager.render = function () {
        t.pass('render detail view in ligth box');
    }
    viewManager.createDetailImage(linkNode, event);
    t.end();
});

test('[ViewManager][createViewElement]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    mockSelector.appendChild = function () {
        t.pass('append gallery div into selector node');
    }
    viewManager.createViewElement();
    t.end();
});

test('[ViewManager][clearImageView]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._viewElement = 'test';
    viewManager._imageViewData = [1,2,3];
    viewManager._lightboxManager.destroyLightBoxImageMap = function () {
        t.pass('calling lightbox manager destroyLightBoxImageMap method');
    }
    viewManager.clearImageView();
    t.equal(viewManager._viewElement, null, 'cleared viewElement');
    t.equal(viewManager._imageViewData.length, 0, 'cleaned imageViewData');
    t.end();
});

test('[ViewManager][renderGallery]', function (t) {
    t.plan(1);
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._viewElement = new Mocks.MockHTMLElement();
    viewManager._fragment = new Mocks.MockHTMLElement();
    viewManager._imageViewData = [1, 2, 3];
    viewManager._viewElement.appendChild = function () {
        t.pass('appending fragment');
    }
    viewManager.renderGallery(0);
    t.end();
});

test('[ViewManager][showWarning]', function (t) {
    t.plan(3);
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._warningDiv = {style: {}};
    viewManager.showWarning('abc');
    t.equal(viewManager._warningDiv.innerHTML, 'abc', 'showing correct description');
    t.equal(viewManager._warningDiv.style.display, 'block', 'showing warning');
    t.equal(viewManager._warningDiv.style.marginTop, 0, 'adjust to scrolling height');
    t.end();
});

test('[ViewManager][_hideWarning]', function (t) {
    t.plan(1);
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._warningDiv = {style: {}};
    viewManager._hideWarning('abc');
    t.equal(viewManager._warningDiv.style.display, 'none', 'hiding warning');
    t.end();
});

test('[ViewManager][destroy]', function (t) {
    var mockSelector = new Mocks.MockHTMLElement();
    var mockPhotoGalleryMediator = new Mocks.MockPhotoGalleryMediator();
    var viewManager = new ViewManager(mockPhotoGalleryMediator, mockSelector);
    viewManager._lightboxManager.destroy = function () {
        t.pass('calling lightbox manager destroy method');
    }
    viewManager.destroy();
    t.equal(viewManager._viewElement, null, 'cleared viewElement');
    t.equal(viewManager._imageViewData, null, 'cleaned imageViewData');
    t.equal(viewManager._document, null, 'cleared document');
    t.equal(viewManager._mediator, null, 'cleared mediator');
    t.equal(viewManager._imageDetailData, null, 'cleared imageDetailData');
    t.equal(viewManager._selector, null, 'cleared selector');
    t.equal(viewManager._loadingBar, null, 'cleared loadingBar');
    t.equal(viewManager._warningDiv, null, 'cleared warningDiv');
    t.equal(viewManager._lightboxManager, null, 'cleared lightbox manager');
    t.equal(viewManager._fragment, null, 'cleared fragment');
    t.end();
});
