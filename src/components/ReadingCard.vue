<template>
    <div>
        <v-dialog v-model="openAddModelFlag" max-width="500">
            <AddReadingModal :reading="reading" @closeAddModel="closeAddModel"/>
        </v-dialog>
        <v-snackbar v-model="snackbar" min-height="50" :timeout="4000" :color="snackbarColor" top right>
            <span text-left class="f-18 pl-3">{{ snackbarMsg }}</span>
            <template v-slot:action="{ attrs }">
                <span class="white--text f-18" v-bind="attrs" @click="snackbar = false"> x </span>
            </template>
        </v-snackbar>
        <v-dialog v-model="dialogFlag" max-width="500">
            <v-card class="pa-3">
                <v-card-title class="text-h5">
                    Confirm Changes?
                </v-card-title>
                <v-card-text class="f-18 my-3">
                    Are you sure you want to delete this Reading
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        large
                        outlined
                        class="width-btn"
                        color="black darken-1"
                        text
                        @click="dialogFlag = false"
                    >
                        <span class="f-18">No</span>
                    </v-btn>
                    <v-btn
                        large
                        class="width-btn mr-3"
                        text
                        @click="deleteReading"
                    > 
                        <span class="red white--text f-18 py-2 px-3">Yes</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card elevation="3" class="pa-5" rounded>
            <v-card-title>
                <v-layout wrap align-center>
                    <v-flex mr-5 rounded-circle class="header-icon-container">
                        <v-layout wrap justify-center align-center style="height: 100%">
                            <v-flex xs12 text-center>
                                <v-icon
                                    color="white"
                                    size="40"
                                    >
                                    {{ reading.icon }}
                                </v-icon>
                             </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex class="text-primary font-weight-bold f-24">{{ reading.title }}</v-flex>
                </v-layout>
            </v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-text v-if="reading.value" class="pb-0 mt-5">
                <v-layout wrap>
                    <v-flex xs7>
                        <p class="text-h4 text-primary font-weight-bold mb-1">{{ reading.value }}<span class="text-body-1 font-weight-bold pl-2">{{ reading.uom }}</span></p>
                        <p>{{ changeDateFormat(reading.updatedAt) }}</p>
                    </v-flex>
                    <v-flex xs5>
                        <v-btn
                            large
                            class="white--text width-btn mr-3"
                            color="#21118D"
                            @click="openAddModel"
                        >
                        <v-icon
                            color="#fff"
                            size="24"
                            >
                            mdi-plus
                        </v-icon>
                        </v-btn>
                        <v-btn
                            large outlined
                            elevation="2"
                            class="width-btn"
                            color="error"
                            @click="openDeleteReadingDialog"
                        >
                        <v-icon
                            class="trash-icon"
                            color="#D42C51"
                            size="24"
                            >
                            mdi-trash-can-outline
                        </v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions v-else class="justify-center mt-5">
            <v-btn
                py-5
                large
                class="white--text px-7"
                color="#21118D"
                @click="openAddModel"
            >
                <span class="text-capitalize f-18">Add {{ reading.title }}</span>
            </v-btn>
            </v-card-actions>
        </v-card>
    </div>
    
</template>
<script>
import AddReadingModal from './AddReadingModal.vue'
import axios from 'axios';
export default{
    name:'ReadingCard',
    props:['reading'],
    components:{
        AddReadingModal
    },
    data: () => ({
        openAddModelFlag: false,
        dialogFlag: false,
        snackbar: false,
        snackbarMsg: null,
        snackbarColor: null
    }),
    methods:{
        changeDateFormat(seconds){
            let day = ((new Date(seconds * 1000)).toLocaleString("en-GB").split(","))[0]
            let time = ((new Date(seconds * 1000)).toLocaleString().split(","))[1]
            // let time = ((new Date(seconds * 1000)).toLocaleString().split(":"))
            // let dayOrNight = ((new Date(seconds * 1000)).toLocaleString().split(" "))[2]
            return day+ ' - ' +time
            //
        },
        openAddModel(){
            this.openAddModelFlag = true;
        },
        closeAddModel(){
            this.openAddModelFlag = false;
        },
        openDeleteReadingDialog(){
            this.dialogFlag = true;
        },
        async deleteReading(){
            this.dialogFlag = false;
            let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5zdGFnaW5nLnBhdC1yZWMuY29tL2FwaS92MS9wYXRpZW50L2xvZ2luIiwiaWF0IjoxNzMxNjE0NTQ0LCJleHAiOjE3NjMxNTA1NDQsIm5iZiI6MTczMTYxNDU0NCwianRpIjoiTnZ1OFI0ZnJheGs0OEVMciIsInN1YiI6Ijg1MSIsInBydiI6Ijc1Mjg5NTY3MTBkMWM3NWI2NzEzMGQ0ZTRjNWMwZWU5YTBhZWI2MTQifQ.9acC0MEH8_qV10I5nM5rjluflNNIjDea2-i-Dp8sU9k'
            try{
                const response = await axios({ 
                    method: 'DELETE',  
                    url: `https://api.staging.pat-rec.com/api/v1/patient/readings/${this.reading.id}`,  
                    headers: {  
                        'X-Api-Key': "du7lik773nspohl0",
                        'Authorization': `Bearer ${token}`
                    },  
                }); 
                console.log(response.data);
                this.snackbar = true;
                this.snackbarMsg = 'Reading added successfully';
                this.snackbarColor = 'success'
                this.$store.dispatch('fetchAllReadings');
            } catch (error) {
                this.snackbar = true;
                this.snackbarMsg = error.response.data.errors.Disclaimer;
                this.snackbarColor = 'error'
            }
        }
    }
}
</script>
<style scoped>
@import "../assets/styles/readings_page.scss";
</style>