let page = 0;
let gallery;
let store = {};

const getImages = wrapper => {
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

  // console.table(list);
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
  store[page] = items;
  // return list;
};

const post = () => {
  let data = { comment_id: 4298602, like_type: "pos", data_type: "comment" },
    url = "http://jandan.net/jandan-vote.php";
};

prefetch = images => {
  appendLink = href => {
    let link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  };
  images.forEach(image => {
    image.src.forEach(url => {
      appendLink(url);
    });
  });
};

const loadNextPage = async () => {
  const resp = await fetch("http://jandan.net/pic/page-" + (page + 1));
  const html = await resp.text();
  const dom = parseHTML(html);
  if (dom.wrapper) {
    const images = getImages(dom.wrapper);
    prefetch(images);
  }
  page += 1;
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
          image => `<li><img src="${image.src}" alt="${image.auther} @ ${image.time}" /></li>`
        )
        .join("")}
      </ul>
    `;
    append(document.body, tmpl);
    tmplEl = document.getElementById("imagesTmpl");
  }

  tmplEl.addEventListener('viewed',  (event)=> {
    console.log('gallery :', gallery);
    console.log('detail :', event.detail);
    console.log('index :', event.detail.index);
  });

  tmplEl.addEventListener('viewed',  (event)=> {
    console.log('event :', event);
  });

  
  gallery = new Viewer(tmplEl,options);
  // console.log("gallery :", gallery);

  gallery.show();
};

const renderGallery = () => {
  if (!gallery) {
    initGallery();
  } else {
    console.log("gallery inited!");
  }
};

ready(() => {
  const isPicPage = location.pathname.indexOf("/pic") === 0;

  if (isPicPage) {
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
    // console.log("current page :", page);

    getImages(wrapper);
    renderGallery();
  }
});
