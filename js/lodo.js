import * as THREE from 'three';

class Mud
{
    CreateMud(enviMap, texture, normal)
    {
        var planeGeo = new THREE.PlaneGeometry( 18000, 18000, 100, 100 );

        const loader = new THREE.TextureLoader();
        const repeats = 10 / 0.2;

        const envirText = loader.load(enviMap);
        envirText.wrapS = THREE.RepeatWrapping;
        envirText.wrapT = THREE.RepeatWrapping;
        envirText.magFilter = THREE.NearestFilter;
        envirText.repeat.set(repeats, repeats);

        const textureColor = loader.load(texture);
        textureColor.wrapS = THREE.RepeatWrapping;
        textureColor.wrapT = THREE.RepeatWrapping;
        textureColor.magFilter = THREE.NearestFilter;
        textureColor.repeat.set(repeats, repeats);

        const textureNormal = loader.load(normal);
        textureNormal.wrapS = THREE.RepeatWrapping;
        textureNormal.wrapT = THREE.RepeatWrapping;
        textureNormal.magFilter = THREE.NearestFilter;
        textureNormal.repeat.set(repeats, repeats);

        var material = new THREE.MeshLambertMaterial({
            //envMap: envirText,
            map: textureColor,
            normalMap: textureNormal,
            //combine:  THREE.MultiplyOperation,
            //reflectivity: 1
            transparent: true,
            opacity: 0.7
        });
        this.plane = new THREE.Mesh(planeGeo, material);
        this.plane.position.y = -100;
        this.plane.rotation.x = -90 * 3.1416 / 180;
    }

    GetMud()
    {
        return this.plane;
    }
}

export { Mud };