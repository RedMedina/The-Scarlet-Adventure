<?php
    include "../classes/user.classes.php";
    $response = json_decode($_POST['read']);

    if($response->active == true)
    {
        session_start();
        $read = new user;
        $Items = $read->GetItems($_SESSION['id']);
        echo json_encode($Items);
    }

?>