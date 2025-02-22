<template>
    <div>
        <h2 class="text-center"> List of Workers</h2>
        <div class="d-flex flex-column align-center pt-4 pb-4" style="gap:1rem">
            <v-card v-for="(queue) of queues" :key="queue.key"  @click="getQueue(queue.key)" class="container" elevation="0">
                <v-card-title>{{ queue.name }}</v-card-title>
            </v-card>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
export default defineComponent({
    name:'home',
    data() {
        return {
            queues:[]
        }
    },
    mounted() {
      this.getAllQueues()  
    },
    methods: {
        getQueue(key){
            this.$router.push({
                name:'queue',
                params:{
                    name:key
                }
            })
        },
        capitalizeName(name){
            let split= name.split('-')
            for(let i in split){
                split[i]=split[i].charAt(0).toUpperCase() + split[i].slice(1);
            }
            return split.join(' ')
        },
        async getAllQueues(){
           try{
               let query= await axios({
                   method: 'get',
                   url: 'http://localhost:3000/getAllQueues',
               });
               console.log(query.data?.queues)
               for(let key of query.data.queues){
                    this.queues.push({
                        key:key,
                        name:this.capitalizeName(key)
                    })
               }
           }catch(er){
            console.log(er)
           }
        }
    },
})
</script>
<style>
.container{
    padding: 1rem;
    cursor: pointer;
    text-align: center;
    border: 1px solid !important;
    width: fit-content;
    background: rgb(180, 189, 247) !important;
}
</style>