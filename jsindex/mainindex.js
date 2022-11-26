import * as THREE from 'three';
import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {TerrainIndex} from '/PWGW/jsindex/terrain_index.js';
import Stats from '/PWGW/node_modules/three/examples/jsm/libs/stats.module.js';
import {Lensflare, LensflareElement} from '/PWGW/js/lensflare.js';
import { Water } from '/PWGW/node_modules/three/examples/jsm/objects/Water.js';

function main()
{

    var width = window.innerWidth;
    var height = window.innerHeight;
    var target = {x: width/2, y: height/2};
    var largeHeader = document.getElementById('large-header');
    largeHeader.style.height = height+'px';

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100000);
    camera.position.set(-60, 35, 362);
    const clock = new THREE.Clock();

    const light = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    light.castShadow = true;
    light.shadowCameraLeft = -590;
    light.shadowCameraRight = 590;
    light.shadowCameraTop = 595;
    light.shadowCameraBottom = -590;
    light.shadow.mapSize.x = 2048;
    light.shadow.mapSize.y = 6048;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 2000;
    scene.add(light);
    scene.add(light.target);
    light.position.set(20, 90, 0);
    let rotationLight = 0;
    let RotationSky = 0;

    let intensityAmbientLight = 1;
    let intensityL = true;
    const Alight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(Alight);

    //const helper = new THREE.CameraHelper( light.shadow.camera );
    //scene.add( helper );

    var skyGeo = new THREE.SphereGeometry(10000, 25, 25);
    var skyGeo2 = new THREE.SphereGeometry(10000, 25, 25);
    var loader  = new THREE.TextureLoader();
    var texture = loader.load( 'Assets/Images/skyboxDay.png' );
    var material = new THREE.MeshLambertMaterial ({ 
        map: texture, transparent: true
    });
    let sky = new THREE.Mesh(skyGeo, material);
    sky.material.side = THREE.BackSide;
    scene.add( sky );

    var Terreno = new TerrainIndex();
    Terreno.MultitextureTerrain("Assets/Images/Ground3.jpg", "Assets/Images/Ground4.jpg", "Assets/Images/Ground4.jpg", "Assets/Images/AlturasIndex3.png", "Assets/Images/BlendmapIndex3.png");
    scene.add(Terreno.GetPlane());

    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load( 'Assets/Images/LensFlare.png' );
    const textureFlare3 = textureLoader.load( 'Assets/Images/lensflare3.png' );
    const Pointlight = new THREE.PointLight( 0xffffff, 1.5, 2000 );
    Pointlight.color.setHSL( 0.58, 1.0, 1 );
    Pointlight.position.set( 1450, 450, -3000 );
    scene.add( Pointlight );
    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, Pointlight.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
    Pointlight.add( lensflare );

    let water;
    const waterGeometry = new THREE.PlaneGeometry( 650, 750 );
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
    scene.add( water );

    let stats = new Stats();
    document.body.appendChild( stats.domElement );
    
    const axesHelper = new THREE.AxesHelper( 50 );
    //scene.add( axesHelper );
    //groundMesh.add(axesHelper);

    const loadingManager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        
	} );

    loadingManager.onLoad = function()
    {
        $("#loading-screen").remove();
    }

    /*RendericeModel("Assets/Models/Arboles_Inicio/Arbol2.glb", -140, 5, 5, 10);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol2.glb", 10, 5, 5, 10);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol2.glb", -250, 5, 5, 10);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol2.glb", -80, 5, 5, 10);*/

    Load3dModel("Assets/Models/Arboles_Inicio/Arbol2.glb", (object)=>{ //Arbol_2
        object.scale.set(10, 10, 10);

        var arbol2 = object.clone();
        arbol2.position.set(-140, 5, 5);

        var arbol3 = object.clone();
        arbol3.position.set(10, 5, 5);

        var arbol4 = object.clone();
        arbol4.position.set(-250, 5, 5);

        object.position.set(-80, 5, 5);

        scene.add( object );
        scene.add( arbol2 );
        scene.add( arbol3 );
        scene.add( arbol4 );
    });

    /*RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -170, 5, 130, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -20, 5, 50, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -100, 5, 90, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -160, 5, 20, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -70, 5, 40, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -170, 5, 60, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -40, 5, 70, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  20, 5, 70, 19.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  80, 5, 5, 19.7);*/

    Load3dModel("Assets/Models/Arboles_Inicio/Arbol3.glb", (object)=>{ //Arbol_3
        object.scale.set(19.7, 19.7, 19.7);

        var arbol2 = object.clone();
        arbol2.position.set(-170, 5, 130);

        var arbol3 = object.clone();
        arbol3.position.set(-20, 5, 50);

        var arbol4 = object.clone();
        arbol4.position.set(-100, 5, 90);

        var arbol5 = object.clone();
        arbol5.position.set(-160, 5, 20);
        
        var arbol6 = object.clone();
        arbol6.position.set(-70, 5, 40);

        var arbol7 = object.clone();
        arbol7.position.set(-170, 5, 60);

        var arbol8 = object.clone();
        arbol8.position.set(-40, 5, 70);

        var arbol9 = object.clone();
        arbol9.position.set(20, 5, 70);

        object.position.set(80, 5, 5);

        scene.add( object );
        scene.add( arbol2 );
        scene.add( arbol3 );
        scene.add( arbol4 );
        scene.add( arbol5 );
        scene.add( arbol6 );
        scene.add( arbol7 );
        scene.add( arbol8 );
        scene.add( arbol9 );
    });

    /*RendericeModel("Assets/Models/Flores/flower2.glb",  -30, 5, 100, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -50, 5, 100, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -70, 5, 70, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -90, 5, 120, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -10, 5, 110, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -120, 5, 110, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -130, 5, 80, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -140, 5, 90, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -150, 5, 100, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -90, 5, 50, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -60, 5, 20, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -50, 5, 80, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -20, 5, 20, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -10, 5, 100, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -170, 5, 100, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -190, 5, 120, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -140, 5, 80, 19.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -150, 5, 130, 19.7);*/

    Load3dModel("Assets/Models/Flores/flower2.glb", (object)=>{ //Flores
        object.scale.set(19.7, 19.7, 19.7);

        var flor2 = object.clone();
        flor2.position.set(-30, 5, 100);

        var flor3 = object.clone();
        flor3.position.set(-50, 5, 100);

        var flor4 = object.clone();
        flor4.position.set(-70, 5, 70);

        var flor5 = object.clone();
        flor5.position.set(-90, 5, 120);

        var flor6 = object.clone();
        flor6.position.set(-10, 5, 110);

        var flor7 = object.clone();
        flor7.position.set(-120, 5, 110);

        var flor8 = object.clone();
        flor8.position.set(-130, 5, 80);

        var flor9 = object.clone();
        flor9.position.set(-140, 5, 90);

        var flor10 = object.clone();
        flor10.position.set(-150, 5, 100);

        var flor11 = object.clone();
        flor11.position.set(-90, 5, 50);

        var flor12 = object.clone();
        flor12.position.set(-60, 5, 20);
        
        var flor13 = object.clone();
        flor13.position.set(-50, 5, 80);

        var flor14 = object.clone();
        flor14.position.set(-20, 5, 20);

        var flor15 = object.clone();
        flor15.position.set(-10, 5, 100);

        var flor16 = object.clone();
        flor16.position.set(-170, 5, 100);
        
        var flor17 = object.clone();
        flor17.position.set(-190, 5, 120);

        var flor18 = object.clone();
        flor18.position.set(-140, 5, 80);

        object.position.set(-150, 5, 130);

        scene.add(object);
        scene.add(flor2);
        scene.add(flor3);
        scene.add(flor4);
        scene.add(flor5);
        scene.add(flor6);
        scene.add(flor7);
        scene.add(flor8);
        scene.add(flor9);
        scene.add(flor10);
        scene.add(flor11);
        scene.add(flor12);
        scene.add(flor13);
        scene.add(flor14);
        scene.add(flor15);
        scene.add(flor16);
        scene.add(flor17);
        scene.add(flor18);
    });

    RendericeModel("Assets/Models/Arbusto/planta.glb",  -98, 2, 295, 40);

    RendericeModel("Assets/Models/Roca/roca3.glb",  -50, 2, 230, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  -90, 2, 170, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb", -120, 2, 240, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  -140, 5, 40, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  20, 5, -30, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  -50, 5, 30, 10);

    RendericeModel("Assets/Models/Roca/RocaGrande.glb",  65, 100, 270, 13);


    //const map = new THREE.TextureLoader().load( 'Assets/Images/mountain.png' );
    //const material1 = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false, lights: true } );
    //const sprite = new THREE.Sprite( material1 );
    //sprite.scale.x = 1000;
    //sprite.scale.y = 1000;
    //sprite.scale.z = 1000;
    //scene.add( sprite );

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

    const leavesMateriala = new THREE.ShaderMaterial({
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

    const instanceNumber = 89000;
    const dummy = new THREE.Object3D();

    const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
    geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

    const instancedMesh = new THREE.InstancedMesh( geometry, leavesMateriala, instanceNumber );
    instancedMesh.position.y = 7;
    instancedMesh.position.z = -60;
    instancedMesh.scale.x = 4;
    instancedMesh.scale.y = 2.5;
    instancedMesh.scale.z = 4;
    instancedMesh.receiveShadow = true;
    scene.add( instancedMesh );

    // Position and scale the grass blade instances randomly.

    for ( let i=0 ; i<instanceNumber ; i++ ) {

        dummy.position.set(
        ( Math.random() - 0.5 ) * 170,
        0,
        ( Math.random() - 0.5 ) * 100
    );
    
    dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
    
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.receiveShadow = true;
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt( i, dummy.matrix );

    }

    let listener = new THREE.AudioListener(loadingManager);
    //camera.add( listener );
    //var sound = new THREE.Audio( listener ); 
    const sound = new THREE.PositionalAudio( listener );
    const sound2 = new THREE.PositionalAudio( listener );
    const audioLoader = new THREE.AudioLoader(loadingManager);
    const audioLoader2 = new THREE.AudioLoader(loadingManager);
    audioLoader.load( "Assets/BGM/TitleScreen.mp3", function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.play();
        sound.setVolume( VolumenIndex * 0.01 );
    });
    Terreno.GetPlane().add(sound);
    audioLoader2.load( "Assets/BGM/WaterSound.mp3", function( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setLoop( true );
        sound2.play();
        sound2.setVolume( VolumenIndex * 0.01 );
    });
    water.add(sound2);   

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    function SetSound()
    {
        var VolumenFinal = VolumenIndex * 0.01;
        sound.setVolume( VolumenFinal );
        sound2.setVolume( VolumenFinal );
    }

    AccionesMenuu.Sound = SetSound;

    function Load3dModel(model, onLoadCallback)
    {
        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.load(model, (gltf) => {
            gltf.scene.traverse((child)=>{
                child.castShadow = true;
                child.receiveShadow = false;
            })
            gltf.scene.frustumCulled = true;
            onLoadCallback(gltf.scene);
        });
    }

    function RendericeModel(obj, x, y, z, scale)
    {
        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.load(obj, (gltf) => {
            gltf.scene.traverse((child)=>{
                child.castShadow = true;
                child.receiveShadow = false;
            })
            gltf.scene.position.x = x;
            gltf.scene.position.y = y;
            gltf.scene.position.z = z;
            gltf.scene.scale.x = scale;
            gltf.scene.scale.y = scale;
            gltf.scene.scale.z = scale;
            gltf.scene.frustumCulled = true;
            scene.add(gltf.scene);
        });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            largeHeader.style.height = height+'px';
        }
        return needResize;
    }

    var frame = 0,
    maxFrame = 100;
    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        var per = frame / maxFrame,
        rotationLight = Math.PI * 2 * per;
        RotationSky < 360 ? RotationSky += 0.0005 : RotationSky = 0;
        
        if (intensityL) {
			intensityAmbientLight += 0.001;
		}
		else {
			intensityAmbientLight -= 0.001;
		}

		if (intensityAmbientLight > 1.0) {
			intensityAmbientLight = 1.0;
			intensityL = false;
		}
		else if (intensityAmbientLight < 0) {
			intensityAmbientLight = 0;
			intensityL = true;
		}
        //Alight.intensity = intensityAmbientLight + 0.2;
        //light.position.set(Math.cos(rotationLight) * 5, Math.sin(rotationLight) * 5, 0);
        frame = (frame + 0.057) % maxFrame;
        leavesMateriala.uniforms.time.value += 1.0 / 60.0;
        leavesMateriala.uniformsNeedUpdate = true;
        sky.rotation.y = RotationSky;
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        stats.update();
    }

    requestAnimationFrame(render);
}

main();