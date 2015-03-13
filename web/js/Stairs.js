function Stairs(position, mapManager, direction){
	this.position = position;
	this.mapManager = mapManager;
	this.direction = direction;
	
	this.targetId = this.mapManager.id;
	if (this.direction == 'up'){
		this.targetId -= 1;
	}else if (this.direction == 'down'){
		this.targetId += 1;
	}
}

Stairs.prototype.activate = function(){
	this.mapManager.game.loadMap(false, -1, this.targetId);
};
