<?php
    include "../classes/user.classes.php";
    $response = json_decode($_POST['read']);

    if($response->active == true)
    {
        session_start();
        $read = new user;
        $datos = $read->ReadPlayer($_SESSION['id']);
        $player = array("level"=> $datos['level'], "ActualLife"=> $datos['ActualLife'], "Experiencia"=> $datos['Experiencia'],
        "coorX"=>$datos['coorX'],"coorY"=>$datos['coorY'],"coorZ"=>$datos['coorZ'], "scene"=>$datos['scene'],
        "Boss_1"=>$datos['Boss_1'], "Boss_2"=>$datos['Boss_2'], "Boss_3"=>$datos['Boss_3'], "Name"=>$_SESSION['nombre']);
        echo json_encode($player);
    }
?>