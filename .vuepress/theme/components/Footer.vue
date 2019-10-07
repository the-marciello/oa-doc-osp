<template>
    <div class="footer">
        © {{ new Date().getFullYear() }}
        <a href="/">Offline Agency</a> |
        <a :href="gitUrl" target="_blank" >Github</a>
    </div>
</template>

<script>

    export default {
        computed: {
            data() {
                return this.$page.frontmatter
            },
            gitUrl () {
                if (this.$page.frontmatter.gitName) {
                    return 'https://github.com/offline-agency/' + this.$page.frontmatter.gitName
                }
                else {
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