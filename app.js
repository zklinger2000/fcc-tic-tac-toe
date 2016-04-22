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
  this._playerToken = '';
  this.turnToken = 'X';
  this.gameBoard = [];
  this.winState = false;
  
  // Reset method
  this.reset = function() {
    var newBoard = new Array(3);
    for (var i = 0; i < 3; i++) {
      newBoard[i] = new Array(3);
      for (var j = 0; j < 3; j++) {
        newBoard[i][j] = {
          col: i,
          row: j,
          token: ''
        };
      }
    }
    this.gameBoard = newBoard;
    console.log(this.gameBoard);
  }
  
  // Set Player token
  this.setPlayerToken = function(token) {
    this._playerToken = token || 'X';
    // Set computer to opposite token
    if (this._playerToken === 'O') {
      this._computerToken = 'X';
      // Set first move
      this.gameBoard[0][0].token = 'X';
    } else {
      this._computerToken = 'O';
    }
  }
  
  // Click listener for picking a square
  this.pickSquare = function(square) {
    var row = square.row;
    var col = square.col;
    var token = square.token;
    // Check for empty player token
    if (this._playerToken === '') {
      alert('First choose X\'s or O\'s!');
      return;
    }
    // Check if square is empty
    if (token === '') {
      // Set token
      square.token = this._playerToken;
    } else {
      alert('it is has an "' + square.token + '" there already!');
      return;
    }
    // Check for win
    this.winState = checkResults(this.gameBoard, this._playerToken);
    console.log('winState: ' + this.winState);
    // If no winner, call next player's turn (computer)
    if (!this.winState) {
      computerTurn(this);
    }
    // if it's a win, add to score of turn token
  }
  
  // PRIVATE METHODS

  // Check for 2 in a row
  function twoInRowCheck(array, obj, computerToken, playerToken) {
    array.forEach(function(row, index) {
      var tokenCount = row.reduce(function(acc, square) {
        return acc + (square.token === (playerToken || computerToken) ? 1 : 0);
      }, 0);
      if (!obj.chosen && tokenCount === 2) {
        row.forEach(function(square) {
          if (square.token === '') {
            square.token = computerToken;
            obj.chosen = true;
          }
        });
      }
    });
  }

  // Check for 2 in a row
  function twoInDiagCheck(array, obj, computerToken, playerToken) {
    var tokenCount = array.reduce(function(acc, square) {
      return acc + (square.token === (playerToken || computerToken) ? 1 : 0);
    }, 0);
    if (!obj.chosen && tokenCount === 2) {
      array.forEach(function(square) {
        if (square.token === '') {
          square.token = computerToken;
          obj.chosen = true;
        }
      });
    }
  }

  // Play any remaining middle side
  function playSides(sides, obj, computerToken) {
    for (var i = 0; i < 4; i++) {
      if (!obj.chosen && sides[i].token === '') {
        sides[i].token = computerToken;
        obj.chosen = true;
      }
    }
  }

  // Fork attempt
  function fork(array, obj, computerToken, playerToken) {
    if (!obj.chosen && (array[0].token === computerToken) &&
        (array[1].token === playerToken) &&
        (array[2].token === '')) {
      array[2].token = computerToken;
      obj.chosen = true;
    } else if (!obj.chosen && (array[2].token === computerToken) &&
               (array[1].token === playerToken) &&
               (array[0].token === '')) {
      array[0].token = computerToken;
      obj.chosen = true;
    }
  }

  // Block an opponent fork
  function blockFork(array, obj, sides, computerToken, playerToken) {
    if (!obj.chosen && (array[0].token === playerToken) &&
        (array[1].token === computerToken) &&
        (array[2].token === playerToken)) {
      playSides(sides, obj, computerToken);
    } else if (!obj.chosen && (array[2].token === playerToken) &&
               (array[1].token === computerToken) &&
               (array[0].token === playerToken)) {
      playSides(sides, obj, computerToken);
    }
  }
  
  // Check for win
  function checkResults(board, token) {
    var win = false;
    var rows = _.zip.apply(this, board);
    // Check if any row contains all the same token
    for (var j = 0; j < 3; j++) {
      if (!win) {
        win = rows[j].every(function(square) {
          return square.token === token;
        });
      }
    }
    // Check if any column contains all the same token
    for (var i = 0; i < 3; i++) {
      if (!win) {
        win = board[i].every(function(square) {
          return square.token === token;
        });
      }
    }
    // Check for diagonal wins
    if (!win) {
      win = board[0][0].token === token &&
            board[1][1].token === token &&
            board[2][2].token === token;
    }
    if (!win) {
      win = board[0][2].token === token &&
            board[1][1].token === token &&
            board[2][0].token === token;
    }
    return win;
  }
  
  // Computer's turn
  function computerTurn(obj) {
    var computerToken = obj._playerToken === 'X' ? 'O' : 'X';
    var rows = _.zip.apply(this, obj.gameBoard);
    var diag1 = [obj.gameBoard[0][0], obj.gameBoard[1][1], obj.gameBoard[2][2]];
    var diag2 = [obj.gameBoard[0][2], obj.gameBoard[1][1], obj.gameBoard[2][0]];
    var sides = [obj.gameBoard[0][1], obj.gameBoard[1][0], obj.gameBoard[1][2], obj.gameBoard[2][1]];
    var corners = [obj.gameBoard[0][0], obj.gameBoard[0][2], obj.gameBoard[2][2], obj.gameBoard[2][0]];
    
    // Set move choice made state
    obj.chosen = false;
    // Find out which next move for player is best and take it

    // If comp has 2 in a single row, play the remaining square
    twoInRowCheck(rows, obj, computerToken);
    // If comp has 2 in a single column, play the remaining square
    twoInRowCheck(obj.gameBoard, obj, computerToken);
    // Block any opponent 2 in a row
    twoInRowCheck(rows, obj, computerToken, obj._playerToken);
    // Block any opponent 2 in a column
    twoInRowCheck(obj.gameBoard, obj, computerToken, obj._playerToken);
    // Block any opponent 2 in diag1
    twoInDiagCheck(diag1, obj, computerToken, obj._playerToken);
    // Block any opponent 2 in diag2
    twoInDiagCheck(diag2, obj, computerToken, obj._playerToken);
    // Fork attempt
    fork(diag1, obj, computerToken, obj._playerToken);
    fork(diag2, obj, computerToken, obj._playerToken);
    // Block an opponent fork
    blockFork(diag1, obj, sides, computerToken, obj._playerToken);
    blockFork(diag2, obj, sides, computerToken, obj._playerToken);
    // Play center square
    if (!obj.chosen && obj.gameBoard[1][1].token === '') {
      obj.gameBoard[1][1].token = computerToken;
      obj.chosen = true;
    }
    // Play an opposite corner
    for (var k = 0; k < 4; k++) {
      if (!obj.chosen && corners[k].token === obj._playerToken && corners[(k < 2 ? k + 2 : k - 2)].token === '') {
        corners[(k < 2 ? k + 2 : k - 2)].token = computerToken;
        obj.chosen = true;
      }
    }
    // Play any empty corner
    for (var j = 0; j < 4; j++) {
      if (!obj.chosen && corners[j].token === '') {
        corners[j].token = computerToken;
        obj.chosen = true;
      }
    }
    // Play any remaining middle side
    playSides(sides, obj, computerToken);
    // Check for win
    obj.winState = checkResults(obj.gameBoard, computerToken);
    //TODO: Update scoreboard
    var full = false;
    if (obj.winState) {
      // Add +1 to winner
    } else if (!obj.winState && full)
    console.log('winState: ' + obj.winState);
  }
  
  // INITIALIZATION
  //
  // Create a new game
  this.reset();
  
});