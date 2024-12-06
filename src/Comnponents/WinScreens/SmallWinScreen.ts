import { Container } from "pixi.js";
import { WinScreen } from "../../Declarations/WinScreen";

export default class SmallWinScreen extends Container implements WinScreen {
  playIn() {
    console.log("Slide small win in");
    return Promise.resolve();
  }
  playOut() {
    console.log("Slide small win out");
  }

  playAnimation() {
    this.playIn().then(() => this.playOut());
  }
}
