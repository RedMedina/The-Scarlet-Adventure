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
        Luces.AmbientLight();
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
        Terreno.MultitextureTerrain("Assets/Images/grass.jpg", "Assets/Images/Ground1.jpg", "Assets/Images/Alts.png", "Assets/Images/Blend.png");
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

    CreateToon3DModel(obj, baseColor, normal, textura, x, y, z)
    {
        const TexturaLoad = new THREE.TextureLoader();
        let Texture = TexturaLoad.load(textura);

        const TexturaLoadB = new THREE.TextureLoader();
        let TextureColor = TexturaLoad.load(baseColor);

        const TexturaLoadN = new THREE.TextureLoader();
        let TextureNormal = TexturaLoad.load(normal);

        Texture.magFilter = THREE.NearestFilter;
        Texture.minFilter = THREE.NearestFilter;
        const CellShading = new THREE.MeshToonMaterial({
            map: TextureColor,
            normalMap: TextureNormal,
            gradientMap: Texture,
        });

        const gltfLoader = new THREE.GLTFLoader();
        const NormalScale = new THREE.Vector2( 5, 5 );
        gltfLoader.load(obj, (gltf) => {
            gltf.scene.traverse((child)=>{
                //child.material = CellShading;
                child.material = new THREE.MeshToonMaterial({map:TextureColor, normalScale: NormalScale, normalMap: TextureNormal})
                child.castShadow = true;
                child.receiveShadow = true;
            })
            gltf.scene.position.x = x;
            gltf.scene.position.y = y;
            gltf.scene.position.z = z;
            this.TestScene.add(gltf.scene);
        });
    }

    GetTestScene()
    {
        return this.TestScene;
    }
}

export { Scenee };