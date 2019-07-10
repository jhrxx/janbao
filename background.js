const filter = {
    url:
    [
      {hostContains: "janbao.net"},
    ]
  }
  
browser.webNavigation.onDOMContentLoaded.addListener(function (details) {
    console.log('onDOMContentLoaded :', details.url);
}, filter)
console.log("background.js")