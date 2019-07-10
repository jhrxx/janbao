
(async () => {
  const host = window.location.host;
  isJanbao = host === "janbao.net";
  isJandan = host === "jandan.net";
    console.log('isJanbao :', isJanbao);
  let src;
  if (isJanbao) {
    src = chrome.extension.getURL("src/js/janbao.js");
    // src = "src/js/janbao.js"
  }
  if (isJandan) {
    src = chrome.extension.getURL("src/js/jandan.js");
  }
  console.log('src :', src);
  if (src) {
    // const contentScript =  require(src)
    const contentScript = import(src);
    console.log('contentScript :', contentScript);
    // contentScript.main(/* chrome: no need to pass it */);
  }
})();
