$(document).ready
(
	function($){$("#registrar").click(function(){ upUser(); })}
);

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