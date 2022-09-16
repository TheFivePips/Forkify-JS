// application logic. all of these functions are actually event handlers but are called controllers due to the MVC pattern


import 'core-js/stable'
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';


const recipeContainer = document.querySelector('.recipe');


// Hot module reloading from parcel
// if(module.hot){
//   module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipies = async function(){
  try{
    const id = window.location.hash.slice(1)
    if(!id) return
    recipeView.renderSpinner()
    // 0. update resultsview to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    // 1.update bookmarks view
    bookmarksView.update(model.state.bookmarks)

    // 2. loading recipe
      // this doesnt return anything, it only manipulates the state, so it doesnt need to be assigned to a variable
    await model.loadRecipe(id)
    // 3. render recipe
    recipeView.render(model.state.recipe)

  }catch(err){
    
    recipeView.renderError()
  } 
}


const controlSearchResults = async function(){
  try {
    resultsView.renderSpinner()
    // 1.get search query
    const query = searchView.getQuery()
    if(!query) return 
    // 2. load search results
    // this doesnt return anything, it only manipulates the state, so it doesnt need to be assigned to a variable
    await model.loadSearchResults(query)
    // 3.render results
    resultsView.render(model.getSearchResultsPage())
    // 4. render paginiation buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function(gotoPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(gotoPage))
  // render new pagination buttons
  paginationView.render(model.state.search)

}

const controlServings = function(newServings){
  // update the recipe servings number in the state
  model.updateServings(newServings)
  // update the recipeview with the new state data
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)

}

const controlAddBookmark = function() {
  // if the recipe is not yet bookmarked
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  // otherwise it is already bookmarked
  else model.deleteBookmark(model.state.recipe.id)

  // eitherway, update the view
  recipeView.update(model.state.recipe)
  // render the bookmarks view
  bookmarksView.render(model.state.bookmarks)

  }

const init = function(){
  // use Pub/Sub so we can listen for events in the view(UI logic), but handle the event in the controller(application logic) without importing or exporting anything and keeping them totally seperate
  recipeView.addHandlerRender(controlRecipies)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)

  
}
init()