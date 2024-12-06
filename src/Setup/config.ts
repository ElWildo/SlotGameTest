import { Assets, Texture } from "pixi.js";

export const REEL_WIDTH = 260;
export const SYMBOL_SIZE = 250;

export const REEL_SYM_WIDTH = 5;
export const REEL_SYM_HEIGHT = 4;

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
