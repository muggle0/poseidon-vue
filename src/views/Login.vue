<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :xl="6" :lg="7">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                <el-form-item label="用户名" prop="username" style="width: 380px;">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 380px;">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" style="width: 380px;">
                    <el-input v-model="loginForm.code" style="width: 172px; float: left" maxlength="5"></el-input>
                    <div class="code" @click="getCaptcha">
                        <s-identify :identifyCode="identifyCode"></s-identify>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">立即创建</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>

</template>

<script>

    import qs from 'qs'

    export default {
        name: "Login",
        data() {
            return {
                identifyCode: "",
                loginForm: {
                    username: 'admin',
                    password: '111111',
                    code: '11111',
                    token: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sign_in?' + qs.stringify(this.loginForm)).then(res => {
                            console.log(res)
                            const jwt = res.headers['token']
                            this.$store.commit('SET_TOKEN', jwt)
                            this.$router.push("/index")
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCaptcha() {
                this.$axios.get('/user/captcha.json').then(res => {
                    console.log("/captcha")
                    console.log(res)
                    this.identifyCode= res.data.data.code
                })
            }
        },
        created() {
            this.getCaptcha()
        }
    }
</script>

<style scoped>

    .el-row {
        background-color: #fafafa;
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
    }

    .el-divider {
        height: 200px;
    }


</style>