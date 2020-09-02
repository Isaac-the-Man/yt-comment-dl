<template>
  <div id="app" class="py-5">
    <b-container>
      <b-row>
        <b-col>
          <h1>Youtube Comment Snippet Downloader</h1>
          <hr>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <Scraper></Scraper>
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

export default {
  name: 'App',
  components: {
    Scraper,
    AppFooter
  }
}
</script>

<style>
</style>
