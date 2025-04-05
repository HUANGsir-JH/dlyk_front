<script setup lang="ts">
import { ref ,onMounted} from 'vue';
import { doGet } from '@/http/httpRequest';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';

const statisticData = ref<{
    effectiveActivityCount: number;
    totalActivityCount: number;
    totalClueCount: number;
    totalCustomerCount: number;
    successTranAmount: number;
    totalTranAmount: number;
}>({
    effectiveActivityCount: 0,
    totalActivityCount: 0,
    totalClueCount: 0,
    totalCustomerCount: 0,
    successTranAmount: 0,
    totalTranAmount: 0,});
const getStatisticData = () => {
    doGet("/api/summary/data", {}).then((res) => {
        if (res.data.code === 200) {
            statisticData.value = res.data.data;
        } else {
            ElMessage.error("获取统计数据失败");
        }
    }).catch((err) => {
        ElMessage.error("获取统计数据服务异常");
    })
}

const getFunnelData = () => {
    doGet("/api/saleFunnel/data", {}).then((res) => {
        if (res.data.code === 200) {
            let funnelData = res.data.data;
            let funnelDataList = []
            for (let i = 0; i < funnelData.length; i++) {
                funnelDataList.push(funnelData[i].name);
            } // 获取漏斗图数据
            loadFunnelChart(funnelData, funnelDataList);
        } else {
            ElMessage.error("获取漏斗图数据失败");
        }
    }).catch((err) => {
        ElMessage.error("获取漏斗图数据服务异常");
    })
}

const getPieData = () => {
    doGet("/api/cluePie/data", {}).then((res) => {
        if (res.data.code === 200) {
            let pieData = res.data.data;
            loadPieChart(pieData);
        } else {
            ElMessage.error("获取饼图数据失败");
        }
    }).catch((err) => {
        ElMessage.error("获取饼图数据服务异常");
    })
}

// 漏斗图
const loadFunnelChart = (funnelData: any, funnelDataList:any) => {
    const funnelChart = echarts.init(document.getElementById('funnel') as HTMLDivElement);
    const option = {
        title: {
            text: '销售漏斗图'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            data: funnelDataList
        },
        series: [
            {
                name: '销售数据',
                type: 'funnel',
                left: '5%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: funnelData
            }
        ]
    };
    funnelChart.setOption(option);
    window.addEventListener('resize', () => {
        funnelChart.resize();
    });// 监听窗口大小变化，自动调整图表大小
}

// 饼图
const loadPieChart = (pieData: any) => { 
    const pieChart = echarts.init(document.getElementById('pie') as HTMLDivElement);
    const option = {
        title: {
            text: '线索来源统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item', // 提示框触发类型
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: '来源',
                type: 'pie',
                radius: '50%', // 饼图半径
                data: pieData,
                emphasis: { // 高亮选中时的样式
                    itemStyle: {
                        shadowBlur: 10, // 阴影模糊大小
                        shadowOffsetX: 0, // 阴影X轴偏移量
                        shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
                    }
                }
            }
        ]
    }
    pieChart.setOption(option);
    window.addEventListener('resize', () => {
        pieChart.resize();
    });// 监听窗口大小变化，自动调整图表大小
}

// 柱状图
const selectYear = ref<number>(2023);
const yearList = ref<number[]>([]);
const generateYearList = () => {
    const startYear = 2023; // 起始年份
    const currentYear = new Date().getFullYear();
    for(let i = startYear; i <= currentYear; i++) {
        yearList.value.push(i);
    }
}

const getBarData = () => {
    doGet("/api/activityBar/data", { year: selectYear.value }).then((res) => {
        if (res.data.code === 200) {
            let barData = res.data.data;
            let valueList = []
            let nameList = []
            for (let i = 0; i < barData.length; i++) {
                valueList.push(barData[i].value);
                nameList.push(barData[i].name+'月');
            } // 获取柱状图数据
            loadBarChart(valueList, nameList);
        } else {
            ElMessage.error("获取柱状图数据失败");
        }
    }).catch((err) => {
        ElMessage.error("获取柱状图数据服务异常");
    })
}

const loadBarChart = (valueList: any, nameList: any) => {
    // 如果已经存在图表实例，则先dispose掉
    const existingChart = echarts.getInstanceByDom(document.getElementById('activityBarGraph') as HTMLDivElement);
    if (existingChart) {
        existingChart.dispose();
    }
    // 创建新的图表实例
    const barChart = echarts.init(document.getElementById('activityBarGraph') as HTMLDivElement);
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        title: {
            text: '年度活动统计',
            left: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: nameList,
                axisTick: {
                    alignWithLabel: true // 坐标轴刻度线与标签对齐
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '活动统计',
                type: 'bar',
                barWidth: '60%',
                data: valueList
            }
        ]
    };
    barChart.setOption(option);
    window.addEventListener('resize', () => {
        barChart.resize();
    });// 监听窗口大小变化，自动调整图表大小
}

onMounted(() => {
    getStatisticData();
    getFunnelData();
    getPieData();
    generateYearList();
    getBarData();
});
</script>

<template>
    <el-row justify="center" class="statistic-row">
        <el-col :span="6">
            <el-statistic title="市场活动" :value="statisticData.effectiveActivityCount">
                <template #suffix>/{{ statisticData.totalActivityCount }}</template>
            </el-statistic>
        </el-col>
        <el-col :span="6">
            <el-statistic title="线索总数" :value="statisticData.totalClueCount" />
        </el-col>
        <el-col :span="6">
            <el-statistic title="客户总数" :value="statisticData.totalCustomerCount" />
        </el-col>
        <el-col :span="6">
            <el-statistic title="交易总数" :value="statisticData.successTranAmount">
                <template #suffix>/{{ statisticData.totalTranAmount }}</template>
            </el-statistic>
        </el-col>
    </el-row>
    <el-divider />
    <div style="display: flex; justify-content: space-around; margin-top: 50px;">
        <div id="funnel" style="width: 50%;height:400px;"></div>
        <div id="pie" style="width: 50%;height:400px;"></div>
    </div>
    <el-divider />
    <div class="bar-chart-container">
        <!--选择年份-->
        <el-select v-model="selectYear" placeholder="选择年份" style="width: 200px; margin: 20px auto;"
            @change="getBarData">
            <el-option v-for="year in yearList" :key="year" :lable="year+'年'" :value="year"/>
        </el-select>
        <div id="activityBarGraph" style="width: 90%; height:500px"></div>
    </div>

</template>

<style scoped>
.statistic-row {
    margin: 20px 0;
    text-align: center;
    font-size: 16px;
    color: #666;
}
.bar-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>