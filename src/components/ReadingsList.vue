<template>
 <v-layout justify-center>
  <v-flex xs12 md8>
    <v-layout wrap>
      <v-flex xs12 px-3 my-5 text-h3 font-weight-medium class="text-primary">
        My Readings
      </v-flex>
      <v-flex xs12 md6 lg4 pa-3 v-for="(item) in readings_types" :key="item.id">
        <ReadingCard :reading="item"/>
      </v-flex>
    </v-layout>
  </v-flex>
 </v-layout>
</template>

<script>
import ReadingCard from './ReadingCard.vue'
  export default {
    name: 'ReadingsList',
    components:{
      ReadingCard
    },
    data: () => ({
    
    }),
    methods:{
      
    },
    mounted(){
       this.$store.dispatch('fetchAllReadings');
    },
    computed: {
      allReadings() {
        return this.$store.state.allReadings;
      },
      readings_types(){
        return this.$store.state.readings_types;
      }
    }
  }
</script>
