
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
}

export { HealItem };