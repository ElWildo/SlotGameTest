import {
  Assets,
  BlurFilter,
  Container,
  ContainerChild,
  Sprite,
  Texture,
} from "pixi.js";

export interface Reel {
  container: Container<ContainerChild>;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
}

export interface TwinTo {
  object: Reel;
  property: "position";
  propertyBeginValue: Reel["position"];
  target: number;
  time: number;
  easing: (n: number) => number;
  complete: (() => void) | null;
  start: number;
}

export const REEL_WIDTH = 260;
export const SYMBOL_SIZE = 250;

await Assets.load([
  "./assets/symbols/s01.png",
  "./assets/symbols/s02.png",
  "./assets/symbols/s03.png",
  "./assets/symbols/s04.png",
  "./assets/symbols/s05.png",
  "./assets/symbols/s06.png",
  "./assets/symbols/s07.png",
  "./assets/symbols/s08.png",
  "./assets/symbols/s09.png",
]);

export const slotTextures = [
  Texture.from("./assets/symbols/s01.png"),
  Texture.from("./assets/symbols/s01.png"),
  Texture.from("./assets/symbols/s02.png"),
  Texture.from("./assets/symbols/s03.png"),
  Texture.from("./assets/symbols/s04.png"),
  Texture.from("./assets/symbols/s05.png"),
  Texture.from("./assets/symbols/s06.png"),
  Texture.from("./assets/symbols/s07.png"),
  Texture.from("./assets/symbols/s08.png"),
  Texture.from("./assets/symbols/s09.png"),
];

export default class ReelsContainer extends Container {
  public reels: Reel[] = [];
  public tweening: TwinTo[] = [];
  private running = false;
  private calculateWin: (count: number) => void;
  constructor(calculateWin: (count: number) => void) {
    super();
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    this.calculateWin = calculateWin;
    for (let i = 0; i < 5; i++) {
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
      for (let j = 0; j < 4; j++) {
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

    for (let index = 0; index < rows.length; index++) {
      let lastsymb: string | undefined = undefined;
      let count = 0;
      for (let i = 0; i < this.reels.length; i++) {
        const symb = await this.reels[i].symbols.find(
          (symbol) => Math.floor(symbol.position.y) == rows[index]
        )?.texture.label;
        if (!symb) console.log("symb undefined");
        if (!lastsymb || lastsymb != symb) {
          if (lastsymb != symb) {
            // this.isWin(count);
            this.calculateWin(count);
          }
          lastsymb = symb;
          count = 1;
        } else {
          count++;
          if (i === this.reels.length - 1)
            // this.isWin(count);
            this.calculateWin(count);
        }
      }
      lastsymb = undefined;
    }
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
