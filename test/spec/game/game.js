'use strict';

describe('Baseball Game Creation', function () {

  it('creates a game', function () {

    var game = new Game();

    expect(typeof game).toBe('object');

  });

  it('brings a batter up to the plate', function () {

    var game = new Game();

    expect(game.currentBatter()).toBe('away 1');

  });

  it('zeroes out the score for the top of the first.', function () {

    var game = new Game();

    expect(game.scoreboard.away[1]).toBe(0);

  });

});

describe('At bat actions', function () {

  var game = new Game();

  it('records a strike', function () {

    game.pitch({
      strike: true
    });

    expect(game.count.strikes).toBe(1);

  });

  it('records a ball', function () {

    game.pitch();

    expect(game.count.balls).toBe(1);

  });

})

describe('Basic Game Plays', function () {

  var game = new Game();

  it('records a strikeout', function () {

    game.pitch({
      strike: true
    });

    expect(game.count.strikes).toBe(1);

    game.pitch({
      strike: true
    });

    expect(game.count.strikes).toBe(2);

    game.pitch({
      strike: true
    });

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.count.outs).toBe(1);

  });

  it('records a walk', function () {

    game.pitch();
    game.pitch();
    game.pitch();
    game.pitch();

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).toBe('away 2');
    expect(game.status.bases[1]).toBeUndefined();
    expect(game.status.bases[2]).toBeUndefined();

  });

  it('records a second consecutive walk', function () {

    game.pitch();
    game.pitch();
    game.pitch();
    game.pitch();

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).toBe('away 3');
    expect(game.status.bases[1]).toBe('away 2');
    expect(game.status.bases[2]).toBeUndefined();

  });

  it('records a third consecutive walk', function () {

    game.pitch();
    game.pitch();
    game.pitch();
    game.pitch();

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).toBe('away 4');
    expect(game.status.bases[1]).toBe('away 3');
    expect(game.status.bases[2]).toBe('away 2');

  });

  it('records a single', function () {

    game.pitch({
      hit: true,
      bases: 1
    });

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).not.toBeUndefined();
    expect(game.status.bases[1]).not.toBeUndefined();
    expect(game.status.bases[2]).not.toBeUndefined();

  });

  it('records a run for the away team', function () {

    game.pitch({
      hit: true,
      bases: 1
    });

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).not.toBeUndefined();
    expect(game.status.bases[1]).not.toBeUndefined();
    expect(game.status.bases[2]).not.toBeUndefined();
    expect(game.scoreboard.away[1]).toBe(2);

  });

  it('records a batted out', function () {

    game.pitch({
      out: true
    });

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).not.toBeUndefined();
    expect(game.status.bases[1]).not.toBeUndefined();
    expect(game.status.bases[2]).not.toBeUndefined();
    expect(game.count.outs).toBe(2);

  });

  it('records a third out, turning the side', function () {

    game.pitch({
      out: true
    });

    expect(game.count.balls).toBe(0);
    expect(game.count.strikes).toBe(0);
    expect(game.status.bases[0]).toBeUndefined();
    expect(game.status.bases[1]).toBeUndefined();
    expect(game.status.bases[2]).toBeUndefined();
    expect(game.count.outs).toBe(0);
    expect(game.status.side).toBe('home');
    expect(game.currentBatter()).toBe('home 1')

  });

  it('records four consecutive singles, scoring a run for the home team', function () {

    game.pitch({
      hit: true,
      bases: 1
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    expect(game.status.bases[0]).toBe('home 3');
    expect(game.status.bases[1]).toBe('home 2');
    expect(game.status.bases[2]).toBe('home 1');

    game.pitch({
      hit: true,
      bases: 1
    });

    expect(game.status.bases[0]).toBe('home 4');
    expect(game.status.bases[1]).toBe('home 3');
    expect(game.status.bases[2]).toBe('home 2');
    expect(game.scoreboard.home[1]).toBe(1);

  });

  it('turns the side once again, then scores a run for the away team; testing aggregate score', function () {

    game.pitch({
      out: true
    });

    game.pitch({
      out: true
    });

    game.pitch({
      out: true
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    game.pitch({
      hit: true,
      bases: 1
    });

    expect(game.status.bases[0]).not.toBeUndefined();
    expect(game.status.bases[1]).not.toBeUndefined();
    expect(game.status.bases[2]).not.toBeUndefined();
    expect(game.count.outs).toBe(0);
    expect(game.status.inning).toBe(2);
    expect(game.scoreboard.away[1]).toBe(2);
    expect(game.scoreboard.away[2]).toBe(1);
    expect(game.scoreboard.home[1]).toBe(1);
    expect(game.scoreboard.away[0]).toBe(3);
  });

});

describe('Multi-base hits', function () {

  var game = new Game();

  it('records a double with the bases empty', function () {

    console.log(game.status.bases)

    game.pitch({
      hit: true,
      bases: 2
    });

    console.log(game.status.bases)

    expect(game.status.bases[0]).toBeUndefined();
    expect(game.status.bases[1]).toBe('away 1');
    expect(game.status.bases[2]).toBeUndefined();

  });

  // it('records three consecutive doubles with each runner on second scoring on each double.', function () {

  //   game.pitch({
  //     hit: true,
  //     bases: 2
  //   });

  //   game.runners.advance(2,1);

  //   game.pitch({
  //     hit: true,
  //     bases: 2
  //   });

  //   game.runners.advance(2,1);

  //   game.pitch({
  //     hit: true,
  //     bases: 2
  //   });

  //   game.runners.advance(2,1);

  //   expect(game.status.bases[0]).toBeUndefined();
  //   expect(game.status.bases[1]).not.toBeUndefined();
  //   expect(game.status.bases[2]).toBeUndefined();
  //   expect(game.scoreboard.away[0]).toBe(3);

  // });

  // it('records a home run with a runner on second.', function () {

  //   console.log(game.status.bases);
  //   console.log(game.currentBatter());

  //   game.pitch({
  //     hit: true,
  //     bases: 4
  //   });

  //   console.log(game.status.bases);

  //   expect(game.status.bases[0]).toBeUndefined();
  //   expect(game.status.bases[1]).toBeUndefined();
  //   expect(game.status.bases[2]).toBeUndefined();
  //   expect(game.scoreboard.away[0]).toBe(5);

  // });

})
