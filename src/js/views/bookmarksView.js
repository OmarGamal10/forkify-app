import PreviewView from './previewViews';
class BookmarksView extends PreviewView {
  _data;
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = `Could not find your query`;
}
export default new BookmarksView();
