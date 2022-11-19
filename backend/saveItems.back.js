function SaveItems(items)
{
    var dataToSend = {active: true, items: items};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/SaveItems_Inc.php',
        type: 'POST',
        async: true,
        data: {'save':Json},
        success: function(response)
        {
        }
    });

}