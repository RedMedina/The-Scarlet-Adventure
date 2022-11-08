import * as THREE from 'three';

class Lightt
{
    DirectionalLight(color, intensity)
    {
         this.light = new THREE.DirectionalLight(color, intensity);
         this.light.castShadow = true;
         /*this.light.shadow.camera.left = -8500;
         this.light.shadow.camera.right = 8500;
         this.light.shadow.camera.top = 8500;
         this.light.shadow.camera.bottom = -8500;
         this.light.shadow.mapSize.x = 2048;
         this.light.shadow.mapSize.y = 2048;*/
    }

    DirectionDLight(x, y, z)
    {
        this.light.position.set(x, y, z);
    }

    HemisphereLight(skyColor, groundColor, intensity)
    {
        this.Elight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    }

    AmbientLight(color)
    {
        this.Alight = new THREE.AmbientLight(color);
        /*this.Alight.shadow.mapSize.width = 512;
        this.Alight.shadow.mapSize.height = 512;
        this.Alight.shadow.camera.near = 0.5;
        this.Alight.shadow.camera.far = 500;*/
    }

    GetDirectionalLight()
    {
        return this.light;
    }

    GetAmbientLight()
    {
        return this.Alight;
    }

    GetHemisphereLight()
    {
        return this.Elight;
    }
}

export { Lightt };