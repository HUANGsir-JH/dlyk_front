<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doGet, doPost, doPut } from '@/http/httpRequest';
import { ElMessage } from 'element-plus';

const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);


const products = ref<{
    id: number;
    name: string;
    guidePriceS: number; // 官方指导起始价格
    guidePriceE: number; // 官方指导最高价格
    quotation: number; // 经销商报价
    state: number; // 产品状态 0:上架 1:下架
    createBy: number;
    createTime: string;
    editBy: number;
    editTime: string;
}[]>([]);
const filterData = ref({
    name: null,
    guidePriceS: null,
    guidePriceE: null,
    quotation: null,
    state: null
})
const resetFilter = () => {
    filterData.value = {
        name: null,
        guidePriceS: null,
        guidePriceE: null,
        quotation: null,
        state: null
    }
    currentPage.value = 1;
    getProducts();
}
const getProducts = () => {
    let filterDataJson = JSON.stringify(filterData.value);
    doGet("/api/product", {
        current: currentPage.value,
        ProductFilter: filterDataJson,
    }).then((res) => {
        if (res.data.code === 200) {
            products.value = res.data.data.list;
            total.value = res.data.data.total;
            pageSize.value = res.data.data.pageSize;
        } else {
            console.error("获取产品列表失败");
        }
    }).catch((err) => {
        console.error("获取产品列表服务异常");
    })
}

// 添加产品
const newProduct = ref({
    name: null,
    guidePriceS: null,
    guidePriceE: null,
    quotation: null,
    state: null
})
const showAddProductDialog = ref(false);
const openAddProductDialog = () => {
    showAddProductDialog.value = true;
    newProduct.value = {
        name: null,
        guidePriceS: null,
        guidePriceE: null,
        quotation: null,
        state: null
    }
}
const addProductFormRef = ref();
const addProductFormRules = {
    name: [
        { required: true, message: "请输入产品名称", trigger: "blur" },
        { min: 2, max: 10, message: "长度在 2 到 10 个字符之间", trigger: "blur" }
    ],
    guidePriceS: [
        { required: true, message: "请输入指导起始价", trigger: "blur" },
        { type: "number", min: 0, message: "起始价不能小于0", trigger: "blur" }
    ],
    guidePriceE: [
        { required: true, message: "请输入指导最高价", trigger: "blur" },
        { type: "number", min: 0, message: "最高价不能小于0", trigger: "blur" },
        { validator: (rule: any, value: any, callback: any) => {
            if (value && newProduct.value.guidePriceS && value < newProduct.value.guidePriceS) {
                callback(new Error("指导最高价不能小于指导起始价"));
            } else {
                callback();
            }
        }, trigger: "blur" }
    ],
    quotation: [
        { required: true, message: "请输入经销商报价", trigger: "blur" },
        { type: "number", min: 0, message: "报价不能小于0", trigger: "blur" }
    ],
    state: [
        { required: true, message: "请选择产品状态", trigger: "change" }
    ]
}
const submitNewProduct = () => {
    if (!addProductFormRef.value) return;
    addProductFormRef.value.validate((valid:boolean) => {
        if (valid) {
            console.log("添加产品数据", newProduct.value);
            doPost("/api/product", newProduct.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('添加产品成功');
                    showAddProductDialog.value = false;
                    getProducts();
                } else {
                    ElMessage.error("添加产品失败，稍后重试");
                }
            }).catch((err) => {
                ElMessage.error("添加产品服务异常");
            });
        } else {
            ElMessage.warning('请正确填写所有必填项');
            return false;
        }
    });
}

// 取消添加
const cancelAddProduct = () => {
    showAddProductDialog.value = false;
    ElMessage.info('已取消添加');
    addProductFormRef.value.clearValidate(); // 清除表单验证状态
    newProduct.value = {
        name: null,
        guidePriceS: null,
        guidePriceE: null,
        quotation: null,
        state: null
    }
}

// 编辑产品
const showEditProductDialog = ref(false);
const editProductFormRef = ref();
const editProductData = ref({
    id: null,
    name: null,
    guidePriceS: null,
    guidePriceE: null,
    quotation: null,
    state: null
})
const editProduct = (product:any) => {
    showEditProductDialog.value = true;
    editProductData.value = {
        id: product.id,
        name: product.name,
        guidePriceS: product.guidePriceS,
        guidePriceE: product.guidePriceE,
        quotation: product.quotation,
        state: product.state
    }
}
const cancelEditProduct = () => {
    showEditProductDialog.value = false;
    editProductFormRef.value.clearValidate(); // 清除表单验证状态
    editProductData.value = {
        id: null,
        name: null,
        guidePriceS: null,
        guidePriceE: null,
        quotation: null,
        state: null
    }
}
const submitEditProduct = () => {
    editProductFormRef.value.validate((valid:boolean) => {
        if (valid) {
            doPut("/api/product", editProductData.value).then((res) => {
                if (res.data.code === 200) {
                    ElMessage.success('编辑产品成功');
                    showEditProductDialog.value = false;
                    getProducts();
                } else {
                    ElMessage.error("编辑产品失败，稍后重试");
                }
            }).catch((err) => {
                ElMessage.error("编辑产品服务异常");
            });
        } else {
            ElMessage.warning('请正确填写所有必填项');
            return false;
        }
    });
}

// 删除产品
const deleteProduct = () => {
    ElMessage.info('删不得啊！(꒪ꇴ꒪ ||)');
}

onMounted(() => {
    getProducts();
})

</script>

<template>
    <el-form :inline="true" class="filter-form">
        <el-form-item label="产品名称" class="form-item">
            <el-input v-model="filterData.name" placeholder="请输入产品名称" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="指导起始价" class="form-item">
            <el-input-number :min="0" placeholder="起始价（万元）" v-model="filterData.guidePriceS" :step="0.1" :precision="2"
                class="input-width"></el-input-number>
        </el-form-item>
        <el-form-item label="指导最高价" class="form-item">
            <el-input-number :min="0" placeholder="最高价（万元）" v-model="filterData.guidePriceE" :step="0.1" :precision="2"
                class="input-width"></el-input-number>
        </el-form-item>
        <el-form-item label="经销商报价" class="form-item">
            <el-input-number :min="0" placeholder="经销商报价（万元）" v-model="filterData.quotation" :step="0.1" :precision="2"
                class="input-width"></el-input-number>
        </el-form-item>
        <el-form-item label="产品状态" class="form-item">
            <el-select v-model="filterData.state" placeholder="请选择产品状态" class="input-width">
                <el-option label="在售" value="0"></el-option>
                <el-option label="售罄" value="1"></el-option>
            </el-select>
        </el-form-item>
        <div class="form-buttons">
            <el-button type="primary" @click="getProducts">查询</el-button>
            <el-button type="success" @click="resetFilter">重置</el-button>
        </div>
    </el-form>
    <el-divider></el-divider>
    <el-button type="primary" @click="openAddProductDialog" class="add-button" v-permission="'product:add'">
        <el-icon>
            <CirclePlus />
        </el-icon>
        <span>添加产品</span>
    </el-button>

    <div class="product-container" v-if="products.length > 0">
        <div v-for="(product, index) in products" :key="index">
            <el-card class="product-card">
                <template #header>
                    <div class="card-header">
                        <span>{{ product.name }}</span>
                        <el-tag v-if="product.state === 0" type="success">在售</el-tag>
                        <el-tag v-else type="danger">售罄</el-tag>
                    </div>
                </template>
                <template #default ="scope">
                    <div class="card-content">
                        <p>指导起始价：{{ product.guidePriceS }} 万元</p>
                        <p>指导最高价：{{ product.guidePriceE }} 万元</p>
                        <p>经销商报价：{{ product.quotation }} 万元</p>
                        <p>创建时间：
                            <span v-if="product.createTime">{{ product.createTime }}</span>
                            <span v-else><el-tag type="info">暂无数据</el-tag></span>
                        </p>
                        <p>修改时间：
                            <span v-if="product.editTime">{{ product.editTime }}</span>
                            <span v-else><el-tag type="info">暂无数据</el-tag></span>
                        </p>
                    </div>
                </template>
                <template #footer>
                    <div class="card-footer">
                        <el-button type="primary" @click="editProduct(product)" v-permission="'product:edit'">编辑</el-button>
                        <el-button type="danger" @click="deleteProduct" v-permission="'product:delete'">删除</el-button>
                    </div>
                </template>
            </el-card>
        </div>
    </div>
    <el-empty v-else description="暂无数据"></el-empty>
    <el-pagination :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="getProducts"
        background layout="prev, pager, next" />

    <el-dialog title="添加产品" v-model="showAddProductDialog" width="40%" :close-on-click-modal="false">
        <el-form :model="newProduct" label-width="120px" class="product-form" :rules="addProductFormRules" ref="addProductFormRef">
            <el-form-item label="产品名称" prop="name">
                <el-input v-model="newProduct.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="指导起始价" prop="guidePriceS">
                <el-input-number v-model="newProduct.guidePriceS" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="指导最高价" prop="guidePriceE">
                <el-input-number v-model="newProduct.guidePriceE" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="经销商报价" prop="quotation">
                <el-input-number v-model="newProduct.quotation" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="产品状态" prop="state">
                <el-select v-model="newProduct.state" placeholder="请选择产品状态" style="width: 100%">
                    <el-option label="在售" :value="0"></el-option>
                    <el-option label="售罄" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelAddProduct">取消</el-button>
                <el-button type="primary" @click="submitNewProduct">确定</el-button>
            </div>
        </template>
    </el-dialog>

    <!--编辑框-->
    <el-dialog title="编辑产品" v-model="showEditProductDialog" width="40%" :close-on-click-modal="false">
        <el-form :model="editProductData" label-width="120px" class="product-form" :rules="addProductFormRules" ref="editProductFormRef">
            <el-form-item label="产品名称" prop="name">
                <el-input v-model="editProductData.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="指导起始价" prop="guidePriceS">
                <el-input-number v-model="editProductData.guidePriceS" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="指导最高价" prop="guidePriceE">
                <el-input-number v-model="editProductData.guidePriceE" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="经销商报价" prop="quotation">
                <el-input-number v-model="editProductData.quotation" :min="0" :step="0.1" :precision="2" style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="产品状态" prop="state">
                <el-select v-model="editProductData.state" placeholder="请选择产品状态" style="width: 100%">
                    <el-option label="在售" :value="0"></el-option>
                    <el-option label="售罄" :value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelEditProduct">取消</el-button>
                <el-button type="primary" @click="submitEditProduct">确定修改</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style scoped>
.product-card {
    position: relative;
    transition: all 0.3s;
}

.product-card .card-footer {
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-card:hover .card-footer {
    opacity: 1;
    height: 40px;
}

.product-container {
    display: flex;
    gap: 10px;
    justify-content: space-around;
}

.el-pagination {
    margin-top: 50px;
    text-align: center;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.card-content {
    font-size: 14px;
    color: #666;
}

.filter-form {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}

.form-item {
    margin-right: 20px;
    margin-bottom: 15px;
}

.input-width {
    width: 200px;
}

.form-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.add-button {
    margin-bottom: 30px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.product-form .el-form-item {
    margin-bottom: 22px;
}
</style>