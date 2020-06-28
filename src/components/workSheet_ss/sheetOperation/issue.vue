<template>
    <!-- 下发 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>下发操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content" style="height:200px;">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="width: 72px;"><span style="left: 17px;">*</span>维护单位</label>
                            <mInput :list="opDeptList" :code.sync="opDeptCode" :name.sync="opDeptName" showAttr="opsDeptName" getAttr="opsDeptId"></mInput>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="width: 72px;"><span>*</span>期限完成时间</label>
                            <el-date-picker style="margin-left: 0px;width: 400px;" v-model="deadlineDate" type="datetime" size='mini' value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="width: 72px;float: left;margin-right: 17px;">下发意见</label>
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain" resize="none"></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="checkWorkorders(1)">
                            <p>下发</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="isShow=true" v-show="!isShow">
            <span>下发</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import mInput from "@/components/common/selectDrop";
    export default {
        props: ['data'],
        components: {
            mInput
        },
        data() {
            return {
                token: "",
                isShow: false,
                workordersInfo: {},
                deadlineDate: "",
                opDeptCode: '',
                opDeptName: '',
                opDeptList: [],
                isAjaxing: false,
                operExplain: ''
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
            // this.getDeadlineTime();
            //维护单位
            this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { "deptOppmType": "OPSDEPTOPPM02" }).then(res => {
                this.opDeptList = res.resultList || [];
            });
        },
        watch: {
            opDeptCode(val) {
                if (val) {
                    this.$api.get(`${this.$config.efoms_HOST}/signsWorkordersRecord/getWorkordersDeadlineDate`, {
                            signsWorkordersId: this.workordersInfo.signsWorkordersId,
                            opDeptId: val
                        }, { token: this.token })
                        .then(res => {
                            if (res.appCode == 0) {
                                this.deadlineDate = res.resultList || new Date();
                            }
                        });
                } else {
                    this.deadlineDate = '';
                }
            }
        },
        methods: {
            // 确认接口
            checkWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.deadlineDate == null || this.deadlineDate == '') {
                    Common.ejMessage("warning", "期限完成时间必填");
                    return;
                }
                if (this.opDeptCode == '') {
                    Common.ejMessage("warning", "维护单位必填");
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/dispatchWorkorders`, {
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
                        deadlineDate: this.deadlineDate,
                        opDeptId: this.opDeptCode,
                        opDeptName: this.opDeptName,
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
            // 获取默认完成时间
            getDeadlineTime() {
                // let time = new Date(this.workordersInfo.repDate).getTime() + 24 * 60 * 60 * 1000;
                let time = new Date().getTime() + 24 * 60 * 60 * 1000;
                this.$api.get(`${this.$config.efoms_HOST}/workorderDeadline/selectDeadlineConfList`, {
                        devTypeCode: this.workordersInfo.devTypeCode.indexOf('REPDEVTYPE24') > -1 ? '1' : '2', // REPDEVTYPE24电子类，设施的devTypeCode区分两种，1电子类，2非电子类
                        typeCode: this.workordersInfo.typeCode,
                        isUse: 1,
                        workType: 2, // 工单类型：1、设备；2、设施；3、系统、4其他
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let num = 24;
                            if (res.resultList && res.resultList.length > 0) {
                                num = res.resultList[0].deadlineTime || 24;
                            }
                            // time = new Date(this.workordersInfo.repDate).getTime() + num * 60 * 60 * 1000;
                            time = new Date().getTime() + num * 60 * 60 * 1000;
                        } else {
                            Common.printErrorLog(res);
                        }
                        this.deadlineDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(time));
                    })
                    .catch(err => {
                        this.deadlineDate = Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(time));
                        Common.printErrorLog(err);
                    });
            },
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            close() {
                this.isShow = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    @import '../../../assets/less/operation.less';

    .operation-info .operation-main .operation-content {
        border-top: none;
        height: 181px;

        .complete-content {
            .content-textarea-fix {
                width: 400px;
                margin-left: 0;
            }

            .content-row-select {
                margin-top: 10px;
                margin-bottom: 15px;

                /deep/ .d-select {
                    width: 400px;
                }
            }
        }
    }
</style>