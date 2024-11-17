// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
// let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5zdGFnaW5nLnBhdC1yZWMuY29tL2FwaS92MS9wYXRpZW50L2xvZ2luIiwiaWF0IjoxNzMxNjE0NTQ0LCJleHAiOjE3NjMxNTA1NDQsIm5iZiI6MTczMTYxNDU0NCwianRpIjoiTnZ1OFI0ZnJheGs0OEVMciIsInN1YiI6Ijg1MSIsInBydiI6Ijc1Mjg5NTY3MTBkMWM3NWI2NzEzMGQ0ZTRjNWMwZWU5YTBhZWI2MTQifQ.9acC0MEH8_qV10I5nM5rjluflNNIjDea2-i-Dp8sU9k'
let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5zdGFnaW5nLnBhdC1yZWMuY29tL2FwaS92MS9wYXRpZW50L2xvZ2luIiwiaWF0IjoxNzMxODI1NDUzLCJleHAiOjE3NjMzNjE0NTMsIm5iZiI6MTczMTgyNTQ1MywianRpIjoicGwxbkVwNGprN25ocWpUNCIsInN1YiI6Ijg1MSIsInBydiI6Ijc1Mjg5NTY3MTBkMWM3NWI2NzEzMGQ0ZTRjNWMwZWU5YTBhZWI2MTQifQ.6RpB168f59fvvLqW8g2mirbka_UIyMGKEOPQY7lUHAk'
//localStorage.getItem("token");
let options = {
  headers : {  
  'X-Api-Key': "du7lik773nspohl0",
  'Authorization': `Token ${token}`
}
}

export default new Vuex.Store({
  state: {
    allReadings: [],
    readings_types: [
        {title: 'Blood Pressure', type: 'blood-pressure', uom: 'mmHg', icon: 'mdi-stethoscope'},
        {title: 'Height', type: 'height', uom: 'CM', icon:'mdi-human-male-height'},
        {title: 'Weight', type: 'weight', uom: 'KG', icon: 'mdi-weight-kilogram'},
        {title: 'Heart Rate', type: 'heart-rate', uom: 'BPM', icon: 'mdi-heart-pulse'},
        {title: 'Blood Sugar', type: 'blood-sugar', uom: 'mg/dL', icon: 'mdi-blood-bag'},
        {title: 'Temperature', type: 'temperature', uom: 'C', icon: 'mdi-thermometer'}
    ]
  },
  mutations: {
    setAllReadings: (state, allReadings) => {
        state.allReadings = allReadings;

        if(state.allReadings?.length > 0){
            state.readings_types = state.readings_types.map(item =>{
                let readingHasValue = state.allReadings.find(reading => reading.type == item.type);
                if(readingHasValue != undefined){
                    delete item.type;
                    item = {...item, ...readingHasValue}
                }
                return item
            })
        };
    },
  },
  actions: {
    async fetchAllReadings({commit}){
        let url = 'https://api.staging.pat-rec.com/api/v1/patient/readings/';
        await axios.get(url, options)
        .then((response) => {
          commit('setAllReadings' , response.data)
        })
        .catch((error) => {
          console.error(error);
        });
        
    },
    async addNewReading({commit}, {readingObj, readingValue}){
      let url1 = 'https://api.staging.pat-rec.com/api/v1/patient/readings';
        await axios.post(url1, {
          'type': readingObj.type,
          'value': readingValue
        }, options)
        .then((response1) => {
          let url2 = 'https://api.staging.pat-rec.com/api/v1/patient/readings/';
            console.log(response1.data)
            axios.get(url2, options)
            .then((response2) => {
              console.log(response2.data)
              commit('setAllReadings' , response2.data)
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async updateReading({commit}, {readingObj, readingValue}){
     
      let url1 =  `https://api.staging.pat-rec.com/api/v1/patient/readings/${readingObj.id}`;
        await axios.patch(url1, {
          'type': readingObj.type,
          'value': readingValue
        }, options)
        .then((response1) => {
          let url2 = 'https://api.staging.pat-rec.com/api/v1/patient/readings/';
            console.log(response1.data)
            axios.get(url2, options)
            .then((response2) => {
              console.log(response2.data)
              commit('setAllReadings' , response2.data)
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
  getters: {
    // Your getters to access state data
  },
});
