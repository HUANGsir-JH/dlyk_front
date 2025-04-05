import axios from 'axios';
import router from '@/router';
import { getTokenName } from '@/utils/util';
import { ElMessage } from 'element-plus';
import { useRememberStore } from '@/stores/rememberStore';


const instance = axios.create({
    baseURL: 'http://localhost:8080', 
    timeout: 10000, // 请求超时时间
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(getTokenName()); // 从localStorage中获取token
        if (token) {
            config.headers['Authorization'] = token; // 设置请求头
            const rememberStore = useRememberStore(); 
            config.headers['remember'] = rememberStore.rememberMe; // 设置rememberMe
        }
        return config;
    }, (error) => { 
        return Promise.reject(error); // 请求错误时返回错误信息
    }
)

instance.interceptors.response.use(
    (response) => {
        if (response.data.code === 401) { 
            ElMessage.error('登录已过期，请重新登录'); // 提示信息
            localStorage.removeItem(getTokenName()); // 移除token
            router.push('/login'); // 跳转到登录页面
        }
        return response; // 返回响应数据
    }, (error) => {
       return Promise.reject(error); // 响应错误时返回错误信息
    }
)

export const doGet = async (url: string, params?: any) => { // params?表示参数是可选的
    try {
        const response = await instance({
            method: 'get',
            url: url,
            params: params, // get请求是通过params传递参数
        });
        return response;
    }catch (error) {
        console.error('Error:', error);
        return Promise.reject(error); // 返回Promise.reject以便调用者可以处理错误
    }
}

export const doPost = async (url: string, data?: any) => { 
    try {
        const response = await instance({
            method: 'post',
            url: url,
            data: data, // post请求是通过data传递参数
            
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        return Promise.reject(error); 
    }
}

export const doPut = async (url: string, data?: any) => { 
    try {
        const response = await instance({
            method: 'put',
            url: url,
            data: data, // put请求是通过data传递参数
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        return Promise.reject(error); 
    }
}

export const doDelete = async (url: string, params?: any) => { 
    try {
        const response = await instance({
            method: 'delete',
            url: url,
            params: params, // delete请求是通过params传递参数
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        return Promise.reject(error); 
    }
}