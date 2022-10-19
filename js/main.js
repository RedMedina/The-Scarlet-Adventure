import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Audioo} from '/PWGW/js/audio.js';
import {Scenee} from '/PWGW/js/scene.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {FBXLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GUI} from '/PWGW/js/gui.js';

function main()
{
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var Escenario = new Scenee();
    var Camara = new Cameraa(45, 2, 0.1, 100000);

    const clock = new THREE.Clock();
    
    var keys = {};

    document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);

    Escenario.InitScene();
    Escenario.PantanoScene();
    Escenario.PraderaScene();
    Escenario.Rain();

    var Obsidiana1 = new Audioo();
    Obsidiana1.create();
    Camara.GetCamera().add(Obsidiana1.getListener());
    Obsidiana1.Sound("Assets/BGM/Obsidian1.mp3");
    //Obsidiana1.Stop();
    
    let water;
    const waterGeometry = new THREE.PlaneGeometry( 100, 100 );
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
    water.position.y = 5;
    Escenario.GetTestScene().add( water );

    let stats = new Stats();
    document.body.appendChild( stats.domElement );

    const controls = new OrbitControls(Camara.GetCamera(), canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const ui = new GUI();
    ui.CreateLife();

    var animations = ["Assets/Models/Player/Idle_Final", "Assets/Models/Player/Run_Final",
        "Assets/Models/Player/Attack_Final", "Assets/Models/Player/Diying_Final",
        "Assets/Models/Player/Dodge_Final", "Assets/Models/Player/Hanging_Idle_Final",
        "Assets/Models/Player/Jump_Final"];
    var mixer;
    var actions;
    var AnimacionActual = 8;
    var RotacionActual = 0;
    var PosX = 0;
    var PosZ = 0;

    const loader = new FBXLoader();
        loader.load( 'Assets/Models/Player/Player_Idle.fbx', function ( object ) {
            mixer = new THREE.AnimationMixer( object );
            actions = [];
            object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = false;
                child.material.side = THREE.DoubleSide;
             }
            } );
            //object.scale.set(0.05, 0.05, 0.05);
            //object.position.x = 25;
            //object.position.y = 5;
            //object.position.z = 5;
            object.name = "player";
            Escenario.GetPraderaScene().add( object );
            loadNextAnim(loader);
    } );

    function loadNextAnim(loader)
    {
        const anim = animations.pop();
        loader.load( `${anim}.fbx`, function ( object ) {
        const action = mixer.clipAction( object.animations[ 0 ] );
        actions.push(action);
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = false;
                child.material.side = THREE.DoubleSide;
            }
        } );
        //object.scale.set(0.05, 0.05, 0.05);
        object.name = "player";
        Escenario.GetPraderaScene().add( object );
        if (animations.length>0){
            loadNextAnim(loader);
        }
        } );
    }

    function playAnimation(index){
        if(index != AnimacionActual)
        {
            mixer.stopAllAction();
            const action = actions[index];
            action.weight = 1;
            action.fadeIn(0.5);
            action.play();
        }
    }

    function onKeyDown(event) {
		keys[String.fromCharCode(event.keyCode)] = true;
	}
	function onKeyUp(event) {
		keys[String.fromCharCode(event.keyCode)] = false;
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

        if (keys["W"]){
            playAnimation(5);
            AnimacionActual = 5;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = 0 * 3.1416 / 180;
            PosZ += 50 * delta;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            RotacionActual = Escenario.GetPraderaScene().getObjectByName("player").rotation.y;
        } else if (keys["A"]){
            playAnimation(5);
            AnimacionActual = 5;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = 90 * 3.1416 / 180;
            PosX += 50 * delta;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
            RotacionActual = Escenario.GetPraderaScene().getObjectByName("player").rotation.y;
        } else if (keys["S"]){
            playAnimation(5);
            AnimacionActual = 5;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = 180 * 3.1416 / 180;
            PosZ -= 50 * delta;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            RotacionActual = Escenario.GetPraderaScene().getObjectByName("player").rotation.y;
        } else if (keys["D"]){
            playAnimation(5);
            AnimacionActual = 5;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = 270 * 3.1416 / 180;
            PosX -= 50 * delta;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
            RotacionActual = Escenario.GetPraderaScene().getObjectByName("player").rotation.y;
        } else if (keys["W"] == false || keys["A"] == false || keys["S"] == false || keys["D"] == false){
            playAnimation(6);
            AnimacionActual = 6;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = RotacionActual;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
        }
        if ( mixer ) mixer.update( delta );
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        stats.update();
        Escenario.RainUpdate();
        //renderer.render(Escenario.GetTestScene(), Camara.GetCamera());
        //Pradera primer mapa
        renderer.render(Escenario.GetPraderaScene(), Camara.GetCamera());
        //renderer.render(Escenario.GetPantanoScene(), Camara.GetCamera());
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();