import { Container } from "pixi.js";
import { WinScreen } from "../../Declarations/WinScreen";

export default class BigWinScreen extends Container implements WinScreen {
  playIn() {
    console.log("Slide Big win in");
    return Promise.resolve();
  }
  playOut() {
    console.log("Slide Big win out");
  }

  playAnimation() {
    this.playIn().then(() => this.playOut());
  }
}
