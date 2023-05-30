<style>
    .Dialog_Present
		{
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.0);
            position: absolute;
            top: 0%;
            font-family: Permanent Marker;
            opacity: 0;
            border: none;
            transition: opacity 3.0s ease;
		}
        .Dialog_Present.show {
            opacity: 1; /* Cambia la opacidad a 1 para mostrar gradualmente el cuadro de diálogo */
        }
        .Dialog_Present.hide {
            opacity: 0;
        }
		.MessagePresent
		{
			padding-left: 20px;
			font-size: 70px;
            font-family: Permanent Marker;
		}
</style>

<dialog class="Dialog_Present" id="Dialog_Present">
    <center>
	<label class="MessagePresent" id="MessagePresent">
		Zona de Pradera
	</label><br>
    </center>
</dialog>

<script>
    //window.Dialog_Present.show();
    //var dialog = document.getElementById('Dialog_Present');
    //dialog.classList.add('show');

    //dialog.classList.remove('show');
    //dialog.classList.add('hide');
    //window.Dialog_Present.close();
</script>