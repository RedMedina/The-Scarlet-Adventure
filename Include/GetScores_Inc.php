<?php
    include "../classes/user.classes.php";
    $response = json_decode($_POST['read']);

    if($response->active == true)
    {
        $read = new user;
        $scores = $read->GetScores();
        $finalData = array();
        for ($i=0; $i < count($scores); $i++) { 
            $data = $read->GetUsersScore($scores[$i]['us']);
            $data2 = array("name"=>$data[0]['name'], "date"=>$data[0]['date'], "level"=>$data[0]['level'], "score"=>$scores[$i]['score']);
            array_push($finalData, $data2);
        }
        echo json_encode($finalData);
    }
?>