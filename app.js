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
  
  // Computer's turn
  function computerTurn(obj) {
    var computerToken = obj._playerToken === 'X' ? 'O' : 'X';
    var rows = _.zip.apply(this, obj.gameBoard);
    var diag1 = [obj.gameBoard[0][0], obj.gameBoard[1][1], obj.gameBoard[2][2]];
    var diag2 = [obj.gameBoard[0][2], obj.gameBoard[1][1], obj.gameBoard[2][0]];
    var nextMoveRanks = [];

    // Find out which next move for player is best and take it
    
    // Reduce both diagonals into their number of player tokens
    // diag1
    nextMoveRanks.push(diag1.reduce(function(acc, square) {
      return acc + (square.token === obj._playerToken ? 1 : 0);
    }, 0));
    // diag2
    nextMoveRanks.push(diag2.reduce(function(acc, square) {
      return acc + (square.token === obj._playerToken ? 1 : 0);
    }, 0));
    // Reduce each row into its number of player tokens
    console.log(rows);
    rows.forEach(function(row) {
      nextMoveRanks.push(row.reduce(function(acc, square) {
        return acc + (square.token === obj._playerToken ? 1 : 0);
      }, 0));
    });
    // Reduce each column into its number of player tokens
    obj.gameBoard.forEach(function(col) {
      nextMoveRanks.push(col.reduce(function(acc, square) {
        return acc + (square.token === obj._playerToken ? 1 : 0);
      }, 0));
    });
    // Take highest ranked move and block
    console.log(computerToken);
    console.log(nextMoveRanks);
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
    // Check for diagnol wins
    if (!win) {
      win = board[0][0].token === token && board[1][1].token === token && board[2][2].token === token;
    }
    if (!win) {
      win = board[0][2].token === token && board[1][1].token === token && board[2][0].token === token;
    }
    return win;
  }
  
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
    console.log(token);
    this._playerToken = token || 'X';
    // Set computer to opposite token
//    this._computerToken = this._playerToken === 'X' ? 'O' : 'X';
    console.log(this._computerToken);
    if (this._playerToken === 'O') {
      this._computerToken = 'X';
      // Set first move
      this.gameBoard[1][1].token = 'X';
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
      console.error('no player token set!');
      return;
    }
    // Check if square is empty
    if (token === '') {
      console.info('it is EMPTY!');
      // Set token
      square.token = this._playerToken;
    } else {
      console.error('it is has a "' + square.token + '" there');
      return;
    }
    // Check for win
    this.winState = checkResults(this.gameBoard, this._playerToken);
    console.log(this.winState);
    // If no winner, call next player's turn (computer)
    if (!this.winState) {
      computerTurn(this);
    }
    // if it's a win, add to score of turn token
  }
  
  // Create a new game
  this.reset();
  
});