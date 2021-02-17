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
                        Парикмахер Ссылок
                      </h1>
                      <v-text-field
                        id="url"
                        v-model="url"
                        label="Присаживайтесь"
                        name="url"
                        append-icon="mdi-scissors-cutting"
                        type="text"
                        :color="bgColor"
                      />
                      <FormInlineMessage
                        v-if="$v.url.$error"
                      >
                      
                        заполните поле. Минимум три знака
                      </FormInlineMessage>
                      <div class="text-danger" v-if="serverErrors.has('url')">
                          Ответ с сервера : {{ serverErrors.errors.url[0] }}
                      </div>
                      <div class="text-center mt-6">
                        <v-btn type="submit" large :color="bgColor" dark
                          >подстричь</v-btn
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
                        ван момент плиз...
                      </h5>

                      </v-progress-circular>
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
                    
                    <div class="text-center mb-6">
                      <v-btn dark outlined @click="back">давай еще</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class=" pt-6 pb-6">



                  <QrReader
                    v-if="onQr"
                  ></QrReader>









                  <!-- <v-card-text>
                    
                    <h4
                        class="text-center display-0 mb-10"
                        :class="`${bgColor}--text`"
                      >
                        <a href="/">{{shortUrl}}</a>
                      </h4>
                  </v-card-text> -->
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
  import { required } from 'vuelidate/lib/validators';
  import { minLength } from 'vuelidate/lib/validators';
  import { Errors } from 'form-backend-validation';

  import QrReader from './QrReader.vue';

  export default {
  name: 'Home',
  components: {
    QrReader
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
    shortUrl:null, 
    componentKey: 0,
    onQr: true,
     
  }),
  validations: {
    url: {
      required,
      minLength: minLength(3)      
    },    
  },
  methods: {    
    back() {
      this.step = 1
      this.serverErrors = new Errors();
      this.shortUrl = null;
      this.onQr = false;
    },
    generate(){
      this.onQr = true;
      var that = this;
      this.$v.$touch();
      // if (this.$v.$error) return;    
      this.isLoading = true;
      
      setTimeout(function(){
         axios.post('/', {url:this.url.value}).then(response => {               
                that.shortUrl = response.data.url;                
                that.isLoading = false; 
                that.step = 2;     
            }).catch((error) => {
that.step = 2;                
                that.serverErrors = new Errors(error.response.data.errors)
                that.isLoading = false; 
            });
          
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
