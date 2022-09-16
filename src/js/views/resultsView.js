import View from "./View";
import previewView from "./previewView";


class ResultsView extends View {
    _parentElement = document.querySelector('.results')
    _errorMessage = 'No recipes found for that query. Please try again'
    _message = ""
    
    _generateMarkup(){
        // render set to false will allow us to simply return the markup that would otherwise not be returned
       return this._data.map(result => previewView.render(result, false)).join('') 
    }
   
}

export default new ResultsView()