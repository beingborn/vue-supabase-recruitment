<template>
    <div>
        <ul class="job-list" v-if="posts.length > 0">
            <li class="job-item" v-for="post in posts" :key="post.id">
                <router-link :to="`/job-detail/${post.id}`">
                    <div class="header">
                        <h3>{{ post.title }}</h3>
                        <address>{{ post.location }}</address>
                        <span>&middot;</span>
                        <time>{{ format(new Date(post.created_at), 'yyyy-MM-dd')  }}</time>
                    </div>
                    <div class="bottom-info">
                        <p class="pay">{{ post.pay_rule }} : {{post.pay}}원</p>
                        <img v-if="post.img_url" :src="post.img_url" alt="image" width="64" height="64"/>
                    </div>
                </router-link>
            </li>
        </ul>
        <p class="loading_info" v-else>구인 목록을 불러오는 중입니다...</p>
    </div>
</template>
<script setup>
    import supabase from '../supabase';
    import { ref, onMounted } from 'vue';
    import { compareAsc, format } from 'date-fns';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const posts = ref([]);

    // 구인 목록 가져오기
    onMounted( async() => {
        const { data , error } = await supabase
        .from('job_posts')
        .select('*')
        .order('created_at', {ascending: false})
        // ascending : true = 내림차순 
        
        if (error) {
            alert(error.message)
        } else {
            // 둘다 배열이기 때문에 value = data값으로 추가 가능
            posts.value = data;
        }
    })
</script>
<style lang="scss" scoped>
    ul {
        list-style: none;
        padding: 0;
        li {
            padding: 15px;
            border-bottom: 1px solid rgba(0,0,0, 0.2);
        }
    }

    address, time, span {
        font-style: normal;
        display: inline;
        font-size: 12px;
        color: #666;
    }

    .pay {
        font-size: 14px;
        font-weight: bold;
    }

    .bottom-info {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-top: 15px;
    }
</style>