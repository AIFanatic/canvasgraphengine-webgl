#define CIRCLE 0.0
#define RECT 1.0
#define TEXT 2.0

varying vec3 _shape;
varying vec3 _color;

uniform sampler2D fontTexture;
uniform sampler2D textTexture;
uniform float textTextureResolution;

vec4 fragColor;

vec4 SampleFontTex(vec2 uv)
{
    vec2 fl = floor(uv + 0.5);
    uv = fl + fract(uv+0.5)-0.5;
    // Sample the font texture. Make sure to not use mipmaps.
    // Add a small amount to the distance field to prevent a strange bug on some gpus. Slightly mysterious. :(
    // -16 is bias to use largest mipmap
    return texture(fontTexture, (uv+0.5)*(1.0/16.0), -16.0) + vec4(0.0, 0.0, 0.0, 0.000000001);
}

void renderChar(int x,int y, vec2 pos, float size, vec3 color, inout vec4 fragColor, vec2 fragCoord){
    vec2 p = (fragCoord - pos) / size;
    // if(abs(p.x) < 0.5 && abs(p.y) < 0.5) {
        float po = SampleFontTex(p+vec2(float(x),float(y))).a;
        // if(abs(po-0.5) < 0.005){
            fragColor.xyz = mix(fragColor.xyz,color,smoothstep(0.505,0.495,po));
        // }else if(po < 0.5){
        //     fragColor.xyz = color;
        // }
    // }
}

int coordToIndex(vec2 coord, float size) {
    return int(coord.y * size + coord.x);
}

vec2 indexToCoord(int index, float size) {
    float fIndex = float(index);
    float x = mod(fIndex, size);
    float y = floor(fIndex / size);
    return vec2(x,y);
}

void main() {
    vec3 col = _color;
    float a = 0.0;


    vec2 uv = gl_PointCoord - 0.5;

    if (_shape.x == CIRCLE) {
        if (length(uv) < _shape.y) {
            a = 1.0;
        }
    }
    else if (_shape.x == RECT) {
        a = 0.0;
        float biggest = max(_shape.y, _shape.z);
        float smallest = min(_shape.y, _shape.z);
        float ratio = smallest / biggest;
        ratio *= 0.5;

        if (_shape.y > _shape.z) {
            if (uv.y < ratio && uv.y > -ratio) {
                a = 1.0;
            }
        }
        else {
            if (uv.x < ratio && uv.x > -ratio) {
                a = 1.0;
            }
        }
    }
    else if (_shape.x == TEXT) {
        a = 0.0;

        // fragColor = vec4(1.0);

        float textTextureSize = textTextureResolution;

        vec2 c = indexToCoord(int(_shape.z), textTextureSize);
        float textLength = texelFetch(textTexture, ivec2(c), 0).r;

        float ratio = 0.5 / textLength;

        if (uv.y > -ratio && uv.y < ratio) {
            // a = 1.0;
            
            vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
            if (mod(textLength, 2.0) < 0.5) {
                uv.y += ratio;
            }

            float sizeBase = 35.0;

            vec2 cuv = fract(uv * textLength);
            vec2 id = floor(cuv * 1000.0);

            vec2 tcoord = vec2(floor(gl_PointCoord.x * textLength), floor(gl_PointCoord.y));
            int i = coordToIndex(tcoord, textTextureSize);
            i += int(_shape.z); // Jump to text position. _shape.z = text index
            i += 1; // Skip first char. First char = text length

            float charIndex = texelFetch(textTexture, ivec2(indexToCoord(i, textTextureSize)), 0).r;
            float x = mod(charIndex, 16.0);
            float y = floor(charIndex / 16.0);

            renderChar(int(x),int(y),vec2(0, 0),sizeBase * sizeBase, _color,fragColor,id - 512.0);
            col = fragColor.xyz;

            if (fragColor.x > 0.0 || fragColor.y > 0.0 || fragColor.z > 0.0) {
                a = 1.0;
            }
            // col.xy = id / 1000.0;
            // col.xy = cuv;
        }


    }

    gl_FragColor = vec4(col, a);
}