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
                        <li :class="{'active': activeIndex=='ys'}" @click="scrollIntoView('ys')" v-if="workordersInfo.workordersRecordMap.reviewList&&workordersInfo.workordersRecordMap.reviewList.length>0">验收</li>
                        <li :class="{'active': activeIndex=='ys_aaaa'}" @click="scrollIntoView('ys')" v-if="workordersInfo.workordersRecordMap.evaluateList&&workordersInfo.workordersRecordMap.evaluateList.length>0">评价</li>
                        <li :class="{'active': activeIndex=='cx'}" @click="scrollIntoView('cx')" v-if="workordersInfo.workordersRecordMap.cancelList&&workordersInfo.workordersRecordMap.cancelList.length>0">关闭</li>
                    </ul>
                </div>

                <div>
                    <template v-if="$route.query.isread=='edit'">
                        <!-- 转单，材料： ORDEROPERTYPE23 -->
                        <!-- 转单，材料： 待维修ORDERSSTATUS02，已驳回ORDERSSTATUS05 -->
                        <!-- <div v-if="($config.cityName=='hangzhou')&&(prePage=='维修处置')&&(operatCode.indexOf('ORDEROPERTYPE23')>-1||workordersStatusCode=='ORDERSSTATUS02'||workordersStatusCode=='ORDERSSTATUS05')" class="ej-content-title-btn ej-content-green" @click="turnWorks">
                            <p>转单</p>
                        </div> -->
                        <!-- 可申请延期：ORDEROPERTYPE05 -->
                        <!-- 可申请延期：待指派FACILITYSTATUS07，指派已拒绝FACILITYSTATUS08,待维修FACILITYSTATUS09,已驳回FACILITYSTATUS10，已到达 FACILITYSTATUS11 -->
                        <div v-if="((prePage=='工单指派')&&(workordersStatusCode=='FACILITYSTATUS07'||workordersStatusCode=='FACILITYSTATUS08'))||((prePage=='维修处置')&&(workordersStatusCode=='FACILITYSTATUS09'||workordersStatusCode=='FACILITYSTATUS10'||workordersStatusCode=='FACILITYSTATUS11'))" class="ej-content-title-btn ej-content-green" @click="showDelay" style="width:56px;">
                            <p>申请延期</p>
                        </div>
                        <!-- 可催办：FACILITYOPERTYPE07 -->
                        <div v-if="(operatCode.indexOf('FACILITYOPERTYPE07')>-1)" class="ej-content-title-btn ej-content-green" @click="showUrge">
                            <p>催办</p>
                        </div>
                        <!-- 可拒绝："FACILITYOPERTYPE10", "指派拒绝" -->
                        <!-- FACILITYOPERTYPE26，下发拒绝 -->
                        <div v-if="(prePage=='工单指派'&&operatCode.indexOf('FACILITYOPERTYPE26')>-1)||(prePage=='维修处置'&&operatCode.indexOf('FACILITYOPERTYPE10')>-1)" class="ej-content-title-btn ej-content-yellow" @click="showRefuse">
                            <p>拒绝</p>
                        </div>
                        <!-- "FACILITYOPERTYPE06","关闭"；"FACILITYOPERTYPE27","撤销"-->
                        <!-- 或者 超期工单并且状态为非 已撤销状态ORDERSSTATUS08 已完结ORDERSSTATUS07-->
                        <template v-if="(prePage=='维修申报'||prePage=='优化申报'||prePage=='抢修申报'||prePage=='数字城管')">
                            <div v-if="(operatCode.indexOf('FACILITYOPERTYPE27')>-1)" class="ej-content-title-btn ej-content-yellow" @click="showRevoke('backout')">
                                <p>撤销</p>
                            </div>
                        </template>
                        <div v-else-if="(operatCode.indexOf('FACILITYOPERTYPE06')>-1||(prePage=='超期工单'&&(workordersStatusCode!='ORDERSSTATUS08'&&workordersStatusCode!='ORDERSSTATUS07')))" class="ej-content-title-btn ej-content-yellow" @click="showRevoke">
                            <p>关闭</p>
                        </div>
                    </template>

                    <!-- 已撤销ORDERSSTATUS08，已完结ORDERSSTATUS07不能催办 -->
                    <!-- <div v-if="(prePage=='工单下发'||prePage=='工单指派'||prePage=='维修处置'||prePage=='工单确认'||prePage=='维修申报'||prePage=='优化申报'||prePage=='科室审核'||prePage=='处室审核')&&(workordersStatusCode!='ORDERSSTATUS08'&&workordersStatusCode!='ORDERSSTATUS07')" class="ej-content-title-btn ej-content-green" @click="showUrge">
                        <p>催办</p>
                    </div> -->
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
                                    <span>{{workordersInfo.signsWorkordersId}}</span>
                                    <span class="date-state" style="flex:none" v-if="workordersInfo.isOverdue">{{workordersInfo.isOverdue|filterOverdue}}</span>
                                </el-col>
                                <el-col :span="9" class="detail-warning">
                                    <template v-if="prePage=='转单审核'">
                                        <label>原工单ID</label>
                                        <span>
                                            <router-link :to="{path:'/detsheetss',query:{id: workordersInfo.transferId}}">{{workordersInfo.transferId}}</router-link>
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
                                <el-col :span="9" class="detail-warning">
                                    <label>当前状态</label>
                                    <span>{{workordersInfo.workordersStatusName || workordersInfo.repStatusName}}</span>
                                </el-col>
                                <!-- <el-col :span="9" class="detail-warning">
                                    <label>路口点位</label>
                                    <span>{{workordersInfo.devName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>管理辖区</label>
                                    <span>{{workordersInfo.devAreaName}}</span>
                                </el-col> -->
                                <el-col :span="9">
                                    <label>详细地址</label>
                                    <span>{{workordersInfo.detailAddr}}</span>
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
                                            <label>设施类别</label>
                                            <span>{{workordersInfo.devTypeName}}</span>
                                        </el-col>
                                        <!-- <el-col :span="9">
                                            <label>申报来源</label>
                                            <span>{{workordersInfo.repSourceName}}</span>
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
                                            <label>所属大队</label>
                                            <span>{{workordersInfo.devDeptName}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>道路信息</label>
                                            <span>{{workordersInfo.listSignsWorkordersRoad|roadShow}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>所属中队</label>
                                            <span>{{workordersInfo.squadronName}}</span>
                                        </el-col>
                                        <!-- <el-col :span="9">
                                            <label>维护单位</label>
                                            <span>{{dispatchInfoLast.opDeptName}}</span>
                                        </el-col> -->
                                        <!-- <el-col :span="9">
                                            <label>期限完成时间</label>
                                            <span>{{workordersInfo.deadlineTime}}</span>
                                        </el-col> -->
                                        <!-- <el-col :span="9">
                                            <label>管理辖区</label>
                                            <span>{{workordersInfo.devAreaName}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>维修组</label>
                                            <span>{{appointInfoLast.opDeptName}}</span>
                                        </el-col>
                                        <el-col :span="9">
                                            <label>维修人员</label>
                                            <span>{{appointInfoLast.workordersPersonRltList|opPersonNameShow}}</span>
                                        </el-col> -->
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
                                        <el-col :span="9">
                                            <label :style="voiceList.length>0?'line-height:36px;':''">语音描述</label>
                                            <span class="voice-box">
                                                <template v-if="voiceList.length<=0">
                                                    无
                                                </template>
                                                <i v-for="(item,index) in voiceList" :key="index">
                                                    <audio :src="item.fileUrl" controls="controls"></audio>
                                                </i>
                                            </span>
                                        </el-col>

                                        <el-col :span="24" class="content-row-img">
                                            <label>照片/文件</label>
                                            <template v-for="(item,index) in imgFileList">
                                                <el-image class="img-preview" :key="index" :src="item" :preview-src-list="imgFileList.slice(index).concat(imgFileList.slice(0,index))" fit="fill">
                                                </el-image>
                                            </template>
                                            <template v-for="(item,index2) in otherFileList">
                                                <div :key="index2+'a'" class="img-preview">
                                                    <a v-if="/\.(doc|docx|DOC|DOCX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-doc" :href="item.fileUrl"></a>
                                                    <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-xls" :href="item.fileUrl"></a>
                                                    <a v-else :title="item.fileName" class="icon-file file-other" :href="item.fileUrl"></a>
                                                </div>
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <template v-if="workordersInfo.optimeScheme">
                                                    <label for="">优化方案</label>
                                                    <span style="width: 996px;">{{workordersInfo.optimeScheme}}</span>
                                                </template>
                                                <template v-else>
                                                    <label for="">情况描述</label>
                                                    <span style="width: 996px;">{{workordersInfo.failureDescrible}}</span>
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <label for="">审核结果</label>
                                                <span style="width: 349px;">{{item.operResult}}</span>
                                                <label for="">审核意见</label>
                                                <span style="width: 567px;">{{item.operExplain}}</span>
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <!-- 下发 -->
                                        <template v-else-if="item.operTypeCode == 'FACILITYOPERTYPE08'">
                                            <div class="content">
                                                <label for="">运维单位</label>
                                                <span style="width: 349px;">{{item.opDeptName}}</span>
                                                <label for="">维修期限</label>
                                                <span style="width: 567px;">{{item.deadlineDate}}</span>
                                            </div>
                                        </template>
                                        <!-- 下发拒绝 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE14'">
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span style="width: 996px;">{{item.operExplain}}</span>
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                        <!-- 指派 -->
                                        <template v-else-if="item.operTypeCode == 'FACILITYOPERTYPE09'">
                                            <div class="content">
                                                <label for="">运维组</label>
                                                <span style="width: 349px;">{{item.opDeptName}}</span>
                                                <label for="">维修人员</label>
                                                <span style="width: 567px;">{{item.workordersPersonRltList|opPersonNameShow}}</span>
                                            </div>
                                        </template>
                                        <!-- 指派拒绝 -->
                                        <template v-else-if="item.operTypeCode == 'ORDEROPERTYPE17'">
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <!-- 延期申请 -->
                                        <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE12'">
                                            <div class="content">
                                                <!-- <label for="">申请期限</label>
                                                    <span>{{item.deadlineDate}}</span> -->
                                                <label for="">申请天数</label>
                                                <span style="width:349px;">{{item.score}}</span>
                                                <label for="">延期原因</label>
                                                <span style="width: 567px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <!-- 延期审核 -->
                                        <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE13'">
                                            <div class="content">
                                                <label for="">审核结果</label>
                                                <span>{{item.operResult}}</span>
                                                <label for="">期限时间</label>
                                                <span>{{item.deadlineDate}}</span>
                                                <label for="">审核意见</label>
                                                <span style="width: 567px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <label for="">备注</label>
                                                <span style="width: 996px;">{{item.operExplain}}</span>
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
                                                    <span style="width: 996px;">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 转单申请 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE23'">
                                                <div class="content">
                                                    <label for="">记录编号</label>
                                                    <span style="width: 996px;">{{item.workordersRecordId}}</span>
                                                </div>
                                            </template>

                                            <!-- 转单审核，受理ORDEROPERTYPE06，拒绝 ORDEROPERTYPE25 -->
                                            <template v-else-if="item.operTypeCode=='ORDEROPERTYPE24'||item.operTypeCode=='ORDEROPERTYPE25'">
                                                <div class="content">
                                                    <label for="">审核结果</label>
                                                    <span style="width:349px;">{{item.operResult}}</span>
                                                    <label for="">审核意见</label>
                                                    <span style="width: 567px;">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 工程量提报FACILITYOPERTYPE15，材料申请受理ORDEROPERTYPE21，材料申请拒绝ORDEROPERTYPE22 -->
                                            <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE15'||item.operTypeCode=='ORDEROPERTYPE21'||item.operTypeCode=='ORDEROPERTYPE22'">
                                                <div class="content">
                                                    <label for="">申请材料</label>
                                                    <span :title="item.materialRltList|materialShow" style="width:349px;">{{item.materialRltList|materialShow}}</span>
                                                    <label for="">备注</label>
                                                    <span style="width: 567px;">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name">
                                                        <div v-for="(item1,index) in item.fileInfoList" :key="index" class="file-single">
                                                            <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item1.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${item1.fileUrl}&token=${token}`:item1.fileUrl]" fit="fill"></el-image>
                                                            <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-doc" :href="item1.fileUrl"></a>
                                                            <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item1.fileName)" :title="item1.fileName" class="icon-file file-xls" :href="item1.fileUrl"></a>
                                                            <a v-else :title="item1.fileName" class="icon-file file-other" :href="item1.fileUrl"></a>
                                                        </div>
                                                    </span>
                                                </div>
                                            </template>

                                            <!-- 延期申请 -->
                                            <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE12'">
                                                <div class="content">
                                                    <!-- <label for="">申请期限</label>
                                                    <span>{{item.deadlineDate}}</span> -->
                                                    <label for="">申请天数</label>
                                                    <span style="width:349px;">{{item.score}}</span>
                                                    <label for="">延期原因</label>
                                                    <span style="width: 567px;">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 延期审核 -->
                                            <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE13'">
                                                <div class="content">
                                                    <label for="">审核结果</label>
                                                    <span>{{item.operResult}}</span>
                                                    <label for="">期限时间</label>
                                                    <span>{{item.deadlineDate}}</span>
                                                    <label for="">审核意见</label>
                                                    <span style="width: 567px;">{{item.operExplain}}</span>
                                                </div>
                                            </template>

                                            <!-- 到达 -->
                                            <template v-else-if="item.operTypeCode=='FACILITYOPERTYPE11'">
                                                <div class="content">
                                                    <label for="">备注</label>
                                                    <span style="width: 996px;">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name">
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
                                                    <span>{{item.operResult}}</span>
                                                    <!-- <label for="">故障类型</label>
                                                    <span>{{item.failureTypeName}}</span> -->
                                                    <label for="">故障原因</label>
                                                    <span>{{item.failureReason}}</span>
                                                    <label for="">结果反馈</label>
                                                    <span style="width: 566px;">{{item.operExplain}}</span>
                                                </div>
                                                <div class="content file-info">
                                                    <label for="">附件</label>
                                                    <span class="file-name">
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <label for="">确认结果</label>
                                                <span style="width:349px;">{{item.operResult}}</span>
                                                <!-- <label for="">反馈时间</label>
                                                <span>{{item.operDate}}</span> -->
                                                <label for="">确认意见</label>
                                                <span style="width: 567px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 验收 -->
                                <ul id="ys" class="sp-info accept-info" v-if="workordersInfo.workordersRecordMap.reviewList&&workordersInfo.workordersRecordMap.reviewList.length>0">
                                    <li class="confirm-normal" v-for="(item,index) in workordersInfo.workordersRecordMap.reviewList" :key="index">
                                        <div class="title">
                                            <label for="" class="title-name">{{item.operTypeName}}</label>
                                            <span class="title-date">{{item.operDate}}</span>
                                            <span class="title-person">{{item.operPerson}}</span>
                                        </div>
                                        <!-- 催办 -->
                                        <template v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                                            <div class="content">
                                                <label for="">催办原因</label>
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <label for="">确认结果</label>
                                                <span style="width:349px;">{{item.operResult}}</span>
                                                <!-- <label for="">反馈时间</label>
                                                <span>{{item.operDate}}</span> -->
                                                <label for="">确认意见</label>
                                                <span style="width: 567px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>
                                    </li>
                                </ul>
                                <!-- 评价(设施里不存在了) -->
                                <ul id="ys_aaaaaaaaaaaaaaa" class="sp-info assess-info" v-if="workordersInfo.workordersRecordMap.evaluateList&&workordersInfo.workordersRecordMap.evaluateList.length>0">
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
                                                <span style="width: 996px;">{{item.operExplain}}</span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="content">
                                                <template v-for="(res,rdx) in item.evalGradeList">
                                                    <label for="" :key="'lb'+rdx">{{res.evalItemName||res.evalExplain}}</label>
                                                    <span :key="'sp'+rdx">{{res.evalGrades}}星</span>
                                                </template>
                                                <label for="">意见</label>
                                                <span :title="item.operExplain" :style="(!item.evalGradeList)?'width:996px;':''">{{item.operExplain}}</span>
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
                                            <!-- "FACILITYOPERTYPE06","关闭"；"FACILITYOPERTYPE27","撤销" -->
                                            <label for="">{{item.operTypeCode=='FACILITYOPERTYPE27'?'撤销':'关闭'}}原因</label>
                                            <label for="">撤销原因</label>
                                            <span style="width: 349px;">{{item.operReasonName}}</span>
                                            <label for="">备注</label>
                                            <span style="width: 567px;">{{item.operExplain}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </el-scrollbar>
            </div>
            <template>
                <!-- 流程审核 -->
                <auditApply v-if="(prePage=='大队道管审核'&&(operatCode.indexOf('FACILITYOPERTYPE02Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE02N')>-1))" :data="workordersInfo" @callback="dataDetail" title="大队道管审核"></auditApply>
                <auditApply v-if="(prePage=='大队领导审核'&&(operatCode.indexOf('FACILITYOPERTYPE03Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE03N')>-1))" :data="workordersInfo" @callback="dataDetail" title="大队领导审核"></auditApply>
                <auditApply v-if="(prePage=='设施科审核'&&(operatCode.indexOf('FACILITYOPERTYPE04Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE04N')>-1))" :data="workordersInfo" @callback="dataDetail" title="设施科审核"></auditApply>
                <auditApply v-if="(prePage=='秩序处审核'&&(operatCode.indexOf('FACILITYOPERTYPE05Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE05N')>-1))" :data="workordersInfo" @callback="dataDetail" title="秩序处审核"></auditApply>
                <auditApply v-if="(prePage=='经理审核'&&(operatCode.indexOf('FACILITYOPERTYPE16Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE16N')>-1))" :data="workordersInfo" @callback="dataDetail" title="经理审核"></auditApply>
                <auditApply v-if="(prePage=='监理审核'&&(operatCode.indexOf('FACILITYOPERTYPE17Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE17N')>-1))" :data="workordersInfo" @callback="dataDetail" title="监理审核"></auditApply>
                <auditApply v-if="(prePage=='中队验收'&&(operatCode.indexOf('FACILITYOPERTYPE18Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE18N')>-1))" :data="workordersInfo" @callback="dataDetail" title="中队验收"></auditApply>
                <auditApply v-if="(prePage=='大队验收'&&(operatCode.indexOf('FACILITYOPERTYPE19Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE19N')>-1))" :data="workordersInfo" @callback="dataDetail" title="大队验收"></auditApply>
                <auditApply v-if="(prePage=='民警验收'&&(operatCode.indexOf('FACILITYOPERTYPE20Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE20N')>-1))" :data="workordersInfo" @callback="dataDetail" title="民警验收"></auditApply>
                <auditApply v-if="(prePage=='干部验收'&&(operatCode.indexOf('FACILITYOPERTYPE21Y')>-1 ||operatCode.indexOf('FACILITYOPERTYPE21N')>-1))" :data="workordersInfo" @callback="dataDetail" title="干部验收"></auditApply>
                <!-- 转单审核 -->
                <auditTransfer v-if="(prePage=='转单审核'&&$route.query.isread=='edit'&&workordersInfo.handleResult===null)" :data="workordersInfo" @callback="dataDetail" @updateTransfer="setTransferInfo"></auditTransfer>
                <!-- 反馈操作 "FACILITYOPERTYPE14", "反馈"； -->
                <feedback v-if="(prePage=='维修处置')&&((operatCode.indexOf('FACILITYOPERTYPE14')>-1))" :data="workordersInfo" @callback="dataDetail"></feedback>
                <!-- 材料提交 "FACILITYOPERTYPE15", "工程量提报"； -->
                <materialSubmit v-if="(prePage=='工程量提报')&&((operatCode.indexOf('FACILITYOPERTYPE15')>-1))" :data="workordersInfo" @callback="dataDetail"></materialSubmit>
                <!-- 确认操作 "ORDEROPERTYPE11", "确认通过"；"ORDEROPERTYPE12", "确认不通过"-->
                <confirm v-if="(prePage=='工单确认')&&((operatCode.indexOf('ORDEROPERTYPE11')>-1||operatCode.indexOf('ORDEROPERTYPE12')>-1))" :data="workordersInfo" @callback="dataDetail"></confirm>
                <!-- 延期审核操作 "FACILITYOPERTYPE13", "延期审核", isDefer -->
                <delay v-if="((prePage=='延期审核')&&((operatCode.indexOf('FACILITYOPERTYPE13')>-1)||(workordersInfo.isDefer&&$route.query.isread=='edit')))" :data="workordersInfo" @callback="dataDetail"></delay>
                <!-- 评价操作 "ORDEROPERTYPE10", "评价" -->
                <evaluate v-if="(prePage=='工单评价')&&(operatCode.indexOf('ORDEROPERTYPE10')>-1)" :data="workordersInfo" @callback="dataDetail"></evaluate>
                <!-- 下发操作 "FACILITYOPERTYPE08", "下发" -->
                <issue v-if="(prePage=='工单下发')&&(operatCode.indexOf('FACILITYOPERTYPE08')>-1)" :data="workordersInfo" @callback="dataDetail"></issue>
                <!-- 指派操作 "FACILITYOPERTYPE09", "指派"-->
                <assign v-if="(prePage=='工单指派')&&(operatCode.indexOf('FACILITYOPERTYPE09')>-1)" :data="workordersInfo" @callback="dataDetail"></assign>
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
        </div>
    </div>
</template>
<script>
    import feedback from "./sheetOperation/feedback";
    import confirm from "./sheetOperation/confirm";
    import delay from "./sheetOperation/delay";
    import evaluate from "./sheetOperation/evaluate";
    import issue from "./sheetOperation/issue";
    import assign from "./sheetOperation/assign";
    import auditApply from "./sheetOperation/auditApply";
    import auditTransfer from "./sheetOperation/auditTransfer";
    import materialSubmit from "./sheetOperation/materialSubmit";
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
            auditTransfer,
            materialSubmit,
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
                    arr.push(`${res.materialName || ''}${res.materialNum || ''}${res.materialUnit || ''}`);
                });
                return arr.join(",");
            },
            roadShow(list) {
                let arr = [];
                list = list || [];
                list.map(item => {
                    arr.push(`${item.roadName}(${item.beginCrossName}-${item.endCrossName})`);
                });
                return arr.join(',');
            }
        },
        data() {
            return {
                title: "工单详情",
                token: "",
                isShow: true,
                stepPosition: 'relative',
                activeIndex: '',
                workordersInfo: {
                    workordersId: '',
                    workordersRecordMap: {}
                },
                workordersStatusCode: '',
                operatCode: '',
                dispatchInfoLast: {},
                appointInfoLast: {},

                voiceList: [],
                imgFileList: [],
                otherFileList: [],
                cancelReasonCode: "",
                backoutReasonCode: "",

                dialogDelayVisible: false,
                dialogUrgeVisible: false,
                dialogRefuseVisible: false,
                dialogRevokeVisible: false,
                dialogBackoutVisible: false,
                dialogMaterialVisible: false,
                operExplain: "",
                operExplain4Cancel: "",
                operExplain4Backout: "",
                cancelReasonList: [],
                operRefuseExplain: "",
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
                if (newVal.path === oldVal.path && newVal.path === '/detsheetss') {
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
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/postponeWorkorders`, {
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
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
                if (this.workordersInfo.workordersId) {
                    obj.workordersId = this.workordersInfo.workordersId;
                    url = this.$config.efoms_HOST + '/workordersRecord/pressWorkorders';
                } else {
                    obj.repairsId = this.workordersInfo.repairsId;
                    url = this.$config.efoms_HOST + '/repairs/pressRepairsInfo';
                }

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
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/cancelWorkorders`, {
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
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
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/backoutWorkorders`, {
                        workordersId: this.workordersInfo.workordersId || this.workordersInfo.repairsId,
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
                // 下发拒绝  状态待指派 FACILITYSTATUS07，指派已拒绝 FACILITYSTATUS08
                // 指派拒绝  状态待维修 FACILITYSTATUS09
                let mturl = `${this.$config.efoms_HOST}/signsWorkordersRecord/handleAppoWorkorders`;
                switch (this.workordersStatusCode) {
                    case 'FACILITYSTATUS07':
                    case 'FACILITYSTATUS08':
                        mturl = `${this.$config.efoms_HOST}/signsWorkordersRecord/rejectDispWorkorders`;
                        break;
                    case 'FACILITYSTATUS09':
                        mturl = `${this.$config.efoms_HOST}/signsWorkordersRecord/handleAppoWorkorders`;
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
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
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
            showUrge() {
                this.dialogUrgeVisible = true;
            },
            async showDelay() {
                if (!(await this.stopOpertion())) return;
                this.dialogDelayVisible = true;
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
                    query: { transferId: this.workordersInfo.workordersId }
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
                        this.$api.get(`${this.$config.efoms_HOST}/SignsWorkordersInfo/getSignsWorkordersInfo`, { signsWorkordersId: this.$route.query.id }, { token: this.token })
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
                    this.materialList[this.materialListIndex].fileList.push({
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
                    this.materialList[parentIndex].fileList.splice(index, 1);
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
                    fileList: []
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
                this.$api.get(`${this.$config.efoms_HOST}/SignsWorkordersInfo/getSignsWorkordersInfo`, { signsWorkordersId: this.$route.query.id }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.workordersInfo = res.resultList || {};
                            this.workordersStatusCode = this.workordersInfo.workordersStatusCode || '';
                            let arr1 = this.workordersInfo.workordersRecordMap.dispatchList || [];
                            // 07有效类型
                            arr1 = arr1.filter(res => res.operResultCode === 'OPERRESULT07');
                            this.dispatchInfoLast = arr1.length > 0 ? arr1[arr1.length - 1] : {};
                            let arr2 = this.workordersInfo.workordersRecordMap.appointList || [];
                            arr2 = arr2.filter(res => res.operResultCode === 'OPERRESULT07');
                            this.appointInfoLast = arr2.length > 0 ? arr2[arr2.length - 1] : {};
                            // 工程量提报的材料
                            let arr3 = this.workordersInfo.workordersRecordMap.fackbackList || [];
                            for (let i = arr3.length - 1; i >= 0; i--) {
                                if (arr3[i].operTypeCode == 'FACILITYOPERTYPE15') {
                                    arr3[i].materialRltList = this.workordersInfo.listMaterialRlt || [];
                                    break;
                                }
                            }

                            let fileInfoList = this.workordersInfo.fileInfoList || [];
                            this.voiceList = [];
                            this.imgFileList = [];
                            this.otherFileList = [];
                            fileInfoList.forEach(item => {
                                if (/\.(mp3|wav|MP3|WAV)$/.test(item.fileName)) {
                                    this.voiceList.push(item);
                                } else if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)) {
                                    let fileUrl = item.fileUrl.replace('file/downloadFile?secondDir=', 'fileResource/');
                                    fileUrl = fileUrl.replace('&fileName=', '/');
                                    item.mappingAddress = fileUrl;

                                    if (this.$config.baseimgs) {
                                        this.imgFileList.push(`${this.$config.baseimgs}?path=${item.mappingAddress}&token=${this.token}`);
                                    } else {
                                        this.imgFileList.push(item.mappingAddress);
                                    }
                                } else {
                                    this.otherFileList.push(item);
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
            getTranferInfo() {
                this.workordersInfo = JSON.parse(sessionStorage.getItem('transferssInfo') || '{}');
                this.workordersStatusCode = this.workordersInfo.workordersStatusCode || '';

                let fileInfoList = this.workordersInfo.fileInfoList;
                this.voiceList = [];
                this.imgFileList = [];
                this.otherFileList = [];
                fileInfoList.forEach(item => {
                    if (/\.(mp3|wav|MP3|WAV)$/.test(item.fileName)) {
                        this.voiceList.push(item);
                    } else if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)) {
                        let fileUrl = item.fileUrl.replace('file/downloadFile?secondDir=', 'fileResource/');
                        fileUrl = fileUrl.replace('&fileName=', '/');
                        item.mappingAddress = fileUrl;

                        if (this.$config.baseimgs) {
                            this.imgFileList.push(`${this.$config.baseimgs}?path=${item.mappingAddress}&token=${this.token}`);
                        } else {
                            this.imgFileList.push(item.mappingAddress);
                        }
                    } else {
                        this.otherFileList.push(item);
                    }
                });
            },
            setTransferInfo(callbackData) {
                // 更新当前详情的信息，防止刷新时处理逻辑还是老的
                this.workordersInfo.handleResult = callbackData;
                sessionStorage.setItem('transferssInfo', JSON.stringify(this.workordersInfo));
            },
            getNextStep() {
                if (this.$route.query.isread != 'edit') {
                    return;
                }
                this.$api.putByQs(`${this.$config.efoms_HOST}/signsWorkordersRecord/getNextProcess`, {
                        workordersId: this.workordersInfo.signsWorkordersId
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
                // this.workordersId.workordersRecordMap = {};

                var obj = JSON.parse(sessionStorage.getItem('transferssInfo') || '{}');
                if (this.$route.query.pre == '转单审核' && obj.handleResult != '1') {
                    this.getTranferInfo();
                } else {
                    this.dataDetail();
                }
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
                        let t7 = document.querySelector('#ys') ? document.querySelector('#ys').offsetTop : -1;
                        let t8 = document.querySelector('#cx') ? document.querySelector('#cx').offsetTop : -1;
                        if (t8 >= 0 && scrollbarEl.scrollTop >= t8) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'cx';
                        } else if (t7 >= 0 && scrollbarEl.scrollTop >= t7) {
                            _this.stepPosition = 'fixed';
                            _this.activeIndex = 'ys';
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

    .ej-main {
        .ej-content-title {
            .title-box {
                display: flex;

                .pos-step {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    margin-left: 20px;

                    li {
                        cursor: pointer;
                        border: 1px solid #c0c4cc;
                        padding: 1px 3px;
                        border-radius: 3px;
                        color: #c0c4cc;
                        margin-right: 10px;
                        position: relative;
                        background: #fff;
                        z-index: 2;

                        &::before {
                            content: "";
                            display: block;
                            position: absolute;
                            width: 10px;
                            height: 1px;
                            background: #c0c4cc;
                            z-index: 1;
                            top: 50%;
                            right: -11px;
                        }

                        &:last-child {
                            &::before {
                                display: none;
                            }
                        }

                        &.active,
                        &:hover {
                            color: #00c187;
                            border-color: #00c187;
                        }
                    }
                }
            }
        }

        .ej-content-title-btn {
            background: rgba(255, 255, 255, 0.09);
            border: 1px solid;
            border-radius: 2px;
            width: 44px;
            height: 20px;
            text-align: center;
            margin-top: 10px;
            margin-right: 14px;
            line-height: 18px;
            cursor: pointer;
            display: inline-block;

            &.ej-content-green {
                background: #00c187;
                border-color: #00c187;
            }

            &.ej-content-yellow {
                background: #d89d00;
                border-color: #d89d00;
            }

            &.ej-content-black {
                background: rgba(255, 255, 255, 0.09);
                border-color: #4f5a64;

                p {
                    font-size: 12px;
                    color: #4f5a64;
                }
            }

            p {
                font-size: 12px;
                color: #ffffff;
            }
        }
    }

    .base-info {
        border-radius: 2px;
        margin-bottom: 0;

        .content {
            padding-left: 36px;
            padding-right: 36px;
            padding-bottom: 0;
            background: #f7fcfb;
            border: 1px solid #c3e6d9;
            border-radius: 2px;

            label {
                color: #737e84;
                width: 72px;
            }

            span {
                color: #4f5a64;
            }
        }
    }

    .step-scroll {
        display: flex;
        padding-top: 10px;

        .step-left {
            // width: 70px;
            width: 0;
            box-sizing: border-box;
            // padding-left: 10px;
            overflow: hidden;

            .pos-step {
                &.fixed {
                    position: fixed;
                    top: 98px;
                    display: none;
                }
            }

            /deep/ .el-step {
                cursor: pointer;

                &.active,
                &:hover {
                    .el-step__icon {
                        &.is-text {
                            border-color: #00c187;
                        }

                        color: #00c187;
                    }

                    .el-step__title {
                        color: #00c187;
                    }
                }

                .el-step__icon {
                    &.is-text {
                        border-width: 1px;
                    }

                    font-size: 12px;
                    width: 20px;
                    height: 20px;
                }

                .el-step__title {
                    font-size: 14px;
                }

                &.is-vertical .el-step__line {
                    left: 9px;
                    top: 2px;
                    bottom: -2px;
                }

                .el-step__main {
                    padding-left: 4px;
                }
            }
        }

        .step-right {
            flex: 1;
            overflow: hidden;
        }
    }

    .depiction-info {
        margin: 0 14px 0 32px;
        background: transparent;
        border: none;
        border-left: 1px solid #00c187;

        ul {
            position: relative;
            margin-left: 29px;
            margin-bottom: 10px;
            background: #ffffff;
            border: 1px solid #e6ecea;
            border-radius: 1px;
            padding-bottom: 20px;

            &::before {
                content: "";
                position: absolute;
                display: inline-block;
                width: 36px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: #00c187;
                border-radius: 5px;
                font-size: 12px;
                color: #ffffff;
                left: -48px;
                top: 50%;
                transform: translateY(-50%);
            }

            &.iss-info {
                &::before {
                    content: "\4e0b\53d1";
                    // 文字的Unicode编码，去掉\u开头的u，不区分大小写
                }
            }

            &.asgn-info {
                &::before {
                    content: "\6307\6d3e";
                }
            }

            &.urge-info {
                &::before {
                    content: "\50AC\529E";
                }

                // .content .urge-reason {
                //     width: 996px;
                // }
            }

            &.feedback-info {
                &::before {
                    content: "\53CD\9988";
                }

                &.postpone-info {
                    &::before {
                        content: "\5ef6\671f";
                    }
                }

                &.transfer-info {
                    &::before {
                        content: "\8f6c\5355";
                    }
                }

                &.material-info {
                    &::before {
                        content: "\6750\6599";
                    }
                }

                // .content .feedback-result {
                //     width: 351px;
                // }

                .content.file-info {
                    border-top: 0;

                    .file-name {
                        width: 996px;
                        display: flex;
                        align-items: center;

                        .file-single {
                            margin-right: 10px;

                            /deep/ .el-image {
                                width: 20px;
                                height: 20px;
                                display: block;
                            }

                            .icon-file {
                                width: 20px;
                                height: 20px;

                                &.file-doc {
                                    background: url("../../assets/images/file-word.png") no-repeat center/24px;
                                }

                                &.file-xls {
                                    background: url("../../assets/images/file-execl.png") no-repeat center/24px;
                                }

                                &.file-other {
                                    background: url("../../assets/images/file-file.png") no-repeat center/24px;
                                }
                            }
                        }
                    }

                    a {
                        float: left;
                        color: #4f5a64;
                    }
                }

                // .feedback-defer .defer-date {
                //     width: 567px;
                // }
            }

            &.accept-info {
                &::before {
                    content: "\9a8c\6536";
                }
            }

            &.confirm-info {
                &::before {
                    content: "\786E\8BA4";
                }
            }

            &.assess-info {
                &::before {
                    content: "\8BC4\4EF7";
                }
            }

            &.revoke-info {
                &::before {
                    content: "\5173\95ed";
                }

                // .content .revoke-record {
                //     width: 996px;
                // }
            }

            &.examine-info {
                &::before {
                    content: "\5BA1\6838";
                }
            }

            &.apply-info {
                &::before {
                    content: "\7533\8bf7";
                }
            }

            li {
                width: 100%;
                overflow: hidden;

                .title {
                    margin: 10px 34px 11px 26px;
                    height: auto;
                    border: none;

                    &::before {
                        content: "";
                        position: relative;
                        left: -26px;
                        top: 2px;
                        border-left: 2px solid #00c187;
                        display: inline-block;
                        height: 15px;
                    }

                    .title-name {
                        font-size: 12px;
                        color: #1a2023;
                    }

                    span {
                        font-size: 12px;
                        color: #b9bfc2;
                    }
                }

                .content {
                    // height: 25px;
                    margin-left: 26px;
                    padding: 0;
                    display: flex;
                    min-width: 1100px;

                    label {
                        background: #f4f8f7;
                        border: 1px solid #e4ebe9;
                        border-right: none;
                        font-size: 12px;
                        width: 80px;
                        // height: 27px;
                        display: block;
                        line-height: 25px;
                        text-align: center;
                        color: #737e84;
                        margin: 0;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    span {
                        background: #ffffff;
                        border: 1px solid #e4ebe9;
                        border-right: none;
                        font-size: 12px;
                        width: 135px;
                        // height: 27px;
                        display: block;
                        line-height: 25px;
                        text-align: left;
                        color: #4f5a64;
                        padding-left: 7px;
                        // overflow: hidden;
                        // white-space: nowrap;
                        // text-overflow: ellipsis;
                        line-height: 16px;
                        padding: 5px 0 5px 7px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;

                        &:last-child {
                            border-right: 1px solid #e4ebe9;
                        }
                    }

                    &+.content {

                        label,
                        span {
                            border-top: none;
                        }
                    }
                }
            }
        }

        // .confirm-info {
        //     .confirm-normal .normal-suggest {
        //         width: 567px;
        //     }

        //     .confirm-other .other-suggest {
        //         width: 773px;
        //     }
        // }

        // .examine-info .content .examine-suggest {
        //     width: 558px;
        // }
    }
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