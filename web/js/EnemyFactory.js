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
		spectre: {name: 'Spectre', hp: 25, textureBase: 'spectre', stats: {str: '4D2', dfs: '2D2', exp: 5}}
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
