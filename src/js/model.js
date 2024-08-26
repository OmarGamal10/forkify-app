import { API_URL, KEY } from './config';
import { getJSON, transformObjectSnakeToCamel, sendJSON } from './helpers.js';
import { RESULTS_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: '',
    resultsPerPage: RESULTS_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = transformObjectSnakeToCamel(data.data.recipe);
    if (state.bookmarks.some(r => r.id === state.recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    state.search.currentPage = 1;
    state.search.results = data.data.recipes.map(rec =>
      transformObjectSnakeToCamel(rec)
    );
  } catch (err) {
    throw err;
  }
}

export function getSearchResults(page = state.search.currentPage) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  state.search.currentPage = page;
  return state.search.results.slice(start, end);
}

export function updateServings(servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
  storeLocally();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  storeLocally();
}

function storeLocally() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function getLocal() {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    ? JSON.parse(localStorage.getItem('bookmarks'))
    : [];
}

export async function uploadRecipe(newRecipe) {
  try {
    const newRecipeObj = { ingredients: [] };
    const dataObj = Object.entries(newRecipe);
    dataObj.forEach(([e, el]) => {
      if (e.includes('ingredient')) {
        if (el !== '') newRecipeObj.ingredients.push(arrayifyIngredients(el));
      } else newRecipeObj[e] = el;
    });
    const recipeSend = {
      title: newRecipeObj.title,
      source_url: newRecipeObj.sourceUrl,
      image_url: newRecipeObj.image,
      publisher: newRecipeObj.publisher,
      cooking_time: +newRecipeObj.cookingTime,
      servings: +newRecipeObj.servings,
      ingredients: newRecipeObj.ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipeSend);
    console.log(data);
    console.log(transformObjectSnakeToCamel(data.data.recipe));
    state.recipe = transformObjectSnakeToCamel(data.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

function arrayifyIngredients(ing) {
  if (ing.split(',').length !== 3) {
    throw new Error('Enter Ingredient in a correct format please.');
  }
  return ing.split(',').reduce((acc, el, i) => {
    if (i == 0) {
      el === '' ? (acc.quantity = null) : (acc.quantity = +el);
    } else if (i == 1) {
      el === '' ? (acc.unit = null) : (acc.unit = el);
    } else {
      el === '' ? (acc.description = null) : (acc.description = el);
    }
    return acc;
  }, {});
}
