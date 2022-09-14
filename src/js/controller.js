// application logic


import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js'

const recipeContainer = document.querySelector('.recipe');





// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipies = async function(){
  try{
    const id = window.location.hash.slice(1)
    if(!id) return
    recipeView.renderSpinner()
    // 1. loading recipe
    await model.loadRecipe(id)
    // 2. render recipe
    recipeView.render(model.state.recipe)
  }catch(e){
    console.log(e)
  } 
}

const init = function(){
  // use Pub/Sub so we can listen for events in the view(UI logic), but handle the event in the controller(application logic) without importing or exporting anything and keeping them totally seperate
  recipeView.addHandlerRender(controlRecipies)
}
init()