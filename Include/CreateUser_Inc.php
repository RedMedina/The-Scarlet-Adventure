<?php
    include "../classes/user.classes.php";

    $response = json_decode($_POST['create']);

    if($response->active == true)
    {
        session_start();
        $create = new user;
        $create->CreatePlayer($_SESSION['id'], $response->level, $response->aLife, $response->exp, $response->coorX, $response->coorY, $response->coorZ, $response->scene, $response->boss1, $response->boss2, $response->boss3);
        $bosses = 0;
        if($response->boss1 == true)
        {
            $bosses += 100;
        }
        if($response->boss2 == true)
        {
            $bosses += 100;
        }
        if($response->boss3 == true)
        {
            $bosses += 100;
        }
        $score = $response->level * 50 + $bosses;
        $create->InsertScore($_SESSION['id'], $score);
    }
?>