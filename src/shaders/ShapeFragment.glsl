precision highp float;

#define CIRCLE 0.0
#define RECT 1.0
#define TEXT 2.0
#define LINE 3.0

varying vec2 _point;
varying float _shape;
varying vec4 _param;
varying float _color;

uniform sampler2D fontTexture;
uniform sampler2D textTexture;
uniform float textTextureResolution;
uniform float canvasWidth;
uniform float canvasHeight;

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

#define EdgeColor vec4(0.2, 0.2, 0.2, 1.0)
float line(vec2 p, vec2 p0, vec2 p1, float width) {
    vec2 dir0 = p1 - p0;
    vec2 dir1 = p - p0;
    float h = clamp(dot(dir1, dir0)/dot(dir0, dir0), 0.0, 1.0);
    float d = (length(dir1 - dir0 * h) - width * 0.5);
    return d;
}

float drawline(vec2 p, vec2 p0, vec2 p1, float width) {
    float d = line(p, p0, p1, width);
    float w = fwidth(d) * 1.0;
    
    return 1.-smoothstep(-w, w, d);
}

vec3 unpackColor(float f) {
    vec3 color;
    color.b = floor(f / 256.0 / 256.0);
    color.g = floor((f - color.b * 256.0 * 256.0) / 256.0);
    color.r = floor(f - color.b * 256.0 * 256.0 - color.g * 256.0);
    return color / 255.0;
}

void main() {
    vec3 col = unpackColor(_color);
    float a = 0.0;


    vec2 uv = gl_PointCoord - 0.5;

    if (_shape == CIRCLE) {
        if (length(uv) < 0.5) {
            a = 1.0;
        }
    }
    else if (_shape == RECT) {
        a = 0.0;
        float width = _param[0];
        float height = _param[1];
        float biggest = max(width, height);
        float smallest = min(width, height);
        float ratio = smallest / biggest;
        ratio *= 0.5;

        if (width > height) {
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
    else if (_shape == LINE) {
        a = 1.0;

        vec2 linePos = uv;
        vec2 start = vec2(0, 0);
        vec2 end = vec2(1.0, 1.0);

        vec2 from = vec2(_point.x, _point.y);
        vec2 to = vec2(_param[0], _param[1]);
        vec2 dim = abs(to - from);

        // When a line is (100, 100, 100, 200) (straight down) it gets completely filled.
        // This is due to dim being "to - from" so when both to.x and from.x are equal it
        // turns "float ratio = (1.0 - (100.0 / 0.0)) * 0.5;"
        // Hack it for now
        dim.x += 0.00000001;
        float ratio = (1.0 - (dim.y / dim.x)) * 0.5;
        start.y += ratio;
        end.y -= ratio;

        if (to.x < from.x) {
            start.y = 1.0 - start.y;
            end.y = 1.0 - end.y;
        }

        if (to.y < from.y) {
            start.x = 1.0 - start.x;
            end.x = 1.0 - end.x;
        }
        
        a = drawline(linePos, start - 0.5, end - 0.5, (1.0 / max(dim.x, dim.y)) * _param[2]);
    }
    else if (_shape == TEXT) {
        a = 0.0;

        float textSize = _param[0];
        float textIndex = _param[1];
        float textTextureSize = textTextureResolution;

        vec2 c = indexToCoord(int(textIndex), textTextureSize);
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
            i += int(textIndex); // Jump to text position. textIndex = text index
            i += 1; // Skip first char. First char = text length

            float charIndex = texelFetch(textTexture, ivec2(indexToCoord(i, textTextureSize)), 0).r;
            float x = mod(charIndex, 16.0);
            float y = floor(charIndex / 16.0);

            renderChar(int(x),int(y),vec2(0, 0),sizeBase * sizeBase, col,fragColor,id - 512.0);
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