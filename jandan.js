/*
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
var throttle = function(fn, delay, immediate, debounce) {
  var curr = +new Date(), //当前事件
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff, //时间差
    context, //上下文
    args,
    exec = function() {
      last_exec = curr;
      fn.apply(context, args);
    };
  return function() {
    curr = +new Date();
    (context = this),
      (args = arguments),
      (diff = curr - (debounce ? last_call : last_exec) - delay);
    clearTimeout(timer);
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay);
      } else if (diff >= 0) {
        exec();
      }
    } else {
      if (diff >= 0) {
        exec();
      } else if (immediate) {
        timer = setTimeout(exec, -diff);
      }
    }
    last_call = curr;
  };
};

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */

var debounce = function(fn, delay, immediate) {
  return throttle(fn, delay, immediate, true);
};

let page = 0;
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
  console.table(list);
  return list;
};

const initGallery = images => {
  append(document.body, tmpl);
  const pswpElement = document.querySelectorAll(".pswp")[0];
  if (pswpElement) {
    let items = [];
    images.forEach(image => {
      const imgNum = image.src.length;
      const comNum = image.comments.length;
      // for (let i = imgNum; i >= 0; i--) {
      //   image.comments[i];
      // }
      image.src.forEach((item, index) => {
        items.push({
          src: item,
          w: 0,
          h: 0,
          title: image.comments[index]
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
      // preload: [1, 20],
      closeOnScroll: false, // Close gallery on page scroll.
      shareEl: false,
      counterEl: true,
      preloaderEl: true
    };
    // Initializes and opens PhotoSwipe
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen("beforeChange", function(go) {
      // console.log("go :", go);
      // console.log("pswp.getCurrentIndex(); :", gallery.getCurrentIndex());
      // if (go === -1 && gallery.getCurrentIndex() === 1) {
      //   return;
      // }
    });

    const handleLazyLoad = debounce(
      () => {
        console.log("debounce need to load more");
        loadNextPage()
      },
      1000,
      true
    );

    gallery.listen("afterChange", function() {
      let current = gallery.getCurrentIndex();
      let total = gallery.options.getNumItemsFn();
      // console.log('current :', current);
      // console.log('total :', total);
      if (current > total - 5) {
        // console.log("need to load more");
        handleLazyLoad(current, total);
      }
    });
    gallery.listen("imageLoadComplete", function(index, item) {
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
  const resp = await fetch("http://jandan.net/pic/page-"+(page+1));
  const html = await resp.text();
  const dom = parseHTML(html);
  if (dom.wrapper) {
    getImages(dom.wrapper);
  }
  page+=1;
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

  // get current page
  
  const isPicPage = location.pathname.indexOf("/pic") === 0;
  if (isPicPage) {
    if (location.pathname === "/pic") {
      const wrapper = document.querySelector("#wrapper");
      page = wrapper
        .querySelector(".cp-pagenavi span")
        .textContent.replace(/\[|\]/gi, "");
    } else {
      page = location.pathname.replace("/pic/page-", "");
    }
  }

  page = parseInt(page, 10);
  console.log("page :", page);
});
