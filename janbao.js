const json = {
  emotion: [
    {
      id: "froze",
      url: "https://s2.ax1x.com/2019/07/12/ZRv0qU.gif",
      label: "呆"
    },
    {
      id: "cry",
      url: "https://s2.ax1x.com/2019/07/12/ZRvUx0.gif",
      label: "哭"
    },
    {
      id: "askance",
      url: "https://s2.ax1x.com/2019/07/12/ZRvsIJ.gif",
      label: "斜眼"
    },
    {
      id: "laugh",
      url: "https://s2.ax1x.com/2019/07/12/ZRvtGn.gif",
      label: "乐"
    },
    {
      id: "bored",
      url: "https://s2.ax1x.com/2019/07/12/ZRvYPs.gif",
      label: "无聊"
    },
    {
      id: "shame",
      url: "https://s2.ax1x.com/2019/07/12/ZRvdMV.gif",
      label: "羞"
    },
    {
      id: "shock",
      url: "https://s2.ax1x.com/2019/07/12/ZRvDZF.gif",
      label: "惊"
    },
    {
      id: "anger",
      url: "https://s2.ax1x.com/2019/07/12/ZRvwrT.gif",
      label: "怒"
    },
    {
      id: "laughter",
      url: "https://s2.ax1x.com/2019/07/12/ZRv2xx.gif",
      label: "狂笑"
    },
    {
      id: "sleepy",
      url: "https://s2.ax1x.com/2019/07/12/ZRvra4.gif",
      label: "困"
    },
    {
      id: "embarrassed",
      url: "https://s2.ax1x.com/2019/07/12/ZRv6i9.gif",
      label: "囧"
    },
    {
      id: "sleep",
      url: "https://s2.ax1x.com/2019/07/12/ZRvcGR.gif",
      label: "睡"
    },
    {
      id: "helpless",
      url: "https://s2.ax1x.com/2019/07/12/ZRvgR1.gif",
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
    openingTag = "<" + label + ">",
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
function insertAtCaret(el, text) {
  if (el.selectionStart || el.selectionStart === "0") {
    const startPos = el.selectionStart;
    const endPos = el.selectionEnd;
    const scrollTop = el.scrollTop;
    el.value =
      el.value.substring(0, startPos) +
      text +
      el.value.substring(endPos, el.value.length);
    el.focus();
    el.selectionStart = startPos + text.length;
    el.selectionEnd = startPos + text.length;
    el.scrollTop = scrollTop;
  } else {
    el.value += text;
    el.focus();
  }
}

function generateTools() {
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

function generateEmotions() {
  return json.emotion
    .map(value => {
      return `<li id="${value.id}" class="jdedit-button-wrap jdedit-button-${
        value.id
      }" title="${value.label}">
            <div class="jdedit-button jdedit-icon jdedit-icon-${
              value.id
            }"><img src="${value.url}" title="${value.label}"></div></li>`;
    })
    .join("");
}

function prependToolbar(textarea) {
  const tools = generateTools();

  prepend(
    textarea.parentNode,
    `<ul id="jdedit_toolbar" class="jdedit-toolbar">${tools}</ul>`
  );

  // bind events
  document
    .querySelectorAll("#jdedit_toolbar .jdedit-button-wrap")
    .forEach(el => {
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

function appendEmotionbar(textarea) {
  const emotions = generateEmotions();

  append(
    textarea.parentNode,
    `<ul id="jdedit_emotionbar" class="jdedit-toolbar">${emotions}</ul>`
  );

  document
    .querySelectorAll("#jdedit_emotionbar .jdedit-button-wrap")
    .forEach(el => {
      el.addEventListener("click", () => {
        const img = el.children[0].children[0];
        const { src, title } = img;
        insertAtCaret(textarea, `<img src="${src}" title="${title}" />`);
      });
    });
}

function enhanceComment() {
  const textarea = document.getElementById("Form_Body");
  const toolbar = document.getElementById("jdedit_toolbar");
  const emotionbar = document.getElementById("jdedit_emotionbar");
  if (textarea) {
    if (!toolbar) {
      prependToolbar(textarea);
    }
    if (!emotionbar) {
      appendEmotionbar(textarea);
    }
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

  document.addEventListener("visibilitychange", state => {
    if (document.visibilityState === "visible") {
      const theme = localStorage.getItem("theme");
      if (html.className !== theme) {
        html.className = theme;
      }
    }
  });
}
function helpWizard(flag) {
  if (flag) {
    const driver = new Driver({
      doneBtnText: "完成", // Text on the final button
      closeBtnText: "关闭", // Text on the close button for this step
      stageBackground: "#eee", // Background color for the staged behind highlighted element
      nextBtnText: "下一个", // Next button text for this step
      prevBtnText: "上一个"
    });
    driver.defineSteps([
      {
        element: "#theme",
        popover: {
          title: "点击 “夜间” 以切换模式",
          description: "夜间模式可以保护眼睛"
        }
      },
      {
        element: "#SearchBox",
        popover: {
          title: "加入搜索框",
          description: "失踪搜索框回归"
        }
      },
      {
        element: ".Item.ItemDiscussion",
        popover: {
          title: "进入话题",
          description: "查看回复框"
        }
      }
    ]);
    setTimeout(() => {
      driver.start();
    }, 1500);
  }
}

ready(() => {
  const flag = localStorage.getItem("theme");
  bindUserStyle();
  addSearchBox();
  enhanceComment();
  helpWizard(!flag);
});
