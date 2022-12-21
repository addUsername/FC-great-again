chrome.storage.onChanged.addListener( (changes, namespace) => {
    chrome.action.setBadgeText({text:""+changes["mode"].newValue});
});

const ruleID = 2;
function block(domains) {
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      addRules: [
        {
          action: {
            type: "block",
          },
          condition: {
            urlFilter: "*",
            domains: domains,
          },
          id: ruleID,
          priority: 1,
        },
      ],
      removeRuleIds: [ruleID],
    },
    () => {
      console.log("block rule added for", domains);
    }
  );
}

function unblock() {
  chrome.declarativeNetRequest.updateDynamicRules(
    { removeRuleIds: [ruleID] },
    () => console.log("rule removed")
  );
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "mode") {
    chrome.storage.sync.get("mode", (m) => {
      let mode = m.mode ?? 0;
      mode = (mode + 1) % 3;

      console.log("switch to mode", mode);

      if (mode === 1) {
        block(["twitter.com", "tiktok.com", "instagram.com"]);
      } else {
        unblock();
      }

      chrome.storage.sync.set({ mode: mode }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, mode);
        });
      });
    });
  }
});

// Fresh start
chrome.storage.sync.get("mode", (m) => {
  let mode = m.mode ?? 0;

  if (mode === 1) {
    block(["twitter.com", "tiktok.com", "instagram.com"]);
  } else {
    unblock();
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, mode);
  });

  chrome.action.setBadgeText({text:""+mode}); 
  chrome.action.setBadgeBackgroundColor({color: '#FFF'});
});
