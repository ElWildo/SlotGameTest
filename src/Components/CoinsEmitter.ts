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
        this.removeChild(coinAnim);
        coinAnim.stop();
        coinAnim.destroy();
        timeline.kill();
      }
    });

    this.coins.push({ animation: coinAnim, tween: timeline });
  }

  setUpAnimationCoins() {
    for (let i = 0; i < totalCoins; i++) {
      this.addCoin();
    }
  }

  playAnimationCoins() {
    this.running = true;
    this.setUpAnimationCoins();
    for (let i = 0; i < this.coins.length; i++) {
      setTimeout(() => {
        if (this.running) {
          this.coins[i].animation.play();
          this.coins[i].tween.play();
        } else {
          this.removeChild(this.coins[i].animation);
          this.coins[i].animation.destroy();
          this.coins[i].tween.kill();
        }
      }, i * 10);
    }
    //   (
    //     coin: { tween: gsap.core.Timeline; animation: AnimatedSprite },
    //     index: number
    //   ) => {
    //     setTimeout(() => {
    //       if (this.running) {
    //         coin.animation.play();
    //         coin.tween.play();
    //       } else {
    //         this.removeChild(coin.animation);
    //         coin.tween.kill();
    //       }
    //     }, index * 25);
    //   }
    // );
  }

  stopAnimationCoins() {
    this.running = false;
  }
}
