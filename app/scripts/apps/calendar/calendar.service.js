/* global moment, _ */
'use strict';

calendarService.$inject = ['$rootScope', 'api'];
function calendarService($rootScope, api) {
    var self = this;

    this.calendars = [];

    this.getCalendars = function () {
        var filteredList = _.where(self.calendars, {active: 1});

        return _.sortBy(filteredList, 'id');
    };

    this.getCalendarsByClient = function (type, id) {
        var list = self.getCalendars();
        type = type.slice(0, -1);

        var filteredList = _.filter(list, function (obj) {
            return obj['client_' + type] &&
                    obj['client_' + type].id === id &&
                    moment(obj.datetime).isAfter(moment());
        });

        return _.sortBy(filteredList, 'datetime');
    };

    this.getCalendarsByCase = function (id) {
        var list = self.getCalendars();

        var filteredList = _.filter(list, function (obj) {
            return obj.cases && obj.cases.id === id &&
                    moment(obj.datetime).isAfter(moment());
        });

        return _.sortBy(filteredList, 'datetime');
    };

    this.fetch = function () {
        return api('calendars').fetch().then(function (calendars) {
            if (!calendars) {
                return false;
            }

            self.calendars = calendars;
            $rootScope.$broadcast('calendars:updated');
        });
    };

    this.add = function (_calendar) {
        _calendar.client ?
                (_calendar.client.company_name ? _calendar.client_legal = _calendar.client.id : _calendar.client_individual = _calendar.client.id) :
                _calendar.cases = _calendar.cases.id;

        return api('calendars').add(_calendar).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.calendars.push(res.calendar);

            $rootScope.$broadcast('calendars:updated');
        });
    };

    this.update = function (_calendar) {
        _calendar.client ?
                (_calendar.client.company_name ? _calendar.client_legal = _calendar.client.id : _calendar.client_individual = _calendar.client.id) :
                _calendar.cases = _calendar.cases.id;

        return api('calendars').update(_calendar).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.calendars = _.reject(self.calendars, {id: _calendar.id});
            self.calendars.push(res.calendar);

            $rootScope.$broadcast('calendars:updated');
        });
    };

    this.remove = function (calendar) {
        return api('calendars').delete(calendar).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.calendars = _.reject(self.calendars, {id: calendar.id});

            $rootScope.$broadcast('calendars:updated');
        });
    };

    // Fetch calendars on service initialization
    this.fetch();
}

angular.module('mojrokovnik.calendar',
        ['ngMaterial', 'ui.bootstrap'])
        .service('calendar', calendarService);
