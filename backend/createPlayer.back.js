
function createPlayer()
{
    
    var dataToSend = { active: true, level: 1, aLife: 1100, exp:0, coorX:1000, coorY:200, coorZ:8550, scene:1, boss1:false, boss2:false, boss3:false};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/CreateUser_Inc.php',
        type: 'POST',
        async: true,
        data: {'create':Json},
        success: function(response)
        {
            //var JsonResponse = JSON.parse(response);
            alert(response);
        }
    });
}