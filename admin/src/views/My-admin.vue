<template>
    <div class="container">
        <el-button class="addAdmin" type="primary" @click="addAdmin">添加管理员</el-button>
        <el-table :data="adminList" border style="width: 100%">
            <el-table-column prop="openid" label="openid"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="time" label="创建时间"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a @click="UpdateAdmin(scope)">修改</a> |
                    <el-popconfirm title="确定删除吗？" @confirm="deleteAdmin(scope)">
                        <a slot="reference">删除</a>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            adminList: [],
        }
    },
    created() {
        this.getAdminList();
    },
    methods: {
        async getAdminList() {
            const { data } = await this.$http.get("http://localhost:3000/getAdminList");
            this.adminList = data;
        },
        addAdmin() {
            this.$router.push({
                name: "EditAdmin",
                params: {
                    state: "add"
                }
            })
        },
        async deleteAdmin({ row: { _id } }) {
            const { data } = await this.$http.get("http://localhost:3000/deleteAdmin", {
                params: {
                    _id
                }
            });
            if (data === "success") {
                this.$message.success("删除成功！");
                this.getAdminList();
            } else {
                this.$message.error("删除失败！")
            }
        },
        UpdateAdmin({ row }) {
            this.$router.push({
                name: "EditAdmin",
                params: {
                    state: "update",
                    info: JSON.stringify(row)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    background-color: #fff;
    padding: 20px;

    .addAdmin {
        float: right;
    }
}
</style>