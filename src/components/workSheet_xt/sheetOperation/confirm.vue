<template>
    <!-- 确认 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>确认操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label>确认意见</label>
                            <el-input v-model="operExplain" placeholder="请输入" size='mini' class="content-select" style="width: 400px;"></el-input>
                            <!-- <el-checkbox v-model="isRecover" style="margin-left: 15px;">确认设备状态为正常</el-checkbox> -->
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="sureWorkorders(1)">
                            <p>确认</p>
                        </div>
                        <!-- <div class="back" @click="sureWorkorders(0)">
                            <p>退回</p>
                        </div> -->
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="isShow = true" v-show="!isShow">
            <span>确认操作</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: ['data'],
        data() {
            return {
                token: "",
                isShow: false,
                workordersInfo: {},
                operExplain: "",
                isRecover: "",
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
        },
        methods: {
            // 确认接口
            sureWorkorders(isPass) {
                if (isPass == 0 && this.operExplain == '') {
                    Common.ejMessage("warning", "退回请填写意见");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workorderssystem/info/sure`, {
                        workSystemId: this.workordersInfo.workSystemId,
                        operExplain: this.operExplain,
                        // isPass: isPass,
                        // isRecover: this.isRecover ? "1" : "0"
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.close();
                            this.$emit('callback');
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            close() {
                this.isShow = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../../assets/less/operation.less";

    .operation-info .operation-main .operation-content {
        height: 91px;
        border-top: none;

        .complete-content .content-row-select {
            margin-bottom: 15px;
        }
    }
</style>