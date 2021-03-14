export const get = (entity) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(resolve)
  })
};

export const set = (entity) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(entity, () => resolve())
  })
};

export default {
  get: get,
  set: set
}