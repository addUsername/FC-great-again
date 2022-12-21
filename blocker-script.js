chrome.runtime.onMessage.addListener((response, sendResponse) => {
  applyChanges();
});

function applyChanges() {
  chrome.storage.sync.get("mode", function (m) {
    mode = m.mode ?? 0;
    if (window.location.href.includes("forumdisplay")) {
      if (mode === 2) {
        window.location.reload();
        return;
      }

      let body = document.getElementById("threadbits_forum_2");
      for (let idx = 0; idx < body.children.length; idx++) {
        const title = body.children[idx].children[2].getAttribute("title");
        if (title.match(/twitter|tiktok|instagram/g)) {
          //improve to censor just the urls
          if (mode === 0) {
            const post = body.children[idx].children[2].children[0];

            if (post.children.length > 1) {
              post.children[1].innerHTML =
                "🤢🤢 <s>" + post.children[1].innerHTML + "</s>";
            } else {
              post.children[0].innerHTML =
                "🤢🤢 <s>" + post.children[0].innerHTML + "</s>";
            }
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
  });
}
