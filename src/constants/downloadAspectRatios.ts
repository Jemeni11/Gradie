const downloadAspectRatios = {
  square: { ratio: 1, label: "1:1 Square" },
  landscape: { ratio: 16 / 9, label: "16:9 Landscape" },
  portrait: { ratio: 9 / 16, label: "9:16 Portrait" },
  widescreen: { ratio: 21 / 9, label: "21:9 Ultra-wide" },
  classic: { ratio: 4 / 3, label: "4:3 Classic" },
  golden: { ratio: 1.618, label: "1.618:1 Golden Ratio" },
  cinematic: { ratio: 2.35, label: "2.35:1 Cinematic" },
};

export default downloadAspectRatios;
