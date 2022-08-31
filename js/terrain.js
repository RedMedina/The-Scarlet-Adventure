import * as THREE from 'three';

class Terrain
{
    Create(Texture, size)
    {
        const planeSize = size;
        const loader = new THREE.TextureLoader();
        const texture = loader.load(Texture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);
        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(planeGeo, planeMat);
        this.mesh.rotation.x = Math.PI * -.5;
    }

    Render()
    {
        return this.mesh;
    }

    HeightMapC(text, normal, texture2, normal2, blend)
    {
        const groundGeo = new THREE.PlaneGeometry(100, 100, 20, 20);
        let Load = new THREE.TextureLoader();
        let distMap = Load.load("Assets/Images/Alts.png");
        distMap.wrapS = distMap.wrapT = THREE.RepeatWrapping;
        distMap.repeat.set("Assets/Images/Alts.png", "Assets/Images/Alts.png");

        const TexturaLoad = new THREE.TextureLoader();
        let Texture = TexturaLoad.load(text);
        Texture.wrapS = THREE.RepeatWrapping;
        Texture.wrapT = THREE.RepeatWrapping;
        Texture.magFilter = THREE.NearestFilter;
        const repeats = 70 / 2;
        Texture.repeat.set(repeats, repeats);

        const TexturaLoadNormla = new THREE.TextureLoader();
        let TextureNormal = TexturaLoadNormla.load(normal);
        TextureNormal.wrapS = THREE.RepeatWrapping;
        TextureNormal.wrapT = THREE.RepeatWrapping;
        TextureNormal.magFilter = THREE.NearestFilter;
        const repeats2 = 70 / 2;
        TextureNormal.repeat.set(repeats2, repeats2);

        const TexturaLoad2 = new THREE.TextureLoader();
        let Texture2 = TexturaLoad2.load(texture2);
        Texture2.wrapS = THREE.RepeatWrapping;
        Texture2.wrapT = THREE.RepeatWrapping;
        Texture2.magFilter = THREE.NearestFilter;
        const repeats3 = 70 / 2;
        Texture2.repeat.set(repeats3, repeats3);

        const TexturaLoadNorm2 = new THREE.TextureLoader();
        let TextureNormal2 = TexturaLoadNorm2.load(normal2);
        TextureNormal2.wrapS = THREE.RepeatWrapping;
        TextureNormal2.wrapT = THREE.RepeatWrapping;
        TextureNormal2.magFilter = THREE.NearestFilter;
        const repeats4 = 70 / 2;
        TextureNormal2.repeat.set(repeats4, repeats4);

        const TexturaLoadBlend = new THREE.TextureLoader();
        let TextureBlend = TexturaLoadBlend.load(blend);
        TextureBlend.wrapS = THREE.RepeatWrapping;
        TextureBlend.wrapT = THREE.RepeatWrapping;
        TextureBlend.magFilter = THREE.NearestFilter;
        const repeats5 = 70 / 2;
        TextureBlend.repeat.set(repeats5, repeats5);

        const NormalScale = new THREE.Vector2( 5, 5 );

        const groundMat = new THREE.MeshPhongMaterial({
            map: Texture,
            normalScale: NormalScale,
            normalMap: TextureNormal,
            wireframe: false,
            displacementMap: distMap,
            specular: 0xFFFFFF,
            shininess: 1.5,
            displacementScale: 10
            //transparent : true
        });

        const groundMat2 = new THREE.MeshPhongMaterial({
            map: Texture2,
            normalScale: NormalScale,
            normalMap: TextureNormal2,
            wireframe: false,
            displacementMap: distMap,
            specular: 0xFFFFFF,
            shininess: 1.5,
            displacementScale: 10
            //transparent : true
        });

        var uniforms = {
            texture1: { value:  Texture},
            texture2: { value:  Texture2},
            texture3: { value:  TextureBlend },
        };

        /*const ShaderMaterial = new THREE.RawShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById("vertexShader_multitexture").textContent,
            fragmentShader: document.getElementById("fragmentShader_multitexture").textContent
        });*/

        this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
        this.groundMesh.receiveShadow = true;
        this.groundMesh.rotation.x = Math.PI * -.5;
    }

    RenderT()
    {
        return this.groundMesh;
    }

}

export { Terrain };