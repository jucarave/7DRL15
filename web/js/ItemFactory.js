var ItemFactory = {
	items: {
		hpPotion: {name: "Health potion", tex: "items", subImg: 0, stack: true},
		sword: {name: "Bronze sword", tex: "items", subImg: 1, stack: false}
	},
	
	getItemByCode: function(itemCode, amount){
		if (!amount) amount = 1;
		if (!ItemFactory.items[itemCode]) throw "Invalid Item code: " + itemCode;
		
		var item = ItemFactory.items[itemCode];
		var ret = {};
		for (var i in item){
			ret[i] = item[i];
		}
		
		ret.amount = amount;
		ret.isItem = true;
		ret.code = itemCode;
		
		return ret;
	}
};
