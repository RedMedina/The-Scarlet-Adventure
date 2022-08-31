//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as THREE from 'three';

class Audioo
{
    create()
    {
         this.listener = new THREE.AudioListener();
         this.stopSound = new THREE.Audio( this.listener );
    }

    getListener()
    {
        return this.listener;
    }

    Sound(bgm)
    {
        //var sound = new THREE.Audio( this.listener );
        var sound = new THREE.PositionalAudio( this.listener );
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( bgm, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.play();
            sound.setVolume( 0.7 );
        });
        //terrain.add(sound)
        this.stopSound = sound;
    }

    Stop()
    {
        this.stopSound.stop();
    }
}

export { Audioo };