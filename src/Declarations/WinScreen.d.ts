import { Container } from "pixi.js";

interface WinScreen extends Container {
  playAnimation(): void;
  playIn(): void;
  playOut(): void;
}
