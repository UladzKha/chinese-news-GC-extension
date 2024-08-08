let eventSource;

function getSignificanceBadge(significance) {
  switch (significance.toLowerCase()) {
    case "high":
      return "🔥 IMPORTANT";
    case "medium":
      return "✨ INTERESTING";
    case "low":
      return "📌 UPDATE";
    default:
      return "🆕 NEW";
  }
}
function connectToSSE() {
  eventSource = new EventSource("http://188.212.125.233:3000/api/updates");
  eventSource.onmessage = function (event) {
    const newArticle = JSON.parse(event.data);

    chrome.storage.sync.get("selectedSources", function (items) {
      const optionsSet = new Set(items.selectedSources);

      if (optionsSet.has(newArticle.source)) {
        chrome.notifications.create(
          {
            type: "basic",
            iconUrl: "images/icon48.png",
            title: `${getSignificanceBadge(newArticle.significance)} from ${
              newArticle.source
            }`,
            message: `${newArticle.translatedTitle}`,
            contextMessage: `Click to read more`,
            priority: 2,
          },
          function (notificationId) {
            chrome.storage.local.set({
              [notificationId]: `https://chinese-rss-website.vercel.app/articles/${newArticle._id}`,
            });
          }
        );
      }
    });
  };

  eventSource.onerror = function (error) {
    console.error("SSE error:", JSON.stringify(error));
    eventSource.close();
    setTimeout(connectToSSE, 60000);
  };
}

chrome.runtime.onStartup.addListener(connectToSSE);
chrome.runtime.onInstalled.addListener(connectToSSE);
chrome.notifications.onClicked.addListener(function (notificationId) {
  chrome.storage.local.get(notificationId, function (result) {
    const url = result[notificationId];
    if (url) {
      chrome.tabs.create({ url: url });
      chrome.storage.local.remove(notificationId);
    }
  });
});
