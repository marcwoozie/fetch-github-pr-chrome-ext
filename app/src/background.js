const axios = require('axios')
const githubApiEndpoint = 'https://api.github.com';
import chromeStorage from "./modules/chromeStorage";

chrome.alarms.create('fetchPullRequest', { delayInMinutes: 1, periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'fetchPullRequest') {
    (async() => {
      let storage = await chromeStorage.get(['username', 'token']);
      const repos = await fetchRepos(storage.username);
      savePullRequests(repos, storage.username, storage.token);
    })()
  }
});

(async() => {
  let storage = await chromeStorage.get(['username', 'token']);
  const repos = await fetchRepos(storage.username);
  savePullRequests(repos, storage.username, storage.token);
})();

function fetchRepos(username) {
  return axios.get(`${githubApiEndpoint}/users/${username}/repos`, {
    params: {
      per_page: 100,
      page: 1
    }
  }).then((res) => {
    const repos = []
    res.data.forEach(repo => {
      repos.push(repo.name)
    });
    chromeStorage.set({'repos': repos})
    return repos;
  })
}

const savePullRequests = (repos, username, token) => {
  if (username == undefined || token == undefined) return;
  chromeStorage.set({'prs': []});
  let localNewPrs = [];
  (async () => {
    await Promise.all(repos.map(async(repo_name) => {
      const newPrs = await fetchPullRequest(repo_name, username, token);
      newPrs.forEach(newPr => {
        localNewPrs.push({
          id: newPr.id,
          repo_name: repo_name,
          title: newPr.title,
          updated_at: newPr.updated_at,
          url: newPr.html_url
        })
      });
    }))
    chromeStorage.set({'prs': localNewPrs});
    chrome.browserAction.setBadgeText({text: localNewPrs.length.toString()});
  })();
}

const fetchPullRequest = (repo_name, username, token) => {
  return axios.get(`${githubApiEndpoint}/repos/${username}/${repo_name}/pulls`, {
    params: {
      access_token: token,
      state: 'open'
    }
  }).then((res) => {
    return res.data;
  })
}
