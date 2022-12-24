const ruleID = 2;
const domains = ["twitter.com", "tiktok.com", "instagram.com"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "!!" });
  chrome.action.setBadgeBackgroundColor({ color: "#FFA500" });

  chrome.storage.sync.set({ mode: -1 }, () => {
    //console.log("Installed")
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "mode") {
    chrome.storage.sync.get("mode", (m) => {
      let mode = m.mode ?? 0;
      mode = (mode + 1) % 3;

      //console.log("change mode: ", mode);

      if (mode === 1) {
        block(domains);
      } else {
        unblock();
      }
      chrome.action.setBadgeText({ text: "" + mode });

      chrome.storage.sync.set({ mode: mode }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, mode);
        });
      });
    });
  }
});

function block() {
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
      //console.log("block rule added for", domains);
    }
  );
}

function unblock() {
  chrome.declarativeNetRequest.updateDynamicRules(
    { removeRuleIds: [ruleID] },
    () => {
      //console.log("rule removed")
    }
  );
}
