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
import { REEL_WIDTH, SYMBOL_SIZE, WinCount } from "./Setup/config";
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

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    sharedTicker: true,
  });

  document.body.appendChild(app.canvas);
  window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  app.stage.pivot.set(app.canvas.width / 2, app.canvas.height / 2);
  app.stage.x = app.canvas.width / 2;
  app.stage.y = app.canvas.height / 2;

  // Build the reels
  const reelsContainer = new ReelsContainer(isWin);

  app.stage.addChild(reelsContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelsContainer.y = margin;
  reelsContainer.x = Math.round(
    (app.screen.width + reelsContainer.width) / 2 - REEL_WIDTH * 5
  );
  const top = new Graphics()
    .rect(0, 0, app.screen.width, margin)
    .fill({ color: 0x0 });
  const bottom = new Graphics()
    .rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin)
    .fill({ color: 0x0 });

  const playText = new Text({ text: "Spin the wheels!", style: getStyle(36) });

  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y =
    app.screen.height - margin + Math.round((margin - playText.height) / 2);
  bottom.addChild(playText);

  // Add header text
  const headerText = new Text({ text: "FUN SLOT GAME", style: getStyle(36) });

  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity.
  bottom.eventMode = "static";
  bottom.cursor = "pointer";
  bottom.addListener("pointerdown", () => {
    reelsContainer.startPlay();
  });

  //Set Win Screens

  const winScreen = new WinScreen(
    new Rectangle(0, 0, app.canvas.width, app.canvas.height)
  );
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
