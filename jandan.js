let imageContainer;
let currentPage;
let gallery;
let store = {};
let loading = false;

const btn = `<a id="gallery_btn">🖼️开启传送门</a>`;
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
          src
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
  // console.log("store :", store);
};

// 获取下一页数据
const loadNextPage = async () => {
  const nextPage = currentPage - 1;
  if (!loading && !store[nextPage]) {
    loading = true;
    console.log(`load http://jandan.net/pic/page-${nextPage}`);
    const resp = await fetch(`http://jandan.net/pic/page-${nextPage}`);
    console.log("resp :", resp);
    const html = await resp.text();
    console.log("html :", html);
    currentPage -= 1;
    const dom = parseHTML(html);
    if (dom.wrapper) {
      storeImageData(dom.wrapper);
    }
    loading = false;
  }
};

// 开启传送门
const initGalleryBtn = () => {
  const btnContainer = document.querySelector(".comments");
  if (!document.querySelector("#gallery_btn")) {
    prepend(btnContainer, btn);
  }

  // bind event
  btnContainer.querySelector("#gallery_btn").addEventListener("click", () => {
    console.log("gallery :", gallery);
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
    
    // ${store[currentPage]
    //   .map(
    //     image =>
    //       `<li><img src="${image.src}" alt="${image.auther} @ ${
    //         image.time
    //       }" /></li>`
    //   )
    //   .join("")}
    append(document.body, tmpl);
    
    imageContainer = document.getElementById("imagesTmpl");

    // 监听图片加载失败
    imageContainer.addEventListener(
      "error",
      event => {
        let target = event.target;
        let isImg = target.tagName.toLowerCase() === "img";
        if (isImg) {
          target.remove();
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
      if (gallery.index > gallery.length - 10) {
        // console.log("need to load next page");
        loadNextPage();
      }
    });
  }
};

// 创建viewer实例  见证奇迹
const initGallery = () => {
  console.log('initGallery');
  const options = {
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
  
  if(index) {
    gallery.view(index)
    gallery.update() 
  }
};

// 更新 viewer 模板
const updateImageContainer = () => {
  const tmpl = `${store[currentPage]
    .map(
      image =>
        `<li><img src="${image.src}" alt="${image.auther} @ ${
          image.time
        }" /></li>`
    )
    .join("")}`;
  append(imageContainer, tmpl);
  
  initGallery();
  // let len = document.querySelectorAll("#imagesTmpl li").length;
  // console.log("length :", len);
  // gallery.update();
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
    }, 20);
  }
});
