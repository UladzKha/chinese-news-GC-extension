const sources = [
  { name: "36氪", url: "https://36kr.com/", rssUrl: "https://36kr.com/feed" },
  {
    name: "钛媒体",
    url: "https://www.tmtpost.com/",
    rssUrl: "https://www.tmtpost.com/rss.xml",
  },
  {
    name: "爱范儿",
    url: "https://www.ifanr.com/",
    rssUrl: "https://www.ifanr.com/feed",
  },
  {
    name: "虎嗅网",
    url: "https://www.huxiu.com/",
    rssUrl: "https://www.huxiu.com/rss/0.xml",
  },
  {
    name: "机器之心",
    url: "https://www.jiqizhixin.com/",
    rssUrl: "https://www.jiqizhixin.com/rss",
  },
];

function saveOptions() {
  const selectedSources = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);

  chrome.storage.sync.set(
    {
      selectedSources,
    },
    function () {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon48.png",
        title: "Settings Saved",
        message: "Your changes have been saved successfully.",
        priority: 1,
      });
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get("selectedSources", function (items) {
    const selectedSources = items.selectedSources || [];

    const container = document.getElementById("sources-container");

    sources.forEach((source) => {
      const div = document.createElement("div");
      div.innerHTML = `
                <input type="checkbox" id="${source.name}" value="${
        source.name
      }" ${selectedSources.includes(source.name) ? "checked" : ""}>
                <label for="${source.name}" class="label-opt">${
        source.name
      }</label>
            `;

      container.appendChild(div);
    });

    const btn = document.createElement("button");
    btn.id = "save";
    btn.textContent = "Save";
    btn.addEventListener("click", saveOptions);

    container.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
