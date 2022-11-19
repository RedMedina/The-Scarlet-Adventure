<?php
    include "../classes/Conexion.classes.php";
    include "../classes/userclass.classes.php";

    class user
    {
        private $Con;
        private $Statement;

        public function Register($nombre, $userkey, $img)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("insert into user (Nombre, User_Key, Photo, Horas_Jugadas, active, Creacion) 
            values (?, ?, ?, '00:00:00', true, sysdate())");
            $Statement->bind_param('sss', $nombre, $userkey, $img);
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

        public function update($id, $nombre, $photo)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("update user set Nombre = ?, Photo = ? where Id = ?");
            $Statement->bind_param('sss', $nombre, $photo, $id);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function CreatePlayer($user, $level, $ActualLife, $experiencia, $coorX, $coorY, $coorZ, $scene, $boss1, $boss2, $boss3)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("insert into game(user, level, ActualLife, Experiencia, coorX, coorY, coorZ, scene,
            Boss_1, Boss_2, Boss_3, Final_Boss) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)");
            $Statement->bind_param('sssssssssss', $user, $level, $ActualLife, $experiencia, $coorX, $coorY, $coorZ, $scene, $boss1, $boss2, $boss3);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function ReadPlayer($user)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("select * from game where user = ?");
            $Statement->bind_param('s', $user);
            $Statement->execute();
            $result = $Statement->get_result();
            $player = null;
            while ($row = $result->fetch_assoc())
            {
                $array = array("level"=> $row['level'], "ActualLife"=> $row['ActualLife'], "Experiencia"=> $row['Experiencia'],
                                "coorX"=>$row['coorX'],"coorY"=>$row['coorY'],"coorZ"=>$row['coorZ'], "scene"=>$row['scene'],
                                "Boss_1"=>$row['Boss_1'], "Boss_2"=>$row['Boss_2'], "Boss_3"=>$row['Boss_3']);
                $player = $array;
            }
            $Statement->close();
            $Con->Desconectar();
            return $player;
        }

        public function DeleteItemBeforeSave($user)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("delete from items where User = ?");
            $Statement->bind_param('s', $user);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function SaveItems($user, $Nombre, $Curacion, $Cantidad)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("insert into items(Nombre, Curacion, Cantidad, User)
            values (?, ?, ?, ?)");
            $Statement->bind_param('ssss', $Nombre, $Curacion, $Cantidad, $user);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function GetItems($user)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("select * from items where User = ?");
            $Statement->bind_param('s', $user);
            $Statement->execute();
            $result = $Statement->get_result();
            $items = array();
            while ($row = $result->fetch_assoc())
            {
                $item = array("name"=>$row['Nombre'], "curacion"=>$row['Curacion'], "cantidad"=>$row['Cantidad']);
                array_push($items, $item);
            }
            $Statement->close();
            $Con->Desconectar();
            return $items;
        }

        public function UpdatePlayer($user, $level, $ActualLife, $experiencia, $coorX, $coorY, $coorZ, $scene, $boss1, $boss2, $boss3)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("update game set level = ?, ActualLife = ?, Experiencia = ?, coorX = ?, coorY = ?, coorZ = ?, scene = ?,
            Boss_1 = ?, Boss_2 = ?, Boss_3 = ? where user = ?");
            $Statement->bind_param('sssssssssss', $level, $ActualLife, $experiencia, $coorX, $coorY, $coorZ, $scene, $boss1, $boss2, $boss3, $user);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function InsertScore($user, $score)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("insert into score(Puntuacion, Fecha, Usuario)
            values (?, sysdate(), ?)");
            $Statement->bind_param('ss', $score, $user);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function UpdateScore($user, $score)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("update score set Puntuacion = ?, Fecha = sysdate() where Usuario = ?");
            $Statement->bind_param('ss', $score, $user);
            $Statement->execute();
            $Statement->close();
            $Con->Desconectar();
        }

        public function GetScores()
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("select Puntuacion, Usuario from score ORDER by Puntuacion DESC LIMIT 8;");
            $Statement->execute();
            $result = $Statement->get_result();
            $puntuaciones = array();
            while ($row = $result->fetch_assoc())
            {
                $point = array("score"=>$row['Puntuacion'], "us"=>$row['Usuario']);
                array_push($puntuaciones, $point);
            }
            $Statement->close();
            $Con->Desconectar();
            return $puntuaciones;
        }

        public function GetUsersScore($user)
        {
            $Con = new Conexion;
            $Statement = $Con->Conecta()->prepare("select Nombre, Creacion, level from user as Usuario, game as Juego where active = true and Usuario.Id = ? and Juego.user = Usuario.Id");
            $Statement->bind_param('s', $user);
            $Statement->execute();
            $result = $Statement->get_result();
            $users = array();
            while ($row = $result->fetch_assoc())
            {
                $us = array("name"=>$row['Nombre'], "date"=>$row['Creacion'], "level"=>$row['level']);
                array_push($users, $us);
            }
            $Statement->close();
            $Con->Desconectar();
            return $users;
        }
    }
?>