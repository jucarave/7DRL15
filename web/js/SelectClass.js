function SelectClass(/*Game*/ game){
	this.game = game;
}

SelectClass.prototype.step = function(){
	var game = this.game;
	var playerS = game.player;
	if (game.getKeyPressed(13) || game.getMouseButtonPressed()){
		var mouse = game.mouse;
		
		if (game.mouse.a >= 154 && game.mouse.a < 214 && game.mouse.b >= 1){
			if (game.mouse.b < 61){
				playerS.virtue = "Compasion";
			}else if (game.mouse.b >= 67 && game.mouse.b < 127){
				playerS.virtue = "Honor";
			}else if (game.mouse.b >= 133 && game.mouse.b < 193){
				playerS.virtue = "Humility";
			}
		}else if (game.mouse.a >= 221 && game.mouse.a < 280 && game.mouse.b >= 1){
			if (game.mouse.b < 61){
				playerS.virtue = "Honesty";
			}else if (game.mouse.b >= 133 && game.mouse.b < 193){
				playerS.virtue = "Sacrifice";
			}
		}else if (game.mouse.a >= 288 && game.mouse.a < 347 && game.mouse.b >= 1){
			if (game.mouse.b < 61){
				playerS.virtue = "Valor";
			}else if (game.mouse.b >= 67 && game.mouse.b < 127){
				playerS.virtue = "Spirituality";
			}else if (game.mouse.b >= 133 && game.mouse.b < 193){
				playerS.virtue = "Justice";
			}
		}
		
		if (playerS.virtue != null){
			game.loadMap("test");
		}
	}
};

SelectClass.prototype.loop = function(){
	this.step();
	
	var ui = this.game.getUI();
	ui.drawImage(this.game.images.selectClass, 0, 0);
};
