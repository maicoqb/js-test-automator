const babel = require("babel-core");

const code = `
const myModule = require('path/to/my/module');
`;

const requires = [];

const setupPlugin = (callbacks) => () => {
    return {
        visitor: {
            CallExpression({node}) {
                if (node.callee.name === 'require') {
                    const [{value: path}] = node.arguments;
                    callbacks.require(path);
                }
            }
        }
    }
};

const transform = code => {
    // const requires = [];
    //
    // const plugin = () => {
    //     const callbacks = {
    //         require: (path) => {
    //             requires.push(path);
    //         }
    //     };
    //
    //     return setupPlugin(callbacks);
    // };
    //
    // const ast = babel.transform(code, {
    //     plugins: [plugin],
    // });

    const template = `
    describe('...', () => {
        beforeEach(() => {
            mock('path/to/my/module');
        });
    });
    `;

    return(babel.transform(template));
};

module.exports.createFromCode = (code) => {
    return transform(code);
};