<?php
    include "../classes/user.classes.php";

    $response = json_decode($_POST['update']);
    session_start();
    if($response->active == true)
    {
        $update = new user;
        $update->update($_SESSION['id'], $response->name, $response->imge);
        $_SESSION['photo'] = $response->imge;
        $_SESSION['nombre'] = $response->name;
    }
?>