import View from "./View";
import icons from 'url:../../img/icons.svg'


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination')

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            // in order to make the entire button register the event we use closest(). it looks for parents in the tree unlike querySelector which looks down
            // it will select the appropriate button even if we actually are clicking the span or the icon in the button markup
            const btn = e.target.closest('.btn--inline')
            if(!btn) return
            const gotoPage = +btn.dataset.goto
            handler(gotoPage)
        })
    }

    _generateMarkup() {
        // this._data is the search object from the state in this instance
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)
        const currentPage = this._data.page

        const prevButtonMarkup = `
            <button data-goto="${currentPage -1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage -1}</span>
            </button>`

        const nextButtonMarkup = `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
        
        // page 1 and  there are other pages
        if(currentPage === 1 && numPages > 1) {
            return nextButtonMarkup
        }
        // last page
        if(currentPage === numPages && numPages > 1){
            return prevButtonMarkup
        }
        // some other page
        if(currentPage < numPages){
            return `
            ${nextButtonMarkup}
            ${prevButtonMarkup}
            `
           
        }
        // page 1 and no other pages
        return ""
    }
    
}

export default new PaginationView()