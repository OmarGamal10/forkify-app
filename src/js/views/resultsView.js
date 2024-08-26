import PreviewView from './previewViews';
class ResultsView extends PreviewView {
  _data;
  _parentElement = document.querySelector('.results');
  _errorMessage = `Could not find your query`;
}
export default new ResultsView();
