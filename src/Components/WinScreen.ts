import { Container, Rectangle } from "pixi.js";
import CoinsEmitter from "./CoinsEmitter";

export default class WinScreen extends Container {
  private coinsEmitter: CoinsEmitter | null = null;
  constructor(boundsArea: Rectangle) {
    super();
    this.boundsArea = boundsArea;
    this.coinsEmitter = new CoinsEmitter(this.boundsArea);
    this.addChild(this.coinsEmitter);
  }

  playInSmall() {
    if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
    console.log("Slide small win in");
    return Promise.resolve();
  }
  playOutSmall() {
    console.log("Slide small win out");
    setTimeout(() => {
      if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
    }, 5000);
  }

  playInBig() {
    if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
    console.log("Slide Big win in");
    return Promise.resolve();
  }
  playOutBig() {
    console.log("Slide Big win out");
    setTimeout(() => {
      if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
    }, 10000);
  }

  playSmallWinAnimation() {
    this.playInSmall().then(() => this.playOutSmall());
  }

  playBigWinAnimation() {
    this.playInBig().then(() => this.playOutBig());
  }
}
