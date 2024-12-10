import { Color, FillGradient, TextStyle } from "pixi.js";

export const getStyle = (fontSize: number) => {
  // Create gradient fill
  const fill = new FillGradient(0, 0, 0, fontSize * 1.7);

  const colors = [0xffffff, 0x00ff99].map((color) =>
    Color.shared.setValue(color).toNumber()
  );

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });

  return new TextStyle({
    fontFamily: "Arial",
    fontSize: fontSize,
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
  });
};
