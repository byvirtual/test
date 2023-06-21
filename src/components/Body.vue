<template>
    <div class="flex rounded-md mx-2 my-4 p-4 h-full gap-1" style="box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);">
        <div class="w-full h-full">
            <div class="flex flex-col gap-4 border p-2 rounded-md h-full">

                <div class="flex items-center gap-4">
                    <div class="flex flex-1 h-10 items-center  border px-2 gap-4 rounded-md">
                        <input class="flex-1 w-0 focus:outline-none " v-model="inputtext" @keydown.enter="search" />
                        <button
                            class="w-20 h-8 bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white text-sm  rounded"
                            @click="search">搜索</button>
                    </div>
                    <div class="w-30">
                        <ElCheckboxButton @change="selLocalModule">查看已安装的库</ElCheckboxButton>
                    </div>
                </div>


                <div class="flex-grow h-0">
                    <el-table class="rounded-md" :data="tableData" height="100%" style="width: 100%"
                        @current-change="handleCurrentChange" highlight-current-row @row-dblclick="dblClick">
                        <el-table-column prop="Name" label="名称" show-overflow-tooltip />
                        <el-table-column prop="Version" label="版本" show-overflow-tooltip class-name=" select-none" />
                        <el-table-column prop="Description" label="描述" show-overflow-tooltip class-name=" select-none" />
                        <el-table-column fixed="right" label="操作" width="120">
                            <template #default>
                                <el-button link type="primary" v-if="!isSelLocalModule">安装</el-button>
                                <el-button link type="primary" v-if="isSelLocalModule">更新</el-button>
                                <el-button link type="primary" v-if="isSelLocalModule">移除</el-button>
                            </template>

                        </el-table-column>
                    </el-table>
                </div>
            </div>


        </div>

    </div>
</template>
    
<script setup lang='ts'>
import { ElTable, ElTableColumn, ElCheckboxButton, ElButton, CheckboxValueType } from 'element-plus'
import { postMessage, IPostCallBack } from '../utils/postMessage';
import { reactive, ref } from 'vue';

interface TableData {
    Name: string;
    Version: string;
    Description: string;
}

const inputtext = ref("");
const currentRow = ref();
const isSelLocalModule = ref<CheckboxValueType>(false);

let tableData = reactive<TableData[]>([]);
const search = () => {
    const temp = inputtext.value.trim();
    if (temp != "") {
        //获取数据
        postMessage("vcpkg", "search", { param: temp }, (event: IPostCallBack) => {
            //Object.assign(tableData, event.data);
            tableData.splice(0, tableData.length, ...event.data);
        })
    }
}

const dblClick = (val: TableData | undefined, column: any, event: MouseEvent) => {
    console.log(val?.Name)
    console.log(column)
    console.log(event)
    event.stopPropagation();
}


const handleCurrentChange = (val: TableData | undefined) => {
    currentRow.value = val;

}

const selLocalModule = (val: CheckboxValueType) => {
    isSelLocalModule.value = val;

}



</script>
    
<style scoped></style>