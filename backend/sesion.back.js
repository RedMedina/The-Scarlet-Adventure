$(document).ready
(
	function($){$("#IS_enviar").click(function(){ SesUser(); })}
);

var MyName;

function SesUser()
{
    var user = $("#is_us").val();
    var pass = $("#is_pass").val();
    var dataToSend = { active: true, name: user , key: pass};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/Sesion_Inc.php',
        type: 'POST',
        async: true,
        data: {'response':Json},
        success: function(response)
        {
            var JsonResponse = JSON.parse(response);
            if(JsonResponse.correcto == true)
            {
                closeModalClickInicioS();
                var imgInicioSesion = document.getElementById("imgUser");
                imgInicioSesion.src = JsonResponse.photo;
                var btnInicioSesion =  document.getElementById("IniciarSesion");
                btnInicioSesion.setAttribute('onclick','window.modal_perfil.showModal()');
                document.getElementById("imgP").src = JsonResponse.photo;
                document.getElementById("namePerfil").value = JsonResponse.name;
                MyName = JsonResponse.name;
            }
            else
            {
                alert(JsonResponse.message);
            }
        }
    });
}