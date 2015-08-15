/**
 * Created by Jackey Li on 2015/8/14.
 */
/*
 * angular performance detect
 * detect watcher / scope / isolate scope for your angular
 * 
 * (c) 2015.08.14 Jackey Li
 * License MIT
 */

(function (angular) {
    'use strict';

    /**
     * @ngdoc directive
     * @name performance.detect:showWatcherScope
     * @element div
     * @function
     *
     * @description
     * get the watchers / scope / isolateScope count for your angular app
     *
     * knowledge keys:
     * angular.element(element).data() : you can get the scope in current dom
     * angular.element(element).data().$isolateScope : get the isolateScope
     * angular.element(element).data().$scope : get the scope
     * angular.element(element).data().$scope.$$watchers : get the scope's watchers
     *
     *
     * @example
     <div data-show-watcher-scope></div>
     */
    angular.module('performance.detect', []).directive('showWatcherScope',
        ['$timeout', function ($timeout) {
            return {
                restrict: 'AE',
                scope: {},
                template: '<div>watcherCount:{{result.watcherCount}} | scopeCount:{{result.scopeCount}} | iSolateScopeCount:{{result.iScopeCount}}</div>',
                link: function ($scope) {

                    //result
                    $scope.result = {
                        watcherCount: 0,
                        scopeCount: 0,
                        iScopeCount: 0
                    };

                    //mark scopeType
                    var scopeType = {
                        scope: 'scope',
                        isolateScope: 'iScope'
                    };

                    //store scopeIds
                    var scopeIds = {};

                    /*
                     * get watcher / scope / iscope count
                     */
                    function getCount() {
                        var watcherCount = 0,
                            scopeCount = 0,
                            iScopeCount = 0,
                            scopeIds = {};

                        /*
                         * loop dom from body
                         */
                        function loopDom(element) {
                            if (!element.length) {
                                return watcherCount;
                            }

                            var scope = element.data(),
                                iSolateWatchers = filterScopeWatchers(scope.$isolateScope, scopeType.isolateScope),
                                scopeWatchers = filterScopeWatchers(scope.$scope, scopeType.scope),
                                watcher = scopeWatchers.concat(iSolateWatchers);
                            watcherCount += watcher.length;

                            angular.forEach(element.children(), function (child) {
                                loopDom(angular.element(child));
                            });
                        }

                        /*
                         * use hash table to filter the scope and get the watchers
                         */
                        function filterScopeWatchers(scope, type) {
                            if (!scope || scopeIds[scope.$id]) {
                                return [];
                            }

                            scopeIds[scope.$id] = true;
                            if (type === scopeType.isolateScope) {
                                iScopeCount++;
                            } else {
                                scopeCount++;
                            }
                            return scope.$$watchers || [];
                        }

                        //begin loop
                        loopDom(angular.element('body'));

                        return {
                            watcherCount: watcherCount,
                            scopeCount: scopeCount,
                            iScopeCount: iScopeCount
                        }

                    }

                    //after the digest, get the result
                    $timeout(function () {
                        $scope.result = getCount();
                    });

                }
            };
        }]);

})(angular);