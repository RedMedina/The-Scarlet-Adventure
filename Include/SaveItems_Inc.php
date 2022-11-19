<?php
    include "../classes/user.classes.php";
    $response = json_decode($_POST['save']);

    if($response->active == true)
    {
        session_start();
        $save = new user;
        $save->DeleteItemBeforeSave($_SESSION['id']);
        for ($i=0; $i < count($response->items); $i++) { 
            $save->SaveItems($_SESSION['id'], $response->items[$i]->name, $response->items[$i]->curacion, $response->items[$i]->cantidad);
        }
    }
?>