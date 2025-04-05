<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { doGet } from '@/http/httpRequest';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter,RouterView,useRoute } from 'vue-router';
import { getTokenName } from '@/utils/util';
import { useUserPermissionStore } from '@/stores/userPermissionStore'
const isCollapse = ref(false);
const userName = ref('默认用户');
const roleList = ref<string[]>([])

const userPermissionStore = useUserPermissionStore()

const router = useRouter();
const route = useRoute();

const user = ref<any>({})
const loadUserInfo = () => {
    doGet('/api/login/info').then((res) => {
        if (res.data.code === 200) {
            userName.value = res.data.data.name;
            roleList.value = res.data.data.roleList;
            user.value = res.data.data;
            userPermissionStore.setUserPermission(res.data.data.permissionList);
        } else {
            ElMessage.error('服务端异常');
        }
    }).catch((err) => {
        ElMessage.error('服务端异常');
    })
}

const logOut = () => {
    ElMessageBox.confirm('确定要退出登录吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        doGet('/api/logout').then((res) => {
            if (res.data.code === 200) {
                ElMessage.success('退出成功');
                localStorage.removeItem(getTokenName());
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            } else {
                ElMessage.error('退出失败,稍后重试');
            }
        }).catch((err) => {
            console.log(err);
            ElMessage.error('服务端异常');
        })
    })
}

const currentRoute = ref("")
const updateCurrentRoute = () => {
    currentRoute.value = route.path;
    let routes = currentRoute.value.split('/');
    currentRoute.value = '/' + routes[1] + '/' + routes[2];
}


onMounted(() => {
    loadUserInfo();
    updateCurrentRoute();
})

</script>

<template>
    <el-container>
        <el-aside :class="!isCollapse ? 'el-aside' : 'el-aside collapse'">
            <h4 @click="router.push('/dashboard')" style="cursor: pointer;">动力云客管理系统</h4>
            <el-menu class="el-menu" :collapse="isCollapse" router :unique-opened="true" :default-active="currentRoute">

                <el-sub-menu v-for="(menuPermission,index) in user.menuPermissionList" :key="menuPermission.id"
                    :index="String(index+1)">
                    <template #title>
                        <el-icon>
                            <component :is="menuPermission.icon" size="20px"></component>
                        </el-icon>
                        <span>{{ menuPermission.name }}</span>
                    </template>
                    <el-menu-item v-for="subPermission in menuPermission.subPermissionList" :key="subPermission.id"
                        :index="subPermission.url">
                        <template #title>
                            <el-icon>
                                <component :is="subPermission.icon" size="20px"></component>
                            </el-icon>
                            <span>{{ subPermission.name }}</span>
                        </template>
                    </el-menu-item>
                </el-sub-menu>

            </el-menu>
        </el-aside>
        <el-container class="main-container">
            <el-header>
                <el-icon size="20px" v-if="!isCollapse" @click="isCollapse = !isCollapse">
                    <Fold />
                </el-icon>
                <el-icon size="20px" v-else @click="isCollapse = !isCollapse">
                    <Expand />
                </el-icon>
                <el-dropdown>
                    <el-button type="default"
                        style="background-color:rgb(216, 231, 241);border: 1px solid #333;border-radius: 15px;">
                        {{ userName }}<el-icon><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="ElMessage.info('这个人很懒，页面没写。(；´∀｀)')">
                                    我的资料
                            </el-dropdown-item>
                            <el-dropdown-item @click="ElMessage.info('密码都是aaa111，不用改了。 (￣▽￣)/♫•*¨*•.¸¸♪')">
                                    修改密码
                            </el-dropdown-item>
                            <el-dropdown-item divided @click="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main>
                <RouterView />
            </el-main>
            <el-footer>dlyk-Learning from PowerNode</el-footer>
        </el-container>
    </el-container>
</template>

<style scoped>
.el-menu{
    --el-menu-bg-color: rgb(197, 202, 209);
    --el-menu-text-color: #333;
    --el-menu-active-text-color: #409eff;
    --el-menu-hover-text-color: #409eff;
}
/* 选中的菜单项样式 */
:deep(.el-menu-item.is-active) {
    color: var(--el-menu-active-text-color);
    background-color: #ecf5ff;
    /* 浅蓝背景 */
}
.el-aside {
    width: 15%;
    height: 100vh;
    background-color: rgb(225, 233, 236);
    transition: all 0.3s ease;
}
.el-aside.collapse {
    width: 64px;
    transition: all 0.3s ease;
}
h4 {
    text-align: center;
    height:50px;
    line-height: 50px;
    font-size: 15px;
    margin: 0;
    color: #333;
}
.el-header{
    height: 50px;
    line-height: 50px;
    background-color: rgb(216, 231, 241);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.el-header :deep(.el-icon){
    margin-left: 5px;
    cursor: pointer;
    &:hover{
        color: #409eff;
    }
}
.el-footer{
    height: 30px;
    background-color: rgb(216, 231, 241);
    text-align: center;
    line-height: 30px;
}
.main-container{
    height: 100vh;
}
</style>