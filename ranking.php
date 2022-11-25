<script>
//Ranking
function closeModalRanking() {
    modal1 = document.getElementById("modal");
    modal1.close();
    modal1.classList.remove('close');
    modal1.removeEventListener('animationend', closeModalRanking);
}

function closeModalClickRanking() {
    modal1 = document.getElementById("modal");
    modal1.addEventListener('animationend', closeModalRanking);
    modal1.classList.add('close');
}
</script>

<center>
    <dialog id="modal" class="modal">
        <h3>Ranking</h3>
        <table cellspacing="0" id="RankingTabla">
            <tr>
                <th class="nombre">Nombre</th>
                <th>Nivel</th>
                <th>Fecha de Ingreso</th>
                <th class="UConexion">Score</th>
            </tr>
            <!--tr>
                <td>Usuario</td>
                <td>1</td>
                <td>24:49 horas</td>
                <td>5454543</td>
            </tr>
            <tr>
                <td>Usuario</td>
                <td>2</td>
                <td>23:44 horas</td>
                <td>454545</td>
            </tr-->
        </table>
        <?php
            if(isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true)
            {
                
            
        ?>
        <button onclick="shareScore();" class="FacebookBtn">Compartir Mi Score</button><br>
        <?php
            }
        ?>
        <button onclick="closeModalClickRanking();" class="volverBtn">Volver</button><br>
        <!--img src="Assets/Images/Pincelada.png" width="230" height="85" class="imgRanking"-->
    </dialog>
</center>