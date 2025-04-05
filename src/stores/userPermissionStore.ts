import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserPermissionStore = defineStore("userPermission", () => { 
    const userPermission = ref<string[]>([])
    const setUserPermission = (permissions: string[]) => {
        userPermission.value = permissions
    }
    return {
        userPermission,
        setUserPermission
    }
}, {
    persist:true
})