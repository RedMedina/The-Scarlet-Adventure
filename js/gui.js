class GUI
{
    CreateLife(valueVidaActual, MaxLife, valueExpActual, MaxExp)
    {
        this.Vida = document.createElement('progress');
        this.Vida.max = 100;
        var Porcentaje = (valueVidaActual / MaxLife) * 100;
        this.Vida.value = Math.round(Porcentaje);
        this.Vida.id = "Vida_bar";
        const Vida_Value = document.createElement('div');
        Vida_Value.id = "Vida_value";
        Vida_Value.className = "Vida_value";
        Vida_Value.innerHTML = "<label class='Vida_num' id='VidaValorNum'>"+this.Vida.value+"%</label>";
        this.Exp = document.createElement('progress');
        this.Exp.max = 100;
        var PorcentajeExp = (valueExpActual / MaxExp) * 100;
        this.Exp.value = Math.round(PorcentajeExp);
        this.Exp.id = "Exp_bar";
        document.body.appendChild(this.Exp);
        document.body.appendChild(this.Vida);
        document.body.appendChild(Vida_Value);
    }

    SetVidaActual(valueVidaActual, MaxLife)
    {
        var Porcentaje = (valueVidaActual / MaxLife) * 100;
        this.Vida.value = Math.round(Porcentaje);
        document.getElementById("VidaValorNum").innerHTML = Math.round(Porcentaje) + "%";
        //console.log(document.getElementById("VidaValorNum").value);
    }

    SetExpActual(valueExpActual, MaxExp)
    {
        var Porcentaje = (valueExpActual / MaxExp) * 100;
        this.Exp.value = Math.round(Porcentaje); 
    }

    CreateHelpers()
    {

        this.Interactuar = document.createElement('label');
        this.Interactuar.id = "InteractuarH";
        document.body.appendChild(this.Interactuar);

        const movement = document.createElement('label');
        movement.id = "movement";
        movement.innerHTML = "Movimento: <img src='Assets/Images/w.png' width='30' height='30'><img src='Assets/Images/a.png' width='30' height='30'><img src='Assets/Images/flechaI.png' width='30' height='30'><img src='Assets/Images/FlechaD.png' width='30' height='30'>";
        document.body.appendChild(movement);

        const Attack = document.createElement('label');
        Attack.id = "AttackH";
        Attack.innerHTML = "Atacar: <img src='Assets/Images/e.png' width='30' height='30'>";
        document.body.appendChild(Attack);

        const Dodge = document.createElement('label');
        Dodge.id = "DodgeH";
        Dodge.innerHTML = "Esquivar: <img src='Assets/Images/q.png' width='30' height='30'>";
        document.body.appendChild(Dodge);

        const Menu = document.createElement('label');
        Menu.id = "MenuH";
        Menu.innerHTML = "Menu/Pausa: <img src='Assets/Images/p.png' width='30' height='30'>";
        document.body.appendChild(Menu);
    }

    DesbrillarReaction()
    {
        this.Interactuar.innerHTML = "Interactuar: <img src='Assets/Images/r.png' width='30' height='30'>";
    }

    BrillarReaction()
    {
        this.Interactuar.innerHTML = "Interactuar: <img src='Assets/Images/r_select.png' width='30' height='30'>";
    }
}

export { GUI };