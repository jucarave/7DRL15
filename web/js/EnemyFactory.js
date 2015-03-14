var EnemyFactory = {
	enemies: {
		bat: {name: 'Giant bat', hp: 8, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		rat: {name: 'Giant rat', hp: 12, textureBase: 'rat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		spider: {name: 'Giant spider', hp: 12, textureBase: 'spider', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		troll: {name: 'Troll', hp: 15, textureBase: 'troll', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		goblin: {name: 'Goblin', hp: 20, textureBase: 'goblin', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		reaper: {name: 'Reaper', hp: 18, textureBase: 'reaper', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		gazer: {name: 'Gazer', hp: 28, textureBase: 'gazer', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		headless: {name: 'Headless', hp: 30, textureBase: 'headless', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		skeleton: {name: 'Skeleton', hp: 25, textureBase: 'skeleton', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		lurker: {name: 'Lurker', hp: 23, textureBase: 'lurker', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		spectre: {name: 'Spectre', hp: 25, textureBase: 'spectre', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		
		
		daemon: {name: 'Daemon', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		firelizard: {name: 'Fire Lizard', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		hydra: {name: 'Hydra', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		seaSerpent: {name: 'Sea Serpent', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		octopus: {name: 'Kraken', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		nixie: {name: 'Nixie', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		balron: {name: 'Balron', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		liche: {name: 'Liche', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		ghost: {name: 'Ghost', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		gremlin: {name: 'Gremlin', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		dragon: {name: 'Dragon', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		zorn: {name: 'Zorn', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		phantom: {name: 'Phantom', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		twister: {name: 'Twister', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		mage: {name: 'Mage', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		wisp: {name: 'Wisp', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		warrior: {name: 'Warrior', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		bard: {name: 'Bard', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		druid: {name: 'Druid', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		tinker: {name: 'Tinker', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		paladin: {name: 'Paladin', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		shepherd: {name: 'Shepherd', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		ranger: {name: 'Ranger', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}}
	},
	
	getEnemy: function(name){
		if (!EnemyFactory.enemies[name]) throw "Invalid enemy name: " + name;
		
		var enemy = EnemyFactory.enemies[name];
		var ret = {};
		
		for (var i in enemy){
			ret[i] = enemy[i];
		}
		
		return ret;
	}
};
