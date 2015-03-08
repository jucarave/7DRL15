function Enemy(position, textureBase, mapManager){
	this.position = position;
	this.textureBase = textureBase;
	this.mapManager = mapManager;
	
	this.animation = "run";
	this.enemy = true;
	this.target = false;
	this.billboard = ObjectFactory.billboard(vec3(1.0, 1.0, 1.0), vec2(1.0, 1.0), this.mapManager.game.GL.ctx);
	this.textureCoords = AnimatedTexture.getByNumFrames(4);
	this.numFrames = 4;
	this.imgSpd = 1/4;
	this.imgInd = 0;
	this.destroyed = false;
	
	this.visible = true;
}

Enemy.prototype.lookFor = function(){
	var p = this.mapManager.player.position;
	
	var dx = Math.abs(p.a - this.position.a);
	var dz = Math.abs(p.c - this.position.c);
	
	if (!this.target && (dx <= 6 || dz <= 6)){
		this.target = true;
		this.animation = "run";
	}else if (this.target && (dx > 15 || dz > 15)){
		this.target = false;
		this.animation = "stand";
	}
};

Enemy.prototype.step = function(){
};

Enemy.prototype.getTextureCode = function(){
	var face = this.direction;
	var a = this.animation;
	if (this.animation == "stand") a = "run";
	
	return this.textureBase + "_" + a;
};

Enemy.prototype.draw = function(){
	if (!this.visible) return;
	var game = this.mapManager.game;
	
	if (this.billboard && this.textureCoords){
		this.billboard.texBuffer = this.textureCoords[(this.imgInd << 0)];
	}
	
	game.drawBillboard(this.position,this.getTextureCode(),this.billboard);
};

Enemy.prototype.loop = function(){
	if (this.imgSpd > 0 && this.numFrames > 1){
		this.imgInd += this.imgSpd;
		if ((this.imgInd << 0) >= this.numFrames){
			this.imgInd = 0;
		}
	}
	
	this.step();
	
	this.draw();
};