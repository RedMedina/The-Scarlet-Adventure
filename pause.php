<dialog class="menu" id="ModalMenu">
		<div class="datosMenu">
			<div class="imgMP"><img src=<?php echo $_SESSION['photo']; ?>></div>
			<div>Nombre: <?php echo $_SESSION['nombre']; ?></div>
			<div id="PauseNivel"></div>
			<div id="PauseExp"></div>
			<div id="PauseMapa"></div>
			<!--div id="PauseWitch">Bruja1: Sí, Bruja2: Sí, Bruja3: Sí</div-->
		</div>
		<div class="MochilaTitulo">Mochila: </div>
		<div class="MochilaMenu" id="MochilaMenu">
			<br>
		</div>
		<div class="BtnMenu">
			<button class="BtnCerrarMenu" onclick="CerrarPause();">Cerrar</button>
			<button class="BtnGYSMenu" id="GuardarS_Menu">Guardar y Salir</button>
		</div>
</dialog>