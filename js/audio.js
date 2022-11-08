//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as THREE from 'three';

class Audioo
{
    create(nameListener)
    {
         this.listener = new THREE.AudioListener();
         this.listener.name = nameListener;
    }

    getListener()
    {
        return this.listener;
    }

    Sound(bgm)
    {
        this.sound = new THREE.Audio( this.listener );
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( bgm, ( buffer )=> {
            this.sound.setBuffer( buffer );
            this.sound.setLoop( true );
            this.sound.setVolume( 0.01 );
        });
    }

    GetSound()
    {
        return this.sound;
    }
}

export { Audioo };