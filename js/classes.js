class Sprite {
	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
		currentFrame = 0,
		framesElapsed = 0,
		framesHold = 5,
		offset = { x: 0, y: 0 }
	}) {
		this.position = position
		this.height = 150
		this.width = 50
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.currentFrame = currentFrame
		this.framesElapsed = framesElapsed
		this.framesHold = framesHold
		this.offset = offset
	}

	draw() {
		c.drawImage(
			this.image,
			this.currentFrame * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);

	}

	animateFrames() {
		this.framesElapsed++;
		if (this.framesElapsed % this.framesHold === 0) {
			if (this.currentFrame < this.framesMax - 1) {
				this.currentFrame++;
			} else {
				this.currentFrame = 0;
			}
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	constructor({
		position,
		velocity,
		color = 'red',
		imageSrc,
		scale = 1,
		framesMax = 1,
		currentFrame = 0,
		framesElapsed = 0,
		framesHold = 5,
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = { offset: {}, width: undefined, height: undefined }
	}) {
		super({ position, imageSrc, scale, framesMax, currentFrame, framesElapsed, framesHold, offset })
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		}
		this.color = color
		this.isAttacking
		this.healthBar = 100
		this.sprites = sprites
		this.dead = false

		for (const sprite in sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
	}

	update() {
		this.draw();
		if (!this.dead) {
			this.animateFrames();
		}

		// Update the attackbox position with person
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

		// Movement
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Gravity and Stopping at ground
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
			//  96 is taken to stop at the ground of image
			this.velocity.y = 0;
			this.position.y = 330
		} else {
			this.velocity.y += gravity;
		}
	}

	attack() {
		this.switchSprite('attack1');
		this.isAttacking = true;
	}

	takeHit() {
		this.healthBar -= 10;
		if (this.healthBar <= 0) {
			this.switchSprite('death');
		} else {
			this.switchSprite('takeHit');
		}
	}

	switchSprite(sprite) {
		// Renders Attack Animation Overriding other animations
		if (
			this.image === this.sprites.attack1.image &&
			this.currentFrame < this.sprites.attack1.framesMax - 1
		) return

		// Renders Taking Attack Animation Overriding other animations
		if (
			this.image === this.sprites.takeHit.image &&
			this.currentFrame < this.sprites.takeHit.framesMax - 1
		) return

		// Renders Death Animation Overriding other animations
		if (this.image === this.sprites.death.image) {
			if (this.currentFrame === this.sprites.death.framesMax - 1) {
				this.dead = true
			}
			return
		}

		// Other Animation
		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.currentFrame = 0
				}
				break;
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.currentFrame = 0
				}
				break;
			default:
				break;
		}
	}
}

