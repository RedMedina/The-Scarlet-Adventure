import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Scenee} from '/PWGW/js/scene.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GUI} from '/PWGW/js/gui.js';
import {AudioController} from '/PWGW/js/audioController.js';
import {Audioo} from '/PWGW/js/audio.js';
import {Shots} from '/PWGW/js/disparo.js';

function main()
{
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var Escenario = new Scenee();
    var Scene;
    var Camara = new Cameraa(45, 2, 0.1, 1000000);
    Camara.GetCamera().position.set(0, 140, -370);

    var castFrom = new THREE.Vector3();
    var castDirection = new THREE.Vector3(0,-1,0);

    const clock = new THREE.Clock();
    let RotationSky = 0;
    let intensityAmbientLight = 1;
    let intensityL = true;
    var Dia = true;

    let ColorDia = new THREE.Color(0xFFFFFF);
    let ColorTarde = new THREE.Color(0xffa500);
    let ColorNoche = new THREE.Color(0x000033);
    
    var keys = {};
    var Actionkeys = {Attack: false, Dodge: false, Jump: false, Die: false, Nado: false};
    var mousekeys = [];
    var ModelsLoaded = false;
    var pos1;

    document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);

    var ProgressBar = document.getElementById( 'ProgressLoad' );

    const loadingManager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
       
	} );

    
    loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        // Calcula el porcentaje de recursos cargados
        const progress = (itemsLoaded / itemsTotal) * 100;
        // Actualiza el valor de tu barra de progreso
        ProgressBar.value = progress;
    };

    loadingManager.onLoad = function()
    {
        document.querySelector('#loading-screen').remove();
        //Initialize Player
        Escenario.GetPlayer().GetModel().Pradera.playAnimation(0,1);
        Escenario.GetPlayer().GetModel().Pantano.playAnimation(0,1);
        Escenario.GetPlayer().GetModel().Nieve.playAnimation(0,1);
        if(PlayerDatos.scene == 1)
        {
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
        }
        else if (PlayerDatos.scene == 2)
        {
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
        }
        else if (PlayerDatos.scene == 3)
        {
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetNieveScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
        }
        
        //Base Sound
        audioCont.PlaySceneSound(PlayerDatos.scene);
        ModelsLoaded = true;

        Escenario.GetPraderaEnemies().Collider.sort(function(a,b){return a.name - b.name});
        Escenario.GetPraderaEnemies().Object.sort(function(a,b){return a.GetNum() - b.GetNum()});
        Escenario.GetPantanoEnemies().Collider.sort(function(a,b){return a.name - b.name});
        Escenario.GetPantanoEnemies().Object.sort(function(a,b){return a.GetNum() - b.GetNum()});
        Escenario.GetNieveEnemies().Collider.sort(function(a,b){return a.name - b.name});
        Escenario.GetNieveEnemies().Object.sort(function(a,b){return a.GetNum() - b.GetNum()});

        //pos1 = Escenario.GetPraderaScene().getObjectByName("PlayerModel").position;
        //var pos2 = Escenario.GetPantanoScene().getObjectByName("PlayerModel").position;
        //var pos3 = Escenario.GetNieveScene().getObjectByName("PlayerModel").position;
    }

    Escenario.InitScene(loadingManager);
    Escenario.PantanoScene(loadingManager);
    Escenario.PraderaScene(loadingManager);
    Escenario.NieveScene(loadingManager);
    Escenario.Rain();
    Escenario.Snow();

    if(PlayerDatos.scene == 1)
    {
        Scene = Escenario.GetPraderaScene();
    }
    else if(PlayerDatos.scene == 2)
    {
        Scene = Escenario.GetPantanoScene();
    }
    else if (PlayerDatos.scene == 3)
    {
        Scene = Escenario.GetNieveScene();
    }
   
    const audioCont = new AudioController();
    var SonidoFinal = Configuraciones.sonido * 0.001;
    console.log(Configuraciones.dif);
    audioCont.SetVolume(SonidoFinal);
    const AudioM = new Audioo();
    AudioM.create("Muerte");
    AudioM.Sound("Assets/BGM/Death.mp3");
    AudioM.GetSound().setVolume(SonidoFinal);

    var Disparo = new Shots();
    var ShotsPradera = [];
    var ShotsPantano = [];
    var ShotsNieve = [];

    var ShotsEnemiePradera = [];
    var ShotsEnemiePantano = [];
    var ShotsEnemieNieve = [];

    var Disparando = false;
    var EnemyDisparando = false;
    var DisparandoContador = 0;
    var DisparandoEnemyContador = 0;

    var DodgeDuracion = 1.5;
    var DodgeContador = 0;
    var AttackDuracion = 2.2;
    var AttackContador = 0;
    var JumpDuracion = 2.5;
    var JumpContador = 0;

    var ActualScene = PlayerDatos.scene;
    var movPas = 0;
    var rayCaster = new THREE.Raycaster();

    var Invesible = false;
    var InvensibleContador = 0;

    var Die = false;
    var DieDuracion = 0;

    var tiempoPortales = 0;
    var CambiandoDeMapa = false;
    var CambiandoDeMapaCont = 0;

    var DefensaExtraPlayer = false;
    var DefensaExtraCont = 0;
    var AtaqueExtraPlayer = false;
    var AtaqueExtraCont = 0;
    
    let water;
    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
	water = new Water(
		waterGeometry,
			{
				textureWidth: 512,
				textureHeight: 512,
				waterNormals: new THREE.TextureLoader().load( 'Assets/Images/Water_1_M_Normal.jpg', function ( texture ) {
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				} ),
				sunDirection: new THREE.Vector3(-2,0,-4),
				sunColor: 0xffffff,
				//waterColor: 0x001e0f,
                waterColor: 0xDEF1FF,
				distortionScale: 3.7
			}
		);
	water.rotation.x = - Math.PI / 2;
    water.position.x = -300;
    water.position.z = -3000; 
    water.position.y = 50;
    Escenario.GetPraderaScene().add( water );

    let stats = new Stats();
    document.body.appendChild( stats.domElement );

   /* const controls = new OrbitControls(Camara.GetCamera(), canvas);
    controls.target.set(0, 5, 0);
    controls.update();*/

    var leavesMateriala = [];
    CreatePasto(6000, -2400, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000, 4300, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000,  300, -6600, 30, 25, 30, 170, 120);
    CreatePasto(6000, -7300, -3000, 30, 25, 30, 110, 120);

    const ui = new GUI();
    ui.CreateLife(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife(), Escenario.GetPlayer().GetExp(), Escenario.GetPlayer().GetMaxExp());
    ui.CreateHelpers();

    function CreatePasto(instanNumber, posx, posz, scalex, scaley, scalez, spacex, spacez)
    {
        const vertexShader = `
            varying vec2 vUv;
            uniform float time;
            
                void main() {

                vUv = uv;
                
                // VERTEX POSITION
                
                vec4 mvPosition = vec4( position, 1.0 );
                #ifdef USE_INSTANCING
                    mvPosition = instanceMatrix * mvPosition;
                #endif
                
                // DISPLACEMENT
                
                // here the displacement is made stronger on the blades tips.
                float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
                
                float displacement = sin( mvPosition.z + time * 5.0 ) * ( 0.1 * dispPower );
                mvPosition.z += displacement;
                
                //
                
                vec4 modelViewPosition = modelViewMatrix * mvPosition;
                gl_Position = projectionMatrix * modelViewPosition;

                }
            `;
            const fragmentShader = `
            varying vec2 vUv;
            
            void main() {
                vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
                float clarity = ( vUv.y * 0.5 ) + 0.5;
                gl_FragColor = vec4( baseColor * clarity, 1 );
            }
            `;

        var leavesMaterialaa = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms:
            {
                time: {
                    value: 0
                }
            },
            side: THREE.DoubleSide,
           // lights: true,
           // shadowmap: true
        });

        const instanceNumber = instanNumber;
        const dummy = new THREE.Object3D();
        
        const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
        geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

        const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterialaa, instanceNumber );
        instancedMesh.position.x = posx;
        instancedMesh.position.y = 200;
        instancedMesh.position.z = posz;
        instancedMesh.scale.x = scalex;
        instancedMesh.scale.y = scaley;
        instancedMesh.scale.z = scalez;
        instancedMesh.receiveShadow = true;
        Escenario.GetPraderaScene().add( instancedMesh );

        for ( let i=0 ; i<instanceNumber ; i++ ) {

            dummy.position.set(
            ( Math.random() - 0.5 ) * spacex,
            0,
            ( Math.random() - 0.5 ) * spacez
        );
        
        dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
        
        dummy.rotation.y = Math.random() * Math.PI;
        dummy.receiveShadow = true;
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt( i, dummy.matrix );
    
        }
        leavesMateriala.push(leavesMaterialaa);
    }

    function onKeyDown(event) {
		keys[String.fromCharCode(event.keyCode)] = true;
	}
	function onKeyUp(event) {
		keys[String.fromCharCode(event.keyCode)] = false;
	}
    function onMouseMove(event){
        mousekeys[0] = event.movementX;
        mousekeys[1] = event.movementY;
    }

    function UseItem(index)
    {
        var NameItem = Escenario.GetPlayer().GetBackpack().GetItems()[index].getItem().name;
        var Curacion = Escenario.GetPlayer().GetBackpack().UseItem(index);
        
        if(NameItem == "Pocion Defensa")
        {
            Escenario.GetPlayer().GetStats().Defensa += Curacion;
            DefensaExtraPlayer = true;
            const text = new THREE.TextureLoader().load( "Assets/Images/DefText.png" );;
            text.wrapS = text.wrapT = THREE.RepeatWrapping; 
            const geometry = new THREE.CylinderGeometry( 50, 50, 250, 19 );
            const material = new THREE.MeshBasicMaterial( {map: text, transparent: true} );
            const cylinder = new THREE.Mesh( geometry, material );
            cylinder.name = "DefCilinder";
            cylinder.position.y = 30;
            const cylinder2 = new THREE.Mesh( geometry, material );
            cylinder2.name = "DefCilinder";
            cylinder2.position.y = 30;
            const cylinder3 = new THREE.Mesh( geometry, material );
            cylinder3.name = "DefCilinder";
            cylinder3.position.y = 30;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(cylinder);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(cylinder2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(cylinder3);
        }
        else if(NameItem == "Pocion Ataque")
        {
            console.log(Escenario.GetPlayer().GetStats().Ataque);
            Escenario.GetPlayer().GetStats().Ataque += Curacion;
            console.log(Escenario.GetPlayer().GetStats().Ataque);
            AtaqueExtraPlayer = true;
            const text = new THREE.TextureLoader().load( "Assets/Images/AttackText.png" );;
            text.wrapS = text.wrapT = THREE.RepeatWrapping; 
            const geometry = new THREE.CylinderGeometry( 50, 50, 250, 19 );
            const material = new THREE.MeshBasicMaterial( {map: text, transparent: true} );
            const cylinder = new THREE.Mesh( geometry, material );
            cylinder.name="AtkCilinder";
            cylinder.position.y = 30;
            const cylinder2 = new THREE.Mesh( geometry, material );
            cylinder2.name="AtkCilinder";
            cylinder2.position.y = 30;
            const cylinder3 = new THREE.Mesh( geometry, material );
            cylinder3.name="AtkCilinder";
            cylinder3.position.y = 30;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(cylinder);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(cylinder2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(cylinder3);
        }
        else
        {
            if(Escenario.GetPlayer().GetStats().Vida < Escenario.GetPlayer().GetMaxLife())
            {
                Escenario.GetPlayer().GetStats().Vida += Curacion;
                if(Escenario.GetPlayer().GetStats().Vida > Escenario.GetPlayer().GetMaxLife())
                {
                    var Sobrante = Escenario.GetPlayer().GetStats().Vida - Escenario.GetPlayer().GetMaxLife();
                    Escenario.GetPlayer().GetStats().Vida -= Sobrante;
                }
            }
            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
        }
        
        
        $(".ItemMenu").remove();
        $(".btnUse").remove();
        for (let i = 0; i < Escenario.GetPlayer().GetBackpack().GetItems().length; i++) {
            $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
        }
        console.log(Escenario.GetPlayer().GetBackpack());
        console.log(Escenario.GetPlayer().GetStats().Vida);
    }

    function DeleteItem(index)
    {
        Escenario.GetPlayer().GetBackpack().UseItem(index);
        $(".ItemMenu").remove();
        $(".btnUse").remove();
        for (let i = 0; i < Escenario.GetPlayer().GetBackpack().GetItems().length; i++) {
            $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
        }
    }

    AccionesMenu.useItem = UseItem;
    AccionesMenu.DeleteItem = DeleteItem;

    $(document).ready
    (
	    function($){$("#GuardarS_Menu").click(function(){
            var Items = [];
            for (let i = 0; i < Escenario.GetPlayer().GetBackpack().GetItems().length; i++) {
                Items.push(Escenario.GetPlayer().GetBackpack().GetItems()[i].getItem());
            }
            SaveItems(Items);
            if(ActualScene == 1)
            {
                var SavePlayer = {level: Escenario.GetPlayer().GetLevel(), ActualLife: Escenario.GetPlayer().GetStats().Vida, 
                    exp: Escenario.GetPlayer().GetExp(), coorX:Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x,
                    coorY:Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.y,
                    coorZ:Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z, scene: ActualScene,
                    boss1: Escenario.GetPlayer().GetBoss().Boss1, boss2: Escenario.GetPlayer().GetBoss().Boss2,
                    boss3: Escenario.GetPlayer().GetBoss().Boss3};
                UpdatePlayer(SavePlayer);
            }
            else if (ActualScene == 2)
            {
                var SavePlayer = {level: Escenario.GetPlayer().GetLevel(), ActualLife: Escenario.GetPlayer().GetStats().Vida, 
                    exp: Escenario.GetPlayer().GetExp(), coorX:Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x,
                    coorY:Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.y,
                    coorZ:Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z, scene: ActualScene,
                    boss1: Escenario.GetPlayer().GetBoss().Boss1, boss2: Escenario.GetPlayer().GetBoss().Boss2,
                    boss3: Escenario.GetPlayer().GetBoss().Boss3};
                UpdatePlayer(SavePlayer);
            }
            else if (ActualScene == 3)
            {
                var SavePlayer = {level: Escenario.GetPlayer().GetLevel(), ActualLife: Escenario.GetPlayer().GetStats().Vida, 
                    exp: Escenario.GetPlayer().GetExp(), coorX:Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x,
                    coorY:Escenario.GetNieveScene().getObjectByName("PlayerModel").position.y,
                    coorZ:Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z, scene: ActualScene,
                    boss1: Escenario.GetPlayer().GetBoss().Boss1, boss2: Escenario.GetPlayer().GetBoss().Boss2,
                    boss3: Escenario.GetPlayer().GetBoss().Boss3};
                UpdatePlayer(SavePlayer);
            }
            
        })}
    );

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            Camara.GetCamera().aspect = canvas.clientWidth / canvas.clientHeight;
            Camara.GetCamera().updateProjectionMatrix();
        }
        const delta = clock.getDelta();

       /* if (keys["A"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateX(550 * (delta));
                Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
            }
		}else if (keys["D"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateX(-550 * (delta));
                Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
            }
		}*/

        ui.DesbrillarReaction();

		if (keys["W"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                window.DialogMagic.close();
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
                    }
                }
                else if(ActualScene == 2)
                {
                    
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().GetModel().Pantano.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().GetModel().Pantano.playAnimation(1,1); 
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(1,1);
                    
                }
                movPas = 550;
            }
		}else if (keys["S"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                window.DialogMagic.close();
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
                    }
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().GetModel().Pantano.playAnimation(1,1);
                    }
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(1,1);
                }
                movPas = -550;
            }
		}
        else if(keys["E"]){
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false && Actionkeys.Nado == false)
            {
                Actionkeys.Attack = true;
                window.DialogMagic.close();
            }
        }
        else if(keys[" "]){
            if(Actionkeys.Dodge == false && Actionkeys.Die == false && Actionkeys.Nado == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                Actionkeys.Jump = true;
                window.DialogMagic.close();
            }
        }
        else if ((keys["W"] == false || keys["A"] == false || keys["S"] == false || keys["D"] == false) &&
                Actionkeys.Attack == false && Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false && Actionkeys.Nado == false)
        {
            if(ActualScene == 1)
            {
                if(Escenario.GetPlayer().GetModel().Pradera.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().GetModel().Pradera.playAnimation(0,1);   
                }
            }
            else if (ActualScene == 2)
            {
                if(Escenario.GetPlayer().GetModel().Pantano.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(0,1);   
                }
            }
            else if(ActualScene == 3)
            {
                if(Escenario.GetPlayer().GetModel().Nieve.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(0,1);   
                }
            }
        }

        if (keys["%"] /*<-*/){ 
            window.DialogMagic.close();
            if(ActualScene == 1)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y += 3 * delta;
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").rotation.y += 3 * delta;
            }
            else if (ActualScene == 3)
            {
                Escenario.GetNieveScene().getObjectByName("PlayerModel").rotation.y += 3 * delta;
            }
        } else if (keys["'"] /*->*/){ 
            window.DialogMagic.close();
            if(ActualScene == 1)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y += -3 * delta;
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").rotation.y += -3 * delta;
            }
            else if (ActualScene == 3)
            {
                Escenario.GetNieveScene().getObjectByName("PlayerModel").rotation.y += -3 * delta;
            }
        } else if (keys["&"] /*^*/){ 
            window.DialogMagic.close();
            Camara.GetCamera().rotation.x -= (50 * 3.1416 / 180) * (delta);
        } else if (keys["("] /*V*/){ 
            window.DialogMagic.close();
            Camara.GetCamera().rotation.x += (50 * 3.1416 / 180) * (delta);
        }

        if(keys["Q"]){
            window.DialogMagic.close();
            if(Actionkeys.Jump == false && Actionkeys.Die == false && Actionkeys.Nado == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                
                Actionkeys.Dodge = true;
                Invesible = true;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
                movPas = 550;
            }
        }

        //Dodge
        if(Actionkeys.Dodge == true)
        {
            DodgeContador += delta;
            if(DodgeContador <= DodgeDuracion)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().GetModel().Pradera.playAnimation(4,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(4,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(4,1);
                }
            }else
            {
                Actionkeys.Dodge = false;
                Invesible = false;
                DodgeContador = 0;
            }
        }
        //Attack
        if(Actionkeys.Attack == true)
        {
            AttackContador += delta;
            if(AttackContador <= AttackDuracion)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().GetModel().Pradera.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPraderaScene().add(Particle);
                    ShotsPradera.push(Particle);
                    Disparando = true;
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPantanoScene().add(Particle);
                    ShotsPantano.push(Particle);
                    Disparando = true;
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetNieveScene().add(Particle);
                    ShotsNieve.push(Particle);
                    Disparando = true;
                }
            }else
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
            }
        }
        //Jump
        if(Actionkeys.Jump == true)
        {
            JumpContador += delta;
            if(JumpContador <= JumpDuracion)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().GetModel().Pradera.playAnimation(6,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(6,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(6,1);
                }
            }else
            {
                Actionkeys.Jump = false;
                JumpContador = 0;
            }
        }

        //Colisiones
        if(ModelsLoaded)
        {
            if(ActualScene == 1)
            {

                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Pradera, true);			
                    if (collision.length > 0) {
                        Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.y = collision[0].point.y;
                        if(collision[0].point.y < -50)
                        {
                            //console.log(collision[0].point.y);
                            Actionkeys.Nado = true;
                            Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.y = -39;
                            Escenario.GetPlayer().GetModel().Pradera.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys.Nado = false;
                        }
                    }
                }
            
                if(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x < -8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                    //Escenario.GetPraderaScene().getObjectByName("PlayerModel").position = pos1;
                }

                //Collision Pradera objetos estaticos
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaObjects(), true);				
                    if (collision.length > 0 && (collision[0].distance < 125 /*|| collision[1].distance < 125 || collision[2].distance < 125 || collision[3].distance < 125*/)) {
                        console.log("colisionando");
                        console.log(collision);
                        if(collision[0].object.name == "portalPantano")
                        {
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPantanoScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(2);
                                }
                                ActualScene = 2;
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                            }
                        }else
                        {
                            Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                            //Escenario.GetPraderaScene().getObjectByName("PlayerModel").position = pos1;
                        }
                    }
                }
                //Collission Pradera Items
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaItems().model, true);		
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                            Escenario.GetPraderaItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPraderaItems().model[collision[0].object.name-1].visible = false;
                            console.log(Escenario.GetPlayer().GetBackpack());
                        }
                    }
                }
                //Collision PraderaEnemies
                for(var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 800)
                    {            
                        var j = parseInt(collision[0].object.name);
                        if(j < 23)
                        {
                            if(Escenario.GetPraderaEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPraderaEnemies().Collider[j].parent.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x, Escenario.GetPraderaEnemies().Collider[j].parent.position.y, Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z);
                                Escenario.GetPraderaEnemies().Collider[j].parent.translateZ(450 * delta);
                                if(j < 8)
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetPraderaEnemies().Collider[j].parent.position, 0/*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.y*/, /*5 * 3.1416 / 180*/0, 'Assets/Images/shot_enemy.png', false);
                                    Particle.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position);
                                    Escenario.GetPraderaScene().add(Particle);
                                    ShotsEnemiePradera.push(Particle);
                                    EnemyDisparando = true;
                                }else
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetPraderaEnemies().Collider[j].parent.position, /*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.y*/0, 0/*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.x25 * 3.1416 / 180*/, 'Assets/Images/shot_enemy.png', false);
                                   // Particle.rotation.x = 25 * 3.1416 / 180;
                                    Particle.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position);
                                    Escenario.GetPraderaScene().add(Particle);
                                    ShotsEnemiePradera.push(Particle);
                                    EnemyDisparando = true;
                                }
                            }
                        }   
                        else if (j == 23)
                        {
                            Escenario.GetPraderaEnemies().Collider[23].parent.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x, Escenario.GetPraderaEnemies().Collider[23].parent.position.y, Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z);
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Hola viajero bienvenido! Soy un Magic, te daré un consejo, los hongos no pueden ver detrás de ellos, pero las mariposas y hadas sí pueden y son agresivas. Cuidado!";
                                window.DialogMagic.showModal();
                            }
                        }  
                        //console.log(j);
                        //console.log(Escenario.GetPraderaEnemies().Collider[j].name);
                    }
                    
                }


                //Colissiones Disparos
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                        rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                        var collision = rayCaster.intersectObjects(ShotsEnemiePradera, false);				
                        if (collision.length > 0 && (collision[0].distance < 1200)) {
                            if(!Invesible)
                            {
                                var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().GetStats().Defensa;
                                Escenario.GetPlayer().GetStats().Vida -= Daño;
                                ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
                                Invesible = true;
                            }
                        }
                }

                //Collission Disparos Enemies
               for (let j = 0; j < Escenario.GetPraderaEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPraderaEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaEnemies().Collider[j].parent.position, Escenario.GetPraderaEnemies().Collider[j].parent.rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsPradera, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        var Daño = Escenario.GetPlayer().GetStats().Ataque - Escenario.GetPraderaEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPraderaEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        var Porcentaje = (Escenario.GetPraderaEnemies().Object[j].GetStats().Vida / Escenario.GetPraderaEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPraderaEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        if(Escenario.GetPraderaEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPraderaScene().remove(Escenario.GetPraderaEnemies().Collider[j].parent);
                            if (Escenario.GetPraderaEnemies().Object[j].GetActive()) {
                                Escenario.GetPlayer().SetExp(Escenario.GetPlayer().GetExp() + 500);
                                if(Escenario.GetPlayer().GetExp() >= Escenario.GetPlayer().GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().SetLevel(newlevel);
                                    Escenario.GetPlayer().SetExp(0);
                                }
                                ui.SetExpActual(Escenario.GetPlayer().GetExp(), Escenario.GetPlayer().GetMaxExp());
                            }
                            Escenario.GetPraderaEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }


            }
            else if(ActualScene == 2)
            {

                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Pantano, true);			
                    if (collision.length > 0) {
                        Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.y = collision[0].point.y;
                        if(collision[0].point.y < -205)
                        {
                            //console.log(collision[0].point.y);
                            Actionkeys.Nado = true;
                            Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.y = -205;
                            Escenario.GetPlayer().GetModel().Pantano.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys.Nado = false;
                        }
                    }
                }

                if(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x > 8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x < -8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z > 8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                }

                //Collision Pantano objetos estaticos
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPradera")
                        {
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPraderaScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(1);
                                }
                                ActualScene = 1;
                                Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                            }
                        }
                        else if(collision[0].object.name == "portalNieve")
                        {
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetNieveScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(3);
                                }
                                ActualScene = 3;
                                Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                        console.log("colisionando");
                    }
                }

                //Collission Pantano Items
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                            Escenario.GetPantanoItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPantanoItems().model[collision[0].object.name-1].visible = false;
                            console.log(Escenario.GetPlayer().GetBackpack());
                        }
                    }
                }

                //Collission Pantano Enemies
                for(var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 800)
                    {            
                        var j = parseInt(collision[0].object.name);
                        if(j < 21)
                        {
                            if(Escenario.GetPantanoEnemies().Object[j].GetActive())
                            {
                                if(j < 16)
                                {
                                    Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z);
                                    Escenario.GetPantanoEnemies().Collider[j].parent.translateZ(450 * delta);
                                    if(j < 7)
                                    {
                                        var Particle = Disparo.Disparar(Escenario.GetPantanoEnemies().Collider[j].parent.position, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.x*/0, 'Assets/Images/shot_enemy.png', false);
                                        Particle.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position);
                                        Escenario.GetPantanoScene().add(Particle);
                                        ShotsEnemiePantano.push(Particle);
                                        EnemyDisparando = true;
                                    }
                                    else
                                    {
                                        var Particle = Disparo.Disparar(Escenario.GetPantanoEnemies().Collider[j].parent.position, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.y*/0, 0/*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.x30 * 3.1416 / 180*/, 'Assets/Images/shot_enemy.png', false);
                                        //Particle.rotation.x = 30 * 3.1416 / 180;
                                        Particle.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position);
                                        Escenario.GetPantanoScene().add(Particle);
                                        ShotsEnemiePantano.push(Particle);
                                        EnemyDisparando = true;
                                    }
                                }
                                else
                                {
                                    Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z);
                                    Escenario.GetPantanoEnemies().Collider[j].parent.translateZ(450 * delta);
                                }
                            }
                        }   
                        else
                        {
                            Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z);
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Los guardianes son demasiado agresivos y persistentes, intenta golpearlos de lejos, lo mismo para los drones, ten cuidado si pasas debajo de ellos pues podrán verte con facilidad.";
                                window.DialogMagic.showModal();
                            }
                        }  
                    }
                }
                //Collision Disparos
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemiePantano, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().GetStats().Defensa;
                            Escenario.GetPlayer().GetStats().Vida -= Daño;
                            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
                            Invesible = true;
                        }
                    }
                }
                //Collission Disparos Enemies
               for (let j = 0; j < Escenario.GetPantanoEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPantanoEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoEnemies().Collider[j].parent.position, Escenario.GetPantanoEnemies().Collider[j].parent.rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsPantano, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        var Daño = Escenario.GetPlayer().GetStats().Ataque - Escenario.GetPantanoEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPantanoEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        var Porcentaje = (Escenario.GetPantanoEnemies().Object[j].GetStats().Vida / Escenario.GetPantanoEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPantanoEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        if(Escenario.GetPantanoEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPantanoScene().remove(Escenario.GetPantanoEnemies().Collider[j].parent);
                            if(Escenario.GetPantanoEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().SetExp(Escenario.GetPlayer().GetExp() + 500);
                                if(Escenario.GetPlayer().GetExp() >= Escenario.GetPlayer().GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().SetLevel(newlevel);
                                    Escenario.GetPlayer().SetExp(0);
                                }
                                ui.SetExpActual(Escenario.GetPlayer().GetExp(), Escenario.GetPlayer().GetMaxExp());
                            }
                            
                            Escenario.GetPantanoEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }
            }
            else if(ActualScene == 3)
            {

                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Nieve, true);			
                    if (collision.length > 0) {
                        Escenario.GetNieveScene().getObjectByName("PlayerModel").position.y = collision[0].point.y
                    }
                }

                if(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x < -8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                }

                //Collision Nieve objetos estaticos
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPantano")
                        {
                            ui.BrillarReaction();
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPantanoScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(2);
                                }
                                ActualScene = 2;
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                        console.log("colisionando");
                    }
                }
                //Collission Nieve Items
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                            Escenario.GetNieveItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetNieveItems().model[collision[0].object.name-1].visible = false;
                            console.log(Escenario.GetPlayer().GetBackpack());
                        }
                    }
                }
                //Collission Nieve Enemies
                for(var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 800)
                    {            
                        var j = parseInt(collision[0].object.name);
                        if(j < 19)
                        {
                            Escenario.GetNieveEnemies().Object[j].GetActive()
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z);
                                Escenario.GetNieveEnemies().Collider[j].parent.translateZ(450 * delta);
                                if(j < 11)
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetNieveEnemies().Collider[j].parent.position, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.x 30 * 3.1416 / 180*/0, 'Assets/Images/shot_enemy.png', false);
                                    //Particle.rotation.x = 30 * 3.1416 / 180;
                                    Particle.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position);
                                    Escenario.GetNieveScene().add(Particle);
                                    ShotsEnemieNieve.push(Particle);
                                    EnemyDisparando = true;
                                }
                                else
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetNieveEnemies().Collider[j].parent.position, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.x*/0, 'Assets/Images/shot_enemy.png', false);
                                    Particle.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position);
                                    Escenario.GetNieveScene().add(Particle);
                                    ShotsEnemieNieve.push(Particle);
                                    EnemyDisparando = true;
                                }
                            }
                        }   
                        else
                        {
                            
                            ui.BrillarReaction();
                            if(j == 19)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z);
                                if(keys["R"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Los fantasmas dan miedo, parece que no atacan pero realmente pueden ver donde no te lo esperas. Atacas a uno y tienes a varios siguiendote.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 20)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z);
                                if(keys["R"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Los fantasmas pueden verte desde lugares inesperados y también son dificiles de atacar, te recomiendo no acercarte a ellos hasta conocerlos bien.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 21)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z);
                                if(keys["R"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Algunos enemigos son dificiles de atacar, parecen tener escondida su debilidad haciendo complicado atacarlos.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 22)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z);
                                if(keys["R"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Las pociones de ataquen suben 300 puntos de ataque y las pociones de defensa suben 100 puntos de defensa, las pociones básicas te curan 100 puntos de salud y las pociones altas te curan 300.";
                                    window.DialogMagic.showModal();
                                }
                            }
                        }  
                    }
                }
                //Collision disparos
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemieNieve, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().GetStats().Defensa;
                            Escenario.GetPlayer().GetStats().Vida -= Daño;
                            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
                            Invesible = true;
                        }
                    }
                }
                 //Collission Disparos Enemies
               for (let j = 0; j < Escenario.GetNieveEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetNieveEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveEnemies().Collider[j].parent.position, Escenario.GetNieveEnemies().Collider[j].parent.rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsNieve, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        var Daño = Escenario.GetPlayer().GetStats().Ataque - Escenario.GetNieveEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetNieveEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        var Porcentaje = (Escenario.GetNieveEnemies().Object[j].GetStats().Vida / Escenario.GetNieveEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetNieveEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        if(Escenario.GetNieveEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetNieveScene().remove(Escenario.GetNieveEnemies().Collider[j].parent);
                            if(Escenario.GetNieveEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().SetExp(Escenario.GetPlayer().GetExp() + 500);
                                if(Escenario.GetPlayer().GetExp() >= Escenario.GetPlayer().GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().SetLevel(newlevel);
                                    Escenario.GetPlayer().SetExp(0);
                                }
                                ui.SetExpActual(Escenario.GetPlayer().GetExp(), Escenario.GetPlayer().GetMaxExp());
                            }
                            Escenario.GetNieveEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }
            }
        }

        //Shots
        for (let i = 0; i < ShotsPradera.length; i++) {
            ShotsPradera[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsPantano.length; i++) {
            ShotsPantano[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsNieve.length; i++) {
            ShotsNieve[i].translateZ(700 * delta);
        }

        //ShotsEnemies
        for (let i = 0; i < ShotsEnemiePradera.length; i++) {
            ShotsEnemiePradera[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsEnemiePantano.length; i++) {
            ShotsEnemiePantano[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsEnemieNieve.length; i++) {
            ShotsEnemieNieve[i].translateZ(700 * delta);
        }

        if(Disparando)
        {
            DisparandoContador += delta;
            if(DisparandoContador > 3)
            {
                for (let i = 0; i < ShotsPradera.length; i++) {
                    Escenario.GetPraderaScene().remove(ShotsPradera[i]);
                }
                ShotsPradera.splice(0, ShotsPradera.length);
                for (let i = 0; i < ShotsPantano.length; i++) {
                    Escenario.GetPantanoScene().remove(ShotsPantano[i]);
                }
                ShotsPantano.splice(0, ShotsPantano.length);
                for (let i = 0; i < ShotsNieve.length; i++) {
                    Escenario.GetNieveScene().remove(ShotsNieve[i]);
                }
                ShotsNieve.splice(0, ShotsNieve.length);
                Disparando = false;
                DisparandoContador = 0;
            }
        }

        if(EnemyDisparando)
        {
            DisparandoEnemyContador += delta;
            if(DisparandoEnemyContador > 3)
            {
                for (let i = 0; i < ShotsEnemiePradera.length; i++) {
                    Escenario.GetPraderaScene().remove(ShotsEnemiePradera[i]);
                }
                ShotsEnemiePradera.splice(0, ShotsEnemiePradera.length);

                for (let i = 0; i < ShotsEnemiePantano.length; i++) {
                    Escenario.GetPantanoScene().remove(ShotsEnemiePantano[i]);
                }
                ShotsEnemiePantano.splice(0, ShotsEnemiePantano.length);

                for (let i = 0; i < ShotsEnemieNieve.length; i++) {
                    Escenario.GetNieveScene().remove(ShotsEnemieNieve[i]);
                }
                ShotsEnemieNieve.splice(0, ShotsEnemieNieve.length);

                EnemyDisparando = false;
                DisparandoEnemyContador = 0;
            }
        }

        if(CambiandoDeMapa)
        {
            CambiandoDeMapaCont += delta;
            if(CambiandoDeMapaCont > 1)
            {
                CambiandoDeMapa = false;
                CambiandoDeMapaCont = 0;
            }
        }

        if(AtaqueExtraPlayer)
        {
            AtaqueExtraCont += delta;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            if(AtaqueExtraCont > 10)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                Escenario.GetPlayer().GetStats().Ataque = 800 + (800 * (Escenario.GetPlayer().GetLevel() * 0.1));
                console.log(Escenario.GetPlayer().GetStats().Ataque);
                AtaqueExtraPlayer = false;
                AtaqueExtraCont = 0;
            }
        }

        if(DefensaExtraPlayer)
        {
            DefensaExtraCont += delta;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            if(DefensaExtraCont > 10)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));
                Escenario.GetPlayer().GetStats().Defensa = 500 + (500 * (Escenario.GetPlayer().GetLevel() * 0.1));
                console.log(Escenario.GetPlayer().GetStats().Defensa);
                DefensaExtraPlayer = false;
                DefensaExtraCont = 0;
            }
        }

        if(Invesible)
        {
            InvensibleContador += delta;
            if(InvensibleContador > 0.2)
            {
                Invesible = false;
                InvensibleContador = 0;
            }
        }
    
        //PROVISIONAL PARA PROBAR DAÑO
       /* if (keys["Z"])
        {
            Escenario.GetPlayer().GetStats().Vida -= 300;
            console.log(Escenario.GetPlayer().GetStats().Vida);
            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
        } */

        //GUI
        if(keys["P"])
        {
            if(!Pause)
            {
                $(".ItemMenu").remove();
                $(".btnUse").remove();
                for (let i = 0; i < Escenario.GetPlayer().GetBackpack().GetItems().length; i++) {
                    $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
                }
                document.getElementById("PauseNivel").innerHTML = "Nivel: "+Escenario.GetPlayer().GetLevel();
                document.getElementById("PauseExp").innerHTML = "Experiencia: " + Escenario.GetPlayer().GetExp();
                if(ActualScene == 1)
                {
                    document.getElementById("PauseMapa").innerHTML = "Mapa: Pradera";
                }
                else if(ActualScene == 2)
                {
                    document.getElementById("PauseMapa").innerHTML = "Mapa: Pantano";
                }
                else 
                {
                    document.getElementById("PauseMapa").innerHTML = "Mapa: Nieve";
                }
                
                window.ModalMenu.showModal();
                Pause = true;
            }
        }

        /*De prueba cambio scene*/
        if(keys["J"])
        {
            Scene = Escenario.GetPraderaScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(1);
            }
            ActualScene = 1;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["K"])
        {
            Scene = Escenario.GetPantanoScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(2);
            }
            ActualScene = 2;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["L"])
        {
            Scene = Escenario.GetNieveScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(3);
            }
            ActualScene = 3;
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }

        if (Escenario.GetPlayer().GetModel().Pradera.getMixer()) Escenario.GetPlayer().GetModel().Pradera.getMixer().update(delta);
        if (Escenario.GetPlayer().GetModel().Pantano.getMixer()) Escenario.GetPlayer().GetModel().Pantano.getMixer().update(delta);
        if (Escenario.GetPlayer().GetModel().Nieve.getMixer()) Escenario.GetPlayer().GetModel().Nieve.getMixer().update(delta);

        for (let i = 0; i < Escenario.GetPraderaEnemies().Model.length; i++) {
            if (Escenario.GetPraderaEnemies().Model[i].GetMixer()){Escenario.GetPraderaEnemies().Model[i].GetMixer().update(delta);}
        }
        for (let i = 0; i < Escenario.GetPantanoEnemies().Model.length; i++) {
            if (Escenario.GetPantanoEnemies().Model[i].GetMixer()){Escenario.GetPantanoEnemies().Model[i].GetMixer().update(delta);}
        }
        for (let i = 0; i < Escenario.GetNieveEnemies().Model.length; i++) {
            if (Escenario.GetNieveEnemies().Model[i].GetMixer()){Escenario.GetNieveEnemies().Model[i].GetMixer().update(delta);}
        }

        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        stats.update();
        Escenario.RainUpdate();
        
        const time = Date.now() * 0.00005;
        Escenario.SnowUpdate(time);
        //renderer.render(Escenario.GetTestScene(), Camara.GetCamera());
        renderer.render(Scene, Camara.GetCamera());
        leavesMateriala[0].uniforms.time.value += 1.0 / 60.0;
        leavesMateriala[0].uniformsNeedUpdate = true;
        leavesMateriala[1].uniforms.time.value += 1.0 / 60.0;
        leavesMateriala[1].uniformsNeedUpdate = true;
        leavesMateriala[2].uniforms.time.value += 1.0 / 60.0;
        leavesMateriala[2].uniformsNeedUpdate = true;
        leavesMateriala[3].uniforms.time.value += 1.0 / 60.0;
        leavesMateriala[3].uniformsNeedUpdate = true;

        RotationSky < 360 ? RotationSky += 0.00045 : RotationSky = 0;
        Escenario.GetPraderaScene().getObjectByName("SkyPradera").rotation.y = RotationSky; 
        Escenario.GetPantanoScene().getObjectByName("SkyPantano").rotation.y = RotationSky;
        Escenario.GetNieveScene().getObjectByName("NieveSky").rotation.y = RotationSky;

        if (intensityL) {
			intensityAmbientLight += 0.0005;
		}
		else {
			intensityAmbientLight -= 0.0005;
		}

		if (intensityAmbientLight > 1.0) {
			intensityAmbientLight = 1.0;
			intensityL = false;
		}
		else if (intensityAmbientLight < 0) {
			intensityAmbientLight = 0;
			intensityL = true;
		}

        //Change Ambient Light
        let finalColor = new THREE.Color().lerpColors(ColorDia, ColorTarde, 1-intensityAmbientLight);
        finalColor = new THREE.Color().lerpColors(finalColor, ColorNoche, 1-intensityAmbientLight);
        Escenario.SetTimeT(1-intensityAmbientLight);

        Escenario.LodoUpdate(1-intensityAmbientLight);

        water.material.uniforms[ 'sunColor' ].value = finalColor;

        //Escenario.GetPraderaScene().getObjectByName("LuzPradera").intensity = intensityAmbientLight + 0.2;
        Escenario.GetPraderaScene().getObjectByName("LuzPradera").color = finalColor;
        Escenario.GetPraderaScene().getObjectByName("TerrenoPradera").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetPraderaScene().getObjectByName("TerrenoPradera").material.needsUpdate = true;
        Escenario.GetPraderaScene().getObjectByName("MuroPradera").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetPraderaScene().getObjectByName("MuroPradera").material.needsUpdate = true;
        Escenario.GetPraderaScene().getObjectByName("SkyPradera").material.uniforms.mixValue.value= 1-intensityAmbientLight;
        Escenario.GetPraderaScene().getObjectByName("SkyPradera").material.needsUpdate = true;
        //Escenario.GetPantanoScene().getObjectByName("LuzPantano").intensity = intensityAmbientLight + 0.2;
        Escenario.GetPantanoScene().getObjectByName("LuzPantano").color = finalColor;
        Escenario.GetPantanoScene().getObjectByName("TerrenoPantano").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetPantanoScene().getObjectByName("TerrenoPantano").material.needsUpdate = true;
        Escenario.GetPantanoScene().getObjectByName("MuroPantano").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetPantanoScene().getObjectByName("MuroPantano").material.needsUpdate = true;
        Escenario.GetPantanoScene().getObjectByName("SkyPantano").material.uniforms.mixValue.value= 1-intensityAmbientLight;
        Escenario.GetPantanoScene().getObjectByName("SkyPantano").material.needsUpdate = true;
        //Escenario.GetNieveScene().getObjectByName("LuzNieve").intensity = intensityAmbientLight + 0.2;
        Escenario.GetNieveScene().getObjectByName("LuzNieve").color = finalColor;
        Escenario.GetNieveScene().getObjectByName("TerrenoNieve").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetNieveScene().getObjectByName("TerrenoNieve").material.needsUpdate = true;
        Escenario.GetNieveScene().getObjectByName("MuroNieve").material.uniforms.time.value = 1-intensityAmbientLight;
        Escenario.GetNieveScene().getObjectByName("MuroNieve").material.needsUpdate = true;
        Escenario.GetNieveScene().getObjectByName("NieveSky").material.uniforms.mixValue.value= 1-intensityAmbientLight;
        Escenario.GetNieveScene().getObjectByName("NieveSky").material.needsUpdate = true;
        Escenario.GetPraderaScene().getObjectByName("Sun").intensity = intensityAmbientLight + 0.2;

        tiempoPortales++;
        Escenario.GetPraderaScene().getObjectByName("portalPantano").material.map.offset.y = tiempoPortales * 0.0025;
        Escenario.GetPantanoScene().getObjectByName("portalPradera").material.map.offset.y = tiempoPortales * 0.0025;
        Escenario.GetPantanoScene().getObjectByName("portalNieve").material.map.offset.y = tiempoPortales * 0.0025;
        Escenario.GetNieveScene().getObjectByName("portalPantano").material.map.offset.y = tiempoPortales * 0.0025;

        if(intensityAmbientLight < 0.65)
        {
            Escenario.GetPraderaScene().getObjectByName("Sun").getObjectByName("SunTexture").material.visible = false;
        }
        else
        {
            Escenario.GetPraderaScene().getObjectByName("Sun").getObjectByName("SunTexture").material.visible = true;
        }
        if(intensityAmbientLight < 0.4)
        {
            if(Dia)
            {
                audioCont.PlayNoche();
            }
            Dia = false;
        }
        else
        {
            if(!Dia)
            {
                audioCont.PlaySceneSound(ActualScene);
            }
            Dia = true;
        }

        if (Escenario.GetPlayer().GetStats().Vida <= 0) {
            audioCont.StopAllSound();
            AudioM.GetSound().play();
            Actionkeys.Die = true;
            $("#bg").animate({ opacity: 1 }, 1000);
            Die = true;
            if(ActualScene == 1)
            {
                Escenario.GetPlayer().GetModel().Pradera.playAnimation(3,1);
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPlayer().GetModel().Pantano.playAnimation(3,1);
            }
            else if (ActualScene == 3)
            {
                Escenario.GetPlayer().GetModel().Nieve.playAnimation(3,1);
            }
        }

        if(Die)
        {
            DieDuracion += delta;
           
            if(DieDuracion > 2)
            {
                Die = false;
                DieDuracion = 0;
                //Funcion para perder 1 nivel
                location.reload();
            }
        }
        
        if(Pause) return;
        requestAnimationFrame(render);
    }
    AccionesMenu.render = render;
    
    requestAnimationFrame(render);
}

main();