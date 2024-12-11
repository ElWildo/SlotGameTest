import { Container, Rectangle, Sprite, Text } from "pixi.js";
import CoinsEmitter from "./CoinsEmitter";
import { getStyle } from "../utils/utils";
import { gsap } from "gsap";
import { FXs, winAnimationTime, winTextAssets } from "../Setup/config";
export default class WinScreen extends Container {
  private coinsEmitter: CoinsEmitter | null = null;
  private winText: Text | null = null;
  private bigWinText: Sprite | null = null;
  private megaWinText: Sprite | null = null;
  private glow: { node: Sprite | null; timeline: gsap.core.Timeline } = {
    node: null,
    timeline: gsap.timeline(),
  };
  private shine: { node: Sprite | null; timeline: gsap.core.Timeline } = {
    node: null,
    timeline: gsap.timeline(),
  };
  constructor(boundsArea: Rectangle) {
    super();
    this.boundsArea = boundsArea;
    this.coinsEmitter = new CoinsEmitter(this.boundsArea);
    this.winText = new Text({ text: "Win!", style: getStyle(120) });
    this.winText.anchor.set(0.5, 0.5);
    this.winText.position.set(
      boundsArea.width / 2,
      boundsArea.height + this.winText.height / 2
    );
    this.bigWinText = new Sprite(winTextAssets.bigWin);
    this.bigWinText.anchor.set(0.5, 0.5);
    this.bigWinText.position.set(
      boundsArea.width / 2,
      boundsArea.height + this.bigWinText.height / 2
    );
    this.megaWinText = new Sprite(winTextAssets.megaWin);
    this.megaWinText.anchor.set(0.5, 0.5);
    this.megaWinText.position.set(
      boundsArea.width / 2,
      boundsArea.height + this.megaWinText.height / 2
    );
    this.glow.node = new Sprite(FXs.glow);
    this.glow.node.position.set(boundsArea.width / 2, boundsArea.height / 2);
    this.glow.node.anchor.set(0.5, 0.5);
    this.glow.node.scale.set(0, 0);
    this.shine.node = new Sprite(FXs.shine);
    this.shine.node.position.set(boundsArea.width / 2, boundsArea.height / 2);
    this.shine.node.anchor.set(0.5, 0.5);
    this.shine.node.scale = 0;

    this.addChild(this.glow.node);
    this.addChild(this.shine.node);
    this.addChild(this.coinsEmitter);
    this.addChild(this.winText);
    this.addChild(this.bigWinText);
    this.addChild(this.megaWinText);
    // this.addChild(this.flare.node);
    // this.addChild(this.smoke.node);
  }

  startGlow() {
    const timeline = this.glow.timeline;
    timeline.to(this.glow.node, {
      pixi: { scaleY: 2, scaleX: 2 },
      duration: 2,
    });
    timeline.to(
      this.glow.node,
      {
        rotation: "+=500000",
        duration: 1,
        repeat: -1,
      },
      "<"
    );
    timeline.to(
      this.glow.node,
      {
        pixi: { blurX: 10, blurY: 10 },
        duration: 0,
      },
      "<"
    );
  }

  stopGlow() {
    const timeline = this.glow.timeline;
    timeline.to(this.glow.node, {
      pixi: { scaleY: 0, scaleX: 0 },
      duration: 2,
      onComplete: () => {
        timeline.clear();
      },
    });
  }

  startShine() {
    const timeline = this.shine.timeline;
    timeline.to(this.shine.node, {
      pixi: { scaleY: 5, scaleX: 5 },
      duration: 2,
    });
    timeline.to(
      this.glow.node,
      {
        pixi: { blurX: 10, blurY: 10 },
        duration: 0,
      },
      "<"
    );
    timeline.to(this.shine.node, {
      pixi: { scaleY: 10, scaleX: 10 },
      duration: 2,
      repeat: -1,
      yoyo: true,
    });
  }

  stopShine() {
    const timeline = this.shine.timeline;
    timeline.to(this.shine.node, {
      pixi: { scaleY: 0, scaleX: 0 },
      duration: 2,
      onComplete: () => {
        timeline.clear();
      },
    });
  }

  winTextSlideIn(text: Sprite | Text | null) {
    if (text) {
      gsap.to(text, {
        y: this.boundsArea.height / 2,
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

  playAnimationWithDelay(delay: number, callback: () => void) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        callback();
        resolve();
      }, delay);
    });
  }

  playSmallWinAnimation() {
    this.playAnimationWithDelay(0, () => {
      this.startGlow();
      this.startShine();
      if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
    })
      .then(() =>
        this.playAnimationWithDelay(100, () =>
          this.winTextSlideIn(this.winText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(winAnimationTime - 1000, () => {
          if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
        })
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () => {
          this.stopGlow();
          this.stopShine();
          this.winTextSlideOut(this.winText);
        })
      );
  }

  playBigWinAnimation() {
    this.playAnimationWithDelay(0, () => {
      this.startGlow();
      this.startShine();
      if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
    })
      .then(() =>
        this.playAnimationWithDelay(100, () =>
          this.winTextSlideIn(this.winText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideIn(this.bigWinText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideOut(this.winText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(winAnimationTime - 1000, () => {
          if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
        })
      )
      .then(() =>
        this.playAnimationWithDelay(winAnimationTime - 500, () => {
          this.stopGlow();
          this.stopShine();
          this.winTextSlideOut(this.bigWinText);
        })
      );
  }

  playMegaWinAnimation() {
    this.playAnimationWithDelay(0, () => {
      this.startGlow();
      this.startShine();
      if (this.coinsEmitter) this.coinsEmitter.playAnimationCoins();
    })
      .then(() =>
        this.playAnimationWithDelay(100, () =>
          this.winTextSlideIn(this.winText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideIn(this.bigWinText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideOut(this.winText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideIn(this.megaWinText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(1000, () =>
          this.winTextSlideOut(this.bigWinText)
        )
      )
      .then(() =>
        this.playAnimationWithDelay(winAnimationTime - 1000, () => {
          if (this.coinsEmitter) this.coinsEmitter.stopAnimationCoins();
        })
      )
      .then(() =>
        this.playAnimationWithDelay(winAnimationTime - 500, () => {
          this.stopGlow();
          this.stopShine();
          this.winTextSlideOut(this.megaWinText);
        })
      );
  }
}
