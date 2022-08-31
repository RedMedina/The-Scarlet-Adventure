//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as THREE from 'three';

class skydome
{
    Create(textura)
    {
        var skyGeo = new THREE.SphereGeometry(10000, 25, 25);
        var loader  = new THREE.TextureLoader();
        var texture = loader.load( textura );
        var material = new THREE.MeshPhongMaterial({ 
            map: texture,
        });
        this.sky = new THREE.Mesh(skyGeo, material);
        this.sky.material.side = THREE.BackSide;
    }

    Render()
    {
        return this.sky;
    }
}

export { skydome };