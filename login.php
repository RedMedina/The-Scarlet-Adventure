<script>
//InicioSesion
function closeModalInicioS() {
    modal1 = document.getElementById("modal_inicio_Sesion");
    modal1.close();
    modal1.classList.remove('close');
    modal1.removeEventListener('animationend', closeModalInicioS);
}

function closeModalClickInicioS() {
    modal1 = document.getElementById("modal_inicio_Sesion");
    modal1.addEventListener('animationend', closeModalInicioS);
    modal1.classList.add('close');
}

//Registro
function closeModalReg() {
    modal1 = document.getElementById("modal_registro");
    modal1.close();
    modal1.classList.remove('close');
    modal1.removeEventListener('animationend', closeModalReg);
}

function closeModalClickReg() {
    modal1 = document.getElementById("modal_registro");
    modal1.addEventListener('animationend', closeModalReg);
    modal1.classList.add('close');
}
</script>

<center>
    <dialog id="modal_inicio_Sesion" class="modal_inicio_Sesion">
        <h3 class="IS_titulo">Inicio Sesión</h3>
        <input type="text" placeholder="Usuario" class="Input_IS" id="is_us"><br><br><br>
        <input type="password" placeholder="Contraseña" class="Input_IS" id="is_pass"><br><br>
        <button id="IS_enviar" class="IS_button">Iniciar Sesión</button><br><br>
        <button id="IS_volver" class="IS_button" onclick=" closeModalClickInicioS();">Volver</button><br>
        <button class="IS_button_reg" onclick="closeModalClickInicioS(); window.modal_registro.showModal();">Registrarse</button>
    </dialog>
</center>

<center>
    <dialog id="modal_registro" class="modal_registro">
        <h3 class="Reg_Titulo">Registro</h3>
        <input type="text" placeholder="nombre..." class="Input_Reg" id="nombre"><br><br><br>
        <input type="password" placeholder="contraseña..." class="Input_Reg" id="pass"><br><br><br>
        <input type="password" placeholder="confirmar contraseña..." class="Input_Reg" id="Cpass"><br><br>
        <button class="Reg_button_reg" id="registrar">Registrarse</button><br><br>
        <button onclick="closeModalClickReg();" class="Reg_button_can">Cancelar</button><br>
    </dialog>
</center>