
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
    }

    getCantidad()
    {
        return this.Item.cantidad;
    }
}

export { HealItem };