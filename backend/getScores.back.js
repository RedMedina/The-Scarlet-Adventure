$(document).ready
(
    GetScores()
);
var MyScore;

function GetScores()
{
    var dataToSend = {active: true};
    var Json = JSON.stringify(dataToSend);
    MyName = $('#namePerfil').val();
    $.ajax({
        url: './Include/GetScores_Inc.php',
        type: 'POST',
        async: true,
        data: {'read':Json},
        success: function(response)
        {
           var Scores = JSON.parse(response);
            for (let i = 0; i < Scores.length; i++) {
                if(Scores[i].name == MyName)
                {
                    MyScore = Scores[i].score;
                }
                $('#RankingTabla').append("<tr><td>"+Scores[i].name+"</td> <td>"+Scores[i].level+"</td> <td>"+Scores[i].date
                +"</td> <td>"+Scores[i].score+"</td></tr>");
            }
        }
    });
}