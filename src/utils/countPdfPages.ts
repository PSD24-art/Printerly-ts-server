import { countPdfPages } from "pdf-pages-count";
export type PageCountResult =
  | { fileName: string; pages: number; error?: never }
  | { fileName: string; error: string; pages?: never };

// Map your multer files to an array of page count promises
export const countPages = async (files: Express.Multer.File[]): Promise<PageCountResult[]> => {
  const pageCountPromises = files.map(async (file) => {
    try {
      const pageCount = await countPdfPages(new Uint8Array(file.buffer));
      return { fileName: file.originalname, pages: pageCount };
    } catch (error) {
      return { fileName: file.originalname, error: "Could not calculate pages" };
    }
  });

  const results = await Promise.all(pageCountPromises);
  console.log(results);
  return results;
};
