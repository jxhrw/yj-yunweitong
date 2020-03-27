<template>
    <!-- 科室/处室审核 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>审核操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="float: left;margin-right: 17px;">审核意见</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain "></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="auditMRepairs('1')">
                            <p>同意</p>
                        </div>
                        <div class="cancel" @click="auditMRepairs('0')">
                            <p>拒绝</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="isShow = true" v-show="!isShow">
            <span>审核</span>
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
                operExplain: '',
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
        },
        methods: {
            // 审核接口
            auditMRepairs(isPass) {
                if (isPass == 0 && this.operExplain == '') {
                    Common.ejMessage("warning", "拒绝请填写审核意见");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/repairs/auditRepairsInfo`, {
                        repairsId: this.workordersInfo.repairsId,
                        isPass: isPass,
                        operExplain: this.operExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
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
        border-top: none;
        height: 181px;

        .complete-content {
            .content-textarea-fix {
                width: 400px;
                margin-left: 0;

                /deep/ .el-textarea__inner {
                    resize: none;
                }
            }

            .content-row-select {
                margin-top: 10px;
                margin-bottom: 15px;

                ul {
                    width: 100px;
                    height: 16px;
                    display: inline-block;

                    &:hover {
                        li {
                            background-image: url("../../../assets/images/icon-star-ful.png");
                        }
                    }

                    li {
                        float: left;
                        width: 20px;
                        height: 20px;
                        list-style: none;
                        background-image: url("../../../assets/images/icon-star.png");
                        cursor: pointer;

                        &.active {
                            float: left;
                            width: 20px;
                            height: 20px;
                            list-style: none;
                            background-image: url("../../../assets/images/icon-star-ful.png");
                        }
                    }
                }
            }
        }
    }
</style>