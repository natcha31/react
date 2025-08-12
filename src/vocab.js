import { categoriesData } from './data/data'; // path ต้องตรงกับตำแหน่งจริง

export const categories = categoriesData.map(c => c.name);

export const words = categoriesData.reduce((acc, c) => {
  acc[c.name] = c.words.map(w => ({
    english: w,
    thai: "", // เติมคำแปลทีหลังได้
    image: "https://via.placeholder.com/150"
  }));
  return acc;
}, {});
