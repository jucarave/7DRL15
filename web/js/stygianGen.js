(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/administrator/git/stygiangen/src/CA.js":[function(require,module,exports){
module.exports = {
	runCA: function(map, transformFunction, times, cross){
		for (var i = 0; i < times; i++){
			var newMap = [];
			for (var x = 0; x < map.length; x++){
				newMap[x] = [];
			}
			for (var x = 0; x < map.length; x++){
				for (var y = 0; y < map[x].length; y++){
					var surroundingMap = [];
					for (var xx = x-1; xx <= x+1; xx++){
						for (var yy = y-1; yy <= y+1; yy++){
							if (cross && !(xx == x || yy == y))
								continue;
							if (xx > 0 && xx < map.length && yy > 0 && yy < map[x].length){
								var cell = map[xx][yy];
								if (surroundingMap[cell])
									surroundingMap[cell]++;
								else
									surroundingMap[cell] = 1;
							}
						}
					}
					var newCell = transformFunction(map[x][y], surroundingMap);
					if (newCell){
						newMap[x][y] = newCell;
					} else {
						newMap[x][y] = map[x][y];
					}
				}
			}
			map = newMap;
		}
		return map;
	}
}
},{}],"/home/administrator/git/stygiangen/src/CanvasRenderer.class.js":[function(require,module,exports){
function CanvasRenderer(config){
	this.config = config;
}

CanvasRenderer.prototype = {
	drawSketch: function(level, canvas, overlay){
		var canvas = document.getElementById(canvas);
		var context = canvas.getContext('2d');
		context.font="16px Avatar";
		if (!overlay)
			context.clearRect(0, 0, canvas.width, canvas.height);
		var zoom = 8;
		for (var i = 0; i < level.areas.length; i++){
			var area = level.areas[i];
			context.beginPath();
			context.rect(area.x * zoom, area.y * zoom, area.w * zoom, area.h * zoom);
			if (!overlay){
				context.fillStyle = 'yellow';
				context.fill();
			}
			context.lineWidth = 2;
			context.strokeStyle = 'black';
			context.stroke();
			var areaDescription = '';
			if (area.areaType == 'rooms'){
				areaDescription = "Dungeon";
			} else if (area.floor == 'fakeWater'){ 
				areaDescription = "Lagoon";
			} else {
				areaDescription = "Cavern";
			}
			if (area.hasExit){
				areaDescription += " (d)";
			}
			if (area.hasEntrance){
				areaDescription += " (u)";
			}
			context.fillStyle = 'white';
			context.fillText(areaDescription,(area.x)* zoom + 5,(area.y )* zoom + 20);
			for (var j = 0; j < area.bridges.length; j++){
				var bridge = area.bridges[j];
				context.beginPath();
				context.rect((bridge.x) * zoom /*- zoom / 2*/, (bridge.y) * zoom /*- zoom / 2*/, zoom, zoom);
				context.lineWidth = 2;
				context.strokeStyle = 'red';
				context.stroke();
			}
		}
	},
	drawLevel: function(level, canvas){
		var canvas = document.getElementById(canvas);
		var context = canvas.getContext('2d');
		context.font="12px Georgia";
		context.clearRect(0, 0, canvas.width, canvas.height);
		var zoom = 8;
		var cells = level.cells;
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
				var color = '#FFFFFF';
				var cell = cells[x][y];
				if (cell === 'water'){
					color = '#0000FF';
				} else if (cell === 'lava'){
					color = '#FF0000';
				} else if (cell === 'fakeWater'){
					color = '#0000FF';
				}else if (cell === 'solidRock'){
					color = '#594B2D';
				}else if (cell === 'cavernFloor'){
					color = '#876418';
				}else if (cell === 'downstairs'){
					color = '#FF0000';
				}else if (cell === 'upstairs'){
					color = '#00FF00';
				}else if (cell === 'stoneWall'){
					color = '#BBBBBB';
				}else if (cell === 'stoneFloor'){
					color = '#666666';
				}else if (cell === 'corridor'){
					color = '#FF0000';
				}else if (cell === 'padding'){
					color = '#00FF00';
				}else if (cell === 'bridge'){
					color = '#946800';
				}
				context.fillStyle = color;
				context.fillRect(x * zoom, y * zoom, zoom, zoom);
			}
		}
		for (var i = 0; i < level.enemies.length; i++){
			var enemy = level.enemies[i];
			var color = '#FFFFFF';
			switch (enemy.code){
			case 'bat':
				color = '#EEEEEE';
				break;
			case 'lavaLizard':
				color = '#00FF88';
				break;
			case 'daemon':
				color = '#FF8800';
				break;
			}
			context.fillStyle = color;
			context.fillRect(enemy.x * zoom, enemy.y * zoom, zoom, zoom);
		}
		for (var i = 0; i < level.items.length; i++){
			var item = level.items[i];
			var color = '#FFFFFF';
			switch (item.code){
			case 'dagger':
				color = '#EEEEEE';
				break;
			case 'leatherArmor':
				color = '#00FF88';
				break;
			}
			context.fillStyle = color;
			context.fillRect(item.x * zoom, item.y * zoom, zoom, zoom);
		}
	},
	drawLevelWithIcons: function(level, canvas){
		var canvas = document.getElementById(canvas);
		var context = canvas.getContext('2d');
		context.font="12px Georgia";
		context.clearRect(0, 0, canvas.width, canvas.height);
		var zoom = 8;
		var water = new Image();
		water.src = 'img/water.png';
		var fakeWater = new Image();
		fakeWater.src = 'img/water.png';
		var solidRock = new Image();
		solidRock.src = 'img/solidRock.png';
		var cavernFloor = new Image();
		cavernFloor.src = 'img/cavernFloor.png';
		var downstairs = new Image();
		downstairs.src = 'img/downstairs.png';
		var upstairs = new Image();
		upstairs.src = 'img/upstairs.png';
		var stoneWall = new Image();
		stoneWall.src = 'img/stoneWall.png';
		var stoneFloor = new Image();
		stoneFloor.src = 'img/stoneFloor.png';
		var bridge = new Image();
		bridge.src = 'img/bridge.png';
		var lava = new Image();
		lava.src = 'img/lava.png';
		var bat = new Image();
		bat.src = 'img/bat.png';
		var lavaLizard = new Image();
		lavaLizard.src = 'img/lavaLizard.png';
		var daemon = new Image();
		daemon.src = 'img/daemon.png';
		var treasure = new Image();
		treasure.src = 'img/treasure.png';
		var tiles = {
			water: water,
			fakeWater: fakeWater,
			solidRock: solidRock,
			cavernFloor: cavernFloor,
			downstairs: downstairs,
			upstairs: upstairs,
			stoneWall: stoneWall,
			stoneFloor: stoneFloor,
			bridge: bridge,
			lava: lava,
			bat: bat,
			lavaLizard: lavaLizard,
			daemon: daemon,
			treasure: treasure
		}
	    var cells = level.cells;
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
				var cell = cells[x][y]; 
				context.drawImage(tiles[cell], x * 16, y * 16);
			}
		}
		for (var i = 0; i < level.enemies.length; i++){
			var enemy = level.enemies[i];
			context.drawImage(tiles[enemy.code], enemy.x * 16, enemy.y * 16);
		}
		for (var i = 0; i < level.items.length; i++){
			var item = level.items[i];
			context.drawImage(tiles['treasure'], item.x * 16, item.y * 16);
		}
	}
}

module.exports = CanvasRenderer;
},{}],"/home/administrator/git/stygiangen/src/FirstLevelGenerator.class.js":[function(require,module,exports){
function FirstLevelGenerator(config){
	this.config = config;
}

var Util = require('./Utils');
var Splitter = require('./Splitter');

FirstLevelGenerator.prototype = {
	generateLevel: function(depth){
		var hasRiver = depth < 6 && Util.chance(100 - depth * 15);
		var hasLava = depth > 5 && Util.chance(depth * 10 + 20);
		hasLava = Util.chance(50);
		hasRiver = Util.chance(50);
		
		var mainEntrance = depth == 1;
		var areas = this.generateAreas(hasLava);
		this.placeExits(areas);
		var level = {
			hasRivers: hasRiver,
			hasLava: hasLava,
			mainEntrance: mainEntrance,
			strata: 'solidRock',
			areas: areas
		}
		return level;
	},
	generateAreas: function(hasLava){
		var bigArea = {
			x: 0,
			y: 0,
			w: this.config.LEVEL_WIDTH,
			h: this.config.LEVEL_HEIGHT
		}
		var maxDepth = this.config.SUBDIVISION_DEPTH;
		var MIN_WIDTH = this.config.MIN_WIDTH;
		var MIN_HEIGHT = this.config.MIN_HEIGHT;
		var MAX_WIDTH = this.config.MAX_WIDTH;
		var MAX_HEIGHT = this.config.MAX_HEIGHT;
		var SLICE_RANGE_START = this.config.SLICE_RANGE_START;
		var SLICE_RANGE_END = this.config.SLICE_RANGE_END;
		var areas = Splitter.subdivideArea(bigArea, maxDepth, MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, SLICE_RANGE_START, SLICE_RANGE_END);
		Splitter.connectAreas(areas,3);
		for (var i = 0; i < areas.length; i++){
			var area = areas[i];
			if (Util.chance(70)){ //TODO: Define areas based on depth
				area.areaType = 'cavern';
				area.areaId = 'c1';
				if (hasLava){
					area.floor = 'cavernFloor';
					area.cavernType = Util.randomElementOf(['rocky','bridges']);
				} else {
					area.floor = Util.chance(50)?'fakeWater':'cavernFloor';
					area.cavernType = Util.randomElementOf(['rocky','bridges','watery']);
				}
			} else {
				area.areaType = 'rooms';
				area.areaId = 'c1';
				area.floor = 'stoneFloor';
				area.wall = Util.chance(50) ? 'stoneWall' : false;
				area.corridor = 'stoneFloor';
			}
			area.enemies = ['bat', 'lavaLizard'];
			area.enemyCount = Util.rand(3,5);
			if (Util.chance(20))
				area.boss = 'daemon';
			area.items = ['dagger']
		}
		return areas;
	},
	placeExits: function(areas){
		var dist = null;
		var area1 = null;
		var area2 = null;
		var fuse = 1000;
		do {
			area1 = Util.randomElementOf(areas);
			area2 = Util.randomElementOf(areas);
			if (fuse < 0){
				break;
			}
			dist = Util.lineDistance(area1, area2);
			fuse--;
		} while (dist < (this.config.LEVEL_WIDTH + this.config.LEVEL_HEIGHT) / 3);
		area1.hasExit = true;
		area2.hasEntrance = true;
	}
}

module.exports = FirstLevelGenerator;
},{"./Splitter":"/home/administrator/git/stygiangen/src/Splitter.js","./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/Generator.class.js":[function(require,module,exports){
function Generator(config){
	this.config = config;
	this.firstLevelGenerator = new FirstLevelGenerator(config);
	this.secondLevelGenerator = new SecondLevelGenerator(config);
	this.thirdLevelGenerator = new ThirdLevelGenerator(config);
	this.monsterPopulator = new MonsterPopulator(config);
	this.itemPopulator = new ItemPopulator(config);
}

var FirstLevelGenerator = require('./FirstLevelGenerator.class');
var SecondLevelGenerator = require('./SecondLevelGenerator.class');
var ThirdLevelGenerator = require('./ThirdLevelGenerator.class');
var MonsterPopulator = require('./MonsterPopulator.class');
var ItemPopulator = require('./ItemPopulator.class');

Generator.prototype = {
	generateLevel: function(depth){
		var sketch = this.firstLevelGenerator.generateLevel(depth);
		var level = this.secondLevelGenerator.fillLevel(sketch);
		this.thirdLevelGenerator.fillLevel(sketch, level);
		this.monsterPopulator.populateLevel(sketch, level);
		this.itemPopulator.populateLevel(sketch, level);
		return {
			sketch: sketch,
			level: level
		}
	}
}

module.exports = Generator;
},{"./FirstLevelGenerator.class":"/home/administrator/git/stygiangen/src/FirstLevelGenerator.class.js","./ItemPopulator.class":"/home/administrator/git/stygiangen/src/ItemPopulator.class.js","./MonsterPopulator.class":"/home/administrator/git/stygiangen/src/MonsterPopulator.class.js","./SecondLevelGenerator.class":"/home/administrator/git/stygiangen/src/SecondLevelGenerator.class.js","./ThirdLevelGenerator.class":"/home/administrator/git/stygiangen/src/ThirdLevelGenerator.class.js"}],"/home/administrator/git/stygiangen/src/ItemPopulator.class.js":[function(require,module,exports){
function ItemPopulator(config){
	this.config = config;
}

var Util = require('./Utils');

ItemPopulator.prototype = {
	populateLevel: function(sketch, level){
		for (var i = 0; i < sketch.areas.length; i++){
			var area = sketch.areas[i];
			this.populateArea(area, level);
		}
	},
	populateArea: function(area, level){
		for (var i = 0; i < area.items.length; i++){
			var position = level.getFreePlace(area);
			level.addItem(area.items[i], position.x, position.y);
		}
	}
}

module.exports = ItemPopulator;
},{"./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/KramgineExporter.class.js":[function(require,module,exports){
function KramgineExporter(config){
	this.config = config;
}

KramgineExporter.prototype = {
	getLevel: function(level){
		var tiles = this.getTiles();
		var objects = this.getObjects(level);
		var map = this.getMap(level);
		return {
			tiles: tiles,
			objects: objects,
			map: map
		};
	},
	BASIC_WALL_TILE: {
        "w":2,
        "y":0,
        "h":2,
        "c":0,
        "f":0,
        "ch":2,
        "sl":0,
        "dir":0,
        "fy":0
    },
    BASIC_FLOOR_TILE: {
    	"w":0,
        "y":0,
        "h":2,
        "c":2,
        "f":2,
        "ch":2,
        "sl":0,
        "dir":0,
        "fy":0
    },
    WATER_TILE: {
    	"w":0,
    	"y":0,
    	"h":2,
    	"c":2,
    	"f":101,
    	"ch":2,
    	"sl":0,
    	"dir":0,
    	"fy":0
	},
	LAVA_TILE: {
    	"w":0,
    	"y":0,
    	"h":2,
    	"c":2,
    	"f":101,
    	"ch":2,
    	"sl":0,
    	"dir":0,
    	"fy":0
	},
	getTiles: function(){
		return [
	        null, 
	        this.BASIC_WALL_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.BASIC_WALL_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.BASIC_FLOOR_TILE,
	        this.LAVA_TILE,
	        this.WATER_TILE
		];
	},
	getObjects: function(level){
		var objects = [];
		objects.push({
			x: level.start.x,
			z: level.start.y,
			y: 0,
			dir: 3,
			type: 'player'
		});
		return objects;
	},
	getMap: function(level){
		var map = [];
		var cells = level.cells;
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			map[x] = [];
			for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
				var cell = cells[x][y];
				var id = null;
				if (cell === 'water'){
					id = 10;
				} else if (cell === 'fakeWater'){
					id = 10;
				}else if (cell === 'solidRock'){
					id = 1;
				}else if (cell === 'cavernFloor'){
					id = 2;
				}else if (cell === 'downstairs'){
					id = 3;
				}else if (cell === 'upstairs'){
					id = 4;
				}else if (cell === 'stoneWall'){
					id = 5;
				}else if (cell === 'stoneFloor'){
					id = 6;
				}else if (cell === 'corridor'){
					id = 7;
				}else if (cell === 'bridge'){
					id = 8;
				}else if (cell === 'lava'){
					id = 9;
				}
				map[x][y] = id;
			}
		}
		return map;
	}
}

module.exports = KramgineExporter;
},{}],"/home/administrator/git/stygiangen/src/Level.class.js":[function(require,module,exports){
function Level(config){
	this.config = config;
};

var Util = require('./Utils');

Level.prototype = {
	init: function(){
		this.cells = [];
		this.enemies = [];
		this.items = [];
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			this.cells[x] = [];
		}
	},
	addEnemy: function(enemy, x, y){
		this.enemies.push({
			code: enemy,
			x: x,
			y: y
		});
	},
	addItem: function(item, x, y){
		this.items.push({
			code: item,
			x: x,
			y: y
		});
	},
	getFreePlace: function(area){
		while(true){
			var randPoint = {
				x: Util.rand(area.x, area.x+area.w-1),
				y: Util.rand(area.y, area.y+area.h-1)
			}
			var cell = this.cells[randPoint.x][randPoint.y]; 
			if (cell == area.floor || area.corridor && cell == area.corridor || cell == 'fakeWater')
				return randPoint;
		}
	}
};

module.exports = Level;
},{"./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/MonsterPopulator.class.js":[function(require,module,exports){
function MonsterPopulator(config){
	this.config = config;
}

var Util = require('./Utils');

MonsterPopulator.prototype = {
	populateLevel: function(sketch, level){
		for (var i = 0; i < sketch.areas.length; i++){
			var area = sketch.areas[i];
			this.populateArea(area, level);
		}
	},
	populateArea: function(area, level){
		for (var i = 0; i < area.enemyCount; i++){
			var position = level.getFreePlace(area);
			if (position){
				this.addMonster(area,  position.x, position.y, level);
			}
		}
		if (area.boss){
			var position = level.getFreePlace(area);
			if (position){
				level.addEnemy(area.boss, position.x, position.y);
			}
		}
	},
	addMonster: function(area, x, y, level){
		var monster = Util.randomElementOf(area.enemies);
		level.addEnemy(monster, x, y);
	}
}

module.exports = MonsterPopulator;
},{"./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/SecondLevelGenerator.class.js":[function(require,module,exports){
function SecondLevelGenerator(config){
	this.config = config;
}

var Util = require('./Utils');
var Level = require('./Level.class');
var CA = require('./CA');

SecondLevelGenerator.prototype = {
	fillLevel: function(sketch){
		var level = new Level(this.config);
		level.init();
		this.fillStrata(level, sketch);
		if (sketch.hasRivers)
			this.plotRivers(level, sketch, 'water');
		if (sketch.hasLava)
			this.plotRivers(level, sketch, 'lava');
		this.copyGeo(level);
		return level;
	},
	fillStrata: function(level, sketch){
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
				level.cells[x][y] = sketch.strata;
			}
		}
	},
	copyGeo: function(level){
		var geo = [];
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			geo[x] = [];
			for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
				geo[x][y] = level.cells[x][y];
			}
		}
		level.geo = geo;
	},
	plotRivers: function(level, sketch, liquid){
		this.placeRiverlines(level, sketch, liquid);
		this.fattenRivers(level, liquid);
		if (liquid == 'lava')
			this.fattenRivers(level, liquid);
	},
	fattenRivers: function(level, liquid){
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding[liquid] > 1 && Util.chance(30))
				return liquid;
			return false;
		}, 1, true);
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding[liquid] > 1)
				return liquid;
			return false;
		}, 1, true);
	},
	placeRiverlines: function(level, sketch, liquid){
		// Place random line segments of water
		var rivers = Util.rand(this.config.MIN_RIVERS,this.config.MAX_RIVERS);
		var riverSegmentLength = this.config.RIVER_SEGMENT_LENGTH;
		var puddle = false;
		for (var i = 0; i < rivers; i++){
			var segments = Util.rand(this.config.MIN_RIVER_SEGMENTS,this.config.MAX_RIVER_SEGMENTS);
			var riverPoints = [];
			riverPoints.push({
				x: Util.rand(0, this.config.LEVEL_WIDTH),
				y: Util.rand(0, this.config.LEVEL_HEIGHT)
			});
			for (var j = 0; j < segments; j++){
				var randomPoint = Util.randomElementOf(riverPoints);
				if (riverPoints.length > 1 && !puddle)
					Util.removeFromArray(riverPoints, randomPoint);
				var iance = {
					x: Util.rand(-riverSegmentLength, riverSegmentLength),
					y: Util.rand(-riverSegmentLength, riverSegmentLength)
				};
				var newPoint = {
					x: randomPoint.x + iance.x,
					y: randomPoint.y + iance.y,
				};
				if (newPoint.x > 0 && newPoint.x < this.config.LEVEL_WIDTH && 
					newPoint.y > 0 && newPoint.y < this.config.LEVEL_HEIGHT)
					riverPoints.push(newPoint);
				var line = Util.line(randomPoint, newPoint);
				for (var k = 0; k < line.length; k++){
					var point = line[k];
					if (point.x > 0 && point.x < this.config.LEVEL_WIDTH && 
						point.y > 0 && point.y < this.config.LEVEL_HEIGHT)
					level.cells[point.x][point.y] = liquid;
				}
			}
		}
	}
}

module.exports = SecondLevelGenerator;
},{"./CA":"/home/administrator/git/stygiangen/src/CA.js","./Level.class":"/home/administrator/git/stygiangen/src/Level.class.js","./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/Splitter.js":[function(require,module,exports){
var Util = require('./Utils');

module.exports = {
	subdivideArea: function(bigArea, maxDepth, MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, SLICE_RANGE_START, SLICE_RANGE_END, avoidPoints){
		var areas = [];
		var bigAreas = [];
		bigArea.depth = 0;
		bigAreas.push(bigArea);
		var retries = 0;
		while (bigAreas.length > 0){
			var bigArea = bigAreas.pop();
			var horizontalSplit = Util.chance(50);
			if (bigArea.w < MIN_WIDTH * 1.5 && bigArea.h < MIN_HEIGHT * 1.5){
				bigArea.bridges = [];
				areas.push(bigArea);
				continue;
			} else if (bigArea.w < MIN_WIDTH * 1.5){
				horizontalSplit = true;
			} else if (bigArea.h < MIN_HEIGHT * 1.5){
				horizontalSplit = false;
			}
			var area1 = null;
			var area2 = null;
			if (horizontalSplit){
				var slice = Math.round(Util.rand(bigArea.h * SLICE_RANGE_START, bigArea.h * SLICE_RANGE_END));
				area1 = {
					x: bigArea.x,
					y: bigArea.y,
					w: bigArea.w,
					h: slice
				};
				area2 = {
					x: bigArea.x,
					y: bigArea.y + slice,
					w: bigArea.w,
					h: bigArea.h - slice
				}
			} else {
				var slice = Math.round(Util.rand(bigArea.w * SLICE_RANGE_START, bigArea.w * SLICE_RANGE_END));
				area1 = {
					x: bigArea.x,
					y: bigArea.y,
					w: slice,
					h: bigArea.h
				}
				area2 = {
					x: bigArea.x+slice,
					y: bigArea.y,
					w: bigArea.w-slice,
					h: bigArea.h
				};
			}
			if (area1.w < MIN_WIDTH || area1.h < MIN_HEIGHT ||
				area2.w < MIN_WIDTH || area2.h < MIN_HEIGHT){
				bigArea.bridges = [];
				areas.push(bigArea);
				continue;
			}
			if (bigArea.depth == maxDepth && 
					(area1.w > MAX_WIDTH || area1.h > MAX_HEIGHT ||
					area2.w > MAX_WIDTH || area2.h > MAX_HEIGHT)){
				if (retries < 100) {
					// Push back big area
					bigAreas.push(bigArea);
					retries++;
					continue;
				}		
			}
			if (avoidPoints && (this.collidesWith(avoidPoints, area2) || this.collidesWith(avoidPoints, area1))){
				if (retries > 100){
					bigArea.bridges = [];
					areas.push(bigArea);
					retries = 0;
				} else {
					// Push back big area
					bigAreas.push(bigArea);
					retries++;
				}		
				continue; 
			}
			if (bigArea.depth == maxDepth){
				area1.bridges = [];
				area2.bridges = [];
				areas.push(area1);
				areas.push(area2);
			} else {
				area1.depth = bigArea.depth +1;
				area2.depth = bigArea.depth +1;
				bigAreas.push(area1);
				bigAreas.push(area2);
			}
		}
		return areas;
	},
	collidesWith: function(avoidPoints, area){
		for (var i = 0; i < avoidPoints.length; i++){
			var avoidPoint = avoidPoints[i];
			if (Util.flatDistance(area.x, area.y, avoidPoint.x, avoidPoint.y) <= 2 ||
				Util.flatDistance(area.x+area.w, area.y, avoidPoint.x, avoidPoint.y) <= 2 ||
				Util.flatDistance(area.x, area.y+area.h, avoidPoint.x, avoidPoint.y) <= 2 ||
				Util.flatDistance(area.x+area.w, area.y+area.h, avoidPoint.x, avoidPoint.y) <= 2){
				return true;
			}
		}
		return false;
	},
	connectAreas: function(areas, border){
		/* Make one area connected
		 * While not all areas connected,
		 *  Select a connected area
		 *  Select a valid wall from the area
		 *  Tear it down, connecting to the a nearby area
		 *  Mark area as connected
		 */
		if (!border){
			border = 1;
		}
		var connectedAreas = [];
		var randomArea = Util.randomElementOf(areas);
		connectedAreas.push(randomArea);
		var cursor = {};
		var vari = {};
		area: while (connectedAreas.length < areas.length){
			randomArea = Util.randomElementOf(connectedAreas);
			var wallDir = Util.rand(1,4);
			switch(wallDir){
			case 1: // Left
				cursor.x = randomArea.x;
				cursor.y = Util.rand(randomArea.y + border , randomArea.y+randomArea.h - border);
				vari.x = -2;
				vari.y = 0;
				break;
			case 2: //Right
				cursor.x = randomArea.x + randomArea.w;
				cursor.y = Util.rand(randomArea.y + border, randomArea.y+randomArea.h - border);
				vari.x = 2;
				vari.y = 0;
				break;
			case 3: //Up
				cursor.x = Util.rand(randomArea.x + border, randomArea.x+randomArea.w - border);
				cursor.y = randomArea.y;
				vari.x = 0;
				vari.y = -2;
				break;
			case 4: //Down
				cursor.x = Util.rand(randomArea.x + border, randomArea.x+randomArea.w - border);
				cursor.y = randomArea.y + randomArea.h;
				vari.x = 0;
				vari.y = 2;
				break;
			}
			var connectedArea = this.getAreaAt(cursor, vari, areas);
			if (connectedArea && !Util.contains(connectedAreas, connectedArea)){
				switch(wallDir){
				case 1:
				case 2:
					if (cursor.y <= connectedArea.y + border || cursor.y >= connectedArea.y + connectedArea.h - border)
						continue area;
					break;
				case 3:
				case 4:
					if (cursor.x <= connectedArea.x + border || cursor.x >= connectedArea.x + connectedArea.w - border)
						continue area;
					break;
				}
				
				this.connectArea(randomArea, connectedArea, cursor);
				connectedAreas.push(connectedArea);
			}
		}
	},
	getAreaAt: function(cursor, vari, areas){
		for (var i = 0; i < areas.length; i++){
			var area = areas[i];
			if (cursor.x + vari.x >= area.x && cursor.x + vari.x <= area.x + area.w 
					&& cursor.y + vari.y >= area.y && cursor.y + vari.y <= area.y + area.h)
				return area;
		}
		return false;
	},
	connectArea: function(area1, area2, position){
		area1.bridges.push({
			x: position.x,
			y: position.y,
			to: area2
		});
		area2.bridges.push({
			x: position.x,
			y: position.y,
			to: area1
		});
	}
}
},{"./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/ThirdLevelGenerator.class.js":[function(require,module,exports){
function ThirdLevelGenerator(config){
	this.config = config;
}

var Util = require('./Utils');
var CA = require('./CA');
var Splitter = require('./Splitter');

ThirdLevelGenerator.prototype = {
	fillLevel: function(sketch, level){
		this.fillRooms(sketch, level)
		this.fattenCaverns(level);
		this.placeExits(sketch, level);
		this.raiseIslands(level);
		return level;
	},
	fattenCaverns: function(level){
		// Grow caverns
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding['cavernFloor'] > 0 && Util.chance(20))
				return 'cavernFloor';
			return false;
		}, 1, true);
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding['cavernFloor'] > 1)
				return 'cavernFloor';
			return false;
		}, 1, true);
		// Grow lagoon areas
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding['fakeWater'] > 0 && Util.chance(40))
				return 'fakeWater';
			return false;
		}, 1, true);
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (surrounding['fakeWater'] > 0)
				return 'fakeWater';
			return false;
		}, 1, true);
		
		
		// Expand wall-less rooms
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'solidRock')
				return false;
			if (surrounding['stoneFloor'] > 2 && Util.chance(10))
				return 'cavernFloor';
			return false;
		}, 1);
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'solidRock')
				return false;
			if (surrounding['stoneFloor'] > 0 && surrounding['cavernFloor']>0)
				return 'cavernFloor';
			return false;
		}, 1, true);
		// Deteriorate wall rooms
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'stoneWall')
				return false;
			if (surrounding['stoneFloor'] > 0 && Util.chance(5))
				return 'stoneFloor';
			return false;
		}, 1, true);
		
	},
	raiseIslands: function(level){
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'water')
				return false;
			var caverns = surrounding['cavernFloor']; 
			if (caverns > 0 && Util.chance(70))
				return 'cavernFloor';
			return false;
		}, 1, true);
		// Island for exits on water
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'fakeWater' && current != 'water')
				return false;
			var stairs = surrounding['downstairs'] ? surrounding['downstairs'] : 0 +
					surrounding['upstairs'] ? surrounding['upstairs'] : 0; 
			if (stairs > 0)
				return 'cavernFloor';
			return false;
		}, 1);
	},
	fillRooms: function(sketch, level){
		for (var i = 0; i < sketch.areas.length; i++){
			var area = sketch.areas[i];
			var type = area.areaType;
			if (type === 'cavern'){ 
				this.fillWithCavern(level, area);
			} else if (type === 'rooms'){
				this.fillWithRooms(level, area);
			}
		}
	},
	placeExits: function(sketch, level){
		for (var i = 0; i < sketch.areas.length; i++){
			var area = sketch.areas[i];
			if (!area.hasExit && !area.hasEntrance)
				continue;
			var tile = null;
			if (area.hasExit){
				tile = 'downstairs';
			} else {
				tile = 'upstairs';
			}
			var freeSpot = level.getFreePlace(area);
			level.cells[freeSpot.x][freeSpot.y] = tile;
			if (area.hasExit){
				level.end = {
					x: freeSpot.x,
					y: freeSpot.y
				};
			} else {
				level.start = {
					x: freeSpot.x,
					y: freeSpot.y
				};
			}
		}
	},
	fillWithCavern: function(level, area){
		// Connect all bridges with midpoint
		var midpoint = {
			x: Math.round(Util.rand(area.x + area.w * 1/3, area.x+area.w * 2/3)),
			y: Math.round(Util.rand(area.y + area.h * 1/3, area.y+area.h * 2/3))
		}
		for (var i = 0; i < area.bridges.length; i++){
			var bridge = area.bridges[i];
			var line = Util.line(midpoint, bridge);
			for (var j = 0; j < line.length; j++){
				var point = line[j];
				var currentCell = level.cells[point.x][point.y];
				if (area.cavernType == 'rocky')
					level.cells[point.x][point.y] = area.floor;
				else if (currentCell == 'water' || currentCell == 'lava'){
					if (area.floor != 'fakeWater' && area.cavernType == 'bridges')
						level.cells[point.x][point.y] = 'bridge';
					else
						level.cells[point.x][point.y] = 'fakeWater';
				} else {
					level.cells[point.x][point.y] = area.floor;
				}
			}
		}
		// Scratch the area
		var scratches = Util.rand(2,4);
		var caveSegments = [];
		caveSegments.push(midpoint);
		for (var i = 0; i < scratches; i++){
			var p1 = Util.randomElementOf(caveSegments);
			if (caveSegments.length > 1)
				Util.removeFromArray(caveSegments, p1);
			var p2 = {
				x: Util.rand(area.x, area.x+area.w-1),
				y: Util.rand(area.y, area.y+area.h-1)
			}
			caveSegments.push(p2);
			var line = Util.line(p2, p1);
			for (var j = 0; j < line.length; j++){
				var point = line[j];
				var currentCell = level.cells[point.x][point.y];
				if (currentCell != 'water' && currentCell != 'lava')  
					level.cells[point.x][point.y] = area.floor;
			}
		}
	},
	fillWithRooms: function(level, area){
		var bigArea = {
			x: area.x,
			y: area.y,
			w: area.w,
			h: area.h
		}
		var maxDepth = 2;
		var MIN_WIDTH = 6;
		var MIN_HEIGHT = 6;
		var MAX_WIDTH = 10;
		var MAX_HEIGHT = 10;
		var SLICE_RANGE_START = 3/8;
		var SLICE_RANGE_END = 5/8;
		var areas = Splitter.subdivideArea(bigArea, maxDepth, MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT, SLICE_RANGE_START, SLICE_RANGE_END, area.bridges);
		Splitter.connectAreas(areas, area.wall ? 2 : 1); 
		var bridgeAreas = [];
		for (var i = 0; i < areas.length; i++){
			var subarea = areas[i];
			for (var j = 0; j < area.bridges.length; j++){
				var bridge = area.bridges[j];
				if (Splitter.getAreaAt(bridge,{x:0,y:0}, areas) == subarea){
					if (!Util.contains(bridgeAreas, subarea)){
						bridgeAreas.push(subarea);
					}
					subarea.bridges.push({
						x: bridge.x,
						y: bridge.y
					});
				}
			}
		}
		this.useAreas(bridgeAreas, areas, bigArea);
		for (var i = 0; i < areas.length; i++){
			var subarea = areas[i];
			if (!subarea.render)
				continue;
			subarea.floor = area.floor;
			subarea.wall = area.wall;
			subarea.corridor = area.corridor;
			this.carveRoomAt(level, subarea);
		}
	},
	carveRoomAt: function(level, area){
		var minbox = {
			x: area.x + Math.floor(area.w / 2)-1,
			y: area.y + Math.floor(area.h / 2)-1,
			x2: area.x + Math.floor(area.w / 2)+1,
			y2: area.y + Math.floor(area.h / 2)+1,
		};
		// Trace corridors from exits
		for (var i = 0; i < area.bridges.length; i++){
			var bridge = area.bridges[i];
			var verticalBridge = false;
			var horizontalBridge = false;
			if (bridge.x == area.x){
				// Left Corridor
				horizontalBridge = true;
				for (var j = bridge.x; j < bridge.x + area.w / 2; j++){
					if (area.wall){
						if (level.cells[j][bridge.y-1] != area.corridor) level.cells[j][bridge.y-1] = area.wall;
						if (level.cells[j][bridge.y+1] != area.corridor) level.cells[j][bridge.y+1] = area.wall;
					}
					if (level.cells[j][bridge.y] == 'water' || level.cells[j][bridge.y] == 'lava'){ 
						level.cells[j][bridge.y] = 'bridge';
					} else {
						level.cells[j][bridge.y] = area.corridor;
					}
						
				}
			} else if (bridge.x == area.x + area.w){
				// Right corridor
				horizontalBridge = true;
				for (var j = bridge.x; j >= bridge.x - area.w / 2; j--){
					if (area.wall){
						if (level.cells[j][bridge.y-1] != area.corridor) level.cells[j][bridge.y-1] = area.wall;
						if (level.cells[j][bridge.y+1] != area.corridor) level.cells[j][bridge.y+1] = area.wall;
					} 
					if (level.cells[j][bridge.y] == 'water' || level.cells[j][bridge.y] == 'lava'){ 
						level.cells[j][bridge.y] = 'bridge';
					} else {
						level.cells[j][bridge.y] = area.corridor;
					}
				}
			} else if (bridge.y == area.y){
				// Top corridor
				verticalBridge = true;
				for (var j = bridge.y; j < bridge.y + area.h / 2; j++){
					if (area.wall){
						if (level.cells[bridge.x-1][j] != area.corridor) level.cells[bridge.x-1][j] = area.wall;
						if (level.cells[bridge.x+1][j] != area.corridor) level.cells[bridge.x+1][j] = area.wall;
					} 
					if (level.cells[bridge.x][j] == 'water' || level.cells[bridge.x][j] == 'lava'){ 
						level.cells[bridge.x][j] = 'bridge';
					} else {
						level.cells[bridge.x][j] = area.corridor;
					}
				}
			} else {
				// Down Corridor
				verticalBridge = true;
				for (var j = bridge.y; j >= bridge.y - area.h / 2; j--){
					if (area.wall){
						if (level.cells[bridge.x-1][j] != area.corridor) level.cells[bridge.x-1][j] = area.wall;
						if (level.cells[bridge.x+1][j] != area.corridor) level.cells[bridge.x+1][j] = area.wall; 
					} 
					if (level.cells[bridge.x][j] == 'water' || level.cells[bridge.x][j] == 'lava'){ 
						level.cells[bridge.x][j] = 'bridge';
					} else {
						level.cells[bridge.x][j] = area.corridor;
					}
				}
			}
			if (verticalBridge){
				if (bridge.x < minbox.x)
					minbox.x = bridge.x;
				if (bridge.x > minbox.x2)
					minbox.x2 = bridge.x;
			}
			if (horizontalBridge){
				if (bridge.y < minbox.y)
					minbox.y = bridge.y;
				if (bridge.y > minbox.y2)
					minbox.y2 = bridge.y;
			}
		}
		var minPadding = 0;
		if (area.wall)
			minPadding = 1;
		var padding = {
			top: Util.rand(minPadding, minbox.y - area.y - minPadding),
			bottom: Util.rand(minPadding, area.y + area.h - minbox.y2 - minPadding),
			left: Util.rand(minPadding, minbox.x - area.x - minPadding),
			right: Util.rand(minPadding, area.x + area.w - minbox.x2 - minPadding)
		};
		if (padding.top < 0) padding.top = 0;
		if (padding.bottom < 0) padding.bottom = 0;
		if (padding.left < 0) padding.left = 0;
		if (padding.right < 0) padding.right = 0;
		var roomx = area.x;
		var roomy = area.y;
		var roomw = area.w;
		var roomh = area.h;
		for (var x = roomx; x < roomx + roomw; x++){
			for (var y = roomy; y < roomy + roomh; y++){
				var drawWall = area.wall && level.cells[x][y] != area.corridor && level.cells[x][y] != 'bridge'; 
				if (y < roomy + padding.top){
					if (drawWall && y == roomy + padding.top - 1 && x + 1 >= roomx + padding.left && x <= roomx + roomw - padding.right)
						level.cells[x][y] = area.wall;
					//level.cells[x][y] = 'padding';
				} else if (x < roomx + padding.left){
					if (drawWall && x == roomx + padding.left - 1 && y >= roomy + padding.top && y <= roomy + roomh - padding.bottom)
						level.cells[x][y] = area.wall;
					//level.cells[x][y] = 'padding';
				} else if (y > roomy + roomh - 1 - padding.bottom){
					if (drawWall && y == roomy + roomh - padding.bottom && x + 1 >= roomx + padding.left && x <= roomx + roomw - padding.right)
						level.cells[x][y] = area.wall;
					//level.cells[x][y] = 'padding';
				} else if (x > roomx + roomw - 1 - padding.right){
					if (drawWall && x == roomx + roomw - padding.right && y >= roomy + padding.top && y <= roomy + roomh - padding.bottom)
						level.cells[x][y] = area.wall;
					//level.cells[x][y] = 'padding';
				} else if (area.marked)
					level.cells[x][y] = 'padding';
				else
					level.cells[x][y] = area.floor;
			}
		}
		
	},
	useAreas: function(keepAreas, areas, bigArea){
		// All keep areas should be connected with a single pivot area
		var pivotArea = Splitter.getAreaAt({x: Math.round(bigArea.x + bigArea.w/2), y: Math.round(bigArea.y + bigArea.h/2)},{x:0,y:0}, areas);
		var pathAreas = [];
		for (var i = 0; i < keepAreas.length; i++){
			var keepArea = keepAreas[i];
			keepArea.render = true;
			var areasPath = this.getDrunkenAreasPath(keepArea, pivotArea, areas);
			for (var j = 0; j < areasPath.length; j++){
				areasPath[j].render = true;
			}
		}
		for (var i = 0; i < areas.length; i++){
			var area = areas[i];
			if (!area.render){
				bridgesRemove: for (var j = 0; j < area.bridges.length; j++){
					var bridge = area.bridges[j];
					if (!bridge.to)
						continue;
					for (var k = 0; k < bridge.to.bridges.length; k++){
						var sourceBridge = bridge.to.bridges[k];
						if (sourceBridge.x == bridge.x && sourceBridge.y == bridge.y){
							Util.removeFromArray(bridge.to.bridges, sourceBridge);
						}
					}
				}
			}
		}
	},
	getDrunkenAreasPath: function (fromArea, toArea, areas){
		var currentArea = fromArea;
		var path = [];
		path.push(fromArea);
		path.push(toArea);
		if (fromArea == toArea)
			return path;
		while (true){
			var randomBridge = Util.randomElementOf(currentArea.bridges);
			if (!randomBridge.to)
				continue;
			if (!Util.contains(path, randomBridge.to)){
				path.push(randomBridge.to);
			}
			if (randomBridge.to == toArea)
				break;
			currentArea = randomBridge.to;
		}
		return path;
	}
	
}

module.exports = ThirdLevelGenerator;
},{"./CA":"/home/administrator/git/stygiangen/src/CA.js","./Splitter":"/home/administrator/git/stygiangen/src/Splitter.js","./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/Utils.js":[function(require,module,exports){
module.exports = {
	rand: function (low, hi){
		return Math.floor(Math.random() * (hi - low + 1))+low;
	},
	randomElementOf: function (array){
		return array[Math.floor(Math.random()*array.length)];
	},
	distance: function (x1, y1, x2, y2) {
		return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
	},
	flatDistance: function(x1, y1, x2, y2){
		var xDist = Math.abs(x1 - x2);
		var yDist = Math.abs(y1 - y2);
		if (xDist === yDist)
			return xDist;
		else
			return xDist + yDist;
	},
	lineDistance: function(point1, point2){
	  var xs = 0;
	  var ys = 0;
	  xs = point2.x - point1.x;
	  xs = xs * xs;
	  ys = point2.y - point1.y;
	  ys = ys * ys;
	  return Math.sqrt( xs + ys );
	},
	direction: function (a,b){
		return {x: sign(b.x - a.x), y: sign(b.y - a.y)};
	},
	chance: function (chance){
		return this.rand(0,100) <= chance;
	},
	contains: function(array, element){
	    return array.indexOf(element) > -1;
	},
	removeFromArray: function(array, object) {
		for (var i = 0; i < array.length; i++){
			if (array[i] == object){
				this.removeFromArrayIndex(array, i,i);
				return;
			}
		}
	},
	removeFromArrayIndex: function(array, from, to) {
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		return array.push.apply(array, rest);
	},
	line: function (a, b){
		var coordinatesArray = new Array();
		var x1 = a.x;
		var y1 = a.y;
		var x2 = b.x;
		var y2 = b.y;
	    var dx = Math.abs(x2 - x1);
	    var dy = Math.abs(y2 - y1);
	    var sx = (x1 < x2) ? 1 : -1;
	    var sy = (y1 < y2) ? 1 : -1;
	    var err = dx - dy;
	    coordinatesArray.push({x: x1, y: y1});
	    while (!((x1 == x2) && (y1 == y2))) {
	    	var e2 = err << 1;
	    	if (e2 > -dy) {
	    		err -= dy;
	    		x1 += sx;
	    	}
	    	if (e2 < dx) {
	    		err += dx;
	    		y1 += sy;
	    	}
	    	coordinatesArray.push({x: x1, y: y1});
	    }
	    return coordinatesArray;
	}
}
},{}],"/home/administrator/git/stygiangen/src/WebTest.js":[function(require,module,exports){
window.Generator = require('./Generator.class');
window.CanvasRenderer = require('./CanvasRenderer.class');
window.KramgineExporter = require('./KramgineExporter.class');
},{"./CanvasRenderer.class":"/home/administrator/git/stygiangen/src/CanvasRenderer.class.js","./Generator.class":"/home/administrator/git/stygiangen/src/Generator.class.js","./KramgineExporter.class":"/home/administrator/git/stygiangen/src/KramgineExporter.class.js"}]},{},["/home/administrator/git/stygiangen/src/WebTest.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJ1bkNBOiBmdW5jdGlvbihtYXAsIHRyYW5zZm9ybUZ1bmN0aW9uLCB0aW1lcywgY3Jvc3Mpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKyl7XG5cdFx0XHR2YXIgbmV3TWFwID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKyl7XG5cdFx0XHRcdG5ld01hcFt4XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4Kyspe1xuXHRcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKyl7XG5cdFx0XHRcdFx0dmFyIHN1cnJvdW5kaW5nTWFwID0gW107XG5cdFx0XHRcdFx0Zm9yICh2YXIgeHggPSB4LTE7IHh4IDw9IHgrMTsgeHgrKyl7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciB5eSA9IHktMTsgeXkgPD0geSsxOyB5eSsrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGNyb3NzICYmICEoeHggPT0geCB8fCB5eSA9PSB5KSlcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0aWYgKHh4ID4gMCAmJiB4eCA8IG1hcC5sZW5ndGggJiYgeXkgPiAwICYmIHl5IDwgbWFwW3hdLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNlbGwgPSBtYXBbeHhdW3l5XTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc3Vycm91bmRpbmdNYXBbY2VsbF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRzdXJyb3VuZGluZ01hcFtjZWxsXSsrO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHN1cnJvdW5kaW5nTWFwW2NlbGxdID0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbmV3Q2VsbCA9IHRyYW5zZm9ybUZ1bmN0aW9uKG1hcFt4XVt5XSwgc3Vycm91bmRpbmdNYXApO1xuXHRcdFx0XHRcdGlmIChuZXdDZWxsKXtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG5ld0NlbGw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG1hcFt4XVt5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1hcCA9IG5ld01hcDtcblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufSIsImZ1bmN0aW9uIENhbnZhc1JlbmRlcmVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUgPSB7XG5cdGRyYXdTa2V0Y2g6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMsIG92ZXJsYXkpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTZweCBBdmF0YXJcIjtcblx0XHRpZiAoIW92ZXJsYXkpXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gbGV2ZWwuYXJlYXNbaV07XG5cdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y29udGV4dC5yZWN0KGFyZWEueCAqIHpvb20sIGFyZWEueSAqIHpvb20sIGFyZWEudyAqIHpvb20sIGFyZWEuaCAqIHpvb20pO1xuXHRcdFx0aWYgKCFvdmVybGF5KXtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAneWVsbG93Jztcblx0XHRcdFx0Y29udGV4dC5maWxsKCk7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR2YXIgYXJlYURlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHRpZiAoYXJlYS5hcmVhVHlwZSA9PSAncm9vbXMnKXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJEdW5nZW9uXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZWEuZmxvb3IgPT0gJ2Zha2VXYXRlcicpeyBcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJMYWdvb25cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiQ2F2ZXJuXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uICs9IFwiIChkKVwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWEuaGFzRW50cmFuY2Upe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gKz0gXCIgKHUpXCI7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRjb250ZXh0LmZpbGxUZXh0KGFyZWFEZXNjcmlwdGlvbiwoYXJlYS54KSogem9vbSArIDUsKGFyZWEueSApKiB6b29tICsgMjApO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjb250ZXh0LnJlY3QoKGJyaWRnZS54KSAqIHpvb20gLyotIHpvb20gLyAyKi8sIChicmlkZ2UueSkgKiB6b29tIC8qLSB6b29tIC8gMiovLCB6b29tLCB6b29tKTtcblx0XHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG5cdFx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRkcmF3TGV2ZWw6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTJweCBHZW9yZ2lhXCI7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0dmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07XG5cdFx0XHRcdGlmIChjZWxsID09PSAnd2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNTk0QjJEJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjYXZlcm5GbG9vcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM4NzY0MTgnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMEZGMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lV2FsbCcpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNCQkJCQkInO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lRmxvb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNjY2NjY2Jztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3BhZGRpbmcnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDBGRjAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjOTQ2ODAwJztcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KHggKiB6b29tLCB5ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0c3dpdGNoIChlbmVteS5jb2RlKXtcblx0XHRcdGNhc2UgJ2JhdCc6XG5cdFx0XHRcdGNvbG9yID0gJyNFRUVFRUUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xhdmFMaXphcmQnOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdkYWVtb24nOlxuXHRcdFx0XHRjb2xvciA9ICcjRkY4ODAwJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChlbmVteS54ICogem9vbSwgZW5lbXkueSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRzd2l0Y2ggKGl0ZW0uY29kZSl7XG5cdFx0XHRjYXNlICdkYWdnZXInOlxuXHRcdFx0XHRjb2xvciA9ICcjRUVFRUVFJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsZWF0aGVyQXJtb3InOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChpdGVtLnggKiB6b29tLCBpdGVtLnkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHR9XG5cdH0sXG5cdGRyYXdMZXZlbFdpdGhJY29uczogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcyl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxMnB4IEdlb3JnaWFcIjtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHR2YXIgd2F0ZXIgPSBuZXcgSW1hZ2UoKTtcblx0XHR3YXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIGZha2VXYXRlciA9IG5ldyBJbWFnZSgpO1xuXHRcdGZha2VXYXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIHNvbGlkUm9jayA9IG5ldyBJbWFnZSgpO1xuXHRcdHNvbGlkUm9jay5zcmMgPSAnaW1nL3NvbGlkUm9jay5wbmcnO1xuXHRcdHZhciBjYXZlcm5GbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdGNhdmVybkZsb29yLnNyYyA9ICdpbWcvY2F2ZXJuRmxvb3IucG5nJztcblx0XHR2YXIgZG93bnN0YWlycyA9IG5ldyBJbWFnZSgpO1xuXHRcdGRvd25zdGFpcnMuc3JjID0gJ2ltZy9kb3duc3RhaXJzLnBuZyc7XG5cdFx0dmFyIHVwc3RhaXJzID0gbmV3IEltYWdlKCk7XG5cdFx0dXBzdGFpcnMuc3JjID0gJ2ltZy91cHN0YWlycy5wbmcnO1xuXHRcdHZhciBzdG9uZVdhbGwgPSBuZXcgSW1hZ2UoKTtcblx0XHRzdG9uZVdhbGwuc3JjID0gJ2ltZy9zdG9uZVdhbGwucG5nJztcblx0XHR2YXIgc3RvbmVGbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdHN0b25lRmxvb3Iuc3JjID0gJ2ltZy9zdG9uZUZsb29yLnBuZyc7XG5cdFx0dmFyIGJyaWRnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGJyaWRnZS5zcmMgPSAnaW1nL2JyaWRnZS5wbmcnO1xuXHRcdHZhciBsYXZhID0gbmV3IEltYWdlKCk7XG5cdFx0bGF2YS5zcmMgPSAnaW1nL2xhdmEucG5nJztcblx0XHR2YXIgYmF0ID0gbmV3IEltYWdlKCk7XG5cdFx0YmF0LnNyYyA9ICdpbWcvYmF0LnBuZyc7XG5cdFx0dmFyIGxhdmFMaXphcmQgPSBuZXcgSW1hZ2UoKTtcblx0XHRsYXZhTGl6YXJkLnNyYyA9ICdpbWcvbGF2YUxpemFyZC5wbmcnO1xuXHRcdHZhciBkYWVtb24gPSBuZXcgSW1hZ2UoKTtcblx0XHRkYWVtb24uc3JjID0gJ2ltZy9kYWVtb24ucG5nJztcblx0XHR2YXIgdHJlYXN1cmUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVhc3VyZS5zcmMgPSAnaW1nL3RyZWFzdXJlLnBuZyc7XG5cdFx0dmFyIHRpbGVzID0ge1xuXHRcdFx0d2F0ZXI6IHdhdGVyLFxuXHRcdFx0ZmFrZVdhdGVyOiBmYWtlV2F0ZXIsXG5cdFx0XHRzb2xpZFJvY2s6IHNvbGlkUm9jayxcblx0XHRcdGNhdmVybkZsb29yOiBjYXZlcm5GbG9vcixcblx0XHRcdGRvd25zdGFpcnM6IGRvd25zdGFpcnMsXG5cdFx0XHR1cHN0YWlyczogdXBzdGFpcnMsXG5cdFx0XHRzdG9uZVdhbGw6IHN0b25lV2FsbCxcblx0XHRcdHN0b25lRmxvb3I6IHN0b25lRmxvb3IsXG5cdFx0XHRicmlkZ2U6IGJyaWRnZSxcblx0XHRcdGxhdmE6IGxhdmEsXG5cdFx0XHRiYXQ6IGJhdCxcblx0XHRcdGxhdmFMaXphcmQ6IGxhdmFMaXphcmQsXG5cdFx0XHRkYWVtb246IGRhZW1vbixcblx0XHRcdHRyZWFzdXJlOiB0cmVhc3VyZVxuXHRcdH1cblx0ICAgIHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTsgXG5cdFx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzW2NlbGxdLCB4ICogMTYsIHkgKiAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbZW5lbXkuY29kZV0sIGVuZW15LnggKiAxNiwgZW5lbXkueSAqIDE2KTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbJ3RyZWFzdXJlJ10sIGl0ZW0ueCAqIDE2LCBpdGVtLnkgKiAxNik7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzUmVuZGVyZXI7IiwiZnVuY3Rpb24gRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU3BsaXR0ZXIgPSByZXF1aXJlKCcuL1NwbGl0dGVyJyk7XG5cbkZpcnN0TGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dmFyIGhhc1JpdmVyID0gZGVwdGggPCA2ICYmIFV0aWwuY2hhbmNlKDEwMCAtIGRlcHRoICogMTUpO1xuXHRcdHZhciBoYXNMYXZhID0gZGVwdGggPiA1ICYmIFV0aWwuY2hhbmNlKGRlcHRoICogMTAgKyAyMCk7XG5cdFx0aGFzTGF2YSA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRoYXNSaXZlciA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRcblx0XHR2YXIgbWFpbkVudHJhbmNlID0gZGVwdGggPT0gMTtcblx0XHR2YXIgYXJlYXMgPSB0aGlzLmdlbmVyYXRlQXJlYXMoaGFzTGF2YSk7XG5cdFx0dGhpcy5wbGFjZUV4aXRzKGFyZWFzKTtcblx0XHR2YXIgbGV2ZWwgPSB7XG5cdFx0XHRoYXNSaXZlcnM6IGhhc1JpdmVyLFxuXHRcdFx0aGFzTGF2YTogaGFzTGF2YSxcblx0XHRcdG1haW5FbnRyYW5jZTogbWFpbkVudHJhbmNlLFxuXHRcdFx0c3RyYXRhOiAnc29saWRSb2NrJyxcblx0XHRcdGFyZWFzOiBhcmVhc1xuXHRcdH1cblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGdlbmVyYXRlQXJlYXM6IGZ1bmN0aW9uKGhhc0xhdmEpe1xuXHRcdHZhciBiaWdBcmVhID0ge1xuXHRcdFx0eDogMCxcblx0XHRcdHk6IDAsXG5cdFx0XHR3OiB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCxcblx0XHRcdGg6IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVFxuXHRcdH1cblx0XHR2YXIgbWF4RGVwdGggPSB0aGlzLmNvbmZpZy5TVUJESVZJU0lPTl9ERVBUSDtcblx0XHR2YXIgTUlOX1dJRFRIID0gdGhpcy5jb25maWcuTUlOX1dJRFRIO1xuXHRcdHZhciBNSU5fSEVJR0hUID0gdGhpcy5jb25maWcuTUlOX0hFSUdIVDtcblx0XHR2YXIgTUFYX1dJRFRIID0gdGhpcy5jb25maWcuTUFYX1dJRFRIO1xuXHRcdHZhciBNQVhfSEVJR0hUID0gdGhpcy5jb25maWcuTUFYX0hFSUdIVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfU1RBUlQgPSB0aGlzLmNvbmZpZy5TTElDRV9SQU5HRV9TVEFSVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfRU5EID0gdGhpcy5jb25maWcuU0xJQ0VfUkFOR0VfRU5EO1xuXHRcdHZhciBhcmVhcyA9IFNwbGl0dGVyLnN1YmRpdmlkZUFyZWEoYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5EKTtcblx0XHRTcGxpdHRlci5jb25uZWN0QXJlYXMoYXJlYXMsMyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKFV0aWwuY2hhbmNlKDcwKSl7IC8vVE9ETzogRGVmaW5lIGFyZWFzIGJhc2VkIG9uIGRlcHRoXG5cdFx0XHRcdGFyZWEuYXJlYVR5cGUgPSAnY2F2ZXJuJztcblx0XHRcdFx0YXJlYS5hcmVhSWQgPSAnYzEnO1xuXHRcdFx0XHRpZiAoaGFzTGF2YSl7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9ICdjYXZlcm5GbG9vcic7XG5cdFx0XHRcdFx0YXJlYS5jYXZlcm5UeXBlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoWydyb2NreScsJ2JyaWRnZXMnXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9IFV0aWwuY2hhbmNlKDUwKT8nZmFrZVdhdGVyJzonY2F2ZXJuRmxvb3InO1xuXHRcdFx0XHRcdGFyZWEuY2F2ZXJuVHlwZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKFsncm9ja3knLCdicmlkZ2VzJywnd2F0ZXJ5J10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhLmFyZWFUeXBlID0gJ3Jvb21zJztcblx0XHRcdFx0YXJlYS5hcmVhSWQgPSAnYzEnO1xuXHRcdFx0XHRhcmVhLmZsb29yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0XHRhcmVhLndhbGwgPSBVdGlsLmNoYW5jZSg1MCkgPyAnc3RvbmVXYWxsJyA6IGZhbHNlO1xuXHRcdFx0XHRhcmVhLmNvcnJpZG9yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0fVxuXHRcdFx0YXJlYS5lbmVtaWVzID0gWydiYXQnLCAnbGF2YUxpemFyZCddO1xuXHRcdFx0YXJlYS5lbmVteUNvdW50ID0gVXRpbC5yYW5kKDMsNSk7XG5cdFx0XHRpZiAoVXRpbC5jaGFuY2UoMjApKVxuXHRcdFx0XHRhcmVhLmJvc3MgPSAnZGFlbW9uJztcblx0XHRcdGFyZWEuaXRlbXMgPSBbJ2RhZ2dlciddXG5cdFx0fVxuXHRcdHJldHVybiBhcmVhcztcblx0fSxcblx0cGxhY2VFeGl0czogZnVuY3Rpb24oYXJlYXMpe1xuXHRcdHZhciBkaXN0ID0gbnVsbDtcblx0XHR2YXIgYXJlYTEgPSBudWxsO1xuXHRcdHZhciBhcmVhMiA9IG51bGw7XG5cdFx0dmFyIGZ1c2UgPSAxMDAwO1xuXHRcdGRvIHtcblx0XHRcdGFyZWExID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdFx0YXJlYTIgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhcyk7XG5cdFx0XHRpZiAoZnVzZSA8IDApe1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGRpc3QgPSBVdGlsLmxpbmVEaXN0YW5jZShhcmVhMSwgYXJlYTIpO1xuXHRcdFx0ZnVzZS0tO1xuXHRcdH0gd2hpbGUgKGRpc3QgPCAodGhpcy5jb25maWcuTEVWRUxfV0lEVEggKyB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpIC8gMyk7XG5cdFx0YXJlYTEuaGFzRXhpdCA9IHRydWU7XG5cdFx0YXJlYTIuaGFzRW50cmFuY2UgPSB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyc3RMZXZlbEdlbmVyYXRvcjsiLCJmdW5jdGlvbiBHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdHRoaXMuZmlyc3RMZXZlbEdlbmVyYXRvciA9IG5ldyBGaXJzdExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMuc2Vjb25kTGV2ZWxHZW5lcmF0b3IgPSBuZXcgU2Vjb25kTGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy50aGlyZExldmVsR2VuZXJhdG9yID0gbmV3IFRoaXJkTGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy5tb25zdGVyUG9wdWxhdG9yID0gbmV3IE1vbnN0ZXJQb3B1bGF0b3IoY29uZmlnKTtcblx0dGhpcy5pdGVtUG9wdWxhdG9yID0gbmV3IEl0ZW1Qb3B1bGF0b3IoY29uZmlnKTtcbn1cblxudmFyIEZpcnN0TGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBTZWNvbmRMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vU2Vjb25kTGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBUaGlyZExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgTW9uc3RlclBvcHVsYXRvciA9IHJlcXVpcmUoJy4vTW9uc3RlclBvcHVsYXRvci5jbGFzcycpO1xudmFyIEl0ZW1Qb3B1bGF0b3IgPSByZXF1aXJlKCcuL0l0ZW1Qb3B1bGF0b3IuY2xhc3MnKTtcblxuR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0Z2VuZXJhdGVMZXZlbDogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHZhciBza2V0Y2ggPSB0aGlzLmZpcnN0TGV2ZWxHZW5lcmF0b3IuZ2VuZXJhdGVMZXZlbChkZXB0aCk7XG5cdFx0dmFyIGxldmVsID0gdGhpcy5zZWNvbmRMZXZlbEdlbmVyYXRvci5maWxsTGV2ZWwoc2tldGNoKTtcblx0XHR0aGlzLnRoaXJkTGV2ZWxHZW5lcmF0b3IuZmlsbExldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMubW9uc3RlclBvcHVsYXRvci5wb3B1bGF0ZUxldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMuaXRlbVBvcHVsYXRvci5wb3B1bGF0ZUxldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRza2V0Y2g6IHNrZXRjaCxcblx0XHRcdGxldmVsOiBsZXZlbFxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjsiLCJmdW5jdGlvbiBJdGVtUG9wdWxhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuSXRlbVBvcHVsYXRvci5wcm90b3R5cGUgPSB7XG5cdHBvcHVsYXRlTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0dGhpcy5wb3B1bGF0ZUFyZWEoYXJlYSwgbGV2ZWwpO1xuXHRcdH1cblx0fSxcblx0cG9wdWxhdGVBcmVhOiBmdW5jdGlvbihhcmVhLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGxldmVsLmFkZEl0ZW0oYXJlYS5pdGVtc1tpXSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSXRlbVBvcHVsYXRvcjsiLCJmdW5jdGlvbiBLcmFtZ2luZUV4cG9ydGVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5LcmFtZ2luZUV4cG9ydGVyLnByb3RvdHlwZSA9IHtcblx0Z2V0TGV2ZWw6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgdGlsZXMgPSB0aGlzLmdldFRpbGVzKCk7XG5cdFx0dmFyIG9iamVjdHMgPSB0aGlzLmdldE9iamVjdHMobGV2ZWwpO1xuXHRcdHZhciBtYXAgPSB0aGlzLmdldE1hcChsZXZlbCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpbGVzOiB0aWxlcyxcblx0XHRcdG9iamVjdHM6IG9iamVjdHMsXG5cdFx0XHRtYXA6IG1hcFxuXHRcdH07XG5cdH0sXG5cdEJBU0lDX1dBTExfVElMRToge1xuICAgICAgICBcIndcIjoyLFxuICAgICAgICBcInlcIjowLFxuICAgICAgICBcImhcIjoyLFxuICAgICAgICBcImNcIjowLFxuICAgICAgICBcImZcIjowLFxuICAgICAgICBcImNoXCI6MixcbiAgICAgICAgXCJzbFwiOjAsXG4gICAgICAgIFwiZGlyXCI6MCxcbiAgICAgICAgXCJmeVwiOjBcbiAgICB9LFxuICAgIEJBU0lDX0ZMT09SX1RJTEU6IHtcbiAgICBcdFwid1wiOjAsXG4gICAgICAgIFwieVwiOjAsXG4gICAgICAgIFwiaFwiOjIsXG4gICAgICAgIFwiY1wiOjIsXG4gICAgICAgIFwiZlwiOjIsXG4gICAgICAgIFwiY2hcIjoyLFxuICAgICAgICBcInNsXCI6MCxcbiAgICAgICAgXCJkaXJcIjowLFxuICAgICAgICBcImZ5XCI6MFxuICAgIH0sXG4gICAgV0FURVJfVElMRToge1xuICAgIFx0XCJ3XCI6MCxcbiAgICBcdFwieVwiOjAsXG4gICAgXHRcImhcIjoyLFxuICAgIFx0XCJjXCI6MixcbiAgICBcdFwiZlwiOjEwMSxcbiAgICBcdFwiY2hcIjoyLFxuICAgIFx0XCJzbFwiOjAsXG4gICAgXHRcImRpclwiOjAsXG4gICAgXHRcImZ5XCI6MFxuXHR9LFxuXHRMQVZBX1RJTEU6IHtcbiAgICBcdFwid1wiOjAsXG4gICAgXHRcInlcIjowLFxuICAgIFx0XCJoXCI6MixcbiAgICBcdFwiY1wiOjIsXG4gICAgXHRcImZcIjoxMDEsXG4gICAgXHRcImNoXCI6MixcbiAgICBcdFwic2xcIjowLFxuICAgIFx0XCJkaXJcIjowLFxuICAgIFx0XCJmeVwiOjBcblx0fSxcblx0Z2V0VGlsZXM6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIFtcblx0ICAgICAgICBudWxsLCBcblx0ICAgICAgICB0aGlzLkJBU0lDX1dBTExfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX1dBTExfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkxBVkFfVElMRSxcblx0ICAgICAgICB0aGlzLldBVEVSX1RJTEVcblx0XHRdO1xuXHR9LFxuXHRnZXRPYmplY3RzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG9iamVjdHMgPSBbXTtcblx0XHRvYmplY3RzLnB1c2goe1xuXHRcdFx0eDogbGV2ZWwuc3RhcnQueCxcblx0XHRcdHo6IGxldmVsLnN0YXJ0LnksXG5cdFx0XHR5OiAwLFxuXHRcdFx0ZGlyOiAzLFxuXHRcdFx0dHlwZTogJ3BsYXllcidcblx0XHR9KTtcblx0XHRyZXR1cm4gb2JqZWN0cztcblx0fSxcblx0Z2V0TWFwOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG1hcCA9IFtdO1xuXHRcdHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRtYXBbeF0gPSBbXTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldO1xuXHRcdFx0XHR2YXIgaWQgPSBudWxsO1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gJ3dhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnZmFrZVdhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRpZCA9IDE7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY2F2ZXJuRmxvb3InKXtcblx0XHRcdFx0XHRpZCA9IDI7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnZG93bnN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gMztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gNDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZVdhbGwnKXtcblx0XHRcdFx0XHRpZCA9IDU7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVGbG9vcicpe1xuXHRcdFx0XHRcdGlkID0gNjtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGlkID0gNztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRpZCA9IDg7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlkID0gOTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXBbeF1beV0gPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtyYW1naW5lRXhwb3J0ZXI7IiwiZnVuY3Rpb24gTGV2ZWwoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59O1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuTGV2ZWwucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmVuZW1pZXMgPSBbXTtcblx0XHR0aGlzLml0ZW1zID0gW107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdHRoaXMuY2VsbHNbeF0gPSBbXTtcblx0XHR9XG5cdH0sXG5cdGFkZEVuZW15OiBmdW5jdGlvbihlbmVteSwgeCwgeSl7XG5cdFx0dGhpcy5lbmVtaWVzLnB1c2goe1xuXHRcdFx0Y29kZTogZW5lbXksXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeVxuXHRcdH0pO1xuXHR9LFxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtLCB4LCB5KXtcblx0XHR0aGlzLml0ZW1zLnB1c2goe1xuXHRcdFx0Y29kZTogaXRlbSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fSk7XG5cdH0sXG5cdGdldEZyZWVQbGFjZTogZnVuY3Rpb24oYXJlYSl7XG5cdFx0d2hpbGUodHJ1ZSl7XG5cdFx0XHR2YXIgcmFuZFBvaW50ID0ge1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoYXJlYS54LCBhcmVhLngrYXJlYS53LTEpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoYXJlYS55LCBhcmVhLnkrYXJlYS5oLTEpXG5cdFx0XHR9XG5cdFx0XHR2YXIgY2VsbCA9IHRoaXMuY2VsbHNbcmFuZFBvaW50LnhdW3JhbmRQb2ludC55XTsgXG5cdFx0XHRpZiAoY2VsbCA9PSBhcmVhLmZsb29yIHx8IGFyZWEuY29ycmlkb3IgJiYgY2VsbCA9PSBhcmVhLmNvcnJpZG9yIHx8IGNlbGwgPT0gJ2Zha2VXYXRlcicpXG5cdFx0XHRcdHJldHVybiByYW5kUG9pbnQ7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyIsImZ1bmN0aW9uIE1vbnN0ZXJQb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5Nb25zdGVyUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuZW5lbXlDb3VudDsgaSsrKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdHRoaXMuYWRkTW9uc3RlcihhcmVhLCAgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgbGV2ZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYXJlYS5ib3NzKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdGxldmVsLmFkZEVuZW15KGFyZWEuYm9zcywgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRhZGRNb25zdGVyOiBmdW5jdGlvbihhcmVhLCB4LCB5LCBsZXZlbCl7XG5cdFx0dmFyIG1vbnN0ZXIgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhLmVuZW1pZXMpO1xuXHRcdGxldmVsLmFkZEVuZW15KG1vbnN0ZXIsIHgsIHkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlclBvcHVsYXRvcjsiLCJmdW5jdGlvbiBTZWNvbmRMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgTGV2ZWwgPSByZXF1aXJlKCcuL0xldmVsLmNsYXNzJyk7XG52YXIgQ0EgPSByZXF1aXJlKCcuL0NBJyk7XG5cblNlY29uZExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0ZmlsbExldmVsOiBmdW5jdGlvbihza2V0Y2gpe1xuXHRcdHZhciBsZXZlbCA9IG5ldyBMZXZlbCh0aGlzLmNvbmZpZyk7XG5cdFx0bGV2ZWwuaW5pdCgpO1xuXHRcdHRoaXMuZmlsbFN0cmF0YShsZXZlbCwgc2tldGNoKTtcblx0XHRpZiAoc2tldGNoLmhhc1JpdmVycylcblx0XHRcdHRoaXMucGxvdFJpdmVycyhsZXZlbCwgc2tldGNoLCAnd2F0ZXInKTtcblx0XHRpZiAoc2tldGNoLmhhc0xhdmEpXG5cdFx0XHR0aGlzLnBsb3RSaXZlcnMobGV2ZWwsIHNrZXRjaCwgJ2xhdmEnKTtcblx0XHR0aGlzLmNvcHlHZW8obGV2ZWwpO1xuXHRcdHJldHVybiBsZXZlbDtcblx0fSxcblx0ZmlsbFN0cmF0YTogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCl7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjb3B5R2VvOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIGdlbyA9IFtdO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRnZW9beF0gPSBbXTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHRnZW9beF1beV0gPSBsZXZlbC5jZWxsc1t4XVt5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bGV2ZWwuZ2VvID0gZ2VvO1xuXHR9LFxuXHRwbG90Uml2ZXJzOiBmdW5jdGlvbihsZXZlbCwgc2tldGNoLCBsaXF1aWQpe1xuXHRcdHRoaXMucGxhY2VSaXZlcmxpbmVzKGxldmVsLCBza2V0Y2gsIGxpcXVpZCk7XG5cdFx0dGhpcy5mYXR0ZW5SaXZlcnMobGV2ZWwsIGxpcXVpZCk7XG5cdFx0aWYgKGxpcXVpZCA9PSAnbGF2YScpXG5cdFx0XHR0aGlzLmZhdHRlblJpdmVycyhsZXZlbCwgbGlxdWlkKTtcblx0fSxcblx0ZmF0dGVuUml2ZXJzOiBmdW5jdGlvbihsZXZlbCwgbGlxdWlkKXtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbbGlxdWlkXSA+IDEgJiYgVXRpbC5jaGFuY2UoMzApKVxuXHRcdFx0XHRyZXR1cm4gbGlxdWlkO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1tsaXF1aWRdID4gMSlcblx0XHRcdFx0cmV0dXJuIGxpcXVpZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0fSxcblx0cGxhY2VSaXZlcmxpbmVzOiBmdW5jdGlvbihsZXZlbCwgc2tldGNoLCBsaXF1aWQpe1xuXHRcdC8vIFBsYWNlIHJhbmRvbSBsaW5lIHNlZ21lbnRzIG9mIHdhdGVyXG5cdFx0dmFyIHJpdmVycyA9IFV0aWwucmFuZCh0aGlzLmNvbmZpZy5NSU5fUklWRVJTLHRoaXMuY29uZmlnLk1BWF9SSVZFUlMpO1xuXHRcdHZhciByaXZlclNlZ21lbnRMZW5ndGggPSB0aGlzLmNvbmZpZy5SSVZFUl9TRUdNRU5UX0xFTkdUSDtcblx0XHR2YXIgcHVkZGxlID0gZmFsc2U7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByaXZlcnM7IGkrKyl7XG5cdFx0XHR2YXIgc2VnbWVudHMgPSBVdGlsLnJhbmQodGhpcy5jb25maWcuTUlOX1JJVkVSX1NFR01FTlRTLHRoaXMuY29uZmlnLk1BWF9SSVZFUl9TRUdNRU5UUyk7XG5cdFx0XHR2YXIgcml2ZXJQb2ludHMgPSBbXTtcblx0XHRcdHJpdmVyUG9pbnRzLnB1c2goe1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoMCwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEgpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoMCwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0fSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHNlZ21lbnRzOyBqKyspe1xuXHRcdFx0XHR2YXIgcmFuZG9tUG9pbnQgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihyaXZlclBvaW50cyk7XG5cdFx0XHRcdGlmIChyaXZlclBvaW50cy5sZW5ndGggPiAxICYmICFwdWRkbGUpXG5cdFx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkocml2ZXJQb2ludHMsIHJhbmRvbVBvaW50KTtcblx0XHRcdFx0dmFyIGlhbmNlID0ge1xuXHRcdFx0XHRcdHg6IFV0aWwucmFuZCgtcml2ZXJTZWdtZW50TGVuZ3RoLCByaXZlclNlZ21lbnRMZW5ndGgpLFxuXHRcdFx0XHRcdHk6IFV0aWwucmFuZCgtcml2ZXJTZWdtZW50TGVuZ3RoLCByaXZlclNlZ21lbnRMZW5ndGgpXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBuZXdQb2ludCA9IHtcblx0XHRcdFx0XHR4OiByYW5kb21Qb2ludC54ICsgaWFuY2UueCxcblx0XHRcdFx0XHR5OiByYW5kb21Qb2ludC55ICsgaWFuY2UueSxcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKG5ld1BvaW50LnggPiAwICYmIG5ld1BvaW50LnggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCAmJiBcblx0XHRcdFx0XHRuZXdQb2ludC55ID4gMCAmJiBuZXdQb2ludC55IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0XHRcdHJpdmVyUG9pbnRzLnB1c2gobmV3UG9pbnQpO1xuXHRcdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShyYW5kb21Qb2ludCwgbmV3UG9pbnQpO1xuXHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGxpbmUubGVuZ3RoOyBrKyspe1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGxpbmVba107XG5cdFx0XHRcdFx0aWYgKHBvaW50LnggPiAwICYmIHBvaW50LnggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCAmJiBcblx0XHRcdFx0XHRcdHBvaW50LnkgPiAwICYmIHBvaW50LnkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBsaXF1aWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWNvbmRMZXZlbEdlbmVyYXRvcjsiLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN1YmRpdmlkZUFyZWE6IGZ1bmN0aW9uKGJpZ0FyZWEsIG1heERlcHRoLCBNSU5fV0lEVEgsIE1JTl9IRUlHSFQsIE1BWF9XSURUSCwgTUFYX0hFSUdIVCwgU0xJQ0VfUkFOR0VfU1RBUlQsIFNMSUNFX1JBTkdFX0VORCwgYXZvaWRQb2ludHMpe1xuXHRcdHZhciBhcmVhcyA9IFtdO1xuXHRcdHZhciBiaWdBcmVhcyA9IFtdO1xuXHRcdGJpZ0FyZWEuZGVwdGggPSAwO1xuXHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0dmFyIHJldHJpZXMgPSAwO1xuXHRcdHdoaWxlIChiaWdBcmVhcy5sZW5ndGggPiAwKXtcblx0XHRcdHZhciBiaWdBcmVhID0gYmlnQXJlYXMucG9wKCk7XG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNwbGl0ID0gVXRpbC5jaGFuY2UoNTApO1xuXHRcdFx0aWYgKGJpZ0FyZWEudyA8IE1JTl9XSURUSCAqIDEuNSAmJiBiaWdBcmVhLmggPCBNSU5fSEVJR0hUICogMS41KXtcblx0XHRcdFx0YmlnQXJlYS5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fSBlbHNlIGlmIChiaWdBcmVhLncgPCBNSU5fV0lEVEggKiAxLjUpe1xuXHRcdFx0XHRob3Jpem9udGFsU3BsaXQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmIChiaWdBcmVhLmggPCBNSU5fSEVJR0hUICogMS41KXtcblx0XHRcdFx0aG9yaXpvbnRhbFNwbGl0ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgYXJlYTEgPSBudWxsO1xuXHRcdFx0dmFyIGFyZWEyID0gbnVsbDtcblx0XHRcdGlmIChob3Jpem9udGFsU3BsaXQpe1xuXHRcdFx0XHR2YXIgc2xpY2UgPSBNYXRoLnJvdW5kKFV0aWwucmFuZChiaWdBcmVhLmggKiBTTElDRV9SQU5HRV9TVEFSVCwgYmlnQXJlYS5oICogU0xJQ0VfUkFOR0VfRU5EKSk7XG5cdFx0XHRcdGFyZWExID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnksXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LFxuXHRcdFx0XHRcdGg6IHNsaWNlXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFyZWEyID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnkgKyBzbGljZSxcblx0XHRcdFx0XHR3OiBiaWdBcmVhLncsXG5cdFx0XHRcdFx0aDogYmlnQXJlYS5oIC0gc2xpY2Vcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHNsaWNlID0gTWF0aC5yb3VuZChVdGlsLnJhbmQoYmlnQXJlYS53ICogU0xJQ0VfUkFOR0VfU1RBUlQsIGJpZ0FyZWEudyAqIFNMSUNFX1JBTkdFX0VORCkpO1xuXHRcdFx0XHRhcmVhMSA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IHNsaWNlLFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaFxuXHRcdFx0XHR9XG5cdFx0XHRcdGFyZWEyID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCtzbGljZSxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnksXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LXNsaWNlLFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWExLncgPCBNSU5fV0lEVEggfHwgYXJlYTEuaCA8IE1JTl9IRUlHSFQgfHxcblx0XHRcdFx0YXJlYTIudyA8IE1JTl9XSURUSCB8fCBhcmVhMi5oIDwgTUlOX0hFSUdIVCl7XG5cdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGlmIChiaWdBcmVhLmRlcHRoID09IG1heERlcHRoICYmIFxuXHRcdFx0XHRcdChhcmVhMS53ID4gTUFYX1dJRFRIIHx8IGFyZWExLmggPiBNQVhfSEVJR0hUIHx8XG5cdFx0XHRcdFx0YXJlYTIudyA+IE1BWF9XSURUSCB8fCBhcmVhMi5oID4gTUFYX0hFSUdIVCkpe1xuXHRcdFx0XHRpZiAocmV0cmllcyA8IDEwMCkge1xuXHRcdFx0XHRcdC8vIFB1c2ggYmFjayBiaWcgYXJlYVxuXHRcdFx0XHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcysrO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0fVxuXHRcdFx0aWYgKGF2b2lkUG9pbnRzICYmICh0aGlzLmNvbGxpZGVzV2l0aChhdm9pZFBvaW50cywgYXJlYTIpIHx8IHRoaXMuY29sbGlkZXNXaXRoKGF2b2lkUG9pbnRzLCBhcmVhMSkpKXtcblx0XHRcdFx0aWYgKHJldHJpZXMgPiAxMDApe1xuXHRcdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRcdGFyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcyA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUHVzaCBiYWNrIGJpZyBhcmVhXG5cdFx0XHRcdFx0YmlnQXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0XHRyZXRyaWVzKys7XG5cdFx0XHRcdH1cdFx0XG5cdFx0XHRcdGNvbnRpbnVlOyBcblx0XHRcdH1cblx0XHRcdGlmIChiaWdBcmVhLmRlcHRoID09IG1heERlcHRoKXtcblx0XHRcdFx0YXJlYTEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhMi5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWFzLnB1c2goYXJlYTEpO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGFyZWEyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWExLmRlcHRoID0gYmlnQXJlYS5kZXB0aCArMTtcblx0XHRcdFx0YXJlYTIuZGVwdGggPSBiaWdBcmVhLmRlcHRoICsxO1xuXHRcdFx0XHRiaWdBcmVhcy5wdXNoKGFyZWExKTtcblx0XHRcdFx0YmlnQXJlYXMucHVzaChhcmVhMik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhcmVhcztcblx0fSxcblx0Y29sbGlkZXNXaXRoOiBmdW5jdGlvbihhdm9pZFBvaW50cywgYXJlYSl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhdm9pZFBvaW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXZvaWRQb2ludCA9IGF2b2lkUG9pbnRzW2ldO1xuXHRcdFx0aWYgKFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCwgYXJlYS55LCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngrYXJlYS53LCBhcmVhLnksIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCwgYXJlYS55K2FyZWEuaCwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54K2FyZWEudywgYXJlYS55K2FyZWEuaCwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRjb25uZWN0QXJlYXM6IGZ1bmN0aW9uKGFyZWFzLCBib3JkZXIpe1xuXHRcdC8qIE1ha2Ugb25lIGFyZWEgY29ubmVjdGVkXG5cdFx0ICogV2hpbGUgbm90IGFsbCBhcmVhcyBjb25uZWN0ZWQsXG5cdFx0ICogIFNlbGVjdCBhIGNvbm5lY3RlZCBhcmVhXG5cdFx0ICogIFNlbGVjdCBhIHZhbGlkIHdhbGwgZnJvbSB0aGUgYXJlYVxuXHRcdCAqICBUZWFyIGl0IGRvd24sIGNvbm5lY3RpbmcgdG8gdGhlIGEgbmVhcmJ5IGFyZWFcblx0XHQgKiAgTWFyayBhcmVhIGFzIGNvbm5lY3RlZFxuXHRcdCAqL1xuXHRcdGlmICghYm9yZGVyKXtcblx0XHRcdGJvcmRlciA9IDE7XG5cdFx0fVxuXHRcdHZhciBjb25uZWN0ZWRBcmVhcyA9IFtdO1xuXHRcdHZhciByYW5kb21BcmVhID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdGNvbm5lY3RlZEFyZWFzLnB1c2gocmFuZG9tQXJlYSk7XG5cdFx0dmFyIGN1cnNvciA9IHt9O1xuXHRcdHZhciB2YXJpID0ge307XG5cdFx0YXJlYTogd2hpbGUgKGNvbm5lY3RlZEFyZWFzLmxlbmd0aCA8IGFyZWFzLmxlbmd0aCl7XG5cdFx0XHRyYW5kb21BcmVhID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY29ubmVjdGVkQXJlYXMpO1xuXHRcdFx0dmFyIHdhbGxEaXIgPSBVdGlsLnJhbmQoMSw0KTtcblx0XHRcdHN3aXRjaCh3YWxsRGlyKXtcblx0XHRcdGNhc2UgMTogLy8gTGVmdFxuXHRcdFx0XHRjdXJzb3IueCA9IHJhbmRvbUFyZWEueDtcblx0XHRcdFx0Y3Vyc29yLnkgPSBVdGlsLnJhbmQocmFuZG9tQXJlYS55ICsgYm9yZGVyICwgcmFuZG9tQXJlYS55K3JhbmRvbUFyZWEuaCAtIGJvcmRlcik7XG5cdFx0XHRcdHZhcmkueCA9IC0yO1xuXHRcdFx0XHR2YXJpLnkgPSAwO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjogLy9SaWdodFxuXHRcdFx0XHRjdXJzb3IueCA9IHJhbmRvbUFyZWEueCArIHJhbmRvbUFyZWEudztcblx0XHRcdFx0Y3Vyc29yLnkgPSBVdGlsLnJhbmQocmFuZG9tQXJlYS55ICsgYm9yZGVyLCByYW5kb21BcmVhLnkrcmFuZG9tQXJlYS5oIC0gYm9yZGVyKTtcblx0XHRcdFx0dmFyaS54ID0gMjtcblx0XHRcdFx0dmFyaS55ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6IC8vVXBcblx0XHRcdFx0Y3Vyc29yLnggPSBVdGlsLnJhbmQocmFuZG9tQXJlYS54ICsgYm9yZGVyLCByYW5kb21BcmVhLngrcmFuZG9tQXJlYS53IC0gYm9yZGVyKTtcblx0XHRcdFx0Y3Vyc29yLnkgPSByYW5kb21BcmVhLnk7XG5cdFx0XHRcdHZhcmkueCA9IDA7XG5cdFx0XHRcdHZhcmkueSA9IC0yO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDogLy9Eb3duXG5cdFx0XHRcdGN1cnNvci54ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueCArIGJvcmRlciwgcmFuZG9tQXJlYS54K3JhbmRvbUFyZWEudyAtIGJvcmRlcik7XG5cdFx0XHRcdGN1cnNvci55ID0gcmFuZG9tQXJlYS55ICsgcmFuZG9tQXJlYS5oO1xuXHRcdFx0XHR2YXJpLnggPSAwO1xuXHRcdFx0XHR2YXJpLnkgPSAyO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHZhciBjb25uZWN0ZWRBcmVhID0gdGhpcy5nZXRBcmVhQXQoY3Vyc29yLCB2YXJpLCBhcmVhcyk7XG5cdFx0XHRpZiAoY29ubmVjdGVkQXJlYSAmJiAhVXRpbC5jb250YWlucyhjb25uZWN0ZWRBcmVhcywgY29ubmVjdGVkQXJlYSkpe1xuXHRcdFx0XHRzd2l0Y2god2FsbERpcil7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdGlmIChjdXJzb3IueSA8PSBjb25uZWN0ZWRBcmVhLnkgKyBib3JkZXIgfHwgY3Vyc29yLnkgPj0gY29ubmVjdGVkQXJlYS55ICsgY29ubmVjdGVkQXJlYS5oIC0gYm9yZGVyKVxuXHRcdFx0XHRcdFx0Y29udGludWUgYXJlYTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0aWYgKGN1cnNvci54IDw9IGNvbm5lY3RlZEFyZWEueCArIGJvcmRlciB8fCBjdXJzb3IueCA+PSBjb25uZWN0ZWRBcmVhLnggKyBjb25uZWN0ZWRBcmVhLncgLSBib3JkZXIpXG5cdFx0XHRcdFx0XHRjb250aW51ZSBhcmVhO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmNvbm5lY3RBcmVhKHJhbmRvbUFyZWEsIGNvbm5lY3RlZEFyZWEsIGN1cnNvcik7XG5cdFx0XHRcdGNvbm5lY3RlZEFyZWFzLnB1c2goY29ubmVjdGVkQXJlYSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnZXRBcmVhQXQ6IGZ1bmN0aW9uKGN1cnNvciwgdmFyaSwgYXJlYXMpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmIChjdXJzb3IueCArIHZhcmkueCA+PSBhcmVhLnggJiYgY3Vyc29yLnggKyB2YXJpLnggPD0gYXJlYS54ICsgYXJlYS53IFxuXHRcdFx0XHRcdCYmIGN1cnNvci55ICsgdmFyaS55ID49IGFyZWEueSAmJiBjdXJzb3IueSArIHZhcmkueSA8PSBhcmVhLnkgKyBhcmVhLmgpXG5cdFx0XHRcdHJldHVybiBhcmVhO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdGNvbm5lY3RBcmVhOiBmdW5jdGlvbihhcmVhMSwgYXJlYTIsIHBvc2l0aW9uKXtcblx0XHRhcmVhMS5icmlkZ2VzLnB1c2goe1xuXHRcdFx0eDogcG9zaXRpb24ueCxcblx0XHRcdHk6IHBvc2l0aW9uLnksXG5cdFx0XHR0bzogYXJlYTJcblx0XHR9KTtcblx0XHRhcmVhMi5icmlkZ2VzLnB1c2goe1xuXHRcdFx0eDogcG9zaXRpb24ueCxcblx0XHRcdHk6IHBvc2l0aW9uLnksXG5cdFx0XHR0bzogYXJlYTFcblx0XHR9KTtcblx0fVxufSIsImZ1bmN0aW9uIFRoaXJkTGV2ZWxHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIENBID0gcmVxdWlyZSgnLi9DQScpO1xudmFyIFNwbGl0dGVyID0gcmVxdWlyZSgnLi9TcGxpdHRlcicpO1xuXG5UaGlyZExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0ZmlsbExldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHR0aGlzLmZpbGxSb29tcyhza2V0Y2gsIGxldmVsKVxuXHRcdHRoaXMuZmF0dGVuQ2F2ZXJucyhsZXZlbCk7XG5cdFx0dGhpcy5wbGFjZUV4aXRzKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMucmFpc2VJc2xhbmRzKGxldmVsKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGZhdHRlbkNhdmVybnM6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHQvLyBHcm93IGNhdmVybnNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10gPiAwICYmIFV0aWwuY2hhbmNlKDIwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddID4gMSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gR3JvdyBsYWdvb24gYXJlYXNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2Zha2VXYXRlciddID4gMCAmJiBVdGlsLmNoYW5jZSg0MCkpXG5cdFx0XHRcdHJldHVybiAnZmFrZVdhdGVyJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2Zha2VXYXRlciddID4gMClcblx0XHRcdFx0cmV0dXJuICdmYWtlV2F0ZXInO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdFxuXHRcdFxuXHRcdC8vIEV4cGFuZCB3YWxsLWxlc3Mgcm9vbXNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnc29saWRSb2NrJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydzdG9uZUZsb29yJ10gPiAyICYmIFV0aWwuY2hhbmNlKDEwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3NvbGlkUm9jaycpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMCAmJiBzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXT4wKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBEZXRlcmlvcmF0ZSB3YWxsIHJvb21zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3N0b25lV2FsbCcpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMCAmJiBVdGlsLmNoYW5jZSg1KSlcblx0XHRcdFx0cmV0dXJuICdzdG9uZUZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRcblx0fSxcblx0cmFpc2VJc2xhbmRzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3dhdGVyJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIGNhdmVybnMgPSBzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXTsgXG5cdFx0XHRpZiAoY2F2ZXJucyA+IDAgJiYgVXRpbC5jaGFuY2UoNzApKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBJc2xhbmQgZm9yIGV4aXRzIG9uIHdhdGVyXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ2Zha2VXYXRlcicgJiYgY3VycmVudCAhPSAnd2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR2YXIgc3RhaXJzID0gc3Vycm91bmRpbmdbJ2Rvd25zdGFpcnMnXSA/IHN1cnJvdW5kaW5nWydkb3duc3RhaXJzJ10gOiAwICtcblx0XHRcdFx0XHRzdXJyb3VuZGluZ1sndXBzdGFpcnMnXSA/IHN1cnJvdW5kaW5nWyd1cHN0YWlycyddIDogMDsgXG5cdFx0XHRpZiAoc3RhaXJzID4gMClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSk7XG5cdH0sXG5cdGZpbGxSb29tczogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR2YXIgdHlwZSA9IGFyZWEuYXJlYVR5cGU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NhdmVybicpeyBcblx0XHRcdFx0dGhpcy5maWxsV2l0aENhdmVybihsZXZlbCwgYXJlYSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdyb29tcycpe1xuXHRcdFx0XHR0aGlzLmZpbGxXaXRoUm9vbXMobGV2ZWwsIGFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cGxhY2VFeGl0czogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHRpZiAoIWFyZWEuaGFzRXhpdCAmJiAhYXJlYS5oYXNFbnRyYW5jZSlcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR2YXIgdGlsZSA9IG51bGw7XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0dGlsZSA9ICdkb3duc3RhaXJzJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpbGUgPSAndXBzdGFpcnMnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyZWVTcG90ID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0bGV2ZWwuY2VsbHNbZnJlZVNwb3QueF1bZnJlZVNwb3QueV0gPSB0aWxlO1xuXHRcdFx0aWYgKGFyZWEuaGFzRXhpdCl7XG5cdFx0XHRcdGxldmVsLmVuZCA9IHtcblx0XHRcdFx0XHR4OiBmcmVlU3BvdC54LFxuXHRcdFx0XHRcdHk6IGZyZWVTcG90Lnlcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldmVsLnN0YXJ0ID0ge1xuXHRcdFx0XHRcdHg6IGZyZWVTcG90LngsXG5cdFx0XHRcdFx0eTogZnJlZVNwb3QueVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZmlsbFdpdGhDYXZlcm46IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHQvLyBDb25uZWN0IGFsbCBicmlkZ2VzIHdpdGggbWlkcG9pbnRcblx0XHR2YXIgbWlkcG9pbnQgPSB7XG5cdFx0XHR4OiBNYXRoLnJvdW5kKFV0aWwucmFuZChhcmVhLnggKyBhcmVhLncgKiAxLzMsIGFyZWEueCthcmVhLncgKiAyLzMpKSxcblx0XHRcdHk6IE1hdGgucm91bmQoVXRpbC5yYW5kKGFyZWEueSArIGFyZWEuaCAqIDEvMywgYXJlYS55K2FyZWEuaCAqIDIvMykpXG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbaV07XG5cdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShtaWRwb2ludCwgYnJpZGdlKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGluZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBwb2ludCA9IGxpbmVbal07XG5cdFx0XHRcdHZhciBjdXJyZW50Q2VsbCA9IGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldO1xuXHRcdFx0XHRpZiAoYXJlYS5jYXZlcm5UeXBlID09ICdyb2NreScpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0XHRlbHNlIGlmIChjdXJyZW50Q2VsbCA9PSAnd2F0ZXInIHx8IGN1cnJlbnRDZWxsID09ICdsYXZhJyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEuZmxvb3IgIT0gJ2Zha2VXYXRlcicgJiYgYXJlYS5jYXZlcm5UeXBlID09ICdicmlkZ2VzJylcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSAnZmFrZVdhdGVyJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gU2NyYXRjaCB0aGUgYXJlYVxuXHRcdHZhciBzY3JhdGNoZXMgPSBVdGlsLnJhbmQoMiw0KTtcblx0XHR2YXIgY2F2ZVNlZ21lbnRzID0gW107XG5cdFx0Y2F2ZVNlZ21lbnRzLnB1c2gobWlkcG9pbnQpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2NyYXRjaGVzOyBpKyspe1xuXHRcdFx0dmFyIHAxID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY2F2ZVNlZ21lbnRzKTtcblx0XHRcdGlmIChjYXZlU2VnbWVudHMubGVuZ3RoID4gMSlcblx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkoY2F2ZVNlZ21lbnRzLCBwMSk7XG5cdFx0XHR2YXIgcDIgPSB7XG5cdFx0XHRcdHg6IFV0aWwucmFuZChhcmVhLngsIGFyZWEueCthcmVhLnctMSksXG5cdFx0XHRcdHk6IFV0aWwucmFuZChhcmVhLnksIGFyZWEueSthcmVhLmgtMSlcblx0XHRcdH1cblx0XHRcdGNhdmVTZWdtZW50cy5wdXNoKHAyKTtcblx0XHRcdHZhciBsaW5lID0gVXRpbC5saW5lKHAyLCBwMSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxpbmUubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2pdO1xuXHRcdFx0XHR2YXIgY3VycmVudENlbGwgPSBsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XTtcblx0XHRcdFx0aWYgKGN1cnJlbnRDZWxsICE9ICd3YXRlcicgJiYgY3VycmVudENlbGwgIT0gJ2xhdmEnKSAgXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZmlsbFdpdGhSb29tczogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdHZhciBiaWdBcmVhID0ge1xuXHRcdFx0eDogYXJlYS54LFxuXHRcdFx0eTogYXJlYS55LFxuXHRcdFx0dzogYXJlYS53LFxuXHRcdFx0aDogYXJlYS5oXG5cdFx0fVxuXHRcdHZhciBtYXhEZXB0aCA9IDI7XG5cdFx0dmFyIE1JTl9XSURUSCA9IDY7XG5cdFx0dmFyIE1JTl9IRUlHSFQgPSA2O1xuXHRcdHZhciBNQVhfV0lEVEggPSAxMDtcblx0XHR2YXIgTUFYX0hFSUdIVCA9IDEwO1xuXHRcdHZhciBTTElDRV9SQU5HRV9TVEFSVCA9IDMvODtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfRU5EID0gNS84O1xuXHRcdHZhciBhcmVhcyA9IFNwbGl0dGVyLnN1YmRpdmlkZUFyZWEoYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5ELCBhcmVhLmJyaWRnZXMpO1xuXHRcdFNwbGl0dGVyLmNvbm5lY3RBcmVhcyhhcmVhcywgYXJlYS53YWxsID8gMiA6IDEpOyBcblx0XHR2YXIgYnJpZGdlQXJlYXMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBzdWJhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbal07XG5cdFx0XHRcdGlmIChTcGxpdHRlci5nZXRBcmVhQXQoYnJpZGdlLHt4OjAseTowfSwgYXJlYXMpID09IHN1YmFyZWEpe1xuXHRcdFx0XHRcdGlmICghVXRpbC5jb250YWlucyhicmlkZ2VBcmVhcywgc3ViYXJlYSkpe1xuXHRcdFx0XHRcdFx0YnJpZGdlQXJlYXMucHVzaChzdWJhcmVhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3ViYXJlYS5icmlkZ2VzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogYnJpZGdlLngsXG5cdFx0XHRcdFx0XHR5OiBicmlkZ2UueVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXNlQXJlYXMoYnJpZGdlQXJlYXMsIGFyZWFzLCBiaWdBcmVhKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBzdWJhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoIXN1YmFyZWEucmVuZGVyKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdHN1YmFyZWEuZmxvb3IgPSBhcmVhLmZsb29yO1xuXHRcdFx0c3ViYXJlYS53YWxsID0gYXJlYS53YWxsO1xuXHRcdFx0c3ViYXJlYS5jb3JyaWRvciA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHR0aGlzLmNhcnZlUm9vbUF0KGxldmVsLCBzdWJhcmVhKTtcblx0XHR9XG5cdH0sXG5cdGNhcnZlUm9vbUF0OiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0dmFyIG1pbmJveCA9IHtcblx0XHRcdHg6IGFyZWEueCArIE1hdGguZmxvb3IoYXJlYS53IC8gMiktMSxcblx0XHRcdHk6IGFyZWEueSArIE1hdGguZmxvb3IoYXJlYS5oIC8gMiktMSxcblx0XHRcdHgyOiBhcmVhLnggKyBNYXRoLmZsb29yKGFyZWEudyAvIDIpKzEsXG5cdFx0XHR5MjogYXJlYS55ICsgTWF0aC5mbG9vcihhcmVhLmggLyAyKSsxLFxuXHRcdH07XG5cdFx0Ly8gVHJhY2UgY29ycmlkb3JzIGZyb20gZXhpdHNcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2ldO1xuXHRcdFx0dmFyIHZlcnRpY2FsQnJpZGdlID0gZmFsc2U7XG5cdFx0XHR2YXIgaG9yaXpvbnRhbEJyaWRnZSA9IGZhbHNlO1xuXHRcdFx0aWYgKGJyaWRnZS54ID09IGFyZWEueCl7XG5cdFx0XHRcdC8vIExlZnQgQ29ycmlkb3Jcblx0XHRcdFx0aG9yaXpvbnRhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueDsgaiA8IGJyaWRnZS54ICsgYXJlYS53IC8gMjsgaisrKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGJyaWRnZS54ID09IGFyZWEueCArIGFyZWEudyl7XG5cdFx0XHRcdC8vIFJpZ2h0IGNvcnJpZG9yXG5cdFx0XHRcdGhvcml6b250YWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLng7IGogPj0gYnJpZGdlLnggLSBhcmVhLncgLyAyOyBqLS0pe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChicmlkZ2UueSA9PSBhcmVhLnkpe1xuXHRcdFx0XHQvLyBUb3AgY29ycmlkb3Jcblx0XHRcdFx0dmVydGljYWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLnk7IGogPCBicmlkZ2UueSArIGFyZWEuaCAvIDI7IGorKyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBEb3duIENvcnJpZG9yXG5cdFx0XHRcdHZlcnRpY2FsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS55OyBqID49IGJyaWRnZS55IC0gYXJlYS5oIC8gMjsgai0tKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSA9IGFyZWEud2FsbDsgXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodmVydGljYWxCcmlkZ2Upe1xuXHRcdFx0XHRpZiAoYnJpZGdlLnggPCBtaW5ib3gueClcblx0XHRcdFx0XHRtaW5ib3gueCA9IGJyaWRnZS54O1xuXHRcdFx0XHRpZiAoYnJpZGdlLnggPiBtaW5ib3gueDIpXG5cdFx0XHRcdFx0bWluYm94LngyID0gYnJpZGdlLng7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaG9yaXpvbnRhbEJyaWRnZSl7XG5cdFx0XHRcdGlmIChicmlkZ2UueSA8IG1pbmJveC55KVxuXHRcdFx0XHRcdG1pbmJveC55ID0gYnJpZGdlLnk7XG5cdFx0XHRcdGlmIChicmlkZ2UueSA+IG1pbmJveC55Milcblx0XHRcdFx0XHRtaW5ib3gueTIgPSBicmlkZ2UueTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIG1pblBhZGRpbmcgPSAwO1xuXHRcdGlmIChhcmVhLndhbGwpXG5cdFx0XHRtaW5QYWRkaW5nID0gMTtcblx0XHR2YXIgcGFkZGluZyA9IHtcblx0XHRcdHRvcDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIG1pbmJveC55IC0gYXJlYS55IC0gbWluUGFkZGluZyksXG5cdFx0XHRib3R0b206IFV0aWwucmFuZChtaW5QYWRkaW5nLCBhcmVhLnkgKyBhcmVhLmggLSBtaW5ib3gueTIgLSBtaW5QYWRkaW5nKSxcblx0XHRcdGxlZnQ6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBtaW5ib3gueCAtIGFyZWEueCAtIG1pblBhZGRpbmcpLFxuXHRcdFx0cmlnaHQ6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBhcmVhLnggKyBhcmVhLncgLSBtaW5ib3gueDIgLSBtaW5QYWRkaW5nKVxuXHRcdH07XG5cdFx0aWYgKHBhZGRpbmcudG9wIDwgMCkgcGFkZGluZy50b3AgPSAwO1xuXHRcdGlmIChwYWRkaW5nLmJvdHRvbSA8IDApIHBhZGRpbmcuYm90dG9tID0gMDtcblx0XHRpZiAocGFkZGluZy5sZWZ0IDwgMCkgcGFkZGluZy5sZWZ0ID0gMDtcblx0XHRpZiAocGFkZGluZy5yaWdodCA8IDApIHBhZGRpbmcucmlnaHQgPSAwO1xuXHRcdHZhciByb29teCA9IGFyZWEueDtcblx0XHR2YXIgcm9vbXkgPSBhcmVhLnk7XG5cdFx0dmFyIHJvb213ID0gYXJlYS53O1xuXHRcdHZhciByb29taCA9IGFyZWEuaDtcblx0XHRmb3IgKHZhciB4ID0gcm9vbXg7IHggPCByb29teCArIHJvb213OyB4Kyspe1xuXHRcdFx0Zm9yICh2YXIgeSA9IHJvb215OyB5IDwgcm9vbXkgKyByb29taDsgeSsrKXtcblx0XHRcdFx0dmFyIGRyYXdXYWxsID0gYXJlYS53YWxsICYmIGxldmVsLmNlbGxzW3hdW3ldICE9IGFyZWEuY29ycmlkb3IgJiYgbGV2ZWwuY2VsbHNbeF1beV0gIT0gJ2JyaWRnZSc7IFxuXHRcdFx0XHRpZiAoeSA8IHJvb215ICsgcGFkZGluZy50b3Ape1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB5ID09IHJvb215ICsgcGFkZGluZy50b3AgLSAxICYmIHggKyAxID49IHJvb214ICsgcGFkZGluZy5sZWZ0ICYmIHggPD0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHggPCByb29teCArIHBhZGRpbmcubGVmdCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHggPT0gcm9vbXggKyBwYWRkaW5nLmxlZnQgLSAxICYmIHkgPj0gcm9vbXkgKyBwYWRkaW5nLnRvcCAmJiB5IDw9IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSlcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeSA+IHJvb215ICsgcm9vbWggLSAxIC0gcGFkZGluZy5ib3R0b20pe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB5ID09IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSAmJiB4ICsgMSA+PSByb29teCArIHBhZGRpbmcubGVmdCAmJiB4IDw9IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0KVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh4ID4gcm9vbXggKyByb29tdyAtIDEgLSBwYWRkaW5nLnJpZ2h0KXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeCA9PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodCAmJiB5ID49IHJvb215ICsgcGFkZGluZy50b3AgJiYgeSA8PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20pXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFyZWEubWFya2VkKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0fSxcblx0dXNlQXJlYXM6IGZ1bmN0aW9uKGtlZXBBcmVhcywgYXJlYXMsIGJpZ0FyZWEpe1xuXHRcdC8vIEFsbCBrZWVwIGFyZWFzIHNob3VsZCBiZSBjb25uZWN0ZWQgd2l0aCBhIHNpbmdsZSBwaXZvdCBhcmVhXG5cdFx0dmFyIHBpdm90QXJlYSA9IFNwbGl0dGVyLmdldEFyZWFBdCh7eDogTWF0aC5yb3VuZChiaWdBcmVhLnggKyBiaWdBcmVhLncvMiksIHk6IE1hdGgucm91bmQoYmlnQXJlYS55ICsgYmlnQXJlYS5oLzIpfSx7eDowLHk6MH0sIGFyZWFzKTtcblx0XHR2YXIgcGF0aEFyZWFzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZWVwQXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGtlZXBBcmVhID0ga2VlcEFyZWFzW2ldO1xuXHRcdFx0a2VlcEFyZWEucmVuZGVyID0gdHJ1ZTtcblx0XHRcdHZhciBhcmVhc1BhdGggPSB0aGlzLmdldERydW5rZW5BcmVhc1BhdGgoa2VlcEFyZWEsIHBpdm90QXJlYSwgYXJlYXMpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhc1BhdGgubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRhcmVhc1BhdGhbal0ucmVuZGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKCFhcmVhLnJlbmRlcil7XG5cdFx0XHRcdGJyaWRnZXNSZW1vdmU6IGZvciAodmFyIGogPSAwOyBqIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRcdGlmICghYnJpZGdlLnRvKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBicmlkZ2UudG8uYnJpZGdlcy5sZW5ndGg7IGsrKyl7XG5cdFx0XHRcdFx0XHR2YXIgc291cmNlQnJpZGdlID0gYnJpZGdlLnRvLmJyaWRnZXNba107XG5cdFx0XHRcdFx0XHRpZiAoc291cmNlQnJpZGdlLnggPT0gYnJpZGdlLnggJiYgc291cmNlQnJpZGdlLnkgPT0gYnJpZGdlLnkpe1xuXHRcdFx0XHRcdFx0XHRVdGlsLnJlbW92ZUZyb21BcnJheShicmlkZ2UudG8uYnJpZGdlcywgc291cmNlQnJpZGdlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGdldERydW5rZW5BcmVhc1BhdGg6IGZ1bmN0aW9uIChmcm9tQXJlYSwgdG9BcmVhLCBhcmVhcyl7XG5cdFx0dmFyIGN1cnJlbnRBcmVhID0gZnJvbUFyZWE7XG5cdFx0dmFyIHBhdGggPSBbXTtcblx0XHRwYXRoLnB1c2goZnJvbUFyZWEpO1xuXHRcdHBhdGgucHVzaCh0b0FyZWEpO1xuXHRcdGlmIChmcm9tQXJlYSA9PSB0b0FyZWEpXG5cdFx0XHRyZXR1cm4gcGF0aDtcblx0XHR3aGlsZSAodHJ1ZSl7XG5cdFx0XHR2YXIgcmFuZG9tQnJpZGdlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY3VycmVudEFyZWEuYnJpZGdlcyk7XG5cdFx0XHRpZiAoIXJhbmRvbUJyaWRnZS50bylcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZiAoIVV0aWwuY29udGFpbnMocGF0aCwgcmFuZG9tQnJpZGdlLnRvKSl7XG5cdFx0XHRcdHBhdGgucHVzaChyYW5kb21CcmlkZ2UudG8pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJhbmRvbUJyaWRnZS50byA9PSB0b0FyZWEpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y3VycmVudEFyZWEgPSByYW5kb21CcmlkZ2UudG87XG5cdFx0fVxuXHRcdHJldHVybiBwYXRoO1xuXHR9XG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRoaXJkTGV2ZWxHZW5lcmF0b3I7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJhbmQ6IGZ1bmN0aW9uIChsb3csIGhpKXtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGhpIC0gbG93ICsgMSkpK2xvdztcblx0fSxcblx0cmFuZG9tRWxlbWVudE9mOiBmdW5jdGlvbiAoYXJyYXkpe1xuXHRcdHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYXJyYXkubGVuZ3RoKV07XG5cdH0sXG5cdGRpc3RhbmNlOiBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCh4Mi14MSkqKHgyLXgxKSArICh5Mi15MSkqKHkyLXkxKSk7XG5cdH0sXG5cdGZsYXREaXN0YW5jZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpe1xuXHRcdHZhciB4RGlzdCA9IE1hdGguYWJzKHgxIC0geDIpO1xuXHRcdHZhciB5RGlzdCA9IE1hdGguYWJzKHkxIC0geTIpO1xuXHRcdGlmICh4RGlzdCA9PT0geURpc3QpXG5cdFx0XHRyZXR1cm4geERpc3Q7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHhEaXN0ICsgeURpc3Q7XG5cdH0sXG5cdGxpbmVEaXN0YW5jZTogZnVuY3Rpb24ocG9pbnQxLCBwb2ludDIpe1xuXHQgIHZhciB4cyA9IDA7XG5cdCAgdmFyIHlzID0gMDtcblx0ICB4cyA9IHBvaW50Mi54IC0gcG9pbnQxLng7XG5cdCAgeHMgPSB4cyAqIHhzO1xuXHQgIHlzID0gcG9pbnQyLnkgLSBwb2ludDEueTtcblx0ICB5cyA9IHlzICogeXM7XG5cdCAgcmV0dXJuIE1hdGguc3FydCggeHMgKyB5cyApO1xuXHR9LFxuXHRkaXJlY3Rpb246IGZ1bmN0aW9uIChhLGIpe1xuXHRcdHJldHVybiB7eDogc2lnbihiLnggLSBhLngpLCB5OiBzaWduKGIueSAtIGEueSl9O1xuXHR9LFxuXHRjaGFuY2U6IGZ1bmN0aW9uIChjaGFuY2Upe1xuXHRcdHJldHVybiB0aGlzLnJhbmQoMCwxMDApIDw9IGNoYW5jZTtcblx0fSxcblx0Y29udGFpbnM6IGZ1bmN0aW9uKGFycmF5LCBlbGVtZW50KXtcblx0ICAgIHJldHVybiBhcnJheS5pbmRleE9mKGVsZW1lbnQpID4gLTE7XG5cdH0sXG5cdHJlbW92ZUZyb21BcnJheTogZnVuY3Rpb24oYXJyYXksIG9iamVjdCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYgKGFycmF5W2ldID09IG9iamVjdCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlRnJvbUFycmF5SW5kZXgoYXJyYXksIGksaSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHJlbW92ZUZyb21BcnJheUluZGV4OiBmdW5jdGlvbihhcnJheSwgZnJvbSwgdG8pIHtcblx0XHR2YXIgcmVzdCA9IGFycmF5LnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgYXJyYXkubGVuZ3RoKTtcblx0XHRhcnJheS5sZW5ndGggPSBmcm9tIDwgMCA/IGFycmF5Lmxlbmd0aCArIGZyb20gOiBmcm9tO1xuXHRcdHJldHVybiBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCByZXN0KTtcblx0fSxcblx0bGluZTogZnVuY3Rpb24gKGEsIGIpe1xuXHRcdHZhciBjb29yZGluYXRlc0FycmF5ID0gbmV3IEFycmF5KCk7XG5cdFx0dmFyIHgxID0gYS54O1xuXHRcdHZhciB5MSA9IGEueTtcblx0XHR2YXIgeDIgPSBiLng7XG5cdFx0dmFyIHkyID0gYi55O1xuXHQgICAgdmFyIGR4ID0gTWF0aC5hYnMoeDIgLSB4MSk7XG5cdCAgICB2YXIgZHkgPSBNYXRoLmFicyh5MiAtIHkxKTtcblx0ICAgIHZhciBzeCA9ICh4MSA8IHgyKSA/IDEgOiAtMTtcblx0ICAgIHZhciBzeSA9ICh5MSA8IHkyKSA/IDEgOiAtMTtcblx0ICAgIHZhciBlcnIgPSBkeCAtIGR5O1xuXHQgICAgY29vcmRpbmF0ZXNBcnJheS5wdXNoKHt4OiB4MSwgeTogeTF9KTtcblx0ICAgIHdoaWxlICghKCh4MSA9PSB4MikgJiYgKHkxID09IHkyKSkpIHtcblx0ICAgIFx0dmFyIGUyID0gZXJyIDw8IDE7XG5cdCAgICBcdGlmIChlMiA+IC1keSkge1xuXHQgICAgXHRcdGVyciAtPSBkeTtcblx0ICAgIFx0XHR4MSArPSBzeDtcblx0ICAgIFx0fVxuXHQgICAgXHRpZiAoZTIgPCBkeCkge1xuXHQgICAgXHRcdGVyciArPSBkeDtcblx0ICAgIFx0XHR5MSArPSBzeTtcblx0ICAgIFx0fVxuXHQgICAgXHRjb29yZGluYXRlc0FycmF5LnB1c2goe3g6IHgxLCB5OiB5MX0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvb3JkaW5hdGVzQXJyYXk7XG5cdH1cbn0iLCJ3aW5kb3cuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9HZW5lcmF0b3IuY2xhc3MnKTtcbndpbmRvdy5DYW52YXNSZW5kZXJlciA9IHJlcXVpcmUoJy4vQ2FudmFzUmVuZGVyZXIuY2xhc3MnKTtcbndpbmRvdy5LcmFtZ2luZUV4cG9ydGVyID0gcmVxdWlyZSgnLi9LcmFtZ2luZUV4cG9ydGVyLmNsYXNzJyk7Il19
