import Vue from "vue";

import Framework7 from 'framework7'
import Framework7Vue from "framework7-vue"

import '../node_modules/framework7/dist/css/framework7.ios.min.css';

import AppComponent from './app.vue';

Vue.use(Framework7Vue, Framework7)

let app = new Vue({
    el: "#app",
    template: "<app/>",
    framework7: {
        id: "k0bin.gesahu.ios",
        name: "GesaHu",
        theme: "ios",
        routes: [
        ]
    },
    components: {
        'app': AppComponent
    }
});