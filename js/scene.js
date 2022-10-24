import * as THREE from 'three';
import {Lightt} from '/PWGW/js/light.js';
import {Terrain} from '/PWGW/js/terrain.js';
import {skydome} from '/PWGW/js/skydome.js';
import {Lensflare, LensflareElement} from '/PWGW/js/lensflare.js';
import {GLTFLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {Mud} from '/PWGW/js/lodo.js';

class Scenee
{
    CreateScene()
    {
        const scene = new THREE.Scene();
        return scene;
    }

    InitScene()
    {
        this.TestScene = new THREE.Scene();
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0xFFFFFF);
        this.TestScene.add(Luces.GetAmbientLight());
        this.TestScene.add(Luces.GetDirectionalLight());
        this.TestScene.add(Luces.GetDirectionalLight().target);
        Luces.GetDirectionalLight().shadow.mapSize.width = 512;
        Luces.GetDirectionalLight().shadow.mapSize.height = 512;
        Luces.GetDirectionalLight().shadow.camera.near = 0.5;
        Luces.GetDirectionalLight().shadow.camera.far = 500;

        const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
        const sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xFFFFFF, shininess:8.5} );
        const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphere.castShadow = true; //default is false
        sphere.receiveShadow = true; //default
        sphere.position.y = 10;
        this.TestScene.add( sphere );

        const helper = new THREE.CameraHelper( Luces.GetDirectionalLight().shadow.camera );
        this.TestScene.add( helper );

        var Terreno = new Terrain();
        Terreno.MultitextureTerrain("Assets/Images/grass.jpg", "Assets/Images/Ground1.jpg", "Assets/Images/Ground2.jpg", "Assets/Images/Alts.png", "Assets/Images/Blend1.png", 20, 100, 100);
        this.TestScene.add(Terreno.GetPlane());

        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        this.TestScene.add(SkydomeT.Render());

        const textureLoader = new THREE.TextureLoader();
        const textureFlare0 = textureLoader.load( 'Assets/Images/LensFlare.png' );
        const textureFlare3 = textureLoader.load( 'Assets/Images/lensflare3.png' );
        this.Pointlight = new THREE.PointLight( 0xffffff, 1.5, 2000 );
        this.Pointlight.color.setHSL( 0.58, 1.0, 0.95 );
        this.Pointlight.position.set( 1000, 0, 0 );
        this.TestScene.add( this.Pointlight );
        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, this.Pointlight.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
        this.Pointlight.add( lensflare );
    }

    PantanoScene()
    {
        this.Pantano = new THREE.Scene();
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0x757575);
        this.Pantano.add(Luces.GetAmbientLight());
        this.Pantano.add(Luces.GetDirectionalLight());
        this.Pantano.add(Luces.GetDirectionalLight().target);
        Luces.GetDirectionalLight().shadow.mapSize.width = 512;
        Luces.GetDirectionalLight().shadow.mapSize.height = 512;
        Luces.GetDirectionalLight().shadow.camera.near = 0.5;
        Luces.GetDirectionalLight().shadow.camera.far = 500;

        const helper = new THREE.CameraHelper( Luces.GetDirectionalLight().shadow.camera );
        this.Pantano.add( helper );

        var Terreno = new Terrain();
        Terreno.MultitextureTerrain("Assets/Images/grass.jpg", "Assets/Images/Ground1.jpg", "Assets/Images/Ground2.jpg", "Assets/Images/Alts.png", "Assets/Images/Blend1.png", 1700, 18000, 18000);
        Terreno.GetPlane().position.y = -720;
        this.Pantano.add(Terreno.GetPlane());

        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        this.Pantano.add(SkydomeT.Render());

        this.Lodo = new Mud();
        this.Lodo.CreateMud('Assets/Images/skyboxDay.png', "Assets/Pantano/lodo.jpg", "Assets/Pantano/lodoNormal.png");
        this.Pantano.add(this.Lodo.GetMud());
        this.tiempo = 0;
    }

    PraderaScene()
    {
        //Incia la escena
        this.Pradera = new THREE.Scene();

        //Luces
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0xFFFFFF);
        this.Pradera.add(Luces.GetAmbientLight());
        this.Pradera.add(Luces.GetDirectionalLight());
        this.Pradera.add(Luces.GetDirectionalLight().target);
        Luces.GetDirectionalLight().shadow.mapSize.width = 512;
        Luces.GetDirectionalLight().shadow.mapSize.height = 512;
        Luces.GetDirectionalLight().shadow.camera.near = 0.5;
        Luces.GetDirectionalLight().shadow.camera.far = 10000;

        //Lensflare
        const textureLoader = new THREE.TextureLoader();
        const textureFlare0 = textureLoader.load( 'Assets/Images/LensFlare.png' );
        const textureFlare3 = textureLoader.load( 'Assets/Images/lensflare3.png' );
        this.Pointlight = new THREE.PointLight( 0xffffff, 1.5, 2000 );
        this.Pointlight.color.setHSL( 0.58, 1.0, 0.95 );
        this.Pointlight.position.set( -15000, 4000, -20000 );
        this.Pradera.add( this.Pointlight );
        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, this.Pointlight.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
        this.Pointlight.add( lensflare );

        //Help para el día y la noche
        const helper = new THREE.CameraHelper( Luces.GetDirectionalLight().shadow.camera );
        this.Pradera.add( helper );

        //Skydome
        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        this.Pradera.add(SkydomeT.Render());

        //Terreno
        var Terreno = new Terrain();
        Terreno.MultitextureTerrain("Assets/Pradera/Tierra_2.png", "Assets/Pradera/Pasto.jpg", "Assets/Pradera/Tierra.jpg", "Assets/Pradera/Alturas_Pradera.png", "Assets/Pradera/Blendmap_Pradera.png", 2500, 18000, 18000);
        Terreno.GetPlane().position.y = -160;
        this.Pradera.add(Terreno.GetPlane());

        //Modelos

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol3.glb", (object)=>{ //Arbol_1
            object.position.y = 200;
            object.scale.x = 100;
            object.scale.y = 100;
            object.scale.z = 100;
            
            var arbol2 = object.clone();
            arbol2.position.x = 100;
            arbol2.position.z = 6800;

            var arbol3 = object.clone();
            arbol3.position.x = -50;
            arbol3.position.z = 6200;

            var arbol4 = object.clone();
            arbol4.position.x = 50;
            arbol4.position.z = 5600;

            var arbol5 = object.clone();
            arbol5.position.x = -80;
            arbol5.position.z = 5000;

            var arbol6 = object.clone();
            arbol6.position.x = -380;
            arbol6.position.z = 4400;

            var arbol7 = object.clone();
            arbol7.position.x = -780;
            arbol7.position.z = 3800;

            var arbol8 = object.clone();
            arbol8.position.x = -1100;
            arbol8.position.z = 6800;

            var arbol9 = object.clone();
            arbol9.position.x = -1050;
            arbol9.position.z = 6200;

            var arbol10 = object.clone();
            arbol10.position.x = -950;
            arbol10.position.z = 5600;

            var arbol11 = object.clone();
            arbol11.position.x = -1080;
            arbol11.position.z = 5000;

            var arbol12 = object.clone();
            arbol12.position.x = -1380;
            arbol12.position.z = 4400;

            var arbol13 = object.clone();
            arbol13.position.x = -1780;
            arbol13.position.z = 3800;

            var arbol14 = object.clone();
            arbol14.position.x = -2100;
            arbol14.position.z = 6800;

            var arbol15 = object.clone();
            arbol15.position.x = -2050;
            arbol15.position.z = 6200;

            var arbol16 = object.clone();
            arbol16.position.x = -1950;
            arbol16.position.z = 5600;

            var arbol17 = object.clone();
            arbol17.position.x = -2080;
            arbol17.position.z = 5000;

            var arbol18 = object.clone();
            arbol18.position.x = -2380;
            arbol18.position.z = 4400;

            var arbol19 = object.clone();
            arbol19.position.x = -2780;
            arbol19.position.z = 3800;

            var arbol20 = object.clone();
            arbol20.position.x = -3100;
            arbol20.position.z = 6800;

            var arbol21 = object.clone();
            arbol21.position.x = -3050;
            arbol21.position.z = 6200;

            var arbol22 = object.clone();
            arbol22.position.x = -2950;
            arbol22.position.z = 5600;

            var arbol23 = object.clone();
            arbol23.position.x = -4100;
            arbol23.position.z = 6800;

            var arbol24 = object.clone();
            arbol24.position.x = -4050;
            arbol24.position.z = 6200;

            var arbol25 = object.clone();
            arbol25.position.x = -3950;
            arbol25.position.z = 5600;

            var arbol26 = object.clone();
            arbol26.position.x = -100;
            arbol26.position.z = 8800;

            var arbol27 = object.clone();
            arbol27.position.x = -70;
            arbol27.position.z = 8000;

            var arbol28 = object.clone();
            arbol28.position.x = -1100;
            arbol28.position.z = 8800;

            var arbol29 = object.clone();
            arbol29.position.x = -1070;
            arbol29.position.z = 8000;

            var arbol30 = object.clone();
            arbol30.position.x = -2100;
            arbol30.position.z = 8800;

            var arbol31 = object.clone();
            arbol31.position.x = -2070;
            arbol31.position.z = 8000;

            var arbol32 = object.clone();
            arbol32.position.x = -3100;
            arbol32.position.z = 8800;

            var arbol33 = object.clone();
            arbol33.position.x = -3070;
            arbol33.position.z = 8000;

            var arbol34 = object.clone();
            arbol34.position.x = -4100;
            arbol34.position.z = 8800;

            var arbol35 = object.clone();
            arbol35.position.x = -4070;
            arbol35.position.z = 8000;

            var arbol36 = object.clone();
            arbol36.position.x = 1920;
            arbol36.position.z = 8200;

            var arbol37 = object.clone();
            arbol37.position.x = 1900;
            arbol37.position.z = 7600;

            var arbol38 = object.clone();
            arbol38.position.x = 2100;
            arbol38.position.z = 6000;

            var arbol39 = object.clone();
            arbol39.position.x = 2920;
            arbol39.position.z = 8200;

            var arbol40 = object.clone();
            arbol40.position.x = 2900;
            arbol40.position.z = 7600;

            var arbol41 = object.clone();
            arbol41.position.x = 3100;
            arbol41.position.z = 6000;

            var arbol42 = object.clone();
            arbol42.position.x = 3900;
            arbol42.position.z = 7600;

            var arbol43 = object.clone();
            arbol43.position.x = 4100;
            arbol43.position.z = 8200;

            object.position.z = 7300;
            
            this.Pradera.add(object);
            this.Pradera.add(arbol2);
            this.Pradera.add(arbol3);
            this.Pradera.add(arbol4);
            this.Pradera.add(arbol5);
            this.Pradera.add(arbol6);
            this.Pradera.add(arbol7);
            this.Pradera.add(arbol8);
            this.Pradera.add(arbol9);
            this.Pradera.add(arbol10);
            this.Pradera.add(arbol11);
            this.Pradera.add(arbol12);
            this.Pradera.add(arbol13);
            this.Pradera.add(arbol14);
            this.Pradera.add(arbol15);
            this.Pradera.add(arbol16);
            this.Pradera.add(arbol17);
            this.Pradera.add(arbol18);
            this.Pradera.add(arbol19);
            this.Pradera.add(arbol20);
            this.Pradera.add(arbol21);
            this.Pradera.add(arbol22);
            this.Pradera.add(arbol23);
            this.Pradera.add(arbol24);
            this.Pradera.add(arbol25);
            this.Pradera.add(arbol26);
            this.Pradera.add(arbol27);
            this.Pradera.add(arbol28);
            this.Pradera.add(arbol29);
            this.Pradera.add(arbol30);
            this.Pradera.add(arbol31);
            this.Pradera.add(arbol32);
            this.Pradera.add(arbol33);
            this.Pradera.add(arbol35);
            this.Pradera.add(arbol36);
            this.Pradera.add(arbol37);
            this.Pradera.add(arbol38);
            this.Pradera.add(arbol39);
            this.Pradera.add(arbol40);
            this.Pradera.add(arbol41);
            this.Pradera.add(arbol42);
            this.Pradera.add(arbol43);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/roca3.glb", (object)=>{ //Roca_1
            object.position.y = 200;
            object.scale.set(100, 100, 100);

            var roca2 = object.clone();
            roca2.position.x = -500;
            roca2.position.z = 6400;

            var roca3 = object.clone();
            roca3.position.x = -1500;
            roca3.position.z = 6400;

            var roca4 = object.clone();
            roca4.position.x = -1780;
            roca4.position.z = 5800;

            var roca5 = object.clone();
            roca5.position.x = -2780;
            roca5.position.z = 6400;

            var roca6 = object.clone();
            roca6.position.x = -2500;
            roca6.position.z = 5800;

            var roca7 = object.clone();
            roca7.position.x = -3780;
            roca7.position.z = 6400;

            var roca8 = object.clone();
            roca8.position.x = -3500;
            roca8.position.z = 5800;

            var roca9 = object.clone();
            roca9.position.x = 2200;
            roca9.position.z = 6800;

            var roca10 = object.clone();
            roca10.position.x = 2700;
            roca10.position.z = 7700;

            var roca11 = object.clone();
            roca11.position.x = 3200;
            roca11.position.z = 6800;

            var roca12 = object.clone();
            roca12.position.x = 3700;
            roca12.position.z = 7700;

            var roca13 = object.clone();
            roca13.position.x = 5700;
            roca13.position.z = 8400;

            var roca14 = object.clone();
            roca14.position.x = 3600;
            roca14.position.z = 2600;

            var roca15 = object.clone();
            roca15.position.x = 3300;
            roca15.position.z = 2000;

            var roca16 = object.clone();
            roca16.position.x = 3300;
            roca16.position.z = -1900;

            var roca17 = object.clone();
            roca17.position.x = 4600;
            roca17.position.z = -1600;

            object.position.x = -780;
            object.position.z = 5800;

            this.Pradera.add(object);
            this.Pradera.add(roca2);
            this.Pradera.add(roca3);
            this.Pradera.add(roca4);
            this.Pradera.add(roca5);
            this.Pradera.add(roca6);
            this.Pradera.add(roca7);
            this.Pradera.add(roca8);
            this.Pradera.add(roca9);
            this.Pradera.add(roca10);
            this.Pradera.add(roca11);
            this.Pradera.add(roca12);
            this.Pradera.add(roca13);
            this.Pradera.add(roca14);
            this.Pradera.add(roca15);
            this.Pradera.add(roca16);
            this.Pradera.add(roca17);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/RocaGrande.glb", (object)=>{ //Roca_2
            object.position.y = 800;
            object.scale.set(70, 70, 70);

            var GRoca2 = object.clone();
            GRoca2.position.x = 400;
            GRoca2.position.z = -5000;

            var GRoca3 = object.clone();
            GRoca3.position.x = -6800;
            GRoca3.position.z = -3000;

            var GRoca4 = object.clone();
            GRoca4.position.x = 2300;
            GRoca4.position.z = 500;
            GRoca4.rotation.y = 90 * 3.1416 / 180;

            object.position.x = -7780;
            object.position.z = 8800;

            this.Pradera.add(object);
            this.Pradera.add(GRoca2);
            this.Pradera.add(GRoca3);
            this.Pradera.add(GRoca4);
        });

        this.Load3dModelGLTF("Assets/Models/Arbusto/planta_conjunto.glb", (object)=>{ //planta_conjunto
            object.position.y = 200;
            object.scale.set(65, 65, 65);

            var flores2 = object.clone();
            flores2.position.x = -1900;
            flores2.position.z = 5800;

            var flores3 = object.clone();
            flores3.position.x = -780;
            flores3.position.z = 6400;

            var flores4 = object.clone();
            flores4.position.x = -1900;
            flores4.position.z = 6400;

            var flores5 = object.clone();
            flores5.position.x = 2800;
            flores5.position.z = 6700;

            var flores6 = object.clone();
            flores6.position.x = 2800;
            flores6.position.z = 6200;

            var flores7 = object.clone();
            flores7.position.x = 3700;
            flores7.position.z = 6700;

            var flores8 = object.clone();
            flores8.position.x = 400;
            flores8.position.z = -6000;

            var flores9 = object.clone();
            flores9.position.x = -6800;
            flores9.position.z = -3000;

            var flores10 = object.clone();
            flores10.position.x = -1800;
            flores10.position.z = -7000;

            var flores11 = object.clone();
            flores11.position.x = 3300;
            flores11.position.z = -2200;

            object.position.x = -780;
            object.position.z = 5800;
            this.Pradera.add(object);
            this.Pradera.add(flores2);
            this.Pradera.add(flores3);
            this.Pradera.add(flores4);
            this.Pradera.add(flores5);
            this.Pradera.add(flores6);
            this.Pradera.add(flores7);
            this.Pradera.add(flores8);
            this.Pradera.add(flores9);
            this.Pradera.add(flores10);
            this.Pradera.add(flores11);
        });

        this.Load3dModelGLTF("Assets/Models/Vallas/vallas.glb", (object)=>{
            object.position.y = 200;
            object.scale.set(50, 50, 50);
            object.rotation.y = 90 * 3.1416 / 180;

            object.position.x = 1700;
            object.position.z = 6500;

            this.Pradera.add(object);
        });
        
        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol2.glb", (object)=>{
            object.position.y = 200;
            object.scale.x = 45;
            object.scale.y = 45;
            object.scale.z = 45;

            var Arbol2 = object.clone();
            Arbol2.position.x = -3000;
            Arbol2.position.z = -5000;

            var Arbol3 = object.clone();
            Arbol3.position.x = -600;
            Arbol3.position.z = -5000;

            var Arbol4 = object.clone();
            Arbol4.position.x = -5600;
            Arbol4.position.z = -3500;

            var Arbol5 = object.clone();
            Arbol5.position.x = -5900;
            Arbol5.position.z = -3000;

            var Arbol6 = object.clone();
            Arbol6.position.x = -5900;
            Arbol6.position.z = -2400;

            var Arbol7 = object.clone();
            Arbol7.position.x = -7400;
            Arbol7.position.z = -2000;

            object.position.x = 8000;
            object.position.z = 8500;

            this.Pradera.add(object);
            this.Pradera.add(Arbol2);
            this.Pradera.add(Arbol3);
            this.Pradera.add(Arbol4);
            this.Pradera.add(Arbol5);
            this.Pradera.add(Arbol6);
            this.Pradera.add(Arbol7);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Hoguera.glb", (object)=>{
            object.position.y = 220;
            object.scale.set(25, 25, 25);

            object.position.x = -6500;
            object.position.z = 6800;
            this.Pradera.add(object);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Antorcha.glb", (object)=>{
            object.position.y = 220;
            object.scale.set(13, 13, 13);

            var Antorcha2 = object.clone();
            Antorcha2.position.x = -5000;
            Antorcha2.position.z = 5800;

            var Antorcha3 = object.clone();
            Antorcha3.position.x = -1000;
            Antorcha3.position.z = -5800;

            var Antorcha4 = object.clone();
            Antorcha4.position.x = -5600;
            Antorcha4.position.z = -2200;

            var Antorcha5 = object.clone();
            Antorcha5.position.x = -5600;
            Antorcha5.position.z = -4200;

            var Antorcha6 = object.clone();
            Antorcha6.position.x = 1800;
            Antorcha6.position.z = 5300;

            var Antorcha7 = object.clone();
            Antorcha7.position.x = 2100;
            Antorcha7.position.z = 4500;

            var Antorcha8 = object.clone();
            Antorcha8.position.x = 2400;
            Antorcha8.position.z = 3800;

            var Antorcha9 = object.clone();
            Antorcha9.position.x = 2750;
            Antorcha9.position.z = 3000;

            var Antorcha10 = object.clone();
            Antorcha10.position.x = 100;
            Antorcha10.position.z = 5300;

            var Antorcha11 = object.clone();
            Antorcha11.position.x = 400;
            Antorcha11.position.z = 4500;

            var Antorcha12 = object.clone();
            Antorcha12.position.x = 700;
            Antorcha12.position.z = 3800;

            var Antorcha13 = object.clone();
            Antorcha13.position.x = 1050;
            Antorcha13.position.z = 3000;

            var Antorcha14 = object.clone();
            Antorcha14.position.x = 5300;
            Antorcha14.position.z = -1000;

            var Antorcha15 = object.clone();
            Antorcha15.position.x = 5300;
            Antorcha15.position.z = 0;

            object.position.x = -8000;
            object.position.z = 5800;

            this.Pradera.add(object);
            this.Pradera.add(Antorcha2);
            this.Pradera.add(Antorcha3);
            this.Pradera.add(Antorcha4);
            this.Pradera.add(Antorcha5);
            this.Pradera.add(Antorcha6);
            this.Pradera.add(Antorcha7);
            this.Pradera.add(Antorcha8);
            this.Pradera.add(Antorcha9);
            this.Pradera.add(Antorcha10);
            this.Pradera.add(Antorcha11);
            this.Pradera.add(Antorcha12);
            this.Pradera.add(Antorcha13);
            this.Pradera.add(Antorcha14);
            this.Pradera.add(Antorcha15);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Tronco.glb", (object)=>{
            object.position.y = 220;
            object.scale.set(25, 25, 25);

            var Tronco = object.clone();
            Tronco.position.x = -7800;
            Tronco.position.z = 7000;

            var Tronco2 = object.clone();
            Tronco2.position.x = -6800;
            Tronco2.position.z = -2200;

            var Tronco3 = object.clone();
            Tronco3.position.x = -1800;
            Tronco3.position.z = -6200;
            Tronco3.rotation.y = 90 * 3.1416 / 180;

            object.rotation.y = 90 * 3.1416 / 180;
            object.position.x = -6500;
            object.position.z = 5800;

            this.Pradera.add(object);
            this.Pradera.add(Tronco);
            this.Pradera.add(Tronco2);
            this.Pradera.add(Tronco3);
        });

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol4.glb", (object)=>{
            object.scale.set(23, 23, 23);
            object.position.y = 200;

            var Arbol2 = object.clone();
            Arbol2.position.x = 2700;
            Arbol2.position.z = 4800;

            var Arbol3 = object.clone();
            Arbol3.position.x = 2700;
            Arbol3.position.z = 3800;

            var Arbol4 = object.clone();
            Arbol4.position.x = 200;
            Arbol4.position.z = 4200;

            var Arbol5 = object.clone();
            Arbol5.position.x = 2700;
            Arbol5.position.z = -1200;

            var Arbol6 = object.clone();
            Arbol6.position.x = 900;
            Arbol6.position.z = 1200;

            var Arbol7 = object.clone();
            Arbol7.position.x = 3700;
            Arbol7.position.z = -1200;

            var Arbol8 = object.clone();
            Arbol8.position.x = 3300;
            Arbol8.position.z = -2200;

            var Arbol9 = object.clone();
            Arbol9.position.x = 4000;
            Arbol9.position.z = -2700;

            var Arbol10 = object.clone();
            Arbol10.position.x = 4300;
            Arbol10.position.z = 1000;

            var Arbol11 = object.clone();
            Arbol11.position.x = 4300;
            Arbol11.position.z = 1600;

            object.position.x = 2700;
            object.position.z = 4800;
            this.Pradera.add(object);
            this.Pradera.add(Arbol2);
            this.Pradera.add(Arbol3);
            this.Pradera.add(Arbol4);
            this.Pradera.add(Arbol5);
            this.Pradera.add(Arbol6);
            this.Pradera.add(Arbol7);
            this.Pradera.add(Arbol8);
            this.Pradera.add(Arbol9);
            this.Pradera.add(Arbol10);
            this.Pradera.add(Arbol11);
        });
    }

    Load3dModelGLTF(model, onLoadCallback)
    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(model, (gltf) => {
            gltf.scene.traverse((child)=>{
                child.castShadow = true;
                child.receiveShadow = false;
            })
            gltf.scene.frustumCulled = true;
            onLoadCallback(gltf.scene);
        });
    }

    Create3DModel(mtl, obj, baseColor, normal, toon, x, y, z)
    {
        const objLoader = new THREE.OBJLoader2();
        objLoader.loadMtl(mtl, null, (materials) => {
          //materials.Material.side = THREE.DoubleSide;
          objLoader.setMaterials(materials);
          objLoader.load(obj, (event) => {
            const Root = event.detail.loaderRootNode;
            Root.position.x = x;
            Root.position.y = y;
            Root.position.z = z;
            this.TestScene.add(Root);
          });
        });
    }

    Rain()
    {
        this.rainCount = 100000;
        let rainBuffer = new THREE.BufferGeometry();
        let posRain = new Float32Array(this.rainCount * 3);
        for (let i = 0; i < (this.rainCount * 3); i += 3) {
            posRain[i] = Math.random() * 24000 - 200;
            posRain[i+1] = Math.random() * 21000 - 50;
            posRain[i+2] = Math.random() * 23000 - 150;
        }
        rainBuffer.setAttribute('position', new THREE.BufferAttribute(posRain, 3));
        let texture = new THREE.TextureLoader().load('Assets/Images/drop.png');
        let RainMaterial = new THREE.PointsMaterial({
            //color: 0x002757,
            map: texture,
            size: 0.2,
            transparent: true
        });
        this.rain = new THREE.Points(rainBuffer, RainMaterial);
        this.rain.position.x = -10000;
        this.rain.position.y = -10000;
        this.rain.position.z = -10000;
        this.Pantano.add(this.rain);
    }

    RainUpdate()
    {
        const positions = this.rain.geometry.attributes.position.array;
        for (let i = 0; i < (this.rainCount * 3); i++) {
            positions[i+1] -= 20.0 + Math.random() * 0.1;
            if(positions[i+1] < (-300 * Math.random()))
            {
                positions[i+1] = 20000;
            }
            this.rain.geometry.attributes.position.needsUpdate = true;
        }
    }

    LodoUpdate()
    {
        this.tiempo++;
        this.Lodo.GetMud().material.map.offset.y = this.tiempo * 0.0015;
    }

    GetTestScene()
    {
        return this.TestScene;
    }

    GetPantanoScene()
    {
        return this.Pantano;
    }

    GetPraderaScene()
    {
        return this.Pradera;
    }
}

export { Scenee };