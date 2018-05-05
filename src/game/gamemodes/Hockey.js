import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicCircle from '../entities/BasicCircle';
import BasicLine from '../entities/BasicLine';

// Higher resolution might cause rendering lag
const FONT_RESOLUTION = 400;
const SCALE = 300 / FONT_RESOLUTION;

/*
  Hockey gamemode, get the ball into the other teams goal!
*/
class Hockey extends Gamemode {
  constructor(game) {
    super(game);
    this.team1 = [];
    this.team2 = [];

    this.scaleHeight = 600;

    const ball = new BasicCircle(this.game, 20, 0.5, 0xdddddd, true);
    ball.x = 0;
    ball.y = 0;
    ball.collisionGroup = 4;
    this.game.register(ball);
    this.ball = ball;

    this.topLine = this.addLine(-5000, 0, 5000, 0);
    this.bottomLine = this.addLine(-5000, 0, 5000, 0);
    this.rightLine = this.addLine(0, -500, 0, 500);
    this.leftLine = this.addLine(0, -500, 0, 500);
    this.leftLine.collisionGroup = 4;
    this.rightLine.collisionGroup = 4;

    this.displayContainer = new PIXI.Container();
    this.team1Score = 0;
    this.team2Score = 0;
    this.team1Display = this.addScoreDisplay('#AAAAFF', -200);
    this.team2Display = this.addScoreDisplay('#FFAAAA', 200);
    this.game.gameStage.addChildAt(this.displayContainer, 0);
    this.displayContainer.alpha = 0.5;
  }

  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 0.3;
    line.collisionGroup = 0;
    line.graphic.visible = false;
    this.game.register(line);
    return line;
  }

  addScoreDisplay(color, x) {
    const display = new PIXI.Text(
      '0',
      new PIXI.TextStyle({
        fill: color,
        fontSize: 300 / SCALE,
        fontFamily: ['Trebuchet MS', 'sans-serif'],
        strokeThickness: 3 / SCALE,
      })
    );
    display.anchor.set(0.5, 0.5);
    display.x = x;
    display.scale.set(SCALE, SCALE);
    this.displayContainer.addChild(display);
    return display;
  }

  resetBall() {
    this.ball.resetPhysics();
    this.ball.x = 0;
    this.ball.y = 0;
    this.ball.phase(2);
    this.resetPlayers();
  }

  resetPlayers() {
    // TODO: Spread out players
    this.team1.forEach(player => {
      const entity = this.players[player];
      entity.resetPhysics();
      entity.phase(2);
      entity.x = -200;
      entity.y = 0;
    });

    this.team2.forEach(player => {
      const entity = this.players[player];
      entity.resetPhysics();
      entity.phase(2);
      entity.x = 200;
      entity.y = 0;
    });
  }

  // Called after the game objects are updated.
  // eslint-disable-next-line
  postUpdate(dt) {
    if (this.ball.x < -this.game.gameStageWidth * 0.5) {
      // Team 2 scored!
      this.team2Score += 1;
      this.team2Display.text = this.team2Score;
      this.resetBall();
    } else if (this.ball.x > this.game.gameStageWidth * 0.5) {
      // Team 1 scored!
      this.team1Score += 1;
      this.team1Display.text = this.team1Score;
      this.resetBall();
    }
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { id } = playerObject;

    // circle.graphic.blendMode = PIXI.BLEND_MODES.EXCLUSION;

    if (this.team2.length >= this.team1.length) {
      // join team 1
      this.team1.push(id);
      circle.team = 1;
      circle.collisionGroup = 1;
      circle.setColor(0x3333ff);
      circle.x = -200;
      circle.y = 0;
    } else {
      // join team 2
      this.team2.push(id);
      circle.team = 2;
      circle.collisionGroup = 2;
      circle.setColor(0xff3333);
      circle.x = 200;
      circle.y = 0;
    }
  }

  onWindowResize() {
    const width = this.game.gameStageWidth * 0.5;
    const height = this.game.gameStageHeight * 0.5;
    this.topLine.y = -height;
    this.bottomLine.y = height;
    this.rightLine.x = width;
    this.leftLine.x = -width;
  }
}

export default Hockey;