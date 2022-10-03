import * as THREE from 'three';
import {Cameraa} from '/PWGW/js/camera.js';
import {Audioo} from '/PWGW/js/audio.js';
import {Scenee} from '/PWGW/js/scene.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';
import {FBXLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';

function main()
{
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var Escenario = new Scenee();
    var Camara = new Cameraa(45, 2, 0.1, 100000);

    const clock = new THREE.Clock();
    
    let mixerPersonaje;
    let mixer = new Array();    
    //CreateModelTestScene("Assets/Models/PersonajeTest/Running.fbx", 5, 5, 5, 0.04, 0, 0, 0);
    //CreateModelTestScene("Assets/Models/Player/Player_Attack.fbx", 5, 5, 5, 0.05, 0, 0, 0);
    //CreateModelTestScene("Assets/Models/Player/Player_Diying.fbx", 10, 5, 5, 0.05, 0, 0, 0);
    //CreateModelTestScene("Assets/Models/Player/Player_Dodge.fbx", 15, 5, 5, 0.05, 0, 0, 0);
    //CreateModelTestScene("Assets/Models/Player/Player_Hanging_Idle.fbx", 20, 5, 5, 0.05, 0, 0, 0);
    CreateModelTestScene("Assets/Models/Player/Player_Idle.fbx", 25, 5, 5, 0.05, 0, 0, 0);
    //CreateModelTestScene("Assets/Models/Player/Player_Jump.fbx", 30, 5, 5, 0.05, 0, 0, 0);
    CreateModelTestScene("Assets/Models/Player/Player_Run.fbx", 35, 5, 5, 0.05, 0, 0, 0);

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            //Escenario.GetTestScene().remove(a); //W  Movimiento
        } else if (keyCode == 65) {
           // cube.position.y -= ySpeed; //A  Movimiento
        } else if (keyCode == 83) {
           // cube.position.y -= ySpeed; //S  Movimiento        
        } else if (keyCode == 68) {
           // cube.position.y -= ySpeed; //D  Movimiento          
        } else if (keyCode == 32) {
           // cube.position.y -= ySpeed; //SPACE Salto       
        } else if (keyCode == 69) {
           // cube.position.y -= ySpeed; //E Ataque  
        } else if (keyCode == 81) {
           // cube.position.y -= ySpeed; //Q Esquivar    
        }
    };

    Escenario.InitScene();
    Escenario.PantanoScene();
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

    function CreateModelTestScene(model, posx, posy, posz, scale, rotx, roty, rotz)
    {
        const loader = new FBXLoader();
	    loader.load( model, function ( object ) {
        mixerPersonaje = new THREE.AnimationMixer( object );
	    const action = mixerPersonaje.clipAction( object.animations[ 0 ] );
	    action.play();
	    object.traverse( function ( child ) {
		    if ( child.isMesh ) {
			    child.castShadow = true;
			    child.receiveShadow = true;
			    }
		    } );
	    object.scale.set( scale, scale, scale);
	    object.rotation.x = rotx;
        object.rotation.y = roty;
        object.rotation.z = rotz;
	    object.position.x = posx;
	    object.position.y = posy;
	    object.position.z = posz;
        mixer.push(mixerPersonaje);
        object.name = name;
	    Escenario.GetTestScene().add(object);
	    } );   
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
		if ( mixer[0] ) {mixer[0].update( delta );}
        if ( mixer[1] ) {mixer[1].update( delta );} 
        if ( mixer[2] ) {mixer[2].update( delta );}
        if ( mixer[3] ) {mixer[3].update( delta );} 
        if ( mixer[4] ) {mixer[4].update( delta );}
        if ( mixer[5] ) {mixer[5].update( delta );}
        if ( mixer[6] ) {mixer[6].update( delta );}
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        stats.update();
        Escenario.RainUpdate();
        renderer.render(Escenario.GetTestScene(), Camara.GetCamera());
        //renderer.render(Escenario.GetPantanoScene(), Camara.GetCamera());
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();