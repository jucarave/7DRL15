var ItemFactory = {
	items: {
		// Items
		hpPotion: {name: "Health potion", tex: "items", subImg: 0, type: 'potion'},
		protection: {name: "Protection", tex: "items", subImg: 1, type: 'magic_1'},
		magicMissile: {name: "Magic missile", tex: "items", subImg: 2, type: 'magic_2'},
		fireExplosion: {name: "Fire explosion", tex: "items", subImg: 3, type: 'magic_3'},
		
		// Weapons
		staff: {name: "Staff", tex: "items", subImg: 4, type: 'weapon', str: '2D1'},
		dagger: {name: "Dagger", tex: "items", subImg: 5, type: 'weapon', str: '3D1'},
		sling: {name: "Sling", tex: "items", subImg: 6, type: 'weapon', str: '2D2', ranged: true, subItemName: 'rock'},
		mace: {name: "Mace", tex: "items", subImg: 7, type: 'weapon', str: '3D2'},
		axe: {name: "Axe", tex: "items", subImg: 8, type: 'weapon', str: '4D2'},
		shortSword: {name: "Short sword", tex: "items", subImg: 9, type: 'weapon', str: '3D3'},
		longSword: {name: "Long sword", tex: "items", subImg: 10, type: 'weapon', str: '4D3'},
		bow: {name: "Bow", tex: "items", subImg: 11, type: 'weapon', str: '3D3', ranged: true, subItemName: 'arrow'},
		crossbow: {name: "Crossbow", tex: "items", subImg: 12, type: 'weapon', str: '5D3', ranged: true, subItemName: 'crossbow bolt'},
		
		// Armour
		leather: {name: "Leather armour", tex: "items", subImg: 13, type: 'armour', dfs: '1D2'},
		scale: {name: "Scale mail", tex: "items", subImg: 14, type: 'armour', dfs: '2D2'},
		chain: {name: "Chain mail", tex: "items", subImg: 15, type: 'armour', dfs: '4D1'},
		plate: {name: "Plate mail", tex: "items", subImg: 16, type: 'armour', dfs: '4D2'},
		mystic: {name: "Mystic armour", tex: "items", subImg: 17, type: 'armour', dfs: '5D2'}
	},
	
	getItemByCode: function(itemCode){
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
			ret.status = 1.0;
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
