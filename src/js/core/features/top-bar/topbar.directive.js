angular.module('linuxDash').directive('topBar', ['$rootScope', function($rootScope) {
  return {
    scope: {
      heading: '=',
      refresh: '&',
      lastUpdated: '=',
      toggleVisibility: '&',
      isHidden: '=',
      toggleWidth: '&',
      isChart: '=',
      info: '=', // not being used; needs a good ui solution
    },
    template: '\
      <div class="top-bar"> \
        <span class="heading"> <i class="bi bi-list"></i> {{ heading }}</span> \
        \
        <button \
          class="ld-top-bar-btn minimize-btn" \
          ng-click="toggleVisibility()" \
          ng-class="{ active: isHidden }"><i class="bi bi-arrows-expand"></i></button> \
        \
        \
        <button class="ld-top-bar-btn width-toggle-btn" ng-if="toggleWidth && !isChart" ng-click="toggleWidth()"><i class="bi bi-arrows-expand-vertical"></i></button> \
        <button ng-if="!isChart && !isHidden" class="ld-top-bar-btn refresh-btn" ng-click="refresh()"><i class="bi bi-arrow-clockwise"></i></button> \
      </div> \
    ',
  }
}])
