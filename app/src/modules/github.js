const axios = require('axios')
const ENDPOINT = "https://api.github.com";
import chromeStorage from "./chromeStorage";


export const fetchPullRequest = (username, token, repository) => {
  return axios.get(`${ENDPOINT}/repos/${username}/${repository}/pulls`, {
    params: {
      access_token: token,
      state: 'open'
    }
  }).then((res) => {
    return res.data;
  })
};

export const fetchAndSavePullRequests = (username, token, repositories) => {
  return new Promise(async(resolve, reject) => {
    if (username == undefined || token == undefined) return reject('argument error username or token is required');
    let localNewPrs = [];
    await chromeStorage.set({'pullRequests': []});
    await Promise.all(repositories.map(async(repository) => {
      const newPrs = await fetchPullRequest(username, token, repository);
      newPrs.forEach(newPr => {
        localNewPrs.push({
          id: newPr.id,
          repo_name: repository,
          title: newPr.title,
          updated_at: newPr.updated_at,
          url: newPr.html_url,
          username: newPr.user.login,
          fromBranchName: newPr.head.ref
        })
      });
    }))
    await chromeStorage.set({'pullRequests': localNewPrs});
    chrome.browserAction.setBadgeText({text: localNewPrs.length.toString()});
    resolve(localNewPrs);
  });
};

export const fetchAndSaveRepository = (username, perPage = 100, page = 1) => {
  return axios.get(`${ENDPOINT}/users/${username}/repos`, {
    params: {
      per_page: perPage,
      page: page
    }
  }).then((res) => {
    const data = [];
    res.data.forEach(repository => {
      data.push(repository.name)
    });
    chromeStorage.set({'repos': data});
    return data;
  })
};

export const fetchUserRepository = (username, perPage = 100, page = 1) => {
  return axios.get(`${ENDPOINT}/users/${username}/repos`, {
    params: {
      per_page: perPage,
      page: page
    }
  }).then((res) => {
    return res.data;
  })
};

export const fetchOrgs = (token) => {
  return axios.get(`${ENDPOINT}/user/orgs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`,
    },
    params: {
      per_page: 100,
      page: 1
    }
  }).then((res) => {
    return res.data;
  });
}

export const fetchOrgRepository = (org, token) => {
  return axios.get(`${ENDPOINT}/orgs/${org}/repos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`,
    },
    params: {
      per_page: 100,
      page: 1
    }
  }).then((res) => {
    return res.data;
  });
}

export default {
  fetchPullRequest: fetchPullRequest,
  fetchAndSaveRepository: fetchAndSaveRepository,
  fetchAndSavePullRequests: fetchAndSavePullRequests,
  fetchOrgs: fetchOrgs,
  fetchOrgRepository: fetchOrgRepository,
  fetchUserRepository: fetchUserRepository,
}