import { Container, Sprite } from "pixi.js";
import { Reel, TwinTo } from "../Declarations/ReelsContainer";
import {
  REELS_AMOUNT,
  SYM_PER_REEL_AMOUNT,
  REEL_WIDTH,
  slotTextures,
  spinPerReelTest,
  SYMBOL_SIZE,
  WinCount,
  spinTime,
  bounceBackReel,
} from "../Setup/config";
import { gsap } from "gsap";

export default class ReelsContainer extends Container {
  public reels: Reel[] = [];
  public tweening: TwinTo[] = [];
  private running = false;
  private results: Sprite[][] = [];
  private calculateWin: (count: WinCount) => void;
  constructor(calculateWin: (count: WinCount) => void) {
    super();
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.calculateWin = calculateWin;
    for (let i = 0; i < REELS_AMOUNT; i++) {
      const rc = new Container();

      rc.x = i * REEL_WIDTH;
      this.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
      };

      // Build the symbols
      for (let j = 0; j < SYM_PER_REEL_AMOUNT; j++) {
        const symbol = new Sprite(
          slotTextures[Math.floor(Math.random() * slotTextures.length)]
        );

        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(
          SYMBOL_SIZE / symbol.width,
          SYMBOL_SIZE / symbol.height
        );
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      this.reels.push(reel);
    }
  }

  // Function to start playing.
  startPlay = async () => {
    if (this.running) return;
    this.running = true;
    this.results = [];

    await mockServerResponse().then((results) =>
      this.updateResults(results as Sprite[][])
    );

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const target = spinPerReelTest[i] * r.container.height;
      const containerWrap = gsap.utils.wrap(
        r.container.y - SYMBOL_SIZE,
        r.container.y + r.container.height - SYMBOL_SIZE
      );
      const animation = gsap.timeline();
      const blur = gsap.timeline();
      blur.to(r.symbols, {
        ease: "power4.in",
        duration: spinTime / 3,
        pixi: { blurY: 15 * ((i + 1) / 2) },
      });
      animation.to(r.symbols, {
        y: `+=${target}`,
        duration: spinTime * (4 / 5),
        modifiers: {
          y: gsap.utils.unitize(containerWrap),
        },
        ease: "power4.in",
        onComplete: () => {
          if (i === this.reels.length - 1) {
            animation.clear();
            blur.clear();
            this.updateReels();
          }
        },
      });
    }
  };

  updateReels() {
    for (let reel = 0; reel < this.reels.length; reel++) {
      for (let i = 0; i < this.reels[reel].symbols.length; i++) {
        this.results[reel][i].y = i * SYMBOL_SIZE;
        this.results[reel][i].scale = this.reels[reel].symbols[i].scale;
        this.results[reel][i].x = this.reels[reel].symbols[i].x;
        this.reels[reel].container.removeChild(this.reels[reel].symbols[i]);
        this.reels[reel].symbols[i] = this.results[reel][i];
        this.reels[reel].container.addChild(this.reels[reel].symbols[i]);
      }
      const animation = gsap.timeline();
      const blur = gsap.timeline();
      const target = spinPerReelTest[reel] * this.reels[reel].container.height;

      const containerWrap = gsap.utils.wrap(
        this.reels[reel].container.y - SYMBOL_SIZE,
        this.reels[reel].container.y +
          this.reels[reel].container.height -
          SYMBOL_SIZE
      );

      blur.fromTo(
        this.reels[reel].symbols,
        {
          pixi: { blurY: 15 * ((reel + 1) / 2) },
        },
        {
          ease: "power4.out",
          duration: spinTime,
          pixi: { blurY: 0 },
        }
      );
      animation.to(this.reels[reel].symbols, {
        y: `+=${target + bounceBackReel}`,
        duration: spinTime * (3 / 5),
        modifiers: {
          y: gsap.utils.unitize(containerWrap),
        },
        ease: "sin.out",
      });
      animation.to(this.reels[reel].symbols, {
        y: `-=${bounceBackReel}`,
        duration: spinTime * (2 / 5),
        ease: "elastic",
        modifiers: {
          y: gsap.utils.unitize(containerWrap),
        },
        onComplete: () => {
          if (reel === this.reels.length - 1) {
            animation.clear();
            blur.clear();
            this.reelsComplete();
          }
        },
      });
    }
  }

  updateResults(res: Sprite[][]) {
    for (let i = 0; i < this.reels.length; i++) {
      const reelArray = [];
      for (let j = 0; j < this.reels[i].symbols.length; j++) {
        reelArray.push(res[i][j]);
      }
      this.results.push(reelArray);
    }
  }

  calculateOutcome() {
    const rows = this.reels[0].symbols
      .map((symbol: Sprite) => symbol.position.y)
      .slice(1);

    const countRes: WinCount = { "2": 0, "3": 0, "4": 0, "5": 0 };

    for (let index = 0; index < rows.length; index++) {
      let lastsymb: string | undefined = undefined;
      let count: number = 0;
      for (let i = 0; i < this.reels.length; i++) {
        const symb = this.reels[i].symbols.find(
          (symbol) => Math.floor(symbol.position.y) == Math.floor(rows[index])
        )?.texture.label;
        if (!symb) console.log("symb undefined");
        if (!lastsymb || lastsymb != symb) {
          if (lastsymb != symb && count.toString() in countRes) {
            countRes[count.toString() as keyof WinCount]++;
          }
          lastsymb = symb;
          count = 1;
        } else {
          count++;
          if (i === this.reels.length - 1 && count.toString() in countRes)
            countRes[count.toString() as keyof WinCount]++;
        }
      }
      lastsymb = undefined;
    }
    this.calculateWin(countRes);
  }

  // Reels done handler.
  reelsComplete() {
    this.calculateOutcome();
    this.running = false;
  }
}

const mockServerResponse = () => {
  const reelRes: Sprite[][] = [];
  for (let reel = 0; reel < REELS_AMOUNT; reel++) {
    const reelArray = [];
    for (let sym = 0; sym < SYM_PER_REEL_AMOUNT; sym++) {
      reelArray.push(
        new Sprite(
          slotTextures[Math.floor(Math.random() * slotTextures.length)]
        )
      );
    }
    reelRes.push(reelArray);
  }
  setInterval(() => {}, 20);
  return Promise.resolve(reelRes);
};
