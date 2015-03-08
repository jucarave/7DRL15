function Lifter(position, texture, height, mapManager){
	var gl = mapManager.game.GL.ctx;
	
	this.position = position;
	this.mapManager = mapManager;
	this.texture = texture;
	this.destroyed = false;
	this.height = height;
	this.moving = 0;
	this.initialPosition = this.position.b;
	this.targetY = this.position.b;
	
	var c = ObjectFactory.cube(vec3(1.0, height, 1.0), vec2(1.0, height), gl);
	var f = ObjectFactory.floor(vec3(1.0, 0.0, 1.0), vec2(1.0, 1.0), gl);
	f = ObjectFactory.translateObject(f, vec3(0.0,height,0.0));
	
	var l = ObjectFactory.fuzeObjects([c, f]);
	l = ObjectFactory.translateObject(l, vec3(0.0,0.0,0.0));
	
	this.lifter = ObjectFactory.create3DObject(gl, l);
	this.lifter.position = this.position;
}

Lifter.prototype.activate = function(){
	if (this.moving != 0) return;
	var p = this.mapManager.player.position;
	if (p.b != this.mapManager.player.targetY) return;
	
	if (p.b >= this.position.b && p.b < this.position.b + this.height){
		this.initialPosition = this.position.b;
		this.moving = -1;
		this.targetY = p.b - this.height;
	}
};

Lifter.prototype.draw = function(){
	if (this.destroyed) return;
	
	var game = this.mapManager.game;
	game.drawObject(this.lifter, this.texture);
};

Lifter.prototype.loop = function(){
	if (this.destroyed) return;
	
	if (this.moving != 0){
		if (this.moving > 1){
			this.moving -= 1;
		}else{
			this.position.b += 0.05 * this.moving;
			
			var p = this.mapManager.player.position;
			if (p.a >= this.position.a && p.a < this.position.a + 1 && p.c >= this.position.c && p.c < this.position.c + 1)
				this.mapManager.player.targetY = this.position.b + this.height;
			
			if (this.position.b < this.targetY && this.moving == -1){
				this.position.b = this.targetY;
				this.moving = 60;
			}else if (this.position.b > this.initialPosition && this.moving == 1){
				this.position.b = this.initialPosition;
				this.moving = 0;
			}
		}
	}
	
	this.draw();
};