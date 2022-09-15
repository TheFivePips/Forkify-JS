// application logic


import 'core-js/stable'
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';


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
    // 1. loading recipe
      // this doesnt return anything, it only manipulates the state, so it doesnt need to be assigned to a variable
    await model.loadRecipe(id)
    // 2. render recipe
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

const init = function(){
  // use Pub/Sub so we can listen for events in the view(UI logic), but handle the event in the controller(application logic) without importing or exporting anything and keeping them totally seperate
  recipeView.addHandlerRender(controlRecipies)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  
}
init()