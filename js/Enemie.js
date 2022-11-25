
class Enemigo
{
    constructor(Vida, Defensa, Ataque, Nombre, Velocidad, num)
    {
        this.Stats = {Vida: Vida, Defensa: Defensa, Ataque: Ataque, Nombre: Nombre};
        this.MaxLife = Vida;
        this.Velocidad = Velocidad;
        this.Num = num;
        this.Active = true;
    }

    GetStats()
    {
        return this.Stats;
    }

    GetVelocidad()
    {
        return this.Velocidad;
    }

    GetNum()
    {
        return this.Num;
    }

    GetActive()
    {
        return this.Active;
    }

    SetActive(act)
    {
        this.Active = act;
    }

    GetMaxLife()
    {
        return this.MaxLife;
    }
}

export {Enemigo};