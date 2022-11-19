var PlayerDatos;

$(document).ready
(
	 SetUser()
);

function SetUser()
{
    var dataToSend = {active: true};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/ReadUser_Inc.php',
        type: 'POST',
        async: true,
        data: {'read':Json},
        success: function(response)
        {
            PlayerDatos = JSON.parse(response);
        }
    });

}