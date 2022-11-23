
class Enemigo
{
    constructor(Vida, Defensa, Ataque, Nombre, Velocidad, num)
    {
        this.Stats = {Vida: Vida, Defensa: Defensa, Ataque: Ataque, Nombre: Nombre};
        this.MaxLife = Vida;
        this.Velocidad = Velocidad;
        this.Num = num;
    }

    GetVelocidad()
    {
        return this.Velocidad;
    }

    GetNum()
    {
        return this.Num;
    }
}

export {Enemigo};