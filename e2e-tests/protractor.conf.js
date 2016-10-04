exports.config = {
    plugins: [{
        package: 'protractor-console',
        logLevels: ['severe']
    }],
    allScriptsTimeout: 20000,
    specs: [
        '*.js'
    ],
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://localhost:8100/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
