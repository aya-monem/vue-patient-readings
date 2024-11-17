<template>
  <v-app>
    <v-main>
      <ReadingsList />
    </v-main>
  </v-app>
</template>

<script>
import ReadingsList from './components/ReadingsList.vue'
export default {
  name: 'App',

  components: {
    ReadingsList
  },

  data: () => ({
    //
  }),
};
</script>
<style lang="scss">
@import "./assets/styles/styles.scss";
</style>
