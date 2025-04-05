<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doDelete, doGet, doPost } from '@/http/httpRequest';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getTokenName } from '@/utils/util';
import axios from 'axios';
const router = useRouter();

// 客户数据
const customerData = ref([{
    clueDO: {},
    ownerDO: {},
    activityDO: {},
    appellationDO: {},
    needLoanDO: {},
    intentionStatusDO: {},
    stateDO: {},
    sourceDO: {},
    intentionProductDO: {},
    nextContactTime: null,
}]);
const pageSize = ref(10);
const total = ref(0);
const currentPage = ref(1);
const selectedData = ref([]);
const baseUrl = "http://localhost:8080"

const handleSizeChange = (val: any) => {
    selectedData.value = []
    // 添加
    selectedData.value = val.map((item: any) => item.id)
}
// 选择导出 -> 使用axios的方式导出
const exportSelectedCustomer = () => {
    if (selectedData.value.length === 0) {
        ElMessage.warning("请先选择要导出的客户！");
        return;
    }
    axios({
        method: 'get',
        url: baseUrl + '/api/exportSelectExcel',
        responseType: 'blob',
        params: {
            ids: selectedData.value.join(','),
        },
        headers: {
            'Authorization': window.localStorage.getItem(getTokenName()),
        }
    }).then(res => {
        const href = URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = href;
        let filename = `selectedCustomer_${new Date().getTime()}.xlsx`;
        filename = decodeURIComponent(filename);
        link.setAttribute('download', filename);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(href);
        }, 300000);
    }).catch(err => {
        console.error(err);
        ElMessage.error("导出失败！");
    })
}
const getCustomerList = () => {
    doGet('/api/customers', {
        current: currentPage.value,
    }).then((res) => {
        if (res.data.code === 200) {
            customerData.value = res.data.data.list
            total.value = res.data.data.total
            pageSize.value = res.data.data.pageSize
        } else {
            ElMessage.error("获取客户列表失败！");
        }
    }).catch((err) => {
        console.error(err);
        ElMessage.error("获取客户列表服务异常！");
    });
}

// 全部导出 -> 使用iframe的方式导出
const exportAllCustomer = () => {
    let iframe = document.createElement('iframe');
    let token = window.localStorage.getItem(getTokenName());
    iframe.src = baseUrl + '/api/exportExcel?Authorization=' + token;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 300000);
}

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

// 客户备注信息
const customerRemark = ref<{
    [key: string | number]: any,
    id: number,
    customerId: number,
    noteWayName: string,
    noteContent: string,
    createTime: string,
    createByName: string,
    editTime: string,
    editByName: string,
}[]>([]);
const getCustomerRemark = (customerId: number) => {
    doGet('/api/customerRemark', {
        customerId: customerId,
    }).then((res) => {
        if (res.data.code === 200) {
            customerRemark.value = res.data.data;
        } else {
            ElMessage.error("获取客户备注信息失败！");
        }
    }).catch((err) => {
        console.error(err);
        ElMessage.error("获取客户备注信息服务异常！");
    });
}
// 详情
const showDetailDrawer = ref(false);
const showDetailData = ref();
const showDetail = (row: any) => {
    getCustomerRemark(row.id);
    showDetailDrawer.value = true;
    showDetailData.value = row;
    newCustomerRemark.value.customerId = row.id;
    newCustomerRemark.value.noteContent = ""
}

// 添加备注
const newCustomerRemark = ref({
    customerId: 0,
    noteWay: null,
    noteContent: "",
});
const clearRemark = () => {
    newCustomerRemark.value.noteWay = null;
    newCustomerRemark.value.noteContent = "";
}
const addCustomerRemark = () => {
    if (newCustomerRemark.value.noteWay === null) {
        ElMessage.warning("请选择备注方式！");
        return;
    }
    if (newCustomerRemark.value.noteContent === "") {
        ElMessage.warning("请输入备注内容！");
        return;
    }
    console.log(newCustomerRemark.value);
    doPost("/api/customerRemark", newCustomerRemark.value).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success("添加备注成功！");
            getCustomerRemark(newCustomerRemark.value.customerId);
            clearRemark();
        } else {
            ElMessage.error("添加备注失败！");
        }
    }).catch((err) => {
        console.error(err);
        ElMessage.error("添加备注服务异常！");
    });
}

// 删除备注
const deleteCustomerRemark = (id: number) => {
    doDelete("/api/customerRemark/"+ id).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success("删除备注成功！");
            getCustomerRemark(newCustomerRemark.value.customerId);
        } else {
            ElMessage.error("删除备注失败！");
        }
    }).catch((err) => {
        console.error(err);
        ElMessage.error("删除备注服务异常！");
    });
}

// 创建交易
const stageList = ref<{
    [key: string | number]: any,
    id: number,
    tranStage: string
}[]>([])
const getStageList = () => {
    doGet("/api/stageList", {}).then((res) => {
        if (res.data.code === 200) {
            stageList.value = res.data.data;
        }
    })
}
const showCreateTranDialog = ref(false);
const newTran = ref({
    customerId: 0,
    money:0,
    expectedDate: null,
    stage: null,
    description: "",
    nextContactTime: null
})
const clearTran = () => {
    newTran.value.customerId = 0;
    newTran.value.money = 0;
    newTran.value.expectedDate = null;
    newTran.value.stage = null;
    newTran.value.description = "";
    newTran.value.nextContactTime = null;
    tranFormRef.value.clearValidate();
    showCreateTranDialog.value = false;
}
const tranFormRef = ref();
const tranFormRule = ref({
    money: [{ required: true, message: "请输入交易金额", trigger: "blur" }],
    expectedDate: [{ required: true, message: "请选择预期时间", trigger: "change" }],
    stage: [{ required: true, message: "请选择交易阶段", trigger: "change" }],
    description: [{ required: true, message: "请输入交易描述", trigger: "blur" }],
    nextContactTime: [{ required: true, message: "请选择下次联系时间", trigger: "change" }],
})
const createNewTran = () => {
    showCreateTranDialog.value = true;
    newTran.value.customerId = showDetailData.value.id;
    newTran.value.money = 0;
    newTran.value.expectedDate = null;
    newTran.value.stage = null;
    newTran.value.description = "";
    newTran.value.nextContactTime = null;
}
const submitNewTran = () => {
    tranFormRef.value.validate((valid: boolean) => {
        if (valid) {
            doPost("/api/tran", newTran.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success("创建交易成功！");
                    clearTran();
                } else {
                    ElMessage.error("创建交易失败！");
                }
            }).catch((err) => {
                ElMessage.error("创建交易服务异常！");
            });
        }else {
            ElMessage.warning("请填写完整的交易信息！");
        }
    })
}

onMounted(() => {
    getCustomerList();
    getOwnerNames();
    getNoteWayList();
    getStageList();
});
</script>

<template>
    <el-button type="primary" @click="exportAllCustomer">全部导出(Excel)</el-button>
    <el-button type="success" @click="exportSelectedCustomer">选择导出(Excel)</el-button>
    <hr>

    <el-table empty-text="暂无数据" :data="customerData" @selection-change="handleSizeChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" width="55" label="序号" show-overflow-tooltip />
        <el-table-column prop="ownerDO.name" label="负责人" width="100" show-overflow-tooltip />
        <el-table-column prop="activityDO.name" label="所属活动" width="120" show-overflow-tooltip />
        <el-table-column prop="clueDO.fullName" label="姓名" width="80" show-overflow-tooltip />
        <el-table-column prop="appellationDO.typeValue" label="称呼" width="80" show-overflow-tooltip />
        <el-table-column prop="clueDO.phone" label="手机" width="120" show-overflow-tooltip />
        <el-table-column prop="clueDO.weixin" label="微信" width="120" show-overflow-tooltip />
        <el-table-column prop="needLoanDO.typeValue" label="是否贷款" width="100" show-overflow-tooltip />
        <el-table-column prop="intentionStateDO.typeValue" label="意向状态" width="100" show-overflow-tooltip />
        <el-table-column prop="stateDO.typeValue" label="线索状态" width="100" show-overflow-tooltip />
        <el-table-column prop="sourceDO.typeValue" label="线索来源" width="100" show-overflow-tooltip />
        <el-table-column prop="intentionProductDO.name" label="意向产品" width="100" show-overflow-tooltip />
        <el-table-column prop="nextContactTime" label="下次联系时间" width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="85" fixed="right">
            <template #default="scope">
                <el-button type="primary" @click="showDetail(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <hr>
    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
        v-model:current-page="currentPage" @size-change="handleSizeChange" @update:current-page="getCustomerList" />

    <!--详情抽屉-->
    <el-drawer v-model="showDetailDrawer" title="客户详情" :size="'75%'" :with-header="true" :destroy-on-close="true">
        <div style="padding: 0 20px;">
            <el-card class="customer-detail-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <h3>基础信息</h3>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="姓名">{{ showDetailData?.clueDO?.fullName }}</el-descriptions-item>
                    <el-descriptions-item label="称呼">{{ showDetailData?.appellationDO?.typeValue
                        }}</el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ showDetailData?.clueDO?.phone }}</el-descriptions-item>
                    <el-descriptions-item label="微信">{{ showDetailData?.clueDO?.weixin }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card class="customer-detail-card" shadow="hover" style="margin-top: 20px;">
                <template #header>
                    <div class="card-header">
                        <h3>营销信息</h3>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="负责人">{{ showDetailData?.ownerDO?.name }}</el-descriptions-item>
                    <el-descriptions-item label="所属活动">{{ showDetailData?.activityDO?.name }}</el-descriptions-item>
                    <el-descriptions-item label="线索编号">{{ showDetailData?.clueId }}</el-descriptions-item>
                    <el-descriptions-item label="线索创建时间">{{ showDetailData?.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="线索状态">{{ showDetailData?.stateDO?.typeValue }}</el-descriptions-item>
                    <el-descriptions-item label="线索来源">{{ showDetailData?.sourceDO?.typeValue }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <el-card class="customer-detail-card" shadow="hover" style="margin-top: 20px;">
                <template #header>
                    <div class="card-header">
                        <h3>意向信息</h3>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="意向状态">{{ showDetailData?.intentionStateDO?.typeValue
                        }}</el-descriptions-item>
                    <el-descriptions-item label="意向产品">{{ showDetailData?.intentionProductDO?.name
                        }}</el-descriptions-item>
                    <el-descriptions-item label="是否贷款">{{ showDetailData?.needLoanDO?.typeValue
                        }}</el-descriptions-item>
                    <el-descriptions-item label="下次联系时间">{{ showDetailData?.nextContactTime }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <!--添加备注-->
            <el-card>
                <template #header>
                    <div class="card-header">
                        <h3>新增备注</h3>
                    </div>
                </template>
                <div>
                    <el-form>
                        <el-form-item>
                            <el-input v-model="newCustomerRemark.noteContent" type="textarea"
                                :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入新的备注内容..." />
                        </el-form-item>
                        <el-form-item label="备注方式">
                            <el-select v-model="newCustomerRemark.noteWay" placeholder="请选择备注方式" style="width: 200px;">
                                <el-option v-for="item in noteWayList" :key="item.id" :label="item.noteWayName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="remark-buttons">
                                <el-button type="primary" @click="addCustomerRemark">添加备注</el-button>
                                <el-button plain @click="clearRemark">清空</el-button>
                                <el-button type="success" @click="createNewTran">创建交易</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <!--备注列表-->
            <el-card class="customer-detail-card" shadow="hover" style="margin-top: 20px;">
                <template #header>
                    <div class="card-header">
                        <h3><i class="el-icon-document-copy remark-icon"></i> 备注列表 <el-badge
                                :value="customerRemark.length" class="remark-count" type="primary" /></h3>
                    </div>
                </template>
                <el-table :data="customerRemark" style="width: 100%" empty-text="暂无备注记录" stripe border>
                    <el-table-column type="index" label="序号" width="60" />
                    <el-table-column property="noteContent" label="备注内容" min-width="200" show-overflow-tooltip>
                        <template #default="scope">
                            <div class="note-content">{{ scope.row.noteContent }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建信息" width="250">
                        <template #default="scope">
                            <div class="info-cell">
                                <el-tag size="small" effect="plain">{{ scope.row.createByName }}</el-tag>
                                <el-divider direction="vertical" />
                                <span class="time-text">{{ scope.row.createTime }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="修改信息" width="250">
                        <template #default="scope">
                            <div v-if="scope.row.editByName !== '无'" class="info-cell">
                                <el-tag size="small" effect="plain" type="info">{{ scope.row.editByName }}</el-tag>
                                <el-divider direction="vertical" />
                                <span class="time-text">{{ scope.row.editTime }}</span>
                            </div>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注方式" width="100">
                        <template #default="scope">
                            <el-tag size="small" effect="dark" type="success">{{ scope.row.noteWayName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <div class="action-buttons">
                                <el-button type="danger" size="small" plain
                                    @click="deleteCustomerRemark(scope.row.id)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <template #footer>
            <div style="text-align: right;">
                <el-button @click="showDetailDrawer = false">关闭</el-button>
            </div>
        </template>
    </el-drawer>

    <!--交易dialog-->
    <el-dialog v-model="showCreateTranDialog" title="创建交易" :close-on-click-modal="false" :destroy-on-close="true"
        width="50%">
        <el-form :model="newTran" ref="tranFormRef" label-width="120px" :rules="tranFormRule">
            <el-form-item label="金额" prop="money">
                <el-input-number v-model="newTran.money" :min="0" :step="1000" :precision="2" placeholder="请输入交易金额"
                    style="width: 100%;" />
            </el-form-item>
            <el-form-item label="预期时间" prop="expectedDate">
                <el-date-picker v-model="newTran.expectedDate" type="date" placeholder="选择日期" style="width: 100%;"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="交易阶段" prop="stage">
                <el-select v-model="newTran.stage" placeholder="请选择交易阶段" style="width: 100%;">
                    <el-option v-for="item in stageList" :key="item.id" :label="item.tranStage" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="交易描述" prop="description">
                <el-input v-model="newTran.description" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="请输入交易描述..." />
            </el-form-item>
            <el-form-item label="下次联系时间" prop="nextContactTime">
                <el-date-picker v-model="newTran.nextContactTime" type="datetime" placeholder="选择日期时间"
                    style="width: 100%;" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitNewTran">创建交易</el-button>
                <el-button @click="clearTran">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

</template>

<style scoped>
.customer-detail-card {
    margin-bottom: 15px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-header h3{
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #409eff;
    display: flex;
    align-items: center;
}

.remark-icon {
    margin-right: 5px;
    font-size: 18px;
}

.remark-count {
    margin-left: 8px;
}

.add-remark-btn {
    margin-left: auto;
}

.note-content {
    line-height: 1.5;
    padding: 2px 0;
}

.info-cell {
    display: flex;
    align-items: center;
}

.time-text {
    color: #909399;
    font-size: 13px;
}

.action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;
}

:deep(.el-table) {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-table__header-wrapper th) {
    background-color: #f5f7fa;
    font-weight: bold;
    color: #606266;
}

:deep(.el-table__row:hover) {
    background-color: #f0f9ff !important;
}

:deep(.el-descriptions__label) {
    background-color: #f5f7fa;
    width: 100px;
    font-weight: bold;
}

:deep(.el-descriptions__content) {
    padding: 12px;
}
</style>