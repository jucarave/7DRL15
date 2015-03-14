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
		for (var y = 0; y < this.config.LEVEL_HEIGHT; y++){
			map[y] = [];
			for (var x = 0; x < this.config.LEVEL_WIDTH; x++){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvQ0EuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9DYW52YXNSZW5kZXJlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0ZpcnN0TGV2ZWxHZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9HZW5lcmF0b3IuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9JdGVtUG9wdWxhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvS3JhbWdpbmVFeHBvcnRlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL0xldmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvTW9uc3RlclBvcHVsYXRvci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L3N0eWdpYW5nZW4vc3JjL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvU3BsaXR0ZXIuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9UaGlyZExldmVsR2VuZXJhdG9yLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvc3R5Z2lhbmdlbi9zcmMvVXRpbHMuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9zdHlnaWFuZ2VuL3NyYy9XZWJUZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0cnVuQ0E6IGZ1bmN0aW9uKG1hcCwgdHJhbnNmb3JtRnVuY3Rpb24sIHRpbWVzLCBjcm9zcyl7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSsrKXtcblx0XHRcdHZhciBuZXdNYXAgPSBbXTtcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgbWFwLmxlbmd0aDsgeCsrKXtcblx0XHRcdFx0bmV3TWFwW3hdID0gW107XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKyl7XG5cdFx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgbWFwW3hdLmxlbmd0aDsgeSsrKXtcblx0XHRcdFx0XHR2YXIgc3Vycm91bmRpbmdNYXAgPSBbXTtcblx0XHRcdFx0XHRmb3IgKHZhciB4eCA9IHgtMTsgeHggPD0geCsxOyB4eCsrKXtcblx0XHRcdFx0XHRcdGZvciAodmFyIHl5ID0geS0xOyB5eSA8PSB5KzE7IHl5Kyspe1xuXHRcdFx0XHRcdFx0XHRpZiAoY3Jvc3MgJiYgISh4eCA9PSB4IHx8IHl5ID09IHkpKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHRpZiAoeHggPiAwICYmIHh4IDwgbWFwLmxlbmd0aCAmJiB5eSA+IDAgJiYgeXkgPCBtYXBbeF0ubGVuZ3RoKXtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY2VsbCA9IG1hcFt4eF1beXldO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzdXJyb3VuZGluZ01hcFtjZWxsXSlcblx0XHRcdFx0XHRcdFx0XHRcdHN1cnJvdW5kaW5nTWFwW2NlbGxdKys7XG5cdFx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdFx0c3Vycm91bmRpbmdNYXBbY2VsbF0gPSAxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZhciBuZXdDZWxsID0gdHJhbnNmb3JtRnVuY3Rpb24obWFwW3hdW3ldLCBzdXJyb3VuZGluZ01hcCk7XG5cdFx0XHRcdFx0aWYgKG5ld0NlbGwpe1xuXHRcdFx0XHRcdFx0bmV3TWFwW3hdW3ldID0gbmV3Q2VsbDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV3TWFwW3hdW3ldID0gbWFwW3hdW3ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWFwID0gbmV3TWFwO1xuXHRcdH1cblx0XHRyZXR1cm4gbWFwO1xuXHR9XG59IiwiZnVuY3Rpb24gQ2FudmFzUmVuZGVyZXIoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZSA9IHtcblx0ZHJhd1NrZXRjaDogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcywgb3ZlcmxheSl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxNnB4IEF2YXRhclwiO1xuXHRcdGlmICghb3ZlcmxheSlcblx0XHRcdGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0dmFyIHpvb20gPSA4O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBsZXZlbC5hcmVhc1tpXTtcblx0XHRcdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRjb250ZXh0LnJlY3QoYXJlYS54ICogem9vbSwgYXJlYS55ICogem9vbSwgYXJlYS53ICogem9vbSwgYXJlYS5oICogem9vbSk7XG5cdFx0XHRpZiAoIW92ZXJsYXkpe1xuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICd5ZWxsb3cnO1xuXHRcdFx0XHRjb250ZXh0LmZpbGwoKTtcblx0XHRcdH1cblx0XHRcdGNvbnRleHQubGluZVdpZHRoID0gMjtcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuXHRcdFx0Y29udGV4dC5zdHJva2UoKTtcblx0XHRcdHZhciBhcmVhRGVzY3JpcHRpb24gPSAnJztcblx0XHRcdGlmIChhcmVhLmFyZWFUeXBlID09ICdyb29tcycpe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gPSBcIkR1bmdlb25cIjtcblx0XHRcdH0gZWxzZSBpZiAoYXJlYS5mbG9vciA9PSAnZmFrZVdhdGVyJyl7IFxuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gPSBcIkxhZ29vblwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YXJlYURlc2NyaXB0aW9uID0gXCJDYXZlcm5cIjtcblx0XHRcdH1cblx0XHRcdGlmIChhcmVhLmhhc0V4aXQpe1xuXHRcdFx0XHRhcmVhRGVzY3JpcHRpb24gKz0gXCIgKGQpXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJlYS5oYXNFbnRyYW5jZSl7XG5cdFx0XHRcdGFyZWFEZXNjcmlwdGlvbiArPSBcIiAodSlcIjtcblx0XHRcdH1cblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcblx0XHRcdGNvbnRleHQuZmlsbFRleHQoYXJlYURlc2NyaXB0aW9uLChhcmVhLngpKiB6b29tICsgNSwoYXJlYS55ICkqIHpvb20gKyAyMCk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbal07XG5cdFx0XHRcdGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGNvbnRleHQucmVjdCgoYnJpZGdlLngpICogem9vbSAvKi0gem9vbSAvIDIqLywgKGJyaWRnZS55KSAqIHpvb20gLyotIHpvb20gLyAyKi8sIHpvb20sIHpvb20pO1xuXHRcdFx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmVkJztcblx0XHRcdFx0Y29udGV4dC5zdHJva2UoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGRyYXdMZXZlbDogZnVuY3Rpb24obGV2ZWwsIGNhbnZhcyl7XG5cdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XG5cdFx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRjb250ZXh0LmZvbnQ9XCIxMnB4IEdlb3JnaWFcIjtcblx0XHRjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdHZhciB6b29tID0gODtcblx0XHR2YXIgY2VsbHMgPSBsZXZlbC5jZWxscztcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQ7IHkrKyl7XG5cdFx0XHRcdHZhciBjb2xvciA9ICcjRkZGRkZGJztcblx0XHRcdFx0dmFyIGNlbGwgPSBjZWxsc1t4XVt5XTtcblx0XHRcdFx0aWYgKGNlbGwgPT09ICd3YXRlcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMDAwRkYnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbGwgPT09ICdsYXZhJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnI0ZGMDAwMCc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2VsbCA9PT0gJ2Zha2VXYXRlcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMDAwRkYnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3NvbGlkUm9jaycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM1OTRCMkQnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2NhdmVybkZsb29yJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzg3NjQxOCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnZG93bnN0YWlycycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyNGRjAwMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ3Vwc3RhaXJzJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnIzAwRkYwMCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVXYWxsJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnI0JCQkJCQic7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVGbG9vcicpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM2NjY2NjYnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2NvcnJpZG9yJyl7XG5cdFx0XHRcdFx0Y29sb3IgPSAnI0ZGMDAwMCc7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAncGFkZGluZycpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyMwMEZGMDAnO1xuXHRcdFx0XHR9ZWxzZSBpZiAoY2VsbCA9PT0gJ2JyaWRnZScpe1xuXHRcdFx0XHRcdGNvbG9yID0gJyM5NDY4MDAnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG5cdFx0XHRcdGNvbnRleHQuZmlsbFJlY3QoeCAqIHpvb20sIHkgKiB6b29tLCB6b29tLCB6b29tKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBlbmVteSA9IGxldmVsLmVuZW1pZXNbaV07XG5cdFx0XHR2YXIgY29sb3IgPSAnI0ZGRkZGRic7XG5cdFx0XHRzd2l0Y2ggKGVuZW15LmNvZGUpe1xuXHRcdFx0Y2FzZSAnYmF0Jzpcblx0XHRcdFx0Y29sb3IgPSAnI0VFRUVFRSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbGF2YUxpemFyZCc6XG5cdFx0XHRcdGNvbG9yID0gJyMwMEZGODgnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2RhZW1vbic6XG5cdFx0XHRcdGNvbG9yID0gJyNGRjg4MDAnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG5cdFx0XHRjb250ZXh0LmZpbGxSZWN0KGVuZW15LnggKiB6b29tLCBlbmVteS55ICogem9vbSwgem9vbSwgem9vbSk7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSBsZXZlbC5pdGVtc1tpXTtcblx0XHRcdHZhciBjb2xvciA9ICcjRkZGRkZGJztcblx0XHRcdHN3aXRjaCAoaXRlbS5jb2RlKXtcblx0XHRcdGNhc2UgJ2RhZ2dlcic6XG5cdFx0XHRcdGNvbG9yID0gJyNFRUVFRUUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xlYXRoZXJBcm1vcic6XG5cdFx0XHRcdGNvbG9yID0gJyMwMEZGODgnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG5cdFx0XHRjb250ZXh0LmZpbGxSZWN0KGl0ZW0ueCAqIHpvb20sIGl0ZW0ueSAqIHpvb20sIHpvb20sIHpvb20pO1xuXHRcdH1cblx0fSxcblx0ZHJhd0xldmVsV2l0aEljb25zOiBmdW5jdGlvbihsZXZlbCwgY2FudmFzKXtcblx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzKTtcblx0XHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdGNvbnRleHQuZm9udD1cIjEycHggR2VvcmdpYVwiO1xuXHRcdGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0dmFyIHpvb20gPSA4O1xuXHRcdHZhciB3YXRlciA9IG5ldyBJbWFnZSgpO1xuXHRcdHdhdGVyLnNyYyA9ICdpbWcvd2F0ZXIucG5nJztcblx0XHR2YXIgZmFrZVdhdGVyID0gbmV3IEltYWdlKCk7XG5cdFx0ZmFrZVdhdGVyLnNyYyA9ICdpbWcvd2F0ZXIucG5nJztcblx0XHR2YXIgc29saWRSb2NrID0gbmV3IEltYWdlKCk7XG5cdFx0c29saWRSb2NrLnNyYyA9ICdpbWcvc29saWRSb2NrLnBuZyc7XG5cdFx0dmFyIGNhdmVybkZsb29yID0gbmV3IEltYWdlKCk7XG5cdFx0Y2F2ZXJuRmxvb3Iuc3JjID0gJ2ltZy9jYXZlcm5GbG9vci5wbmcnO1xuXHRcdHZhciBkb3duc3RhaXJzID0gbmV3IEltYWdlKCk7XG5cdFx0ZG93bnN0YWlycy5zcmMgPSAnaW1nL2Rvd25zdGFpcnMucG5nJztcblx0XHR2YXIgdXBzdGFpcnMgPSBuZXcgSW1hZ2UoKTtcblx0XHR1cHN0YWlycy5zcmMgPSAnaW1nL3Vwc3RhaXJzLnBuZyc7XG5cdFx0dmFyIHN0b25lV2FsbCA9IG5ldyBJbWFnZSgpO1xuXHRcdHN0b25lV2FsbC5zcmMgPSAnaW1nL3N0b25lV2FsbC5wbmcnO1xuXHRcdHZhciBzdG9uZUZsb29yID0gbmV3IEltYWdlKCk7XG5cdFx0c3RvbmVGbG9vci5zcmMgPSAnaW1nL3N0b25lRmxvb3IucG5nJztcblx0XHR2YXIgYnJpZGdlID0gbmV3IEltYWdlKCk7XG5cdFx0YnJpZGdlLnNyYyA9ICdpbWcvYnJpZGdlLnBuZyc7XG5cdFx0dmFyIGxhdmEgPSBuZXcgSW1hZ2UoKTtcblx0XHRsYXZhLnNyYyA9ICdpbWcvbGF2YS5wbmcnO1xuXHRcdHZhciBiYXQgPSBuZXcgSW1hZ2UoKTtcblx0XHRiYXQuc3JjID0gJ2ltZy9iYXQucG5nJztcblx0XHR2YXIgbGF2YUxpemFyZCA9IG5ldyBJbWFnZSgpO1xuXHRcdGxhdmFMaXphcmQuc3JjID0gJ2ltZy9sYXZhTGl6YXJkLnBuZyc7XG5cdFx0dmFyIGRhZW1vbiA9IG5ldyBJbWFnZSgpO1xuXHRcdGRhZW1vbi5zcmMgPSAnaW1nL2RhZW1vbi5wbmcnO1xuXHRcdHZhciB0cmVhc3VyZSA9IG5ldyBJbWFnZSgpO1xuXHRcdHRyZWFzdXJlLnNyYyA9ICdpbWcvdHJlYXN1cmUucG5nJztcblx0XHR2YXIgdGlsZXMgPSB7XG5cdFx0XHR3YXRlcjogd2F0ZXIsXG5cdFx0XHRmYWtlV2F0ZXI6IGZha2VXYXRlcixcblx0XHRcdHNvbGlkUm9jazogc29saWRSb2NrLFxuXHRcdFx0Y2F2ZXJuRmxvb3I6IGNhdmVybkZsb29yLFxuXHRcdFx0ZG93bnN0YWlyczogZG93bnN0YWlycyxcblx0XHRcdHVwc3RhaXJzOiB1cHN0YWlycyxcblx0XHRcdHN0b25lV2FsbDogc3RvbmVXYWxsLFxuXHRcdFx0c3RvbmVGbG9vcjogc3RvbmVGbG9vcixcblx0XHRcdGJyaWRnZTogYnJpZGdlLFxuXHRcdFx0bGF2YTogbGF2YSxcblx0XHRcdGJhdDogYmF0LFxuXHRcdFx0bGF2YUxpemFyZDogbGF2YUxpemFyZCxcblx0XHRcdGRhZW1vbjogZGFlbW9uLFxuXHRcdFx0dHJlYXN1cmU6IHRyZWFzdXJlXG5cdFx0fVxuXHQgICAgdmFyIGNlbGxzID0gbGV2ZWwuY2VsbHM7XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmNvbmZpZy5MRVZFTF9XSURUSDsgeCsrKXtcblx0XHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldOyBcblx0XHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGlsZXNbY2VsbF0sIHggKiAxNiwgeSAqIDE2KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBlbmVteSA9IGxldmVsLmVuZW1pZXNbaV07XG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aWxlc1tlbmVteS5jb2RlXSwgZW5lbXkueCAqIDE2LCBlbmVteS55ICogMTYpO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsLml0ZW1zLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBpdGVtID0gbGV2ZWwuaXRlbXNbaV07XG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aWxlc1sndHJlYXN1cmUnXSwgaXRlbS54ICogMTYsIGl0ZW0ueSAqIDE2KTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXNSZW5kZXJlcjsiLCJmdW5jdGlvbiBGaXJzdExldmVsR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBTcGxpdHRlciA9IHJlcXVpcmUoJy4vU3BsaXR0ZXInKTtcblxuRmlyc3RMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdExBVkFfQ0hBTkNFOiAgICAgWzEwMCwgIDAsIDIwLCAgMCwxMDAsIDEwLCA1MCwxMDBdLFxuXHRXQVRFUl9DSEFOQ0U6ICAgIFsgIDAsMTAwLCAxMCwxMDAsICAwLCA1MCwgIDAsICAwXSxcblx0Q0FWRVJOX0NIQU5DRTogICBbIDgwLCA4MCwgMjAsIDIwLCA2MCwgOTAsIDEwLCA1MF0sXG5cdExBR09PTl9DSEFOQ0U6ICAgWyAgMCwgNTAsIDEwLCAyMCwgIDAsIDMwLCAgMCwgIDBdLFxuXHRXQUxMTEVTU19DSEFOQ0U6IFsgNTAsIDEwLCA4MCwgOTAsIDEwLCA5MCwgMTAsIDUwXSxcblx0R0FOR1M6IFtcblx0XHRbIC8vIExldmVsIDFcblx0XHRcdHtib3NzOiAnZGFlbW9uJywgbWluaW9uczogWydmaXJlbGl6YXJkJ10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHttaW5pb25zOiBbJ2ZpcmVsaXphcmQnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHtib3NzOiAnaHlkcmEnLCBtaW5pb25zOiBbJ2ZpcmVsaXphcmQnXSwgcXVhbnRpdHk6IDV9XG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDJcblx0XHRcdHtib3NzOiAnZGFlbW9uJywgbWluaW9uczogWydzZWFTZXJwZW50JywgJ29jdG9wdXMnLCAnbml4aWUnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e2Jvc3M6ICdoeWRyYScsIG1pbmlvbnM6IFsnc2VhU2VycGVudCcsICdvY3RvcHVzJywgJ25peGllJ10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydzZWFTZXJwZW50JywgJ29jdG9wdXMnLCAnbml4aWUnXSwgcXVhbnRpdHk6IDV9LFxuXHRcdFx0e21pbmlvbnM6IFsnc2VhU2VycGVudCddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e21pbmlvbnM6IFsnbml4aWUnXSwgcXVhbnRpdHk6IDEwfVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCAzXG5cdFx0XHR7bWluaW9uczogWydkYWVtb24nXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydkYWVtb24nXSwgcXVhbnRpdHk6IDN9LFxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA0XG5cdFx0XHR7Ym9zczogJ2dhemVyJywgbWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2xpY2hlJywgbWluaW9uczogWydnaG9zdCddLCBxdWFudGl0eTogNX0sXG5cdFx0XHR7Ym9zczogJ2RhZW1vbicsIG1pbmlvbnM6IFsnZ2F6ZXInLCAnZ3JlbWxpbiddLCBxdWFudGl0eTogNX0sXG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDVcblx0XHRcdHttaW5pb25zOiBbJ2RyYWdvbicsICd6b3JuJywgJ2JhbHJvbiddLCBxdWFudGl0eTogNn0sXG5cdFx0XHR7bWluaW9uczogWydyZWFwZXInLCAnZ2F6ZXInLCAncGhhbnRvbSddLCBxdWFudGl0eTogNn0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnaGVhZGxlc3MnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHtib3NzOiAnem9ybicsIG1pbmlvbnM6IFsnaGVhZGxlc3MnXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHttaW5pb25zOiBbJ2RyYWdvbicsICdsYXZhTGl6YXJkJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XSxcblx0XHRbIC8vIExldmVsIDZcblx0XHRcdHttaW5pb25zOiBbJ3JlYXBlciddLCBxdWFudGl0eTogNn0sXG5cdFx0XHR7Ym9zczogJ2JhbHJvbicsIG1pbmlvbnM6IFsnZGFlbW9uJ10sIHF1YW50aXR5OiA2fSxcblx0XHRcdHthcmVhVHlwZTogJ2NhdmUnLCBtaW5pb25zOiBbJ2JhdCddLCBxdWFudGl0eTogMTV9LFxuXHRcdFx0e2FyZWFUeXBlOiAnY2F2ZScsIGJvc3M6ICd0d2lzdGVyJywgbWluaW9uczogWydzZWFTZXJwZW50J10sIHF1YW50aXR5OiA1fSxcblx0XHRcdHtib3NzOiAnYmFscm9uJywgbWluaW9uczogWydoeWRyYSddLCBxdWFudGl0eTogMTB9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ21hZ2UnXSwgcXVhbnRpdHk6IDEwfVxuXHRcdF0sXG5cdFx0WyAvLyBMZXZlbCA3XG5cdFx0XHR7bWluaW9uczogWydoZWFkbGVzcyddLCBxdWFudGl0eTogMjB9LFxuXHRcdFx0e21pbmlvbnM6IFsnaHlkcmEnXSwgcXVhbnRpdHk6IDZ9LFxuXHRcdFx0e21pbmlvbnM6IFsnc2tlbGV0b24nLCAnd2lzcCcsICdnaG9zdCddLCBxdWFudGl0eTogMTV9LFxuXHRcdFx0e2Jvc3M6ICdiYWxyb24nLCBtaW5pb25zOiBbJ3NrZWxldG9uJ10sIHF1YW50aXR5OiAyMH1cblx0XHRdLFxuXHRcdFsgLy8gTGV2ZWwgOFxuXHRcdFx0e21pbmlvbnM6IFsnZHJhZ29uJywgJ2RhZW1vbicsICdiYWxyb24nXSwgcXVhbnRpdHk6IDEwfSxcblx0XHRcdHttaW5pb25zOiBbJ3dhcnJpb3InLCAnbWFnZScsICdiYXJkJywgJ2RydWlkJywgJ3RpbmtlcicsICdwYWxhZGluJywgJ3NoZXBoZXJkJywgJ3JhbmdlciddLCBxdWFudGl0eTogMTV9LFxuXHRcdFx0e21pbmlvbnM6IFsnZ2F6ZXInLCAnYmFscm9uJ10sIHF1YW50aXR5OiAxMH0sXG5cdFx0XHR7Ym9zczogJ2xpY2hlJywgbWluaW9uczogWydza2VsZXRvbiddLCBxdWFudGl0eTogMjB9LFxuXHRcdFx0e21pbmlvbnM6IFsnZ2hvc3QnLCAnd2lzcCddLCBxdWFudGl0eTogMjB9LFxuXHRcdFx0e21pbmlvbnM6IFsnbGF2YUxpemFyZHMnXSwgcXVhbnRpdHk6IDIwfVxuXHRcdF1cdFx0XG5cdF0sXG5cblx0XG5cdGdlbmVyYXRlTGV2ZWw6IGZ1bmN0aW9uKGRlcHRoKXtcblx0XHR2YXIgaGFzUml2ZXIgPSBVdGlsLmNoYW5jZSh0aGlzLldBVEVSX0NIQU5DRVtkZXB0aC0xXSk7XG5cdFx0dmFyIGhhc0xhdmEgPSBVdGlsLmNoYW5jZSh0aGlzLkxBVkFfQ0hBTkNFW2RlcHRoLTFdKTtcblx0XHR2YXIgbWFpbkVudHJhbmNlID0gZGVwdGggPT0gMTtcblx0XHR2YXIgYXJlYXMgPSB0aGlzLmdlbmVyYXRlQXJlYXMoZGVwdGgsIGhhc0xhdmEpO1xuXHRcdHRoaXMucGxhY2VFeGl0cyhhcmVhcyk7XG5cdFx0dmFyIGxldmVsID0ge1xuXHRcdFx0aGFzUml2ZXJzOiBoYXNSaXZlcixcblx0XHRcdGhhc0xhdmE6IGhhc0xhdmEsXG5cdFx0XHRtYWluRW50cmFuY2U6IG1haW5FbnRyYW5jZSxcblx0XHRcdHN0cmF0YTogJ3NvbGlkUm9jaycsXG5cdFx0XHRhcmVhczogYXJlYXMsXG5cdFx0XHRkZXB0aDogZGVwdGhcblx0XHRcdFxuXHRcdH0gXG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRnZW5lcmF0ZUFyZWFzOiBmdW5jdGlvbihkZXB0aCwgaGFzTGF2YSl7XG5cdFx0dmFyIGJpZ0FyZWEgPSB7XG5cdFx0XHR4OiAwLFxuXHRcdFx0eTogMCxcblx0XHRcdHc6IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRILFxuXHRcdFx0aDogdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUXG5cdFx0fVxuXHRcdHZhciBtYXhEZXB0aCA9IHRoaXMuY29uZmlnLlNVQkRJVklTSU9OX0RFUFRIO1xuXHRcdHZhciBNSU5fV0lEVEggPSB0aGlzLmNvbmZpZy5NSU5fV0lEVEg7XG5cdFx0dmFyIE1JTl9IRUlHSFQgPSB0aGlzLmNvbmZpZy5NSU5fSEVJR0hUO1xuXHRcdHZhciBNQVhfV0lEVEggPSB0aGlzLmNvbmZpZy5NQVhfV0lEVEg7XG5cdFx0dmFyIE1BWF9IRUlHSFQgPSB0aGlzLmNvbmZpZy5NQVhfSEVJR0hUO1xuXHRcdHZhciBTTElDRV9SQU5HRV9TVEFSVCA9IHRoaXMuY29uZmlnLlNMSUNFX1JBTkdFX1NUQVJUO1xuXHRcdHZhciBTTElDRV9SQU5HRV9FTkQgPSB0aGlzLmNvbmZpZy5TTElDRV9SQU5HRV9FTkQ7XG5cdFx0dmFyIGFyZWFzID0gU3BsaXR0ZXIuc3ViZGl2aWRlQXJlYShiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQpO1xuXHRcdFNwbGl0dGVyLmNvbm5lY3RBcmVhcyhhcmVhcywzKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHR0aGlzLnNldEFyZWFEZXRhaWxzKGFyZWEsIGRlcHRoLCBoYXNMYXZhKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyZWFzO1xuXHR9LFxuXHRzZXRBcmVhRGV0YWlsczogZnVuY3Rpb24oYXJlYSwgZGVwdGgsIGhhc0xhdmEpe1xuXHRcdGlmIChVdGlsLmNoYW5jZSh0aGlzLkNBVkVSTl9DSEFOQ0VbZGVwdGgtMV0pKXtcblx0XHRcdGFyZWEuYXJlYVR5cGUgPSAnY2F2ZXJuJztcblx0XHRcdGlmIChoYXNMYXZhKXtcblx0XHRcdFx0YXJlYS5mbG9vciA9ICdjYXZlcm5GbG9vcic7XG5cdFx0XHRcdGFyZWEuY2F2ZXJuVHlwZSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKFsncm9ja3knLCdicmlkZ2VzJ10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKFV0aWwuY2hhbmNlKHRoaXMuTEFHT09OX0NIQU5DRVtkZXB0aC0xXSkpe1xuXHRcdFx0XHRcdGFyZWEuZmxvb3IgPSAnZmFrZVdhdGVyJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhcmVhLmZsb29yID0gJ2NhdmVybkZsb29yJztcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmVhLmNhdmVyblR5cGUgPSBVdGlsLnJhbmRvbUVsZW1lbnRPZihbJ3JvY2t5JywnYnJpZGdlcycsJ3dhdGVyeSddKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YXJlYS5hcmVhVHlwZSA9ICdyb29tcyc7XG5cdFx0XHRhcmVhLmZsb29yID0gJ3N0b25lRmxvb3InO1xuXHRcdFx0YXJlYS53YWxsID0gVXRpbC5jaGFuY2UodGhpcy5XQUxMTEVTU19DSEFOQ0VbZGVwdGgtMV0pID8gZmFsc2UgOiAnc3RvbmVXYWxsJztcblx0XHRcdGFyZWEuY29ycmlkb3IgPSAnc3RvbmVGbG9vcic7XG5cdFx0fVxuXHRcdGFyZWEuZW5lbWllcyA9IFtdO1xuXHRcdGFyZWEuaXRlbXMgPSBbXTtcblx0XHRcblx0XHR2YXIgcmFuZG9tR2FuZyA9IFV0aWwucmFuZG9tRWxlbWVudE9mKHRoaXMuR0FOR1NbZGVwdGgtMV0pO1xuXHRcdGFyZWEuZW5lbWllcyA9IHJhbmRvbUdhbmcubWluaW9ucztcblx0XHRhcmVhLmVuZW15Q291bnQgPSByYW5kb21HYW5nLnF1YW50aXR5ICsgVXRpbC5yYW5kKDAsMyk7XG5cdFx0aWYgKHJhbmRvbUdhbmcpXG5cdFx0XHRhcmVhLmJvc3MgPSByYW5kb21HYW5nLmJvc3M7XG5cdH0sXG5cdHBsYWNlRXhpdHM6IGZ1bmN0aW9uKGFyZWFzKXtcblx0XHR2YXIgZGlzdCA9IG51bGw7XG5cdFx0dmFyIGFyZWExID0gbnVsbDtcblx0XHR2YXIgYXJlYTIgPSBudWxsO1xuXHRcdHZhciBmdXNlID0gMTAwMDtcblx0XHRkbyB7XG5cdFx0XHRhcmVhMSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRcdGFyZWEyID0gVXRpbC5yYW5kb21FbGVtZW50T2YoYXJlYXMpO1xuXHRcdFx0aWYgKGZ1c2UgPCAwKXtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRkaXN0ID0gVXRpbC5saW5lRGlzdGFuY2UoYXJlYTEsIGFyZWEyKTtcblx0XHRcdGZ1c2UtLTtcblx0XHR9IHdoaWxlIChkaXN0IDwgKHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIICsgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKSAvIDMpO1xuXHRcdGFyZWExLmhhc0V4aXQgPSB0cnVlO1xuXHRcdGFyZWEyLmhhc0VudHJhbmNlID0gdHJ1ZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcnN0TGV2ZWxHZW5lcmF0b3I7IiwiZnVuY3Rpb24gR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHR0aGlzLmZpcnN0TGV2ZWxHZW5lcmF0b3IgPSBuZXcgRmlyc3RMZXZlbEdlbmVyYXRvcihjb25maWcpO1xuXHR0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yID0gbmV3IFNlY29uZExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMudGhpcmRMZXZlbEdlbmVyYXRvciA9IG5ldyBUaGlyZExldmVsR2VuZXJhdG9yKGNvbmZpZyk7XG5cdHRoaXMubW9uc3RlclBvcHVsYXRvciA9IG5ldyBNb25zdGVyUG9wdWxhdG9yKGNvbmZpZyk7XG5cdHRoaXMuaXRlbVBvcHVsYXRvciA9IG5ldyBJdGVtUG9wdWxhdG9yKGNvbmZpZyk7XG59XG5cbnZhciBGaXJzdExldmVsR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9GaXJzdExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgU2Vjb25kTGV2ZWxHZW5lcmF0b3IgPSByZXF1aXJlKCcuL1NlY29uZExldmVsR2VuZXJhdG9yLmNsYXNzJyk7XG52YXIgVGhpcmRMZXZlbEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vVGhpcmRMZXZlbEdlbmVyYXRvci5jbGFzcycpO1xudmFyIE1vbnN0ZXJQb3B1bGF0b3IgPSByZXF1aXJlKCcuL01vbnN0ZXJQb3B1bGF0b3IuY2xhc3MnKTtcbnZhciBJdGVtUG9wdWxhdG9yID0gcmVxdWlyZSgnLi9JdGVtUG9wdWxhdG9yLmNsYXNzJyk7XG5cbkdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGdlbmVyYXRlTGV2ZWw6IGZ1bmN0aW9uKGRlcHRoKXtcblx0XHR2YXIgc2tldGNoID0gdGhpcy5maXJzdExldmVsR2VuZXJhdG9yLmdlbmVyYXRlTGV2ZWwoZGVwdGgpO1xuXHRcdHZhciBsZXZlbCA9IHRoaXMuc2Vjb25kTGV2ZWxHZW5lcmF0b3IuZmlsbExldmVsKHNrZXRjaCk7XG5cdFx0dGhpcy50aGlyZExldmVsR2VuZXJhdG9yLmZpbGxMZXZlbChza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLnNlY29uZExldmVsR2VuZXJhdG9yLmZyYW1lTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5tb25zdGVyUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0dGhpcy5pdGVtUG9wdWxhdG9yLnBvcHVsYXRlTGV2ZWwoc2tldGNoLCBsZXZlbCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNrZXRjaDogc2tldGNoLFxuXHRcdFx0bGV2ZWw6IGxldmVsXG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yOyIsImZ1bmN0aW9uIEl0ZW1Qb3B1bGF0b3IoY29uZmlnKXtcblx0dGhpcy5jb25maWcgPSBjb25maWc7XG59XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5JdGVtUG9wdWxhdG9yLnByb3RvdHlwZSA9IHtcblx0cG9wdWxhdGVMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0dGhpcy5jYWxjdWxhdGVSYXJpdGllcyhsZXZlbC5kZXB0aCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBza2V0Y2guYXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGFyZWEgPSBza2V0Y2guYXJlYXNbaV07XG5cdFx0XHR0aGlzLnBvcHVsYXRlQXJlYShhcmVhLCBsZXZlbCk7XG5cdFx0fVxuXHR9LFxuXHRwb3B1bGF0ZUFyZWE6IGZ1bmN0aW9uKGFyZWEsIGxldmVsKXtcblx0XHR2YXIgaXRlbXMgPSBVdGlsLnJhbmQoMCwyKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zOyBpKyspe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLmdldEFuSXRlbSgpO1xuXHRcdFx0bGV2ZWwuYWRkSXRlbShpdGVtLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0XHR9XG5cdH0sXG5cdGNhbGN1bGF0ZVJhcml0aWVzOiBmdW5jdGlvbihkZXB0aCl7XG5cdFx0dGhpcy50aHJlc2hvbGRzID0gW107XG5cdFx0dGhpcy5nZW5lcmF0aW9uQ2hhbmNlVG90YWwgPSAwO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5JVEVNUy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuSVRFTVNbaV07XG5cdFx0XHR2YXIgbWFsdXMgPSBNYXRoLmFicyhkZXB0aC1pdGVtLmRlcHRoKSA+IDE7XG5cdFx0XHR2YXIgcmFyaXR5ID0gbWFsdXMgPyBpdGVtLnJhcml0eSAvIDIgOiBpdGVtLnJhcml0eTtcblx0XHRcdHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsICs9IHJhcml0eTtcblx0XHRcdHRoaXMudGhyZXNob2xkcy5wdXNoKHt0aHJlc2hvbGQ6IHRoaXMuZ2VuZXJhdGlvbkNoYW5jZVRvdGFsLCBpdGVtOiBpdGVtfSk7XG5cdFx0fVxuXHR9LFxuXHRJVEVNUzogW1xuXHRcdC8qe2NvZGU6ICdkYWdnZXInLCByYXJpdHk6IDM1MDB9LFxuXHRcdHtjb2RlOiAnb2lsRmxhc2snLCByYXJpdHk6IDE0MDB9LFxuXHRcdHtjb2RlOiAnc3RhZmYnLCByYXJpdHk6IDM1MH0sXG5cdFx0e2NvZGU6ICdzbGluZycsIHJhcml0eTogMjgwfSxcblx0XHR7Y29kZTogJ21hY2UnLCByYXJpdHk6IDcwfSxcblx0XHR7Y29kZTogJ2F4ZScsIHJhcml0eTogMzF9LFxuXHRcdHtjb2RlOiAnYm93JywgcmFyaXR5OiAyOH0sXG5cdFx0e2NvZGU6ICdzd29yZCcsIHJhcml0eTogMzUwfSxcblx0XHR7Y29kZTogJ2hhbGJlcmQnLCByYXJpdHk6IDIzfSxcblx0XHR7Y29kZTogJ2Nyb3NzYm93JywgcmFyaXR5OiAxMX0sXG5cdFx0e2NvZGU6ICdtYWdpY0F4ZScsIHJhcml0eTogNX0sXG5cdFx0e2NvZGU6ICdtYWdpY0JvdycsIHJhcml0eTogNH0sXG5cdFx0e2NvZGU6ICdtYWdpY1N3b3JkJywgcmFyaXR5OiA0fSxcblx0XHR7Y29kZTogJ21hZ2ljV2FuZCcsIHJhcml0eTogMn0sXG5cdFx0e2NvZGU6ICdjbG90aCcsIHJhcml0eTogMTQwfSxcblx0XHR7Y29kZTogJ2xlYXRoZXInLCByYXJpdHk6IDM1fSxcblx0XHR7Y29kZTogJ2NoYWluJywgcmFyaXR5OiAxMn0sXG5cdFx0e2NvZGU6ICdwbGF0ZScsIHJhcml0eTogNH0sXG5cdFx0e2NvZGU6ICdtYWdpY0NoYWluJywgcmFyaXR5OiAyfSxcblx0XHR7Y29kZTogJ21hZ2ljUGxhdGUnLCByYXJpdHk6IDF9Ki9cblx0XHR7Y29kZTogJ2N1cmUnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAxfSxcblx0XHR7Y29kZTogJ2hlYWwnLCByYXJpdHk6IDEwMDAsIGRlcHRoOiAxfSxcblx0XHR7Y29kZTogJ3JlZFBvdGlvbicsIHJhcml0eTogMTAwMCwgZGVwdGg6IDF9LFxuXHRcdHtjb2RlOiAneWVsbG93UG90aW9uJywgcmFyaXR5OiAxMDAwLCBkZXB0aDogMX0sXG5cdFx0e2NvZGU6ICdsaWdodCcsIHJhcml0eTogMTAwMCwgZGVwdGg6IDJ9LFxuXHRcdHtjb2RlOiAnbWlzc2lsZScsIHJhcml0eTogMTAwMCwgZGVwdGg6IDN9LFxuXHRcdHtjb2RlOiAnaWNlYmFsbCcsIHJhcml0eTogNTAwLCBkZXB0aDogNH0sXG5cdFx0e2NvZGU6ICdyZXBlbCcsIHJhcml0eTogNTAwLCBkZXB0aDogNX0sXG5cdFx0e2NvZGU6ICdibGluaycsIHJhcml0eTogMzMzLCBkZXB0aDogNX0sXG5cdFx0e2NvZGU6ICdmaXJlYmFsbCcsIHJhcml0eTogMzMzLCBkZXB0aDogNn0sXG5cdFx0e2NvZGU6ICdwcm90ZWN0aW9uJywgcmFyaXR5OiAyNTAsIGRlcHRoOiA2fSxcblx0XHR7Y29kZTogJ3RpbWUnLCByYXJpdHk6IDIwMCwgZGVwdGg6IDd9LFxuXHRcdHtjb2RlOiAnc2xlZXAnLCByYXJpdHk6IDIwMCwgZGVwdGg6IDd9LFxuXHRcdHtjb2RlOiAnamlueCcsIHJhcml0eTogMTY2LCBkZXB0aDogOH0sXG5cdFx0e2NvZGU6ICd0cmVtb3InLCByYXJpdHk6IDE2NiwgZGVwdGg6IDh9LFxuXHRcdHtjb2RlOiAna2lsbCcsIHJhcml0eTogMTQyLCBkZXB0aDogOH1cblx0XSxcblx0Z2V0QW5JdGVtOiBmdW5jdGlvbigpe1xuXHRcdHZhciBudW1iZXIgPSBVdGlsLnJhbmQoMCwgdGhpcy5nZW5lcmF0aW9uQ2hhbmNlVG90YWwpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50aHJlc2hvbGRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdGlmIChudW1iZXIgPD0gdGhpcy50aHJlc2hvbGRzW2ldLnRocmVzaG9sZClcblx0XHRcdFx0cmV0dXJuIHRoaXMudGhyZXNob2xkc1tpXS5pdGVtLmNvZGU7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLnRocmVzaG9sZHNbMF0uaXRlbS5jb2RlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSXRlbVBvcHVsYXRvcjsiLCJmdW5jdGlvbiBLcmFtZ2luZUV4cG9ydGVyKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG5LcmFtZ2luZUV4cG9ydGVyLnByb3RvdHlwZSA9IHtcblx0Z2V0TGV2ZWw6IGZ1bmN0aW9uKGxldmVsKXtcblx0XHR2YXIgdGlsZXMgPSB0aGlzLmdldFRpbGVzKCk7XG5cdFx0dmFyIG9iamVjdHMgPSB0aGlzLmdldE9iamVjdHMobGV2ZWwpO1xuXHRcdHZhciBtYXAgPSB0aGlzLmdldE1hcChsZXZlbCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpbGVzOiB0aWxlcyxcblx0XHRcdG9iamVjdHM6IG9iamVjdHMsXG5cdFx0XHRtYXA6IG1hcFxuXHRcdH07XG5cdH0sXG5cdEJBU0lDX1dBTExfVElMRToge1xuICAgICAgICBcIndcIjoyLFxuICAgICAgICBcInlcIjowLFxuICAgICAgICBcImhcIjoyLFxuICAgICAgICBcImNcIjowLFxuICAgICAgICBcImZcIjowLFxuICAgICAgICBcImNoXCI6MixcbiAgICAgICAgXCJzbFwiOjAsXG4gICAgICAgIFwiZGlyXCI6MCxcbiAgICAgICAgXCJmeVwiOjBcbiAgICB9LFxuICAgIEJBU0lDX0ZMT09SX1RJTEU6IHtcbiAgICBcdFwid1wiOjAsXG4gICAgICAgIFwieVwiOjAsXG4gICAgICAgIFwiaFwiOjIsXG4gICAgICAgIFwiY1wiOjIsXG4gICAgICAgIFwiZlwiOjIsXG4gICAgICAgIFwiY2hcIjoyLFxuICAgICAgICBcInNsXCI6MCxcbiAgICAgICAgXCJkaXJcIjowLFxuICAgICAgICBcImZ5XCI6MFxuICAgIH0sXG4gICAgV0FURVJfVElMRToge1xuICAgIFx0XCJ3XCI6MCxcbiAgICBcdFwieVwiOjAsXG4gICAgXHRcImhcIjoyLFxuICAgIFx0XCJjXCI6MixcbiAgICBcdFwiZlwiOjEwMSxcbiAgICBcdFwiY2hcIjoyLFxuICAgIFx0XCJzbFwiOjAsXG4gICAgXHRcImRpclwiOjAsXG4gICAgXHRcImZ5XCI6MFxuXHR9LFxuXHRMQVZBX1RJTEU6IHtcbiAgICBcdFwid1wiOjAsXG4gICAgXHRcInlcIjowLFxuICAgIFx0XCJoXCI6MixcbiAgICBcdFwiY1wiOjIsXG4gICAgXHRcImZcIjoxMDEsXG4gICAgXHRcImNoXCI6MixcbiAgICBcdFwic2xcIjowLFxuICAgIFx0XCJkaXJcIjowLFxuICAgIFx0XCJmeVwiOjBcblx0fSxcblx0Z2V0VGlsZXM6IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIFtcblx0ICAgICAgICBudWxsLCBcblx0ICAgICAgICB0aGlzLkJBU0lDX1dBTExfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX1dBTExfVElMRSxcblx0ICAgICAgICB0aGlzLkJBU0lDX0ZMT09SX1RJTEUsXG5cdCAgICAgICAgdGhpcy5CQVNJQ19GTE9PUl9USUxFLFxuXHQgICAgICAgIHRoaXMuQkFTSUNfRkxPT1JfVElMRSwgXG5cdCAgICAgICAgdGhpcy5MQVZBX1RJTEUsXG5cdCAgICAgICAgdGhpcy5XQVRFUl9USUxFXG5cdFx0XTtcblx0fSxcblx0Z2V0T2JqZWN0czogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBvYmplY3RzID0gW107XG5cdFx0b2JqZWN0cy5wdXNoKHtcblx0XHRcdHg6IGxldmVsLnN0YXJ0LnggKyAwLjUsXG5cdFx0XHR6OiBsZXZlbC5zdGFydC55ICsgMC41LFxuXHRcdFx0eTogMCxcblx0XHRcdGRpcjogMyxcblx0XHRcdHR5cGU6ICdwbGF5ZXInXG5cdFx0fSk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZXZlbC5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBlbmVteSA9IGxldmVsLmVuZW1pZXNbaV07XG5cdFx0XHR2YXIgZW5lbXlEYXRhID1cblx0XHRcdHtcblx0ICAgICAgICAgICAgeDogZW5lbXkueCArIDAuNSxcblx0ICAgICAgICAgICAgejogZW5lbXkueSArIDAuNSxcblx0ICAgICAgICAgICAgeTogMCxcblx0ICAgICAgICAgICAgdHlwZTogJ2VuZW15Jyxcblx0ICAgICAgICAgICAgZW5lbXk6IGVuZW15LmNvZGVcblx0ICAgICAgICB9O1xuXHRcdFx0b2JqZWN0cy5wdXNoKGVuZW15RGF0YSk7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWwuaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGl0ZW0gPSBsZXZlbC5pdGVtc1tpXTtcblx0XHRcdHZhciBpdGVtRGF0YSA9XG5cdFx0XHR7XG5cdCAgICAgICAgICAgIHg6IGl0ZW0ueCArIDAuNSxcblx0ICAgICAgICAgICAgejogaXRlbS55ICsgMC41LFxuXHQgICAgICAgICAgICB5OiAwLFxuXHQgICAgICAgICAgICB0eXBlOiAnaXRlbScsXG5cdCAgICAgICAgICAgIGl0ZW06IGl0ZW0uY29kZVxuXHQgICAgICAgIH07XG5cdFx0XHRvYmplY3RzLnB1c2goaXRlbURhdGEpO1xuXHRcdH1cblx0XHRyZXR1cm4gb2JqZWN0cztcblx0fSxcblx0Z2V0TWFwOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0dmFyIG1hcCA9IFtdO1xuXHRcdHZhciBjZWxscyA9IGxldmVsLmNlbGxzO1xuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUOyB5Kyspe1xuXHRcdFx0bWFwW3ldID0gW107XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0XHR2YXIgY2VsbCA9IGNlbGxzW3hdW3ldO1xuXHRcdFx0XHR2YXIgaWQgPSBudWxsO1xuXHRcdFx0XHRpZiAoY2VsbCA9PT0gJ3dhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fSBlbHNlIGlmIChjZWxsID09PSAnZmFrZVdhdGVyJyl7XG5cdFx0XHRcdFx0aWQgPSAxMDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzb2xpZFJvY2snKXtcblx0XHRcdFx0XHRpZCA9IDE7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnY2F2ZXJuRmxvb3InKXtcblx0XHRcdFx0XHRpZCA9IDI7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnZG93bnN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gMztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICd1cHN0YWlycycpe1xuXHRcdFx0XHRcdGlkID0gNDtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdzdG9uZVdhbGwnKXtcblx0XHRcdFx0XHRpZCA9IDU7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnc3RvbmVGbG9vcicpe1xuXHRcdFx0XHRcdGlkID0gNjtcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdjb3JyaWRvcicpe1xuXHRcdFx0XHRcdGlkID0gNztcblx0XHRcdFx0fWVsc2UgaWYgKGNlbGwgPT09ICdicmlkZ2UnKXtcblx0XHRcdFx0XHRpZCA9IDg7XG5cdFx0XHRcdH1lbHNlIGlmIChjZWxsID09PSAnbGF2YScpe1xuXHRcdFx0XHRcdGlkID0gOTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXBbeV1beF0gPSBpZDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hcDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtyYW1naW5lRXhwb3J0ZXI7XG4iLCJmdW5jdGlvbiBMZXZlbChjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn07XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5MZXZlbC5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5jZWxscyA9IFtdO1xuXHRcdHRoaXMuZW5lbWllcyA9IFtdO1xuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0dGhpcy5jZWxsc1t4XSA9IFtdO1xuXHRcdH1cblx0fSxcblx0YWRkRW5lbXk6IGZ1bmN0aW9uKGVuZW15LCB4LCB5KXtcblx0XHR0aGlzLmVuZW1pZXMucHVzaCh7XG5cdFx0XHRjb2RlOiBlbmVteSxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fSk7XG5cdH0sXG5cdGFkZEl0ZW06IGZ1bmN0aW9uKGl0ZW0sIHgsIHkpe1xuXHRcdHRoaXMuaXRlbXMucHVzaCh7XG5cdFx0XHRjb2RlOiBpdGVtLFxuXHRcdFx0eDogeCxcblx0XHRcdHk6IHlcblx0XHR9KTtcblx0fSxcblx0Z2V0RnJlZVBsYWNlOiBmdW5jdGlvbihhcmVhKXtcblx0XHR3aGlsZSh0cnVlKXtcblx0XHRcdHZhciByYW5kUG9pbnQgPSB7XG5cdFx0XHRcdHg6IFV0aWwucmFuZChhcmVhLngsIGFyZWEueCthcmVhLnctMSksXG5cdFx0XHRcdHk6IFV0aWwucmFuZChhcmVhLnksIGFyZWEueSthcmVhLmgtMSlcblx0XHRcdH1cblx0XHRcdHZhciBjZWxsID0gdGhpcy5jZWxsc1tyYW5kUG9pbnQueF1bcmFuZFBvaW50LnldOyBcblx0XHRcdGlmIChjZWxsID09IGFyZWEuZmxvb3IgfHwgYXJlYS5jb3JyaWRvciAmJiBjZWxsID09IGFyZWEuY29ycmlkb3IgfHwgY2VsbCA9PSAnZmFrZVdhdGVyJylcblx0XHRcdFx0cmV0dXJuIHJhbmRQb2ludDtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGV2ZWw7IiwiZnVuY3Rpb24gTW9uc3RlclBvcHVsYXRvcihjb25maWcpe1xuXHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcbn1cblxudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbk1vbnN0ZXJQb3B1bGF0b3IucHJvdG90eXBlID0ge1xuXHRwb3B1bGF0ZUxldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNrZXRjaC5hcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IHNrZXRjaC5hcmVhc1tpXTtcblx0XHRcdHRoaXMucG9wdWxhdGVBcmVhKGFyZWEsIGxldmVsKTtcblx0XHR9XG5cdH0sXG5cdHBvcHVsYXRlQXJlYTogZnVuY3Rpb24oYXJlYSwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYS5lbmVteUNvdW50OyBpKyspe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0aWYgKHBvc2l0aW9uKXtcblx0XHRcdFx0dGhpcy5hZGRNb25zdGVyKGFyZWEsICBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBsZXZlbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChhcmVhLmJvc3Mpe1xuXHRcdFx0dmFyIHBvc2l0aW9uID0gbGV2ZWwuZ2V0RnJlZVBsYWNlKGFyZWEpO1xuXHRcdFx0aWYgKHBvc2l0aW9uKXtcblx0XHRcdFx0bGV2ZWwuYWRkRW5lbXkoYXJlYS5ib3NzLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGFkZE1vbnN0ZXI6IGZ1bmN0aW9uKGFyZWEsIHgsIHksIGxldmVsKXtcblx0XHR2YXIgbW9uc3RlciA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWEuZW5lbWllcyk7XG5cdFx0bGV2ZWwuYWRkRW5lbXkobW9uc3RlciwgeCwgeSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb25zdGVyUG9wdWxhdG9yOyIsImZ1bmN0aW9uIFNlY29uZExldmVsR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwuY2xhc3MnKTtcbnZhciBDQSA9IHJlcXVpcmUoJy4vQ0EnKTtcblxuU2Vjb25kTGV2ZWxHZW5lcmF0b3IucHJvdG90eXBlID0ge1xuXHRmaWxsTGV2ZWw6IGZ1bmN0aW9uKHNrZXRjaCl7XG5cdFx0dmFyIGxldmVsID0gbmV3IExldmVsKHRoaXMuY29uZmlnKTtcblx0XHRsZXZlbC5pbml0KCk7XG5cdFx0dGhpcy5maWxsU3RyYXRhKGxldmVsLCBza2V0Y2gpO1xuXHRcdGlmIChza2V0Y2guaGFzTGF2YSlcblx0XHRcdHRoaXMucGxvdFJpdmVycyhsZXZlbCwgc2tldGNoLCAnbGF2YScpO1xuXHRcdGVsc2UgaWYgKHNrZXRjaC5oYXNSaXZlcnMpXG5cdFx0XHR0aGlzLnBsb3RSaXZlcnMobGV2ZWwsIHNrZXRjaCwgJ3dhdGVyJyk7XG5cdFx0dGhpcy5jb3B5R2VvKGxldmVsKTtcblx0XHRyZXR1cm4gbGV2ZWw7XG5cdH0sXG5cdGZpbGxTdHJhdGE6IGZ1bmN0aW9uKGxldmVsLCBza2V0Y2gpe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEg7IHgrKyl7XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y29weUdlbzogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdHZhciBnZW8gPSBbXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0Z2VvW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdFx0Z2VvW3hdW3ldID0gbGV2ZWwuY2VsbHNbeF1beV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldmVsLmdlbyA9IGdlbztcblx0fSxcblx0cGxvdFJpdmVyczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHR0aGlzLnBsYWNlUml2ZXJsaW5lcyhsZXZlbCwgc2tldGNoLCBsaXF1aWQpO1xuXHRcdHRoaXMuZmF0dGVuUml2ZXJzKGxldmVsLCBsaXF1aWQpO1xuXHRcdGlmIChsaXF1aWQgPT0gJ2xhdmEnKVxuXHRcdFx0dGhpcy5mYXR0ZW5SaXZlcnMobGV2ZWwsIGxpcXVpZCk7XG5cdH0sXG5cdGZhdHRlblJpdmVyczogZnVuY3Rpb24obGV2ZWwsIGxpcXVpZCl7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nW2xpcXVpZF0gPiAxICYmIFV0aWwuY2hhbmNlKDMwKSlcblx0XHRcdFx0cmV0dXJuIGxpcXVpZDtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRsZXZlbC5jZWxscyA9IENBLnJ1bkNBKGxldmVsLmNlbGxzLCBmdW5jdGlvbihjdXJyZW50LCBzdXJyb3VuZGluZyl7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbbGlxdWlkXSA+IDEpXG5cdFx0XHRcdHJldHVybiBsaXF1aWQ7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdH0sXG5cdHBsYWNlUml2ZXJsaW5lczogZnVuY3Rpb24obGV2ZWwsIHNrZXRjaCwgbGlxdWlkKXtcblx0XHQvLyBQbGFjZSByYW5kb20gbGluZSBzZWdtZW50cyBvZiB3YXRlclxuXHRcdHZhciByaXZlcnMgPSBVdGlsLnJhbmQodGhpcy5jb25maWcuTUlOX1JJVkVSUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJTKTtcblx0XHR2YXIgcml2ZXJTZWdtZW50TGVuZ3RoID0gdGhpcy5jb25maWcuUklWRVJfU0VHTUVOVF9MRU5HVEg7XG5cdFx0dmFyIHB1ZGRsZSA9IGZhbHNlO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcml2ZXJzOyBpKyspe1xuXHRcdFx0dmFyIHNlZ21lbnRzID0gVXRpbC5yYW5kKHRoaXMuY29uZmlnLk1JTl9SSVZFUl9TRUdNRU5UUyx0aGlzLmNvbmZpZy5NQVhfUklWRVJfU0VHTUVOVFMpO1xuXHRcdFx0dmFyIHJpdmVyUG9pbnRzID0gW107XG5cdFx0XHRyaXZlclBvaW50cy5wdXNoKHtcblx0XHRcdFx0eDogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIKSxcblx0XHRcdFx0eTogVXRpbC5yYW5kKDAsIHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdH0pO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBzZWdtZW50czsgaisrKXtcblx0XHRcdFx0dmFyIHJhbmRvbVBvaW50ID0gVXRpbC5yYW5kb21FbGVtZW50T2Yocml2ZXJQb2ludHMpO1xuXHRcdFx0XHRpZiAocml2ZXJQb2ludHMubGVuZ3RoID4gMSAmJiAhcHVkZGxlKVxuXHRcdFx0XHRcdFV0aWwucmVtb3ZlRnJvbUFycmF5KHJpdmVyUG9pbnRzLCByYW5kb21Qb2ludCk7XG5cdFx0XHRcdHZhciBpYW5jZSA9IHtcblx0XHRcdFx0XHR4OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKSxcblx0XHRcdFx0XHR5OiBVdGlsLnJhbmQoLXJpdmVyU2VnbWVudExlbmd0aCwgcml2ZXJTZWdtZW50TGVuZ3RoKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgbmV3UG9pbnQgPSB7XG5cdFx0XHRcdFx0eDogcmFuZG9tUG9pbnQueCArIGlhbmNlLngsXG5cdFx0XHRcdFx0eTogcmFuZG9tUG9pbnQueSArIGlhbmNlLnksXG5cdFx0XHRcdH07XG5cdFx0XHRcdGlmIChuZXdQb2ludC54ID4gMCAmJiBuZXdQb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0bmV3UG9pbnQueSA+IDAgJiYgbmV3UG9pbnQueSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVClcblx0XHRcdFx0XHRyaXZlclBvaW50cy5wdXNoKG5ld1BvaW50KTtcblx0XHRcdFx0dmFyIGxpbmUgPSBVdGlsLmxpbmUocmFuZG9tUG9pbnQsIG5ld1BvaW50KTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBsaW5lLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2tdO1xuXHRcdFx0XHRcdGlmIChwb2ludC54ID4gMCAmJiBwb2ludC54IDwgdGhpcy5jb25maWcuTEVWRUxfV0lEVEggJiYgXG5cdFx0XHRcdFx0XHRwb2ludC55ID4gMCAmJiBwb2ludC55IDwgdGhpcy5jb25maWcuTEVWRUxfSEVJR0hUKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gbGlxdWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRmcmFtZUxldmVsOiBmdW5jdGlvbihza2V0Y2gsIGxldmVsKXtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY29uZmlnLkxFVkVMX1dJRFRIOyB4Kyspe1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzW3hdWzBdICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t4XVswXSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0XHRpZiAobGV2ZWwuY2VsbHNbeF1bdGhpcy5jb25maWcuTEVWRUxfSEVJR0hULTFdICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t4XVt0aGlzLmNvbmZpZy5MRVZFTF9IRUlHSFQtMV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdH1cblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuY29uZmlnLkxFVkVMX0hFSUdIVDsgeSsrKXtcblx0XHRcdGlmIChsZXZlbC5jZWxsc1swXVt5XSAhPSAnc3RvbmVXYWxsJykgbGV2ZWwuY2VsbHNbMF1beV0gPSBza2V0Y2guc3RyYXRhO1xuXHRcdFx0aWYgKGxldmVsLmNlbGxzW3RoaXMuY29uZmlnLkxFVkVMX1dJRFRILTFdW3ldICE9ICdzdG9uZVdhbGwnKSBsZXZlbC5jZWxsc1t0aGlzLmNvbmZpZy5MRVZFTF9XSURUSC0xXVt5XSA9IHNrZXRjaC5zdHJhdGE7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2Vjb25kTGV2ZWxHZW5lcmF0b3I7IiwidmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdWJkaXZpZGVBcmVhOiBmdW5jdGlvbihiaWdBcmVhLCBtYXhEZXB0aCwgTUlOX1dJRFRILCBNSU5fSEVJR0hULCBNQVhfV0lEVEgsIE1BWF9IRUlHSFQsIFNMSUNFX1JBTkdFX1NUQVJULCBTTElDRV9SQU5HRV9FTkQsIGF2b2lkUG9pbnRzKXtcblx0XHR2YXIgYXJlYXMgPSBbXTtcblx0XHR2YXIgYmlnQXJlYXMgPSBbXTtcblx0XHRiaWdBcmVhLmRlcHRoID0gMDtcblx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdHZhciByZXRyaWVzID0gMDtcblx0XHR3aGlsZSAoYmlnQXJlYXMubGVuZ3RoID4gMCl7XG5cdFx0XHR2YXIgYmlnQXJlYSA9IGJpZ0FyZWFzLnBvcCgpO1xuXHRcdFx0dmFyIGhvcml6b250YWxTcGxpdCA9IFV0aWwuY2hhbmNlKDUwKTtcblx0XHRcdGlmIChiaWdBcmVhLncgPCBNSU5fV0lEVEggKiAxLjUgJiYgYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGJpZ0FyZWEuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS53IDwgTUlOX1dJRFRIICogMS41KXtcblx0XHRcdFx0aG9yaXpvbnRhbFNwbGl0ID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoYmlnQXJlYS5oIDwgTUlOX0hFSUdIVCAqIDEuNSl7XG5cdFx0XHRcdGhvcml6b250YWxTcGxpdCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGFyZWExID0gbnVsbDtcblx0XHRcdHZhciBhcmVhMiA9IG51bGw7XG5cdFx0XHRpZiAoaG9yaXpvbnRhbFNwbGl0KXtcblx0XHRcdFx0dmFyIHNsaWNlID0gTWF0aC5yb3VuZChVdGlsLnJhbmQoYmlnQXJlYS5oICogU0xJQ0VfUkFOR0VfU1RBUlQsIGJpZ0FyZWEuaCAqIFNMSUNFX1JBTkdFX0VORCkpO1xuXHRcdFx0XHRhcmVhMSA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudyxcblx0XHRcdFx0XHRoOiBzbGljZVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55ICsgc2xpY2UsXG5cdFx0XHRcdFx0dzogYmlnQXJlYS53LFxuXHRcdFx0XHRcdGg6IGJpZ0FyZWEuaCAtIHNsaWNlXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBzbGljZSA9IE1hdGgucm91bmQoVXRpbC5yYW5kKGJpZ0FyZWEudyAqIFNMSUNFX1JBTkdFX1NUQVJULCBiaWdBcmVhLncgKiBTTElDRV9SQU5HRV9FTkQpKTtcblx0XHRcdFx0YXJlYTEgPSB7XG5cdFx0XHRcdFx0eDogYmlnQXJlYS54LFxuXHRcdFx0XHRcdHk6IGJpZ0FyZWEueSxcblx0XHRcdFx0XHR3OiBzbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fVxuXHRcdFx0XHRhcmVhMiA9IHtcblx0XHRcdFx0XHR4OiBiaWdBcmVhLngrc2xpY2UsXG5cdFx0XHRcdFx0eTogYmlnQXJlYS55LFxuXHRcdFx0XHRcdHc6IGJpZ0FyZWEudy1zbGljZSxcblx0XHRcdFx0XHRoOiBiaWdBcmVhLmhcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChhcmVhMS53IDwgTUlOX1dJRFRIIHx8IGFyZWExLmggPCBNSU5fSEVJR0hUIHx8XG5cdFx0XHRcdGFyZWEyLncgPCBNSU5fV0lEVEggfHwgYXJlYTIuaCA8IE1JTl9IRUlHSFQpe1xuXHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYXMucHVzaChiaWdBcmVhKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCAmJiBcblx0XHRcdFx0XHQoYXJlYTEudyA+IE1BWF9XSURUSCB8fCBhcmVhMS5oID4gTUFYX0hFSUdIVCB8fFxuXHRcdFx0XHRcdGFyZWEyLncgPiBNQVhfV0lEVEggfHwgYXJlYTIuaCA+IE1BWF9IRUlHSFQpKXtcblx0XHRcdFx0aWYgKHJldHJpZXMgPCAxMDApIHtcblx0XHRcdFx0XHQvLyBQdXNoIGJhY2sgYmlnIGFyZWFcblx0XHRcdFx0XHRiaWdBcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMrKztcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVx0XHRcblx0XHRcdH1cblx0XHRcdGlmIChhdm9pZFBvaW50cyAmJiAodGhpcy5jb2xsaWRlc1dpdGgoYXZvaWRQb2ludHMsIGFyZWEyKSB8fCB0aGlzLmNvbGxpZGVzV2l0aChhdm9pZFBvaW50cywgYXJlYTEpKSl7XG5cdFx0XHRcdGlmIChyZXRyaWVzID4gMTAwKXtcblx0XHRcdFx0XHRiaWdBcmVhLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0XHRhcmVhcy5wdXNoKGJpZ0FyZWEpO1xuXHRcdFx0XHRcdHJldHJpZXMgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFB1c2ggYmFjayBiaWcgYXJlYVxuXHRcdFx0XHRcdGJpZ0FyZWFzLnB1c2goYmlnQXJlYSk7XG5cdFx0XHRcdFx0cmV0cmllcysrO1xuXHRcdFx0XHR9XHRcdFxuXHRcdFx0XHRjb250aW51ZTsgXG5cdFx0XHR9XG5cdFx0XHRpZiAoYmlnQXJlYS5kZXB0aCA9PSBtYXhEZXB0aCl7XG5cdFx0XHRcdGFyZWExLmJyaWRnZXMgPSBbXTtcblx0XHRcdFx0YXJlYTIuYnJpZGdlcyA9IFtdO1xuXHRcdFx0XHRhcmVhcy5wdXNoKGFyZWExKTtcblx0XHRcdFx0YXJlYXMucHVzaChhcmVhMik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcmVhMS5kZXB0aCA9IGJpZ0FyZWEuZGVwdGggKzE7XG5cdFx0XHRcdGFyZWEyLmRlcHRoID0gYmlnQXJlYS5kZXB0aCArMTtcblx0XHRcdFx0YmlnQXJlYXMucHVzaChhcmVhMSk7XG5cdFx0XHRcdGJpZ0FyZWFzLnB1c2goYXJlYTIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYXJlYXM7XG5cdH0sXG5cdGNvbGxpZGVzV2l0aDogZnVuY3Rpb24oYXZvaWRQb2ludHMsIGFyZWEpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXZvaWRQb2ludHMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGF2b2lkUG9pbnQgPSBhdm9pZFBvaW50c1tpXTtcblx0XHRcdGlmIChVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSwgYXZvaWRQb2ludC54LCBhdm9pZFBvaW50LnkpIDw9IDIgfHxcblx0XHRcdFx0VXRpbC5mbGF0RGlzdGFuY2UoYXJlYS54K2FyZWEudywgYXJlYS55LCBhdm9pZFBvaW50LngsIGF2b2lkUG9pbnQueSkgPD0gMiB8fFxuXHRcdFx0XHRVdGlsLmZsYXREaXN0YW5jZShhcmVhLngsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyIHx8XG5cdFx0XHRcdFV0aWwuZmxhdERpc3RhbmNlKGFyZWEueCthcmVhLncsIGFyZWEueSthcmVhLmgsIGF2b2lkUG9pbnQueCwgYXZvaWRQb2ludC55KSA8PSAyKXtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0Y29ubmVjdEFyZWFzOiBmdW5jdGlvbihhcmVhcywgYm9yZGVyKXtcblx0XHQvKiBNYWtlIG9uZSBhcmVhIGNvbm5lY3RlZFxuXHRcdCAqIFdoaWxlIG5vdCBhbGwgYXJlYXMgY29ubmVjdGVkLFxuXHRcdCAqICBTZWxlY3QgYSBjb25uZWN0ZWQgYXJlYVxuXHRcdCAqICBTZWxlY3QgYSB2YWxpZCB3YWxsIGZyb20gdGhlIGFyZWFcblx0XHQgKiAgVGVhciBpdCBkb3duLCBjb25uZWN0aW5nIHRvIHRoZSBhIG5lYXJieSBhcmVhXG5cdFx0ICogIE1hcmsgYXJlYSBhcyBjb25uZWN0ZWRcblx0XHQgKi9cblx0XHRpZiAoIWJvcmRlcil7XG5cdFx0XHRib3JkZXIgPSAxO1xuXHRcdH1cblx0XHR2YXIgY29ubmVjdGVkQXJlYXMgPSBbXTtcblx0XHR2YXIgcmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGFyZWFzKTtcblx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKHJhbmRvbUFyZWEpO1xuXHRcdHZhciBjdXJzb3IgPSB7fTtcblx0XHR2YXIgdmFyaSA9IHt9O1xuXHRcdGFyZWE6IHdoaWxlIChjb25uZWN0ZWRBcmVhcy5sZW5ndGggPCBhcmVhcy5sZW5ndGgpe1xuXHRcdFx0cmFuZG9tQXJlYSA9IFV0aWwucmFuZG9tRWxlbWVudE9mKGNvbm5lY3RlZEFyZWFzKTtcblx0XHRcdHZhciB3YWxsRGlyID0gVXRpbC5yYW5kKDEsNCk7XG5cdFx0XHRzd2l0Y2god2FsbERpcil7XG5cdFx0XHRjYXNlIDE6IC8vIExlZnRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLng7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciAsIHJhbmRvbUFyZWEueStyYW5kb21BcmVhLmggLSBib3JkZXIpO1xuXHRcdFx0XHR2YXJpLnggPSAtMjtcblx0XHRcdFx0dmFyaS55ID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6IC8vUmlnaHRcblx0XHRcdFx0Y3Vyc29yLnggPSByYW5kb21BcmVhLnggKyByYW5kb21BcmVhLnc7XG5cdFx0XHRcdGN1cnNvci55ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueSArIGJvcmRlciwgcmFuZG9tQXJlYS55K3JhbmRvbUFyZWEuaCAtIGJvcmRlcik7XG5cdFx0XHRcdHZhcmkueCA9IDI7XG5cdFx0XHRcdHZhcmkueSA9IDA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOiAvL1VwXG5cdFx0XHRcdGN1cnNvci54ID0gVXRpbC5yYW5kKHJhbmRvbUFyZWEueCArIGJvcmRlciwgcmFuZG9tQXJlYS54K3JhbmRvbUFyZWEudyAtIGJvcmRlcik7XG5cdFx0XHRcdGN1cnNvci55ID0gcmFuZG9tQXJlYS55O1xuXHRcdFx0XHR2YXJpLnggPSAwO1xuXHRcdFx0XHR2YXJpLnkgPSAtMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6IC8vRG93blxuXHRcdFx0XHRjdXJzb3IueCA9IFV0aWwucmFuZChyYW5kb21BcmVhLnggKyBib3JkZXIsIHJhbmRvbUFyZWEueCtyYW5kb21BcmVhLncgLSBib3JkZXIpO1xuXHRcdFx0XHRjdXJzb3IueSA9IHJhbmRvbUFyZWEueSArIHJhbmRvbUFyZWEuaDtcblx0XHRcdFx0dmFyaS54ID0gMDtcblx0XHRcdFx0dmFyaS55ID0gMjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHR2YXIgY29ubmVjdGVkQXJlYSA9IHRoaXMuZ2V0QXJlYUF0KGN1cnNvciwgdmFyaSwgYXJlYXMpO1xuXHRcdFx0aWYgKGNvbm5lY3RlZEFyZWEgJiYgIVV0aWwuY29udGFpbnMoY29ubmVjdGVkQXJlYXMsIGNvbm5lY3RlZEFyZWEpKXtcblx0XHRcdFx0c3dpdGNoKHdhbGxEaXIpe1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAoY3Vyc29yLnkgPD0gY29ubmVjdGVkQXJlYS55ICsgYm9yZGVyIHx8IGN1cnNvci55ID49IGNvbm5lY3RlZEFyZWEueSArIGNvbm5lY3RlZEFyZWEuaCAtIGJvcmRlcilcblx0XHRcdFx0XHRcdGNvbnRpbnVlIGFyZWE7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdGlmIChjdXJzb3IueCA8PSBjb25uZWN0ZWRBcmVhLnggKyBib3JkZXIgfHwgY3Vyc29yLnggPj0gY29ubmVjdGVkQXJlYS54ICsgY29ubmVjdGVkQXJlYS53IC0gYm9yZGVyKVxuXHRcdFx0XHRcdFx0Y29udGludWUgYXJlYTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jb25uZWN0QXJlYShyYW5kb21BcmVhLCBjb25uZWN0ZWRBcmVhLCBjdXJzb3IpO1xuXHRcdFx0XHRjb25uZWN0ZWRBcmVhcy5wdXNoKGNvbm5lY3RlZEFyZWEpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Z2V0QXJlYUF0OiBmdW5jdGlvbihjdXJzb3IsIHZhcmksIGFyZWFzKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoY3Vyc29yLnggKyB2YXJpLnggPj0gYXJlYS54ICYmIGN1cnNvci54ICsgdmFyaS54IDw9IGFyZWEueCArIGFyZWEudyBcblx0XHRcdFx0XHQmJiBjdXJzb3IueSArIHZhcmkueSA+PSBhcmVhLnkgJiYgY3Vyc29yLnkgKyB2YXJpLnkgPD0gYXJlYS55ICsgYXJlYS5oKVxuXHRcdFx0XHRyZXR1cm4gYXJlYTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRjb25uZWN0QXJlYTogZnVuY3Rpb24oYXJlYTEsIGFyZWEyLCBwb3NpdGlvbil7XG5cdFx0YXJlYTEuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWEyXG5cdFx0fSk7XG5cdFx0YXJlYTIuYnJpZGdlcy5wdXNoKHtcblx0XHRcdHg6IHBvc2l0aW9uLngsXG5cdFx0XHR5OiBwb3NpdGlvbi55LFxuXHRcdFx0dG86IGFyZWExXG5cdFx0fSk7XG5cdH1cbn0iLCJmdW5jdGlvbiBUaGlyZExldmVsR2VuZXJhdG9yKGNvbmZpZyl7XG5cdHRoaXMuY29uZmlnID0gY29uZmlnO1xufVxuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcbnZhciBDQSA9IHJlcXVpcmUoJy4vQ0EnKTtcbnZhciBTcGxpdHRlciA9IHJlcXVpcmUoJy4vU3BsaXR0ZXInKTtcblxuVGhpcmRMZXZlbEdlbmVyYXRvci5wcm90b3R5cGUgPSB7XG5cdGZpbGxMZXZlbDogZnVuY3Rpb24oc2tldGNoLCBsZXZlbCl7XG5cdFx0dGhpcy5maWxsUm9vbXMoc2tldGNoLCBsZXZlbClcblx0XHR0aGlzLmZhdHRlbkNhdmVybnMobGV2ZWwpO1xuXHRcdHRoaXMucGxhY2VFeGl0cyhza2V0Y2gsIGxldmVsKTtcblx0XHR0aGlzLnJhaXNlSXNsYW5kcyhsZXZlbCk7XG5cdFx0cmV0dXJuIGxldmVsO1xuXHR9LFxuXHRmYXR0ZW5DYXZlcm5zOiBmdW5jdGlvbihsZXZlbCl7XG5cdFx0Ly8gR3JvdyBjYXZlcm5zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydjYXZlcm5GbG9vciddID4gMCAmJiBVdGlsLmNoYW5jZSgyMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snY2F2ZXJuRmxvb3InXSA+IDEpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEsIHRydWUpO1xuXHRcdC8vIEdyb3cgbGFnb29uIGFyZWFzXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDAgJiYgVXRpbC5jaGFuY2UoNDApKVxuXHRcdFx0XHRyZXR1cm4gJ2Zha2VXYXRlcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKHN1cnJvdW5kaW5nWydmYWtlV2F0ZXInXSA+IDApXG5cdFx0XHRcdHJldHVybiAnZmFrZVdhdGVyJztcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LCAxLCB0cnVlKTtcblx0XHRcblx0XHRcblx0XHQvLyBFeHBhbmQgd2FsbC1sZXNzIHJvb21zXG5cdFx0bGV2ZWwuY2VsbHMgPSBDQS5ydW5DQShsZXZlbC5jZWxscywgZnVuY3Rpb24oY3VycmVudCwgc3Vycm91bmRpbmcpe1xuXHRcdFx0aWYgKGN1cnJlbnQgIT0gJ3NvbGlkUm9jaycpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGlmIChzdXJyb3VuZGluZ1snc3RvbmVGbG9vciddID4gMiAmJiBVdGlsLmNoYW5jZSgxMCkpXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEpO1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzb2xpZFJvY2snKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ10+MClcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gRGV0ZXJpb3JhdGUgd2FsbCByb29tc1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdzdG9uZVdhbGwnKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRpZiAoc3Vycm91bmRpbmdbJ3N0b25lRmxvb3InXSA+IDAgJiYgVXRpbC5jaGFuY2UoNSkpXG5cdFx0XHRcdHJldHVybiAnc3RvbmVGbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0XG5cdH0sXG5cdHJhaXNlSXNsYW5kczogZnVuY3Rpb24obGV2ZWwpe1xuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICd3YXRlcicpXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdHZhciBjYXZlcm5zID0gc3Vycm91bmRpbmdbJ2NhdmVybkZsb29yJ107IFxuXHRcdFx0aWYgKGNhdmVybnMgPiAwICYmIFV0aWwuY2hhbmNlKDcwKSlcblx0XHRcdFx0cmV0dXJuICdjYXZlcm5GbG9vcic7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSwgMSwgdHJ1ZSk7XG5cdFx0Ly8gSXNsYW5kIGZvciBleGl0cyBvbiB3YXRlclxuXHRcdGxldmVsLmNlbGxzID0gQ0EucnVuQ0EobGV2ZWwuY2VsbHMsIGZ1bmN0aW9uKGN1cnJlbnQsIHN1cnJvdW5kaW5nKXtcblx0XHRcdGlmIChjdXJyZW50ICE9ICdmYWtlV2F0ZXInICYmIGN1cnJlbnQgIT0gJ3dhdGVyJylcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0dmFyIHN0YWlycyA9IHN1cnJvdW5kaW5nWydkb3duc3RhaXJzJ10gPyBzdXJyb3VuZGluZ1snZG93bnN0YWlycyddIDogMCArXG5cdFx0XHRcdFx0c3Vycm91bmRpbmdbJ3Vwc3RhaXJzJ10gPyBzdXJyb3VuZGluZ1sndXBzdGFpcnMnXSA6IDA7IFxuXHRcdFx0aWYgKHN0YWlycyA+IDApXG5cdFx0XHRcdHJldHVybiAnY2F2ZXJuRmxvb3InO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sIDEpO1xuXHR9LFxuXHRmaWxsUm9vbXM6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0dmFyIHR5cGUgPSBhcmVhLmFyZWFUeXBlO1xuXHRcdFx0aWYgKHR5cGUgPT09ICdjYXZlcm4nKXsgXG5cdFx0XHRcdHRoaXMuZmlsbFdpdGhDYXZlcm4obGV2ZWwsIGFyZWEpO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAncm9vbXMnKXtcblx0XHRcdFx0dGhpcy5maWxsV2l0aFJvb21zKGxldmVsLCBhcmVhKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHBsYWNlRXhpdHM6IGZ1bmN0aW9uKHNrZXRjaCwgbGV2ZWwpe1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2tldGNoLmFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBhcmVhID0gc2tldGNoLmFyZWFzW2ldO1xuXHRcdFx0aWYgKCFhcmVhLmhhc0V4aXQgJiYgIWFyZWEuaGFzRW50cmFuY2UpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0dmFyIHRpbGUgPSBudWxsO1xuXHRcdFx0aWYgKGFyZWEuaGFzRXhpdCl7XG5cdFx0XHRcdHRpbGUgPSAnZG93bnN0YWlycyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aWxlID0gJ3Vwc3RhaXJzJztcblx0XHRcdH1cblx0XHRcdHZhciBmcmVlU3BvdCA9IGxldmVsLmdldEZyZWVQbGFjZShhcmVhKTtcblx0XHRcdGlmIChmcmVlU3BvdC54ID09IDAgfHwgZnJlZVNwb3QueSA9PSAwIHx8IGZyZWVTcG90LnggPT0gbGV2ZWwuY2VsbHMubGVuZ3RoIC0gMSB8fCBmcmVlU3BvdC55ID09IGxldmVsLmNlbGxzWzBdLmxlbmd0aCAtIDEpe1xuXHRcdFx0XHRpLS07XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0bGV2ZWwuY2VsbHNbZnJlZVNwb3QueF1bZnJlZVNwb3QueV0gPSB0aWxlO1xuXHRcdFx0aWYgKGFyZWEuaGFzRXhpdCl7XG5cdFx0XHRcdGxldmVsLmVuZCA9IHtcblx0XHRcdFx0XHR4OiBmcmVlU3BvdC54LFxuXHRcdFx0XHRcdHk6IGZyZWVTcG90Lnlcblx0XHRcdFx0fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldmVsLnN0YXJ0ID0ge1xuXHRcdFx0XHRcdHg6IGZyZWVTcG90LngsXG5cdFx0XHRcdFx0eTogZnJlZVNwb3QueVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZmlsbFdpdGhDYXZlcm46IGZ1bmN0aW9uKGxldmVsLCBhcmVhKXtcblx0XHQvLyBDb25uZWN0IGFsbCBicmlkZ2VzIHdpdGggbWlkcG9pbnRcblx0XHR2YXIgbWlkcG9pbnQgPSB7XG5cdFx0XHR4OiBNYXRoLnJvdW5kKFV0aWwucmFuZChhcmVhLnggKyBhcmVhLncgKiAxLzMsIGFyZWEueCthcmVhLncgKiAyLzMpKSxcblx0XHRcdHk6IE1hdGgucm91bmQoVXRpbC5yYW5kKGFyZWEueSArIGFyZWEuaCAqIDEvMywgYXJlYS55K2FyZWEuaCAqIDIvMykpXG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbaV07XG5cdFx0XHR2YXIgbGluZSA9IFV0aWwubGluZShtaWRwb2ludCwgYnJpZGdlKTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbGluZS5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBwb2ludCA9IGxpbmVbal07XG5cdFx0XHRcdHZhciBjdXJyZW50Q2VsbCA9IGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldO1xuXHRcdFx0XHRpZiAoYXJlYS5jYXZlcm5UeXBlID09ICdyb2NreScpXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0XHRlbHNlIGlmIChjdXJyZW50Q2VsbCA9PSAnd2F0ZXInIHx8IGN1cnJlbnRDZWxsID09ICdsYXZhJyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEuZmxvb3IgIT0gJ2Zha2VXYXRlcicgJiYgYXJlYS5jYXZlcm5UeXBlID09ICdicmlkZ2VzJylcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3BvaW50LnhdW3BvaW50LnldID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSAnZmFrZVdhdGVyJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XSA9IGFyZWEuZmxvb3I7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gU2NyYXRjaCB0aGUgYXJlYVxuXHRcdHZhciBzY3JhdGNoZXMgPSBVdGlsLnJhbmQoMiw0KTtcblx0XHR2YXIgY2F2ZVNlZ21lbnRzID0gW107XG5cdFx0Y2F2ZVNlZ21lbnRzLnB1c2gobWlkcG9pbnQpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2NyYXRjaGVzOyBpKyspe1xuXHRcdFx0dmFyIHAxID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY2F2ZVNlZ21lbnRzKTtcblx0XHRcdGlmIChjYXZlU2VnbWVudHMubGVuZ3RoID4gMSlcblx0XHRcdFx0VXRpbC5yZW1vdmVGcm9tQXJyYXkoY2F2ZVNlZ21lbnRzLCBwMSk7XG5cdFx0XHR2YXIgcDIgPSB7XG5cdFx0XHRcdHg6IFV0aWwucmFuZChhcmVhLngsIGFyZWEueCthcmVhLnctMSksXG5cdFx0XHRcdHk6IFV0aWwucmFuZChhcmVhLnksIGFyZWEueSthcmVhLmgtMSlcblx0XHRcdH1cblx0XHRcdGNhdmVTZWdtZW50cy5wdXNoKHAyKTtcblx0XHRcdHZhciBsaW5lID0gVXRpbC5saW5lKHAyLCBwMSk7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxpbmUubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgcG9pbnQgPSBsaW5lW2pdO1xuXHRcdFx0XHR2YXIgY3VycmVudENlbGwgPSBsZXZlbC5jZWxsc1twb2ludC54XVtwb2ludC55XTtcblx0XHRcdFx0aWYgKGN1cnJlbnRDZWxsICE9ICd3YXRlcicgJiYgY3VycmVudENlbGwgIT0gJ2xhdmEnKSAgXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbcG9pbnQueF1bcG9pbnQueV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0ZmlsbFdpdGhSb29tczogZnVuY3Rpb24obGV2ZWwsIGFyZWEpe1xuXHRcdHZhciBiaWdBcmVhID0ge1xuXHRcdFx0eDogYXJlYS54LFxuXHRcdFx0eTogYXJlYS55LFxuXHRcdFx0dzogYXJlYS53LFxuXHRcdFx0aDogYXJlYS5oXG5cdFx0fVxuXHRcdHZhciBtYXhEZXB0aCA9IDI7XG5cdFx0dmFyIE1JTl9XSURUSCA9IDY7XG5cdFx0dmFyIE1JTl9IRUlHSFQgPSA2O1xuXHRcdHZhciBNQVhfV0lEVEggPSAxMDtcblx0XHR2YXIgTUFYX0hFSUdIVCA9IDEwO1xuXHRcdHZhciBTTElDRV9SQU5HRV9TVEFSVCA9IDMvODtcblx0XHR2YXIgU0xJQ0VfUkFOR0VfRU5EID0gNS84O1xuXHRcdHZhciBhcmVhcyA9IFNwbGl0dGVyLnN1YmRpdmlkZUFyZWEoYmlnQXJlYSwgbWF4RGVwdGgsIE1JTl9XSURUSCwgTUlOX0hFSUdIVCwgTUFYX1dJRFRILCBNQVhfSEVJR0hULCBTTElDRV9SQU5HRV9TVEFSVCwgU0xJQ0VfUkFOR0VfRU5ELCBhcmVhLmJyaWRnZXMpO1xuXHRcdFNwbGl0dGVyLmNvbm5lY3RBcmVhcyhhcmVhcywgYXJlYS53YWxsID8gMiA6IDEpOyBcblx0XHR2YXIgYnJpZGdlQXJlYXMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBzdWJhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciBicmlkZ2UgPSBhcmVhLmJyaWRnZXNbal07XG5cdFx0XHRcdGlmIChTcGxpdHRlci5nZXRBcmVhQXQoYnJpZGdlLHt4OjAseTowfSwgYXJlYXMpID09IHN1YmFyZWEpe1xuXHRcdFx0XHRcdGlmICghVXRpbC5jb250YWlucyhicmlkZ2VBcmVhcywgc3ViYXJlYSkpe1xuXHRcdFx0XHRcdFx0YnJpZGdlQXJlYXMucHVzaChzdWJhcmVhKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3ViYXJlYS5icmlkZ2VzLnB1c2goe1xuXHRcdFx0XHRcdFx0eDogYnJpZGdlLngsXG5cdFx0XHRcdFx0XHR5OiBicmlkZ2UueVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXNlQXJlYXMoYnJpZGdlQXJlYXMsIGFyZWFzLCBiaWdBcmVhKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWFzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHZhciBzdWJhcmVhID0gYXJlYXNbaV07XG5cdFx0XHRpZiAoIXN1YmFyZWEucmVuZGVyKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdHN1YmFyZWEuZmxvb3IgPSBhcmVhLmZsb29yO1xuXHRcdFx0c3ViYXJlYS53YWxsID0gYXJlYS53YWxsO1xuXHRcdFx0c3ViYXJlYS5jb3JyaWRvciA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHR0aGlzLmNhcnZlUm9vbUF0KGxldmVsLCBzdWJhcmVhKTtcblx0XHR9XG5cdH0sXG5cdGNhcnZlUm9vbUF0OiBmdW5jdGlvbihsZXZlbCwgYXJlYSl7XG5cdFx0dmFyIG1pbmJveCA9IHtcblx0XHRcdHg6IGFyZWEueCArIE1hdGguZmxvb3IoYXJlYS53IC8gMiktMSxcblx0XHRcdHk6IGFyZWEueSArIE1hdGguZmxvb3IoYXJlYS5oIC8gMiktMSxcblx0XHRcdHgyOiBhcmVhLnggKyBNYXRoLmZsb29yKGFyZWEudyAvIDIpKzEsXG5cdFx0XHR5MjogYXJlYS55ICsgTWF0aC5mbG9vcihhcmVhLmggLyAyKSsxLFxuXHRcdH07XG5cdFx0Ly8gVHJhY2UgY29ycmlkb3JzIGZyb20gZXhpdHNcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZWEuYnJpZGdlcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2ldO1xuXHRcdFx0dmFyIHZlcnRpY2FsQnJpZGdlID0gZmFsc2U7XG5cdFx0XHR2YXIgaG9yaXpvbnRhbEJyaWRnZSA9IGZhbHNlO1xuXHRcdFx0aWYgKGJyaWRnZS54ID09IGFyZWEueCl7XG5cdFx0XHRcdC8vIExlZnQgQ29ycmlkb3Jcblx0XHRcdFx0aG9yaXpvbnRhbEJyaWRnZSA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGogPSBicmlkZ2UueDsgaiA8IGJyaWRnZS54ICsgYXJlYS53IC8gMjsgaisrKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueS0xXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1tqXVticmlkZ2UueSsxXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGJyaWRnZS54ID09IGFyZWEueCArIGFyZWEudyl7XG5cdFx0XHRcdC8vIFJpZ2h0IGNvcnJpZG9yXG5cdFx0XHRcdGhvcml6b250YWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLng7IGogPj0gYnJpZGdlLnggLSBhcmVhLncgLyAyOyBqLS0pe1xuXHRcdFx0XHRcdGlmIChhcmVhLndhbGwpe1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55LTFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdICE9IGFyZWEuY29ycmlkb3IpIGxldmVsLmNlbGxzW2pdW2JyaWRnZS55KzFdID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdH0gXG5cdFx0XHRcdFx0aWYgKGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnd2F0ZXInIHx8IGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9PSAnbGF2YScpeyBcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2pdW2JyaWRnZS55XSA9ICdicmlkZ2UnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1tqXVticmlkZ2UueV0gPSBhcmVhLmNvcnJpZG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChicmlkZ2UueSA9PSBhcmVhLnkpe1xuXHRcdFx0XHQvLyBUb3AgY29ycmlkb3Jcblx0XHRcdFx0dmVydGljYWxCcmlkZ2UgPSB0cnVlO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gYnJpZGdlLnk7IGogPCBicmlkZ2UueSArIGFyZWEuaCAvIDI7IGorKyl7XG5cdFx0XHRcdFx0aWYgKGFyZWEud2FsbCl7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngtMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gIT0gYXJlYS5jb3JyaWRvcikgbGV2ZWwuY2VsbHNbYnJpZGdlLngrMV1bal0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBEb3duIENvcnJpZG9yXG5cdFx0XHRcdHZlcnRpY2FsQnJpZGdlID0gdHJ1ZTtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IGJyaWRnZS55OyBqID49IGJyaWRnZS55IC0gYXJlYS5oIC8gMjsgai0tKXtcblx0XHRcdFx0XHRpZiAoYXJlYS53YWxsKXtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueC0xXVtqXSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHRcdGlmIChsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSAhPSBhcmVhLmNvcnJpZG9yKSBsZXZlbC5jZWxsc1ticmlkZ2UueCsxXVtqXSA9IGFyZWEud2FsbDsgXG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0XHRpZiAobGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICd3YXRlcicgfHwgbGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID09ICdsYXZhJyl7IFxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbYnJpZGdlLnhdW2pdID0gJ2JyaWRnZSc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW2JyaWRnZS54XVtqXSA9IGFyZWEuY29ycmlkb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodmVydGljYWxCcmlkZ2Upe1xuXHRcdFx0XHRpZiAoYnJpZGdlLnggPCBtaW5ib3gueClcblx0XHRcdFx0XHRtaW5ib3gueCA9IGJyaWRnZS54O1xuXHRcdFx0XHRpZiAoYnJpZGdlLnggPiBtaW5ib3gueDIpXG5cdFx0XHRcdFx0bWluYm94LngyID0gYnJpZGdlLng7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaG9yaXpvbnRhbEJyaWRnZSl7XG5cdFx0XHRcdGlmIChicmlkZ2UueSA8IG1pbmJveC55KVxuXHRcdFx0XHRcdG1pbmJveC55ID0gYnJpZGdlLnk7XG5cdFx0XHRcdGlmIChicmlkZ2UueSA+IG1pbmJveC55Milcblx0XHRcdFx0XHRtaW5ib3gueTIgPSBicmlkZ2UueTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIG1pblBhZGRpbmcgPSAwO1xuXHRcdGlmIChhcmVhLndhbGwpXG5cdFx0XHRtaW5QYWRkaW5nID0gMTtcblx0XHR2YXIgcGFkZGluZyA9IHtcblx0XHRcdHRvcDogVXRpbC5yYW5kKG1pblBhZGRpbmcsIG1pbmJveC55IC0gYXJlYS55IC0gbWluUGFkZGluZyksXG5cdFx0XHRib3R0b206IFV0aWwucmFuZChtaW5QYWRkaW5nLCBhcmVhLnkgKyBhcmVhLmggLSBtaW5ib3gueTIgLSBtaW5QYWRkaW5nKSxcblx0XHRcdGxlZnQ6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBtaW5ib3gueCAtIGFyZWEueCAtIG1pblBhZGRpbmcpLFxuXHRcdFx0cmlnaHQ6IFV0aWwucmFuZChtaW5QYWRkaW5nLCBhcmVhLnggKyBhcmVhLncgLSBtaW5ib3gueDIgLSBtaW5QYWRkaW5nKVxuXHRcdH07XG5cdFx0aWYgKHBhZGRpbmcudG9wIDwgMCkgcGFkZGluZy50b3AgPSAwO1xuXHRcdGlmIChwYWRkaW5nLmJvdHRvbSA8IDApIHBhZGRpbmcuYm90dG9tID0gMDtcblx0XHRpZiAocGFkZGluZy5sZWZ0IDwgMCkgcGFkZGluZy5sZWZ0ID0gMDtcblx0XHRpZiAocGFkZGluZy5yaWdodCA8IDApIHBhZGRpbmcucmlnaHQgPSAwO1xuXHRcdHZhciByb29teCA9IGFyZWEueDtcblx0XHR2YXIgcm9vbXkgPSBhcmVhLnk7XG5cdFx0dmFyIHJvb213ID0gYXJlYS53O1xuXHRcdHZhciByb29taCA9IGFyZWEuaDtcblx0XHRmb3IgKHZhciB4ID0gcm9vbXg7IHggPCByb29teCArIHJvb213OyB4Kyspe1xuXHRcdFx0Zm9yICh2YXIgeSA9IHJvb215OyB5IDwgcm9vbXkgKyByb29taDsgeSsrKXtcblx0XHRcdFx0dmFyIGRyYXdXYWxsID0gYXJlYS53YWxsICYmIGxldmVsLmNlbGxzW3hdW3ldICE9IGFyZWEuY29ycmlkb3IgJiYgbGV2ZWwuY2VsbHNbeF1beV0gIT0gJ2JyaWRnZSc7IFxuXHRcdFx0XHRpZiAoeSA8IHJvb215ICsgcGFkZGluZy50b3Ape1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB5ID09IHJvb215ICsgcGFkZGluZy50b3AgLSAxICYmIHggKyAxID49IHJvb214ICsgcGFkZGluZy5sZWZ0ICYmIHggPD0gcm9vbXggKyByb29tdyAtIHBhZGRpbmcucmlnaHQpXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHggPCByb29teCArIHBhZGRpbmcubGVmdCl7XG5cdFx0XHRcdFx0aWYgKGRyYXdXYWxsICYmIHggPT0gcm9vbXggKyBwYWRkaW5nLmxlZnQgLSAxICYmIHkgPj0gcm9vbXkgKyBwYWRkaW5nLnRvcCAmJiB5IDw9IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSlcblx0XHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gYXJlYS53YWxsO1xuXHRcdFx0XHRcdC8vbGV2ZWwuY2VsbHNbeF1beV0gPSAncGFkZGluZyc7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeSA+IHJvb215ICsgcm9vbWggLSAxIC0gcGFkZGluZy5ib3R0b20pe1xuXHRcdFx0XHRcdGlmIChkcmF3V2FsbCAmJiB5ID09IHJvb215ICsgcm9vbWggLSBwYWRkaW5nLmJvdHRvbSAmJiB4ICsgMSA+PSByb29teCArIHBhZGRpbmcubGVmdCAmJiB4IDw9IHJvb214ICsgcm9vbXcgLSBwYWRkaW5nLnJpZ2h0KVxuXHRcdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLndhbGw7XG5cdFx0XHRcdFx0Ly9sZXZlbC5jZWxsc1t4XVt5XSA9ICdwYWRkaW5nJztcblx0XHRcdFx0fSBlbHNlIGlmICh4ID4gcm9vbXggKyByb29tdyAtIDEgLSBwYWRkaW5nLnJpZ2h0KXtcblx0XHRcdFx0XHRpZiAoZHJhd1dhbGwgJiYgeCA9PSByb29teCArIHJvb213IC0gcGFkZGluZy5yaWdodCAmJiB5ID49IHJvb215ICsgcGFkZGluZy50b3AgJiYgeSA8PSByb29teSArIHJvb21oIC0gcGFkZGluZy5ib3R0b20pXG5cdFx0XHRcdFx0XHRsZXZlbC5jZWxsc1t4XVt5XSA9IGFyZWEud2FsbDtcblx0XHRcdFx0XHQvL2xldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFyZWEubWFya2VkKVxuXHRcdFx0XHRcdGxldmVsLmNlbGxzW3hdW3ldID0gJ3BhZGRpbmcnO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bGV2ZWwuY2VsbHNbeF1beV0gPSBhcmVhLmZsb29yO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0fSxcblx0dXNlQXJlYXM6IGZ1bmN0aW9uKGtlZXBBcmVhcywgYXJlYXMsIGJpZ0FyZWEpe1xuXHRcdC8vIEFsbCBrZWVwIGFyZWFzIHNob3VsZCBiZSBjb25uZWN0ZWQgd2l0aCBhIHNpbmdsZSBwaXZvdCBhcmVhXG5cdFx0dmFyIHBpdm90QXJlYSA9IFNwbGl0dGVyLmdldEFyZWFBdCh7eDogTWF0aC5yb3VuZChiaWdBcmVhLnggKyBiaWdBcmVhLncvMiksIHk6IE1hdGgucm91bmQoYmlnQXJlYS55ICsgYmlnQXJlYS5oLzIpfSx7eDowLHk6MH0sIGFyZWFzKTtcblx0XHR2YXIgcGF0aEFyZWFzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZWVwQXJlYXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dmFyIGtlZXBBcmVhID0ga2VlcEFyZWFzW2ldO1xuXHRcdFx0a2VlcEFyZWEucmVuZGVyID0gdHJ1ZTtcblx0XHRcdHZhciBhcmVhc1BhdGggPSB0aGlzLmdldERydW5rZW5BcmVhc1BhdGgoa2VlcEFyZWEsIHBpdm90QXJlYSwgYXJlYXMpO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBhcmVhc1BhdGgubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHRhcmVhc1BhdGhbal0ucmVuZGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmVhcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR2YXIgYXJlYSA9IGFyZWFzW2ldO1xuXHRcdFx0aWYgKCFhcmVhLnJlbmRlcil7XG5cdFx0XHRcdGJyaWRnZXNSZW1vdmU6IGZvciAodmFyIGogPSAwOyBqIDwgYXJlYS5icmlkZ2VzLmxlbmd0aDsgaisrKXtcblx0XHRcdFx0XHR2YXIgYnJpZGdlID0gYXJlYS5icmlkZ2VzW2pdO1xuXHRcdFx0XHRcdGlmICghYnJpZGdlLnRvKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBicmlkZ2UudG8uYnJpZGdlcy5sZW5ndGg7IGsrKyl7XG5cdFx0XHRcdFx0XHR2YXIgc291cmNlQnJpZGdlID0gYnJpZGdlLnRvLmJyaWRnZXNba107XG5cdFx0XHRcdFx0XHRpZiAoc291cmNlQnJpZGdlLnggPT0gYnJpZGdlLnggJiYgc291cmNlQnJpZGdlLnkgPT0gYnJpZGdlLnkpe1xuXHRcdFx0XHRcdFx0XHRVdGlsLnJlbW92ZUZyb21BcnJheShicmlkZ2UudG8uYnJpZGdlcywgc291cmNlQnJpZGdlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGdldERydW5rZW5BcmVhc1BhdGg6IGZ1bmN0aW9uIChmcm9tQXJlYSwgdG9BcmVhLCBhcmVhcyl7XG5cdFx0dmFyIGN1cnJlbnRBcmVhID0gZnJvbUFyZWE7XG5cdFx0dmFyIHBhdGggPSBbXTtcblx0XHRwYXRoLnB1c2goZnJvbUFyZWEpO1xuXHRcdHBhdGgucHVzaCh0b0FyZWEpO1xuXHRcdGlmIChmcm9tQXJlYSA9PSB0b0FyZWEpXG5cdFx0XHRyZXR1cm4gcGF0aDtcblx0XHR3aGlsZSAodHJ1ZSl7XG5cdFx0XHR2YXIgcmFuZG9tQnJpZGdlID0gVXRpbC5yYW5kb21FbGVtZW50T2YoY3VycmVudEFyZWEuYnJpZGdlcyk7XG5cdFx0XHRpZiAoIXJhbmRvbUJyaWRnZS50bylcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZiAoIVV0aWwuY29udGFpbnMocGF0aCwgcmFuZG9tQnJpZGdlLnRvKSl7XG5cdFx0XHRcdHBhdGgucHVzaChyYW5kb21CcmlkZ2UudG8pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJhbmRvbUJyaWRnZS50byA9PSB0b0FyZWEpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y3VycmVudEFyZWEgPSByYW5kb21CcmlkZ2UudG87XG5cdFx0fVxuXHRcdHJldHVybiBwYXRoO1xuXHR9XG5cdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRoaXJkTGV2ZWxHZW5lcmF0b3I7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJhbmQ6IGZ1bmN0aW9uIChsb3csIGhpKXtcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGhpIC0gbG93ICsgMSkpK2xvdztcblx0fSxcblx0cmFuZG9tRWxlbWVudE9mOiBmdW5jdGlvbiAoYXJyYXkpe1xuXHRcdHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqYXJyYXkubGVuZ3RoKV07XG5cdH0sXG5cdGRpc3RhbmNlOiBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCh4Mi14MSkqKHgyLXgxKSArICh5Mi15MSkqKHkyLXkxKSk7XG5cdH0sXG5cdGZsYXREaXN0YW5jZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpe1xuXHRcdHZhciB4RGlzdCA9IE1hdGguYWJzKHgxIC0geDIpO1xuXHRcdHZhciB5RGlzdCA9IE1hdGguYWJzKHkxIC0geTIpO1xuXHRcdGlmICh4RGlzdCA9PT0geURpc3QpXG5cdFx0XHRyZXR1cm4geERpc3Q7XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHhEaXN0ICsgeURpc3Q7XG5cdH0sXG5cdGxpbmVEaXN0YW5jZTogZnVuY3Rpb24ocG9pbnQxLCBwb2ludDIpe1xuXHQgIHZhciB4cyA9IDA7XG5cdCAgdmFyIHlzID0gMDtcblx0ICB4cyA9IHBvaW50Mi54IC0gcG9pbnQxLng7XG5cdCAgeHMgPSB4cyAqIHhzO1xuXHQgIHlzID0gcG9pbnQyLnkgLSBwb2ludDEueTtcblx0ICB5cyA9IHlzICogeXM7XG5cdCAgcmV0dXJuIE1hdGguc3FydCggeHMgKyB5cyApO1xuXHR9LFxuXHRkaXJlY3Rpb246IGZ1bmN0aW9uIChhLGIpe1xuXHRcdHJldHVybiB7eDogc2lnbihiLnggLSBhLngpLCB5OiBzaWduKGIueSAtIGEueSl9O1xuXHR9LFxuXHRjaGFuY2U6IGZ1bmN0aW9uIChjaGFuY2Upe1xuXHRcdHJldHVybiB0aGlzLnJhbmQoMCwxMDApIDw9IGNoYW5jZTtcblx0fSxcblx0Y29udGFpbnM6IGZ1bmN0aW9uKGFycmF5LCBlbGVtZW50KXtcblx0ICAgIHJldHVybiBhcnJheS5pbmRleE9mKGVsZW1lbnQpID4gLTE7XG5cdH0sXG5cdHJlbW92ZUZyb21BcnJheTogZnVuY3Rpb24oYXJyYXksIG9iamVjdCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xuXHRcdFx0aWYgKGFycmF5W2ldID09IG9iamVjdCl7XG5cdFx0XHRcdHRoaXMucmVtb3ZlRnJvbUFycmF5SW5kZXgoYXJyYXksIGksaSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHJlbW92ZUZyb21BcnJheUluZGV4OiBmdW5jdGlvbihhcnJheSwgZnJvbSwgdG8pIHtcblx0XHR2YXIgcmVzdCA9IGFycmF5LnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgYXJyYXkubGVuZ3RoKTtcblx0XHRhcnJheS5sZW5ndGggPSBmcm9tIDwgMCA/IGFycmF5Lmxlbmd0aCArIGZyb20gOiBmcm9tO1xuXHRcdHJldHVybiBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCByZXN0KTtcblx0fSxcblx0bGluZTogZnVuY3Rpb24gKGEsIGIpe1xuXHRcdHZhciBjb29yZGluYXRlc0FycmF5ID0gbmV3IEFycmF5KCk7XG5cdFx0dmFyIHgxID0gYS54O1xuXHRcdHZhciB5MSA9IGEueTtcblx0XHR2YXIgeDIgPSBiLng7XG5cdFx0dmFyIHkyID0gYi55O1xuXHQgICAgdmFyIGR4ID0gTWF0aC5hYnMoeDIgLSB4MSk7XG5cdCAgICB2YXIgZHkgPSBNYXRoLmFicyh5MiAtIHkxKTtcblx0ICAgIHZhciBzeCA9ICh4MSA8IHgyKSA/IDEgOiAtMTtcblx0ICAgIHZhciBzeSA9ICh5MSA8IHkyKSA/IDEgOiAtMTtcblx0ICAgIHZhciBlcnIgPSBkeCAtIGR5O1xuXHQgICAgY29vcmRpbmF0ZXNBcnJheS5wdXNoKHt4OiB4MSwgeTogeTF9KTtcblx0ICAgIHdoaWxlICghKCh4MSA9PSB4MikgJiYgKHkxID09IHkyKSkpIHtcblx0ICAgIFx0dmFyIGUyID0gZXJyIDw8IDE7XG5cdCAgICBcdGlmIChlMiA+IC1keSkge1xuXHQgICAgXHRcdGVyciAtPSBkeTtcblx0ICAgIFx0XHR4MSArPSBzeDtcblx0ICAgIFx0fVxuXHQgICAgXHRpZiAoZTIgPCBkeCkge1xuXHQgICAgXHRcdGVyciArPSBkeDtcblx0ICAgIFx0XHR5MSArPSBzeTtcblx0ICAgIFx0fVxuXHQgICAgXHRjb29yZGluYXRlc0FycmF5LnB1c2goe3g6IHgxLCB5OiB5MX0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvb3JkaW5hdGVzQXJyYXk7XG5cdH1cbn0iLCJ3aW5kb3cuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9HZW5lcmF0b3IuY2xhc3MnKTtcbndpbmRvdy5DYW52YXNSZW5kZXJlciA9IHJlcXVpcmUoJy4vQ2FudmFzUmVuZGVyZXIuY2xhc3MnKTtcbndpbmRvdy5LcmFtZ2luZUV4cG9ydGVyID0gcmVxdWlyZSgnLi9LcmFtZ2luZUV4cG9ydGVyLmNsYXNzJyk7Il19
