$(document).ready
(
	function($){$("#IS_enviar").click(function(){ SesUser(); })}
);

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
            alert(response);
        }
    });
}