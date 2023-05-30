<style>
    .Dialog_Death
		{
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
            position: absolute;
            top: 0%;
            font-family: Permanent Marker;
            opacity: 0;
            border: none;
            transition: opacity 3.0s ease;
		}
        .Dialog_Death.show {
            opacity: 1; /* Cambia la opacidad a 1 para mostrar gradualmente el cuadro de diálogo */
        }
		.MessageDeath
		{
			padding-left: 20px;
			font-size: 100px;
            font-family: Permanent Marker;
		}
</style>

<dialog class="Dialog_Death" id="Dialog_Death">
    <center>
	<label class="MessageDeath" id="MessageDeath">
		GAME OVER
	</label><br>
    </center>
</dialog>

<script>
    //window.Dialog_Death.show();
    //var dialog = document.getElementById('Dialog_Death');
    //dialog.classList.add('show');
</script>