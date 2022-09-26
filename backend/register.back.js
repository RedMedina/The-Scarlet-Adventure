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
            alert(response);
        }
    });
}