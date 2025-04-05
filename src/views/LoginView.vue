<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { doPost,doGet } from '@/http/httpRequest'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { getTokenName } from '@/utils/util';
import { useRememberStore } from '@/stores/rememberStore';
const router = useRouter();
const isRemember = ref(false);
const loginFormRef = ref(); // 添加表单引用
const isLogin = ref(false); // 是否正在登录
const rememberStore = useRememberStore(); // 使用 Pinia store 来管理记住我状态

const loginData = ref({
    username: '',
    password: ''
});
const rules = {
    username: [
        { required: true, message: '请输入账户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
    ]
}
const login = () => {
    loginFormRef.value.validate((valid: boolean) => {
        if (valid) {
            // 创建表单数据对象
            const formData =new FormData();
            formData.append('username', loginData.value.username);
            formData.append('password', loginData.value.password);
            formData.append('remember', isRemember.value ? '1' : '0'); // 记住我选项
            rememberStore.setRememberMe(isRemember.value ? '1' : '0'); // 更新 Pinia store 的记住我状态
            // 发送登录请求
            isLogin.value = true; // 设置登录状态为正在登录
            window.localStorage.removeItem(getTokenName());// 清除之前的token
            doPost('/api/login',formData).then((Response) => {
                if (Response.data.code === 200) {
                    ElMessage.success('登录成功!');
                    isLogin.value = false; // 登录完成后重置登录状态
                    window.localStorage.setItem(getTokenName(), Response.data.data);
                    router.push('/dashboard');
                } else {
                    ElMessage.error('账户或密码失败!');
                }
            }).catch((error) => {
                console.error('登录失败:', error);
            });
        } else {
            alert('表单验证失败');
        }
    });
}
const freeLogin = () => {
    let token = window.localStorage.getItem(getTokenName());
    if(token){
        doGet('/api/login/free', {}).then((response) => {
            if (response.data.code === 200) {
                ElMessage.success('登录成功!');
                router.push('/dashboard');
            } 
        })
    }
}

onMounted(() => {
    freeLogin();
})
</script>

<template>
    <el-container>
        <el-aside width="300px">
            <img src="@/assets/loginBox.svg" alt="Weclome" style="width: 100%; height: auto;margin-top: 80px;" />
            <p>欢迎使用动力云客系统！</p>
        </el-aside>
        <el-main>
            <el-form class="login-form" label-position="left" :rules="rules" :model="loginData" size="large" ref="loginFormRef">
                <el-form-item><span style="font-weight: bold;font-size: medium;">欢迎登录</span></el-form-item>
                <el-form-item label="账户" prop="username" size="large">
                    <el-input type="text" placeholder="请输入账户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" size="large">
                    <el-input type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" size="large" @click="login" :loading="isLogin">登录</el-button>
                </el-form-item>
                <el-checkbox v-model="isRemember">记住我</el-checkbox>
            </el-form>
        </el-main>
    </el-container>
</template>

<style scoped>
.el-aside {
    background-color: #f0f2f5;
    width: 40%;

    p{
        text-align: center;
    }
}
.el-main {
    background-color: #ffffff;
    width: 60%;
    height: 100vh;
}
.login-form {
    width: 600px;
    margin: 25% auto;
    padding-top: 50px;
    text-align: center;
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>