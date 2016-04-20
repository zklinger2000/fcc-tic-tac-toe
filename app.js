// app.js
angular.module('ticTacToeApp', [])
// Add lodash for use in controllers, unit tests
.constant('_', window._)
// Add lodash for use in views, ng-repeat="x in _.range(3)"
.run(function ($rootScope) {
  $rootScope._ = window._;
})
// Main Controller
.controller('MainController', function($scope, TicTacToe) {
  var vm = this;

  vm.ticTacToe = TicTacToe;
  
})
.service('TicTacToe', function() {
  this.gameBoard = [];
  
  // Reset method
  this.reset = function() {
    var newBoard = new Array(3);
    for (var i = 0; i < 3; i++) {
      newBoard[i] = new Array(3);
      for (var j = 0; j < 3; j++) {
        newBoard[i][j] = {
          row: i,
          col: j,
          token: ''
        };
      }
    }
    this.gameBoard = newBoard;
    console.log(this.gameBoard);
  }
  
  this.reset();
  
});