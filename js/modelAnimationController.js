import * as THREE from 'three';
import {FBXLoader} from '/PWGW/node_modules/three/examples/jsm/loaders/FBXLoader.js';

class modelAnimController
{
    constructor(AnimArray, MainObject)
    {
        this.Animations = AnimArray;
        this.MainObj = MainObject;
        //this.Animations = [];
        this.Actions = [];
        this.Mixer;
        this.AnimacionActual = -1;
    }

    CreateBaseModel(ModelName, loadingManager, onLoadCallback)
    {
        this.loader = new FBXLoader(loadingManager);
        this.loader.load(this.MainObj, (personaje)=>{
            this.Mixer = new THREE.AnimationMixer(personaje);
            personaje.traverse( function ( child ) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.side = THREE.DoubleSide;
                 }
            });
            personaje.name = ModelName;
            onLoadCallback(personaje);
        });
    }

    LoadMultipleAnimations(i, onLoadCallback)
    {
        this.loader.load(`${this.Animations[i]}.fbx`, (object)=>{
            const action = this.Mixer.clipAction(object.animations[0]);
            this.Actions.push(action);
            object.traverse( function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.side = THREE.DoubleSide;
                }
            });
            onLoadCallback(object);
        });
    }

    playAnimation(index, speed)
    {
        if(index != this.AnimacionActual)
        {
            this.Mixer.stopAllAction();
            this.Mixer.timeScale = speed;
            const action =  this.Actions[index];
            action.weight = 1;
            action.fadeIn(0.0);
            action.play();
            this.AnimacionActual = index;
        }
    }

    getMixer()
    {
        return this.Mixer;
    }

    getAnimActual()
    {
        return this.AnimacionActual;
    }
    
}

export { modelAnimController };