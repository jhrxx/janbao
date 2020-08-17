let imageContainer;
let prevPage;
let gallery;
let store = {
  ooxx: {},
  pic: {},
  zoo: {}
};
let loading = true;

const isHideNSFW = getCookie('nsfw-click-load') !== 'off'
const isHideDislike = getCookie('bad-click-load') !== 'off'
const page = location.pathname.split('/')[1]
const isPicPage = page === 'pic';
const isZooPage = page === 'zoo';
const isOOXXPage = page === 'ooxx';
const isGalleryPage = isPicPage || isZooPage || isOOXXPage;
const galleryBtn = `<a id="gallery_btn">🌌 开启传送门</a>`;

// 初始化 viewer 模板， 事件绑定
const initImageContainer = () => {
  if (!imageContainer) {
    append(document.body, '<ul id="images_tmpl"></ul>');
    imageContainer = document.getElementById("images_tmpl");

    // 监听图片加载失败
    imageContainer.addEventListener(
      "error",
      event => {
        let target = event.target;
        let isImg = target.tagName.toLowerCase() === "img";
        if (isImg) {
          target.parentNode.remove();
          gallery.update();
          return;
        }
      },
      {
        capture: true
      },
      true
    );

    // 图片浏览钩子
    imageContainer.addEventListener("viewed", () => {
      const { image, index, images } = gallery;
      const { id, xx, oo, tucao } = images[index].dataset;
      const comment  = store[page][id].comments
      const tuCaoBtn = document.getElementById('tucao_btn');
      const ooBtn = document.getElementById('oo_btn')
      const xxBtn = document.getElementById('xx_btn')
      const commentEl = document.querySelector(".viewer-comment");
      commentEl.innerHTML = comment&&`<p>${comment}</p>`;
      tuCaoBtn.textContent = tucao === '0' ? '💦 暂无吐槽' : `💦 吐槽 (${tucao})`;
      ooBtn.innerHTML = `⭕⭕ [<i>${oo}</i>]`;
      xxBtn.innerHTML = `❌❌ [<i>${xx}</i>]`;
      ooBtn.classList.remove('disabled')
      xxBtn.classList.remove('disabled')
      if (image) {
        const { naturalHeight: height, naturalWidth: width } = image;
        if (height > width * 2.5) {
          gallery.zoomTo(0.8);
          gallery.moveTo(gallery.x, 0);
        }
      }

      // 最后一张图片
      if (gallery.index === gallery.length - 1) {
        fetchPrevPage();
      }
    });
  }
};

// 初始化页面数据
const initComments = (comments) => {
  if (!comments) {
    comments = document.querySelector("#comments")
  }
  prevPage = comments.querySelector('.previous-comment-page')

  storeImageData(comments)
}

// 创建viewer实例  见证奇迹
const initGallery = () => {
  const options = {
    ready() {
      // 2 methods are available here: "show" and "destroy".
      // console.log('gallery is ready');
      // 防止首页加载太少直接闪退
      setTimeout(() => {
        loading = false;
      }, 500);

      initKeyboardHint();
      initTuCao();
      initOOXX();
      initComment();
    },
    backdrop: false,
    transition: false,
    loop: false
  };
  let index = 0;

  if (gallery) {
    index = gallery.index;

    gallery.destroy();
  } else {
    //  创建传送门
    initGalleryBtn()
  }

  gallery = new Viewer(imageContainer, options);

  if (index) {
    // gallery.view(index);
    gallery.update();
    setTimeout(() => {
      gallery.view(index);
    }, 0)
  }
};

// 开启传送门
const initGalleryBtn = () => {
  const btnContainer = document.querySelector(".comments");
  if (!document.querySelector("#gallery_btn")) {
    prepend(btnContainer, galleryBtn);
  }

  // bind event
  btnContainer.querySelector("#gallery_btn").addEventListener("click", () => {
    gallery && gallery.show();
  });
};

// 快捷键提示
const initKeyboardHint = () => {
  const container = document.querySelector(".viewer-container");
  const hint = document.querySelector(".viewer-hint");
  const hintTmpl = `
  <div class="viewer-hint">
    <a tabindex="1">⌨️ 快捷键</a>
    <ul>
      <li><span>Esc</span>: 关闭查看器或停止播放。</li>
      <li><span>Space</span>: 停止播放。</li>
      <li><span>←</span>: 查看上一张图片。</li>
      <li><span>→</span>: 查看下一张图片。</li>
      <li><span>↑</span>: 放大图片。</li>
      <li><span>↓</span>: 缩小图片。</li>
      <li><span>Ctrl + 0</span>: 缩小到初始大小。</li>
      <li><span>Ctrl + 1</span>: 放大到自然尺寸。</li>
    </ul>
  </div>`;

  if (!hint) {
    append(container, hintTmpl);
  }
};

// 构造图片数据
const storeImageData = wrapper => {
  // 当前页面图片数据
  const data = {}
  wrapper.querySelectorAll("ol.commentlist>li").forEach(item => {
    const getNum = className => {
      return item.querySelector(className).textContent.match(/\d+/g)[0];
    };
    if (item.id) {
      const strong = item.querySelector(".author strong");
      const time = item
        .querySelector(".author small a")
        .textContent.replace("@", "");
      const id = item.id.replace("comment-", "");
      const auther = strong.textContent;
      const uuid = strong.title.replace("防伪码：", "");
      const sources = item.querySelectorAll(".view_img_link");
      const src = [...sources].map(item => item.href);
      const comments = item.querySelector(".text p")
        .textContent.replace(/[play|\[查看原图\]|loding...]/gi,'').trim();
      const oo = getNum(".tucao-like-container");
      const xx = getNum(".tucao-unlike-container");
      const tucao = getNum(".tucao-btn");
      const dislikeText = "因不受欢迎已被超载鸡自动隐藏";
      const NSFWText = "NSFW";
      // 翻页无法获取不喜欢数据
      const dislike = (comments.indexOf(dislikeText)>=0 || +xx>+oo ) && isHideDislike;
      const nsfw = comments.indexOf(NSFWText)>=0 && isHideNSFW;
      const isBroken = src.indexOf('default_w_large.gif') > 0 // 渣浪破图
      if (!dislike && !nsfw && !isBroken) {
        data[id] = { auther, uuid, time, comments, src, xx, oo, tucao }
      }
    }
  });
  // 存储数据
  store[page] = Object.assign(store[page], data)

  updateImageContainer(data);
};

// 更新 viewer 模板
const updateImageContainer = (images) => {
  const tmpl = `${Object.keys(images).sort((a, b) => {
    return b - a;
  }).map(key => {
    return images[key].src.map((src) => {
      return `<li><img src="${src}" alt="${images[key].auther} @ ${
        images[key].time
        }" data-id="${key}" data-xx="${
        images[key].xx
        }" data-oo="${images[key].oo}" data-tucao="${
        images[key].tucao
        }" /></li>`
    })
  }).join('')}`;

  append(imageContainer, tmpl);

  initGallery();
};

// 获取下一页数据
const fetchPrevPage = async () => {
  if (!loading && prevPage && prevPage.href) {
    loading = true;
    const resp = await fetch(prevPage.href);
    const html = await resp.text();
    const dom = parseHTML(html);
    if (dom.wrapper) {
      initComments(dom.wrapper);
    }
    loading = false;
  }
};

// 获取吐槽数据
const fetchTuCaoById = async id => {
  // if (!tucao[id]) {
  const resp = await fetch(`jandan.net/tucao/${id}`);
  const text = await resp.text();
  const data = JSON.parse(text);
  console.log("tucao data :", data);
  // tucao[id] = resp
  // }
};

// 吐槽
const initTuCao = () => {
  const container = document.querySelector(".viewer-container");
  const tucaoEl = document.querySelector(".viewer-tucao");
  const tucaoTmpl = `
  <div class="viewer-tucao">
    <a id="tucao_btn">💦 吐槽</a>
    <div class="viewer-sider></div>
  </div>`;

  if (!tucaoEl) {
    append(container, tucaoTmpl);
    document.getElementById("tucao_btn").addEventListener("click", () => {
      const { images, index } = gallery;
      const { id, tucao } = images[index].dataset;
      // if(tucao === '0') {
      window.open(`http://jandan.net/t/${id}`)
      // http://jandan.net/t/4665472
      // } else {
      // fetchTuCaoById(id);
      // }
    });
  }
};

// 图片 ⭕⭕❌❌
const initOOXX = () => {
  const container = document.querySelector(".viewer-container");
  const ooxxEl = document.querySelector(".viewer-xxoo");
  const ooxxTmpl = `
    <div class="viewer-ooxx">
      <a id="oo_btn">⭕⭕</a>
      <a id="xx_btn">❌❌</a>
    </div>`;
  if (!ooxxEl) {
    append(container, ooxxTmpl);
    const ooBtn = document.getElementById('oo_btn')
    const xxBtn = document.getElementById('xx_btn')

    const voteFn = async (e) => {
      if (e.classList && e.classList.contains('disabled')) {
        return
      }
      const { images, index } = gallery;
      const { xx, oo } = images[index].dataset;
      const plus1 = val => {
        return parseInt(val, 10) + 1
      }
      ooBtn.classList.add('disabled')
      xxBtn.classList.add('disabled')
      if (e.id === 'xx_btn') {
        xxBtn.innerHTML = `❌❌ [<i>${plus1(xx)}</i>]`;
      } else {
        ooBtn.innerHTML = `⭕⭕ [<i>${plus1(oo)}</i>]`;
      }

      const { id } = images[index].dataset;
      const type = e.id === 'xx_btn' ? 'neg' : 'pos';
      try {
        const resp = await fetch(`${window.location.origin}/api/comment/vote`, {
          method: 'POST',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: `comment_id=${id}&like_type=${type}&data_type=comment`
        })
        const { error } = await resp.json()
        if (error) {
          if (e.id === 'xx_btn') {
            xxBtn.innerHTML = `❌❌ [<i>${xx}</i>]`;
          } else {
            ooBtn.innerHTML = `⭕⭕ [<i>${oo}</i>]`;
          }
        } else {
          if (e.id === 'xx_btn') {
            images[index].setAttribute("data-xx", plus1(xx))
          } else {
            images[index].setAttribute("data-oo", plus1(oo))
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    ooBtn.addEventListener("click", voteFn);
    xxBtn.addEventListener("click", voteFn);
  }
};

// 文字
const initComment = () => {
  const container = document.querySelector(".viewer-container");
  const commentEl = document.querySelector(".viewer-comment");

  if (!commentEl) {
    append(container, '<div class="viewer-comment"></div>');
  }
}

// 自定义theme
const bindUserStyle = () => {
  const html = document.querySelector("html");
  const theme = localStorage.getItem("theme");

  if (theme) {
    html.classList.add(theme);
  } else {
    localStorage.setItem("theme", "default");
  }


  if (!document.querySelector("#theme")) {
    const nav = document.querySelectorAll("#header .nav-items")[0];
    const themeCtrl =
      `<li id="theme" class="nav-item" style="float:right;">
        <a class="nav-link" data-theme="default">原版</a></li>
        <li id="theme_dark" class="nav-item" style="float:right;">
        <a class="nav-link" data-theme="dark">夜间</a></li>`;
    append(nav, themeCtrl);
  }

  document.querySelectorAll("#header a").forEach(el => {
    el.addEventListener("click", () => {
      const currentTheme = localStorage.getItem("theme");
      const theme = el.getAttribute("data-theme");
      if (theme && currentTheme !== theme) {
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

// 首屏帮助
const helpWizard = () => {
  // 初始化 Driver
  const driver = new Driver({
    doneBtnText: "完成", // Text on the final button
    closeBtnText: "关闭", // Text on the close button for this step
    stageBackground: "#eee", // Background color for the staged behind highlighted element
    nextBtnText: "下一个", // Next button text for this step
    prevBtnText: "上一个"
  });

  // help wizard flag
  const data = localStorage.getItem("help-wizard") || "{}";
  let flag = JSON.parse(data)
  if (!flag.theme) {
    driver.highlight({
      element: "#theme_dark",
      popover: {
        title: "开启夜间护眼模式",
        description: "点击 “夜间” ，“原版” 以切换模式"
      }
    });
    flag.theme = true

    localStorage.setItem("help-wizard", JSON.stringify(flag));
  }
  if (!flag.gallery && document.getElementById('gallery_btn')) {
    driver.highlight({
      element: "#gallery_btn",
      popover: {
        title: "开启图片传送门",
        description: "无需翻页即刻开启快速浏览模式"
      }
    });
    flag.gallery = true

    localStorage.setItem("help-wizard", JSON.stringify(flag));
  }
};


ready(() => {
  bindUserStyle()

  if (isGalleryPage) {
    initImageContainer()

    initComments()
  }

  setTimeout(() => {
    helpWizard();
  }, 1000);
});
