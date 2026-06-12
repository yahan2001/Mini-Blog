import Blog from "../models/Blog.js";

export const createSlug = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = createSlug(title) || "blog";
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingBlog = await Blog.findOne(query).select("_id");
    if (!existingBlog) return slug;

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};
