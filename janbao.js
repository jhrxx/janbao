const json = {
  emotion: [
    {
      id: "froze",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql5s220qg.gif",
      label: "呆"
    },
    {
      id: "cry",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql3wxiklg.gif",
      label: "哭"
    },
    {
      id: "askance",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql4b2mm6g.gif",
      label: "斜眼"
    },
    {
      id: "laugh",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql5ln0syg.gif",
      label: "乐"
    },
    {
      id: "bored",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql303a5lg.gif",
      label: "无聊"
    },
    {
      id: "shame",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql5yfdajg.gif",
      label: "羞"
    },
    {
      id: "shock",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql6be66kg.gif",
      label: "惊"
    },
    {
      id: "anger",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql6hno0wg.gif",
      label: "怒"
    },
    {
      id: "laughter",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql6sgfk8g.gif",
      label: "狂笑"
    },
    {
      id: "sleepy",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql6yohg1g.gif",
      label: "困"
    },
    {
      id: "embarrassed",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql3jhhdrg.gif",
      label: "囧"
    },
    {
      id: "sleep",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql65bwcsg.gif",
      label: "睡"
    },
    {
      id: "helpless",
      url: "http://ww2.sinaimg.cn/thumbnail/66f2fc65gw1dvql42wzdrg.gif",
      label: "无奈"
    }
  ],
  frame: [
    {
      id: "bold",
      label: "加粗",
      class: "bold"
    },
    {
      id: "italic",
      label: "斜体",
      class: "italic"
    },
    {
      id: "strike",
      label: "删除线",
      class: "strikethrough"
    },
    {
      id: "quote",
      label: "引用",
      class: "blockquote"
    },
    {
      id: "orderedlist",
      label: "有序列表",
      class: "insertorderedlist"
    },
    {
      id: "unorderedlist",
      label: "无序列表",
      class: "insertunorderedlist"
    },
    {
      id: "listitem",
      label: "列表项",
      class: "listitem"
    },
    {
      id: "horizontal",
      label: "分隔线",
      class: "horizontal"
    },
    {
      id: "selectall",
      label: "全选",
      class: "selectall"
    },
    {
      id: "cleardoc",
      label: "清空",
      class: "cleardoc"
    }
  ]
};

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

function prepend(el, html) {
  if (el) {
    el.insertAdjacentHTML("afterbegin", html);
  }
}
function append(el, html) {
  if (el) {
    el.insertAdjacentHTML("beforeend", html);
  }
}

function getCursorPosition(el) {
  let rangeData = { text: "", start: 0, end: 0 };
  el.focus();
  rangeData.start = el.selectionStart;
  rangeData.end = el.selectionEnd;
  rangeData.text =
    rangeData.start != rangeData.end
      ? el.value.substring(rangeData.start, rangeData.end)
      : "";
  return rangeData;
}

function warpElement(textarea, label) {
  let el = textarea,
    p = getCursorPosition(el),
    text = p.text.trim(),
    openingTag = "<" + label + ">";
  closingTag = "</" + label + ">";
  if (p.start === p.end || text === "") {
    el.value =
      el.value.substring(0, p.start) +
      openingTag +
      closingTag +
      el.value.substring(p.end, el.value.length);
    el.selectionStart = p.start + openingTag.length;
    el.selectionEnd = p.start + openingTag.length;
  } else {
    if (text.split("\n").length > 1) {
      if (label === "ol" || label === "ul") {
        let itemOpeningTag = "   <li>",
          itemClosingTag = "</li>";
        text =
          "    \n" +
          itemOpeningTag +
          text.replace(/\n/g, itemClosingTag + "\n" + itemOpeningTag) +
          itemClosingTag +
          "\n";
      } else {
        text = text.replace(/\n/g, closingTag + "\n" + openingTag);
      }
    }
    el.value =
      el.value.substring(0, p.start) +
      openingTag +
      text +
      closingTag +
      el.value.substring(p.end, el.value.length);
  }
}

function generateEmotions() {
  return json.frame
    .map((value, index) => {
      return `<li id="${
        value.id
      }" class="jdedit-button-wrap jdedit-button-${index}" title="${
        value.label
      }">
            <div class="jdedit-button jdedit-icon jdedit-icon-${
              value.class
            }"></div></li>`;
    })
    .join("");
}

function enhanceComment() {
  const textarea = document.getElementById("Form_Body");
  const toolbar = document.getElementById("jdedit_toolbar");
  if (textarea && !toolbar) {
    const textareaWrapper = textarea.parentNode;
    const emotions = generateEmotions();
    // prepend toolbar
    prepend(
      textareaWrapper,
      `<ul id="jdedit_toolbar" class="jdedit-toolbar">${emotions}</ul>`
    );

    // bind events
    document.querySelectorAll(".jdedit-button-wrap").forEach(el => {
      el.addEventListener("click", () => {
        switch (el.id) {
          case "bold":
            warpElement(textarea, "b");
            break;
          case "italic":
            warpElement(textarea, "em");
            break;
          case "strike":
            warpElement(textarea, "s");
            break;
          case "quote":
            warpElement(textarea, "blockquote");
            break;
          case "orderedlist":
            warpElement(textarea, "ol");
            break;
          case "unorderedlist":
            warpElement(textarea, "ul");
            break;
          case "listitem":
            warpElement(textarea, "li");
            break;
          case "horizontal":
            insertAtCaret(textarea, "\n<hr/>\n");
            break;
          case "selectall":
            textarea.focus();
            textarea.selectionStart = 0;
            textarea.selectionEnd = textarea.value.length;
            break;
          case "cleardoc":
            textarea.value = "";
            break;
        }
      });
    });
  }
}

function addSearchBox() {
  const panel = document.getElementById("Panel");
  const box = document.getElementById("SearchBox");
  const searchBox = `<div class="Box" id="SearchBox"><h4>搜索：</h4><form method="get" action="/search">
                      <input type="text" id="Form_Search" name="Search" value="" placeholder="按 Enter 搜索" class="InputBox">
                    </form></div>`;
  if (panel && !box) {
    append(panel, searchBox);
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
    const nav = document.querySelectorAll("#Head .Row")[0];
    const themeCtrl =
      '<ul id="theme" class="SiteMenu"><li><a data-theme="default">原版</a></li><li><a data-theme="dark">夜间</a></li></ul>';
    append(nav, themeCtrl);
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
  enhanceComment();
});
