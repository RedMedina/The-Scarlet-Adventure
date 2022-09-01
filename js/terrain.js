import * as THREE from 'three';

class Terrain
{
    Create(Texture, size)
    {
        const planeSize = size;
        const loader = new THREE.TextureLoader();
        const texture = loader.load(Texture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);
        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(planeGeo, planeMat);
        this.mesh.rotation.x = Math.PI * -.5;
        this.mesh.receiveShadow = true;
    }

    Render()
    {
        return this.mesh;
    }

    MultitextureTerrain(textura1, textura2, heighmap, blendmap)
    {
        const vertexShader = `
        uniform sampler2D bumpTexture;
        uniform float bumpScale;
        uniform sampler2D blendmap;
        
        varying float vAmount;
        varying float vBlend;
        varying vec2 vUV;
        
        void main() 
        { 
            vUV = uv;
            vec4 bumpData = texture2D( bumpTexture, uv );
            vec4 blendData = texture2D( blendmap, uv );

            vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
            vBlend = blendData.r;
            
            // move the position along the normal
            vec3 newPosition = position + normal * bumpScale * vAmount;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }`;

        const fragmentShader = `
        uniform sampler2D oceanTexture;
        uniform sampler2D sandyTexture;
        //uniform sampler2D grassTexture;
        //uniform sampler2D rockyTexture;
        //uniform sampler2D snowyTexture;
        
        varying vec2 vUV;
        
        varying float vAmount;
        varying float vBlend;
        
        void main() 
        {
            vec4 water = (smoothstep(0.01, 0.50, vBlend) - smoothstep(0.51, 1.0, vBlend) ) * texture2D( oceanTexture, vUV * 10.0 );
            vec4 sandy = (smoothstep(0.51, 1.0, vBlend) /*- smoothstep(0.28, 0.31, vBlend)*/ ) * texture2D( sandyTexture, vUV * 10.0 );
            //vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
            //vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
            //vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy; //, 1.0);
        }`;

        // texture used to generate "bumpiness"
        var bumpTexture = new THREE.TextureLoader().load( heighmap );
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
        //blendMap
        var BlendTexture = new THREE.TextureLoader().load( blendmap );
        BlendTexture.wrapS = BlendTexture.wrapT = THREE.RepeatWrapping;
        // magnitude of normal displacement
        var bumpScale   = 20.0;
        var oceanTexture = new THREE.TextureLoader().load( textura1 );
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;         
        var sandyTexture = new THREE.TextureLoader().load( textura2 );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
        /*var grassTexture = new THREE.TextureLoader().load( textura3 );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
        var rockyTexture = new THREE.TextureLoader().load( textura4 );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
        var snowyTexture = new THREE.TextureLoader().load( textura5 );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;*/
        
        var customUniforms = {
            ['bumpTexture']:	{ type: "t", value: bumpTexture },
            ['blendmap']:	{ type: "t", value: BlendTexture },
            ['bumpScale']:	    { type: "f", value: bumpScale },
            ['oceanTexture']:	{ type: "t", value: oceanTexture },
            ['sandyTexture']:	{ type: "t", value: sandyTexture },
           // ['grassTexture']:	{ type: "t", value: grassTexture },
           // ['rockyTexture']:	{ type: "t", value: rockyTexture },
           // ['snowyTexture']:	{ type: "t", value: snowyTexture },
        };

        var customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: customUniforms,
            vertexShader:   vertexShader,
            fragmentShader: fragmentShader,
            //lights: true,
            // side: THREE.DoubleSide
        });

        var planeGeo = new THREE.PlaneGeometry( 100, 100, 100, 100 );
	    this.plane = new THREE.Mesh(	planeGeo, customMaterial );
	    this.plane.rotation.x = -Math.PI / 2;
	    this.plane.position.y = 0;
        this.plane.receiveShadow = true;
    }

    GetPlane()
    {
        return this.plane;
    }

}

export { Terrain };