<?php
    include "../classes/user.classes.php";
    
    $response = json_decode($_POST['response']);
    
    if($response->active == true)
    {
        $session = new user;
        $user = $session->sesion($response->name, $response->key);
        session_start();
        $_SESSION['loggedin'] = true;
        $_SESSION['id'] = $user->getId();
        $_SESSION['photo'] = $user->getPhoto();
        $_SESSION['nombre'] = $user->getNombre();
        $_SESSION['horas_jugadas'] = $user->getHorasjugadas();
    }
?>