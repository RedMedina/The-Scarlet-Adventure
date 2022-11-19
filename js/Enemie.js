
class Enemigo
{
    constructor(Vida, Defensa, Ataque, Nombre, Velocidad)
    {
        this.Stats = {Vida: Vida, Defensa: Defensa, Ataque: Ataque, Nombre: Nombre};
        this.MaxLife = Vida;
        this.Velocidad = Velocidad;
    }

    GetVelocidad()
    {
        return this.Velocidad;
    }
}

export {Enemigo};