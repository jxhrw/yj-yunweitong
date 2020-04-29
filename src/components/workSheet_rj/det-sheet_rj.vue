<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <div class="title-box">
                    <h2>{{title}}</h2>
                    <ul class="pos-step" v-if="workordersInfo.workordersRecordMap">
                        <li :class="{'active': activeIndex==''||activeIndex=='sq'}" @click="scrollIntoView('sq')" v-if="workordersInfo.workordersRecordMap.submitList&&workordersInfo.workordersRecordMap.submitList.length>0">申请</li>
                        <li :class="{'active': activeIndex=='sh'}" @click="scrollIntoView('sh')" v-if="workordersInfo.workordersRecordMap.checkList&&workordersInfo.workordersRecordMap.checkList.length>0">审核</li>
                        <li :class="{'active': activeIndex=='xf'}" @click="scrollIntoView('xf')" v-if="workordersInfo.workordersRecordMap.dispatchList&&workordersInfo.workordersRecordMap.dispatchList.length>0">下发</li>
                        <li :class="{'active': activeIndex=='zp'}" @click="scrollIntoView('zp')" v-if="workordersInfo.workordersRecordMap.appointList&&workordersInfo.workordersRecordMap.appointList.length>0">指派</li>
                        <li :class="{'active': activeIndex=='fk'}" @click="scrollIntoView('fk')" v-if="workordersInfo.workordersRecordMap.fackbackList&&workordersInfo.workordersRecordMap.fackbackList.length>0">反馈</li>
                        <li :class="{'active': activeIndex=='qr'}" @click="scrollIntoView('qr')" v-if="workordersInfo.workordersRecordMap.sureList&&workordersInfo.workordersRecordMap.sureList.length>0">确认</li>
                        <li :class="{'active': activeIndex=='pj'}" @click="scrollIntoView('pj')" v-if="workordersInfo.workordersRecordMap.evaluateList&&workordersInfo.workordersRecordMap.evaluateList.length>0">评价</li>
                        <li :class="{'active': activeIndex=='cx'}" @click="scrollIntoView('cx')" v-if="workordersInfo.workordersRecordMap.cancelList&&workordersInfo.workordersRecordMap.cancelList.length>0">关闭</li>
                    </ul>
                </div>


                <div>
                    <template v-if="$route.query.isread=='edit'">
                        <!-- 可申请延期：ORDEROPERTYPE05 -->
                        <!-- 可申请延期：待指派ORDERSSTATUS11，指派已拒绝ORDERSSTATUS13,待维修ORDERSSTATUS02,已驳回ORDERSSTATUS05 -->
                        <div v-if="((prePage=='工单指派')&&(workStatusCode=='ORDERSSTATUS11'||workStatusCode=='ORDERSSTATUS13'))||((prePage=='维修处置')&&(workStatusCode=='ORDERSSTATUS02'||workStatusCode=='ORDERSSTATUS05'))" class="ej-content-title-btn ej-content-green" @click="showDelay" style="width:56px;">
                            <p>申请延期</p>
                        </div>
                        <!-- 可催办：ORDEROPERTYPE03，REPOPERTYPE03 -->
                        <!-- 可催办：待维修ORDERSSTATUS02,已驳回ORDERSSTATUS05 -->
                        <!-- <div v-if="(operatCode.indexOf('ORDEROPERTYPE03')>-1)||(workStatusCode=='ORDERSSTATUS02'||workStatusCode=='ORDERSSTATUS05')" class="ej-content-title-btn ej-content-green" @click="showUrge">
                            <p>催办</p>
                        </div> -->
                        <!-- 可拒绝："ORDEROPERTYPE14", "下发拒绝","ORDEROPERTYPE17", "指派拒绝" -->
                        <div v-if="((prePage=='工单指派')&&operatCode.indexOf('ORDEROPERTYPE14')>-1)||((prePage=='维修处置')&&operatCode.indexOf('ORDEROPERTYPE17')>-1)" class="ej-content-title-btn ej-content-yellow" @click="showRefuse">
                            <p>拒绝</p>
                        </div>
                        <!-- 待反馈ORDERSSTATUS02，待处理ORDERSSTATUS05，已到达ORDERSSTATUS14- -->
                        <!-- <div v-if="(prePage=='工单指派')&&(workStatusCode=='ORDERSSTATUS02'||workStatusCode=='ORDERSSTATUS05'||workStatusCode=='ORDERSSTATUS14')" class="ej-content-title-btn ej-content-yellow" @click="showReturn">
                            <p>退回</p>
                        </div> -->
                        <!-- 可撤销/关闭： ORDEROPERTYPE02，REPOPERTYPE02-->
                        <!-- "ORDEROPERTYPE02", "关闭"；"ORDEROPERTYPE27", "撤销-->
                        <!-- 或者 超期工单并且状态为非 已撤销状态ORDERSSTATUS08 已完结ORDERSSTATUS07-->
                        <template v-if="(prePage=='维修申报'||prePage=='优化申报')">
                            <div v-if="(operatCode.indexOf('ORDEROPERTYPE27')>-1)" class="ej-content-title-btn ej-content-yellow" @click="showRevoke('backout')">
                                <p>撤销</p>
                            </div>
                        </template>
                        <div v-else-if="prePage!='工单指派'&&(operatCode.indexOf('ORDEROPERTYPE02')>-1||operatCode.indexOf('REPOPERTYPE02')>-1)" class="ej-content-title-btn ej-content-yellow" @click="showRevoke">
                            <p>关闭</p>
                        </div>
                    </template>

                    <!-- 已撤销ORDERSSTATUS17，已完结ORDERSSTATUS07不能催办 -->
                    <div v-if="(prePage=='工单下发'||prePage=='工单指派'||prePage=='维修处置'||prePage=='工单确认'||prePage=='维修申报'||prePage=='优化申报'||prePage=='科室审核'||prePage=='处室审核')&&(workStatusCode!='ORDERSSTATUS17'&&workStatusCode!='ORDERSSTATUS07')" class="ej-content-title-btn ej-content-green" @click="showUrge">
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
                                    <span>{{workordersInfo.workOtherId || workordersInfo.repairsId}}</span>
                                    <!-- <div class="fix-state"><span>{{workordersInfo.workordersStatusName}}</span></div> -->
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
                                    <span>{{workordersInfo.repPersonName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属系统</label>
                                    <span>{{workordersInfo.systemName}}</span>
                                </el-col>
                                <el-col :span="9" class="detail-warning">
                                    <label>当前状态</label>
                                    <span>{{workordersInfo.workStatusName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属处室</label>
                                    <span>{{workordersInfo.devSpaceName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属部门</label>
                                    <span>{{workordersInfo.devDeptName}}</span>
                                </el-col>
                            </el-row>
                            <transition name="fade">
                                <div v-show="isShow">
                                    <el-row class="content-row-detail">

                                        <el-col :span="9">
                                            <label>维修类型</label>
                                            <span>{{workordersInfo.typeName}}</span>
                                        </el-col>

                                        <el-col :span="9">
                                            <label>详细地址</label>
                                            <span>{{workordersInfo.detailAddr}}</span>
                                        </el-col>

                                        <!-- <el-col :span="9">
                                            <label>紧急程度</label>
                                            <span>{{workordersInfo.levelName}}</span>
                                        </el-col> -->
                                        <el-col :span="9">
                                            <label>申报时间</label>
                                            <span>{{workordersInfo.repDate}}</span>
                                        </el-col>

                                        <el-col :span="9">
                                            <label>期限完成时间</label>
                                            <span>{{workordersInfo.deadlineTime}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>维护单位</label>
                                            <span>{{workordersInfo.oppmDeptName}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>维修组</label>
                                            <span>{{appointInfoLast.opDeptName}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>维修人员</label>
                                            <span>{{appointInfoLast.workordersPersonRltList|opPersonNameShow}}</span>
                                        </el-col>
                                        <el-col :span="9" v-show="workordersInfo. countdownTime">
                                            <label>维修倒计时</label>
                                            <span>{{workordersInfo. countdownTime}}</span>
                                        </el-col>
                                        <el-col :span="9" v-show="workordersInfo.overTime">
                                            <label>超时时间</label>
                                            <span>{{workordersInfo.overTime}}</span>
                                        </el-col>
                                        <el-col :span="9" v-show="workordersInfo.consumingTime">
                                            <label>维修耗时</label>
                                            <span>{{workordersInfo.consumingTime}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>情况描述</label>
                                            <span>{{workordersInfo.failureDescrible}}</span>
                                        </el-col>
                                        <el-col :span="9" v-show="workordersInfo.optimeScheme">
                                            <label>优化方案</label>
                                            <span>{{workordersInfo.optimeScheme}}</span>
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
                                <!-- 优化审核（科室ORDEROPERTYPE07，处室ORDEROPERTYPE08） -->
                                <ul id="sh" class="sp-info examine-info" v-if="workordersInfo.workordersRecordMap.checkList&&workordersInfo.workordersRecordMap.checkList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.checkList" :key="index">
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
                                                <label for="">审核结果</label>
                                                <span class="width2">{{item.operResult}}</span>
                                                <label for="">审核意见</label>
                                                <span class="width3">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 下发ORDEROPERTYPE04，下发拒绝ORDEROPERTYPE14 -->
                                <ul id="xf" class="sp-info iss-info" v-if="workordersInfo.workordersRecordMap.dispatchList&&workordersInfo.workordersRecordMap.dispatchList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.dispatchList" :key="index">
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

                                        <!-- 下发 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE04'">
                                            <div class="content">
                                                <label for="">运维单位</label>
                                                <span class="width1">{{item.opDeptName}}</span>
                                                <label for="">维修期限</label>
                                                <span class="width1">{{item.deadlineDate}}</span>
                                                <label for="">下发意见</label>
                                                <span class="width3">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                        <!-- 下发拒绝 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE14'">
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span class="width5">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 指派ORDEROPERTYPE15，指派拒绝ORDEROPERTYPE17 -->
                                <ul id="zp" class="sp-info asgn-info" v-if="workordersInfo.workordersRecordMap.appointList&&workordersInfo.workordersRecordMap.appointList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.appointList" :key="index">
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
                                        <!-- 指派 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE15'">
                                            <div class="content">
                                                <label for="">运维组</label>
                                                <span class="width1">{{item.opDeptName}}</span>
                                                <label for="">维修人员</label>
                                                <span class="width1">{{item.workordersPersonRltList|opPersonNameShow}}</span>
                                                <label for="">指派意见</label>
                                                <span class="width3">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                        <!-- 指派拒绝 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE17'">
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span class="width5">{{item.operExplain}}</span>
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

                                        <template v-else>
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span class="width5">{{item.operExplain}}</span>
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
                                                    <label for="">反馈说明</label>
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
                                                <label for="">确认结果</label>
                                                <span class="width1">{{item.operResult}}</span>
                                                <label for="">反馈时间</label>
                                                <span class="width1">{{item.operDate}}</span>
                                                <label for="">确认意见</label>
                                                <span class="width3">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 评价 -->
                                <ul id="pj" class="sp-info assess-info" v-if="workordersInfo.workordersRecordMap.evaluateList&&workordersInfo.workordersRecordMap.evaluateList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.evaluateList" :key="index">
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
                                                <template v-for="(res,rdx) in item.evalGradeList">
                                                    <label for="" :key="'lb'+rdx">{{res.evalItemName||res.evalExplain}}</label>
                                                    <span class="width1" :key="'sp'+rdx">{{res.evalGrades}}星</span>
                                                </template>
                                                <label for="">意见</label>
                                                <span :title="item.operExplain" :class="(!item.evalGradeList)?'width5':('width'+(5-item.evalGradeList.length))">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 撤销/关闭 -->
                                <ul id="cx" class="sp-info revoke-info" v-if="workordersInfo.workordersRecordMap.cancelList&&workordersInfo.workordersRecordMap.cancelList.length>0">
                                    <li v-for="(item,index) in workordersInfo.workordersRecordMap.cancelList" :key="index">
                                        <div class="title">
                                            <label for="" class="title-name">{{item.operTypeName}}</label>
                                            <span class="title-date">{{item.operDate}}</span>
                                            <span class="title-person">{{item.operPerson}}</span>
                                        </div>
                                        <div class="content">
                                            <!-- ("ORDEROPERTYPE02", "关闭"), ("ORDEROPERTYPE27", "撤销") -->
                                            <label for="">{{item.operTypeCode=='ORDEROPERTYPE27'?'撤销':'关闭'}}原因</label>
                                            <span class="width2">{{item.operReasonName}}</span>
                                            <label for="">备注</label>
                                            <span class="width3">{{item.operExplain}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </el-scrollbar>
            </div>
            <template>
                <!-- 科室+处室审核 -->
                <auditApply v-if="(prePage=='科室审核'&&(operatCode.indexOf('REPOPERTYPE05')>-1 ||operatCode.indexOf('REPOPERTYPE06')>-1))||(prePage=='处室审核'&&(operatCode.indexOf('REPOPERTYPE09')>-1 ||operatCode.indexOf('REPOPERTYPE10')>-1))" :data="workordersInfo" @callback="dataDetail"></auditApply>
                <!-- 反馈操作 "ORDEROPERTYPE07", "反馈"；"ORDEROPERTYPE19", "进度反馈"；"ORDEROPERTYPE20", "完成反馈" -->
                <feedback v-if="(prePage=='维修处置')&&((operatCode.indexOf('ORDEROPERTYPE07')>-1||operatCode.indexOf('ORDEROPERTYPE19')>-1||operatCode.indexOf('ORDEROPERTYPE20')>-1))" :data="workordersInfo" @callback="dataDetail"></feedback>
                <!-- 确认操作 "ORDEROPERTYPE11", "确认通过"；"ORDEROPERTYPE12", "确认不通过"-->
                <confirm v-if="(prePage=='工单确认')&&((operatCode.indexOf('ORDEROPERTYPE11')>-1||operatCode.indexOf('ORDEROPERTYPE12')>-1))" :data="workordersInfo" @callback="dataDetail"></confirm>
                <!-- 延期审核操作 "ORDEROPERTYPE06", "延期审核", isDefer -->
                <delay v-if="((prePage=='延期审核')&&((operatCode.indexOf('ORDEROPERTYPE06')>-1)||(workordersInfo.isDefer&&$route.query.isread=='edit')))" :data="workordersInfo" @callback="dataDetail"></delay>
                <!-- 评价操作 "ORDEROPERTYPE10", "评价" -->
                <evaluate v-if="(prePage=='工单评价')&&(operatCode.indexOf('ORDEROPERTYPE10')>-1)" :data="workordersInfo" @callback="dataDetail"></evaluate>
                <!-- 下发操作 "ORDEROPERTYPE04", "下发" -->
                <issue v-if="(prePage=='工单下发')&&(operatCode.indexOf('ORDEROPERTYPE04')>-1)" :data="workordersInfo" @callback="dataDetail"></issue>
                <!-- 指派操作 "ORDEROPERTYPE15", "指派"-->
                <assign v-if="(prePage=='工单指派')&&(operatCode.indexOf('ORDEROPERTYPE15')>-1)" :data="workordersInfo" @callback="dataDetail"></assign>
            </template>

            <el-dialog title="延期申请" :visible.sync="dialogDelayVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span>*</span>延期天数</label>
                        <!-- <el-date-picker v-model="delayTime" type="datetime" size='mini' value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期" style="width: 290px;">
                        </el-date-picker> -->
                        <el-input placeholder="请输入" v-model="delayTime" class="dialog-input" style="width:290px;"></el-input>
                    </div>
                    <div>
                        <label class="dialog-label"><span>*</span>延期原因</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="delayExplain" class="dialog-textarea" style="width:290px;">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="postponeWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogDelayVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
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
            <el-dialog title="拒绝申请" :visible.sync="dialogRefuseVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span style="left:15px;">*</span>备注</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="operRefuseExplain" class="dialog-textarea" style="width:290px;">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogRefuseVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="退回至待下发" :visible.sync="dialogReturnVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span style="left:15px;">*</span>备注</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="operReturnExplain" class="dialog-textarea" style="width:290px;">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="returnWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogReturnVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="关闭申请" :visible.sync="dialogRevokeVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span>*</span>关闭原因</label>
                        <el-select v-model="cancelReasonCode" placeholder="请选择" size='mini' class="content-select" style="width: 290px;">
                            <el-option v-for="item in cancelReasonList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <label class="dialog-label">备注</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="operExplain4Cancel" class="dialog-textarea" style="width:290px;">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogRevokeVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="撤销申请" :visible.sync="dialogBackoutVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span>*</span>撤销原因</label>
                        <el-select v-model="backoutReasonCode" placeholder="请选择" size='mini' class="content-select" style="width: 290px;">
                            <el-option v-for="item in cancelReasonList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <label class="dialog-label">备注</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="operExplain4Backout" class="dialog-textarea" style="width:290px;">
                        </el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="backoutWorkorders" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogBackoutVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="材料申请" :visible.sync="dialogMaterialVisible" width='700px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <label class="dialog-label"><span>*</span>材料列表</label>
                        <!-- <el-input rows="6" type="textarea" placeholder="请输入" v-model="materialList" class="dialog-textarea height100" style="width:290px;">
                        </el-input> -->
                        <div style="width:590px;display:inline-block;overflow:hidden;">
                            <ul class="mt-list mt-list-th">
                                <li>
                                    <span class="mtl1">备件名称</span>
                                    <span class="mtl2">申请数量</span>
                                    <span class="mtl3">数量单位</span>
                                    <span class="mtl5">附件</span>
                                    <span class="mtl4"><i class="el-icon-circle-plus-outline" @click="addMaterial"></i></span>
                                </li>
                            </ul>
                            <el-scrollbar class="mtl-scrollbar">
                                <ul class="mt-list mt-list-scroll">
                                    <li v-for="(item,index) in materialList" :key="index">
                                        <!-- <el-input v-model="item.materialName" size='mini' class="content-select mtl1" clearable></el-input> -->
                                        <mInput :list="materialDic" :code.sync="item.materialCode" :name.sync="item.materialName" class="content-select mtl1"></mInput>
                                        <el-input v-model="item.materialNum" size='mini' class="content-select mtl2" clearable></el-input>
                                        <!-- <el-input v-model="item.materialUnit" size='mini' class="content-select mtl3" clearable></el-input> -->
                                        <mInput :list="materialDUnit" :code.sync="item.materialUnit" :name.sync="item.materialUnit" class="content-select mtl3"></mInput>

                                        <div class="mtl5" v-if="item.fileInfoList && item.fileInfoList.length>0">
                                            <template v-for="(res,ix) in item.fileInfoList">
                                                <div class="ms-files" :key="ix">
                                                    <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${token}`:res.fileURL" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${token}`:res.fileURL]" fit="fill"></el-image>
                                                    <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-doc"></div>
                                                    <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-xls"></div>
                                                    <div v-else :title="res.fileName" class="icon-file file-other"></div>

                                                    <span class="ms-actions">
                                                        <span class="ms-delete" @click="handleDownload(res)">下载</span>
                                                        <span class="ms-delete" @click="handleRemove(res,ix,index)">删除</span>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="mtl5" v-else>
                                            <el-upload style="display:block;" :action="`${$config.efoms_HOST}/file/uploadFile`" list-type="picture-card" :headers="{token:token}" :on-success="handleSuccessList" :show-file-list="false" @click.native="materialListIndex=index">
                                                <i slot="default" class="el-icon-plus"></i>
                                            </el-upload>
                                        </div>

                                        <span class="mtl4"><i class="el-icon-remove-outline" @click="removeMaterial(index)"></i></span>
                                    </li>
                                </ul>
                            </el-scrollbar>

                        </div>
                    </div>
                    <div class="revoke-reason">
                        <label class="dialog-label">备注</label>
                        <el-input rows="6" type="textarea" placeholder="请输入" v-model="operMaterialExplain" class="dialog-textarea height100" style="width:290px;">
                        </el-input>
                    </div>
                    <!-- <div>
                        <label class="dialog-label">附件</label>
                        <div class="upload-demo">
                            <template v-for="(item,index) in materialFiles">
                                <div class="ms-files" :key="index">
                                    <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)" :src="item.fileURL" :preview-src-list="[item.fileURL]" fit="fill"></el-image>
                                    <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-doc"></div>
                                    <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-xls"></div>
                                    <div v-else :title="item.fileName" class="icon-file file-other"></div>

                                    <span class="ms-actions">
                                        <span class="ms-delete" @click="handleDownload(item)">下载</span>
                                        <span class="ms-delete" @click="handleRemove(item,index)">删除</span>
                                    </span>
                                </div>
                            </template>

                            <el-upload style="display:block;" :action="`${$config.efoms_HOST}/file/uploadFile`" list-type="picture-card" :headers="{token:token}" :on-success="handleSuccess" :show-file-list="false">
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                    </div> -->
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitMaterial" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogMaterialVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import feedback from "components/workSheet_rj/sheetOperation/feedback";
    import confirm from "components/workSheet_rj/sheetOperation/confirm";
    import delay from "components/workSheet_rj/sheetOperation/delay";
    import evaluate from "components/workSheet_rj/sheetOperation/evaluate";
    import issue from "components/workSheet_rj/sheetOperation/issue";
    import assign from "components/workSheet_rj/sheetOperation/assign";
    import auditApply from "components/workSheet_rj/sheetOperation/auditApply";
    import mInput from "components/common/selectDrop";

    import Common from "@/assets/js/common.js";
    export default {
        components: {
            feedback,
            confirm,
            delay,
            evaluate,
            issue,
            assign,
            auditApply,
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
                    workOtherId: '',
                    workordersRecordMap: {}
                },
                workStatusCode: '',
                operatCode: '',
                dispatchInfoLast: {},
                appointInfoLast: {},

                imgFileList: [],
                cancelReasonCode: "",
                backoutReasonCode: "",

                dialogDelayVisible: false,
                dialogUrgeVisible: false,
                dialogRefuseVisible: false,
                dialogReturnVisible: false,
                dialogRevokeVisible: false,
                dialogBackoutVisible: false,
                dialogMaterialVisible: false,
                operExplain: "",
                operExplain4Cancel: "",
                operExplain4Backout: "",
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
            // 延期接口
            postponeWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.delayTime == '') {
                    Common.ejMessage("warning", "申请天数必填");
                    return;
                }
                if (!(/^\d+(\.\d{1})?$/.test(this.delayTime))) {
                    Common.ejMessage("warning", "申请天数最多一位小数");
                    return;
                }
                if (this.delayExplain == '') {
                    Common.ejMessage("warning", "延期原因必填");
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersOther/postponeWorkordersOther`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        dayNum: this.delayTime,
                        operExplain: this.delayExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogDelayVisible = false;
                            this.dataDetail();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 催办
            pressWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                var url = '';
                var obj = { operExplain: this.operExplain };
                obj.workOtherId = this.workordersInfo.workOtherId;
                url = this.$config.efoms_HOST + '/workordersOther/pressWorkordersOther';

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
            // 关闭
            cancelWorkorders() {
                let cancelReasonName = '';
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.cancelReasonCode == "") {
                    return Common.ejMessage("warning", "请选择关闭原因");
                } else {
                    this.cancelReasonList.map(res => {
                        if (res.dicCode == this.cancelReasonCode) cancelReasonName = res.dicName;
                    });
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersOther/cancelWorkordersOther`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        operExplain: this.operExplain4Cancel,
                        operReasonCode: this.cancelReasonCode,
                        operReasonName: cancelReasonName
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogRevokeVisible = false;
                            this.dataDetail();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 撤销
            backoutWorkorders() {
                let backoutReasonName = '';
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.backoutReasonCode == "") {
                    return Common.ejMessage("warning", "请选择撤销原因");
                } else {
                    this.cancelReasonList.map(res => {
                        if (res.dicCode == this.backoutReasonCode) backoutReasonName = res.dicName;
                    });
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersOther/backoutWorkordersOther`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        operExplain: this.operExplain4Backout,
                        operReasonCode: this.backoutReasonCode,
                        operReasonName: backoutReasonName
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogBackoutVisible = false;
                            this.dataDetail();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 拒绝
            handleWorkorders() {
                if (this.operRefuseExplain == '') {
                    Common.ejMessage("warning", "请填写备注");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                // 下发拒绝 handleAppoWorkorders 状态待指派 ORDERSSTATUS11，指派已拒绝 ORDERSSTATUS13
                // 指派拒绝 handleDispWorkorders 状态待维修 ORDERSSTATUS02
                let mturl = '';
                switch (this.workStatusCode) {
                    case 'ORDERSSTATUS11':
                    case 'ORDERSSTATUS13':
                        mturl = `${this.$config.efoms_HOST}/workordersOther/rejectDispWorkordersOther`;
                        break;
                    case 'ORDERSSTATUS02':
                        mturl = `${this.$config.efoms_HOST}/workordersOther/rejectAppoWorkordersOther`;
                        break;
                    default:
                        break;
                }
                if (mturl == '') {
                    this.$message.error("状态不正确无法进行拒绝操作");
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(mturl, {
                        workOtherId: this.workordersInfo.workOtherId,
                        isHandle: 0, //1为受理，0为拒绝
                        operExplain: this.operRefuseExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogRefuseVisible = false;
                            this.dataDetail();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 退回
            returnWorkorders() {
                if (this.operReturnExplain == '') {
                    Common.ejMessage("warning", "请填写备注");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersRecord/rejectDispWorkorders`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        operExplain: this.operReturnExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogReturnVisible = false;
                            this.dataDetail();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 材料申请
            submitMaterial() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}/workorders/opr/materialApply`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        materialList: this.materialList,
                        fileList: this.materialFiles,
                        operExplain: this.operMaterialExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogMaterialVisible = false;
                            this.dataDetail();
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
            showRevoke(type) {
                this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { "parentCode": "CANCELREASON" }).then(res => {
                    if (res.appCode == 0) {
                        this.cancelReasonList = res.resultList;
                    }
                });
                if (type == 'backout') {
                    this.dialogBackoutVisible = true;
                } else {
                    this.dialogRevokeVisible = true;
                }
            },
            async showRefuse() {
                if (!(await this.stopOpertion())) return;
                this.dialogRefuseVisible = true;
            },
            async showReturn() {
                if (!(await this.stopOpertion())) return;
                this.dialogReturnVisible = true;
            },
            showUrge() {
                this.dialogUrgeVisible = true;
            },
            async showDelay() {
                if (!(await this.stopOpertion())) return;
                this.dialogDelayVisible = true;
            },
            async showMaterial() {
                if (!(await this.stopOpertion())) return;
                this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { "parentCode": "DEVMATERTYPE" }).then(res => {
                    if (res.appCode == 0) {
                        this.materialDic = res.resultList;
                        this.materialDUnit = [{ dicCode: '个', dicName: '个' }, { dicCode: '台', dicName: '台' }];
                    }
                });
                this.dialogMaterialVisible = true;
            },
            materialFileList(val) {
                let arr = [];
                val.map(res => {
                    arr = [...arr, ...res.fileInfoList];
                });
                return arr;
            },
            async turnWorks() {
                if (!(await this.stopOpertion())) return;
                this.$router.push({
                    path: '/detrep',
                    query: { transferId: this.workordersInfo.workOtherId }
                })
            },
            stopOpertion() {
                // if (this.prePage == '维修处置' && ((this.operatCode.indexOf('ORDEROPERTYPE06') > -1) || (this.workordersInfo.isDefer))) {
                //     Common.ejMessage("warning", "存在申请延期未审核，不能执行该操作");
                //     return false;
                // } else if (this.prePage == '工单指派' && ((this.workordersInfo.isDefer))) {
                //     Common.ejMessage("warning", "存在申请延期未审核，不能执行该操作");
                //     return false;
                // } else {
                //     return true;
                // }

                return new Promise((resolve, reject) => {
                    if (this.prePage == '维修处置' || this.prePage == '工单指派') {
                        this.$api.get(`${this.$config.efoms_HOST}/workordersOther/selectWorkordersOtherById`, { workOtherId: this.$route.query.id }, { token: this.token })
                            .then(res => {
                                if (res.appCode == 0) {
                                    let obj = res.resultList || {};
                                    if (obj.isDefer) {
                                        Common.ejMessage("warning", "存在申请延期未审核，不能执行该操作");
                                    }
                                    resolve(!obj.isDefer);
                                } else {
                                    Common.printErrorLog(res);
                                    resolve(false);
                                }
                            })
                            .catch(err => {
                                Common.printErrorLog(err);
                                resolve(false);
                            });
                    } else {
                        resolve(true);
                    }
                });
            },
            goBack() {
                window.history.back();
            },
            // 材料申请 - 处理
            handleSuccess(response, file, fileList) {
                console.log(response);
                if (response.appCode == '0') {
                    let res = response.resultList || {};
                    this.materialFiles.push({
                        secondDir: res.secondDir,
                        fileName: res.fileName,
                        fileOldName: res.fileOldName,
                        fileURL: res.downloadPath,
                        fileMode: /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.fileOldName) ? '0' : '3'
                        // fileMode: res.fileOldName
                        //     .slice(res.fileOldName.lastIndexOf(".") + 1)
                        //     .toLowerCase()
                    });
                }
            },
            handleSuccessList(response, file, fileList) {
                console.log(response);
                if (response.appCode == '0') {
                    let res = response.resultList || {};
                    this.materialList[this.materialListIndex].fileInfoList.push({
                        secondDir: res.secondDir,
                        fileName: res.fileName,
                        fileOldName: res.fileOldName,
                        fileURL: res.downloadPath,
                        fileMode: /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.fileOldName) ? '0' : '3'
                        // fileMode: res.fileOldName
                        //     .slice(res.fileOldName.lastIndexOf(".") + 1)
                        //     .toLowerCase()
                    });
                }
            },
            handleRemove(e, index, parentIndex) {
                if (parseInt(parentIndex) == parentIndex) {
                    this.materialList[parentIndex].fileInfoList.splice(index, 1);
                } else {
                    this.materialFiles.splice(index, 1);
                }

                this.$api.delete(`${this.$config.efoms_HOST}/file/deleteFile`, {
                        token: this.token,
                        secondDir: e.secondDir,
                        fileName: e.fileName
                    }, { "Content-Type": "application/x-www-form-urlencoded" })
                    .then(res => {
                        if (res.appCode == 0) {} else {
                            // Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        // Common.printErrorLog(err);
                    });
            },
            handleDownload(e) {
                window.location.href = e.fileURL;
            },
            addMaterial() {
                this.materialList.push({
                    materialCode: '',
                    materialName: '',
                    materialNum: '1',
                    materialUnit: '',
                    fileInfoList: []
                });
            },
            removeMaterial(index) {
                this.materialList.splice(index, 1);
            },
            // 材料申请处理结束
            dataDetail() {
                this.getWorkordersInfo();
            },
            getWorkordersInfo() {
                this.$api.get(`${this.$config.efoms_HOST}/workordersOther/selectWorkordersOtherById`, { workOtherId: this.$route.query.id }, { token: this.token })
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
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersOther/getNextProcessOther`, {
                        workOtherId: this.workordersInfo.workOtherId || this.workordersInfo.repairsId
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.operatCode = res.resultList || '';
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            initPage() {
                this.prePage = this.$route.query.pre;
                // this.workOtherId.workordersRecordMap = {};

                this.dataDetail();
            },
            addScrollListen() {
                let _this = this;
                this.$nextTick(() => {
                    let scrollbarEl = this.$refs.swrapper.wrap;

                    scrollbarEl.onscroll = function() {

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