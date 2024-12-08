import { AnimatedSprite, Container, Rectangle } from "pixi.js";
import { coinAnimation } from "../Setup/config";
import { gsap } from "gsap";

const totTimeAnim = 2.5;
const totalCoins = 1000;

export default class CoinsEmitter extends Container {
  private coins: {
    tween: gsap.core.Timeline;
    animation: AnimatedSprite;
  }[] = [];
  private running = false;

  constructor(boundsArea: Rectangle) {
    super();
    this.boundsArea = boundsArea;
  }

  generateRandomXStart() {
    return (
      Math.floor(
        Math.random() *
          (this.boundsArea.width / 2 +
            100 -
            (this.boundsArea.width / 2 - 100) +
            1)
      ) +
      (this.boundsArea.width / 2 - 100)
    );
  }

  generateRandomXLand(coin: AnimatedSprite) {
    return coin.position.x >= this.boundsArea.width / 2
      ? Math.floor(Math.random() * (this.boundsArea.width / 2 + 1)) +
          this.boundsArea.width / 2
      : Math.floor(Math.random() * (this.boundsArea.width / 2 + 1));
  }

  addCoin() {
    const coinAnim = new AnimatedSprite(coinAnimation);
    coinAnim.setSize(0, 0);
    this.addChild(coinAnim);
    coinAnim.position.y = this.boundsArea.height / 2;
    coinAnim.position.x = this.generateRandomXStart();

    const timeline = gsap.timeline({ paused: true });
    timeline.set(coinAnim, {
      y: this.boundsArea.height / 2,
      x: this.generateRandomXStart(),
      height: 0,
      width: 0,
    });
    timeline.to(coinAnim, {
      y: this.boundsArea.height - coinAnim.height - 100,
      x: this.generateRandomXLand(coinAnim),
      width: 100,
      height: 100,
      duration: 5,
      ease: "elastic",
    });
    timeline.call(() => {
      if (this.running) {
        timeline.play();
      } else {
        timeline.kill();
        coinAnim.stop();
        coinAnim.destroy();
        this.children.length > 1
          ? this.removeChild(coinAnim)
          : this.removeChildren();
        this.coins.length == 1
          ? (this.coins = [])
          : this.coins.splice(
              this.coins.findIndex((coin) => coin.animation == coinAnim),
              1
            );
      }
    });

    this.coins.push({ animation: coinAnim, tween: timeline });
  }

  async setUpAnimationCoins() {
    this.coins = [];
    this.removeChildren();
    for (let i = 0; i < totalCoins; i++) {
      this.addCoin();
    }
  }

  async playAnimationCoins() {
    this.running = true;
    await this.setUpAnimationCoins();
    this.coins.forEach((coin, index) => {
      setTimeout(() => {
        if (this.running) {
          coin.animation.play();
          coin.tween.play();
        } else {
          if (coin) {
            coin.tween.kill();
            coin.animation.destroy();
            this.children.length > 1
              ? this.removeChild(coin.animation)
              : this.removeChildren();
            this.coins.length == 1
              ? (this.coins = [])
              : this.coins.splice(index, 1);
          }
        }
      }, index * 10);
    });
  }

  stopAnimationCoins() {
    this.running = false;
  }
}
