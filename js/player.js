class player
{
    constructor(Name, Position, Experiencia, Backpack, level, bosses)
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
}

export {player};