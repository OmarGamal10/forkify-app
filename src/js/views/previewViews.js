import View from './View';
import icons from '../../img/icons.svg';
export default class PreviewView extends View {
  _data;
  _parentElement = document.querySelector('.results');
  _errorMessage = `Could not find your query`;
  _generateMarkup() {
    return this._generateMarkupResults();
  }
  _generateMarkupResults() {
    const id = window.location.hash.slice(1);
    const ret = this._data
      .map(
        result => `
        <li class="preview">
            <a class="preview__link ${
              id === result.id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.imageUrl}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
        `
      )
      .join('');
    return ret;
  }
}
