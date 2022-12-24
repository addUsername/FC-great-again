chrome.runtime.onMessage.addListener((response, sendResponse) => {
  applyChanges(response);
});

chrome.storage.sync.get("mode", (m) => {

  console.log("hi")
  applyChanges(m.mode)
});

function applyChanges(mode) {
  if (window.location.href.includes("forumdisplay")) {
    if (mode === 2) {
      window.location.reload();
      return;
    }

    let body = document.getElementById("threadbits_forum_2");
    for (let idx = 0; idx < body.children.length; idx++) {
      const title = body.children[idx].children[2].getAttribute("title");
      
      if (title.match(/twitter|tiktok|instagram/g)) {
        if (mode === 0) {
          const post = body.children[idx].children[2].children[0];
          const index = post.children.length > 1 ? 1 : 0;
          post.children[index].innerHTML =
            "🤢🤢 <s>" + post.children[index].innerHTML + "</s>";
        }

        if (mode === 1) {
          body.children[idx].remove();
        }
      }
    }
  } else {
    if (mode !== 0) {
      window.location.reload();
    }
  }
}
