import { defineStore } from "pinia";
import { ref } from "vue";

export const useRememberStore = defineStore("remember", () => {
    const rememberMe = ref('0'); // 是否记住我
    
    function setRememberMe(value: string) {
        rememberMe.value = value; // 设置是否记住我
    }
    
    return { rememberMe, setRememberMe }; // 返回状态和方法
}, {
    persist:true, // 持久化存储
})