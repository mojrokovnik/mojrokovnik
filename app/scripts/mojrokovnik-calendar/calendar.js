'use strict';

calendarCtrl.$inject = ['$scope', 'modalDialog', 'calendar', 'cases', 'clients'];
function calendarCtrl($scope, modalDialog, calendar, cases, clients) {
    $scope.types = ['Ročište', 'Obaveza'];
    $scope.calendars = [];

    function updateCalendars() {
        var data = calendar.getCalendars();
        $scope.calendars.length = 0;

        angular.forEach(data, function (item) {
            $scope.calendars.push({
                id: item.id,
                type: item.type,
                name: item.name,
                title: '[' + item.type + '] ' + item.name,
                start: moment(item.datetime),
                end: moment(item.datetime).add(item.duration, 'minutes'),
                comment: item.comment,
                color: item.type === 'Obaveza' ? '#ffad46' : '#f83a22',
                stick: true,
                active: item.active
            });
        });

        $scope.eventSources = [$scope.calendars];
    }

    function updateClients() {
        $scope.clients = clients.getClients('individuals').concat(clients.getClients('legals'));
    }

    function updateCases() {
        $scope.cases = cases.getCases();
    }

    updateCalendars();
    updateClients();
    updateCases();

    // Initialize Calendar
    $scope.calendarOptions = {
        height: angular.element('body').height() - 20,
        customButtons: {
            newItem: {
                text: 'Dodaj obavezu',
                click: function () {
                    $scope.addCalendar();
                }
            }
        },
        header: {
            left: 'newItem',
            center: 'title, prev,next',
            right: 'month,agendaWeek,agendaDay,today'
        },
        firstDay: 1,
        lang: 'sr',
        scrollTime: '08:00:00',
        defaultView: 'agendaWeek',
        slotDuration: '00:15:00',
        selectable: true,
        editable: true,
        eventLimit: true,
        theme: true,
        eventClick: function (event) {
            $scope.editCalendar(getItem(event, true));
        },
        eventResize: function (event) {
            calendar.update(getItem(event));
        },
        eventDrop: function (event) {
            calendar.update(getItem(event));
        },
        select: function (start, end) {
            $scope.editCalendar({
                datetime: start._d,
                duration: end ? end.diff(start, 'minutes') : 0
            });
        }
    };

    $scope.addCalendar = function () {
        var params = {
            scope: $scope,
            templateUrl: 'assets/templates/calendar-dialog.html'
        };

        updateClients();
        updateCases();

        $scope.editMode = false;
        delete $scope._calendar;

        var modal = modalDialog.showModal(params);

        $scope.save = function (_calendar) {
            calendar.add(_calendar).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope._calendar;
            modal.close();
        };
    };

    $scope.editCalendar = function (calendars) {
        var params = {
            scope: $scope,
            size: 'lg',
            templateUrl: 'assets/templates/calendar-dialog.html'
        };

        updateClients();
        updateCases();

        $scope.editMode = true;
        $scope._calendar = calendars;

        var modal = modalDialog.showModal(params);

        $scope.save = function (_calendar) {
            calendar.update(_calendar).then(function () {
                modal.close();
            });
        };

        $scope.cancel = function () {
            delete $scope._calendar;
            modal.close();
        };

        $scope.remove = function (_calendar) {
            calendar.remove(_calendar).then(function () {
                modal.close();
            });
        };
    };

    $scope.parseClient = function (client) {
        if (client.company_name) {
            return $scope._calendar.client_legal = client.id;
        }

        return $scope._calendar.client_individual = client.id;
    };

    function getItem(event, parse) {
        return {
            id: event.id,
            type: event.type,
            name: event.name,
            datetime: parse ? event.start : event.start.format('DD-MM-YYYY HH:mm'),
            duration: event.end ? event.end.diff(event.start, 'minutes') : 0,
            comment: event.comment,
            active: event.active
        };
    }

    $scope.$on('calendars:updated', updateCalendars);
}

calendarService.$inject = ['$rootScope', 'api'];
function calendarService($rootScope, api) {
    console.warn('Calendar Service initialized');

    var self = this;

    this.calendars = [];

    this.getCalendars = function () {
        var filteredList = _.where(self.calendars, {active: 1});

        return _.sortBy(filteredList, 'id');
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

    this.add = function (calendar) {
        return api('calendars').add(calendar).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.calendars.push(res.calendar);

            $rootScope.$broadcast('calendars:updated');
        });
    };

    this.update = function (calendar) {
        return api('calendars').update(calendar).then(function (res) {
            if (res.status !== 200) {
                return false;
            }

            self.calendars = _.reject(self.calendars, {id: calendar.id});
            self.calendars.push(res.calendar);

            $rootScope.$broadcast('calendars:updated', self.calendars);
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

    // Fetch clients on service initialization
    this.fetch();
}

angular.module('mojrokovnik.calendar', [
    'ngMaterial',
    'ui.bootstrap',
    'ui.calendar'
])
        .service('calendar', calendarService)
        .controller('calendarCtrl', calendarCtrl);