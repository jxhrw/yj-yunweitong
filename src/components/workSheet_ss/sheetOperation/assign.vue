<template>
    <!-- 指派 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>指派操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content" style="height:200px;">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="10">
                            <label>维护单位</label>
                            <span>{{opDeptName}}</span>
                        </el-col>
                        <el-col :span="10">
                            <label style="width: 72px;">期限完成时间</label>
                            <span>{{deadlineDate}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="10">
                            <label><span style="left: 5px;">*</span>维护组</label>
                            <mInput :list="groupList" :code.sync="groupCode" :name.sync="groupName" showAttr="opsDeptName" getAttr="opsDeptId"></mInput>
                        </el-col>
                        <el-col :span="10">
                            <label style="width: 72px;"><span style="left: 17px;">*</span>维护人员</label>
                            <mSelectMult :list="personList" :code.sync="personCode" :name.sync="personName" showAttr="opsPersonName" getAttr="opsPersonId" :showAll="true"></mSelectMult>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="float: left;margin-right: 17px;">指派意见</label>
                            <el-input style="width: 300px;" type="textarea" :rows="2" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain" resize="none"></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="checkWorkorders(1)">
                            <p>指派</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="showAssign" v-show="!isShow">
            <span>指派</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import mInput from "@/components/common/selectDrop";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        props: ['data'],
        components: {
            mInput,
            mSelectMult
        },
        data() {
            return {
                token: "",
                isShow: false,
                workordersInfo: {},
                deadlineDate: "",
                opDeptName: '',
                groupCode: '',
                groupName: '',
                groupList: [],
                personCode: [],
                personName: [],
                personList: [],
                isAjaxing: false,
                personNameAll: '',
                operExplain: ''
            };
        },
        watch: {
            groupCode(val) {
                this.personCode = [];
                this.personName = [];

                //维护人员
                if (val == '' || val == null) {
                    this.personList = [];
                } else {
                    this.getDicInfo(`${this.$config.ubms_HOST}/OpsPerson/getOpsPersonInfo.htm`, { opsDeptId: val }).then(res => {
                        this.personList = res.resultList || [];
                        // 默认全选
                        let arr1 = [],
                            arr2 = [];
                        this.personList.map(data => {
                            arr1.push(data.opsPersonId);
                            arr2.push(data.opsPersonName);
                        });
                        this.$nextTick(() => {
                            this.personCode = arr1;
                            this.personName = arr2;
                        });
                    });
                }
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
            let arr = this.workordersInfo.workordersRecordMap ? (this.workordersInfo.workordersRecordMap.dispatchList || []) : []; //派发记录
            arr = arr.filter(res => {
                return res.operResultCode == 'OPERRESULT07'
            });

            this.deadlineDate = arr.length > 0 ? arr[arr.length - 1].deadlineDate : '';
            this.opDeptName = arr.length > 0 ? arr[arr.length - 1].opDeptName : (this.workordersInfo.oppmDeptName || '');
            // 维护组--运维单位的子部门
            let opDeptId = arr.length > 0 ? arr[arr.length - 1].opDeptId : (this.workordersInfo.oppmDeptId || '');

            this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptInfo.htm`, { parentId: opDeptId }).then(res => {
                let arr1 = [{ opsDeptId: opDeptId, opsDeptName: this.opDeptName }];
                let arr2 = res.resultList || [];

                this.groupList = [...arr1, ...arr2];
                this.groupCode = opDeptId;
            });
        },
        methods: {
            // 确认接口
            checkWorkorders(isPass) {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.groupCode == '') {
                    Common.ejMessage("warning", "维护组必填");
                    return;
                }
                if (this.personCode.length == 0) {
                    Common.ejMessage("warning", "维护人员必填");
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/appointWorkorders`, {
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
                        opDeptId: this.groupCode,
                        opDeptName: this.groupName,
                        opPersonId: this.personCode.join(","),
                        opPersonName: this.personName.join(","),
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
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            close() {
                this.isShow = false;
            },
            async showAssign() {
                if (!(await this.$parent.stopOpertion())) return;
                this.isShow = true;
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
            }

            .content-row-select {
                margin-top: 10px;
                margin-bottom: 15px;

                /deep/ .d-select {
                    width: 300px;
                }
            }
        }
    }
</style>