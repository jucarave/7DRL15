/*
 	-- AVAILABLE COMMANDS --
 	
 	-> KTFLY: 				Move faster, gravity = 0, move vertically with the arrows
 	-> KTNOCLIP: 			Allow to move through walls
 	-> KTSET [PARAMS]: 		Sets a dynamic variable, the first parameter is the variable name, the second parameter are the arguments splited by commas
 	-> KTGET [PARAM]: 		Gets a dynamic variable value and print it on the console
 	-> KTCREATE [PARAMS]:   Creates and object in front of the camera
 	
 	-- DYNAMIC VARIABLES --
 	
 		* SPAWNTEMP:		Takes the current position and makes a temporary spawn point for this sesion (If null is send as parameter (KTSET SPAWNTEMP NULL) then it erases the point and the player spawns at his normal map position)
 		 
 	-- OBJECTS TO CREATE --
 	
 		* LIFTER:			(KTCREATE LIFTER) creates a lifter in front of the camera
 * */

var DEBUG = {
	onDebug: false,
	typing: "",
	console: [],
	
	commandsMem: [],
	commandCur: 0,
	
	player: null,
	
	fly: false,
	clip: false,
	
	currentObject: null,
	objectType: "",
	
	keyDown: function(keyCode){
		if (!this.onDebug) return;
		
		if (keyCode >= 48 && keyCode <= 57){
			this.typing += (keyCode - 48);
		}else if (keyCode >= 65 && keyCode <= 90){
			this.typing += String.fromCharCode(keyCode);
		}else if (keyCode == 32){
			this.typing += " ";
		}else if (keyCode == 8){
			this.typing = this.typing.substring(0,this.typing.length - 1);
		}else if (keyCode == 13){
			this.doCommand();
		}else if (keyCode == 38){
			if (--this.commandCur < 0) this.commandCur = 0;
			this.typing = this.commandsMem[this.commandCur];
		}else if (keyCode == 40){
			if (++this.commandCur >= this.commandsMem.length) this.commandCur = this.commandsMem.length;
			this.typing = this.commandsMem[this.commandCur];
			if (this.typing == undefined) this.typing = "";
		}
	},
	
	setDynamicVar: function(variable, params){
		switch (variable){
			case "SPAWNTEMP":
				var p = this.player.position;
				var r = this.player.rotation;
				if (params == "NULL"){
					localStorage.removeItem("SPAWNTEMP");
				}else{
					var x = ((p.a * 100) << 0) / 100;
					var y = ((p.b * 100) << 0) / 100;
					var z = ((p.c * 100) << 0) / 100;
					var r = ((Math.radToDeg(r.b) * 100) << 0) / 100;
					localStorage.setItem("SPAWNTEMP", x+","+y+","+z+","+r);
				}
				
				return true;
			break;
		}
		
		return false;
	},
	
	getDynamicVar: function(variable){
		var thus = this;
		switch (variable){
			case "SPAWNTEMP":
				var spawn = localStorage.getItem("SPAWNTEMP");
				if (spawn != null){
					setTimeout(function(){ thus.print("  -> " + spawn, "white"); },10);
				}else{
					setTimeout(function(){ thus.print("  -> NULL", "white"); },10);
				}
				return true;
			break;
		}
		
		return false;
	},
	
	createObject: function(object, params){
		var mapM = this.player.mapManager;
		var p = this.player.position;
		var d = this.player.rotation;
		
		var x = (p.a + Math.cos(d.b) * 2) << 0;
		var y = (p.b) << 0;
		var z = (p.c - Math.sin(d.b) * 2) << 0;
		
		document.getElementById("KT_textures_W").style.display = "none";
		document.getElementById("KT_textures_F").style.display = "none";
		document.getElementById("KT_textures_C").style.display = "none";
		
		var created = false;
		switch (object){
			case "LIFTER":
				var texture = mapM.game.getTextureById(1, "wall").texture;
				var lifter = new Lifter(vec3(x, y, z), texture, 1, mapM);
				this.currentObject = lifter;
				this.objectType = "lifter";
				mapM.instances.push(lifter);
				document.getElementById("KT_objLabel").value = "Lifter";
				document.getElementById("KT_textures_W").style.display = "block";
				
				created = true;
			break;
		}
		
		if (created){
			this.player.moved = true;
			this.syncObject();
			document.getElementById("DEBUGDIV").style.display = "block";
			document.getElementById("DEBUGDIV2").style.display = "block";
			
			return true;
		}
		
		return false;
	},
	
	print: function(msg, color){
		this.console.push({t: msg, o: color});
		if (this.console.length > 13)
			this.console.splice(0,1);
	},
	
	doCommand: function(){
		if (this.typing == "") return;
		
		if (this.commandsMem[this.commandsMem.length - 1] != this.typing)
			this.commandsMem.push(this.typing);
		if (this.commandsMem.length > 13)
			this.commandsMem.splice(0,1);
		
		var color = "rgb(0,255,0)";
		if (this.typing == "KTFLY"){
			this.fly = !this.fly;
			this.typing += " : " + ((this.fly)? "ON" : "OFF");
		}else if (this.typing == "KTNOCLIP"){
			this.clip = !this.clip;
			this.typing += " : " + ((this.clip)? "ON" : "OFF");
		}else if (this.typing.indexOf("KTSET") == 0){
			var params = this.typing.split(" ");
			if (!this.setDynamicVar(params[1], params[2])){
				color = "red";
			}
		}else if (this.typing.indexOf("KTGET") == 0){
			var params = this.typing.split(" ");
			if (!this.getDynamicVar(params[1])){
				color = "red";
			}
		}else if (this.typing.indexOf("KTCREATE") == 0){
			var params = this.typing.split(" ");
			if (!this.createObject(params[1], params[2])){
				color = "red";
			}
		}else{
			color = "red";
		}
		
		this.print(this.typing, color);
		
		this.typing = "";
		this.commandCur = this.commandsMem.length;
	},
	
	move: function(axis, amount){
		if (!this.currentObject) return;
		this.currentObject.position[axis] += amount;
		
		this.syncObject();
	},
	
	setValue: function(axis, txt){
		var value = parseFloat(txt.value);
		this.currentObject.position[axis] = value;
		
		this.syncObject();
	},
	
	changeHeight: function(height){
		if (!this.currentObject) return;
		
		switch (this.objectType){
			case "lifter":
				this.currentObject.height += height;
				this.currentObject.reassemble();
			break;
		}
		
		this.syncObject();
	},
	
	syncObject: function(){
		if (!this.currentObject) return;
		var obj = this.currentObject;
		
		document.getElementById("KT_x").value = Math.round(obj.position.a * 10) / 10;
		document.getElementById("KT_y").value = Math.round(obj.position.b * 10) / 10;
		document.getElementById("KT_z").value = Math.round(obj.position.c * 10) / 10;
		document.getElementById("KT_height").value = this.currentObject.height;
		
		var nodes = document.getElementsByTagName("img");
		for (var i=0,len=nodes.length;i<len;i++){
			nodes[i].className = "";
			if (nodes[i].textureIndex == obj.texture.textureIndex)
				nodes[i].className = "selected";
		}
	},
	
	changeTexture: function(texture){
		if (!this.currentObject) return;
		this.currentObject.texture = texture;
		this.syncObject();
	},
	
	setTextures: function(textures){
		for (var i=1,len=textures.wall.length;i<len;i++){
			var tex = textures.wall[i];
			if (!tex) continue;
			tex.onclick = function(){ DEBUG.changeTexture(this.texture); };
			document.getElementById("KT_textures_W").appendChild(tex);
		}
		
		for (var i=1,len=textures.floor.length;i<len;i++){
			var tex = textures.floor[i];
			if (!tex) continue;
			tex.onclick = function(){ DEBUG.changeTexture(this.texture); };
			document.getElementById("KT_textures_F").appendChild(tex);
		}
		
		for (var i=1,len=textures.ceil.length;i<len;i++){
			var tex = textures.ceil[i];
			if (!tex) continue;
			tex.onclick = function(){ DEBUG.changeTexture(this.texture); };
			document.getElementById("KT_textures_C").appendChild(tex);
		}
	},
	
	close: function(){
		document.getElementById("DEBUGDIV").style.display = "none";
		document.getElementById("DEBUGDIV2").style.display = "none";
		this.currentObject = null;
		this.objectType = "";
	}
};

Underworld.prototype.resetDebugParameters = function(){
	DEBUG.trianglesCount = 0;
	DEBUG.sectorsCount = 0;
	DEBUG.instancesCount = 0;
};

Underworld.prototype.showCommandConsole = function(/*float*/ now){
	var fps = Math.floor((++this.numberFrames) / ((now - this.firstFrame) / 1000));
	
	if (!DEBUG.onDebug) return;
	var ctx = this.UI.ctx;
	
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(0,0,ctx.width,ctx.height);
	
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.moveTo(16, ctx.height - 16);
	ctx.lineTo(ctx.width - 16, ctx.height - 16);
	ctx.stroke();
	
	ctx.font = '10px "Courier"';
	ctx.fillStyle = "white";
	
	ctx.fillText("FPS: " + fps + "/30", 16, 16);
	ctx.fillText("TriCount: " + DEBUG.trianglesCount, 16, 24);
	ctx.fillText("SecCount: " + DEBUG.sectorsCount, 16, 32);
	ctx.fillText("InsCount: " + DEBUG.instancesCount, 16, 40);
	
	ctx.fillText("> " + DEBUG.typing, 16, ctx.height - 8);
	
	for (var i=DEBUG.console.length - 1;i>=0;i--){
		ctx.fillStyle = DEBUG.console[i].o;
		ctx.fillText(DEBUG.console[i].t, 16, 164 - ((DEBUG.console.length - i) * 8));
	}
};

Underworld.prototype.debugLoop = function(/*float*/ now){
	if (this.keys[17] == 1 && this.getKeyPressed(67)){
		DEBUG.onDebug = !DEBUG.onDebug;
		DEBUG.typing = "";
		DEBUG.commandCur = DEBUG.commandsMem.length;
	}
	
	this.showCommandConsole(now);
};

Lifter.prototype.reassemble = function(){
	var gl = this.mapManager.game.GL.ctx;
	
	var c = ObjectFactory.cube(vec3(1.0, this.height, 1.0), vec2(1.0, this.height), gl);
	var f = ObjectFactory.floor(vec3(1.0, 0.0, 1.0), vec2(1.0, 1.0), gl);
	f = ObjectFactory.translateObject(f, vec3(0.0,this.height,0.0));
	
	var l = ObjectFactory.fuzeObjects([c, f]);
	l = ObjectFactory.translateObject(l, vec3(0.0,0.0,0.0));
	
	this.lifter = ObjectFactory.create3DObject(gl, l);
	this.lifter.position = this.position;
};
