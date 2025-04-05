<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { doDelete, doGet,doPost,doPut } from '@/http/httpRequest';
import { ElMessage,ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
const userList = ref([])
const total = ref(1)
const pageSize = ref(10)
const currentPage = ref(1)
const router = useRouter()
const addUserDialogVisible = ref(false) // 添加用户弹窗是否可见
const addUserForm = ref<{
    [key: string]: any, // 表示索引签名，允许任意字符串作为键
    loginAct: string,
    loginPwd: string,
    name: string,
    phone: string,
    email: string,
    accountNoExpired: number,
    credentialsNoExpired: number,
    accountNoLocked: number,
    accountEnabled: number
}>({
    loginAct: '',
    loginPwd: '',
    name: '',
    phone: '',
    email: '',
    accountNoExpired: 0,
    credentialsNoExpired: 0,
    accountNoLocked: 0,
    accountEnabled: 0,
}) // 添加用户表单数据
const addUserFormRef = ref() // 添加用户表单引用

const editUserForm = ref<{
    [key: string]: any, // 表示索引签名，允许任意字符串作为键
    id: number | null,
    loginAct: string,
    loginPwd: string,
    name: string,
    phone: string,
    email: string,
    accountNoExpired: number,
    credentialsNoExpired: number,
    accountNoLocked: number,
    accountEnabled: number
}>({
    id: null,
    loginAct: '',
    loginPwd: '',
    name: '',
    phone: '',
    email: '',
    accountNoExpired: 0,
    credentialsNoExpired: 0,
    accountNoLocked: 0,
    accountEnabled: 0,
}) // 添加用户表单数据

const rules = ref({
    loginAct: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    loginPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern:/^1[3-9]\d{9}$/, message:'手机号码格式不正确', trigger:'blur'}
    ],
    email:[
        { required:true, message:'请输入邮箱地址', trigger:'blur'},
        { type:'email', message:'邮箱地址格式不正确', trigger:'blur'}
    ]
})

const addUser = () => {
    addUserFormRef.value.validate((valid: boolean) => {
        if (valid) {
            addUserDialogVisible.value = false
            let formData = new FormData();
            for (let field in addUserForm.value) {
                formData.append(field, addUserForm.value[field]);
            }
            doPost('/api/user', formData).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('新增用户成功');
                    getData(currentPage.value);
                } else {
                    ElMessage.error('新增用户失败，请稍后重试！');
                }
            }).catch((err) => {
                ElMessage.error('新增用户失败，请稍后重试！');
            });
        } else {
            ElMessage.error('表单验证失败，请检查输入！');
        }
    });
}

const getData = (currentPage:number) => {
    doGet('/api/users', {
        current: currentPage,
    }).then((res) => {
        if (res.data.code === 200) {
            userList.value = res.data.data.list;
            total.value = res.data.data.total;
            pageSize.value = res.data.data.pageSize;
        }
    }).catch((err) => {
        ElMessage.error('获取数据失败，请稍后重试！');
    });
}

const viewDetail = (row: any) => {
    router.push('/dashboard/user/'+row.id);
}

const editUserFormRef = ref() // 添加用户表单引用
const editUserDialogVisible = ref(false) // 编辑用户弹窗是否可见
const editUser = (row: any) => {
    // 将选中行的数据赋值给编辑表单
    for(let field in editUserForm.value) {
        editUserForm.value[field] = row[field];
    }
    editUserDialogVisible.value = true
}

const editRules = ref({
    loginAct: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    loginPwd: [
        
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
    ]
})

const submitEdit = () => {
    editUserFormRef.value.validate((valid: boolean) => {
        if (valid) {
            editUserDialogVisible.value = false
            let formData = new FormData();
            for (let field in editUserForm.value) {
                if (field !== 'loginPwd') { // 不传递密码
                    formData.append(field, editUserForm.value[field]);
                }
            }
            doPut('/api/user', formData).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('编辑用户成功');
                    getData(currentPage.value);
                } else {
                    ElMessage.error('编辑用户失败，请稍后重试！');
                }
            }).catch((err) => {
                ElMessage.error('编辑用户失败，请稍后重试！');
            });
        } else {
            ElMessage.error('表单验证失败，请检查输入！');
        }
    });
}

const deleteUser = (row:any) => {
    ElMessageBox.confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        doDelete('/api/user', {
            id: row.id,
        }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('删除用户成功');
                getData(currentPage.value);
            } else {
                ElMessage.error('删除用户失败,'+ res.data.msg);
            }
        }).catch((err) => {
            ElMessage.error('删除用户失败，请稍后重试！');
        });
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}

const selectedUsers = ref<number[]>([]) // 选中的用户列表
const handleSelectionChange = (selectedRows: any) => {
    selectedUsers.value = []; // 清空之前的选中用户
    selectedRows.forEach((row: any) => {
        selectedUsers.value.push(row.id);
    });
}

const batchDeleteUsers = () => {
    if (selectedUsers.value.length === 0) {
        ElMessage.warning('请先选择要删除的用户');
        return;
    }
    ElMessageBox.confirm('是否批量删除选中的用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let UserIds = selectedUsers.value.join(',');// 将数组转换为逗号分隔的字符串
        console.log('Selected user IDs:', UserIds);
        doDelete('/api/user/batch', {
            ids: UserIds,
        }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('批量删除用户成功');
                getData(currentPage.value);
            } else {
                ElMessage.error('批量删除用户失败,'+ res.data.msg);
            }
        }).catch((err) => {
            ElMessage.error('批量删除用户失败，请稍后重试！');
        });
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}

onMounted(() => {
    getData(1);
});
</script>

<template>
    <el-button type='primary' @click="addUserDialogVisible = true">新增用户</el-button>
    <el-button type="danger" @click="batchDeleteUsers">批量删除</el-button>
    <hr>
    <el-table :data="userList" style="width: 100%" empty-text="暂无数据" 
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column property="loginAct" label="账号" width="120" show-overflow-tooltip />
        <el-table-column property="name" label="姓名" width="120" show-overflow-tooltip />
        <el-table-column property="phone" label="手机" width="120" show-overflow-tooltip />
        <el-table-column property="email" label="邮箱" show-overflow-tooltip />
        <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column label="操作" width="200" show-overflow-tooltip>
            <template #default="scope">
                <el-button type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
                <el-button type="success" size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table><br>
    <el-pagination background layout="prev, pager, next" :total="total" v-model:current-page="currentPage"
        @update:current-page="getData(currentPage)" />

    <!-- 添加用户弹窗 -->
    <el-dialog v-model="addUserDialogVisible" title="新增用户" width="500" draggable center>
        <el-form :model="addUserForm" label-width="80px" :rules="rules" ref="addUserFormRef">
            <el-form-item label="账号" prop="loginAct">
                <el-input v-model="addUserForm.loginAct" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPwd">
                <el-input v-model="addUserForm.loginPwd" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addUserForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="addUserForm.phone" placeholder="请输入手机"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="addUserForm.accountNoExpired" :true-value="1" :false-value="0">账号未过期</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="addUserForm.credentialsNoExpired" :true-value="1"
                    :false-value="0">密码未过期</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="addUserForm.accountNoLocked" :true-value="1" :false-value="0">账号未锁定</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="addUserForm.accountEnabled" :true-value="1" :false-value="0">账号启用</el-checkbox>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确认新增</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 编辑用户弹窗 -->
    <el-dialog v-model="editUserDialogVisible" title="编辑用户" width="500" draggable center>
        <el-form :model="editUserForm" label-width="80px" :rules="editRules" ref="editUserFormRef">
            <el-form-item label="账号" prop="loginAct">
                <el-input v-model="editUserForm.loginAct" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPwd">
                <el-input v-model="editUserForm.loginPwd" placeholder="请输入密码" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editUserForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
                <el-input v-model="editUserForm.phone" placeholder="请输入手机"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="editUserForm.accountNoExpired" :true-value="1" :false-value="0">账号未过期</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="editUserForm.credentialsNoExpired" :true-value="1"
                    :false-value="0">密码未过期</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="editUserForm.accountNoLocked" :true-value="1" :false-value="0">账号未锁定</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="editUserForm.accountEnabled" :true-value="1" :false-value="0">账号启用</el-checkbox>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确认编辑</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>