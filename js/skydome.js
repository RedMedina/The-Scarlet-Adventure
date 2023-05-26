//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import * as THREE from 'three';

class skydome
{
    Create(textura, textura2, textura3)
    {
        var skyGeo = new THREE.SphereGeometry(50000, 25, 25);
        var loader  = new THREE.TextureLoader();
        var texture = loader.load( textura );
        var texture2 = loader.load( textura2 );
        var texture3 = loader.load( textura3 );
        const vertexShader = `

        varying vec2 vUV;
        varying vec3 vNormal;

        void main()
        {
            vUV = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        
        `;

        const fragmentShader = `
        
        uniform sampler2D DiaTexture;
        uniform sampler2D TardeTexture;
        uniform sampler2D NocheTexture;
        uniform float mixValue;

        varying vec2 vUV;
        varying vec3 vNormal;

        void main()
        {
            vec4 color1 = texture2D(DiaTexture, vUV);
            vec4 color2 = texture2D(TardeTexture, vUV);
            vec4 color3 = texture2D(NocheTexture, vUV);

            vec4 finalColor = mix(color1, color2, mixValue);
            finalColor = mix(finalColor, color3, mixValue);

            gl_FragColor = finalColor;
        }
        
        `;

        const mirrorShader = {
            uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib.lights,
            {
                'DiaTexture': { value: texture },
                'TardeTexture': { value: texture2 },
                'NocheTexture': { value: texture3 },
                'mixValue': { value: 0 },
            }
        ] )
        };
        var customMaterial = new THREE.ShaderMaterial( 
            {
                uniforms: THREE.UniformsUtils.clone( mirrorShader.uniforms ),
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader,
                lights: true,
                //side: THREE.DoubleSide
            });

        var material = new THREE.MeshPhongMaterial({ 
            map: texture,
        });
        this.sky = new THREE.Mesh(skyGeo, customMaterial);
        this.sky.material.side = THREE.BackSide;
    }

    Render()
    {
        return this.sky;
    }
}

export { skydome };