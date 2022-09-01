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

    const groundGeo = new THREE.PlaneGeometry(650, 750, 10, 10);
    let Load = new THREE.TextureLoader();
    let distMap = Load.load("Assets/Images/AlturasInico.png");
    distMap.wrapS = distMap.wrapT = THREE.RepeatWrapping;
    distMap.repeat.set("Assets/Images/AlturasInico.png", "Assets/Images/AlturasInico.png");
    
    const TexturaLoad = new THREE.TextureLoader();
    let Texture = TexturaLoad.load("Assets/Images/Ground3.jpg");
    Texture.wrapS = THREE.RepeatWrapping;
    Texture.wrapT = THREE.RepeatWrapping;
    Texture.magFilter = THREE.NearestFilter;
    const repeats = 25 / 2;
    Texture.repeat.set(repeats, repeats);

    const TexturaLoadNormla = new THREE.TextureLoader();
    let TextureNormal = TexturaLoadNormla.load("Assets/Images/TitleScreenGN.jpg");
    TextureNormal.wrapS = THREE.RepeatWrapping;
    TextureNormal.wrapT = THREE.RepeatWrapping;
    TextureNormal.magFilter = THREE.NearestFilter;
    const repeats2 = 20 / 2;
    TextureNormal.repeat.set(repeats2, repeats2);

    const NormalScale = new THREE.Vector2( 5, 5 );

    const groundMat = new THREE.MeshStandardMaterial({
        map: Texture,
        wireframe: false,
        displacementMap: distMap,
        normalMap: TextureNormal,
        normalScale: NormalScale,
        displacementScale: 0
    });

    let groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = 5;
    groundMesh.rotation.x = Math.PI * -.5;

    scene.add( groundMesh );
    
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

    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol1.glb", 5, 5, 5, 3);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol2.glb", 10, 5, 5, 5);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -100, 5, 275, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -70, 5, 40, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -120, 5, 30, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -135, 5, 0, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb", -55, 5, 0, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -190, 5, 0, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -189, 5, 43, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb", -110, 5, 123, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  154, 5, 0, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",  190, 5, 45, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   83, 5, 43, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   63, 5, 143, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   23, 5, 103, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",   10, 5, 140, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   40, 5, 70, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   80, 5, 210, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   110, 5, 198, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",   40, 5, 230, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",    0, 5, 0, 3);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -220, 5, -130, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -120, 5, -60, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",   -90, 5, -70, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -100, 5, -90, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -200, 5, -120, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",  -240, 5, -70, 3);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -280, 5, -150, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",  -100, 5, 150, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -120, 5, 180, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -140, 5, 190, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -160, 5, 220, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  0, 5, -180, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  40, 5, -270, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  20, 5, -270, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  60, 5, -240, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  100, 5, -140, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  140, 5, -160, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  160, 5, -130, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  130, 5, -100, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -10, 5, 20, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -70, 5, 40, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -30, 5, 60, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  -60, 5, 80, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  80, 5, -280, 15.7);
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  100, 5, -270, 15.7);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol3.glb",  90, 5, -260, 15.7);
    
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb",   0, 5, 105, 3);
    RendericeModel("Assets/Models/Arboles_Inicio/Arbol4.glb", -80, 5, 125, 3);
    
    //RendericeModel("Assets/Models/Arboles_Inicio/Arbol5.glb", -5, 5, 5, 5.3);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -30, 5, 270, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -50, 5, 240, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -70, 5, 210, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -90, 5, 250, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -10, 5, 230, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -120, 5, 250, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -130, 5, 210, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -140, 5, 220, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -150, 5, 230, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -90, 5, 100, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -60, 5, 130, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -50, 5, 140, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -20, 5, 90, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  -10, 5, 120, 15.7);
    RendericeModel("Assets/Models/Flores/flower2.glb",  0, 5, 125, 15.7);

    RendericeModel("Assets/Models/Roca/roca3.glb",  20, 5, 190, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  -90, 5, 170, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb", 40, 5, 0, 10);
    RendericeModel("Assets/Models/Roca/roca3.glb",  -140, 5, 40, 10);


    const map = new THREE.TextureLoader().load( 'Assets/Images/mountain.png' );
    const material1 = new THREE.SpriteMaterial( { map: map, sizeAttenuation: false, lights: true } );
    const sprite = new THREE.Sprite( material1 );
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

    const instanceNumber = 495000;
    const dummy = new THREE.Object3D();

    const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
    geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

    const instancedMesh = new THREE.InstancedMesh( geometry, leavesMateriala, instanceNumber );
    instancedMesh.position.y = 6;
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
        ( Math.random() - 0.5 ) * 170
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
    const audioLoader = new THREE.AudioLoader(loadingManager);
    audioLoader.load( "Assets/BGM/TitleScreen.mp3", function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.play();
        sound.setVolume( 0.0 );
    });
    groundMesh.add(sound);   

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();


    function RendericeModel(obj, x, y, z, scale)
    {
        const gltfLoader = new THREE.GLTFLoader(loadingManager);
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
        RotationSky < 360 ? RotationSky += 0.0003 : RotationSky = 0;
        
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
        leavesMateriala.uniforms.time.value = clock.getElapsedTime();
        leavesMateriala.uniformsNeedUpdate = true;
        sky.rotation.y = RotationSky;
    }

    requestAnimationFrame(render);
}

main();