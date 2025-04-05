<script setup lang="ts">
import { doGet, doPut,doPost, doDelete } from '@/http/httpRequest';
import { ElMessage,ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const acticityQuery = ref<{
    ownerId: number | null,
    activityName: string | null,
    beginTime: Date | null | string,
    endTime: Date | null | string
    costBegin: number | null
    costEnd: number | null
    createTime: Date | null | string
}>({
    ownerId: null,
    activityName: null,
    beginTime: null,
    endTime: null,
    costBegin: null,
    costEnd: null,
    createTime: null
})

const activityRules = ref({
    cost: [
        { type: 'number', message: '请输入数字', trigger: 'blur' }
    ],
})

const isFilter = ref(false)
const queryFormRef = ref()

const currentPage = ref(1)
const total = ref(1)
const pageSize = ref(10)
const activatyList = ref<{
    [key: string | number]: any,
    id: number | null,
    ownerId: number,
    name: string | null,
    startTime: string | null | Date,
    endTime: string | null | Date,
    cost: number | null,
    createTime: string | null | Date
    owner: any
}[]>([])
const ownerOptions = ref<{
    [key: string | number]: any,
    id: number | null,
    name: string | null
}[]>([])

const costRangeOptions = ref([
    { label: '0-2万', value: 0, begin: 0, end: 20000 },
    { label: '2-4万', value: 1, begin: 20000, end: 40000 },
    { label: '4-6万', value: 2, begin: 40000, end: 60000 },
    { label: '6-8万', value: 3, begin: 60000, end: 80000 },
    { label: '8-10万', value: 4, begin: 80000, end: 100000 },
    { label: '10-12万', value: 5, begin: 100000, end: 120000 },
    { label: '12-14万', value: 6, begin: 120000, end: 140000 },
    { label: '14-16万', value: 7, begin: 140000, end: 160000 },
    { label: '16-18万', value: 8, begin: 160000, end: 180000 },
    { label: '18-20万', value: 9, begin: 180000, end: 200000 },
    { label: '20万以上', value: 10, begin: 200000, end: 10000000 }
]);

const handleCostRangeChange = (value: number) => {
    if (value === null) {
        acticityQuery.value.costBegin = null;
        acticityQuery.value.costEnd = null;
        return;
    }

    const selectedRange = costRangeOptions.value.find(option => option.value === value);
    if (selectedRange) {
        acticityQuery.value.costBegin = selectedRange.begin;
        acticityQuery.value.costEnd = selectedRange.end;
    }
};

const selectedCostRange = ref(null);

// 添加临时变量存储日期范围
const dateRange = ref(null);

// 处理日期范围变化
const handleDateRangeChange = (val: any) => {
    if (val) {
        acticityQuery.value.beginTime = val[0];
        acticityQuery.value.endTime = val[1];
    } else {
        acticityQuery.value.beginTime = null;
        acticityQuery.value.endTime = null;
    }
};

const getData = () => {
    doGet('/api/activity', {
        current: currentPage.value,
    }).then((res) => {
        if (res.data.code === 200) {
            activatyList.value = res.data.data.list;
            total.value = res.data.data.total;
            pageSize.value = res.data.data.pageSize;
        }
    }).catch((err) => {
        ElMessage.error('获取数据失败，请稍后重试！');
    });
}

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

const resetForm = () => {
    queryFormRef.value.resetFields();
    isFilter.value = false;
    selectedCostRange.value = null;
    dateRange.value = null; // 重置日期范围选择器
    acticityQuery.value = {
        ownerId: null,
        activityName: null,
        beginTime: null,
        endTime: null,
        costBegin: null,
        costEnd: null,
        createTime: null
    };
    getData();
};

const searchActivities = () => {
    queryFormRef.value.validate((valid: boolean) => {
        if (valid) {
            isFilter.value = true;
            const queryJson = JSON.stringify(acticityQuery.value);
            doGet('/api/activity', {
                query: queryJson,
                current: currentPage.value,
            }).then((res) => {
                console.log(res);
                if (res.data.code === 200) {
                    activatyList.value = res.data.data.list;
                    total.value = res.data.data.total;
                    pageSize.value = res.data.data.pageSize;
                } else {
                    ElMessage.error('过滤失败，请稍后重试！');
                }
            }).catch((err) => {
                ElMessage.error('过滤失败，请稍后重试！');
            });
        } else {
            ElMessage.error('过滤条件有误，请检查输入！');
        }
    });
}

const toAddPage = () => {
    router.push("activity/add");
}

const isEdit = ref(false)
const editActivity = (row: any) => {
    isEdit.value = true;
    editActivityDetail.value.id = row.id;
    editActivityDetail.value.ownerId = row.ownerId;
    editActivityDetail.value.name = row.name;
    editActivityDetail.value.startTime = row.startTime;
    editActivityDetail.value.endTime = row.endTime;
    editActivityDetail.value.cost = row.cost;
    editActivityDetail.value.description = row.description;
}

const editActivityDetail = ref<{
    id: number | null,
    ownerId: number | null,
    name: string | null,
    startTime: null | string,
    endTime: null | string,
    cost: number | null,
    description: string | null,
}>({
    id: null,
    ownerId: null,
    name: null,
    startTime: null,
    endTime: null,
    cost: null,
    description: null
})

const editActivityRules = ref({
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

const editActivityFormRef = ref()

const submitEditActivity = () => {
    editActivityFormRef.value.validate((valid: boolean) => {
        if (valid) {
            doPut('/api/activity', editActivityDetail.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('修改成功！');
                    getData();
                    isEdit.value = false;
                } else {
                    ElMessage.error('修改失败，请稍后重试！');
                }
            }).catch((err) => {
                ElMessage.error('修改失败，请稍后重试！');
            });
        } else {
            ElMessage.error('修改条件有误，请检查输入！');
        }
    });
    isEdit.value = false;
}

const isDetail = ref(false)
const activityDetail = ref<{
    id: number,
    ownerName: string | null,
    name: string | null,
    startTime: null | string,
    endTime: null | string,
    cost: number | null,
    createBy: string | null,
    createTime: string | null,
    editBy: string | null,
    editTime: string | null,
    description: string | null,
}>(
    {
        id: 0,
        ownerName: null,
        name: null,
        startTime: null,
        endTime: null,
        cost: null,
        description: null,
        createBy: null,
        createTime: null,
        editBy: null,
        editTime: null
    }
)

const ActivityRemark = ref<{
    activityId: number | null,
    noteContent: string | null,
    createBy: number | null,
    createByName: string | null,
    createTime: string | null,
    editBy: number | null,
    editByName: string | null,
    editTime: string | null,
}[]>() // 活动备注

const addActivityRemark = ref<{
    activityId: number | null,
    noteContent: string | null
}>({
    activityId: null,
    noteContent: null
}) // 添加活动备注

const getRemarkCreateAndEditName = () => {
    // 如果 ActivityRemark 不存在或不是数组，直接返回
    if (!ActivityRemark.value || !Array.isArray(ActivityRemark.value)) {
        return;
    }
    
    ActivityRemark.value.forEach(remark => {
        // 处理创建人名称
        if (remark.createBy !== null && remark.createBy !== undefined) {
            // 在 ownerOptions 中查找匹配的创建人
            const creator = ownerOptions.value.find(owner => owner.id === remark.createBy);
            if (creator) {
                remark.createByName = creator.name;
            } else {
                remark.createByName = '未知'; // 未找到对应用户时的默认显示
            }
        } else {
            remark.createByName = '系统'; // createBy 为空时的默认显示
            remark.createTime = '无'; // createTime 为空时的默认显示
        }

        // 处理编辑人名称
        if (remark.editBy !== null && remark.editBy !== undefined) {
            // 在 ownerOptions 中查找匹配的编辑人
            const editor = ownerOptions.value.find(owner => owner.id === remark.editBy);
            if (editor) {
                remark.editByName = editor.name;
            } else {
                remark.editByName = '未知'; // 未找到对应用户时的默认显示
            }
        } else {
            remark.editByName = '无'; // editBy 为空时的默认显示
            remark.editTime = '无'; // editTime 为空时的默认显示
        }
    });
}

const getActivityRemark = (activityId: number) => {
    doGet('/api/activity_remark', {
        activityId: activityId,
    }).then((res) => {
        if (res.data.code === 200) {
            ActivityRemark.value = res.data.data;
            getRemarkCreateAndEditName();
        } else {
            ElMessage.error('获取活动备注失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('获取活动备注失败，请稍后重试！');
    });
}

const showDetail = (row: any) => {
    isDetail.value = true;
    activityDetail.value.id = row.id;
    activityDetail.value.ownerName = row.owner.name;
    activityDetail.value.name = row.name;
    activityDetail.value.startTime = row.startTime;
    activityDetail.value.endTime = row.endTime;
    activityDetail.value.cost = row.cost;
    if (row.createBy === null) {
        activityDetail.value.createBy = "无";
    } else {
        activityDetail.value.createBy = ownerOptions.value[row.createBy - 1].name;
    }
    activityDetail.value.createTime = row.createTime;
    if (row.editBy === null) {
        activityDetail.value.editBy = "无";
    } else {
        activityDetail.value.editBy = ownerOptions.value[row.editBy - 1].name;
    }
    activityDetail.value.editTime = row.editTime;
    activityDetail.value.description = row.description;
    getActivityRemark(row.id);
}

const submitNewActivityRemark = () => {
    if (addActivityRemark.value.noteContent === null || addActivityRemark.value.noteContent === "") {
        ElMessage.error('备注内容不能为空！');
        return;
    }
    addActivityRemark.value.activityId = activityDetail.value.id;
    console.log(addActivityRemark.value);
    doPost("/api/activity_remark", addActivityRemark.value).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success('备注添加成功！');
            getActivityRemark(activityDetail.value.id);
            addActivityRemark.value.noteContent = null;
        } else {
            ElMessage.error('备注添加失败，请稍后重试！');
        }
    }).catch((err) => {
        ElMessage.error('备注添加失败，请稍后重试！');
    });
}

const editedActivityRemark = ref<{
    id: number | null,
    noteContent: string | null,
}>({
    id: null,
    noteContent: null,
}) // 编辑活动备注
const editActivityRemark = (row: any) => {
    editedActivityRemark.value.id = row.id;
    editedActivityRemark.value.noteContent = row.noteContent;
    ElMessageBox.prompt('请编辑备注内容', '编辑备注', {
        inputValue: row.noteContent,
        confirmButtonText: '确定编辑',
        cancelButtonText: '取消',
        inputPattern: /.+/, // 正则表达式，确保输入不为空
        inputErrorMessage: '备注内容不能为空！'
    }).then(({ value }) => {
        editedActivityRemark.value.noteContent = value;
        doPut("/api/activity_remark", editedActivityRemark.value).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('备注修改成功！');
                getActivityRemark(activityDetail.value.id);
            } else {
                ElMessage.error('备注修改失败，请稍后重试！');
            }
        }).catch((err) => {
            ElMessage.error('备注修改失败，请稍后重试！');
        });
    }).catch(() => {
        ElMessage.info('已取消编辑');
    });
}

const deleteActivityRemark = (id: number) => {
    console.log(id);
    ElMessageBox.confirm('确定删除该备注吗？', '提示', {
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
    }).then(() => {
        doDelete("/api/activity_remark/"+id).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('备注删除成功！');
                getActivityRemark(activityDetail.value.id);
            } else {
                ElMessage.error('备注删除失败，请稍后重试！');
            }
        }).catch((err) => {
            ElMessage.error('备注删除失败，请稍后重试！');
        });
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
}

const deleteActivity = (id: number) => {
    ElMessageBox.confirm('确定删除该活动吗？', '提示', {
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
    }).then(() => {
        doDelete("/api/activity/"+id).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('活动删除成功！');
                getData();
            } else {
                ElMessage.error('活动删除失败，请稍后重试！');
            }
        }).catch((err) => {
            ElMessage.error('活动删除失败，请稍后重试！');
        });
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
}

const selectedActivities = ref<number[]>([]); // 选中的活动ID数组
const handleSelectionChange = (selection: any[]) => {
    selectedActivities.value = []
    selection.forEach((row: any) => {
        selectedActivities.value.push(row.id);
    })
}
const batchDeleteActivities = () => {
    if (selectedActivities.value.length === 0) {
        ElMessage.warning("请选择要删除的活动~")
        return;
    }
    ElMessageBox.confirm("是否批量删除选中的活动？", "提示", {
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
    }).then(() => {
        let activitiesIds = selectedActivities.value.join(",");
        doDelete("/api/activity/batch", { ids: activitiesIds }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success("批量删除成功！");
                getData();
            } else {
                ElMessage.error("批量删除失败，请稍后重试！");
            }
        }).catch((err) => {
            ElMessage.error("批量删除失败，请稍后重试！");
        });
    }).catch(() => {
        ElMessage.info("已取消删除");
    });
}

onMounted(() => {
    currentPage.value = 1;
    getData();
    getOwnerNames();
});
</script>

<template>
    <el-form :inline="true" :model="acticityQuery" label-width="80px" class="inline-form" :rules="activityRules"
        ref="queryFormRef">
        <el-form-item label="负责人">
            <el-select v-model="acticityQuery.ownerId" placeholder="请输入负责人" clearable>
                <el-option v-for="item in ownerOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="活动名称">
            <el-input v-model="acticityQuery.activityName" placeholder="请输入活动名称" clearable />
        </el-form-item>
        <el-form-item label="活动时间">
            <el-date-picker v-model="dateRange" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" @change="handleDateRangeChange" />
        </el-form-item>
        <el-form-item label="预算范围">
            <el-select v-model="selectedCostRange" placeholder="请选择预算范围" clearable @change="handleCostRangeChange">
                <el-option v-for="item in costRangeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
            <el-date-picker v-model="acticityQuery.createTime" type="datetime" placeholder="创建时间"
                format="YYYY-MM-DD HH:mm:ss" date-format="MMM DD, YYYY" time-format="HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchActivities">搜索</el-button>
            <el-button type="primary" plain @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>

    <el-button type='primary' @click="toAddPage">录入市场活动</el-button>
    <el-button type="danger" @click="batchDeleteActivities" v-permission="'activity:delete'">批量删除</el-button>
    <hr>
    <el-table :data="activatyList" style="width: 100%" empty-text="暂无数据" 
    @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column property="owner.name" label="负责人" width="100" show-overflow-tooltip />
        <el-table-column property="name" label="活动名称" width="100" show-overflow-tooltip />
        <el-table-column property="startTime" label="开始时间" width="180" show-overflow-tooltip />
        <el-table-column property="endTime" label="结束时间" width="180" show-overflow-tooltip />
        <el-table-column property="cost" label="活动预算" width="100" show-overflow-tooltip />
        <el-table-column property="createTime" label="创建时间" width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="200" show-overflow-tooltip>
            <template #default="scope">
                <el-button type="primary" size="small" @click="showDetail(scope.row)" v-permisson="'activity:view'">详情</el-button>
                <el-button type="success" size="small" @click="editActivity(scope.row)" v-permission="'activity:edit'">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteActivity(scope.row.id)" v-permisson="'activity:delete'">删除</el-button>
            </template>
        </el-table-column>
    </el-table><br>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
        v-model:current-page="currentPage" @update:current-page="!isFilter ? getData() : searchActivities()" />

    <!--编辑的抽屉组件-->
    <el-drawer v-model="isEdit" :title="`编辑活动 - ${editActivityDetail.name}`" :size="'50%'"
        :close-on-click-overlay="false">
        <el-form :model="editActivityDetail" :rules="editActivityRules" label-width="80px" ref="editActivityFormRef">
            <el-form-item label="负责人" prop="ownerId">
                <el-select v-model="editActivityDetail.ownerId" placeholder="请选择负责人" clearable>
                    <el-option v-for="item in ownerOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="editActivityDetail.name" placeholder="请输入活动名称" clearable />
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker v-model="editActivityDetail.startTime" type="datetime" placeholder="选择开始时间"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="editActivityDetail.endTime" type="datetime" placeholder="选择结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="活动预算" prop="cost">
                <el-input-number :min="1" :precision="2" :step="100" size="large" controls-position="right"
                    v-model="editActivityDetail.cost" />
            </el-form-item>
            <el-form-item label="活动描述" prop="description">
                <el-input v-model="editActivityDetail.description" type="textarea" placeholder="请输入活动描述" clearable
                    :autosize="{ minRows: 8, maxRows: 12 }" />
            </el-form-item>
            <el-form-item class="form-buttons">
                <el-button type="primary" size="large" @click="submitEditActivity">提交</el-button>
                <el-button type="default" size="large" @click="isEdit = false">返回</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>

    <!--详情的抽屉组件-->
    <el-drawer v-model="isDetail" :title="`活动详情 - ${activityDetail.name}`" :size="'70%'" :close-on-click-overlay="false"
        direction="rtl" @close="() => {
            isDetail = false;
            addActivityRemark.noteContent = null;
            addActivityRemark.activityId = null;
        }">
        <div class="detail-container">
            <!-- 基本信息部分 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>基本信息</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="负责人">{{ activityDetail.ownerName }}</el-descriptions-item>
                    <el-descriptions-item label="活动名称">{{ activityDetail.name }}</el-descriptions-item>
                    <el-descriptions-item label="开始时间">{{ activityDetail.startTime }}</el-descriptions-item>
                    <el-descriptions-item label="结束时间">{{ activityDetail.endTime }}</el-descriptions-item>
                    <el-descriptions-item label="活动预算">
                        <el-tag type="success">￥{{ activityDetail.cost }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="活动描述" :span="2">
                        <div class="description-content">{{ activityDetail.description }}</div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 其他信息部分 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>创建和修改信息</span>
                    </div>
                </template>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="创建人">
                        <el-tag size="small" type="info">{{ activityDetail.createBy }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ activityDetail.createTime }}</el-descriptions-item>
                    <el-descriptions-item label="修改人">
                        <el-tag size="small" type="info">{{ activityDetail.editBy }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="修改时间">{{ activityDetail.editTime }}</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 活动备注部分 -->
            <el-card class="detail-card">
                <template #header>
                    <div class="card-header">
                        <span>活动备注</span>
                    </div>
                </template>
                <div class="remark-form">
                    <el-form>
                        <el-form-item>
                            <el-input v-model="addActivityRemark.noteContent" type="textarea"
                                :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入新的备注内容..." />
                        </el-form-item>
                        <el-form-item>
                            <div class="remark-buttons">
                                <el-button type="primary" @click="submitNewActivityRemark">添加备注</el-button>
                                <el-button plain @click="addActivityRemark.noteContent = ''">清空</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 备注列表 -->
                <div class="remark-list">
                    <div class="remark-title">历史备注</div>
                    <el-table :data="ActivityRemark" style="width: 100%" empty-text="暂无备注记录" stripe>
                        <el-table-column type="index" label="序号" width="60" />
                        <el-table-column property="noteContent" label="备注内容" min-width="200" show-overflow-tooltip />
                        <el-table-column label="创建信息" width="200">
                            <template #default="scope">
                                <div class="user-info">
                                    <span>{{ scope.row.createByName }}</span>
                                    <el-divider direction="vertical" />
                                    <span>{{ scope.row.createTime }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="修改信息" width="200">
                            <template #default="scope">
                                <div class="user-info" v-if="scope.row.editByName !== '无'">
                                    <span>{{ scope.row.editByName }}</span>
                                    <el-divider direction="vertical" />
                                    <span>{{ scope.row.editTime }}</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template #default="scope">
                                <el-button type="primary" size="small" plain @click="editActivityRemark(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" plain @click="deleteActivityRemark(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <div class="detail-actions">
                <el-button type="default" @click="isDetail = false">关闭</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<style scoped>
.inline-form .el-select {
    --el-select-width: 180px;
}

.inline-form .el-input {
    --el-input-width: 180px;
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
</style>