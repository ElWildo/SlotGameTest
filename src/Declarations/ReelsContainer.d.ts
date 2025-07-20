import { Container, ContainerChild, BlurFilter, Sprite } from "pixi.js";
interface Reel {
  container: Container<ContainerChild>;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
}
