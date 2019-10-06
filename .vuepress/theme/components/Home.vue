<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">
      <img v-if="data.heroImage"
        :src="$withBase(data.heroImage)"
        :alt="data.heroAlt || 'hero'">

      <h1 v-if="data.heroText !== null" id="main-title">{{ data.heroText || $title }}</h1>

      <p class="description">
        {{ data.tagline || $description }}
      </p>

      <p class="action"
        v-if="data.actionText && data.actionLink">
        <NavLink class="action-button"
          :item="actionLink"/>
      </p>
    </header>

    <h1 style="margin: 3rem 0">{{data.heroTitle}}</h1>

      <div v-if="data.projectTypes && data.projectTypes.length">
          <div class="projectsType"
               v-for="(projectType, index) in data.projectTypes"
               :key="index">
              <h2>{{ projectType.title }}</h2>
              <div class="projects"
                   v-if="data.projects && data.projects.length">
                  <div class="project"
                       v-for="(project, index) in data.projects"
                       :key="index" v-if="projectType.title === project.type">
                      <h2><a :href="project.link">{{ project.title }}</a></h2>
                      <p>{{ project.details }}</p>
                  </div>
              </div>
          </div>
      </div>

    <Content class="theme-default-content custom"/>

    <div
      class="footer"
      v-if="data.footer">
      {{ data.footer }}
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

export default {
  components: { NavLink },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    }
  }
}
</script>

<style lang="stylus">
.home
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto
  display block
  .hero
    text-align center
    img
      max-width 100%
      max-height 35px
      display block
      margin 3rem auto 1.5rem
    h1
      font-size 3rem
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
  .projectsType
    > h2
      margin 2.5rem auto 0; border: 0
    .projects
      margin-top 0
    .project
      > h2
       text-decoration underline
  .features, .projects
    border-top 1px solid $borderColor
    padding 1.2rem 0
    margin-top 2.5rem
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature, .project
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .home
    .features, .projects
      flex-direction column
    .feature, .project
      max-width 100%
      padding 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1.5rem
    padding-right 1.5rem
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature, .project
      h2
        font-size 1.25rem
</style>
