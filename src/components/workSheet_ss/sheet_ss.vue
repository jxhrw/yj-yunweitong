<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" :typeTableData="typeTableData" :multipleSelection.sync="multipleSelection" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn" v-if="$route.query.type=='0'">
                <div class="ej-content-goto" @click="gotoEqpm">
                    <p>创建工单</p>
                </div>
            </template>
            <template slot="pageBtn" v-if="$route.query.hasBack=='1'">
                <div class="ej-content-black" @click="()=>{$router.go(-1)}">
                    <p>返回</p>
                </div>
            </template>


            <template slot="condFirst">
                <el-col :span="7">
                    <label>模糊查询</label>
                    <el-input v-model="key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>申报时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7" v-show="title!='工单查询'&&title!='维修申报'">
                    <label>查询类型</label>
                    <mInput :list="typeList" :code.sync="typeCode" :name.sync="typeName" :clearable="false" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7" v-show="title=='工单查询'||title=='维修申报'">
                    <label>当前状态</label>
                    <mSelectMult :list="stateList" :code.sync="stateCode" :name.sync="stateName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7" v-if="title!='维修申报'">
                    <label>申报人员</label>
                    <el-input v-model="person" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <!-- <el-col :span="7">
                    <label>申报编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable></el-input>
                </el-col> -->
                <el-col :span="7">
                    <label>申报部门</label>
                    <mSelectMult :list="departList" :code.sync="departCode" :name.sync="departName" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>申报来源</label>
                    <mSelectMult :list="sourceList" :code.sync="sourceCode" :name.sync="sourceName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属区域</label>
                    <mSelectMult :list="regionList" :code.sync="regionCode" :name.sync="regionName" showAttr="regionName" getAttr="regionId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属系统</label>
                    <mSelectMult :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <!-- <el-col :span="7">
                    <label>维修类型</label>
                    <mInput :list="reptypeList" :code.sync="reptypeCode" :name.sync="reptypeName"></mInput>
                </el-col> -->
            </template>

            <template slot="tableBtn">
                <div v-if="listUrl.download" class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
                <!-- 撤销：下发列表待撤销状态 -->
                <!-- <div v-if="title=='工单下发'&&typeCode=='0'" class="operation revoke" @click="showRevoke">
                    <p>撤销</p>
                </div> -->
                <!-- 拒绝： 指派列表待指派+维修处置新工单 -->
                <!-- <div v-if="(title=='工单指派'&&typeCode=='0')||(title=='维修处置'&&typeCode=='0')" class="operation revoke" @click="showRefuse">
                    <p>拒绝</p>
                </div>
                <div v-if="(title=='工单下发')||(title=='工单指派')" class="operation urge" @click="showUrge">
                    <p>催办</p>
                </div> -->
            </template>

            <template slot="table">
                <el-table v-show="tableShowType==1" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <!-- <el-table-column prop="workordersId" label="申报编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersId||scope.row.repairsId}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="repSourceName" label="申报来源" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人员" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column> -->
                    <!-- <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column> -->
                    <!-- <el-table-column prop="devAreaName" label="管理辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理辖区')>-1"></el-table-column> -->
                    <el-table-column prop="workordersStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions" @onOtherEvent="materialDetail"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="table">
                <el-table v-show="tableShowType==2" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <!-- <el-table-column prop="workordersId" label="申报编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersId||scope.row.repairsId}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="oppmDeptName" label="维护单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deadlineTime" label="原定完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="aaa" label="申请完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="aaa" label="延期理由" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="devAreaName" label="管理辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理辖区')>-1"></el-table-column> -->
                    <el-table-column prop="workordersStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions" @onOtherEvent="materialDetail"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="table">
                <el-table v-show="tableShowType==3" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <!-- <el-table-column prop="workordersId" label="申报编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersId||scope.row.repairsId}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="repSourceName" label="申报来源" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人员" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column> -->
                    <!-- <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="deadlineTime" label="期限完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="devAreaName" label="管理辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理辖区')>-1"></el-table-column> -->
                    <el-table-column prop="workordersStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions" @onOtherEvent="materialDetail"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="table">
                <el-table v-show="tableShowType==4" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <!-- <el-table-column prop="workordersId" label="申报编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersId||scope.row.repairsId}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="repSourceName" label="申报来源" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="oppmDeptName" label="维护单位" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="aaaa" label="下发时间" show-overflow-tooltip min-width="120"></el-table-column> -->
                    <el-table-column prop="updateDate" label="完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="devAreaName" label="管理辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理辖区')>-1"></el-table-column> -->
                    <el-table-column prop="workordersStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions" @onOtherEvent="materialDetail"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="dialog">
                <el-dialog title="工单催办" :visible.sync="dialogUrgeVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <label class="dialog-label">催办原因</label>
                        <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operExplain" class="dialog-textarea">
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
                            <label class="dialog-label">备注</label>
                            <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operRefuseExplain" class="dialog-textarea">
                            </el-input>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handleWorkorders" size='mini' class="submit">提 交</el-button>
                        <el-button @click="dialogRefuseVisible = false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="转单审核" :visible.sync="dialogTransferVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <div class="revoke-reason">
                            <label class="dialog-label">备注</label>
                            <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operTransferExplain" class="dialog-textarea">
                            </el-input>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handleTransfer(1)" size='mini' class="submit">通 过</el-button>
                        <el-button @click="handleTransfer(0)" size='mini' class="cancel">不通过</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="材料审核" :visible.sync="dialogMaterialVisible" width='700px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>材料列表</label>
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
                                            <!-- <el-input v-model="item.materialName" size='mini' class="content-select mtl1" clearable></el-input>
                                            <el-input v-model="item.materialNum" size='mini' class="content-select mtl2" clearable></el-input>
                                            <el-input v-model="item.materialUnit" size='mini' class="content-select mtl3" clearable></el-input> -->
                                            <mInput :list="materialDic" :code.sync="item.materialCode" :name.sync="item.materialName" class="content-select mtl1"></mInput>
                                            <el-input v-model="item.materialNum" size='mini' class="content-select mtl2" clearable></el-input>
                                            <mInput :list="materialDUnit" :code.sync="item.materialUnit" :name.sync="item.materialUnit" class="content-select mtl3"></mInput>

                                            <div class="mtl5" v-if="item.fileList && item.fileList.length>0">
                                                <template v-for="(res,ix) in item.fileList">
                                                    <div class="ms-files" :key="ix">
                                                        <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${this.token}`:res.fileURL" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${this.token}`:res.fileURL]" fit="fill"></el-image>
                                                        <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-doc"></div>
                                                        <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-xls"></div>
                                                        <div v-else :title="res.fileName" class="icon-file file-other"></div>

                                                        <span class="ms-actions">
                                                            <span class="ms-delete" @click="handleDownload(res)">下载</span>
                                                            <span class="ms-delete" @click="handleRemove(res,ix,'',index)">删除</span>
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
                            <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operMaterialExplain" class="dialog-textarea height100">
                            </el-input>
                        </div>
                        <!-- <div>
                            <label class="dialog-label">附件</label>
                            <div class="upload-demo">

                                <template v-for="(item,index) in materialOldFiles">
                                    <div class="ms-files" :key="'old'+index">
                                        <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)" :src="item.fileUrl" :preview-src-list="[item.fileUrl]"></el-image>
                                        <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-doc"></div>
                                        <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-xls"></div>
                                        <div v-else :title="item.fileName" class="icon-file file-other"></div>

                                        <span class="ms-actions">
                                            <span class="ms-delete" @click="handleDownload(item)">下载</span>
                                            <span class="ms-delete" @click="handleRemove(item,index,'old')">删除</span>
                                        </span>
                                    </div>
                                </template>
                                <template v-for="(item,index) in materialFiles">
                                    <div class="ms-files" :key="'new'+index">
                                        <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileOldName)" :src="item.downloadPath" :preview-src-list="[item.downloadPath]"></el-image>
                                        <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item.fileOldName)" :title="item.fileOldName" class="icon-file file-doc"></div>
                                        <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item.fileOldName)" :title="item.fileOldName" class="icon-file file-xls"></div>
                                        <div v-else :title="item.fileOldName" class="icon-file file-other"></div>

                                        <span class="ms-actions">
                                            <span class="ms-delete" @click="handleDownload(item)">下载</span>
                                            <span class="ms-delete" @click="handleRemove(item,index,'new')">删除</span>
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
                        <el-button type="primary" @click="submitMaterial('1')" size='mini' class="submit">通 过</el-button>
                        <el-button @click="submitMaterial('0')" size='mini' class="cancel">不通过</el-button>
                    </div>
                </el-dialog>
            </template>
        </WkLayout>
    </div>
</template>
<script>
    import WkLayout from "components/common/wklayout";
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    import TableOpertion from "./sheetOperation/tableOpertion.vue";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        components: {
            WkLayout,
            mInput,
            TableOpertion,
            mSelectMult
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === '/sheet') {
                    if (newVal.path === oldVal.path) {
                        this.initPage();
                    }
                    if (newVal.path != oldVal.path && newVal.query.type != sessionStorage.getItem('sheetPageType')) {
                        this.initPage();
                    }
                    // if (newVal.path != oldVal.path && newVal.query.devId) {
                    //     this.initPage();
                    // }
                    sessionStorage.setItem('sheetPageType', newVal.query.type);
                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                listUrl: {},
                key: "",
                times: "",
                person: "",
                declareId: "",

                departCode: [],
                departName: [],
                departList: [],
                sourceCode: [],
                sourceName: [],
                sourceList: [],
                regionCode: [],
                regionName: [],
                regionList: [],
                systemCode: [],
                systemName: [],
                systemList: [],
                reptypeCode: "",
                reptypeName: "",
                reptypeList: [],
                stateCode: [],
                stateName: [],
                stateList: [],

                typeCode: '',
                typeName: '',
                typeList: [],

                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                tableShowType: 0, // 0 基础，1大众，2延期查询，3维修处置，4确认+评价
                typeTableData: [],
                // typeTableData: [{ "name": "管理辖区" }, { "name": "维修类型" }],
                multipleSelection: [], // 选中需显示的内容
                detailInfo: {},
                dialogUrgeVisible: false, // 催办
                operExplain: [],
                dialogRevokeVisible: false, //撤销
                cancelReasonCode: '',
                cancelReasonList: [],
                operExplain4Cancel: '',
                dialogRefuseVisible: false, // 拒绝
                operRefuseExplain: '',
                dialogTransferVisible: false, // 转单审核
                operTransferExplain: '',
                dialogMaterialVisible: false, // 材料审核
                materialDic: [], //材料字典
                materialDUnit: [],
                materialList: [], //材料清单
                materialListIndex: -1, // 当前处理材料列表的索引（关联附件）
                operMaterialExplain: '',
                materialFiles: [], // 新增的附件
                materialOldFiles: [], // 申请传来的附件
                isAjaxing: false,
                source: null
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                };
                if (this.title == '维修申报' || this.title == '工单查询' || this.title == '停用查询') {
                    let obj = {
                        key: this.key,
                        repStartDate: this.times ? this.times[0] : "",
                        repEndDate: this.times ? this.times[1] : "",
                        workordersStatusCode: this.title == '停用查询' ? 'ORDERSSTATUS08' : this.stateCode.join(","),
                        repPersonName: this.person,
                        // workordersId: this.declareId,
                        // devDeptId: this.departCode.join(","),
                        repDeptIds: this.departCode.join(","),
                        repSourceCode: this.sourceCode.join(","),
                        devAreaCode: this.regionCode.join(","),
                        devTypeCode: this.systemCode.join(","),
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '转单审核' || this.title == '转单查询') {
                    let obj = {
                        type: this.typeCode,
                        keyWord: this.key,
                        startTime: this.times ? this.times[0] : "",
                        endTime: this.times ? this.times[1] : "",
                        applyPersonName: this.person,
                        applyDeptId: this.departCode.join(","),
                        repSourceCode: this.sourceCode.join(","),
                        deviceArea: this.regionCode.join(","),
                        deviceType: this.systemCode.join(","),
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '点位校准') {
                    let obj = {
                        deviceId: this.key,
                        startTime: this.times ? this.times[0] : "",
                        endTime: this.times ? this.times[1] : "",
                        deviceTypeCode: this.systemCode.join(","),
                        dealResult: this.typeCode
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else {
                    let obj = {
                        type: this.typeCode,
                        keyWord: this.key,
                        startTime: this.times ? this.times[0] : "",
                        endTime: this.times ? this.times[1] : "",
                        applyPersonName: this.person,
                        applyDeptId: this.departCode.join(","),
                        repSourceCode: this.sourceCode.join(","),
                        deviceArea: this.regionCode.join(","),
                        deviceType: this.systemCode.join(","),

                        // devTypeCode: this.systemCode.join(","),
                        // workorderId: this.declareId,
                        workordersStatusCode: this.stateCode.join(",")
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                }
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                // this.tableData = [];
                this.source = this.$api.CancelToken.source(); // 这里初始化source对象
                this.isTableLoading = true;
                this.$api.get(this.listUrl.table, this.queryConditions, { token: this.token }, this.source.token)
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result || [];
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        if (err && err.message && err.message == '主动取消') {
                            console.log(err.message);
                        } else {
                            this.isTableLoading = false;
                            Common.printErrorLog(err);
                        }
                    });
            },
            gotoEqpm() {
                sessionStorage.setItem('detrepssSave', '0'); // 详情页数据清空
                this.$router.push({
                    path: "/detrepss",
                    query: {}
                });
            },
            exportExcel() {
                let method = this.listUrl.download;
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.get(method, obj, { token: this.token })
                    .then(res => {
                        window.open(res.path + '&token=' + this.token);
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            showRevoke() {
                if (!this.detailInfo.workordersId) {
                    return this.$message.error("请先选择一条数据");
                }
                this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { "parentCode": "CANCELREASON" }).then(res => {
                    if (res.appCode == 0) {
                        this.cancelReasonList = res.resultList;
                    }
                });
                this.dialogRevokeVisible = true;
            },
            showRefuse() {
                if (!this.detailInfo.workordersId) {
                    return this.$message.error("请先选择一条数据");
                }
                this.dialogRefuseVisible = true;
            },
            showUrge() {
                if (!this.detailInfo.workordersId) {
                    return this.$message.error("请先选择一条数据");
                }
                this.dialogUrgeVisible = true;
            },
            currentSelect(e) {
                this.detailInfo = e || {};
            },
            pressWorkorders() {
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    token: this.token
                };
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersRecord/pressWorkorders`, {
                        workordersId: this.detailInfo.workordersId,
                        operExplain: this.operExplain
                    }, header)
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功")
                            this.dialogUrgeVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            cancelWorkorders() {
                if (this.cancelReasonCode == "") {
                    return Common.ejMessage("warining", "请选择撤销原因");
                }
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    token: this.token
                };
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersRecord/cancelWorkorders`, {
                        workordersId: this.detailInfo.workordersId,
                        operExplain: this.operExplain4Cancel,
                        operReasonCode: this.cancelReasonCode
                    }, header)
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.dialogRevokeVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 拒绝
            handleWorkorders() {
                // 下发拒绝 handleAppoWorkorders 状态待指派 ORDERSSTATUS11
                // 指派拒绝 handleDispWorkorders 状态待维修 ORDERSSTATUS02
                let mturl = '';
                switch (this.detailInfo.workordersStatusCode) {
                    case 'ORDERSSTATUS11':
                        mturl = `${this.$config.efoms_HOST}/workordersRecord/handleDispWorkorders`;
                        break;
                    case 'ORDERSSTATUS02':
                        mturl = `${this.$config.efoms_HOST}/workordersRecord/handleAppoWorkorders`;
                        break;
                    default:
                        break;
                }
                if (mturl == '') {
                    this.$message.error("状态不正确无法进行拒绝操作");
                    return;
                }
                this.$api.putByQs(mturl, {
                        workordersId: this.detailInfo.workordersId,
                        isHandle: 0, //1为受理，0为拒绝
                        operExplain: this.operRefuseExplain
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.dialogRefuseVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 转单审核
            handleTransfer(isPass) {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                let obj = {
                    workorderId: this.detailInfo.transferId,
                    dealResult: isPass,
                    applyWorkorderId: this.detailInfo.workordersId,
                    operExplain: this.operTransferExplain
                };
                this.isAjaxing = true;
                this.$api.get(`${this.$config.efoms_HOST}/workorders/opr/dealTransfer`, obj, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.dialogTransferVisible = false;
                            this.searchPageInfo();
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
            submitMaterial(isPass) {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}/workorders/opr/dealMaterial`, {
                        workordersId: this.detailInfo.workordersId,
                        applyRecordId: this.detailInfo.workordersRecordId,
                        dealResult: isPass,
                        materialList: this.materialList,
                        fileList: [...this.materialOldFiles, ...this.materialFiles],
                        operExplain: this.operMaterialExplain
                    }, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.dialogMaterialVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            dataDetail(item, type) {
                if (type == 'edit') {
                    sessionStorage.setItem('relaodPage', '1');
                }
                if (item.workordersId) {
                    if (this.title == '转单审核') {
                        sessionStorage.setItem('transferInfo', JSON.stringify(item));
                    }
                    this.$router.push({
                        path: "/detsheet",
                        query: { pre: this.title, id: item.workordersId, isread: type }
                    });
                } else {
                    this.$router.push({
                        path: "/detsheet",
                        query: { pre: this.title, id: item.repairsId, isread: type, type: 'optimize' }
                    });
                }
            },
            transferDetail(item) {
                this.detailInfo = item || {};
                this.operTransferExplain = '';
                this.dialogTransferVisible = true;
            },
            materialDetail(item) {
                this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { "parentCode": "DEVMATERTYPE" }).then(res => {
                    if (res.appCode == 0) {
                        this.materialDic = res.resultList;
                        this.materialDUnit = [{ dicCode: '个', dicName: '个' }, { dicCode: '台', dicName: '台' }];
                    }
                });
                this.dialogMaterialVisible = true;
                this.detailInfo = item || {};
                this.operMaterialExplain = item.operExplain || '';
                this.materialOldFiles = item.fileInfoList || [];
                this.materialFiles = [];

                let abc = item.materialRltList || [];
                let arr = [];
                abc.map(res => {
                    arr.push({});
                });
                this.materialList = arr; // 先把材料的数量对应的dom加载出来
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.materialList = abc; // dom加载完成后再赋值数据才能渲染成功
                    })
                });
            },
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
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
                        fileMode: res.fileOldName
                            .slice(res.fileOldName.lastIndexOf(".") + 1)
                            .toLowerCase()
                    });
                }
            },
            handleSuccessList(response, file, fileList) {
                console.log(response);
                if (response.appCode == '0') {
                    let res = response.resultList || {};
                    this.materialList[this.materialListIndex].fileList = this.materialList[this.materialListIndex].fileList || [];
                    this.materialList[this.materialListIndex].fileList.push({
                        secondDir: res.secondDir,
                        fileName: res.fileName,
                        fileOldName: res.fileOldName,
                        fileURL: res.downloadPath,
                        fileMode: res.fileOldName
                            .slice(res.fileOldName.lastIndexOf(".") + 1)
                            .toLowerCase()
                    });
                }
            },
            handleRemove(e, index, source, parentIndex) {
                if (parseInt(parentIndex) == parentIndex) {
                    this.materialList[parentIndex].fileList.splice(index, 1);
                } else {
                    if (source == 'old') {
                        this.materialOldFiles.splice(index, 1);
                    } else {
                        index += this.materialOldFiles.length; // 需要算上上一个的数组的长度
                        this.materialFiles.splice(index, 1);
                    }
                }

                this.$api.delete(`${this.$config.efoms_HOST}/file/deleteFile`, {
                        token: this.token,
                        secondDir: e.secondDir || e.fileId,
                        fileName: e.fileName
                    }, { "Content-Type": "application/x-www-form-urlencoded" })
                    .then(res => {
                        if (res.appCode == 0) {} else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            handleDownload(e) {
                window.location.href = e.downloadPath || e.fileUrl;
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
            // 页面初始化
            initPage() {
                this.key = "";
                this.times = "";
                this.person = "";
                this.declareId = "";
                this.departCode = [];
                this.departName = [];
                this.sourceCode = [];
                this.sourceName = [];
                this.regionCode = [];
                this.regionName = [];
                this.systemCode = [];
                this.systemName = [];
                this.reptypeCode = "";
                this.reptypeName = "";
                this.stateCode = [];
                this.stateName = [];
                this.queryConditions = {};
                this.multipleSelection = [];
                this.tableData = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");
                this.typeCode = '';
                this.typeName = '';
                this.typeList = [];
                this.tableShowType = 0;

                this.listUrl.download = '';
                let pageType = this.$route.query.type;
                switch (pageType) {
                    case '0':
                        this.tableShowType = 1;
                        this.title = '维修申报';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorders/selectMyWorkordersPage`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        break;
                    case '1':
                        this.tableShowType = 1;
                        this.title = '科室审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/kssh`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '2':
                        this.tableShowType = 1;
                        this.title = '处室审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/cssh`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '3':
                        this.tableShowType = 1;
                        this.title = '转单审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/transfer`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportZDCX`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '4':
                        this.tableShowType = 1;
                        this.title = '延期审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/postpone`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportYQGD`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '5':
                        this.tableShowType = 1;
                        this.title = '工单下发';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/send`;
                        this.typeList = [{ dicCode: '0', dicName: '待下发' }, { dicCode: '1', dicName: '被退回' }, { dicCode: '2', dicName: '已下发' }, { dicCode: '3', dicName: '已催办' }, { dicCode: '4', dicName: '超时' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '6':
                        this.tableShowType = 1;
                        this.title = '工单指派';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/dispatch`;
                        this.typeList = [{ dicCode: '0', dicName: '待指派' }, { dicCode: '1', dicName: '被退回' }, { dicCode: '2', dicName: '已指派' }, { dicCode: '3', dicName: '已催办' }, { dicCode: '4', dicName: '超时' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '7':
                        this.tableShowType = 1;
                        this.title = '工单查询';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorders/getWorkordersInfoPage`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportGDSSCX`;
                        if (this.$route.query.devId) {
                            this.key = this.$route.query.devId;
                        }
                        break;
                    case '8':
                        this.tableShowType = 2;
                        this.title = '延期查询';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/postpone`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportYQGD`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '9':
                        this.tableShowType = 1;
                        this.title = '转单查询';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/transfer`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportZDCX`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '10':
                        this.tableShowType = 1;
                        this.title = '停用查询';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorders/getWorkordersInfoPage`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportTYGD`;
                        break;
                    case '11':
                        this.tableShowType = 3;
                        this.title = '维修处置';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/deal`;
                        this.typeList = [{ dicCode: '0', dicName: '新工单' }, { dicCode: '1', dicName: '待处理' }, { dicCode: '2', dicName: '已催办' }, { dicCode: '3', dicName: '超时' }, { dicCode: '4', dicName: '已修复' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '12':
                        this.tableShowType = 4;
                        this.title = '工单确认';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/confirm`;
                        this.typeList = [{ dicCode: '0', dicName: '待确认' }, { dicCode: '1', dicName: '已确认' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '13':
                        this.tableShowType = 4;
                        this.title = '工单评价';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/score`;
                        this.typeList = [{ dicCode: '0', dicName: '待评价' }, { dicCode: '1', dicName: '已评价' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '14':
                        this.tableShowType = 3;
                        this.title = '超期工单';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/exception`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportCQGD`;
                        this.typeList = [{ dicCode: '0', dicName: '已超期' }, { dicCode: '1', dicName: '已撤销' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '21':
                        this.tableShowType = 1;
                        this.title = '材料审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/material`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '22':
                        this.tableShowType = 1;
                        this.title = '点位校准';
                        this.listUrl.table = `${this.$config.efoms_HOST}/deviceConfirm/pageDeviceConfirm`;
                        this.typeList = [{ dicCode: '0', dicName: '未处理' }, { dicCode: '1', dicName: '已处理' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    default:
                        break;
                }

                //维修类型
                // if (pageType == '0') {
                //     this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }];
                // } else {
                //     this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }];
                // }

                if (this.source) {
                    this.source.cancel('主动取消'); //这里你可以输出一些信息，可以在catch中拿到
                }

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            //申报部门(交警部门+维护单位)
            let a1 = this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {});
            let a2 = this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, {});
            Promise.all([a1, a2]).then(res => {
                let arr0 = res[0].resultList || [];
                let arr1 = res[1].resultList || [];
                arr1.map(item => {
                    item.deptId = item.opsDeptId;
                    item.deptName = item.opsDeptName;
                });
                this.departList = [...arr0, ...arr1];
            });
            // this.getDicInfo(
            //     `${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {}
            // ).then(res => {
            //     this.departList = res.resultList || [];
            // });
            //申报来源
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPAIRSSOURCE"
            }).then(res => {
                this.sourceList = res.resultList || [];
            });
            //所属区域
            this.getDicInfo(
                `${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}
            ).then(res => {
                this.regionList = res.resultList || [];
            });
            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPDEVCATEGORY01"
            }).then(res => {
                this.systemList = res.resultList || [];
            });
            //当前状态
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "ORDERSSTATUS"
            }).then(res => {
                this.stateList = res.resultList || [];
            });
        },
        activated() {
            if (!this.$route.meta.isUseCache) {
                console.log('新');
                sessionStorage.setItem('relaodPage', '0');
                this.initPage();
            } else {
                console.log('旧');

                // 回到列表，如果回到的不是同一个列表则需要刷新
                // 根据是否点击菜单判断
                if (sessionStorage.getItem('menuSeclect') === '1') {
                    sessionStorage.setItem('menuSeclect', '0');
                    this.initPage();
                }

                // 点击编辑去的详情回来列表要刷新
                else if (sessionStorage.getItem('relaodPage') == '1') {
                    sessionStorage.setItem('relaodPage', '0');
                    this.searchPageInfo();
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name == 'detsheet' || to.name == 'detrepss') {
                from.meta.isUseCache = true;
                sessionStorage.setItem('menuSeclect', '0');
            } else {
                from.meta.isUseCache = false;
            }
            next();
        },
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/less/baseInfo.less";
    @import "../../assets/less/depiction.less";
    @import "../../assets/less/list.less";
    @import "../../assets/less/dialog.less";

    .base-info {
        border-top: 1px solid #e4eaee;
        border-radius: 2px;
    }

    .depiction-info .content {
        padding-bottom: 20px;
    }

    .relative {
        position: relative;
    }
</style>
<style lang="less">
    @import "../../assets/css/tableHeight.css";
    @import "../../assets/less/tAll.less";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>