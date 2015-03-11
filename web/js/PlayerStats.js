function PlayerStats(){
	this.hp = 10;
	this.mHP = 10;
	
	this.lvl = 1;
	this.exp = 0;
	
	this.stats = {
		str: '5D3',
		dfs: '3D3'
	};
	
	this.potions = 0;
}

PlayerStats.prototype.addExperience = function(amount, console){
	this.exp += amount;
	
	console.addSFMessage(amount + " exp points gained");
	var nextExp = (Math.pow(this.lvl, 1.5) * 20) << 0;
	if (this.exp >= nextExp){ this.levelUp(console); }
};

PlayerStats.prototype.levelUp = function(console){
	this.lvl += 1;
	console.addSFMessage("New level up: " + this.lvl + "!");
	
	// Upgrade a random stat by 1-3 points
	var stats = ['str', 'dfs'];
	var names = ['Strength', 'Defense'];
	var st, nm;
	while (!st){
		var ind = Math.iRandom(stats.length);
		st = stats[ind];
		nm = names[ind];
	}
	
	var part1 = parseInt(this.stats[st].substring(0, this.stats[st].indexOf('D')), 10);
	var part2 = parseInt(this.stats[st].substring(this.stats[st].indexOf('D') + 1), 10);
	
	part1 += Math.iRandom(1, 3);
	if (Math.iRandom(6) == 3){ part2 += 1; }
	
	var old = this.stats[st];
	this.stats[st] = part1 + 'D' + part2;
	
	console.addSFMessage(nm + " augmented from " + old + " to " + this.stats[st]);
};
