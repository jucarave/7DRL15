var EnemyFactory = {
	enemies: {
		bat: {name: 'Giant bat', hp: 8, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5, fly: true}},
		rat: {name: 'Giant rat', hp: 12, textureBase: 'rat', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		spider: {name: 'Giant spider', hp: 12, textureBase: 'spider', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		troll: {name: 'Troll', hp: 15, textureBase: 'troll', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		reaper: {name: 'Reaper', hp: 18, textureBase: 'reaper', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		gazer: {name: 'Gazer', hp: 28, textureBase: 'gazer', stats: {str: '4D2', dfs: '2D2', exp: 5, fly: true}},
		headless: {name: 'Headless', hp: 30, textureBase: 'headless', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		skeleton: {name: 'Skeleton', hp: 25, textureBase: 'skeleton', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		
		daemon: {name: 'Daemon', hp: 25, textureBase: 'daemon', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		firelizard: {name: 'Fire Lizard', hp: 25, textureBase: 'firelizard', stats: {str: '4D2', dfs: '2D2', exp: 5, fly: true}},
		hydra: {name: 'Hydra', hp: 25, textureBase: 'hydra', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		seaSerpent: {name: 'Sea Serpent', hp: 25, textureBase: 'seaSerpent', stats: {str: '4D2', dfs: '2D2', exp: 5}}, // not suitable		
		octopus: {name: 'Kraken', hp: 25, textureBase: 'octopus', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		//nixie: {name: 'Nixie', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},				// not in u5
		balron: {name: 'Balron', hp: 25, textureBase: 'balron', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		liche: {name: 'Liche', hp: 25, textureBase: 'liche', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		ghost: {name: 'Ghost', hp: 25, textureBase: 'ghost', stats: {str: '4D2', dfs: '2D2', exp: 5, fly: true}},
		gremlin: {name: 'Gremlin', hp: 25, textureBase: 'gremlin', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		dragon: {name: 'Dragon', hp: 25, textureBase: 'dragon', stats: {str: '4D2', dfs: '2D2', exp: 5, fly: true}},				// Not suitable
		zorn: {name: 'Zorn', hp: 25, textureBase: 'zorn', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		//phantom: {name: 'Phantom', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},			// not in u5
		//twister: {name: 'Twister', hp: 25, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2', exp: 5}},			// not in u5
		mage: {name: 'Mage', hp: 25, textureBase: 'mage', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		wisp: {name: 'Wisp', hp: 25, textureBase: 'wisp', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		warrior: {name: 'Warrior', hp: 25, textureBase: 'warrior', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		bard: {name: 'Bard', hp: 25, textureBase: 'bard', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		druid: {name: 'Druid', hp: 25, textureBase: 'druid', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		tinker: {name: 'Tinker', hp: 25, textureBase: 'tinker', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		paladin: {name: 'Paladin', hp: 25, textureBase: 'paladin', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		shepherd: {name: 'Shepherd', hp: 25, textureBase: 'shepherd', stats: {str: '4D2', dfs: '2D2', exp: 5}},
		ranger: {name: 'Ranger', hp: 25, textureBase: 'ranger', stats: {str: '4D2', dfs: '2D2', exp: 5}}
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
