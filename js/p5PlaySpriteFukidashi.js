p5.prototype.registerMethod('init', function() {

  const p = this; // p5 を退避
  
  p.FukidashiNewLineCode = "\n";
  
  // 文字列を書記素単位に分解するためのIntl.Segmenter
  // granularityオプション=grapheme
  p.FukidashiSegmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });

  p.Fukidashi = class {

    /**
     * コンストラクター
     * @param {sprite}  _sprite  : p5Playスプライトのインスタンス
     * @param {number}  _padding  : 余白
     * @param {number}  _fontSize : 文字サイズ
     */
    constructor(_sprite, _padding = 5, _fontSize=12) {
      this.sprite = _sprite;
      this.padding = _padding;
      this.fontSize = _fontSize;
      let cs = this.sprite.p.canvas;
      this.ctx = cs.getContext('2d');
    }
    
    /**
     * 話す吹き出しテキスト書き出し
     * @param {string}     _textList  : 行分割したテキスト配列
     * @param {number}  _maxStringSize  : １行の表示最大文字列数
     */
    speak(_text, _maxStringSize=12) {
      this.ctx.font = this.fontSize + "px ''";
      let lineTextObject = this._createLineTexts(_text, _maxStringSize);
      const newLineTextList = lineTextObject.textList;
      const _lineSize = lineTextObject.lineSize;
      let boxWidth = _lineSize.lineWidth;
      const lineLength = newLineTextList.length;
      const textAreaHeight = _lineSize.lineHeight * lineLength;
      const _radius = 40;
      let _textHeight = textAreaHeight + this.padding*2;
      if( _textHeight < _radius ) {
        // 四隅円弧の半径より全行高さが小さいときは 高さゼロ。
        // Padding分もなし
        _textHeight = 0; 
      }else{
        // １行目分＋最終行分を減らす調整をする
        _textHeight -= _lineSize.lineHeight*2; 
      }
      const _x = this.sprite.x + this.sprite.w*0.4;
      const _y = this.sprite.y - this.sprite.h*0.8 - (_textHeight);
      const _width = boxWidth - this.padding*2;
      this._writeFukidashi(_x, _y, _width, _textHeight, _radius);
      this._writeText(_x, _y, newLineTextList, _lineSize.lineHeight);
    }

    /**
     * 吹き出し行のサイズを算出
     * @param {string}     _line  : １行文字
     */
    _calcTextSize(_line) {
      let _mt = this.ctx.measureText(_line);
      let _lineTextHeight = _mt.actualBoundingBoxAscent + _mt.actualBoundingBoxDescent;
      return _lineTextHeight;
    }
    
    /**
     * テキスト行分割(改行コードと最大文字数で分割する)
     * @param {string}     _text  : 吹き出し文字列
     * @param {number}     _maxStringSize  : 1行の最大文字数
     */
    _createLineTexts(_text, _maxStringSize) {
      let _textList  = [];
      let lineTextList = _text.split(p.FukidashiNewLineCode);
      let _maxLineWidth = 0;
      let _maxLineHeight = 0;
      const _addText = function(_own,_text) {
        _textList.push(_text);
        let _preLineHeight = _own._calcTextSize(_text);
        let _preLineWidth = _own.ctx.measureText(_text).width;
        if( _preLineHeight > _maxLineHeight){
          _maxLineHeight = _preLineHeight;
        }
        if(_preLineWidth > _maxLineWidth) {
          _maxLineWidth = _preLineWidth;
        }  
      };
      let _own = this;
      lineTextList.forEach(function (lineText) {
        let _lineText = lineText;
        let _lineSegmentArr = _own._getStringSegmentArr(_lineText);
        let _mojiCount = 0;
        let _preText = "";
        _lineSegmentArr.forEach( (_segment) => {
          if(_mojiCount < _maxStringSize) {
            _mojiCount+=1;
            _preText += _segment.segment;
          }else{
            _addText(_own, _preText);
            _mojiCount = 0;        
            _preText = _segment.segment;
          }
        });
        _addText(_own, _preText);
      });
      let lineSizeObj = {lineWidth:_maxLineWidth,lineHeight:_maxLineHeight};
      return {textList:_textList, lineSize:lineSizeObj};
    }
    /**
     * 吹き出しテキスト書き出し
     * @param {number}     _x  : 表示する位置(x)
     * @param {number}     _y  : 表示する位置(y)
     * @param {array(string)}  _textList  : 行分割したテキスト配列
     * @param {number}     _fontHeight  : 文字高さ
     */
    _writeText(_x, _y, _textList, _fontHeight) {
      let _lineHeight = 0;
      let _xt = _x - this.padding
      let _yt = _y + this.padding
      p.strokeWeight(1)
      p.fill(0)
      _textList.forEach(function (lineText, index) {
        p.text(lineText, _xt, _yt + _lineHeight)
        _lineHeight += _fontHeight;
      });
      
    }

    /**
     * 吹き出し内部処理
     * @param {number}     _x  : 表示する位置(x)
     * @param {number}     _y  : 表示する位置(y)
     * @param {number}     _width  : 四角形部の幅
     * @param {number}     _radius  : 四隅の円弧の半径
     */
    _writeFukidashi(_x, _y, _width, _textHeight, _radius=5){
      const radius = _radius;
      const rectW = _width;
      const d = _textHeight;
      const rectH = radius + d;
      // 背景部の描画
      p.stroke(255,255,255);
      p.fill(255,255,255);
      p.arc(_x, _y, radius, radius, 180, 270, p.PIE); // 左上
      p.arc(_x+rectW, _y, radius, radius, 270, 0, p.PIE); // 右上
      p.arc(_x+rectW, _y+d, radius, radius, 0, 90, p.PIE); // 右下
      p.arc(_x, _y+d, radius, radius, 90, 180, p.PIE); // 左下
      p.rect(_x,_y-radius/2,rectW,rectH);
      p.rect(_x-radius/2,_y,rectW+radius,d);
      p.triangle(_x, _y+d+radius/2, _x+30, _y+d+radius/2, _x-radius/2, _y+d+radius/2+20)
      
      // 枠線の描画
      p.strokeWeight(2)
      p.stroke(100);
      p.noFill();
      
      p.arc(_x, _y, radius, radius, 180, 270, p.OPEN); // 左上
      p.arc(_x+rectW, _y, radius, radius, 270, 0, p.OPEN); // 右上
      p.arc(_x+rectW, _y+d, radius, radius, 0, 90, p.OPEN); // 右下
      p.arc(_x, _y+d, radius, radius, 90, 180, p.OPEN); // 左下
      
      p.line(_x-radius/2, _y, _x-radius/2, _y+d);  // 左辺
      p.line(_x, _y-radius/2, _x+rectW, _y-radius/2);  // 上辺
      p.line(_x+rectW+radius/2, _y, _x+rectW+radius/2, _y+d);  // 右辺
      p.line(_x+30, _y+d+radius/2, _x+rectW, _y+d+radius/2); // 底辺
      const pointVertex = p.createVector(_x-radius/2, _y+d+radius/2+20);// 三角形の頂点
      const pointLeft = p.createVector(_x, _y+d+radius/2);// 三角形の底辺左
      const pointRight = p.createVector(_x+30, _y+d+radius/2);// 三角形の底辺右
      p.line(pointLeft.x, pointLeft.y, pointVertex.x, pointVertex.y); 
      p.line(pointRight.x, pointRight.y, pointVertex.x, pointVertex.y);
    }
    
    /**
     * 文字列を書記素単位に分解し配列にして返す
     * （絵文字対応）
     * @param {string}     _str  : 文字列
     */
    _getStringSegmentArr(_str) {
      
      return [...p.FukidashiSegmenter.segment(_str)];
    }
  }
});


