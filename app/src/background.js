import chromeStorage from "./modules/chromeStorage";
import github from "./modules/github";

chromeStorage.get('interval').then(storage => {
  const interval = storage.interval == undefined ? 15 : storage.interval;
  chrome.alarms.create('fetchPullRequest', { delayInMinutes: 1, periodInMinutes: interval });
})

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'fetchPullRequest') {
    run();
  }
});

const run = async () => {
  let storage = await chromeStorage.get(['username', 'token']);  
  await github.fetchAndSaveRepository(storage.username);
  let _storage = await chromeStorage.get(['repos']);
  github.fetchAndSavePullRequests(storage.username, storage.token, _storage.repos);
}

run();
