/* global moment, _ */
'use strict';

calendarCtrl.$inject = ['$scope', 'modalDialog', 'calendar', 'cases', 'clients'];
function calendarCtrl($scope, modalDialog, calendar, cases, clients) {
    var modal;
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
                cases: item.cases,
                client: item.client_legal || item.client_individual || '',
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
        defaultTimedEventDuration: '00:15:00',
        eventClick: function (event) {
            $scope.previewCalendar(getItem(event, true));
        },
        eventResize: function (event) {
            calendar.update(getItem(event));
        },
        eventDrop: function (event) {
            calendar.update(getItem(event));
        },
        select: function (start, end) {
            $scope.addCalendar({
                datetime: moment(start).format('DD-MM-YYYY HH:mm'),
                duration: end ? end.diff(start, 'minutes') : 0
            });
        }
    };

    $scope.previewCalendar = function (calendar) {
        var params = {
            scope: $scope,
            templateUrl: 'assets/templates/calendar-dialog.html'
        };

        $scope._edit = false;
        $scope._preview = true;
        $scope._calendar = calendar;

        modal = modalDialog.showModal(params);

        $scope.cancel = function () {
            delete $scope._calendar;
            modal.close();
        };
    };

    $scope.addCalendar = function (event, subject) {
        var params = {
            scope: $scope,
            templateUrl: 'assets/templates/calendar-dialog.html'
        };

        updateClients();
        updateCases();

        $scope._edit = false;
        $scope._preview = false;
        delete $scope._calendar;

        if (event) {
            $scope._calendar = event;
        }

        if (subject && subject.element) {
            $scope._calendar = {
                type: 'Ročište',
                cases: subject
            };
        } else if (subject) {
            $scope._calendar = {
                type: 'Obaveza',
                client: subject
            };
        }

        modal = modalDialog.showModal(params);

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
            templateUrl: 'assets/templates/calendar-dialog.html'
        };

        updateClients();
        updateCases();

        if (calendars.datetime) {
            calendars.datetime = moment(calendars.datetime).format('DD-MM-YYYY HH:mm');
        }

        $scope._edit = true;
        $scope._calendar = calendars;

        $scope._preview ?
                $scope._preview = false :
                modal = modalDialog.showModal(params);

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
            modalDialog.showConfirmation('Da li ste sigurni da želite da obrišete obavezu?').then(function () {
                return calendar.remove(_calendar).then(function () {
                    modal.close();
                });
            });
        };
    };

    function getItem(event, parse) {
        return {
            id: event.id,
            type: event.type,
            name: event.name,
            datetime: parse ? event.start : event.start.format('DD-MM-YYYY HH:mm'),
            duration: event.end ? event.end.diff(event.start, 'minutes') : 0,
            comment: event.comment,
            cases: event.cases,
            client: event.client,
            active: event.active
        };
    }

    $scope.$on('calendars:updated', updateCalendars);
}

angular.module('mojrokovnik.calendar')
        .controller('calendarCtrl', calendarCtrl);
