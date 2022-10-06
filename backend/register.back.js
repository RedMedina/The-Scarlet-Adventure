$(document).ready
(
	function($){$("#registrar").click(function(){ Validate(); })}
);

function Validate()
{
    var pass = $("#pass").val();
    var Cpass = $("#Cpass").val();

    let re = /^(?=.*\d)(?=.*[!@#$%^&.*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(re.test(pass) && pass == Cpass)
    {
        upUser();
    }
    else
    {
        alert("La contraseña debe contener mínimo 8 caracteres, tener mayusculas y minisculas y un caracter especial o no concuerdan las contraseñas");
    }
}

function upUser()
{
    var user = $("#nombre").val();
    var pass = $("#pass").val();
    var dataToSend = { active: true, name: user , key: pass};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/Register_Inc.php',
        type: 'POST',
        async: true,
        data: {'register':Json},
        success: function(response)
        {
            closeModalClickReg();
            var JsonResponse = JSON.parse(response);
            var imgInicioSesion = document.getElementById("imgUser");
            imgInicioSesion.src = JsonResponse.photo;
            var btnInicioSesion =  document.getElementById("IniciarSesion");
            btnInicioSesion.setAttribute('onclick','window.modal_perfil.showModal()');
            document.getElementById("imgP").src = JsonResponse.photo;
            document.getElementById("namePerfil").value = JsonResponse.name;
        }
    });
}