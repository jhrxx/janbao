let imageContainer;
let currentPage;
let gallery;
let store = {};
// let tocao = {};
let loading = true;

const btn = `<a id="gallery_btn">🖼️ 开启传送门</a>`;

// 初始化 Driver
const driver = new Driver({
  doneBtnText: "完成", // Text on the final button
  closeBtnText: "关闭", // Text on the close button for this step
  stageBackground: "#eee", // Background color for the staged behind highlighted element
  nextBtnText: "下一个", // Next button text for this step
  prevBtnText: "上一个"
});

// 构造图片数据
const storeImageData = wrapper => {
  let list = [];
  wrapper.querySelectorAll("ol.commentlist>li").forEach(item => {
    const getNum = className => {
      return item.querySelector(className).textContent.match(/\d/)[0];
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
      const comments = [...item.querySelectorAll(".text p")]
        .map(p => p.textContent.replace(/PLAY|\/n|/gi, ""))
        .filter(t => !t.includes("[查看原图]"));
      const oo = getNum(".tucao-like-container");
      const xx = getNum(".tucao-unlike-container");
      const tucao = getNum(".tucao-btn");

      // const text = comments
      //   .replace(/PLAY/gi, "")
      //   .split("[查看原图]")
      //   .join("");
      const dislikeText = "因不受欢迎已被超载鸡自动隐藏.  [手贱一回]";
      const NSFWText = "NSFW";
      const dislike = comments.includes(dislikeText);
      // const NSFW = comments.includes(NSFWText);
      if (!dislike) {
        list.push({
          id,
          auther,
          uuid,
          time,
          comments,
          src,
          xx,
          oo,
          tucao
        });
      }
    }
  });

  let items = [];
  list.forEach(image => {
    // const imgNum = image.src.length;
    // const comNum = image.comments.length;

    image.src.forEach((item, index) => {
      const txt = image.comments[index];
      const comments = txt ? txt : "";
      items.push({
        ...image,
        src: item,
        comments
      });
    });
  });

  // console.table(items);
  // console.log("set page data:", page);
  store[currentPage] = items;

  updateImageContainer();
  console.log("store :", store);
};

// 获取下一页数据
const fetchNextPage = async () => {
  const nextPage = currentPage - 1;
  if (!loading && !store[nextPage]) {
    loading = true;
    const resp = await fetch(`http://jandan.net/pic/page-${nextPage}`);
    const html = await resp.text();
    currentPage -= 1;
    const dom = parseHTML(html);
    if (dom.wrapper) {
      storeImageData(dom.wrapper);
    }
    loading = false;
  }
};

// 获取吐槽数据
const fetchToCaoById = async id => {
  // if (!tocao[id]) {
  const resp = await fetch(`http://jandan.net/tucao/${id}`);
  const text = await resp.text();
  const data = JSON.parse(text);
  console.log("data :", data);
  // tocao[id] = resp
  // }
};

// 快捷键提示
const initKeyboardHint = () => {
  const container = document.querySelector(".viewer-container");
  const hint = document.querySelector(".viewer-hint");
  const hintTmpl = `
  <div class="viewer-hint">
    <a tabindex="1">快捷键</a>
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

// 吐槽
const initToCao = () => {
  const container = document.querySelector(".viewer-container");
  const tocaoEl = document.querySelector(".viewer-tocao");
  const tocaoTmpl = `
  <div class="viewer-tocao">
  <a id="tocao_btn">💦 吐槽</a>
    <div class="viewer-sider></div>
  </div>`;

  if (!tocaoEl) {
    append(container, tocaoTmpl);
    document.getElementById("tocao_btn").addEventListener("click", () => {
      const { images, index } = gallery;
      console.log("gallery :", gallery);
      console.log("id :", images[index].dataset["id"]);
      const currentId = images[index].dataset["id"];
      fetchToCaoById(currentId);
    });
  }
};

// 图片 ooxx 
const initOOXX = () => {
  const container = document.querySelector(".viewer-container");
  const tocaoEl = document.querySelector(".viewer-tocao");
  const tocaoTmpl = `
  <div class="viewer-tocao">
  <a id="tocao_btn">💦 吐槽</a>
    <div class="viewer-sider></div>
  </div>`;
};

// 开启传送门
const initGalleryBtn = () => {
  const btnContainer = document.querySelector(".comments");
  if (!document.querySelector("#gallery_btn")) {
    prepend(btnContainer, btn);
  }

  // bind event
  btnContainer.querySelector("#gallery_btn").addEventListener("click", () => {
    gallery && gallery.show();
  });
};

// 初始化 viewer 模板， 事件绑定
const initImageContainer = () => {
  if (!imageContainer) {
    const tmpl = `
      <ul id="imagesTmpl">
      </ul>
    `;

    append(document.body, tmpl);

    imageContainer = document.getElementById("imagesTmpl");

    // 监听图片加载失败
    imageContainer.addEventListener(
      "error",
      event => {
        let target = event.target;
        let isImg = target.tagName.toLowerCase() === "img";
        if (isImg) {
          target.parentNode.remove();
          gallery.update();
          // console.log("image log error", target);
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
      // console.log("viewed");
      // console.log("gallery :", gallery);
      const { image, index, images } = gallery;
      const { xx, oo, tucao } = images[index].dataset;
      console.log("object :", { xx, oo, tucao });
      document.getElementById('tocao_btn').textContent = `💦 吐槽 (${tucao})`;
      if (image) {
        const { naturalHeight: height, naturalWidth: width } = image;
        if (height > width * 2.5) {
          gallery.zoomTo(0.8);
          gallery.moveTo(gallery.x, 0);
        }
      }

      if (gallery.index > gallery.length - 10) {
        // console.log("need to load next page");)
        fetchNextPage();
      }
    });
  }
};

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
      initToCao();
    },
    backdrop: false,
    transition: false,
    loop: false
  };
  let index = 0;

  if (gallery) {
    index = gallery.index;

    gallery.destroy();
  }

  gallery = new Viewer(imageContainer, options);

  if (index) {
    gallery.view(index);
    gallery.update();
  }
};

// 更新 viewer 模板
const updateImageContainer = () => {
  const tmpl = `${store[currentPage]
    .map(
      image =>
        `<li><img src="${image.src}" alt="${image.auther} @ ${
          image.time
        }" data-page="${currentPage}" data-id="${image.id}" data-xx="${
          image.xx
        }" data-oo="${image.oo}" data-tucao="${image.tucao}" /></li>`
    )
    .join("")}`;
  append(imageContainer, tmpl);

  initGallery();
};

const helpWizard = display => {
  if (display) {
    localStorage.setItem("help-wizard", "display");
    driver.highlight({
      element: "#gallery_btn",
      popover: {
        title: "开启图片传送门",
        description: "无需翻页即刻开启快速浏览模式"
      }
    });
  }
};

const getCurrentPage = () => {
  if (currentPage) {
    return currentPage;
  } else {
    let page = 0;
    // get current page
    if (location.pathname === "/pic") {
      // TODO:
      const wrapper = document.querySelector("#wrapper");
      page = wrapper
        .querySelector(".cp-pagenavi span")
        .textContent.replace(/\[|\]/gi, "");
    } else {
      page = location.pathname.replace("/pic/page-", "");
    }
    return parseInt(page, 10);
  }
};

ready(() => {
  // help wizard flag
  const flag = localStorage.getItem("help-wizard");
  // 图片页面 TODO：列表
  const isPicPage = location.pathname.indexOf("/pic") === 0;

  if (isPicPage) {
    const wrapper = document.querySelector("#wrapper");
    currentPage = getCurrentPage();

    //  创建传送门
    initGalleryBtn();

    initImageContainer();

    storeImageData(wrapper);

    setTimeout(() => {
      helpWizard(!flag);

      // gif-click-load
      // nsfw-click-load
      // bad-click-load
      // console.log('nsfw :', getCookie('nsfw-click-load'));
      // console.log('bad :', getCookie('bad-click-load'));
    }, 100);
  }
});
