'use strict';
const {assert} = require('chai');
const rewire = require('rewire');

const {transform} = require('babel-core');

const {astContains} = rewire('./astContains');

describe('astContains', () => {
    it('deve conter códigos iguais', () => {
        const code = `
        let a = 0
        `;

        assert.ok(astContains(code, code), 'se o código comparado for igual, deve conter o código');
    });

    it('deve conter código contido no original', () => {
        const smallCode = `
        function_a();
        `;

        const bigCode = `
        function function_b() {
        ${smallCode}
        }
        `;

        // FIXME, não está passando
        assert.ok(astContains(bigCode, smallCode), 'se o código comparado for igual, deve conter o código');
    });

    describe('_sanitizeAst', () => {
        let _sanitizeAst;
        beforeEach(() => {
            const astContains = rewire('./astContains');
            _sanitizeAst = astContains.__get__('sanitizeAst');
        });

        it('deve limpar o main corretamente', () => {
            const code = `
            function_a();
            `;
            const {ast} = transform(code);

            const result = _sanitizeAst(ast);

            assert.notProperty(result, 'start', 'deve limpar o campo `start` do resultado');
            assert.notProperty(result, 'end', 'deve limpar o campo `end` do resultado');
            assert.notProperty(result, 'loc', 'deve limpar o campo `loc` do resultado');
            assert.notProperty(result, 'tokens', 'deve limpar o campo `tokens` do resultado');
            assert.property(result, 'program', 'não deve limpar o campo `program` do resultado');
        });

        it('deve limpar o programa corretamente', () => {
            const code = `
            function_a();
            `;
            const {ast} = transform(code);

            const {program} = _sanitizeAst(ast);

            assert.notProperty(program, 'start', 'deve limpar o campo `start` do resultado');
            assert.notProperty(program, 'end', 'deve limpar o campo `end` do resultado');
            assert.notProperty(program, 'loc', 'deve limpar o campo `loc` do resultado');
            assert.notProperty(program, 'tokens', 'deve limpar o campo `tokens` do resultado');
            assert.notProperty(program, 'sourceType', 'deve limpar o campo `sourceType` do resultado');
            assert.property(program, 'body', 'não deve limpar o campo `body` do resultado');
        });

        it('deve limpar o body corretamente', () => {
            const code = `
            function_a();
            `;
            const {ast} = transform(code);

            const {program: {body:[expression]}} = _sanitizeAst(ast);

            assert.notProperty(expression, 'start', 'deve limpar o campo `start` do resultado');
            assert.notProperty(expression, 'end', 'deve limpar o campo `end` do resultado');
            assert.notProperty(expression, 'loc', 'deve limpar o campo `loc` do resultado');
            assert.notProperty(expression, 'tokens', 'deve limpar o campo `tokens` do resultado');
            assert.notProperty(expression, 'sourceType', 'deve limpar o campo `sourceType` do resultado');
            assert.property(expression, 'expression', 'não deve limpar o campo `expression` do resultado');
        });


        it('deve limpar o body corretamente', () => {
            const code = `
            function_a();
            `;
            const {ast} = transform(code);

            const {program: {body:[expression]}} = _sanitizeAst(ast);

            assert.notProperty(expression, 'start', 'deve limpar o campo `start` do resultado');
            assert.notProperty(expression, 'end', 'deve limpar o campo `end` do resultado');
            assert.notProperty(expression, 'loc', 'deve limpar o campo `loc` do resultado');
            assert.notProperty(expression, 'tokens', 'deve limpar o campo `tokens` do resultado');
            assert.notProperty(expression, 'sourceType', 'deve limpar o campo `sourceType` do resultado');
            assert.property(expression, 'expression', 'não deve limpar o campo `expression` do resultado');
        });
    });
});
