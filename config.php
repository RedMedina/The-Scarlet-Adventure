<script>
    //Config
    function closeModalConfig() {
        modal1 = document.getElementById("modal_config");
        modal1.close();
        modal1.classList.remove('close');
        modal1.removeEventListener('animationend', closeModalConfig);
    }

    function closeModalClickConfig() {
        modal1 = document.getElementById("modal_config");
        modal1.addEventListener('animationend', closeModalConfig);
        modal1.classList.add('close');
    }
</script>

<center>
    <dialog id="modal_config" class="modal_config">
        <h3 class="TituloConfig">Ajustes</h3>
        <label class="l1">Dificultad: </label><br>
        <select class="DificultadConfig">
            <option value="Facil">Facil</option>
            <option value="Normal">Normal</option>
            <option value="Dificil">Dificil</option>
        </select><br>
        <label class="l2">Volumen: </label><input type="range" min="0" max="100" class="RangoC" value="50" oninput="this.nextElementSibling.value = this.value">
        <output class="outputRange">50</output><br>
        <button class="guardarConfig">Guardar</button>
        <button class="SalirConfig" onclick="closeModalClickConfig();">Salir</button>
    </dialog>
</center>