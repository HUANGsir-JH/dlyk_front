<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doGet,doPost } from '@/http/httpRequest';
import { ElMessage } from 'element-plus';

const ownerOptions = ref<{
    id: number | null,
    name: string | null
}[]>([])

const newActivity = ref<{
    ownerId: number | null,
    name: string | null,
    startTime: null | string,
    endTime: null | string,
    cost: number | null,
    description: string | null,
}>({
    ownerId: null,
    name: null,
    startTime: null,
    endTime: null,
    cost: null,
    description: null
})

const activityRules = ref({
    ownerId: [
        { required: true, message: '请选择负责人', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    startTime: [
        { required: true, message: '请选择开始时间', trigger: 'blur' }
    ],
    endTime: [
        { required: true, message: '请选择结束时间', trigger: 'blur' }
    ],
    cost: [
        { required: true, message: '请输入活动预算', trigger: 'blur' },
        { type: 'number', message: '请输入数字', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入活动描述', trigger: 'blur' }
    ]
})

const newActivityFormRef = ref()

const getOwnerNames = () => {
    doGet("/api/owner", {}).then((res) => {
        if (res.data.code === 200) {
            ownerOptions.value = res.data.data;
        } else {
            ElMessage.error('负责人数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('负责人数据获取失败，请稍后重试！');
    })
}

const submitNewActivity = () => {
    console.log(newActivity.value);
    newActivityFormRef.value.validate((valid: boolean) => {
        if (valid) {
            doPost('/api/activity', newActivity.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('活动添加成功');
                    back();
                } else {
                    ElMessage.error('活动添加失败，请稍后重试');
                }
            }).catch((err) => {
                ElMessage.error('服务端异常，请稍后重试');
            })
        } else {
            ElMessage.error('表单验证失败，请检查输入');
        }
    })
}

const router = useRouter();
const back = () => {
    router.push({ path: '/dashboard/activity' });
}
onMounted(() => {
    getOwnerNames();
})
</script>

<template>
    <div class="activity-add-container">
        <el-card class="activity-form-card">
            <template #header>
                <div class="card-header">
                    <h2>添加新活动</h2>
                </div>
            </template>
            <el-form :model="newActivity" ref="newActivityFormRef" label-width="100px" :rules="activityRules"
                class="activity-form">
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                        <el-form-item label="负责人" prop="ownerId">
                            <el-select v-model="newActivity.ownerId" placeholder="请选择负责人" clearable
                                class="full-width-input">
                                <el-option v-for="item in ownerOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                        <el-form-item label="活动名称" prop="name">
                            <el-input v-model="newActivity.name" placeholder="请输入活动名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                        <el-form-item label="开始时间" prop="startTime">
                            <el-date-picker v-model="newActivity.startTime" type="datetime" placeholder="选择开始时间"
                                value-format="YYYY-MM-DD HH:mm:ss" class="full-width-input" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker v-model="newActivity.endTime" type="datetime" placeholder="选择结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss" class="full-width-input" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="活动预算" prop="cost">
                    <el-input-number :min="1" :precision="2" :step="100" size="large" controls-position="right"
                        v-model="newActivity.cost" class="budget-input" />
                </el-form-item>

                <el-form-item label="活动描述" prop="description">
                    <el-input v-model="newActivity.description" type="textarea" placeholder="请输入活动描述" clearable
                        :autosize="{ minRows: 8, maxRows: 12 }" class="description-input" />
                </el-form-item>

                <el-form-item class="form-buttons">
                    <el-button type="primary" size="large" @click="submitNewActivity" class="submit-btn">提交</el-button>
                    <el-button type="default" size="large" @click="back" class="back-btn">返回</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.activity-add-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.activity-form-card {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #303133;
}

.activity-form {
    padding: 10px;
}

.full-width-input {
    width: 100%;
}

.budget-input {
    width: 220px;
}

.description-input {
    width: 100%;
}

.form-buttons {
    margin-top: 25px;
    display: flex;
    justify-content: center;
}

.submit-btn,
.back-btn {
    min-width: 120px;
    margin: 0 10px;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.3s;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.back-btn:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .activity-add-container {
        padding: 10px;
    }

    .form-buttons {
        flex-direction: column;
        align-items: center;
    }

    .submit-btn,
    .back-btn {
        width: 100%;
        margin: 5px 0;
    }
}
</style>