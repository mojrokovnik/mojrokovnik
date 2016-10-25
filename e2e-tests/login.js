/* global browser, by, element, expect */

'use strict';

describe('mojrokovnik', function () {

    it('can login with default credentials', function () {
        browser.get('#/login');

        browser.sleep(5000);

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('admin');
        element(by.id('login-btn')).click();

        browser.sleep(5000);

        browser.manage().logs()
                .get('browser').then(function (browserLog) {
            console.log('log: ' +
                    require('util').inspect(browserLog));
        });

        expect(browser.getLocationAbsUrl()).toMatch("/clients");
    });

});
