class GUI
{
    CreateLife(valueVidaActual, MaxLife)
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
        const Exp = document.createElement('progress');
        Exp.max = 100;
        Exp.value = 40;
        Exp.id = "Exp_bar";
        document.body.appendChild(Exp);
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

    CreateHelpers()
    {
        const movement = document.createElement('label');
        movement.id = "movement";
        movement.innerHTML = "Movimento  <b>WASD</b>";
        document.body.appendChild(movement);

        const Attack = document.createElement('label');
        Attack.id = "AttackH";
        Attack.innerHTML = "Atacar  <b>E</b>";
        document.body.appendChild(Attack);

        const Menu = document.createElement('label');
        Menu.id = "MenuH";
        Menu.innerHTML = "Menu/Pausa  <b>M</b>";
        document.body.appendChild(Menu);
    }
}

export { GUI };