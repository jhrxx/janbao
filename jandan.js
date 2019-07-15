console.log("jandan");
let gallery;
let cfg = {};

const tmpl = `<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">

            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>

                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                <button class="pswp__button pswp__button--share" title="Share"></button>

                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div> 
            </div>

            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>

            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>

        </div>
    </div>
</div>`;

const ready = fn => {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

const append = (el, html) => {
  if (el) {
    el.insertAdjacentHTML("beforeend", html);
  }
};

const parseHTML = string => {
  const context = document.implementation.createHTMLDocument();

  // Set the base href for the created document so any parsed elements with URLs
  // are based on the document's URL
  const base = context.createElement("base");
  base.href = document.location.href;
  context.head.appendChild(base);

  context.body.innerHTML = string;
  return context.body.children;
};

const getImages = wrapper => {
  console.log("wrapper :", wrapper);
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
      const contents = item.querySelector(".text p").textContent;
      const text = contents
        .replace(/PLAY/gi, "")
        .split("[查看原图]")
        .join("");

      const NSFW = contents.includes("因不受欢迎已被超载鸡自动隐藏. ");
      if (!NSFW) {
        list.push({
          id,
          auther,
          uuid,
          time,
          text,
          src
        });
      }
    }
  });
  // console.table(list);
  return list;
};

const initGallery = images => {
  append(document.body, tmpl);
  const pswpElement = document.querySelectorAll(".pswp")[0];
  if (pswpElement) {
    let items = [];
    images.forEach(image => {
      image.src.forEach((item) => {
        items.push({
          src: item,
          w: 0,
          h: 0,
          title: image.text
        });
      });
    });
    console.table(items);
    // define options (if needed)
    var options = {
      // optionName: 'option value'
      // for example:
      index: 0, // start at first slide
      loop: false, // Loop slides when using swipe gesture.
      closeOnScroll: false, // Close gallery on page scroll.
      shareEl: false,
      counterEl: false
    };
    // Initializes and opens PhotoSwipe
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen("imageLoadComplete", function(index, item) {
      console.log(item);
      // var img = item.container.children[0];
      if (item.h < 1 || item.w < 1) {
        let img = new Image();
        img.onload = () => {
          item.w = img.width;
          item.h = img.height;
          gallery.invalidateCurrItems();
          gallery.updateSize(true);
        };
        img.src = item.src;
      }
    });
    gallery.init();
  }
};

const renderGallery = images => {
  if (images.length > 0) {
    if (!gallery) {
      initGallery(images);
    } else {
      console.log("no images");
    }
  }
};

const post = () => {
  let data = { comment_id: 4298602, like_type: "pos", data_type: "comment" },
    url = "http://jandan.net/jandan-vote.php";
};

const loadNextPage = async () => {
  const resp = await fetch("http://jandan.net/pic/page-109#comments");
  const html = await resp.text();
  const dom = parseHTML(html);
  if (dom.wrapper) {
    getImages(dom.wrapper);
  }
};

ready(() => {
  console.log("on loaded");
  const hasImages = location.pathname.includes("pic");
  //
  if (hasImages) {
    const wrapper = document.querySelector("#wrapper");
    const images = getImages(wrapper);
    renderGallery(images);
  }
  // .then(resp => {
  //   resp
  //     .text()
  //     .then(data => {
  //       console.log("daat :", data);
  //       parseHTML(data)
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     })
  //     .finally(object => {
  //       console.log("object :", object);
  //     });
  // })
  // .catch(error => {
  //   console.error(error);
  // })
  // .finally(object => {
  //   console.log("object :", object);
  // });
});
