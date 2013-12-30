'use strict';

describe('Baseball Game Creation', function () {

  it('creates a game', function () {

    var game = new Game();

    expect(typeof game).toBe('object');

  });

  it('brings a batter up to the plate', function () {

    var game = new Game();

    expect(game.batter.name).toBe('away 1');

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

describe('Game Plays', function () {

  var game = new Game();

  it('Should record a strikeout', function () {

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
    expect(game.outs).toBe(1);

  });

});
