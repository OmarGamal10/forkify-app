//import 'core-js/actual';
//import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//init IIFE
//publisher-subscriber

(function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  model.getLocal();
  bookmarksView.render(model.state.bookmarks);
  addRecipeView.addHandlerShowWindow();
  addRecipeView.addHandlerHideWindow();
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();

async function controlRecipe() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  recipeView.renderSpinner();
  //load recipe
  await model.loadRecipe(id);
  if (model.getSearchResults().length !== 0)
    resultsView.update(model.getSearchResults());
  //render
  console.log(model.state.recipe);
  recipeView.render(model.state.recipe);
  bookmarksView.update(model.state.bookmarks);
}

async function controlSearchResults() {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResults());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
}

function controlPagination(goto) {
  resultsView.render(model.getSearchResults(goto));
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //updating servings in state
  model.updateServings(newServings);
  //rendering
  //we want update to update only ingredients not the whole recipe
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();
    }, 1500);
    //Change URL without reloading
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
}
