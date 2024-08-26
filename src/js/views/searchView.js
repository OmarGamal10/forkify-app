class searchView {
  _parentElement = document.querySelector('.search');
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
  getQuery() {
    const ret = this._parentElement.querySelector('.search__field').value;
    this._clearField();
    return ret;
  }
  _clearField() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}
export default new searchView();
