import * as THREE from 'three';

class Cameraa
{
    constructor(fov, aspect, near, far)
    {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 10, 20);
    }

    GetCamera()
    {
        return this.camera;
    }
}

export { Cameraa };