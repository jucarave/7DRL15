function Enemy(position, enemy, mapManager){
	this.position = position;
	this.textureBase = enemy.textureBase;
	this.mapManager = mapManager;
	
	this.animation = "run";
	this.enemy = enemy;
	this.target = false;
	this.billboard = ObjectFactory.billboard(vec3(1.0, 1.0, 1.0), vec2(1.0, 1.0), this.mapManager.game.GL.ctx);
	this.textureCoords = AnimatedTexture.getByNumFrames(1);
	this.numFrames = 1;
	this.imgSpd = 1/7;
	this.imgInd = 0;
	this.destroyed = false;
	this.hurt = 0.0;
	this.targetY = position.b;
	this.solid = true;
	
	this.attackWait = 0.0;
	
	this.visible = true;
}

Enemy.prototype.receiveDamage = function(dmg){
	this.hurt = 5.0;
	
	this.enemy.hp -= dmg;
	if (this.enemy.hp <= 0){
		this.mapManager.game.addExperience(this.enemy.stats.exp);
		this.mapManager.addMessage(this.enemy.name + " killed");
		this.destroyed = true;
	}
};

Enemy.prototype.lookFor = function(){
	var player = this.mapManager.player;
	if (!player.moved) return;
	var p = player.position;
	
	var dx = Math.abs(p.a - this.position.a);
	var dz = Math.abs(p.c - this.position.c);
	
	if (!this.target && (dx <= 4 || dz <= 4)){
		// Cast a ray towards the player to check if he's on the vision of the creature
		var rx = this.position.a;
		var ry = this.position.c;
		var dir = Math.getAngle(this.position, p);
		var dx = Math.cos(dir) * 0.3;
		var dy = -Math.sin(dir) * 0.3;
		
		var search = 15;
		while (search > 0){
			rx += dx;
			ry += dy;
			
			var cx = (rx << 0);
			var cy = (ry << 0);
			
			if (this.mapManager.isSolid(cx, cy)){
				return;
			}else{
				var px = (p.a << 0);
				var py = (p.c << 0);
				
				if (cx == px && cy == py){
					this.target = this.mapManager.player;
					search = 0;
				}
			}
			
			search -= 1;
		}
	}
};

Enemy.prototype.doVerticalChecks = function(){
	var pointY = this.mapManager.getYFloor(this.position.a, this.position.c);
	var py = Math.floor((pointY - this.position.b) * 100) / 100;
	if (py <= 0.3) this.targetY = pointY;
};

Enemy.prototype.moveTo = function(xTo, zTo){
	var movement = vec2(xTo, zTo);
	var spd = vec2(xTo * 1.5, 0);
	var fakePos = this.position.clone();
		
	for (var i=0;i<2;i++){
		var normal = this.mapManager.getWallNormal(fakePos, spd, this.cameraHeight, this.onWater);
		if (!normal){ normal = this.mapManager.getDoorNormal(fakePos, spd, this.cameraHeight, this.onWater); }
		if (!normal){ normal = this.mapManager.getInstanceNormal(fakePos, spd, this.cameraHeight, this); } 
		
		if (normal){
			normal = normal.clone();
			var dist = movement.dot(normal);
			normal.multiply(-dist);
			movement.sum(normal);
		}
		
		fakePos.a += movement.a;
		
		spd = vec2(0, zTo * 1.5);
	}
	
	if (movement.a != 0 || movement.b != 0){
		this.doVerticalChecks();
		this.position.a += movement.a;
		this.position.c += movement.b;
	}
};

Enemy.prototype.attackPlayer = function(player){
	if (this.hurt > 0.0) return;
	if (this.attackWait > 0){
		this.attackWait -= 1;
		return;
	}
	
	var str = rollDice(this.enemy.stats.str);
	var dfs = rollDice(this.mapManager.game.player.stats.dfs);
	
	// Check if the player has the protection spell
	if (this.mapManager.game.protection > 0){
		dfs += 15;
	}
	
	var dmg = Math.max(str - dfs, 0);
	
	this.mapManager.addMessage(this.enemy.name + " is attacking you!");
	
	if (dmg > 0){
		this.mapManager.addMessage(dmg + " points inflicted");
		player.receiveDamage(dmg);
	}else{
		this.mapManager.addMessage("Blocked!");
	}
	
	this.attackWait = 30;
};

Enemy.prototype.step = function(){
	if (this.target){
		var player = this.mapManager.player;
		if (player.destroyed) return;
		var p = player.position;
		
		var xx = Math.abs(p.a - this.position.a);
		var yy = Math.abs(p.c - this.position.c);
		
		if (xx <= 1 && yy <=1){
			this.attackPlayer(player);
			return;
		}
		
		var dir = Math.getAngle(this.position, p);
		var dx = Math.cos(dir) * 0.05;
		var dy = -Math.sin(dir) * 0.05;
		
		this.moveTo(dx, dy);
	}else{
		this.lookFor();
	}
};

Enemy.prototype.getTextureCode = function(){
	var face = this.direction;
	var a = this.animation;
	if (this.animation == "stand") a = "run";
	
	return this.textureBase + "_" + a;
};

Enemy.prototype.draw = function(){
	if (!this.visible) return;
	if (this.destroyed) return;
	
	var game = this.mapManager.game;
	
	if (this.billboard && this.textureCoords){
		this.billboard.texBuffer = this.textureCoords[(this.imgInd << 0)];
	}
	
	this.billboard.paintInRed = (this.hurt > 0);
	game.drawBillboard(this.position,this.getTextureCode(),this.billboard);
};

Enemy.prototype.loop = function(){
	if (this.imgSpd > 0 && this.numFrames > 1){
		this.imgInd += this.imgSpd;
		if ((this.imgInd << 0) >= this.numFrames){
			this.imgInd = 0;
		}
	}
	
	if (this.targetY < this.position.b){
		this.position.b -= 0.1;
		if (this.position.b <= this.targetY) this.position.b = this.targetY;
	}else if (this.targetY > this.position.b){
		this.position.b += 0.08;
		if (this.position.b >= this.targetY) this.position.b = this.targetY;
	}
	
	if (--this.hurt < 0){ this.hurt = 0.0; }
	
	this.step();
	
	this.draw();
};