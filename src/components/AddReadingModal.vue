<template>
    <v-card class="py-4 px-7">
        <v-layout wrap justify-center>
            <v-flex xs10>
                <v-layout wrap justify-center mt-10>
                    <v-flex xs12 my-5 rounded-circle class="header-icon-container">
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
                    <v-flex xs12 class="text-h4 text-primary bold text-center">
                        Add New Reading
                    </v-flex>
                    <v-card-text class="f-18 my-3 text-center">
                        Add New {{ reading.title }} Reading
                    </v-card-text>
                    <v-flex xs12>
                        <v-form ref="add_reading_form">
                            <v-layout wrap>
                                <v-flex xs11 class="input-container" v-if="reading.type == 'blood-pressure'">
                                    <v-text-field
                                        v-model="readingValue"
                                        placeholder="Add Reading"
                                        outlined
                                        class="custom-input"
                                        :rules="general_rules"
                                        @blur="validateBloodPressure"
                                        required
                                        :suffix="reading.uom"
                                    ></v-text-field>
                                    <p class="mt-0 error-msg-class" v-if="bloodPressurerrorMessage">{{ bloodPressurerrorMessage }}</p>
                                    <!-- <span class="uom-inside-input">{{reading.uom}}</span> -->
                                </v-flex>
                                <v-flex xs11 class="input-container" v-else>
                                    <v-text-field
                                        v-model="readingValue"
                                        placeholder="Add Reading"
                                        outlined
                                        class="custom-input"
                                        :rules="readingRule"
                                        @keypress="onlyNumbers"
                                        :suffix="reading.uom"
                                        required
                                    ></v-text-field>
                                    <p class="mt-0 error-msg-class" v-if="errorMessage">{{ errorMessage }}</p>
                                    <!-- <span class="uom-inside-input">{{reading.uom}}</span> -->
                                </v-flex>
                                <v-flex xs12>
                                    <v-layout wrap xs12 justify-space-between>
                                        <v-flex xs4>
                                            <v-btn large
                                                    class="white--text px-7 text-capitalize text-h5"
                                                    color="#21118D"
                                                    @click="addReadingData">
                                                Add
                                            </v-btn>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-btn large 
                                                style="border-color:#D42C51"
                                                    outlined
                                                    color=""        
                                            @click="cancelData">
                                            <span class="red--text text-capitalize text-h5">Cancel</span>
                                        </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-flex>
                </v-layout>
                <v-card-actions>
                   
                </v-card-actions>
            </v-flex>
        </v-layout>
        
    </v-card>
</template>
<script>
export default{
    name: 'AddReadingModal',
    props:['reading'],
    data() {
        return({
            dialog: this.dialogFlag,
            readingValue: null,
            errorMessage: '',
            bloodPressurerrorMessage: '',
            bloodPressureRules: [
                v => !!v || 'Required',
                v => /^\d{2,3}\/\d{2,3}$/.test(v) || 'For example the value should be something like this 120/20',
            ],
            general_rules: [value => !!value || 'Required.'],
            height_rules: [
                value => !!value || 'Required.',
                value => (value && value < 270) || 'maximum value is 270',
                value => (value && value > 40) || 'minimum value is 40',
            ],
            weight_rules: [
                value => !!value || 'Required.',
                value => (value && value < 500) || 'maximum value is 500',
                value => (value && value > 20) || 'minimum value is 20',
            ],
            heart_rate_rules:[
                value => !!value || 'Required.',
                value => (value && value < 220) || 'maximum value is 220',
                value => (value && value > 40) || 'minimum value is 40',
            ],
            blood_sugar_rules:[
                value => !!value || 'Required.',
                value => (value && value < 300) || 'maximum value is 300',
                value => (value && value > 50) || 'minimum value is 50',
            ],
            temperature_rules:[
                value => !!value || 'Required.',
                value => (value && value < 45) || 'maximum value is 45',
                value => (value && value > 35) || 'minimum value is 35',
            ]
        })
    },
    methods:{
        validateBloodPressure(e) {
            if( e.target._value && this.reading.type == 'blood-pressure'){
                const regex = /^\d{2,3}\/\d{2,3}$/;
                if (!regex.test(e.target._value)) {
                    this.bloodPressurerrorMessage = "For example the value should be something like this 120/20";
                    return false;
                }
                this.bloodPressurerrorMessage = "";
                return true;
            }
            
        },
        onlyNumbers(evt){
            let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
            if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) evt.preventDefault();
        },
        addReadingData(){
            if(this.$refs["add_reading_form"].validate()){
                if(this.reading.id){ // update reading
                    this.$store.dispatch('updateReading', {readingObj: this.reading, readingValue: this.readingValue});
                }
                else{// add new reading
                    this.$store.dispatch('addNewReading', {readingObj: this.reading, readingValue: this.readingValue});
                }
                this.cancelData()
            }
        },
        cancelData(){
            this.readingValue = null;
            this.$refs.add_reading_form.resetValidation();
            this.$refs.add_reading_form.reset();
            this.$emit('closeAddModel')
            // this.$parent.openAddModelFlag = false
        }
    },
    computed:{
        readingRule(){
            switch(this.reading.type){
                case 'height' : return this.height_rules
                case 'weight' : return this.weight_rules
                case 'heart-rate' : return this.heart_rate_rules
                case 'blood-sugar' : return this.blood_sugar_rules
                case 'temperature' : return this.temperature_rules
                default: return this.general_rules
                
            }
        }
    }
    
}
</script>