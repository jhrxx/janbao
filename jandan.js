let page = 0;
let loading = false;
let gallery;
let store = {};
const btn = `<a id="gallery_btn">🖼️开启传送门</a>`;
const driver = new Driver({
  doneBtnText: "完成", // Text on the final button
  closeBtnText: "关闭", // Text on the close button for this step
  stageBackground: "#eee", // Background color for the staged behind highlighted element
  nextBtnText: "下一个", // Next button text for this step
  prevBtnText: "上一个"
});

const initImageList = wrapper => {
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

  console.table(items);
  console.log("set page data:", page);
  store[page] = items;
  console.log("store :", store);
};

const loadNextPage = async () => {
  const nextPage = page - 1;
  if (!loading && !store[nextPage]) {
    loading = true;
    console.log(`load http://jandan.net/pic/page-${nextPage}`);
    const resp = await fetch(`http://jandan.net/pic/page-${nextPage}`);
    console.log("resp :", resp);
    const html = await resp.text();
    console.log("html :", html);
    page -= 1;
    const dom = parseHTML(html);
    if (dom.wrapper) {
      initImageList(dom.wrapper);
      updateGallery();
    }
    loading = false;
  }
};

const initGalleryBtn = () => {
  if (document.querySelector("#gallery_btn")) {
    return;
  }
  const btnContainer = document.querySelector(".comments");
  prepend(btnContainer, btn);

  // bind event
  btnContainer.querySelector("#gallery_btn").addEventListener("click", () => {
    gallery && gallery.show();
  });
};

const initGallery = () => {
  let tmplEl = document.getElementById("imagesTmpl");
  const options = {
    backdrop: false,
    transition: false,
    loop: false
  };

  if (!tmplEl) {
    const tmpl = `
      <ul id="imagesTmpl">
      ${store[page]
        .map(
          image =>
            `<li><img src="${image.src}" alt="${image.auther} @ ${
              image.time
            }" /></li>`
        )
        .join("")}
      </ul>
    `;
    append(document.body, tmpl);
    tmplEl = document.getElementById("imagesTmpl");
  }

  tmplEl.addEventListener(
    'error',
    windowErrorCb,
    {
      capture: true
    },
    true
  )


function windowErrorCb(event) {
  let target = event.target
  let isImg = target.tagName.toLowerCase() === 'img'
  if (isImg) {
    console.log('image log error', target);
    return
  }
}
  

  // tmplEl.addEventListener("viewed", () => {
  //   console.log("viewed");
  //   if (gallery.index > gallery.length - 10) {
  //     console.log("need to load next page");
  //     loadNextPage();
  //   }
  // });

  // gallery = new Viewer(tmplEl, options);
};

const updateGallery = () => {
  console.log("updateGallery :", store[page]);
  const tmplEl = document.getElementById("imagesTmpl");
  const tmpl = `${store[page]
    .map(
      image =>
        `<li><img src="${image.src}" alt="${image.auther} @ ${
          image.time
        }" /></li>`
    )
    .join("")}`;
  append(tmplEl, tmpl);
  let len = document.querySelectorAll("#imagesTmpl li").length;
  console.log("length :", len);
  gallery.update();
};

const renderGallery = () => {
  if (!gallery) {
    initGallery();
  } else {
    console.log("gallery inited!");
  }
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

ready(() => {
  const flag = localStorage.getItem("help-wizard");
  const isPicPage = location.pathname.indexOf("/pic") === 0;

  if (isPicPage) {
    initGalleryBtn();
    const wrapper = document.querySelector("#wrapper");

    // get current page
    if (location.pathname === "/pic") {
      const wrapper = document.querySelector("#wrapper");
      page = wrapper
        .querySelector(".cp-pagenavi span")
        .textContent.replace(/\[|\]/gi, "");
    } else {
      page = location.pathname.replace("/pic/page-", "");
    }
    page = parseInt(page, 10);

    setTimeout(() => {
      initImageList(wrapper);
      renderGallery();

      helpWizard(!flag);
    }, 0);
  }
});
