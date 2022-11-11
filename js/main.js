import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Scenee} from '/PWGW/js/scene.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GUI} from '/PWGW/js/gui.js';
import {AudioController} from '/PWGW/js/audioController.js';

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

    const clock = new THREE.Clock();
    let RotationSky = 0;
    const dbRefPlayers = firebase.database().ref().child("Room");
    
    var keys = {};
    var Actionkeys = {Attack: false, Dodge: false, Jump: false};
    var mousekeys = [];
    var jugadores = [];
    var update = false;

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
       /* Escenario.GetPlayer().GetModel().Pradera.playAnimation(0,1);
        Escenario.GetPlayer().GetModel().Pantano.playAnimation(0,1);
        Escenario.GetPlayer().GetModel().Nieve.playAnimation(0,1); 
        Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());*/
		var place;
        for (var i = 0; i < jugadores.length ; i++ ){
			if(jugadores[i].player.Room == Escenario.GetOnline().GetRoom()){
				place = i;
			}
		}
        jugadores[place].jugador.playAnimation(0,1);
        jugadores[place].object.add(Camara.GetCamera());
        //Base Sound
        audioCont.PlaySceneSound(1);
    }

    Escenario.InitScene(loadingManager);
    Escenario.PantanoScene(loadingManager);
    Escenario.PraderaScene(loadingManager);
    Escenario.NieveScene(loadingManager);
    //InitOnline
    Escenario.CreateOnlineRoom();
    dbRefPlayers.on("child_added",(snap)=>{
        var player = snap.val();
        var key = snap.key;
       // var Jugador = {object: Escenario.AddPlayerOnline(loadingManager), jugador: Escenario.GetPlayer()};
        var newObject = Escenario.AddPlayerOnline(loadingManager);
        newObject.player = player;
        newObject.key = key;
        jugadores.push(newObject);
        console.log(jugadores.length);
    });
    dbRefPlayers.on("child_changed",(snap)=>{
        var player = snap.val();
        var key = snap.key;
        for(var i = 0; i < jugadores.length ; i++){
            if(jugadores[i].key == key){
                jugadores[i].player = player;
            }
        }
    });

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

    /*const controls = new OrbitControls(Camara.GetCamera(), canvas);
    controls.target.set(0, 5, 0);
    controls.update();*/

    var leavesMateriala = [];
    CreatePasto(6000, -2400, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000, 4300, 7000, 30, 25, 30, 170, 120);
    CreatePasto(6000,  300, -6600, 30, 25, 30, 170, 120);
    CreatePasto(6000, -7300, -3000, 30, 25, 30, 110, 120);

    const ui = new GUI();
    ui.CreateLife();

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
        var currentPlayer;
		var currentKey;
		var place;
        for (var i = 0; i < jugadores.length ; i++ ){
			if(jugadores[i].player.Room == Escenario.GetOnline().GetRoom()){
				currentPlayer = jugadores[i].player;
				currentKey = jugadores[i].key;
				place = i;
				update=true;
			}
		}
       
		if (keys["W"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    jugadores[place].object.translateZ(550 * (delta));
                    jugadores[place].jugador.playAnimation(1,1);
                    currentPlayer.position.x = jugadores[place].object.position.x;
                    currentPlayer.position.y = jugadores[place].object.position.y;
                    currentPlayer.position.z = jugadores[place].object.position.z;
                    Escenario.GetOnline().updateFirebase(currentPlayer, currentKey);
                    //Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(550 * (delta));
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(1,1);
                }
            }
		}else if (keys["S"]) {
            if(Actionkeys.Dodge == false && Actionkeys.Jump == false)
            {
                Actionkeys.Attack = false;
                AttackContador = 0;
                if(ActualScene == 1)
                {
                    jugadores[place].object.translateZ(-550 * (delta));
                    jugadores[place].jugador.playAnimation(1,1);
                    currentPlayer.position.x = jugadores[place].object.position.x;
                    currentPlayer.position.y = jugadores[place].object.position.y;
                    currentPlayer.position.z = jugadores[place].object.position.z;
                    Escenario.GetOnline().updateFirebase(currentPlayer, currentKey);
                    //Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(1,1);
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(1,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(-550 * (delta));
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(1,1);
                }
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
                if(jugadores[place].jugador.getAnimActual() != -1)
                {
                    jugadores[place].jugador.playAnimation(0,1);
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(0,1);   
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
            if(ActualScene == 1)
            {
                jugadores[place].object.rotation.y += 3 * delta;
                currentPlayer.OwnerRotationy = jugadores[place].object.rotation.y;
                Escenario.GetOnline().updateFirebase(currentPlayer, currentKey);
                //Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y += 3 * delta;
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
            if(ActualScene == 1)
            {
                jugadores[place].object.rotation.y += -3 * delta;
                currentPlayer.OwnerRotationy = jugadores[place].object.rotation.y;
                Escenario.GetOnline().updateFirebase(currentPlayer, currentKey);
                //Escenario.GetPraderaScene().getObjectByName("PlayerModel").rotation.y += -3 * delta;
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
                    jugadores[place].object.translateZ(500 * (delta));
                    currentPlayer.position.x = jugadores[place].object.position.x;
                    currentPlayer.position.y = jugadores[place].object.position.y;
                    currentPlayer.position.z = jugadores[place].object.position.z;
                    Escenario.GetOnline().updateFirebase(currentPlayer, currentKey); 
                    //Escenario.GetPraderaScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
                else if(ActualScene == 2)
                {
                    Escenario.GetPantanoScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetNieveScene().getObjectByName("PlayerModel").translateZ(500 * (delta)); 
                }
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
                    jugadores[place].jugador.playAnimation(4,1);
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(4,1);
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
                    jugadores[place].jugador.playAnimation(2,1);
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(2,1);
                }
                else if (ActualScene == 2)
                {
                    Escenario.GetPlayer().GetModel().Pantano.playAnimation(2,1);
                }
                else if (ActualScene == 3)
                {
                    Escenario.GetPlayer().GetModel().Nieve.playAnimation(2,1);
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
                    jugadores[place].jugador.playAnimation(6,1);
                    //Escenario.GetPlayer().GetModel().Pradera.playAnimation(6,1);
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

        /*De prueba cambio scene*/
        if(keys["J"])
        {
            Scene = Escenario.GetPraderaScene();
            audioCont.PlaySceneSound(1);
            ActualScene = 1;
            Escenario.GetPraderaScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["K"])
        {
            Scene = Escenario.GetPantanoScene();
            audioCont.PlaySceneSound(2);
            ActualScene = 2;
            Escenario.GetPantanoScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }
        if(keys["L"])
        {
            Scene = Escenario.GetNieveScene();
            audioCont.PlaySceneSound(3);
            ActualScene = 3;
            Escenario.GetNieveScene().getObjectByName("PlayerModel").add(Camara.GetCamera());
        }

        //if (Escenario.GetPlayer().GetModel().Pradera.getMixer()) Escenario.GetPlayer().GetModel().Pradera.getMixer().update(delta);
        
        for (var i = 0; i < jugadores.length ; i++ ){
            jugadores[i].object.rotation.y = jugadores[i].player.OwnerRotationy;
            jugadores[i].object.position.x = jugadores[i].player.position.x;
            jugadores[i].object.position.y = jugadores[i].player.position.y;
            jugadores[i].object.position.z = jugadores[i].player.position.z;
            if (jugadores[i].jugador.getMixer()) jugadores[i].jugador.getMixer().update(delta);
        }

        if (Escenario.GetPlayer().GetModel().Pantano.getMixer()) Escenario.GetPlayer().GetModel().Pantano.getMixer().update(delta);
        if (Escenario.GetPlayer().GetModel().Nieve.getMixer()) Escenario.GetPlayer().GetModel().Nieve.getMixer().update(delta);

        for (let i = 0; i < Escenario.GetPraderaEnemies().length; i++) {
            if (Escenario.GetPraderaEnemies()[i].GetMixer()){Escenario.GetPraderaEnemies()[i].GetMixer().update(delta);}
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
        
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();