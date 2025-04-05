<script setup lang="ts">

</script>

<template>
    <div class="system-container">
        <h1>系统管理</h1>

        <div class="card">
            <p><span>(╥﹏╥)</span></p>
            <p><span>(。>︿<)θ</span></p>
            <p><span>(｡•́︿•̀｡)</span></p>
        </div>

        <span>系统管理功能正在开发中...</span>
    </div>
</template>

<style scoped>
.system-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-top: 50px;
}

/* From Uiverse.io by joe-watson-sbf (with modified colors) */
.card {
    width: 280px;
    height: 254px;
    border-radius: 8px;
    background: #3a7ca5;
    display: flex;
    gap: 5px;
    padding: .4em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
}

.card p {
    height: 90%;
    flex: 1;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    transition: all .5s;
    background: #2c3e50;
    border: 1px solid #16a085;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card p:hover {
    flex: 4;
}

.card p span {
    min-width: 14em;
    padding: .5em;
    text-align: center;
    transform: rotate(-90deg);
    transition: all .5s;
    text-transform: uppercase;
    color: #2ecc71;
    letter-spacing: .1em;
    font-weight: 600;
}

.card p:hover span {
    transform: rotate(0);
}
</style>