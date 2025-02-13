import { Category } from "./category.model";


export interface Book {
  id: number;
  name: string;
  year: number;
  categories: Category[];
}

export interface BookCreateDTO {
  name: string;
  year: number;
  categoryIds: number[];
}