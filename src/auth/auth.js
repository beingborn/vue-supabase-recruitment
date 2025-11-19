// 인증 외부 모듈 분리
import { useRouter } from 'vue-router'
import supabase from '../supabase';
import { ref } from 'vue';

export function useAuth(){
    const router = useRouter();
    const user = ref(null);
    const isLogin = ref(false);

    const checkLoginStatus = async() => {

        // user : _user , 가져오는 값 다르게 설정해주기
        const { data: {user:_user} } = await supabase.auth.getUser()

        user.value = _user;
        
        if(_user) {
            isLogin.value = true
        } else {
            console.log('로그아웃 상태')
            isLogin.value = false
            alert('로그인 후 이용해주세요.')
            router.push('/')
        }
    }

    // 값 반환
    return {
        user,
        isLogin,
        checkLoginStatus
    }
}