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
			area.enemies = ['bat', 'rat', 'spider'];
			area.enemyCount = Util.rand(3,5);
			if (Util.chance(20))
				area.boss = 'troll';
			area.items = [];
			var itemCount = Util.rand(3,5);
			for (var j = 0; j < itemCount; j++)
				area.items.push(Util.randomElementOf(['hpPotion', 'protection', 'dagger', 'shortSword']))
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
		for (var i = 0; i < level.enemies.length; i++){
			var enemy = level.enemies[i];
			var enemyData =
			{
	            x: enemy.x,
	            z: enemy.y,
	            y: 0,
	            type: 'enemy',
	            enemy: enemy.code
	        };
			objects.push(enemyData);
		}
		for (var i = 0; i < level.items.length; i++){
			var item = level.items[i];
			var itemData =
			{
	            x: item.x,
	            z: item.y,
	            y: 0,
	            type: 'item',
	            item: item.code
	        };
			objects.push(itemData);
		}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJ1bkNBOiBmdW5jdGlvbihtYXAsIHRyYW5zZm9ybUZ1bmN0aW9uLCB0aW1lcywgY3Jvc3Mpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKyl7XG5cdFx0XHR2YXIgbmV3TWFwID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKyl7XG5cdFx0XHRcdG5ld01hcFt4XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4Kyspe1xuXHRcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKyl7XG5cdFx0XHRcdFx0dmFyIHN1cnJvdW5kaW5nTWFwID0gW107XG5cdFx0XHRcdFx0Zm9yICh2YXIgeHggPSB4LTE7IHh4IDw9IHgrMTsgeHgrKyl7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciB5eSA9IHktMTsgeXkgPD0geSsxOyB5eSsrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGNyb3NzICYmICEoeHggPT0geCB8fCB5eSA9PSB5KSlcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0aWYgKHh4ID4gMCAmJiB4eCA8IG1hcC5sZW5ndGggJiYgeXkgPiAwICYmIHl5IDwgbWFwW3hdLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNlbGwgPSBtYXBbeHhdW3l5XTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc3Vycm91bmRpbmdNYXBbY2VsbF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRzdXJyb3VuZGluZ01hcFtjZWxsXSsrO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHN1cnJvdW5kaW5nTWFwW2NlbGxdID0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbmV3Q2VsbCA9IHRyYW5zZm9ybUZ1bmN0aW9uKG1hcFt4XVt5XSwgc3Vycm91bmRpbmdNYXApO1xuXHRcdFx0XHRcdGlmIChuZXdDZWxsKXtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG5ld0NlbGw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG1hcFt4XVt5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1hcCA9IG5ld01hcDtcblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufSIsImZ1bmN0aW9uIENhbnZhc1JlbmRlcmVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUgPSB7XG5cdGRyYXdTa2V0Y2g6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMsIG92ZXJsYXkpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTZweCBBdmF0YXJcIjtcblx0XHRpZiAoIW92ZXJsYXkpXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gbGV2ZWwuYXJlYXNbaV07XG5cdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y29udGV4dC5yZWN0KGFyZWEueCAqIHpvb20sIGFyZWEueSAqIHpvb20sIGFyZWEudyAqIHpvb20sIGFyZWEuaCAqIHpvb20pO1xuXHRcdFx0aWYgKCFvdmVybGF5KXtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAneWVsbG93Jztcblx0XHRcdFx0Y29udGV4dC5maWxsKCk7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR2YXIgYXJlYURlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHRpZiAoYXJlYS5hcmVhVHlwZSA9PSAncm9vbXMnKXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJEdW5nZW9uXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZWEuZmxvb3IgPT0gJ2Zha2VXYXRlcicpeyBcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJMYWdvb25cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiQ2F2ZXJuXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uICs9IFwiIChkKVwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWEuaGFzRW50cmFuY2Upe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gKz0gXCIgKHUpXCI7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRjb250ZXh0LmZpbGxUZXh0KGFyZWFEZXNjcmlwdGlvbiwoYXJlYS54KSogem9vbSArIDUsKGFyZWEueSApKiB6b29tICsgMjApO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjb250ZXh0LnJlY3QoKGJyaWRnZS54KSAqIHpvb20gLyotIHpvb20gLyAyKi8sIChicmlkZ2UueSkgKiB6b29tIC8qLSB6b29tIC8gMiovLCB6b29tLCB6b29tKTtcblx0XHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG5cdFx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRkcmF3TGV2ZWw6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTJweCBHZW9yZ2lhXCI7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0dmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07XG5cdFx0XHRcdGlmIChjZWxsID09PSAnd2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNTk0QjJEJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjYXZlcm5GbG9vcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM4NzY0MTgnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMEZGMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lV2FsbCcpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNCQkJCQkInO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lRmxvb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNjY2NjY2Jztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3BhZGRpbmcnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDBGRjAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjOTQ2ODAwJztcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KHggKiB6b29tLCB5ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0c3dpdGNoIChlbmVteS5jb2RlKXtcblx0XHRcdGNhc2UgJ2JhdCc6XG5cdFx0XHRcdGNvbG9yID0gJyNFRUVFRUUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xhdmFMaXphcmQnOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdkYWVtb24nOlxuXHRcdFx0XHRjb2xvciA9ICcjRkY4ODAwJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChlbmVteS54ICogem9vbSwgZW5lbXkueSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRzd2l0Y2ggKGl0ZW0uY29kZSl7XG5cdFx0XHRjYXNlICdkYWdnZXInOlxuXHRcdFx0XHRjb2xvciA9ICcjRUVFRUVFJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsZWF0aGVyQXJtb3InOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChpdGVtLnggKiB6b29tLCBpdGVtLnkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHR9XG5cdH0sXG5cdGRyYXdMZXZlbFdpdGhJY29uczogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcyl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxMnB4IEdlb3JnaWFcIjtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHR2YXIgd2F0ZXIgPSBuZXcgSW1hZ2UoKTtcblx0XHR3YXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIGZha2VXYXRlciA9IG5ldyBJbWFnZSgpO1xuXHRcdGZha2VXYXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIHNvbGlkUm9jayA9IG5ldyBJbWFnZSgpO1xuXHRcdHNvbGlkUm9jay5zcmMgPSAnaW1nL3NvbGlkUm9jay5wbmcnO1xuXHRcdHZhciBjYXZlcm5GbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdGNhdmVybkZsb29yLnNyYyA9ICdpbWcvY2F2ZXJuRmxvb3IucG5nJztcblx0XHR2YXIgZG93bnN0YWlycyA9IG5ldyBJbWFnZSgpO1xuXHRcdGRvd25zdGFpcnMuc3JjID0gJ2ltZy9kb3duc3RhaXJzLnBuZyc7XG5cdFx0dmFyIHVwc3RhaXJzID0gbmV3IEltYWdlKCk7XG5cdFx0dXBzdGFpcnMuc3JjID0gJ2ltZy91cHN0YWlycy5wbmcnO1xuXHRcdHZhciBzdG9uZVdhbGwgPSBuZXcgSW1hZ2UoKTtcblx0XHRzdG9uZVdhbGwuc3JjID0gJ2ltZy9zdG9uZVdhbGwucG5nJztcblx0XHR2YXIgc3RvbmVGbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdHN0b25lRmxvb3Iuc3JjID0gJ2ltZy9zdG9uZUZsb29yLnBuZyc7XG5cdFx0dmFyIGJyaWRnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGJyaWRnZS5zcmMgPSAnaW1nL2JyaWRnZS5wbmcnO1xuXHRcdHZhciBsYXZhID0gbmV3IEltYWdlKCk7XG5cdFx0bGF2YS5zcmMgPSAnaW1nL2xhdmEucG5nJztcblx0XHR2YXIgYmF0ID0gbmV3IEltYWdlKCk7XG5cdFx0YmF0LnNyYyA9ICdpbWcvYmF0LnBuZyc7XG5cdFx0dmFyIGxhdmFMaXphcmQgPSBuZXcgSW1hZ2UoKTtcblx0XHRsYXZhTGl6YXJkLnNyYyA9ICdpbWcvbGF2YUxpemFyZC5wbmcnO1xuXHRcdHZhciBkYWVtb24gPSBuZXcgSW1hZ2UoKTtcblx0XHRkYWVtb24uc3JjID0gJ2ltZy9kYWVtb24ucG5nJztcblx0XHR2YXIgdHJlYXN1cmUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVhc3VyZS5zcmMgPSAnaW1nL3RyZWFzdXJlLnBuZyc7XG5cdFx0dmFyIHRpbGVzID0ge1xuXHRcdFx0d2F0ZXI6IHdhdGVyLFxuXHRcdFx0ZmFrZVdhdGVyOiBmYWtlV2F0ZXIsXG5cdFx0XHRzb2xpZFJvY2s6IHNvbGlkUm9jayxcblx0XHRcdGNhdmVybkZsb29yOiBjYXZlcm5GbG9vcixcblx0XHRcdGRvd25zdGFpcnM6IGRvd25zdGFpcnMsXG5cdFx0XHR1cHN0YWlyczogdXBzdGFpcnMsXG5cdFx0XHRzdG9uZVdhbGw6IHN0b25lV2FsbCxcblx0XHRcdHN0b25lRmxvb3I6IHN0b25lRmxvb3IsXG5cdFx0XHRicmlkZ2U6IGJyaWRnZSxcblx0XHRcdGxhdmE6IGxhdmEsXG5cdFx0XHRiYXQ6IGJhdCxcblx0XHRcdGxhdmFMaXphcmQ6IGxhdmFMaXphcmQsXG5cdFx0XHRkYWVtb246IGRhZW1vbixcblx0XHRcdHRyZWFzdXJlOiB0cmVhc3VyZVxuXHRcdH1cblx0ICAgIHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTsgXG5cdFx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzW2NlbGxdLCB4ICogMTYsIHkgKiAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbZW5lbXkuY29kZV0sIGVuZW15LnggKiAxNiwgZW5lbXkueSAqIDE2KTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbJ3RyZWFzdXJlJ10sIGl0ZW0ueCAqIDE2LCBpdGVtLnkgKiAxNik7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzUmVuZGVyZXI7IiwiZnVuY3Rpb24gRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU3BsaXR0ZXIgPSByZXF1aXJlKCcuL1NwbGl0dGVyJyk7XG5cbkZpcnN0TGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dmFyIGhhc1JpdmVyID0gZGVwdGggPCA2ICYmIFV0aWwuY2hhbmNlKDEwMCAtIGRlcHRoICogMTUpO1xuXHRcdHZhciBoYXNMYXZhID0gZGVwdGggPiA1ICYmIFV0aWwuY2hhbmNlKGRlcHRoICogMTAgKyAyMCk7XG5cdFx0aGFzTGF2YSA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRoYXNSaXZlciA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRcblx0XHR2YXIgbWFpbkVudHJhbmNlID0gZGVwdGggPT0gMTtcblx0XHR2YXIgYXJlYXMgPSB0aGlzLmdlbmVyYXRlQXJlYXMoaGFzTGF2YSk7XG5cdFx0dGhpcy5wbGFjZUV4aXRzKGFyZWFzKTtcblx0XHR2YXIgbGV2ZWwgPSB7XG5cdFx0XHRoYXNSaXZlcnM6IGhhc1JpdmVyLFxuXHRcdFx0aGFzTGF2YTogaGFzTGF2YSxcblx0XHRcdG1haW5FbnRyYW5jZTogbWFpbkVudHJhbmNlLFxuXHRcdFx0c3RyYXRhOiAnc29saWRSb2NrJyxcblx0XHRcdGFyZWFzOiBhcmVhc1xuXHRcdH1cblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGdlbmVyYXRlQXJlYXM6IGZ1bmN0aW9uKGhhc0xhdmEpe1xuXHRcdHZhciBiaWdBcmVhID0ge1xuXHRcdFx0eDogMCxcblx0XHRcdHk6IDAsXG5cdFx0XHR3OiB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCxcblx0XHRcdGg6IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVFxuXHRcdH1cblx0XHR2YXIgbWF4RGVwdGggPSB0aGlzLmNvbmZpZy5TVUJESVZJU0lPTl9ERVBUSDtcblx0XHR2YXIgTUlOX1dJRFRIID0gdGhpcy5jb25maWcuTUlOX1dJRFRIO1xuXHRcdHZhciBNSU5fSEVJR0hUID0gdGhpcy5jb25maWcuTUlOX0hFSUdIVDtcblx0XHR2YXIgTUFYX1dJRFRIID0gdGhpcy5jb25maWcuTUFYX1dJRFRIO1xuXHRcdHZhciBNQVhfSEVJR0hUID0gdGhpcy5jb25maWcuTUFYX0hFSUdIVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfU1RBUlQgPSB0aGlzLmNvbmZpZy5TTElDRV9SQU5HRV9TVEFSVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfRU5EID0gdGhpcy5jb25maWcuU0xJQ0VfUkFOR0VfRU5EO1xuXHRcdHZhciBhcmVhcyA9IFNwbGl0dGVyLnN1YmRpdmlkZUFyZWEoYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5EKTtcblx0XHRTcGxpdHRlci5jb25uZWN0QXJlYXMoYXJlYXMsMyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKFV0aWwuY2hhbmNlKDcwKSl7IC8vVE9ETzogRGVmaW5lIGFyZWFzIGJhc2VkIG9uIGRlcHRoXG5cdFx0XHRcdGFyZWEuYXJlYVR5cGUgPSAnY2F2ZXJuJztcblx0XHRcdFx0YXJlYS5hcmVhSWQgPSAnYzEnO1xuXHRcdFx0XHRpZiAoaGFzTGF2YSl7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9ICdjYXZlcm5GbG9vcic7XG5cdFx0XHRcdFx0YXJlYS5jYXZlcm5UeXBlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoWydyb2NreScsJ2JyaWRnZXMnXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9IFV0aWwuY2hhbmNlKDUwKT8nZmFrZVdhdGVyJzonY2F2ZXJuRmxvb3InO1xuXHRcdFx0XHRcdGFyZWEuY2F2ZXJuVHlwZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKFsncm9ja3knLCdicmlkZ2VzJywnd2F0ZXJ5J10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhLmFyZWFUeXBlID0gJ3Jvb21zJztcblx0XHRcdFx0YXJlYS5hcmVhSWQgPSAnYzEnO1xuXHRcdFx0XHRhcmVhLmZsb29yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0XHRhcmVhLndhbGwgPSBVdGlsLmNoYW5jZSg1MCkgPyAnc3RvbmVXYWxsJyA6IGZhbHNlO1xuXHRcdFx0XHRhcmVhLmNvcnJpZG9yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0fVxuXHRcdFx0YXJlYS5lbmVtaWVzID0gWydiYXQnLCAncmF0JywgJ3NwaWRlciddO1xuXHRcdFx0YXJlYS5lbmVteUNvdW50ID0gVXRpbC5yYW5kKDMsNSk7XG5cdFx0XHRpZiAoVXRpbC5jaGFuY2UoMjApKVxuXHRcdFx0XHRhcmVhLmJvc3MgPSAndHJvbGwnO1xuXHRcdFx0YXJlYS5pdGVtcyA9IFtdO1xuXHRcdFx0dmFyIGl0ZW1Db3VudCA9IFV0aWwucmFuZCgzLDUpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBpdGVtQ291bnQ7IGorKylcblx0XHRcdFx0YXJlYS5pdGVtcy5wdXNoKFV0aWwucmFuZG9tRWxlbWVudE9mKFsnaHBQb3Rpb24nLCAncHJvdGVjdGlvbicsICdkYWdnZXInLCAnc2hvcnRTd29yZCddKSlcblx0XHR9XG5cdFx0cmV0dXJuIGFyZWFzO1xuXHR9LFxuXHRwbGFjZUV4aXRzOiBmdW5jdGlvbihhcmVhcyl7XG5cdFx0dmFyIGRpc3QgPSBudWxsO1xuXHRcdHZhciBhcmVhMSA9IG51bGw7XG5cdFx0dmFyIGFyZWEyID0gbnVsbDtcblx0XHR2YXIgZnVzZSA9IDEwMDA7XG5cdFx0ZG8ge1xuXHRcdFx0YXJlYTEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhcyk7XG5cdFx0XHRhcmVhMiA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRcdGlmIChmdXNlIDwgMCl7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZGlzdCA9IFV0aWwubGluZURpc3RhbmNlKGFyZWExLCBhcmVhMik7XG5cdFx0XHRmdXNlLS07XG5cdFx0fSB3aGlsZSAoZGlzdCA8ICh0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCArIHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVCkgLyAzKTtcblx0XHRhcmVhMS5oYXNFeGl0ID0gdHJ1ZTtcblx0XHRhcmVhMi5oYXNFbnRyYW5jZSA9IHRydWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaXJzdExldmVsR2VuZXJhdG9yOyIsImZ1bmN0aW9uIEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0dGhpcy5maXJzdExldmVsR2VuZXJhdG9yID0gbmV3IEZpcnN0TGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy5zZWNvbmRMZXZlbEdlbmVyYXRvciA9IG5ldyBTZWNvbmRMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLnRoaXJkTGV2ZWxHZW5lcmF0b3IgPSBuZXcgVGhpcmRMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLm1vbnN0ZXJQb3B1bGF0b3IgPSBuZXcgTW9uc3RlclBvcHVsYXRvcihjb25maWcpO1xuXHR0aGlzLml0ZW1Qb3B1bGF0b3IgPSBuZXcgSXRlbVBvcHVsYXRvcihjb25maWcpO1xufVxuXG52YXIgRmlyc3RMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vRmlyc3RMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIFNlY29uZExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9TZWNvbmRMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIFRoaXJkTGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL1RoaXJkTGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBNb25zdGVyUG9wdWxhdG9yID0gcmVxdWlyZSgnLi9Nb25zdGVyUG9wdWxhdG9yLmNsYXNzJyk7XG52YXIgSXRlbVBvcHVsYXRvciA9IHJlcXVpcmUoJy4vSXRlbVBvcHVsYXRvci5jbGFzcycpO1xuXG5HZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dmFyIHNrZXRjaCA9IHRoaXMuZmlyc3RMZXZlbEdlbmVyYXRvci5nZW5lcmF0ZUxldmVsKGRlcHRoKTtcblx0XHR2YXIgbGV2ZWwgPSB0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yLmZpbGxMZXZlbChza2V0Y2gpO1xuXHRcdHRoaXMudGhpcmRMZXZlbEdlbmVyYXRvci5maWxsTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5tb25zdGVyUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5pdGVtUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNrZXRjaDogc2tldGNoLFxuXHRcdFx0bGV2ZWw6IGxldmVsXG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yOyIsImZ1bmN0aW9uIEl0ZW1Qb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5JdGVtUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0bGV2ZWwuYWRkSXRlbShhcmVhLml0ZW1zW2ldLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUG9wdWxhdG9yOyIsImZ1bmN0aW9uIEtyYW1naW5lRXhwb3J0ZXIoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbktyYW1naW5lRXhwb3J0ZXIucHJvdG90eXBlID0ge1xuXHRnZXRMZXZlbDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciB0aWxlcyA9IHRoaXMuZ2V0VGlsZXMoKTtcblx0XHR2YXIgb2JqZWN0cyA9IHRoaXMuZ2V0T2JqZWN0cyhsZXZlbCk7XG5cdFx0dmFyIG1hcCA9IHRoaXMuZ2V0TWFwKGxldmVsKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGlsZXM6IHRpbGVzLFxuXHRcdFx0b2JqZWN0czogb2JqZWN0cyxcblx0XHRcdG1hcDogbWFwXG5cdFx0fTtcblx0fSxcblx0QkFTSUNfV0FMTF9USUxFOiB7XG4gICAgICAgIFwid1wiOjIsXG4gICAgICAgIFwieVwiOjAsXG4gICAgICAgIFwiaFwiOjIsXG4gICAgICAgIFwiY1wiOjAsXG4gICAgICAgIFwiZlwiOjAsXG4gICAgICAgIFwiY2hcIjoyLFxuICAgICAgICBcInNsXCI6MCxcbiAgICAgICAgXCJkaXJcIjowLFxuICAgICAgICBcImZ5XCI6MFxuICAgIH0sXG4gICAgQkFTSUNfRkxPT1JfVElMRToge1xuICAgIFx0XCJ3XCI6MCxcbiAgICAgICAgXCJ5XCI6MCxcbiAgICAgICAgXCJoXCI6MixcbiAgICAgICAgXCJjXCI6MixcbiAgICAgICAgXCJmXCI6MixcbiAgICAgICAgXCJjaFwiOjIsXG4gICAgICAgIFwic2xcIjowLFxuICAgICAgICBcImRpclwiOjAsXG4gICAgICAgIFwiZnlcIjowXG4gICAgfSxcbiAgICBXQVRFUl9USUxFOiB7XG4gICAgXHRcIndcIjowLFxuICAgIFx0XCJ5XCI6MCxcbiAgICBcdFwiaFwiOjIsXG4gICAgXHRcImNcIjoyLFxuICAgIFx0XCJmXCI6MTAxLFxuICAgIFx0XCJjaFwiOjIsXG4gICAgXHRcInNsXCI6MCxcbiAgICBcdFwiZGlyXCI6MCxcbiAgICBcdFwiZnlcIjowXG5cdH0sXG5cdExBVkFfVElMRToge1xuICAgIFx0XCJ3XCI6MCxcbiAgICBcdFwieVwiOjAsXG4gICAgXHRcImhcIjoyLFxuICAgIFx0XCJjXCI6MixcbiAgICBcdFwiZlwiOjEwMSxcbiAgICBcdFwiY2hcIjoyLFxuICAgIFx0XCJzbFwiOjAsXG4gICAgXHRcImRpclwiOjAsXG4gICAgXHRcImZ5XCI6MFxuXHR9LFxuXHRnZXRUaWxlczogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gW1xuXHQgICAgICAgIG51bGwsIFxuXHQgICAgICAgIHRoaXMuQkFTSUNfV0FMTF9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfV0FMTF9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuTEFWQV9USUxFLFxuXHQgICAgICAgIHRoaXMuV0FURVJfVElMRVxuXHRcdF07XG5cdH0sXG5cdGdldE9iamVjdHM6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgb2JqZWN0cyA9IFtdO1xuXHRcdG9iamVjdHMucHVzaCh7XG5cdFx0XHR4OiBsZXZlbC5zdGFydC54LFxuXHRcdFx0ejogbGV2ZWwuc3RhcnQueSxcblx0XHRcdHk6IDAsXG5cdFx0XHRkaXI6IDMsXG5cdFx0XHR0eXBlOiAncGxheWVyJ1xuXHRcdH0pO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0dmFyIGVuZW15RGF0YSA9XG5cdFx0XHR7XG5cdCAgICAgICAgICAgIHg6IGVuZW15LngsXG5cdCAgICAgICAgICAgIHo6IGVuZW15LnksXG5cdCAgICAgICAgICAgIHk6IDAsXG5cdCAgICAgICAgICAgIHR5cGU6ICdlbmVteScsXG5cdCAgICAgICAgICAgIGVuZW15OiBlbmVteS5jb2RlXG5cdCAgICAgICAgfTtcblx0XHRcdG9iamVjdHMucHVzaChlbmVteURhdGEpO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHR2YXIgaXRlbURhdGEgPVxuXHRcdFx0e1xuXHQgICAgICAgICAgICB4OiBpdGVtLngsXG5cdCAgICAgICAgICAgIHo6IGl0ZW0ueSxcblx0ICAgICAgICAgICAgeTogMCxcblx0ICAgICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuXHQgICAgICAgICAgICBpdGVtOiBpdGVtLmNvZGVcblx0ICAgICAgICB9O1xuXHRcdFx0b2JqZWN0cy5wdXNoKGl0ZW1EYXRhKTtcblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdHM7XG5cdH0sXG5cdGdldE1hcDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBtYXAgPSBbXTtcblx0XHR2YXIgY2VsbHMgPSBsZXZlbC5jZWxscztcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0bWFwW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTtcblx0XHRcdFx0dmFyIGlkID0gbnVsbDtcblx0XHRcdFx0aWYgKGNlbGwgPT09ICd3YXRlcicpe1xuXHRcdFx0XHRcdGlkID0gMTA7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2VsbCA9PT0gJ2Zha2VXYXRlcicpe1xuXHRcdFx0XHRcdGlkID0gMTA7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc29saWRSb2NrJyl7XG5cdFx0XHRcdFx0aWQgPSAxO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2NhdmVybkZsb29yJyl7XG5cdFx0XHRcdFx0aWQgPSAyO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRpZCA9IDM7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAndXBzdGFpcnMnKXtcblx0XHRcdFx0XHRpZCA9IDQ7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVXYWxsJyl7XG5cdFx0XHRcdFx0aWQgPSA1O1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lRmxvb3InKXtcblx0XHRcdFx0XHRpZCA9IDY7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY29ycmlkb3InKXtcblx0XHRcdFx0XHRpZCA9IDc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnYnJpZGdlJyl7XG5cdFx0XHRcdFx0aWQgPSA4O1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2xhdmEnKXtcblx0XHRcdFx0XHRpZCA9IDk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWFwW3hdW3ldID0gaWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLcmFtZ2luZUV4cG9ydGVyOyIsImZ1bmN0aW9uIExldmVsKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbkxldmVsLnByb3RvdHlwZSA9IHtcblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHR0aGlzLmNlbGxzID0gW107XG5cdFx0dGhpcy5lbmVtaWVzID0gW107XG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHR0aGlzLmNlbGxzW3hdID0gW107XG5cdFx0fVxuXHR9LFxuXHRhZGRFbmVteTogZnVuY3Rpb24oZW5lbXksIHgsIHkpe1xuXHRcdHRoaXMuZW5lbWllcy5wdXNoKHtcblx0XHRcdGNvZGU6IGVuZW15LFxuXHRcdFx0eDogeCxcblx0XHRcdHk6IHlcblx0XHR9KTtcblx0fSxcblx0YWRkSXRlbTogZnVuY3Rpb24oaXRlbSwgeCwgeSl7XG5cdFx0dGhpcy5pdGVtcy5wdXNoKHtcblx0XHRcdGNvZGU6IGl0ZW0sXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeVxuXHRcdH0pO1xuXHR9LFxuXHRnZXRGcmVlUGxhY2U6IGZ1bmN0aW9uKGFyZWEpe1xuXHRcdHdoaWxlKHRydWUpe1xuXHRcdFx0dmFyIHJhbmRQb2ludCA9IHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKGFyZWEueCwgYXJlYS54K2FyZWEudy0xKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKGFyZWEueSwgYXJlYS55K2FyZWEuaC0xKVxuXHRcdFx0fVxuXHRcdFx0dmFyIGNlbGwgPSB0aGlzLmNlbGxzW3JhbmRQb2ludC54XVtyYW5kUG9pbnQueV07IFxuXHRcdFx0aWYgKGNlbGwgPT0gYXJlYS5mbG9vciB8fCBhcmVhLmNvcnJpZG9yICYmIGNlbGwgPT0gYXJlYS5jb3JyaWRvciB8fCBjZWxsID09ICdmYWtlV2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gcmFuZFBvaW50O1xuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbDsiLCJmdW5jdGlvbiBNb25zdGVyUG9wdWxhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuTW9uc3RlclBvcHVsYXRvci5wcm90b3R5cGUgPSB7XG5cdHBvcHVsYXRlTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0dGhpcy5wb3B1bGF0ZUFyZWEoYXJlYSwgbGV2ZWwpO1xuXHRcdH1cblx0fSxcblx0cG9wdWxhdGVBcmVhOiBmdW5jdGlvbihhcmVhLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmVuZW15Q291bnQ7IGkrKyl7XG5cdFx0XHR2YXIgcG9zaXRpb24gPSBsZXZlbC5nZXRGcmVlUGxhY2UoYXJlYSk7XG5cdFx0XHRpZiAocG9zaXRpb24pe1xuXHRcdFx0XHR0aGlzLmFkZE1vbnN0ZXIoYXJlYSwgIHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIGxldmVsKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGFyZWEuYm9zcyl7XG5cdFx0XHR2YXIgcG9zaXRpb24gPSBsZXZlbC5nZXRGcmVlUGxhY2UoYXJlYSk7XG5cdFx0XHRpZiAocG9zaXRpb24pe1xuXHRcdFx0XHRsZXZlbC5hZGRFbmVteShhcmVhLmJvc3MsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0YWRkTW9uc3RlcjogZnVuY3Rpb24oYXJlYSwgeCwgeSwgbGV2ZWwpe1xuXHRcdHZhciBtb25zdGVyID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYS5lbmVtaWVzKTtcblx0XHRsZXZlbC5hZGRFbmVteShtb25zdGVyLCB4LCB5KTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnN0ZXJQb3B1bGF0b3I7IiwiZnVuY3Rpb24gU2Vjb25kTGV2ZWxHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIExldmVsID0gcmVxdWlyZSgnLi9MZXZlbC5jbGFzcycpO1xudmFyIENBID0gcmVxdWlyZSgnLi9DQScpO1xuXG5TZWNvbmRMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGZpbGxMZXZlbDogZnVuY3Rpb24oc2tldGNoKXtcblx0XHR2YXIgbGV2ZWwgPSBuZXcgTGV2ZWwodGhpcy5jb25maWcpO1xuXHRcdGxldmVsLmluaXQoKTtcblx0XHR0aGlzLmZpbGxTdHJhdGEobGV2ZWwsIHNrZXRjaCk7XG5cdFx0aWYgKHNrZXRjaC5oYXNSaXZlcnMpXG5cdFx0XHR0aGlzLnBsb3RSaXZlcnMobGV2ZWwsIHNrZXRjaCwgJ3dhdGVyJyk7XG5cdFx0aWYgKHNrZXRjaC5oYXNMYXZhKVxuXHRcdFx0dGhpcy5wbG90Uml2ZXJzKGxldmVsLCBza2V0Y2gsICdsYXZhJyk7XG5cdFx0dGhpcy5jb3B5R2VvKGxldmVsKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGZpbGxTdHJhdGE6IGZ1bmN0aW9uKGxldmVsLCBza2V0Y2gpe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y29weUdlbzogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBnZW8gPSBbXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Z2VvW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0Z2VvW3hdW3ldID0gbGV2ZWwuY2VsbHNbeF1beV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldmVsLmdlbyA9IGdlbztcblx0fSxcblx0cGxvdFJpdmVyczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHR0aGlzLnBsYWNlUml2ZXJsaW5lcyhsZXZlbCwgc2tldGNoLCBsaXF1aWQpO1xuXHRcdHRoaXMuZmF0dGVuUml2ZXJzKGxldmVsLCBsaXF1aWQpO1xuXHRcdGlmIChsaXF1aWQgPT0gJ2xhdmEnKVxuXHRcdFx0dGhpcy5mYXR0ZW5SaXZlcnMobGV2ZWwsIGxpcXVpZCk7XG5cdH0sXG5cdGZhdHRlblJpdmVyczogZnVuY3Rpb24obGV2ZWwsIGxpcXVpZCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nW2xpcXVpZF0gPiAxICYmIFV0aWwuY2hhbmNlKDMwKSlcblx0XHRcdFx0cmV0dXJuIGxpcXVpZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbbGlxdWlkXSA+IDEpXG5cdFx0XHRcdHJldHVybiBsaXF1aWQ7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdH0sXG5cdHBsYWNlUml2ZXJsaW5lczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHQvLyBQbGFjZSByYW5kb20gbGluZSBzZWdtZW50cyBvZiB3YXRlclxuXHRcdHZhciByaXZlcnMgPSBVdGlsLnJhbmQodGhpcy5jb25maWcuTUlOX1JJVkVSUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJTKTtcblx0XHR2YXIgcml2ZXJTZWdtZW50TGVuZ3RoID0gdGhpcy5jb25maWcuUklWRVJfU0VHTUVOVF9MRU5HVEg7XG5cdFx0dmFyIHB1ZGRsZSA9IGZhbHNlO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcml2ZXJzOyBpKyspe1xuXHRcdFx0dmFyIHNlZ21lbnRzID0gVXRpbC5yYW5kKHRoaXMuY29uZmlnLk1JTl9SSVZFUl9TRUdNRU5UUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJfU0VHTUVOVFMpO1xuXHRcdFx0dmFyIHJpdmVyUG9pbnRzID0gW107XG5cdFx0XHRyaXZlclBvaW50cy5wdXNoKHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdH0pO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBzZWdtZW50czsgaisrKXtcblx0XHRcdFx0dmFyIHJhbmRvbVBvaW50ID0gVXRpbC5yYW5kb21FbGVtZW50T2Yocml2ZXJQb2ludHMpO1xuXHRcdFx0XHRpZiAocml2ZXJQb2ludHMubGVuZ3RoID4gMSAmJiAhcHVkZGxlKVxuXHRcdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KHJpdmVyUG9pbnRzLCByYW5kb21Qb2ludCk7XG5cdFx0XHRcdHZhciBpYW5jZSA9IHtcblx0XHRcdFx0XHR4OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKSxcblx0XHRcdFx0XHR5OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbmV3UG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogcmFuZG9tUG9pbnQueCArIGlhbmNlLngsXG5cdFx0XHRcdFx0eTogcmFuZG9tUG9pbnQueSArIGlhbmNlLnksXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmIChuZXdQb2ludC54ID4gMCAmJiBuZXdQb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0bmV3UG9pbnQueSA+IDAgJiYgbmV3UG9pbnQueSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdFx0XHRyaXZlclBvaW50cy5wdXNoKG5ld1BvaW50KTtcblx0XHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUocmFuZG9tUG9pbnQsIG5ld1BvaW50KTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBsaW5lLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2tdO1xuXHRcdFx0XHRcdGlmIChwb2ludC54ID4gMCAmJiBwb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0XHRwb2ludC55ID4gMCAmJiBwb2ludC55IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gbGlxdWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2Vjb25kTGV2ZWxHZW5lcmF0b3I7IiwidmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdWJkaXZpZGVBcmVhOiBmdW5jdGlvbihiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQsIGF2b2lkUG9pbnRzKXtcblx0XHR2YXIgYXJlYXMgPSBbXTtcblx0XHR2YXIgYmlnQXJlYXMgPSBbXTtcblx0XHRiaWdBcmVhLmRlcHRoID0gMDtcblx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdHZhciByZXRyaWVzID0gMDtcblx0XHR3aGlsZSAoYmlnQXJlYXMubGVuZ3RoID4gMCl7XG5cdFx0XHR2YXIgYmlnQXJlYSA9IGJpZ0FyZWFzLnBvcCgpO1xuXHRcdFx0dmFyIGhvcml6b250YWxTcGxpdCA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRcdGlmIChiaWdBcmVhLncgPCBNSU5fV0lEVEggKiAxLjUgJiYgYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS53IDwgTUlOX1dJRFRIICogMS41KXtcblx0XHRcdFx0aG9yaXpvbnRhbFNwbGl0ID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGhvcml6b250YWxTcGxpdCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGFyZWExID0gbnVsbDtcblx0XHRcdHZhciBhcmVhMiA9IG51bGw7XG5cdFx0XHRpZiAoaG9yaXpvbnRhbFNwbGl0KXtcblx0XHRcdFx0dmFyIHNsaWNlID0gTWF0aC5yb3VuZChVdGlsLnJhbmQoYmlnQXJlYS5oICogU0xJQ0VfUkFOR0VfU1RBUlQsIGJpZ0FyZWEuaCAqIFNMSUNFX1JBTkdFX0VORCkpO1xuXHRcdFx0XHRhcmVhMSA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudyxcblx0XHRcdFx0XHRoOiBzbGljZVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55ICsgc2xpY2UsXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaCAtIHNsaWNlXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBzbGljZSA9IE1hdGgucm91bmQoVXRpbC5yYW5kKGJpZ0FyZWEudyAqIFNMSUNFX1JBTkdFX1NUQVJULCBiaWdBcmVhLncgKiBTTElDRV9SQU5HRV9FTkQpKTtcblx0XHRcdFx0YXJlYTEgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54LFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSxcblx0XHRcdFx0XHR3OiBzbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngrc2xpY2UsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudy1zbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChhcmVhMS53IDwgTUlOX1dJRFRIIHx8IGFyZWExLmggPCBNSU5fSEVJR0hUIHx8XG5cdFx0XHRcdGFyZWEyLncgPCBNSU5fV0lEVEggfHwgYXJlYTIuaCA8IE1JTl9IRUlHSFQpe1xuXHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCAmJiBcblx0XHRcdFx0XHQoYXJlYTEudyA+IE1BWF9XSURUSCB8fCBhcmVhMS5oID4gTUFYX0hFSUdIVCB8fFxuXHRcdFx0XHRcdGFyZWEyLncgPiBNQVhfV0lEVEggfHwgYXJlYTIuaCA+IE1BWF9IRUlHSFQpKXtcblx0XHRcdFx0aWYgKHJldHJpZXMgPCAxMDApIHtcblx0XHRcdFx0XHQvLyBQdXNoIGJhY2sgYmlnIGFyZWFcblx0XHRcdFx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMrKztcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVx0XHRcblx0XHRcdH1cblx0XHRcdGlmIChhdm9pZFBvaW50cyAmJiAodGhpcy5jb2xsaWRlc1dpdGgoYXZvaWRQb2ludHMsIGFyZWEyKSB8fCB0aGlzLmNvbGxpZGVzV2l0aChhdm9pZFBvaW50cywgYXJlYTEpKSl7XG5cdFx0XHRcdGlmIChyZXRyaWVzID4gMTAwKXtcblx0XHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFB1c2ggYmFjayBiaWcgYXJlYVxuXHRcdFx0XHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcysrO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0XHRjb250aW51ZTsgXG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCl7XG5cdFx0XHRcdGFyZWExLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYTIuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGFyZWExKTtcblx0XHRcdFx0YXJlYXMucHVzaChhcmVhMik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhMS5kZXB0aCA9IGJpZ0FyZWEuZGVwdGggKzE7XG5cdFx0XHRcdGFyZWEyLmRlcHRoID0gYmlnQXJlYS5kZXB0aCArMTtcblx0XHRcdFx0YmlnQXJlYXMucHVzaChhcmVhMSk7XG5cdFx0XHRcdGJpZ0FyZWFzLnB1c2goYXJlYTIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYXJlYXM7XG5cdH0sXG5cdGNvbGxpZGVzV2l0aDogZnVuY3Rpb24oYXZvaWRQb2ludHMsIGFyZWEpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXZvaWRQb2ludHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGF2b2lkUG9pbnQgPSBhdm9pZFBvaW50c1tpXTtcblx0XHRcdGlmIChVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54K2FyZWEudywgYXJlYS55LCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCthcmVhLncsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0Y29ubmVjdEFyZWFzOiBmdW5jdGlvbihhcmVhcywgYm9yZGVyKXtcblx0XHQvKiBNYWtlIG9uZSBhcmVhIGNvbm5lY3RlZFxuXHRcdCAqIFdoaWxlIG5vdCBhbGwgYXJlYXMgY29ubmVjdGVkLFxuXHRcdCAqICBTZWxlY3QgYSBjb25uZWN0ZWQgYXJlYVxuXHRcdCAqICBTZWxlY3QgYSB2YWxpZCB3YWxsIGZyb20gdGhlIGFyZWFcblx0XHQgKiAgVGVhciBpdCBkb3duLCBjb25uZWN0aW5nIHRvIHRoZSBhIG5lYXJieSBhcmVhXG5cdFx0ICogIE1hcmsgYXJlYSBhcyBjb25uZWN0ZWRcblx0XHQgKi9cblx0XHRpZiAoIWJvcmRlcil7XG5cdFx0XHRib3JkZXIgPSAxO1xuXHRcdH1cblx0XHR2YXIgY29ubmVjdGVkQXJlYXMgPSBbXTtcblx0XHR2YXIgcmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKHJhbmRvbUFyZWEpO1xuXHRcdHZhciBjdXJzb3IgPSB7fTtcblx0XHR2YXIgdmFyaSA9IHt9O1xuXHRcdGFyZWE6IHdoaWxlIChjb25uZWN0ZWRBcmVhcy5sZW5ndGggPCBhcmVhcy5sZW5ndGgpe1xuXHRcdFx0cmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGNvbm5lY3RlZEFyZWFzKTtcblx0XHRcdHZhciB3YWxsRGlyID0gVXRpbC5yYW5kKDEsNCk7XG5cdFx0XHRzd2l0Y2god2FsbERpcil7XG5cdFx0XHRjYXNlIDE6IC8vIExlZnRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLng7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciAsIHJhbmRvbUFyZWEueStyYW5kb21BcmVhLmggLSBib3JkZXIpO1xuXHRcdFx0XHR2YXJpLnggPSAtMjtcblx0XHRcdFx0dmFyaS55ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6IC8vUmlnaHRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLnggKyByYW5kb21BcmVhLnc7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciwgcmFuZG9tQXJlYS55K3JhbmRvbUFyZWEuaCAtIGJvcmRlcik7XG5cdFx0XHRcdHZhcmkueCA9IDI7XG5cdFx0XHRcdHZhcmkueSA9IDA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOiAvL1VwXG5cdFx0XHRcdGN1cnNvci54ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueCArIGJvcmRlciwgcmFuZG9tQXJlYS54K3JhbmRvbUFyZWEudyAtIGJvcmRlcik7XG5cdFx0XHRcdGN1cnNvci55ID0gcmFuZG9tQXJlYS55O1xuXHRcdFx0XHR2YXJpLnggPSAwO1xuXHRcdFx0XHR2YXJpLnkgPSAtMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6IC8vRG93blxuXHRcdFx0XHRjdXJzb3IueCA9IFV0aWwucmFuZChyYW5kb21BcmVhLnggKyBib3JkZXIsIHJhbmRvbUFyZWEueCtyYW5kb21BcmVhLncgLSBib3JkZXIpO1xuXHRcdFx0XHRjdXJzb3IueSA9IHJhbmRvbUFyZWEueSArIHJhbmRvbUFyZWEuaDtcblx0XHRcdFx0dmFyaS54ID0gMDtcblx0XHRcdFx0dmFyaS55ID0gMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHR2YXIgY29ubmVjdGVkQXJlYSA9IHRoaXMuZ2V0QXJlYUF0KGN1cnNvciwgdmFyaSwgYXJlYXMpO1xuXHRcdFx0aWYgKGNvbm5lY3RlZEFyZWEgJiYgIVV0aWwuY29udGFpbnMoY29ubmVjdGVkQXJlYXMsIGNvbm5lY3RlZEFyZWEpKXtcblx0XHRcdFx0c3dpdGNoKHdhbGxEaXIpe1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoY3Vyc29yLnkgPD0gY29ubmVjdGVkQXJlYS55ICsgYm9yZGVyIHx8IGN1cnNvci55ID49IGNvbm5lY3RlZEFyZWEueSArIGNvbm5lY3RlZEFyZWEuaCAtIGJvcmRlcilcblx0XHRcdFx0XHRcdGNvbnRpbnVlIGFyZWE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdGlmIChjdXJzb3IueCA8PSBjb25uZWN0ZWRBcmVhLnggKyBib3JkZXIgfHwgY3Vyc29yLnggPj0gY29ubmVjdGVkQXJlYS54ICsgY29ubmVjdGVkQXJlYS53IC0gYm9yZGVyKVxuXHRcdFx0XHRcdFx0Y29udGludWUgYXJlYTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jb25uZWN0QXJlYShyYW5kb21BcmVhLCBjb25uZWN0ZWRBcmVhLCBjdXJzb3IpO1xuXHRcdFx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKGNvbm5lY3RlZEFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2V0QXJlYUF0OiBmdW5jdGlvbihjdXJzb3IsIHZhcmksIGFyZWFzKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoY3Vyc29yLnggKyB2YXJpLnggPj0gYXJlYS54ICYmIGN1cnNvci54ICsgdmFyaS54IDw9IGFyZWEueCArIGFyZWEudyBcblx0XHRcdFx0XHQmJiBjdXJzb3IueSArIHZhcmkueSA+PSBhcmVhLnkgJiYgY3Vyc29yLnkgKyB2YXJpLnkgPD0gYXJlYS55ICsgYXJlYS5oKVxuXHRcdFx0XHRyZXR1cm4gYXJlYTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRjb25uZWN0QXJlYTogZnVuY3Rpb24oYXJlYTEsIGFyZWEyLCBwb3NpdGlvbil7XG5cdFx0YXJlYTEuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWEyXG5cdFx0fSk7XG5cdFx0YXJlYTIuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWExXG5cdFx0fSk7XG5cdH1cbn0iLCJmdW5jdGlvbiBUaGlyZExldmVsR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBDQSA9IHJlcXVpcmUoJy4vQ0EnKTtcbnZhciBTcGxpdHRlciA9IHJlcXVpcmUoJy4vU3BsaXR0ZXInKTtcblxuVGhpcmRMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGZpbGxMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0dGhpcy5maWxsUm9vbXMoc2tldGNoLCBsZXZlbClcblx0XHR0aGlzLmZhdHRlbkNhdmVybnMobGV2ZWwpO1xuXHRcdHRoaXMucGxhY2VFeGl0cyhza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLnJhaXNlSXNsYW5kcyhsZXZlbCk7XG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRmYXR0ZW5DYXZlcm5zOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0Ly8gR3JvdyBjYXZlcm5zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddID4gMCAmJiBVdGlsLmNoYW5jZSgyMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXSA+IDEpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdC8vIEdyb3cgbGFnb29uIGFyZWFzXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDAgJiYgVXRpbC5jaGFuY2UoNDApKVxuXHRcdFx0XHRyZXR1cm4gJ2Zha2VXYXRlcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDApXG5cdFx0XHRcdHJldHVybiAnZmFrZVdhdGVyJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRcblx0XHRcblx0XHQvLyBFeHBhbmQgd2FsbC1sZXNzIHJvb21zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3NvbGlkUm9jaycpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMiAmJiBVdGlsLmNoYW5jZSgxMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzb2xpZFJvY2snKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10+MClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gRGV0ZXJpb3JhdGUgd2FsbCByb29tc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzdG9uZVdhbGwnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgVXRpbC5jaGFuY2UoNSkpXG5cdFx0XHRcdHJldHVybiAnc3RvbmVGbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0XG5cdH0sXG5cdHJhaXNlSXNsYW5kczogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICd3YXRlcicpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdHZhciBjYXZlcm5zID0gc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ107IFxuXHRcdFx0aWYgKGNhdmVybnMgPiAwICYmIFV0aWwuY2hhbmNlKDcwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gSXNsYW5kIGZvciBleGl0cyBvbiB3YXRlclxuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdmYWtlV2F0ZXInICYmIGN1cnJlbnQgIT0gJ3dhdGVyJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIHN0YWlycyA9IHN1cnJvdW5kaW5nWydkb3duc3RhaXJzJ10gPyBzdXJyb3VuZGluZ1snZG93bnN0YWlycyddIDogMCArXG5cdFx0XHRcdFx0c3Vycm91bmRpbmdbJ3Vwc3RhaXJzJ10gPyBzdXJyb3VuZGluZ1sndXBzdGFpcnMnXSA6IDA7IFxuXHRcdFx0aWYgKHN0YWlycyA+IDApXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEpO1xuXHR9LFxuXHRmaWxsUm9vbXM6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0dmFyIHR5cGUgPSBhcmVhLmFyZWFUeXBlO1xuXHRcdFx0aWYgKHR5cGUgPT09ICdjYXZlcm4nKXsgXG5cdFx0XHRcdHRoaXMuZmlsbFdpdGhDYXZlcm4obGV2ZWwsIGFyZWEpO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAncm9vbXMnKXtcblx0XHRcdFx0dGhpcy5maWxsV2l0aFJvb21zKGxldmVsLCBhcmVhKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHBsYWNlRXhpdHM6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0aWYgKCFhcmVhLmhhc0V4aXQgJiYgIWFyZWEuaGFzRW50cmFuY2UpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0dmFyIHRpbGUgPSBudWxsO1xuXHRcdFx0aWYgKGFyZWEuaGFzRXhpdCl7XG5cdFx0XHRcdHRpbGUgPSAnZG93bnN0YWlycyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aWxlID0gJ3Vwc3RhaXJzJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmVlU3BvdCA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGxldmVsLmNlbGxzW2ZyZWVTcG90LnhdW2ZyZWVTcG90LnldID0gdGlsZTtcblx0XHRcdGlmIChhcmVhLmhhc0V4aXQpe1xuXHRcdFx0XHRsZXZlbC5lbmQgPSB7XG5cdFx0XHRcdFx0eDogZnJlZVNwb3QueCxcblx0XHRcdFx0XHR5OiBmcmVlU3BvdC55XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXZlbC5zdGFydCA9IHtcblx0XHRcdFx0XHR4OiBmcmVlU3BvdC54LFxuXHRcdFx0XHRcdHk6IGZyZWVTcG90Lnlcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGZpbGxXaXRoQ2F2ZXJuOiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0Ly8gQ29ubmVjdCBhbGwgYnJpZGdlcyB3aXRoIG1pZHBvaW50XG5cdFx0dmFyIG1pZHBvaW50ID0ge1xuXHRcdFx0eDogTWF0aC5yb3VuZChVdGlsLnJhbmQoYXJlYS54ICsgYXJlYS53ICogMS8zLCBhcmVhLngrYXJlYS53ICogMi8zKSksXG5cdFx0XHR5OiBNYXRoLnJvdW5kKFV0aWwucmFuZChhcmVhLnkgKyBhcmVhLmggKiAxLzMsIGFyZWEueSthcmVhLmggKiAyLzMpKVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2ldO1xuXHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUobWlkcG9pbnQsIGJyaWRnZSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxpbmUubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2pdO1xuXHRcdFx0XHR2YXIgY3VycmVudENlbGwgPSBsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XTtcblx0XHRcdFx0aWYgKGFyZWEuY2F2ZXJuVHlwZSA9PSAncm9ja3knKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdFx0ZWxzZSBpZiAoY3VycmVudENlbGwgPT0gJ3dhdGVyJyB8fCBjdXJyZW50Q2VsbCA9PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlmIChhcmVhLmZsb29yICE9ICdmYWtlV2F0ZXInICYmIGFyZWEuY2F2ZXJuVHlwZSA9PSAnYnJpZGdlcycpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gJ2Zha2VXYXRlcic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIFNjcmF0Y2ggdGhlIGFyZWFcblx0XHR2YXIgc2NyYXRjaGVzID0gVXRpbC5yYW5kKDIsNCk7XG5cdFx0dmFyIGNhdmVTZWdtZW50cyA9IFtdO1xuXHRcdGNhdmVTZWdtZW50cy5wdXNoKG1pZHBvaW50KTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNjcmF0Y2hlczsgaSsrKXtcblx0XHRcdHZhciBwMSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGNhdmVTZWdtZW50cyk7XG5cdFx0XHRpZiAoY2F2ZVNlZ21lbnRzLmxlbmd0aCA+IDEpXG5cdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KGNhdmVTZWdtZW50cywgcDEpO1xuXHRcdFx0dmFyIHAyID0ge1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoYXJlYS54LCBhcmVhLngrYXJlYS53LTEpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoYXJlYS55LCBhcmVhLnkrYXJlYS5oLTEpXG5cdFx0XHR9XG5cdFx0XHRjYXZlU2VnbWVudHMucHVzaChwMik7XG5cdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShwMiwgcDEpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIHBvaW50ID0gbGluZVtqXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRDZWxsID0gbGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV07XG5cdFx0XHRcdGlmIChjdXJyZW50Q2VsbCAhPSAnd2F0ZXInICYmIGN1cnJlbnRDZWxsICE9ICdsYXZhJykgIFxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGZpbGxXaXRoUm9vbXM6IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHR2YXIgYmlnQXJlYSA9IHtcblx0XHRcdHg6IGFyZWEueCxcblx0XHRcdHk6IGFyZWEueSxcblx0XHRcdHc6IGFyZWEudyxcblx0XHRcdGg6IGFyZWEuaFxuXHRcdH1cblx0XHR2YXIgbWF4RGVwdGggPSAyO1xuXHRcdHZhciBNSU5fV0lEVEggPSA2O1xuXHRcdHZhciBNSU5fSEVJR0hUID0gNjtcblx0XHR2YXIgTUFYX1dJRFRIID0gMTA7XG5cdFx0dmFyIE1BWF9IRUlHSFQgPSAxMDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfU1RBUlQgPSAzLzg7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX0VORCA9IDUvODtcblx0XHR2YXIgYXJlYXMgPSBTcGxpdHRlci5zdWJkaXZpZGVBcmVhKGJpZ0FyZWEsIG1heERlcHRoLCBNSU5fV0lEVEgsIE1JTl9IRUlHSFQsIE1BWF9XSURUSCwgTUFYX0hFSUdIVCwgU0xJQ0VfUkFOR0VfU1RBUlQsIFNMSUNFX1JBTkdFX0VORCwgYXJlYS5icmlkZ2VzKTtcblx0XHRTcGxpdHRlci5jb25uZWN0QXJlYXMoYXJlYXMsIGFyZWEud2FsbCA/IDIgOiAxKTsgXG5cdFx0dmFyIGJyaWRnZUFyZWFzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgc3ViYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRpZiAoU3BsaXR0ZXIuZ2V0QXJlYUF0KGJyaWRnZSx7eDowLHk6MH0sIGFyZWFzKSA9PSBzdWJhcmVhKXtcblx0XHRcdFx0XHRpZiAoIVV0aWwuY29udGFpbnMoYnJpZGdlQXJlYXMsIHN1YmFyZWEpKXtcblx0XHRcdFx0XHRcdGJyaWRnZUFyZWFzLnB1c2goc3ViYXJlYSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN1YmFyZWEuYnJpZGdlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHg6IGJyaWRnZS54LFxuXHRcdFx0XHRcdFx0eTogYnJpZGdlLnlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVzZUFyZWFzKGJyaWRnZUFyZWFzLCBhcmVhcywgYmlnQXJlYSk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgc3ViYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKCFzdWJhcmVhLnJlbmRlcilcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRzdWJhcmVhLmZsb29yID0gYXJlYS5mbG9vcjtcblx0XHRcdHN1YmFyZWEud2FsbCA9IGFyZWEud2FsbDtcblx0XHRcdHN1YmFyZWEuY29ycmlkb3IgPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0dGhpcy5jYXJ2ZVJvb21BdChsZXZlbCwgc3ViYXJlYSk7XG5cdFx0fVxuXHR9LFxuXHRjYXJ2ZVJvb21BdDogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdHZhciBtaW5ib3ggPSB7XG5cdFx0XHR4OiBhcmVhLnggKyBNYXRoLmZsb29yKGFyZWEudyAvIDIpLTEsXG5cdFx0XHR5OiBhcmVhLnkgKyBNYXRoLmZsb29yKGFyZWEuaCAvIDIpLTEsXG5cdFx0XHR4MjogYXJlYS54ICsgTWF0aC5mbG9vcihhcmVhLncgLyAyKSsxLFxuXHRcdFx0eTI6IGFyZWEueSArIE1hdGguZmxvb3IoYXJlYS5oIC8gMikrMSxcblx0XHR9O1xuXHRcdC8vIFRyYWNlIGNvcnJpZG9ycyBmcm9tIGV4aXRzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tpXTtcblx0XHRcdHZhciB2ZXJ0aWNhbEJyaWRnZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGhvcml6b250YWxCcmlkZ2UgPSBmYWxzZTtcblx0XHRcdGlmIChicmlkZ2UueCA9PSBhcmVhLngpe1xuXHRcdFx0XHQvLyBMZWZ0IENvcnJpZG9yXG5cdFx0XHRcdGhvcml6b250YWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLng7IGogPCBicmlkZ2UueCArIGFyZWEudyAvIDI7IGorKyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChicmlkZ2UueCA9PSBhcmVhLnggKyBhcmVhLncpe1xuXHRcdFx0XHQvLyBSaWdodCBjb3JyaWRvclxuXHRcdFx0XHRob3Jpem9udGFsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS54OyBqID49IGJyaWRnZS54IC0gYXJlYS53IC8gMjsgai0tKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYnJpZGdlLnkgPT0gYXJlYS55KXtcblx0XHRcdFx0Ly8gVG9wIGNvcnJpZG9yXG5cdFx0XHRcdHZlcnRpY2FsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS55OyBqIDwgYnJpZGdlLnkgKyBhcmVhLmggLyAyOyBqKyspe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRG93biBDb3JyaWRvclxuXHRcdFx0XHR2ZXJ0aWNhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueTsgaiA+PSBicmlkZ2UueSAtIGFyZWEuaCAvIDI7IGotLSl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gPSBhcmVhLndhbGw7IFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZlcnRpY2FsQnJpZGdlKXtcblx0XHRcdFx0aWYgKGJyaWRnZS54IDwgbWluYm94LngpXG5cdFx0XHRcdFx0bWluYm94LnggPSBicmlkZ2UueDtcblx0XHRcdFx0aWYgKGJyaWRnZS54ID4gbWluYm94LngyKVxuXHRcdFx0XHRcdG1pbmJveC54MiA9IGJyaWRnZS54O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhvcml6b250YWxCcmlkZ2Upe1xuXHRcdFx0XHRpZiAoYnJpZGdlLnkgPCBtaW5ib3gueSlcblx0XHRcdFx0XHRtaW5ib3gueSA9IGJyaWRnZS55O1xuXHRcdFx0XHRpZiAoYnJpZGdlLnkgPiBtaW5ib3gueTIpXG5cdFx0XHRcdFx0bWluYm94LnkyID0gYnJpZGdlLnk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBtaW5QYWRkaW5nID0gMDtcblx0XHRpZiAoYXJlYS53YWxsKVxuXHRcdFx0bWluUGFkZGluZyA9IDE7XG5cdFx0dmFyIHBhZGRpbmcgPSB7XG5cdFx0XHR0b3A6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBtaW5ib3gueSAtIGFyZWEueSAtIG1pblBhZGRpbmcpLFxuXHRcdFx0Ym90dG9tOiBVdGlsLnJhbmQobWluUGFkZGluZywgYXJlYS55ICsgYXJlYS5oIC0gbWluYm94LnkyIC0gbWluUGFkZGluZyksXG5cdFx0XHRsZWZ0OiBVdGlsLnJhbmQobWluUGFkZGluZywgbWluYm94LnggLSBhcmVhLnggLSBtaW5QYWRkaW5nKSxcblx0XHRcdHJpZ2h0OiBVdGlsLnJhbmQobWluUGFkZGluZywgYXJlYS54ICsgYXJlYS53IC0gbWluYm94LngyIC0gbWluUGFkZGluZylcblx0XHR9O1xuXHRcdGlmIChwYWRkaW5nLnRvcCA8IDApIHBhZGRpbmcudG9wID0gMDtcblx0XHRpZiAocGFkZGluZy5ib3R0b20gPCAwKSBwYWRkaW5nLmJvdHRvbSA9IDA7XG5cdFx0aWYgKHBhZGRpbmcubGVmdCA8IDApIHBhZGRpbmcubGVmdCA9IDA7XG5cdFx0aWYgKHBhZGRpbmcucmlnaHQgPCAwKSBwYWRkaW5nLnJpZ2h0ID0gMDtcblx0XHR2YXIgcm9vbXggPSBhcmVhLng7XG5cdFx0dmFyIHJvb215ID0gYXJlYS55O1xuXHRcdHZhciByb29tdyA9IGFyZWEudztcblx0XHR2YXIgcm9vbWggPSBhcmVhLmg7XG5cdFx0Zm9yICh2YXIgeCA9IHJvb214OyB4IDwgcm9vbXggKyByb29tdzsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSByb29teTsgeSA8IHJvb215ICsgcm9vbWg7IHkrKyl7XG5cdFx0XHRcdHZhciBkcmF3V2FsbCA9IGFyZWEud2FsbCAmJiBsZXZlbC5jZWxsc1t4XVt5XSAhPSBhcmVhLmNvcnJpZG9yICYmIGxldmVsLmNlbGxzW3hdW3ldICE9ICdicmlkZ2UnOyBcblx0XHRcdFx0aWYgKHkgPCByb29teSArIHBhZGRpbmcudG9wKXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeSA9PSByb29teSArIHBhZGRpbmcudG9wIC0gMSAmJiB4ICsgMSA+PSByb29teCArIHBhZGRpbmcubGVmdCAmJiB4IDw9IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0KVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh4IDwgcm9vbXggKyBwYWRkaW5nLmxlZnQpe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB4ID09IHJvb214ICsgcGFkZGluZy5sZWZ0IC0gMSAmJiB5ID49IHJvb215ICsgcGFkZGluZy50b3AgJiYgeSA8PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20pXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHkgPiByb29teSArIHJvb21oIC0gMSAtIHBhZGRpbmcuYm90dG9tKXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeSA9PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20gJiYgeCArIDEgPj0gcm9vbXggKyBwYWRkaW5nLmxlZnQgJiYgeCA8PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodClcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA+IHJvb214ICsgcm9vbXcgLSAxIC0gcGFkZGluZy5yaWdodCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHggPT0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQgJiYgeSA+PSByb29teSArIHBhZGRpbmcudG9wICYmIHkgPD0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmIChhcmVhLm1hcmtlZClcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS5mbG9vcjtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdH0sXG5cdHVzZUFyZWFzOiBmdW5jdGlvbihrZWVwQXJlYXMsIGFyZWFzLCBiaWdBcmVhKXtcblx0XHQvLyBBbGwga2VlcCBhcmVhcyBzaG91bGQgYmUgY29ubmVjdGVkIHdpdGggYSBzaW5nbGUgcGl2b3QgYXJlYVxuXHRcdHZhciBwaXZvdEFyZWEgPSBTcGxpdHRlci5nZXRBcmVhQXQoe3g6IE1hdGgucm91bmQoYmlnQXJlYS54ICsgYmlnQXJlYS53LzIpLCB5OiBNYXRoLnJvdW5kKGJpZ0FyZWEueSArIGJpZ0FyZWEuaC8yKX0se3g6MCx5OjB9LCBhcmVhcyk7XG5cdFx0dmFyIHBhdGhBcmVhcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2VlcEFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBrZWVwQXJlYSA9IGtlZXBBcmVhc1tpXTtcblx0XHRcdGtlZXBBcmVhLnJlbmRlciA9IHRydWU7XG5cdFx0XHR2YXIgYXJlYXNQYXRoID0gdGhpcy5nZXREcnVua2VuQXJlYXNQYXRoKGtlZXBBcmVhLCBwaXZvdEFyZWEsIGFyZWFzKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYXJlYXNQYXRoLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0YXJlYXNQYXRoW2pdLnJlbmRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmICghYXJlYS5yZW5kZXIpe1xuXHRcdFx0XHRicmlkZ2VzUmVtb3ZlOiBmb3IgKHZhciBqID0gMDsgaiA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tqXTtcblx0XHRcdFx0XHRpZiAoIWJyaWRnZS50bylcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgYnJpZGdlLnRvLmJyaWRnZXMubGVuZ3RoOyBrKyspe1xuXHRcdFx0XHRcdFx0dmFyIHNvdXJjZUJyaWRnZSA9IGJyaWRnZS50by5icmlkZ2VzW2tdO1xuXHRcdFx0XHRcdFx0aWYgKHNvdXJjZUJyaWRnZS54ID09IGJyaWRnZS54ICYmIHNvdXJjZUJyaWRnZS55ID09IGJyaWRnZS55KXtcblx0XHRcdFx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkoYnJpZGdlLnRvLmJyaWRnZXMsIHNvdXJjZUJyaWRnZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnZXREcnVua2VuQXJlYXNQYXRoOiBmdW5jdGlvbiAoZnJvbUFyZWEsIHRvQXJlYSwgYXJlYXMpe1xuXHRcdHZhciBjdXJyZW50QXJlYSA9IGZyb21BcmVhO1xuXHRcdHZhciBwYXRoID0gW107XG5cdFx0cGF0aC5wdXNoKGZyb21BcmVhKTtcblx0XHRwYXRoLnB1c2godG9BcmVhKTtcblx0XHRpZiAoZnJvbUFyZWEgPT0gdG9BcmVhKVxuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0d2hpbGUgKHRydWUpe1xuXHRcdFx0dmFyIHJhbmRvbUJyaWRnZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGN1cnJlbnRBcmVhLmJyaWRnZXMpO1xuXHRcdFx0aWYgKCFyYW5kb21CcmlkZ2UudG8pXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0aWYgKCFVdGlsLmNvbnRhaW5zKHBhdGgsIHJhbmRvbUJyaWRnZS50bykpe1xuXHRcdFx0XHRwYXRoLnB1c2gocmFuZG9tQnJpZGdlLnRvKTtcblx0XHRcdH1cblx0XHRcdGlmIChyYW5kb21CcmlkZ2UudG8gPT0gdG9BcmVhKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGN1cnJlbnRBcmVhID0gcmFuZG9tQnJpZGdlLnRvO1xuXHRcdH1cblx0XHRyZXR1cm4gcGF0aDtcblx0fVxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaGlyZExldmVsR2VuZXJhdG9yOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRyYW5kOiBmdW5jdGlvbiAobG93LCBoaSl7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChoaSAtIGxvdyArIDEpKStsb3c7XG5cdH0sXG5cdHJhbmRvbUVsZW1lbnRPZjogZnVuY3Rpb24gKGFycmF5KXtcblx0XHRyZXR1cm4gYXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmFycmF5Lmxlbmd0aCldO1xuXHR9LFxuXHRkaXN0YW5jZTogZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIE1hdGguc3FydCgoeDIteDEpKih4Mi14MSkgKyAoeTIteTEpKih5Mi15MSkpO1xuXHR9LFxuXHRmbGF0RGlzdGFuY2U6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKXtcblx0XHR2YXIgeERpc3QgPSBNYXRoLmFicyh4MSAtIHgyKTtcblx0XHR2YXIgeURpc3QgPSBNYXRoLmFicyh5MSAtIHkyKTtcblx0XHRpZiAoeERpc3QgPT09IHlEaXN0KVxuXHRcdFx0cmV0dXJuIHhEaXN0O1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB4RGlzdCArIHlEaXN0O1xuXHR9LFxuXHRsaW5lRGlzdGFuY2U6IGZ1bmN0aW9uKHBvaW50MSwgcG9pbnQyKXtcblx0ICB2YXIgeHMgPSAwO1xuXHQgIHZhciB5cyA9IDA7XG5cdCAgeHMgPSBwb2ludDIueCAtIHBvaW50MS54O1xuXHQgIHhzID0geHMgKiB4cztcblx0ICB5cyA9IHBvaW50Mi55IC0gcG9pbnQxLnk7XG5cdCAgeXMgPSB5cyAqIHlzO1xuXHQgIHJldHVybiBNYXRoLnNxcnQoIHhzICsgeXMgKTtcblx0fSxcblx0ZGlyZWN0aW9uOiBmdW5jdGlvbiAoYSxiKXtcblx0XHRyZXR1cm4ge3g6IHNpZ24oYi54IC0gYS54KSwgeTogc2lnbihiLnkgLSBhLnkpfTtcblx0fSxcblx0Y2hhbmNlOiBmdW5jdGlvbiAoY2hhbmNlKXtcblx0XHRyZXR1cm4gdGhpcy5yYW5kKDAsMTAwKSA8PSBjaGFuY2U7XG5cdH0sXG5cdGNvbnRhaW5zOiBmdW5jdGlvbihhcnJheSwgZWxlbWVudCl7XG5cdCAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihlbGVtZW50KSA+IC0xO1xuXHR9LFxuXHRyZW1vdmVGcm9tQXJyYXk6IGZ1bmN0aW9uKGFycmF5LCBvYmplY3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmIChhcnJheVtpXSA9PSBvYmplY3Qpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUZyb21BcnJheUluZGV4KGFycmF5LCBpLGkpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVGcm9tQXJyYXlJbmRleDogZnVuY3Rpb24oYXJyYXksIGZyb20sIHRvKSB7XG5cdFx0dmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG5cdFx0YXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcblx0XHRyZXR1cm4gYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG5cdH0sXG5cdGxpbmU6IGZ1bmN0aW9uIChhLCBiKXtcblx0XHR2YXIgY29vcmRpbmF0ZXNBcnJheSA9IG5ldyBBcnJheSgpO1xuXHRcdHZhciB4MSA9IGEueDtcblx0XHR2YXIgeTEgPSBhLnk7XG5cdFx0dmFyIHgyID0gYi54O1xuXHRcdHZhciB5MiA9IGIueTtcblx0ICAgIHZhciBkeCA9IE1hdGguYWJzKHgyIC0geDEpO1xuXHQgICAgdmFyIGR5ID0gTWF0aC5hYnMoeTIgLSB5MSk7XG5cdCAgICB2YXIgc3ggPSAoeDEgPCB4MikgPyAxIDogLTE7XG5cdCAgICB2YXIgc3kgPSAoeTEgPCB5MikgPyAxIDogLTE7XG5cdCAgICB2YXIgZXJyID0gZHggLSBkeTtcblx0ICAgIGNvb3JkaW5hdGVzQXJyYXkucHVzaCh7eDogeDEsIHk6IHkxfSk7XG5cdCAgICB3aGlsZSAoISgoeDEgPT0geDIpICYmICh5MSA9PSB5MikpKSB7XG5cdCAgICBcdHZhciBlMiA9IGVyciA8PCAxO1xuXHQgICAgXHRpZiAoZTIgPiAtZHkpIHtcblx0ICAgIFx0XHRlcnIgLT0gZHk7XG5cdCAgICBcdFx0eDEgKz0gc3g7XG5cdCAgICBcdH1cblx0ICAgIFx0aWYgKGUyIDwgZHgpIHtcblx0ICAgIFx0XHRlcnIgKz0gZHg7XG5cdCAgICBcdFx0eTEgKz0gc3k7XG5cdCAgICBcdH1cblx0ICAgIFx0Y29vcmRpbmF0ZXNBcnJheS5wdXNoKHt4OiB4MSwgeTogeTF9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb29yZGluYXRlc0FycmF5O1xuXHR9XG59Iiwid2luZG93LkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vR2VuZXJhdG9yLmNsYXNzJyk7XG53aW5kb3cuQ2FudmFzUmVuZGVyZXIgPSByZXF1aXJlKCcuL0NhbnZhc1JlbmRlcmVyLmNsYXNzJyk7XG53aW5kb3cuS3JhbWdpbmVFeHBvcnRlciA9IHJlcXVpcmUoJy4vS3JhbWdpbmVFeHBvcnRlci5jbGFzcycpOyJdfQ==
