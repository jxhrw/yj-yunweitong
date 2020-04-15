<template>
    <!-- 延期审核 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>延期审核操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <!-- <label style="width: 80px;">批准完成时间</label>
                            <el-date-picker style="margin-left: 0px;width: 400px;" v-model="deadlineDate" type="datetime" size='mini' value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期">
                            </el-date-picker> -->
                            <label style="width: 80px;">延期天数</label>
                            <el-input placeholder="请输入" v-model="dayNum" class="dialog-input" style="width:400px;height:28px;" size='mini' clearable></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="width: 80px;float: left;margin-right: 17px;" class="content-label-fix">审核意见</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain " resize="none"></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="checkWorkorders(1)">
                            <p>提交</p>
                        </div>
                        <div class="back" @click="checkWorkorders(0)">
                            <p>退回</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="open" v-show="!isShow">
            <span>延期审核操作</span>
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
                deadlineDate: "",
                dayNum: "",
                maxNum: "",
                operExplain: "",
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data;
            var from1 = this.workordersInfo.workordersRecordMap.appointList || [];
            var from2 = this.workordersInfo.workordersRecordMap.fackbackList || [];
            var postponeList = [...from1, ...from2];
            if (postponeList.length > 0) {
                postponeList.map(res => {
                    // ORDEROPERTYPE05 延期申请;OPERRESULT05 未处理
                    if (res.operTypeCode == 'ORDEROPERTYPE05' && res.operResultCode == 'OPERRESULT05') {
                        this.deadlineDate = res.deadlineDate;
                        this.dayNum = res.score;
                        this.maxNum = parseFloat(res.score);
                    }
                });
            }
        },
        methods: {
            // 确认接口
            checkWorkorders(isPass) {
                if (isPass == 0 && this.operExplain == '') {
                    Common.ejMessage("warning", "退回请填写审核意见");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!(/^\d+(\.\d{1})?$/.test(this.dayNum))) {
                    Common.ejMessage("warning", "延期天数最多一位小数");
                    return;
                }
                if(!(parseFloat(this.dayNum) > 0)){
                    Common.ejMessage("warning", "延期天数需大于零");
                    return;
                }
                // if (!(parseFloat(this.dayNum) > 0 && parseFloat(this.dayNum) <= this.maxNum)) {
                //     Common.ejMessage("warning", "延期天数需小于等于申请天数且大于零");
                //     return;
                // }
                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersOther/checkPostWorkordersOther`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        // deadlineDate: this.deadlineDate,
                        dayNum: this.dayNum,
                        isPass: isPass,
                        operExplain: this.operExplain
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
            open() {
                this.isShow = true;
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
            .content-label-fix {
                position: relative;
            }

            .content-textarea-fix {
                width: 400px;
                margin-left: 0;
            }

            .content-row-select {
                margin-top: 10px;
                margin-bottom: 15px;
            }
        }
    }
</style>