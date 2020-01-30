var editModeHandler = function (e) {
  e.preventDefault();
  chrome.tabs.executeScript({
    file: 'js/editmode.js'
  });
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#edit-mode').addEventListener('click', editModeHandler);
});
