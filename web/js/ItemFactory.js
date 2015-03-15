var ItemFactory = {
	items: {
		// Items
		yellowPotion: {name: "Yellow potion", tex: "items", subImg: 0, type: 'potion'},
		redPotion: {name: "Red Potion", tex: "items", subImg: 1, type: 'potion'},
		
		// Weapons
		staff: {name: "Staff", tex: "items", subImg: 2, type: 'weapon', str: '2D1', wear: 0.02},
		dagger: {name: "Dagger", tex: "items", subImg: 3, type: 'weapon', str: '3D1', wear: 0.05},
		sling: {name: "Sling", tex: "items", subImg: 4, type: 'weapon', str: '2D2', ranged: true, subItemName: 'rock', wear: 0.04},
		mace: {name: "Mace", tex: "items", subImg: 5, type: 'weapon', str: '3D2', wear: 0.03},
		axe: {name: "Axe", tex: "items", subImg: 6, type: 'weapon', str: '4D2', wear: 0.01},
		shortSword: {name: "Short sword", tex: "items", subImg: 7, type: 'weapon', str: '3D3', wear: 0.01},
		longSword: {name: "Long sword", tex: "items", subImg: 8, type: 'weapon', str: '4D3', wear: 0.008},
		mysticSword: {name: "Mystic sword", tex: "items", subImg: 9, type: 'weapon', str: '6D3', wear: 0.008},
		bow: {name: "Bow", tex: "items", subImg: 10, type: 'weapon', str: '3D3', ranged: true, subItemName: 'arrow', wear: 0.01},
		crossbow: {name: "Crossbow", tex: "items", subImg: 11, type: 'weapon', str: '5D3', ranged: true, subItemName: 'crossbow bolt', wear: 0.008},
		
		// Armour
		leather: {name: "Leather armour", tex: "items", subImg: 12, type: 'armour', dfs: '1D2', wear: 0.05},
		scale: {name: "Scale mail", tex: "items", subImg: 13, type: 'armour', dfs: '2D2', wear: 0.03},
		plate: {name: "Plate mail", tex: "items", subImg: 14, type: 'armour', dfs: '4D2', wear: 0.015},
		mystic: {name: "Mystic armour", tex: "items", subImg: 15, type: 'armour', dfs: '5D2', wear: 0.008},
		
		// Spell mixes
		cure: {name: "Spellmix of Cure", tex: "spells", subImg: 0, type: 'magic_1'},
		heal: {name: "Spellmix of Heal", tex: "spells", subImg: 1, type: 'magic_2'},
		light: {name: "Spellmix of Light", tex: "spells", subImg: 2, type: 'magic_4'},
		missile: {name: "Spellmix of magic missile", tex: "spells", subImg: 3, type: 'magic_5', str: '4D4'},
		iceball: {name: "Spellmix of Iceball", tex: "spells", subImg: 4, type: 'magic_6'},
		repel: {name: "Spellmix of Repel Undead", tex: "spells", subImg: 5, type: 'magic_7'},
		blink: {name: "Spellmix of Blink", tex: "spells", subImg: 6, type: 'magic_8'},
		fireball: {name: "Spellmix of Fireball", tex: "spells", subImg: 7, type: 'magic_9', str: '5D4'},
		protection: {name: "Spellmix of protection", tex: "spells", subImg: 8, type: 'magic_10'},
		time: {name: "Spellmix of Time Stop", tex: "spells", subImg: 9, type: 'magic_11'},
		sleep: {name: "Spellmix of Sleep", tex: "spells", subImg: 10, type: 'magic_12'},
		jinx: {name: "Spellmix of Jinx", tex: "spells", subImg: 11, type: 'magic_13'},
		tremor: {name: "Spellmix of Tremor", tex: "spells", subImg: 12, type: 'magic_14'},
		kill: {name: "Spellmix of Kill", tex: "spells", subImg: 13, type: 'magic_15'},
	},
	
	getItemByCode: function(itemCode, status){
		if (!ItemFactory.items[itemCode]) throw "Invalid Item code: " + itemCode;
		
		var item = ItemFactory.items[itemCode];
		var ret = {};
		for (var i in item){
			ret[i] = item[i];
		}
		
		ret.isItem = true;
		ret.code = itemCode;
		
		if (ret.type == 'weapon' || ret.type == 'armour'){
			ret.equipped = false;
			ret.status = status;
		}
		
		return ret;
	},
	
	getStatusName: function(status){
		if (status >= 0.8){
			return 'Excellent';
		}else if (status >= 0.5){
			return 'Serviceable';
		}else if (status >= 0.2){
			return 'Worn';
		}else if (status > 0.0){
			return 'Badly worn';
		}else{
			return 'Ruined';
		}
	}
};
