const getRecommendedFormat = (
  hasTransparency: boolean,
  isLargeImage: boolean,
) => {
  if (hasTransparency) return "webp";
  if (isLargeImage) return "webp";
  return "jpg";
};

export default getRecommendedFormat;
