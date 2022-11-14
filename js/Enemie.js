
class Enemigo
{
    constructor(Vida, Defensa, Ataque, Nombre)
    {
        this.Stats = {Vida: Vida, Defensa: Defensa, Ataque: Ataque, Nombre: Nombre};
        this.MaxLife = Vida;
    }
}

export {Enemigo};