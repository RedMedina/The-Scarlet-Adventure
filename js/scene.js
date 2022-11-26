import * as THREE from 'three';
import {Lightt} from '/PWGW/js/light.js';
import {Terrain} from '/PWGW/js/terrain.js';
import {skydome} from '/PWGW/js/skydome.js';
import {Lensflare, LensflareElement} from '/PWGW/js/lensflare.js';
import {GLTFLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {Mud} from '/PWGW/js/lodo.js';
import {modelAnimController} from '/PWGW/js/modelAnimationController.js';
import {player} from '/PWGW/js/player.js';
import {Backpack} from '/PWGW/js/backpack.js';
import {HealItem} from '/PWGW/js/HealItem.js';
import {OneModelAnim} from '/PWGW/js/OnemodelAnim.js';
import {Enemigo} from '/PWGW/js/Enemie.js';

class Scenee
{

    constructor()
    {
        this.Playeranimations = ["Assets/Models/Player/Idle_Final", "Assets/Models/Player/Run_Final",
        "Assets/Models/Player/Attack_Final", "Assets/Models/Player/Diying_Final",
        "Assets/Models/Player/Dodge_Final", "Assets/Models/Player/Hanging_Idle_Final",
        "Assets/Models/Player/Jump_Final"];

        //Objetos Estaticos Pradera
        this.PraderaObjects = [];
        //Objectos Recolectables Pradera
        this.PraderaItems;
        //Objetos Estaticos Pantano
        this.PantanoObjects = [];
        //Objetos Recolectables Pantano
        this.PantanoItems;
        //Objetos Estaticos Nieve
        this.NieveObjects = [];
        //Objetos Recolectables Nieve
        this.NieveItems;


        //Pradera Enemies
        this.PraderaEnemies = []; //Temporal hasta tener la ia y stats
        this.PraderaEnemiesStats = [];
        this.PraderaEnemiesCollider = [];
        this.PraderaEnemigosFinal;
        //Pantano Enemies
        this.PantanoEnemies = []; //Temporal hasta tener la ia y stats
        this.PantanoEnemiesStats = [];
        this.PantanoEnemiesCollider = [];
        this.PantanoEnemigosFinal;
        //Pantano Enemies
        this.NieveEnemies = []; //Temporal hasta tener la ia y stats
        this.NieveEnemiesStats = [];
        this.NieveEnemiesCollider = [];
        this.NieveEnemigosFinal;

        //while obteniendo los items y creando el array
       // var HealItems = [new HealItem("Pocion Basica", 100, 1), new HealItem("Pocion Alta", 500, 1)];

        //Obtiene los items por ajax
        var GetItems = [];
        for (let i = 0; i < Items.length; i++) {
            GetItems.push(new HealItem(Items[i].name, Items[i].curacion, Items[i].cantidad));
        }
        var Mochila = new Backpack(GetItems);
        this.Player = new player(PlayerDatos.Name, {x: PlayerDatos.coorX, y: PlayerDatos.coorY, z: PlayerDatos.coorZ}, PlayerDatos.Experiencia, Mochila, PlayerDatos.level, {Boss1: PlayerDatos.Boss_1, Boss2: PlayerDatos.Boss_2, Boss3: PlayerDatos.Boss_3}, PlayerDatos.ActualLife);
        this.Player.GenerateStats();
    }

    CreateScene()
    {
        const scene = new THREE.Scene();
        return scene;
    }

    InitScene(loadingManager)
    {
        this.TestScene = new THREE.Scene();
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 1);
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
        sphere.receiveShadow = false; //default
        sphere.position.y = 20;
        this.TestScene.add( sphere );

        const planeGeometry = new THREE.PlaneGeometry(60, 60, 100, 100);
        const planeMaterial = new THREE.MeshPhongMaterial({color: 0x64EFFF});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        //plane.castShadow = true;
        plane.receiveShadow = true;
        plane.rotation.x = Math.PI * -.5;
        plane.position.y = 10;
        this.TestScene.add( plane );

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
        //this.TestScene.add( this.Pointlight );
        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, this.Pointlight.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
        this.Pointlight.add( lensflare );

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol3.glb", loadingManager, (object)=>{
            object.position.y = 10;
            object.position.x = 10;
            object.scale.set(3, 3, 3);
            this.TestScene.add(object);
        });
    }

    PantanoScene(loadingManager)
    {
        this.Pantano = new THREE.Scene();
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0x757575);
        Luces.GetAmbientLight().name = "LuzPantano";
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
        Terreno.MultitextureTerrain("Assets/Pantano/Pasto_Ot.jpg", "Assets/Pantano/Tierra_Mojada.jpg", "Assets/Pantano/Hojas_Tierra.jpg", "Assets/Pantano/Alts.png", "Assets/Pantano/Blendmap_Pantano.png", 1700, 18000, 18000);
        Terreno.GetPlane().position.y = -720;
        this.Pantano.add(Terreno.GetPlane());

        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skybox_2.png');
        SkydomeT.Render().name = "SkyPantano";
        this.Pantano.add(SkydomeT.Render());

        this.Lodo = new Mud();
        this.Lodo.CreateMud('Assets/Images/skyboxDay.png', "Assets/Pantano/lodo.jpg", "Assets/Pantano/lodoNormal.png");
        this.Pantano.add(this.Lodo.GetMud());
        this.tiempo = 0;

        //Modelos
        this.Load3dModelGLTF("Assets/Models/Bag/Bag.glb", loadingManager, (object)=>{
            object.scale.set(0.1, 0.1, 0.1);

            var bolsa2 = object.clone();
            bolsa2.position.set(7200, 325, 7000);
            bolsa2.children[0].children[0].children[0].children[0].children[0].name="2";
            var Item2 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa3 = object.clone();
            bolsa3.position.set(3800, 150, 7400);
            bolsa3.children[0].children[0].children[0].children[0].children[0].name="3";
            var Item3 = new HealItem("Pocion Basica", 100, 1);

            var bolsa4 = object.clone();
            bolsa4.position.set(-4800, 200, 7400);
            bolsa4.children[0].children[0].children[0].children[0].children[0].name="4";
            var Item4 = new HealItem("Pocion Alta", 500, 1);

            var bolsa5 = object.clone();
            bolsa5.position.set(-800, -50, 5500);
            bolsa5.children[0].children[0].children[0].children[0].children[0].name="5";
            var Item5 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa6 = object.clone();
            bolsa6.position.set(-5200, 475, 4500);
            bolsa6.children[0].children[0].children[0].children[0].children[0].name="6";
            var Item6 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa7 = object.clone();
            bolsa7.position.set(-3300, 445, 3000);
            bolsa7.children[0].children[0].children[0].children[0].children[0].name="7";
            var Item7 = new HealItem("Pocion Alta", 500, 1);

            var bolsa8 = object.clone();
            bolsa8.position.set(-4800, -40, -1000);
            bolsa8.children[0].children[0].children[0].children[0].children[0].name="8";
            var Item8 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa9 = object.clone();
            bolsa9.position.set(-1000, 160, -100);
            bolsa9.children[0].children[0].children[0].children[0].children[0].name="9";
            var Item9 = new HealItem("Pocion Alta", 500, 1);

            var bolsa10 = object.clone();
            bolsa10.position.set(1500, 0, -100);
            bolsa10.children[0].children[0].children[0].children[0].children[0].name="10";
            var Item10 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa11 = object.clone();
            bolsa11.position.set(3800, 160, 2300);
            bolsa11.children[0].children[0].children[0].children[0].children[0].name="11";
            var Item11 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa12 = object.clone();
            bolsa12.position.set(3800, 270, -5800);
            bolsa12.children[0].children[0].children[0].children[0].children[0].name="12";
            var Item12 = new HealItem("Pocion Basica", 100, 1);

            var bolsa13 = object.clone();
            bolsa13.position.set(8000, 90, 4000);
            bolsa13.children[0].children[0].children[0].children[0].children[0].name="13";
            var Item13 = new HealItem("Pocion Defensa", 100, 1);

            object.position.set(5000, 250, 8000);
            object.children[0].children[0].children[0].children[0].children[0].name="1";
            var Item1 = new HealItem("Pocion Ataque", 300, 1);

            this.Pantano.add(object);
            this.Pantano.add(bolsa2);
            this.Pantano.add(bolsa3);
            this.Pantano.add(bolsa4);
            this.Pantano.add(bolsa5);
            this.Pantano.add(bolsa6);
            this.Pantano.add(bolsa7);
            this.Pantano.add(bolsa8);
            this.Pantano.add(bolsa9);
            this.Pantano.add(bolsa10);
            this.Pantano.add(bolsa11);
            this.Pantano.add(bolsa12);
            this.Pantano.add(bolsa13);

            var ItemsArray = [];
            ItemsArray.push(Item1);
            ItemsArray.push(Item2);
            ItemsArray.push(Item3);
            ItemsArray.push(Item4);
            ItemsArray.push(Item5);
            ItemsArray.push(Item6);
            ItemsArray.push(Item7);
            ItemsArray.push(Item8);
            ItemsArray.push(Item9);
            ItemsArray.push(Item10);
            ItemsArray.push(Item11);
            ItemsArray.push(Item12);
            ItemsArray.push(Item13);

            var ModelsArray = [];
            ModelsArray.push(object);
            ModelsArray.push(bolsa2);
            ModelsArray.push(bolsa3);
            ModelsArray.push(bolsa4);
            ModelsArray.push(bolsa5);
            ModelsArray.push(bolsa6);
            ModelsArray.push(bolsa7);
            ModelsArray.push(bolsa8);
            ModelsArray.push(bolsa9);
            ModelsArray.push(bolsa10);
            ModelsArray.push(bolsa11);
            ModelsArray.push(bolsa12);
            ModelsArray.push(bolsa13);

            this.PantanoItems = {model: ModelsArray, items: ItemsArray};
        });

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol_O2.glb", loadingManager, (object)=>{ //Arbol Otoño
            object.position.y = 340;
            object.scale.x = 100;
            object.scale.y = 100;
            object.scale.z = 100;

            var Arbol2 = object.clone();
            Arbol2.position.x = 5800;
            Arbol2.position.y = 380;
            Arbol2.position.z = 7900;

            var Arbol3 = object.clone();
            Arbol3.position.x = 5000;
            Arbol3.position.z = 7000;

            var Arbol4 = object.clone();
            Arbol4.position.x = 7000;
            Arbol4.position.z = 7000;

            var Arbol5 = object.clone();
            Arbol5.position.x = 2800;
            Arbol5.position.y = 230;
            Arbol5.position.z = 7900;

            var Arbol6 = object.clone();
            Arbol6.position.x = 4800;
            Arbol6.position.y = 190;
            Arbol6.position.z = 8400;

            var Arbol7 = object.clone();
            Arbol7.position.x = 3800;
            Arbol7.position.y = 150;
            Arbol7.position.z = 8400;

            var Arbol8 = object.clone();
            Arbol8.position.x = 4300;
            Arbol8.position.y = 180;
            Arbol8.position.z = 7100;

            var Arbol9 = object.clone();
            Arbol9.position.x = 2300;
            Arbol9.position.z = 1000;

            var Arbol10 = object.clone();
            Arbol10.position.x = 3100;
            Arbol10.position.y = 520;
            Arbol10.position.z = 1000;

            var Arbol11 = object.clone();
            Arbol11.position.x = 2700;
            Arbol11.position.y = 505;
            Arbol11.position.z = 1900;

            var Arbol12 = object.clone();
            Arbol12.position.x = 3500;
            Arbol12.position.y = 480;
            Arbol12.position.z = 1400;

            var Arbol13 = object.clone();
            Arbol13.position.x = 3100;
            Arbol13.position.y = 450;
            Arbol13.position.z = 2300;

            var Arbol14 = object.clone();
            Arbol14.position.x = 2700;
            Arbol14.position.y = 450;
            Arbol14.position.z = 2800;

            var Arbol15 = object.clone();
            Arbol15.position.x = 3500;
            Arbol15.position.y = 100;
            Arbol15.position.z = 3200;

            var Arbol16 = object.clone();
            Arbol16.position.x = 3100;
            Arbol16.position.y = 520;
            Arbol16.position.z = 300;

            var Arbol17 = object.clone();
            Arbol17.position.x = 2700;
            Arbol17.position.y = 420;
            Arbol17.position.z = -800;

            var Arbol18 = object.clone();
            Arbol18.position.x = 3500;
            Arbol18.position.y = 600;
            Arbol18.position.z = -1200;

            var Arbol19 = object.clone();
            Arbol19.position.x = 4500;
            Arbol19.position.y = 400;
            Arbol19.position.z = 300;

            var Arbol20 = object.clone();
            Arbol20.position.x = 4000;
            Arbol20.position.y = 400;
            Arbol20.position.z = 900;

            var Arbol21 = object.clone();
            Arbol21.position.x = 4000;
            Arbol21.position.y = 600;
            Arbol21.position.z = -600;

            var Arbol22 = object.clone();
            Arbol22.position.x = 4000;
            Arbol22.position.y = 200;
            Arbol22.position.z = 1800;

            var Arbol23 = object.clone();
            Arbol23.position.x = 4000;
            Arbol23.position.y = 30;
            Arbol23.position.z = 2600;

            var Arbol24 = object.clone();
            Arbol24.position.x = 5200;
            Arbol24.position.y = 60;
            Arbol24.position.z = 1200;

            var Arbol25 = object.clone();
            Arbol25.position.x = 5200;
            Arbol25.position.y = 160;
            Arbol25.position.z = -1300;

            var Arbol26 = object.clone();
            Arbol26.position.x = 5200;
            Arbol26.position.y = 320;
            Arbol26.position.z = -100;

            var Arbol27 = object.clone();
            Arbol27.position.x = -5200;
            Arbol27.position.y = 400;
            Arbol27.position.z = 5100;

            var Arbol28 = object.clone();
            Arbol28.position.x = -6600;
            Arbol28.position.y = 240;
            Arbol28.position.z = 4200;

            var Arbol29 = object.clone();
            Arbol29.position.x = -4200;
            Arbol29.position.y = 500;
            Arbol29.position.z = 4200;

            var Arbol30 = object.clone();
            Arbol30.position.x = -5200;
            Arbol30.position.y = 520;
            Arbol30.position.z = 3100;

            var Arbol31 = object.clone();
            Arbol31.position.x = -6600;
            Arbol31.position.y = 220;
            Arbol31.position.z = 2400;

            var Arbol32 = object.clone();
            Arbol32.position.x = -4200;
            Arbol32.position.y = 380;
            Arbol32.position.z = 2400;

            var Arbol33 = object.clone();
            Arbol33.position.x = -6000;
            Arbol33.position.y = 340;
            Arbol33.position.z = 3700;

            var Arbol34 = object.clone();
            Arbol34.position.x = -2800;
            Arbol34.position.y = 380;
            Arbol34.position.z = 3100;

            var Arbol35 = object.clone();
            Arbol35.position.x = -4800;
            Arbol35.position.y = 240;
            Arbol35.position.z = -3100;

            var Arbol36 = object.clone();
            Arbol36.position.x = -7200;
            Arbol36.position.y = 240;
            Arbol36.position.z = -3100;

            var Arbol37 = object.clone();
            Arbol37.position.x = -5500;
            Arbol37.position.y = 220;
            Arbol37.position.z = -2100;

            var Arbol38 = object.clone();
            Arbol38.position.x = -6500;
            Arbol38.position.y = 230;
            Arbol38.position.z = -4100;

            var Arbol39 = object.clone();
            Arbol39.position.x = -6500;
            Arbol39.position.y = 130;
            Arbol39.position.z = -1100;

            var Arbol40 = object.clone();
            Arbol40.position.x = -7900;
            Arbol40.position.y = 120;
            Arbol40.position.z = -200;

            object.position.x = 6000;
            object.position.z = 8550;

            this.Pantano.add(object);
            this.Pantano.add(Arbol2);
            this.Pantano.add(Arbol3);
            this.Pantano.add(Arbol4);
            this.Pantano.add(Arbol5);
            this.Pantano.add(Arbol6);
            this.Pantano.add(Arbol7);
            this.Pantano.add(Arbol8);
            this.Pantano.add(Arbol9);
            this.Pantano.add(Arbol10);
            this.Pantano.add(Arbol11);
            this.Pantano.add(Arbol12);
            this.Pantano.add(Arbol13);
            this.Pantano.add(Arbol14);
            this.Pantano.add(Arbol15);
            this.Pantano.add(Arbol16);
            this.Pantano.add(Arbol17);
            this.Pantano.add(Arbol18);
            this.Pantano.add(Arbol19);
            this.Pantano.add(Arbol20);
            this.Pantano.add(Arbol21);
            this.Pantano.add(Arbol22);
            this.Pantano.add(Arbol23);
            this.Pantano.add(Arbol24);
            this.Pantano.add(Arbol25);
            this.Pantano.add(Arbol26);
            this.Pantano.add(Arbol27);
            this.Pantano.add(Arbol28);
            this.Pantano.add(Arbol29);
            this.Pantano.add(Arbol30);
            this.Pantano.add(Arbol31);
            this.Pantano.add(Arbol32);
            this.Pantano.add(Arbol33);
            this.Pantano.add(Arbol34);
            this.Pantano.add(Arbol35);
            this.Pantano.add(Arbol36);
            this.Pantano.add(Arbol37);
            this.Pantano.add(Arbol38);
            this.Pantano.add(Arbol39);
            this.Pantano.add(Arbol40);

            this.PantanoObjects.push(object);
            this.PantanoObjects.push(Arbol2);
            this.PantanoObjects.push(Arbol3);
            this.PantanoObjects.push(Arbol4);
            this.PantanoObjects.push(Arbol5);
            this.PantanoObjects.push(Arbol6);
            this.PantanoObjects.push(Arbol7);
            this.PantanoObjects.push(Arbol8);
            this.PantanoObjects.push(Arbol9);
            this.PantanoObjects.push(Arbol10);
            this.PantanoObjects.push(Arbol11);
            this.PantanoObjects.push(Arbol12);
            this.PantanoObjects.push(Arbol13);
            this.PantanoObjects.push(Arbol14);
            this.PantanoObjects.push(Arbol15);
            this.PantanoObjects.push(Arbol16);
            this.PantanoObjects.push(Arbol17);
            this.PantanoObjects.push(Arbol18);
            this.PantanoObjects.push(Arbol19);
            this.PantanoObjects.push(Arbol20);
            this.PantanoObjects.push(Arbol21);
            this.PantanoObjects.push(Arbol22);
            this.PantanoObjects.push(Arbol23);
            this.PantanoObjects.push(Arbol24);
            this.PantanoObjects.push(Arbol25);
            this.PantanoObjects.push(Arbol26);
            this.PantanoObjects.push(Arbol27);
            this.PantanoObjects.push(Arbol28);
            this.PantanoObjects.push(Arbol29);
            this.PantanoObjects.push(Arbol30);
            this.PantanoObjects.push(Arbol31);
            this.PantanoObjects.push(Arbol32);
            this.PantanoObjects.push(Arbol33);
            this.PantanoObjects.push(Arbol34);
            this.PantanoObjects.push(Arbol35);
            this.PantanoObjects.push(Arbol36);
            this.PantanoObjects.push(Arbol37);
            this.PantanoObjects.push(Arbol38);
            this.PantanoObjects.push(Arbol39);
            this.PantanoObjects.push(Arbol40);
        });

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol_Seco.glb", loadingManager,(object)=>{ //Arbol Seco
            object.position.y = 30;
            object.scale.set(20, 20, 20);

            var ArbolS2 = object.clone();
            ArbolS2.position.x = -800;
            ArbolS2.position.y = 30;
            ArbolS2.position.z = 3850;

            var ArbolS3 = object.clone();
            ArbolS3.position.x = -5800;
            ArbolS3.position.y = 290;
            ArbolS3.position.z = 6850;

            var ArbolS4 = object.clone();
            ArbolS4.position.x = -4000;
            ArbolS4.position.y = 290;
            ArbolS4.position.z = 6050;

            var ArbolS5 = object.clone();
            ArbolS5.position.x = -4800;
            ArbolS5.position.y = 90;
            ArbolS5.position.z = 8050;

            var ArbolS6 = object.clone();
            ArbolS6.position.x = -1800;
            ArbolS6.position.y = 0;
            ArbolS6.position.z = -2850;

            var ArbolS7 = object.clone();
            ArbolS7.position.x = -1800;
            ArbolS7.position.y = 300;
            ArbolS7.position.z = -100;

            var ArbolS8 = object.clone();
            ArbolS8.position.x = -3200;
            ArbolS8.position.y = 130;
            ArbolS8.position.z = -1100;

            var ArbolS9 = object.clone();
            ArbolS9.position.x = 3200;
            ArbolS9.position.y = 370;
            ArbolS9.position.z = -6100;

            var ArbolS10 = object.clone();
            ArbolS10.position.x = 4100;
            ArbolS10.position.y = 180;
            ArbolS10.position.z = -4100;

            var ArbolS11 = object.clone();
            ArbolS11.position.x = 3200;
            ArbolS11.position.y = 330;
            ArbolS11.position.z = -4700;

            var ArbolS12 = object.clone();
            ArbolS12.position.x = 4100;
            ArbolS12.position.y = 300;
            ArbolS12.position.z = -6700;

            var ArbolS13 = object.clone();
            ArbolS13.position.x = 8600;
            ArbolS13.position.y = 300;
            ArbolS13.position.z = 3000;

            object.position.x = 800;
            object.position.z = 3550;

            this.Pantano.add(object);
            this.Pantano.add(ArbolS2);
            this.Pantano.add(ArbolS3);
            this.Pantano.add(ArbolS4);
            this.Pantano.add(ArbolS5);
            this.Pantano.add(ArbolS6);
            this.Pantano.add(ArbolS7);
            this.Pantano.add(ArbolS8);
            this.Pantano.add(ArbolS9);
            this.Pantano.add(ArbolS10);
            this.Pantano.add(ArbolS11);
            this.Pantano.add(ArbolS12);
            this.Pantano.add(ArbolS13);

            this.PantanoObjects.push(object);
            this.PantanoObjects.push(ArbolS2);
            this.PantanoObjects.push(ArbolS3);
            this.PantanoObjects.push(ArbolS4);
            this.PantanoObjects.push(ArbolS5);
            this.PantanoObjects.push(ArbolS6);
            this.PantanoObjects.push(ArbolS7);
            this.PantanoObjects.push(ArbolS8);
            this.PantanoObjects.push(ArbolS9);
            this.PantanoObjects.push(ArbolS10);
            this.PantanoObjects.push(ArbolS11);
            this.PantanoObjects.push(ArbolS12);
            this.PantanoObjects.push(ArbolS13);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Hoguera.glb", loadingManager,(object)=>{ //Hoguera
            object.position.y = 220;
            object.scale.set(25, 25, 25);

            object.position.x = -5000;
            object.position.z = 7300;
            this.Pantano.add(object);
            this.PantanoObjects.push(object);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Antorcha.glb", loadingManager,(object)=>{ //Antorcha
            object.position.y = 320;
            object.scale.set(13, 13, 13);

            var Antorcha2 = object.clone();
            Antorcha2.position.x = -200;
            Antorcha2.position.y = -50;
            Antorcha2.position.z = 6500;

            var Antorcha3 = object.clone();
            Antorcha3.position.x = 1500;
            Antorcha3.position.y = 250;
            Antorcha3.position.z = 6500;

            var Antorcha4 = object.clone();
            Antorcha4.position.x = 1500;
            Antorcha4.position.y = 320;
            Antorcha4.position.z = -6500;

            var Antorcha5 = object.clone();
            Antorcha5.position.x = -2500;
            Antorcha5.position.y = -60;
            Antorcha5.position.z = -6500;

            object.position.x = -5000;
            object.position.z = 6300;

            this.Pantano.add(object);
            this.Pantano.add(Antorcha2);
            this.Pantano.add(Antorcha3);
            this.Pantano.add(Antorcha4);
            this.Pantano.add(Antorcha5);

            this.PantanoObjects.push(object);
            this.PantanoObjects.push(Antorcha2);
            this.PantanoObjects.push(Antorcha3);
            this.PantanoObjects.push(Antorcha4);
            this.PantanoObjects.push(Antorcha5);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Tronco.glb", loadingManager, (object)=>{ //Tronco
            object.position.y = 220;
            object.scale.set(25, 25, 25);

            object.rotation.y = 45 * 3.1416 / 180;
            object.position.x = -5900;
            object.position.z = 7800;

            this.Pantano.add(object);
            this.PantanoObjects.push(object);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/roca3.glb", loadingManager, (object)=>{
            object.position.y = 220;
            object.scale.set(100, 100, 100);

            var roca2 = object.clone();
            roca2.position.set(-500,10,5000);

            var roca3 = object.clone();
            roca3.position.set(-2000,10,5700);

            object.position.x = -3000;
            object.position.z = 5000;

            this.Pantano.add(object);
            this.Pantano.add(roca2);
            this.Pantano.add(roca3);

            this.PantanoObjects.push(object);
            this.PantanoObjects.push(roca2);
            this.PantanoObjects.push(roca3);
        });

        var portal = this.CreateRIcon("Assets/Images/energy.png");
        portal.position.set(1000, 320, 7550);
        portal.name="portalPradera";
        this.Pantano.add(portal);
        this.PantanoObjects.push(portal);

        var portal2 = this.CreateRIcon("Assets/Images/energy.png");
        portal2.position.set(100, 120, -7550);
        portal2.name="portalNieve";
        this.Pantano.add(portal2);
        this.PantanoObjects.push(portal2);

        //Personaje
        var ModelPlayer = new modelAnimController(this.Playeranimations, "Assets/Models/Player/Player_Idle.fbx");
        ModelPlayer.CreateBaseModel("PlayerModell", loadingManager, (object)=>{
            var PlayerModel = new THREE.Object3D();
            PlayerModel.name = "PlayerModel";
            PlayerModel.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
                //new THREE.Vector3(0, -1, 0),
            ];
            PlayerModel.add(object);
            for (let i = 0; i < this.Playeranimations.length; i++) {
                ModelPlayer.LoadMultipleAnimations(i, (objectAnim)=>{
                    PlayerModel.add(objectAnim);
                });
            }
            this.Pantano.add(PlayerModel);
            PlayerModel.position.set(1000, 200, 8550);
            PlayerModel.rotation.y = 180 * 3.1416 / 180;
        });
        this.Player.SetModel(ModelPlayer, "Pantano");

        //Enemigos
        var Guardian = new OneModelAnim();
        Guardian.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-5400, 225, 7550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="0";
            this.PantanoEnemiesCollider.push(visor);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 0));

        var Guardian2 = new OneModelAnim();
        Guardian2.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-3800, 225, 6550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="1";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian2);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 1));

        var Guardian3 = new OneModelAnim();
        Guardian3.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-4600, 380, 5600);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="2";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian3);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 2));

        var Guardian4 = new OneModelAnim();
        Guardian4.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(500, 40, 5000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="3";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian4);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 3));

        var Guardian5 = new OneModelAnim();
        Guardian5.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-800, 80, 4300);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="4";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian5);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 4));

        var Guardian6 = new OneModelAnim();
        Guardian6.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-2800, 210, -1300);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="5";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian6);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 5));

        var Guardian7 = new OneModelAnim();
        Guardian7.LoadModel("Assets/Pantano/Enemies/Guardian/Guardian1.fbx", loadingManager, 0.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(3800, 270, -5400);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(550, 550, 550);
            object.add(visor);
            visor.visible= false;
            visor.name="6";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Guardian7);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 500, 500, "Guardian", 600, 6));

        var DronFly = new OneModelAnim();
        DronFly.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(3700, 550, 7250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="7";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 7));

        var DronFly2 = new OneModelAnim();
        DronFly2.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(7000, 550, 6250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="8";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly2);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 8));

        var DronFly3 = new OneModelAnim();
        DronFly3.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-1000, 550, 3250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="9";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly3);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 9));

        var DronFly4 = new OneModelAnim();
        DronFly4.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-3800, 800, 2750);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="10";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly4);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 10));

        var DronFly5 = new OneModelAnim();
        DronFly5.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-6800, 400, 1250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="11";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly5);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 11));

        var DronFly6 = new OneModelAnim();
        DronFly6.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-6100, 400, -4250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="12";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly6);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 12));

        var DronFly7 = new OneModelAnim();
        DronFly7.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-2100, 400, -4250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="13";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly7);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 13));

        var DronFly8 = new OneModelAnim();
        DronFly8.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(1500, 700, -4250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="14";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly8);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 14));

        var DronFly9 = new OneModelAnim();
        DronFly9.LoadModel("Assets/Pantano/Enemies/DronFly/DronFly.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(2900, 780, 1000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 110, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(700, 1700, 700);
            object.add(visor);
            visor.visible= false;
            visor.name="15";
            visor.position.y = -100;
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(DronFly9);
        this.PantanoEnemiesStats.push(new Enemigo(3000, 300, 800, "DronFly", 600, 15));

        var Cat = new OneModelAnim();
        Cat.LoadModel("Assets/Pantano/Enemies/Cat/Cat.fbx", loadingManager, 1, (object)=>{
            object.scale.set(2.3, 2.3, 2.3);
            object.rotation.x = -90 * 3.1416 / 180;
            object.position.set(5500, 440, 7250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(50, 0.5, 0.5);
            Life.position.set(0, 0, 170);
            Life.rotation.x = 90 * 180 / 3.1416;
            Life.name="vida";
            var visor = this.CreateCubeVisor(200, 200, 20);
            object.add(visor);
            visor.visible= false;
            visor.name="16";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
           // this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Cat);
        this.PantanoEnemiesStats.push(new Enemigo(7000, 300, 1000, "Cat", 600, 16));

        var Cat2 = new OneModelAnim();
        Cat2.LoadModel("Assets/Pantano/Enemies/Cat/Cat.fbx", loadingManager, 1, (object)=>{
            object.scale.set(2.3, 2.3, 2.3);
            object.rotation.x = -90 * 3.1416 / 180;
            object.position.set(-5100, 540, 3850);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(50, 0.5, 0.5);
            Life.position.set(0, 0, 170);
            Life.rotation.x = 90 * 180 / 3.1416;
            Life.name="vida";
            var visor = this.CreateCubeVisor(200, 200, 20);
            object.add(visor);
            visor.visible= false;
            visor.name="17";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            //this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Cat2);
        this.PantanoEnemiesStats.push(new Enemigo(7000, 300, 1000, "Cat", 600, 17));

        var Cat3 = new OneModelAnim();
        Cat3.LoadModel("Assets/Pantano/Enemies/Cat/Cat.fbx", loadingManager, 1, (object)=>{
            object.scale.set(2.3, 2.3, 2.3);
            object.rotation.x = -90 * 3.1416 / 180;
            object.position.set(-5100, 30, -1350);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(50, 0.5, 0.5);
            Life.position.set(0, 0, 170);
            Life.rotation.x = 90 * 180 / 3.1416;
            Life.name="vida";
            var visor = this.CreateCubeVisor(200, 200, 20);
            object.add(visor);
            visor.visible= false;
            visor.name="18";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
           // this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Cat3);
        this.PantanoEnemiesStats.push(new Enemigo(7000, 300, 1000, "Cat", 600, 18));

        var Cat4 = new OneModelAnim();
        Cat4.LoadModel("Assets/Pantano/Enemies/Cat/Cat.fbx", loadingManager, 1, (object)=>{
            object.scale.set(2.3, 2.3, 2.3);
            object.rotation.x = -90 * 3.1416 / 180;
            object.position.set(3800, 450, -1850);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(50, 0.5, 0.5);
            Life.position.set(0, 0, 170);
            Life.rotation.x = 90 * 180 / 3.1416;
            Life.name="vida";
            var visor = this.CreateCubeVisor(200, 200, 20);
            object.add(visor);
            visor.visible= false;
            visor.name="19";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
           // this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Cat4);
        this.PantanoEnemiesStats.push(new Enemigo(7000, 300, 1000, "Cat", 600, 19));

        var Cat5 = new OneModelAnim();
        Cat5.LoadModel("Assets/Pantano/Enemies/Cat/Cat.fbx", loadingManager, 1, (object)=>{
            object.scale.set(2.3, 2.3, 2.3);
            object.rotation.x = -90 * 3.1416 / 180;
            object.position.set(3300, 240, 2850);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(50, 0.5, 0.5);
            Life.position.set(0, 0, 170);
            Life.rotation.x = 90 * 180 / 3.1416;
            Life.name="vida";
            var visor = this.CreateCubeVisor(200, 200, 20);
            object.add(visor);
            visor.visible= false;
            visor.name="20";
            this.PantanoEnemiesCollider.push(visor);
            object.add(Life);
            //this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Cat5);
        this.PantanoEnemiesStats.push(new Enemigo(7000, 300, 1000, "Cat", 600, 20));

        var Magic = new OneModelAnim();
        Magic.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-5100, 170, 7800);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="21";
            visor.visible= false;
            this.Pantano.add(object);
        });
        this.PantanoEnemies.push(Magic);
        this.PantanoEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 21));
    }

    PraderaScene(loadingManager)
    {
        //Incia la escena
        this.Pradera = new THREE.Scene();

        //Luces
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0xFFFFFF);
        Luces.GetAmbientLight().name = "LuzPradera";
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
        this.Pointlight.name="Sun";
        this.Pradera.add( this.Pointlight );
        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, this.Pointlight.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
        lensflare.material.transparent = true;
        lensflare.name="SunTexture";
        this.Pointlight.add( lensflare );
        

        //Help para el día y la noche
        const helper = new THREE.CameraHelper( Luces.GetDirectionalLight().shadow.camera );
        this.Pradera.add( helper );

        //Skydome
        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        SkydomeT.Render().name = "SkyPradera";
        this.Pradera.add(SkydomeT.Render());

        //Terreno
        var Terreno = new Terrain();
        Terreno.MultitextureTerrain("Assets/Pradera/Tierra_2.png", "Assets/Pradera/Pasto.jpg", "Assets/Pradera/Tierra.jpg", "Assets/Pradera/Alturas_Pradera.png", "Assets/Pradera/Blendmap_Pradera.png", 2500, 18000, 18000);
        Terreno.GetPlane().position.y = -160;
        Terreno.GetPlane().name="TerrenoPradera";
        this.Pradera.add(Terreno.GetPlane());
       
        //Modelos

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol3.glb", loadingManager, (object)=>{ //Arbol_1
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
            this.PraderaObjects.push(object);
            this.PraderaObjects.push(arbol2);
            this.PraderaObjects.push(arbol3);
            this.PraderaObjects.push(arbol4);
            this.PraderaObjects.push(arbol5);
            this.PraderaObjects.push(arbol6);
            this.PraderaObjects.push(arbol7);
            this.PraderaObjects.push(arbol8);
            this.PraderaObjects.push(arbol9);
            this.PraderaObjects.push(arbol10);
            this.PraderaObjects.push(arbol11);
            this.PraderaObjects.push(arbol12);
            this.PraderaObjects.push(arbol13);
            this.PraderaObjects.push(arbol14);
            this.PraderaObjects.push(arbol15);
            this.PraderaObjects.push(arbol16);
            this.PraderaObjects.push(arbol17);
            this.PraderaObjects.push(arbol18);
            this.PraderaObjects.push(arbol19);
            this.PraderaObjects.push(arbol20);
            this.PraderaObjects.push(arbol21);
            this.PraderaObjects.push(arbol22);
            this.PraderaObjects.push(arbol23);
            this.PraderaObjects.push(arbol24);
            this.PraderaObjects.push(arbol25);
            this.PraderaObjects.push(arbol26);
            this.PraderaObjects.push(arbol27);
            this.PraderaObjects.push(arbol28);
            this.PraderaObjects.push(arbol29);
            this.PraderaObjects.push(arbol30);
            this.PraderaObjects.push(arbol31);
            this.PraderaObjects.push(arbol32);
            this.PraderaObjects.push(arbol33);
            this.PraderaObjects.push(arbol34);
            this.PraderaObjects.push(arbol35);
            this.PraderaObjects.push(arbol36);
            this.PraderaObjects.push(arbol37);
            this.PraderaObjects.push(arbol38);
            this.PraderaObjects.push(arbol39);
            this.PraderaObjects.push(arbol40);
            this.PraderaObjects.push(arbol41);
            this.PraderaObjects.push(arbol42);
            this.PraderaObjects.push(arbol43);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/roca3.glb", loadingManager, (object)=>{ //Roca_1
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

            this.PraderaObjects.push(object);
            this.PraderaObjects.push(roca2);
            this.PraderaObjects.push(roca3);
            this.PraderaObjects.push(roca4);
            this.PraderaObjects.push(roca5);
            this.PraderaObjects.push(roca6);
            this.PraderaObjects.push(roca7);
            this.PraderaObjects.push(roca8);
            this.PraderaObjects.push(roca9);
            this.PraderaObjects.push(roca10);
            this.PraderaObjects.push(roca11);
            this.PraderaObjects.push(roca12);
            this.PraderaObjects.push(roca13);
            this.PraderaObjects.push(roca14);
            this.PraderaObjects.push(roca15);
            this.PraderaObjects.push(roca16);
            this.PraderaObjects.push(roca17);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/RocaGrande.glb", loadingManager, (object)=>{ //Roca_2
            object.position.y = 700;
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
            this.PraderaObjects.push(object);
            this.PraderaObjects.push(GRoca2);
            this.PraderaObjects.push(GRoca3);
            this.PraderaObjects.push(GRoca4);
        });

        this.Load3dModelGLTF("Assets/Models/Arbusto/planta_conjunto.glb", loadingManager, (object)=>{ //planta_conjunto
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
            flores8.position.z = -6400;

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

        this.Load3dModelGLTF("Assets/Models/Vallas/vallas.glb", loadingManager, (object)=>{
            object.position.y = 200;
            object.scale.set(50, 50, 50);
            object.rotation.y = 90 * 3.1416 / 180;

            object.position.x = 1700;
            object.position.z = 6500;

            this.Pradera.add(object);
            this.PraderaObjects.push(object);
        });
        
        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol2.glb", loadingManager, (object)=>{
            object.position.y = 200;
            object.scale.x = 45;
            object.scale.y = 45;
            object.scale.z = 45;

            var Arbol2 = object.clone();
            Arbol2.position.x = -3000;
            Arbol2.position.y = 135;
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
            this.PraderaObjects.push(object);
            this.PraderaObjects.push(Arbol2);
            this.PraderaObjects.push(Arbol3);
            this.PraderaObjects.push(Arbol4);
            this.PraderaObjects.push(Arbol5);
            this.PraderaObjects.push(Arbol6);
            this.PraderaObjects.push(Arbol7);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Hoguera.glb", loadingManager, (object)=>{
            object.position.y = 220;
            object.scale.set(25, 25, 25);

            object.position.x = -6500;
            object.position.z = 6800;
            this.Pradera.add(object);
            this.PraderaObjects.push(object);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Antorcha.glb", loadingManager, (object)=>{
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

            this.PraderaObjects.push(object);
            this.PraderaObjects.push(Antorcha2);
            this.PraderaObjects.push(Antorcha3);
            this.PraderaObjects.push(Antorcha4);
            this.PraderaObjects.push(Antorcha5);
            this.PraderaObjects.push(Antorcha6);
            this.PraderaObjects.push(Antorcha7);
            this.PraderaObjects.push(Antorcha8);
            this.PraderaObjects.push(Antorcha9);
            this.PraderaObjects.push(Antorcha10);
            this.PraderaObjects.push(Antorcha11);
            this.PraderaObjects.push(Antorcha12);
            this.PraderaObjects.push(Antorcha13);
            this.PraderaObjects.push(Antorcha14);
            this.PraderaObjects.push(Antorcha15);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Tronco.glb", loadingManager, (object)=>{
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
            this.PraderaObjects.push(object);
            this.PraderaObjects.push(Tronco);
            this.PraderaObjects.push(Tronco2);
            this.PraderaObjects.push(Tronco3);
        });

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol4.glb", loadingManager, (object)=>{
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

            this.PraderaObjects.push(object);
            this.PraderaObjects.push(Arbol2);
            this.PraderaObjects.push(Arbol3);
            this.PraderaObjects.push(Arbol4);
            this.PraderaObjects.push(Arbol5);
            this.PraderaObjects.push(Arbol6);
            this.PraderaObjects.push(Arbol7);
            this.PraderaObjects.push(Arbol8);
            this.PraderaObjects.push(Arbol9);
            this.PraderaObjects.push(Arbol10);
            this.PraderaObjects.push(Arbol11);
        });

        this.Load3dModelGLTF("Assets/Models/Bag/Bag.glb", loadingManager, (object)=>{
            object.scale.set(0.1, 0.1, 0.1);

            
            var bolsa2 = object.clone();
            bolsa2.position.set(-1000, 200, 6550);
            bolsa2.children[0].children[0].children[0].children[0].children[0].name="2";
            var Item2 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa3 = object.clone();
            bolsa3.position.set(-2000, 200, 8500);
            bolsa3.children[0].children[0].children[0].children[0].children[0].name="3";
            var Item3 = new HealItem("Pocion Basica", 100, 1);

            var bolsa4 = object.clone();
            bolsa4.position.set(-4400, 200, 8500);
            bolsa4.children[0].children[0].children[0].children[0].children[0].name="4";
            var Item4 = new HealItem("Pocion Alta", 500, 1);

            var bolsa5 = object.clone();
            bolsa5.position.set(-7400, 200, 6000);
            bolsa5.children[0].children[0].children[0].children[0].children[0].name="5";
            var Item5 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa6 = object.clone();
            bolsa6.position.set(8400, 200, 8500);
            bolsa6.children[0].children[0].children[0].children[0].children[0].name="6";
            var Item6 = new HealItem("Pocion Alta", 500, 1);

            var bolsa7 = object.clone();
            bolsa7.position.set(3000, 200, 6100);
            bolsa7.children[0].children[0].children[0].children[0].children[0].name="7";
            var Item7 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa8 = object.clone();
            bolsa8.position.set(4500, 200, 7700);
            bolsa8.children[0].children[0].children[0].children[0].children[0].name="8";
            var Item8 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa9 = object.clone();
            bolsa9.position.set(1200, 200, 2300);
            bolsa9.children[0].children[0].children[0].children[0].children[0].name="9";
            var Item9 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa10 = object.clone();
            bolsa10.position.set(3200, 200, -1300);
            bolsa10.children[0].children[0].children[0].children[0].children[0].name="10";
            var Item10 = new HealItem("Pocion Alta", 500, 1);

            var bolsa11 = object.clone();
            bolsa11.position.set(4800, 200, -1300);
            bolsa11.children[0].children[0].children[0].children[0].children[0].name="11";
            var Item11 = new HealItem("Pocion Basica", 100, 1);

            var bolsa12 = object.clone();
            bolsa12.position.set(-5800, 200, -2300);
            bolsa12.children[0].children[0].children[0].children[0].children[0].name="12";
            var Item12 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa13 = object.clone();
            bolsa13.position.set(-8200, 200, -2300);
            bolsa13.children[0].children[0].children[0].children[0].children[0].name="13";
            var Item13 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa14 = object.clone();
            bolsa14.position.set(-1000, 200, -7300);
            bolsa14.children[0].children[0].children[0].children[0].children[0].name="14";
            var Item14 = new HealItem("Pocion Alta", 500, 1);

            object.position.set(-3000, 200, 6550);
            object.children[0].children[0].children[0].children[0].children[0].name="1";
            var Item1 = new HealItem("Pocion Ataque", 300, 1);

            this.Pradera.add(object);
            this.Pradera.add(bolsa2);
            this.Pradera.add(bolsa3);
            this.Pradera.add(bolsa4);
            this.Pradera.add(bolsa5);
            this.Pradera.add(bolsa6);
            this.Pradera.add(bolsa7);
            this.Pradera.add(bolsa8);
            this.Pradera.add(bolsa9);
            this.Pradera.add(bolsa10);
            this.Pradera.add(bolsa11);
            this.Pradera.add(bolsa12);
            this.Pradera.add(bolsa13);
            this.Pradera.add(bolsa14);

            var ItemsArray = [];
            ItemsArray.push(Item1);
            ItemsArray.push(Item2);
            ItemsArray.push(Item3);
            ItemsArray.push(Item4);
            ItemsArray.push(Item5);
            ItemsArray.push(Item6);
            ItemsArray.push(Item7);
            ItemsArray.push(Item8);
            ItemsArray.push(Item9);
            ItemsArray.push(Item10);
            ItemsArray.push(Item11);
            ItemsArray.push(Item12);
            ItemsArray.push(Item13);
            ItemsArray.push(Item14);
            debugger
            var ModelsArray = [];
            ModelsArray.push(object);
            ModelsArray.push(bolsa2);
            ModelsArray.push(bolsa3);
            ModelsArray.push(bolsa4);
            ModelsArray.push(bolsa5);
            ModelsArray.push(bolsa6);
            ModelsArray.push(bolsa7);
            ModelsArray.push(bolsa8);
            ModelsArray.push(bolsa9);
            ModelsArray.push(bolsa10);
            ModelsArray.push(bolsa11);
            ModelsArray.push(bolsa12);
            ModelsArray.push(bolsa13);
            ModelsArray.push(bolsa14);

            this.PraderaItems = {model: ModelsArray, items: ItemsArray};
        });

        var portal = this.CreateRIcon("Assets/Images/energy.png");
        portal.position.set(6500, 340, -1000);
        portal.name="portalPantano";
        this.Pradera.add(portal);
        this.PraderaObjects.push(portal);

        //Personaje
        var ModelPlayer = new modelAnimController(this.Playeranimations, "Assets/Models/Player/Player_Idle.fbx");
        ModelPlayer.CreateBaseModel("PlayerModell", loadingManager, (object)=>{
            var PlayerModel = new THREE.Object3D();
            PlayerModel.name = "PlayerModel";
            PlayerModel.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            PlayerModel.add(object);
            for (let i = 0; i < this.Playeranimations.length; i++) {
                ModelPlayer.LoadMultipleAnimations(i, (objectAnim)=>{
                    PlayerModel.add(objectAnim);
                });
            }
            this.Pradera.add(PlayerModel);
            PlayerModel.position.set(1000, 200, 8550);
            PlayerModel.rotation.y = 180 * 3.1416 / 180;
        });
        this.Player.SetModel(ModelPlayer, "Pradera");

        //Enemigos
        var AvatarEnemy = new OneModelAnim();
        AvatarEnemy.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-600, 200, -7550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="0";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 0));
        this.PraderaEnemies.push(AvatarEnemy);

        var AvatarEnemy2 = new OneModelAnim();
        AvatarEnemy2.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(800, 200, -7550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="1";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 1));
        this.PraderaEnemies.push(AvatarEnemy2);

        var AvatarEnemy3 = new OneModelAnim();
        AvatarEnemy3.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-200, 200, -5850);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="2";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 2));
        this.PraderaEnemies.push(AvatarEnemy3);

        var AvatarEnemy4 = new OneModelAnim();
        AvatarEnemy4.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-2100, 200, -5150);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="3";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 3));
        this.PraderaEnemies.push(AvatarEnemy4);

        var AvatarEnemy5 = new OneModelAnim();
        AvatarEnemy5.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-6100, 200, -2150);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="4";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 4));
        this.PraderaEnemies.push(AvatarEnemy5);

        var AvatarEnemy6 = new OneModelAnim();
        AvatarEnemy6.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-8000, 200, -3950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="5";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 5));
        this.PraderaEnemies.push(AvatarEnemy6);

        var AvatarEnemy7 = new OneModelAnim();
        AvatarEnemy7.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-7600, 200, -1550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="6";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 6));
        this.PraderaEnemies.push(AvatarEnemy7);

        var AvatarEnemy8 = new OneModelAnim();
        AvatarEnemy8.LoadModel("Assets/Pradera/Enemies/Avatar/Avatar1.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-5700, 200, -3850);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(450, 450, 450);
            object.add(visor);
            visor.visible= false;
            visor.name="7";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 370, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(5000, 750, 900, "Avatar", 600, 7));
        this.PraderaEnemies.push(AvatarEnemy8);

        var HongoEnemy = new OneModelAnim();
        HongoEnemy.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(-2800, 400, 6950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="8";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 8));
        this.PraderaEnemies.push(HongoEnemy);

        var HongoEnemy2 = new OneModelAnim();
        HongoEnemy2.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(-800, 400, 7750);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="9";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 9));
        this.PraderaEnemies.push(HongoEnemy2);

        var HongoEnemy3 = new OneModelAnim();
        HongoEnemy3.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(-2500, 400, 8250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="10";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 10));
        this.PraderaEnemies.push(HongoEnemy3);

        var HongoEnemy4 = new OneModelAnim();
        HongoEnemy4.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(-800, 400, 6000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="11";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 11));
        this.PraderaEnemies.push(HongoEnemy4);

        var HongoEnemy5 = new OneModelAnim();
        HongoEnemy5.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(-4300, 400, 7800);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="12";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 12));
        this.PraderaEnemies.push(HongoEnemy5);

        var HongoEnemy6 = new OneModelAnim();
        HongoEnemy6.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(2300, 400, 7800);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="13";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 13));
        this.PraderaEnemies.push(HongoEnemy6);

        var HongoEnemy7 = new OneModelAnim();
        HongoEnemy7.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(3100, 400, 5800);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="14";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 14));
        this.PraderaEnemies.push(HongoEnemy7);

        var HongoEnemy8 = new OneModelAnim();
        HongoEnemy8.LoadModel("Assets/Pradera/Enemies/Hongo/Hongo1.fbx", loadingManager, 3, (object)=>{
            object.scale.set(0.7, 0.7, 0.7);
            object.position.set(4700, 400, 8300);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(200, 300, 300);
            object.add(visor);
            visor.position.set(0, -80, 150);
            visor.visible= false;
            visor.name="15";
            var Life = this.CreateLife(100, 10, 10);
            Life.position.set(0, 140, 0);
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(3000, 700, 400, "Hongo", 400, 15));
        this.PraderaEnemies.push(HongoEnemy8);

        var Polilla1 = new OneModelAnim();
        Polilla1.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(-7000, 400, 7700);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="16";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 16));
        this.PraderaEnemies.push(Polilla1);

        var Polilla2 = new OneModelAnim();
        Polilla2.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(-7000, 400, 5800);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="17";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 17));
        this.PraderaEnemies.push(Polilla2);

        var Polilla3 = new OneModelAnim();
        Polilla3.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(-5300, 400, 6700);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="18";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 18));
        this.PraderaEnemies.push(Polilla3);

        var Polilla4 = new OneModelAnim();
        Polilla4.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(800, 400, 2700);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="19";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 19));
        this.PraderaEnemies.push(Polilla4);

        var Polilla5 = new OneModelAnim();
        Polilla5.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(2500, 400, 4500);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="20";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 20));
        this.PraderaEnemies.push(Polilla5);

        var Polilla6 = new OneModelAnim();
        Polilla6.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(3900, 400, -1500);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="21";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 21));
        this.PraderaEnemies.push(Polilla6);

        var Polilla7 = new OneModelAnim();
        Polilla7.LoadModel("Assets/Pradera/Enemies/butterfly/Mariposa.fbx", loadingManager, 1.5, (object)=>{
            object.scale.set(0.03, 0.03, 0.03);
            object.position.set(5300, 400, 1200);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(7000, 9000, 8500);
            object.add(visor);
            visor.position.set(0, -150, 150);
            visor.name="22";
            visor.visible= false;
            var Life = this.CreateLife(2000, 200, 200);
            Life.position.set(0, 2000, 0);
            Life.rotation.y = 90 * 180/3.1416;
            Life.name="vida";
            object.add(Life);
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(1000, 400, 700, "Polilla", 500, 22));
        this.PraderaEnemies.push(Polilla7);

        var Magic = new OneModelAnim();
        Magic.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-6700, 200, 7000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="23";
            visor.visible= false;
            this.Pradera.add(object);
            this.PraderaEnemiesCollider.push(visor);
        });
        this.PraderaEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 23));
        this.PraderaEnemies.push(Magic);

    }

    NieveScene(loadingManager)
    {
        //Incia la escena
        this.Nieve = new THREE.Scene();

        //Luces
        var Luces = new Lightt();
        Luces.DirectionalLight(0xFFFFFF, 0.3);
        Luces.DirectionDLight(20, 90, 0);
        Luces.AmbientLight(0xFFFFFF);
        Luces.GetAmbientLight().name = "LuzNieve";
        this.Nieve.add(Luces.GetAmbientLight());
        this.Nieve.add(Luces.GetDirectionalLight());
        this.Nieve.add(Luces.GetDirectionalLight().target);
        Luces.GetDirectionalLight().shadow.mapSize.width = 512;
        Luces.GetDirectionalLight().shadow.mapSize.height = 512;
        Luces.GetDirectionalLight().shadow.camera.near = 0.5;
        Luces.GetDirectionalLight().shadow.camera.far = 10000;

        //Help para el día y la noche
        const helper = new THREE.CameraHelper( Luces.GetDirectionalLight().shadow.camera );
        this.Nieve.add( helper );

        //Skydome
        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        SkydomeT.Render().name = "NieveSky";
        this.Nieve.add(SkydomeT.Render());

        //Terreno
        var Terreno = new Terrain();
        Terreno.MultitextureTerrain("Assets/Nieve/Rock_Nieve.png", "Assets/Nieve/Snow.jpg", "Assets/Nieve/Snow2.jpg", "Assets/Nieve/Alturas.png", "Assets/Nieve/Blendmap_Nieve.png", 900, 18000, 18000);
        Terreno.GetPlane().position.y = -290;
        this.Nieve.add(Terreno.GetPlane());

        //Modelos
        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Pino.glb", loadingManager, (object)=>{ //Pino
            object.scale.set(0.45, 0.45, 0.45);

            var Arbol2 = object.clone();
            Arbol2.position.set(300, 240, 7500);

            var Arbol3 = object.clone();
            Arbol3.position.set(-2300, 200, 6500);

            var Arbol4 = object.clone();
            Arbol4.position.set(-800, 290, 6900);

            var Arbol5 = object.clone();
            Arbol5.position.set(-2300, 120, 8000);

            var Arbol6 = object.clone();
            Arbol6.position.set(-4300, 50, 5500);

            var Arbol7 = object.clone();
            Arbol7.position.set(-5300, 290, 7000);

            var Arbol8 = object.clone();
            Arbol8.position.set(4900, 190, 5000);

            var Arbol9 = object.clone();
            Arbol9.position.set(6900, 50, 5000);

            var Arbol10 = object.clone();
            Arbol10.position.set(5900, -100, 7000);

            var Arbol11 = object.clone();
            Arbol11.position.set(7600, -60, 7500);

            var Arbol12 = object.clone();
            Arbol12.position.set(-500, 210, 1500);

            var Arbol13 = object.clone();
            Arbol13.position.set(1500, 210, -500);

            var Arbol14 = object.clone();
            Arbol14.position.set(-1500, -10, -500);

            var Arbol15 = object.clone();
            Arbol15.position.set(6500, 120, -6500);

            object.position.set(500, 390, 5500);

            this.Nieve.add(object);
            this.Nieve.add(Arbol2);
            this.Nieve.add(Arbol3);
            this.Nieve.add(Arbol4);
            this.Nieve.add(Arbol5);
            this.Nieve.add(Arbol6);
            this.Nieve.add(Arbol7);
            this.Nieve.add(Arbol8);
            this.Nieve.add(Arbol9);
            this.Nieve.add(Arbol10);
            this.Nieve.add(Arbol11);
            this.Nieve.add(Arbol12);
            this.Nieve.add(Arbol13);
            this.Nieve.add(Arbol14);
            this.Nieve.add(Arbol15);

            this.NieveObjects.push(object);
            this.NieveObjects.push(Arbol2);
            this.NieveObjects.push(Arbol3);
            this.NieveObjects.push(Arbol4);
            this.NieveObjects.push(Arbol5);
            this.NieveObjects.push(Arbol6);
            this.NieveObjects.push(Arbol7);
            this.NieveObjects.push(Arbol8);
            this.NieveObjects.push(Arbol9);
            this.NieveObjects.push(Arbol10);
            this.NieveObjects.push(Arbol11);
            this.NieveObjects.push(Arbol12);
            this.NieveObjects.push(Arbol13);
            this.NieveObjects.push(Arbol14);
            this.NieveObjects.push(Arbol15);
        });

        this.Load3dModelGLTF("Assets/Models/Arboles_Inicio/Arbol_O3.glb", loadingManager, (object)=>{ //Arbol
            object.scale.set(130, 130, 130);

            var Arbol2 = object.clone();
            Arbol2.position.set(-800, 350, 5000);

            var Arbol3 = object.clone();
            Arbol3.position.set(-800, 230, 2500);

            var Arbol4 = object.clone();
            Arbol4.position.set(-7800, 450, 1500);

            var Arbol5 = object.clone();
            Arbol5.position.set(-5800, 400, 500);

            var Arbol6 = object.clone();
            Arbol6.position.set(-4800, 400, 1500);

            var Arbol7 = object.clone();
            Arbol7.position.set(-6800, 450, 500);

            var Arbol8 = object.clone();
            Arbol8.position.set(-7800, 200, 4000);

            var Arbol9 = object.clone();
            Arbol9.position.set(-5800, 400, 3000);

            var Arbol10 = object.clone();
            Arbol10.position.set(-4800, 160, 4000);

            var Arbol11 = object.clone();
            Arbol11.position.set(-6800, 400, 3000);

            var Arbol12 = object.clone();
            Arbol12.position.set(-6400, 200, 6000);

            var Arbol13 = object.clone();
            Arbol13.position.set(-7800, 250, 8200);

            var Arbol14 = object.clone();
            Arbol14.position.set(8200, 50, 400);

            var Arbol15 = object.clone();
            Arbol15.position.set(5200, 200, 400);

            var Arbol16 = object.clone();
            Arbol16.position.set(8500, 50, 2000);

            var Arbol17 = object.clone();
            Arbol17.position.set(5800, 200, 2000);

            object.position.set(-3000, -30, 4000);
            
            this.Nieve.add(object);
            this.Nieve.add(Arbol2);
            this.Nieve.add(Arbol3);
            this.Nieve.add(Arbol4);
            this.Nieve.add(Arbol5);
            this.Nieve.add(Arbol6);
            this.Nieve.add(Arbol7);
            this.Nieve.add(Arbol8);
            this.Nieve.add(Arbol9);
            this.Nieve.add(Arbol10);
            this.Nieve.add(Arbol11);
            this.Nieve.add(Arbol12);
            this.Nieve.add(Arbol13);
            this.Nieve.add(Arbol14);
            this.Nieve.add(Arbol15);
            this.Nieve.add(Arbol16);
            this.Nieve.add(Arbol17);

            this.NieveObjects.push(object);
            this.NieveObjects.push(Arbol2);
            this.NieveObjects.push(Arbol3);
            this.NieveObjects.push(Arbol4);
            this.NieveObjects.push(Arbol5);
            this.NieveObjects.push(Arbol6);
            this.NieveObjects.push(Arbol7);
            this.NieveObjects.push(Arbol8);
            this.NieveObjects.push(Arbol9);
            this.NieveObjects.push(Arbol10);
            this.NieveObjects.push(Arbol11);
            this.NieveObjects.push(Arbol12);
            this.NieveObjects.push(Arbol13);
            this.NieveObjects.push(Arbol14);
            this.NieveObjects.push(Arbol15);
            this.NieveObjects.push(Arbol16);
            this.NieveObjects.push(Arbol17);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Antorcha.glb", loadingManager, (object)=>{ //Antorcha
            object.scale.set(13, 13, 13);

            var Antorcha2 = object.clone();
            Antorcha2.position.set(5200, 240, -500);

            var Antorcha3 = object.clone();
            Antorcha3.position.set(3300, 420, -2500);

            var Antorcha4 = object.clone();
            Antorcha4.position.set(5200, 110, -2500);

            var Antorcha5 = object.clone();
            Antorcha5.position.set(500, 380, -3500);

            var Antorcha6 = object.clone();
            Antorcha6.position.set(500, 250, -7200);

            var Antorcha7 = object.clone();
            Antorcha7.position.set(-6500, 210, -3500);

            var Antorcha8 = object.clone();
            Antorcha8.position.set(-6500, 300, -7200);

            object.position.set(3700, 330, -500);

            this.Nieve.add(object);
            this.Nieve.add(Antorcha2);
            this.Nieve.add(Antorcha3);
            this.Nieve.add(Antorcha4);
            this.Nieve.add(Antorcha5);
            this.Nieve.add(Antorcha6);
            this.Nieve.add(Antorcha7);
            this.Nieve.add(Antorcha8);

            this.NieveObjects.push(object);
            this.NieveObjects.push(Antorcha2);
            this.NieveObjects.push(Antorcha3);
            this.NieveObjects.push(Antorcha4);
            this.NieveObjects.push(Antorcha5);
            this.NieveObjects.push(Antorcha6);
            this.NieveObjects.push(Antorcha7);
            this.NieveObjects.push(Antorcha8);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Hoguera.glb", loadingManager, (object)=>{ //Hoguera
            object.scale.set(25, 25, 25);

            object.position.set(-3900, -30, -5500);
            this.Nieve.add(object);
            this.NieveObjects.push(object);
        });

        this.Load3dModelGLTF("Assets/Models/Campamento/Casa.glb", loadingManager, (object)=>{ //Casa
            object.scale.set(3, 3, 3);

            var Casa2 = object.clone();
            Casa2.rotation.y = 90 * 3.1416 / 180;
            Casa2.position.set(-6200, 190, -5300);

            object.position.set(-3900, -30, -8000);
            this.Nieve.add(object);
            this.Nieve.add(Casa2);
            
            this.NieveObjects.push(object);
            this.NieveObjects.push(Casa2);
        });

        this.Load3dModelGLTF("Assets/Models/Roca/Snow_Rock.glb", loadingManager, (object)=>{ //Roca
            object.scale.set(0.1, 0.1, 0.1);

            var roca2 = object.clone();
            roca2.position.set(-1500, 240, 1800);

            var roca3 = object.clone();
            roca3.position.set(2200, 200, 1800);

            var roca4 = object.clone();
            roca4.position.set(-4200, 200, 8000);

            var roca5 = object.clone();
            roca5.position.set(-6200, 380, 7600);

            var roca6 = object.clone();
            roca6.position.set(6200, 180, 4600);

            var roca7 = object.clone();
            roca7.position.set(4500, 180, 7600);

            var roca8 = object.clone();
            roca8.position.set(8200, 70, 7600);

            object.position.set(500, 200, 100);
            this.Nieve.add(object);
            this.Nieve.add(roca2);
            this.Nieve.add(roca3);
            this.Nieve.add(roca4);
            this.Nieve.add(roca5);
            this.Nieve.add(roca6);
            this.Nieve.add(roca7);
            this.Nieve.add(roca8);

            this.NieveObjects.push(object);
            this.NieveObjects.push(roca2);
            this.NieveObjects.push(roca3);
            this.NieveObjects.push(roca4);
            this.NieveObjects.push(roca5);
            this.NieveObjects.push(roca6);
            this.NieveObjects.push(roca7);
            this.NieveObjects.push(roca8);
        });

        this.Load3dModelGLTF("Assets/Models/Bag/Bag.glb", loadingManager, (object)=>{
            object.scale.set(0.1, 0.1, 0.1);

            var bolsa2 = object.clone();
            bolsa2.position.set(-7500, 280, 8300);
            bolsa2.children[0].children[0].children[0].children[0].children[0].name="2";
            var Item2 = new HealItem("Pocion Alta", 500, 1);

            var bolsa3 = object.clone();
            bolsa3.position.set(-7500, 90, 5300);
            bolsa3.children[0].children[0].children[0].children[0].children[0].name="3";
            var Item3 = new HealItem("Pocion Basica", 100, 1);

            var bolsa4 = object.clone();
            bolsa4.position.set(-3000, 150, 7400);
            bolsa4.children[0].children[0].children[0].children[0].children[0].name="4";
            var Item4 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa5 = object.clone();
            bolsa5.position.set(-60, 460, 6000);
            bolsa5.children[0].children[0].children[0].children[0].children[0].name="5";
            var Item5 = new HealItem("Pocion Alta", 500, 1);

            var bolsa6 = object.clone();
            bolsa6.position.set(-4000, 300, 1300);
            bolsa6.children[0].children[0].children[0].children[0].children[0].name="6";
            var Item6 = new HealItem("Pocion Alta", 500, 1);

            var bolsa7 = object.clone();
            bolsa7.position.set(-4000, 300, 4000);
            bolsa7.children[0].children[0].children[0].children[0].children[0].name="7";
            var Item7 = new HealItem("Pocion Defensa", 100, 1);

            var bolsa8 = object.clone();
            bolsa8.position.set(-800, 300, 4000);
            bolsa8.children[0].children[0].children[0].children[0].children[0].name="8";
            var Item8 = new HealItem("Pocion Basica", 100, 1);

            var bolsa9 = object.clone();
            bolsa9.position.set(6500, -130, 7000);
            bolsa9.children[0].children[0].children[0].children[0].children[0].name="9";
            var Item9 = new HealItem("Pocion Alta", 500, 1);

            var bolsa10 = object.clone();
            bolsa10.position.set(6500, 200, 3000);
            bolsa10.children[0].children[0].children[0].children[0].children[0].name="10";
            var Item10 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa11 = object.clone();
            bolsa11.position.set(6500, 0, -1300);
            bolsa11.children[0].children[0].children[0].children[0].children[0].name="11";
            var Item11 = new HealItem("Pocion Ataque", 300, 1);

            var bolsa12 = object.clone();
            bolsa12.position.set(6500, 200, -7300);
            bolsa12.children[0].children[0].children[0].children[0].children[0].name="12";
            var Item12 = new HealItem("Pocion Basica", 100, 1);

            object.position.set(-5000, 320, 7000);
            object.children[0].children[0].children[0].children[0].children[0].name="1";
            var Item1 = new HealItem("Pocion Ataque", 300, 1);
            this.Nieve.add(object);
            this.Nieve.add(bolsa2);
            this.Nieve.add(bolsa3);
            this.Nieve.add(bolsa4);
            this.Nieve.add(bolsa5);
            this.Nieve.add(bolsa6);
            this.Nieve.add(bolsa7);
            this.Nieve.add(bolsa8);
            this.Nieve.add(bolsa9);
            this.Nieve.add(bolsa10);
            this.Nieve.add(bolsa11);
            this.Nieve.add(bolsa12);

            var ItemsArray = [];
            ItemsArray.push(Item1);
            ItemsArray.push(Item2);
            ItemsArray.push(Item3);
            ItemsArray.push(Item4);
            ItemsArray.push(Item5);
            ItemsArray.push(Item6);
            ItemsArray.push(Item7);
            ItemsArray.push(Item8);
            ItemsArray.push(Item9);
            ItemsArray.push(Item10);
            ItemsArray.push(Item11);
            ItemsArray.push(Item12);

            var ModelsArray = [];
            ModelsArray.push(object);
            ModelsArray.push(bolsa2);
            ModelsArray.push(bolsa3);
            ModelsArray.push(bolsa4);
            ModelsArray.push(bolsa5);
            ModelsArray.push(bolsa6);
            ModelsArray.push(bolsa7);
            ModelsArray.push(bolsa8);
            ModelsArray.push(bolsa9);
            ModelsArray.push(bolsa10);
            ModelsArray.push(bolsa11);
            ModelsArray.push(bolsa12);

            this.NieveItems = {model: ModelsArray, items: ItemsArray};
        });

        var portal = this.CreateRIcon("Assets/Images/energy.png");
        portal.position.set(100, 200, 8550);
        portal.name="portalPantano";
        this.Nieve.add(portal);
        this.NieveObjects.push(portal);

        //Personaje
        var ModelPlayer = new modelAnimController(this.Playeranimations, "Assets/Models/Player/Player_Idle.fbx");
        ModelPlayer.CreateBaseModel("PlayerModell", loadingManager, (object)=>{
            var PlayerModel = new THREE.Object3D();
            PlayerModel.name = "PlayerModel";
            PlayerModel.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
                //new THREE.Vector3(0, -1, 0),
            ];
            PlayerModel.add(object);
            for (let i = 0; i < this.Playeranimations.length; i++) {
                ModelPlayer.LoadMultipleAnimations(i, (objectAnim)=>{
                    PlayerModel.add(objectAnim);
                });
            }
            this.Nieve.add(PlayerModel);
            PlayerModel.position.set(1000, 200, 8550);
            PlayerModel.rotation.y = 180 * 3.1416 / 180;
        });
        this.Player.SetModel(ModelPlayer, "Nieve");

        var FlyGuardian = new OneModelAnim();
        FlyGuardian.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-5900, 500, 6050);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="0";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 0));

        var FlyGuardian2 = new OneModelAnim();
        FlyGuardian2.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-4000, 500, 7050);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="1";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian2);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 1));

        var FlyGuardian3 = new OneModelAnim();
        FlyGuardian3.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-7000, 500, 7450);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="2";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian3);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 2));

        var FlyGuardian4 = new OneModelAnim();
        FlyGuardian4.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-4000, 500, 2450);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="3";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian4);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 3));

        var FlyGuardian5 = new OneModelAnim();
        FlyGuardian5.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-6300, 650, 2950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="4";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian5);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 4));

        var FlyGuardian6 = new OneModelAnim();
        FlyGuardian6.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(5300, 600, 2950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="5";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian6);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 5));

        var FlyGuardian7 = new OneModelAnim();
        FlyGuardian7.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(6600, 500, 5950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="6";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian7);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 6));

        var FlyGuardian8 = new OneModelAnim();
        FlyGuardian8.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(-100, 550, 500);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="7";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian8);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 7));

        var FlyGuardian9 = new OneModelAnim();
        FlyGuardian9.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(1200, 550, 2000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="8";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian9);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 8));

        var FlyGuardian10 = new OneModelAnim();
        FlyGuardian10.LoadModel("Assets/Nieve/Enemies/FlyGuardian/FlyGuardian1.fbx", loadingManager, 2.5, (object)=>{
            object.scale.set(0.15, 0.15, 0.15);
            object.position.set(6500, 550, -5000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(800, 50, 50);
            Life.position.set(0, 400, 0);
            Life.name="vida";
            object.add(Life);
            var visor = this.CreateCubeVisor(1100, 3000, 1100);
            object.add(visor);
            visor.visible= false;
            visor.position.set(0, -1000, 0);
            visor.name="10";
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(FlyGuardian10);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 500, "FlyGuardian", 600, 10));

        var Ghost = new OneModelAnim();
        Ghost.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(-500, 450, 5550);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="11";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 11));

        var Ghost2 = new OneModelAnim();
        Ghost2.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(-2500, 200, 6950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="12";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost2);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 12));

        var Ghost3 = new OneModelAnim();
        Ghost3.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(-3900, 40, 3950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="13";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost3);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 13));

        var Ghost4 = new OneModelAnim();
        Ghost4.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(-2500, 40, 250);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="14";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost4);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 14));

        var Ghost5 = new OneModelAnim();
        Ghost5.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(-7200, 300, -950);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="15";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost5);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 15));

        var Ghost6 = new OneModelAnim();
        Ghost6.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(7300, 130, 3000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="16";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost6);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 16));

        var Ghost7 = new OneModelAnim();
        Ghost7.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(6500, 130, 300);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="17";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost7);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 17));

        var Ghost8 = new OneModelAnim();
        Ghost8.LoadModel("Assets/Nieve/Enemies/Ghost/A_GhostFly.fbx", loadingManager, 1, (object)=>{
            object.scale.set(13.5, 13.5, 13.5);
            object.position.set(500, 130, 300);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var Life = this.CreateLife(10, 0.5, 0.5);
            Life.position.set(0, 15, 0);
            Life.name="vida";
            var visor = this.CreateCubeVisor(40, 40, 40);
            object.add(visor);
            visor.visible= false;
            visor.name="18";
            this.NieveEnemiesCollider.push(visor);
            object.add(Life);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Ghost8);
        this.NieveEnemiesStats.push(new Enemigo(3000, 500, 900, "Ghost", 600, 18));

        var Magic = new OneModelAnim();
        Magic.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-5000, 130, -6000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="19";
            visor.visible= false;
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Magic);
        this.NieveEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 19));

        var Magic2 = new OneModelAnim();
        Magic2.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-2000, -60, -7000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="20";
            visor.visible= false;
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Magic2);
        this.NieveEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 20));

        var Magic3 = new OneModelAnim();
        Magic3.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-2000, 130, -3000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="21";
            visor.visible= false;
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Magic3);
        this.NieveEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 21));

        var Magic4 = new OneModelAnim();
        Magic4.LoadModel("Assets/Nieve/Enemies/Magic/Magic.fbx", loadingManager, 2, (object)=>{
            object.scale.set(0.5, 0.5, 0.5);
            object.position.set(-5800, 230, -4000);
            object.rays = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0),
            ];
            var visor = this.CreateCubeVisor(10, 10, 10);
            object.add(visor);
            visor.position.set(0, 0, 0);
            visor.name="22";
            visor.visible= false;
            this.NieveEnemiesCollider.push(visor);
            this.Nieve.add(object);
        });
        this.NieveEnemies.push(Magic4);
        this.NieveEnemiesStats.push(new Enemigo(99999999, 99999999, 99999999, "Magic", 99999999, 22));
    }

    Load3dModelGLTF(model, loadingManager, onLoadCallback)
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
        this.rainCount = 30000;
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
            positions[i+1] -= 70.0 + Math.random() * 0.1;
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
        this.Lodo.GetMud().material.map.offset.y = this.tiempo * 0.0025;
    }

    Snow()
    {
        const geometry = new THREE.BufferGeometry();
        let parameters;
	    const vertices = [];
        const materials = [];
        this.ParticlesSnow = [];
        const textureLoader = new THREE.TextureLoader();

        const sprite1 = textureLoader.load( 'Assets/Nieve/snowflake1.png' );
		const sprite2 = textureLoader.load( 'Assets/Nieve/snowflake2.png' );
		const sprite3 = textureLoader.load( 'Assets/Nieve/snowflake3.png' );
		const sprite4 = textureLoader.load( 'Assets/Nieve/snowflake4.png' );
		const sprite5 = textureLoader.load( 'Assets/Nieve/snowflake5.png' );

        for ( let i = 0; i < 70000; i ++ ) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            vertices.push( x, y, z );
        }
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        parameters = [
            [[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
            [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
            [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
            [[ 0.85, 0, 0.5 ], sprite5, 8 ],
            [[ 0.80, 0, 0.5 ], sprite4, 5 ]
        ];

        for ( let i = 0; i < parameters.length; i ++ ) {
            const color = parameters[ i ][ 0 ];
            const sprite = parameters[ i ][ 1 ];
            const size = parameters[ i ][ 2 ];
            materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
            materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );
            const particles = new THREE.Points( geometry, materials[ i ] );
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            particles.scale.set(10, 10, 10);
            this.ParticlesSnow.push(particles);
        }

        for (let i = 0; i < this.ParticlesSnow.length; i++) {
            this.Nieve.add( this.ParticlesSnow[i] );
        }
    }

    SnowUpdate(time)
    {
        for ( let i = 0; i < this.ParticlesSnow.length; i ++ ) {
            const object = this.ParticlesSnow[ i ];
            if ( object instanceof THREE.Points ) {
                object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
    }

    CreateCubeVisor(width, height, depth)
    {
        const geometry = new THREE.BoxGeometry( width, height, depth );
        const material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
        const cube = new THREE.Mesh( geometry, material );
        return cube;
    }

    CreateLife(width, height, depth)
    {
        const geometry = new THREE.BoxGeometry( width, height, depth );
        const material = new THREE.MeshBasicMaterial( {color: 0x00FF27} );
        const cube = new THREE.Mesh( geometry, material );
        return cube;
    }

    CreateRIcon(texture)
    {
        const text = new THREE.TextureLoader().load( texture );;
        text.wrapS = text.wrapT = THREE.RepeatWrapping; 
        const geometry = new THREE.CylinderGeometry( 70, 70, 300, 19 );
        const material = new THREE.MeshBasicMaterial( {map: text, transparent: true /*color: 0x00FF27*/} );
        const cylinder = new THREE.Mesh( geometry, material );
        return cylinder;
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

    GetNieveScene()
    {
        return this.Nieve;
    }

    GetPlayer()
    {
        return this.Player;
    }

    GetPraderaEnemies()
    {
        //return this.PraderaEnemies;
        return this.PraderaEnemigosFinal = {Model: this.PraderaEnemies, Object: this.PraderaEnemiesStats, Collider: this.PraderaEnemiesCollider};
    }

    GetPantanoEnemies()
    {
        //return this.PantanoEnemies;
        return this.PantanoEnemigosFinal = {Model: this.PantanoEnemies, Object: this.PantanoEnemiesStats, Collider: this.PantanoEnemiesCollider};
    }

    GetNieveEnemies()
    {
        //return this.NieveEnemies;
        return this.NieveEnemigosFinal = {Model: this.NieveEnemies, Object: this.NieveEnemiesStats, Collider: this.NieveEnemiesCollider};
    }

    GetPraderaObjects()
    {
        return this.PraderaObjects;
    }

    GetPraderaItems()
    {
        return this.PraderaItems;
    }

    GetPantanoObjects()
    {
        return this.PantanoObjects;
    }

    GetPantanoItems()
    {
        return this.PantanoItems;
    }

    GetNieveObjects()
    {
        return this.NieveObjects;
    }

    GetNieveItems()
    {
        return this.NieveItems;
    }
}

export { Scenee };