<template>
  <div>
    <!-- <p class="decode-result">Last result: <b>{{ result }}</b></p> -->

    <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
      <div v-if="validationSuccess" class="validation-success">
        This is a URL
      </div>

      <div v-if="validationFailure" class="validation-failure">
        This is NOT a URL!
      </div>

      <div v-if="validationPending" class="validation-pending">
        Long validation in progress...
      </div>
    </qrcode-stream>
  </div>
</template>

<script>

export default {
  name: 'QrReader',


  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null,
      componentKey: 0,
    }
  },

  computed: {
    validationPending () {
      return this.isValid === undefined
        && this.camera === 'off'
    },

    validationSuccess () {
      return this.isValid === true
    },

    validationFailure () {
      return this.isValid === false
    }
  },

  methods: {

    onInit (promise) {
      alert('initiating camera')
      promise
        .catch(console.error)
        .then(this.resetValidationState)
    },

    resetValidationState () {
      this.isValid = undefined
    },

    async onDecode (content) {
      //console.log(content)
      this.result = content
      this.turnCameraOff()

      // pretend it's taking really long
      await this.timeout(100)
      this.isValid = content.startsWith('http')
      this.$emit('result', content);

      // some more delay, so users have time to read the message
      await this.timeout(2000)

      this.turnCameraOn()
    },

    turnCameraOn () {
      this.camera = 'auto'
    },

    turnCameraOff () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  },
  created() {
    //alert('comp created')
  }
}
</script>

<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
</style>