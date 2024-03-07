<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="openid">
                <el-input v-model="form.openid"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickName"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-radio-group v-model="form.role">
                    <el-radio label="管理员"></el-radio>
                    <el-radio label="超级管理员"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSumbit">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getTimeNow } from "../utils";
export default {
    data() {
        return {
            form: {},
        };
    },
    computed: {
        state() {
            return this.$route.params.state;
        },
    },
    created() {
        if (this.state === 'update') {
            this.form = JSON.parse(this.$route.params.info);
        }
    },
    methods: {
        async onSumbit() {
            if (this.state === "add") {
                const { data } = await this.$http.post("http://localhost:3000/addAdmin", {
                    ...this.form,
                    time: getTimeNow()
                });
                if (data === "success") {
                    this.$message.success("添加成功！");
                    this.cancel();
                } else {
                    this.$message.error("添加失败！")
                }
            } else {
                const { data } = await this.$http.post("http://localhost:3000/updateAdmin", this.form);
                if (data === "success") {
                    this.$message.success("修改成功！");
                    this.cancel();
                } else {
                    this.$message.error("修改失败！")
                }
            }
        },
        cancel() {
            this.$router.push({
                name: "Admin",
            })
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    background-color: #fff;
    padding: 30px 20px;

    .el-form {
        width: 50%;
        margin-top: 20px;

        .el-radio-group {
            margin-right: 30px;
        }
    }
}
</style>