<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <div class="title-box">
                    <h2>{{title}}</h2>
                    <ul class="pos-step" v-if="workordersInfo.workordersRecordMap">
                        <li :class="{'active': activeIndex==''||activeIndex=='cb'}" @click="scrollIntoView('cb')" v-if="workordersInfo.workordersRecordMap.pressList&&workordersInfo.workordersRecordMap.pressList.length>0">催办</li>
                        <li :class="{'active': activeIndex=='sq'}" @click="scrollIntoView('sq')" v-if="workordersInfo.workordersRecordMap.submitList&&workordersInfo.workordersRecordMap.submitList.length>0">申请</li>
                        <li :class="{'active': activeIndex=='fk'}" @click="scrollIntoView('fk')" v-if="workordersInfo.workordersRecordMap.fackbackList&&workordersInfo.workordersRecordMap.fackbackList.length>0">反馈</li>
                        <li :class="{'active': activeIndex=='qr'}" @click="scrollIntoView('qr')" v-if="workordersInfo.workordersRecordMap.sureList&&workordersInfo.workordersRecordMap.sureList.length>0">确认</li>
                    </ul>
                </div>


                <div>
                    <!-- 已撤销ORDERSSTATUS08，已完结ORDERSSTATUS07不能催办 -->
                    <div v-if="(prePage=='工单下发'||prePage=='工单指派'||prePage=='维修处置'||prePage=='工单确认'||prePage=='维修申报'||prePage=='优化申报'||prePage=='科室审核'||prePage=='处室审核')&&(workStatusCode!='ORDERSSTATUS08'&&workStatusCode!='ORDERSSTATUS07')" class="ej-content-title-btn ej-content-green" @click="showUrge">
                        <p>催办</p>
                    </div>
                    <div class="ej-content-title-btn ej-content-black" @click="goBack">
                        <p>返回</p>
                    </div>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar" ref="swrapper">
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-detail">
                                <el-col :span="9">
                                    <label>申报编号</label>
                                    <span>{{workordersInfo.workSystemId}}</span>
                                    <span class="date-state" style="flex:none" v-if="workordersInfo.isOverdue">{{workordersInfo.isOverdue|filterOverdue}}</span>
                                </el-col>
                                <el-col :span="9" class="detail-warning">
                                    <template v-if="prePage=='转单审核'">
                                        <label>原工单ID</label>
                                        <span>
                                            <router-link :to="{path:'/detsheet',query:{id: workordersInfo.transferId}}">{{workordersInfo.transferId}}</router-link>
                                        </span>
                                    </template>
                                    <template v-else><span>&nbsp;</span></template>
                                </el-col>
                                <el-col :span="9">
                                    <label>申报单位</label>
                                    <span>{{workordersInfo.repDeptName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>申报人</label>
                                    <span>{{workordersInfo.repPersonName}} {{workordersInfo.repPersonTel}}</span>
                                </el-col>
                                <el-col :span="9" class="detail-warning">
                                    <label>当前状态</label>
                                    <span>{{workordersInfo.workStatusName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属系统</label>
                                    <span>{{workordersInfo.systemName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>紧急程度</label>
                                    <span>{{workordersInfo.levelName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属平台</label>
                                    <span>{{workordersInfo.platformName}}</span>
                                </el-col>
                            </el-row>
                            <transition name="fade">
                                <div v-show="isShow">
                                    <el-row class="content-row-detail">
                                        <el-col :span="9">
                                            <label>申报时间</label>
                                            <span>{{workordersInfo.repDate}}</span>
                                        </el-col>
                                        <!-- <el-col :span="9">
                                            <label>期限完成时间</label>
                                            <span>{{workordersInfo.deadlineTime}}</span>
                                        </el-col> -->
                                        <el-col :span="9">
                                            <label>情况描述</label>
                                            <span>{{workordersInfo.failureDescrible}}</span>
                                        </el-col>
                                        <el-col :span="24" class="content-row-img">
                                            <label>上传照片</label>
                                            <template v-for="(item,index) in imgFileList">
                                                <el-image class="img-preview" :key="index" :src="item" :preview-src-list="imgFileList.slice(index).concat(imgFileList.slice(0,index))" fit="fill">
                                                </el-image>
                                            </template>
                                        </el-col>
                                    </el-row>
                                </div>
                            </transition>
                            <div @click="isShow=!isShow" class="content-shrink">
                                <span><i class="shrink-arrow-up" :style="{'transform':'rotate('+(isShow?0:180)+'deg)'}"></i>{{isShow?'收起':'展开'}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="step-scroll">
                        <div class="step-right">
                            <div class="depiction-info" v-if="workordersInfo.workordersRecordMap">
                                <!-- 催办-->
                                <ul id="cb" class="sp-info press-info" v-if="workordersInfo.workordersRecordMap.pressList&&workordersInfo.workordersRecordMap.pressList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.pressList" :key="index">
                                        <div class="title">
                                            <label for="" class="title-name">{{item.operTypeName}}</label>
                                            <span class="title-date">{{item.operDate}}</span>
                                            <span class="title-person">{{item.operPerson}}</span>
                                        </div>
                                        <!-- 催办 -->
                                        <template v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                                            <div class="content">
                                                <label for="">催办原因</label>
                                                <span class="width5">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 维修申请ORDEROPERTYPE01，优化申请 ORDEROPERTYPE09-->
                                <ul id="sq" class="sp-info apply-info" v-if="workordersInfo.workordersRecordMap.submitList&&workordersInfo.workordersRecordMap.submitList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.submitList" :key="index">
                                        <div class="title">
                                            <label for="" class="title-name">{{item.operTypeName}}</label>
                                            <span class="title-date">{{item.operDate}}</span>
                                            <span class="title-person">{{item.operPerson}}</span>
                                        </div>
                                        <!-- 催办 -->
                                        <template v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                                            <div class="content">
                                                <label for="">催办原因</label>
                                                <span class="width5">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <template v-if="workordersInfo.optimeScheme">
                                                    <label for="">优化方案</label>
                                                    <span class="width5">{{workordersInfo.optimeScheme}}</span>
                                                </template>
                                                <template v-else>
                                                    <label for="">情况描述</label>
                                                    <span class="width5">{{workordersInfo.failureDescrible}}</span>
                                                </template>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 反馈 -->
                                <ul id="fk" class="sp-info feedback-info" v-if="workordersInfo.workordersRecordMap.fackbackList&&workordersInfo.workordersRecordMap.fackbackList.length>0">
                                    <template v-for="(item,index) in workordersInfo.workordersRecordMap.fackbackList">
                                        <li class="feedback-progress" :key="index">
                                            <div class="title">
                                                <label for="" class="title-name">{{item.operTypeName}}</label>
                                                <span class="title-date">{{item.operDate}}</span>
                                                <span class="title-person">{{item.operPerson}}</span>
                                            </div>

                                            <!-- 催办 -->
                                            <template v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                                                <div class="content">
                                                    <label for="">催办原因</label>
                                                    <span class="width5">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 转单申请 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE23'">
                                                <div class="content">
                                                    <label for="">记录编号</label>
                                                    <span class="width5">{{item.workordersRecordId}}</span>
                                                </div>
                                            </template>

                                            <!-- 转单审核，受理ORDEROPERTYPE06，拒绝 ORDEROPERTYPE25 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE24'||item.operTypeCode=='ORDEROPERTYPE25'">
                                                <div class="content">
                                                    <label for="">审核结果</label>
                                                    <span class="width2">{{item.operResult}}</span>
                                                    <label for="">审核意见</label>
                                                    <span class="width3">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 材料申请ORDEROPERTYPE26，材料申请受理ORDEROPERTYPE21，材料申请拒绝ORDEROPERTYPE22 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE26'||item.operTypeCode=='ORDEROPERTYPE21'||item.operTypeCode=='ORDEROPERTYPE22'">
                                                <div class="content">
                                                    <label for="">申请材料</label>
                                                    <span :title="item.materialRltList|materialShow" class="width2">{{item.materialRltList|materialShow}}</span>
                                                    <label for="">备注</label>
                                                    <span class="width3">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name width5">
                                                        <div v-for="(item1,index) in materialFileList(item.materialRltList)" :key="index" class="file-single">
                                                            <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item1.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl]" fit="fill"></el-image>
                                                            <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-doc" :href="item1.fileUrl"></a>
                                                            <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-xls" :href="item1.fileUrl"></a>
                                                            <a v-else :title="item1.fileName" class="icon-file file-other" :href="item1.fileUrl"></a>
                                                        </div>
                                                    </span>
                                                </div>
                                            </template>

                                            <!-- 延期申请 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE05'">
                                                <div class="content">
                                                    <!-- <label for="">申请期限</label>
                                                    <span>{{item.deadlineDate}}</span> -->
                                                    <label for="">申请天数</label>
                                                    <span class="width2">{{item.score}}</span>
                                                    <label for="">延期原因</label>
                                                    <span class="width3">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 延期审核 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE06'">
                                                <div class="content">
                                                    <label for="">审核结果</label>
                                                    <span class="width1">{{item.operResult}}</span>
                                                    <label for="">期限时间</label>
                                                    <span class="width1">{{item.deadlineDate}}</span>
                                                    <label for="">审核意见</label>
                                                    <span class="width3">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 到达 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE18'">
                                                <div class="content">
                                                    <label for="">备注</label>
                                                    <span class="width5">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name width5">
                                                        <div v-for="(item1,index) in item.fileInfoList" :key="index" class="file-single">
                                                            <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item1.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl]" fit="fill"></el-image>
                                                            <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-doc" :href="item1.fileUrl"></a>
                                                            <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-xls" :href="item1.fileUrl"></a>
                                                            <a v-else :title="item1.fileName" class="icon-file file-other" :href="item1.fileUrl"></a>
                                                        </div>
                                                    </span>
                                                </div>
                                            </template>

                                            <!-- 反馈ORDEROPERTYPE07 -->
                                            <template v-else>
                                                <div class="content">
                                                    <label for="">操作类型</label>
                                                    <span class="width1">{{item.operResult}}</span>
                                                    <!-- <label for="">故障类型</label>
                                                    <span>{{item.failureTypeName}}</span> -->
                                                    <label for="">故障原因</label>
                                                    <span class="width1">{{item.failureReason}}</span>
                                                    <label for="">结果反馈</label>
                                                    <span class="width3">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name width5">
                                                        <div v-for="(item1,index) in item.fileInfoList" :key="index" class="file-single">
                                                            <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item1.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl]" fit="fill"></el-image>
                                                            <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-doc" :href="item1.fileUrl"></a>
                                                            <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-xls" :href="item1.fileUrl"></a>
                                                            <a v-else :title="item1.fileName" class="icon-file file-other" :href="item1.fileUrl"></a>
                                                        </div>
                                                    </span>
                                                </div>
                                            </template>
                                        </li>
                                    </template>
                                </ul>
                                <!-- 确认 -->
                                <ul id="qr" class="sp-info confirm-info" v-if="workordersInfo.workordersRecordMap.sureList&&workordersInfo.workordersRecordMap.sureList.length>0">
                                    <li class="confirm-normal" v-for="(item,index) in workordersInfo.workordersRecordMap.sureList" :key="index">
                                        <div class="title">
                                            <label for="" class="title-name">{{item.operTypeName}}</label>
                                            <span class="title-date">{{item.operDate}}</span>
                                            <span class="title-person">{{item.operPerson}}</span>
                                        </div>
                                        <!-- 催办 -->
                                        <template v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                                            <div class="content">
                                                <label for="">催办原因</label>
                                                <span class="width5">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <!-- <label for="">确认结果</label>
                                                <span>{{item.operResult}}</span>
                                                <label for="">反馈时间</label>
                                                <span>{{item.operDate}}</span> -->
                                                <label for="">确认意见</label>
                                                <span class="width5">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </el-scrollbar>
            </div>
            <template v-if="$route.query.isread == 'edit'">
                <!-- 待维修ORDERSSTATUS02，待确认ORDERSSTATUS03 -->
                <!-- 反馈操作 "ORDEROPERTYPE07", "反馈"；"ORDEROPERTYPE19", "进度反馈"；"ORDEROPERTYPE20", "完成反馈" -->
                <feedback v-if="(prePage=='维修处置')&&(workordersInfo.workStatusCode == 'ORDERSSTATUS02'||workordersInfo.workStatusCode == 'ORDERSSTATUS03')" :data="workordersInfo" @callback="dataDetail"></feedback>
                <!-- 确认操作 "ORDEROPERTYPE08", "确认通过"；"", "确认不通过"-->
                <confirm v-if="(prePage=='工单确认')&&(workordersInfo.workStatusCode == 'ORDERSSTATUS03')" :data="workordersInfo" @callback="dataDetail"></confirm>
                <close v-if="(prePage=='维修申报'||prePage=='工单确认')&&(workordersInfo.workStatusCode == 'ORDERSSTATUS02')" :data="workordersInfo" @callback="dataDetail"></close>
            </template>

            <el-dialog title="工单催办" :visible.sync="dialogUrgeVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <label class="dialog-label">催办原因</label>
                    <el-input rows="6" type="textarea" placeholder="请输入" v-model="operExplain" class="dialog-textarea" style="width:290px;">
                    </el-input>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pressWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogUrgeVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import feedback from "components/workSheet_xt/sheetOperation/feedback";
    import confirm from "components/workSheet_xt/sheetOperation/confirm";
    import close from "components/workSheet_xt/sheetOperation/close";
    import mInput from "components/common/selectDrop";

    import Common from "@/assets/js/common.js";
    export default {
        components: {
            feedback,
            confirm,
            close,
            mInput
        },
        filters: {
            filterOverdue(value) {
                return value ? "已逾期" : (this.workordersInfo.repStatusName || '维修中');
            },
            stringLength: value => {
                let str = value;
                if (value.length > 20) {
                    str = str.substring(0, 19) + "...";
                }
                return str;
            },
            personNameShow(val) {
                let arr = [];
                val.map(res => {
                    arr.push(res.name);
                });
                return arr.join(",");
            },
            opPersonNameShow(val) {
                let arr = [];
                if (val && val.length > 0) {
                    val.map(res => {
                        arr.push(res.personName);
                    });
                }
                return arr.join(",");
            },
            materialShow(val) {
                let arr = [];
                val.map(res => {
                    arr.push(`${res.materialName||''}${res.materialNum||''}${res.materialUnit||''}`);
                });
                return arr.join(",");
            },
        },
        data() {
            return {
                title: "工单详情",
                token: "",
                isShow: true,
                stepPosition: 'relative',
                activeIndex: '',
                workordersInfo: {
                    workSystemId: '',
                    workordersRecordMap: {}
                },
                workStatusCode: '',
                operatCode: '',
                dispatchInfoLast: {},
                appointInfoLast: {},

                imgFileList: [],
                cancelReasonCode: "",

                dialogDelayVisible: false,
                dialogUrgeVisible: false,
                dialogRefuseVisible: false,
                dialogReturnVisible: false,
                dialogRevokeVisible: false,
                dialogMaterialVisible: false,
                operExplain: "",
                operExplain4Cancel: "",
                cancelReasonList: [],
                operRefuseExplain: "",
                operReturnExplain: "",
                delayTime: '',
                delayExplain: '',
                materialDic: [], //材料字典
                materialDUnit: [],
                materialList: [], // 材料列表，写入
                materialListIndex: -1, // 当前处理材料列表的索引（关联附件）
                operMaterialExplain: '',
                materialFiles: [],
                prePage: '',
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.initPage();
            this.addScrollListen();
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === oldVal.path && newVal.path === '/detsheet') {
                    this.initPage();
                }
            }
        },
        methods: {
            download(e) {
                window.open(e.fileUrl + '&token=' + this.token);
            },
            // 催办
            pressWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                var url = '';
                var obj = { operExplain: this.operExplain };
                obj.workSystemId = this.workordersInfo.workSystemId;
                url = this.$config.efoms_HOST + '/workorderssystem/info/press';

                this.isAjaxing = true;
                this.$api.putByQs(url, obj, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogUrgeVisible = false;
                            sessionStorage.setItem('relaodPage', '1'); //操作了催办回到列表刷新
                            this.dataDetail();
                            // 提交完置空
                            this.operExplain = '';
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
            showUrge() {
                this.dialogUrgeVisible = true;
            },
            materialFileList(val) {
                let arr = [];
                val.map(res => {
                    arr = [...arr, ...res.fileInfoList];
                });
                return arr;
            },
            goBack() {
                window.history.back();
            },
            dataDetail() {
                this.getWorkordersInfo();
            },
            getWorkordersInfo() {
                this.$api.get(`${this.$config.efoms_HOST}/workorderssystem/detail/byId`, { workSystemId: this.$route.query.id }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.workordersInfo = res.resultList || {};
                            this.workStatusCode = this.workordersInfo.workStatusCode || '';
                            let arr1 = this.workordersInfo.workordersRecordMap.dispatchList || [];
                            // 07有效类型
                            arr1 = arr1.filter(res => res.operResultCode === 'OPERRESULT07');
                            this.dispatchInfoLast = arr1.length > 0 ? arr1[arr1.length - 1] : {};
                            let arr2 = this.workordersInfo.workordersRecordMap.appointList || [];
                            arr2 = arr2.filter(res => res.operResultCode === 'OPERRESULT07');
                            this.appointInfoLast = arr2.length > 0 ? arr2[arr2.length - 1] : {};

                            let fileInfoList = this.workordersInfo.fileInfoList;
                            this.imgFileList = [];
                            fileInfoList.forEach(item => {
                                if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)) {
                                    let fileUrl = item.fileUrl.replace('file/downloadFile?secondDir=', 'fileResource/');
                                    fileUrl = fileUrl.replace('&fileName=', '/');
                                    item.mappingAddress = fileUrl;

                                    if (this.$config.baseimgs) {
                                        this.imgFileList.push(`${this.$config.baseimgs}?path=${item.mappingAddress}&token=${this.token}`);
                                    } else {
                                        this.imgFileList.push(item.mappingAddress);
                                    }
                                }
                            });

                            this.getNextStep();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getNextStep() {
                if (this.$route.query.isread != 'edit') {
                    return;
                }
                // this.$api.putByQs(`${this.$config.efoms_HOST}/workorderssystem/getNextProcessSystem`, {
                //         workSystemId: this.workordersInfo.workSystemId || this.workordersInfo.repairsId
                //     }, { token: this.token })
                //     .then(res => {
                //         if (res.appCode == 0) {
                //             this.operatCode = res.resultList || '';
                //         } else {
                //             Common.printErrorLog(res);
                //         }
                //     })
                //     .catch(err => {
                //         Common.printErrorLog(err);
                //     });
            },
            initPage() {
                this.prePage = this.$route.query.pre;
                // this.workSystemId.workordersRecordMap = {};
                this.dataDetail();
            },
            addScrollListen() {
                let _this = this;
                this.$nextTick(() => {
                    let scrollbarEl = this.$refs.swrapper.wrap;

                    scrollbarEl.onscroll = function() {
                        let t0 = document.querySelector('#cb') ? document.querySelector('#cb').offsetTop : -1;
                        let t1 = document.querySelector('#sq') ? document.querySelector('#sq').offsetTop : -1;
                        let t2 = document.querySelector('#sh') ? document.querySelector('#sh').offsetTop : -1;
                        let t3 = document.querySelector('#xf') ? document.querySelector('#xf').offsetTop : -1;
                        let t4 = document.querySelector('#zp') ? document.querySelector('#zp').offsetTop : -1;
                        let t5 = document.querySelector('#fk') ? document.querySelector('#fk').offsetTop : -1;
                        let t6 = document.querySelector('#qr') ? document.querySelector('#qr').offsetTop : -1;
                        let t7 = document.querySelector('#pj') ? document.querySelector('#pj').offsetTop : -1;
                        let t8 = document.querySelector('#cx') ? document.querySelector('#cx').offsetTop : -1;

                        if (t8 >= 0 && scrollbarEl.scrollTop >= t8) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'cx';
                        } else if (t7 >= 0 && scrollbarEl.scrollTop >= t7) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'pj';
                        } else if (t6 >= 0 && scrollbarEl.scrollTop >= t6) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'qr';
                        } else if (t5 >= 0 && scrollbarEl.scrollTop >= t5) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'fk';
                        } else if (t4 >= 0 && scrollbarEl.scrollTop >= t4) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'zp';
                        } else if (t3 >= 0 && scrollbarEl.scrollTop >= t3) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'xf';
                        } else if (t2 >= 0 && scrollbarEl.scrollTop >= t2) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'sh';
                        } else if (t1 >= 0 && scrollbarEl.scrollTop >= t1) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'sq';
                        } else if (t0 >= 0 && scrollbarEl.scrollTop >= t0) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'cb';
                        } else {
                            _this.stepPosition = 'relative';
                            _this.activeIndex = '';
                        }

                    }
                });
            },
            scrollIntoView(id) {
                document.getElementById(id).scrollIntoView();
                setTimeout(() => {
                    this.activeIndex = id;
                })
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/less/baseInfo.less";
    @import "../../assets/less/depiction.less";
    @import "../../assets/less/list.less";
    @import "../../assets/less/dialog.less";

    @import "../../assets/less/workOrderDet.less";
</style>
<style lang="less">
    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>