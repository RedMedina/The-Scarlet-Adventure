class player
{
    constructor(Name, Position, Experiencia, Backpack, level, bosses, ActualLife)
    {
        this.Name = Name;
        this.Position = Position; //Position = {x: 0, y: 0, z: 0}
        this.Experiencia = Experiencia;
        this.Stats = {}; //Stats = {Vida: 0, Ataque: 0, Defensa: 0}
        this.Backpack = Backpack; //Backpack = {Items: array(literal_obj_items)} obj
        this.level = level;
        this.Bosses = bosses; //Bosses = {Boss1: true, Boss2: true, Boss3: true}
        this.Model = {}; //Model = {Pradera: a, Pantano: b, Nieve: c}
        this.Scene;
        this.ActualLife = ActualLife;
    }

    SetModel(Model, Scene)
    {
        if(Scene == "Pradera")
        {
            this.Model.Pradera = Model;
        }
        else if(Scene == "Pantano")
        {
            this.Model.Pantano = Model;
        }
        else if(Scene == "Nieve")
        {
            this.Model.Nieve = Model;
        }
    }

    GetModel()
    {
        return this.Model;
    }

    SetScene(scene)
    {
        this.Scene = scene;
    }

    GetBackpack()
    {
        return this.Backpack;
    }

    GenerateStats()
    {
        this.Stats = {Vida: 1000 + (1000 * (this.level * 0.1)), Ataque: 800 + (800 * (this.level * 0.1)), Defensa: 500 + (500 * (this.level * 0.1))};
        this.MaxLife = this.Stats.Vida;
        this.Stats.Vida =  this.ActualLife;
        this.MaxExpLevel = this.level * 1000;
    }

    GetMaxLife()
    {
        return this.MaxLife;
    }

    GetStats()
    {
        return this.Stats;
    }

    GetLevel()
    {
        return this.level;
    }

    GetExp()
    {
        return this.Experiencia;
    }

    SetExp(exp)
    {
        this.Experiencia = exp;
    }

    GetMaxExp()
    {
        return this.MaxExpLevel;
    }

    SetLevel(lvl)
    {
        this.level = lvl;
    }

    GetBoss()
    {
        return this.Bosses;
    }
}

export {player};