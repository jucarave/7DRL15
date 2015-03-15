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
	LAVA_CHANCE:     [100,  0, 20,  0,100, 10, 50,100],
	WATER_CHANCE:    [  0,100, 10,100,  0, 50,  0,  0],
	CAVERN_CHANCE:   [ 80, 80, 20, 20, 60, 90, 10, 50],
	LAGOON_CHANCE:   [  0, 50, 10, 20,  0, 30,  0,  0],
	WALLLESS_CHANCE: [ 50, 10, 80, 90, 10, 90, 10, 50],
	HEIGHT:          [  1,  2,  1,  1,  1,  2,  2,  3],
	GANGS: [
		[ // Level 1
			{boss: 'daemon', minions: ['mongbat'], quantity: 2},
			{minions: ['mongbat'], quantity: 3},
			{boss: 'hydra', minions: ['mongbat'], quantity: 2}
		],
		[ // Level 2
			{boss: 'daemon', minions: ['seaSerpent', 'octopus'], quantity: 3},
			{boss: 'hydra', minions: ['seaSerpent', 'octopus'], quantity: 3},
			{boss: 'balron', minions: ['seaSerpent', 'octopus'], quantity: 3},
			{minions: ['seaSerpent'], quantity: 3},
			{minions: ['octopus'], quantity: 3}
		],
		[ // Level 3
			{minions: ['daemon'], quantity: 4},
			{boss: 'balron', minions: ['daemon'], quantity: 2}
		],
		[ // Level 4
			{boss: 'gazer', minions: ['headless'], quantity: 3},
			{boss: 'liche', minions: ['ghost'], quantity: 3},
			{boss: 'daemon', minions: ['gazer', 'gremlin'], quantity: 3},
		],
		[ // Level 5
			{minions: ['dragon', 'zorn', 'balron'], quantity: 3},
			{minions: ['reaper', 'gazer'], quantity: 3},
			{boss: 'balron', minions: ['headless'], quantity: 3},
			{boss: 'zorn', minions: ['headless'], quantity: 3},
			{minions: ['dragon', 'lavaLizard'], quantity: 3},
		],
		[ // Level 6
			{minions: ['reaper'], quantity: 3},
			{boss: 'balron', minions: ['daemon'], quantity: 3},
			{areaType: 'cave', minions: ['bat'], quantity: 5},
			{areaType: 'cave', minions: ['seaSerpent'], quantity: 5},
			{boss: 'balron', minions: ['hydra'], quantity: 3},
			{boss: 'balron', minions: ['evilMage'], quantity: 3}
		],
		[ // Level 7
			{minions: ['headless'], quantity: 8},
			{minions: ['hydra'], quantity: 3},
			{minions: ['skeleton', 'wisp', 'ghost'], quantity: 6},
			{boss: 'balron', minions: ['skeleton'], quantity: 10}
		],
		[ // Level 8
			{minions: ['dragon', 'daemon', 'balron'], quantity: 3},
			{minions: ['warrior', 'mage', 'bard', 'druid', 'tinker', 'paladin', 'shepherd', 'ranger'], quantity: 4},
			{minions: ['gazer', 'balron'], quantity: 3},
			{boss: 'liche', minions: ['skeleton'], quantity: 4},
			{minions: ['ghost', 'wisp'], quantity: 4},
			{minions: ['mongbat'], quantity: 5}
		]		
	],

	
	generateLevel: function(depth){
		var hasRiver = Util.chance(this.WATER_CHANCE[depth-1]);
		var hasLava = Util.chance(this.LAVA_CHANCE[depth-1]);
		var mainEntrance = depth == 1;
		var areas = this.generateAreas(depth, hasLava);
		this.placeExits(areas);
		var level = {
			hasRivers: hasRiver,
			hasLava: hasLava,
			mainEntrance: mainEntrance,
			strata: 'solidRock',
			areas: areas,
			depth: depth,
			ceilingHeight: this.HEIGHT[depth-1]
		} 
		return level;
	},
	generateAreas: function(depth, hasLava){
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
			this.setAreaDetails(area, depth, hasLava);
		}
		return areas;
	},
	setAreaDetails: function(area, depth, hasLava){
		if (Util.chance(this.CAVERN_CHANCE[depth-1])){
			area.areaType = 'cavern';
			if (hasLava){
				area.floor = 'cavernFloor';
				area.cavernType = Util.randomElementOf(['rocky','bridges']);
			} else {
				if (Util.chance(this.LAGOON_CHANCE[depth-1])){
					area.floor = 'fakeWater';
				} else {
					area.floor = 'cavernFloor';
				}
				area.cavernType = Util.randomElementOf(['rocky','bridges','watery']);
			}
		} else {
			area.areaType = 'rooms';
			area.floor = 'stoneFloor';
			area.wall = Util.chance(this.WALLLESS_CHANCE[depth-1]) ? false : 'stoneWall';
			area.corridor = 'stoneFloor';
		}
		area.enemies = [];
		area.items = [];
		var randomGang = Util.randomElementOf(this.GANGS[depth-1]);
		area.enemies = randomGang.minions;
		area.enemyCount = randomGang.quantity + Util.rand(0,3);
		if (randomGang)
			area.boss = randomGang.boss;
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
		this.secondLevelGenerator.frameLevel(sketch, level);
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
		this.calculateRarities(level.depth);
		for (var i = 0; i < sketch.areas.length; i++){
			var area = sketch.areas[i];
			this.populateArea(area, level);
		}
	},
	populateArea: function(area, level){
		var items = Util.rand(0,2);
		for (var i = 0; i < items; i++){
			var position = level.getFreePlace(area, false, true);
			var item = this.getAnItem();
			level.addItem(item, position.x, position.y);
		}
	},
	calculateRarities: function(depth){
		this.thresholds = [];
		this.generationChanceTotal = 0;
		for (var i = 0; i < this.ITEMS.length; i++){
			var item = this.ITEMS[i];
			var malus = Math.abs(depth-item.depth) > 1;
			var rarity = malus ? item.rarity / 2 : item.rarity;
			this.generationChanceTotal += rarity;
			this.thresholds.push({threshold: this.generationChanceTotal, item: item});
		}
	},
	ITEMS: [
		/*{code: 'dagger', rarity: 3500},
		{code: 'oilFlask', rarity: 1400},
		{code: 'staff', rarity: 350},
		{code: 'sling', rarity: 280},
		{code: 'mace', rarity: 70},
		{code: 'axe', rarity: 31},
		{code: 'bow', rarity: 28},
		{code: 'sword', rarity: 350},
		{code: 'halberd', rarity: 23},
		{code: 'crossbow', rarity: 11},
		{code: 'magicAxe', rarity: 5},
		{code: 'magicBow', rarity: 4},
		{code: 'magicSword', rarity: 4},
		{code: 'magicWand', rarity: 2},
		{code: 'cloth', rarity: 140},
		{code: 'leather', rarity: 35},
		{code: 'chain', rarity: 12},
		{code: 'plate', rarity: 4},
		{code: 'magicChain', rarity: 2},
		{code: 'magicPlate', rarity: 1}*/
		{code: 'cure', rarity: 1000, depth: 1},
		{code: 'heal', rarity: 1000, depth: 1},
		{code: 'redPotion', rarity: 1000, depth: 1},
		{code: 'yellowPotion', rarity: 1000, depth: 1},
		{code: 'light', rarity: 1000, depth: 2},
		{code: 'missile', rarity: 1000, depth: 3},
		{code: 'iceball', rarity: 500, depth: 4},
		{code: 'repel', rarity: 500, depth: 5},
		{code: 'blink', rarity: 333, depth: 5},
		{code: 'fireball', rarity: 333, depth: 6},
		{code: 'protection', rarity: 250, depth: 6},
		{code: 'time', rarity: 200, depth: 7},
		{code: 'sleep', rarity: 200, depth: 7},
		{code: 'jinx', rarity: 166, depth: 8},
		{code: 'tremor', rarity: 166, depth: 8},
		{code: 'kill', rarity: 142, depth: 8}
	],
	getAnItem: function(){
		var number = Util.rand(0, this.generationChanceTotal);
		for (var i = 0; i < this.thresholds.length; i++){
			if (number <= this.thresholds[i].threshold)
				return this.thresholds[i].item.code;
		}
		return this.thresholds[0].item.code;
	}
}

module.exports = ItemPopulator;
},{"./Utils":"/home/administrator/git/stygiangen/src/Utils.js"}],"/home/administrator/git/stygiangen/src/KramgineExporter.class.js":[function(require,module,exports){
function KramgineExporter(config){
	this.config = config;
}

KramgineExporter.prototype = {
	getLevel: function(level){
		this.initTileDefs(level.ceilingHeight);
		var tiles = this.getTiles();
		var objects = this.getObjects(level);
		var map = this.getMap(level);
		return {
			tiles: tiles,
			objects: objects,
			map: map
		};
	},
	initTileDefs: function(ceilingHeight){
		this.tiles = [];
		this.tilesMap = [];
		this.tiles.push(null);
		this.ceilingHeight = ceilingHeight;
		this.addTile('STONE_WALL', 2, 0, 0);
		this.addTile('STONE_FLOOR', 0, 2, 2);
		this.addTile('BRIDGE', 0, 4, 2);
		this.addTile('WATER', 0, 101, 2);
		this.addTile('LAVA', 0, 103, 2);
	},
	addTile: function (id, wallTexture, floorTexture, ceilTexture){
		var tile = this.createTile(wallTexture, floorTexture, ceilTexture, this.ceilingHeight);
		this.tiles.push(tile);
		this.tilesMap[id] = this.tiles.length - 1;
	},
	getTile: function(id){
		return this.tilesMap[id];
	},
	createTile: function(wallTexture, floorTexture, ceilTexture, height){
		return {
			w: wallTexture,
			y: 0,
			h: height,
			f: floorTexture,
			fy: 0,
			c: ceilTexture,
			ch: height,
			sl: 0,
			dir: 0
		};
	},
	getTiles: function(){
		return this.tiles;
	},
	getObjects: function(level){
		var objects = [];
		objects.push({
			x: level.start.x + 0.5,
			z: level.start.y + 0.5,
			y: 0,
			dir: 3,
			type: 'player'
		});
		for (var i = 0; i < level.enemies.length; i++){
			var enemy = level.enemies[i];
			var enemyData =
			{
	            x: enemy.x + 0.5,
	            z: enemy.y + 0.5,
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
	            x: item.x + 0.5,
	            z: item.y + 0.5,
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
		for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
			map[y] = [];
			for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
				var cell = cells[x][y];
				var id = null;
				if (cell === 'water'){
					id = this.getTile("WATER");
				} else if (cell === 'fakeWater'){
					id = this.getTile("WATER");
				}else if (cell === 'solidRock'){
					id = this.getTile("STONE_WALL");
				}else if (cell === 'cavernFloor'){
					id = this.getTile("STONE_FLOOR");
				}else if (cell === 'downstairs'){
					id = this.getTile("STONE_FLOOR");
				}else if (cell === 'upstairs'){
					id = this.getTile("STONE_FLOOR");
				}else if (cell === 'stoneWall'){
					id = this.getTile("STONE_WALL");
				}else if (cell === 'stoneFloor'){
					id = this.getTile("STONE_FLOOR");
				}else if (cell === 'corridor'){
					id = this.getTile("STONE_FLOOR");
				}else if (cell === 'bridge'){
					id = this.getTile("BRIDGE");
				}else if (cell === 'lava'){
					id = this.getTile("LAVA");
				}
				map[y][x] = id;
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
		this.enemiesMap = {};
		this.items = [];
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			this.cells[x] = [];
		}
	},
	addEnemy: function(enemy, x, y){
		var enemy = {
			code: enemy,
			x: x,
			y: y
		};
		this.enemies.push(enemy);
		this.enemiesMap[x+"_"+y] = enemy;
	},
	getEnemy: function(x,y){
		return this.enemiesMap[x+"_"+y];
	},
	addItem: function(item, x, y){
		this.items.push({
			code: item,
			x: x,
			y: y
		});
	},
	getFreePlace: function(area, onlyWater, noWater){
		var tries = 0;
		while(true){
			var randPoint = {
				x: Util.rand(area.x, area.x+area.w-1),
				y: Util.rand(area.y, area.y+area.h-1)
			}
			var cell = this.cells[randPoint.x][randPoint.y]; 
			if (onlyWater){
				if (cell == 'water' || cell == 'fakeWater')
					return randPoint;
				else
					tries++;
				if (tries > 1000)
					return false;
			}  else if (noWater){
				if (cell == 'water' || cell == 'fakeWater'){
					tries++;
					if (tries > 1000)
						return false;
				} else if (cell == area.floor || area.corridor && cell == area.corridor) {
					return randPoint;
				}
			} else if (cell == area.floor || area.corridor && cell == area.corridor || cell == 'fakeWater')
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
			if (area.hasEntrance)
				continue;
			this.populateArea(area, level);
		}
	},
	populateArea: function(area, level){
		if (area.boss){
			var position = level.getFreePlace(area, false, true);
			if (position){
				level.addEnemy(area.boss, position.x, position.y);
			}
		}
		var tries = 0;
		for (var i = 0; i < area.enemyCount; i++){
			var monster = Util.randomElementOf(area.enemies);
			var onlyWater = this.isWaterMonster(monster);
			var noWater = !onlyWater && !this.isFlyingMonster(monster);
			var position = level.getFreePlace(area, onlyWater, noWater);
			if (position){
				if (level.getEnemy(position.x, position.y)){
					tries++;
					if (tries < 100){
						i--;
					} else {
						tries = 0;
					}
					continue;
				}
				level.addEnemy(monster, position.x, position.y);
			}
		}
	},
	isWaterMonster: function(monster){
		return monster == 'octopus' || monster == 'seaSerpent'; 
	},
	isFlyingMonster: function(monster){
		return monster == 'bat' || monster == 'mongbat' || monster == 'ghost' || monster == 'dragon' || monster == 'gazer'; 
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
		level.ceilingHeight = sketch.ceilingHeight;
		if (sketch.hasLava)
			this.plotRivers(level, sketch, 'lava');
		else if (sketch.hasRivers)
			this.plotRivers(level, sketch, 'water');
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
	},
	frameLevel: function(sketch, level){
		for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
			if (level.cells[x][0] != 'stoneWall') level.cells[x][0] = sketch.strata;
			if (level.cells[x][this.config.LEVEL_HEIGHT-1] != 'stoneWall') level.cells[x][this.config.LEVEL_HEIGHT-1] = sketch.strata;
		}
		for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
			if (level.cells[0][y] != 'stoneWall') level.cells[0][y] = sketch.strata;
			if (level.cells[this.config.LEVEL_WIDTH-1][y] != 'stoneWall') level.cells[this.config.LEVEL_WIDTH-1][y] = sketch.strata;
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
		this.enlargeBridges(level);
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
	enlargeBridges: function(level){
		level.cells = CA.runCA(level.cells, function(current, surrounding){
			if (current != 'lava' && current != 'water' && current != 'fakeWater')
				return false;
			/*if (surrounding['cavernFloor'] > 0 || surrounding['stoneFloor'] > 0)
				return false;*/
			if (surrounding['bridge'] > 0)
				return 'bridge';
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
			if (freeSpot.x == 0 || freeSpot.y == 0 || freeSpot.x == level.cells.length - 1 || freeSpot.y == level.cells[0].length - 1){
				i--;
				continue;
			}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRydW5DQTogZnVuY3Rpb24obWFwLCB0cmFuc2Zvcm1GdW5jdGlvbiwgdGltZXMsIGNyb3NzKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRpbWVzOyBpKyspe1xuXHRcdFx0dmFyIG5ld01hcCA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4Kyspe1xuXHRcdFx0XHRuZXdNYXBbeF0gPSBbXTtcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgbWFwLmxlbmd0aDsgeCsrKXtcblx0XHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBtYXBbeF0ubGVuZ3RoOyB5Kyspe1xuXHRcdFx0XHRcdHZhciBzdXJyb3VuZGluZ01hcCA9IFtdO1xuXHRcdFx0XHRcdGZvciAodmFyIHh4ID0geC0xOyB4eCA8PSB4KzE7IHh4Kyspe1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgeXkgPSB5LTE7IHl5IDw9IHkrMTsgeXkrKyl7XG5cdFx0XHRcdFx0XHRcdGlmIChjcm9zcyAmJiAhKHh4ID09IHggfHwgeXkgPT0geSkpXG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRcdGlmICh4eCA+IDAgJiYgeHggPCBtYXAubGVuZ3RoICYmIHl5ID4gMCAmJiB5eSA8IG1hcFt4XS5sZW5ndGgpe1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjZWxsID0gbWFwW3h4XVt5eV07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHN1cnJvdW5kaW5nTWFwW2NlbGxdKVxuXHRcdFx0XHRcdFx0XHRcdFx0c3Vycm91bmRpbmdNYXBbY2VsbF0rKztcblx0XHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0XHRzdXJyb3VuZGluZ01hcFtjZWxsXSA9IDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIG5ld0NlbGwgPSB0cmFuc2Zvcm1GdW5jdGlvbihtYXBbeF1beV0sIHN1cnJvdW5kaW5nTWFwKTtcblx0XHRcdFx0XHRpZiAobmV3Q2VsbCl7XG5cdFx0XHRcdFx0XHRuZXdNYXBbeF1beV0gPSBuZXdDZWxsO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRuZXdNYXBbeF1beV0gPSBtYXBbeF1beV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtYXAgPSBuZXdNYXA7XG5cdFx0fVxuXHRcdHJldHVybiBtYXA7XG5cdH1cbn0iLCJmdW5jdGlvbiBDYW52YXNSZW5kZXJlcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlID0ge1xuXHRkcmF3U2tldGNoOiBmdW5jdGlvbihsZXZlbCwgY2FudmFzLCBvdmVybGF5KXtcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcblx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGNvbnRleHQuZm9udD1cIjE2cHggQXZhdGFyXCI7XG5cdFx0aWYgKCFvdmVybGF5KVxuXHRcdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGxldmVsLmFyZWFzW2ldO1xuXHRcdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdGNvbnRleHQucmVjdChhcmVhLnggKiB6b29tLCBhcmVhLnkgKiB6b29tLCBhcmVhLncgKiB6b29tLCBhcmVhLmggKiB6b29tKTtcblx0XHRcdGlmICghb3ZlcmxheSl7XG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3llbGxvdyc7XG5cdFx0XHRcdGNvbnRleHQuZmlsbCgpO1xuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG5cdFx0XHRjb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0dmFyIGFyZWFEZXNjcmlwdGlvbiA9ICcnO1xuXHRcdFx0aWYgKGFyZWEuYXJlYVR5cGUgPT0gJ3Jvb21zJyl7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiRHVuZ2VvblwiO1xuXHRcdFx0fSBlbHNlIGlmIChhcmVhLmZsb29yID09ICdmYWtlV2F0ZXInKXsgXG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiTGFnb29uXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gPSBcIkNhdmVyblwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWEuaGFzRXhpdCl7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiArPSBcIiAoZClcIjtcblx0XHRcdH1cblx0XHRcdGlmIChhcmVhLmhhc0VudHJhbmNlKXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uICs9IFwiICh1KVwiO1xuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuXHRcdFx0Y29udGV4dC5maWxsVGV4dChhcmVhRGVzY3JpcHRpb24sKGFyZWEueCkqIHpvb20gKyA1LChhcmVhLnkgKSogem9vbSArIDIwKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tqXTtcblx0XHRcdFx0Y29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0Y29udGV4dC5yZWN0KChicmlkZ2UueCkgKiB6b29tIC8qLSB6b29tIC8gMiovLCAoYnJpZGdlLnkpICogem9vbSAvKi0gem9vbSAvIDIqLywgem9vbSwgem9vbSk7XG5cdFx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gMjtcblx0XHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZWQnO1xuXHRcdFx0XHRjb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZHJhd0xldmVsOiBmdW5jdGlvbihsZXZlbCwgY2FudmFzKXtcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcblx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGNvbnRleHQuZm9udD1cIjEycHggR2VvcmdpYVwiO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0dmFyIHpvb20gPSA4O1xuXHRcdHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldO1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gJ3dhdGVyJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzAwMDBGRic7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2VsbCA9PT0gJ2xhdmEnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnZmFrZVdhdGVyJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzAwMDBGRic7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc29saWRSb2NrJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzU5NEIyRCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY2F2ZXJuRmxvb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjODc2NDE4Jztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdkb3duc3RhaXJzJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnI0ZGMDAwMCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAndXBzdGFpcnMnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDBGRjAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZVdhbGwnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjQkJCQkJCJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZUZsb29yJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzY2NjY2Nic7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY29ycmlkb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdwYWRkaW5nJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzAwRkYwMCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnYnJpZGdlJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzk0NjgwMCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRcdFx0Y29udGV4dC5maWxsUmVjdCh4ICogem9vbSwgeSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmVuZW1pZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGVuZW15ID0gbGV2ZWwuZW5lbWllc1tpXTtcblx0XHRcdHZhciBjb2xvciA9ICcjRkZGRkZGJztcblx0XHRcdHN3aXRjaCAoZW5lbXkuY29kZSl7XG5cdFx0XHRjYXNlICdiYXQnOlxuXHRcdFx0XHRjb2xvciA9ICcjRUVFRUVFJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsYXZhTGl6YXJkJzpcblx0XHRcdFx0Y29sb3IgPSAnIzAwRkY4OCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnZGFlbW9uJzpcblx0XHRcdFx0Y29sb3IgPSAnI0ZGODgwMCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRcdGNvbnRleHQuZmlsbFJlY3QoZW5lbXkueCAqIHpvb20sIGVuZW15LnkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0c3dpdGNoIChpdGVtLmNvZGUpe1xuXHRcdFx0Y2FzZSAnZGFnZ2VyJzpcblx0XHRcdFx0Y29sb3IgPSAnI0VFRUVFRSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbGVhdGhlckFybW9yJzpcblx0XHRcdFx0Y29sb3IgPSAnIzAwRkY4OCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRcdGNvbnRleHQuZmlsbFJlY3QoaXRlbS54ICogem9vbSwgaXRlbS55ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0fVxuXHR9LFxuXHRkcmF3TGV2ZWxXaXRoSWNvbnM6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTJweCBHZW9yZ2lhXCI7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0dmFyIHdhdGVyID0gbmV3IEltYWdlKCk7XG5cdFx0d2F0ZXIuc3JjID0gJ2ltZy93YXRlci5wbmcnO1xuXHRcdHZhciBmYWtlV2F0ZXIgPSBuZXcgSW1hZ2UoKTtcblx0XHRmYWtlV2F0ZXIuc3JjID0gJ2ltZy93YXRlci5wbmcnO1xuXHRcdHZhciBzb2xpZFJvY2sgPSBuZXcgSW1hZ2UoKTtcblx0XHRzb2xpZFJvY2suc3JjID0gJ2ltZy9zb2xpZFJvY2sucG5nJztcblx0XHR2YXIgY2F2ZXJuRmxvb3IgPSBuZXcgSW1hZ2UoKTtcblx0XHRjYXZlcm5GbG9vci5zcmMgPSAnaW1nL2NhdmVybkZsb29yLnBuZyc7XG5cdFx0dmFyIGRvd25zdGFpcnMgPSBuZXcgSW1hZ2UoKTtcblx0XHRkb3duc3RhaXJzLnNyYyA9ICdpbWcvZG93bnN0YWlycy5wbmcnO1xuXHRcdHZhciB1cHN0YWlycyA9IG5ldyBJbWFnZSgpO1xuXHRcdHVwc3RhaXJzLnNyYyA9ICdpbWcvdXBzdGFpcnMucG5nJztcblx0XHR2YXIgc3RvbmVXYWxsID0gbmV3IEltYWdlKCk7XG5cdFx0c3RvbmVXYWxsLnNyYyA9ICdpbWcvc3RvbmVXYWxsLnBuZyc7XG5cdFx0dmFyIHN0b25lRmxvb3IgPSBuZXcgSW1hZ2UoKTtcblx0XHRzdG9uZUZsb29yLnNyYyA9ICdpbWcvc3RvbmVGbG9vci5wbmcnO1xuXHRcdHZhciBicmlkZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRicmlkZ2Uuc3JjID0gJ2ltZy9icmlkZ2UucG5nJztcblx0XHR2YXIgbGF2YSA9IG5ldyBJbWFnZSgpO1xuXHRcdGxhdmEuc3JjID0gJ2ltZy9sYXZhLnBuZyc7XG5cdFx0dmFyIGJhdCA9IG5ldyBJbWFnZSgpO1xuXHRcdGJhdC5zcmMgPSAnaW1nL2JhdC5wbmcnO1xuXHRcdHZhciBsYXZhTGl6YXJkID0gbmV3IEltYWdlKCk7XG5cdFx0bGF2YUxpemFyZC5zcmMgPSAnaW1nL2xhdmFMaXphcmQucG5nJztcblx0XHR2YXIgZGFlbW9uID0gbmV3IEltYWdlKCk7XG5cdFx0ZGFlbW9uLnNyYyA9ICdpbWcvZGFlbW9uLnBuZyc7XG5cdFx0dmFyIHRyZWFzdXJlID0gbmV3IEltYWdlKCk7XG5cdFx0dHJlYXN1cmUuc3JjID0gJ2ltZy90cmVhc3VyZS5wbmcnO1xuXHRcdHZhciB0aWxlcyA9IHtcblx0XHRcdHdhdGVyOiB3YXRlcixcblx0XHRcdGZha2VXYXRlcjogZmFrZVdhdGVyLFxuXHRcdFx0c29saWRSb2NrOiBzb2xpZFJvY2ssXG5cdFx0XHRjYXZlcm5GbG9vcjogY2F2ZXJuRmxvb3IsXG5cdFx0XHRkb3duc3RhaXJzOiBkb3duc3RhaXJzLFxuXHRcdFx0dXBzdGFpcnM6IHVwc3RhaXJzLFxuXHRcdFx0c3RvbmVXYWxsOiBzdG9uZVdhbGwsXG5cdFx0XHRzdG9uZUZsb29yOiBzdG9uZUZsb29yLFxuXHRcdFx0YnJpZGdlOiBicmlkZ2UsXG5cdFx0XHRsYXZhOiBsYXZhLFxuXHRcdFx0YmF0OiBiYXQsXG5cdFx0XHRsYXZhTGl6YXJkOiBsYXZhTGl6YXJkLFxuXHRcdFx0ZGFlbW9uOiBkYWVtb24sXG5cdFx0XHR0cmVhc3VyZTogdHJlYXN1cmVcblx0XHR9XG5cdCAgICB2YXIgY2VsbHMgPSBsZXZlbC5jZWxscztcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07IFxuXHRcdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aWxlc1tjZWxsXSwgeCAqIDE2LCB5ICogMTYpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmVuZW1pZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGVuZW15ID0gbGV2ZWwuZW5lbWllc1tpXTtcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzW2VuZW15LmNvZGVdLCBlbmVteS54ICogMTYsIGVuZW15LnkgKiAxNik7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSBsZXZlbC5pdGVtc1tpXTtcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzWyd0cmVhc3VyZSddLCBpdGVtLnggKiAxNiwgaXRlbS55ICogMTYpO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhc1JlbmRlcmVyOyIsImZ1bmN0aW9uIEZpcnN0TGV2ZWxHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIFNwbGl0dGVyID0gcmVxdWlyZSgnLi9TcGxpdHRlcicpO1xuXG5GaXJzdExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0TEFWQV9DSEFOQ0U6ICAgICBbMTAwLCAgMCwgMjAsICAwLDEwMCwgMTAsIDUwLDEwMF0sXG5cdFdBVEVSX0NIQU5DRTogICAgWyAgMCwxMDAsIDEwLDEwMCwgIDAsIDUwLCAgMCwgIDBdLFxuXHRDQVZFUk5fQ0hBTkNFOiAgIFsgODAsIDgwLCAyMCwgMjAsIDYwLCA5MCwgMTAsIDUwXSxcblx0TEFHT09OX0NIQU5DRTogICBbICAwLCA1MCwgMTAsIDIwLCAgMCwgMzAsICAwLCAgMF0sXG5cdFdBTExMRVNTX0NIQU5DRTogWyA1MCwgMTAsIDgwLCA5MCwgMTAsIDkwLCAxMCwgNTBdLFxuXHRIRUlHSFQ6ICAgICAgICAgIFsgIDEsICAyLCAgMSwgIDEsICAxLCAgMiwgIDIsICAzXSxcblx0R0FOR1M6IFtcblx0XHRbIC8vIExldmVsIDFcblx0XHRcdHtib3NzOiAnZGFlbW9uJywgbWluaW9uczogWydtb25nYmF0J10sIHF1YW50aXR5OiAyfSxcblx0XHRcdHttaW5pb25zOiBbJ21vbmdiYXQnXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdoeWRyYScsIG1pbmlvbnM6IFsnbW9uZ2JhdCddLCBxdWFudGl0eTogMn1cblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgMlxuXHRcdFx0e2Jvc3M6ICdkYWVtb24nLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnLCAnb2N0b3B1cyddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7Ym9zczogJ2h5ZHJhJywgbWluaW9uczogWydzZWFTZXJwZW50JywgJ29jdG9wdXMnXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnLCAnb2N0b3B1cyddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7bWluaW9uczogWydzZWFTZXJwZW50J10sIHF1YW50aXR5OiAzfSxcblx0XHRcdHttaW5pb25zOiBbJ29jdG9wdXMnXSwgcXVhbnRpdHk6IDN9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDNcblx0XHRcdHttaW5pb25zOiBbJ2RhZW1vbiddLCBxdWFudGl0eTogNH0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnZGFlbW9uJ10sIHF1YW50aXR5OiAyfVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA0XG5cdFx0XHR7Ym9zczogJ2dhemVyJywgbWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7Ym9zczogJ2xpY2hlJywgbWluaW9uczogWydnaG9zdCddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7Ym9zczogJ2RhZW1vbicsIG1pbmlvbnM6IFsnZ2F6ZXInLCAnZ3JlbWxpbiddLCBxdWFudGl0eTogM30sXG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDVcblx0XHRcdHttaW5pb25zOiBbJ2RyYWdvbicsICd6b3JuJywgJ2JhbHJvbiddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7bWluaW9uczogWydyZWFwZXInLCAnZ2F6ZXInXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2hlYWRsZXNzJ10sIHF1YW50aXR5OiAzfSxcblx0XHRcdHtib3NzOiAnem9ybicsIG1pbmlvbnM6IFsnaGVhZGxlc3MnXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e21pbmlvbnM6IFsnZHJhZ29uJywgJ2xhdmFMaXphcmQnXSwgcXVhbnRpdHk6IDN9LFxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA2XG5cdFx0XHR7bWluaW9uczogWydyZWFwZXInXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2RhZW1vbiddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7YXJlYVR5cGU6ICdjYXZlJywgbWluaW9uczogWydiYXQnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2FyZWFUeXBlOiAnY2F2ZScsIG1pbmlvbnM6IFsnc2VhU2VycGVudCddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnaHlkcmEnXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2V2aWxNYWdlJ10sIHF1YW50aXR5OiAzfVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA3XG5cdFx0XHR7bWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogOH0sXG5cdFx0XHR7bWluaW9uczogWydoeWRyYSddLCBxdWFudGl0eTogM30sXG5cdFx0XHR7bWluaW9uczogWydza2VsZXRvbicsICd3aXNwJywgJ2dob3N0J10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydza2VsZXRvbiddLCBxdWFudGl0eTogMTB9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDhcblx0XHRcdHttaW5pb25zOiBbJ2RyYWdvbicsICdkYWVtb24nLCAnYmFscm9uJ10sIHF1YW50aXR5OiAzfSxcblx0XHRcdHttaW5pb25zOiBbJ3dhcnJpb3InLCAnbWFnZScsICdiYXJkJywgJ2RydWlkJywgJ3RpbmtlcicsICdwYWxhZGluJywgJ3NoZXBoZXJkJywgJ3JhbmdlciddLCBxdWFudGl0eTogNH0sXG5cdFx0XHR7bWluaW9uczogWydnYXplcicsICdiYWxyb24nXSwgcXVhbnRpdHk6IDN9LFxuXHRcdFx0e2Jvc3M6ICdsaWNoZScsIG1pbmlvbnM6IFsnc2tlbGV0b24nXSwgcXVhbnRpdHk6IDR9LFxuXHRcdFx0e21pbmlvbnM6IFsnZ2hvc3QnLCAnd2lzcCddLCBxdWFudGl0eTogNH0sXG5cdFx0XHR7bWluaW9uczogWydtb25nYmF0J10sIHF1YW50aXR5OiA1fVxuXHRcdF1cdFx0XG5cdF0sXG5cblx0XG5cdGdlbmVyYXRlTGV2ZWw6IGZ1bmN0aW9uKGRlcHRoKXtcblx0XHR2YXIgaGFzUml2ZXIgPSBVdGlsLmNoYW5jZSh0aGlzLldBVEVSX0NIQU5DRVtkZXB0aC0xXSk7XG5cdFx0dmFyIGhhc0xhdmEgPSBVdGlsLmNoYW5jZSh0aGlzLkxBVkFfQ0hBTkNFW2RlcHRoLTFdKTtcblx0XHR2YXIgbWFpbkVudHJhbmNlID0gZGVwdGggPT0gMTtcblx0XHR2YXIgYXJlYXMgPSB0aGlzLmdlbmVyYXRlQXJlYXMoZGVwdGgsIGhhc0xhdmEpO1xuXHRcdHRoaXMucGxhY2VFeGl0cyhhcmVhcyk7XG5cdFx0dmFyIGxldmVsID0ge1xuXHRcdFx0aGFzUml2ZXJzOiBoYXNSaXZlcixcblx0XHRcdGhhc0xhdmE6IGhhc0xhdmEsXG5cdFx0XHRtYWluRW50cmFuY2U6IG1haW5FbnRyYW5jZSxcblx0XHRcdHN0cmF0YTogJ3NvbGlkUm9jaycsXG5cdFx0XHRhcmVhczogYXJlYXMsXG5cdFx0XHRkZXB0aDogZGVwdGgsXG5cdFx0XHRjZWlsaW5nSGVpZ2h0OiB0aGlzLkhFSUdIVFtkZXB0aC0xXVxuXHRcdH0gXG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRnZW5lcmF0ZUFyZWFzOiBmdW5jdGlvbihkZXB0aCwgaGFzTGF2YSl7XG5cdFx0dmFyIGJpZ0FyZWEgPSB7XG5cdFx0XHR4OiAwLFxuXHRcdFx0eTogMCxcblx0XHRcdHc6IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRILFxuXHRcdFx0aDogdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUXG5cdFx0fVxuXHRcdHZhciBtYXhEZXB0aCA9IHRoaXMuY29uZmlnLlNVQkRJVklTSU9OX0RFUFRIO1xuXHRcdHZhciBNSU5fV0lEVEggPSB0aGlzLmNvbmZpZy5NSU5fV0lEVEg7XG5cdFx0dmFyIE1JTl9IRUlHSFQgPSB0aGlzLmNvbmZpZy5NSU5fSEVJR0hUO1xuXHRcdHZhciBNQVhfV0lEVEggPSB0aGlzLmNvbmZpZy5NQVhfV0lEVEg7XG5cdFx0dmFyIE1BWF9IRUlHSFQgPSB0aGlzLmNvbmZpZy5NQVhfSEVJR0hUO1xuXHRcdHZhciBTTElDRV9SQU5HRV9TVEFSVCA9IHRoaXMuY29uZmlnLlNMSUNFX1JBTkdFX1NUQVJUO1xuXHRcdHZhciBTTElDRV9SQU5HRV9FTkQgPSB0aGlzLmNvbmZpZy5TTElDRV9SQU5HRV9FTkQ7XG5cdFx0dmFyIGFyZWFzID0gU3BsaXR0ZXIuc3ViZGl2aWRlQXJlYShiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQpO1xuXHRcdFNwbGl0dGVyLmNvbm5lY3RBcmVhcyhhcmVhcywzKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHR0aGlzLnNldEFyZWFEZXRhaWxzKGFyZWEsIGRlcHRoLCBoYXNMYXZhKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyZWFzO1xuXHR9LFxuXHRzZXRBcmVhRGV0YWlsczogZnVuY3Rpb24oYXJlYSwgZGVwdGgsIGhhc0xhdmEpe1xuXHRcdGlmIChVdGlsLmNoYW5jZSh0aGlzLkNBVkVSTl9DSEFOQ0VbZGVwdGgtMV0pKXtcblx0XHRcdGFyZWEuYXJlYVR5cGUgPSAnY2F2ZXJuJztcblx0XHRcdGlmIChoYXNMYXZhKXtcblx0XHRcdFx0YXJlYS5mbG9vciA9ICdjYXZlcm5GbG9vcic7XG5cdFx0XHRcdGFyZWEuY2F2ZXJuVHlwZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKFsncm9ja3knLCdicmlkZ2VzJ10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKFV0aWwuY2hhbmNlKHRoaXMuTEFHT09OX0NIQU5DRVtkZXB0aC0xXSkpe1xuXHRcdFx0XHRcdGFyZWEuZmxvb3IgPSAnZmFrZVdhdGVyJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhcmVhLmZsb29yID0gJ2NhdmVybkZsb29yJztcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmVhLmNhdmVyblR5cGUgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihbJ3JvY2t5JywnYnJpZGdlcycsJ3dhdGVyeSddKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJlYS5hcmVhVHlwZSA9ICdyb29tcyc7XG5cdFx0XHRhcmVhLmZsb29yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0YXJlYS53YWxsID0gVXRpbC5jaGFuY2UodGhpcy5XQUxMTEVTU19DSEFOQ0VbZGVwdGgtMV0pID8gZmFsc2UgOiAnc3RvbmVXYWxsJztcblx0XHRcdGFyZWEuY29ycmlkb3IgPSAnc3RvbmVGbG9vcic7XG5cdFx0fVxuXHRcdGFyZWEuZW5lbWllcyA9IFtdO1xuXHRcdGFyZWEuaXRlbXMgPSBbXTtcblx0XHR2YXIgcmFuZG9tR2FuZyA9IFV0aWwucmFuZG9tRWxlbWVudE9mKHRoaXMuR0FOR1NbZGVwdGgtMV0pO1xuXHRcdGFyZWEuZW5lbWllcyA9IHJhbmRvbUdhbmcubWluaW9ucztcblx0XHRhcmVhLmVuZW15Q291bnQgPSByYW5kb21HYW5nLnF1YW50aXR5ICsgVXRpbC5yYW5kKDAsMyk7XG5cdFx0aWYgKHJhbmRvbUdhbmcpXG5cdFx0XHRhcmVhLmJvc3MgPSByYW5kb21HYW5nLmJvc3M7XG5cdH0sXG5cdHBsYWNlRXhpdHM6IGZ1bmN0aW9uKGFyZWFzKXtcblx0XHR2YXIgZGlzdCA9IG51bGw7XG5cdFx0dmFyIGFyZWExID0gbnVsbDtcblx0XHR2YXIgYXJlYTIgPSBudWxsO1xuXHRcdHZhciBmdXNlID0gMTAwMDtcblx0XHRkbyB7XG5cdFx0XHRhcmVhMSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRcdGFyZWEyID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdFx0aWYgKGZ1c2UgPCAwKXtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRkaXN0ID0gVXRpbC5saW5lRGlzdGFuY2UoYXJlYTEsIGFyZWEyKTtcblx0XHRcdGZ1c2UtLTtcblx0XHR9IHdoaWxlIChkaXN0IDwgKHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIICsgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKSAvIDMpO1xuXHRcdGFyZWExLmhhc0V4aXQgPSB0cnVlO1xuXHRcdGFyZWEyLmhhc0VudHJhbmNlID0gdHJ1ZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcnN0TGV2ZWxHZW5lcmF0b3I7IiwiZnVuY3Rpb24gR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHR0aGlzLmZpcnN0TGV2ZWxHZW5lcmF0b3IgPSBuZXcgRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yID0gbmV3IFNlY29uZExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMudGhpcmRMZXZlbEdlbmVyYXRvciA9IG5ldyBUaGlyZExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMubW9uc3RlclBvcHVsYXRvciA9IG5ldyBNb25zdGVyUG9wdWxhdG9yKGNvbmZpZyk7XG5cdHRoaXMuaXRlbVBvcHVsYXRvciA9IG5ldyBJdGVtUG9wdWxhdG9yKGNvbmZpZyk7XG59XG5cbnZhciBGaXJzdExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9GaXJzdExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgU2Vjb25kTGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgVGhpcmRMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vVGhpcmRMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIE1vbnN0ZXJQb3B1bGF0b3IgPSByZXF1aXJlKCcuL01vbnN0ZXJQb3B1bGF0b3IuY2xhc3MnKTtcbnZhciBJdGVtUG9wdWxhdG9yID0gcmVxdWlyZSgnLi9JdGVtUG9wdWxhdG9yLmNsYXNzJyk7XG5cbkdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGdlbmVyYXRlTGV2ZWw6IGZ1bmN0aW9uKGRlcHRoKXtcblx0XHR2YXIgc2tldGNoID0gdGhpcy5maXJzdExldmVsR2VuZXJhdG9yLmdlbmVyYXRlTGV2ZWwoZGVwdGgpO1xuXHRcdHZhciBsZXZlbCA9IHRoaXMuc2Vjb25kTGV2ZWxHZW5lcmF0b3IuZmlsbExldmVsKHNrZXRjaCk7XG5cdFx0dGhpcy50aGlyZExldmVsR2VuZXJhdG9yLmZpbGxMZXZlbChza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yLmZyYW1lTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5tb25zdGVyUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5pdGVtUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNrZXRjaDogc2tldGNoLFxuXHRcdFx0bGV2ZWw6IGxldmVsXG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yOyIsImZ1bmN0aW9uIEl0ZW1Qb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5JdGVtUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0dGhpcy5jYWxjdWxhdGVSYXJpdGllcyhsZXZlbC5kZXB0aCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHR2YXIgaXRlbXMgPSBVdGlsLnJhbmQoMCwyKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zOyBpKyspe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEsIGZhbHNlLCB0cnVlKTtcblx0XHRcdHZhciBpdGVtID0gdGhpcy5nZXRBbkl0ZW0oKTtcblx0XHRcdGxldmVsLmFkZEl0ZW0oaXRlbSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0fVxuXHR9LFxuXHRjYWxjdWxhdGVSYXJpdGllczogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHRoaXMudGhyZXNob2xkcyA9IFtdO1xuXHRcdHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsID0gMDtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuSVRFTVMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLklURU1TW2ldO1xuXHRcdFx0dmFyIG1hbHVzID0gTWF0aC5hYnMoZGVwdGgtaXRlbS5kZXB0aCkgPiAxO1xuXHRcdFx0dmFyIHJhcml0eSA9IG1hbHVzID8gaXRlbS5yYXJpdHkgLyAyIDogaXRlbS5yYXJpdHk7XG5cdFx0XHR0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCArPSByYXJpdHk7XG5cdFx0XHR0aGlzLnRocmVzaG9sZHMucHVzaCh7dGhyZXNob2xkOiB0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCwgaXRlbTogaXRlbX0pO1xuXHRcdH1cblx0fSxcblx0SVRFTVM6IFtcblx0XHQvKntjb2RlOiAnZGFnZ2VyJywgcmFyaXR5OiAzNTAwfSxcblx0XHR7Y29kZTogJ29pbEZsYXNrJywgcmFyaXR5OiAxNDAwfSxcblx0XHR7Y29kZTogJ3N0YWZmJywgcmFyaXR5OiAzNTB9LFxuXHRcdHtjb2RlOiAnc2xpbmcnLCByYXJpdHk6IDI4MH0sXG5cdFx0e2NvZGU6ICdtYWNlJywgcmFyaXR5OiA3MH0sXG5cdFx0e2NvZGU6ICdheGUnLCByYXJpdHk6IDMxfSxcblx0XHR7Y29kZTogJ2JvdycsIHJhcml0eTogMjh9LFxuXHRcdHtjb2RlOiAnc3dvcmQnLCByYXJpdHk6IDM1MH0sXG5cdFx0e2NvZGU6ICdoYWxiZXJkJywgcmFyaXR5OiAyM30sXG5cdFx0e2NvZGU6ICdjcm9zc2JvdycsIHJhcml0eTogMTF9LFxuXHRcdHtjb2RlOiAnbWFnaWNBeGUnLCByYXJpdHk6IDV9LFxuXHRcdHtjb2RlOiAnbWFnaWNCb3cnLCByYXJpdHk6IDR9LFxuXHRcdHtjb2RlOiAnbWFnaWNTd29yZCcsIHJhcml0eTogNH0sXG5cdFx0e2NvZGU6ICdtYWdpY1dhbmQnLCByYXJpdHk6IDJ9LFxuXHRcdHtjb2RlOiAnY2xvdGgnLCByYXJpdHk6IDE0MH0sXG5cdFx0e2NvZGU6ICdsZWF0aGVyJywgcmFyaXR5OiAzNX0sXG5cdFx0e2NvZGU6ICdjaGFpbicsIHJhcml0eTogMTJ9LFxuXHRcdHtjb2RlOiAncGxhdGUnLCByYXJpdHk6IDR9LFxuXHRcdHtjb2RlOiAnbWFnaWNDaGFpbicsIHJhcml0eTogMn0sXG5cdFx0e2NvZGU6ICdtYWdpY1BsYXRlJywgcmFyaXR5OiAxfSovXG5cdFx0e2NvZGU6ICdjdXJlJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICdoZWFsJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICdyZWRQb3Rpb24nLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAxfSxcblx0XHR7Y29kZTogJ3llbGxvd1BvdGlvbicsIHJhcml0eTogMTAwMCwgZGVwdGg6IDF9LFxuXHRcdHtjb2RlOiAnbGlnaHQnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAyfSxcblx0XHR7Y29kZTogJ21pc3NpbGUnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAzfSxcblx0XHR7Y29kZTogJ2ljZWJhbGwnLCByYXJpdHk6IDUwMCwgZGVwdGg6IDR9LFxuXHRcdHtjb2RlOiAncmVwZWwnLCByYXJpdHk6IDUwMCwgZGVwdGg6IDV9LFxuXHRcdHtjb2RlOiAnYmxpbmsnLCByYXJpdHk6IDMzMywgZGVwdGg6IDV9LFxuXHRcdHtjb2RlOiAnZmlyZWJhbGwnLCByYXJpdHk6IDMzMywgZGVwdGg6IDZ9LFxuXHRcdHtjb2RlOiAncHJvdGVjdGlvbicsIHJhcml0eTogMjUwLCBkZXB0aDogNn0sXG5cdFx0e2NvZGU6ICd0aW1lJywgcmFyaXR5OiAyMDAsIGRlcHRoOiA3fSxcblx0XHR7Y29kZTogJ3NsZWVwJywgcmFyaXR5OiAyMDAsIGRlcHRoOiA3fSxcblx0XHR7Y29kZTogJ2ppbngnLCByYXJpdHk6IDE2NiwgZGVwdGg6IDh9LFxuXHRcdHtjb2RlOiAndHJlbW9yJywgcmFyaXR5OiAxNjYsIGRlcHRoOiA4fSxcblx0XHR7Y29kZTogJ2tpbGwnLCByYXJpdHk6IDE0MiwgZGVwdGg6IDh9XG5cdF0sXG5cdGdldEFuSXRlbTogZnVuY3Rpb24oKXtcblx0XHR2YXIgbnVtYmVyID0gVXRpbC5yYW5kKDAsIHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGhyZXNob2xkcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiAobnVtYmVyIDw9IHRoaXMudGhyZXNob2xkc1tpXS50aHJlc2hvbGQpXG5cdFx0XHRcdHJldHVybiB0aGlzLnRocmVzaG9sZHNbaV0uaXRlbS5jb2RlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy50aHJlc2hvbGRzWzBdLml0ZW0uY29kZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZW1Qb3B1bGF0b3I7IiwiZnVuY3Rpb24gS3JhbWdpbmVFeHBvcnRlcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxuS3JhbWdpbmVFeHBvcnRlci5wcm90b3R5cGUgPSB7XG5cdGdldExldmVsOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dGhpcy5pbml0VGlsZURlZnMobGV2ZWwuY2VpbGluZ0hlaWdodCk7XG5cdFx0dmFyIHRpbGVzID0gdGhpcy5nZXRUaWxlcygpO1xuXHRcdHZhciBvYmplY3RzID0gdGhpcy5nZXRPYmplY3RzKGxldmVsKTtcblx0XHR2YXIgbWFwID0gdGhpcy5nZXRNYXAobGV2ZWwpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aWxlczogdGlsZXMsXG5cdFx0XHRvYmplY3RzOiBvYmplY3RzLFxuXHRcdFx0bWFwOiBtYXBcblx0XHR9O1xuXHR9LFxuXHRpbml0VGlsZURlZnM6IGZ1bmN0aW9uKGNlaWxpbmdIZWlnaHQpe1xuXHRcdHRoaXMudGlsZXMgPSBbXTtcblx0XHR0aGlzLnRpbGVzTWFwID0gW107XG5cdFx0dGhpcy50aWxlcy5wdXNoKG51bGwpO1xuXHRcdHRoaXMuY2VpbGluZ0hlaWdodCA9IGNlaWxpbmdIZWlnaHQ7XG5cdFx0dGhpcy5hZGRUaWxlKCdTVE9ORV9XQUxMJywgMiwgMCwgMCk7XG5cdFx0dGhpcy5hZGRUaWxlKCdTVE9ORV9GTE9PUicsIDAsIDIsIDIpO1xuXHRcdHRoaXMuYWRkVGlsZSgnQlJJREdFJywgMCwgNCwgMik7XG5cdFx0dGhpcy5hZGRUaWxlKCdXQVRFUicsIDAsIDEwMSwgMik7XG5cdFx0dGhpcy5hZGRUaWxlKCdMQVZBJywgMCwgMTAzLCAyKTtcblx0fSxcblx0YWRkVGlsZTogZnVuY3Rpb24gKGlkLCB3YWxsVGV4dHVyZSwgZmxvb3JUZXh0dXJlLCBjZWlsVGV4dHVyZSl7XG5cdFx0dmFyIHRpbGUgPSB0aGlzLmNyZWF0ZVRpbGUod2FsbFRleHR1cmUsIGZsb29yVGV4dHVyZSwgY2VpbFRleHR1cmUsIHRoaXMuY2VpbGluZ0hlaWdodCk7XG5cdFx0dGhpcy50aWxlcy5wdXNoKHRpbGUpO1xuXHRcdHRoaXMudGlsZXNNYXBbaWRdID0gdGhpcy50aWxlcy5sZW5ndGggLSAxO1xuXHR9LFxuXHRnZXRUaWxlOiBmdW5jdGlvbihpZCl7XG5cdFx0cmV0dXJuIHRoaXMudGlsZXNNYXBbaWRdO1xuXHR9LFxuXHRjcmVhdGVUaWxlOiBmdW5jdGlvbih3YWxsVGV4dHVyZSwgZmxvb3JUZXh0dXJlLCBjZWlsVGV4dHVyZSwgaGVpZ2h0KXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dzogd2FsbFRleHR1cmUsXG5cdFx0XHR5OiAwLFxuXHRcdFx0aDogaGVpZ2h0LFxuXHRcdFx0ZjogZmxvb3JUZXh0dXJlLFxuXHRcdFx0Znk6IDAsXG5cdFx0XHRjOiBjZWlsVGV4dHVyZSxcblx0XHRcdGNoOiBoZWlnaHQsXG5cdFx0XHRzbDogMCxcblx0XHRcdGRpcjogMFxuXHRcdH07XG5cdH0sXG5cdGdldFRpbGVzOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiB0aGlzLnRpbGVzO1xuXHR9LFxuXHRnZXRPYmplY3RzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG9iamVjdHMgPSBbXTtcblx0XHRvYmplY3RzLnB1c2goe1xuXHRcdFx0eDogbGV2ZWwuc3RhcnQueCArIDAuNSxcblx0XHRcdHo6IGxldmVsLnN0YXJ0LnkgKyAwLjUsXG5cdFx0XHR5OiAwLFxuXHRcdFx0ZGlyOiAzLFxuXHRcdFx0dHlwZTogJ3BsYXllcidcblx0XHR9KTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmVuZW1pZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGVuZW15ID0gbGV2ZWwuZW5lbWllc1tpXTtcblx0XHRcdHZhciBlbmVteURhdGEgPVxuXHRcdFx0e1xuXHQgICAgICAgICAgICB4OiBlbmVteS54ICsgMC41LFxuXHQgICAgICAgICAgICB6OiBlbmVteS55ICsgMC41LFxuXHQgICAgICAgICAgICB5OiAwLFxuXHQgICAgICAgICAgICB0eXBlOiAnZW5lbXknLFxuXHQgICAgICAgICAgICBlbmVteTogZW5lbXkuY29kZVxuXHQgICAgICAgIH07XG5cdFx0XHRvYmplY3RzLnB1c2goZW5lbXlEYXRhKTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0dmFyIGl0ZW1EYXRhID1cblx0XHRcdHtcblx0ICAgICAgICAgICAgeDogaXRlbS54ICsgMC41LFxuXHQgICAgICAgICAgICB6OiBpdGVtLnkgKyAwLjUsXG5cdCAgICAgICAgICAgIHk6IDAsXG5cdCAgICAgICAgICAgIHR5cGU6ICdpdGVtJyxcblx0ICAgICAgICAgICAgaXRlbTogaXRlbS5jb2RlXG5cdCAgICAgICAgfTtcblx0XHRcdG9iamVjdHMucHVzaChpdGVtRGF0YSk7XG5cdFx0fVxuXHRcdHJldHVybiBvYmplY3RzO1xuXHR9LFxuXHRnZXRNYXA6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgbWFwID0gW107XG5cdFx0dmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRtYXBbeV0gPSBbXTtcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07XG5cdFx0XHRcdHZhciBpZCA9IG51bGw7XG5cdFx0XHRcdGlmIChjZWxsID09PSAnd2F0ZXInKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIldBVEVSXCIpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIldBVEVSXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3NvbGlkUm9jaycpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfV0FMTFwiKTtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjYXZlcm5GbG9vcicpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfRkxPT1JcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnZG93bnN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfRkxPT1JcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAndXBzdGFpcnMnKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX0ZMT09SXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lV2FsbCcpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfV0FMTFwiKTtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZUZsb29yJyl7XG5cdFx0XHRcdFx0aWQgPSB0aGlzLmdldFRpbGUoXCJTVE9ORV9GTE9PUlwiKTtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfRkxPT1JcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnYnJpZGdlJyl7XG5cdFx0XHRcdFx0aWQgPSB0aGlzLmdldFRpbGUoXCJCUklER0VcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiTEFWQVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXBbeV1beF0gPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtyYW1naW5lRXhwb3J0ZXI7XG4iLCJmdW5jdGlvbiBMZXZlbChjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn07XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5MZXZlbC5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5jZWxscyA9IFtdO1xuXHRcdHRoaXMuZW5lbWllcyA9IFtdO1xuXHRcdHRoaXMuZW5lbWllc01hcCA9IHt9O1xuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0dGhpcy5jZWxsc1t4XSA9IFtdO1xuXHRcdH1cblx0fSxcblx0YWRkRW5lbXk6IGZ1bmN0aW9uKGVuZW15LCB4LCB5KXtcblx0XHR2YXIgZW5lbXkgPSB7XG5cdFx0XHRjb2RlOiBlbmVteSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fTtcblx0XHR0aGlzLmVuZW1pZXMucHVzaChlbmVteSk7XG5cdFx0dGhpcy5lbmVtaWVzTWFwW3grXCJfXCIreV0gPSBlbmVteTtcblx0fSxcblx0Z2V0RW5lbXk6IGZ1bmN0aW9uKHgseSl7XG5cdFx0cmV0dXJuIHRoaXMuZW5lbWllc01hcFt4K1wiX1wiK3ldO1xuXHR9LFxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtLCB4LCB5KXtcblx0XHR0aGlzLml0ZW1zLnB1c2goe1xuXHRcdFx0Y29kZTogaXRlbSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fSk7XG5cdH0sXG5cdGdldEZyZWVQbGFjZTogZnVuY3Rpb24oYXJlYSwgb25seVdhdGVyLCBub1dhdGVyKXtcblx0XHR2YXIgdHJpZXMgPSAwO1xuXHRcdHdoaWxlKHRydWUpe1xuXHRcdFx0dmFyIHJhbmRQb2ludCA9IHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKGFyZWEueCwgYXJlYS54K2FyZWEudy0xKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKGFyZWEueSwgYXJlYS55K2FyZWEuaC0xKVxuXHRcdFx0fVxuXHRcdFx0dmFyIGNlbGwgPSB0aGlzLmNlbGxzW3JhbmRQb2ludC54XVtyYW5kUG9pbnQueV07IFxuXHRcdFx0aWYgKG9ubHlXYXRlcil7XG5cdFx0XHRcdGlmIChjZWxsID09ICd3YXRlcicgfHwgY2VsbCA9PSAnZmFrZVdhdGVyJylcblx0XHRcdFx0XHRyZXR1cm4gcmFuZFBvaW50O1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dHJpZXMrKztcblx0XHRcdFx0aWYgKHRyaWVzID4gMTAwMClcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICBlbHNlIGlmIChub1dhdGVyKXtcblx0XHRcdFx0aWYgKGNlbGwgPT0gJ3dhdGVyJyB8fCBjZWxsID09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHR0cmllcysrO1xuXHRcdFx0XHRcdGlmICh0cmllcyA+IDEwMDApXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2VsbCA9PSBhcmVhLmZsb29yIHx8IGFyZWEuY29ycmlkb3IgJiYgY2VsbCA9PSBhcmVhLmNvcnJpZG9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJhbmRQb2ludDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChjZWxsID09IGFyZWEuZmxvb3IgfHwgYXJlYS5jb3JyaWRvciAmJiBjZWxsID09IGFyZWEuY29ycmlkb3IgfHwgY2VsbCA9PSAnZmFrZVdhdGVyJylcblx0XHRcdFx0cmV0dXJuIHJhbmRQb2ludDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGV2ZWw7IiwiZnVuY3Rpb24gTW9uc3RlclBvcHVsYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbk1vbnN0ZXJQb3B1bGF0b3IucHJvdG90eXBlID0ge1xuXHRwb3B1bGF0ZUxldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNrZXRjaC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IHNrZXRjaC5hcmVhc1tpXTtcblx0XHRcdGlmIChhcmVhLmhhc0VudHJhbmNlKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdHRoaXMucG9wdWxhdGVBcmVhKGFyZWEsIGxldmVsKTtcblx0XHR9XG5cdH0sXG5cdHBvcHVsYXRlQXJlYTogZnVuY3Rpb24oYXJlYSwgbGV2ZWwpe1xuXHRcdGlmIChhcmVhLmJvc3Mpe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEsIGZhbHNlLCB0cnVlKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdGxldmVsLmFkZEVuZW15KGFyZWEuYm9zcywgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciB0cmllcyA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmVuZW15Q291bnQ7IGkrKyl7XG5cdFx0XHR2YXIgbW9uc3RlciA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWEuZW5lbWllcyk7XG5cdFx0XHR2YXIgb25seVdhdGVyID0gdGhpcy5pc1dhdGVyTW9uc3Rlcihtb25zdGVyKTtcblx0XHRcdHZhciBub1dhdGVyID0gIW9ubHlXYXRlciAmJiAhdGhpcy5pc0ZseWluZ01vbnN0ZXIobW9uc3Rlcik7XG5cdFx0XHR2YXIgcG9zaXRpb24gPSBsZXZlbC5nZXRGcmVlUGxhY2UoYXJlYSwgb25seVdhdGVyLCBub1dhdGVyKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdGlmIChsZXZlbC5nZXRFbmVteShwb3NpdGlvbi54LCBwb3NpdGlvbi55KSl7XG5cdFx0XHRcdFx0dHJpZXMrKztcblx0XHRcdFx0XHRpZiAodHJpZXMgPCAxMDApe1xuXHRcdFx0XHRcdFx0aS0tO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0cmllcyA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxldmVsLmFkZEVuZW15KG1vbnN0ZXIsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0aXNXYXRlck1vbnN0ZXI6IGZ1bmN0aW9uKG1vbnN0ZXIpe1xuXHRcdHJldHVybiBtb25zdGVyID09ICdvY3RvcHVzJyB8fCBtb25zdGVyID09ICdzZWFTZXJwZW50JzsgXG5cdH0sXG5cdGlzRmx5aW5nTW9uc3RlcjogZnVuY3Rpb24obW9uc3Rlcil7XG5cdFx0cmV0dXJuIG1vbnN0ZXIgPT0gJ2JhdCcgfHwgbW9uc3RlciA9PSAnbW9uZ2JhdCcgfHwgbW9uc3RlciA9PSAnZ2hvc3QnIHx8IG1vbnN0ZXIgPT0gJ2RyYWdvbicgfHwgbW9uc3RlciA9PSAnZ2F6ZXInOyBcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnN0ZXJQb3B1bGF0b3I7IiwiZnVuY3Rpb24gU2Vjb25kTGV2ZWxHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIExldmVsID0gcmVxdWlyZSgnLi9MZXZlbC5jbGFzcycpO1xudmFyIENBID0gcmVxdWlyZSgnLi9DQScpO1xuXG5TZWNvbmRMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGZpbGxMZXZlbDogZnVuY3Rpb24oc2tldGNoKXtcblx0XHR2YXIgbGV2ZWwgPSBuZXcgTGV2ZWwodGhpcy5jb25maWcpO1xuXHRcdGxldmVsLmluaXQoKTtcblx0XHR0aGlzLmZpbGxTdHJhdGEobGV2ZWwsIHNrZXRjaCk7XG5cdFx0bGV2ZWwuY2VpbGluZ0hlaWdodCA9IHNrZXRjaC5jZWlsaW5nSGVpZ2h0O1xuXHRcdGlmIChza2V0Y2guaGFzTGF2YSlcblx0XHRcdHRoaXMucGxvdFJpdmVycyhsZXZlbCwgc2tldGNoLCAnbGF2YScpO1xuXHRcdGVsc2UgaWYgKHNrZXRjaC5oYXNSaXZlcnMpXG5cdFx0XHR0aGlzLnBsb3RSaXZlcnMobGV2ZWwsIHNrZXRjaCwgJ3dhdGVyJyk7XG5cdFx0dGhpcy5jb3B5R2VvKGxldmVsKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGZpbGxTdHJhdGE6IGZ1bmN0aW9uKGxldmVsLCBza2V0Y2gpe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y29weUdlbzogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBnZW8gPSBbXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Z2VvW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0Z2VvW3hdW3ldID0gbGV2ZWwuY2VsbHNbeF1beV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldmVsLmdlbyA9IGdlbztcblx0fSxcblx0cGxvdFJpdmVyczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHR0aGlzLnBsYWNlUml2ZXJsaW5lcyhsZXZlbCwgc2tldGNoLCBsaXF1aWQpO1xuXHRcdHRoaXMuZmF0dGVuUml2ZXJzKGxldmVsLCBsaXF1aWQpO1xuXHRcdGlmIChsaXF1aWQgPT0gJ2xhdmEnKVxuXHRcdFx0dGhpcy5mYXR0ZW5SaXZlcnMobGV2ZWwsIGxpcXVpZCk7XG5cdH0sXG5cdGZhdHRlblJpdmVyczogZnVuY3Rpb24obGV2ZWwsIGxpcXVpZCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nW2xpcXVpZF0gPiAxICYmIFV0aWwuY2hhbmNlKDMwKSlcblx0XHRcdFx0cmV0dXJuIGxpcXVpZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbbGlxdWlkXSA+IDEpXG5cdFx0XHRcdHJldHVybiBsaXF1aWQ7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdH0sXG5cdHBsYWNlUml2ZXJsaW5lczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHQvLyBQbGFjZSByYW5kb20gbGluZSBzZWdtZW50cyBvZiB3YXRlclxuXHRcdHZhciByaXZlcnMgPSBVdGlsLnJhbmQodGhpcy5jb25maWcuTUlOX1JJVkVSUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJTKTtcblx0XHR2YXIgcml2ZXJTZWdtZW50TGVuZ3RoID0gdGhpcy5jb25maWcuUklWRVJfU0VHTUVOVF9MRU5HVEg7XG5cdFx0dmFyIHB1ZGRsZSA9IGZhbHNlO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcml2ZXJzOyBpKyspe1xuXHRcdFx0dmFyIHNlZ21lbnRzID0gVXRpbC5yYW5kKHRoaXMuY29uZmlnLk1JTl9SSVZFUl9TRUdNRU5UUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJfU0VHTUVOVFMpO1xuXHRcdFx0dmFyIHJpdmVyUG9pbnRzID0gW107XG5cdFx0XHRyaXZlclBvaW50cy5wdXNoKHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdH0pO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBzZWdtZW50czsgaisrKXtcblx0XHRcdFx0dmFyIHJhbmRvbVBvaW50ID0gVXRpbC5yYW5kb21FbGVtZW50T2Yocml2ZXJQb2ludHMpO1xuXHRcdFx0XHRpZiAocml2ZXJQb2ludHMubGVuZ3RoID4gMSAmJiAhcHVkZGxlKVxuXHRcdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KHJpdmVyUG9pbnRzLCByYW5kb21Qb2ludCk7XG5cdFx0XHRcdHZhciBpYW5jZSA9IHtcblx0XHRcdFx0XHR4OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKSxcblx0XHRcdFx0XHR5OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbmV3UG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogcmFuZG9tUG9pbnQueCArIGlhbmNlLngsXG5cdFx0XHRcdFx0eTogcmFuZG9tUG9pbnQueSArIGlhbmNlLnksXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmIChuZXdQb2ludC54ID4gMCAmJiBuZXdQb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0bmV3UG9pbnQueSA+IDAgJiYgbmV3UG9pbnQueSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdFx0XHRyaXZlclBvaW50cy5wdXNoKG5ld1BvaW50KTtcblx0XHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUocmFuZG9tUG9pbnQsIG5ld1BvaW50KTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBsaW5lLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2tdO1xuXHRcdFx0XHRcdGlmIChwb2ludC54ID4gMCAmJiBwb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0XHRwb2ludC55ID4gMCAmJiBwb2ludC55IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gbGlxdWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmcmFtZUxldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzW3hdWzBdICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t4XVswXSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0XHRpZiAobGV2ZWwuY2VsbHNbeF1bdGhpcy5jb25maWcuTEVWRUxfSEVJR0hULTFdICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t4XVt0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQtMV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdH1cblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdGlmIChsZXZlbC5jZWxsc1swXVt5XSAhPSAnc3RvbmVXYWxsJykgbGV2ZWwuY2VsbHNbMF1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzW3RoaXMuY29uZmlnLkxFVkVMX1dJRFRILTFdW3ldICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t0aGlzLmNvbmZpZy5MRVZFTF9XSURUSC0xXVt5XSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2Vjb25kTGV2ZWxHZW5lcmF0b3I7IiwidmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdWJkaXZpZGVBcmVhOiBmdW5jdGlvbihiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQsIGF2b2lkUG9pbnRzKXtcblx0XHR2YXIgYXJlYXMgPSBbXTtcblx0XHR2YXIgYmlnQXJlYXMgPSBbXTtcblx0XHRiaWdBcmVhLmRlcHRoID0gMDtcblx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdHZhciByZXRyaWVzID0gMDtcblx0XHR3aGlsZSAoYmlnQXJlYXMubGVuZ3RoID4gMCl7XG5cdFx0XHR2YXIgYmlnQXJlYSA9IGJpZ0FyZWFzLnBvcCgpO1xuXHRcdFx0dmFyIGhvcml6b250YWxTcGxpdCA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRcdGlmIChiaWdBcmVhLncgPCBNSU5fV0lEVEggKiAxLjUgJiYgYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS53IDwgTUlOX1dJRFRIICogMS41KXtcblx0XHRcdFx0aG9yaXpvbnRhbFNwbGl0ID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGhvcml6b250YWxTcGxpdCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGFyZWExID0gbnVsbDtcblx0XHRcdHZhciBhcmVhMiA9IG51bGw7XG5cdFx0XHRpZiAoaG9yaXpvbnRhbFNwbGl0KXtcblx0XHRcdFx0dmFyIHNsaWNlID0gTWF0aC5yb3VuZChVdGlsLnJhbmQoYmlnQXJlYS5oICogU0xJQ0VfUkFOR0VfU1RBUlQsIGJpZ0FyZWEuaCAqIFNMSUNFX1JBTkdFX0VORCkpO1xuXHRcdFx0XHRhcmVhMSA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudyxcblx0XHRcdFx0XHRoOiBzbGljZVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55ICsgc2xpY2UsXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaCAtIHNsaWNlXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBzbGljZSA9IE1hdGgucm91bmQoVXRpbC5yYW5kKGJpZ0FyZWEudyAqIFNMSUNFX1JBTkdFX1NUQVJULCBiaWdBcmVhLncgKiBTTElDRV9SQU5HRV9FTkQpKTtcblx0XHRcdFx0YXJlYTEgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54LFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSxcblx0XHRcdFx0XHR3OiBzbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngrc2xpY2UsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudy1zbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChhcmVhMS53IDwgTUlOX1dJRFRIIHx8IGFyZWExLmggPCBNSU5fSEVJR0hUIHx8XG5cdFx0XHRcdGFyZWEyLncgPCBNSU5fV0lEVEggfHwgYXJlYTIuaCA8IE1JTl9IRUlHSFQpe1xuXHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCAmJiBcblx0XHRcdFx0XHQoYXJlYTEudyA+IE1BWF9XSURUSCB8fCBhcmVhMS5oID4gTUFYX0hFSUdIVCB8fFxuXHRcdFx0XHRcdGFyZWEyLncgPiBNQVhfV0lEVEggfHwgYXJlYTIuaCA+IE1BWF9IRUlHSFQpKXtcblx0XHRcdFx0aWYgKHJldHJpZXMgPCAxMDApIHtcblx0XHRcdFx0XHQvLyBQdXNoIGJhY2sgYmlnIGFyZWFcblx0XHRcdFx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMrKztcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVx0XHRcblx0XHRcdH1cblx0XHRcdGlmIChhdm9pZFBvaW50cyAmJiAodGhpcy5jb2xsaWRlc1dpdGgoYXZvaWRQb2ludHMsIGFyZWEyKSB8fCB0aGlzLmNvbGxpZGVzV2l0aChhdm9pZFBvaW50cywgYXJlYTEpKSl7XG5cdFx0XHRcdGlmIChyZXRyaWVzID4gMTAwKXtcblx0XHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFB1c2ggYmFjayBiaWcgYXJlYVxuXHRcdFx0XHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcysrO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0XHRjb250aW51ZTsgXG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCl7XG5cdFx0XHRcdGFyZWExLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYTIuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGFyZWExKTtcblx0XHRcdFx0YXJlYXMucHVzaChhcmVhMik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhMS5kZXB0aCA9IGJpZ0FyZWEuZGVwdGggKzE7XG5cdFx0XHRcdGFyZWEyLmRlcHRoID0gYmlnQXJlYS5kZXB0aCArMTtcblx0XHRcdFx0YmlnQXJlYXMucHVzaChhcmVhMSk7XG5cdFx0XHRcdGJpZ0FyZWFzLnB1c2goYXJlYTIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYXJlYXM7XG5cdH0sXG5cdGNvbGxpZGVzV2l0aDogZnVuY3Rpb24oYXZvaWRQb2ludHMsIGFyZWEpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXZvaWRQb2ludHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGF2b2lkUG9pbnQgPSBhdm9pZFBvaW50c1tpXTtcblx0XHRcdGlmIChVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54K2FyZWEudywgYXJlYS55LCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCthcmVhLncsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0Y29ubmVjdEFyZWFzOiBmdW5jdGlvbihhcmVhcywgYm9yZGVyKXtcblx0XHQvKiBNYWtlIG9uZSBhcmVhIGNvbm5lY3RlZFxuXHRcdCAqIFdoaWxlIG5vdCBhbGwgYXJlYXMgY29ubmVjdGVkLFxuXHRcdCAqICBTZWxlY3QgYSBjb25uZWN0ZWQgYXJlYVxuXHRcdCAqICBTZWxlY3QgYSB2YWxpZCB3YWxsIGZyb20gdGhlIGFyZWFcblx0XHQgKiAgVGVhciBpdCBkb3duLCBjb25uZWN0aW5nIHRvIHRoZSBhIG5lYXJieSBhcmVhXG5cdFx0ICogIE1hcmsgYXJlYSBhcyBjb25uZWN0ZWRcblx0XHQgKi9cblx0XHRpZiAoIWJvcmRlcil7XG5cdFx0XHRib3JkZXIgPSAxO1xuXHRcdH1cblx0XHR2YXIgY29ubmVjdGVkQXJlYXMgPSBbXTtcblx0XHR2YXIgcmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKHJhbmRvbUFyZWEpO1xuXHRcdHZhciBjdXJzb3IgPSB7fTtcblx0XHR2YXIgdmFyaSA9IHt9O1xuXHRcdGFyZWE6IHdoaWxlIChjb25uZWN0ZWRBcmVhcy5sZW5ndGggPCBhcmVhcy5sZW5ndGgpe1xuXHRcdFx0cmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGNvbm5lY3RlZEFyZWFzKTtcblx0XHRcdHZhciB3YWxsRGlyID0gVXRpbC5yYW5kKDEsNCk7XG5cdFx0XHRzd2l0Y2god2FsbERpcil7XG5cdFx0XHRjYXNlIDE6IC8vIExlZnRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLng7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciAsIHJhbmRvbUFyZWEueStyYW5kb21BcmVhLmggLSBib3JkZXIpO1xuXHRcdFx0XHR2YXJpLnggPSAtMjtcblx0XHRcdFx0dmFyaS55ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6IC8vUmlnaHRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLnggKyByYW5kb21BcmVhLnc7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciwgcmFuZG9tQXJlYS55K3JhbmRvbUFyZWEuaCAtIGJvcmRlcik7XG5cdFx0XHRcdHZhcmkueCA9IDI7XG5cdFx0XHRcdHZhcmkueSA9IDA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOiAvL1VwXG5cdFx0XHRcdGN1cnNvci54ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueCArIGJvcmRlciwgcmFuZG9tQXJlYS54K3JhbmRvbUFyZWEudyAtIGJvcmRlcik7XG5cdFx0XHRcdGN1cnNvci55ID0gcmFuZG9tQXJlYS55O1xuXHRcdFx0XHR2YXJpLnggPSAwO1xuXHRcdFx0XHR2YXJpLnkgPSAtMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6IC8vRG93blxuXHRcdFx0XHRjdXJzb3IueCA9IFV0aWwucmFuZChyYW5kb21BcmVhLnggKyBib3JkZXIsIHJhbmRvbUFyZWEueCtyYW5kb21BcmVhLncgLSBib3JkZXIpO1xuXHRcdFx0XHRjdXJzb3IueSA9IHJhbmRvbUFyZWEueSArIHJhbmRvbUFyZWEuaDtcblx0XHRcdFx0dmFyaS54ID0gMDtcblx0XHRcdFx0dmFyaS55ID0gMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHR2YXIgY29ubmVjdGVkQXJlYSA9IHRoaXMuZ2V0QXJlYUF0KGN1cnNvciwgdmFyaSwgYXJlYXMpO1xuXHRcdFx0aWYgKGNvbm5lY3RlZEFyZWEgJiYgIVV0aWwuY29udGFpbnMoY29ubmVjdGVkQXJlYXMsIGNvbm5lY3RlZEFyZWEpKXtcblx0XHRcdFx0c3dpdGNoKHdhbGxEaXIpe1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoY3Vyc29yLnkgPD0gY29ubmVjdGVkQXJlYS55ICsgYm9yZGVyIHx8IGN1cnNvci55ID49IGNvbm5lY3RlZEFyZWEueSArIGNvbm5lY3RlZEFyZWEuaCAtIGJvcmRlcilcblx0XHRcdFx0XHRcdGNvbnRpbnVlIGFyZWE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdGlmIChjdXJzb3IueCA8PSBjb25uZWN0ZWRBcmVhLnggKyBib3JkZXIgfHwgY3Vyc29yLnggPj0gY29ubmVjdGVkQXJlYS54ICsgY29ubmVjdGVkQXJlYS53IC0gYm9yZGVyKVxuXHRcdFx0XHRcdFx0Y29udGludWUgYXJlYTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jb25uZWN0QXJlYShyYW5kb21BcmVhLCBjb25uZWN0ZWRBcmVhLCBjdXJzb3IpO1xuXHRcdFx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKGNvbm5lY3RlZEFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2V0QXJlYUF0OiBmdW5jdGlvbihjdXJzb3IsIHZhcmksIGFyZWFzKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoY3Vyc29yLnggKyB2YXJpLnggPj0gYXJlYS54ICYmIGN1cnNvci54ICsgdmFyaS54IDw9IGFyZWEueCArIGFyZWEudyBcblx0XHRcdFx0XHQmJiBjdXJzb3IueSArIHZhcmkueSA+PSBhcmVhLnkgJiYgY3Vyc29yLnkgKyB2YXJpLnkgPD0gYXJlYS55ICsgYXJlYS5oKVxuXHRcdFx0XHRyZXR1cm4gYXJlYTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRjb25uZWN0QXJlYTogZnVuY3Rpb24oYXJlYTEsIGFyZWEyLCBwb3NpdGlvbil7XG5cdFx0YXJlYTEuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWEyXG5cdFx0fSk7XG5cdFx0YXJlYTIuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWExXG5cdFx0fSk7XG5cdH1cbn0iLCJmdW5jdGlvbiBUaGlyZExldmVsR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBDQSA9IHJlcXVpcmUoJy4vQ0EnKTtcbnZhciBTcGxpdHRlciA9IHJlcXVpcmUoJy4vU3BsaXR0ZXInKTtcblxuVGhpcmRMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGZpbGxMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0dGhpcy5maWxsUm9vbXMoc2tldGNoLCBsZXZlbClcblx0XHR0aGlzLmZhdHRlbkNhdmVybnMobGV2ZWwpO1xuXHRcdHRoaXMucGxhY2VFeGl0cyhza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLnJhaXNlSXNsYW5kcyhsZXZlbCk7XG5cdFx0dGhpcy5lbmxhcmdlQnJpZGdlcyhsZXZlbCk7XG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRmYXR0ZW5DYXZlcm5zOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0Ly8gR3JvdyBjYXZlcm5zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddID4gMCAmJiBVdGlsLmNoYW5jZSgyMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXSA+IDEpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdC8vIEdyb3cgbGFnb29uIGFyZWFzXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDAgJiYgVXRpbC5jaGFuY2UoNDApKVxuXHRcdFx0XHRyZXR1cm4gJ2Zha2VXYXRlcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDApXG5cdFx0XHRcdHJldHVybiAnZmFrZVdhdGVyJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRcblx0XHRcblx0XHQvLyBFeHBhbmQgd2FsbC1sZXNzIHJvb21zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3NvbGlkUm9jaycpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMiAmJiBVdGlsLmNoYW5jZSgxMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzb2xpZFJvY2snKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10+MClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gRGV0ZXJpb3JhdGUgd2FsbCByb29tc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzdG9uZVdhbGwnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgVXRpbC5jaGFuY2UoNSkpXG5cdFx0XHRcdHJldHVybiAnc3RvbmVGbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0XG5cdH0sXG5cdGVubGFyZ2VCcmlkZ2VzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ2xhdmEnICYmIGN1cnJlbnQgIT0gJ3dhdGVyJyAmJiBjdXJyZW50ICE9ICdmYWtlV2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHQvKmlmIChzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXSA+IDAgfHwgc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDApXG5cdFx0XHRcdHJldHVybiBmYWxzZTsqL1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydicmlkZ2UnXSA+IDApXG5cdFx0XHRcdHJldHVybiAnYnJpZGdlJztcblx0XHR9LCAxLCB0cnVlKTtcblx0fSxcblx0cmFpc2VJc2xhbmRzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3dhdGVyJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIGNhdmVybnMgPSBzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXTsgXG5cdFx0XHRpZiAoY2F2ZXJucyA+IDAgJiYgVXRpbC5jaGFuY2UoNzApKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBJc2xhbmQgZm9yIGV4aXRzIG9uIHdhdGVyXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ2Zha2VXYXRlcicgJiYgY3VycmVudCAhPSAnd2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR2YXIgc3RhaXJzID0gc3Vycm91bmRpbmdbJ2Rvd25zdGFpcnMnXSA/IHN1cnJvdW5kaW5nWydkb3duc3RhaXJzJ10gOiAwICtcblx0XHRcdFx0XHRzdXJyb3VuZGluZ1sndXBzdGFpcnMnXSA/IHN1cnJvdW5kaW5nWyd1cHN0YWlycyddIDogMDsgXG5cdFx0XHRpZiAoc3RhaXJzID4gMClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSk7XG5cdH0sXG5cdGZpbGxSb29tczogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR2YXIgdHlwZSA9IGFyZWEuYXJlYVR5cGU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NhdmVybicpeyBcblx0XHRcdFx0dGhpcy5maWxsV2l0aENhdmVybihsZXZlbCwgYXJlYSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdyb29tcycpe1xuXHRcdFx0XHR0aGlzLmZpbGxXaXRoUm9vbXMobGV2ZWwsIGFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cGxhY2VFeGl0czogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHRpZiAoIWFyZWEuaGFzRXhpdCAmJiAhYXJlYS5oYXNFbnRyYW5jZSlcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR2YXIgdGlsZSA9IG51bGw7XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0dGlsZSA9ICdkb3duc3RhaXJzJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpbGUgPSAndXBzdGFpcnMnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyZWVTcG90ID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0aWYgKGZyZWVTcG90LnggPT0gMCB8fCBmcmVlU3BvdC55ID09IDAgfHwgZnJlZVNwb3QueCA9PSBsZXZlbC5jZWxscy5sZW5ndGggLSAxIHx8IGZyZWVTcG90LnkgPT0gbGV2ZWwuY2VsbHNbMF0ubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdGktLTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRsZXZlbC5jZWxsc1tmcmVlU3BvdC54XVtmcmVlU3BvdC55XSA9IHRpbGU7XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0bGV2ZWwuZW5kID0ge1xuXHRcdFx0XHRcdHg6IGZyZWVTcG90LngsXG5cdFx0XHRcdFx0eTogZnJlZVNwb3QueVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV2ZWwuc3RhcnQgPSB7XG5cdFx0XHRcdFx0eDogZnJlZVNwb3QueCxcblx0XHRcdFx0XHR5OiBmcmVlU3BvdC55XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmaWxsV2l0aENhdmVybjogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdC8vIENvbm5lY3QgYWxsIGJyaWRnZXMgd2l0aCBtaWRwb2ludFxuXHRcdHZhciBtaWRwb2ludCA9IHtcblx0XHRcdHg6IE1hdGgucm91bmQoVXRpbC5yYW5kKGFyZWEueCArIGFyZWEudyAqIDEvMywgYXJlYS54K2FyZWEudyAqIDIvMykpLFxuXHRcdFx0eTogTWF0aC5yb3VuZChVdGlsLnJhbmQoYXJlYS55ICsgYXJlYS5oICogMS8zLCBhcmVhLnkrYXJlYS5oICogMi8zKSlcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tpXTtcblx0XHRcdHZhciBsaW5lID0gVXRpbC5saW5lKG1pZHBvaW50LCBicmlkZ2UpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIHBvaW50ID0gbGluZVtqXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRDZWxsID0gbGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV07XG5cdFx0XHRcdGlmIChhcmVhLmNhdmVyblR5cGUgPT0gJ3JvY2t5Jylcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHRcdGVsc2UgaWYgKGN1cnJlbnRDZWxsID09ICd3YXRlcicgfHwgY3VycmVudENlbGwgPT0gJ2xhdmEnKXtcblx0XHRcdFx0XHRpZiAoYXJlYS5mbG9vciAhPSAnZmFrZVdhdGVyJyAmJiBhcmVhLmNhdmVyblR5cGUgPT0gJ2JyaWRnZXMnKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9ICdmYWtlV2F0ZXInO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBTY3JhdGNoIHRoZSBhcmVhXG5cdFx0dmFyIHNjcmF0Y2hlcyA9IFV0aWwucmFuZCgyLDQpO1xuXHRcdHZhciBjYXZlU2VnbWVudHMgPSBbXTtcblx0XHRjYXZlU2VnbWVudHMucHVzaChtaWRwb2ludCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzY3JhdGNoZXM7IGkrKyl7XG5cdFx0XHR2YXIgcDEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihjYXZlU2VnbWVudHMpO1xuXHRcdFx0aWYgKGNhdmVTZWdtZW50cy5sZW5ndGggPiAxKVxuXHRcdFx0XHRVdGlsLnJlbW92ZUZyb21BcnJheShjYXZlU2VnbWVudHMsIHAxKTtcblx0XHRcdHZhciBwMiA9IHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKGFyZWEueCwgYXJlYS54K2FyZWEudy0xKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKGFyZWEueSwgYXJlYS55K2FyZWEuaC0xKVxuXHRcdFx0fVxuXHRcdFx0Y2F2ZVNlZ21lbnRzLnB1c2gocDIpO1xuXHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUocDIsIHAxKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGluZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBwb2ludCA9IGxpbmVbal07XG5cdFx0XHRcdHZhciBjdXJyZW50Q2VsbCA9IGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldO1xuXHRcdFx0XHRpZiAoY3VycmVudENlbGwgIT0gJ3dhdGVyJyAmJiBjdXJyZW50Q2VsbCAhPSAnbGF2YScpICBcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmaWxsV2l0aFJvb21zOiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0dmFyIGJpZ0FyZWEgPSB7XG5cdFx0XHR4OiBhcmVhLngsXG5cdFx0XHR5OiBhcmVhLnksXG5cdFx0XHR3OiBhcmVhLncsXG5cdFx0XHRoOiBhcmVhLmhcblx0XHR9XG5cdFx0dmFyIG1heERlcHRoID0gMjtcblx0XHR2YXIgTUlOX1dJRFRIID0gNjtcblx0XHR2YXIgTUlOX0hFSUdIVCA9IDY7XG5cdFx0dmFyIE1BWF9XSURUSCA9IDEwO1xuXHRcdHZhciBNQVhfSEVJR0hUID0gMTA7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX1NUQVJUID0gMy84O1xuXHRcdHZhciBTTElDRV9SQU5HRV9FTkQgPSA1Lzg7XG5cdFx0dmFyIGFyZWFzID0gU3BsaXR0ZXIuc3ViZGl2aWRlQXJlYShiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQsIGFyZWEuYnJpZGdlcyk7XG5cdFx0U3BsaXR0ZXIuY29ubmVjdEFyZWFzKGFyZWFzLCBhcmVhLndhbGwgPyAyIDogMSk7IFxuXHRcdHZhciBicmlkZ2VBcmVhcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHN1YmFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tqXTtcblx0XHRcdFx0aWYgKFNwbGl0dGVyLmdldEFyZWFBdChicmlkZ2Use3g6MCx5OjB9LCBhcmVhcykgPT0gc3ViYXJlYSl7XG5cdFx0XHRcdFx0aWYgKCFVdGlsLmNvbnRhaW5zKGJyaWRnZUFyZWFzLCBzdWJhcmVhKSl7XG5cdFx0XHRcdFx0XHRicmlkZ2VBcmVhcy5wdXNoKHN1YmFyZWEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdWJhcmVhLmJyaWRnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBicmlkZ2UueCxcblx0XHRcdFx0XHRcdHk6IGJyaWRnZS55XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51c2VBcmVhcyhicmlkZ2VBcmVhcywgYXJlYXMsIGJpZ0FyZWEpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHN1YmFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmICghc3ViYXJlYS5yZW5kZXIpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0c3ViYXJlYS5mbG9vciA9IGFyZWEuZmxvb3I7XG5cdFx0XHRzdWJhcmVhLndhbGwgPSBhcmVhLndhbGw7XG5cdFx0XHRzdWJhcmVhLmNvcnJpZG9yID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdHRoaXMuY2FydmVSb29tQXQobGV2ZWwsIHN1YmFyZWEpO1xuXHRcdH1cblx0fSxcblx0Y2FydmVSb29tQXQ6IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHR2YXIgbWluYm94ID0ge1xuXHRcdFx0eDogYXJlYS54ICsgTWF0aC5mbG9vcihhcmVhLncgLyAyKS0xLFxuXHRcdFx0eTogYXJlYS55ICsgTWF0aC5mbG9vcihhcmVhLmggLyAyKS0xLFxuXHRcdFx0eDI6IGFyZWEueCArIE1hdGguZmxvb3IoYXJlYS53IC8gMikrMSxcblx0XHRcdHkyOiBhcmVhLnkgKyBNYXRoLmZsb29yKGFyZWEuaCAvIDIpKzEsXG5cdFx0fTtcblx0XHQvLyBUcmFjZSBjb3JyaWRvcnMgZnJvbSBleGl0c1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbaV07XG5cdFx0XHR2YXIgdmVydGljYWxCcmlkZ2UgPSBmYWxzZTtcblx0XHRcdHZhciBob3Jpem9udGFsQnJpZGdlID0gZmFsc2U7XG5cdFx0XHRpZiAoYnJpZGdlLnggPT0gYXJlYS54KXtcblx0XHRcdFx0Ly8gTGVmdCBDb3JyaWRvclxuXHRcdFx0XHRob3Jpem9udGFsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS54OyBqIDwgYnJpZGdlLnggKyBhcmVhLncgLyAyOyBqKyspe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYnJpZGdlLnggPT0gYXJlYS54ICsgYXJlYS53KXtcblx0XHRcdFx0Ly8gUmlnaHQgY29ycmlkb3Jcblx0XHRcdFx0aG9yaXpvbnRhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueDsgaiA+PSBicmlkZ2UueCAtIGFyZWEudyAvIDI7IGotLSl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGJyaWRnZS55ID09IGFyZWEueSl7XG5cdFx0XHRcdC8vIFRvcCBjb3JyaWRvclxuXHRcdFx0XHR2ZXJ0aWNhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueTsgaiA8IGJyaWRnZS55ICsgYXJlYS5oIC8gMjsgaisrKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIERvd24gQ29ycmlkb3Jcblx0XHRcdFx0dmVydGljYWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLnk7IGogPj0gYnJpZGdlLnkgLSBhcmVhLmggLyAyOyBqLS0pe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdID0gYXJlYS53YWxsOyBcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh2ZXJ0aWNhbEJyaWRnZSl7XG5cdFx0XHRcdGlmIChicmlkZ2UueCA8IG1pbmJveC54KVxuXHRcdFx0XHRcdG1pbmJveC54ID0gYnJpZGdlLng7XG5cdFx0XHRcdGlmIChicmlkZ2UueCA+IG1pbmJveC54Milcblx0XHRcdFx0XHRtaW5ib3gueDIgPSBicmlkZ2UueDtcblx0XHRcdH1cblx0XHRcdGlmIChob3Jpem9udGFsQnJpZGdlKXtcblx0XHRcdFx0aWYgKGJyaWRnZS55IDwgbWluYm94LnkpXG5cdFx0XHRcdFx0bWluYm94LnkgPSBicmlkZ2UueTtcblx0XHRcdFx0aWYgKGJyaWRnZS55ID4gbWluYm94LnkyKVxuXHRcdFx0XHRcdG1pbmJveC55MiA9IGJyaWRnZS55O1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgbWluUGFkZGluZyA9IDA7XG5cdFx0aWYgKGFyZWEud2FsbClcblx0XHRcdG1pblBhZGRpbmcgPSAxO1xuXHRcdHZhciBwYWRkaW5nID0ge1xuXHRcdFx0dG9wOiBVdGlsLnJhbmQobWluUGFkZGluZywgbWluYm94LnkgLSBhcmVhLnkgLSBtaW5QYWRkaW5nKSxcblx0XHRcdGJvdHRvbTogVXRpbC5yYW5kKG1pblBhZGRpbmcsIGFyZWEueSArIGFyZWEuaCAtIG1pbmJveC55MiAtIG1pblBhZGRpbmcpLFxuXHRcdFx0bGVmdDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIG1pbmJveC54IC0gYXJlYS54IC0gbWluUGFkZGluZyksXG5cdFx0XHRyaWdodDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIGFyZWEueCArIGFyZWEudyAtIG1pbmJveC54MiAtIG1pblBhZGRpbmcpXG5cdFx0fTtcblx0XHRpZiAocGFkZGluZy50b3AgPCAwKSBwYWRkaW5nLnRvcCA9IDA7XG5cdFx0aWYgKHBhZGRpbmcuYm90dG9tIDwgMCkgcGFkZGluZy5ib3R0b20gPSAwO1xuXHRcdGlmIChwYWRkaW5nLmxlZnQgPCAwKSBwYWRkaW5nLmxlZnQgPSAwO1xuXHRcdGlmIChwYWRkaW5nLnJpZ2h0IDwgMCkgcGFkZGluZy5yaWdodCA9IDA7XG5cdFx0dmFyIHJvb214ID0gYXJlYS54O1xuXHRcdHZhciByb29teSA9IGFyZWEueTtcblx0XHR2YXIgcm9vbXcgPSBhcmVhLnc7XG5cdFx0dmFyIHJvb21oID0gYXJlYS5oO1xuXHRcdGZvciAodmFyIHggPSByb29teDsgeCA8IHJvb214ICsgcm9vbXc7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gcm9vbXk7IHkgPCByb29teSArIHJvb21oOyB5Kyspe1xuXHRcdFx0XHR2YXIgZHJhd1dhbGwgPSBhcmVhLndhbGwgJiYgbGV2ZWwuY2VsbHNbeF1beV0gIT0gYXJlYS5jb3JyaWRvciAmJiBsZXZlbC5jZWxsc1t4XVt5XSAhPSAnYnJpZGdlJzsgXG5cdFx0XHRcdGlmICh5IDwgcm9vbXkgKyBwYWRkaW5nLnRvcCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHkgPT0gcm9vbXkgKyBwYWRkaW5nLnRvcCAtIDEgJiYgeCArIDEgPj0gcm9vbXggKyBwYWRkaW5nLmxlZnQgJiYgeCA8PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodClcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA8IHJvb214ICsgcGFkZGluZy5sZWZ0KXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeCA9PSByb29teCArIHBhZGRpbmcubGVmdCAtIDEgJiYgeSA+PSByb29teSArIHBhZGRpbmcudG9wICYmIHkgPD0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh5ID4gcm9vbXkgKyByb29taCAtIDEgLSBwYWRkaW5nLmJvdHRvbSl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHkgPT0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tICYmIHggKyAxID49IHJvb214ICsgcGFkZGluZy5sZWZ0ICYmIHggPD0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHggPiByb29teCArIHJvb213IC0gMSAtIHBhZGRpbmcucmlnaHQpe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB4ID09IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0ICYmIHkgPj0gcm9vbXkgKyBwYWRkaW5nLnRvcCAmJiB5IDw9IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSlcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYXJlYS5tYXJrZWQpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHR9LFxuXHR1c2VBcmVhczogZnVuY3Rpb24oa2VlcEFyZWFzLCBhcmVhcywgYmlnQXJlYSl7XG5cdFx0Ly8gQWxsIGtlZXAgYXJlYXMgc2hvdWxkIGJlIGNvbm5lY3RlZCB3aXRoIGEgc2luZ2xlIHBpdm90IGFyZWFcblx0XHR2YXIgcGl2b3RBcmVhID0gU3BsaXR0ZXIuZ2V0QXJlYUF0KHt4OiBNYXRoLnJvdW5kKGJpZ0FyZWEueCArIGJpZ0FyZWEudy8yKSwgeTogTWF0aC5yb3VuZChiaWdBcmVhLnkgKyBiaWdBcmVhLmgvMil9LHt4OjAseTowfSwgYXJlYXMpO1xuXHRcdHZhciBwYXRoQXJlYXMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtlZXBBcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIga2VlcEFyZWEgPSBrZWVwQXJlYXNbaV07XG5cdFx0XHRrZWVwQXJlYS5yZW5kZXIgPSB0cnVlO1xuXHRcdFx0dmFyIGFyZWFzUGF0aCA9IHRoaXMuZ2V0RHJ1bmtlbkFyZWFzUGF0aChrZWVwQXJlYSwgcGl2b3RBcmVhLCBhcmVhcyk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGFyZWFzUGF0aC5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdGFyZWFzUGF0aFtqXS5yZW5kZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoIWFyZWEucmVuZGVyKXtcblx0XHRcdFx0YnJpZGdlc1JlbW92ZTogZm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbal07XG5cdFx0XHRcdFx0aWYgKCFicmlkZ2UudG8pXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGJyaWRnZS50by5icmlkZ2VzLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHRcdHZhciBzb3VyY2VCcmlkZ2UgPSBicmlkZ2UudG8uYnJpZGdlc1trXTtcblx0XHRcdFx0XHRcdGlmIChzb3VyY2VCcmlkZ2UueCA9PSBicmlkZ2UueCAmJiBzb3VyY2VCcmlkZ2UueSA9PSBicmlkZ2UueSl7XG5cdFx0XHRcdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KGJyaWRnZS50by5icmlkZ2VzLCBzb3VyY2VCcmlkZ2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2V0RHJ1bmtlbkFyZWFzUGF0aDogZnVuY3Rpb24gKGZyb21BcmVhLCB0b0FyZWEsIGFyZWFzKXtcblx0XHR2YXIgY3VycmVudEFyZWEgPSBmcm9tQXJlYTtcblx0XHR2YXIgcGF0aCA9IFtdO1xuXHRcdHBhdGgucHVzaChmcm9tQXJlYSk7XG5cdFx0cGF0aC5wdXNoKHRvQXJlYSk7XG5cdFx0aWYgKGZyb21BcmVhID09IHRvQXJlYSlcblx0XHRcdHJldHVybiBwYXRoO1xuXHRcdHdoaWxlICh0cnVlKXtcblx0XHRcdHZhciByYW5kb21CcmlkZ2UgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihjdXJyZW50QXJlYS5icmlkZ2VzKTtcblx0XHRcdGlmICghcmFuZG9tQnJpZGdlLnRvKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdGlmICghVXRpbC5jb250YWlucyhwYXRoLCByYW5kb21CcmlkZ2UudG8pKXtcblx0XHRcdFx0cGF0aC5wdXNoKHJhbmRvbUJyaWRnZS50byk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmFuZG9tQnJpZGdlLnRvID09IHRvQXJlYSlcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjdXJyZW50QXJlYSA9IHJhbmRvbUJyaWRnZS50bztcblx0XHR9XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGhpcmRMZXZlbEdlbmVyYXRvcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0cmFuZDogZnVuY3Rpb24gKGxvdywgaGkpe1xuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaGkgLSBsb3cgKyAxKSkrbG93O1xuXHR9LFxuXHRyYW5kb21FbGVtZW50T2Y6IGZ1bmN0aW9uIChhcnJheSl7XG5cdFx0cmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSphcnJheS5sZW5ndGgpXTtcblx0fSxcblx0ZGlzdGFuY2U6IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLnNxcnQoKHgyLXgxKSooeDIteDEpICsgKHkyLXkxKSooeTIteTEpKTtcblx0fSxcblx0ZmxhdERpc3RhbmNlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mil7XG5cdFx0dmFyIHhEaXN0ID0gTWF0aC5hYnMoeDEgLSB4Mik7XG5cdFx0dmFyIHlEaXN0ID0gTWF0aC5hYnMoeTEgLSB5Mik7XG5cdFx0aWYgKHhEaXN0ID09PSB5RGlzdClcblx0XHRcdHJldHVybiB4RGlzdDtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4geERpc3QgKyB5RGlzdDtcblx0fSxcblx0bGluZURpc3RhbmNlOiBmdW5jdGlvbihwb2ludDEsIHBvaW50Mil7XG5cdCAgdmFyIHhzID0gMDtcblx0ICB2YXIgeXMgPSAwO1xuXHQgIHhzID0gcG9pbnQyLnggLSBwb2ludDEueDtcblx0ICB4cyA9IHhzICogeHM7XG5cdCAgeXMgPSBwb2ludDIueSAtIHBvaW50MS55O1xuXHQgIHlzID0geXMgKiB5cztcblx0ICByZXR1cm4gTWF0aC5zcXJ0KCB4cyArIHlzICk7XG5cdH0sXG5cdGRpcmVjdGlvbjogZnVuY3Rpb24gKGEsYil7XG5cdFx0cmV0dXJuIHt4OiBzaWduKGIueCAtIGEueCksIHk6IHNpZ24oYi55IC0gYS55KX07XG5cdH0sXG5cdGNoYW5jZTogZnVuY3Rpb24gKGNoYW5jZSl7XG5cdFx0cmV0dXJuIHRoaXMucmFuZCgwLDEwMCkgPD0gY2hhbmNlO1xuXHR9LFxuXHRjb250YWluczogZnVuY3Rpb24oYXJyYXksIGVsZW1lbnQpe1xuXHQgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoZWxlbWVudCkgPiAtMTtcblx0fSxcblx0cmVtb3ZlRnJvbUFycmF5OiBmdW5jdGlvbihhcnJheSwgb2JqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiAoYXJyYXlbaV0gPT0gb2JqZWN0KXtcblx0XHRcdFx0dGhpcy5yZW1vdmVGcm9tQXJyYXlJbmRleChhcnJheSwgaSxpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cmVtb3ZlRnJvbUFycmF5SW5kZXg6IGZ1bmN0aW9uKGFycmF5LCBmcm9tLCB0bykge1xuXHRcdHZhciByZXN0ID0gYXJyYXkuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCBhcnJheS5sZW5ndGgpO1xuXHRcdGFycmF5Lmxlbmd0aCA9IGZyb20gPCAwID8gYXJyYXkubGVuZ3RoICsgZnJvbSA6IGZyb207XG5cdFx0cmV0dXJuIGFycmF5LnB1c2guYXBwbHkoYXJyYXksIHJlc3QpO1xuXHR9LFxuXHRsaW5lOiBmdW5jdGlvbiAoYSwgYil7XG5cdFx0dmFyIGNvb3JkaW5hdGVzQXJyYXkgPSBuZXcgQXJyYXkoKTtcblx0XHR2YXIgeDEgPSBhLng7XG5cdFx0dmFyIHkxID0gYS55O1xuXHRcdHZhciB4MiA9IGIueDtcblx0XHR2YXIgeTIgPSBiLnk7XG5cdCAgICB2YXIgZHggPSBNYXRoLmFicyh4MiAtIHgxKTtcblx0ICAgIHZhciBkeSA9IE1hdGguYWJzKHkyIC0geTEpO1xuXHQgICAgdmFyIHN4ID0gKHgxIDwgeDIpID8gMSA6IC0xO1xuXHQgICAgdmFyIHN5ID0gKHkxIDwgeTIpID8gMSA6IC0xO1xuXHQgICAgdmFyIGVyciA9IGR4IC0gZHk7XG5cdCAgICBjb29yZGluYXRlc0FycmF5LnB1c2goe3g6IHgxLCB5OiB5MX0pO1xuXHQgICAgd2hpbGUgKCEoKHgxID09IHgyKSAmJiAoeTEgPT0geTIpKSkge1xuXHQgICAgXHR2YXIgZTIgPSBlcnIgPDwgMTtcblx0ICAgIFx0aWYgKGUyID4gLWR5KSB7XG5cdCAgICBcdFx0ZXJyIC09IGR5O1xuXHQgICAgXHRcdHgxICs9IHN4O1xuXHQgICAgXHR9XG5cdCAgICBcdGlmIChlMiA8IGR4KSB7XG5cdCAgICBcdFx0ZXJyICs9IGR4O1xuXHQgICAgXHRcdHkxICs9IHN5O1xuXHQgICAgXHR9XG5cdCAgICBcdGNvb3JkaW5hdGVzQXJyYXkucHVzaCh7eDogeDEsIHk6IHkxfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29vcmRpbmF0ZXNBcnJheTtcblx0fVxufSIsIndpbmRvdy5HZW5lcmF0b3IgPSByZXF1aXJlKCcuL0dlbmVyYXRvci5jbGFzcycpO1xud2luZG93LkNhbnZhc1JlbmRlcmVyID0gcmVxdWlyZSgnLi9DYW52YXNSZW5kZXJlci5jbGFzcycpO1xud2luZG93LktyYW1naW5lRXhwb3J0ZXIgPSByZXF1aXJlKCcuL0tyYW1naW5lRXhwb3J0ZXIuY2xhc3MnKTsiXX0=
