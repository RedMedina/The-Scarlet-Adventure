<?php
    class Conexion{
        private $host;
        private $root;
        private $pass;
        private $base;
        private $conexion;
        private $db;

        public function __construct()
        {
            $this->host = "localhost";
            $this->root = "root";
            $this->pass = "";
            $this->base = "scarlet_aventure";
        }

        public function Conecta()
        {
            try{
                $this->conexion = new mysqli($this->host, $this->root, $this->pass, $this->base);
                return $this->conexion;
            }
            catch (Exception $e)
            {
                header("Location: ../Error.php?error=ConexionFailed");
            }
        }

        public function Desconectar()
        {
            $this->conexion->close();
        }

        public function GetConextion()
        {
            return $conexion;
        }
    }
?>