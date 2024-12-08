import { Assets, Texture, textureFrom } from "pixi.js";

export const REEL_WIDTH = 260;
export const SYMBOL_SIZE = 250;

export const REEL_SYM_WIDTH = 5;
export const REEL_SYM_HEIGHT = 4;

await Assets.load([
  "./assets/coin/coinAnimation.json",
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

const coinAnim = await Assets.cache.get("./assets/coin/coinAnimation.json").data
  .animations["win_coin_seq"];

export const coinAnimation: Texture[] = coinAnim.map((seq_frame: string) =>
  Texture.from(seq_frame)
);

export interface WinCount {
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}
