export const get = (entity) => {
  return new Promise(resolve => {
    chrome.storage.sync.get(entity, resolve);
  })
};

export const set = (entity) => {
  return new Promise(resolve => {
    chrome.storage.sync.set(entity, resolve);
  })
};

export default {
  get: get,
  set: set
}