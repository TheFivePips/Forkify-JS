// this will only be used as a parent class for the rest of the views. there will be no instances of this class as it will only provide common methods and values for the other views

import icons from 'url:../../img/icons.svg'




export default class View {
    _data
    render(data) {
        // check if there is any data or if there is data but it is empty
        if (!data || (Array.isArray(data) && data.length === 0))
        return this.renderError();
        this._data = data
        const markup = this._generateMarkup()
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
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