<?php
    class userClass
    {
        private $id;
        private $photo;
        private $nombre;
        private $horas_jugadas;

        public function getId() { 
            return $this->id; 
        } 
    
        public function setId($id) {  
            $this->id = $id; 
        } 
    
        public function getPhoto() { 
                return $this->photo; 
        } 
    
        public function setPhoto($photo) {  
            $this->photo = $photo; 
        } 
    
        public function getNombre() { 
                return $this->nombre; 
        } 
    
        public function setNombre($nombre) {  
            $this->nombre = $nombre; 
        } 
    
        public function getHorasjugadas() { 
                return $this->horasjugadas; 
        } 
    
        public function setHorasjugadas($horasjugadas) {  
            $this->horasjugadas = $horasjugadas; 
        } 
    }
?>