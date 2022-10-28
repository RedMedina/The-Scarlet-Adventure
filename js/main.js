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
    var Camara = new Cameraa(45, 2, 0.1, 1000000);

    const clock = new THREE.Clock();
    
    var keys = {};
    var mousekeys = [];

    document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);

    Escenario.InitScene();
    Escenario.PantanoScene();
    Escenario.PraderaScene();
    Escenario.NieveScene();
    Escenario.Rain();
    Escenario.Snow();

    var Obsidiana1 = new Audioo();
    Obsidiana1.create();
    Camara.GetCamera().add(Obsidiana1.getListener());
    //Obsidiana1.Sound("Assets/BGM/Obsidian1.mp3");
    //Obsidiana1.Stop();
    
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

    const controls = new OrbitControls(Camara.GetCamera(), canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    var leavesMateriala = [];
    CreatePasto(12000, -2400, 7000, 30, 25, 30, 170, 120);
    CreatePasto(12000, 4300, 7000, 30, 25, 30, 170, 120);
    CreatePasto(12000,  300, -6600, 30, 25, 30, 170, 120);
    CreatePasto(12000, -7300, -3000, 30, 25, 30, 110, 120);

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
            object.name = "player";
            object.rotation.y = 180 * 3.1416 / 180;
            object.position.x = 1000;
            object.position.y = 200;
            object.position.z = 8550;
            Escenario.GetPraderaScene().add( object );
            Escenario.GetPantanoScene().add( object );
            Escenario.GetNieveScene().add( object );
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
        object.name = "player";
        Escenario.GetPraderaScene().add( object );
        Escenario.GetPantanoScene().add( object );
        Escenario.GetNieveScene().add( object );
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
        } else if (keys["%"] /*<-*/){ 
            //Camara.GetCamera().rotation.y += (30 * 3.1416 / 180) * delta;
        } else if (keys["'"] /*->*/){ 
            //Camara.GetCamera().rotation.y -= (30 * 3.1416 / 180) * delta;
        } else if (keys["&"] /*^*/){ 
            //Camara.GetCamera().rotation.x -= (30 * 3.1416 / 180) * delta;
        } else if (keys["("] /*V*/){ 
            //Camara.GetCamera().rotation.x += (30 * 3.1416 / 180) * delta;
        } else if (keys["W"] == false || keys["A"] == false || keys["S"] == false || keys["D"] == false){
            playAnimation(6);
            AnimacionActual = 6;
            Escenario.GetPraderaScene().getObjectByName("player").rotation.y = RotacionActual;
            Escenario.GetPraderaScene().getObjectByName("player").position.x = PosX;
            Escenario.GetPraderaScene().getObjectByName("player").position.z = PosZ;
        }
        //Camara.GetCamera().position.set(PosX, 140, PosZ - 340);
        if ( mixer ) mixer.update( delta );
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        stats.update();
        Escenario.RainUpdate();
        Escenario.LodoUpdate();
        const time = Date.now() * 0.00005;
        Escenario.SnowUpdate(time);
        //renderer.render(Escenario.GetTestScene(), Camara.GetCamera());
        //Pradera primer mapa
        //renderer.render(Escenario.GetPraderaScene(), Camara.GetCamera());
        //renderer.render(Escenario.GetPantanoScene(), Camara.GetCamera());
        renderer.render(Escenario.GetNieveScene(), Camara.GetCamera());
        leavesMateriala[0].uniforms.time.value = clock.getElapsedTime();
        leavesMateriala[0].uniformsNeedUpdate = true;
        leavesMateriala[1].uniforms.time.value = clock.getElapsedTime();
        leavesMateriala[1].uniformsNeedUpdate = true;
        leavesMateriala[2].uniforms.time.value = clock.getElapsedTime();
        leavesMateriala[2].uniformsNeedUpdate = true;
        leavesMateriala[3].uniforms.time.value = clock.getElapsedTime();
        leavesMateriala[3].uniformsNeedUpdate = true;
        
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();