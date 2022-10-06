<script>
    //Perfil
    function closeModalPerfi() {
        modal1 = document.getElementById("modal_perfil");
        modal1.close();
        modal1.classList.remove('close');
        modal1.removeEventListener('animationend', closeModalPerfi);
    }

    function closeModalClickPerfil() {
        modal1 = document.getElementById("modal_perfil");
        modal1.addEventListener('animationend', closeModalPerfi);
        modal1.classList.add('close');
    }
</script>
 
    <center>
        <dialog id="modal_perfil" class="modal_perfil">
            <h3 class="user">Perfil</h3>
            <input type="text" id="namePerfil" class="namePerfil" value=<?php if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){echo $_SESSION['nombre'];}?>><br>
            <div class="imageP">
            <img src=<?php if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true){echo $_SESSION['photo'];}?> width="60" height="60" id="imgP" class="imgP"><br>
            </div>
            <input type="file" id="file-upload" class="filePerfil"><br>
            <label for="file-upload" class="filePerfilL" id="file-upload">Cambiar Foto <i class="fa fa-cloud-upload"></i></label><br>
            <button id="Logout" class="Logout"><i class="fa fa-power-off"></i></button><br>
            <button class="guardarPerfil" id="guardarPerfil">Guardar</button>
            <button class="SalirPerfil" onclick="closeModalClickPerfil();">Salir</button>
        </dialog>
    </center>

<script type='text/javascript' src="frontend/PreImagen.js"></script>