<?php
    include "../classes/user.classes.php";
    $response = json_decode($_POST['save']);

    if($response->active == true)
    {
        session_start();
        $save = new user;
        $save->UpdatePlayer($_SESSION['id'], $response->player->level, $response->player->ActualLife, $response->player->exp, $response->player->coorX, $response->player->coorY, $response->player->coorZ, $response->player->scene, $response->player->boss1, $response->player->boss2, $response->player->boss3);
        $bosses = 0;
        if($response->player->boss1 == true)
        {
            $bosses += 100;
        }
        if($response->player->boss2 == true)
        {
            $bosses += 100;
        }
        if($response->player->boss3 == true)
        {
            $bosses += 100;
        }
        $score = $response->player->level * 50 + $bosses;
        $save->UpdateScore($_SESSION['id'], $score);
    }
?>