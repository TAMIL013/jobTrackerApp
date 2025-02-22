<template>
  <div  class="root-job-deatils">
    <div class="d-flex flex-row align-center" style="height: 64px;">
      <h2 class="text-center"> Job Table</h2>
      <v-spacer></v-spacer>
      <v-btn :disabled="!selectedJobs.length" color="error" @click="deleteJobs()"> Delete</v-btn>
      <div class="limit-style">
        <v-select :items="limits" v-model="limit" variant="outlined" label="Limit" density="compact"
          @update:model-value="setLimit()"></v-select>
      </div>
    </div>
    <v-divider :thickness="3" style="opacity: .5;"></v-divider>
    <v-table class="job-table">
      <thead>
        <tr  style="background-color:rgba( 24, 103, 192,0.2)">
          <th class="text-center"> <v-checkbox v-model="selectAllJob" @update:model-value="selectAllJobs()" color="primary"></v-checkbox>
          </th>
          <th class="text-center">No:</th>
          <th class="text-center">status</th>
          <th class="text-center">Job Id</th>
          <th class="text-center">Type</th>
          <th class="text-center">Created At</th>
          <th class="text-center">Updated At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in jobs" :key="item.job_id" class="table-row">
          <td> <v-checkbox :value="item.job_id" v-model="selectedJobs" color="primary"></v-checkbox></td>
          <td>{{ index + 1 }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.job_id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.created_at }}</td>
          <td>{{ item.updated_at }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-divider :thickness="2" style="opacity: .5;"></v-divider>
    <div class="text-center pagination">
      <v-pagination
        v-model="currentPage"
        :length="page"
        :total-visible="7" @update:model-value="getPageData()"
      ></v-pagination>
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
      lastEvaluatedKeys: {
        "1": null
      },
      jobs: [],
      limits: [5, 10, 100, 1000],
      page: 1,
      currentPage: 1,
      count: 12,
      selectedJobs: [],
      selectAllJob: false
    };
  },
  mounted() {
    this.count = Number(this.$route.query.count)
    this.setLimit();
    // this.getAllJobs();
  },
  methods: {
    selectAllJobs() {
      if (this.selectAllJob) {
        this.selectedJobs = this.jobs.map(job => job.job_id)
      } else {
        this.selectedJobs = []
      }
    },
    getPageData() {
      this.getAllJobs()
    },
    setLimit() {
      this.page = (this.count < this.limit) ? 1 : Math.ceil(this.count / this.limit)
      this.jobs = []
      this.currentPage = 1
      this.lastEvaluatedKeys = { "1": null }
      this.getAllJobs()
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
            lastEvaluatedKey: this.lastEvaluatedKeys[this.currentPage.toString()]
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        let items = query.data;
        this.jobs = query.data.data;
        if (this.currentPage < this.page)
          this.lastEvaluatedKeys[(this.currentPage + 1).toString()] = query.data.lastEvaluatedKey;
        console.log(items);
      } catch (er) {
        console.log(er);
      }
    },
    async deleteJobs() {
      let name = this.$route.params.name;
      let status = this.$route.params.status;
      try {
        let query = await axios({
          method: "post",
          url: "http://localhost:3000/deleteJobs",
          data: {
            queue_name: name,
            status: status,
            idList: this.selectedJobs
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (query.data.failedItems) {
          alert(`Following Jobs are failed to deleted ${query.data.failedItems}`)
        } else {
          alert('Jobs deleted successfully')
        }
        this.setLimit();
      } catch (er) {
        console.log(er)
        alert('Error while delete the jobs')
      }
    }
  }
});
</script>
<style>
.job-table {
  height: 85%;
  border:1px solid rgba( 24, 103, 192,0.2) !important;
}
.table-row{
  text-align: center;
}
.limit-style{
  width: 150px;
  margin-left:1rem;
}
.limit-style .v-messages{
 display: none !important;
} 
.limit-style .v-input__details {
  min-height: 0px !important;
  padding: 0px !important;
}
.root-job-deatils{
  display: flex;
  flex-direction: column;
  height: calc(100vh - 96px);
  padding: 0px 1rem;
}
.pagination{
  flex:1;
  justify-content: center;
  align-items: center;
  display: flex;
}
.v-pagination__item--is-active{
  background-color: rgb( 24, 103, 192) !important;
  color: #fff !important;
}
.v-pagination__item{
  border-radius:.35rem ;
}
.v-pagination__item:hover{
  background-color: rgba( 24, 103, 192,0.2) !important;

}
.v-checkbox .v-selection-control {
  min-height: none !important;
}
</style>