<script setup lang="ts">

</script>

<template>
    <el-result style="margin: 0 auto; width: 100%; height: 100%;">
        <template #icon>
            <div class="card">HOVER</div>
        </template>
        <template #extra>
            <p>相比反复写增删改查的基本功能，时间更应花在新知识上</p>
            <p>所以，这个页面留待未来有空开发吧。</p>
            <p>(๑•̀ㅂ•́)و✧</p>
        </template>
    </el-result>
</template>

<style scoped>
.card {
    position: relative;
    width: 220px;
    height: 320px;
    background: mediumturquoise;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}

.card::before,
.card::after {
    position: absolute;
    content: "";
    width: 20%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: bold;
    background-color: lightblue;
    transition: all 0.5s;
}

.card::before {
    top: 0;
    right: 0;
    border-radius: 0 15px 0 100%;
}

.card::after {
    bottom: 0;
    left: 0;
    border-radius: 0 100% 0 15px;
}

.card:hover::before,
.card:hover:after {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    transition: all 0.5s;
}

.card:hover:after {
    content: "NOTHING";
}
</style>