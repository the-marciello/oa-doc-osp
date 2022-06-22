<template>
  <div class="footer">
    © 2019 - {{ new Date().getFullYear() }}

    <a href="https://offlineagency.it/" target="_blank">OFFLINE Agency</a> |
    <router-link :to="$localePath" class="home-link">Documentation</router-link>
    |
    <a :href="gitUrl" target="_blank">GitHub</a>
  </div>
</template>

<script>

export default {
  computed: {
    data() {
      return this.$page.frontmatter
    },
    gitUrl() {
      if (this.$page.frontmatter.gitName) {
        return 'https://github.com/offline-agency/' + this.$page.frontmatter.gitName
      } else {
        return 'https://github.com/offline-agency/'
      }
    }
  }
}

</script>

<style lang="stylus">

.footer {
  padding: 2.5rem
  border-top: 1px solid $borderColor
  text-align: center
  color: lighten($textColor, 25%)
}

</style>
