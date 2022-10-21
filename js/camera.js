import * as THREE from 'three';

class Cameraa
{
    constructor(fov, aspect, near, far)
    {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 10, 20);
        this.camera.rotation.y = 180 * 3.1416 / 180;
    }

    GetCamera()
    {
        return this.camera;
    }
}

export { Cameraa };