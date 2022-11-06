<template>
    <div>
        xxxx
    </div>
</template>

<script>
    export default {
        name: "Test",
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,

                total: 0,
                size: 10,
                current: 1,

                dialogVisible: false,
                editForm: {

                },

                tableData: [],

                editFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },

                multipleSelection: [],

                roleDialogFormVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleForm: {},
                roleTreeData:  [],
                treeCheckedKeys: [],
                checkStrictly: true

            }
        },
        created() {
            this.getUserList()

            this.$axios.get("/system/role/list").then(res => {
                this.roleTreeData = res.data.data.records
            })
        },
        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                console.log("勾选")
                console.log(val)
                this.multipleSelection = val;

                this.delBtlStatu = val.length == 0
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getUserList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getUserList()
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },

            getUserList() {
                this.$axios.get("/sys/user/list", {
                    params: {
                        username: this.searchForm.username,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {
                    this.tableData = res.data.data.records
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
                            .then(res => {

                                this.$message({
                                    showClose: true,
                                    message: '恭喜你，操作成功',
                                    type: 'success',
                                    onClose:() => {
                                        this.getUserList()
                                    }
                                });

                                this.dialogVisible = false
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/user/info/' + id).then(res => {
                    this.editForm = res.data.data

                    this.dialogVisible = true
                })
            },
            delHandle(id) {

                var ids = []

                if (id) {
                    ids.push(id)
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }

                console.log(ids)

                this.$axios.post("/sys/user/delete", ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.getUserList()
                        }
                    });
                })
            },

            roleHandle (id) {
                this.roleDialogFormVisible = true

                this.$axios.get('/sys/user/info/' + id).then(res => {
                    this.roleForm = res.data.data

                    let roleIds = []
                    res.data.data.sysRoles.forEach(row => {
                        roleIds.push(row.id)
                    })

                    this.$refs.roleTree.setCheckedKeys(roleIds)
                })
            },
            submitRoleHandle(formName) {
                var roleIds = this.$refs.roleTree.getCheckedKeys()

                console.log(roleIds)

                this.$axios.post('/sys/user/role/' + this.roleForm.id, roleIds).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.getUserList()
                        }
                    });

                    this.roleDialogFormVisible = false
                })
            },
            repassHandle(id, username) {

                this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/sys/user/repass", id).then(res => {
                        this.$message({
                            showClose: true,
                            message: '恭喜你，操作成功',
                            type: 'success',
                            onClose: () => {
                            }
                        });
                    })
                })
            }
        }
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>