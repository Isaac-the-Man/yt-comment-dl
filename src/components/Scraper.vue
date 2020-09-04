<template>
  <div>
    <!-- Video Query -->
    <b-form v-if="!isQuerySuccess" @submit="loadComments" inline
            class="p-3 bg-light rounded d-flex justify-content-between">
      Query Options:
      <b-form-input class="ml-2" required type="text" v-model="videoID" placeholder="Video ID"></b-form-input>
      <b-form-select class="ml-2" required v-model="loadConfig.count" :options="loadOptions"></b-form-select>
      <b-form-select class="ml-2" required v-model="loadConfig.order" :options="orderOptions"></b-form-select>
      <b-button class="ml-2" variant="primary" type="submit">Query</b-button>
    </b-form>
    <!-- Styling Options -->
    <b-form v-else @submit="downloadAll" inline class="bg-light p-3 mt-3 rounded d-flex justify-content-between">
      Styling Options:
      <b-form-checkbox class="ml-2" v-model="loadStyle.isDark" switch>Dark Theme</b-form-checkbox>
      <b-form-checkbox class="ml-2" v-model="loadStyle.useHtml" switch>Use HTML</b-form-checkbox>
      <b-form-checkbox class="ml-2" v-model="loadStyle.showTime" switch>Show Time</b-form-checkbox>
      <b-form-checkbox class="ml-2" v-model="loadStyle.showEdited" switch>Show Edited</b-form-checkbox>
      <b-form-checkbox class="ml-2" v-model="loadStyle.wideComment" switch>Wide Comment</b-form-checkbox>
      <b-button class="ml-2" type="submit" variant="primary">Download</b-button>
    </b-form>
    <!-- pb -->
    <b-progress v-if="progressBar.show" height="3px" :value="progressBar.value" :max="progressBar.max"></b-progress>
    <!-- Pagination -->
    <div v-if="isQuerySuccess" class="d-flex mt-3 align-items-baseline">
      <b-pagination class="m-0" v-model="paginator.currentPage" :per-page="paginator.perPage"
                    :total-rows="commentsCount"></b-pagination>
      <b-badge pill class="ml-2">{{ commentsCount }}</b-badge>
      <b-button @click="refresh" class="ml-auto" variant="outline-primary">Submit Another</b-button>
    </div>
    <!-- Display -->
    <b-overlay class="mt-3" :show="isLoading">
      <div v-if="commentsCount > 0">
        <b-card-group v-if="!loadStyle.wideComment" columns>
          <b-card :class="['rounded', 'shadow', 'dl', {'darkTheme': loadStyle.isDark}]" no-body
                  v-for="com in extractedPage" :key="com.topLevelComment.snippet.id">
            <div class="d-flex align-items-start p-2">
              <img class="rounded-circle" :src="com.topLevelComment.snippet.authorProfileImageUrl" alt="profile_pic">
              <div class="ml-2">
                <span class="authorFont">{{ com.topLevelComment.snippet.authorDisplayName }}</span>
                <small class="ml-1">{{
                    getTime(com.topLevelComment.snippet.publishedAt, com.topLevelComment.snippet.updatedAt)
                  }}</small>
                <br>
                <div class="text-wrap" v-html="getText(com.topLevelComment.snippet.textDisplay)"></div>
              </div>
            </div>
          </b-card>
        </b-card-group>
        <div v-else>
          <b-card :class="['rounded', 'shadow', 'dl', {'darkTheme': loadStyle.isDark}]" no-body
                  v-for="com in extractedPage" :key="com.topLevelComment.snippet.id">
            <div class="d-flex align-items-start p-2">
              <img class="rounded-circle" :src="com.topLevelComment.snippet.authorProfileImageUrl" alt="profile_pic">
              <div class="ml-2">
                <span class="authorFont">{{ com.topLevelComment.snippet.authorDisplayName }}</span>
                <small class="ml-1">{{
                    getTime(com.topLevelComment.snippet.publishedAt, com.topLevelComment.snippet.updatedAt)
                  }}</small>
                <br>
                <div class="text-wrap" v-html="getText(com.topLevelComment.snippet.textDisplay)"></div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
      <div v-else>
        {{ status }}
      </div>
    </b-overlay>
  </div>
</template>

<script>
import moment from 'moment'
import htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import striptags from 'striptags';

export default {
  name: "Scraper",
  data() {
    return {
      videoID: '',
      commentsBlocks: [], // list of list of comments, added per load
      nextPageToken: null,
      isLoading: false,
      status: 'Nothing Loaded...',
      loadConfig: {
        order: 'relevance',
        count: 50,
      },
      loadStyle: {
        useHtml: true,
        wideComment: false,
        isDark: false,
        showTime: true,
        showEdited: true
      },
      loadOptions: [
        {text: '50 Comments', value: 50},
        {text: '100 Comments', value: 100},
        {text: '300 Comments', value: 300},
        {text: '1000 Comments', value: 1000},
        {text: 'All Comments (Max 1800)', value: -1},
      ],
      orderOptions: [
        {text: 'Most Relevant', value: 'relevance'},
        {text: 'Most Recent', value: 'time'},
      ],
      paginator: {
        currentPage: 1,
        perPage: process.env.VUE_APP_MAX_RESULTS_PER_LOAD
      },
      progressBar: {
        value: 0,
        max: 100,
        show: false
      }
    }
  },
  computed: {
    isQuerySuccess() {
      return this.commentsBlocks.length > 0;
    },
    extractedPage() {
      const extracted = [];
      for (let comment of this.commentsBlocks[this.paginator.currentPage - 1]) {
        extracted.push(comment.snippet);
      }
      return extracted
    },
    commentsCount() {
      let counter = 0;
      for (let block of this.commentsBlocks) {
        counter += block.length;
      }
      return counter;
    }
  },
  methods: {
    // restart
    refresh() {
      this.commentsBlocks = [];
      this.status = 'Nothing Loaded...';
      this.paginator.currentPage = 1;
    },
    // strip html content
    getText(str) {
      if (!this.loadStyle.useHtml) {
        return striptags(str);
      }
      return str;
    },
    // get readable time
    getTime(t, edit_t) {
      let time = '';
      if (this.loadStyle.showTime) {
        time += moment(t).fromNow();
      }
      if (this.loadStyle.showEdited && t !== edit_t) {
        time += ' (edited)';
      }
      return time;
    },
    // load n amount of comments
    async load(count, order, nextPageToken) {
      try {
        const api = `https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyA8Jd2Dck4YCKeRORQIJ_oRFeZMzgMAzDg&videoId=${this.videoID}&maxResults=${count}&order=${order}&pageToken=${nextPageToken}&part=snippet`;
        const res = await this.axios.get(api);
        console.log(res.data.nextPageToken);
        console.log(res.data.pageInfo);
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
    // load the specified amount of comments into memory
    async loadComments(e) {
      e.preventDefault();

      await this.$recaptchaLoaded();
      const token = await this.$recaptcha('queryComments');
      console.log(token);
      await this.verify(token);

      this.isLoading = true;
      let loadCount = this.loadConfig.count;
      let tmpPageToken = '';
      // load 50 comments per request
      while (loadCount >= process.env.VUE_APP_MAX_RESULTS_PER_LOAD || loadCount === -1) {
        const res = await this.load(process.env.VUE_APP_MAX_RESULTS_PER_LOAD, this.loadConfig.order, tmpPageToken);
        if (!res) {
          this.status = 'Error While Scraping...';
          this.isLoading = false;
          return;
        }
        this.commentsBlocks.push(res.items);
        if (!res.nextPageToken) {
          this.isLoading = false;
          return; // end when no more comments found
        }
        tmpPageToken = res.nextPageToken;
        if (loadCount !== -1) {
          loadCount -= process.env.VUE_APP_MAX_RESULTS_PER_LOAD;
        }
      }
      // load remainder comments
      if (loadCount > 0) {
        const res = await this.load(loadCount, this.loadConfig.order, tmpPageToken);
        this.commentsBlocks.push(res.items);
      }
      this.isLoading = false;
    },
    // download every loaded comments
    async downloadAll(e) {
      e.preventDefault();
      this.isLoading = true;
      this.progressBar.show = true;
      this.paginator.currentPage = 1;
      let counter = 0;
      this.progressBar.max = this.commentsCount;
      this.progressBar.value = counter;
      const zip = new JSZip();
      while (counter < this.commentsCount) {
        const elements = await document.getElementsByClassName('dl');
        for (let element of elements) {
          const dataURL = await htmlToImage.toPng(element);
          zip.file(`${counter}.png`, dataURL.substring(22), {base64: true});
          counter++;
          this.progressBar.value = counter;
        }
        this.paginator.currentPage += 1;
      }
      this.paginator.currentPage = 1;
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content);
      this.progressBar.value = 0;
      this.progressBar.max = 100;
      this.progressBar.show = false;
      this.isLoading = false;
    },
    async verify(token) {
      const res = await this.axios.post('https://app.netlify.com/sites/youtube-comment-downloader/functions/verify', {
        token: token
      });
      console.log(res);
    }
  }
}
</script>

<style scoped>
.darkTheme {
  color: white;
  background-color: #282828;
}

.authorFont {
  font-weight: 500 !important;
}
</style>
