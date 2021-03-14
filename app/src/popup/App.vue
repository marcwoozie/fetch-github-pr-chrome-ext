<template>
  <div>
    <div class="list-group">
      <a v-for="pr in prs" v-bind:key="pr.id" target="_blank" v-bind:href="pr.url" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{pr.repo_name}}</h5>
          <small>{{pr.updated_at}}</small>
        </div>
        <p class="mb-1">{{pr.title}}</p>
      </a>
    </div>
  </div>
</template>

<script>

import chromeStorage from "../modules/chromeStorage";

export default {
  async created() {
    const storage = await chromeStorage.get(['prs']);
    this.prs = storage.prs
  },
  data() {
    return {
      prs: []
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
