#define CIRCLE 0.0
#define RECT 1.0
#define TEXT 2.0

uniform sampler2D textTexture;
uniform float textTextureResolution;

attribute vec3 shape;
varying vec3 _shape;

attribute vec3 color;
varying vec3 _color;

vec2 indexToCoord(int index, float size) {
    float fIndex = float(index);
    float x = mod(fIndex, size);
    float y = floor(fIndex / size);
    return vec2(x,y);
}

void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;

    _shape = shape;
    _color = color;

    float basePointSize;
    if (shape.x == CIRCLE) {
        basePointSize = shape.y;
    }
    else if (shape.x == RECT) {
        basePointSize = max(shape.y, shape.z);
    }
    else if (shape.x == TEXT) {
        vec2 c = indexToCoord(int(shape.z), textTextureResolution);
        float textLength = texelFetch(textTexture, ivec2(c), 0).r;

        float charSize = shape.y / 10.0;
        basePointSize = charSize * textLength;
    }

    float pointScale = 1000.0;
    gl_PointSize = basePointSize * pointScale * projectionMatrix[0][0];
}