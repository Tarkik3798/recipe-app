import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  Recipe,
  IFetchedMeals,
  IRecipe,
  IIngredients,
  IFetchedRecipe,
  RecipesState,
} from "../../utils/types";
import {
  fetchRecipeBySearch,
  fetchRecipes,
  fetchRecipesById,
} from "./recipesAPI";

const getFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const getRecipeFromLocalStorage = () => {
  const ratings = localStorage.getItem("ratings");
  return ratings ? JSON.parse(ratings) : [];
};

export const getCommentsFromLocalStorage = () => {
  const comments = localStorage.getItem("comments");
  return comments ? JSON.parse(comments) : {};
};

const filterEmptyItems = (item: string | undefined) => item !== "";

const initialState: RecipesState = {
  recipes: [],
  favoritedRecipes: getFavoritesFromLocalStorage(),
  searchedRecipes: [],
  isLoading: false,
  hasError: false,
  selectedRecipe: undefined,
  ratings: [],
  comments: {},
};

export const getRecipes = createAsyncThunk("recipes/getRecipes", async () => {
  const response = await fetchRecipes();
  const { meals } = await response.data;
  const recipes: Recipe[] = meals.map(
    ({ idMeal: id, strMeal: name, strMealThumb: img }: IFetchedMeals) => ({
      id,
      name,
      img,
    })
  );
  return recipes;
});

export const loadRecipeBySearchInput = createAsyncThunk(
  "recipes/loadRecipeBySearchInput",
  async (searchInput: string) => {
    const response = await fetchRecipeBySearch(searchInput);
    const { meals } = await response.data;
    const recipesBySearch: Recipe[] = meals.map(
      ({ idMeal: id, strMeal: name, strMealThumb: img }: IFetchedMeals) => ({
        id,
        name,
        img,
      })
    );
    return recipesBySearch;
  }
);

export const loadRecipeById = createAsyncThunk(
  "recipes/loadRecipeById",
  async (recipeId: string) => {
    const response = await fetchRecipesById(recipeId);
    const { meals } = await response.data;
    const {
      idMeal: id,
      strMeal: name,
      strCategory: category,
      strInstructions: instructions,
      strMealThumb: img,
      strIngredient1,
      strIngredient2,
      strIngredient3,
      strIngredient4,
      strIngredient5,
      strIngredient6,
      strIngredient7,
      strIngredient8,
    }: IFetchedRecipe = meals[0];

    const ingredientsInitial: IIngredients = [
      strIngredient1,
      strIngredient2,
      strIngredient3,
      strIngredient4,
      strIngredient5,
      strIngredient6,
      strIngredient7,
      strIngredient8,
    ];

    const ingredients: IIngredients =
      ingredientsInitial.filter(filterEmptyItems);
    const ratings = getRecipeFromLocalStorage();
    const commentsArr = getCommentsFromLocalStorage();
    const comments =
      commentsArr.length > 0
        ? commentsArr.find((item: any) => item.id === id)?.comments
        : [];
    // console.log(recipe && recipe?.comments)
    const rating =
      ratings.length > 0
        ? ratings?.find((item: any) => item.id === id)?.rating
        : 0;

    const recipeById: IRecipe = {
      id,
      name,
      category,
      instructions,
      img,
      ingredients,
      rating,
      comments,
    };

    return recipeById;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    addToFavorites(state, { payload }: PayloadAction<any>) {
      const addRecipe: Recipe[] = [...state.favoritedRecipes, payload];
      state.favoritedRecipes = addRecipe;
      localStorage.setItem("favorites", JSON.stringify(state.favoritedRecipes));
    },
    addRating(state, { payload }: PayloadAction<any>) {
      const ratingsPayload: Recipe[] = [...state.ratings, payload];
      state.ratings = ratingsPayload;
      localStorage.setItem("ratings", JSON.stringify(state.ratings));
    },
    addComments(state, { payload }: PayloadAction<any>) {
      let existingData = getCommentsFromLocalStorage();
      if (existingData && Object.keys(existingData).includes(payload.id)) {
        existingData[payload.id] = payload.comments;
      } else {
        existingData = Object.assign(existingData, {
          [payload.id]: payload.comments,
        });
      }
      localStorage.setItem("comments", JSON.stringify(existingData));
      state.comments = existingData;
    },
    removeFromFavorites(state, { payload }: PayloadAction<string>) {
      const filteredList = state.favoritedRecipes?.filter(
        (recipe) => recipe.id !== payload
      );
      state.favoritedRecipes = filteredList;
      localStorage.setItem("favorites", JSON.stringify(state.favoritedRecipes));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecipes.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    builder.addCase(
      getRecipes.fulfilled,
      (state, { payload }: PayloadAction<Recipe[]>) => {
        state.recipes = payload;
        state.isLoading = false;
        state.hasError = false;
      }
    );
    builder.addCase(getRecipes.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
    //Recipe details
    builder.addCase(loadRecipeById.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    builder.addCase(
      loadRecipeById.fulfilled,
      (state, { payload }: PayloadAction<IRecipe>) => {
        state.selectedRecipe = payload;
        state.isLoading = false;
        state.hasError = false;
      }
    );
    builder.addCase(loadRecipeById.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
    // search input
    builder.addCase(loadRecipeBySearchInput.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    builder.addCase(
      loadRecipeBySearchInput.fulfilled,
      (state, { payload }: PayloadAction<Recipe[]>) => {
        state.searchedRecipes = payload;
        state.isLoading = false;
        state.hasError = false;
      }
    );
    builder.addCase(loadRecipeBySearchInput.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
  },
});

//actions
export const { addToFavorites, removeFromFavorites, addRating, addComments } =
  recipeSlice.actions;

// selectors
export const selectRecipes = (state: RootState) => state.recipes;
export const selectLoading = (state: RootState) => state.recipes.isLoading;
export const selectHasError = (state: RootState) => state.recipes.hasError;
export const selectSelectedRecipe = (state: RootState) =>
  state.recipes.selectedRecipe;
export const selectSelectedComments = (state: RootState) =>
  state.recipes.comments;
export const selectFavoritedRecipes = (state: RootState) =>
  state.recipes.favoritedRecipes;
export const selectSearchedRecipes = (state: RootState) =>
  state.recipes.searchedRecipes;

//reducer
export default recipeSlice.reducer;
