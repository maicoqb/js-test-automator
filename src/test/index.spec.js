const {assert} = require('chai');
const compare = require('ast-compare');

const testAutomator = require('../main/index');

function expandObject(object) {
    const isArray = Array.isArray(object);
    const isObject = object === Object(object);
    if (!isArray && !isObject) {
        return object;
    }

    const result = Array.isArray(object) ? [] : {};
    for(const key of Object.keys(object)) {
        if (!key.includes('.')) {
            result[key] = expandObject(object[key]);
            continue;
        }

        // 'a.b.c' => 'd'
        // 'a' => { 'b.c' => 'd' }
        const [firstKey, ...others] = key.split('.');
        const innerKey = others.join('.');
        const expandedObject = expandObject({
            [innerKey]: object[key]
        });

        if (Number.isInteger(Number(firstKey))) {
            const arr = new Array(Number(firstKey));
            arr.splice(Number(firstKey), 0, expandedObject);
            return arr;
        }

        result[firstKey] = expandedObject;
    }
    return result;
}

describe('expandObject', () => {
    it('deve manter o objeto igual se nada mudar', () => {
        const object = {
            a: '123',
            b: [123],
            c: {
                d: 'e'
            }
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, object);
    });

    it('deve manter um array se o objeto for array', () => {
        const object = [{
            a: '123',
            b: [123],
            c: {
                d: 'e'
            }
        }];
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, object);
    });

    it('deve transformar dot.notation em objeto profundo', () => {
        const object = {
            a: '123',
            'b.c.d': "e",
        };
        const expected = {
            a: '123',
            b: {
                c: {
                    d: "e"
                }
            }
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, expected);
    });

    it('deve transformar os índices profundos com dot.notation também', () => {
        const object = {
            a: '123',
            b: {
                c: {
                    'd.e.f': 'g'
                }
            }
        };
        const expected = {
            a: '123',
            b: {
                c: {
                    d: {
                        e: {
                            f: 'g'
                        }
                    }
                }
            }
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, expected);
    });

    it('deve transformar índices em chaves de array', () => {
        const object = {
            a: '123',
            'b.0.e': "f",
        };
        const expected = {
            a: '123',
            b: [
                {e: 'f'}
            ]
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, expected);
    });

    it('deve transformar .. em chaves de array', () => {
        const object = {
            a: '123',
            'b..e': "f",
        };
        const expected = {
            a: '123',
            b: [
                {e: 'f'}
            ]
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, expected);
    });

    it('deve transformar o índice na posicão correta do array', () => {
        const object = {
            a: '123',
            'b.2.e': "f",
        };
        const expected = {
            a: '123',
            b: (() => {
                const arr = new Array(2);
                arr.splice(2, 0, {e: 'f'});
                return arr;
            })()
        };
        const result = expandObject(JSON.parse(JSON.stringify(object)));
        assert.deepEqual(result, expected);
    });
});

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

        const {ast:{program:{body}}} = testAutomator.createFromCode(code);

        const expected = [
            {
                expression: {
                    'callee.name': "describe",
                    'arguments..body.body..expression': {
                        'callee.name': "beforeEach",
                        'arguments..body.body..expression': {
                            'callee.name': "mock",
                            'arguments..value': "path/to/my/module"
                        }
                    }
                }
            }
        ];

        assert.strictEqual(compare(body, expandObject(expected)), true, "deve conter a árvore de describe");
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

        assert.fail(null, null, "not implemented");
    });
});
