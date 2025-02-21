<template>
    <div>
        <v-dialog v-model="showDialog" width="30vw" >
            <v-card>
                <v-card-title>Add Job</v-card-title>
                <v-card-text>
                    <v-text-field v-model="job.status" variant="outlined" label="Type"></v-text-field>
                    <div>
                        <v-textarea v-model="job.data"  variant="outlined" label="Data"></v-textarea>
                        <span v-if="!isValid" style="color: red;"> Invalid JSON data</span>
                        <v-date-picker v-model="job.run_at"></v-date-picker>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" @click="saveJob()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="d-flex flex-row pa-2 header" >
            <h2 class="text-center"> {{ capitalizeName(this.$route.params.name) }}</h2>
            <v-spacer></v-spacer>
            <!-- <v-btn variant="outlined" color="success" @click="showDialog=true"> Add Jobs</v-btn> -->
        </div>
        <v-divider></v-divider>
        <div class="d-flex flex-wrap">
            <v-card v-for="(data,key) of status" :key="key" class="status-card"  @click="openStatus(key)">
                <v-card-title> {{ data.name }}</v-card-title>
                <v-card-text>
                    <div>
                        <p>No of items
                            <span> {{ data.count }}</span>
                        </p>
                    </div>
                </v-card-text>
            </v-card>

        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
export default defineComponent({
    name:'queue details',
    data() {
        return {
            showDialog:false,
            status:{
                'delayed':{count:0,name:'Delayed'},
                'active':{count:0,name:'Active'},
                'failed':{count:0,name:'Failed'},
                'pending':{count:0,name:'Pending'},
                'completed':{count:0,name:'Completed'},
            },
            job:{
                name:'',
                data:'',
                run_at:''
            },
            isValid:true
        }
    },
    mounted() {
            this.getAllStatus()
    },
    methods: {
        openStatus(key){
            this.$router.push({
                name:'status',
                params:{
                    status:key,
                    name:this.$route.params.name
                },
                query:{
                    count:"D"
                }
            })
        },
        saveJob(){
            this.isValidJSON(this.job.data)
            if(this.isValid){

            }
        },
        isValidJSON(text){
            if (typeof text !== 'string' || (typeof text === 'string' && text.length === 0)) {
                this.isValid=false
                return ;
            }
            try {
                JSON.parse(text);
                this.isValid = true;
            } catch (e) {
                console.error('[isValidJSON], invalid JSON text', text);
                this.isValid=false
            }
        },
        getStatusList(){
            let data=[]
            for(let key of Object.keys(this.status)){
                data.push({key:key,name:this.status[key].name})
            }
            return data
        },
        capitalizeName(name){
            let split= name.split('-')
            for(let i in split){
                split[i]=split[i].charAt(0).toUpperCase() + split[i].slice(1);
            }
            return split.join(' ')
        },
        async getAllStatus(){
            let name=this.$route.params.name
            console.log(name)
           try{
               let query= await axios({
                   method: 'post',
                   url: 'http://localhost:3000/getAllStatus',
                   data:{
                        'queue_name': name
                   },
                   headers:{
                        'Content-Type':'application/json'
                   }
               });
               let items=query.data.data
               for(let key of Object.keys(items)){
                    if(this.status[key]) this.status[key].count=items[key]
                    else{
                        this.status[key]={
                            count:items[key],
                            name: key.charAt(0).toUpperCase() + key.slice(1)
                        }
                    }
               }
               console.log(this.status)
           }catch(er){
            console.log(er)
           }
        }
    },
})
</script>
<style>
.status-card{
    margin: 1rem;
    width: 25vw;
    cursor: pointer;
}
.header{
    /* background-color: #efe8f4; */
}
</style>