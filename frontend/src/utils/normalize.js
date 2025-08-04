// utils/normalize.js
export const normalizeCategoryName = (name) =>
  name.toLowerCase().replace(/\s|&|\/|-/g, "").replace(/[^a-z0-9]/g, "");
