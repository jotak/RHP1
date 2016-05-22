"use strict";
/// <reference path="../typings/globals/mocha/index.d.ts" />
var main_1 = require('../main');
describe('ExPart1', function () {
    describe('#status', function () {
        it('should get starting status', function () {
            var status = main_1["default"].status();
            if (status !== 'Starting exercise!') {
                throw new Error('Expecting "Starting exercise!" but got "' + status + '"');
            }
        });
    });
});
