<template>
    <div>
        <el-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs">
            <el-tab-pane label="table1">User1</el-tab-pane>
            <el-tab-pane label="Config">Config</el-tab-pane>
            <el-tab-pane label="Role">Role</el-tab-pane>
            <el-tab-pane label="Task">Task</el-tab-pane>
        </el-tabs>
    </div>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'
import table1 from './table1.vue'
const tabPosition = ref('left')


</script>
    
<style></style>