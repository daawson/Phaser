class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }

    preload() {
        this.physics.world.step(0)
        this.load.spritesheet("ball", "assets/sprites/emoji.png", { frameWidth: 32, frameHeight: 32 }, 2);
        this.load.image("platform", "assets/sprites/platform.png");
        this.load.image("brick", "assets/sprites/brick.png");
    }

    create() {


        // PLATFORM
        this.platform = this.physics.add.image(600 / 2, 770, "platform");
        this.platform.setScale(0.7, 1);
        this.platform.body.setImmovable(true);
        this.platform.body.setCollideWorldBounds();
        this.platform.y = 770;

        // PLATFORM CURSOR FOLLOW AND CURSOR LOCK
        this.input.on('pointerdown', function(pointer) {
            this.input.mouse.requestPointerLock();
            if (!this.input.mouse.locked && this.balls.length > 0) this.balls[0].setVelocityY(600);
        }, this);

        this.input.on('pointermove', function(pointer) {
            if (this.input.mouse.locked) {
                this.platform.x += pointer.movementX; // Changing platform X when mouse moves. 
            }
        }, this);

        /// BALL
        this.balls = new Array();

        this.ball = this.physics.add.image(600 / 2, 800 / 2 - 16, "ball").setCircle(16);
        this.ball.setScale(0.5, 0.5);
        this.ball.setBounce(1, 1);
        this.ball.setMaxVelocity(600, 600)
        this.ball.body.setCollideWorldBounds();
        this.ball.setFrame(1);

        this.balls.push(this.ball); // adding ball to array 
        this.platform_hit_count = 0;
        this.physics.add.collider(this.ball, this.platform, collisionCallback); //adding collision ball > platform

        // BRICKS
        this.bricks = new Array();
        for (var y = 2; y < 10; y++) {
            for (var x = 1; x < 19; x++) {
                var b = this.physics.add.image(15 + (x * 30), 10 + (y * 15), "brick");
                b.body.setImmovable(true);
                this.physics.add.collider(this.ball, b, brickCollision);
                this.bricks.push(b);
            }
        }

        // SCORE
        this.score = 0;
        this.score_text = this.add.text(10, 10, "Score: " + this.score, { font: "16px Arial" });

    }

    update() {
        this.balls.forEach(ball => {
            if (ball.y >= 785) {

                ball.destroy();
                this.balls.splice(this.balls.indexOf(ball), 1);
            }
        });

        if (this.balls.length == 0) {
            this.input.mouse.releasePointerLock();
            this.scene.start("SceneRestart");
        }
    }

}

// win check.
var isWin = false;
// RESTART SCENE
class SceneRestart extends Phaser.Scene {

    constructor() {
        super('SceneRestart');
    }

    preload() {
        this.load.image('restart', 'assets/sprites/restart.png');

    }

    create() {
        this.status = this.add.text(600 / 2 - 37, 800 / 2 - 100, isWin ? "You win!" : "You Lose!");
        this.button = this.add.image(600 / 2, 800 / 2, 'restart').setInteractive();
        this.button.on("pointerdown", () => {
            isWin = false;
            this.scene.start("SceneMain");
        });
    }

    update() {
        this.input.mouse.releasePointerLock();
    }
}


// FUNCTIONS
// spawn extra ball;
function createBall(a) {
    var instance = game.scene.scenes[0];

    var ball = instance.physics.add.image(a.body.x, a.body.y, "ball").setCircle(16);
    ball.setScale(0.5, 0.5);
    ball.setBounce(1, 1);
    ball.setMaxVelocity(600, 600)
    ball.body.setCollideWorldBounds();
    ball.setFrame(getRandomInt(0, 1));

    ball.setVelocityY(600);
    ball.setVelocityX(getRandomInt(-100, 100));

    instance.physics.add.collider(ball, instance.platform, collisionCallback);

    instance.balls.push(ball);

    instance.bricks.forEach(brick => {
        instance.physics.add.collider(ball, brick, brickCollision);
    });

}

// update and check score
function updateScore() {
    var instance = game.scene.scenes[0];
    instance.score++;
    instance.score_text.setText("Score: " + instance.score);
    if (instance.score == 144) {
        instance.input.mouse.releasePointerLock();
        isWin = true;
        instance.scene.start("SceneRestart");
    }
}

// callback ball-brick collision
function brickCollision(a, b) {
    var r = getRandomInt(0, 100);
    if (r % 2) createBall(a);

    updateScore();
    b.destroy();
}

// callback ball-platform collision
function collisionCallback(a, b) {
    var xDiff = a.x - b.x; // Calculate X diff;
    a.body.setVelocityX(xDiff * 8); // speed it up and give angle to ball
    a.body.setVelocityY(-600); // keep Y speed

    // extra    
    var instance = game.scene.scenes[0];
    instance.platform_hit_count++;
    if (instance.platform_hit_count == 10 && b.scaleX != 1.2) {
        b.setScale(b.scaleX + 0.1, 1);
        instance.platform_hit_count = 0;
    }


}

// random int min max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// lock cursor to window
function requestLock() {
    game.input.mouse.requestPointerLock();
}