console.log("jandan");
function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(() => {
  console.log("loaded");
  fetch("http://jandan.net/pic/page-109#comments")
    .then(resp => {
      resp
        .text()
        .then(data => {
          console.log("daat :", data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(object => {
          console.log("object :", object);
        });
    })
    .catch(error => {
      console.error(error);
    })
    .finally(object => {
      console.log("object :", object);
    });
});
