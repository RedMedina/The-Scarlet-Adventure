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
        var sound = new THREE.Audio( this.listener );
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( bgm, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.3 );
            sound.play();
        });
    }
}

export { Audioo };