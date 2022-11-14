
class HealItem
{
    constructor(name, curacion, cantidad)
    {
        this.Item = {name: name, curacion: curacion, cantidad: cantidad};
    }

    use()
    {
        //Usa
        this.Item.cantidad--;
        return this.Item.curacion;
    }

    getCantidad()
    {
        return this.Item.cantidad;
    }

    setCantidad()
    {
        this.Item.cantidad++;
    }

    getItem()
    {
        return this.Item;
    }
}

export { HealItem };