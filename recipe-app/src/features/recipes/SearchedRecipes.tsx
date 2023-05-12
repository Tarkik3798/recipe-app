import { useSelector } from "react-redux";
import {
  loadRecipeById,
  loadRecipeBySearchInput,
  selectHasError,
  selectLoading,
  selectSearchedRecipes,
} from "./recipeSlice";
import styles from "./Recipes.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import { HalfCircleSpinner } from "react-epic-spinners";

const SearchRecipes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchedRecipes = useSelector(selectSearchedRecipes);
  const loading = useSelector(selectLoading);
  const hasError = useSelector(selectHasError);
  const params = useParams();

  const handleRecipeClick = (id: string) => {
    dispatch(loadRecipeById(id));
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    dispatch(loadRecipeBySearchInput(String(params.query)));
  }, [params.query, dispatch]);

  const renderSearchRecipes = () => {
    if (loading)
      return (
        <HalfCircleSpinner
          className={styles.spinner}
          color="rgb(63, 167, 148)"
          size={50}
        />
      );

    if (hasError || !searchedRecipes) {
      return <p className={styles.errorParagraph}>Cannot display recipes...</p>;
    }

    return (
      <>
        <Container>
          <Row xs={2} md={3} lg={4}>
            {searchedRecipes.map((recipe, index) => (
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
      <h3 className="text-center">
        Your search results <span>({searchedRecipes?.length})</span>:
      </h3>
      <div className={styles.recipesContainer}>{renderSearchRecipes()}</div>
    </section>
  );
};

export default SearchRecipes;
