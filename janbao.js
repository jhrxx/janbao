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

function addSearchBox() {
  const panel = document.getElementById('Panel');
  const box = document.getElementById('SearchBox');
  const searchBox = `<div class="Box" id="SearchBox"><h4>搜索：</h4><form method="get" action="/search">
                      <input type="text" id="Form_Search" name="Search" value="" placeholder="按 Enter 搜索" class="InputBox">
                    </form></div>`
  if(panel && !box){
    panel.insertAdjacentHTML('beforeend', searchBox);

  }
}

function bindUserStyle() {
  const html = document.querySelector("html");
  const theme = localStorage.getItem("theme");

  if (theme) {
    html.classList.add(theme);
  } else {
    localStorage.setItem("theme", "default");
  }

  if (!document.querySelector("#theme")) {
    document
      .querySelectorAll("#Head .Row")[0]
      .insertAdjacentHTML(
        "beforeend",
        '<ul id="theme" class="SiteMenu"><li><a data-theme="default">原版</a></li><li><a data-theme="dark">夜间</a></li></ul>'
      );
  }

  document.querySelectorAll("#theme a").forEach(el => {
    el.addEventListener("click", () => {
      const currentTheme = localStorage.getItem("theme");
      const theme = el.getAttribute("data-theme");
      if (currentTheme !== theme) {
        html.classList.remove(currentTheme);
        html.classList.add(theme);
        localStorage.setItem("theme", theme);
      }
    });
  });
}

ready(() => {
  bindUserStyle();
  addSearchBox();
});
