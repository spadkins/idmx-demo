<template>
  <div class="login">
    <h1>Please Log In</h1>
    <table>
      <tr v-if="errorMsg">
        <td>&nbsp;</td>
        <td>{{errorMsg}}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><input type="text" placeholder="email" v-model="email"/></td>
      </tr>
      <tr>
        <td>Password:</td>
        <td><input type="password" placeholder="password" v-model="password"/></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td><button @click="login">Log In</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
/* @media (min-width: 1024px) { */
  /* .login { */
    /* min-height: 100vh; */
    /* display: flex; */
    /* align-items: center; */
  /* } */
/* } */
</style>

<script>
import axios from 'axios';

export default {
  // props: {
  //   name: String,
  // },
  data() {
    return {
      errorMsg: '',
      email: '',
      password: ''
    }
  },
  computed: {
    ucName() {
      return this.$props.name.toUpperCase();
    }
  },
  methods: {
    async login() {
      console.log('login [%s] u=[%s] p=[%s]', this.$props.name, this.email, this.password);
      // You can now use this.email and this.password here
      // this.$router.push('/profile');
      let loginPayload = {
        "email": this.email, // "spadkins@gmail.com",
        "password": this.password, // "Spadkins5",
        "mode": "cookie"
      };
      let url = "http://localhost:8055/auth/login";
      let response;
      try {
        response = await axios.post(url, loginPayload);
        if (response.errors) {
          this.errorMsg = response.errors[0].message;
        }
        else {
          this.errorMsg = "Welcome!";
        }
      }
      catch (err) {
        console.log('err: ', err);
        console.log('err.response ', err.response);
        console.log('err.response.data ', err.response.data);
        console.log('err.response.data.errors ', err.response.data.errors);
        console.log('err.response.data.errors[0] ', err.response.data.errors[0]);
        console.log('err.response.data.errors[0].message ', err.response.data.errors[0].message);
        // this.errorMsg = err.message;
        this.errorMsg = err.response?.data?.errors[0].message;
        // return;
      }

    }
  },
}
</script>