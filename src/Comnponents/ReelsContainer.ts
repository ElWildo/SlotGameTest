import { BlurFilter, Container, Sprite } from "pixi.js";
import { Reel, TwinTo } from "../Declarations/ReelsContainer";
import {
  REEL_SYM_HEIGHT,
  REEL_SYM_WIDTH,
  REEL_WIDTH,
  slotTextures,
  SYMBOL_SIZE,
  WinCount,
} from "../Setup/config";

export default class ReelsContainer extends Container {
  public reels: Reel[] = [];
  public tweening: TwinTo[] = [];
  private running = false;
  private calculateWin: (count: WinCount) => void;
  constructor(calculateWin: (count: WinCount) => void) {
    super();
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.calculateWin = calculateWin;
    for (let i = 0; i < REEL_SYM_WIDTH; i++) {
      const rc = new Container();

      rc.x = i * REEL_WIDTH;
      this.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols
      for (let j = 0; j < REEL_SYM_HEIGHT; j++) {
        const symbol = new Sprite(
          slotTextures[Math.floor(Math.random() * slotTextures.length)]
        );
        // Scale the symbol to fit symbol area.

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

  tweenTo(
    object: Reel,
    property: "position",
    target: number,
    time: number,
    easing: (n: number) => number,
    oncomplete: (() => void) | null
  ) {
    const tween: TwinTo = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweening.push(tween);

    return tween;
  }

  // Function to start playing.
  startPlay = () => {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const target = r.position + 10 + i * 5;
      const time = 2500 + i * 600;

      this.tweenTo(
        r,
        "position",
        target,
        time,
        this.backout(0.5),
        i === this.reels.length - 1 ? this.reelsComplete : null
      );
    }
  };

  async results() {
    const rows = this.reels[0].symbols
      .map((symbol: Sprite) => symbol.position.y)
      .sort((a, b) => a - b)
      .slice(1);

    const countRes: WinCount = { "2": 0, "3": 0, "4": 0, "5": 0 };

    for (let index = 0; index < rows.length; index++) {
      let lastsymb: string | undefined = undefined;
      let count: number = 0;
      for (let i = 0; i < this.reels.length; i++) {
        const symb = await this.reels[i].symbols.find(
          (symbol) => Math.floor(symbol.position.y) == rows[index]
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
  reelsComplete = async () => {
    await this.results();
    this.running = false;
  };

  // Backout function from tweenjs.
  // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
  backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}
