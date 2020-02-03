let onClickHandler = function (e) {
  e.preventDefault();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "start"});
  });
};

let offClickHandler = function (e) {
  e.preventDefault();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stop"});
  });
};

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#btn-on').addEventListener('click', onClickHandler);
  document.querySelector('#btn-off').addEventListener('click', offClickHandler);
});
