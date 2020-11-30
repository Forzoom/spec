const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;

const extensions = [ '.ts', '.js' ];

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/spec-manager.esm.js',
            format: 'esm',
        },
        // 将部分依赖作为外置内容
        external: [ 'core-js' ],
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/spec-manager.cjs.js',
            format: 'cjs',
        },
        external: [ 'core-js' ],
        plugins: [
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                extensions,
            }),
        ],
    },
];