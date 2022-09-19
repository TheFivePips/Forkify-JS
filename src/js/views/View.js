// this will only be used as a parent class for the rest of the views. there will be no instances of this class as it will only provide common methods and values for the other views

import icons from 'url:../../img/icons.svg'




export default class View {
    _data

    /**
     * Render the recieved obj to the DOM
     * @param {Object | Object[]} data the data to be rendered (e.g recipe)
     * @param {boolean } [render = true] if false, create markup string instead of rendering to the DOM 
     * @returns {undefined | string} a markup string is returned if render is false
     * @this {Object} View instance
     * @author Sam Gardner
     * @todo finish implementation
     */
    render(data, render = true) {
        // check if there is any data or if there is data but it is empty
        if (!data || (Array.isArray(data) && data.length === 0))
        return this.renderError();
        this._data = data
        const markup = this._generateMarkup()

        if(!render) return markup
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    // create new markup based on the new serving and compare with the old markup, then only render the changes
    update(data){
        this._data = data
        // this is just a string at this point so we need to convert it to a DOM object that lives in the memory(a virtual dom) and then we can compare it
        const newMarkup = this._generateMarkup()
        // The Range interface represents a fragment of a document that can contain nodes and parts of text nodes.createContextualFragment takes text and tags to be converted to a document fragment
        const newDOM = document.createRange().createContextualFragment(newMarkup)
        // use Array.from to convert these nodelists into an array we can use
        const newElements = Array.from(newDOM.querySelectorAll('*'))
        const currElements = Array.from(this._parentElement.querySelectorAll('*'))
        
        
        // loop over both arrays and make the new element the current element
        newElements.forEach((newEl, i) => {
            const currEl = currElements[i]
            // update text of all the changed elements
            if (
                // compare nodes with isEqualNode. if they are different AND ...
                !newEl.isEqualNode(currEl) && 
                // It also needs to contain actual text so we check if it is different from an empty string
                // if the first child of the node isnt text(found in nodeValue), then its not a node we want to change
                // Any whitespace will create a #text node(when using firstChild), from a single space to multiple spaces, returns, tabs, and so on, so we use trim()
                newEl.firstChild?.nodeValue.trim() !== ""
            ){
                currEl.textContent = newEl.textContent
            }
            // update attribues of all the changed elements
            if(!newEl.isEqualNode(currEl)){
                Array.from(newEl.attributes).forEach(attr => {
                    currEl.setAttribute(attr.name, attr.value)
                })
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = ''
    }

    renderSpinner() {
        const markup =`
        <div class="spinner">
          <svg>
            <use href="${icons}.svg#icon-loader"></use>
          </svg>
        </div>`
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(message = this._errorMessage){
        const markup =`
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderMessage(message = this._message){
        const markup =`
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

}