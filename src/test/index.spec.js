'use strict';
const {assert} = require('chai');

const testAutomator = require('../main/index');
const {astContains} = require('./utils/astContains');

describe('index', () => {

    it('...', () => {
        const code = `
        const myModule = require('path/to/my/module');
        `;

        const expectedCode = `
        describe('...', () => {
            beforeEach(() => {
                mock('path/to/my/module');
            });
        });
        `;

        const result = testAutomator.createFromCode(code);

        const expected = [
            {
                expression: {
                    'callee.name': 'describe',
                    'arguments..body.body..expression': {
                        'callee.name': 'beforeEach',
                        'arguments..body.body..expression': {
                            'callee.name': 'mock',
                            'arguments..value': 'path/to/my/module'
                        }
                    }
                }
            }
        ];

        assert.ok(astContains(result.code, expectedCode), "o código retornado deve conter o describe básico");
    });

    it.skip('final expectation', () => {
        const code = `
        const myModule = require('path/to/my/module');
        const otherModule = require('../other/module');
        const { exportedFunction } = require('module');
        `;
        const path = 'main/blah/implementationModule.js';
        const testPath = 'test';

        const expectedResult = `
        describe('implementationModule', () => {
            let implementationModule;

            beforeEach(() => {
                mock('path/to/my/module');
                mock('../../main/other/module');
                mock('module', { exportedFunction: null });

                implementationModule = rewire('../../main/blah/implementationModule');
            });
        });
        `;

        assert.fail(null, null, 'not implemented');
    });
});
