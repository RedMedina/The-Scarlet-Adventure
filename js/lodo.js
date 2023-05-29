import * as THREE from 'three';

class Mud
{
    CreateMud(enviMap, texture, normal, normal2)
    {
        var planeGeo = new THREE.PlaneGeometry( 18000, 18000, 100, 100 );

        const loader = new THREE.TextureLoader();
        const repeats = 10 / 0.2;

        const vertexShader = `
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
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`;

        const fragmentShader = `
        uniform sampler2D Texture;
        uniform sampler2D Texture1Normal;
        uniform sampler2D Texture2Normal;
        uniform float timeDay;
        uniform float time;
        
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

        const float ambientStrength = 0.8;
        const float specularStrength = 0.9;
        const float shininess = 32.0;
        // Factor de intensidad de la normal perturbada
        const float normalStrength = 20.0;

        const float amplitude = 0.05; // Amplitud de la onda de agua
        const float speed = 0.5; // Velocidad de la onda de agua
        const float frequency = 5.0; // Frecuencia de la onda de agua
        
        void main() 
        {
            vec2 texCoord2 = vUV;
            texCoord2.y += amplitude * sin(speed * vUV.x + frequency * (time)/5.0);
            vec2 texCoord3 = vUV;
            texCoord3.x += amplitude * sin(speed * vUV.y + frequency * (time)/5.0);

            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec4 basecolor = texture2D( Texture, vUV*25.0);
            vec4 basecolor2 = vec4(0.4, 0.2, 0.0, 1.0);

            vec4 color1a = vec4(0.75, 0.75, 0.75, 1.0); // Primer color de transición (celeste)
            vec4 color2b = vec4(1.0, 0.5, 0.2, 1.0); // Segundo color de transición (naranja)
            vec4 color3c = vec4(0.0, 0.0, 0.0, 1.0); // Tercer color de transición (negro)
            
            vec4 finalColor = mix(color1a, color2b, timeDay);
            finalColor = mix(finalColor, color3c, timeDay);

            vec4 LightColor = vec4(1.0,1.0,1.0,1.0);
            //vec4 LightColor = finalColor;
            float LightPower = 4.8f;

            vec4 TexturaNormalMap = texture2D(Texture1Normal, texCoord2*25.0);
            vec4 TexturaNormalMap2 = (texture2D(Texture2Normal, texCoord3*25.0));
            vec4 TextureNormalFimal = mix(TexturaNormalMap, TexturaNormalMap2, 0.5);

            vec3 MaterialDiffuseColor = basecolor2.rgb * 10.0;
            vec3 MaterialAmbientColor = vec3(0.1,0.1,0.1) * MaterialDiffuseColor /* finalColor*/;
            vec3 MaterialSpecularColor = basecolor2.rgb * 0.03;
            vec3 TextureNormal_tangentspace = normalize(TextureNormalFimal.rgb*2.0 - 1.0);

            vec3 lightPos = vec3(0,0,4.0);
            float distance = length( lightPos  );
            vec3 n = TextureNormal_tangentspace;

            vec3 LighNewDirection = LightDirection_tangentspace;
            LighNewDirection.y = timeDay;
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
            if(timeDay>0.5)
            {
                MixValue=0.7f;
            }
            else
            {
                MixValue=0.3f;
            
            }
            finalColor.a=0.85;
            gl_FragColor = mix( vec4(colorFinal, 0.85), finalColor, 0.5); //, 1.0);
        }`;

        const envirText = loader.load(enviMap);
        envirText.wrapS = THREE.RepeatWrapping;
        envirText.wrapT = THREE.RepeatWrapping;
        envirText.magFilter = THREE.NearestFilter;
        envirText.repeat.set(repeats, repeats);

        const textureColor = loader.load(texture);
        textureColor.wrapS = THREE.RepeatWrapping;
        textureColor.wrapT = THREE.RepeatWrapping;
        textureColor.magFilter = THREE.NearestFilter;
        textureColor.repeat.set(repeats, repeats);

        const textureNormal = loader.load(normal);
        textureNormal.wrapS = THREE.RepeatWrapping;
        textureNormal.wrapT = THREE.RepeatWrapping;
        textureNormal.magFilter = THREE.NearestFilter;
        textureNormal.repeat.set(repeats, repeats);

        const textureNormal2 = loader.load(normal2);
        textureNormal2.wrapS = THREE.RepeatWrapping;
        textureNormal2.wrapT = THREE.RepeatWrapping;
        textureNormal2.magFilter = THREE.NearestFilter;
        textureNormal2.repeat.set(repeats, repeats);

        const mirrorShader = {
            uniforms: THREE.UniformsUtils.merge( [
            THREE.UniformsLib[ 'fog' ],
            THREE.UniformsLib[ 'lights' ],
            THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            THREE.UniformsLib.shadowmap,
            THREE.UniformsLib.ambient,
            {
                'Texture': { value: textureColor },
                'Texture1Normal': { value: textureNormal },
                'Texture2Normal': { value: textureNormal2 },
                'time': { value: 0 },
                'timeDay': { value: 0},
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
                transparent: true,
                side: THREE.DoubleSide
            });

        var material = new THREE.MeshLambertMaterial({
            //envMap: envirText,
            map: textureColor,
            normalMap: textureNormal,
            //combine:  THREE.MultiplyOperation,
            //reflectivity: 1
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85
        });
        this.plane = new THREE.Mesh(planeGeo, customMaterial);
        this.plane.position.y = -100;
        this.plane.rotation.x = -90 * 3.1416 / 180;
    }

    GetMud()
    {
        return this.plane;
    }
}

export { Mud };