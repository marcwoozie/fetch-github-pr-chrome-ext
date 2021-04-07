import chromeStorage from "./modules/chromeStorage";
import {blank} from "./modules/blank";
import github from "./modules/github";
import axios from "axios";

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
  let storage = await chromeStorage.get(['username', 'token', 'chkRepositories']);
  if (
    blank(storage.username) ||
    blank(storage.token) ||
    blank(storage.chkRepositories)
  ) {
    return;
  }
  github.fetchAndSavePullRequests(storage.username, storage.token, storage.chkRepositories);
}

run();
