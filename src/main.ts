import {
  Application,
  Color,
  Graphics,
  Text,
  TextStyle,
  FillGradient,
} from "pixi.js";
import "./style.css";
import ReelsContainer, {
  REEL_WIDTH,
  slotTextures,
  SYMBOL_SIZE,
  TwinTo,
} from "./Comnponents/ReelsContainer";

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
    resolution: window.innerWidth / window.innerHeight,
  });

  document.body.appendChild(app.canvas);
  app.renderer.resize(window.innerWidth, window.innerHeight - 4);
  window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight - 4);
  });

  // Build the reels
  const reelsContainer = new ReelsContainer();

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

  // Create gradient fill
  const fill = new FillGradient(0, 0, 0, 36 * 1.7);

  const colors = [0xffffff, 0x00ff99].map((color) =>
    Color.shared.setValue(color).toNumber()
  );

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });

  // Add play text
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: { fill },
    stroke: { color: 0x4a1850, width: 5 },
    dropShadow: {
      color: 0x000000,
      angle: Math.PI / 6,
      blur: 4,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  });

  const playText = new Text({ text: "Spin the wheels!", style });

  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y =
    app.screen.height - margin + Math.round((margin - playText.height) / 2);
  bottom.addChild(playText);

  // Add header text
  const headerText = new Text({ text: "FUN SLOT GAME", style });

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

  // Listen for animate update.
  app.ticker.add(() => {
    // Update the slots.
    for (let i = 0; i < reelsContainer.reels.length; i++) {
      const r = reelsContainer.reels[i];
      // Update blur filter y amount based on speed.

      r.blur.blurY = (r.position - r.previousPosition) * 100;
      r.previousPosition = r.position;

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;

        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });

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
