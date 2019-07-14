console.log("jandan");

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

function parseHTML(string) {
  const context = document.implementation.createHTMLDocument();

  // Set the base href for the created document so any parsed elements with URLs
  // are based on the document's URL
  const base = context.createElement("base");
  base.href = document.location.href;
  context.head.appendChild(base);

  context.body.innerHTML = string;
  return context.body.children;
}

function getImages(wrapper) {
  console.log("wrapper :", wrapper);
  let list = [];
  wrapper.querySelectorAll('ol.commentlist>li').forEach((item)=>{
    console.log('item :', item);
    if(item.id){
      const strong = item.querySelector('.author strong'); 
      const time = item.querySelector('.author small a').textContent.replace('@',''); 
      const id = item.id.replace('comment-','');
      const auther = strong.textContent;
      const uuid = strong.title.replace('防伪码：', '');
      const source = item.querySelector('.view_img_link'); 

      
      list.push({
        id,auther,uuid,time, src: source.href
      })
    }
  })
  console.log('list :', list);
}

post = ()=>{
 let data = {comment_id:	4298602,
like_type:	'pos',
data_type:	'comment'},
url = "http://jandan.net/jandan-vote.php"
}

async function loadNextPage() {
  const resp = await fetch("http://jandan.net/pic/page-109#comments");
  const html = await resp.text();
  const dom = parseHTML(html);
  if (dom.wrapper) {
    getImages(dom.wrapper);
  }
}

ready(() => {
  console.log("on loaded");
  const hasImages = location.pathname.includes("pic");
  //
  if (hasImages) {
    const wrapper = document.querySelector("#wrapper");
    getImages(wrapper);
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
