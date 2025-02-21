<template>
  <div>
    <div class="d-flex flex-row pa-2 header" >
            <h2 class="text-center"> Job Table</h2>
            <v-spacer></v-spacer>
            <div style="width: 150px;">
                <v-select :items="limits" v-model="limit" variant="outlined" label="Limit" @update:model-value="setLimit()"></v-select>
            </div>
            <!-- <v-btn variant="outlined" color="success" @click="showDialog=true"> Add Jobs</v-btn> -->
    </div>
    <v-table style="border: 1px solid;margin:1rem">
      <thead>
        <tr>
          <th class="text-left">status</th>
          <th class="text-left">Job Id</th>
          <th class="text-left">Type</th>
          <th class="text-left">Created At</th>
          <th class="text-left">Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in jobs" :key="item.job_id">
          <td>{{ item.status }}</td>
          <td>{{ item.job_id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.created_at }}</td>
          <td>{{ item.updated_at }}</td>
        </tr>
      </tbody>
    </v-table>
    <div class="text-center">
        <v-container>
        <v-row justify="center">
            <v-col cols="8">
            <v-container class="max-width">
                <v-pagination
                v-model="currentPage"
                :length="page"
                class="my-4"
                ></v-pagination>
            </v-container>
            </v-col>
        </v-row>
        </v-container>
  </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  name: "job",
  data() {
    return {
      limit: 10,
      lastEvaluatedKey: null,
      jobs: [],
      limits:[1,10,100,1000],
      page:1,
      currentPage:1,
      count:10
    };
  },
  mounted() {
    console.log(this.$route.query)
    this.page=(this.count<this.limit)?this.count: this.count/this.limit
    this.getAllJobs();
  },
  methods: {
    setLimit(){
        this.page=(this.count<this.limit)?this.count: this.count/this.limit
    },
    async getAllJobs() {
      let name = this.$route.params.name;
      let status = this.$route.params.status;
      console.log(name);
      try {
        let query = await axios({
          method: "post",
          url: "http://localhost:3000/getAllJobs",
          data: {
            queue_name: name,
            status: status,
            limit: this.limit,
            lastEvaluatedKey: this.lastEvaluatedKey
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        let items = query.data;
        this.jobs = query.data.data;
        this.lastEvaluatedKey = query.data.lastEvaluatedKey;
        console.log(items);
      } catch (er) {
        console.log(er);
      }
    }
  }
});
</script>
<style>
.container {
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  border: 1px solid;
}
</style>