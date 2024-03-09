# CanvasGraphEngine-WEBGL
![](./assets/screenshot.gif "./assets/screenshot.gif")

This project is intended to be the same as CanvasGraphEngine but done in webgl.
<br />
The performance increase is noticeable.
<br />
When using canvas 2d my system starts lagging at around 20x20 nodes.
<br />
By using webgl there is no lag at 1000x1000 nodes.
<br />
That is 4,000,000 rectangles/circles and 10,000,000 characters rendered at 60fps.
<br />
## How it works
Basically how this works is that for each shape a gl_Point is created.
<br />
* Rectangles: The gl_PointSize is adjusted to be the biggest dimension (width or height). Then the fragment shader takes over and cuts the smallest dimension (points are squares so the "smallest" dimension is equal to the "biggest" dimension) to match the user defined dimensions by adjusting the alpha channel.
* Circles: The gl_PointSize is set to the diameter of the circle and the fragment shader cuts the circle by adjusing the alpha channel to be 1 when the length(uv) < diameter.
* Text: An SDF font texture and text texture are used. The user supplies the font size and the index of the text in the text texture. The gl_PointSize width is set to the number of characters * font size. The height is set to the font size (in the fragment shader, similar to the rectangle approach). Then the resulting rectangle is divided into a grid and the character indices are sampled from the text texture, which in turn are used to query the SDF font texture.
<br />
<br />
Since its a fragment shader, drawing circles, squares or text is almost the same performance wise. With canvas 2d drawing circles has a huge performance drop compared to squares etc.
<br />
<br />
Note that neither CanvasGraphEngine nor this repo are heavily optimized.
Also this project is just a proof of concept, the code is not clean and there is a lot of missing functionality, only the foundation is there so expect bugs.
