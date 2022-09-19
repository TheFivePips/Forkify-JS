// buisness logic, state, http library. the controller will actually call all these methods


import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";


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
const createRecipeObject = function(data){
    const { recipe } = data.data
        return {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
        //   only recipes we have uploaded have the key so we use the && to short circuit the logic if one is available and then spread the values. nice trick to conditoinally add properties to an object
          ...(recipe.key && { key: recipe.key })
        }
}

export const loadRecipe = async function(id){
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
        state.recipe = createRecipeObject(data)
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
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        
        // store the search results in the state.search obj
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
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
    persistBookmarks()
}
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id)
    // remove from bookmark array in state
    state.bookmarks.splice(index, 1)
    // marke recipe at NOT bokmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false
    persistBookmarks()
    
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

const init = function(){
    const storage = localStorage.getItem('bookmarks')
    if(storage){
        state.bookmarks = JSON.parse(storage)
    }
}


init()

const clearBookmarks = function(){
    localStorage.clear('bookmarks')
}
// clearBookmarks()

export const uploadRecipe = async function(newRecipe){
    try {
        // filter the newRecie info to give us just the ingredients that have values, then use map and destructuring to make the quantity unit and description variables from each ingredient
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== "").map(ing => {
             
            const ingArr = ing[1].split(',').map(el => el.trim())
            // check to see if the input was missing any information
        
            if(ingArr.length !== 3) 
            throw new Error(
                "Wrong ingredient format. please use the correct format"
            )
            const [quantity, unit, description] = ingArr
    
    
            return { quantity: quantity ? +quantity : null, unit, description }
        })
        // formating the info so that the API can receive it
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
    
        }
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe)
        
    }catch(err) {
        throw err
    }
   
}