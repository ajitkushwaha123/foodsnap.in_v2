export function slugifyCategory(category) {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "") || "";
}
