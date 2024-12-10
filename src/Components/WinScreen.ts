import { Container, Rectangle, Sprite, Text } from "pixi.js";
import CoinsEmitter from "./CoinsEmitter";
import { getStyle } from "../utils/utils";
import { gsap } from "gsap";
import { winAnimationTime, winTextAssets } from "../Setup/config";
export default class WinScreen extends Container {
  private coinsEmitter: CoinsEmitter | null = null;
  private winText: Text | null = null;
  private bigWinText: Sprite | null = null;
  private megaWinText: Sprite | null = null;
  constructor(boundsArea: Rectangle) {
    super();
    this.boundsArea = boundsArea;
    this.coinsEmitter = new CoinsEmitter(this.boundsArea);
    this.winText = new Text({ text: "Win!", style: getStyle(120) });
    this.winText.position.set(
      boundsArea.width / 2 - this.winText.width / 2,
      boundsArea.height + this.winText.height / 2
    );
    this.bigWinText = new Sprite(winTextAssets.bigWin);
    this.bigWinText.position.set(
      boundsArea.width / 2 - this.bigWinText.width / 2,
      boundsArea.height + this.bigWinText.height / 2
    );
    this.megaWinText = new Sprite(winTextAssets.megaWin);
    this.megaWinText.position.set(
      boundsArea.width / 2 - this.megaWinText.width / 2,
      boundsArea.height + this.megaWinText.height / 2
    );

    this.addChild(this.coinsEmitter);
    this.addChild(this.winText);
    this.addChild(this.bigWinText);
    this.addChild(this.megaWinText);
  }

  winTextSlideIn(text: Sprite | Text | null) {
    if (text) {
      gsap.to(text, {
        y: this.boundsArea.height / 2 - text.height / 2,
        duration: 1,
        ease: "bounce.out",
      });
    }
  }
  winTextSlideOut(text: Sprite | Text | null) {
    if (text) {
      gsap.to(text, {
        y: this.boundsArea.height + text.height / 2,
        ease: "bounce.out",
      });
    }
  }

  playInCoin(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
        resolve();
      }, delay);
    });
  }
  playOutCoin(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
        resolve();
      }, delay);
    });
  }
  playInSmall(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideIn(this.winText);
        resolve();
      }, delay);
    });
  }
  playOutSmall(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideOut(this.winText);
        resolve();
      }, delay);
    });
  }

  playInBig(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideIn(this.bigWinText);
        resolve();
      }, delay);
    });
  }
  playOutBig(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideOut(this.bigWinText);
        resolve();
      }, delay);
    });
  }

  playInMega(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideIn(this.megaWinText);
        resolve();
      }, delay);
    });
  }
  playOutMega(delay: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.winTextSlideOut(this.megaWinText);
        resolve();
      }, delay);
    });
  }

  playSmallWinAnimation() {
    this.playInCoin(0)
      .then(() => this.playInSmall(100))
      .then(() => this.playOutCoin(winAnimationTime - 1000))
      .then(() => this.playOutSmall(winAnimationTime - 500));
  }

  playBigWinAnimation() {
    this.playInCoin(0)
      .then(() => this.playInSmall(100))
      .then(() => this.playInBig(1000))
      .then(() => this.playOutSmall(1000))
      .then(() => this.playOutCoin(winAnimationTime - 1000))
      .then(() => this.playOutBig(winAnimationTime - 500));
  }

  playMegaWinAnimation() {
    this.playInCoin(0)
      .then(() => this.playInSmall(100))
      .then(() => this.playInBig(1000))
      .then(() => this.playOutSmall(1000))
      .then(() => this.playInMega(1000))
      .then(() => this.playOutBig(1000))
      .then(() => this.playOutCoin(winAnimationTime - 1000))
      .then(() => this.playOutMega(winAnimationTime - 500));
  }
}
