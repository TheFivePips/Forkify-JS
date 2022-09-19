import View from "./View";
import icons from 'url:../../img/icons.svg'


class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload')
    _message = "Recipe was succesfully uploaded"
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor(){
        super()
        this._addHandlerShowWindow()
        this._addHandlerHideWindow()
    }

    // all this does is show a hidden form element so we dont need to go through the controller to make any changes
    // the this keyword in a handler fucntion points to the element on which the listener is attached to, and when a function is used as a callback, the this keyword is lost.
    toggelWindow(){
        this._overlay.classList.toggle('hidden')
        this._window.classList.toggle('hidden')
    }
    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggelWindow.bind(this))
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggelWindow.bind(this))
        this._overlay.addEventListener('click', this.toggelWindow.bind(this))


    }
    // this listener WIll need to send data to the model, through the controler
    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault()
            // this refers to the parent element in this case
            // this will give us an array, containing more arrays of each individual form input-field name, and its value
            const dataArray = [...new FormData(this)]
            // fromEntries takes and array of entries and converts it to an object
            const data = Object.fromEntries(dataArray)
            handler(data)

        })
    }
   
    _generateMarkup() {
        
    }
    
}

export default new AddRecipeView()