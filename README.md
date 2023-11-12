# p5playFukidashi
p5play Sprite を継承して 吹き出しを出すサンプルです。

p5 の initのフェーズで クラスを定義します。

## 前提
p5Play.js を利用した実装です。

ブラウザで動作します。

## 動作確認
- p5.js : 1.7.0
- plank.js : v1.0.0-beta.16
- p5play.js : 3.14
- ブラウザ： Chrome, Edge にて確認済 ( 他は未確認 )

## p5 Editorでのプロジェクト
[p5Playによる吹き出しサンプル](https://editor.p5js.org/amami-harhid/full/1qOCEC-Js)

## 利用方法
利用実例は、js/Pico.js をみてください。

```
// this は p5Play のスプライトインスタンス
const fukidashi = new p.Fukidashi(this);
const textStr = "ふきだしだよ～";
fukidashi.speak(textStr);
```

## 参考
Qiita記事：[Canvasでテキストがオーバーフローしない角丸吹き出しを作る](https://qiita.com/horikeso/items/95595f379a8dfa63c34a)

元コードを参考にして書き直しています

### p5 の機能だけで実装
p5だけで吹き出しを作るようにしました。

### 絵文字対応 
文字列の長さを 文字列.length ではなく、書記素単位に分解(Intl.Segmenter利用)して長さを求めるようにしました。

context.measureText() を使って 横幅を測定して最大幅の制御をしているところを、最大文字数により１行に表示する文字列を決定しました。
