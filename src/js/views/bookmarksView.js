
import View from "./View";
import previewView from "./previewView";


class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list')
    _errorMessage = 'No bookmarks yet. Find a nice recipe and book mark it'
    _message = ""
    

    _generateMarkup(){
        // render set to false will allow us to simply return the markup that would otherwise not be returned
       return this._data.map(bookmark => previewView.render(bookmark, false)).join('') 
    }
   
   
}

export default new BookmarksView()