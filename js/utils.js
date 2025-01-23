function attack({ attacker, attacked }) {
	return (
		attacker.attackBox.position.x + attacker.attackBox.width >= attacked.position.x &&
		attacker.attackBox.position.x <= attacked.position.x + attacked.width &&
		attacker.attackBox.position.y + attacker.attackBox.height >= attacked.position.y &&
		attacker.attackBox.position.y <= attacked.position.y + attacked.height
	)
}

function matchResults() {
	clearTimeout(timerId);
	document.querySelector('#MatchStatus').style.display = "flex";
	if (player.healthBar === enemy.healthBar) {
		document.querySelector('#MatchStatus').innerHTML = "Draw!!";
	} else if (player.healthBar > enemy.healthBar) {
		document.querySelector('#MatchStatus').innerHTML = "Player 1 Wins!!";
	} else if (player.healthBar < enemy.healthBar) {
		document.querySelector('#MatchStatus').innerHTML = "Player 2 Wins!!";
	}
}

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black"
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	player.update();
	enemy.update();

	// Player Movements
	player.velocity.x = 0; // To stop movement when key is released
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5
	}
	// Player Attacks
	if (attack({ attacker: player, attacked: enemy }) && player.isAttacking) {
		player.isAttacking = false;
		enemy.healthBar -= 5;
		document.querySelector('#enemyHealth').style.width = enemy.healthBar + '%';
	}


	// Enemy Movements
	enemy.velocity.x = 0; // To stop movement when key is released
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5
	}
	// Enemy Attacks
	if (attack({ attacker: enemy, attacked: player }) && enemy.isAttacking) {
		enemy.isAttacking = false;
		player.healthBar -= 5;
		document.querySelector('#playerHealth').style.width = player.healthBar + '%';
	}

	// End Game
	if (enemy.healthBar <= 0 || player.healthBar <= 0) {
		matchResults();
	}

}
