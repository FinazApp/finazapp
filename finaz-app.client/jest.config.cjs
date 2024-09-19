/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'jsdom',
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = config;
