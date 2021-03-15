<template>
  <div class="container-fluid container-option">
    <div class="list-group">
      <a  class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 text-muted">aaaaaaaaa</h5>
          <small>2012-1-1</small>
        </div>
        <p class="mb-1">こんなプルリクエストです</p>
      </a>
    </div>

    <div class="form-group">
      <label for="exampleInputEmail1">GitHub Username</label>
      <input v-model="githubConnectionInformation.username" type="text" class="form-control" placeholder="GitHub Username">
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">GitHub Token</label>
      <input v-model="githubConnectionInformation.token" type="password" class="form-control" placeholder="GitHub Token">
      <small id="emailHelp" class="form-text text-muted">Tokenの取得の仕方はこちらから</small>
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Interval</label>
      <select v-model="interval" type="password" class="form-control">
        <option v-for="intervalOption in intervalOptions" v-bind:key="intervalOption.key"  v-bind:value="intervalOption.key" v-text="intervalOption.value"></option>
      </select>
      <small id="emailHelp" class="form-text text-muted">取得する感覚を設定できます</small>
    </div>
    <button @click="saveStore()" type="submit" class="btn btn-primary">保存</button>
  </div>
</template>

<script lang="ts">

import Vue from "vue"
// import chromeStorage from "../modules/chromeStorage";

export default Vue.extend({
  name: 'App',
  data() {
    return {
      intervalOptions: [
        {
          key: 10,
          value: '10分'
        },
        {
          key: 30,
          value: '30分'
        },
        {
          key: 60,
          value: '60分'
        }
      ],
      githubConnectionInformation: {
        username: null,
        token: null
      },
      interval: 10
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      chrome.storage.sync.get(this.githubConnectionInformation, (payload: any): void => {
        this.githubConnectionInformation = payload
        // this.interval = payload.interval
      })
    },
    saveStore() {
      chrome.storage.sync.set(this.githubConnectionInformation, () => {
        alert('save')
      })
    }
  }
});
</script>

<style scoped>
.container-option {
  width: 600px;
  margin: 0 auto;
}
</style>
