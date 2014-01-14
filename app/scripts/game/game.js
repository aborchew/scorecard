
// Define a player
var Player = function(config) {
  var config = config || {};
  return {
    name: config.name
  }
}

// Define a player
var Game = function(config) {

  var config = config || {};

  var game
  , teams
  ;

  // Simple reduce method for ease of reuse
  var simpleReduce = function(arr) {
    return arr.reduce(function(prev,curr){
      return prev + curr;
    },0);
  }

  // This is the meat and bones of the game information as it progresses.
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
      away: [0,0],
      home: [0]
    }
  };

  // Retrieve the Player that is currently batting
  var currentBatter = function() {
    return teams[game.status.side].players[game.status.batter[game.status.side]];
  }

  // Called upon a hit, strikeout, walk or side change.
  var newCount = function() {
    game.count.balls = 0;
    game.count.strikes = 0;
  }

  // Called for every pitch - balls, strikes, hits, etc.
  var recordPitch = function(pitch) {

    // an empty or nonexistent argument will result in a ball.
    var pitch = pitch || {};

    // Record a strike
    if(pitch.strike && !pitch.hit && !pitch.out) {

      game.count.strikes++;

      // Record a strikeout (?)
      if(game.count.strikes == 3) {
        newCount();
        recordOut();
      }
    }

    // Record a ball
    else if(!pitch.hit && !pitch.out) {

      game.count.balls++;

      // Record a walk (?)
      if(game.count.balls == 4) {
        newCount();
        advance(-1,1);
      }
    }

    // Record a hit
    else if(pitch.hit) {
      newCount();
      var i = 0;
      var bases = pitch.bases || 1;
      advance(-1,bases);
    } else if(pitch.out) {
      newCount();
      recordOut();
    }
  }

  // Batter up!
  var nextBatter = function() {
    if(game.status.batter[game.status.side] < teams[game.status.side].players.length - 1) {
      game.status.batter[game.status.side]++;
    } else {
      game.status.batter[game.status.side] = 0;
    }
  }

  // Called for all outs; in play, out of play and strikeouts.
  var recordOut = function() {

    game.count.outs++;
    nextBatter();

    // Turn the side (?)
    if(game.count.outs == 3) {

      // Clear the bases
      game.status.bases = [undefined,undefined,undefined];

      newCount();
      game.count.outs = 0;

      // Turn the side, increment inning (?)
      if(game.status.side == 'away') {
        game.status.side = 'home';
      } else {
        game.status.side = 'away';
        game.status.inning++;
      }

      // Put a zero up for the new side
      game.scoreboard[game.status.side][game.status.inning] = 0;

    };
  }

  // Called for any baserunner advancement; hit, walk, steal, error, etc.
  var advance = function(runnerIndex,bases) {

    // Number of bases to advance the runner
    var bases = bases || 1;

    // Reference to the bases object
    var _b = game.status.bases;

    // The runner to advance...
    if(runnerIndex != -1 && _b[runnerIndex]) {
      var runner = _b[runnerIndex];
    }

    // Or the batter
    else if(runnerIndex == -1) {
      var runner = currentBatter();
    }

    // ... Or do nothing (Maybe this should advance all runners 1 base)
    else {
      return;
    }

    // May be called multiple times for a single invocation of advance()
    var advanceRunner = function(b) {

      // Check if there is a runner at the base in front of the runner we want to move
      if(_b[b+1]) {
        // Advance the blocking runner, then try again.
        advanceRunner(b+1);
        advanceRunner(b);
      }

      // Otherwise, advance the runner
      else {

        // See if the runner is already on base
        if(_b[b]) {

          // Move the runner forward
          _b[b+1] = _b[b];

          // Remove the reference to the runner at its' previous base
          delete _b[b];
        }

        // If the runner isn't on base, move the batter to first base.
        else {
          _b[b+1] = currentBatter();
          nextBatter();
        }

      }

      // If there's a runner on fourth base, he should score
      if(_b.length > 3) {
        score();
      }

    };

    // Start things off!
    for(var i = 0; i < bases; i++) {
      advanceRunner(runnerIndex+i);
    }

  }

  // Called whenever the bases object length exceeds 3 (a runner reaches home)
  var score = function() {

    // Remove the scoring runner
    game.status.bases.splice(3,1)

    // Increment the inning score
    game.scoreboard[game.status.side][game.status.inning]++;

    // Increment the game score
    game.scoreboard[game.status.side][0]++;

  }

  // Mock object to be used for development purposes prior to firebaseIO integration
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
      return currentBatter();
    },
    runners: {
      advance: function (runner, bases) {
        advance(runner,bases);
      },
      out: function (runner, method) {
        delete game.status.bases[runner];
        recordOut();
      }
    }
  }

}
