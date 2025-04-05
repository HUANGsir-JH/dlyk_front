<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { doGet, doPost, doPut, doDelete } from '@/http/httpRequest';
import { ElMessage } from 'element-plus'

const dicTypeList = ref<{
    id: number,
    typeCode: string
}[]>([])
const getDicTypeList = () => {
    doGet('/api/dicType').then((res) => {
        if (res.data.code === 200) {
            dicTypeList.value = res.data.data;
        }
    });
}
const filterData = ref({
    typeCode: null
})

const dicValueList = ref<{
    id: number,
    typeCode: string,
    typeValue: string,
    remark: string
}[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const getDicValueList = () => {
    doGet('/api/dicValue', {
        current: currentPage.value,
        typeCode: filterData.value.typeCode,
    }).then((res) => {
        if (res.data.code === 200) {
            dicValueList.value = res.data.data.list;
            total.value = res.data.data.total;
            pageSize.value = res.data.data.pageSize;
        } else {
            ElMessage.error("获取字典值列表失败")
            console.log(res.data)
        }
    }).catch((err) => {
        ElMessage.error('获取字典值列表服务异常')
    });
}

const reset = () => {
    filterData.value.typeCode = null
    currentPage.value = 1
    getDicValueList()
}

onMounted(() => {
    getDicTypeList()
    getDicValueList()
})
</script>

<template>

    <el-form :inline="true" :model="filterData" class="filter-form" style="margin-bottom: 20px;">
        <el-select v-model="filterData.typeCode" placeholder="请选择字典类型" style="width: 200px;" clearable>
            <el-option v-for="item in dicTypeList" :key="item.id" :label="item.typeCode" :value="item.typeCode"></el-option>
        </el-select>
        <el-button type="primary" @click="getDicValueList">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
    </el-form>
    <el-divider></el-divider>
    <el-button type="primary">添加新字典值</el-button>
    <el-table :data="dicValueList" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column prop="typeCode" label="字典类型" width="180"></el-table-column>
        <el-table-column prop="typeValue" label="字典值" width="180"></el-table-column>
        <el-table-column prop="remark" label="备注">
            <template #default="scope">
                <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
                <span v-else>
                    <el-tag type="info" size="small">暂无</el-tag>
                </span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template #default="scope">
                <el-button type="primary" @click="">编辑</el-button>
                <el-button type="danger" @click="">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-divider></el-divider>

    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
        v-model:current-page="currentPage" @update:current-page="getDicValueList" />

</template>

<style scoped>
.filter-form {
    margin-bottom: 20px;
}
.filter-form .el-button {
    margin-left: 10px;
}

</style>