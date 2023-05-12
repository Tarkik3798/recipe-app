import axios from "axios";
import {API_URLS} from "../../utils/constants"

export const fetchRecipes = async () => {
  return await axios.get(API_URLS.GET_RECIPES);
};

export const fetchRecipesById = async (id: string) => {
  return await axios.get(API_URLS.GET_RECIPE_BY_ID + id);
};

export const fetchRecipeBySearch = async (searchText: string) => {
  return await axios.get(API_URLS.GET_RECIPES_BY_SEARCH + searchText);
};
