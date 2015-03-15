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
			{boss: 'daemon', minions: ['firelizard'], quantity: 5},
			{minions: ['firelizard'], quantity: 10},
			{boss: 'hydra', minions: ['firelizard'], quantity: 5}
		],
		[ // Level 2
			{boss: 'daemon', minions: ['seaSerpent', 'octopus', 'nixie'], quantity: 5},
			{boss: 'hydra', minions: ['seaSerpent', 'octopus', 'nixie'], quantity: 5},
			{boss: 'balron', minions: ['seaSerpent', 'octopus', 'nixie'], quantity: 5},
			{minions: ['seaSerpent'], quantity: 10},
			{minions: ['nixie'], quantity: 10}
		],
		[ // Level 3
			{minions: ['daemon'], quantity: 10},
			{boss: 'balron', minions: ['daemon'], quantity: 3},
		],
		[ // Level 4
			{boss: 'gazer', minions: ['headless'], quantity: 5},
			{boss: 'liche', minions: ['ghost'], quantity: 5},
			{boss: 'daemon', minions: ['gazer', 'gremlin'], quantity: 5},
		],
		[ // Level 5
			{minions: ['dragon', 'zorn', 'balron'], quantity: 6},
			{minions: ['reaper', 'gazer', 'phantom'], quantity: 6},
			{boss: 'balron', minions: ['headless'], quantity: 10},
			{boss: 'zorn', minions: ['headless'], quantity: 10},
			{minions: ['dragon', 'lavaLizard'], quantity: 10},
		],
		[ // Level 6
			{minions: ['reaper'], quantity: 6},
			{boss: 'balron', minions: ['daemon'], quantity: 6},
			{areaType: 'cave', minions: ['bat'], quantity: 15},
			{areaType: 'cave', boss: 'twister', minions: ['seaSerpent'], quantity: 5},
			{boss: 'balron', minions: ['hydra'], quantity: 10},
			{boss: 'balron', minions: ['mage'], quantity: 10}
		],
		[ // Level 7
			{minions: ['headless'], quantity: 20},
			{minions: ['hydra'], quantity: 6},
			{minions: ['skeleton', 'wisp', 'ghost'], quantity: 15},
			{boss: 'balron', minions: ['skeleton'], quantity: 20}
		],
		[ // Level 8
			{minions: ['dragon', 'daemon', 'balron'], quantity: 10},
			{minions: ['warrior', 'mage', 'bard', 'druid', 'tinker', 'paladin', 'shepherd', 'ranger'], quantity: 15},
			{minions: ['gazer', 'balron'], quantity: 10},
			{boss: 'liche', minions: ['skeleton'], quantity: 20},
			{minions: ['ghost', 'wisp'], quantity: 20},
			{minions: ['lavaLizards'], quantity: 20}
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
			var position = level.getFreePlace(area);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJ1bkNBOiBmdW5jdGlvbihtYXAsIHRyYW5zZm9ybUZ1bmN0aW9uLCB0aW1lcywgY3Jvc3Mpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKyl7XG5cdFx0XHR2YXIgbmV3TWFwID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKyl7XG5cdFx0XHRcdG5ld01hcFt4XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4Kyspe1xuXHRcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKyl7XG5cdFx0XHRcdFx0dmFyIHN1cnJvdW5kaW5nTWFwID0gW107XG5cdFx0XHRcdFx0Zm9yICh2YXIgeHggPSB4LTE7IHh4IDw9IHgrMTsgeHgrKyl7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciB5eSA9IHktMTsgeXkgPD0geSsxOyB5eSsrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGNyb3NzICYmICEoeHggPT0geCB8fCB5eSA9PSB5KSlcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0aWYgKHh4ID4gMCAmJiB4eCA8IG1hcC5sZW5ndGggJiYgeXkgPiAwICYmIHl5IDwgbWFwW3hdLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNlbGwgPSBtYXBbeHhdW3l5XTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc3Vycm91bmRpbmdNYXBbY2VsbF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRzdXJyb3VuZGluZ01hcFtjZWxsXSsrO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHN1cnJvdW5kaW5nTWFwW2NlbGxdID0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbmV3Q2VsbCA9IHRyYW5zZm9ybUZ1bmN0aW9uKG1hcFt4XVt5XSwgc3Vycm91bmRpbmdNYXApO1xuXHRcdFx0XHRcdGlmIChuZXdDZWxsKXtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG5ld0NlbGw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG1hcFt4XVt5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1hcCA9IG5ld01hcDtcblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufSIsImZ1bmN0aW9uIENhbnZhc1JlbmRlcmVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUgPSB7XG5cdGRyYXdTa2V0Y2g6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMsIG92ZXJsYXkpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTZweCBBdmF0YXJcIjtcblx0XHRpZiAoIW92ZXJsYXkpXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gbGV2ZWwuYXJlYXNbaV07XG5cdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y29udGV4dC5yZWN0KGFyZWEueCAqIHpvb20sIGFyZWEueSAqIHpvb20sIGFyZWEudyAqIHpvb20sIGFyZWEuaCAqIHpvb20pO1xuXHRcdFx0aWYgKCFvdmVybGF5KXtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAneWVsbG93Jztcblx0XHRcdFx0Y29udGV4dC5maWxsKCk7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR2YXIgYXJlYURlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHRpZiAoYXJlYS5hcmVhVHlwZSA9PSAncm9vbXMnKXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJEdW5nZW9uXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZWEuZmxvb3IgPT0gJ2Zha2VXYXRlcicpeyBcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJMYWdvb25cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiQ2F2ZXJuXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uICs9IFwiIChkKVwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWEuaGFzRW50cmFuY2Upe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gKz0gXCIgKHUpXCI7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRjb250ZXh0LmZpbGxUZXh0KGFyZWFEZXNjcmlwdGlvbiwoYXJlYS54KSogem9vbSArIDUsKGFyZWEueSApKiB6b29tICsgMjApO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjb250ZXh0LnJlY3QoKGJyaWRnZS54KSAqIHpvb20gLyotIHpvb20gLyAyKi8sIChicmlkZ2UueSkgKiB6b29tIC8qLSB6b29tIC8gMiovLCB6b29tLCB6b29tKTtcblx0XHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG5cdFx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRkcmF3TGV2ZWw6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTJweCBHZW9yZ2lhXCI7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0dmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07XG5cdFx0XHRcdGlmIChjZWxsID09PSAnd2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNTk0QjJEJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjYXZlcm5GbG9vcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM4NzY0MTgnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMEZGMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lV2FsbCcpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNCQkJCQkInO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lRmxvb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNjY2NjY2Jztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3BhZGRpbmcnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDBGRjAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjOTQ2ODAwJztcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KHggKiB6b29tLCB5ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0c3dpdGNoIChlbmVteS5jb2RlKXtcblx0XHRcdGNhc2UgJ2JhdCc6XG5cdFx0XHRcdGNvbG9yID0gJyNFRUVFRUUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xhdmFMaXphcmQnOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdkYWVtb24nOlxuXHRcdFx0XHRjb2xvciA9ICcjRkY4ODAwJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChlbmVteS54ICogem9vbSwgZW5lbXkueSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRzd2l0Y2ggKGl0ZW0uY29kZSl7XG5cdFx0XHRjYXNlICdkYWdnZXInOlxuXHRcdFx0XHRjb2xvciA9ICcjRUVFRUVFJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsZWF0aGVyQXJtb3InOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChpdGVtLnggKiB6b29tLCBpdGVtLnkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHR9XG5cdH0sXG5cdGRyYXdMZXZlbFdpdGhJY29uczogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcyl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxMnB4IEdlb3JnaWFcIjtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHR2YXIgd2F0ZXIgPSBuZXcgSW1hZ2UoKTtcblx0XHR3YXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIGZha2VXYXRlciA9IG5ldyBJbWFnZSgpO1xuXHRcdGZha2VXYXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIHNvbGlkUm9jayA9IG5ldyBJbWFnZSgpO1xuXHRcdHNvbGlkUm9jay5zcmMgPSAnaW1nL3NvbGlkUm9jay5wbmcnO1xuXHRcdHZhciBjYXZlcm5GbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdGNhdmVybkZsb29yLnNyYyA9ICdpbWcvY2F2ZXJuRmxvb3IucG5nJztcblx0XHR2YXIgZG93bnN0YWlycyA9IG5ldyBJbWFnZSgpO1xuXHRcdGRvd25zdGFpcnMuc3JjID0gJ2ltZy9kb3duc3RhaXJzLnBuZyc7XG5cdFx0dmFyIHVwc3RhaXJzID0gbmV3IEltYWdlKCk7XG5cdFx0dXBzdGFpcnMuc3JjID0gJ2ltZy91cHN0YWlycy5wbmcnO1xuXHRcdHZhciBzdG9uZVdhbGwgPSBuZXcgSW1hZ2UoKTtcblx0XHRzdG9uZVdhbGwuc3JjID0gJ2ltZy9zdG9uZVdhbGwucG5nJztcblx0XHR2YXIgc3RvbmVGbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdHN0b25lRmxvb3Iuc3JjID0gJ2ltZy9zdG9uZUZsb29yLnBuZyc7XG5cdFx0dmFyIGJyaWRnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGJyaWRnZS5zcmMgPSAnaW1nL2JyaWRnZS5wbmcnO1xuXHRcdHZhciBsYXZhID0gbmV3IEltYWdlKCk7XG5cdFx0bGF2YS5zcmMgPSAnaW1nL2xhdmEucG5nJztcblx0XHR2YXIgYmF0ID0gbmV3IEltYWdlKCk7XG5cdFx0YmF0LnNyYyA9ICdpbWcvYmF0LnBuZyc7XG5cdFx0dmFyIGxhdmFMaXphcmQgPSBuZXcgSW1hZ2UoKTtcblx0XHRsYXZhTGl6YXJkLnNyYyA9ICdpbWcvbGF2YUxpemFyZC5wbmcnO1xuXHRcdHZhciBkYWVtb24gPSBuZXcgSW1hZ2UoKTtcblx0XHRkYWVtb24uc3JjID0gJ2ltZy9kYWVtb24ucG5nJztcblx0XHR2YXIgdHJlYXN1cmUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVhc3VyZS5zcmMgPSAnaW1nL3RyZWFzdXJlLnBuZyc7XG5cdFx0dmFyIHRpbGVzID0ge1xuXHRcdFx0d2F0ZXI6IHdhdGVyLFxuXHRcdFx0ZmFrZVdhdGVyOiBmYWtlV2F0ZXIsXG5cdFx0XHRzb2xpZFJvY2s6IHNvbGlkUm9jayxcblx0XHRcdGNhdmVybkZsb29yOiBjYXZlcm5GbG9vcixcblx0XHRcdGRvd25zdGFpcnM6IGRvd25zdGFpcnMsXG5cdFx0XHR1cHN0YWlyczogdXBzdGFpcnMsXG5cdFx0XHRzdG9uZVdhbGw6IHN0b25lV2FsbCxcblx0XHRcdHN0b25lRmxvb3I6IHN0b25lRmxvb3IsXG5cdFx0XHRicmlkZ2U6IGJyaWRnZSxcblx0XHRcdGxhdmE6IGxhdmEsXG5cdFx0XHRiYXQ6IGJhdCxcblx0XHRcdGxhdmFMaXphcmQ6IGxhdmFMaXphcmQsXG5cdFx0XHRkYWVtb246IGRhZW1vbixcblx0XHRcdHRyZWFzdXJlOiB0cmVhc3VyZVxuXHRcdH1cblx0ICAgIHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTsgXG5cdFx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzW2NlbGxdLCB4ICogMTYsIHkgKiAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbZW5lbXkuY29kZV0sIGVuZW15LnggKiAxNiwgZW5lbXkueSAqIDE2KTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbJ3RyZWFzdXJlJ10sIGl0ZW0ueCAqIDE2LCBpdGVtLnkgKiAxNik7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzUmVuZGVyZXI7IiwiZnVuY3Rpb24gRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU3BsaXR0ZXIgPSByZXF1aXJlKCcuL1NwbGl0dGVyJyk7XG5cbkZpcnN0TGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRMQVZBX0NIQU5DRTogICAgIFsxMDAsICAwLCAyMCwgIDAsMTAwLCAxMCwgNTAsMTAwXSxcblx0V0FURVJfQ0hBTkNFOiAgICBbICAwLDEwMCwgMTAsMTAwLCAgMCwgNTAsICAwLCAgMF0sXG5cdENBVkVSTl9DSEFOQ0U6ICAgWyA4MCwgODAsIDIwLCAyMCwgNjAsIDkwLCAxMCwgNTBdLFxuXHRMQUdPT05fQ0hBTkNFOiAgIFsgIDAsIDUwLCAxMCwgMjAsICAwLCAzMCwgIDAsICAwXSxcblx0V0FMTExFU1NfQ0hBTkNFOiBbIDUwLCAxMCwgODAsIDkwLCAxMCwgOTAsIDEwLCA1MF0sXG5cdEhFSUdIVDogICAgICAgICAgWyAgMSwgIDIsICAxLCAgMSwgIDEsICAyLCAgMiwgIDNdLFxuXHRHQU5HUzogW1xuXHRcdFsgLy8gTGV2ZWwgMVxuXHRcdFx0e2Jvc3M6ICdkYWVtb24nLCBtaW5pb25zOiBbJ2ZpcmVsaXphcmQnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e21pbmlvbnM6IFsnZmlyZWxpemFyZCddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e2Jvc3M6ICdoeWRyYScsIG1pbmlvbnM6IFsnZmlyZWxpemFyZCddLCBxdWFudGl0eTogNX1cblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgMlxuXHRcdFx0e2Jvc3M6ICdkYWVtb24nLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnLCAnb2N0b3B1cycsICduaXhpZSddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2h5ZHJhJywgbWluaW9uczogWydzZWFTZXJwZW50JywgJ29jdG9wdXMnLCAnbml4aWUnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnLCAnb2N0b3B1cycsICduaXhpZSddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7bWluaW9uczogWydzZWFTZXJwZW50J10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7bWluaW9uczogWyduaXhpZSddLCBxdWFudGl0eTogMTB9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDNcblx0XHRcdHttaW5pb25zOiBbJ2RhZW1vbiddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2RhZW1vbiddLCBxdWFudGl0eTogM30sXG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDRcblx0XHRcdHtib3NzOiAnZ2F6ZXInLCBtaW5pb25zOiBbJ2hlYWRsZXNzJ10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHtib3NzOiAnbGljaGUnLCBtaW5pb25zOiBbJ2dob3N0J10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHtib3NzOiAnZGFlbW9uJywgbWluaW9uczogWydnYXplcicsICdncmVtbGluJ10sIHF1YW50aXR5OiA1fSxcblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgNVxuXHRcdFx0e21pbmlvbnM6IFsnZHJhZ29uJywgJ3pvcm4nLCAnYmFscm9uJ10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHttaW5pb25zOiBbJ3JlYXBlcicsICdnYXplcicsICdwaGFudG9tJ10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e2Jvc3M6ICd6b3JuJywgbWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e21pbmlvbnM6IFsnZHJhZ29uJywgJ2xhdmFMaXphcmQnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgNlxuXHRcdFx0e21pbmlvbnM6IFsncmVhcGVyJ10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydkYWVtb24nXSwgcXVhbnRpdHk6IDZ9LFxuXHRcdFx0e2FyZWFUeXBlOiAnY2F2ZScsIG1pbmlvbnM6IFsnYmF0J10sIHF1YW50aXR5OiAxNX0sXG5cdFx0XHR7YXJlYVR5cGU6ICdjYXZlJywgYm9zczogJ3R3aXN0ZXInLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2h5ZHJhJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnbWFnZSddLCBxdWFudGl0eTogMTB9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDdcblx0XHRcdHttaW5pb25zOiBbJ2hlYWRsZXNzJ10sIHF1YW50aXR5OiAyMH0sXG5cdFx0XHR7bWluaW9uczogWydoeWRyYSddLCBxdWFudGl0eTogNn0sXG5cdFx0XHR7bWluaW9uczogWydza2VsZXRvbicsICd3aXNwJywgJ2dob3N0J10sIHF1YW50aXR5OiAxNX0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnc2tlbGV0b24nXSwgcXVhbnRpdHk6IDIwfVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA4XG5cdFx0XHR7bWluaW9uczogWydkcmFnb24nLCAnZGFlbW9uJywgJ2JhbHJvbiddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e21pbmlvbnM6IFsnd2FycmlvcicsICdtYWdlJywgJ2JhcmQnLCAnZHJ1aWQnLCAndGlua2VyJywgJ3BhbGFkaW4nLCAnc2hlcGhlcmQnLCAncmFuZ2VyJ10sIHF1YW50aXR5OiAxNX0sXG5cdFx0XHR7bWluaW9uczogWydnYXplcicsICdiYWxyb24nXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHtib3NzOiAnbGljaGUnLCBtaW5pb25zOiBbJ3NrZWxldG9uJ10sIHF1YW50aXR5OiAyMH0sXG5cdFx0XHR7bWluaW9uczogWydnaG9zdCcsICd3aXNwJ10sIHF1YW50aXR5OiAyMH0sXG5cdFx0XHR7bWluaW9uczogWydsYXZhTGl6YXJkcyddLCBxdWFudGl0eTogMjB9XG5cdFx0XVx0XHRcblx0XSxcblxuXHRcblx0Z2VuZXJhdGVMZXZlbDogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHZhciBoYXNSaXZlciA9IFV0aWwuY2hhbmNlKHRoaXMuV0FURVJfQ0hBTkNFW2RlcHRoLTFdKTtcblx0XHR2YXIgaGFzTGF2YSA9IFV0aWwuY2hhbmNlKHRoaXMuTEFWQV9DSEFOQ0VbZGVwdGgtMV0pO1xuXHRcdHZhciBtYWluRW50cmFuY2UgPSBkZXB0aCA9PSAxO1xuXHRcdHZhciBhcmVhcyA9IHRoaXMuZ2VuZXJhdGVBcmVhcyhkZXB0aCwgaGFzTGF2YSk7XG5cdFx0dGhpcy5wbGFjZUV4aXRzKGFyZWFzKTtcblx0XHR2YXIgbGV2ZWwgPSB7XG5cdFx0XHRoYXNSaXZlcnM6IGhhc1JpdmVyLFxuXHRcdFx0aGFzTGF2YTogaGFzTGF2YSxcblx0XHRcdG1haW5FbnRyYW5jZTogbWFpbkVudHJhbmNlLFxuXHRcdFx0c3RyYXRhOiAnc29saWRSb2NrJyxcblx0XHRcdGFyZWFzOiBhcmVhcyxcblx0XHRcdGRlcHRoOiBkZXB0aCxcblx0XHRcdGNlaWxpbmdIZWlnaHQ6IHRoaXMuSEVJR0hUW2RlcHRoLTFdXG5cdFx0fSBcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGdlbmVyYXRlQXJlYXM6IGZ1bmN0aW9uKGRlcHRoLCBoYXNMYXZhKXtcblx0XHR2YXIgYmlnQXJlYSA9IHtcblx0XHRcdHg6IDAsXG5cdFx0XHR5OiAwLFxuXHRcdFx0dzogdGhpcy5jb25maWcuTEVWRUxfV0lEVEgsXG5cdFx0XHRoOiB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFRcblx0XHR9XG5cdFx0dmFyIG1heERlcHRoID0gdGhpcy5jb25maWcuU1VCRElWSVNJT05fREVQVEg7XG5cdFx0dmFyIE1JTl9XSURUSCA9IHRoaXMuY29uZmlnLk1JTl9XSURUSDtcblx0XHR2YXIgTUlOX0hFSUdIVCA9IHRoaXMuY29uZmlnLk1JTl9IRUlHSFQ7XG5cdFx0dmFyIE1BWF9XSURUSCA9IHRoaXMuY29uZmlnLk1BWF9XSURUSDtcblx0XHR2YXIgTUFYX0hFSUdIVCA9IHRoaXMuY29uZmlnLk1BWF9IRUlHSFQ7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX1NUQVJUID0gdGhpcy5jb25maWcuU0xJQ0VfUkFOR0VfU1RBUlQ7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX0VORCA9IHRoaXMuY29uZmlnLlNMSUNFX1JBTkdFX0VORDtcblx0XHR2YXIgYXJlYXMgPSBTcGxpdHRlci5zdWJkaXZpZGVBcmVhKGJpZ0FyZWEsIG1heERlcHRoLCBNSU5fV0lEVEgsIE1JTl9IRUlHSFQsIE1BWF9XSURUSCwgTUFYX0hFSUdIVCwgU0xJQ0VfUkFOR0VfU1RBUlQsIFNMSUNFX1JBTkdFX0VORCk7XG5cdFx0U3BsaXR0ZXIuY29ubmVjdEFyZWFzKGFyZWFzLDMpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdHRoaXMuc2V0QXJlYURldGFpbHMoYXJlYSwgZGVwdGgsIGhhc0xhdmEpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJlYXM7XG5cdH0sXG5cdHNldEFyZWFEZXRhaWxzOiBmdW5jdGlvbihhcmVhLCBkZXB0aCwgaGFzTGF2YSl7XG5cdFx0aWYgKFV0aWwuY2hhbmNlKHRoaXMuQ0FWRVJOX0NIQU5DRVtkZXB0aC0xXSkpe1xuXHRcdFx0YXJlYS5hcmVhVHlwZSA9ICdjYXZlcm4nO1xuXHRcdFx0aWYgKGhhc0xhdmEpe1xuXHRcdFx0XHRhcmVhLmZsb29yID0gJ2NhdmVybkZsb29yJztcblx0XHRcdFx0YXJlYS5jYXZlcm5UeXBlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoWydyb2NreScsJ2JyaWRnZXMnXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoVXRpbC5jaGFuY2UodGhpcy5MQUdPT05fQ0hBTkNFW2RlcHRoLTFdKSl7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9ICdmYWtlV2F0ZXInO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFyZWEuZmxvb3IgPSAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFyZWEuY2F2ZXJuVHlwZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKFsncm9ja3knLCdicmlkZ2VzJywnd2F0ZXJ5J10pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcmVhLmFyZWFUeXBlID0gJ3Jvb21zJztcblx0XHRcdGFyZWEuZmxvb3IgPSAnc3RvbmVGbG9vcic7XG5cdFx0XHRhcmVhLndhbGwgPSBVdGlsLmNoYW5jZSh0aGlzLldBTExMRVNTX0NIQU5DRVtkZXB0aC0xXSkgPyBmYWxzZSA6ICdzdG9uZVdhbGwnO1xuXHRcdFx0YXJlYS5jb3JyaWRvciA9ICdzdG9uZUZsb29yJztcblx0XHR9XG5cdFx0YXJlYS5lbmVtaWVzID0gW107XG5cdFx0YXJlYS5pdGVtcyA9IFtdO1xuXHRcdHZhciByYW5kb21HYW5nID0gVXRpbC5yYW5kb21FbGVtZW50T2YodGhpcy5HQU5HU1tkZXB0aC0xXSk7XG5cdFx0YXJlYS5lbmVtaWVzID0gcmFuZG9tR2FuZy5taW5pb25zO1xuXHRcdGFyZWEuZW5lbXlDb3VudCA9IHJhbmRvbUdhbmcucXVhbnRpdHkgKyBVdGlsLnJhbmQoMCwzKTtcblx0XHRpZiAocmFuZG9tR2FuZylcblx0XHRcdGFyZWEuYm9zcyA9IHJhbmRvbUdhbmcuYm9zcztcblx0fSxcblx0cGxhY2VFeGl0czogZnVuY3Rpb24oYXJlYXMpe1xuXHRcdHZhciBkaXN0ID0gbnVsbDtcblx0XHR2YXIgYXJlYTEgPSBudWxsO1xuXHRcdHZhciBhcmVhMiA9IG51bGw7XG5cdFx0dmFyIGZ1c2UgPSAxMDAwO1xuXHRcdGRvIHtcblx0XHRcdGFyZWExID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdFx0YXJlYTIgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhcyk7XG5cdFx0XHRpZiAoZnVzZSA8IDApe1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGRpc3QgPSBVdGlsLmxpbmVEaXN0YW5jZShhcmVhMSwgYXJlYTIpO1xuXHRcdFx0ZnVzZS0tO1xuXHRcdH0gd2hpbGUgKGRpc3QgPCAodGhpcy5jb25maWcuTEVWRUxfV0lEVEggKyB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpIC8gMyk7XG5cdFx0YXJlYTEuaGFzRXhpdCA9IHRydWU7XG5cdFx0YXJlYTIuaGFzRW50cmFuY2UgPSB0cnVlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyc3RMZXZlbEdlbmVyYXRvcjsiLCJmdW5jdGlvbiBHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdHRoaXMuZmlyc3RMZXZlbEdlbmVyYXRvciA9IG5ldyBGaXJzdExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMuc2Vjb25kTGV2ZWxHZW5lcmF0b3IgPSBuZXcgU2Vjb25kTGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy50aGlyZExldmVsR2VuZXJhdG9yID0gbmV3IFRoaXJkTGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy5tb25zdGVyUG9wdWxhdG9yID0gbmV3IE1vbnN0ZXJQb3B1bGF0b3IoY29uZmlnKTtcblx0dGhpcy5pdGVtUG9wdWxhdG9yID0gbmV3IEl0ZW1Qb3B1bGF0b3IoY29uZmlnKTtcbn1cblxudmFyIEZpcnN0TGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBTZWNvbmRMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vU2Vjb25kTGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBUaGlyZExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgTW9uc3RlclBvcHVsYXRvciA9IHJlcXVpcmUoJy4vTW9uc3RlclBvcHVsYXRvci5jbGFzcycpO1xudmFyIEl0ZW1Qb3B1bGF0b3IgPSByZXF1aXJlKCcuL0l0ZW1Qb3B1bGF0b3IuY2xhc3MnKTtcblxuR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0Z2VuZXJhdGVMZXZlbDogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHZhciBza2V0Y2ggPSB0aGlzLmZpcnN0TGV2ZWxHZW5lcmF0b3IuZ2VuZXJhdGVMZXZlbChkZXB0aCk7XG5cdFx0dmFyIGxldmVsID0gdGhpcy5zZWNvbmRMZXZlbEdlbmVyYXRvci5maWxsTGV2ZWwoc2tldGNoKTtcblx0XHR0aGlzLnRoaXJkTGV2ZWxHZW5lcmF0b3IuZmlsbExldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMuc2Vjb25kTGV2ZWxHZW5lcmF0b3IuZnJhbWVMZXZlbChza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLm1vbnN0ZXJQb3B1bGF0b3IucG9wdWxhdGVMZXZlbChza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLml0ZW1Qb3B1bGF0b3IucG9wdWxhdGVMZXZlbChza2V0Y2gsIGxldmVsKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2tldGNoOiBza2V0Y2gsXG5cdFx0XHRsZXZlbDogbGV2ZWxcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7IiwiZnVuY3Rpb24gSXRlbVBvcHVsYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbkl0ZW1Qb3B1bGF0b3IucHJvdG90eXBlID0ge1xuXHRwb3B1bGF0ZUxldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHR0aGlzLmNhbGN1bGF0ZVJhcml0aWVzKGxldmVsLmRlcHRoKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNrZXRjaC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IHNrZXRjaC5hcmVhc1tpXTtcblx0XHRcdHRoaXMucG9wdWxhdGVBcmVhKGFyZWEsIGxldmVsKTtcblx0XHR9XG5cdH0sXG5cdHBvcHVsYXRlQXJlYTogZnVuY3Rpb24oYXJlYSwgbGV2ZWwpe1xuXHRcdHZhciBpdGVtcyA9IFV0aWwucmFuZCgwLDIpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXM7IGkrKyl7XG5cdFx0XHR2YXIgcG9zaXRpb24gPSBsZXZlbC5nZXRGcmVlUGxhY2UoYXJlYSk7XG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuZ2V0QW5JdGVtKCk7XG5cdFx0XHRsZXZlbC5hZGRJdGVtKGl0ZW0sIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuXHRcdH1cblx0fSxcblx0Y2FsY3VsYXRlUmFyaXRpZXM6IGZ1bmN0aW9uKGRlcHRoKXtcblx0XHR0aGlzLnRocmVzaG9sZHMgPSBbXTtcblx0XHR0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLklURU1TLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gdGhpcy5JVEVNU1tpXTtcblx0XHRcdHZhciBtYWx1cyA9IE1hdGguYWJzKGRlcHRoLWl0ZW0uZGVwdGgpID4gMTtcblx0XHRcdHZhciByYXJpdHkgPSBtYWx1cyA/IGl0ZW0ucmFyaXR5IC8gMiA6IGl0ZW0ucmFyaXR5O1xuXHRcdFx0dGhpcy5nZW5lcmF0aW9uQ2hhbmNlVG90YWwgKz0gcmFyaXR5O1xuXHRcdFx0dGhpcy50aHJlc2hvbGRzLnB1c2goe3RocmVzaG9sZDogdGhpcy5nZW5lcmF0aW9uQ2hhbmNlVG90YWwsIGl0ZW06IGl0ZW19KTtcblx0XHR9XG5cdH0sXG5cdElURU1TOiBbXG5cdFx0Lyp7Y29kZTogJ2RhZ2dlcicsIHJhcml0eTogMzUwMH0sXG5cdFx0e2NvZGU6ICdvaWxGbGFzaycsIHJhcml0eTogMTQwMH0sXG5cdFx0e2NvZGU6ICdzdGFmZicsIHJhcml0eTogMzUwfSxcblx0XHR7Y29kZTogJ3NsaW5nJywgcmFyaXR5OiAyODB9LFxuXHRcdHtjb2RlOiAnbWFjZScsIHJhcml0eTogNzB9LFxuXHRcdHtjb2RlOiAnYXhlJywgcmFyaXR5OiAzMX0sXG5cdFx0e2NvZGU6ICdib3cnLCByYXJpdHk6IDI4fSxcblx0XHR7Y29kZTogJ3N3b3JkJywgcmFyaXR5OiAzNTB9LFxuXHRcdHtjb2RlOiAnaGFsYmVyZCcsIHJhcml0eTogMjN9LFxuXHRcdHtjb2RlOiAnY3Jvc3Nib3cnLCByYXJpdHk6IDExfSxcblx0XHR7Y29kZTogJ21hZ2ljQXhlJywgcmFyaXR5OiA1fSxcblx0XHR7Y29kZTogJ21hZ2ljQm93JywgcmFyaXR5OiA0fSxcblx0XHR7Y29kZTogJ21hZ2ljU3dvcmQnLCByYXJpdHk6IDR9LFxuXHRcdHtjb2RlOiAnbWFnaWNXYW5kJywgcmFyaXR5OiAyfSxcblx0XHR7Y29kZTogJ2Nsb3RoJywgcmFyaXR5OiAxNDB9LFxuXHRcdHtjb2RlOiAnbGVhdGhlcicsIHJhcml0eTogMzV9LFxuXHRcdHtjb2RlOiAnY2hhaW4nLCByYXJpdHk6IDEyfSxcblx0XHR7Y29kZTogJ3BsYXRlJywgcmFyaXR5OiA0fSxcblx0XHR7Y29kZTogJ21hZ2ljQ2hhaW4nLCByYXJpdHk6IDJ9LFxuXHRcdHtjb2RlOiAnbWFnaWNQbGF0ZScsIHJhcml0eTogMX0qL1xuXHRcdHtjb2RlOiAnY3VyZScsIHJhcml0eTogMTAwMCwgZGVwdGg6IDF9LFxuXHRcdHtjb2RlOiAnaGVhbCcsIHJhcml0eTogMTAwMCwgZGVwdGg6IDF9LFxuXHRcdHtjb2RlOiAncmVkUG90aW9uJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICd5ZWxsb3dQb3Rpb24nLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAxfSxcblx0XHR7Y29kZTogJ2xpZ2h0JywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMn0sXG5cdFx0e2NvZGU6ICdtaXNzaWxlJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogM30sXG5cdFx0e2NvZGU6ICdpY2ViYWxsJywgcmFyaXR5OiA1MDAsIGRlcHRoOiA0fSxcblx0XHR7Y29kZTogJ3JlcGVsJywgcmFyaXR5OiA1MDAsIGRlcHRoOiA1fSxcblx0XHR7Y29kZTogJ2JsaW5rJywgcmFyaXR5OiAzMzMsIGRlcHRoOiA1fSxcblx0XHR7Y29kZTogJ2ZpcmViYWxsJywgcmFyaXR5OiAzMzMsIGRlcHRoOiA2fSxcblx0XHR7Y29kZTogJ3Byb3RlY3Rpb24nLCByYXJpdHk6IDI1MCwgZGVwdGg6IDZ9LFxuXHRcdHtjb2RlOiAndGltZScsIHJhcml0eTogMjAwLCBkZXB0aDogN30sXG5cdFx0e2NvZGU6ICdzbGVlcCcsIHJhcml0eTogMjAwLCBkZXB0aDogN30sXG5cdFx0e2NvZGU6ICdqaW54JywgcmFyaXR5OiAxNjYsIGRlcHRoOiA4fSxcblx0XHR7Y29kZTogJ3RyZW1vcicsIHJhcml0eTogMTY2LCBkZXB0aDogOH0sXG5cdFx0e2NvZGU6ICdraWxsJywgcmFyaXR5OiAxNDIsIGRlcHRoOiA4fVxuXHRdLFxuXHRnZXRBbkl0ZW06IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG51bWJlciA9IFV0aWwucmFuZCgwLCB0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRocmVzaG9sZHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYgKG51bWJlciA8PSB0aGlzLnRocmVzaG9sZHNbaV0udGhyZXNob2xkKVxuXHRcdFx0XHRyZXR1cm4gdGhpcy50aHJlc2hvbGRzW2ldLml0ZW0uY29kZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMudGhyZXNob2xkc1swXS5pdGVtLmNvZGU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJdGVtUG9wdWxhdG9yOyIsImZ1bmN0aW9uIEtyYW1naW5lRXhwb3J0ZXIoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbktyYW1naW5lRXhwb3J0ZXIucHJvdG90eXBlID0ge1xuXHRnZXRMZXZlbDogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHRoaXMuaW5pdFRpbGVEZWZzKGxldmVsLmNlaWxpbmdIZWlnaHQpO1xuXHRcdHZhciB0aWxlcyA9IHRoaXMuZ2V0VGlsZXMoKTtcblx0XHR2YXIgb2JqZWN0cyA9IHRoaXMuZ2V0T2JqZWN0cyhsZXZlbCk7XG5cdFx0dmFyIG1hcCA9IHRoaXMuZ2V0TWFwKGxldmVsKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGlsZXM6IHRpbGVzLFxuXHRcdFx0b2JqZWN0czogb2JqZWN0cyxcblx0XHRcdG1hcDogbWFwXG5cdFx0fTtcblx0fSxcblx0aW5pdFRpbGVEZWZzOiBmdW5jdGlvbihjZWlsaW5nSGVpZ2h0KXtcblx0XHR0aGlzLnRpbGVzID0gW107XG5cdFx0dGhpcy50aWxlc01hcCA9IFtdO1xuXHRcdHRoaXMudGlsZXMucHVzaChudWxsKTtcblx0XHR0aGlzLmNlaWxpbmdIZWlnaHQgPSBjZWlsaW5nSGVpZ2h0O1xuXHRcdHRoaXMuYWRkVGlsZSgnU1RPTkVfV0FMTCcsIDIsIDAsIDApO1xuXHRcdHRoaXMuYWRkVGlsZSgnU1RPTkVfRkxPT1InLCAwLCAyLCAyKTtcblx0XHR0aGlzLmFkZFRpbGUoJ0JSSURHRScsIDAsIDQsIDIpO1xuXHRcdHRoaXMuYWRkVGlsZSgnV0FURVInLCAwLCAxMDEsIDIpO1xuXHRcdHRoaXMuYWRkVGlsZSgnTEFWQScsIDAsIDEwMywgMik7XG5cdH0sXG5cdGFkZFRpbGU6IGZ1bmN0aW9uIChpZCwgd2FsbFRleHR1cmUsIGZsb29yVGV4dHVyZSwgY2VpbFRleHR1cmUpe1xuXHRcdHZhciB0aWxlID0gdGhpcy5jcmVhdGVUaWxlKHdhbGxUZXh0dXJlLCBmbG9vclRleHR1cmUsIGNlaWxUZXh0dXJlLCB0aGlzLmNlaWxpbmdIZWlnaHQpO1xuXHRcdHRoaXMudGlsZXMucHVzaCh0aWxlKTtcblx0XHR0aGlzLnRpbGVzTWFwW2lkXSA9IHRoaXMudGlsZXMubGVuZ3RoIC0gMTtcblx0fSxcblx0Z2V0VGlsZTogZnVuY3Rpb24oaWQpe1xuXHRcdHJldHVybiB0aGlzLnRpbGVzTWFwW2lkXTtcblx0fSxcblx0Y3JlYXRlVGlsZTogZnVuY3Rpb24od2FsbFRleHR1cmUsIGZsb29yVGV4dHVyZSwgY2VpbFRleHR1cmUsIGhlaWdodCl7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHc6IHdhbGxUZXh0dXJlLFxuXHRcdFx0eTogMCxcblx0XHRcdGg6IGhlaWdodCxcblx0XHRcdGY6IGZsb29yVGV4dHVyZSxcblx0XHRcdGZ5OiAwLFxuXHRcdFx0YzogY2VpbFRleHR1cmUsXG5cdFx0XHRjaDogaGVpZ2h0LFxuXHRcdFx0c2w6IDAsXG5cdFx0XHRkaXI6IDBcblx0XHR9O1xuXHR9LFxuXHRnZXRUaWxlczogZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gdGhpcy50aWxlcztcblx0fSxcblx0Z2V0T2JqZWN0czogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBvYmplY3RzID0gW107XG5cdFx0b2JqZWN0cy5wdXNoKHtcblx0XHRcdHg6IGxldmVsLnN0YXJ0LnggKyAwLjUsXG5cdFx0XHR6OiBsZXZlbC5zdGFydC55ICsgMC41LFxuXHRcdFx0eTogMCxcblx0XHRcdGRpcjogMyxcblx0XHRcdHR5cGU6ICdwbGF5ZXInXG5cdFx0fSk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBlbmVteSA9IGxldmVsLmVuZW1pZXNbaV07XG5cdFx0XHR2YXIgZW5lbXlEYXRhID1cblx0XHRcdHtcblx0ICAgICAgICAgICAgeDogZW5lbXkueCArIDAuNSxcblx0ICAgICAgICAgICAgejogZW5lbXkueSArIDAuNSxcblx0ICAgICAgICAgICAgeTogMCxcblx0ICAgICAgICAgICAgdHlwZTogJ2VuZW15Jyxcblx0ICAgICAgICAgICAgZW5lbXk6IGVuZW15LmNvZGVcblx0ICAgICAgICB9O1xuXHRcdFx0b2JqZWN0cy5wdXNoKGVuZW15RGF0YSk7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSBsZXZlbC5pdGVtc1tpXTtcblx0XHRcdHZhciBpdGVtRGF0YSA9XG5cdFx0XHR7XG5cdCAgICAgICAgICAgIHg6IGl0ZW0ueCArIDAuNSxcblx0ICAgICAgICAgICAgejogaXRlbS55ICsgMC41LFxuXHQgICAgICAgICAgICB5OiAwLFxuXHQgICAgICAgICAgICB0eXBlOiAnaXRlbScsXG5cdCAgICAgICAgICAgIGl0ZW06IGl0ZW0uY29kZVxuXHQgICAgICAgIH07XG5cdFx0XHRvYmplY3RzLnB1c2goaXRlbURhdGEpO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0cztcblx0fSxcblx0Z2V0TWFwOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG1hcCA9IFtdO1xuXHRcdHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0bWFwW3ldID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldO1xuXHRcdFx0XHR2YXIgaWQgPSBudWxsO1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gJ3dhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSB0aGlzLmdldFRpbGUoXCJXQVRFUlwiKTtcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnZmFrZVdhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSB0aGlzLmdldFRpbGUoXCJXQVRFUlwiKTtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX1dBTExcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY2F2ZXJuRmxvb3InKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX0ZMT09SXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX0ZMT09SXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3Vwc3RhaXJzJyl7XG5cdFx0XHRcdFx0aWQgPSB0aGlzLmdldFRpbGUoXCJTVE9ORV9GTE9PUlwiKTtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZVdhbGwnKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX1dBTExcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVGbG9vcicpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiU1RPTkVfRkxPT1JcIik7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY29ycmlkb3InKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIlNUT05FX0ZMT09SXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2JyaWRnZScpe1xuXHRcdFx0XHRcdGlkID0gdGhpcy5nZXRUaWxlKFwiQlJJREdFXCIpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2xhdmEnKXtcblx0XHRcdFx0XHRpZCA9IHRoaXMuZ2V0VGlsZShcIkxBVkFcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0bWFwW3ldW3hdID0gaWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLcmFtZ2luZUV4cG9ydGVyO1xuIiwiZnVuY3Rpb24gTGV2ZWwoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59O1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuTGV2ZWwucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmVuZW1pZXMgPSBbXTtcblx0XHR0aGlzLml0ZW1zID0gW107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdHRoaXMuY2VsbHNbeF0gPSBbXTtcblx0XHR9XG5cdH0sXG5cdGFkZEVuZW15OiBmdW5jdGlvbihlbmVteSwgeCwgeSl7XG5cdFx0dGhpcy5lbmVtaWVzLnB1c2goe1xuXHRcdFx0Y29kZTogZW5lbXksXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeVxuXHRcdH0pO1xuXHR9LFxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtLCB4LCB5KXtcblx0XHR0aGlzLml0ZW1zLnB1c2goe1xuXHRcdFx0Y29kZTogaXRlbSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fSk7XG5cdH0sXG5cdGdldEZyZWVQbGFjZTogZnVuY3Rpb24oYXJlYSl7XG5cdFx0d2hpbGUodHJ1ZSl7XG5cdFx0XHR2YXIgcmFuZFBvaW50ID0ge1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoYXJlYS54LCBhcmVhLngrYXJlYS53LTEpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoYXJlYS55LCBhcmVhLnkrYXJlYS5oLTEpXG5cdFx0XHR9XG5cdFx0XHR2YXIgY2VsbCA9IHRoaXMuY2VsbHNbcmFuZFBvaW50LnhdW3JhbmRQb2ludC55XTsgXG5cdFx0XHRpZiAoY2VsbCA9PSBhcmVhLmZsb29yIHx8IGFyZWEuY29ycmlkb3IgJiYgY2VsbCA9PSBhcmVhLmNvcnJpZG9yIHx8IGNlbGwgPT0gJ2Zha2VXYXRlcicpXG5cdFx0XHRcdHJldHVybiByYW5kUG9pbnQ7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyIsImZ1bmN0aW9uIE1vbnN0ZXJQb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5Nb25zdGVyUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuZW5lbXlDb3VudDsgaSsrKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdHRoaXMuYWRkTW9uc3RlcihhcmVhLCAgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgbGV2ZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYXJlYS5ib3NzKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdGxldmVsLmFkZEVuZW15KGFyZWEuYm9zcywgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRhZGRNb25zdGVyOiBmdW5jdGlvbihhcmVhLCB4LCB5LCBsZXZlbCl7XG5cdFx0dmFyIG1vbnN0ZXIgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhLmVuZW1pZXMpO1xuXHRcdGxldmVsLmFkZEVuZW15KG1vbnN0ZXIsIHgsIHkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlclBvcHVsYXRvcjsiLCJmdW5jdGlvbiBTZWNvbmRMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgTGV2ZWwgPSByZXF1aXJlKCcuL0xldmVsLmNsYXNzJyk7XG52YXIgQ0EgPSByZXF1aXJlKCcuL0NBJyk7XG5cblNlY29uZExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0ZmlsbExldmVsOiBmdW5jdGlvbihza2V0Y2gpe1xuXHRcdHZhciBsZXZlbCA9IG5ldyBMZXZlbCh0aGlzLmNvbmZpZyk7XG5cdFx0bGV2ZWwuaW5pdCgpO1xuXHRcdHRoaXMuZmlsbFN0cmF0YShsZXZlbCwgc2tldGNoKTtcblx0XHRsZXZlbC5jZWlsaW5nSGVpZ2h0ID0gc2tldGNoLmNlaWxpbmdIZWlnaHQ7XG5cdFx0aWYgKHNrZXRjaC5oYXNMYXZhKVxuXHRcdFx0dGhpcy5wbG90Uml2ZXJzKGxldmVsLCBza2V0Y2gsICdsYXZhJyk7XG5cdFx0ZWxzZSBpZiAoc2tldGNoLmhhc1JpdmVycylcblx0XHRcdHRoaXMucGxvdFJpdmVycyhsZXZlbCwgc2tldGNoLCAnd2F0ZXInKTtcblx0XHR0aGlzLmNvcHlHZW8obGV2ZWwpO1xuXHRcdHJldHVybiBsZXZlbDtcblx0fSxcblx0ZmlsbFN0cmF0YTogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCl7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjb3B5R2VvOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIGdlbyA9IFtdO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRnZW9beF0gPSBbXTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHRnZW9beF1beV0gPSBsZXZlbC5jZWxsc1t4XVt5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bGV2ZWwuZ2VvID0gZ2VvO1xuXHR9LFxuXHRwbG90Uml2ZXJzOiBmdW5jdGlvbihsZXZlbCwgc2tldGNoLCBsaXF1aWQpe1xuXHRcdHRoaXMucGxhY2VSaXZlcmxpbmVzKGxldmVsLCBza2V0Y2gsIGxpcXVpZCk7XG5cdFx0dGhpcy5mYXR0ZW5SaXZlcnMobGV2ZWwsIGxpcXVpZCk7XG5cdFx0aWYgKGxpcXVpZCA9PSAnbGF2YScpXG5cdFx0XHR0aGlzLmZhdHRlblJpdmVycyhsZXZlbCwgbGlxdWlkKTtcblx0fSxcblx0ZmF0dGVuUml2ZXJzOiBmdW5jdGlvbihsZXZlbCwgbGlxdWlkKXtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbbGlxdWlkXSA+IDEgJiYgVXRpbC5jaGFuY2UoMzApKVxuXHRcdFx0XHRyZXR1cm4gbGlxdWlkO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1tsaXF1aWRdID4gMSlcblx0XHRcdFx0cmV0dXJuIGxpcXVpZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0fSxcblx0cGxhY2VSaXZlcmxpbmVzOiBmdW5jdGlvbihsZXZlbCwgc2tldGNoLCBsaXF1aWQpe1xuXHRcdC8vIFBsYWNlIHJhbmRvbSBsaW5lIHNlZ21lbnRzIG9mIHdhdGVyXG5cdFx0dmFyIHJpdmVycyA9IFV0aWwucmFuZCh0aGlzLmNvbmZpZy5NSU5fUklWRVJTLHRoaXMuY29uZmlnLk1BWF9SSVZFUlMpO1xuXHRcdHZhciByaXZlclNlZ21lbnRMZW5ndGggPSB0aGlzLmNvbmZpZy5SSVZFUl9TRUdNRU5UX0xFTkdUSDtcblx0XHR2YXIgcHVkZGxlID0gZmFsc2U7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByaXZlcnM7IGkrKyl7XG5cdFx0XHR2YXIgc2VnbWVudHMgPSBVdGlsLnJhbmQodGhpcy5jb25maWcuTUlOX1JJVkVSX1NFR01FTlRTLHRoaXMuY29uZmlnLk1BWF9SSVZFUl9TRUdNRU5UUyk7XG5cdFx0XHR2YXIgcml2ZXJQb2ludHMgPSBbXTtcblx0XHRcdHJpdmVyUG9pbnRzLnB1c2goe1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoMCwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEgpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoMCwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0fSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHNlZ21lbnRzOyBqKyspe1xuXHRcdFx0XHR2YXIgcmFuZG9tUG9pbnQgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihyaXZlclBvaW50cyk7XG5cdFx0XHRcdGlmIChyaXZlclBvaW50cy5sZW5ndGggPiAxICYmICFwdWRkbGUpXG5cdFx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkocml2ZXJQb2ludHMsIHJhbmRvbVBvaW50KTtcblx0XHRcdFx0dmFyIGlhbmNlID0ge1xuXHRcdFx0XHRcdHg6IFV0aWwucmFuZCgtcml2ZXJTZWdtZW50TGVuZ3RoLCByaXZlclNlZ21lbnRMZW5ndGgpLFxuXHRcdFx0XHRcdHk6IFV0aWwucmFuZCgtcml2ZXJTZWdtZW50TGVuZ3RoLCByaXZlclNlZ21lbnRMZW5ndGgpXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBuZXdQb2ludCA9IHtcblx0XHRcdFx0XHR4OiByYW5kb21Qb2ludC54ICsgaWFuY2UueCxcblx0XHRcdFx0XHR5OiByYW5kb21Qb2ludC55ICsgaWFuY2UueSxcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKG5ld1BvaW50LnggPiAwICYmIG5ld1BvaW50LnggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCAmJiBcblx0XHRcdFx0XHRuZXdQb2ludC55ID4gMCAmJiBuZXdQb2ludC55IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0XHRcdHJpdmVyUG9pbnRzLnB1c2gobmV3UG9pbnQpO1xuXHRcdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShyYW5kb21Qb2ludCwgbmV3UG9pbnQpO1xuXHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGxpbmUubGVuZ3RoOyBrKyspe1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGxpbmVba107XG5cdFx0XHRcdFx0aWYgKHBvaW50LnggPiAwICYmIHBvaW50LnggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCAmJiBcblx0XHRcdFx0XHRcdHBvaW50LnkgPiAwICYmIHBvaW50LnkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBsaXF1aWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGZyYW1lTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRpZiAobGV2ZWwuY2VsbHNbeF1bMF0gIT0gJ3N0b25lV2FsbCcpIGxldmVsLmNlbGxzW3hdWzBdID0gc2tldGNoLnN0cmF0YTtcblx0XHRcdGlmIChsZXZlbC5jZWxsc1t4XVt0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQtMV0gIT0gJ3N0b25lV2FsbCcpIGxldmVsLmNlbGxzW3hdW3RoaXMuY29uZmlnLkxFVkVMX0hFSUdIVC0xXSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0fVxuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzWzBdW3ldICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1swXVt5XSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0XHRpZiAobGV2ZWwuY2VsbHNbdGhpcy5jb25maWcuTEVWRUxfV0lEVEgtMV1beV0gIT0gJ3N0b25lV2FsbCcpIGxldmVsLmNlbGxzW3RoaXMuY29uZmlnLkxFVkVMX1dJRFRILTFdW3ldID0gc2tldGNoLnN0cmF0YTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWNvbmRMZXZlbEdlbmVyYXRvcjsiLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN1YmRpdmlkZUFyZWE6IGZ1bmN0aW9uKGJpZ0FyZWEsIG1heERlcHRoLCBNSU5fV0lEVEgsIE1JTl9IRUlHSFQsIE1BWF9XSURUSCwgTUFYX0hFSUdIVCwgU0xJQ0VfUkFOR0VfU1RBUlQsIFNMSUNFX1JBTkdFX0VORCwgYXZvaWRQb2ludHMpe1xuXHRcdHZhciBhcmVhcyA9IFtdO1xuXHRcdHZhciBiaWdBcmVhcyA9IFtdO1xuXHRcdGJpZ0FyZWEuZGVwdGggPSAwO1xuXHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0dmFyIHJldHJpZXMgPSAwO1xuXHRcdHdoaWxlIChiaWdBcmVhcy5sZW5ndGggPiAwKXtcblx0XHRcdHZhciBiaWdBcmVhID0gYmlnQXJlYXMucG9wKCk7XG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNwbGl0ID0gVXRpbC5jaGFuY2UoNTApO1xuXHRcdFx0aWYgKGJpZ0FyZWEudyA8IE1JTl9XSURUSCAqIDEuNSAmJiBiaWdBcmVhLmggPCBNSU5fSEVJR0hUICogMS41KXtcblx0XHRcdFx0YmlnQXJlYS5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fSBlbHNlIGlmIChiaWdBcmVhLncgPCBNSU5fV0lEVEggKiAxLjUpe1xuXHRcdFx0XHRob3Jpem9udGFsU3BsaXQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmIChiaWdBcmVhLmggPCBNSU5fSEVJR0hUICogMS41KXtcblx0XHRcdFx0aG9yaXpvbnRhbFNwbGl0ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgYXJlYTEgPSBudWxsO1xuXHRcdFx0dmFyIGFyZWEyID0gbnVsbDtcblx0XHRcdGlmIChob3Jpem9udGFsU3BsaXQpe1xuXHRcdFx0XHR2YXIgc2xpY2UgPSBNYXRoLnJvdW5kKFV0aWwucmFuZChiaWdBcmVhLmggKiBTTElDRV9SQU5HRV9TVEFSVCwgYmlnQXJlYS5oICogU0xJQ0VfUkFOR0VfRU5EKSk7XG5cdFx0XHRcdGFyZWExID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnksXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LFxuXHRcdFx0XHRcdGg6IHNsaWNlXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFyZWEyID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnkgKyBzbGljZSxcblx0XHRcdFx0XHR3OiBiaWdBcmVhLncsXG5cdFx0XHRcdFx0aDogYmlnQXJlYS5oIC0gc2xpY2Vcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHNsaWNlID0gTWF0aC5yb3VuZChVdGlsLnJhbmQoYmlnQXJlYS53ICogU0xJQ0VfUkFOR0VfU1RBUlQsIGJpZ0FyZWEudyAqIFNMSUNFX1JBTkdFX0VORCkpO1xuXHRcdFx0XHRhcmVhMSA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IHNsaWNlLFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaFxuXHRcdFx0XHR9XG5cdFx0XHRcdGFyZWEyID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCtzbGljZSxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnksXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LXNsaWNlLFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWExLncgPCBNSU5fV0lEVEggfHwgYXJlYTEuaCA8IE1JTl9IRUlHSFQgfHxcblx0XHRcdFx0YXJlYTIudyA8IE1JTl9XSURUSCB8fCBhcmVhMi5oIDwgTUlOX0hFSUdIVCl7XG5cdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGlmIChiaWdBcmVhLmRlcHRoID09IG1heERlcHRoICYmIFxuXHRcdFx0XHRcdChhcmVhMS53ID4gTUFYX1dJRFRIIHx8IGFyZWExLmggPiBNQVhfSEVJR0hUIHx8XG5cdFx0XHRcdFx0YXJlYTIudyA+IE1BWF9XSURUSCB8fCBhcmVhMi5oID4gTUFYX0hFSUdIVCkpe1xuXHRcdFx0XHRpZiAocmV0cmllcyA8IDEwMCkge1xuXHRcdFx0XHRcdC8vIFB1c2ggYmFjayBiaWcgYXJlYVxuXHRcdFx0XHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcysrO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0fVxuXHRcdFx0aWYgKGF2b2lkUG9pbnRzICYmICh0aGlzLmNvbGxpZGVzV2l0aChhdm9pZFBvaW50cywgYXJlYTIpIHx8IHRoaXMuY29sbGlkZXNXaXRoKGF2b2lkUG9pbnRzLCBhcmVhMSkpKXtcblx0XHRcdFx0aWYgKHJldHJpZXMgPiAxMDApe1xuXHRcdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRcdGFyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcyA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUHVzaCBiYWNrIGJpZyBhcmVhXG5cdFx0XHRcdFx0YmlnQXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0XHRyZXRyaWVzKys7XG5cdFx0XHRcdH1cdFx0XG5cdFx0XHRcdGNvbnRpbnVlOyBcblx0XHRcdH1cblx0XHRcdGlmIChiaWdBcmVhLmRlcHRoID09IG1heERlcHRoKXtcblx0XHRcdFx0YXJlYTEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhMi5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWFzLnB1c2goYXJlYTEpO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGFyZWEyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWExLmRlcHRoID0gYmlnQXJlYS5kZXB0aCArMTtcblx0XHRcdFx0YXJlYTIuZGVwdGggPSBiaWdBcmVhLmRlcHRoICsxO1xuXHRcdFx0XHRiaWdBcmVhcy5wdXNoKGFyZWExKTtcblx0XHRcdFx0YmlnQXJlYXMucHVzaChhcmVhMik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBhcmVhcztcblx0fSxcblx0Y29sbGlkZXNXaXRoOiBmdW5jdGlvbihhdm9pZFBvaW50cywgYXJlYSl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhdm9pZFBvaW50cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXZvaWRQb2ludCA9IGF2b2lkUG9pbnRzW2ldO1xuXHRcdFx0aWYgKFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCwgYXJlYS55LCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngrYXJlYS53LCBhcmVhLnksIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCwgYXJlYS55K2FyZWEuaCwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54K2FyZWEudywgYXJlYS55K2FyZWEuaCwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIpe1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRjb25uZWN0QXJlYXM6IGZ1bmN0aW9uKGFyZWFzLCBib3JkZXIpe1xuXHRcdC8qIE1ha2Ugb25lIGFyZWEgY29ubmVjdGVkXG5cdFx0ICogV2hpbGUgbm90IGFsbCBhcmVhcyBjb25uZWN0ZWQsXG5cdFx0ICogIFNlbGVjdCBhIGNvbm5lY3RlZCBhcmVhXG5cdFx0ICogIFNlbGVjdCBhIHZhbGlkIHdhbGwgZnJvbSB0aGUgYXJlYVxuXHRcdCAqICBUZWFyIGl0IGRvd24sIGNvbm5lY3RpbmcgdG8gdGhlIGEgbmVhcmJ5IGFyZWFcblx0XHQgKiAgTWFyayBhcmVhIGFzIGNvbm5lY3RlZFxuXHRcdCAqL1xuXHRcdGlmICghYm9yZGVyKXtcblx0XHRcdGJvcmRlciA9IDE7XG5cdFx0fVxuXHRcdHZhciBjb25uZWN0ZWRBcmVhcyA9IFtdO1xuXHRcdHZhciByYW5kb21BcmVhID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdGNvbm5lY3RlZEFyZWFzLnB1c2gocmFuZG9tQXJlYSk7XG5cdFx0dmFyIGN1cnNvciA9IHt9O1xuXHRcdHZhciB2YXJpID0ge307XG5cdFx0YXJlYTogd2hpbGUgKGNvbm5lY3RlZEFyZWFzLmxlbmd0aCA8IGFyZWFzLmxlbmd0aCl7XG5cdFx0XHRyYW5kb21BcmVhID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY29ubmVjdGVkQXJlYXMpO1xuXHRcdFx0dmFyIHdhbGxEaXIgPSBVdGlsLnJhbmQoMSw0KTtcblx0XHRcdHN3aXRjaCh3YWxsRGlyKXtcblx0XHRcdGNhc2UgMTogLy8gTGVmdFxuXHRcdFx0XHRjdXJzb3IueCA9IHJhbmRvbUFyZWEueDtcblx0XHRcdFx0Y3Vyc29yLnkgPSBVdGlsLnJhbmQocmFuZG9tQXJlYS55ICsgYm9yZGVyICwgcmFuZG9tQXJlYS55K3JhbmRvbUFyZWEuaCAtIGJvcmRlcik7XG5cdFx0XHRcdHZhcmkueCA9IC0yO1xuXHRcdFx0XHR2YXJpLnkgPSAwO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjogLy9SaWdodFxuXHRcdFx0XHRjdXJzb3IueCA9IHJhbmRvbUFyZWEueCArIHJhbmRvbUFyZWEudztcblx0XHRcdFx0Y3Vyc29yLnkgPSBVdGlsLnJhbmQocmFuZG9tQXJlYS55ICsgYm9yZGVyLCByYW5kb21BcmVhLnkrcmFuZG9tQXJlYS5oIC0gYm9yZGVyKTtcblx0XHRcdFx0dmFyaS54ID0gMjtcblx0XHRcdFx0dmFyaS55ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6IC8vVXBcblx0XHRcdFx0Y3Vyc29yLnggPSBVdGlsLnJhbmQocmFuZG9tQXJlYS54ICsgYm9yZGVyLCByYW5kb21BcmVhLngrcmFuZG9tQXJlYS53IC0gYm9yZGVyKTtcblx0XHRcdFx0Y3Vyc29yLnkgPSByYW5kb21BcmVhLnk7XG5cdFx0XHRcdHZhcmkueCA9IDA7XG5cdFx0XHRcdHZhcmkueSA9IC0yO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDogLy9Eb3duXG5cdFx0XHRcdGN1cnNvci54ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueCArIGJvcmRlciwgcmFuZG9tQXJlYS54K3JhbmRvbUFyZWEudyAtIGJvcmRlcik7XG5cdFx0XHRcdGN1cnNvci55ID0gcmFuZG9tQXJlYS55ICsgcmFuZG9tQXJlYS5oO1xuXHRcdFx0XHR2YXJpLnggPSAwO1xuXHRcdFx0XHR2YXJpLnkgPSAyO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHZhciBjb25uZWN0ZWRBcmVhID0gdGhpcy5nZXRBcmVhQXQoY3Vyc29yLCB2YXJpLCBhcmVhcyk7XG5cdFx0XHRpZiAoY29ubmVjdGVkQXJlYSAmJiAhVXRpbC5jb250YWlucyhjb25uZWN0ZWRBcmVhcywgY29ubmVjdGVkQXJlYSkpe1xuXHRcdFx0XHRzd2l0Y2god2FsbERpcil7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdGlmIChjdXJzb3IueSA8PSBjb25uZWN0ZWRBcmVhLnkgKyBib3JkZXIgfHwgY3Vyc29yLnkgPj0gY29ubmVjdGVkQXJlYS55ICsgY29ubmVjdGVkQXJlYS5oIC0gYm9yZGVyKVxuXHRcdFx0XHRcdFx0Y29udGludWUgYXJlYTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0aWYgKGN1cnNvci54IDw9IGNvbm5lY3RlZEFyZWEueCArIGJvcmRlciB8fCBjdXJzb3IueCA+PSBjb25uZWN0ZWRBcmVhLnggKyBjb25uZWN0ZWRBcmVhLncgLSBib3JkZXIpXG5cdFx0XHRcdFx0XHRjb250aW51ZSBhcmVhO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmNvbm5lY3RBcmVhKHJhbmRvbUFyZWEsIGNvbm5lY3RlZEFyZWEsIGN1cnNvcik7XG5cdFx0XHRcdGNvbm5lY3RlZEFyZWFzLnB1c2goY29ubmVjdGVkQXJlYSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnZXRBcmVhQXQ6IGZ1bmN0aW9uKGN1cnNvciwgdmFyaSwgYXJlYXMpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmIChjdXJzb3IueCArIHZhcmkueCA+PSBhcmVhLnggJiYgY3Vyc29yLnggKyB2YXJpLnggPD0gYXJlYS54ICsgYXJlYS53IFxuXHRcdFx0XHRcdCYmIGN1cnNvci55ICsgdmFyaS55ID49IGFyZWEueSAmJiBjdXJzb3IueSArIHZhcmkueSA8PSBhcmVhLnkgKyBhcmVhLmgpXG5cdFx0XHRcdHJldHVybiBhcmVhO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdGNvbm5lY3RBcmVhOiBmdW5jdGlvbihhcmVhMSwgYXJlYTIsIHBvc2l0aW9uKXtcblx0XHRhcmVhMS5icmlkZ2VzLnB1c2goe1xuXHRcdFx0eDogcG9zaXRpb24ueCxcblx0XHRcdHk6IHBvc2l0aW9uLnksXG5cdFx0XHR0bzogYXJlYTJcblx0XHR9KTtcblx0XHRhcmVhMi5icmlkZ2VzLnB1c2goe1xuXHRcdFx0eDogcG9zaXRpb24ueCxcblx0XHRcdHk6IHBvc2l0aW9uLnksXG5cdFx0XHR0bzogYXJlYTFcblx0XHR9KTtcblx0fVxufSIsImZ1bmN0aW9uIFRoaXJkTGV2ZWxHZW5lcmF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xudmFyIENBID0gcmVxdWlyZSgnLi9DQScpO1xudmFyIFNwbGl0dGVyID0gcmVxdWlyZSgnLi9TcGxpdHRlcicpO1xuXG5UaGlyZExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0ZmlsbExldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHR0aGlzLmZpbGxSb29tcyhza2V0Y2gsIGxldmVsKVxuXHRcdHRoaXMuZmF0dGVuQ2F2ZXJucyhsZXZlbCk7XG5cdFx0dGhpcy5wbGFjZUV4aXRzKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMucmFpc2VJc2xhbmRzKGxldmVsKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGZhdHRlbkNhdmVybnM6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHQvLyBHcm93IGNhdmVybnNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10gPiAwICYmIFV0aWwuY2hhbmNlKDIwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddID4gMSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gR3JvdyBsYWdvb24gYXJlYXNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2Zha2VXYXRlciddID4gMCAmJiBVdGlsLmNoYW5jZSg0MCkpXG5cdFx0XHRcdHJldHVybiAnZmFrZVdhdGVyJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2Zha2VXYXRlciddID4gMClcblx0XHRcdFx0cmV0dXJuICdmYWtlV2F0ZXInO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdFxuXHRcdFxuXHRcdC8vIEV4cGFuZCB3YWxsLWxlc3Mgcm9vbXNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnc29saWRSb2NrJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydzdG9uZUZsb29yJ10gPiAyICYmIFV0aWwuY2hhbmNlKDEwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3NvbGlkUm9jaycpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMCAmJiBzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXT4wKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBEZXRlcmlvcmF0ZSB3YWxsIHJvb21zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3N0b25lV2FsbCcpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMCAmJiBVdGlsLmNoYW5jZSg1KSlcblx0XHRcdFx0cmV0dXJuICdzdG9uZUZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRcblx0fSxcblx0cmFpc2VJc2xhbmRzOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3dhdGVyJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIGNhdmVybnMgPSBzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXTsgXG5cdFx0XHRpZiAoY2F2ZXJucyA+IDAgJiYgVXRpbC5jaGFuY2UoNzApKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBJc2xhbmQgZm9yIGV4aXRzIG9uIHdhdGVyXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ2Zha2VXYXRlcicgJiYgY3VycmVudCAhPSAnd2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR2YXIgc3RhaXJzID0gc3Vycm91bmRpbmdbJ2Rvd25zdGFpcnMnXSA/IHN1cnJvdW5kaW5nWydkb3duc3RhaXJzJ10gOiAwICtcblx0XHRcdFx0XHRzdXJyb3VuZGluZ1sndXBzdGFpcnMnXSA/IHN1cnJvdW5kaW5nWyd1cHN0YWlycyddIDogMDsgXG5cdFx0XHRpZiAoc3RhaXJzID4gMClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSk7XG5cdH0sXG5cdGZpbGxSb29tczogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR2YXIgdHlwZSA9IGFyZWEuYXJlYVR5cGU7XG5cdFx0XHRpZiAodHlwZSA9PT0gJ2NhdmVybicpeyBcblx0XHRcdFx0dGhpcy5maWxsV2l0aENhdmVybihsZXZlbCwgYXJlYSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdyb29tcycpe1xuXHRcdFx0XHR0aGlzLmZpbGxXaXRoUm9vbXMobGV2ZWwsIGFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cGxhY2VFeGl0czogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHRpZiAoIWFyZWEuaGFzRXhpdCAmJiAhYXJlYS5oYXNFbnRyYW5jZSlcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR2YXIgdGlsZSA9IG51bGw7XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0dGlsZSA9ICdkb3duc3RhaXJzJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpbGUgPSAndXBzdGFpcnMnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZyZWVTcG90ID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0aWYgKGZyZWVTcG90LnggPT0gMCB8fCBmcmVlU3BvdC55ID09IDAgfHwgZnJlZVNwb3QueCA9PSBsZXZlbC5jZWxscy5sZW5ndGggLSAxIHx8IGZyZWVTcG90LnkgPT0gbGV2ZWwuY2VsbHNbMF0ubGVuZ3RoIC0gMSl7XG5cdFx0XHRcdGktLTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRsZXZlbC5jZWxsc1tmcmVlU3BvdC54XVtmcmVlU3BvdC55XSA9IHRpbGU7XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0bGV2ZWwuZW5kID0ge1xuXHRcdFx0XHRcdHg6IGZyZWVTcG90LngsXG5cdFx0XHRcdFx0eTogZnJlZVNwb3QueVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV2ZWwuc3RhcnQgPSB7XG5cdFx0XHRcdFx0eDogZnJlZVNwb3QueCxcblx0XHRcdFx0XHR5OiBmcmVlU3BvdC55XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmaWxsV2l0aENhdmVybjogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdC8vIENvbm5lY3QgYWxsIGJyaWRnZXMgd2l0aCBtaWRwb2ludFxuXHRcdHZhciBtaWRwb2ludCA9IHtcblx0XHRcdHg6IE1hdGgucm91bmQoVXRpbC5yYW5kKGFyZWEueCArIGFyZWEudyAqIDEvMywgYXJlYS54K2FyZWEudyAqIDIvMykpLFxuXHRcdFx0eTogTWF0aC5yb3VuZChVdGlsLnJhbmQoYXJlYS55ICsgYXJlYS5oICogMS8zLCBhcmVhLnkrYXJlYS5oICogMi8zKSlcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tpXTtcblx0XHRcdHZhciBsaW5lID0gVXRpbC5saW5lKG1pZHBvaW50LCBicmlkZ2UpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIHBvaW50ID0gbGluZVtqXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRDZWxsID0gbGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV07XG5cdFx0XHRcdGlmIChhcmVhLmNhdmVyblR5cGUgPT0gJ3JvY2t5Jylcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHRcdGVsc2UgaWYgKGN1cnJlbnRDZWxsID09ICd3YXRlcicgfHwgY3VycmVudENlbGwgPT0gJ2xhdmEnKXtcblx0XHRcdFx0XHRpZiAoYXJlYS5mbG9vciAhPSAnZmFrZVdhdGVyJyAmJiBhcmVhLmNhdmVyblR5cGUgPT0gJ2JyaWRnZXMnKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9ICdmYWtlV2F0ZXInO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBTY3JhdGNoIHRoZSBhcmVhXG5cdFx0dmFyIHNjcmF0Y2hlcyA9IFV0aWwucmFuZCgyLDQpO1xuXHRcdHZhciBjYXZlU2VnbWVudHMgPSBbXTtcblx0XHRjYXZlU2VnbWVudHMucHVzaChtaWRwb2ludCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzY3JhdGNoZXM7IGkrKyl7XG5cdFx0XHR2YXIgcDEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihjYXZlU2VnbWVudHMpO1xuXHRcdFx0aWYgKGNhdmVTZWdtZW50cy5sZW5ndGggPiAxKVxuXHRcdFx0XHRVdGlsLnJlbW92ZUZyb21BcnJheShjYXZlU2VnbWVudHMsIHAxKTtcblx0XHRcdHZhciBwMiA9IHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKGFyZWEueCwgYXJlYS54K2FyZWEudy0xKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKGFyZWEueSwgYXJlYS55K2FyZWEuaC0xKVxuXHRcdFx0fVxuXHRcdFx0Y2F2ZVNlZ21lbnRzLnB1c2gocDIpO1xuXHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUocDIsIHAxKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGluZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBwb2ludCA9IGxpbmVbal07XG5cdFx0XHRcdHZhciBjdXJyZW50Q2VsbCA9IGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldO1xuXHRcdFx0XHRpZiAoY3VycmVudENlbGwgIT0gJ3dhdGVyJyAmJiBjdXJyZW50Q2VsbCAhPSAnbGF2YScpICBcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmaWxsV2l0aFJvb21zOiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0dmFyIGJpZ0FyZWEgPSB7XG5cdFx0XHR4OiBhcmVhLngsXG5cdFx0XHR5OiBhcmVhLnksXG5cdFx0XHR3OiBhcmVhLncsXG5cdFx0XHRoOiBhcmVhLmhcblx0XHR9XG5cdFx0dmFyIG1heERlcHRoID0gMjtcblx0XHR2YXIgTUlOX1dJRFRIID0gNjtcblx0XHR2YXIgTUlOX0hFSUdIVCA9IDY7XG5cdFx0dmFyIE1BWF9XSURUSCA9IDEwO1xuXHRcdHZhciBNQVhfSEVJR0hUID0gMTA7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX1NUQVJUID0gMy84O1xuXHRcdHZhciBTTElDRV9SQU5HRV9FTkQgPSA1Lzg7XG5cdFx0dmFyIGFyZWFzID0gU3BsaXR0ZXIuc3ViZGl2aWRlQXJlYShiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQsIGFyZWEuYnJpZGdlcyk7XG5cdFx0U3BsaXR0ZXIuY29ubmVjdEFyZWFzKGFyZWFzLCBhcmVhLndhbGwgPyAyIDogMSk7IFxuXHRcdHZhciBicmlkZ2VBcmVhcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHN1YmFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tqXTtcblx0XHRcdFx0aWYgKFNwbGl0dGVyLmdldEFyZWFBdChicmlkZ2Use3g6MCx5OjB9LCBhcmVhcykgPT0gc3ViYXJlYSl7XG5cdFx0XHRcdFx0aWYgKCFVdGlsLmNvbnRhaW5zKGJyaWRnZUFyZWFzLCBzdWJhcmVhKSl7XG5cdFx0XHRcdFx0XHRicmlkZ2VBcmVhcy5wdXNoKHN1YmFyZWEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdWJhcmVhLmJyaWRnZXMucHVzaCh7XG5cdFx0XHRcdFx0XHR4OiBicmlkZ2UueCxcblx0XHRcdFx0XHRcdHk6IGJyaWRnZS55XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51c2VBcmVhcyhicmlkZ2VBcmVhcywgYXJlYXMsIGJpZ0FyZWEpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIHN1YmFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmICghc3ViYXJlYS5yZW5kZXIpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0c3ViYXJlYS5mbG9vciA9IGFyZWEuZmxvb3I7XG5cdFx0XHRzdWJhcmVhLndhbGwgPSBhcmVhLndhbGw7XG5cdFx0XHRzdWJhcmVhLmNvcnJpZG9yID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdHRoaXMuY2FydmVSb29tQXQobGV2ZWwsIHN1YmFyZWEpO1xuXHRcdH1cblx0fSxcblx0Y2FydmVSb29tQXQ6IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHR2YXIgbWluYm94ID0ge1xuXHRcdFx0eDogYXJlYS54ICsgTWF0aC5mbG9vcihhcmVhLncgLyAyKS0xLFxuXHRcdFx0eTogYXJlYS55ICsgTWF0aC5mbG9vcihhcmVhLmggLyAyKS0xLFxuXHRcdFx0eDI6IGFyZWEueCArIE1hdGguZmxvb3IoYXJlYS53IC8gMikrMSxcblx0XHRcdHkyOiBhcmVhLnkgKyBNYXRoLmZsb29yKGFyZWEuaCAvIDIpKzEsXG5cdFx0fTtcblx0XHQvLyBUcmFjZSBjb3JyaWRvcnMgZnJvbSBleGl0c1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbaV07XG5cdFx0XHR2YXIgdmVydGljYWxCcmlkZ2UgPSBmYWxzZTtcblx0XHRcdHZhciBob3Jpem9udGFsQnJpZGdlID0gZmFsc2U7XG5cdFx0XHRpZiAoYnJpZGdlLnggPT0gYXJlYS54KXtcblx0XHRcdFx0Ly8gTGVmdCBDb3JyaWRvclxuXHRcdFx0XHRob3Jpem9udGFsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS54OyBqIDwgYnJpZGdlLnggKyBhcmVhLncgLyAyOyBqKyspe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYnJpZGdlLnggPT0gYXJlYS54ICsgYXJlYS53KXtcblx0XHRcdFx0Ly8gUmlnaHQgY29ycmlkb3Jcblx0XHRcdFx0aG9yaXpvbnRhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueDsgaiA+PSBicmlkZ2UueCAtIGFyZWEudyAvIDI7IGotLSl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGJyaWRnZS55ID09IGFyZWEueSl7XG5cdFx0XHRcdC8vIFRvcCBjb3JyaWRvclxuXHRcdFx0XHR2ZXJ0aWNhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueTsgaiA8IGJyaWRnZS55ICsgYXJlYS5oIC8gMjsgaisrKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIERvd24gQ29ycmlkb3Jcblx0XHRcdFx0dmVydGljYWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLnk7IGogPj0gYnJpZGdlLnkgLSBhcmVhLmggLyAyOyBqLS0pe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdID0gYXJlYS53YWxsOyBcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh2ZXJ0aWNhbEJyaWRnZSl7XG5cdFx0XHRcdGlmIChicmlkZ2UueCA8IG1pbmJveC54KVxuXHRcdFx0XHRcdG1pbmJveC54ID0gYnJpZGdlLng7XG5cdFx0XHRcdGlmIChicmlkZ2UueCA+IG1pbmJveC54Milcblx0XHRcdFx0XHRtaW5ib3gueDIgPSBicmlkZ2UueDtcblx0XHRcdH1cblx0XHRcdGlmIChob3Jpem9udGFsQnJpZGdlKXtcblx0XHRcdFx0aWYgKGJyaWRnZS55IDwgbWluYm94LnkpXG5cdFx0XHRcdFx0bWluYm94LnkgPSBicmlkZ2UueTtcblx0XHRcdFx0aWYgKGJyaWRnZS55ID4gbWluYm94LnkyKVxuXHRcdFx0XHRcdG1pbmJveC55MiA9IGJyaWRnZS55O1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgbWluUGFkZGluZyA9IDA7XG5cdFx0aWYgKGFyZWEud2FsbClcblx0XHRcdG1pblBhZGRpbmcgPSAxO1xuXHRcdHZhciBwYWRkaW5nID0ge1xuXHRcdFx0dG9wOiBVdGlsLnJhbmQobWluUGFkZGluZywgbWluYm94LnkgLSBhcmVhLnkgLSBtaW5QYWRkaW5nKSxcblx0XHRcdGJvdHRvbTogVXRpbC5yYW5kKG1pblBhZGRpbmcsIGFyZWEueSArIGFyZWEuaCAtIG1pbmJveC55MiAtIG1pblBhZGRpbmcpLFxuXHRcdFx0bGVmdDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIG1pbmJveC54IC0gYXJlYS54IC0gbWluUGFkZGluZyksXG5cdFx0XHRyaWdodDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIGFyZWEueCArIGFyZWEudyAtIG1pbmJveC54MiAtIG1pblBhZGRpbmcpXG5cdFx0fTtcblx0XHRpZiAocGFkZGluZy50b3AgPCAwKSBwYWRkaW5nLnRvcCA9IDA7XG5cdFx0aWYgKHBhZGRpbmcuYm90dG9tIDwgMCkgcGFkZGluZy5ib3R0b20gPSAwO1xuXHRcdGlmIChwYWRkaW5nLmxlZnQgPCAwKSBwYWRkaW5nLmxlZnQgPSAwO1xuXHRcdGlmIChwYWRkaW5nLnJpZ2h0IDwgMCkgcGFkZGluZy5yaWdodCA9IDA7XG5cdFx0dmFyIHJvb214ID0gYXJlYS54O1xuXHRcdHZhciByb29teSA9IGFyZWEueTtcblx0XHR2YXIgcm9vbXcgPSBhcmVhLnc7XG5cdFx0dmFyIHJvb21oID0gYXJlYS5oO1xuXHRcdGZvciAodmFyIHggPSByb29teDsgeCA8IHJvb214ICsgcm9vbXc7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gcm9vbXk7IHkgPCByb29teSArIHJvb21oOyB5Kyspe1xuXHRcdFx0XHR2YXIgZHJhd1dhbGwgPSBhcmVhLndhbGwgJiYgbGV2ZWwuY2VsbHNbeF1beV0gIT0gYXJlYS5jb3JyaWRvciAmJiBsZXZlbC5jZWxsc1t4XVt5XSAhPSAnYnJpZGdlJzsgXG5cdFx0XHRcdGlmICh5IDwgcm9vbXkgKyBwYWRkaW5nLnRvcCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHkgPT0gcm9vbXkgKyBwYWRkaW5nLnRvcCAtIDEgJiYgeCArIDEgPj0gcm9vbXggKyBwYWRkaW5nLmxlZnQgJiYgeCA8PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodClcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA8IHJvb214ICsgcGFkZGluZy5sZWZ0KXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeCA9PSByb29teCArIHBhZGRpbmcubGVmdCAtIDEgJiYgeSA+PSByb29teSArIHBhZGRpbmcudG9wICYmIHkgPD0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh5ID4gcm9vbXkgKyByb29taCAtIDEgLSBwYWRkaW5nLmJvdHRvbSl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHkgPT0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tICYmIHggKyAxID49IHJvb214ICsgcGFkZGluZy5sZWZ0ICYmIHggPD0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHggPiByb29teCArIHJvb213IC0gMSAtIHBhZGRpbmcucmlnaHQpe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB4ID09IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0ICYmIHkgPj0gcm9vbXkgKyBwYWRkaW5nLnRvcCAmJiB5IDw9IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSlcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYXJlYS5tYXJrZWQpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHR9LFxuXHR1c2VBcmVhczogZnVuY3Rpb24oa2VlcEFyZWFzLCBhcmVhcywgYmlnQXJlYSl7XG5cdFx0Ly8gQWxsIGtlZXAgYXJlYXMgc2hvdWxkIGJlIGNvbm5lY3RlZCB3aXRoIGEgc2luZ2xlIHBpdm90IGFyZWFcblx0XHR2YXIgcGl2b3RBcmVhID0gU3BsaXR0ZXIuZ2V0QXJlYUF0KHt4OiBNYXRoLnJvdW5kKGJpZ0FyZWEueCArIGJpZ0FyZWEudy8yKSwgeTogTWF0aC5yb3VuZChiaWdBcmVhLnkgKyBiaWdBcmVhLmgvMil9LHt4OjAseTowfSwgYXJlYXMpO1xuXHRcdHZhciBwYXRoQXJlYXMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtlZXBBcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIga2VlcEFyZWEgPSBrZWVwQXJlYXNbaV07XG5cdFx0XHRrZWVwQXJlYS5yZW5kZXIgPSB0cnVlO1xuXHRcdFx0dmFyIGFyZWFzUGF0aCA9IHRoaXMuZ2V0RHJ1bmtlbkFyZWFzUGF0aChrZWVwQXJlYSwgcGl2b3RBcmVhLCBhcmVhcyk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGFyZWFzUGF0aC5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdGFyZWFzUGF0aFtqXS5yZW5kZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoIWFyZWEucmVuZGVyKXtcblx0XHRcdFx0YnJpZGdlc1JlbW92ZTogZm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbal07XG5cdFx0XHRcdFx0aWYgKCFicmlkZ2UudG8pXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGJyaWRnZS50by5icmlkZ2VzLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHRcdHZhciBzb3VyY2VCcmlkZ2UgPSBicmlkZ2UudG8uYnJpZGdlc1trXTtcblx0XHRcdFx0XHRcdGlmIChzb3VyY2VCcmlkZ2UueCA9PSBicmlkZ2UueCAmJiBzb3VyY2VCcmlkZ2UueSA9PSBicmlkZ2UueSl7XG5cdFx0XHRcdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KGJyaWRnZS50by5icmlkZ2VzLCBzb3VyY2VCcmlkZ2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2V0RHJ1bmtlbkFyZWFzUGF0aDogZnVuY3Rpb24gKGZyb21BcmVhLCB0b0FyZWEsIGFyZWFzKXtcblx0XHR2YXIgY3VycmVudEFyZWEgPSBmcm9tQXJlYTtcblx0XHR2YXIgcGF0aCA9IFtdO1xuXHRcdHBhdGgucHVzaChmcm9tQXJlYSk7XG5cdFx0cGF0aC5wdXNoKHRvQXJlYSk7XG5cdFx0aWYgKGZyb21BcmVhID09IHRvQXJlYSlcblx0XHRcdHJldHVybiBwYXRoO1xuXHRcdHdoaWxlICh0cnVlKXtcblx0XHRcdHZhciByYW5kb21CcmlkZ2UgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihjdXJyZW50QXJlYS5icmlkZ2VzKTtcblx0XHRcdGlmICghcmFuZG9tQnJpZGdlLnRvKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdGlmICghVXRpbC5jb250YWlucyhwYXRoLCByYW5kb21CcmlkZ2UudG8pKXtcblx0XHRcdFx0cGF0aC5wdXNoKHJhbmRvbUJyaWRnZS50byk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmFuZG9tQnJpZGdlLnRvID09IHRvQXJlYSlcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjdXJyZW50QXJlYSA9IHJhbmRvbUJyaWRnZS50bztcblx0XHR9XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGhpcmRMZXZlbEdlbmVyYXRvcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0cmFuZDogZnVuY3Rpb24gKGxvdywgaGkpe1xuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaGkgLSBsb3cgKyAxKSkrbG93O1xuXHR9LFxuXHRyYW5kb21FbGVtZW50T2Y6IGZ1bmN0aW9uIChhcnJheSl7XG5cdFx0cmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSphcnJheS5sZW5ndGgpXTtcblx0fSxcblx0ZGlzdGFuY2U6IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xuXHRcdHJldHVybiBNYXRoLnNxcnQoKHgyLXgxKSooeDIteDEpICsgKHkyLXkxKSooeTIteTEpKTtcblx0fSxcblx0ZmxhdERpc3RhbmNlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mil7XG5cdFx0dmFyIHhEaXN0ID0gTWF0aC5hYnMoeDEgLSB4Mik7XG5cdFx0dmFyIHlEaXN0ID0gTWF0aC5hYnMoeTEgLSB5Mik7XG5cdFx0aWYgKHhEaXN0ID09PSB5RGlzdClcblx0XHRcdHJldHVybiB4RGlzdDtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4geERpc3QgKyB5RGlzdDtcblx0fSxcblx0bGluZURpc3RhbmNlOiBmdW5jdGlvbihwb2ludDEsIHBvaW50Mil7XG5cdCAgdmFyIHhzID0gMDtcblx0ICB2YXIgeXMgPSAwO1xuXHQgIHhzID0gcG9pbnQyLnggLSBwb2ludDEueDtcblx0ICB4cyA9IHhzICogeHM7XG5cdCAgeXMgPSBwb2ludDIueSAtIHBvaW50MS55O1xuXHQgIHlzID0geXMgKiB5cztcblx0ICByZXR1cm4gTWF0aC5zcXJ0KCB4cyArIHlzICk7XG5cdH0sXG5cdGRpcmVjdGlvbjogZnVuY3Rpb24gKGEsYil7XG5cdFx0cmV0dXJuIHt4OiBzaWduKGIueCAtIGEueCksIHk6IHNpZ24oYi55IC0gYS55KX07XG5cdH0sXG5cdGNoYW5jZTogZnVuY3Rpb24gKGNoYW5jZSl7XG5cdFx0cmV0dXJuIHRoaXMucmFuZCgwLDEwMCkgPD0gY2hhbmNlO1xuXHR9LFxuXHRjb250YWluczogZnVuY3Rpb24oYXJyYXksIGVsZW1lbnQpe1xuXHQgICAgcmV0dXJuIGFycmF5LmluZGV4T2YoZWxlbWVudCkgPiAtMTtcblx0fSxcblx0cmVtb3ZlRnJvbUFycmF5OiBmdW5jdGlvbihhcnJheSwgb2JqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiAoYXJyYXlbaV0gPT0gb2JqZWN0KXtcblx0XHRcdFx0dGhpcy5yZW1vdmVGcm9tQXJyYXlJbmRleChhcnJheSwgaSxpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cmVtb3ZlRnJvbUFycmF5SW5kZXg6IGZ1bmN0aW9uKGFycmF5LCBmcm9tLCB0bykge1xuXHRcdHZhciByZXN0ID0gYXJyYXkuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCBhcnJheS5sZW5ndGgpO1xuXHRcdGFycmF5Lmxlbmd0aCA9IGZyb20gPCAwID8gYXJyYXkubGVuZ3RoICsgZnJvbSA6IGZyb207XG5cdFx0cmV0dXJuIGFycmF5LnB1c2guYXBwbHkoYXJyYXksIHJlc3QpO1xuXHR9LFxuXHRsaW5lOiBmdW5jdGlvbiAoYSwgYil7XG5cdFx0dmFyIGNvb3JkaW5hdGVzQXJyYXkgPSBuZXcgQXJyYXkoKTtcblx0XHR2YXIgeDEgPSBhLng7XG5cdFx0dmFyIHkxID0gYS55O1xuXHRcdHZhciB4MiA9IGIueDtcblx0XHR2YXIgeTIgPSBiLnk7XG5cdCAgICB2YXIgZHggPSBNYXRoLmFicyh4MiAtIHgxKTtcblx0ICAgIHZhciBkeSA9IE1hdGguYWJzKHkyIC0geTEpO1xuXHQgICAgdmFyIHN4ID0gKHgxIDwgeDIpID8gMSA6IC0xO1xuXHQgICAgdmFyIHN5ID0gKHkxIDwgeTIpID8gMSA6IC0xO1xuXHQgICAgdmFyIGVyciA9IGR4IC0gZHk7XG5cdCAgICBjb29yZGluYXRlc0FycmF5LnB1c2goe3g6IHgxLCB5OiB5MX0pO1xuXHQgICAgd2hpbGUgKCEoKHgxID09IHgyKSAmJiAoeTEgPT0geTIpKSkge1xuXHQgICAgXHR2YXIgZTIgPSBlcnIgPDwgMTtcblx0ICAgIFx0aWYgKGUyID4gLWR5KSB7XG5cdCAgICBcdFx0ZXJyIC09IGR5O1xuXHQgICAgXHRcdHgxICs9IHN4O1xuXHQgICAgXHR9XG5cdCAgICBcdGlmIChlMiA8IGR4KSB7XG5cdCAgICBcdFx0ZXJyICs9IGR4O1xuXHQgICAgXHRcdHkxICs9IHN5O1xuXHQgICAgXHR9XG5cdCAgICBcdGNvb3JkaW5hdGVzQXJyYXkucHVzaCh7eDogeDEsIHk6IHkxfSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY29vcmRpbmF0ZXNBcnJheTtcblx0fVxufSIsIndpbmRvdy5HZW5lcmF0b3IgPSByZXF1aXJlKCcuL0dlbmVyYXRvci5jbGFzcycpO1xud2luZG93LkNhbnZhc1JlbmRlcmVyID0gcmVxdWlyZSgnLi9DYW52YXNSZW5kZXJlci5jbGFzcycpO1xud2luZG93LktyYW1naW5lRXhwb3J0ZXIgPSByZXF1aXJlKCcuL0tyYW1naW5lRXhwb3J0ZXIuY2xhc3MnKTsiXX0=
