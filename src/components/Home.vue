<template>  
 <v-app>
  <v-container id="signinup-form" class="fill-height">   
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="12" sm="8" md="8" class="">
        <v-card class="evelation-12 card">
          <v-window v-model="step">
            <!--Generate-->
            <v-window-item :value="1">
              <v-row class="">
                <v-col cols="12" md="8" class="pt-6 pb-6">
                  <v-card-text>
                    <v-form class="signup-form-form" @submit.prevent="generate">
                      <h1
                        class="text-center display-1 mb-10"
                        :class="`${bgColor}--text`"
                      >
                        Qr Scanner App
                      </h1>
                      <v-text-field
                        id="qty"
                        v-model="qty"
                        label=" "
                        name="qty"
                        append-icon="mdi-scissors-cutting"
                        
                        :color="bgColor"
                      />
                      <FormInlineMessage
                        v-if="$v.qty.$error"
                        name="inline-message"
                      >
                      
                        Enter Quantity
                      </FormInlineMessage>
                      <div class="text-danger" v-if="serverErrors.has('url')">
                         Server response : {{ serverErrors.errors.url[0] }}
                      </div>
                      <div class="text-center mt-6">
                        <v-btn type="submit" large :color="bgColor" dark
                          >Submit</v-btn
                        >
                      </div>
                     
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  class="darken-2 vcenter"
                  :class="`${bgColor}`"
                >               
                  <div>
                    <v-card-text :class="`${fgColor}--text`">                     
                      <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="white"
                      >
                        <h5 class="text-center overline mb-3">
                        waiting...
                      </h5>
                      </v-progress-circular>
                      <h5 
                        v-else 
                        class="text-center overline mb-3"

                      >Please enter Quantity</h5>
                    </v-card-text>                    
                  </div>                             

                </v-col>
              </v-row>
            </v-window-item>
            <!--Result-->
            <v-window-item :value="2">
              <v-row class="fill-height">
                <v-col
                  cols="12"
                  md="4"
                  class="darken-2 vcenter"
                  :class="`${bgColor}`"
                >
                  <div>
                    
                    <div class="text-center mb-6 mt-6">
                      <v-btn dark outlined @click="back">Enter more</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8">
                  <QrReader
                    v-if="onQr"
                    class="pr-6 pl-6 pt-6 pb-6" 
                    v-on:result="sendToServer"
                  ></QrReader>                  
                </v-col>
                 
              </v-row>
            </v-window-item>
            
            
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>

<script>
  import axios from 'axios';
  import { validationMixin } from 'vuelidate';
  import { required, decimal, integer, alpha } from 'vuelidate/lib/validators';
  import { minLength } from 'vuelidate/lib/validators';
  import { Errors } from 'form-backend-validation';

  import QrReader from './QrReader.vue';
  import FormInlineMessage from './FormInlineMessage';

  export default {
  name: 'Home',
  components: {
    QrReader,
    FormInlineMessage
  },
  mixins: [validationMixin],
  
  props: {
    source: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: 'indigo'
    },
    fgColor: {
      type: String,
      default: 'white'
    }
  },  
  data: () => ({
    step: 1,
    url:'',
    serverErrors: new Errors(),    
    isLoading:false,
    qty:0, 
    componentKey: 0,
    onQr: true,
     
  }),
  validations: {
    qty: {
      required,
      decimal
        
    },    
  },
  methods: {    
    back() {
      this.step = 1
      this.serverErrors = new Errors();
      this.qty = 0.00;
      this.onQr = false;
    },
    sendToServer(url) {
      var that = this;
      axios.post(url, {qty:this.qty.value}).then(response => {                
                     
      }).catch((error) => {          
          that.serverErrors = new Errors(error.response.data.errors)         
      });

    },
    generate(){
      this.onQr = true;
      var that = this;
      this.$v.$touch();
      if (this.$v.$error) return;    
      this.isLoading = true;
      
      setTimeout(function(){
        
            that.isLoading = false; 
            that.step = 2; 
          
      }, 2000)              
    },

    forceRerender() {
      this.componentKey += 1;
      console.log(this.$refs.qr)
    },

  }
};
</script>
<style scoped lang="scss">
  .v-input__icon--double .v-input__icon {
    margin-left: -4.25rem !important;
  }
  a.no-text-decoration {
    text-decoration: none;
  }
  #signinup-form {
    max-width: 75rem;
  }
  .signup-form-form {
    max-width: 23rem;
    margin: 0 auto;
  }
  .card {
    overflow: hidden;
  }
  .vcenter {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .v-progress-circular {
    margin: 1rem;
  }
</style>
