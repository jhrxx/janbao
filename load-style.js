/**
 * As the current SDK(v1.12) do NOT provide API to add css file on content page
 * Now use js file to append style in head
 *
 * desc: http://stackoverflow.com/questions/8373678/inject-a-css-file-into-a-webpage-via-firefox-extension
 */

/**
 *  addGlobalStyle -- add a string of CSS to a document as a global style.
 */
function addGlobalStyle(doc, css, className) {
    var head = doc.getElementsByTagName('head')[0];         // find head element, which should exist
    if (!head) { return; }                                  // defective HTML document
    var style = doc.createElement('style');                 // create <style> element
    style.type = 'text/css';
    if(className){
        style.className = className;
        style.setAttribute("user-style",true);
    }
    if (style.styleSheet){
        // for some cross-browser problem
        style.styleSheet.cssText = css;                     // attach CSS text to style elt
    } else {
        style.appendChild(document.createTextNode(css));    // attach CSS text to style elt
    }
    head.appendChild(style);                                // attach style element to head
}


// CSS to be added.  Your CSS goes here.
// To add more speed, compress the css file to one line
var emotionCss = ".right-menu{float:right;display:inline-block;margin-top: 42px}.right-menu li{display:block;float:left;line-height:27px;list-style:none outside none;margin:0 4px 0 0;padding:0;position:relative}.right-menu li a:hover{text-decoration:underline;cursor:pointer;}.right-menu li a{color:#FFFFFF;border:0 none;display:block;font-size:11px;height:28px;padding:0 7px;position:relative;text-decoration:none;white-space:nowrap}.jdedit-toolbar{width:100%;}.jdedit-button-wrap{margin:1px;padding:0;}.jdedit-button-wrap:hover{cursor:pointer;background-color:#FFE69F;border:1px solid #DCAC6C;}.jdedit-button-wrap:active{background-color:#fff;}.jdedit-button:active{background-color:#fff;border:1px solid transparent;}.jdedit-button{height:19px;width:19px;}.jdedit-button,.jdedit-button-wrap{background-color:transparent;border:1px solid transparent;position:relative;display:inline-block;vertical-align:top;}.jdedit-icon-1{background:url(moz-extension://<extension-UUID>/images/emotion/1.png)}.jdedit-icon-2{background:url(moz-extension://<extension-UUID>/images/emotion/2.png)}.jdedit-icon-3{background:url(moz-extension://<extension-UUID>/images/emotion/3.png)}.jdedit-icon-4{background:url(moz-extension://<extension-UUID>/images/emotion/4.png)}.jdedit-icon-5{background:url(moz-extension://<extension-UUID>/images/emotion/5.png)}.jdedit-icon-6{background:url(moz-extension://<extension-UUID>/images/emotion/6.png)}.jdedit-icon-7{background:url(moz-extension://<extension-UUID>/images/emotion/7.png)}.jdedit-icon-8{background:url(moz-extension://<extension-UUID>/images/emotion/8.png)}.jdedit-icon-9{background:url(moz-extension://<extension-UUID>/images/emotion/9.png)}.jdedit-icon-10{background:url(moz-extension://<extension-UUID>/images/emotion/10.png)}.jdedit-icon-11{background:url(moz-extension://<extension-UUID>/images/emotion/11.png)}.jdedit-icon-12{background:url(moz-extension://<extension-UUID>/images/emotion/12.png)}.jdedit-icon-13{background:url(moz-extension://<extension-UUID>/images/emotion/13.png)}.jdedit-icon-bold{background:url(moz-extension://<extension-UUID>/images/frame/bold.png)}.jdedit-icon-italic{background:url(moz-extension://<extension-UUID>/images/frame/italic.png)}.jdedit-icon-strikethrough{background:url(moz-extension://<extension-UUID>/images/frame/strikethrough.png)}.jdedit-icon-blockquote{background:url(moz-extension://<extension-UUID>/images/frame/blockquote.png)}.jdedit-icon-insertorderedlist{background:url(moz-extension://<extension-UUID>/images/frame/ordered-list.png)}.jdedit-icon-insertunorderedlist{background:url(moz-extension://<extension-UUID>/images/frame/unordered-list.png)}.jdedit-icon-listitem{background:url(moz-extension://<extension-UUID>/images/frame/listitem.png)}.jdedit-icon-horizontal{background:url(moz-extension://<extension-UUID>/images/frame/horizontal.png)}.jdedit-icon-selectall{background:url(moz-extension://<extension-UUID>/images/frame/selectall.png)}.jdedit-icon-cleardoc{background:url(moz-extension://<extension-UUID>/images/frame/cleardoc.png)}.jdedit-icon-link{background:url(moz-extension://<extension-UUID>/images/frame/link.png)}.jdedit-separator{width:2px;height:20px;margin:1px;position:relative;display:inline-block;vertical-align:top;background:url(moz-extension://<extension-UUID>/images/frame/separator.png)}.jdedit-icon{background-repeat:no-repeat;background-position:center;color:transparent;}";
var scrollCss = ".hide{display:none;}#back-top{position:fixed;cursor:pointer;bottom:30px;left:50%;margin-left:500px;width:64px;height:64px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;border-color:5px;-webkit-transition:1s;-moz-transition:1s;transition:1s;background:url(moz-extension://<extension-UUID>/images/top-white.png) no-repeat center center #333;opacity:0.2;}#back-top:hover{opacity:0.5;}";
var whiteScroll = "#back-top{background: url(moz-extension://<extension-UUID>/images/top-black.png) no-repeat center center #eee;}";
var otherCss = "body{background:url(moz-extension://<extension-UUID>/images/pattern.png)}";
// var darkCss = "";


addGlobalStyle(document, emotionCss);  // Attach CSS text to head of document

addGlobalStyle(document, scrollCss);
addGlobalStyle(document, whiteScroll, "dark");
// addGlobalStyle(document, darkCss, "dark");

