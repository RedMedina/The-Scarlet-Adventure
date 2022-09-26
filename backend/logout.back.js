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
        }
    });
}