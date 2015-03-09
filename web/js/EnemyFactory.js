var EnemyFactory = {
	enemies: {
		bat: {name: 'bat', hp: 8, textureBase: 'bat', stats: {str: '4D2', dfs: '2D2'}}
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
