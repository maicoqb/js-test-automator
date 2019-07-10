'use strict';
const {assert} = require('chai');

const {expandObject} = require("./expandObject");

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
