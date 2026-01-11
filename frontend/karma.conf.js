// Karma configuration file for CI testing
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
    ],
    client: {
      jasmine: {
        random: false,
        stopSpecOnExpectationFailure: false,
      },
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcovonly' }],
    },
    junitReporter: {
      outputDir: require('path').join(__dirname, './test-results'),
      outputFile: 'junit.xml',
      useBrowserName: false,
      suite: 'frontend',
      nameFormatter: undefined,
      classNameFormatter: function (browser, result) {
        return 'frontend.' + (result.suite[0] || 'tests');
      },
      stdOut: true,
      stdErr: true,
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--js-flags=--max-old-space-size=4096',
        ],
      },
    },
    singleRun: true,
    restartOnFileChange: false,
    captureTimeout: 300000,
    browserDisconnectTimeout: 120000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
  });
};
