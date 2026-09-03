export const CUISINE_DIETARY = {
  Italian: ["vegetarian"],
  Chinese: [],
  Indian: ["vegetarian", "halal"],
  Mexican: ["vegetarian"],
  Japanese: [],
  American: [],
};

export const dietaryTagsForCuisine = (genre) => {
  if (!genre) return [];
  return CUISINE_DIETARY[genre] || [];
};

export const supportsDiet = (genre, dietId) => {
  const tags = dietaryTagsForCuisine(genre);
  return tags.includes(dietId);
};