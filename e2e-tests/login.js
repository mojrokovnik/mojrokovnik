'use strict';

describe('mojrokovnik', function () {

    it('can login with default credentials', function () {
        browser.get('#/login');

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('admin');
        element(by.id('login-btn')).click();

        browser.sleep(5000);

        expect(browser.getLocationAbsUrl()).toMatch("/clients");
    });

});
