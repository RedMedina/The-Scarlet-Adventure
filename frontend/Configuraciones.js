$(document).ready
(
	function($){$("#GuardarConfig").click(function(){ SetConfig(); })}
);

var Configuraciones = {/*sonido: 0, dif: 1*/};
var VolumenIndex = 50;
const AccionesMenuu = {};

function SetConfig()
{
    var volumen = $('#VolumenData').val();
    var dif = $('#DificultadConfig').val();
    var dataToSend = {active: true, sonido: volumen, dificultad: dif};
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
            Configuraciones = JSON.parse(response);
            VolumenIndex = Configuraciones.sonido;
        }
    });
}