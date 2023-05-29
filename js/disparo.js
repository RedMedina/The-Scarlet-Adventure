import * as THREE from 'three';

class Shots
{
    Disparar(position, rotY, rotX, texture, disparo)
    {
        const textureLoader = new THREE.TextureLoader();
        const sprite = textureLoader.load( texture );
        const material = new THREE.SpriteMaterial( { map: sprite, transparent: true} );
        const particle = new THREE.Sprite( material );
        //particle.lookAt(position);
        const geometry = new THREE.BoxGeometry( 50, 50, 50 );
        const materialCollider = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
        const cube = new THREE.Mesh( geometry, materialCollider );
        cube.position.set(position.x, position.y + 150, position.z);
        //const light = new THREE.PointLight(0xBE00F1, 1, 10);
        if(disparo)
        {
            cube.rotation.y = rotY;
            /*cube.rays[
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(0, 0.5, 0),
                new THREE.Vector3(0, -0.5, 0)];*/
            //particle.rotation.x = -rotX;
            cube.rotateX(rotX);
        }
        particle.scale.set(60, 60, 60);
        cube.name = "disparo";
        cube.add(particle);
        //cube.add(light);
        cube.material.transparent = true;
        cube.material.opacity = 0;
        return cube;
    }
}

export {Shots};