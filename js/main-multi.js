import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Scenee} from '/PWGW/js/scene-multi.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GUI} from '/PWGW/js/gui.js';
import {AudioController} from '/PWGW/js/audioController.js'

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
    var Actionkeys = {Attack: false, Dodge: false, Jump: false};
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
        //Escenario.GetPlayer().GetModel().Pantano.playAnimation(0,1);
        //Escenario.GetPlayer().GetModel().Nieve.playAnimation(0,1);
        Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        Escenario.GetPraderaScene().getObjectByName("PlayerModel2").add(Camara2.GetCamera());
        //Base Sound
        audioCont.PlaySceneSound(1);
        ModelsLoaded = true;
    }

    Escenario.InitScene(loadingManager);
    Escenario.PantanoScene(loadingManager);
    Escenario.PraderaScene(loadingManager);
    Escenario.NieveScene(loadingManager);
    Escenario.Rain();
    Escenario.Snow();
    Scene = Escenario.GetPraderaScene();
    const audioCont = new AudioController();
    var DodgeDuracion = 1.5;
    var DodgeContador = 0;
    var AttackDuracion = 2.2;
    var AttackContador = 0;
    var JumpDuracion = 2.5;
    var JumpContador = 0;
    var ActualScene = 1;
    var movPas = 0;
    var rayCaster = new THREE.Raycaster();
    
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
    document.body.appendChild( stats.domElement );

    /*const controls = new OrbitControls(Camara2.GetCamera(), renderer2.domElement);
    controls.target.set(0, 5, 0);
    controls.update();*/

    var leavesMateriala = [];
    CreatePasto(6000, -2400, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000, 4300, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000,  300, -6600, 30, 25, 30, 170, 120);
    CreatePasto(6000, -7300, -3000, 30, 25, 30, 110, 120);

    /*const ui = new GUI();
    ui.CreateLife(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());*/

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
        var Curacion = Escenario.GetPlayer().GetBackpack().UseItem(index);
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
		if (keys["W"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = 550;
            }
		}else if (keys["S"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(1,1);
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
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = true;
            }
        }
        else if(keys[" "]){
            if(Actionkeys.Dodge == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                Actionkeys.Jump = true;
            }
        }
        else if ((keys["W"] == false || keys["A"] == false || keys["S"] == false || keys["D"] == false) &&
                Actionkeys.Attack == false && Actionkeys.Dodge == false && Actionkeys.Jump == false)
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
            Camara.GetCamera().rotation.x -= (50 * 3.1416 / 180) * (delta);
        } else if (keys["("] /*V*/){ 
            Camara.GetCamera().rotation.x += (50 * 3.1416 / 180) * (delta);
        }

        if(keys["Q"]){
            if(Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                
                Actionkeys.Dodge = true;
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
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().Player1.GetModel().Pantano.playAnimation(2,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().Player1.GetModel().Nieve.playAnimation(2,1);
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
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = 550;
            }
		}else if (keys["K"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    Escenario.GetPraderaScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel2").translateZ(-550 * (delta));
                    Escenario.GetPlayer().Player2.GetModel().Nieve.playAnimation(1,1);
                }
                movPas = -550;
            }
		}
        else if ((keys["I"] == false || keys["A"] == false || keys["K"] == false || keys["D"] == false) /*&&
                Actionkeys.Attack == false && Actionkeys.Dodge == false && Actionkeys.Jump == false*/)
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
        }

        //Colisiones
        if(ModelsLoaded)
        {
            if(ActualScene == 1)
            {
                //Collision Pradera objetos estaticos
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        console.log("colisionando");
                    }
                }
                //Collission Pradera Items
                for (var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaItems().model, true);				
                    if (collision.length > 0 && collision[0].distance < 500 && keys["R"]) {
                        Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetPraderaItems().items[collision[0].object.name-1]);
                        Escenario.GetPraderaItems().items[collision[0].object.name-1] = {empty: true};
                        Escenario.GetPraderaItems().model[collision[0].object.name-1].visible = false;
                        console.log(Escenario.GetPlayer().GetBackpack());
                    }
                }
                //Collision PraderaEnemies
                for(var i = 0; i < Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays.length; i++)
                {
                    rayCaster.set(Escenario.GetPraderaScene().getObjectByName("PlayerModel").position, Escenario.GetPraderaScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPraderaEnemies().Collider, true);
                    if(collision.length > 0 && collision[0].distance < 500)
                    {
                        console.log("Colissionando con Enemigo");
                    }
                }
            }
            else if(ActualScene == 2)
            {
                //Collision Pantano objetos estaticos
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        console.log("colisionando");
                    }
                }
                //Collission Pantano Items
                for (var i = 0; i < Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetPantanoScene().getObjectByName("PlayerModel").position, Escenario.GetPantanoScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetPantanoItems().model, true);				
                    if (collision.length > 0 && collision[0].distance < 500 && keys["R"]) {
                        Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetPantanoItems().items[collision[0].object.name-1]);
                        Escenario.GetPantanoItems().items[collision[0].object.name-1] = {empty: true};
                        Escenario.GetPantanoItems().model[collision[0].object.name-1].visible = false;
                        console.log(Escenario.GetPlayer().GetBackpack());
                    }
                }
            }
            else if(ActualScene == 3)
            {
                //Collision Nieve objetos estaticos
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveObjects(), true);				
                    if (collision.length > 0 && collision[0].distance < 125) {
                        Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-movPas * delta);
                        console.log("colisionando");
                    }
                }
                //Collission Nieve Items
                for (var i = 0; i < Escenario.GetNieveScene().getObjectByName("PlayerModel").rays.length; i++) {
                    rayCaster.set(Escenario.GetNieveScene().getObjectByName("PlayerModel").position, Escenario.GetNieveScene().getObjectByName("PlayerModel").rays[i]);
                    var collision = rayCaster.intersectObjects(Escenario.GetNieveItems().model, true);				
                    if (collision.length > 0 && collision[0].distance < 500 && keys["R"]) {
                        Escenario.GetPlayer().GetBackpack().AddItem(Escenario.GetNieveItems().items[collision[0].object.name-1]);
                        Escenario.GetNieveItems().items[collision[0].object.name-1] = {empty: true};
                        Escenario.GetNieveItems().model[collision[0].object.name-1].visible = false;
                        console.log(Escenario.GetPlayer().GetBackpack());
                    }
                }
            }
        }

    
        //PROVISIONAL PARA PROBAR DAÑO
        if (keys["Z"])
        {
            Escenario.GetPlayer().GetStats().Vida -= 300;
            console.log(Escenario.GetPlayer().Player1.GetStats().Vida);
            ui.SetVidaActual(Escenario.GetPlayer().GetStats().Vida, Escenario.GetPlayer().GetMaxLife());
        }

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
                window.ModalMenu.showModal();
                Pause = true;
            }
        }

        /*De prueba cambio scene*/
        if(keys["B"])
        {
            Scene = Escenario.GetPraderaScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(1);
            }
            ActualScene = 1;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["N"])
        {
            Scene = Escenario.GetPantanoScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(2);
            }
            ActualScene = 2;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["M"])
        {
            Scene = Escenario.GetNieveScene();
            if(intensityAmbientLight > 0.4)
            {
                audioCont.PlaySceneSound(3);
            }
            ActualScene = 3;
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }

        if (Escenario.GetPlayer().Player1.GetModel().Pradera.getMixer()) Escenario.GetPlayer().Player1.GetModel().Pradera.getMixer().update(delta);
        if (Escenario.GetPlayer().Player2.GetModel().Pradera.getMixer()) Escenario.GetPlayer().Player2.GetModel().Pradera.getMixer().update(delta);
        if (Escenario.GetPlayer().Player1.GetModel().Pantano.getMixer()) Escenario.GetPlayer().Player1.GetModel().Pantano.getMixer().update(delta);
        if (Escenario.GetPlayer().Player1.GetModel().Nieve.getMixer()) Escenario.GetPlayer().Player1.GetModel().Nieve.getMixer().update(delta);

        for (let i = 0; i < Escenario.GetPraderaEnemies().Model.length; i++) {
            if (Escenario.GetPraderaEnemies().Model[i].GetMixer()){Escenario.GetPraderaEnemies().Model[i].GetMixer().update(delta);}
        }
        for (let i = 0; i < Escenario.GetPantanoEnemies().length; i++) {
            if (Escenario.GetPantanoEnemies()[i].GetMixer()){Escenario.GetPantanoEnemies()[i].GetMixer().update(delta);}
        }
        for (let i = 0; i < Escenario.GetNieveEnemies().length; i++) {
            if (Escenario.GetNieveEnemies()[i].GetMixer()){Escenario.GetNieveEnemies()[i].GetMixer().update(delta);}
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
        
        if(Pause) return;
        requestAnimationFrame(render);
    }
    AccionesMenu.render = render;
    
    requestAnimationFrame(render);
}

main();