$(document).ready
(
	function($){$("#Logout").click(function(){ logout(); })}
);

function logout()
{
    $.ajax({
        url: './Include/Logout_Inc.php',
        type: 'POST',
        async: true,
        data: {'response': 1},
        success: function(response)
        {
            alert(response);
            closeModalClickPerfil();
            document.getElementById("imgUser").src = "Assets/Images/user.png";
            var btnInicioSesion =  document.getElementById("IniciarSesion");
            btnInicioSesion.setAttribute('onclick','window.modal_inicio_Sesion.showModal()');
        }
    });
}