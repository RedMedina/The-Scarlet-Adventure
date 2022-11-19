import * as THREE from 'three';

class Shots
{
    Disparar(position, rotY, rotX)
    {
        const textureLoader = new THREE.TextureLoader();
        const sprite = textureLoader.load( 'Assets/Images/shot.png' );
        const material = new THREE.SpriteMaterial( { map: sprite, transparent: true} );
        const particle = new THREE.Sprite( material );
        particle.position.set(position.x, position.y + 150, position.z);
        particle.rotation.y = rotY;
        //particle.rotation.x = -rotX;
        particle.rotateX(rotX);
        particle.scale.set(60, 60, 60);
        particle.name = "disparo";
        //particle.lookAt(position);
        return particle;
    }
}

export {Shots};