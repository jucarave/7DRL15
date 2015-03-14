function PlayerStats(){
	this.hp = 0;
	this.mHP = 0;
	this.mana = 0;
	this.mMana = 0;
	
	this.virtue = null;
	
	this.lvl = 1;
	this.exp = 0;
	
	this.stats = {
		str: '0D0',
		dfs: '0D0',
		dex: 0,
		magicPower: '0D0'
	};
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
	
	// Upgrade HP and Mana
	this.mHP += Math.iRandom(0, 5);
	this.mMana += Math.iRandom(0, 3);
	
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
	part1 += Math.iRandom(1, 3);
	
	var old = this.stats[st];
	this.stats[st] = part1 + 'D3';
	
	console.addSFMessage(nm + " augmented from " + old + " to " + this.stats[st]);
};

PlayerStats.prototype.setVirtue = function(virtueName){
	this.virtue = virtueName;
	this.lvl = 1;
	this.exp = 0;
	
	switch (virtueName){
		case "Honesty":
			this.hp = 8;
			this.mana = 18;
			this.stats.magicPower = 6;
			this.stats.str = '2';
			this.stats.dfs = '2';
			this.stats.dex = 0.5;
		break;
		
		case "Compassion":
			this.hp = 13;
			this.mana = 13;
			this.stats.magicPower = 4;
			this.stats.str = '4';
			this.stats.dfs = '4';
			this.stats.dex = 0.7;
		break;
		
		case "Valor":
			this.hp = 18;
			this.mana = 8;
			this.stats.magicPower = 2;
			this.stats.str = '6';
			this.stats.dfs = '2';
			this.stats.dex = 0.7;
		break;
		
		case "Honor":
			this.hp = 13;
			this.mana = 13;
			this.stats.magicPower = 4;
			this.stats.str = '6';
			this.stats.dfs = '2';
			this.stats.dex = 0.7;
		break;
		
		case "Spirituality":
			this.hp = 13;
			this.mana = 13;
			this.stats.magicPower = 6;
			this.stats.str = '4';
			this.stats.dfs = '4';
			this.stats.dex = 0.9;
		break;
		
		case "Humility":
			this.hp = 8;
			this.mana = 8;
			this.stats.magicPower = 2;
			this.stats.str = '2';
			this.stats.dfs = '2';
			this.stats.dex = 0.5;
		break;
		
		case "Sacrifice":
			this.hp = 18;
			this.mana = 8;
			this.stats.magicPower = 2;
			this.stats.str = '4';
			this.stats.dfs = '6';
			this.stats.dex = 0.9;
		break;
		
		case "Justice":
			this.hp = 13;
			this.mana = 18;
			this.stats.magicPower = 4;
			this.stats.str = '2';
			this.stats.dfs = '2';
			this.stats.dex = 0.9;
		break;
	}
	
	this.mHP = this.hp;
	this.stats.str += 'D3';
	this.stats.dfs += 'D3';
	this.stats.magicPower += 'D3';
	this.mMana = this.mana; 
};
