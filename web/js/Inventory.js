function Inventory(limitItems, limitEquip){
	this.items = [];
	this.equipment = [];
	
	this.limitItems = limitItems;
	this.limitEquip = limitEquip;
}

Inventory.prototype.addItem = function(item){
	if (item.stack){
		for (var i=0,len=this.items.length;i<len;i++){
			var it = this.items[i];
			if (it.code == item.code){
				it.amount += item.amount;
				return true;
			}
		}
	}
	
	if (this.items.length == this.limitItems){
		return false;
	}
	
	this.items.push(item);
	return true;
};


Inventory.prototype.addEquipment = function(equip){
	if (this.equip.length == this.limitEquip){ return false; }
	
	this.equip.push(equip);
	return true;
};
