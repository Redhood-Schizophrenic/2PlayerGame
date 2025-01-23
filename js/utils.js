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
