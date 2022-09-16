// buisness logic, state, http library. the controller will actually call all these methods


import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from "./helpers";


// contains all the data that our application needs
export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage : RESULTS_PER_PAGE
    },
    bookmarks : [],
    
}

export const loadRecipe = async function(id){
    try {
        const data = await getJSON(`${API_URL}${id}`)
      
        const { recipe } = data.data
        state.recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients
          }
        // loop through the bookmarks array and see if any elements have the same id as the one currently in the state
        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true
        else state.recipe.bookmarked = false
    
    }catch(err){
        console.error(`${err} *******************************`);
        // throw the error here so it can be handled by the controller, which will then call the renderError method in the view
        throw err
    }
}

export const loadSearchResults = async function(query){
    try {
        // store the query in the state.search obj
        state.search.query = query
        const data = await getJSON(`${API_URL}?search=${query}`)
        
        // store the search results in the state.search obj
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })
        // reset the page to 1 to avoid loading other pages on a new search
        state.search.page = 1
        
    } catch (err) {
        throw err
    }
}
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page
    const start = (page - 1) * state.search.resultsPerPage  
    const end = page * state.search.resultsPerPage

    return state.search.results.slice(start, end)
}

// this function updates servings and the quantitiy of each ingredient in a recipe
export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        // new quantitiy = (old quantitiy * new servings) / old servings
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings
    });
    state.recipe.servings = newServings
}

export const addBookmark = function(recipe) {
    // add bookmark
    state.bookmarks.push(recipe)
    // mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true
    }
}
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id)
    // remove from bookmark array in state
    state.bookmarks.splice(index, 1)
    // marke recipe at NOT bokmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false
    
}