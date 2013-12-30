var Player = function(config) {
  return {
    name: config.name
  }
}

var Game = function(config) {

  var game
  , teams
  ;

  var simpleReduce = function(arr) {
    return arr.reduce(function(prev,curr){
      return prev + curr;
    },0);
  }

  game = {
    side: 'away',
    outs: 0,
    bases: [null,null,null,null],
    batting: 0,
    inning: 1,
    count: {
      balls: 0,
      strikes: 0
    }
  };

  scoreboard = {
    away: [],
    home: []
  }

  var recordPitch = function(pitch) {
    var pitch = pitch || {};
    if(pitch.strike) {
      game.count.strikes++;
      if(game.count.strikes == 3) {
        recordOut();
      }
    } else {
      game.count.balls++;
      if(game.count.balls == 4) {
        walk();
      }
    }
  }

  var recordOut = function() {
    game.outs++;
    game.count = {
      balls: 0,
      strikes: 0
    }
    if(game.outs == 3) {
      game.bases = [null,null,null,null];
      game.outs = 0;
      if(game.side == 'away') {
        game.side = 'home';
      } else {
        game.side == 'away';
        game.inning++;
      }
    }
  }

  teams = {
    home: {
      players: [
        new Player({
          name: 'home 1'
        }),
        new Player({
          name: 'home 2'
        }),
        new Player({
          name: 'home 3'
        }),
        new Player({
          name: 'home 4'
        }),
        new Player({
          name: 'home 5'
        }),
        new Player({
          name: 'home 6'
        }),
        new Player({
          name: 'home 7'
        }),
        new Player({
          name: 'home 8'
        }),
        new Player({
          name: 'home 9'
        })
      ]
    },
    away: {
      players: [
        new Player({
          name: 'away 1'
        }),
        new Player({
          name: 'away 2'
        }),
        new Player({
          name: 'away 3'
        }),
        new Player({
          name: 'away 4'
        }),
        new Player({
          name: 'away 5'
        }),
        new Player({
          name: 'away 6'
        }),
        new Player({
          name: 'away 7'
        }),
        new Player({
          name: 'away 8'
        }),
        new Player({
          name: 'away 9'
        })
      ]
    }
  }

  currentBatter = function (){
    return teams[game.side].players[0];
  }()

  return {
    batter: function () {
      return teams[game.side].players[game.batting];
    }(),
    bases: function () {
      return game.bases;
    }(),
    count: function () {
      return game.count;
    }(),
    outs: function () {
      return game.outs;
    }(),
    scoreboard: {
      away: function () {
        return scoreboard.away;
      }(),
      home: function () {
        return scoreboard.home;
      }()
    },
    pitch: function(pitch) {
      recordPitch(pitch);
    }
  }

}
