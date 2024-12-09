import { Container, ContainerChild, BlurFilter, Sprite } from "pixi.js";
interface Reel {
  container: Container<ContainerChild>;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
}

interface TwinTo {
  object: Reel;
  property: "position";
  propertyBeginValue: Reel["position"];
  target: number;
  time: number;
  easing: (n: number) => number;
  complete: (() => void) | null;
  start: number;
}
