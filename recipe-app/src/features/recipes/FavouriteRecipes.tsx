import React from "react";
import { useSelector } from "react-redux";
import {
  loadRecipeById,
  removeFromFavorites,
  selectFavoritedRecipes,
  selectHasError,
  selectLoading,
} from "./recipeSlice";
import styles from "./Recipes.module.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { HalfCircleSpinner } from "react-epic-spinners";

const FavouriteRecipes: React.FC = () => {
  const favoritedRecipes = useSelector(selectFavoritedRecipes);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useSelector(selectLoading);
  const hasError = useSelector(selectHasError);

  const renderFavouriteRecipes = () => {
    if (loading)
      return (
        <HalfCircleSpinner
          className={styles.spinner}
          color="rgb(63, 167, 148)"
          size={50}
        />
      );
        console.log(favoritedRecipes);
        
    if (hasError || !favoritedRecipes || favoritedRecipes.length === 0) {
      return <p className="text-center">Cannot display recipes...</p>;
    }

    const handleRecipeClick = (id: string) => {
      dispatch(loadRecipeById(id));
      navigate(`/recipes/${id}`);
    };

    const handleRemove = (id: string) => {
      dispatch(removeFromFavorites(id!));
    };

    return (
      <>
        <Container>
          <Row xs={2} md={3} lg={4}>
            {favoritedRecipes.map((recipe, index) => (
              <Col key={index}>
                <Card
                  className={`${styles.card} my-2`}
                  onClick={(e) => handleRecipeClick(recipe.id)}
                >
                  <Card.Img variant="top" src={recipe.img} />
                  <Card.Body>
                    <Card.Text>{recipe.name}</Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Footer>
                    <Button style={{width: '100%'}} variant="danger" onClick={() => handleRemove(recipe.id)}>
                      Remove
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  };

  return (
    <section>
      <div className={styles.recipesContainer}>{renderFavouriteRecipes()}</div>
    </section>
  );
};

export default FavouriteRecipes;
