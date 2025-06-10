import { DimensionPresetObjectArray } from "@/types";

const dimensionPresets: DimensionPresetObjectArray = {
  // Square formats
  "square-1080": {
    width: 1080,
    height: 1080,
    label: "Square (1080x1080)",
    useCases: ["Instagram Post", "Instagram Carousel"],
    category: "social",
  },
  "square-1200": {
    width: 1200,
    height: 1200,
    label: "Square (1200x1200)",
    useCases: ["Facebook Post", "LinkedIn Post"],
    category: "social",
  },

  // Vertical story/video formats
  "vertical-story": {
    width: 1080,
    height: 1920,
    label: "Vertical Story (9:16)",
    useCases: ["Instagram Story", "Instagram Reel", "TikTok Video"],
    category: "social",
  },
  "vertical-mobile-wallpaper": {
    width: 1080,
    height: 2340,
    label: "Mobile Wallpaper",
    useCases: ["Phone Wallpaper", "Mobile Background"],
    category: "wallpaper",
  },

  // Horizontal social formats
  "horizontal-twitter": {
    width: 1200,
    height: 675,
    label: "Horizontal (16:9)",
    useCases: ["Twitter Post", "X Post"],
    category: "social",
  },
  "horizontal-og": {
    width: 1200,
    height: 630,
    label: "Open Graph (1.91:1)",
    useCases: ["OG Image", "Social Share Preview"],
    category: "web",
  },

  // Portrait post format
  "portrait-post": {
    width: 1080,
    height: 1350,
    label: "Portrait Post (4:5)",
    useCases: ["Instagram Post", "Facebook Post"],
    category: "social",
  },

  // YouTube formats
  "youtube-thumbnail": {
    width: 1280,
    height: 720,
    label: "YouTube Thumbnail (16:9)",
    useCases: ["YouTube Thumbnail", "Video Preview"],
    category: "social",
  },
  "youtube-banner": {
    width: 2560,
    height: 1440,
    label: "YouTube Banner",
    useCases: ["YouTube Channel Art", "Channel Header"],
    category: "social",
  },

  // Full HD formats
  "fhd-landscape": {
    width: 1920,
    height: 1080,
    label: "Full HD (16:9)",
    useCases: [
      "YouTube Video",
      "PowerPoint Slide",
      "Keynote Slide",
      "Hero Section",
      "Desktop Wallpaper",
    ],
    category: "presentation",
  },

  // 4K formats
  "uhd-landscape": {
    width: 3840,
    height: 2160,
    label: "4K UHD (16:9)",
    useCases: ["4K Wallpaper", "High-res Background"],
    category: "wallpaper",
  },

  // Ultrawide
  ultrawide: {
    width: 3440,
    height: 1440,
    label: "Ultrawide (21:9)",
    useCases: ["Ultrawide Monitor Wallpaper", "Gaming Background"],
    category: "wallpaper",
  },

  // Web specific
  "blog-header": {
    width: 1200,
    height: 400,
    label: "Blog Header (3:1)",
    useCases: ["Blog Header", "Article Banner"],
    category: "web",
  },
  "email-header": {
    width: 600,
    height: 200,
    label: "Email Header (3:1)",
    useCases: ["Email Header", "Newsletter Banner"],
    category: "web",
  },

  // Tablet
  "tablet-wallpaper": {
    width: 2048,
    height: 2732,
    label: "Tablet Wallpaper (3:4)",
    useCases: ["iPad Wallpaper", "Tablet Background"],
    category: "wallpaper",
  },
};

export default dimensionPresets;
