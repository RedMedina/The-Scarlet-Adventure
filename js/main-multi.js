import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Scenee} from '/PWGW/js/scene-multi.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GUI} from '/PWGW/js/gui.js';
import {AudioController} from '/PWGW/js/audioController.js';
import {Audioo} from '/PWGW/js/audio.js';
import {Shots} from '/PWGW/js/disparo.js';

function main()
{
    var visibleSize = { width: window.innerWidth, height: window.innerHeight};
    const renderer = new THREE.WebGLRenderer({/*canvas,*/ antialias: true, alpha: true});
    renderer.setPixelRatio((visibleSize.width/2) / visibleSize.height);
	renderer.setSize((visibleSize.width/2), visibleSize.height);
    const renderer2 = new THREE.WebGLRenderer({/*canvas2,*/ antialias: true, alpha: true});
    renderer2.setPixelRatio((visibleSize.width/2) / visibleSize.height);
    renderer2.setSize((visibleSize.width/2), visibleSize.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer2.shadowMap.enabled = true;
    renderer2.shadowMap.type = THREE.PCFSoftShadowMap;

    var Escenario = new Scenee();
    var Scene;
    var Camara = new Cameraa(45, 2, 0.1, 1000000);
    Camara.GetCamera().position.set(0, 140, -370);

    var Camara2 = new Cameraa(45, 2, 0.1, 1000000);
    Camara2.GetCamera().position.set(0, 140, -370);

    const clock = new THREE.Clock();
    let RotationSky = 0;
    let intensityAmbientLight = 1;
    let intensityL = true;
    var Dia = true;
    
    var keys = {};
    var Actionkeys = {Attack: false, Dodge: false, Jump: false,  Die: false, Nado: false};
    var Actionkeys2 = {Attack: false, Dodge: false, Jump: false,  Die: false, Nado: false};
    var mousekeys = [];
    var ModelsLoaded = false;

    document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);

    const loadingManager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        
	} );

    loadingManager.onLoad = function()
    {
        document.querySelector('#loading-screen').remove();
        //Initialize Player

        Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(0,1);
        Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(0,1);
        Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(0,1);
        Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(0,1);
        Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(0,1);
        Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(0,1);

        if(PlayerDatos.scene == 1)
        {
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
        }
        else if (PlayerDatos.scene == 2)
        {
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
        }
        else if (PlayerDatos.scene == 3)
        {
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
            Escenario.GetNieveScene().getObjectByName("PlayerModel").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.set(PlayerDatos.coorX, PlayerDatos.coorY, PlayerDatos.coorZ);
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

    //Disparos
    var Disparo = new Shots();
    //Disparos Player1
    var ShotsPradera = [];
    var ShotsPantano = [];
    var ShotsNieve = [];
    //Disparos Player2
    var ShotsPradera2 = [];
    var ShotsPantano2 = [];
    var ShotsNieve2 = [];

    var ShotsEnemiePradera = [];
    var ShotsEnemiePantano = [];
    var ShotsEnemieNieve = [];

    //Disparos
    //Disparos Player1
    var Disparando = false;
    var DisparandoContador = 0;
    //Disparos Player2
    var Disparando2 = false;
    var DisparandoContador2 = 0;
    //Disparos Enemy
    var EnemyDisparando = false;
    var DisparandoEnemyContador = 0;

    //Player 1
    var DodgeDuracion = 1.5;
    var DodgeContador = 0;
    //Player 2
    var DodgeDuracion2 = 1.5;
    var DodgeContador2 = 0;

    //Player 1
    var AttackDuracion = 2.2;
    var AttackContador = 0;
    //Player 2
    var AttackDuracion2 = 2.2;
    var AttackContador2 = 0;

    //Player 1
    var JumpDuracion = 2.5;
    var JumpContador = 0;
    //Player 2
    var JumpDuracion2 = 2.5;
    var JumpContador2 = 0;

    var ActualScene = PlayerDatos.scene;
    
    var movPas = 0;
    var rayCaster = new THREE.Raycaster();

    //Invensible Player1
    var Invesible = false;
    var InvensibleContador = 0;
    //Invensible Player2
    var Invesible2 = false;
    var InvensibleContador2 = 0;

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
				sunDirection: new THREE.Vector3(),
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
    stats.domElement.style.cssText = 'position:absolute;top:120px;';
    document.body.appendChild( stats.domElement );

    /*const controls = new OrbitControls(Camara2.GetCamera(), renderer2.domElement);
    controls.target.set(0, 5, 0);
    controls.update();*/

    var leavesMateriala = [];
    CreatePasto(6000, -2400, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000, 4300, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000,  300, -6600, 30, 25, 30, 170, 120);
    CreatePasto(6000, -7300, -3000, 30, 25, 30, 110, 120);

    const ui = new GUI();
    ui.CreateMultiplayerGUI(Escenario.GetPlayer().Player1.GetStats().Vida, Escenario.GetPlayer().Player1.GetMaxLife(), Escenario.GetPlayer().Player1.GetExp(), Escenario.GetPlayer().Player1.GetMaxExp());

    $("#scene-section-1").append(renderer.domElement);
    $("#scene-section-2").append(renderer2.domElement);

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
        var NameItem = Escenario.GetPlayer().Player1.GetBackpack().GetItems()[index].getItem().name;
        var Curacion = Escenario.GetPlayer().Player1.GetBackpack().UseItem(index);
       // Escenario.GetPlayer().Player2.GetBackpack().UseItem(index);
        
        if(NameItem == "Pocion Defensa")
        {
            Escenario.GetPlayer().Player1.GetStats().Defensa += Curacion;
            Escenario.GetPlayer().Player2.GetStats().Defensa += Curacion;

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
            const cylinderp2 = new THREE.Mesh( geometry, material );
            cylinderp2.name = "DefCilinder";
            cylinderp2.position.y = 30;
            const cylinder2p2 = new THREE.Mesh( geometry, material );
            cylinder2p2.name = "DefCilinder";
            cylinder2p2.position.y = 30;
            const cylinder3p2 = new THREE.Mesh( geometry, material );
            cylinder3p2.name = "DefCilinder";
            cylinder3p2.position.y = 30;

            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(cylinder);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(cylinder2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(cylinder3);

            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(cylinderp2);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(cylinder2p2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").add(cylinder3p2);
        }
        else if(NameItem == "Pocion Ataque")
        {
            Escenario.GetPlayer().Player1.GetStats().Ataque += Curacion;
            Escenario.GetPlayer().Player2.GetStats().Ataque += Curacion;

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
            const cylinderp2 = new THREE.Mesh( geometry, material );
            cylinderp2.name="AtkCilinder";
            cylinderp2.position.y = 30;
            const cylinder2p2 = new THREE.Mesh( geometry, material );
            cylinder2p2.name="AtkCilinder";
            cylinder2p2.position.y = 30;
            const cylinder3p2 = new THREE.Mesh( geometry, material );
            cylinder3p2.name="AtkCilinder";
            cylinder3p2.position.y = 30;

            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(cylinder);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(cylinder2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(cylinder3);

            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(cylinderp2);
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(cylinder2p2);
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").add(cylinder3p2);
        }
        else
        {
            if(Escenario.GetPlayer().Player1.GetStats().Vida < Escenario.GetPlayer().Player1.GetMaxLife())
            {
                Escenario.GetPlayer().Player1.GetStats().Vida += Curacion;
                if(Escenario.GetPlayer().Player1.GetStats().Vida > Escenario.GetPlayer().Player1.GetMaxLife())
                {
                    var Sobrante = Escenario.GetPlayer().Player1.GetStats().Vida - Escenario.GetPlayer().Player1.GetMaxLife();
                    Escenario.GetPlayer().GetStats().Player1.Vida -= Sobrante;
                }
            }
            if(Escenario.GetPlayer().Player2.GetStats().Vida < Escenario.GetPlayer().Player2.GetMaxLife())
            {
                Escenario.GetPlayer().Player2.GetStats().Vida += Curacion;
                if(Escenario.GetPlayer().Player2.GetStats().Vida > Escenario.GetPlayer().Player2.GetMaxLife())
                {
                    var Sobrante = Escenario.GetPlayer().Player2.GetStats().Vida - Escenario.GetPlayer().Player2.GetMaxLife();
                    Escenario.GetPlayer().GetStats().Player2.Vida -= Sobrante;
                }
            }
            ui.SetVidaActualP1(Escenario.GetPlayer().Player1.GetStats().Vida, Escenario.GetPlayer().Player1.GetMaxLife());
            ui.SetVidaActualP2(Escenario.GetPlayer().Player2.GetStats().Vida, Escenario.GetPlayer().Player2.GetMaxLife());
        }
        
        
        $(".ItemMenu").remove();
        $(".btnUse").remove();
        for (let i = 0; i < Escenario.GetPlayer().Player1.GetBackpack().GetItems().length; i++) {
            $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().Player1.GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
        }
        //console.log(Escenario.GetPlayer().GetBackpack());
        //console.log(Escenario.GetPlayer().GetStats().Vida);
    }

    function DeleteItem(index)
    {
        Escenario.GetPlayer().Player1.GetBackpack().UseItem(index);
        //Escenario.GetPlayer().Player2.GetBackpack().UseItem(index);
        $(".ItemMenu").remove();
        $(".btnUse").remove();
        for (let i = 0; i < Escenario.GetPlayer().Player1.GetBackpack().GetItems().length; i++) {
            $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().Player1.GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
        }
    }

    AccionesMenu.useItem = UseItem;
    AccionesMenu.DeleteItem = DeleteItem;

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
        if (resizeRendererToDisplaySize(renderer2)) {
            const canvas2 = renderer2.domElement;
            Camara2.GetCamera().aspect = canvas2.clientWidth / canvas2.clientHeight;
            Camara2.GetCamera().updateProjectionMatrix();
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

        //ui.DesbrillarReaction();

		if (keys["W"]) {
            window.DialogMagic.close();
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = 550;
            }
		}else if (keys["S"]) {
            window.DialogMagic.close();
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    if(Actionkeys.Nado)
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = -550;
            }
		}
        else if(keys["E"]){
            window.DialogMagic.close();
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false && Actionkeys.Nado == false)
            {
                Actionkeys.Attack = true;
            }
        }
        else if(keys[" "]){
            window.DialogMagic.close();
            if(Actionkeys.Dodge == false && Actionkeys.Die == false && Actionkeys.Nado == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                Actionkeys.Jump = true;
            }
        }
        else if ((keys["W"] == false || keys["A"] == false || keys["S"] == false || keys["D"] == false) &&
                Actionkeys.Attack == false && Actionkeys.Dodge == false && Actionkeys.Jump == false && Actionkeys.Die == false && Actionkeys.Nado == false)
        {
            if(ActualScene == 1)
            {
                if(Escenario.GetPlayer().Player1.GetModel().Pradera.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(0,1);   
                }
            }
            else if (ActualScene == 2)
            {
                if(Escenario.GetPlayer().Player1.GetModel().Pantano.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(0,1);   
                }
            }
            else if(ActualScene == 3)
            {
                if(Escenario.GetPlayer().Player1.GetModel().Nieve.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(0,1);   
                }
            }
        }

        if (keys["A"] /*<-*/){ 
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
        } else if (keys["D"] /*->*/){ 
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
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(4,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(4,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(4,1);
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
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPraderaScene().add(Particle);
                    ShotsPradera.push(Particle);
                    Disparando = true;
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPraderaScene().add(Particle);
                    ShotsPantano.push(Particle);
                    Disparando = true;
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y, Camara.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPraderaScene().add(Particle);
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
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(6,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(6,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(6,1);
                }
            }else
            {
                Actionkeys.Jump = false;
                JumpContador = 0;
            }
        }

        /*PLAYER 2 KEYS*/

        if (keys["I"]) {
            window.DialogMagic.close();
            if(Actionkeys2.Dodge == false && Actionkeys2.Jump == false && Actionkeys2.Die == false)
            {
                Actionkeys2.Attack = false;
                AttackContador2 = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    if(Actionkeys2.Nado)
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    if(Actionkeys2.Nado)
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = 550;
            }
		}else if (keys["K"]) {
            window.DialogMagic.close();
            if(Actionkeys2.Dodge == false && Actionkeys2.Jump == false && Actionkeys2.Die == false)
            {
                Actionkeys2.Attack = false;
                AttackContador2 = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    if(Actionkeys2.Nado)
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    if(Actionkeys2.Nado)
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(5,1);
                    }
                    else
                    {
                        Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                    }
                    //Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = -550;
            }
		}
        else if(keys["O"]){
            window.DialogMagic.close();
            if(Actionkeys2.Dodge == false && Actionkeys2.Jump == false && Actionkeys2.Die == false && Actionkeys2.Nado == false) 
            {
                Actionkeys2.Attack = true;
            }
        }
        else if(keys["M"]){
            window.DialogMagic.close();
            if(Actionkeys2.Dodge == false && Actionkeys2.Die == false && Actionkeys2.Nado == false)
            {
                Actionkeys2.Attack = false;
                AttackContador2 = 0;
                Actionkeys2.Jump = true;
            }
        }
        else if ((keys["I"] == false || keys["J"] == false || keys["K"] == false || keys["L"] == false) &&
                Actionkeys2.Attack == false && Actionkeys2.Dodge == false && Actionkeys2.Jump == false && Actionkeys2.Die == false && Actionkeys2.Nado == false)
        {
            if(ActualScene == 1)
            {
                if(Escenario.GetPlayer().Player2.GetModel().Pradera.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(0,1);   
                }
            }
            else if (ActualScene == 2)
            {
                if(Escenario.GetPlayer().Player2.GetModel().Pantano.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(0,1);   
                }
            }
            else if(ActualScene == 3)
            {
                if(Escenario.GetPlayer().Player2.GetModel().Nieve.getAnimActual() != -1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(0,1);   
                }
            }
        }

        if (keys["J"] /*<-*/){ 
            window.DialogMagic.close();
            if(ActualScene == 1)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rotation.y += 3 * delta;
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rotation.y += 3 * delta;
            }
            else if (ActualScene == 3)
            {
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").rotation.y += 3 * delta;
            }
        } else if (keys["L"] /*->*/){ 
            window.DialogMagic.close();
            if(ActualScene == 1)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rotation.y += -3 * delta;
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rotation.y += -3 * delta;
            }
            else if (ActualScene == 3)
            {
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").rotation.y += -3 * delta;
            }
        } else if (keys["º"] /*^*/){ 
            window.DialogMagic.close();
            Camara2.GetCamera().rotation.x -= (50 * 3.1416 / 180) * (delta);
        } else if (keys["Þ"] /*V*/){ 
            window.DialogMagic.close();
            Camara2.GetCamera().rotation.x += (50 * 3.1416 / 180) * (delta);
        }

        if(keys["U"]){
            window.DialogMagic.close();
            if(Actionkeys2.Jump == false && Actionkeys2.Nado == false && Actionkeys2.Die == false)
            {
                Actionkeys2.Attack = false;
                AttackContador2 = 0;
                
                Actionkeys2.Dodge = true;
                Invesible2 = true;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(500 * (delta)); 
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(500 * (delta)); 
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(500 * (delta)); 
                }
                movPas = 550;
            }
        }

        //Dodge
        if(Actionkeys2.Dodge == true)
        {
            DodgeContador2 += delta;
            if(DodgeContador2 <= DodgeDuracion2)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(4,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(4,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(4,1);
                }
            }else
            {
                Actionkeys2.Dodge = false;
                DodgeContador2 = 0;
                Invesible2 = false;
            }
        }
        //Attack
        if(Actionkeys2.Attack == true)
        {
            AttackContador2 += delta;
            if(AttackContador2 <= AttackDuracion2)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rotation.y, Camara2.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPraderaScene().add(Particle);
                    ShotsPradera2.push(Particle);
                    Disparando2 = true;
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rotation.y, Camara2.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetPantanoScene().add(Particle);
                    ShotsPantano2.push(Particle);
                    Disparando2 = true;
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(2,1);
                    var Particle = Disparo.Disparar(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rotation.y, Camara2.GetCamera().rotation.x, 'Assets/Images/shot.png', true);
                    Escenario.GetNieveScene().add(Particle);
                    ShotsNieve2.push(Particle);
                    Disparando2 = true;
                }
            }else
            {
                Actionkeys2.Attack = false;
                AttackContador2 = 0;
            }
        }
        //Jump
        if(Actionkeys2.Jump == true)
        {
            JumpContador2 += delta;
            if(JumpContador2 <= JumpDuracion2)
            {
                if(ActualScene == 1)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(6,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(6,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(6,1);
                }
            }else
            {
                Actionkeys2.Jump = false;
                JumpContador2 = 0;
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
                            Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys.Nado = false;
                        }
                    }
                }

                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Pradera, true);			
                    if (collision.length > 0) {
                        Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.y = collision[0].point.y;
                        if(collision[0].point.y < -50)
                        {
                            //console.log(collision[0].point.y);
                            Actionkeys2.Nado = true;
                            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.y = -39;
                            Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys2.Nado = false;
                        }
                    }
                }


                if(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.x < -8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                }
                if(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.x > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.x < -8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.z > 8750 ||
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(-movPas * delta);
                }


                //Collision Pradera objetos estaticos 1
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaObjects(), true);				
                    if (collision.length > 0 && (collision[0].distance < 125 /*|| collision[1].distance < 125 || collision[2].distance < 125 || collision[3].distance < 125*/)) {
                        if(collision[0].object.name == "portalPantano")
                        {
                            //ui.BrillarReaction();
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
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }else
                        {
                            Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                    }
                }

                //Collision Pradera objetos estaticos 2
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaObjects(), true);				
                    if (collision.length > 0 && (collision[0].distance < 125 /*|| collision[1].distance < 125 || collision[2].distance < 125 || collision[3].distance < 125*/)) {
                        if(collision[0].object.name == "portalPantano")
                        {
                            //ui.BrillarReaction();
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPantanoScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(2);
                                }
                                ActualScene = 2;
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }else
                        {
                            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(-movPas * delta);
                        }
                    }
                }


                //Collission Pradera Items 1
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                            //Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                            Escenario.GetPraderaItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPraderaItems().model[collision[0].object.name-1].visible = false;
                            //console.log(Escenario.GetPlayer().GetBackpack());
                        }
                    }
                }

                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["Y"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                           // Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                            Escenario.GetPraderaItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPraderaItems().model[collision[0].object.name-1].visible = false;
                            //console.log(Escenario.GetPlayer().GetBackpack());
                        }
                    }
                }

                //Collision PraderaEnemies 1
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
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Hola viajero bienvenido! Soy un Magic, te daré un consejo, los hongos no pueden ver detrás de ellos, pero las mariposas y hadas sí pueden y son agresivas. Cuidado!";
                                window.DialogMagic.showModal();
                            }
                        }  
                    }
                }

                //Collision PraderaEnemies 2
                for(var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 800)
                    {            
                        var j = parseInt(collision[0].object.name);
                        if(j < 23)
                        {
                            if(Escenario.GetPraderaEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPraderaEnemies().Collider[j].parent.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.x, Escenario.GetPraderaEnemies().Collider[j].parent.position.y, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.z);
                                Escenario.GetPraderaEnemies().Collider[j].parent.translateZ(450 * delta);
                                if(j < 8)
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetPraderaEnemies().Collider[j].parent.position, 0/*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.y*/, /*5 * 3.1416 / 180*/0, 'Assets/Images/shot_enemy.png', false);
                                    Particle.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position);
                                    Escenario.GetPraderaScene().add(Particle);
                                    ShotsEnemiePradera.push(Particle);
                                    EnemyDisparando = true;
                                }else
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetPraderaEnemies().Collider[j].parent.position, /*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.y*/0, 0/*Escenario.GetPraderaEnemies().Collider[j].parent.rotation.x25 * 3.1416 / 180*/, 'Assets/Images/shot_enemy.png', false);
                                   // Particle.rotation.x = 25 * 3.1416 / 180;
                                    Particle.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position);
                                    Escenario.GetPraderaScene().add(Particle);
                                    ShotsEnemiePradera.push(Particle);
                                    EnemyDisparando = true;
                                }
                            }
                        }   
                        else if (j == 23)
                        {
                            Escenario.GetPraderaEnemies().Collider[23].parent.lookAt(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.x, Escenario.GetPraderaEnemies().Collider[23].parent.position.y, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position.z);
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Hola viajero bienvenido! Soy un Magic, te daré un consejo, los hongos no pueden ver detrás de ellos, pero las mariposas y hadas sí pueden y son agresivas. Cuidado!";
                                window.DialogMagic.showModal();
                            }
                        }  
                    }
                }

                //Colissiones Disparos 1
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemiePradera, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player1.GetStats().Defensa;
                            Escenario.GetPlayer().Player1.GetStats().Vida -= Daño;
                            ui.SetVidaActualP1(Escenario.GetPlayer().Player1.GetStats().Vida, Escenario.GetPlayer().Player1.GetMaxLife());
                            Invesible = true;
                        }
                    }
                }

                //Colissiones Disparos 2
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemiePradera, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible2)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player2.GetStats().Defensa;
                            Escenario.GetPlayer().Player2.GetStats().Vida -= Daño;
                            ui.SetVidaActualP2(Escenario.GetPlayer().Player2.GetStats().Vida, Escenario.GetPlayer().Player2.GetMaxLife());
                            Invesible2 = true;
                        }
                    }
                }

                //Collission Disparos Enemies 1
               for (let j = 0; j < Escenario.GetPraderaEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPraderaEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaEnemies().Collider[j].parent.position, Escenario.GetPraderaEnemies().Collider[j].parent.rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsPradera, false);

                    if (collision.length > 0 && (collision[0].distance < 1200)) {

                        var Daño = Escenario.GetPlayer().Player1.GetStats().Ataque - Escenario.GetPraderaEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPraderaEnemies().Object[j].GetStats().Vida -= Daño / 20;

                        var Porcentaje = (Escenario.GetPraderaEnemies().Object[j].GetStats().Vida / Escenario.GetPraderaEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPraderaEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);

                        if(Escenario.GetPraderaEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPraderaScene().remove(Escenario.GetPraderaEnemies().Collider[j].parent);

                            if (Escenario.GetPraderaEnemies().Object[j].GetActive()) {
                                Escenario.GetPlayer().Player1.SetExp(Escenario.GetPlayer().Player1.GetExp() + 500);
                                if(Escenario.GetPlayer().Player1.GetExp() >= Escenario.GetPlayer().Player1.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player1.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player1.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player1.SetExp(0);
                                }
                                ui.SetExpActualP1(Escenario.GetPlayer().Player1.GetExp(), Escenario.GetPlayer().Player1.GetMaxExp());
                            }

                            Escenario.GetPraderaEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }

               //Collission Disparos Enemies 2
               for (let j = 0; j < Escenario.GetPraderaEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPraderaEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaEnemies().Collider[j].parent.position, Escenario.GetPraderaEnemies().Collider[j].parent.rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsPradera2, false);

                    if (collision.length > 0 && (collision[0].distance < 1200)) {

                        var Daño = Escenario.GetPlayer().Player2.GetStats().Ataque - Escenario.GetPraderaEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPraderaEnemies().Object[j].GetStats().Vida -= Daño / 20;

                        var Porcentaje = (Escenario.GetPraderaEnemies().Object[j].GetStats().Vida / Escenario.GetPraderaEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPraderaEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);

                        if(Escenario.GetPraderaEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPraderaScene().remove(Escenario.GetPraderaEnemies().Collider[j].parent);

                            if (Escenario.GetPraderaEnemies().Object[j].GetActive()) {
                                Escenario.GetPlayer().Player2.SetExp(Escenario.GetPlayer().Player2.GetExp() + 500);
                                if(Escenario.GetPlayer().Player2.GetExp() >= Escenario.GetPlayer().Player2.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player2.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player2.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player2.SetExp(0);
                                }
                                ui.SetExpActualP2(Escenario.GetPlayer().Player2.GetExp(), Escenario.GetPlayer().Player2.GetMaxExp());
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
                            Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys.Nado = false;
                        }
                    }
                }

                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Pantano, true);			
                    if (collision.length > 0) {
                        Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.y = collision[0].point.y;
                        if(collision[0].point.y < -205)
                        {
                            //console.log(collision[0].point.y);
                            Actionkeys2.Nado = true;
                            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.y = -205;
                            Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(5,1);
                        }
                        else
                        {
                            Actionkeys2.Nado = false;
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
                if(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.x > 8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.x < -8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.z > 8750 ||
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(-movPas * delta);
                }

                //Collision Pantano objetos estaticos 1
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPradera")
                        {
                            //ui.BrillarReaction();
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
                                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else if(collision[0].object.name == "portalNieve")
                        {
                            //ui.BrillarReaction();
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
                                Escenario.GetNieveScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                    }
                }

                //Collision Pantano objetos estaticos 2
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPradera")
                        {
                            //ui.BrillarReaction();
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPraderaScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(1);
                                }
                                ActualScene = 1;
                                Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else if(collision[0].object.name == "portalNieve")
                        {
                            //ui.BrillarReaction();
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetNieveScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(3);
                                }
                                ActualScene = 3;
                                Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                                Escenario.GetNieveScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(-movPas * delta);
                        }
                    }
                }

                //Collission Pantano Items 1
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                            //Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                            Escenario.GetPantanoItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPantanoItems().model[collision[0].object.name-1].visible = false;
                        }
                    }
                }

                 //Collission Pantano Items 2
                 for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["Y"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                            //Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                            Escenario.GetPantanoItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetPantanoItems().model[collision[0].object.name-1].visible = false;
                        }
                    }
                }

                //Collission Pantano Enemies 1
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
                            if(keys["R"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Los guardianes son demasiado agresivos y persistentes, intenta golpearlos de lejos, lo mismo para los drones, ten cuidado si pasas debajo de ellos pues podrán verte con facilidad.";
                                window.DialogMagic.showModal();
                            }
                        }  
                    }
                }

                //Collission Pantano Enemies 2
                for(var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays[i]);
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
                                    Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.z);
                                    Escenario.GetPantanoEnemies().Collider[j].parent.translateZ(450 * delta);
                                    if(j < 7)
                                    {
                                        var Particle = Disparo.Disparar(Escenario.GetPantanoEnemies().Collider[j].parent.position, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.x*/0, 'Assets/Images/shot_enemy.png', false);
                                        Particle.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position);
                                        Escenario.GetPantanoScene().add(Particle);
                                        ShotsEnemiePantano.push(Particle);
                                        EnemyDisparando = true;
                                    }
                                    else
                                    {
                                        var Particle = Disparo.Disparar(Escenario.GetPantanoEnemies().Collider[j].parent.position, /*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.y*/0, 0/*Escenario.GetPantanoEnemies().Collider[j].parent.rotation.x30 * 3.1416 / 180*/, 'Assets/Images/shot_enemy.png', false);
                                        //Particle.rotation.x = 30 * 3.1416 / 180;
                                        Particle.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position);
                                        Escenario.GetPantanoScene().add(Particle);
                                        ShotsEnemiePantano.push(Particle);
                                        EnemyDisparando = true;
                                    }
                                }
                                else
                                {
                                    Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.z);
                                    Escenario.GetPantanoEnemies().Collider[j].parent.translateZ(450 * delta);
                                }
                            }
                        }   
                        else
                        {
                            Escenario.GetPantanoEnemies().Collider[j].parent.lookAt(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.x, Escenario.GetPantanoEnemies().Collider[j].parent.position.y, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position.z);
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                document.getElementById("MessageMagic").innerHTML="Los guardianes son demasiado agresivos y persistentes, intenta golpearlos de lejos, lo mismo para los drones, ten cuidado si pasas debajo de ellos pues podrán verte con facilidad.";
                                window.DialogMagic.showModal();
                            }
                        }  
                    }
                }

                //Collision Disparos 1
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemiePantano, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player1.GetStats().Defensa;
                            Escenario.GetPlayer().Player1.GetStats().Vida -= Daño;
                            ui.SetVidaActualP1(Escenario.GetPlayer().Player1.GetStats().Vida, Escenario.GetPlayer().Player1.GetMaxLife());
                            Invesible = true;
                        }
                    }
                }

                //Collision Disparos 2
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemiePantano, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible2)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player2.GetStats().Defensa;
                            Escenario.GetPlayer().Player2.GetStats().Vida -= Daño;
                            ui.SetVidaActualP2(Escenario.GetPlayer().Player2.GetStats().Vida, Escenario.GetPlayer().Player2.GetMaxLife());
                            Invesible2 = true;
                        }
                    }
                }

                //Collission Disparos Enemies 1
               for (let j = 0; j < Escenario.GetPantanoEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPantanoEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoEnemies().Collider[j].parent.position, Escenario.GetPantanoEnemies().Collider[j].parent.rays[i]);
                    
                    var collision = rayCaster.intersectObjects(ShotsPantano, false);				
                    
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        var Daño = Escenario.GetPlayer().Player1.GetStats().Ataque - Escenario.GetPantanoEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPantanoEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        
                        var Porcentaje = (Escenario.GetPantanoEnemies().Object[j].GetStats().Vida / Escenario.GetPantanoEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPantanoEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        
                        if(Escenario.GetPantanoEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPantanoScene().remove(Escenario.GetPantanoEnemies().Collider[j].parent);
                            if(Escenario.GetPantanoEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().Player1.SetExp(Escenario.GetPlayer().Player1.GetExp() + 500);
                                if(Escenario.GetPlayer().Player1.GetExp() >= Escenario.GetPlayer().Player1.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player1.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player1.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player1.SetExp(0);
                                }
                                ui.SetExpActualP1(Escenario.GetPlayer().Player1.GetExp(), Escenario.GetPlayer().Player1.GetMaxExp());
                            }
                            
                            Escenario.GetPantanoEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }

               //Collission Disparos Enemies 2
               for (let j = 0; j < Escenario.GetPantanoEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetPantanoEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoEnemies().Collider[j].parent.position, Escenario.GetPantanoEnemies().Collider[j].parent.rays[i]);
                    
                    var collision = rayCaster.intersectObjects(ShotsPantano2, false);				
                    
                    if (collision.length > 0 && (collision[0].distance < 1200)) {

                        var Daño = Escenario.GetPlayer().Player2.GetStats().Ataque - Escenario.GetPantanoEnemies().Object[j].GetStats().Defensa;
                        Escenario.GetPantanoEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        
                        var Porcentaje = (Escenario.GetPantanoEnemies().Object[j].GetStats().Vida / Escenario.GetPantanoEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetPantanoEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        
                        if(Escenario.GetPantanoEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetPantanoScene().remove(Escenario.GetPantanoEnemies().Collider[j].parent);
                            if(Escenario.GetPantanoEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().Player2.SetExp(Escenario.GetPlayer().Player2.GetExp() + 500);
                                if(Escenario.GetPlayer().Player2.GetExp() >= Escenario.GetPlayer().Player2.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player2.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player2.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player2.SetExp(0);
                                }
                                ui.SetExpActualP2(Escenario.GetPlayer().Player2.GetExp(), Escenario.GetPlayer().Player2.GetMaxExp());
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
                        Escenario.GetNieveScene().getObjectByName("PlayerModel").position.y = collision[0].point.y;
                    }
                }

                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObject(Escenario.GetTerrains().Nieve, true);			
                    if (collision.length > 0) {
                        Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.y = collision[0].point.y;
                    }
                }

                if(Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.x < -8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                }
                if(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x < -8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z > 8750 ||
                Escenario.GetNieveScene().getObjectByName("PlayerModel").position.z < -8750)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(-movPas * delta);
                }

                //Collision Nieve objetos estaticos 1
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPantano")
                        {
                           // ui.BrillarReaction();
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
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                    }
                }

                 //Collision Nieve objetos estaticos 2
                 for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        if(collision[0].object.name == "portalPantano")
                        {
                           // ui.BrillarReaction();
                            if(keys["Y"] && CambiandoDeMapa==false)
                            {
                                CambiandoDeMapa = true;
                                Scene = Escenario.GetPantanoScene();
                                if(intensityAmbientLight > 0.4)
                                {
                                    audioCont.PlaySceneSound(2);
                                }
                                ActualScene = 2;
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
                                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
                            }
                        }
                        else
                        {
                            Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        }
                    }
                }

                //Collission Nieve Items 1
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["R"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                            //Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                            Escenario.GetNieveItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetNieveItems().model[collision[0].object.name-1].visible = false;
                        }
                    }
                }
                //Collission Nieve Items 2
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveItems().model, true);				
                    if (collision.length > 0 /*&& collision[0].distance < 500*/) {
                        //ui.BrillarReaction();
                        if(keys["Y"])
                        {
                            Escenario.GetPlayer().Player1.GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                            //Escenario.GetPlayer().Player2.GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                            Escenario.GetNieveItems().items[collision[0].object.name-1] = {empty: true};
                            Escenario.GetNieveItems().model[collision[0].object.name-1].visible = false;
                        }
                    }
                }

                //Collission Nieve Enemies 1
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

                //Collission Nieve Enemies 2
                for(var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 800)
                    {            
                        var j = parseInt(collision[0].object.name);
                        if(j < 19)
                        {
                            Escenario.GetNieveEnemies().Object[j].GetActive()
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z);
                                Escenario.GetNieveEnemies().Collider[j].parent.translateZ(450 * delta);
                                if(j < 11)
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetNieveEnemies().Collider[j].parent.position, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.x 30 * 3.1416 / 180*/0, 'Assets/Images/shot_enemy.png', false);
                                    //Particle.rotation.x = 30 * 3.1416 / 180;
                                    Particle.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position);
                                    Escenario.GetNieveScene().add(Particle);
                                    ShotsEnemieNieve.push(Particle);
                                    EnemyDisparando = true;
                                }
                                else
                                {
                                    var Particle = Disparo.Disparar(Escenario.GetNieveEnemies().Collider[j].parent.position, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.y*/0, /*Escenario.GetNieveEnemies().Collider[j].parent.rotation.x*/0, 'Assets/Images/shot_enemy.png', false);
                                    Particle.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position);
                                    Escenario.GetNieveScene().add(Particle);
                                    ShotsEnemieNieve.push(Particle);
                                    EnemyDisparando = true;
                                }
                            }
                        }   
                        else
                        {
                            if(j == 19)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z);
                                if(keys["Y"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Los fantasmas dan miedo, parece que no atacan pero realmente pueden ver donde no te lo esperas. Atacas a uno y tienes a varios siguiendote.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 20)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z);
                                if(keys["Y"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Los fantasmas pueden verte desde lugares inesperados y también son dificiles de atacar, te recomiendo no acercarte a ellos hasta conocerlos bien.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 21)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z);
                                if(keys["Y"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Algunos enemigos son dificiles de atacar, parecen tener escondida su debilidad haciendo complicado atacarlos.";
                                    window.DialogMagic.showModal();
                                }
                            }
                            else if(j == 22)
                            {
                                Escenario.GetNieveEnemies().Collider[j].parent.lookAt(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.x, Escenario.GetNieveEnemies().Collider[j].parent.position.y, Escenario.GetNieveScene().getObjectByName("PlayerModel2").position.z);
                                if(keys["Y"] && CambiandoDeMapa==false)
                                {
                                    CambiandoDeMapa = true;
                                    document.getElementById("MessageMagic").innerHTML="Las pociones de ataquen suben 300 puntos de ataque y las pociones de defensa suben 100 puntos de defensa, las pociones básicas te curan 100 puntos de salud y las pociones altas te curan 300.";
                                    window.DialogMagic.showModal();
                                }
                            }
                        }  
                    }
                }

                //Collision disparos 1
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemieNieve, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player1.GetStats().Defensa;
                            Escenario.GetPlayer().Player1.GetStats().Vida -= Daño;
                            ui.SetVidaActualP1(Escenario.GetPlayer().Player1.GetStats().Vida, Escenario.GetPlayer().Player1.GetMaxLife());
                            Invesible = true;
                        }
                    }
                }

                //Collision disparos 2
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel2").position, Escenario.GetNieveScene().getObjectByName("PlayerModel2").rays[i]);
                    var collision = rayCaster.intersectObjects(ShotsEnemieNieve, false);				
                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        if(!Invesible2)
                        {
                            var Daño = (650 * Configuraciones.dif) /*<-Este daño es provisional*/ - Escenario.GetPlayer().Player2.GetStats().Defensa;
                            Escenario.GetPlayer().Player2.GetStats().Vida -= Daño;
                            ui.SetVidaActualP2(Escenario.GetPlayer().Player2.GetStats().Vida, Escenario.GetPlayer().Player2.GetMaxLife());
                            Invesible2 = true;
                        }
                    }
                }

                //Collission Disparos Enemies 1
               for (let j = 0; j < Escenario.GetNieveEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetNieveEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveEnemies().Collider[j].parent.position, Escenario.GetNieveEnemies().Collider[j].parent.rays[i]);
                    
                    var collision = rayCaster.intersectObjects(ShotsNieve, false);

                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        
                        var Daño = Escenario.GetPlayer().Player1.GetStats().Ataque - Escenario.GetNieveEnemies().Object[j].GetStats().Defensa;
                        
                        Escenario.GetNieveEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        var Porcentaje = (Escenario.GetNieveEnemies().Object[j].GetStats().Vida / Escenario.GetNieveEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetNieveEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        if(Escenario.GetNieveEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetNieveScene().remove(Escenario.GetNieveEnemies().Collider[j].parent);
                            if(Escenario.GetNieveEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().Player1.SetExp(Escenario.GetPlayer().Player1.GetExp() + 500);
                                if(Escenario.GetPlayer().Player1.GetExp() >= Escenario.GetPlayer().Player1.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player1.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player1.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player1.SetExp(0);
                                }
                                ui.SetExpActualP1(Escenario.GetPlayer().Player1.GetExp(), Escenario.GetPlayer().Player1.GetMaxExp());
                            }
                            Escenario.GetNieveEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }

               //Collission Disparos Enemies 2
               for (let j = 0; j < Escenario.GetNieveEnemies().Collider.length; j++) {
                for (var i = 0; i < Escenario.GetNieveEnemies().Collider[j].parent.rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveEnemies().Collider[j].parent.position, Escenario.GetNieveEnemies().Collider[j].parent.rays[i]);
                    
                    var collision = rayCaster.intersectObjects(ShotsNieve2, false);

                    if (collision.length > 0 && (collision[0].distance < 1200)) {
                        
                        var Daño = Escenario.GetPlayer().Player2.GetStats().Ataque - Escenario.GetNieveEnemies().Object[j].GetStats().Defensa;
                        
                        Escenario.GetNieveEnemies().Object[j].GetStats().Vida -= Daño / 20;
                        var Porcentaje = (Escenario.GetNieveEnemies().Object[j].GetStats().Vida / Escenario.GetNieveEnemies().Object[j].GetMaxLife()) * 100;
                        Escenario.GetNieveEnemies().Collider[j].parent.getObjectByName("vida").scale.set(Porcentaje / 100, 1 ,1);
                        if(Escenario.GetNieveEnemies().Object[j].GetStats().Vida <= 0)
                        {
                            Escenario.GetNieveScene().remove(Escenario.GetNieveEnemies().Collider[j].parent);
                            if(Escenario.GetNieveEnemies().Object[j].GetActive())
                            {
                                Escenario.GetPlayer().Player2.SetExp(Escenario.GetPlayer().Player2.GetExp() + 500);
                                if(Escenario.GetPlayer().Player2.GetExp() >= Escenario.GetPlayer().Player2.GetMaxExp())
                                {
                                    var newlevel = Escenario.GetPlayer().Player1.GetLevel();
                                    newlevel++;
                                    Escenario.GetPlayer().Player2.SetLevel(newlevel);
                                    Escenario.GetPlayer().Player2.SetExp(0);
                                }
                                ui.SetExpActualP2(Escenario.GetPlayer().Player2.GetExp(), Escenario.GetPlayer().Player2.GetMaxExp());
                            }
                            Escenario.GetNieveEnemies().Object[j].SetActive(false);
                        }
                    }
                 }
               }


            }
        }

        //Shots 1
        for (let i = 0; i < ShotsPradera.length; i++) {
            ShotsPradera[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsPantano.length; i++) {
            ShotsPantano[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsNieve.length; i++) {
            ShotsNieve[i].translateZ(700 * delta);
        }

        //Shots 2
        for (let i = 0; i < ShotsPradera2.length; i++) {
            ShotsPradera2[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsPantano2.length; i++) {
            ShotsPantano2[i].translateZ(700 * delta);
        }
        for (let i = 0; i < ShotsNieve2.length; i++) {
            ShotsNieve2[i].translateZ(700 * delta);
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

        if(Disparando2)
        {
            DisparandoContador2 += delta;
            if(DisparandoContador2 > 3)
            {
                for (let i = 0; i < ShotsPradera2.length; i++) {
                    Escenario.GetPraderaScene().remove(ShotsPradera2[i]);
                }
                ShotsPradera2.splice(0, ShotsPradera2.length);
                for (let i = 0; i < ShotsPantano2.length; i++) {
                    Escenario.GetPantanoScene().remove(ShotsPantano2[i]);
                }
                ShotsPantano2.splice(0, ShotsPantano2.length);
                for (let i = 0; i < ShotsNieve2.length; i++) {
                    Escenario.GetNieveScene().remove(ShotsNieve2[i]);
                }
                ShotsNieve2.splice(0, ShotsNieve2.length);
                Disparando2 = false;
                DisparandoContador2 = 0;
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
            
            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            
            if(AtaqueExtraCont > 10)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("AtkCilinder"));
                
                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel2").getObjectByName("AtkCilinder"));
                
                Escenario.GetPlayer().Player1.GetStats().Ataque = 800 + (800 * (Escenario.GetPlayer().Player1.GetLevel() * 0.1));
                Escenario.GetPlayer().Player2.GetStats().Ataque = 800 + (800 * (Escenario.GetPlayer().Player2.GetLevel() * 0.1));
               
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

            Escenario.GetPraderaScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;
            Escenario.GetNieveScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder").material.map.offset.y = tiempoPortales * 0.0025;

            if(DefensaExtraCont > 10)
            {
                Escenario.GetPraderaScene().getObjectByName("PlayerModel").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel").getObjectByName("DefCilinder"));

                Escenario.GetPraderaScene().getObjectByName("PlayerModel2").remove(Escenario.GetPraderaScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder"));
                Escenario.GetPantanoScene().getObjectByName("PlayerModel2").remove(Escenario.GetPantanoScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder"));
                Escenario.GetNieveScene().getObjectByName("PlayerModel2").remove(Escenario.GetNieveScene().getObjectByName("PlayerModel2").getObjectByName("DefCilinder"));

                Escenario.GetPlayer().Player1.GetStats().Defensa = 500 + (500 * (Escenario.GetPlayer().Player1.GetLevel() * 0.1));
                Escenario.GetPlayer().Player2.GetStats().Defensa = 500 + (500 * (Escenario.GetPlayer().Player2.GetLevel() * 0.1));

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

        if(Invesible2)
        {
            InvensibleContador2 += delta;
            if(InvensibleContador2 > 0.2)
            {
                Invesible2 = false;
                InvensibleContador2 = 0;
            }
        }
    
        //PROVISIONAL PARA PROBAR DAÑO
      /*  if (keys["Z"])
        {
            Escenario.GetPlayer().GetStats().Vida -= 300;
            console.log(Escenario.GetPlayer().Player1.GetStats().Vida);
            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
        } */

        //GUI
        if(keys["P"])
        {
            if(!Pause)
            {
                $(".ItemMenu").remove();
                $(".btnUse").remove();
                for (let i = 0; i < Escenario.GetPlayer().Player1.GetBackpack().GetItems().length; i++) {
                    $("#MochilaMenu").append("<div class='ItemMenu'>"+Escenario.GetPlayer().Player1.GetBackpack().GetItems()[i].getItem().name+"<button class='btnUse' onclick='AccionesMenu.useItem("+i+")'>+</button> <button class='btnUse' onclick='AccionesMenu.DeleteItem("+i+")'>x</button></div>");
                }
                document.getElementById("PauseNivel").innerHTML = "Nivel: "+Escenario.GetPlayer().Player1.GetLevel();
                document.getElementById("PauseExp").innerHTML = "Experiencia: " + Escenario.GetPlayer().Player1.GetExp();
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

        if (Escenario.GetPlayer().Player1.GetModel().Pradera.getMixer()) Escenario.GetPlayer().Player1.GetModel().Pradera.getMixer().update(delta);
        if (Escenario.GetPlayer().Player2.GetModel().Pradera.getMixer()) Escenario.GetPlayer().Player2.GetModel().Pradera.getMixer().update(delta);
        if (Escenario.GetPlayer().Player1.GetModel().Pantano.getMixer()) Escenario.GetPlayer().Player1.GetModel().Pantano.getMixer().update(delta);
        if (Escenario.GetPlayer().Player2.GetModel().Pantano.getMixer()) Escenario.GetPlayer().Player2.GetModel().Pantano.getMixer().update(delta);
        if (Escenario.GetPlayer().Player1.GetModel().Nieve.getMixer()) Escenario.GetPlayer().Player1.GetModel().Nieve.getMixer().update(delta);
        if (Escenario.GetPlayer().Player2.GetModel().Nieve.getMixer()) Escenario.GetPlayer().Player2.GetModel().Nieve.getMixer().update(delta);

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
        Escenario.LodoUpdate();
        const time = Date.now() * 0.00005;
        Escenario.SnowUpdate(time);
        //renderer.render(Escenario.GetTestScene(), Camara.GetCamera());
        renderer.render(Scene, Camara.GetCamera());
        renderer2.render(Scene, Camara2.GetCamera());
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
        Escenario.GetPraderaScene().getObjectByName("LuzPradera").intensity = intensityAmbientLight + 0.2;
        Escenario.GetPantanoScene().getObjectByName("LuzPantano").intensity = intensityAmbientLight + 0.2;
        Escenario.GetNieveScene().getObjectByName("LuzNieve").intensity = intensityAmbientLight + 0.2;
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

        if (Escenario.GetPlayer().Player1.GetStats().Vida <= 0 || Escenario.GetPlayer().Player2.GetStats().Vida <= 0) {
            audioCont.StopAllSound();
            AudioM.GetSound().play();
            Actionkeys.Die = true;
            Actionkeys2.Die = true;

            $("#bg").animate({ opacity: 1 }, 1000);
            Die = true;

            if(ActualScene == 1)
            {
                Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(3,1);
                Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(3,1);
            }
            else if (ActualScene == 2)
            {
                Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(3,1);
                Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(3,1);
            }
            else if (ActualScene == 3)
            {
                Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(3,1);
                Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(3,1);
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