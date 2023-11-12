p5.prototype.registerMethod('init', function() {

  let p = this;
  let fukidashi;
  p.PicoSprite = class extends p.Sprite {
      
    constructor(...args) {
      super(...args);
      this.fukidashi = new p.Fukidashi(this);
      this._onFloor = false;    
    }
      
    draw() {
      super.draw();
      if(this.collide(floorSprite)) {
        this._onFloor = true;
      }
      if(this._onFloor){
        let _fukidashi = [
          "💛💛💛💛💛💛💛💛💛💛💛💛\n",
          "💚💚💚着地したよ!💚💚💚\n",
          "💻👨🏻‍💻👨👨🏻👨🏻‍💻👨🏻‍🏫👨🏻‍🎓👩🏻‍🎓👩🏽‍🎓👩‍🎓👩‍👧💛",
          // https://qiita.com/suin/items/c4a3c551a76042c75c3d
        ];
        let _text = _fukidashi.reduce((t, element)=>{
          return t += element;// + "\n";
        },"");
        this.hanasu(_text);        
      }else{
        this.hanasu("落ちていくぅ",6);                          
      }
    }
    
    hanasu(_text, _maxString) {
      this.fukidashi.speak(_text, _maxString);
    }
  };
});