<?php
    include "../classes/Conexion.classes.php";
    include "../classes/userclass.classes.php";

    class user
    {
        private $Con;
        private $Statement;

        public function Register($nombre, $userkey)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("insert into user (Nombre, User_Key, Horas_Jugadas, active, Creacion) 
            values (?, ?, '00:00:00', true, sysdate())");
            $Statement->bind_param('ss', $nombre, $userkey);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function sesion($nombre, $userkey)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("select Id, Nombre, Photo, Horas_Jugadas from user where Nombre = ? AND User_Key = ? AND active = true");
            $Statement->bind_param('ss', $nombre, $userkey);
            $Statement->execute();
            $result = $Statement->get_result();
            $Usuarios = null;
            while ($row = $result->fetch_assoc())
            {
                $Usuarios = new userClass;
                $Usuarios->setId($row['Id']);
                $Usuarios->setPhoto($row['Photo']);
                $Usuarios->setNombre($row['Nombre']);
                $Usuarios->setHorasjugadas($row['Horas_Jugadas']);
            }
            $Statement->close();
            $Con->Desconectar();
            return $Usuarios;
        }

        public function save($horas, $id)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("update user set Horas_Jugadas = ? where Id = ?");
            $Statement->bind_param('ss', $horas, $id);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }
    }
?>