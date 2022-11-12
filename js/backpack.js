
class Backpack
{
    constructor(items)
    {
        this.Items = items;
    }

    AddItem(item)
    {
        if(!item.empty)
        {
            this.Items.push(item);
        }
    }

    UseItem(itemIndex)
    {
        if(this.Items.length > 0)
        {
            var Curacion = this.Items[itemIndex].use();
            if(this.Items[itemIndex].getCantidad() == 0)
            {
                this.Items.splice(itemIndex, 1);
            }
            return Curacion;
        }
    }
}

export { Backpack };