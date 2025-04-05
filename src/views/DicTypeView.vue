<script setup lang="ts">
import {ref, onMounted} from 'vue'
import { doDelete, doGet, doPost,doPut } from '@/http/httpRequest';
import { ElMessage, ElMessageBox } from 'element-plus';

const dicTypeList = ref([])
const getDicTypeList = () => {
    doGet('/api/dicType',{}).then((res) => {
        if (res.data.code === 200) {
            dicTypeList.value = res.data.data
        } else {
            console.error('获取字典类型失败')
        }
    }).catch((error) => {
        console.error('获取字典服务异常')
    })
}
// 添加新字典类型
const newDicType = ref({
    typeCode: '',
    typeName: '',
    remark: ''
})
const newDicTypeRules = {
    typeCode: [
        { required: true, message: '请输入字典类型代码', trigger: 'blur' },
        { min: 1, max: 10, message: '字典类型代码长度在 1 到 10 个字符之间', trigger: 'blur' }
    ],
    typeName: [
        { required: true, message: '请输入字典类型名称', trigger: 'blur' },
        { min: 1, max: 10, message: '字典类型名称长度在 1 到 10 个字符之间', trigger: 'blur' }
    ],
    remark: [
        { required: true, message: '请输入备注', trigger: 'blur' },
        { min: 0, max: 128, message: '备注长度在 0 到 128 个字符之间', trigger: 'blur' }
    ]
}
const addNewDicTypeDialogVisible = ref(false)
const addNewDicTypeForm = ref()
const addNewDicType = () => {
    addNewDicTypeDialogVisible.value = true
    newDicType.value = {
        typeCode: '',
        typeName: '',
        remark: ''
    }
}
const submitNewDicType = () => {
    addNewDicTypeForm.value.validate((valid: any) => {
        if (valid) {
            doPost('/api/dicType', newDicType.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('添加成功')
                    getDicTypeList()
                    addNewDicTypeDialogVisible.value = false
                    newDicType.value = {
                        typeCode: '',
                        typeName: '',
                        remark: ''
                    }
                } else {
                    ElMessage.error('添加失败')
                }
            }).catch((error) => {
                ElMessage.error('添加字典类型服务异常')
            })
        } else {
            ElMessage.warning('请填写完整的字典类型信息')
        }
    })
}

// 批量删除
const selectedRows = ref<number[]>([])
const handleSelectionChange = (val: any) => {
    selectedRows.value = []
    val.forEach((row:any)=>{
        selectedRows.value.push(row.id)
    })
}
const batchDelete = () => {
    if(selectedRows.value.length === 0) {
        ElMessage.warning('请至少选择一条记录')
        return
    }
    ElMessageBox.confirm('确定要删除选中的字典类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let ids = selectedRows.value.join(',')
        doDelete('/api/dicType/batchDelete', {
            ids: ids
        }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getDicTypeList()
            } else {
                ElMessage.error('删除失败')
            }
        }).catch((error) => {
            ElMessage.error('删除字典类型服务异常')
        })
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 删除字典类型
const deleteDicType = (id: number) => {
    ElMessageBox.confirm('确定要删除该字典类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        doDelete('/api/dicType/' + id, {}).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                getDicTypeList()
            } else {
                ElMessage.error('删除失败')
            }
        }).catch((error) => {
            ElMessage.error('删除字典类型服务异常')
        })
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 编辑字典类型
const editDicTypeDialogVisible = ref(false)
const editDicTypeForm = ref()
const editDicTypeData = ref({
    id: 0,
    typeCode: '',
    typeName: '',
    remark: ''
})
const editDicType = (row: any) => {
    editDicTypeDialogVisible.value = true
    editDicTypeData.value = {
        id: row.id,
        typeCode: row.typeCode,
        typeName: row.typeName,
        remark: row.remark
    }
    console.log('Editing dictionary type:', editDicTypeData.value);
}
const submitEditDicType = () => {
    editDicTypeForm.value.validate((valid: any) => {
        if (valid) {
            doPut('/api/dicType', editDicTypeData.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('编辑成功')
                    getDicTypeList()
                    editDicTypeDialogVisible.value = false
                    editDicTypeData.value = {
                        id: 0,
                        typeCode: '',
                        typeName: '',
                        remark: ''
                    }
                } else {
                    ElMessage.error('编辑失败')
                }
            }).catch((error) => {
                ElMessage.error('编辑字典类型服务异常')
            })
        } else {
            ElMessage.warning('请编辑完整的字典类型信息')
        }
    })
}



onMounted(() => {
    getDicTypeList();
})

</script>

<template>
    <el-button @click="addNewDicType" type="primary" v-permission="'dictype:add'">添加新字典</el-button>
    <el-button type="danger" @click="batchDelete" v-permission="'dictype:delete'">批量删除</el-button>
    <el-divider>字典列表</el-divider>
    <el-table :data="dicTypeList" style="width: 100%" empty-text="暂无数据" stripe size="default" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60"/>
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="typeCode" label="字典类型代码" width="250" show-overflow-tooltip/>
        <el-table-column prop="typeName" label="字典类型名称" width="250" show-overflow-tooltip/>
        <el-table-column prop="remark" label="备注" width="350" show-overflow-tooltip/>
        <el-table-column label="操作" width="160">
            <template #default="scope">
                <el-button type="primary" @click="editDicType(scope.row)" v-permission="'dictype:edit'">编辑</el-button>
                <el-button type="danger" @click="deleteDicType(scope.row.id)" v-permission="'dictype:delete'">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加字典类型对话框 -->
    <el-dialog title="添加字典类型" v-model="addNewDicTypeDialogVisible" width="50%">
        <el-form :model="newDicType" label-width="120px" :rules="newDicTypeRules" ref="addNewDicTypeForm">
            <el-form-item label="字典类型代码" prop="typeCode">
                <el-input v-model="newDicType.typeCode"></el-input>
            </el-form-item>
            <el-form-item label="字典类型名称" prop="typeName">
                <el-input v-model="newDicType.typeName"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="newDicType.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addNewDicTypeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitNewDicType">确 定</el-button>
        </div> 
    </el-dialog>

    <!-- 编辑字典类型对话框 -->
    <el-dialog title="编辑字典类型" v-model="editDicTypeDialogVisible" width="50%">
        <el-form :model="editDicTypeData" label-width="120px" :rules="newDicTypeRules" ref="editDicTypeForm">
            <el-form-item label="字典类型代码" prop="typeCode">
                <el-input v-model="editDicTypeData.typeCode"></el-input>
            </el-form-item>
            <el-form-item label="字典类型名称" prop="typeName">
                <el-input v-model="editDicTypeData.typeName"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="editDicTypeData.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editDicTypeDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditDicType">确 定</el-button>
        </div>
    </el-dialog>
</template>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}
</style>