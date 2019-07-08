console.log("janbao");

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

// function addSearchBox() {
//   var searchBox, whoisonlinebox;
//   searchBox = document.createElement("div");
//   whoisonlinebox = document.getElementById("Panel");
//   mobilebox = document.getElementsByClassName("Banner");
//   if (whoisonlinebox) {
//     whoisonlinebox.appendChild(searchBox);
//     searchBox.innerHTML =
//       '<div id="SearchBox" class="Box"><h4>搜索</h4><form method=get action="https://www.google.com.hk/search"><input class="DateBox" type=text name=q><input class="Button hide" type=submit name=btnG value="走你"><input type=hidden name=ie value=UTF-8><input type=hidden name=oe value=UTF-8><input type=hidden name=hl value=zh-CN><input type=hidden name=domains value="huox.in"><input type=hidden name=sitesearch value="huox.in"></form></div>';
//   } else {
//     mobilebox[0].appendChild(searchBox);
//     searchBox.innerHTML =
//       '<div id="SearchBox" class="Box"><form method=get action="https://www.google.com.hk/search"><a><b>搜索:</b></a><input class="DateBox" type=text name=q><input class="Button hide" type=submit name=btnG value="走你"><input type=hidden name=ie value=UTF-8><input type=hidden name=oe value=UTF-8><input type=hidden name=hl value=zh-CN><input type=hidden name=domains value="huox.in"><input type=hidden name=sitesearch value="huox.in"></form></div>';
//   }
// }

function bindUserStyle(){
    const theme = localStorage.getItem('theme')
    if(!theme) {
        localStorage.setItem('theme','default')
    }

    document.querySelectorAll("#Head .Row")[0].insertAdjacentHTML('beforeend', '<ul class="right-menu"><li><a class="default">原版</a></li><li><a class="dark">夜间</a></li></ul>');
    
    // if(_temp === null || _temp === "default"){
    //     $("[user-style=true]").attr("disabled",true);
    // } else {
    //     $("."+_temp).attr("disabled",false);
    // }
    // $(".right-menu li a").live("click",function(){
    //     var type = $(this).attr("class");
    //     $("[user-style=true]").attr("disabled",true);
    //     $("."+type).attr("disabled",false);
    // });  
}

ready(() => {
    bindUserStyle()
//   addSearchBox();
});
