<template>
    <div>
        <div class="loading-info" v-if="isLoading === true">
            <p>로그인 처리중...</p>
        </div>
        <div class="form-container">
            <!-- 
            Submit Event => Login() 
            새로고침 막기
            -->
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                    type="email"
                    id="email"
                    placeholder="이메일 입력"
                    required
                    v-model="email"
                    >
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                    type="password"
                    id="password" 
                    placeholder="비밀번호 입력"
                    required
                    v-model="password"
                    >
                </div>
                <button type="submit">로그인</button>
                <router-link to="/signup">회원가입</router-link>
            </form>
        </div>
    </div>
</template>
<script setup>
    // 상태변수
    import {useRouter} from 'vue-router';
    import {ref} from 'vue';
    import supabase from '../supabase';

    const router = useRouter();
    const isLoading = ref(false);

    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
        isLoading.value = true; // 서버 요청 시작

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error){
            alert(error.message)
            isLoading.value = false;
        } else {
            alert('로그인 성공')
            console.log(data)
            isLoading.value = false;
            router.push('/job-list')
        }
    }

</script>
<style lang="scss">
    @use '../style/form.scss';

    .loading-info {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7);
        color: #fff;
        display: grid;
        place-items: center;
    }
</style>