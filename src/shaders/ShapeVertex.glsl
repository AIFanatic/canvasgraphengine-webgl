precision highp float;

#define CIRCLE 0.0
#define RECT 1.0
#define TEXT 2.0
#define LINE 3.0

uniform float canvasWidth;
uniform float canvasHeight;
uniform sampler2D textTexture;
uniform float textTextureResolution;

attribute float shape;
attribute vec4 param;
attribute float color;

varying float _shape;
varying vec4 _param;
varying float _color;

varying vec2 _point;

vec2 indexToCoord(int index, float size) {
    float fIndex = float(index);
    float x = mod(fIndex, size);
    float y = floor(fIndex / size);
    return vec2(x,y);
}

void main() {
    vec3 p = position;
    _point = p.xy;

    float basePointSize;
    if (shape == CIRCLE) {
        basePointSize = param[0] * 2.0;
    }
    else if (shape == RECT) {
        basePointSize = max(param[0], param[1]);
    }
    else if (shape == TEXT) {
        vec2 c = indexToCoord(int(param[1]), textTextureResolution);
        float textLength = texelFetch(textTexture, ivec2(c), 0).r;

        float charSize = param[0];
        basePointSize = charSize * textLength;
    }
    else if (shape == LINE) {
        vec2 from = vec2(p.x, p.y);
        vec2 to = vec2(param[0], param[1]);
        vec2 dim = abs(to - from);

        p.xy += dim * 0.5;

        if (to.x < from.x) p.x -= dim.x;
        if (to.y < from.y) p.y -= dim.y;

        basePointSize = max(dim.x, dim.y);
    }

    p.x = p.x / canvasWidth;
    p.y = -p.y / canvasHeight;
    vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;

    _shape = shape;
    _param = param;
    _color = color;

    gl_PointSize = basePointSize * projectionMatrix[0][0];
}