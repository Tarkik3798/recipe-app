import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getRecipes,
  loadRecipeById,
  selectRecipes,
} from "../recipes/recipeSlice";
import { useAppDispatch } from "../../app/hooks";
import styles from "./Recipes.module.css";
import { Col, Card, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { HalfCircleSpinner } from "react-epic-spinners";

const Recipes: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, hasError, recipes } = useSelector(selectRecipes);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  const handleRecipeClick = (id: string) => {
    dispatch(loadRecipeById(id));
    navigate(`/recipes/${id}`);
  };

  const renderRecipes = () => {
    if (isLoading)
      return (
        <HalfCircleSpinner
          className={styles.spinner}
          color="rgb(63, 167, 148)"
          size={50}
        />
      );
    if (hasError) return <p>Cannot display recipes...</p>;

    return (
      <>
        <Container>
          <Row xs={2} md={3} lg={4}>
            {recipes.map((recipe, index) => (
              <Col key={index}>
                <Card
                  className={`${styles.card} my-2`}
                  onClick={() => handleRecipeClick(recipe.id)}
                >
                  <Card.Img variant="top" src={recipe.img} />
                  <Card.Body>
                    <Card.Text>{recipe.name}</Card.Text>
                  </Card.Body>
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
      <div>{renderRecipes()}</div>
    </section>
  );
};

export default Recipes;
