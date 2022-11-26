<script>
    //Perfil
    function closeModalCGame() {
        modal1 = document.getElementById("modal_ChoseGame");
        modal1.close();
        modal1.classList.remove('close');
        modal1.removeEventListener('animationend', closeModalCGame);
    }

    function closeModalClickCGame() {
        modal1 = document.getElementById("modal_ChoseGame");
        modal1.addEventListener('animationend', closeModalCGame);
        modal1.classList.add('close');
    }
</script>
 
    <center>
        <dialog id="modal_ChoseGame" class="modal_perfil">
            <h3 class="SelectGameText">Seleccione</h3>
            <button class="SelectGame" onclick="location.href='game.php'">Single Player</button><br><br>
            <button class="SelectGame" onclick="location.href='multiplayer.php'">Local Multiplayer</button><br><br>
            <button class="SelectGame" onclick="closeModalClickCGame();">Salir</button>
        </dialog>
    </center>