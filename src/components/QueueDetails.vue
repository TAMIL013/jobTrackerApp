<template>
    <div class="pl-4 pr-4">
        <v-dialog v-model="showDialog" width="30vw" >
            <v-card>
                <v-card-title style="background-color: rgb( 24, 103, 192);color: #fff;" >Add Job</v-card-title>
                <v-card-text>
                    <v-text-field v-model="job.type" variant="outlined" label="Type"></v-text-field>
                    <div>
                        <v-textarea v-model="job.data"  variant="outlined" label="Data"></v-textarea>
                        <span v-if="!isValid" style="color: red;"> Invalid JSON data</span>
                    </div>
                    <datepicker v-model="job.run_at" class="date-style"></datepicker>
                </v-card-text>
                <v-card-actions>
                    <v-btn variant="flat" color="primary" @click="saveJob()">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="d-flex flex-row align-center" style="height: 64px;" >
            <h2 class="text-center"> {{ capitalizeName(this.$route.params.name) }}</h2>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="primary" @click="showAddDialog()"> Add Jobs</v-btn>
        </div>
        <v-divider :thickness="3" style="opacity: .5;"></v-divider>
        <div class="d-flex flex-wrap">
            <v-card v-for="(data,key) of status" :key="key" class="status-card"  @click="openStatus(key)"
                :style="{ backgroundColor: getStatusColor(key), color: 'white' }" elevation="0" >
                <div>
                    <v-card-title  > {{ data.name }}</v-card-title>
                    <v-card-text style="height: fit-content;">
                        <div>
                            <p>No of Jobs
                                <span> {{ data.count }}</span>
                            </p>
                        </div>
                    </v-card-text>
                </div>
            </v-card>

        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import Datepicker from 'vuejs3-datepicker';
export default defineComponent({
    name:'queue details',
    components:{
        Datepicker
    },
    data() {
        return {
            showDialog:false,
            status:{
                'active':{count:0,name:'Active'},
                'pending':{count:0,name:'Pending'},
                'delayed':{count:0,name:'Delayed'},
                'completed':{count:0,name:'Completed'},
                'failed':{count:0,name:'Failed'},
            },
            job:{
                type:'',
                data:'{"d":"ta"}',
                run_at:null
            },
            isValid:true,
            disableDate:{
                to:new Date(),
                preventDisableDateSelection: true
            }
        }
    },
    mounted() {
            this.getAllStatus()
    },
    methods: {
        getStatusColor(status){
            const statusColors = {
                completed: "#28A745",
                pending: "#FFC107",
                failed: "#DC3545",
                active: "#007BFF", 
                delayed: "#FD7E14"
            };
            return statusColors[status] || "#6C757D";
        },
        showAddDialog(){
            this.showDialog=true
        },
        openStatus(key){
            this.$router.push({
                name:'status',
                params:{
                    status:key,
                    name:this.$route.params.name
                },
                query:{
                    count:this.status[key].count.toString()
                }
            })
        },
        async saveJob(){
            let data= this.isValidJSON(this.job.data)
            let name=this.$route.params.name
            if(this.isValid){
                try{
                    let query= await axios({
                        method:'post',
                        url:'http://localhost:3000/addJob',
                        data:{
                            'queue_name': name,
                            'type':this.job.type,
                            'data':data,
                            'run_at':this.job.run_at,
                        },
                        headers:{
                            'Content-Type':'application/json'
                        }    
                    })
                    alert('Job added successfully')
                    this.getAllStatus()
                }catch(er){
                    console.error(er);
                    alert('Error can\'t add job')
                }
                this.showDialog=false
            }
        },
        isValidJSON(text){
            if (typeof text !== 'string' || (typeof text === 'string' && text.length === 0)) {
                this.isValid=false
                return ;
            }
            try {
                let data=JSON.parse(text);
                this.isValid = true;
                return data
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
    height: 8rem;
    cursor: pointer;
    border: 1px solid lightgrey;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.vuejs3-datepicker__calendar {
    position: relative !important;
    width: 100%;
}
.vuejs3-datepicker{
    width: 100% !important;
}
.vuejs3-datepicker__value{
    border: 1px solid rgb(0, 0, 0,.3) !important;
    min-width: 100%;
}
.vuejs3-datepicker__calendar-topbar{
 background-color: rgb( 24, 103, 192) !important;
}
.vuejs3-datepicker__calendar .cell.selected{
 background-color: rgb( 24, 103, 192) !important;
}
.vuejs3-datepicker__calendar .cell:hover{
 background-color: rgba( 24, 103, 192,0.2) !important;
 border: 1px solid rgb( 24, 103, 192) !important;
}
.v-text-field .v-field {
    background-color: rgba( 24, 103, 192,0.1) !important;
    border: none !important; 
}
</style>