// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from "../components/Home.vue"
import QueueDetails from "../components/QueueDetails"
import jobDetails from "../components/jobDetails"
const routes = [
  { path: '/', component: Home },
  { name:'queue', path: '/queue/:name', component: QueueDetails,props:true },
  { name:'status', path: '/queue/:name/status/:status', component: jobDetails,props:true ,meta:{count:true}},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
