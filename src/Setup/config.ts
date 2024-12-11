import { Assets, Texture } from "pixi.js";

export const REEL_WIDTH = 155;
export const SYMBOL_SIZE = 150;

export const REELS_AMOUNT = 5;
export const SYM_PER_REEL_AMOUNT = 4;

export const spinPerReelTest = [7, 10, 14, 20, 30];

export const spinTime = 5;

export const timeAnimationCoinFall = 3;
export const totalCoinsInEmitter = 1000;
export const bounceBackReel = 50;
export const winAnimationTime = 3000;

await Assets.load([
  "./assets/coin/coinAnimation.json",
  "./assets/celebration/rotated_glow.png",
  "./assets/celebration/shine.png",
  "./assets/bigWin/bigwin_title.png",
  "./assets/bigWin/megawin_title.png",
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

export const FXs = {
  flare: Texture.from("./assets/celebration/flare.png"),
  glow: Texture.from("./assets/celebration/rotated_glow.png"),
  shine: Texture.from("./assets/celebration/shine.png"),
  smoke: Texture.from("./assets/celebration/smoke.png"),
};
export const winTextAssets = {
  bigWin: Texture.from("./assets/bigWin/bigwin_title.png"),
  megaWin: Texture.from("./assets/bigWin/megawin_title.png"),
};
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
