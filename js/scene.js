import * as THREE from 'three';
import {Lightt} from '/PWGW/js/light.js';
import {Terrain} from '/PWGW/js/terrain.js';
import {skydome} from '/PWGW/js/skydome.js';
import {Lensflare, LensflareElement} from '/PWGW/js/lensflare.js';

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
        Terreno.MultitextureTerrain("Assets/Images/grass.jpg", "Assets/Images/Ground1.jpg", "Assets/Images/Ground2.jpg", "Assets/Images/Alts.png", "Assets/Images/Blend1.png", 20, 100, 100);
        this.Pantano.add(Terreno.GetPlane());

        var SkydomeT = new skydome();
        SkydomeT.Create('Assets/Images/skyboxDay.png');
        this.Pantano.add(SkydomeT.Render());
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
        Luces.GetDirectionalLight().shadow.camera.far = 500;

        //Lensflare
        const textureLoader = new THREE.TextureLoader();
        const textureFlare0 = textureLoader.load( 'Assets/Images/LensFlare.png' );
        const textureFlare3 = textureLoader.load( 'Assets/Images/lensflare3.png' );
        this.Pointlight = new THREE.PointLight( 0xffffff, 1.5, 2000 );
        this.Pointlight.color.setHSL( 0.58, 1.0, 0.95 );
        this.Pointlight.position.set( 1000, 0, 0 );
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
        Terreno.MultitextureTerrain("Assets/Images/grass.jpg", "Assets/Images/Ground1.jpg", "Assets/Images/Ground2.jpg", "Assets/Pradera/Alturas_Pradera.png", "Assets/Images/Blend1.png", 200, 800, 800);
        this.Pradera.add(Terreno.GetPlane());
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
        this.rainCount = 10000;
        let rainBuffer = new THREE.BufferGeometry();
        let posRain = new Float32Array(this.rainCount * 3);
        for (let i = 0; i < (this.rainCount * 3); i += 3) {
            posRain[i] = Math.random() * 400 - 200;
            posRain[i+1] = Math.random() * 100 - 50;
            posRain[i+2] = Math.random() * 300 - 150;
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
        this.Pantano.add(this.rain);
    }

    RainUpdate()
    {
        const positions = this.rain.geometry.attributes.position.array;
        for (let i = 0; i < (this.rainCount * 3); i++) {
            positions[i+1] -= 2.0 + Math.random() * 0.1;
            if(positions[i+1] < (-300 * Math.random()))
            {
                positions[i+1] = 100;
            }
            this.rain.geometry.attributes.position.needsUpdate = true;
        }
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