<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { doPost, doGet } from '@/http/httpRequest'

const router = useRouter()

// 表单数据模型
const formData = reactive({
    fullName: "",//
    phone: "",//
    weixin: "",//
    qq: "",//
    email: "",//
    needLoan: null,//
    intentionState: null,//
    intentionProduct: null,//
    state: null,//
    source: null,//
    nextContactTime: "",//
    ownerId: null,//
    activityId: null,//
    appellation: null,
    address: "",//
    age: null,//
    description: "",//
    job: "",//
    yearIncome: null//
})

// 表单验证规则
const rules = ref({
    fullName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
    ownerId: [{ required: true, message: '请选择负责人', trigger: 'change' }],
    activityId: [{ required: true, message: '请选择所属活动', trigger: 'change' }],
    appellation: [{ required: true, message: '请选择称呼', trigger: 'change' }],
    state: [{ required: true, message: '请选择线索状态', trigger: 'change' }],
    needLoan: [{ required: true, message: '请选择是否需要贷款', trigger: 'change' }]
})

const submitFormRef = ref()
// 提交表单（先空出来）
const submitForm = () => {
    submitFormRef.value.validate((valid: boolean) => {
        if (valid) {
            console.log(formData)
            doPost("/api/clue", formData).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('线索添加成功！')
                    resetForm()
                    router.push('/dashboard/clue')
                } else {
                    ElMessage.error('线索添加失败，请稍后重试！')
                }
            }).catch((err) => {
                ElMessage.error('线索添加服务异常，请稍后重试！')
            })
        } else {
            ElMessage.error('请检查表单填写是否完整！')
            return false
        }
    })
}

// 重置表单
const resetForm = () => {
    if (submitFormRef.value) {
        submitFormRef.value.clearValidate()
    }
    formData.fullName = ""
    formData.phone = ""
    formData.weixin = ""
    formData.qq = ""
    formData.email = ""
    formData.needLoan = null
    formData.intentionState = null
    formData.intentionProduct = null
    formData.state = null
    formData.source = null
    formData.nextContactTime = ""
    formData.ownerId = null
    formData.activityId = null
    formData.appellation = null
    formData.address = ""
    formData.age = null
    formData.description = ""
    formData.job = ""
    formData.yearIncome = null
}

// 获取线索添加的选择项数据
const ownerList = ref<{
    [key: string | number]: any,
    id: number,
    name: string
}[]>([])
const getOwnerNames = () => {
    doGet("/api/owner", {}).then((res) => {
        if (res.data.code === 200) {
            ownerList.value = res.data.data;
        } else {
            ElMessage.error('负责人数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('负责人数据获取失败，请稍后重试！');
    })
}

const activityList = ref<{
    [key: string | number]: any,
    id: number,
    name: string
}[]>([])
const getActivityList = () => {
    doGet("/api/activityList", {}).then((res) => {
        if (res.data.code === 200) {
            activityList.value = res.data.data;
        } else {
            ElMessage.error('活动数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('活动数据获取服务异常，请稍后重试！');
    })
}

const appeallationList = ref<{
    [key: string | number]: any,
    id: number,
    appellation: string
}[]>([])
const getAppeallationList = () => {
    doGet("/api/appeallationList", {}).then((res) => {
        if (res.data.code === 200) {
            appeallationList.value = res.data.data;
        } else {
            ElMessage.error('称谓数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('称谓数据获取服务异常，请稍后重试！');
    })
}

const needLoanList = ref<{
    [key: string | number]: any,
    id: number,
    isNeedLoan: string
}[]>([])
const getNeedLoanList = () => {
    doGet("/api/needLoanList", {}).then((res) => {
        if (res.data.code === 200) {
            needLoanList.value = res.data.data;
        } else {
            ElMessage.error('是否需要贷款数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('是否需要贷款数据获取服务异常，请稍后重试！');
    })
}

const intentionStateList = ref<{
    [key: string | number]: any,
    id: number,
    intentionState: string
}[]>([])
const getIntentionStateList = () => {
    doGet("/api/intentionStateList", {}).then((res) => {
        if (res.data.code === 200) {
            intentionStateList.value = res.data.data;
        } else {
            ElMessage.error('意向状态数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('意向状态数据获取服务异常，请稍后重试！');
    })
}

const intentionProductList = ref<{
    [key: string | number]: any,
    id: number,
    productName: string
}[]>([])
const getIntentionProductList = () => {
    doGet("/api/intentionProductList", {}).then((res) => {
        if (res.data.code === 200) {
            intentionProductList.value = res.data.data;
        } else {
            ElMessage.error('意向产品数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('意向产品数据获取服务异常，请稍后重试！');
    })
}

const clueStateList = ref<{
    [key: string | number]: any,
    id: number,
    clueState: string
}[]>([])
const getClueStateList = () => {
    doGet("/api/clueStateList", {}).then((res) => {
        if (res.data.code === 200) {
            clueStateList.value = res.data.data;
        } else {
            ElMessage.error('线索状态数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('线索状态数据获取服务异常，请稍后重试！');
    })
}

const sourceList = ref<{
    [key: string | number]: any,
    id: number,
    sourceName: string
}[]>([])
const getSourceList = () => {
    doGet("/api/sourceList", {}).then((res) => {
        if (res.data.code === 200) {
            sourceList.value = res.data.data;
        } else {
            ElMessage.error('线索来源数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('线索来源数据获取服务异常，请稍后重试！');
    })
}

onMounted(() => {
    getOwnerNames()
    getActivityList()
    getAppeallationList()
    getNeedLoanList()
    getIntentionStateList()
    getIntentionProductList()
    getClueStateList()
    getSourceList()
})
</script>

<template>
    <div class="clue-add-container">
        <h2>录入新线索</h2>

        <el-form ref="submitFormRef" :model="formData" :rules="rules" label-width="120px" label-position="right"
            class="clue-form">
            <!-- 基本信息 -->
            <el-divider content-position="left">基本信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="fullName">
                        <el-input v-model="formData.fullName" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="称呼" prop="appellation">
                        <el-select v-model="formData.appellation" placeholder="请选择称呼" style="width: 100%">
                            <el-option v-for="item in appeallationList" :key="item.id" :label="item.appellation"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="年龄">
                        <el-input-number v-model="formData.age" :min="0" :max="150" placeholder="请输入年龄"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职业">
                        <el-input v-model="formData.job" placeholder="请输入职业" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="年收入(万元)">
                        <el-input-number v-model="formData.yearIncome" :min="0" :precision="2" placeholder="请输入年收入"
                            style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址">
                        <el-input v-model="formData.address" placeholder="请输入地址" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 联系方式 -->
            <el-divider content-position="left">联系方式</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="formData.phone" placeholder="请输入手机号" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="微信">
                        <el-input v-model="formData.weixin" placeholder="请输入微信" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="QQ">
                        <el-input v-model="formData.qq" placeholder="请输入QQ" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱">
                        <el-input v-model="formData.email" placeholder="请输入邮箱" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 意向信息 -->
            <el-divider content-position="left">意向信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否需要贷款" prop="needLoan">
                        <el-select v-model="formData.needLoan" placeholder="请选择是否需要贷款" style="width: 100%">
                            <el-option v-for="item in needLoanList" :key="item.id" :label="item.isNeedLoan"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="意向状态" prop="intentionState">
                        <el-select v-model="formData.intentionState" placeholder="请选择意向状态" style="width: 100%">
                            <el-option v-for="item in intentionStateList" :key="item.id" :label="item.intentionState"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="意向产品" prop="intentionProduct">
                        <el-select v-model="formData.intentionProduct" placeholder="请选择意向产品" style="width: 100%">
                            <el-option v-for="item in intentionProductList" :key="item.id" :label="item.productName"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="线索状态" prop="state">
                        <el-select v-model="formData.state" placeholder="请选择线索状态" style="width: 100%">
                            <el-option v-for="item in clueStateList" :key="item.id" :label="item.clueState"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="线索来源" prop="source">
                        <el-select v-model="formData.source" placeholder="请选择线索来源" style="width: 100%">
                            <el-option v-for="item in sourceList" :key="item.id" :label="item.sourceName"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="下次联系时间">
                        <el-date-picker v-model="formData.nextContactTime" type="datetime" placeholder="请选择下次联系时间"
                            style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="负责人" prop="ownerId">
                        <el-select v-model="formData.ownerId" placeholder="请选择负责人" style="width: 100%">
                            <el-option v-for="item in ownerList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属活动" prop="activityId">
                        <el-select v-model="formData.activityId" placeholder="请选择所属活动" style="width: 100%">
                            <el-option v-for="item in activityList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 描述信息 -->
            <el-divider content-position="left">描述信息</el-divider>
            <el-form-item label="描述">
                <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入描述信息" />
            </el-form-item>

            <!-- 按钮操作区 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="resetForm()">重置</el-button>
                <el-button type="info" @click="router.push('/dashboard/clue')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.clue-add-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
}

.clue-form {
    margin-top: 20px;
}

.el-divider {
    margin: 20px 0;
}

h2 {
    margin-bottom: 20px;
    color: #303133;
}
</style>