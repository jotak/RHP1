/// <reference path="../typings/globals/mocha/index.d.ts" />
import ExPart1 from '../main';

describe('ExPart1', () => {
    describe('#status', () => {
        it('should get starting status', () => {
            var status: String = ExPart1.status();
            if (status !== 'Starting exercise!') {
                throw new Error('Expecting "Starting exercise!" but got "' + status + '"');
            }
        });
    });
});
