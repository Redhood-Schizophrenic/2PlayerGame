const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7;
let timer = 60;
let timerId;

const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: './assets/background.png'
});

const shop = new Sprite({
	position: { x: 600, y: 128 },
	imageSrc: './assets/shop.png',
	scale: 2.75,
	framesMax: 6
});

const player = new Fighter({
	"position": { x: 0, y: 0 },
	"velocity": { x: 0, y: 0 },
	color: "red",
	offset: { x: 215, y: 157 },
	imageSrc: './assets/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	sprites: {
		idle: { imageSrc: './assets/samuraiMack/Idle.png', framesMax: 8 },
		run: { imageSrc: './assets/samuraiMack/Run.png', framesMax: 8 },
		jump: { imageSrc: './assets/samuraiMack/Jump.png', framesMax: 2 },
		fall: { imageSrc: './assets/samuraiMack/Fall.png', framesMax: 2 },
		attack1: { imageSrc: './assets/samuraiMack/Attack1.png', framesMax: 6 },
		takeHit: { imageSrc: './assets/samuraiMack/Take_Hit.png', framesMax: 4 },
		death: { imageSrc: './assets/samuraiMack/Death.png', framesMax: 6 },
	},
	attackBox: {
		offset: {
			x: 100,
			y: 52
		},
		width: 160,
		height: 50
	}

});
player.draw();

const enemy = new Fighter({
	"position": { x: 400, y: 0 },
	"velocity": { x: 0, y: 0 },
	color: 'blue',
	offset: { x: 215, y: 159 },
	imageSrc: './assets/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	sprites: {
		idle: { imageSrc: './assets/kenji/Idle.png', framesMax: 4 },
		run: { imageSrc: './assets/kenji/Run.png', framesMax: 8 },
		jump: { imageSrc: './assets/kenji/Jump.png', framesMax: 2 },
		fall: { imageSrc: './assets/kenji/Fall.png', framesMax: 2 },
		attack1: { imageSrc: './assets/kenji/Attack1.png', framesMax: 4 },
		takeHit: { imageSrc: './assets/kenji/Take_Hit.png', framesMax: 3 },
		death: { imageSrc: './assets/kenji/Death.png', framesMax: 7 },
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50
		},
		width: 170,
		height: 50
	}

});
enemy.draw();

const keys = {
	a: { pressed: false },
	d: { pressed: false },
	ArrowRight: { pressed: false },
	ArrowLeft: { pressed: false },
}

function timerTicking() {
	if (timer > 0) {
		timerId = setTimeout(timerTicking, 1000)
		timer--;
		document.querySelector('#timer').innerHTML = timer
	}
	if (timer === 0) {
		matchResults();
	}
}

// Infinite Looping
animate();
timerTicking();

// For pressing keys
window.addEventListener('keydown', (event) => {

	if (!player.dead) {

		switch (event.key) {
			// Player Movements
			// Moving Right
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			// Moving Left
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			// Jump effect
			case 'w':
				player.velocity.y = -20;
				break;
			// Attack
			case ' ':
				player.attack();
				break;
		}
	}

	if (!enemy.dead) {
		switch (event.key) {
			// Enemy Movements
			// Moving Right
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
			// Moving Left
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
			// Jump effect
			case 'ArrowUp':
				enemy.velocity.y = -20;
				break;
			// Attack
			case 'Enter':
				enemy.attack();
				break;

			default:
				break;
		}
	}
})

// For releasing keys
window.addEventListener('keyup', (event) => {
	switch (event.key) {
		// Player Movements
		// Moving Right
		case 'd':
			keys.d.pressed = false;
			break;
		// Moving Left
		case 'a':
			keys.a.pressed = false;
			break;


		// Enemy Movements
		// Moving Right
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		// Moving Left
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
		default:
			break;
	}
});

// Animation
function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black"
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.15)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	// Player Movements
	player.velocity.x = 0; // To stop movement when key is released
	if (keys.a.pressed && player.lastKey === "a") {
		// Running Left
		player.velocity.x = -5
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === "d") {
		// Running Right
		player.velocity.x = 5;
		player.switchSprite('run')
	} else {
		// Idle
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		// Jumping
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		// Falling
		player.switchSprite('fall')
	}

	// Player Attacks & Enemy Get Hits
	if (attack({ attacker: player, attacked: enemy }) && player.isAttacking && player.currentFrame === 4) {
		player.isAttacking = false;
		enemy.takeHit();
		// document.querySelector('#enemyHealth').style.width = enemy.healthBar + '%';
		gsap.to('#enemyHealth', {
			width: enemy.healthBar + '%'
		});
	}

	// Player Misses
	if (player.isAttacking && player.currentFrame === 4) {
		player.isAttacking = false;
	}


	// Enemy Movements
	enemy.velocity.x = 0; // To stop movement when key is released
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		// Running Left
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		// Running Right
		enemy.velocity.x = 5
		enemy.switchSprite('run')
	} else {
		// Idle
		enemy.switchSprite('idle')
	}

	if (enemy.velocity.y < 0) {
		// Jumping
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		// Falling
		enemy.switchSprite('fall')
	}

	// Enemy Attacks
	if (attack({ attacker: enemy, attacked: player }) && enemy.isAttacking && enemy.currentFrame === 2) {
		enemy.isAttacking = false;
		player.takeHit();
		gsap.to('#playerHealth', {
			width: player.healthBar + '%'
		})
	}

	// Enemy Misses
	if (enemy.isAttacking && enemy.currentFrame === 2) {
		enemy.isAttacking = false;
	}

	// End Game
	if (enemy.healthBar <= 0 || player.healthBar <= 0) {
		matchResults();
	}

}
