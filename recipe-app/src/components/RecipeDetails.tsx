import { useSelector } from "react-redux";
import styles from "./RecipeDetails.module.css";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavoritedRecipes,
  selectHasError,
  selectLoading,
  selectSelectedRecipe,
  loadRecipeById,
  addRating,
  getRecipeFromLocalStorage,
  addComments,
  getCommentsFromLocalStorage,
} from "../features/recipes/recipeSlice";
import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch } from "../app/hooks";
import { HalfCircleSpinner } from "react-epic-spinners";
import { Rating } from "react-simple-star-rating";

const RecipeDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const recipe = useSelector(selectSelectedRecipe);
  const commentsData = getCommentsFromLocalStorage();
  const favoritedRecipes = useSelector(selectFavoritedRecipes);
  const loading = useSelector(selectLoading);
  const hasError = useSelector(selectHasError);

  const param = useParams();

  const { name, instructions, img, ingredients } = recipe || {};
  const [addedFavorites, setAddedFavorites] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setAllComments] = useState<Array<string>>([]);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    dispatch(loadRecipeById(String(param.id)));
    setAddedFavorites(
      favoritedRecipes.some((recipe) => recipe.id === param.id)
    );
  }, [dispatch, param.id, favoritedRecipes, setAllComments]);

  const handleRating = (rate: number) => {
    const ratingObj = getRecipeFromLocalStorage().find(
      (item: any) => item.id === param.id
    );
    let updatedRecipe;
    if (ratingObj) {
      updatedRecipe = { ...ratingObj, rating: rate };
    } else {
      updatedRecipe = { ...recipe, rating: rate };
    }
    setRating(rate);
    dispatch(addRating(updatedRecipe));
  };

  const addComment = () => {
    const recipeComments = [...comments, comment];
    const commentsObj = { id: param.id, comments: recipeComments };

    setAllComments(recipeComments);
    dispatch(addComments(commentsObj));
    setComment("");
  };

  if (loading)
    return (
      <HalfCircleSpinner
        className={styles.spinner}
        color="rgb(63, 167, 148)"
        size={50}
      />
    );

  if (hasError || !recipe) {
    return <p className={styles.errorParagraph}>No recipe to display!</p>;
  }

  const renderIngrediants = (ingredients: Array<string>) => {
    return (
      <ul className={styles.items}>
        {ingredients.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderInstructions = (instructions: string) => {
    if (instructions) {
      const list = instructions
        .split(new RegExp(/\n/))
        .filter((item: string) => item.length > 1);
      return (
        <ul className={styles.items}>
          {list.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  };

  const handleFavoriteClick = (): void => {
    if (addedFavorites) {
      setAddedFavorites(false);
      dispatch(removeFromFavorites(recipe.id));
    } else {
      setAddedFavorites(true);
      dispatch(addToFavorites(recipe));
    }
  };

  const favoritesText: string = `${
    addedFavorites ? "Remove from" : "Add to"
  } favorites`;

  return (
    <div className="m-2 p-2">
      <div className={styles.cardDetail}>
        <div>
          <img className={styles.cardImg} src={img} alt={name} />
          <h4 className="d-flex align-items-center">
            Rating:{" "}
            <Rating
              onClick={handleRating}
              size={30}
              initialValue={recipe.rating}
            />
          </h4>
          <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-center row">
              <div className="d-flex flex-column col-md-8">
                <div className="coment-bottom bg-white p-2 px-4">
                  <div className="d-flex flex-row add-comment-section mt-4 mb-4">
                    <Form.Control
                      type="text"
                      value={comment}
                      placeholder="Add your comment"
                      onChange={(event) => setComment(event.target.value)}
                    />
                    <Button style={{ marginLeft: "10px" }} onClick={addComment}>
                      Comment
                    </Button>
                  </div>
                  {commentsData[recipe.id]
                    ? commentsData[recipe.id].map((comment: string) => (
                        <>
                          <div className="commented-section mt-2">
                            <div className="comment-text-sm">
                              <span>{comment}</span>
                            </div>
                          </div>
                          <hr></hr>
                        </>
                      ))
                    : []}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className={styles.cardTitle}>{name}</h3>
          <div className={styles.ingredients}>
            <h4 className={styles.heading}>Ingredients</h4>
            <ul className={styles.listItem}>
              {ingredients && renderIngrediants(ingredients)}
            </ul>
          </div>
          <div className={styles.instructions}>
            <h4 className={styles.heading}>Instructions</h4>
            <div data-testid="meal-description" className={styles.instructions}>
              {instructions && renderInstructions(instructions)}
            </div>
          </div>
          <Button className={styles.btnFavorite} onClick={handleFavoriteClick}>
            {favoritesText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
