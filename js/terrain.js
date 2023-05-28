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

    MultitextureTerrain(textura1, textura2, textura3, textura1Normal, textura2Normal, textura3Normal, heighmap, blendmap, bump, width, height)
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

        //-----------------------------------
        varying vec3 vWorldPos;
        varying vec4 vEyeSpacePos;
        varying vec3 vTangent;
        varying vec3 vBinormal;

        varying vec3 EyeDirection_cameraspace;
        varying vec3 LightDirection_cameraspace;
        varying vec3 LightDirection_tangentspace;
        varying vec3 EyeDirection_tangentspace;
        
        vec3 calculateTangent(vec3 position1, vec3 position2, vec3 position3, vec2 uv1, vec2 uv2, vec2 uv3) {
            vec3 edge1 = position2 - position1;
            vec3 edge2 = position3 - position1;
            vec2 deltaUV1 = uv2 - uv1;
            vec2 deltaUV2 = uv3 - uv1;
        
            float f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
        
            vec3 tangent;
            tangent.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
            tangent.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
            tangent.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);
        
            return normalize(tangent);
        }

        void main() 
        { 
            vUV = uv;
            vNormal = normal;
            vec4 bumpData = texture2D( bumpTexture, uv );
            vec4 blendData = texture2D( blendmap, uv );

            vec3 tangent1 = calculateTangent(position, position + vec3(1.0, 0.0, 0.0), position + vec3(0.0, 1.0, 0.0), vUV, vUV + vec2(1.0, 0.0), vUV + vec2(0.0, 1.0));
            vec3 tangent2 = calculateTangent(position, position + vec3(0.0, 1.0, 0.0), position + vec3(0.0, 0.0, 1.0), vUV, vUV + vec2(0.0, 1.0), vUV + vec2(0.0, 0.0));
            vTangent = normalize(tangent1 + tangent2);
        
            vBinormal = normalize(cross(vNormal, tangent1));

            vec3 vertexPosition_cameraspace = ( modelViewMatrix* vec4(position,1)).xyz;
            EyeDirection_cameraspace = vec3(0,0,0) - vertexPosition_cameraspace;
            vec3 lightPos = vec3(0,0,4);
            vec3 LightPosition_cameraspace = ( viewMatrix * vec4(lightPos,1)).xyz;
            LightDirection_cameraspace = LightPosition_cameraspace + EyeDirection_cameraspace;

            mat3 MV3x3 = mat3(modelViewMatrix);
            vec3 vertexTangent_cameraspace = MV3x3 * tangent1;
            vec3 vertexBitangent_cameraspace = MV3x3 * vBinormal;
            vec3 vertexNormal_cameraspace = MV3x3 * vNormal;

            mat3 TBN = transpose(mat3(
                vertexTangent_cameraspace,
                vertexBitangent_cameraspace,
                vertexNormal_cameraspace	
            )); // You can use dot products instead of building this matrix and transposing it. See References for details.

            LightDirection_tangentspace = TBN * LightDirection_cameraspace;
            EyeDirection_tangentspace =  TBN * EyeDirection_cameraspace;

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
        uniform sampler2D Texture1Normal;
        uniform sampler2D Texture2Normal;
        uniform sampler2D Texture3Normal;
        uniform float time;
        
        varying vec2 vUV;
        
        varying float vAmount;
        varying float vBlend;
        varying float vBlendr;
        varying float vBlendg;
        varying float vBlendb;
        varying vec3 vNormal;

        //-----------------------------------
        varying vec3 vWorldPos;
        varying vec4 vEyeSpacePos;
        varying vec3 vTangent;
        varying vec3 vBinormal;

        varying vec3 EyeDirection_cameraspace;
        varying vec3 LightDirection_cameraspace;
        varying vec3 LightDirection_tangentspace;
        varying vec3 EyeDirection_tangentspace;

        const float ambientStrength = 0.8;
        const float specularStrength = 0.9;
        const float shininess = 32.0;
        // Factor de intensidad de la normal perturbada
        const float normalStrength = 20.0;
        
        void main() 
        {

            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec4 water = vBlendr * texture2D( oceanTexture, vUV * 25.0 );
            vec4 sandy = vBlendg * texture2D( sandyTexture, vUV * 25.0 );
            vec4 grass = vBlendb * texture2D( grassTexture, vUV * 25.0 );
            
            vec4 color1a = vec4(0.75, 0.75, 0.75, 1); // Primer color de transición (celeste)
            vec4 color2b = vec4(1.0, 0.5, 0.2, 1); // Segundo color de transición (naranja)
            vec4 color3c = vec4(0.0, 0.0, 0.0, 1); // Tercer color de transición (negro)
            
            vec4 ColorfinalBase = water + sandy + grass;

            vec4 finalColor = mix(color1a, color2b, time);
            finalColor = mix(finalColor, color3c, time);

            vec4 LightColor = finalColor;
            float LightPower = 1.8f;

            vec4 redChannel = texture2D(Texture1Normal, vUV * 25.0) * vBlendr;
            vec4 greenChannel = texture2D(Texture2Normal, vUV * 25.0) * vBlendg;
            vec4 blueChannel = texture2D(Texture3Normal, vUV * 25.0) * vBlendb;
            vec4 FinalColorNormal = redChannel + greenChannel + blueChannel;

            vec3 MaterialDiffuseColor = ColorfinalBase.rgb * 10.0;
            vec3 MaterialAmbientColor = vec3(0.1,0.1,0.1) * MaterialDiffuseColor /* finalColor*/;
            vec3 MaterialSpecularColor = ColorfinalBase.rgb * 0.03;
            vec3 TextureNormal_tangentspace = normalize(FinalColorNormal.rgb*2.0 - 1.0);

            vec3 lightPos = vec3(0,0,4);
            float distance = length( lightPos  );
            vec3 n = TextureNormal_tangentspace;

            vec3 LighNewDirection = LightDirection_tangentspace;
            LighNewDirection.y = time;
            vec3 l = normalize(LightDirection_tangentspace);
            float cosTheta = clamp( dot( n,l ), 0.0,1.0 );
            vec3 E = normalize(EyeDirection_tangentspace);
            vec3 R = reflect(-l,n);
            float cosAlpha = clamp( dot( E,R ), 0.0,1.0 );

            vec3 colorFinal = 
            // Ambient : simulates indirect lighting
            MaterialAmbientColor +
            // Diffuse : "color" of the object
            MaterialDiffuseColor * LightColor.rgb * LightPower * cosTheta / (distance*distance) +
            // Specular : reflective highlight, like a mirror
            MaterialSpecularColor * LightColor.rgb * LightPower * pow(cosAlpha,5.0) / (distance*distance);

            float MixValue;
            if(time>0.5)
            {
                MixValue=0.7f;
            }
            else
            {
                MixValue=0.3f;
            
            }
            gl_FragColor = mix( vec4(colorFinal, 1.0), finalColor, MixValue); //, 1.0);
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

        var NormalT1 = new THREE.TextureLoader().load( textura1Normal );
        NormalT1.wrapS = NormalT1.wrapT = THREE.RepeatWrapping;
        var NormalT2 = new THREE.TextureLoader().load( textura2Normal );
        NormalT2.wrapS = NormalT2.wrapT = THREE.RepeatWrapping; 
        var NormalT3 = new THREE.TextureLoader().load( textura3Normal );
        NormalT3.wrapS = NormalT3.wrapT = THREE.RepeatWrapping;  

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
                'Texture1Normal': { value: NormalT1 },
                'Texture2Normal': { value: NormalT2 },
                'Texture3Normal': { value: NormalT3 },
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