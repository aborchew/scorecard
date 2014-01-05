var Player = function(config) {
  var config = config || {};
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
    count: {
      balls: 0,
      strikes: 0,
      outs: 0
    },
    status: {
      batter: {
        away: 0,
        home: 0
      },
      inning: 1,
      side: 'away',
      bases: [undefined,undefined,undefined],
    },
    scoreboard: {
      away: [0],
      home: [0]
    }
  };

  var recordPitch = function(pitch) {
    var pitch = pitch || {};
    if(pitch.strike && !pitch.hit && !pitch.out) {
      game.count.strikes++;
      if(game.count.strikes == 3) {
        recordOut();
      }
    } else if(!pitch.hit && !pitch.out) {
      game.count.balls++;
      if(game.count.balls == 4) {
        game.count.balls = 0;
        game.count.strikes = 0;
        advance(-1);
      }
    } else if(pitch.hit) {
      var i = 0;
      var bases = pitch.bases || 1;
      for(i;i<bases;i++) {
        advance(i-1);
      }
    } else if(pitch.out) {
      recordOut();
    }
  }

  var nextBatter = function() {
    if(game.status.batter[game.status.side] < teams[game.status.side].players.length - 1) {
      game.status.batter[game.status.side]++;
    } else {
      game.status.batter[game.status.side] = 0;
    }
  }

  var recordOut = function() {
    game.count.outs++;
    game.count.balls = 0,
    game.count.strikes = 0;
    if(game.count.outs == 3) {
      game.status.bases = [undefined,undefined,undefined];
      game.count.outs = 0;
      if(game.status.side == 'away') {
        game.status.side = 'home';
      } else {
        game.status.side = 'away';
        game.status.inning++;
      }
      game.scoreboard[game.status.side][game.status.inning] = 0;
    } else {
      nextBatter();
    };
  }

  var advance = function(rInd) {

    var rInd = rInd || -1;
    var _b = game.status.bases;
    var runner = _b[rInd] || currentBatter();

    var tryPush = function(b) {
      if(_b[b+1]) {
        tryPush(b+1);
        if(_b[b+2] != runner) {
          tryPush(b);
        };
      } else {
        if(_b[b]) {
          _b[b+1] = _b[b];
          _b[b] = undefined;
        } else {
          _b[b+1] = currentBatter();
          nextBatter();
        }
      }
      if(_b.length > 3) {
        score();
      }
    };

    tryPush(rInd);

  }

  var score = function() {
    console.log(game.status.bases.splice(3,1));
    game.scoreboard[game.status.side][game.status.inning]++;
    game.scoreboard[game.status.side][0]++;
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

  game.scoreboard[game.status.side][game.status.inning] = 0;

  var currentBatter = function() {
    return teams[game.status.side].players[game.status.batter[game.status.side]].name;
  }

  return {
    status: function () {
      return game.status;
    }(),
    count: function () {
      return game.count;
    }(),
    scoreboard: function () {
      return game.scoreboard;
    }(),
    pitch: function(pitch) {
      recordPitch(pitch);
    },
    currentBatter: function () {
      return currentBatter()
    }
  }

}
