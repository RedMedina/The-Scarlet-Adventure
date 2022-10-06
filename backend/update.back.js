$(document).ready
(
	function($){$("#guardarPerfil").click(function(){ updateUser(); })}
);

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function updateUser()
{
    var user = $("#namePerfil").val();
    toDataURL(document.getElementById("imgP").src, function(dataUrl) {
        var dataToSend = { active: true, name: user, imge: dataUrl};
        var Json = JSON.stringify(dataToSend);
        $.ajax({
            url: './Include/Update_Inc.php',
            type: 'POST',
            async: true,
            data: {'update':Json},
            success: function(response)
            {
                var JsonResponse = JSON.parse(response);
                var imgInicioSesion = document.getElementById("imgUser");
                imgInicioSesion.src = JsonResponse.photo;
            }
        });
    });
}