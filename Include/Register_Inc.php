<?php
    include "../classes/user.classes.php";
    
    $response = json_decode($_POST['register']);
    
    if($response->active == true)
    {
        $register = new user;
        $path = '../Assets/Images/user.png';
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        $register->Register($response->name, $response->key, $base64);
        $user = $register->sesion($response->name, $response->key);
        session_start();
        $_SESSION['loggedin'] = true;
        $_SESSION['id'] = $user->getId();
        $_SESSION['photo'] = $user->getPhoto();
        $_SESSION['nombre'] = $user->getNombre();
        $_SESSION['horas_jugadas'] = $user->getHorasjugadas();
    }
?>