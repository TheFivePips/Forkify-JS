// buisness logic, state, http library


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
    }
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
        
    }catch(err){
        console.error(`${err} *******************************`);
        // throw the error here so it can be handled by the controller, which will then call the renderError method in the view
        throw err
    }
}
// the controller will actually call this method
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
