'use strict';
const compare = require('ast-compare');
const {transform} = require('babel-core');

const keysWeDontWant = [
    'start',
    'end',
    'loc',
    'tokens',
    'sourceType',
];

function isObject(node) {
    return node === Object(node);
}

/**
 * Sanitize ast node
 *
 * Remove unwanted keys from our ast node
 * Used to simply ast comparision
 *
 * @param {*} node The node to sanitize
 * @returns {*} sanitizedNode The sanitized node
 */
function sanitizeAst(node) {
    // If node is neither array or object, there's no need to sanitize
    // just return the value
    if (!Array.isArray(node) && !isObject(node)) {
        return node;
    }

    // If node is an array, then we need to sanitize every item of it
    if (Array.isArray(node)) {
        return node.map(_node => sanitizeAst(_node));
    }

    // If node is an object, then now we will apply our sanitize
    return Object.keys(node).reduce((result, key) => {
        if (keysWeDontWant.includes(key)) {
            return result;
        }

        result[key] = sanitizeAst(node[key]);
        return result;
    }, {});
}

module.exports.astContains = (bigCode, smallCode) => {
    const {ast: {program: {body: bigCodeBody}}} = transform(bigCode);
    const {ast: {program: {body: smallCodeBody}}} = transform(smallCode);

    const cleanSmallCodeBody = sanitizeAst(smallCodeBody);

    return compare(bigCodeBody, cleanSmallCodeBody);
};

