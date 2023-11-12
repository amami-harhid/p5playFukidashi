window.onload = () => {
  new p5( sketch );
  //function(radiusX, radiusY, num, cx, cy, innerRadiusX, innerRadiusY, outerLineLimit, innerLineLimit, strokeStyle, fillStyle)
};

const W = window.innerWidth;
const H = window.innerHeight;
let picoImage;
let floorSprite;
let canvas;
let cs;
let ctx;
let csWidth;
let csHeight;
const sketch = function( p ) {

　p.preload = function(){
    picoImage = p.loadImage('./assets/Pico walk1.svg')
  };
  
  p.setup = function(){
    p.world.gravity.y = 1;
    floorSprite = new p.Sprite(W/2, H, W, 2, "static");
    pico = new p.PicoSprite(W/2,H/2);
    pico.addImage(picoImage);
    canvas = new p.Canvas(W,H);
    
  };
  p.draw = function() {
    p.background(0);
  }
};