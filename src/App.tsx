import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import  Recipes from './features/recipes/Recipes'
import Header from './components/Header';
import SearchRecipes from './features/recipes/SearchedRecipes';
import RecipeDetails from './components/RecipeDetails';
import FavouriteRecipes from './features/recipes/FavouriteRecipes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Recipes />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/favorites" element={<FavouriteRecipes />} />
        <Route path="/search-results/:query" element={<SearchRecipes />} />
        <Route path="*" element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
