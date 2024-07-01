import { Category } from "../models"

export class CategoryService {
    catalogApiUrl: string
    constructor () {
      this.catalogApiUrl = process.env.CATALOG_API_URL || ''
    }
    
    async getCategories(): Promise<Category[]> {
      const response = await fetch(`${this.catalogApiUrl}/category`, {
        next: {
          revalidate: 1
        }
      })
    
      return response.json();
    }
}