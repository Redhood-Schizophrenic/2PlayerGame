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
	offset: { x: 0, y: 0 },
});
player.draw();

const enemy = new Fighter({
	"position": { x: 400, y: 0 },
	"velocity": { x: 0, y: 0 },
	color: 'blue',
	offset: { x: -50, y: 0 },
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
