<!--
    페이지 주요 기능 
    1. 라우트(페이지 경로)에 따라 NavBar Title을 다르게 설정
    2. 라우트(페이지 경로)에 따라 아이콘 Show, Hide

    주요 공부
    1. v-if로 여러 가지 조건문 가능
-->
<template>    
    <div>
        <nav>
            <h1>{{ title }}</h1>
            <router-link 
            v-if="
            currentPath === '/' || 
            currentPath === '/signup' ||
            currentPath.startsWith('/job-post-update') ||
            currentPath === '/job-post'"
            to="/job-list"
            class="btn-close">
                <Icon 
                icon="material-symbols:close"
                width="24"
                height="20"
                style="color: #1e1e1e;"
                />
            </router-link>

            <div class="left-icons" v-if="currentPath.startsWith('/job-detail') || currentPath === '/user-profile'">
                <router-link to="/job-list">
                    <Icon 
                    icon="ic:baseline-arrow-back"
                    width="24"
                    height="24"
                    style="color: #1e1e1e;"
                    />
                </router-link>
            </div>

            <div class="right-icons" v-if="currentPath === '/job-list'">
                <router-link to="/user-profile">
                    <Icon 
                    icon="teenyicons:user-circle-solid"
                    width="24"
                    height="20"
                    style="color: #1e1e1e;"
                    />
                </router-link>
                <router-link to="/job-post">
                    <Icon 
                    icon="mdi:pencil-outline"
                    width="24"
                    height="20"
                    style="color: #1e1e1e;"
                    />
                </router-link>
            </div>
        </nav>
    </div>
</template>
<script setup>
    import { Icon } from '@iconify/vue';
    import { useRoute } from 'vue-router';
    import { watch, ref } from 'vue';

    let route = useRoute();
    let currentPath = route.path;    
    let title = ref('');


    // Watch == 특정 변수의 변경을 감지하는 훅
    // newPath == 변경되는 경로 명
    watch(route, (newPath) => {
        currentPath = newPath.path;

        // 경로별로 제목을 다르게 설정
        if(currentPath === '/') {
            title.value = '로그인'; 
        } else if (currentPath === '/signup') {
            title.value = '회원가입';
        } else if (currentPath === '/job-list') {
            title.value = '땅콩알바';
        } else if (currentPath.startsWith('/job-detail')) {
            title.value = '상세보기';
        } else if (currentPath === '/job-post') {
            title.value = '구인등록'
        } else if (currentPath === '/user-profile') {
            title.value = '프로필'
        } else if (currentPath.startsWith('/job-post-update')) {
            title.value = '구인등록 수정'
        }
    });

</script>
<style lang="scss">
    nav {
    position: relative;
    border-bottom: 1px solid #ccc;
    width: 100%;
    height: 44px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
        h1 {
            font-size: 16px;
            color: var(--text-color-dark);
        }
        .btn-close {
            position: absolute;
            left: 15px;
            text-decoration: none;
        }
    } 

    .left-icons {
        position: absolute;
        left: 15px;
        top: 10px;
        display: flex;
        gap: 10px;
    }

    .right-icons {
        position: absolute;
        right: 15px;
        top: 10px;
        display: flex;
        gap: 10px;
    }
</style>