import * as THREE from 'three';
import {Audioo} from '/PWGW/js/audio.js';

class AudioController
{
    constructor()
    {
        //Pradera Sound 1
        this.PraderaSound1 = new Audioo();
        this.PraderaSound1.create("Pradera1");
        this.PraderaSound1.Sound("Assets/BGM/Pradera1.mp3");

        //Pradera Sound 2
        this.PraderaSound2 = new Audioo();
        this.PraderaSound2.create("Pradera2");
        this.PraderaSound2.Sound("Assets/BGM/Pradera2.mp3");

        //Pantano Sound 1
        this.PantanoSound1 = new Audioo();
        this.PantanoSound1.create("Pantano1");
        this.PantanoSound1.Sound("Assets/BGM/Pantano1.mp3");

        //Pantano Sound 1
        this.PantanoSound2 = new Audioo();
        this.PantanoSound2.create("Pantano2");
        this.PantanoSound2.Sound("Assets/BGM/Pantano2.mp3");

        //Nieve Sound 1
        this.NieveSound1 = new Audioo();
        this.NieveSound1.create("Nieve1");
        this.NieveSound1.Sound("Assets/BGM/Nieve1.mp3");

        //Nieve Sound 2
        this.NieveSound2 = new Audioo();
        this.NieveSound2.create("Nieve2");
        this.NieveSound2.Sound("Assets/BGM/Nieve2.mp3");

        //Nochesound
        this.NocheSound = new Audioo();
        this.NocheSound.create("Noche");
        this.NocheSound.Sound("Assets/BGM/Noche.mp3");

        //InitSound 
        this.InitSound = new Audioo();
        this.InitSound.create("InitSound");
        this.InitSound.Sound("Assets/BGM/NewArea.mp3");
    }

    PlayInit()
    {
        this.InitSound.GetSound().setLoop( false );
        this.InitSound.GetSound().play();
    }

    PlaySceneSound(sceneActual)
    {
        if(this.PraderaSound1.GetSound())
        {
            this.PraderaSound1.GetSound().pause();
        }
        if(this.PraderaSound2.GetSound()) 
        {
            this.PraderaSound2.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound1.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound2.GetSound().pause();
        }
        if(this.NieveSound1.GetSound())
        {
            this.NieveSound1.GetSound().pause();
        }
        if(this.NieveSound2.GetSound())
        {
            this.NieveSound2.GetSound().pause();
        }
        if(this.NocheSound.GetSound())
        {
            this.NocheSound.GetSound().pause();
        }

        if(sceneActual == 1)
        {
            var CancionActual = Math.floor(Math.random() * 2);
            if(CancionActual == 0)
            {
                this.PraderaSound1.GetSound().play();
            }else{
                this.PraderaSound2.GetSound().play();
            }
        }
        else if (sceneActual == 2)
        {
            var CancionActual = Math.floor(Math.random() * 2);
            if(CancionActual == 0)
            {
                this.PantanoSound1.GetSound().play();
            }else{
                this.PantanoSound2.GetSound().play();
            }
        }
        else if (sceneActual == 3) 
        {
            var CancionActual = Math.floor(Math.random() * 2);
            if(CancionActual == 0)
            {
                this.NieveSound1.GetSound().play();
            }else{
                this.NieveSound2.GetSound().play();
            }
        }
    }

    PlayNoche()
    {
        if(this.PraderaSound1.GetSound())
        {
            this.PraderaSound1.GetSound().pause();
        }
        if(this.PraderaSound2.GetSound()) 
        {
            this.PraderaSound2.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound1.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound2.GetSound().pause();
        }
        if(this.NieveSound1.GetSound())
        {
            this.NieveSound1.GetSound().pause();
        }
        if(this.NieveSound2.GetSound())
        {
            this.NieveSound2.GetSound().pause();
        }
        
        this.NocheSound.GetSound().play();
    }

    SetVolume(volumen)
    {
        this.PraderaSound1.GetSound().setVolume(volumen);
        this.PraderaSound2.GetSound().setVolume(volumen);
        this.PantanoSound1.GetSound().setVolume(volumen);
        this.PantanoSound2.GetSound().setVolume(volumen);
        this.NieveSound1.GetSound().setVolume(volumen);
        this.NieveSound2.GetSound().setVolume(volumen);
        this.NocheSound.GetSound().setVolume(volumen);
        this.InitSound.GetSound().setVolume(volumen);
    }

    StopAllSound()
    {
        if(this.PraderaSound1.GetSound())
        {
            this.PraderaSound1.GetSound().pause();
        }
        if(this.PraderaSound2.GetSound()) 
        {
            this.PraderaSound2.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound1.GetSound().pause();
        }
        if(this.PantanoSound2.GetSound())
        {
            this.PantanoSound2.GetSound().pause();
        }
        if(this.NieveSound1.GetSound())
        {
            this.NieveSound1.GetSound().pause();
        }
        if(this.NieveSound2.GetSound())
        {
            this.NieveSound2.GetSound().pause();
        }
        if(this.NocheSound.GetSound())
        {
            this.NocheSound.GetSound().pause();
        }
    }
}

export { AudioController };