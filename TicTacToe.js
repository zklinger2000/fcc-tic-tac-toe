var TicTacToe = function() {
  this.gameBoard = [];
  
  
  
  this.reset();
};
// Set constructor type
TicTacToe.prototype.constructor = TicTacToe;
// Reset method
TicTacToe.prototype.reset = function() {
  var newBoard = Array(3);
  for (var i = 0; i < 3; i++) {
    
  }
  this.gameBoard = newBoard;
}

