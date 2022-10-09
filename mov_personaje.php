<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movimiento de Personaje</title>
</head>
    <style>
        html, body {
            margin: 0;
            height: 100%;
        }
        #c {
            width: 100%;
            height: 100%;
            display: block;
        }
    </style>
<body>
    
    <canvas id="c"></canvas>


    <script type="importmap">
		{
			"imports": {
				"three": "/PWGW/node_modules/three/build/three.module.js"
			}
		}
	</script>
    
    <script type="module">
        import * as THREE from 'three';
        import {OrbitControls} from '/PWGW/node_modules/three/examples/jsm/controls/OrbitControls.js';
        import {FBXLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/FBXLoader.js';

        function main()
        {
            var width = window.innerWidth;
            var height = window.innerHeight;
            const canvas = document.querySelector('#c');
            const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100000);
            
            const light = new THREE.DirectionalLight(0xFFFFFF, 0.4);
            scene.add(light);
            scene.add(light.target);

            const Alight = new THREE.AmbientLight(0xFFFFFF);
            scene.add(Alight);

            const controls = new OrbitControls(camera, canvas);
            controls.target.set(0, 5, 0);
            controls.update();

            document.addEventListener("keydown", onDocumentKeyDown, false);
            function onDocumentKeyDown(event) {
                var keyCode = event.which;
                if (keyCode == 87) {
                    playAnimation(0); //W  Movimiento
                } else if (keyCode == 65) {
                    playAnimation(1); //A  Movimiento
                } else if (keyCode == 83) {
                    playAnimation(2); //S  Movimiento        
                } else if (keyCode == 68) {
                    playAnimation(3); //D  Movimiento          
                } else if (keyCode == 32) {
                    playAnimation(4); //SPACE Salto       
                } else if (keyCode == 69) {
                    playAnimation(5); //E Ataque  
                } else if (keyCode == 81) {
                    playAnimation(6); //Q Esquivar    
                }
            };

            var clock = new THREE.Clock();
            var animations = ["Assets/Models/Player/Player_Idle_Final", "Assets/Models/Player/Player_Run_Final",
            "Assets/Models/Player/Player_Attack_Final", "Assets/Models/Player/Player_Diying_Final",
            "Assets/Models/Player/Player_Dodge_Final", "Assets/Models/Player/Player_Hanging_Idle_Final",
            "Assets/Models/Player/Player_Jump_Final"];
            var mixer;
            var actions;

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
                scene.add( object );
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
                    scene.add( object );
                    if (animations.length>0){
                        loadNextAnim(loader);
                    }
                } );
            }

            function playAnimation(index){
                mixer.stopAllAction();
                const action = actions[index];
                action.weight = 1;
                action.fadeIn(0.5);
                action.play();
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
                    camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    camera.updateProjectionMatrix();
                }
                renderer.render(scene, camera);
                const delta = clock.getDelta();
                if ( mixer ) mixer.update( delta );
                requestAnimationFrame(render);
            }

            requestAnimationFrame(render);
        }
    main();
    </script>
</body>
</html>