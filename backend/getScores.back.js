$(document).ready
(
    GetScores()
);

function GetScores()
{
    debugger
    var dataToSend = {active: true};
    var Json = JSON.stringify(dataToSend);
    $.ajax({
        url: './Include/GetScores_Inc.php',
        type: 'POST',
        async: true,
        data: {'read':Json},
        success: function(response)
        {
           var Scores = JSON.parse(response);
            for (let i = 0; i < Scores.length; i++) {
                $('#RankingTabla').append("<tr><td>"+Scores[i].name+"</td> <td>"+Scores[i].level+"</td> <td>"+Scores[i].date
                +"</td> <td>"+Scores[i].score+"</td></tr>");
            }
        }
    });
}