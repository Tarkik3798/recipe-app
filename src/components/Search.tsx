import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadRecipeBySearchInput } from "../features/recipes/recipeSlice";
import { useAppDispatch } from "../app/hooks";
import styles from "./Search.module.css";

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const history = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (query) {
      dispatch(loadRecipeBySearchInput(query));
      setQuery("");
      history(`/search-results/${query}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles["search-input"]}
        type="search"
        placeholder="Search your recipes"
        name="search"
            id="search"
            value={query}
            onChange={handleChange}
            ref={inputRef}
      />
    </form>
  );
};

export default Search;
