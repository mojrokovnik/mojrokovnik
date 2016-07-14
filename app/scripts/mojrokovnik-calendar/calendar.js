'use strict';

calendarTemplate.$inject = ['api'];
function calendarTemplate(api) {
    return {
        controller: calendarCtrl,
        link: function (scope, element, attr, ctrl) {

            /*
             * Fetch calendar events
             * and initialize calendar
             *
             * @param {Object} events
             * @return {Function} initializeCalendar
             */
            api('calendars').fetch().then(function (events) {
                var filterEvents = [];
                angular.forEach(events, function (item) {
                    filterEvents.push({
                        title: item.calendar_name + ' - ' + item.calendar_comment,
                        start: item.calendar_startDate,
                        end: item.calendar_endDate,
                        data: item
                    });
                });

                return initializeCalendar(filterEvents);
            });

            /*
             * Function for creating new event
             *
             * @param {moment} start
             * @param {moment} end
             */
            scope.createEvent = function (event) {
                var eventData = {
                    title: event.calendar_name + ' - ' + event.calendar_comment,
                    start: event.calendar_startDate,
                    end: event.calendar_endDate,
                    data: event
                };
                element.fullCalendar('renderEvent', eventData, true);
                element.fullCalendar('unselect');
            };

            /*
             * Function for initializing calendar
             * with events preloaded
             *
             * @param {Object} events
             */
            function initializeCalendar(events) {
                element.fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    height: angular.element('body').height(),
                    firstDay: 1,
                    lang: 'sr',
                    scrollTime: '08:00:00',
                    defaultView: 'agendaWeek',
                    slotDuration: '00:15:00',
                    timezone: 'UTC',
                    selectable: true,
                    editable: true,
                    eventLimit: true,
                    events: events,
                    select: function (startDate, endDate) {
                        scope.showDialog(startDate, endDate);
                    },
                    eventClick: function(event) {
                        scope.showDialog(event.start, event.end, event.data);
                        console.log(event.data);
                    },
                    eventDrop: function(event) {
                        scope.showDialog(event.start, event.end, event.data);
                    },
                    eventResize: function(event) {
                        scope.showDialog(event.start, event.end, event.data);
                    }
                });
            }

        }
    };
}


calendarCtrl.$inject = ['$scope', '$q', '$uibModal', 'api'];
function calendarCtrl($scope, $q, $uibModal, api) {

    /*
     * Triggering modal for adding new event to calendar
     *
     * @param {moment} startDate
     * @param {moment} endDate
     */
    $scope.showDialog = function (startDate, endDate, data) {

        if (data) {
            $scope.calendar = data;
            $scope.calendar.calendar_startDate = startDate;
            $scope.calendar.calendar_endDate = endDate;
            $scope.calendar.calendar_duration = (moment(endDate) - moment(startDate)) / 60000;

        } else {
            $scope.calendar = {
                calendar_startDate: startDate,
                calendar_endDate: endDate,
                calendar_duration: (moment(endDate) - moment(startDate)) / 60000
            };
        }

        $uibModal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'scripts/mojrokovnik-calendar/calendar-dialog.html',
            controller: calendarDialogCtrl
        });

        // Default types for 'type' field
        $scope.types = [
            {value: 1, name: 'Ročište'},
            {value: 2, name: 'Obaveza'}
        ];

        // Return clients list
        var clients = api('clients').fetch();

        // Return cases list
        var cases = api('cases').fetch();

        $q.all([clients, cases]).then(function (values) {
            $scope.clients = values[0];
            $scope.cases = values[1];
        });
    };

    /*
     * Calendar Dialog Controller
     * Controls saving data to database
     */
    function calendarDialogCtrl($uibModalInstance) {
        /*
         * Saving event to database
         * @param {object} calendar
         */
        $scope.save = function (calendar) {
            calendar.calendar_startDate = calendar.calendar_startDate._d;
            calendar.calendar_endDate = moment(calendar.calendar_startDate).add(calendar.calendar_duration, 'm')._d;
            calendar = _.omit(calendar, 'calendar_duration');

            if (calendar.calendar_id) {
                api('calendars').update(calendar).then(function () {
                    $uibModalInstance.close();
                });

            } else {
                api('calendars').add(calendar).then(function (data) {
                    calendar.calendar_id = data.id;
                    $scope.createEvent(calendar);
                    $uibModalInstance.close();
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
}


angular.module('mojrokovnik.calendar', ['ngMaterial', 'ui.bootstrap'])
        .controller('calendarCtrl', calendarCtrl)
        .directive('calendarTemplate', calendarTemplate);