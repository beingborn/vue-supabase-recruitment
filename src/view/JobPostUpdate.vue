<template>
    <div>
        <div class="loading_info" v-if="isLoading">
            <p>저장중...</p>
        </div>
        <div class="form-container" v-if="isLogin">
            <form @submit.prevent="handleSubmit">
                <!-- 제목 -->
                <div class="form-group">
                    <label for="title">제목</label>
                    <input 
                    type="text"
                    id="title"
                    required
                    placeholder="공고 내용을 요약해 주세요."
                    v-model="title"
                    >
                </div>
                <!-- 하는 일 -->
                <div class="form-group">
                    <label for="todo">하는 일</label>
                    <input 
                    type="text"
                    id="todo"
                    required
                    placeholder="해야할 업무를 입력해주세요."
                    v-model="todo"
                    >
                </div>
                <!-- 3. 급여 조건 -->
                <div class="form-group">
                    <input type="radio" name="pay_rule" id="pay_rule1" value="시급" v-model="pay_rule" required checked>
                    <input type="radio" name="pay_rule" id="pay_rule2" value="월급" v-model="pay_rule" required>
                    <div class="tab-group">
                        <label for="pay_rule1">시급</label>
                        <label for="pay_rule2">월급</label>
                    </div>
                    <!-- 4. 금액 입력 -->
                    <input 
                    type="number" 
                    id="pay" 
                    placeholder="시급 또는 월급을 입력해주세요."
                    v-model="pay" 
                    required
                    >
                </div>
                <!-- 5. 자세한 설명 -->
                <div class="form-group">
                    <label for="desc">자세한 설명</label>
                    <textarea 
                    name="desc" 
                    id="desc" 
                    v-model="desc"
                    rows="4"
                    required
                    placeholder="구체적인 업무 내용, 근무여건, 지원자가 갖추어야 할 능력 등을 기입해주세요."
                    ></textarea>
                </div>
                <!-- 6. 업체명 -->
                <div class="form-group">
                    <label for="company_name">업체명</label>
                    <input
                    type="text"
                    id="company_name"
                    v-model="company_name"
                    required
                    placeholder="예) 땅콩가게"
                    >
                </div>
                <!-- 7. 위치 (주소) -->
                <div class="form-group">
                    <label for="location">위치</label>
                    <input
                    type="text"
                    id="location"
                    v-model="location"
                    required
                    placeholder="예) 서울시 강남구 논현동"
                    >
                </div>
                <!-- 8. 연락처 -->
                <div class="form-group">
                    <label for="tel">연락처</label>
                    <input
                    type="text"
                    id="tel"
                    v-model="tel"
                    required
                    placeholder="예) 01084230876"
                    >
                </div>
                <!-- 9. 사진(선택입력) -->
                <div class="form-group">
                    <label for="photo">
                        <p class="title">사진(선택)</p>
                        <figure>
                            <Icon icon="mdi-light:camera" width="64" height="64" style="color: #1e1e1e;" ></Icon>
                            <img :src="
                            previewImage == null ? '/box64.jpg' : previewImage" 
                            alt="미리보기" 
                            width="64"
                            height="64"
                            fill=""
                            />
                        </figure>
                    </label>
                    <!-- 
                        accept = image만 only
                    -->
                    <input 
                    @change="onFileChange"
                    type="file"
                    id="photo"
                    accept="image/*">
                </div>
                <button class="btn-submit">수정완료</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import supabase from '../supabase';
    import { useAuth } from '../auth/auth.js'

    import {onUnmounted, ref} from 'vue';
    import { Icon } from '@iconify/vue'
    import { onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    // Data List
    const isLoading = ref(false)
    const title = ref('')
    const todo = ref('')
    const pay_rule = ref('')
    const pay = ref('')
    const desc = ref('')
    const company_name = ref('')
    const location = ref('')
    const tel = ref('')
    const img_url = ref(null)
    const prev_img_url = ref('') // 이전 이미지 url

    let file = null; // 파일 객체 저장 변수

    /** 
     * Router :: 페이지 이동
     * Route :: 현재 연결된 경로나 파라미터 등을 읽기 위해 사용
     *  */ 
    const router = useRouter();
    const route = useRoute();

    // Post Data
    const id = route.params.id;

    const previewImage = ref(null);

    // Auth Module Inject
    const {isLogin, user, checkLoginStatus} = useAuth();

    const handleSubmit = async() => {
        isLoading.value = true;

        if(previewImage.value.length){
            console.log(prev_img_url.value)

            // 기존 이미지 파일과 다른 경우 
            if (!prev_img_url.value.includes(file.name)){
                await uploadImage();

                // 기존 이미지 삭제
                const {data, error} = await supabase
                .storage
                .from('images')
                .remove([prev_img_url.value.split('/').pop()])

                if (error) {
                    alert(error.message)
                } else {
                    alert('성공')
                }

            } else {
                // 파일 미첨부 시 기존 이미지 사용
                img_url.value = prev_img_url.value;
                console.log('기존 이미지 사용')
            }
        }

        const { error } = await supabase
        .from('job_posts')
        .update({
            title : title.value,
            todo : todo.value,
            pay_rule : pay_rule.value,
            pay : pay.value,
            desc : desc.value,
            company_name : company_name.value,
            location : location.value,
            tel : tel.value,
            img_url: img_url.value,
        })
        .eq('id', id)

        if (error) {
            alert(error.message);
        } else {
            isLoading.value = false;
            alert('수정이 완료되었습니다.');
            router.push('/job-list');
        }

        isLoading.value = false;
    }

    const getPost = async() => {
        const { data, error } = await supabase
            .from('job_posts')
            .select()
            .eq('id', id)
            .single()

        if (error) {
            console.log("데이터없음");
        } else {
            console.log(data)

            // single == 데이터를 배열이 아닌 하나의 객체로 받음
            title.value = data.title
            todo.value = data.todo
            pay_rule.value = data.pay_rule
            pay.value = data.pay
            desc.value = data.desc
            company_name.value = data.company_name
            location.value = data.location
            tel.value = data.tel
            previewImage.value = data.img_url
            prev_img_url.value = data.img_url
        }
    }

    const uploadImage = async() => {
        // Upload Variable, File, Option
        const { data, error } = await supabase
        .storage
        .from('images')
        .upload(file.name, file, {
            cacheControl: '3600',
            upsert: false
        })

        if(error){
            alert('업로드 오류');
        } else {
            console.log('uploaded file:', data)
            // 이미지 URL 가져오기
            const {data : imgData} = supabase
            .storage
            .from('images')
            .getPublicUrl(file.name)

            console.log(imgData.publicUrl)
            // 테이블에 저장할 변수
            img_url.value = imgData.publicUrl;
        }
    }

    onMounted( async() => {
        // 마운트 시 useAuth 내부의 checkLogin 실행
        await checkLoginStatus();
        getPost();


    })

    // 페이지 종료 시
    onUnmounted(()=> {
        console.log('unonmounted')
        // 메모리 누수 방지
        if (previewImage.value) {
            URL.revokeObjectURL(previewImage.value);
        }
    })

    const onFileChange = (event) => {
        file = event.target.files[0];

        if (file) {
            previewImage.value = URL.createObjectURL(file);
        }
    }
</script>

<style lang="scss" scoped>
    @use "../style/form.scss";

    .form-container {
        margin-top: 20px;
        padding-bottom: 50px;

        .tab-group {
            display: flex;
            gap: 15px;

            label { 
                flex: 1;
                border: 1px solid var(--main-color-dark);
                border-radius: 8px;
                text-align: center;
                padding: 12px;
            }
        }

        input[type="radio"] {
            display: none;
        }

        input[type="radio"]:nth-child(1):checked ~ .tab-group label:nth-child(1) {
            background: var(--main-color-dark);
            color: #fff;
        }

        input[type="radio"]:nth-child(2):checked ~ .tab-group label:nth-child(2) {
            background: var(--main-color-dark);
            color: #fff;
        }

        #pay { margin-top: 8px;}

        // for=photo를 가진 form-group의 후손 input의 보더 스타일 제거
        .form-group:has(label[for=photo]) input {
            border: none;
        }

        //file 아이콘
        label[for=photo] {

            figure { 
                display: flex; 
                align-items: center;

                img { 
                    border: 1px solid red;
                    margin-left: 30px; 
                }
            }
        }

        input[type="file"] {
            display: none;
        }
    }

    .btn-submit {
        background: var(--main-color-light);
    }

    .form-group:has(label[for=photo]) {
        padding-bottom: 25px;
        border-bottom: 5px solid #ccc;
    }
</style>
