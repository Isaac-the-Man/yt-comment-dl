<template>
  <div id="app" class="py-5">
    <b-container>
      <b-row>
        <b-col>
          <h1><span class="rounded"><BIconCaretRightFill style="color:#FF0000"></BIconCaretRightFill>Youtube</span>
            Comment Snippet Downloader
          </h1>
          <hr>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="6">
          <h3>Step1: Query Comments</h3>
          Copy the Video ID of any Youtube videos, and query up to at most 1800 comments. Sort by relevance or time by
          your choice.
        </b-col>
        <b-col md="6">
          <b-img fluid src="@/assets/video_id.gif"></b-img>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="6">
          <b-img fluid src="@/assets/style_download.gif"></b-img>
        </b-col>
        <b-col md="6">
          <h3>Step2: Style & Download</h3>
          Currently supported customization includes: dark theme, html links, show time, show edited, and wide comment.
          Download styled comments as <code>.png</code> images.
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <hr>
          <Scraper class="mt-3"></Scraper>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <AppFooter></AppFooter>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Scraper from "@/components/Scraper";
import AppFooter from "@/components/AppFooter";
import {BIconCaretRightFill} from 'bootstrap-vue';

export default {
  name: 'App',
  components: {
    Scraper,
    AppFooter,
    // BICon,
    BIconCaretRightFill
  }
}
</script>

<style>
</style>
