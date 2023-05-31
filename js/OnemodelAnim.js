import * as THREE from 'three';
import {FBXLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/FBXLoader.js';

class OneModelAnim
{
    constructor()
    {
        this.Mixer;
    }

    LoadModel(Model, loadingManager, speed, onLoadCallback)
    {
        const loader = new FBXLoader(loadingManager);
        loader.load(Model, (personaje)=>{
            this.Mixer = new THREE.AnimationMixer(personaje);
            var Action = this.Mixer.clipAction(personaje.animations[0]);
            Action.play();
            this.Mixer.timeScale = speed;
            personaje.traverse( function ( child ) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.side = THREE.DoubleSide;
                 }
            });
            onLoadCallback(personaje);
        });
    }

    GetMixer()
    {
        return this.Mixer;
    }
}

export {OneModelAnim};