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
			depth: depth
			
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJ1bkNBOiBmdW5jdGlvbihtYXAsIHRyYW5zZm9ybUZ1bmN0aW9uLCB0aW1lcywgY3Jvc3Mpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkrKyl7XG5cdFx0XHR2YXIgbmV3TWFwID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKyl7XG5cdFx0XHRcdG5ld01hcFt4XSA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4Kyspe1xuXHRcdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKyl7XG5cdFx0XHRcdFx0dmFyIHN1cnJvdW5kaW5nTWFwID0gW107XG5cdFx0XHRcdFx0Zm9yICh2YXIgeHggPSB4LTE7IHh4IDw9IHgrMTsgeHgrKyl7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciB5eSA9IHktMTsgeXkgPD0geSsxOyB5eSsrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGNyb3NzICYmICEoeHggPT0geCB8fCB5eSA9PSB5KSlcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0aWYgKHh4ID4gMCAmJiB4eCA8IG1hcC5sZW5ndGggJiYgeXkgPiAwICYmIHl5IDwgbWFwW3hdLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNlbGwgPSBtYXBbeHhdW3l5XTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc3Vycm91bmRpbmdNYXBbY2VsbF0pXG5cdFx0XHRcdFx0XHRcdFx0XHRzdXJyb3VuZGluZ01hcFtjZWxsXSsrO1xuXHRcdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdHN1cnJvdW5kaW5nTWFwW2NlbGxdID0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbmV3Q2VsbCA9IHRyYW5zZm9ybUZ1bmN0aW9uKG1hcFt4XVt5XSwgc3Vycm91bmRpbmdNYXApO1xuXHRcdFx0XHRcdGlmIChuZXdDZWxsKXtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG5ld0NlbGw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5ld01hcFt4XVt5XSA9IG1hcFt4XVt5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1hcCA9IG5ld01hcDtcblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufSIsImZ1bmN0aW9uIENhbnZhc1JlbmRlcmVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUgPSB7XG5cdGRyYXdTa2V0Y2g6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMsIG92ZXJsYXkpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTZweCBBdmF0YXJcIjtcblx0XHRpZiAoIW92ZXJsYXkpXG5cdFx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gbGV2ZWwuYXJlYXNbaV07XG5cdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y29udGV4dC5yZWN0KGFyZWEueCAqIHpvb20sIGFyZWEueSAqIHpvb20sIGFyZWEudyAqIHpvb20sIGFyZWEuaCAqIHpvb20pO1xuXHRcdFx0aWYgKCFvdmVybGF5KXtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAneWVsbG93Jztcblx0XHRcdFx0Y29udGV4dC5maWxsKCk7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcblx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR2YXIgYXJlYURlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHRpZiAoYXJlYS5hcmVhVHlwZSA9PSAncm9vbXMnKXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJEdW5nZW9uXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZWEuZmxvb3IgPT0gJ2Zha2VXYXRlcicpeyBcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJMYWdvb25cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiA9IFwiQ2F2ZXJuXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYS5oYXNFeGl0KXtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uICs9IFwiIChkKVwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGFyZWEuaGFzRW50cmFuY2Upe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gKz0gXCIgKHUpXCI7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cdFx0XHRjb250ZXh0LmZpbGxUZXh0KGFyZWFEZXNjcmlwdGlvbiwoYXJlYS54KSogem9vbSArIDUsKGFyZWEueSApKiB6b29tICsgMjApO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRjb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRjb250ZXh0LnJlY3QoKGJyaWRnZS54KSAqIHpvb20gLyotIHpvb20gLyAyKi8sIChicmlkZ2UueSkgKiB6b29tIC8qLSB6b29tIC8gMiovLCB6b29tLCB6b29tKTtcblx0XHRcdFx0Y29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG5cdFx0XHRcdGNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRkcmF3TGV2ZWw6IGZ1bmN0aW9uKGxldmVsLCBjYW52YXMpe1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXMpO1xuXHRcdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0Y29udGV4dC5mb250PVwiMTJweCBHZW9yZ2lhXCI7XG5cdFx0Y29udGV4dC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblx0XHR2YXIgem9vbSA9IDg7XG5cdFx0dmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRcdHZhciBjZWxsID0gY2VsbHNbeF1beV07XG5cdFx0XHRcdGlmIChjZWxsID09PSAnd2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdmYWtlV2F0ZXInKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDAwMEZGJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNTk0QjJEJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjYXZlcm5GbG9vcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM4NzY0MTgnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2Rvd25zdGFpcnMnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjRkYwMDAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMEZGMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lV2FsbCcpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNCQkJCQkInO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3N0b25lRmxvb3InKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjNjY2NjY2Jztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3BhZGRpbmcnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjMDBGRjAwJztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRjb2xvciA9ICcjOTQ2ODAwJztcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxSZWN0KHggKiB6b29tLCB5ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0dmFyIGNvbG9yID0gJyNGRkZGRkYnO1xuXHRcdFx0c3dpdGNoIChlbmVteS5jb2RlKXtcblx0XHRcdGNhc2UgJ2JhdCc6XG5cdFx0XHRcdGNvbG9yID0gJyNFRUVFRUUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xhdmFMaXphcmQnOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdkYWVtb24nOlxuXHRcdFx0XHRjb2xvciA9ICcjRkY4ODAwJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChlbmVteS54ICogem9vbSwgZW5lbXkueSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRzd2l0Y2ggKGl0ZW0uY29kZSl7XG5cdFx0XHRjYXNlICdkYWdnZXInOlxuXHRcdFx0XHRjb2xvciA9ICcjRUVFRUVFJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsZWF0aGVyQXJtb3InOlxuXHRcdFx0XHRjb2xvciA9ICcjMDBGRjg4Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0Y29udGV4dC5maWxsUmVjdChpdGVtLnggKiB6b29tLCBpdGVtLnkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHR9XG5cdH0sXG5cdGRyYXdMZXZlbFdpdGhJY29uczogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcyl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxMnB4IEdlb3JnaWFcIjtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHR2YXIgd2F0ZXIgPSBuZXcgSW1hZ2UoKTtcblx0XHR3YXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIGZha2VXYXRlciA9IG5ldyBJbWFnZSgpO1xuXHRcdGZha2VXYXRlci5zcmMgPSAnaW1nL3dhdGVyLnBuZyc7XG5cdFx0dmFyIHNvbGlkUm9jayA9IG5ldyBJbWFnZSgpO1xuXHRcdHNvbGlkUm9jay5zcmMgPSAnaW1nL3NvbGlkUm9jay5wbmcnO1xuXHRcdHZhciBjYXZlcm5GbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdGNhdmVybkZsb29yLnNyYyA9ICdpbWcvY2F2ZXJuRmxvb3IucG5nJztcblx0XHR2YXIgZG93bnN0YWlycyA9IG5ldyBJbWFnZSgpO1xuXHRcdGRvd25zdGFpcnMuc3JjID0gJ2ltZy9kb3duc3RhaXJzLnBuZyc7XG5cdFx0dmFyIHVwc3RhaXJzID0gbmV3IEltYWdlKCk7XG5cdFx0dXBzdGFpcnMuc3JjID0gJ2ltZy91cHN0YWlycy5wbmcnO1xuXHRcdHZhciBzdG9uZVdhbGwgPSBuZXcgSW1hZ2UoKTtcblx0XHRzdG9uZVdhbGwuc3JjID0gJ2ltZy9zdG9uZVdhbGwucG5nJztcblx0XHR2YXIgc3RvbmVGbG9vciA9IG5ldyBJbWFnZSgpO1xuXHRcdHN0b25lRmxvb3Iuc3JjID0gJ2ltZy9zdG9uZUZsb29yLnBuZyc7XG5cdFx0dmFyIGJyaWRnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdGJyaWRnZS5zcmMgPSAnaW1nL2JyaWRnZS5wbmcnO1xuXHRcdHZhciBsYXZhID0gbmV3IEltYWdlKCk7XG5cdFx0bGF2YS5zcmMgPSAnaW1nL2xhdmEucG5nJztcblx0XHR2YXIgYmF0ID0gbmV3IEltYWdlKCk7XG5cdFx0YmF0LnNyYyA9ICdpbWcvYmF0LnBuZyc7XG5cdFx0dmFyIGxhdmFMaXphcmQgPSBuZXcgSW1hZ2UoKTtcblx0XHRsYXZhTGl6YXJkLnNyYyA9ICdpbWcvbGF2YUxpemFyZC5wbmcnO1xuXHRcdHZhciBkYWVtb24gPSBuZXcgSW1hZ2UoKTtcblx0XHRkYWVtb24uc3JjID0gJ2ltZy9kYWVtb24ucG5nJztcblx0XHR2YXIgdHJlYXN1cmUgPSBuZXcgSW1hZ2UoKTtcblx0XHR0cmVhc3VyZS5zcmMgPSAnaW1nL3RyZWFzdXJlLnBuZyc7XG5cdFx0dmFyIHRpbGVzID0ge1xuXHRcdFx0d2F0ZXI6IHdhdGVyLFxuXHRcdFx0ZmFrZVdhdGVyOiBmYWtlV2F0ZXIsXG5cdFx0XHRzb2xpZFJvY2s6IHNvbGlkUm9jayxcblx0XHRcdGNhdmVybkZsb29yOiBjYXZlcm5GbG9vcixcblx0XHRcdGRvd25zdGFpcnM6IGRvd25zdGFpcnMsXG5cdFx0XHR1cHN0YWlyczogdXBzdGFpcnMsXG5cdFx0XHRzdG9uZVdhbGw6IHN0b25lV2FsbCxcblx0XHRcdHN0b25lRmxvb3I6IHN0b25lRmxvb3IsXG5cdFx0XHRicmlkZ2U6IGJyaWRnZSxcblx0XHRcdGxhdmE6IGxhdmEsXG5cdFx0XHRiYXQ6IGJhdCxcblx0XHRcdGxhdmFMaXphcmQ6IGxhdmFMaXphcmQsXG5cdFx0XHRkYWVtb246IGRhZW1vbixcblx0XHRcdHRyZWFzdXJlOiB0cmVhc3VyZVxuXHRcdH1cblx0ICAgIHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTsgXG5cdFx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRpbGVzW2NlbGxdLCB4ICogMTYsIHkgKiAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuZW5lbWllcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgZW5lbXkgPSBsZXZlbC5lbmVtaWVzW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbZW5lbXkuY29kZV0sIGVuZW15LnggKiAxNiwgZW5lbXkueSAqIDE2KTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5pdGVtcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IGxldmVsLml0ZW1zW2ldO1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbJ3RyZWFzdXJlJ10sIGl0ZW0ueCAqIDE2LCBpdGVtLnkgKiAxNik7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzUmVuZGVyZXI7IiwiZnVuY3Rpb24gRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgU3BsaXR0ZXIgPSByZXF1aXJlKCcuL1NwbGl0dGVyJyk7XG5cbkZpcnN0TGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRMQVZBX0NIQU5DRTogICAgIFsxMDAsICAwLCAyMCwgIDAsMTAwLCAxMCwgNTAsMTAwXSxcblx0V0FURVJfQ0hBTkNFOiAgICBbICAwLDEwMCwgMTAsMTAwLCAgMCwgNTAsICAwLCAgMF0sXG5cdENBVkVSTl9DSEFOQ0U6ICAgWyA4MCwgODAsIDIwLCAyMCwgNjAsIDkwLCAxMCwgNTBdLFxuXHRMQUdPT05fQ0hBTkNFOiAgIFsgIDAsIDUwLCAxMCwgMjAsICAwLCAzMCwgIDAsICAwXSxcblx0V0FMTExFU1NfQ0hBTkNFOiBbIDUwLCAxMCwgODAsIDkwLCAxMCwgOTAsIDEwLCA1MF0sXG5cdEdBTkdTOiBbXG5cdFx0WyAvLyBMZXZlbCAxXG5cdFx0XHR7Ym9zczogJ2RhZW1vbicsIG1pbmlvbnM6IFsnZmlyZWxpemFyZCddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7bWluaW9uczogWydmaXJlbGl6YXJkJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7Ym9zczogJ2h5ZHJhJywgbWluaW9uczogWydmaXJlbGl6YXJkJ10sIHF1YW50aXR5OiA1fVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCAyXG5cdFx0XHR7Ym9zczogJ2RhZW1vbicsIG1pbmlvbnM6IFsnc2VhU2VycGVudCcsICdvY3RvcHVzJywgJ25peGllJ10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHtib3NzOiAnaHlkcmEnLCBtaW5pb25zOiBbJ3NlYVNlcnBlbnQnLCAnb2N0b3B1cycsICduaXhpZSddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnc2VhU2VycGVudCcsICdvY3RvcHVzJywgJ25peGllJ10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHttaW5pb25zOiBbJ3NlYVNlcnBlbnQnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHttaW5pb25zOiBbJ25peGllJ10sIHF1YW50aXR5OiAxMH1cblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgM1xuXHRcdFx0e21pbmlvbnM6IFsnZGFlbW9uJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnZGFlbW9uJ10sIHF1YW50aXR5OiAzfSxcblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgNFxuXHRcdFx0e2Jvc3M6ICdnYXplcicsIG1pbmlvbnM6IFsnaGVhZGxlc3MnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2Jvc3M6ICdsaWNoZScsIG1pbmlvbnM6IFsnZ2hvc3QnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2Jvc3M6ICdkYWVtb24nLCBtaW5pb25zOiBbJ2dhemVyJywgJ2dyZW1saW4nXSwgcXVhbnRpdHk6IDV9LFxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA1XG5cdFx0XHR7bWluaW9uczogWydkcmFnb24nLCAnem9ybicsICdiYWxyb24nXSwgcXVhbnRpdHk6IDZ9LFxuXHRcdFx0e21pbmlvbnM6IFsncmVhcGVyJywgJ2dhemVyJywgJ3BoYW50b20nXSwgcXVhbnRpdHk6IDZ9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2hlYWRsZXNzJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7Ym9zczogJ3pvcm4nLCBtaW5pb25zOiBbJ2hlYWRsZXNzJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7bWluaW9uczogWydkcmFnb24nLCAnbGF2YUxpemFyZCddLCBxdWFudGl0eTogMTB9LFxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA2XG5cdFx0XHR7bWluaW9uczogWydyZWFwZXInXSwgcXVhbnRpdHk6IDZ9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ2RhZW1vbiddLCBxdWFudGl0eTogNn0sXG5cdFx0XHR7YXJlYVR5cGU6ICdjYXZlJywgbWluaW9uczogWydiYXQnXSwgcXVhbnRpdHk6IDE1fSxcblx0XHRcdHthcmVhVHlwZTogJ2NhdmUnLCBib3NzOiAndHdpc3RlcicsIG1pbmlvbnM6IFsnc2VhU2VycGVudCddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnaHlkcmEnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydtYWdlJ10sIHF1YW50aXR5OiAxMH1cblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgN1xuXHRcdFx0e21pbmlvbnM6IFsnaGVhZGxlc3MnXSwgcXVhbnRpdHk6IDIwfSxcblx0XHRcdHttaW5pb25zOiBbJ2h5ZHJhJ10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHttaW5pb25zOiBbJ3NrZWxldG9uJywgJ3dpc3AnLCAnZ2hvc3QnXSwgcXVhbnRpdHk6IDE1fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydza2VsZXRvbiddLCBxdWFudGl0eTogMjB9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDhcblx0XHRcdHttaW5pb25zOiBbJ2RyYWdvbicsICdkYWVtb24nLCAnYmFscm9uJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7bWluaW9uczogWyd3YXJyaW9yJywgJ21hZ2UnLCAnYmFyZCcsICdkcnVpZCcsICd0aW5rZXInLCAncGFsYWRpbicsICdzaGVwaGVyZCcsICdyYW5nZXInXSwgcXVhbnRpdHk6IDE1fSxcblx0XHRcdHttaW5pb25zOiBbJ2dhemVyJywgJ2JhbHJvbiddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e2Jvc3M6ICdsaWNoZScsIG1pbmlvbnM6IFsnc2tlbGV0b24nXSwgcXVhbnRpdHk6IDIwfSxcblx0XHRcdHttaW5pb25zOiBbJ2dob3N0JywgJ3dpc3AnXSwgcXVhbnRpdHk6IDIwfSxcblx0XHRcdHttaW5pb25zOiBbJ2xhdmFMaXphcmRzJ10sIHF1YW50aXR5OiAyMH1cblx0XHRdXHRcdFxuXHRdLFxuXG5cdFxuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dmFyIGhhc1JpdmVyID0gVXRpbC5jaGFuY2UodGhpcy5XQVRFUl9DSEFOQ0VbZGVwdGgtMV0pO1xuXHRcdHZhciBoYXNMYXZhID0gVXRpbC5jaGFuY2UodGhpcy5MQVZBX0NIQU5DRVtkZXB0aC0xXSk7XG5cdFx0dmFyIG1haW5FbnRyYW5jZSA9IGRlcHRoID09IDE7XG5cdFx0dmFyIGFyZWFzID0gdGhpcy5nZW5lcmF0ZUFyZWFzKGRlcHRoLCBoYXNMYXZhKTtcblx0XHR0aGlzLnBsYWNlRXhpdHMoYXJlYXMpO1xuXHRcdHZhciBsZXZlbCA9IHtcblx0XHRcdGhhc1JpdmVyczogaGFzUml2ZXIsXG5cdFx0XHRoYXNMYXZhOiBoYXNMYXZhLFxuXHRcdFx0bWFpbkVudHJhbmNlOiBtYWluRW50cmFuY2UsXG5cdFx0XHRzdHJhdGE6ICdzb2xpZFJvY2snLFxuXHRcdFx0YXJlYXM6IGFyZWFzLFxuXHRcdFx0ZGVwdGg6IGRlcHRoXG5cdFx0XHRcblx0XHR9IFxuXHRcdHJldHVybiBsZXZlbDtcblx0fSxcblx0Z2VuZXJhdGVBcmVhczogZnVuY3Rpb24oZGVwdGgsIGhhc0xhdmEpe1xuXHRcdHZhciBiaWdBcmVhID0ge1xuXHRcdFx0eDogMCxcblx0XHRcdHk6IDAsXG5cdFx0XHR3OiB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCxcblx0XHRcdGg6IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVFxuXHRcdH1cblx0XHR2YXIgbWF4RGVwdGggPSB0aGlzLmNvbmZpZy5TVUJESVZJU0lPTl9ERVBUSDtcblx0XHR2YXIgTUlOX1dJRFRIID0gdGhpcy5jb25maWcuTUlOX1dJRFRIO1xuXHRcdHZhciBNSU5fSEVJR0hUID0gdGhpcy5jb25maWcuTUlOX0hFSUdIVDtcblx0XHR2YXIgTUFYX1dJRFRIID0gdGhpcy5jb25maWcuTUFYX1dJRFRIO1xuXHRcdHZhciBNQVhfSEVJR0hUID0gdGhpcy5jb25maWcuTUFYX0hFSUdIVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfU1RBUlQgPSB0aGlzLmNvbmZpZy5TTElDRV9SQU5HRV9TVEFSVDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfRU5EID0gdGhpcy5jb25maWcuU0xJQ0VfUkFOR0VfRU5EO1xuXHRcdHZhciBhcmVhcyA9IFNwbGl0dGVyLnN1YmRpdmlkZUFyZWEoYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5EKTtcblx0XHRTcGxpdHRlci5jb25uZWN0QXJlYXMoYXJlYXMsMyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0dGhpcy5zZXRBcmVhRGV0YWlscyhhcmVhLCBkZXB0aCwgaGFzTGF2YSk7XG5cdFx0fVxuXHRcdHJldHVybiBhcmVhcztcblx0fSxcblx0c2V0QXJlYURldGFpbHM6IGZ1bmN0aW9uKGFyZWEsIGRlcHRoLCBoYXNMYXZhKXtcblx0XHRpZiAoVXRpbC5jaGFuY2UodGhpcy5DQVZFUk5fQ0hBTkNFW2RlcHRoLTFdKSl7XG5cdFx0XHRhcmVhLmFyZWFUeXBlID0gJ2NhdmVybic7XG5cdFx0XHRpZiAoaGFzTGF2YSl7XG5cdFx0XHRcdGFyZWEuZmxvb3IgPSAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0XHRhcmVhLmNhdmVyblR5cGUgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihbJ3JvY2t5JywnYnJpZGdlcyddKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChVdGlsLmNoYW5jZSh0aGlzLkxBR09PTl9DSEFOQ0VbZGVwdGgtMV0pKXtcblx0XHRcdFx0XHRhcmVhLmZsb29yID0gJ2Zha2VXYXRlcic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXJlYS5mbG9vciA9ICdjYXZlcm5GbG9vcic7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXJlYS5jYXZlcm5UeXBlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoWydyb2NreScsJ2JyaWRnZXMnLCd3YXRlcnknXSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFyZWEuYXJlYVR5cGUgPSAncm9vbXMnO1xuXHRcdFx0YXJlYS5mbG9vciA9ICdzdG9uZUZsb29yJztcblx0XHRcdGFyZWEud2FsbCA9IFV0aWwuY2hhbmNlKHRoaXMuV0FMTExFU1NfQ0hBTkNFW2RlcHRoLTFdKSA/IGZhbHNlIDogJ3N0b25lV2FsbCc7XG5cdFx0XHRhcmVhLmNvcnJpZG9yID0gJ3N0b25lRmxvb3InO1xuXHRcdH1cblx0XHRhcmVhLmVuZW1pZXMgPSBbXTtcblx0XHRhcmVhLml0ZW1zID0gW107XG5cdFx0XG5cdFx0dmFyIHJhbmRvbUdhbmcgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZih0aGlzLkdBTkdTW2RlcHRoLTFdKTtcblx0XHRhcmVhLmVuZW1pZXMgPSByYW5kb21HYW5nLm1pbmlvbnM7XG5cdFx0YXJlYS5lbmVteUNvdW50ID0gcmFuZG9tR2FuZy5xdWFudGl0eSArIFV0aWwucmFuZCgwLDMpO1xuXHRcdGlmIChyYW5kb21HYW5nKVxuXHRcdFx0YXJlYS5ib3NzID0gcmFuZG9tR2FuZy5ib3NzO1xuXHR9LFxuXHRwbGFjZUV4aXRzOiBmdW5jdGlvbihhcmVhcyl7XG5cdFx0dmFyIGRpc3QgPSBudWxsO1xuXHRcdHZhciBhcmVhMSA9IG51bGw7XG5cdFx0dmFyIGFyZWEyID0gbnVsbDtcblx0XHR2YXIgZnVzZSA9IDEwMDA7XG5cdFx0ZG8ge1xuXHRcdFx0YXJlYTEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhcyk7XG5cdFx0XHRhcmVhMiA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRcdGlmIChmdXNlIDwgMCl7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0ZGlzdCA9IFV0aWwubGluZURpc3RhbmNlKGFyZWExLCBhcmVhMik7XG5cdFx0XHRmdXNlLS07XG5cdFx0fSB3aGlsZSAoZGlzdCA8ICh0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCArIHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVCkgLyAzKTtcblx0XHRhcmVhMS5oYXNFeGl0ID0gdHJ1ZTtcblx0XHRhcmVhMi5oYXNFbnRyYW5jZSA9IHRydWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaXJzdExldmVsR2VuZXJhdG9yOyIsImZ1bmN0aW9uIEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0dGhpcy5maXJzdExldmVsR2VuZXJhdG9yID0gbmV3IEZpcnN0TGV2ZWxHZW5lcmF0b3IoY29uZmlnKTtcblx0dGhpcy5zZWNvbmRMZXZlbEdlbmVyYXRvciA9IG5ldyBTZWNvbmRMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLnRoaXJkTGV2ZWxHZW5lcmF0b3IgPSBuZXcgVGhpcmRMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLm1vbnN0ZXJQb3B1bGF0b3IgPSBuZXcgTW9uc3RlclBvcHVsYXRvcihjb25maWcpO1xuXHR0aGlzLml0ZW1Qb3B1bGF0b3IgPSBuZXcgSXRlbVBvcHVsYXRvcihjb25maWcpO1xufVxuXG52YXIgRmlyc3RMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vRmlyc3RMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIFNlY29uZExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9TZWNvbmRMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIFRoaXJkTGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL1RoaXJkTGV2ZWxHZW5lcmF0b3IuY2xhc3MnKTtcbnZhciBNb25zdGVyUG9wdWxhdG9yID0gcmVxdWlyZSgnLi9Nb25zdGVyUG9wdWxhdG9yLmNsYXNzJyk7XG52YXIgSXRlbVBvcHVsYXRvciA9IHJlcXVpcmUoJy4vSXRlbVBvcHVsYXRvci5jbGFzcycpO1xuXG5HZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRnZW5lcmF0ZUxldmVsOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dmFyIHNrZXRjaCA9IHRoaXMuZmlyc3RMZXZlbEdlbmVyYXRvci5nZW5lcmF0ZUxldmVsKGRlcHRoKTtcblx0XHR2YXIgbGV2ZWwgPSB0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yLmZpbGxMZXZlbChza2V0Y2gpO1xuXHRcdHRoaXMudGhpcmRMZXZlbEdlbmVyYXRvci5maWxsTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5zZWNvbmRMZXZlbEdlbmVyYXRvci5mcmFtZUxldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMubW9uc3RlclBvcHVsYXRvci5wb3B1bGF0ZUxldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHRoaXMuaXRlbVBvcHVsYXRvci5wb3B1bGF0ZUxldmVsKHNrZXRjaCwgbGV2ZWwpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRza2V0Y2g6IHNrZXRjaCxcblx0XHRcdGxldmVsOiBsZXZlbFxuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjsiLCJmdW5jdGlvbiBJdGVtUG9wdWxhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuSXRlbVBvcHVsYXRvci5wcm90b3R5cGUgPSB7XG5cdHBvcHVsYXRlTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdHRoaXMuY2FsY3VsYXRlUmFyaXRpZXMobGV2ZWwuZGVwdGgpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0dGhpcy5wb3B1bGF0ZUFyZWEoYXJlYSwgbGV2ZWwpO1xuXHRcdH1cblx0fSxcblx0cG9wdWxhdGVBcmVhOiBmdW5jdGlvbihhcmVhLCBsZXZlbCl7XG5cdFx0dmFyIGl0ZW1zID0gVXRpbC5yYW5kKDAsMik7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtczsgaSsrKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdHZhciBpdGVtID0gdGhpcy5nZXRBbkl0ZW0oKTtcblx0XHRcdGxldmVsLmFkZEl0ZW0oaXRlbSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0fVxuXHR9LFxuXHRjYWxjdWxhdGVSYXJpdGllczogZnVuY3Rpb24oZGVwdGgpe1xuXHRcdHRoaXMudGhyZXNob2xkcyA9IFtdO1xuXHRcdHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsID0gMDtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuSVRFTVMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLklURU1TW2ldO1xuXHRcdFx0dmFyIG1hbHVzID0gTWF0aC5hYnMoZGVwdGgtaXRlbS5kZXB0aCkgPiAxO1xuXHRcdFx0dmFyIHJhcml0eSA9IG1hbHVzID8gaXRlbS5yYXJpdHkgLyAyIDogaXRlbS5yYXJpdHk7XG5cdFx0XHR0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCArPSByYXJpdHk7XG5cdFx0XHR0aGlzLnRocmVzaG9sZHMucHVzaCh7dGhyZXNob2xkOiB0aGlzLmdlbmVyYXRpb25DaGFuY2VUb3RhbCwgaXRlbTogaXRlbX0pO1xuXHRcdH1cblx0fSxcblx0SVRFTVM6IFtcblx0XHQvKntjb2RlOiAnZGFnZ2VyJywgcmFyaXR5OiAzNTAwfSxcblx0XHR7Y29kZTogJ29pbEZsYXNrJywgcmFyaXR5OiAxNDAwfSxcblx0XHR7Y29kZTogJ3N0YWZmJywgcmFyaXR5OiAzNTB9LFxuXHRcdHtjb2RlOiAnc2xpbmcnLCByYXJpdHk6IDI4MH0sXG5cdFx0e2NvZGU6ICdtYWNlJywgcmFyaXR5OiA3MH0sXG5cdFx0e2NvZGU6ICdheGUnLCByYXJpdHk6IDMxfSxcblx0XHR7Y29kZTogJ2JvdycsIHJhcml0eTogMjh9LFxuXHRcdHtjb2RlOiAnc3dvcmQnLCByYXJpdHk6IDM1MH0sXG5cdFx0e2NvZGU6ICdoYWxiZXJkJywgcmFyaXR5OiAyM30sXG5cdFx0e2NvZGU6ICdjcm9zc2JvdycsIHJhcml0eTogMTF9LFxuXHRcdHtjb2RlOiAnbWFnaWNBeGUnLCByYXJpdHk6IDV9LFxuXHRcdHtjb2RlOiAnbWFnaWNCb3cnLCByYXJpdHk6IDR9LFxuXHRcdHtjb2RlOiAnbWFnaWNTd29yZCcsIHJhcml0eTogNH0sXG5cdFx0e2NvZGU6ICdtYWdpY1dhbmQnLCByYXJpdHk6IDJ9LFxuXHRcdHtjb2RlOiAnY2xvdGgnLCByYXJpdHk6IDE0MH0sXG5cdFx0e2NvZGU6ICdsZWF0aGVyJywgcmFyaXR5OiAzNX0sXG5cdFx0e2NvZGU6ICdjaGFpbicsIHJhcml0eTogMTJ9LFxuXHRcdHtjb2RlOiAncGxhdGUnLCByYXJpdHk6IDR9LFxuXHRcdHtjb2RlOiAnbWFnaWNDaGFpbicsIHJhcml0eTogMn0sXG5cdFx0e2NvZGU6ICdtYWdpY1BsYXRlJywgcmFyaXR5OiAxfSovXG5cdFx0e2NvZGU6ICdjdXJlJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICdoZWFsJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICdyZWRQb3Rpb24nLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAxfSxcblx0XHR7Y29kZTogJ3llbGxvd1BvdGlvbicsIHJhcml0eTogMTAwMCwgZGVwdGg6IDF9LFxuXHRcdHtjb2RlOiAnbGlnaHQnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAyfSxcblx0XHR7Y29kZTogJ21pc3NpbGUnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAzfSxcblx0XHR7Y29kZTogJ2ljZWJhbGwnLCByYXJpdHk6IDUwMCwgZGVwdGg6IDR9LFxuXHRcdHtjb2RlOiAncmVwZWwnLCByYXJpdHk6IDUwMCwgZGVwdGg6IDV9LFxuXHRcdHtjb2RlOiAnYmxpbmsnLCByYXJpdHk6IDMzMywgZGVwdGg6IDV9LFxuXHRcdHtjb2RlOiAnZmlyZWJhbGwnLCByYXJpdHk6IDMzMywgZGVwdGg6IDZ9LFxuXHRcdHtjb2RlOiAncHJvdGVjdGlvbicsIHJhcml0eTogMjUwLCBkZXB0aDogNn0sXG5cdFx0e2NvZGU6ICd0aW1lJywgcmFyaXR5OiAyMDAsIGRlcHRoOiA3fSxcblx0XHR7Y29kZTogJ3NsZWVwJywgcmFyaXR5OiAyMDAsIGRlcHRoOiA3fSxcblx0XHR7Y29kZTogJ2ppbngnLCByYXJpdHk6IDE2NiwgZGVwdGg6IDh9LFxuXHRcdHtjb2RlOiAndHJlbW9yJywgcmFyaXR5OiAxNjYsIGRlcHRoOiA4fSxcblx0XHR7Y29kZTogJ2tpbGwnLCByYXJpdHk6IDE0MiwgZGVwdGg6IDh9XG5cdF0sXG5cdGdldEFuSXRlbTogZnVuY3Rpb24oKXtcblx0XHR2YXIgbnVtYmVyID0gVXRpbC5yYW5kKDAsIHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGhyZXNob2xkcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRpZiAobnVtYmVyIDw9IHRoaXMudGhyZXNob2xkc1tpXS50aHJlc2hvbGQpXG5cdFx0XHRcdHJldHVybiB0aGlzLnRocmVzaG9sZHNbaV0uaXRlbS5jb2RlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy50aHJlc2hvbGRzWzBdLml0ZW0uY29kZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEl0ZW1Qb3B1bGF0b3I7IiwiZnVuY3Rpb24gS3JhbWdpbmVFeHBvcnRlcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxuS3JhbWdpbmVFeHBvcnRlci5wcm90b3R5cGUgPSB7XG5cdGdldExldmVsOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIHRpbGVzID0gdGhpcy5nZXRUaWxlcygpO1xuXHRcdHZhciBvYmplY3RzID0gdGhpcy5nZXRPYmplY3RzKGxldmVsKTtcblx0XHR2YXIgbWFwID0gdGhpcy5nZXRNYXAobGV2ZWwpO1xuXHRcdHJldHVybiB7XG5cdFx0XHR0aWxlczogdGlsZXMsXG5cdFx0XHRvYmplY3RzOiBvYmplY3RzLFxuXHRcdFx0bWFwOiBtYXBcblx0XHR9O1xuXHR9LFxuXHRCQVNJQ19XQUxMX1RJTEU6IHtcbiAgICAgICAgXCJ3XCI6MixcbiAgICAgICAgXCJ5XCI6MCxcbiAgICAgICAgXCJoXCI6MixcbiAgICAgICAgXCJjXCI6MCxcbiAgICAgICAgXCJmXCI6MCxcbiAgICAgICAgXCJjaFwiOjIsXG4gICAgICAgIFwic2xcIjowLFxuICAgICAgICBcImRpclwiOjAsXG4gICAgICAgIFwiZnlcIjowXG4gICAgfSxcbiAgICBCQVNJQ19GTE9PUl9USUxFOiB7XG4gICAgXHRcIndcIjowLFxuICAgICAgICBcInlcIjowLFxuICAgICAgICBcImhcIjoyLFxuICAgICAgICBcImNcIjoyLFxuICAgICAgICBcImZcIjoyLFxuICAgICAgICBcImNoXCI6MixcbiAgICAgICAgXCJzbFwiOjAsXG4gICAgICAgIFwiZGlyXCI6MCxcbiAgICAgICAgXCJmeVwiOjBcbiAgICB9LFxuICAgIFdBVEVSX1RJTEU6IHtcbiAgICBcdFwid1wiOjAsXG4gICAgXHRcInlcIjowLFxuICAgIFx0XCJoXCI6MixcbiAgICBcdFwiY1wiOjIsXG4gICAgXHRcImZcIjoxMDEsXG4gICAgXHRcImNoXCI6MixcbiAgICBcdFwic2xcIjowLFxuICAgIFx0XCJkaXJcIjowLFxuICAgIFx0XCJmeVwiOjBcblx0fSxcblx0TEFWQV9USUxFOiB7XG4gICAgXHRcIndcIjowLFxuICAgIFx0XCJ5XCI6MCxcbiAgICBcdFwiaFwiOjIsXG4gICAgXHRcImNcIjoyLFxuICAgIFx0XCJmXCI6MTAxLFxuICAgIFx0XCJjaFwiOjIsXG4gICAgXHRcInNsXCI6MCxcbiAgICBcdFwiZGlyXCI6MCxcbiAgICBcdFwiZnlcIjowXG5cdH0sXG5cdGdldFRpbGVzOiBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBbXG5cdCAgICAgICAgbnVsbCwgXG5cdCAgICAgICAgdGhpcy5CQVNJQ19XQUxMX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19XQUxMX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5MQVZBX1RJTEUsXG5cdCAgICAgICAgdGhpcy5XQVRFUl9USUxFXG5cdFx0XTtcblx0fSxcblx0Z2V0T2JqZWN0czogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBvYmplY3RzID0gW107XG5cdFx0b2JqZWN0cy5wdXNoKHtcblx0XHRcdHg6IGxldmVsLnN0YXJ0LnggKyAwLjUsXG5cdFx0XHR6OiBsZXZlbC5zdGFydC55ICsgMC41LFxuXHRcdFx0eTogMCxcblx0XHRcdGRpcjogMyxcblx0XHRcdHR5cGU6ICdwbGF5ZXInXG5cdFx0fSk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBlbmVteSA9IGxldmVsLmVuZW1pZXNbaV07XG5cdFx0XHR2YXIgZW5lbXlEYXRhID1cblx0XHRcdHtcblx0ICAgICAgICAgICAgeDogZW5lbXkueCArIDAuNSxcblx0ICAgICAgICAgICAgejogZW5lbXkueSArIDAuNSxcblx0ICAgICAgICAgICAgeTogMCxcblx0ICAgICAgICAgICAgdHlwZTogJ2VuZW15Jyxcblx0ICAgICAgICAgICAgZW5lbXk6IGVuZW15LmNvZGVcblx0ICAgICAgICB9O1xuXHRcdFx0b2JqZWN0cy5wdXNoKGVuZW15RGF0YSk7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSBsZXZlbC5pdGVtc1tpXTtcblx0XHRcdHZhciBpdGVtRGF0YSA9XG5cdFx0XHR7XG5cdCAgICAgICAgICAgIHg6IGl0ZW0ueCArIDAuNSxcblx0ICAgICAgICAgICAgejogaXRlbS55ICsgMC41LFxuXHQgICAgICAgICAgICB5OiAwLFxuXHQgICAgICAgICAgICB0eXBlOiAnaXRlbScsXG5cdCAgICAgICAgICAgIGl0ZW06IGl0ZW0uY29kZVxuXHQgICAgICAgIH07XG5cdFx0XHRvYmplY3RzLnB1c2goaXRlbURhdGEpO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0cztcblx0fSxcblx0Z2V0TWFwOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG1hcCA9IFtdO1xuXHRcdHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRtYXBbeF0gPSBbXTtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldO1xuXHRcdFx0XHR2YXIgaWQgPSBudWxsO1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gJ3dhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnZmFrZVdhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRpZCA9IDE7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY2F2ZXJuRmxvb3InKXtcblx0XHRcdFx0XHRpZCA9IDI7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnZG93bnN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gMztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gNDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZVdhbGwnKXtcblx0XHRcdFx0XHRpZCA9IDU7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVGbG9vcicpe1xuXHRcdFx0XHRcdGlkID0gNjtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGlkID0gNztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRpZCA9IDg7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlkID0gOTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXBbeF1beV0gPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtyYW1naW5lRXhwb3J0ZXI7IiwiZnVuY3Rpb24gTGV2ZWwoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59O1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuTGV2ZWwucHJvdG90eXBlID0ge1xuXHRpbml0OiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY2VsbHMgPSBbXTtcblx0XHR0aGlzLmVuZW1pZXMgPSBbXTtcblx0XHR0aGlzLml0ZW1zID0gW107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdHRoaXMuY2VsbHNbeF0gPSBbXTtcblx0XHR9XG5cdH0sXG5cdGFkZEVuZW15OiBmdW5jdGlvbihlbmVteSwgeCwgeSl7XG5cdFx0dGhpcy5lbmVtaWVzLnB1c2goe1xuXHRcdFx0Y29kZTogZW5lbXksXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeVxuXHRcdH0pO1xuXHR9LFxuXHRhZGRJdGVtOiBmdW5jdGlvbihpdGVtLCB4LCB5KXtcblx0XHR0aGlzLml0ZW1zLnB1c2goe1xuXHRcdFx0Y29kZTogaXRlbSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fSk7XG5cdH0sXG5cdGdldEZyZWVQbGFjZTogZnVuY3Rpb24oYXJlYSl7XG5cdFx0d2hpbGUodHJ1ZSl7XG5cdFx0XHR2YXIgcmFuZFBvaW50ID0ge1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoYXJlYS54LCBhcmVhLngrYXJlYS53LTEpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoYXJlYS55LCBhcmVhLnkrYXJlYS5oLTEpXG5cdFx0XHR9XG5cdFx0XHR2YXIgY2VsbCA9IHRoaXMuY2VsbHNbcmFuZFBvaW50LnhdW3JhbmRQb2ludC55XTsgXG5cdFx0XHRpZiAoY2VsbCA9PSBhcmVhLmZsb29yIHx8IGFyZWEuY29ycmlkb3IgJiYgY2VsbCA9PSBhcmVhLmNvcnJpZG9yIHx8IGNlbGwgPT0gJ2Zha2VXYXRlcicpXG5cdFx0XHRcdHJldHVybiByYW5kUG9pbnQ7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyIsImZ1bmN0aW9uIE1vbnN0ZXJQb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5Nb25zdGVyUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuZW5lbXlDb3VudDsgaSsrKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdHRoaXMuYWRkTW9uc3RlcihhcmVhLCAgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgbGV2ZWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoYXJlYS5ib3NzKXtcblx0XHRcdHZhciBwb3NpdGlvbiA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChwb3NpdGlvbil7XG5cdFx0XHRcdGxldmVsLmFkZEVuZW15KGFyZWEuYm9zcywgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRhZGRNb25zdGVyOiBmdW5jdGlvbihhcmVhLCB4LCB5LCBsZXZlbCl7XG5cdFx0dmFyIG1vbnN0ZXIgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhLmVuZW1pZXMpO1xuXHRcdGxldmVsLmFkZEVuZW15KG1vbnN0ZXIsIHgsIHkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9uc3RlclBvcHVsYXRvcjsiLCJmdW5jdGlvbiBTZWNvbmRMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgTGV2ZWwgPSByZXF1aXJlKCcuL0xldmVsLmNsYXNzJyk7XG52YXIgQ0EgPSByZXF1aXJlKCcuL0NBJyk7XG5cblNlY29uZExldmVsR2VuZXJhdG9yLnByb3RvdHlwZSA9IHtcblx0ZmlsbExldmVsOiBmdW5jdGlvbihza2V0Y2gpe1xuXHRcdHZhciBsZXZlbCA9IG5ldyBMZXZlbCh0aGlzLmNvbmZpZyk7XG5cdFx0bGV2ZWwuaW5pdCgpO1xuXHRcdHRoaXMuZmlsbFN0cmF0YShsZXZlbCwgc2tldGNoKTtcblx0XHRpZiAoc2tldGNoLmhhc0xhdmEpXG5cdFx0XHR0aGlzLnBsb3RSaXZlcnMobGV2ZWwsIHNrZXRjaCwgJ2xhdmEnKTtcblx0XHRlbHNlIGlmIChza2V0Y2guaGFzUml2ZXJzKVxuXHRcdFx0dGhpcy5wbG90Uml2ZXJzKGxldmVsLCBza2V0Y2gsICd3YXRlcicpO1xuXHRcdHRoaXMuY29weUdlbyhsZXZlbCk7XG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRmaWxsU3RyYXRhOiBmdW5jdGlvbihsZXZlbCwgc2tldGNoKXtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gc2tldGNoLnN0cmF0YTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGNvcHlHZW86IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgZ2VvID0gW107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGdlb1t4XSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRcdGdlb1t4XVt5XSA9IGxldmVsLmNlbGxzW3hdW3ldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRsZXZlbC5nZW8gPSBnZW87XG5cdH0sXG5cdHBsb3RSaXZlcnM6IGZ1bmN0aW9uKGxldmVsLCBza2V0Y2gsIGxpcXVpZCl7XG5cdFx0dGhpcy5wbGFjZVJpdmVybGluZXMobGV2ZWwsIHNrZXRjaCwgbGlxdWlkKTtcblx0XHR0aGlzLmZhdHRlblJpdmVycyhsZXZlbCwgbGlxdWlkKTtcblx0XHRpZiAobGlxdWlkID09ICdsYXZhJylcblx0XHRcdHRoaXMuZmF0dGVuUml2ZXJzKGxldmVsLCBsaXF1aWQpO1xuXHR9LFxuXHRmYXR0ZW5SaXZlcnM6IGZ1bmN0aW9uKGxldmVsLCBsaXF1aWQpe1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1tsaXF1aWRdID4gMSAmJiBVdGlsLmNoYW5jZSgzMCkpXG5cdFx0XHRcdHJldHVybiBsaXF1aWQ7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nW2xpcXVpZF0gPiAxKVxuXHRcdFx0XHRyZXR1cm4gbGlxdWlkO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHR9LFxuXHRwbGFjZVJpdmVybGluZXM6IGZ1bmN0aW9uKGxldmVsLCBza2V0Y2gsIGxpcXVpZCl7XG5cdFx0Ly8gUGxhY2UgcmFuZG9tIGxpbmUgc2VnbWVudHMgb2Ygd2F0ZXJcblx0XHR2YXIgcml2ZXJzID0gVXRpbC5yYW5kKHRoaXMuY29uZmlnLk1JTl9SSVZFUlMsdGhpcy5jb25maWcuTUFYX1JJVkVSUyk7XG5cdFx0dmFyIHJpdmVyU2VnbWVudExlbmd0aCA9IHRoaXMuY29uZmlnLlJJVkVSX1NFR01FTlRfTEVOR1RIO1xuXHRcdHZhciBwdWRkbGUgPSBmYWxzZTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJpdmVyczsgaSsrKXtcblx0XHRcdHZhciBzZWdtZW50cyA9IFV0aWwucmFuZCh0aGlzLmNvbmZpZy5NSU5fUklWRVJfU0VHTUVOVFMsdGhpcy5jb25maWcuTUFYX1JJVkVSX1NFR01FTlRTKTtcblx0XHRcdHZhciByaXZlclBvaW50cyA9IFtdO1xuXHRcdFx0cml2ZXJQb2ludHMucHVzaCh7XG5cdFx0XHRcdHg6IFV0aWwucmFuZCgwLCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSCksXG5cdFx0XHRcdHk6IFV0aWwucmFuZCgwLCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpXG5cdFx0XHR9KTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgc2VnbWVudHM7IGorKyl7XG5cdFx0XHRcdHZhciByYW5kb21Qb2ludCA9IFV0aWwucmFuZG9tRWxlbWVudE9mKHJpdmVyUG9pbnRzKTtcblx0XHRcdFx0aWYgKHJpdmVyUG9pbnRzLmxlbmd0aCA+IDEgJiYgIXB1ZGRsZSlcblx0XHRcdFx0XHRVdGlsLnJlbW92ZUZyb21BcnJheShyaXZlclBvaW50cywgcmFuZG9tUG9pbnQpO1xuXHRcdFx0XHR2YXIgaWFuY2UgPSB7XG5cdFx0XHRcdFx0eDogVXRpbC5yYW5kKC1yaXZlclNlZ21lbnRMZW5ndGgsIHJpdmVyU2VnbWVudExlbmd0aCksXG5cdFx0XHRcdFx0eTogVXRpbC5yYW5kKC1yaXZlclNlZ21lbnRMZW5ndGgsIHJpdmVyU2VnbWVudExlbmd0aClcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG5ld1BvaW50ID0ge1xuXHRcdFx0XHRcdHg6IHJhbmRvbVBvaW50LnggKyBpYW5jZS54LFxuXHRcdFx0XHRcdHk6IHJhbmRvbVBvaW50LnkgKyBpYW5jZS55LFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRpZiAobmV3UG9pbnQueCA+IDAgJiYgbmV3UG9pbnQueCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIICYmIFxuXHRcdFx0XHRcdG5ld1BvaW50LnkgPiAwICYmIG5ld1BvaW50LnkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQpXG5cdFx0XHRcdFx0cml2ZXJQb2ludHMucHVzaChuZXdQb2ludCk7XG5cdFx0XHRcdHZhciBsaW5lID0gVXRpbC5saW5lKHJhbmRvbVBvaW50LCBuZXdQb2ludCk7XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgbGluZS5sZW5ndGg7IGsrKyl7XG5cdFx0XHRcdFx0dmFyIHBvaW50ID0gbGluZVtrXTtcblx0XHRcdFx0XHRpZiAocG9pbnQueCA+IDAgJiYgcG9pbnQueCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIICYmIFxuXHRcdFx0XHRcdFx0cG9pbnQueSA+IDAgJiYgcG9pbnQueSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGxpcXVpZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZnJhbWVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGlmIChsZXZlbC5jZWxsc1t4XVswXSAhPSAnc3RvbmVXYWxsJykgbGV2ZWwuY2VsbHNbeF1bMF0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzW3hdW3RoaXMuY29uZmlnLkxFVkVMX0hFSUdIVC0xXSAhPSAnc3RvbmVXYWxsJykgbGV2ZWwuY2VsbHNbeF1bdGhpcy5jb25maWcuTEVWRUxfSEVJR0hULTFdID0gc2tldGNoLnN0cmF0YTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRpZiAobGV2ZWwuY2VsbHNbMF1beV0gIT0gJ3N0b25lV2FsbCcpIGxldmVsLmNlbGxzWzBdW3ldID0gc2tldGNoLnN0cmF0YTtcblx0XHRcdGlmIChsZXZlbC5jZWxsc1t0aGlzLmNvbmZpZy5MRVZFTF9XSURUSC0xXVt5XSAhPSAnc3RvbmVXYWxsJykgbGV2ZWwuY2VsbHNbdGhpcy5jb25maWcuTEVWRUxfV0lEVEgtMV1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY29uZExldmVsR2VuZXJhdG9yOyIsInZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3ViZGl2aWRlQXJlYTogZnVuY3Rpb24oYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5ELCBhdm9pZFBvaW50cyl7XG5cdFx0dmFyIGFyZWFzID0gW107XG5cdFx0dmFyIGJpZ0FyZWFzID0gW107XG5cdFx0YmlnQXJlYS5kZXB0aCA9IDA7XG5cdFx0YmlnQXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHR2YXIgcmV0cmllcyA9IDA7XG5cdFx0d2hpbGUgKGJpZ0FyZWFzLmxlbmd0aCA+IDApe1xuXHRcdFx0dmFyIGJpZ0FyZWEgPSBiaWdBcmVhcy5wb3AoKTtcblx0XHRcdHZhciBob3Jpem9udGFsU3BsaXQgPSBVdGlsLmNoYW5jZSg1MCk7XG5cdFx0XHRpZiAoYmlnQXJlYS53IDwgTUlOX1dJRFRIICogMS41ICYmIGJpZ0FyZWEuaCA8IE1JTl9IRUlHSFQgKiAxLjUpe1xuXHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9IGVsc2UgaWYgKGJpZ0FyZWEudyA8IE1JTl9XSURUSCAqIDEuNSl7XG5cdFx0XHRcdGhvcml6b250YWxTcGxpdCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKGJpZ0FyZWEuaCA8IE1JTl9IRUlHSFQgKiAxLjUpe1xuXHRcdFx0XHRob3Jpem9udGFsU3BsaXQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBhcmVhMSA9IG51bGw7XG5cdFx0XHR2YXIgYXJlYTIgPSBudWxsO1xuXHRcdFx0aWYgKGhvcml6b250YWxTcGxpdCl7XG5cdFx0XHRcdHZhciBzbGljZSA9IE1hdGgucm91bmQoVXRpbC5yYW5kKGJpZ0FyZWEuaCAqIFNMSUNFX1JBTkdFX1NUQVJULCBiaWdBcmVhLmggKiBTTElDRV9SQU5HRV9FTkQpKTtcblx0XHRcdFx0YXJlYTEgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54LFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSxcblx0XHRcdFx0XHR3OiBiaWdBcmVhLncsXG5cdFx0XHRcdFx0aDogc2xpY2Vcblx0XHRcdFx0fTtcblx0XHRcdFx0YXJlYTIgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54LFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSArIHNsaWNlLFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudyxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmggLSBzbGljZVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgc2xpY2UgPSBNYXRoLnJvdW5kKFV0aWwucmFuZChiaWdBcmVhLncgKiBTTElDRV9SQU5HRV9TVEFSVCwgYmlnQXJlYS53ICogU0xJQ0VfUkFOR0VfRU5EKSk7XG5cdFx0XHRcdGFyZWExID0ge1xuXHRcdFx0XHRcdHg6IGJpZ0FyZWEueCxcblx0XHRcdFx0XHR5OiBiaWdBcmVhLnksXG5cdFx0XHRcdFx0dzogc2xpY2UsXG5cdFx0XHRcdFx0aDogYmlnQXJlYS5oXG5cdFx0XHRcdH1cblx0XHRcdFx0YXJlYTIgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54K3NsaWNlLFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSxcblx0XHRcdFx0XHR3OiBiaWdBcmVhLnctc2xpY2UsXG5cdFx0XHRcdFx0aDogYmlnQXJlYS5oXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYTEudyA8IE1JTl9XSURUSCB8fCBhcmVhMS5oIDwgTUlOX0hFSUdIVCB8fFxuXHRcdFx0XHRhcmVhMi53IDwgTUlOX1dJRFRIIHx8IGFyZWEyLmggPCBNSU5fSEVJR0hUKXtcblx0XHRcdFx0YmlnQXJlYS5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGJpZ0FyZWEuZGVwdGggPT0gbWF4RGVwdGggJiYgXG5cdFx0XHRcdFx0KGFyZWExLncgPiBNQVhfV0lEVEggfHwgYXJlYTEuaCA+IE1BWF9IRUlHSFQgfHxcblx0XHRcdFx0XHRhcmVhMi53ID4gTUFYX1dJRFRIIHx8IGFyZWEyLmggPiBNQVhfSEVJR0hUKSl7XG5cdFx0XHRcdGlmIChyZXRyaWVzIDwgMTAwKSB7XG5cdFx0XHRcdFx0Ly8gUHVzaCBiYWNrIGJpZyBhcmVhXG5cdFx0XHRcdFx0YmlnQXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0XHRyZXRyaWVzKys7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cdFx0XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXZvaWRQb2ludHMgJiYgKHRoaXMuY29sbGlkZXNXaXRoKGF2b2lkUG9pbnRzLCBhcmVhMikgfHwgdGhpcy5jb2xsaWRlc1dpdGgoYXZvaWRQb2ludHMsIGFyZWExKSkpe1xuXHRcdFx0XHRpZiAocmV0cmllcyA+IDEwMCl7XG5cdFx0XHRcdFx0YmlnQXJlYS5icmlkZ2VzID0gW107XG5cdFx0XHRcdFx0YXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0XHRyZXRyaWVzID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBQdXNoIGJhY2sgYmlnIGFyZWFcblx0XHRcdFx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMrKztcblx0XHRcdFx0fVx0XHRcblx0XHRcdFx0Y29udGludWU7IFxuXHRcdFx0fVxuXHRcdFx0aWYgKGJpZ0FyZWEuZGVwdGggPT0gbWF4RGVwdGgpe1xuXHRcdFx0XHRhcmVhMS5icmlkZ2VzID0gW107XG5cdFx0XHRcdGFyZWEyLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYXMucHVzaChhcmVhMSk7XG5cdFx0XHRcdGFyZWFzLnB1c2goYXJlYTIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YXJlYTEuZGVwdGggPSBiaWdBcmVhLmRlcHRoICsxO1xuXHRcdFx0XHRhcmVhMi5kZXB0aCA9IGJpZ0FyZWEuZGVwdGggKzE7XG5cdFx0XHRcdGJpZ0FyZWFzLnB1c2goYXJlYTEpO1xuXHRcdFx0XHRiaWdBcmVhcy5wdXNoKGFyZWEyKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGFyZWFzO1xuXHR9LFxuXHRjb2xsaWRlc1dpdGg6IGZ1bmN0aW9uKGF2b2lkUG9pbnRzLCBhcmVhKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGF2b2lkUG9pbnRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhdm9pZFBvaW50ID0gYXZvaWRQb2ludHNbaV07XG5cdFx0XHRpZiAoVXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54LCBhcmVhLnksIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCthcmVhLncsIGFyZWEueSwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54LCBhcmVhLnkrYXJlYS5oLCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngrYXJlYS53LCBhcmVhLnkrYXJlYS5oLCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMil7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cdGNvbm5lY3RBcmVhczogZnVuY3Rpb24oYXJlYXMsIGJvcmRlcil7XG5cdFx0LyogTWFrZSBvbmUgYXJlYSBjb25uZWN0ZWRcblx0XHQgKiBXaGlsZSBub3QgYWxsIGFyZWFzIGNvbm5lY3RlZCxcblx0XHQgKiAgU2VsZWN0IGEgY29ubmVjdGVkIGFyZWFcblx0XHQgKiAgU2VsZWN0IGEgdmFsaWQgd2FsbCBmcm9tIHRoZSBhcmVhXG5cdFx0ICogIFRlYXIgaXQgZG93biwgY29ubmVjdGluZyB0byB0aGUgYSBuZWFyYnkgYXJlYVxuXHRcdCAqICBNYXJrIGFyZWEgYXMgY29ubmVjdGVkXG5cdFx0ICovXG5cdFx0aWYgKCFib3JkZXIpe1xuXHRcdFx0Ym9yZGVyID0gMTtcblx0XHR9XG5cdFx0dmFyIGNvbm5lY3RlZEFyZWFzID0gW107XG5cdFx0dmFyIHJhbmRvbUFyZWEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihhcmVhcyk7XG5cdFx0Y29ubmVjdGVkQXJlYXMucHVzaChyYW5kb21BcmVhKTtcblx0XHR2YXIgY3Vyc29yID0ge307XG5cdFx0dmFyIHZhcmkgPSB7fTtcblx0XHRhcmVhOiB3aGlsZSAoY29ubmVjdGVkQXJlYXMubGVuZ3RoIDwgYXJlYXMubGVuZ3RoKXtcblx0XHRcdHJhbmRvbUFyZWEgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihjb25uZWN0ZWRBcmVhcyk7XG5cdFx0XHR2YXIgd2FsbERpciA9IFV0aWwucmFuZCgxLDQpO1xuXHRcdFx0c3dpdGNoKHdhbGxEaXIpe1xuXHRcdFx0Y2FzZSAxOiAvLyBMZWZ0XG5cdFx0XHRcdGN1cnNvci54ID0gcmFuZG9tQXJlYS54O1xuXHRcdFx0XHRjdXJzb3IueSA9IFV0aWwucmFuZChyYW5kb21BcmVhLnkgKyBib3JkZXIgLCByYW5kb21BcmVhLnkrcmFuZG9tQXJlYS5oIC0gYm9yZGVyKTtcblx0XHRcdFx0dmFyaS54ID0gLTI7XG5cdFx0XHRcdHZhcmkueSA9IDA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOiAvL1JpZ2h0XG5cdFx0XHRcdGN1cnNvci54ID0gcmFuZG9tQXJlYS54ICsgcmFuZG9tQXJlYS53O1xuXHRcdFx0XHRjdXJzb3IueSA9IFV0aWwucmFuZChyYW5kb21BcmVhLnkgKyBib3JkZXIsIHJhbmRvbUFyZWEueStyYW5kb21BcmVhLmggLSBib3JkZXIpO1xuXHRcdFx0XHR2YXJpLnggPSAyO1xuXHRcdFx0XHR2YXJpLnkgPSAwO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzogLy9VcFxuXHRcdFx0XHRjdXJzb3IueCA9IFV0aWwucmFuZChyYW5kb21BcmVhLnggKyBib3JkZXIsIHJhbmRvbUFyZWEueCtyYW5kb21BcmVhLncgLSBib3JkZXIpO1xuXHRcdFx0XHRjdXJzb3IueSA9IHJhbmRvbUFyZWEueTtcblx0XHRcdFx0dmFyaS54ID0gMDtcblx0XHRcdFx0dmFyaS55ID0gLTI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OiAvL0Rvd25cblx0XHRcdFx0Y3Vyc29yLnggPSBVdGlsLnJhbmQocmFuZG9tQXJlYS54ICsgYm9yZGVyLCByYW5kb21BcmVhLngrcmFuZG9tQXJlYS53IC0gYm9yZGVyKTtcblx0XHRcdFx0Y3Vyc29yLnkgPSByYW5kb21BcmVhLnkgKyByYW5kb21BcmVhLmg7XG5cdFx0XHRcdHZhcmkueCA9IDA7XG5cdFx0XHRcdHZhcmkueSA9IDI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGNvbm5lY3RlZEFyZWEgPSB0aGlzLmdldEFyZWFBdChjdXJzb3IsIHZhcmksIGFyZWFzKTtcblx0XHRcdGlmIChjb25uZWN0ZWRBcmVhICYmICFVdGlsLmNvbnRhaW5zKGNvbm5lY3RlZEFyZWFzLCBjb25uZWN0ZWRBcmVhKSl7XG5cdFx0XHRcdHN3aXRjaCh3YWxsRGlyKXtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0aWYgKGN1cnNvci55IDw9IGNvbm5lY3RlZEFyZWEueSArIGJvcmRlciB8fCBjdXJzb3IueSA+PSBjb25uZWN0ZWRBcmVhLnkgKyBjb25uZWN0ZWRBcmVhLmggLSBib3JkZXIpXG5cdFx0XHRcdFx0XHRjb250aW51ZSBhcmVhO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRpZiAoY3Vyc29yLnggPD0gY29ubmVjdGVkQXJlYS54ICsgYm9yZGVyIHx8IGN1cnNvci54ID49IGNvbm5lY3RlZEFyZWEueCArIGNvbm5lY3RlZEFyZWEudyAtIGJvcmRlcilcblx0XHRcdFx0XHRcdGNvbnRpbnVlIGFyZWE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuY29ubmVjdEFyZWEocmFuZG9tQXJlYSwgY29ubmVjdGVkQXJlYSwgY3Vyc29yKTtcblx0XHRcdFx0Y29ubmVjdGVkQXJlYXMucHVzaChjb25uZWN0ZWRBcmVhKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGdldEFyZWFBdDogZnVuY3Rpb24oY3Vyc29yLCB2YXJpLCBhcmVhcyl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKGN1cnNvci54ICsgdmFyaS54ID49IGFyZWEueCAmJiBjdXJzb3IueCArIHZhcmkueCA8PSBhcmVhLnggKyBhcmVhLncgXG5cdFx0XHRcdFx0JiYgY3Vyc29yLnkgKyB2YXJpLnkgPj0gYXJlYS55ICYmIGN1cnNvci55ICsgdmFyaS55IDw9IGFyZWEueSArIGFyZWEuaClcblx0XHRcdFx0cmV0dXJuIGFyZWE7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0Y29ubmVjdEFyZWE6IGZ1bmN0aW9uKGFyZWExLCBhcmVhMiwgcG9zaXRpb24pe1xuXHRcdGFyZWExLmJyaWRnZXMucHVzaCh7XG5cdFx0XHR4OiBwb3NpdGlvbi54LFxuXHRcdFx0eTogcG9zaXRpb24ueSxcblx0XHRcdHRvOiBhcmVhMlxuXHRcdH0pO1xuXHRcdGFyZWEyLmJyaWRnZXMucHVzaCh7XG5cdFx0XHR4OiBwb3NpdGlvbi54LFxuXHRcdFx0eTogcG9zaXRpb24ueSxcblx0XHRcdHRvOiBhcmVhMVxuXHRcdH0pO1xuXHR9XG59IiwiZnVuY3Rpb24gVGhpcmRMZXZlbEdlbmVyYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgQ0EgPSByZXF1aXJlKCcuL0NBJyk7XG52YXIgU3BsaXR0ZXIgPSByZXF1aXJlKCcuL1NwbGl0dGVyJyk7XG5cblRoaXJkTGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRmaWxsTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdHRoaXMuZmlsbFJvb21zKHNrZXRjaCwgbGV2ZWwpXG5cdFx0dGhpcy5mYXR0ZW5DYXZlcm5zKGxldmVsKTtcblx0XHR0aGlzLnBsYWNlRXhpdHMoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5yYWlzZUlzbGFuZHMobGV2ZWwpO1xuXHRcdHJldHVybiBsZXZlbDtcblx0fSxcblx0ZmF0dGVuQ2F2ZXJuczogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdC8vIEdyb3cgY2F2ZXJuc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXSA+IDAgJiYgVXRpbC5jaGFuY2UoMjApKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10gPiAxKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHQvLyBHcm93IGxhZ29vbiBhcmVhc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snZmFrZVdhdGVyJ10gPiAwICYmIFV0aWwuY2hhbmNlKDQwKSlcblx0XHRcdFx0cmV0dXJuICdmYWtlV2F0ZXInO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snZmFrZVdhdGVyJ10gPiAwKVxuXHRcdFx0XHRyZXR1cm4gJ2Zha2VXYXRlcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0XG5cdFx0XG5cdFx0Ly8gRXhwYW5kIHdhbGwtbGVzcyByb29tc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzb2xpZFJvY2snKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDIgJiYgVXRpbC5jaGFuY2UoMTApKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnc29saWRSb2NrJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydzdG9uZUZsb29yJ10gPiAwICYmIHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddPjApXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdC8vIERldGVyaW9yYXRlIHdhbGwgcm9vbXNcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnc3RvbmVXYWxsJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydzdG9uZUZsb29yJ10gPiAwICYmIFV0aWwuY2hhbmNlKDUpKVxuXHRcdFx0XHRyZXR1cm4gJ3N0b25lRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdFxuXHR9LFxuXHRyYWlzZUlzbGFuZHM6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnd2F0ZXInKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR2YXIgY2F2ZXJucyA9IHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddOyBcblx0XHRcdGlmIChjYXZlcm5zID4gMCAmJiBVdGlsLmNoYW5jZSg3MCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdC8vIElzbGFuZCBmb3IgZXhpdHMgb24gd2F0ZXJcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoY3VycmVudCAhPSAnZmFrZVdhdGVyJyAmJiBjdXJyZW50ICE9ICd3YXRlcicpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdHZhciBzdGFpcnMgPSBzdXJyb3VuZGluZ1snZG93bnN0YWlycyddID8gc3Vycm91bmRpbmdbJ2Rvd25zdGFpcnMnXSA6IDAgK1xuXHRcdFx0XHRcdHN1cnJvdW5kaW5nWyd1cHN0YWlycyddID8gc3Vycm91bmRpbmdbJ3Vwc3RhaXJzJ10gOiAwOyBcblx0XHRcdGlmIChzdGFpcnMgPiAwKVxuXHRcdFx0XHRyZXR1cm4gJ2NhdmVybkZsb29yJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxKTtcblx0fSxcblx0ZmlsbFJvb21zOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNrZXRjaC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IHNrZXRjaC5hcmVhc1tpXTtcblx0XHRcdHZhciB0eXBlID0gYXJlYS5hcmVhVHlwZTtcblx0XHRcdGlmICh0eXBlID09PSAnY2F2ZXJuJyl7IFxuXHRcdFx0XHR0aGlzLmZpbGxXaXRoQ2F2ZXJuKGxldmVsLCBhcmVhKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3Jvb21zJyl7XG5cdFx0XHRcdHRoaXMuZmlsbFdpdGhSb29tcyhsZXZlbCwgYXJlYSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRwbGFjZUV4aXRzOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNrZXRjaC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IHNrZXRjaC5hcmVhc1tpXTtcblx0XHRcdGlmICghYXJlYS5oYXNFeGl0ICYmICFhcmVhLmhhc0VudHJhbmNlKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdHZhciB0aWxlID0gbnVsbDtcblx0XHRcdGlmIChhcmVhLmhhc0V4aXQpe1xuXHRcdFx0XHR0aWxlID0gJ2Rvd25zdGFpcnMnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGlsZSA9ICd1cHN0YWlycyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZnJlZVNwb3QgPSBsZXZlbC5nZXRGcmVlUGxhY2UoYXJlYSk7XG5cdFx0XHRpZiAoZnJlZVNwb3QueCA9PSAwIHx8IGZyZWVTcG90LnkgPT0gMCB8fCBmcmVlU3BvdC54ID09IGxldmVsLmNlbGxzLmxlbmd0aCAtIDEgfHwgZnJlZVNwb3QueSA9PSBsZXZlbC5jZWxsc1swXS5sZW5ndGggLSAxKXtcblx0XHRcdFx0aS0tO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGxldmVsLmNlbGxzW2ZyZWVTcG90LnhdW2ZyZWVTcG90LnldID0gdGlsZTtcblx0XHRcdGlmIChhcmVhLmhhc0V4aXQpe1xuXHRcdFx0XHRsZXZlbC5lbmQgPSB7XG5cdFx0XHRcdFx0eDogZnJlZVNwb3QueCxcblx0XHRcdFx0XHR5OiBmcmVlU3BvdC55XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXZlbC5zdGFydCA9IHtcblx0XHRcdFx0XHR4OiBmcmVlU3BvdC54LFxuXHRcdFx0XHRcdHk6IGZyZWVTcG90Lnlcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGZpbGxXaXRoQ2F2ZXJuOiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0Ly8gQ29ubmVjdCBhbGwgYnJpZGdlcyB3aXRoIG1pZHBvaW50XG5cdFx0dmFyIG1pZHBvaW50ID0ge1xuXHRcdFx0eDogTWF0aC5yb3VuZChVdGlsLnJhbmQoYXJlYS54ICsgYXJlYS53ICogMS8zLCBhcmVhLngrYXJlYS53ICogMi8zKSksXG5cdFx0XHR5OiBNYXRoLnJvdW5kKFV0aWwucmFuZChhcmVhLnkgKyBhcmVhLmggKiAxLzMsIGFyZWEueSthcmVhLmggKiAyLzMpKVxuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2ldO1xuXHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUobWlkcG9pbnQsIGJyaWRnZSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxpbmUubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2pdO1xuXHRcdFx0XHR2YXIgY3VycmVudENlbGwgPSBsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XTtcblx0XHRcdFx0aWYgKGFyZWEuY2F2ZXJuVHlwZSA9PSAncm9ja3knKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdFx0ZWxzZSBpZiAoY3VycmVudENlbGwgPT0gJ3dhdGVyJyB8fCBjdXJyZW50Q2VsbCA9PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlmIChhcmVhLmZsb29yICE9ICdmYWtlV2F0ZXInICYmIGFyZWEuY2F2ZXJuVHlwZSA9PSAnYnJpZGdlcycpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gJ2Zha2VXYXRlcic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIFNjcmF0Y2ggdGhlIGFyZWFcblx0XHR2YXIgc2NyYXRjaGVzID0gVXRpbC5yYW5kKDIsNCk7XG5cdFx0dmFyIGNhdmVTZWdtZW50cyA9IFtdO1xuXHRcdGNhdmVTZWdtZW50cy5wdXNoKG1pZHBvaW50KTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNjcmF0Y2hlczsgaSsrKXtcblx0XHRcdHZhciBwMSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGNhdmVTZWdtZW50cyk7XG5cdFx0XHRpZiAoY2F2ZVNlZ21lbnRzLmxlbmd0aCA+IDEpXG5cdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KGNhdmVTZWdtZW50cywgcDEpO1xuXHRcdFx0dmFyIHAyID0ge1xuXHRcdFx0XHR4OiBVdGlsLnJhbmQoYXJlYS54LCBhcmVhLngrYXJlYS53LTEpLFxuXHRcdFx0XHR5OiBVdGlsLnJhbmQoYXJlYS55LCBhcmVhLnkrYXJlYS5oLTEpXG5cdFx0XHR9XG5cdFx0XHRjYXZlU2VnbWVudHMucHVzaChwMik7XG5cdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShwMiwgcDEpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0dmFyIHBvaW50ID0gbGluZVtqXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRDZWxsID0gbGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV07XG5cdFx0XHRcdGlmIChjdXJyZW50Q2VsbCAhPSAnd2F0ZXInICYmIGN1cnJlbnRDZWxsICE9ICdsYXZhJykgIFxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gYXJlYS5mbG9vcjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGZpbGxXaXRoUm9vbXM6IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHR2YXIgYmlnQXJlYSA9IHtcblx0XHRcdHg6IGFyZWEueCxcblx0XHRcdHk6IGFyZWEueSxcblx0XHRcdHc6IGFyZWEudyxcblx0XHRcdGg6IGFyZWEuaFxuXHRcdH1cblx0XHR2YXIgbWF4RGVwdGggPSAyO1xuXHRcdHZhciBNSU5fV0lEVEggPSA2O1xuXHRcdHZhciBNSU5fSEVJR0hUID0gNjtcblx0XHR2YXIgTUFYX1dJRFRIID0gMTA7XG5cdFx0dmFyIE1BWF9IRUlHSFQgPSAxMDtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfU1RBUlQgPSAzLzg7XG5cdFx0dmFyIFNMSUNFX1JBTkdFX0VORCA9IDUvODtcblx0XHR2YXIgYXJlYXMgPSBTcGxpdHRlci5zdWJkaXZpZGVBcmVhKGJpZ0FyZWEsIG1heERlcHRoLCBNSU5fV0lEVEgsIE1JTl9IRUlHSFQsIE1BWF9XSURUSCwgTUFYX0hFSUdIVCwgU0xJQ0VfUkFOR0VfU1RBUlQsIFNMSUNFX1JBTkdFX0VORCwgYXJlYS5icmlkZ2VzKTtcblx0XHRTcGxpdHRlci5jb25uZWN0QXJlYXMoYXJlYXMsIGFyZWEud2FsbCA/IDIgOiAxKTsgXG5cdFx0dmFyIGJyaWRnZUFyZWFzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgc3ViYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRpZiAoU3BsaXR0ZXIuZ2V0QXJlYUF0KGJyaWRnZSx7eDowLHk6MH0sIGFyZWFzKSA9PSBzdWJhcmVhKXtcblx0XHRcdFx0XHRpZiAoIVV0aWwuY29udGFpbnMoYnJpZGdlQXJlYXMsIHN1YmFyZWEpKXtcblx0XHRcdFx0XHRcdGJyaWRnZUFyZWFzLnB1c2goc3ViYXJlYSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN1YmFyZWEuYnJpZGdlcy5wdXNoKHtcblx0XHRcdFx0XHRcdHg6IGJyaWRnZS54LFxuXHRcdFx0XHRcdFx0eTogYnJpZGdlLnlcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVzZUFyZWFzKGJyaWRnZUFyZWFzLCBhcmVhcywgYmlnQXJlYSk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgc3ViYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKCFzdWJhcmVhLnJlbmRlcilcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRzdWJhcmVhLmZsb29yID0gYXJlYS5mbG9vcjtcblx0XHRcdHN1YmFyZWEud2FsbCA9IGFyZWEud2FsbDtcblx0XHRcdHN1YmFyZWEuY29ycmlkb3IgPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0dGhpcy5jYXJ2ZVJvb21BdChsZXZlbCwgc3ViYXJlYSk7XG5cdFx0fVxuXHR9LFxuXHRjYXJ2ZVJvb21BdDogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdHZhciBtaW5ib3ggPSB7XG5cdFx0XHR4OiBhcmVhLnggKyBNYXRoLmZsb29yKGFyZWEudyAvIDIpLTEsXG5cdFx0XHR5OiBhcmVhLnkgKyBNYXRoLmZsb29yKGFyZWEuaCAvIDIpLTEsXG5cdFx0XHR4MjogYXJlYS54ICsgTWF0aC5mbG9vcihhcmVhLncgLyAyKSsxLFxuXHRcdFx0eTI6IGFyZWEueSArIE1hdGguZmxvb3IoYXJlYS5oIC8gMikrMSxcblx0XHR9O1xuXHRcdC8vIFRyYWNlIGNvcnJpZG9ycyBmcm9tIGV4aXRzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhLmJyaWRnZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tpXTtcblx0XHRcdHZhciB2ZXJ0aWNhbEJyaWRnZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGhvcml6b250YWxCcmlkZ2UgPSBmYWxzZTtcblx0XHRcdGlmIChicmlkZ2UueCA9PSBhcmVhLngpe1xuXHRcdFx0XHQvLyBMZWZ0IENvcnJpZG9yXG5cdFx0XHRcdGhvcml6b250YWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLng7IGogPCBicmlkZ2UueCArIGFyZWEudyAvIDI7IGorKyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnktMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbal1bYnJpZGdlLnkrMV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChicmlkZ2UueCA9PSBhcmVhLnggKyBhcmVhLncpe1xuXHRcdFx0XHQvLyBSaWdodCBjb3JyaWRvclxuXHRcdFx0XHRob3Jpem9udGFsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS54OyBqID49IGJyaWRnZS54IC0gYXJlYS53IC8gMjsgai0tKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ3dhdGVyJyB8fCBsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPT0gJ2xhdmEnKXsgXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSAnYnJpZGdlJztcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbal1bYnJpZGdlLnldID0gYXJlYS5jb3JyaWRvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYnJpZGdlLnkgPT0gYXJlYS55KXtcblx0XHRcdFx0Ly8gVG9wIGNvcnJpZG9yXG5cdFx0XHRcdHZlcnRpY2FsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS55OyBqIDwgYnJpZGdlLnkgKyBhcmVhLmggLyAyOyBqKyspe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54LTFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2JyaWRnZS54KzFdW2pdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gRG93biBDb3JyaWRvclxuXHRcdFx0XHR2ZXJ0aWNhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueTsgaiA+PSBicmlkZ2UueSAtIGFyZWEuaCAvIDI7IGotLSl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gPSBhcmVhLndhbGw7IFxuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1ticmlkZ2UueF1bal0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZlcnRpY2FsQnJpZGdlKXtcblx0XHRcdFx0aWYgKGJyaWRnZS54IDwgbWluYm94LngpXG5cdFx0XHRcdFx0bWluYm94LnggPSBicmlkZ2UueDtcblx0XHRcdFx0aWYgKGJyaWRnZS54ID4gbWluYm94LngyKVxuXHRcdFx0XHRcdG1pbmJveC54MiA9IGJyaWRnZS54O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhvcml6b250YWxCcmlkZ2Upe1xuXHRcdFx0XHRpZiAoYnJpZGdlLnkgPCBtaW5ib3gueSlcblx0XHRcdFx0XHRtaW5ib3gueSA9IGJyaWRnZS55O1xuXHRcdFx0XHRpZiAoYnJpZGdlLnkgPiBtaW5ib3gueTIpXG5cdFx0XHRcdFx0bWluYm94LnkyID0gYnJpZGdlLnk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBtaW5QYWRkaW5nID0gMDtcblx0XHRpZiAoYXJlYS53YWxsKVxuXHRcdFx0bWluUGFkZGluZyA9IDE7XG5cdFx0dmFyIHBhZGRpbmcgPSB7XG5cdFx0XHR0b3A6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBtaW5ib3gueSAtIGFyZWEueSAtIG1pblBhZGRpbmcpLFxuXHRcdFx0Ym90dG9tOiBVdGlsLnJhbmQobWluUGFkZGluZywgYXJlYS55ICsgYXJlYS5oIC0gbWluYm94LnkyIC0gbWluUGFkZGluZyksXG5cdFx0XHRsZWZ0OiBVdGlsLnJhbmQobWluUGFkZGluZywgbWluYm94LnggLSBhcmVhLnggLSBtaW5QYWRkaW5nKSxcblx0XHRcdHJpZ2h0OiBVdGlsLnJhbmQobWluUGFkZGluZywgYXJlYS54ICsgYXJlYS53IC0gbWluYm94LngyIC0gbWluUGFkZGluZylcblx0XHR9O1xuXHRcdGlmIChwYWRkaW5nLnRvcCA8IDApIHBhZGRpbmcudG9wID0gMDtcblx0XHRpZiAocGFkZGluZy5ib3R0b20gPCAwKSBwYWRkaW5nLmJvdHRvbSA9IDA7XG5cdFx0aWYgKHBhZGRpbmcubGVmdCA8IDApIHBhZGRpbmcubGVmdCA9IDA7XG5cdFx0aWYgKHBhZGRpbmcucmlnaHQgPCAwKSBwYWRkaW5nLnJpZ2h0ID0gMDtcblx0XHR2YXIgcm9vbXggPSBhcmVhLng7XG5cdFx0dmFyIHJvb215ID0gYXJlYS55O1xuXHRcdHZhciByb29tdyA9IGFyZWEudztcblx0XHR2YXIgcm9vbWggPSBhcmVhLmg7XG5cdFx0Zm9yICh2YXIgeCA9IHJvb214OyB4IDwgcm9vbXggKyByb29tdzsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSByb29teTsgeSA8IHJvb215ICsgcm9vbWg7IHkrKyl7XG5cdFx0XHRcdHZhciBkcmF3V2FsbCA9IGFyZWEud2FsbCAmJiBsZXZlbC5jZWxsc1t4XVt5XSAhPSBhcmVhLmNvcnJpZG9yICYmIGxldmVsLmNlbGxzW3hdW3ldICE9ICdicmlkZ2UnOyBcblx0XHRcdFx0aWYgKHkgPCByb29teSArIHBhZGRpbmcudG9wKXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeSA9PSByb29teSArIHBhZGRpbmcudG9wIC0gMSAmJiB4ICsgMSA+PSByb29teCArIHBhZGRpbmcubGVmdCAmJiB4IDw9IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0KVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh4IDwgcm9vbXggKyBwYWRkaW5nLmxlZnQpe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB4ID09IHJvb214ICsgcGFkZGluZy5sZWZ0IC0gMSAmJiB5ID49IHJvb215ICsgcGFkZGluZy50b3AgJiYgeSA8PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20pXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHkgPiByb29teSArIHJvb21oIC0gMSAtIHBhZGRpbmcuYm90dG9tKXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeSA9PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20gJiYgeCArIDEgPj0gcm9vbXggKyBwYWRkaW5nLmxlZnQgJiYgeCA8PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodClcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA+IHJvb214ICsgcm9vbXcgLSAxIC0gcGFkZGluZy5yaWdodCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHggPT0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQgJiYgeSA+PSByb29teSArIHBhZGRpbmcudG9wICYmIHkgPD0gcm9vbXkgKyByb29taCAtIHBhZGRpbmcuYm90dG9tKVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmIChhcmVhLm1hcmtlZClcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS5mbG9vcjtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdH0sXG5cdHVzZUFyZWFzOiBmdW5jdGlvbihrZWVwQXJlYXMsIGFyZWFzLCBiaWdBcmVhKXtcblx0XHQvLyBBbGwga2VlcCBhcmVhcyBzaG91bGQgYmUgY29ubmVjdGVkIHdpdGggYSBzaW5nbGUgcGl2b3QgYXJlYVxuXHRcdHZhciBwaXZvdEFyZWEgPSBTcGxpdHRlci5nZXRBcmVhQXQoe3g6IE1hdGgucm91bmQoYmlnQXJlYS54ICsgYmlnQXJlYS53LzIpLCB5OiBNYXRoLnJvdW5kKGJpZ0FyZWEueSArIGJpZ0FyZWEuaC8yKX0se3g6MCx5OjB9LCBhcmVhcyk7XG5cdFx0dmFyIHBhdGhBcmVhcyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2VlcEFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBrZWVwQXJlYSA9IGtlZXBBcmVhc1tpXTtcblx0XHRcdGtlZXBBcmVhLnJlbmRlciA9IHRydWU7XG5cdFx0XHR2YXIgYXJlYXNQYXRoID0gdGhpcy5nZXREcnVua2VuQXJlYXNQYXRoKGtlZXBBcmVhLCBwaXZvdEFyZWEsIGFyZWFzKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgYXJlYXNQYXRoLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0YXJlYXNQYXRoW2pdLnJlbmRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBhcmVhc1tpXTtcblx0XHRcdGlmICghYXJlYS5yZW5kZXIpe1xuXHRcdFx0XHRicmlkZ2VzUmVtb3ZlOiBmb3IgKHZhciBqID0gMDsgaiA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdFx0dmFyIGJyaWRnZSA9IGFyZWEuYnJpZGdlc1tqXTtcblx0XHRcdFx0XHRpZiAoIWJyaWRnZS50bylcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgYnJpZGdlLnRvLmJyaWRnZXMubGVuZ3RoOyBrKyspe1xuXHRcdFx0XHRcdFx0dmFyIHNvdXJjZUJyaWRnZSA9IGJyaWRnZS50by5icmlkZ2VzW2tdO1xuXHRcdFx0XHRcdFx0aWYgKHNvdXJjZUJyaWRnZS54ID09IGJyaWRnZS54ICYmIHNvdXJjZUJyaWRnZS55ID09IGJyaWRnZS55KXtcblx0XHRcdFx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkoYnJpZGdlLnRvLmJyaWRnZXMsIHNvdXJjZUJyaWRnZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRnZXREcnVua2VuQXJlYXNQYXRoOiBmdW5jdGlvbiAoZnJvbUFyZWEsIHRvQXJlYSwgYXJlYXMpe1xuXHRcdHZhciBjdXJyZW50QXJlYSA9IGZyb21BcmVhO1xuXHRcdHZhciBwYXRoID0gW107XG5cdFx0cGF0aC5wdXNoKGZyb21BcmVhKTtcblx0XHRwYXRoLnB1c2godG9BcmVhKTtcblx0XHRpZiAoZnJvbUFyZWEgPT0gdG9BcmVhKVxuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0d2hpbGUgKHRydWUpe1xuXHRcdFx0dmFyIHJhbmRvbUJyaWRnZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGN1cnJlbnRBcmVhLmJyaWRnZXMpO1xuXHRcdFx0aWYgKCFyYW5kb21CcmlkZ2UudG8pXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0aWYgKCFVdGlsLmNvbnRhaW5zKHBhdGgsIHJhbmRvbUJyaWRnZS50bykpe1xuXHRcdFx0XHRwYXRoLnB1c2gocmFuZG9tQnJpZGdlLnRvKTtcblx0XHRcdH1cblx0XHRcdGlmIChyYW5kb21CcmlkZ2UudG8gPT0gdG9BcmVhKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGN1cnJlbnRBcmVhID0gcmFuZG9tQnJpZGdlLnRvO1xuXHRcdH1cblx0XHRyZXR1cm4gcGF0aDtcblx0fVxuXHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaGlyZExldmVsR2VuZXJhdG9yOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRyYW5kOiBmdW5jdGlvbiAobG93LCBoaSl7XG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChoaSAtIGxvdyArIDEpKStsb3c7XG5cdH0sXG5cdHJhbmRvbUVsZW1lbnRPZjogZnVuY3Rpb24gKGFycmF5KXtcblx0XHRyZXR1cm4gYXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmFycmF5Lmxlbmd0aCldO1xuXHR9LFxuXHRkaXN0YW5jZTogZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XG5cdFx0cmV0dXJuIE1hdGguc3FydCgoeDIteDEpKih4Mi14MSkgKyAoeTIteTEpKih5Mi15MSkpO1xuXHR9LFxuXHRmbGF0RGlzdGFuY2U6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKXtcblx0XHR2YXIgeERpc3QgPSBNYXRoLmFicyh4MSAtIHgyKTtcblx0XHR2YXIgeURpc3QgPSBNYXRoLmFicyh5MSAtIHkyKTtcblx0XHRpZiAoeERpc3QgPT09IHlEaXN0KVxuXHRcdFx0cmV0dXJuIHhEaXN0O1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB4RGlzdCArIHlEaXN0O1xuXHR9LFxuXHRsaW5lRGlzdGFuY2U6IGZ1bmN0aW9uKHBvaW50MSwgcG9pbnQyKXtcblx0ICB2YXIgeHMgPSAwO1xuXHQgIHZhciB5cyA9IDA7XG5cdCAgeHMgPSBwb2ludDIueCAtIHBvaW50MS54O1xuXHQgIHhzID0geHMgKiB4cztcblx0ICB5cyA9IHBvaW50Mi55IC0gcG9pbnQxLnk7XG5cdCAgeXMgPSB5cyAqIHlzO1xuXHQgIHJldHVybiBNYXRoLnNxcnQoIHhzICsgeXMgKTtcblx0fSxcblx0ZGlyZWN0aW9uOiBmdW5jdGlvbiAoYSxiKXtcblx0XHRyZXR1cm4ge3g6IHNpZ24oYi54IC0gYS54KSwgeTogc2lnbihiLnkgLSBhLnkpfTtcblx0fSxcblx0Y2hhbmNlOiBmdW5jdGlvbiAoY2hhbmNlKXtcblx0XHRyZXR1cm4gdGhpcy5yYW5kKDAsMTAwKSA8PSBjaGFuY2U7XG5cdH0sXG5cdGNvbnRhaW5zOiBmdW5jdGlvbihhcnJheSwgZWxlbWVudCl7XG5cdCAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihlbGVtZW50KSA+IC0xO1xuXHR9LFxuXHRyZW1vdmVGcm9tQXJyYXk6IGZ1bmN0aW9uKGFycmF5LCBvYmplY3QpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmIChhcnJheVtpXSA9PSBvYmplY3Qpe1xuXHRcdFx0XHR0aGlzLnJlbW92ZUZyb21BcnJheUluZGV4KGFycmF5LCBpLGkpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRyZW1vdmVGcm9tQXJyYXlJbmRleDogZnVuY3Rpb24oYXJyYXksIGZyb20sIHRvKSB7XG5cdFx0dmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG5cdFx0YXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcblx0XHRyZXR1cm4gYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG5cdH0sXG5cdGxpbmU6IGZ1bmN0aW9uIChhLCBiKXtcblx0XHR2YXIgY29vcmRpbmF0ZXNBcnJheSA9IG5ldyBBcnJheSgpO1xuXHRcdHZhciB4MSA9IGEueDtcblx0XHR2YXIgeTEgPSBhLnk7XG5cdFx0dmFyIHgyID0gYi54O1xuXHRcdHZhciB5MiA9IGIueTtcblx0ICAgIHZhciBkeCA9IE1hdGguYWJzKHgyIC0geDEpO1xuXHQgICAgdmFyIGR5ID0gTWF0aC5hYnMoeTIgLSB5MSk7XG5cdCAgICB2YXIgc3ggPSAoeDEgPCB4MikgPyAxIDogLTE7XG5cdCAgICB2YXIgc3kgPSAoeTEgPCB5MikgPyAxIDogLTE7XG5cdCAgICB2YXIgZXJyID0gZHggLSBkeTtcblx0ICAgIGNvb3JkaW5hdGVzQXJyYXkucHVzaCh7eDogeDEsIHk6IHkxfSk7XG5cdCAgICB3aGlsZSAoISgoeDEgPT0geDIpICYmICh5MSA9PSB5MikpKSB7XG5cdCAgICBcdHZhciBlMiA9IGVyciA8PCAxO1xuXHQgICAgXHRpZiAoZTIgPiAtZHkpIHtcblx0ICAgIFx0XHRlcnIgLT0gZHk7XG5cdCAgICBcdFx0eDEgKz0gc3g7XG5cdCAgICBcdH1cblx0ICAgIFx0aWYgKGUyIDwgZHgpIHtcblx0ICAgIFx0XHRlcnIgKz0gZHg7XG5cdCAgICBcdFx0eTEgKz0gc3k7XG5cdCAgICBcdH1cblx0ICAgIFx0Y29vcmRpbmF0ZXNBcnJheS5wdXNoKHt4OiB4MSwgeTogeTF9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjb29yZGluYXRlc0FycmF5O1xuXHR9XG59Iiwid2luZG93LkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vR2VuZXJhdG9yLmNsYXNzJyk7XG53aW5kb3cuQ2FudmFzUmVuZGVyZXIgPSByZXF1aXJlKCcuL0NhbnZhc1JlbmRlcmVyLmNsYXNzJyk7XG53aW5kb3cuS3JhbWdpbmVFeHBvcnRlciA9IHJlcXVpcmUoJy4vS3JhbWdpbmVFeHBvcnRlci5jbGFzcycpOyJdfQ==
