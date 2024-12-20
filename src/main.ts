import {
  Application,
  Graphics,
  Text,
  Rectangle,
  BlurFilter,
  ColorMatrixFilter,
  Container,
} from "pixi.js";
import "./style.css";
import ReelsContainer from "./Components/ReelsContainer";
import { TwinTo } from "./Declarations/ReelsContainer";
import {
  REEL_WIDTH,
  REELS_AMOUNT,
  spritesLoad,
  SYM_PER_REEL_AMOUNT,
  SYMBOL_SIZE,
  WinCount,
} from "./Setup/config";
import WinScreen from "./Components/WinScreen";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { getStyle } from "./utils/utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI({
  DisplayObject: Container,
  Graphics: Graphics,
  filters: {
    BlurFilter: BlurFilter,
    ColorMatrixFilter: ColorMatrixFilter,
  },
});

const verticalScreen = window.innerHeight > window.innerWidth;

(async () => {
  const app = new Application();
  await app.init({
    width: verticalScreen ? 720 : 1280,
    height: verticalScreen ? 1280 : 720,
    sharedTicker: true,
  });
  await spritesLoad;
  document.body.appendChild(app.canvas);
  const screenBounds = new Rectangle(0, 0, app.canvas.width, app.canvas.height);

  app.stage.boundsArea = screenBounds;

  const margin = 100;

  const top = new Container();
  const bottom = new Container();

  const playText = new Text({ text: "Spin the wheels!", style: getStyle(36) });

  playText.x = Math.round(screenBounds.width / 2) - playText.width / 2;
  playText.y = Math.round(screenBounds.height - margin + playText.height / 2);
  bottom.addChild(playText);

  // Add header text
  const headerText = new Text({ text: "FUN SLOT GAME", style: getStyle(36) });

  headerText.x = Math.round((screenBounds.width - headerText.width) / 2);
  headerText.y = Math.round(headerText.height / 2);
  top.addChild(headerText);

  // Build the reels
  const reelBounds = new Rectangle(
    0,
    0,
    SYMBOL_SIZE * REELS_AMOUNT,
    SYMBOL_SIZE * (SYM_PER_REEL_AMOUNT - 1)
  );
  const reelsContainer = new ReelsContainer(isWin, reelBounds);

  app.stage.addChild(reelsContainer);

  // Build top & bottom covers and position reelContainer

  reelsContainer.y = Math.round(
    screenBounds.height / 2 - reelBounds.height / 2
  );
  reelsContainer.x = Math.round(
    screenBounds.width / 2 - (REEL_WIDTH * REELS_AMOUNT) / 2
  );

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity.
  bottom.eventMode = "static";
  bottom.cursor = "pointer";
  bottom.addListener("pointerdown", () => {
    reelsContainer.startPlay();
  });

  //Set Win Screens

  const winScreen = new WinScreen(screenBounds);
  app.stage.addChild(winScreen);

  function isWin(count: WinCount) {
    if (count["4"] > 0 || count["5"] > 0) {
      winScreen.playMegaWinAnimation();
    } else if (count["3"] > 0) {
      winScreen.playBigWinAnimation();
    } else if (count["2"] > 0) {
      winScreen.playSmallWinAnimation();
    }
  }

  // Listen for animate update.
  app.ticker.add(async () => {
    const now = await Date.now();
    const remove = [];

    for (let i = 0; i < reelsContainer.tweening.length; i++) {
      const t: TwinTo = reelsContainer.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = await lerp(
        t.propertyBeginValue,
        t.target,
        await t.easing(phase)
      );
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) await t.complete();
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      reelsContainer.tweening.splice(
        reelsContainer.tweening.indexOf(remove[i]),
        1
      );
    }
  });
  // Basic lerp funtion.
  function lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }
})();
