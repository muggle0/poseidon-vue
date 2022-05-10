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
                    <canvas width="100" height="40" id="verifyCanvas" style="display: none"></canvas>
                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
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
                captchaImg: null
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
                this.$axios.get('/captcha.img').then(res => {
                    console.log("/captcha")
                    console.log(res)
                    var code = res.data.data.code
                    var canvas = this.drawPic(code);
                    this.captchaImg = canvas.toDataURL("image/png")
                    this.loginForm.code = ''
                })
            },
            // 绘制图片
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            randomColor(min, max) {
                var r = randomNum(min, max);
                var g = randomNum(min, max);
                var b = randomNum(min, max);
                return "rgb(" + r + "," + g + "," + b + ")";
            },
            drawPic(num) {
                var canvas = document.getElementById("verifyCanvas");
                var width = canvas.width;
                var height = canvas.height;
                var ctx = canvas.getContext('2d');
                ctx.textBaseline = 'bottom';
                /**绘制背景色**/
                ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
                ctx.fillRect(0, 0, width, height);
                /**绘制文字**/

                var txt = num;
                ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
                ctx.font = randomNum(25, 35) + 'px SimHei'; //随机生成字体大小
                var x = 22;
                var y = 35;
                var deg = randomNum(-10, 8);
                //修改坐标原点和旋转角度
                ctx.translate(x, y);
                ctx.rotate(deg * Math.PI / 180);
                ctx.fillText(txt, 0, 0);
                // //恢复坐标原点和旋转角度
                ctx.rotate(-deg * Math.PI / 180);
                ctx.translate(-x, -y);
                /* } */
                /* /**绘制干扰线**/
                for (var i = 0; i < 8; i++) {
                    ctx.strokeStyle = randomColor(40, 180);
                    ctx.beginPath();
                    ctx.moveTo(randomNum(0, width), randomNum(0, height));
                    ctx.lineTo(randomNum(0, width), randomNum(0, height));
                    ctx.stroke();
                }
                /**绘制干扰点**/
                for (var i = 0; i < 100; i++) {
                    ctx.fillStyle = randomColor(0, 255);
                    ctx.beginPath();
                    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
                    ctx.fill();
                }
                return canvas;
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

    .captchaImg {
        float: left;
        margin-left: 8px;
        border-radius: 4px;
    }

</style>