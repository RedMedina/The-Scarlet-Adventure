
class Backpack
{
    constructor(items)
    {
        this.Items = items;
    }

    AddItem(item)
    {
        this.Items.push(item);
    }

    UseItem(itemIndex)
    {
        this.Items[itemIndex].use();
        if(this.Items[itemIndex].getCantidad() == 0)
        {
            this.Items.splice(itemIndex, 1);
        }   
    }
}

export { Backpack };