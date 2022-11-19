function UpdatePlayer(player)
{
    var dataToSend = {active: true, player: player};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/Update_User_Inc.php',
        type: 'POST',
        async: true,
        data: {'save':Json},
        success: function(response)
        {
        }
    });

}