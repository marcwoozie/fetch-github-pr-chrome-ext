<template>
  <div>
    <div class="container-fluid container-option mt-4 clearfix">
      <div class="form-group">
        <label for="exampleInputEmail1">GitHubユーザー名</label>
        <input v-model="githubConnectionInformation.username" type="text" class="form-control" placeholder="GitHub Username">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">GitHubトークン</label>
        <input v-model="githubConnectionInformation.token" type="password" class="form-control" placeholder="GitHub Token">
        <small id="emailHelp" class="form-text text-muted">Tokenの取得の仕方はこちらから</small>
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">取得する感覚</label>
        <select v-model="interval" type="password" class="form-control">
          <option v-for="intervalOption in intervalOptions" v-bind:key="intervalOption.key"  v-bind:value="intervalOption.key" v-text="intervalOption.value"></option>
        </select>
      </div>
      <button @click="saveStore()" type="submit" class="btn btn-primary btn-sm float-right">Save</button>
    </div>
    
    <div class="container-fluid container-option mt-4">
      <hr>
      <div class="d-flex justify-content-between bd-highlight mb-3">
        <h5>Repositories</h5>
        <button @click="fetchRepository()" class="btn btn-sm btn-primary" v-bind:disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="{{loading}}"></span>
          Fetch Repositories
        </button>
      </div>

      <div class="mb-3">
        <input v-model="searchRepositoryName" class="form-control" placeholder="search repository name..." type="text">
      </div>
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">User/Org</th>
            <th scope="col">Repository</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repository in filterRepogitoriesByName" v-bind:key="repository">
            <td>
              <div class="form-check">
                <input v-bind:value="repository" v-model="chkRepositories" class="form-check-input" type="checkbox">
              </div>
            </td>
            <td>{{repository.type}}</td>
            <td>{{repository.login}}/{{repository.name}}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>

import Vue from "vue";
import chromeStorage from "../modules/chromeStorage";
import github from "../modules/github";

export default Vue.extend({
  name: 'App',
  data() {
    return {
      loading: false,
      searchRepositoryName: null,
      chkRepositories: [],
      allRepositories: [],
      intervalOptions: [
        {
          key: 15,
          value: '15分'
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
      interval: 15
    }
  },
  computed: {
    filterRepogitoriesByName: function() {
      if (this.searchRepositoryName == null || this.searchRepositoryName == "") {
        return this.allRepositories;
      }
      return this.allRepositories.filter(repository => {
        return repository.name.indexOf(this.searchRepositoryName) >= 0;
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: async function() {
      const storage = await chromeStorage.get(['username', 'token', 'chkRepositories', 'allRepositories']);
      this.githubConnectionInformation = {
        username: storage.username,
        token: storage.token
      }
      this.chkRepositories = storage.chkRepositories == undefined ? [] : storage.chkRepositories;
      this.allRepositories = storage.allRepositories == undefined ? [] : storage.allRepositories;
    },
    saveStore() {
      chrome.storage.sync.set(this.githubConnectionInformation, () => {
        alert('save')
      })
    },
    fetchRepository: async function() {
      this.loading = true;
      const storage = await chromeStorage.get(['username', 'token']);
      let userRepositories = await github.fetchUserRepository(storage.username);
      userRepositories = userRepositories.map(repo => {
        return {
          id: repo.id,
          type: 'user',
          login: repo.owner.login,
          name: repo.name
        };
      });
      const orgs = await github.fetchOrgs(storage.token);
      const orgRepositories = await Promise.all(orgs.map(async(org) => {
        const repos = await github.fetchOrgRepository(org.login, storage.token);
        return repos.map(repo => {
          return {
            id: repo.id,
            type: 'org',
            login: org.login,
            name: repo.name
          }
        });
      }));
      this.allRepositories = userRepositories.concat(orgRepositories.flat(2));
      chromeStorage.set({'allRepositories': this.allRepositories});
      this.loading = false;
    },
  },
  watch: {
    chkRepositories: {
      handler: function(repositories) {
        chromeStorage.set({'chkRepositories': repositories.map((r) => r)});
      },
      deep: true
    }
  }
});
</script>

<style lang="scss" scoped>
.container-option {
  width: 600px;
  margin: 0 auto;
}
</style>
