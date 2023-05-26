import * as THREE from 'three';

class Terrain
{
    constructor()
    {
        //this.Tiempo = 0;
    }

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

    

    CreateTerrainCollision(bumpmap, scaleBump, onLoadCallback)
    {
        var img = new Image();
        // load img source
        img.onload =  () => {
         
            //get height data from img

           var canvas = document.createElement( 'canvas' );
           canvas.width = img.width;
           canvas.height = img.height;
           var context = canvas.getContext( '2d' );
   
           var size = img.width * img.height;
           var data = new Float32Array( size );
   
           context.drawImage(img,0,0);
   
           for ( var i = 0; i < size; i ++ ) {
               data[i] = 0
           }
   
           var imgd = context.getImageData(0, 0, img.width, img.height);
           var pix = imgd.data;
   
           var j=0;
           for (var i = 0; i<pix.length; i +=4) {
               var all = pix[i]+pix[i+1]+pix[i+2];
               data[j++] = all/3;
           }

            var data2 = data;
         
            // plane
            var geometry = new THREE.PlaneGeometry(18000*img.width/img.height, 18000, img.width-1, img.height-1);
            var texture = new THREE.TextureLoader().load( bumpmap );
            var material = new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide} );
            this.planeColl = new THREE.Mesh( geometry, material );
            this.planeColl.visible = false;
            //set height of vertices

            for ( var i = 0; i<this.planeColl.geometry.attributes.position.array.length; i++ ) {
                var terrainValue = data2[i] / 255;
                this.planeColl.geometry.attributes.position.array[(i*3)-1] =  this.planeColl.geometry.attributes.position.array[(i*3)-1] + terrainValue * scaleBump ;
            }
            this.planeColl.geometry.attributes.position.array[this.planeColl.geometry.attributes.position.array.length-1] = 160;
            console.log( this.planeColl.geometry.attributes.position.array);
            this.planeColl.rotation.x = -Math.PI / 2;
	        this.planeColl.position.y = -2;
            onLoadCallback(this.planeColl);
        };
        img.src = bumpmap;
    }

    GetTerrainCollision()
    {
        return this.planeColl;
    }

    getHeightData(img,scale) {
     
        if (scale == undefined) scale=1;
        
           var canvas = document.createElement( 'canvas' );
           canvas.width = img.width;
           canvas.height = img.height;
           var context = canvas.getContext( '2d' );
   
           var size = img.width * img.height;
           var data = new Float32Array( size );
   
           context.drawImage(img,0,0);
   
           for ( var i = 0; i < size; i ++ ) {
               data[i] = 0
           }
   
           var imgd = context.getImageData(0, 0, img.width, img.height);
           var pix = imgd.data;
   
           var j=0;
           for (var i = 0; i<pix.length; i +=4) {
               var all = pix[i]+pix[i+1]+pix[i+2];
               data[j++] = all/(12*scale);
           }
           
           return data;
       }

    SetTiempo(time)
    {
        this.Tiempo = time;
    }

    MultitextureTerrain(textura1, textura2, textura3, heighmap, blendmap, bump, width, height)
    {
        const vertexShader = `
        uniform sampler2D bumpTexture;
        uniform float bumpScale;
        uniform sampler2D blendmap;
        
        varying float vAmount;
        varying float vBlend;
        varying float vBlendr;
        varying float vBlendg;
        varying float vBlendb;
        varying vec2 vUV;
        varying vec3 vNormal;
        
        void main() 
        { 
            vUV = uv;
            vNormal = normal;
            vec4 bumpData = texture2D( bumpTexture, uv );
            vec4 blendData = texture2D( blendmap, uv );

            vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
            vBlend = blendData.r;
            vBlendr = blendData.r;
            vBlendg = blendData.g;
            vBlendb = blendData.b;
            
            // move the position along the normal
            vec3 newPosition = position + normal * bumpScale * vAmount;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }`;

        const fragmentShader = `
        uniform sampler2D oceanTexture;
        uniform sampler2D sandyTexture;
        uniform sampler2D grassTexture;
        uniform float time;
        //uniform sampler2D rockyTexture;
        //uniform sampler2D snowyTexture;
        
        varying vec2 vUV;
        
        varying float vAmount;
        varying float vBlend;
        varying float vBlendr;
        varying float vBlendg;
        varying float vBlendb;
        varying vec3 vNormal;

        
        void main() 
        {
            //vec4 water = (smoothstep(0.00, 0.50, vBlend) - smoothstep(0.51, 1.0, vBlend) ) * texture2D( oceanTexture, vUV * 10.0 );
            //vec4 sandy = (smoothstep(0.51, 1.0, vBlend) /*- smoothstep(0.28, 0.31, vBlend)*/ ) * texture2D( sandyTexture, vUV * 10.0 );
            //vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
            //vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
            //vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec4 water = vBlendr * texture2D( oceanTexture, vUV * 25.0 );
            vec4 sandy = vBlendg * texture2D( sandyTexture, vUV * 25.0 );
            vec4 grass = vBlendb * texture2D( grassTexture, vUV * 25.0 );
            vec4 color1a = vec4(0.75, 0.75, 0.75, 1); // Primer color de transición (celeste)
            vec4 color2b = vec4(1.0, 0.5, 0.2, 1); // Segundo color de transición (naranja)
            vec4 color3c = vec4(0.0, 0.0, 0.0, 1); // Tercer color de transición (negro)
            vec4 finalColor = mix(color1a, color2b, time);
            finalColor = mix(finalColor, color3c, time);
            float MixValue;
            if(time>0.5)
            {
                MixValue=0.7f;
            }
            else
            {
                MixValue=0.3f;
            }
            gl_FragColor = mix( (vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass)*intensity, finalColor, MixValue); //, 1.0);
        }`;

        // texture used to generate "bumpiness"
        var bumpTexture = new THREE.TextureLoader().load( heighmap );
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
        //blendMap
        var BlendTexture = new THREE.TextureLoader().load( blendmap );
        BlendTexture.wrapS = BlendTexture.wrapT = THREE.RepeatWrapping;
        // magnitude of normal displacement
        var bumpScale   = bump;
        var oceanTexture = new THREE.TextureLoader().load( textura1 );
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;         
        var sandyTexture = new THREE.TextureLoader().load( textura2 );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
        var grassTexture = new THREE.TextureLoader().load( textura3 );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
        /*var rockyTexture = new THREE.TextureLoader().load( textura4 );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
        var snowyTexture = new THREE.TextureLoader().load( textura5 );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;*/

        const mirrorShader = {
            uniforms: THREE.UniformsUtils.merge( [
			//UniformsLib[ 'lights' ],
            //THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            //THREE.UniformsLib.shadowmap,
            //THREE.UniformsLib.ambient,
            {
                'bumpTexture': { value: bumpTexture },
                'blendmap': { value: BlendTexture },
                'bumpScale': { value: bumpScale },
                'oceanTexture': { value: oceanTexture },
                'sandyTexture': { value: sandyTexture },
                'grassTexture': { value: grassTexture },
                'time': { value: 0 },
            }
        ] )
        };

        var customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: THREE.UniformsUtils.clone( mirrorShader.uniforms ),
            vertexShader:   vertexShader,
            fragmentShader: fragmentShader,
            lights: true,
           // shadowmap: true,
            side: THREE.DoubleSide
        });

        var planeGeo = new THREE.PlaneGeometry( width, height, 100, 100 );
	    this.plane = new THREE.Mesh(planeGeo, customMaterial );
	    this.plane.rotation.x = -Math.PI / 2;
	    this.plane.position.y = -2;
        this.plane.receiveShadow = true;
        this.plane.castShadow = true;
    }

    GetPlane()
    {
        return this.plane;
    }

    MultitextureTerrainWall(textura1, textura2, textura3, heighmap, blendmap, bump, width, height)
    {
        const vertexShader = `
        uniform sampler2D bumpTexture;
        uniform float bumpScale;
        uniform sampler2D blendmap;
        
        varying float vAmount;
        varying float vBlend;
        varying float vBlendr;
        varying float vBlendg;
        varying float vBlendb;
        varying vec2 vUV;
        
        void main() 
        { 
            vUV = uv;
            vec4 bumpData = texture2D( bumpTexture, uv );
            vec4 blendData = texture2D( blendmap, uv );

            vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
            vBlend = blendData.r;
            vBlendr = blendData.r;
            vBlendg = blendData.g;
            vBlendb = blendData.b;
            
            // move the position along the normal
            vec3 newPosition = position + normal * bumpScale * vAmount;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }`;

        const fragmentShader = `
        uniform sampler2D oceanTexture;
        uniform sampler2D sandyTexture;
        uniform sampler2D grassTexture;
        //uniform sampler2D rockyTexture;
        //uniform sampler2D snowyTexture;
        
        varying vec2 vUV;
        
        varying float vAmount;
        varying float vBlend;
        varying float vBlendr;
        varying float vBlendg;
        varying float vBlendb;
        
        void main() 
        {
            //vec4 water = (smoothstep(0.00, 0.50, vBlend) - smoothstep(0.51, 1.0, vBlend) ) * texture2D( oceanTexture, vUV * 10.0 );
            //vec4 sandy = (smoothstep(0.51, 1.0, vBlend) /*- smoothstep(0.28, 0.31, vBlend)*/ ) * texture2D( sandyTexture, vUV * 10.0 );
            //vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
            //vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
            //vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
            vec4 water = vBlendr * texture2D( oceanTexture, vUV * 140.0 );
            vec4 sandy = vBlendg * texture2D( sandyTexture, vUV * 140.0 );
            vec4 grass = vBlendb * texture2D( grassTexture, vUV * 140.0 );
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass; //, 1.0);
        }`;

        // texture used to generate "bumpiness"
        var bumpTexture = new THREE.TextureLoader().load( heighmap );
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
        //blendMap
        var BlendTexture = new THREE.TextureLoader().load( blendmap );
        BlendTexture.wrapS = BlendTexture.wrapT = THREE.RepeatWrapping;
        // magnitude of normal displacement
        var bumpScale   = bump;
        var oceanTexture = new THREE.TextureLoader().load( textura1 );
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;         
        var sandyTexture = new THREE.TextureLoader().load( textura2 );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
        var grassTexture = new THREE.TextureLoader().load( textura3 );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
        /*var rockyTexture = new THREE.TextureLoader().load( textura4 );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
        var snowyTexture = new THREE.TextureLoader().load( textura5 );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;*/

        const mirrorShader = {
            uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib[ 'fog' ],
            THREE.UniformsLib[ 'lights' ],
            THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            THREE.UniformsLib.shadowmap,
            THREE.UniformsLib.ambient,
            {
                'bumpTexture': { value: bumpTexture },
                'blendmap': { value: BlendTexture },
                'bumpScale': { value: bumpScale },
                'oceanTexture': { value: oceanTexture },
                'sandyTexture': { value: sandyTexture },
                'grassTexture': { value: grassTexture },
            }
        ] )
        };

        var customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: THREE.UniformsUtils.clone( mirrorShader.uniforms ),
            vertexShader:   vertexShader,
            fragmentShader: fragmentShader,
            lights: true,
            shadowmap: true,
            // side: THREE.DoubleSide
        });

        var planeGeo = new THREE.PlaneGeometry( width, height, 100, 100 );
	    this.plane2 = new THREE.Mesh(planeGeo, customMaterial );
	    this.plane2.rotation.x = -Math.PI / 2;
	    this.plane2.position.y = -2;
        this.plane2.receiveShadow = true;
    }

    GetPlane2()
    {
        return this.plane2;
    }

}

export { Terrain };