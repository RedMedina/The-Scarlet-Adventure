var Items;

$(document).ready
(
    GetItems()
);

function GetItems()
{
    var dataToSend = {active: true};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/GetItems_Inc.php',
        type: 'POST',
        async: true,
        data: {'read':Json},
        success: function(response)
        {
            Items = JSON.parse(response);
            //alert(response);
        }
    });
}