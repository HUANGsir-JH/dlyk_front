<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { doGet } from '@/http/httpRequest';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

const userDetail = ref<{
    id: number | null,
    loginAct: string | null,
    password: string | null,
    name: string | null,
    phone: string | null,
    email: string | null,
    accountNoExpired: number | null,
    credentialsNoExpired: number | null,
    accountNoLocked: number | null,
    accountEnabled: number | null,
    createTime: string | null,
    createBy: number | null ,
    editTime: string | null,
    editBy: number | null ,
    lastLoginTime: string | null,
}>({
    id: null,
    loginAct: null,
    password: null,
    name: null,
    phone: null,
    email: null,
    accountNoExpired: null,
    credentialsNoExpired: null,
    accountNoLocked: null,
    accountEnabled: null,
    createTime: null,
    createBy: null,
    editTime: null,
    editBy: null,
    lastLoginTime: null
}) // 用户详情数据
const editName = ref<string|null>(null) // 编辑人姓名
const createName = ref<string|null>(null) // 创建人姓名
const router = useRouter()// 用于路由跳转
const route = useRoute() // 获取路由参数
const userId = ref(route.params.id) // 获取路由参数中的用户ID

const getDetail = () => {
    doGet('/api/user', {
        id: userId.value,
    }).then((res) => {
        if (res.data.code === 200) {
            userDetail.value = res.data.data;
            getEditName();
            getCreateName();
        } else {
            ElMessage.error('获取数据失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('获取数据失败，请稍后重试！');
    });
}

const getEditName = () => {
    if (userDetail.value.editBy === null) {
        return '无';
    } else {
        doGet('/api/user', {
            id: userDetail.value.editBy,
        }).then((res) => {
            if (res.data.code === 200) {
                editName.value = res.data.data.name;
            } 
        })
    }
}

const getCreateName = () => {
    if (userDetail.value.createBy === null) {
        return '系统';
    } else {
        doGet('/api/user', {
            id: userDetail.value.createBy,
        }).then((res) => {
            if (res.data.code === 200) {
                createName.value =res.data.data.name;
            }
        })
    }
}

const goBack = () => {
    router.push('/dashboard/user')
}

onMounted(() => {
    getDetail()
})
// 监听路由参数变化
watch(() => {
    userId.value = route.params.id
}, (newId) => {
    getDetail()
})
</script>

<template>
    <div class="user-detail-container">
        <h3 class="page-title">用户详情</h3>
        <el-divider />

        <el-card class="detail-card" shadow="hover">
            <el-form :model="userDetail" label-width="150px" class="detail-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="ID">
                            <span class="detail-text">{{ userDetail.id }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账号">
                            <span class="detail-text">{{ userDetail.loginAct }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密码">
                            <span class="detail-text">{{ userDetail.password == null ? '无' : userDetail.password
                                }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <span class="detail-text">{{ userDetail.name }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机">
                            <span class="detail-text">
                                {{ userDetail.phone === null ? '无' : userDetail.phone }}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱">
                            <span class="detail-text">{{ userDetail.email }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">账户状态</el-divider>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="账号未过期">
                            <el-tag :type="userDetail.accountNoExpired === 1 ? 'success' : 'danger'">
                                {{ userDetail.accountNoExpired === 1 ? '是' : '否' }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码未过期">
                            <el-tag :type="userDetail.credentialsNoExpired === 1 ? 'success' : 'danger'">
                                {{ userDetail.credentialsNoExpired === 1 ? '是' : '否' }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="账号未锁定">
                            <el-tag :type="userDetail.accountNoLocked === 1 ? 'success' : 'danger'">
                                {{ userDetail.accountNoLocked === 1 ? '是' : '否' }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账号是否启用">
                            <el-tag :type="userDetail.accountEnabled === 1 ? 'success' : 'danger'">
                                {{ userDetail.accountEnabled === 1 ? '是' : '否' }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">系统信息</el-divider>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="创建时间">
                            <span class="detail-text">{{ userDetail.createTime }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建人">
                            <span class="detail-text">{{ createName === null ? '系统' : createName
                                }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="编辑时间">
                            <span class="detail-text">{{ userDetail.editTime === null ? '无' : userDetail.editTime
                                }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编辑人">
                            <span class="detail-text">{{ editName === null ? '无' : editName }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="最后登录时间">
                            <span class="detail-text">{{ userDetail.lastLoginTime === null ? '无' :
                                userDetail.lastLoginTime }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <div class="action-bar">
            <el-button type="primary" size="large" @click="goBack">返回</el-button>
        </div>
    </div>
</template>

<style scoped>
.user-detail-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    scroll-behavior: smooth;
}

.page-title {
    font-size: 18px;
    color: #303133;
    margin-bottom: 20px;
    font-weight: 600;
}

.detail-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.detail-form {
    padding: 10px;
}

.detail-text {
    color: #606266;
    font-size: 14px;
}

.action-bar {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}

:deep(.el-divider__text) {
    font-size: 16px;
    font-weight: 500;
    color: #409EFF;
}

:deep(.el-card__body) {
    padding: 20px 30px;
}
</style>