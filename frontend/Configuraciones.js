$(document).ready
(
	function($){$("#GuardarConfig").click(function(){ SetConfig(); })}
);

var Configuraciones = {sonido: 0};
var VolumenIndex = 50;
const AccionesMenuu = {};

function SetConfig()
{
    var volumen = $('#VolumenData').val();
    var dataToSend = {active: true, sonido: volumen};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/SetConfiguracion_Inc.php',
        type: 'POST',
        async: true,
        data: {'set':Json},
        success: function(response)
        {
            VolumenIndex = volumen;
            AccionesMenuu.Sound();
            closeModalClickConfig();
        }
    });
}

function GetConfig()
{
    var dataToSend = {active: false};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/SetConfiguracion_Inc.php',
        type: 'POST',
        async: true,
        data: {'set':Json},
        success: function(response)
        {
            Configuraciones.sonido = JSON.parse(response);
            VolumenIndex = Configuraciones.sonido;
        }
    });
}