<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { doDelete, doGet, doPost, doPut } from '@/http/httpRequest'

const router = useRouter()
const clueList = ref([{
    ownerDO: {},
    activityDO: {},
    appellationDO: {},
    needLoanDO: {},
    intentionStateDO: {},
    intentionProductDO: {},
    stateDO: {},
    sourceDO: {}
}])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

const getClueListData = () => {
    doGet("/api/clues", {
        current: currentPage.value
    }).then((res) => {
        if (res.data.code === 200) {
            clueList.value = res.data.data.list
            total.value = res.data.data.total
            pageSize.value = res.data.data.pageSize
        } else {
            ElMessage.error("获取线索列表失败,请稍后再试")
        }
    }).catch((err) => {
        ElMessage.error("获取线索列表服务异常,请稍后再试")
    })
}

// 获取线索编辑的选择项数据
const ownerList = ref<{
    [key: string | number]: any,
    id: number,
    name: string
}[]>([])
const getOwnerNames = () => {
    doGet("/api/owner", {}).then((res) => {
        if (res.data.code === 200) {
            ownerList.value = res.data.data;
        } 
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
        } 
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
        }
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
        }
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
        }
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
        }
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
        } 
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
        }
    })
}
const noteWayList = ref<{
    [key: string | number]: any,
    id: number,
    noteWayName: string
}[]>([])
const getNoteWayList = () => {
    doGet("/api/noteWayList", {}).then((res) => {
        if (res.data.code === 200) {
            noteWayList.value = res.data.data;
        }
    })
}
const getOptions = () => {
    getOwnerNames()
    getActivityList()
    getAppeallationList()
    getNeedLoanList()
    getIntentionStateList()
    getIntentionProductList()
    getClueStateList()
    getSourceList()
    getNoteWayList() // 获取备注方式数据
}

// 线索详情展示
const showDetailDrawer = ref(false)
const detailData = ref({
    id:0,
    fullName: "",
    phone: "",
    weixin: "",
    qq: "",
    email: "",
    needLoan: "",
    intentionState: "",
    intentionProduct: "",
    state: "",
    source: "",
    nextContactTime: "",
    ownerName: "",
    activityName: "",
    appellation: "",
    address: "",
    age: 0,
    description: "",
    job: "",
    createBy: -1,
    createByName: "",
    createTime: "",
    editBy: -1,
    editByName: "",
    editTime: "",
    yearIncome: 0,
})
const addClueRemark = ref({
    clueId: null,
    noteContent: '',
    noteWay: null
})
// 线索备注相关数据
const clueRemarks = ref<{
    id: number,
    clueId: number,
    noteWay: string,
    noteWayName: string,
    noteContent: string,
    createBy: number,
    createByName: string,
    createTime: string,
    editBy: number,
    editByName: string,
    editTime: string,
}[]>([])
const getClueRemarks = (id:number)=>{
    doGet("/api/clueRemark", {
        clueId: id
    }).then((res) => {
        if (res.data.code === 200) {
            clueRemarks.value = res.data.data;
        } else {
            ElMessage.error('线索备注数据获取失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('线索备注数据获取服务异常，请稍后重试！');
    })
}

const showDetail = (row: any) => {
    getClueRemarks(row.id) // 获取线索备注数据
    showDetailDrawer.value = true
    detailData.value = {
        ...row,// 浅拷贝
        ownerName: row.ownerDO.name,
        activityName: row.activityDO.name,
        appellation: row.appellationDO.typeValue,
        needLoan: row.needLoanDO.typeValue,
        intentionState: row.intentionStateDO.typeValue,
        intentionProduct: row.intentionProductDO.name,
        state: row.stateDO.typeValue,
        source: row.sourceDO.typeValue
    }
    // 准备添加备注的数据
    addClueRemark.value.clueId = row.id
    addClueRemark.value.noteContent = ''

    if (ownerList.value.find((item => item.id === row.createBy))) {
        detailData.value.createByName = ownerList.value.filter((item) => item.id === row.createBy)[0].name
    }else{
        detailData.value.createByName = "未知"
    }

    if (ownerList.value.find((item => item.id === row.editBy))) {
        detailData.value.editByName = ownerList.value.filter((item) => item.id === row.editBy)[0].name
    }else{
        detailData.value.editByName = "未知"
    }
}
const closeDetail = () => {
    showDetailDrawer.value = false
    addClueRemark.value.noteContent = ''
    addClueRemark.value.noteWay = null
    addClueRemark.value.clueId = null
}
// 提交添加备注的函数
const submitNewClueRemark = () => {
    if (!addClueRemark.value.noteContent || addClueRemark.value.noteWay === null) {
        ElMessage.warning('备注内容不能为空')
        return
    }
    console.log('添加备注：', addClueRemark.value)
    doPost("/api/clueRemark", addClueRemark.value).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success('备注添加成功！')
            getClueRemarks(detailData.value.id) // 刷新备注列表
            addClueRemark.value.noteContent = ''
            addClueRemark.value.noteWay = null
        } else {
            ElMessage.error('添加备注失败，请稍后重试！')
        }
    }).catch((err) => {
        ElMessage.error('添加备注服务异常，请稍后重试！')
    })
}
// 编辑备注的函数
const editClueRemarkVisible = ref(false)
const editedClueRemark = ref({
    id: 0,
    noteContent: '',
    noteWay: null
})
const editClueRemark = (row: any) => {
    // 编辑备注的逻辑
    editedClueRemark.value = {
        id: row.id,
        noteContent: row.noteContent,
        noteWay: row.noteWay
    }
    editClueRemarkVisible.value = true
}

const submitEditedClueRemark = () => {
    if (!editedClueRemark.value.noteContent || editedClueRemark.value.noteWay === null){
        ElMessage.warning('备注内容不能为空')
        return
    }
    doPut("/api/clueRemark", editedClueRemark.value).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success('备注编辑成功！')
            getClueRemarks(detailData.value.id) // 刷新备注列表
            editClueRemarkVisible.value = false
        } else {
            ElMessage.error('编辑备注失败，请稍后重试！')
        }
    }).catch((err) => {
        ElMessage.error('编辑备注服务异常，请稍后重试！')
    })
}

const deleteClueRemark = (id: number) => {
    ElMessageBox.confirm('确定要删除该备注吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        doDelete("/api/clueRemark/" + id, {}).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('删除成功！')
                getClueRemarks(detailData.value.id) // 刷新备注列表
            } else {
                ElMessage.error('删除失败，请稍后重试！')
            }
        }).catch((err) => {
            ElMessage.error('删除服务异常，请稍后重试！')
        })
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}


// 线索编辑抽屉
const showEditDrawer = ref(false)
const editData = ref({
    id: 0, // 添加id字段用于编辑提交
    fullName: "",
    phone: "",
    weixin: "",
    qq: "",
    email: "",
    needLoan: null,
    intentionState: null,
    intentionProduct: null,
    state: null,
    source: null,
    nextContactTime: "",
    ownerId: null,
    activityId: null,
    appellation: null,
    address: "",
    age: null,
    description: "",
    job: "",
    yearIncome: null,
    createBy: -1,
    createTime: "",
    editBy: -1,
    editTime: "",
})

// 表单验证规则
const editRules = reactive({
    fullName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    ownerId: [{ required: true, message: '请选择负责人', trigger: 'change' }],
    activityId: [{ required: true, message: '请选择所属活动', trigger: 'change' }],
    appellation: [{ required: true, message: '请选择称呼', trigger: 'change' }],
    state: [{ required: true, message: '请选择线索状态', trigger: 'change' }],
    needLoan: [{ required: true, message: '请选择是否需要贷款', trigger: 'change' }]
})

const editFormRef = ref()

// 显示编辑抽屉并填充数据
const showEdit = (row: any) => {
    showEditDrawer.value = true

    // 填充表单数据，注意id映射关系
    editData.value = {
        id: row.id,
        fullName: row.fullName,
        phone: row.phone,
        weixin: row.weixin || "",
        qq: row.qq || "",
        email: row.email || "",
        needLoan: row.needLoanDO.id,
        intentionState: row.intentionStateDO.id,
        intentionProduct: row.intentionProductDO.id,
        state: row.stateDO.id,
        source: row.sourceDO.id,
        nextContactTime: row.nextContactTime || "",
        ownerId: row.ownerDO.id,
        activityId: row.activityDO.id,
        appellation: row.appellationDO.id,
        address: row.address || "",
        age: row.age || null,
        description: row.description || "",
        job: row.job || "",
        yearIncome: row.yearIncome || null,
        createBy: row.createBy,
        createTime: row.createTime,
        editBy: row.editBy,
        editTime: row.editTime
    }
}

// 提交编辑表单
const submitEditForm = () => {
    editFormRef.value.validate((valid: boolean) => {
        if (valid) {
            console.log('提交编辑数据:', editData.value)
            doPut("/api/clue", editData.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('编辑成功！')
                    showEditDrawer.value = false
                    getClueListData() // 刷新列表数据
                } else {
                    ElMessage.error('编辑失败，请稍后重试！')
                }
            }).catch((err) => {
                ElMessage.error('编辑服务异常，请稍后重试！')
                return false
            })
        } else {
            ElMessage.error('请检查表单填写是否完整！')
            return false
        }
    })
}

// 取消编辑
const cancelEdit = () => {
    showEditDrawer.value = false
    ElMessage.info('已取消编辑')
}

// 删除
const deleteClue = (id: number) => {
    ElMessageBox.confirm('确定要删除该线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        doDelete("/api/clue/" + id, {}).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('删除成功！')
                getClueListData() // 刷新列表数据
            } else if (res.data.code === 403) { 
                ElMessage.error("删除失败，没有对应权限！")
            }else {
                ElMessage.error('删除失败，请稍后重试！')
            }
        }).catch((err) => {
            ElMessage.error('删除服务异常，请稍后重试！')
        })
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 批量删除
const selectedRows = ref([])
const handleSelectionChange = (val: any) => {
    selectedRows.value = []
    selectedRows.value = val.map((item: any) => item.id)
}
const deleteSelectedClues = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要删除的线索！')
        return
    }
    ElMessageBox.confirm('确定要删除选中的线索吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let selectedRowsIds = selectedRows.value.join(',')
        doDelete("/api/clue/batch", { ids: selectedRowsIds }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('批量删除成功！')
                getClueListData() // 刷新列表数据
            } else if (res.data.code === 403) {
                ElMessage.error("删除失败，没有对应权限！")
            } else {
                ElMessage.error('批量删除失败，请稍后重试！')
            }
        }).catch((err) => {
            ElMessage.error('批量删除服务异常，请稍后重试！')
        })
    }).catch(() => {
        ElMessage.info('已取消批量删除')
    })
}
// 导入excel功能
const isImportExcelShow = ref(false)
const uploadRef = ref()
const importExcel = () => {
    isImportExcelShow.value = false
    uploadRef.value.submit() // 提交上传的文件，调用uploadFiles函数
}
// 自定义的上传文件函数
const uploadFiles = (param : any) => {
    let file = param.file // 获取文件对象
    let formData = new FormData()
    formData.append('file', file)
    doPost("/api/importExcel", formData).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success('文件上传成功！稍候系统更新~')
            isImportExcelShow.value = false // 关闭导入弹窗
            uploadRef.value.clearFiles() // 清空上传的文件列表
            getClueListData() // 刷新列表数据
        } else {
            ElMessage.error('文件上传失败，请稍后重试！')
        }
    }).catch((err) => {
        ElMessage.error('文件上传服务异常，请稍后重试！')
    })
}

// 转化成客户功能
const convertDialogVisible = ref(false)
const customerQuery = ref({
    product: null,
    description: "",
    nextContactTime: "",
})
const customerQueryFormRef = ref()
const customerQueryRules = ref({
    product: [{ required: true, message: '请选择意向产品', trigger: 'change' }],
    description: [{ required: true, message: '请输入客户描述', trigger: 'blur' }],
    nextContactTime: [{ required: true, message: '请选择下次联系时间', trigger: 'change' }]
})
const cancleConvertDialog = () => {
    convertDialogVisible.value = false
    customerQuery.value.product = null
    customerQuery.value.description = ""
    customerQuery.value.nextContactTime = ""
    customerQueryFormRef.value.clearValidate() // 清空表单验证状态
}
const submitConvertClue = () => {
    customerQueryFormRef.value.validate((valid: boolean) => {
        if (valid) {
            doPost("/api/clue/customer", {
                clueId: detailData.value.id,
                product: customerQuery.value.product,
                description: customerQuery.value.description,
                nextContactTime: customerQuery.value.nextContactTime
            }).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('线索转换客户成功！')
                    cancleConvertDialog() // 关闭转换客户弹窗
                    getClueListData() // 刷新列表数据
                } else {
                    ElMessage.error('线索转换客户失败，请稍后重试！')
                }
            }).catch((err) => {
                ElMessage.error('线索转换客户服务异常，请稍后重试！')
            })
        } else {
            ElMessage.error('请检查表单填写是否完整！')
            return false
        }
    })
}


onMounted(() => {
    getClueListData()
    getOptions()
})
</script>

<template>
    <el-button type="primary" @click="router.push('/dashboard/clue/add')">录入线索</el-button>
    <el-button type="success" @click="isImportExcelShow = true">导入线索(Excel)</el-button>
    <el-button type="danger" @click="deleteSelectedClues" v-permission="'clue:delete'">批量删除</el-button>
    <hr>
    <el-table :data="clueList" empty-text="暂无线索" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="ownerDO.name" label="负责人" width="80" show-overflow-tooltip />
        <el-table-column prop="activityDO.name" label="所属活动" width="80" show-overflow-tooltip />
        <el-table-column label="姓名" width="80" show-overflow-tooltip>
            <template #default="scope">
                <a href="#" @click.prevent="showDetail(scope.row)">{{ scope.row.fullName }}</a>
            </template>
        </el-table-column>
        <el-table-column prop="appellationDO.typeValue" label="称呼" width="80" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机" width="90" show-overflow-tooltip />
        <el-table-column prop="weixin" label="微信" width="90" show-overflow-tooltip />
        <el-table-column prop="qq" label="QQ" width="90" show-overflow-tooltip />
        <el-table-column prop="needLoanDO.typeValue" label="是否贷款" width="100" show-overflow-tooltip />
        <el-table-column prop="intentionStateDO.typeValue" label="意向状态" width="100" show-overflow-tooltip />
        <el-table-column prop="intentionProductDO.name" label="意向产品" width="100" show-overflow-tooltip />
        <el-table-column prop="stateDO.typeValue" label="线索状态" width="100" show-overflow-tooltip />
        <el-table-column prop="sourceDO.typeValue" label="线索来源" width="100" show-overflow-tooltip />
        <el-table-column prop="nextContactTime" label="下次联系时间" width="110" show-overflow-tooltip />
        <el-table-column label="操作" width="230" >
            <template #default="scope">
                <el-button type="primary" @click="showDetail(scope.row)" v-permission="'clue:view'">详情</el-button>
                <el-button type="success" @click="showEdit(scope.row)" v-permission="'clue:edit'">编辑</el-button>
                <el-button type="danger" @click="deleteClue(scope.row.id)" v-permission="'clue:delete'">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <hr>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
        v-model:current-page="currentPage" @update:current-page="getClueListData" />

    <!--导入线索dialog-->
    <el-dialog v-model="isImportExcelShow" title="导入线索Excel" width="50%" center top="10vh">
        <div class="import-container">
            <el-upload drag :auto-upload="false" ref="uploadRef" accept=".xlsx, .xls" class="upload-area"
                :http-request="uploadFiles">
                <el-icon size="25px">
                    <UploadFilled />
                </el-icon>
                <div>将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <div class="import-tips">
                <el-alert title="请在导入前确认以下内容" type="info" :closable="false" show-icon />
                <ol class="tips-list">
                    <li>请确保文件格式为Excel（.xlsx/.xls）</li>
                    <li>请确保文件大小不超过50MB</li>
                    <li>给定Excel文件的第一行视为字段名</li>
                    <li>日期以文本形式保存，格式为yyyy-MM-dd</li>
                    <li>日期时间以文本形式保存，格式为yyyy-MM-dd HH:mm:ss</li>
                </ol>
                <el-alert title="导入过程可能需要一些时间，请耐心等待" type="warning" :closable="false" show-icon class="mt-10" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isImportExcelShow = false">取消</el-button>
                <el-button type="primary" @click="importExcel">
                    <el-icon>
                        <Upload />
                    </el-icon><span>开始导入</span>
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!--线索详情抽屉-->
    <el-drawer v-model="showDetailDrawer" :title="`线索详情 - ${detailData.activityName}`" size="70%" @close="closeDetail">
        <div class="detail-container">
            <!-- 基本信息 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>基本信息</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="姓名">{{ detailData.fullName }}</el-descriptions-item>
                    <el-descriptions-item label="称呼">{{ detailData.appellation }}</el-descriptions-item>
                    <el-descriptions-item label="年龄">{{ detailData.age }}</el-descriptions-item>
                    <el-descriptions-item label="职业">{{ detailData.job }}</el-descriptions-item>
                    <el-descriptions-item label="年收入">{{ detailData.yearIncome }}万元</el-descriptions-item>
                    <el-descriptions-item label="地址" :span="2">{{ detailData.address }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 联系方式 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>联系方式</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
                    <el-descriptions-item label="微信">{{ detailData.weixin }}</el-descriptions-item>
                    <el-descriptions-item label="QQ">{{ detailData.qq }}</el-descriptions-item>
                    <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 意向信息 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>意向信息</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="是否贷款">{{ detailData.needLoan }}</el-descriptions-item>
                    <el-descriptions-item label="意向状态">{{ detailData.intentionState }}</el-descriptions-item>
                    <el-descriptions-item label="意向产品">{{ detailData.intentionProduct }}</el-descriptions-item>
                    <el-descriptions-item label="线索状态">{{ detailData.state }}</el-descriptions-item>
                    <el-descriptions-item label="线索来源">{{ detailData.source }}</el-descriptions-item>
                    <el-descriptions-item label="下次联系时间">{{ detailData.nextContactTime }}</el-descriptions-item>
                    <el-descriptions-item label="负责人">{{ detailData.ownerName }}</el-descriptions-item>
                    <el-descriptions-item label="所属活动">{{ detailData.activityName }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 描述信息 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>描述信息</span>
                    </div>
                </template>
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="描述">
                        <div class="description-content">{{ detailData.description || '暂无描述' }}</div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 记录信息 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>记录信息</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="创建人">
                        <el-tag size="small" type="info">{{ detailData.createByName }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="修改人">
                        <el-tag size="small" type="info">{{ detailData.editByName }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="修改时间">{{ detailData.editTime }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 线索备注部分 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>线索跟踪</span>
                    </div>
                </template>
                <div class="remark-form">
                    <el-form>
                        <el-form-item>
                            <el-input v-model="addClueRemark.noteContent" type="textarea"
                                :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入新的备注内容..." />
                        </el-form-item>
                        <el-form-item label="跟踪方式" prop="noteWay">
                            <el-select v-model="addClueRemark.noteWay" placeholder="跟踪方式" style="width: 60%">
                                <el-option v-for="item in noteWayList" :key="item.id" :label="item.noteWayName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="remark-buttons">
                                <el-button type="primary" @click="submitNewClueRemark">添加备注</el-button>
                                <el-button plain @click="()=>{
                                    addClueRemark.noteContent = ''
                                    addClueRemark.noteWay = null
                                }">清空</el-button>
                                <el-button type="success" @click="convertDialogVisible=true" 
                                        v-if="detailData.state != '已转客户'">转换客户</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 备注列表 -->
                <div class="remark-list">
                    <div class="remark-title">历史备注</div>
                    <el-table :data="clueRemarks" style="width: 100%" empty-text="暂无备注记录" stripe>
                        <el-table-column type="index" label="序号" width="55" />
                        <el-table-column property="noteContent" label="备注内容" width="150" show-overflow-tooltip />
                        <el-table-column label="创建信息" width="200">
                            <template #default="scope">
                                <div class="user-info">
                                    <span>{{ scope.row.createByName }}</span>
                                    <el-divider direction="vertical" />
                                    <span>{{ scope.row.createTime }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="编辑信息" width="200">
                            <template #default="scope">
                                <div class="user-info" v-if="scope.row.editByName">
                                    <span>{{ scope.row.editByName }}</span>
                                    <el-divider direction="vertical" />
                                    <span>{{ scope.row.editTime }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="跟踪方式" width="100">
                            <template #default="scope">
                                <div class="note-way">
                                    <el-tag size="small" type="info">{{ scope.row.noteWayName }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140">
                            <template #default="scope">
                                <el-button size="small" type="success" @click="editClueRemark(scope.row)">编辑</el-button>
                                <el-button size="small" type="danger"
                                    @click="deleteClueRemark(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
            <div class="detail-actions">
                <el-button type="default" @click="showDetailDrawer = false">关闭</el-button>
            </div>
        </div>
    </el-drawer>

    <!--转换客户dialog-->
    <el-dialog v-model="convertDialogVisible" title="线索转换客户" width="55%" center @close="cancleConvertDialog">
        <el-form :model="customerQuery" label-width="110px" :rules="customerQueryRules" ref="customerQueryFormRef">
            <el-form-item label="意向产品" prop="product">
                <el-select v-model="customerQuery.product" placeholder="请选择意向产品" style="width: 100%">
                    <el-option v-for="item in intentionProductList" :key="item.id" :label="item.productName"
                        :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="客户描述" prop="description">
                <el-input v-model="customerQuery.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入客户描述" />
            </el-form-item>
            <el-form-item label="下次联系时间" prop="nextContactTime">
                <el-date-picker v-model="customerQuery.nextContactTime" type="datetime" placeholder="请选择下次联系时间"
                    style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancleConvertDialog">取消</el-button>
                <el-button type="primary" @click="submitConvertClue">转换</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 备注编辑对话框 -->
    <el-dialog v-model="editClueRemarkVisible" title="编辑备注" width="40%" center destroy-on-close>
        <el-form label-position="top">
            <el-form-item label="备注内容">
                <el-input v-model="editedClueRemark.noteContent" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入备注内容" />
            </el-form-item>
            <el-form-item label="跟踪方式">
                <el-select v-model="editedClueRemark.noteWay" placeholder="请选择跟踪方式" style="width: 100%">
                    <el-option v-for="item in noteWayList" :key="item.id" :label="item.noteWayName" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editClueRemarkVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEditedClueRemark">保存</el-button>
            </div>
        </template>
    </el-dialog>

    <!--线索编辑抽屉-->
    <el-drawer v-model="showEditDrawer" :title="`编辑线索 - ${editData.fullName}`" size="70%" destroy-on-close
        @open="getOptions">
        <div class="edit-container">
            <el-form ref="editFormRef" :model="editData" :rules="editRules" label-width="120px" label-position="right"
                class="edit-form">
                <!-- 基本信息 -->
                <el-divider content-position="left">基本信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="fullName">
                            <el-input v-model="editData.fullName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="称呼" prop="appellation">
                            <el-select v-model="editData.appellation" placeholder="请选择称呼" style="width: 100%">
                                <el-option v-for="item in appeallationList" :key="item.id" :label="item.appellation"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="年龄">
                            <el-input-number v-model="editData.age" :min="0" :max="150" placeholder="请输入年龄"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职业">
                            <el-input v-model="editData.job" placeholder="请输入职业" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="年收入(万元)">
                            <el-input-number v-model="editData.yearIncome" :min="0" :precision="2" placeholder="请输入年收入"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址">
                            <el-input v-model="editData.address" placeholder="请输入地址" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 联系方式 -->
                <el-divider content-position="left">联系方式</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="editData.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="微信">
                            <el-input v-model="editData.weixin" placeholder="请输入微信" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="QQ">
                            <el-input v-model="editData.qq" placeholder="请输入QQ" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱">
                            <el-input v-model="editData.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 意向信息 -->
                <el-divider content-position="left">意向信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="是否需要贷款" prop="needLoan">
                            <el-select v-model="editData.needLoan" placeholder="请选择是否需要贷款" style="width: 100%">
                                <el-option v-for="item in needLoanList" :key="item.id" :label="item.isNeedLoan"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="意向状态" prop="intentionState">
                            <el-select v-model="editData.intentionState" placeholder="请选择意向状态" style="width: 100%">
                                <el-option v-for="item in intentionStateList" :key="item.id"
                                    :label="item.intentionState" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="意向产品" prop="intentionProduct">
                            <el-select v-model="editData.intentionProduct" placeholder="请选择意向产品" style="width: 100%">
                                <el-option v-for="item in intentionProductList" :key="item.id" :label="item.productName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="线索状态" prop="state">
                            <el-select v-model="editData.state" placeholder="请选择线索状态" style="width: 100%">
                                <el-option v-for="item in clueStateList" :key="item.id" :label="item.clueState"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="线索来源" prop="source">
                            <el-select v-model="editData.source" placeholder="请选择线索来源" style="width: 100%">
                                <el-option v-for="item in sourceList" :key="item.id" :label="item.sourceName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下次联系时间">
                            <el-date-picker v-model="editData.nextContactTime" type="datetime" placeholder="请选择下次联系时间"
                                style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="ownerId">
                            <el-select v-model="editData.ownerId" placeholder="请选择负责人" style="width: 100%">
                                <el-option v-for="item in ownerList" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属活动" prop="activityId">
                            <el-select v-model="editData.activityId" placeholder="请选择所属活动" style="width: 100%">
                                <el-option v-for="item in activityList" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--创建于编辑信息-->
                <el-divider content-position="left">记录信息</el-divider>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="创建人">
                        {{ownerList.find(owner => owner.id === editData.createBy)?.name || '未知'}}
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ editData.createTime || '未知' }}</el-descriptions-item>
                    <el-descriptions-item label="修改人">
                        {{ownerList.find(owner => owner.id === editData.editBy)?.name || '未知'}}
                    </el-descriptions-item>
                    <el-descriptions-item label="修改时间">{{ editData.editTime || '未知' }}</el-descriptions-item>
                </el-descriptions>

                <!-- 描述信息 -->
                <el-divider content-position="left">描述信息</el-divider>
                <el-form-item label="描述">
                    <el-input v-model="editData.description" type="textarea" :rows="4" placeholder="请输入描述信息" />
                </el-form-item>

                <!-- 按钮操作区 -->
                <el-form-item>
                    <el-button type="primary" @click="submitEditForm">保存</el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<style scoped>
.detail-container,
.edit-container {
    padding: 10px 20px;
}

.mt-20 {
    margin-top: 20px;
}

.edit-form {
    margin-top: 20px;
}

/* 详情抽屉样式 */
.detail-container {
    padding: 10px 20px;
}

.detail-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
}

.description-content {
    white-space: pre-wrap;
    line-height: 1.5;
    padding: 5px 0;
}

.remark-form {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.remark-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.remark-list {
    margin-top: 15px;
}

.remark-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #606266;
    font-size: 14px;
}

.user-info {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #606266;
}

.detail-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

/* 导入Excel对话框样式 */
.import-container {
    display: flex;
    height:auto;
    flex-direction: column;
    gap: 20px;
}

.upload-area {
    width: 100%;
    margin-bottom: 10px;
}

.import-tips {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    background-color: #f8f9fa;
}

.tips-list {
    padding-left: 50px;
    margin: 15px 0;
    color: #606266;
}

.ml-5 {
    margin-left: 5px;
}

.mt-10 {
    margin-top: 10px;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>