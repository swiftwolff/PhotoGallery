'use strict';

global.window = new MockWindow();
var Mocks = require('./mocks');

function MockWindow () {
    var self = this;
    self.document = {
        createElement: function (name) {
            return new Mocks.MockHTMLElement();
        },
        createDocumentFragment: function () {
            return new Mocks.MockHTMLElement();
        },
        setTimeout: function () {}
    }
    self.scrollY = 0;
}