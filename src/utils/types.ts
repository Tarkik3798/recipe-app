export interface Recipe {
  id: string;
  name: string;
  img: string;
  rating: number;
  comments: Array<string>;
}

export interface RecipesState {
  recipes: Recipe[];
  favoritedRecipes: Recipe[];
  ratings: Array<Ratings>;
  selectedRecipe?: IRecipe;
  searchedRecipes: Recipe[];
  isLoading: boolean;
  hasError: boolean;
  comments:{[key:string] : Array<string>};
}

export interface Ratings {
  id: string;
  rating: number;
} 

export interface ISingleMeal {
  id: string;
  meal: string;
  img: string;
}

export interface IFetchedMeals {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export type IIngredients = string[];

export interface IRecipe {
  id: string;
  name: string;
  category?: string;
  instructions?: string;
  img?: string;
  ingredients?: string[];
  rating?: number;
  comments?: Array<string>;
}

export interface IFetchedRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strSource: string;
  rating?: number;
  comments?: Array<string>;
  strIngredient1: string;
  strIngredient2: string;
  strIngredient3: string;
  strIngredient4: string;
  strIngredient5: string;
  strIngredient6: string;
  strIngredient7: string;
  strIngredient8: string;
}