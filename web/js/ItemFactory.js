var ItemFactory = {
	items: {
		hpPotion: {name: "Health potion", tex: "items", subImg: 0, type: 'potion'},
		sword: {name: "Bronze sword", tex: "items", subImg: 1, type: 'weapon'}
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
		
		return ret;
	}
};
