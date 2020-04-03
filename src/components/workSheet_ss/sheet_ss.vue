<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" :typeTableData="typeTableData" :multipleSelection.sync="multipleSelection" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn" v-if="$route.query.type=='0'||$route.query.type=='r1'||$route.query.type=='r2'||$route.query.type=='r3'">
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
                <!-- <el-col :span="7">
                    <label>模糊查询</label>
                    <el-input v-model="key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col> -->
                <el-col :span="7">
                    <label>申报时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>申报单位</label>
                    <mInput :list="departList" :code.sync="departCode" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7" v-show="title=='工单查询'||title==''">
                    <label>状态</label>
                    <!-- <mInput :list="stateList" :code.sync="stateCode" @keyup.enter.native="searchTableInfo"></mInput> -->
                    <mSelectMult :list="stateList" :code.sync="stateCode" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7" v-show="title!='工单查询'&&title!=''">
                    <label>状态</label>
                    <mInput :list="typeList" :code.sync="typeCode" :clearable="false" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label>申报编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7" v-show="title!='维修申报'&&title!='抢修申报'&&title!='优化申报'&&title!='数字城管'">
                    <label>维修类型</label>
                    <mInput :list="reptypeList" :code.sync="reptypeCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>设施类别</label>
                    <mInput :list="facTypeList" :code.sync="facTypeCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7" v-show="title=='工单查询'">
                    <label>所属中队</label>
                    <!-- <mInput :list="battalionList" :code.sync="battalionCode" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mInput> -->
                    <mTree :tree="battalionList" :code.sync="battalionCode" showAttr="text" getAttr="id" :clearable="true"></mTree>
                </el-col>
                <!-- <el-col :span="7" v-show="title=='工单查询'||title=='维修申报'">
                    <label>申报来源</label>
                    <mInput :list="sourceList" :code.sync="sourceCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col> -->
            </template>

            <template slot="tableBtn">
                <div v-if="listUrl.download" class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template>

            <template slot="table">
                <el-table v-show="tableShowType==1" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="oppmDeptName" label="维修单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column> -->
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
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
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
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="deadlineTime" label="期限完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column> -->
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
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="repDateaaaaa" label="下发时间" show-overflow-tooltip min-width="120"></el-table-column> -->
                    <el-table-column prop="updateDate" label="维修完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column> -->
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions" @onOtherEvent="materialDetail"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template slot="table">
                <el-table v-show="tableShowType==5" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="deadlineTime" label="期限完成时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="workordersStatusName" label="总金额" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{'mmmmmmm'}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="110">
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
    import mTree from "components/common/inputTree";
    export default {
        components: {
            WkLayout,
            mInput,
            TableOpertion,
            mSelectMult,
            mTree
        },
        filters: {
            roadShow(list) {
                let arr = [];
                list.map(item => {
                    arr.push(`${item.roadName}(${item.beginCrossName}-${item.endCrossName})`);
                });
                return arr.join(',');
            }
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === '/sheetss') {
                    if (newVal.path === oldVal.path) {
                        this.initPage();
                    }
                    if (newVal.path != oldVal.path && newVal.query.type != sessionStorage.getItem('sheetssPageType')) {
                        this.initPage();
                    }
                    // if (newVal.path != oldVal.path && newVal.query.devId) {
                    //     this.initPage();
                    // }
                    sessionStorage.setItem('sheetssPageType', newVal.query.type);
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
                declareId: '',
                departCode: '',
                departList: [],
                stateCode: [],
                stateList: [],
                typeCode: '',
                typeList: [],
                reptypeCode: "",
                reptypeList: [],
                facTypeCode: '',
                facTypeList: [],
                battalionCode: [],
                battalionList: [],
                sourceCode: '',
                sourceList: [],

                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                tableShowType: 0, // 0 基础，1查询，2审核，3维修处置，4确认+评价
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
                if (this.title == '维修申报') {
                    let obj = {
                        key: this.key,
                        repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                        repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                        repDeptId: this.departCode,
                        type: this.typeCode,
                        signsWorkordersId: this.declareId,
                        repairType: this.reptypeCode, // 维修类型
                        devTypeCode: this.facTypeCode, //设施类别
                        squadron: this.battalionCode.slice(-1).join(','), // 所属大队,取数组最后一位
                        repSourceCode: this.sourceCode,
                        // workordersStatusCode: this.title == '停用查询' ? 'ORDERSSTATUS08' : this.stateCode,
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '工单查询' || this.title == '停用查询') {
                    let obj = {
                        key: this.key,
                        repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                        repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                        repDeptId: this.departCode,
                        workordersStatusCode: this.stateCode.join(','),
                        signsWorkordersId: this.declareId,
                        repairType: this.reptypeCode, // 维修类型
                        devTypeCode: this.facTypeCode, //设施类别
                        squadron: this.battalionCode.slice(-1).join(','), // 所属大队
                        repSourceCode: this.sourceCode,
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '大队道管审核' || this.title == '大队领导审核' || this.title == '支队设施科审核' || this.title == '秩序处审核') {
                    let obj = {
                        key: this.key,
                        repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                        repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                        repDeptId: this.departCode,
                        type: this.typeCode,
                        signsWorkordersId: this.declareId,
                        repairType: this.reptypeCode, // 维修类型
                        devTypeCode: this.facTypeCode, //设施类别
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '转单审核' || this.title == '转单查询') {
                    let obj = {
                        type: this.typeCode,
                        keyWord: this.key,
                        startTime: this.times ? `${this.times[0]} 00:00:00` : "",
                        endTime: this.times ? `${this.times[1]} 23:59:59` : "",
                        applyPersonName: this.person,
                        applyDeptId: this.departCode,
                        repSourceCode: this.sourceCode,
                        deviceArea: this.regionCode,
                        deviceType: this.systemCode,
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else if (this.title == '点位校准') {
                    let obj = {
                        deviceId: this.key,
                        startTime: this.times ? `${this.times[0]} 00:00:00` : "",
                        endTime: this.times ? `${this.times[1]} 23:59:59` : "",
                        deviceTypeCode: this.systemCode,
                        dealResult: this.typeCode
                    };
                    this.queryConditions = { ...this.queryConditions, ...obj }
                } else {
                    let obj = {
                        key: this.key,
                        repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                        repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                        repDeptId: this.departCode,
                        type: this.typeCode,
                        signsWorkordersId: this.declareId,
                        repairType: this.reptypeCode, // 维修类型
                        devTypeCode: this.facTypeCode, //设施类别
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
                    query: { pre: this.title }
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
                            // 提交完置空
                            this.operExplain = '';
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
                if (isPass == 0 && this.operMaterialExplain == '') {
                    Common.ejMessage("warning", "不通过请填写备注");
                    return;
                }
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
                        sessionStorage.setItem('transferssInfo', JSON.stringify(item));
                    }
                    this.$router.push({
                        path: "/detsheetss",
                        query: { pre: this.title, id: item.workordersId, isread: type }
                    });
                } else {
                    this.$router.push({
                        path: "/detsheetss",
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
                this.declareId = "";
                this.departCode = '';
                this.stateCode = [];
                this.reptypeCode = "";
                this.typeCode = '';
                this.battalionCode = [];
                this.sourceCode = '';

                this.queryConditions = {};
                this.multipleSelection = [];
                this.tableData = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");
                this.typeList = [];
                this.tableShowType = 0;

                this.listUrl.download = '';
                this.listUrl.table = `${this.$config.efoms_HOST}/SignsWorkordersInfo/getSignsWorkordersInfoPage`;
                let pageType = this.$route.query.type;
                switch (pageType) {
                    case '0':
                        this.tableShowType = 1;
                        this.title = '维修申报';
                        this.reptypeCode = 'REPAIRTYPE01';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        this.typeList = [{ dicCode: 'WDSB000', dicName: '待审核' }, { dicCode: 'WDSB001', dicName: '被退回' }, { dicCode: 'WDSB002', dicName: '通过' }, { dicCode: 'WDSB003', dicName: '不通过' }, { dicCode: 'WDSB004', dicName: '已撤回' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 'r1':
                        this.tableShowType = 1;
                        this.title = '抢修申报';
                        this.reptypeCode = 'REPAIRTYPE02';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        this.typeList = [{ dicCode: 'WDSB000', dicName: '待审核' }, { dicCode: 'WDSB001', dicName: '被退回' }, { dicCode: 'WDSB002', dicName: '通过' }, { dicCode: 'WDSB003', dicName: '不通过' }, { dicCode: 'WDSB004', dicName: '已撤回' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 'r2':
                        this.tableShowType = 1;
                        this.title = '优化申报';
                        this.reptypeCode = 'REPAIRTYPE03';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        this.typeList = [{ dicCode: 'WDSB000', dicName: '待审核' }, { dicCode: 'WDSB001', dicName: '被退回' }, { dicCode: 'WDSB002', dicName: '通过' }, { dicCode: 'WDSB003', dicName: '不通过' }, { dicCode: 'WDSB004', dicName: '已撤回' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 'r3':
                        this.tableShowType = 1;
                        this.title = '数字城管';
                        this.reptypeCode = 'REPAIRTYPE04';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        this.typeList = [{ dicCode: 'WDSB000', dicName: '待审核' }, { dicCode: 'WDSB001', dicName: '被退回' }, { dicCode: 'WDSB002', dicName: '通过' }, { dicCode: 'WDSB003', dicName: '不通过' }, { dicCode: 'WDSB004', dicName: '已撤回' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 's1':
                        this.tableShowType = 2;
                        this.title = '大队道管审核';
                        this.typeList = [{ dicCode: 'DDDG001', dicName: '全部' }, { dicCode: 'DDDG002', dicName: '待审核' }, { dicCode: 'DDDG003', dicName: '审核通过' }, { dicCode: 'DDDG004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case 's2':
                        this.tableShowType = 2;
                        this.title = '大队领导审核';
                        this.typeList = [{ dicCode: 'DDLD001', dicName: '全部' }, { dicCode: 'DDLD002', dicName: '待审核' }, { dicCode: 'DDLD003', dicName: '审核通过' }, { dicCode: 'DDLD004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case 's3':
                        this.tableShowType = 2;
                        this.title = '设施科审核';
                        this.typeList = [{ dicCode: 'ZDSSK001', dicName: '全部' }, { dicCode: 'ZDSSK002', dicName: '待审核' }, { dicCode: 'ZDSSK003', dicName: '审核通过' }, { dicCode: 'ZDSSK004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case 's4':
                        this.tableShowType = 2;
                        this.title = '秩序处审核';
                        this.typeList = [{ dicCode: 'ZXC001', dicName: '全部' }, { dicCode: 'ZXC002', dicName: '待审核' }, { dicCode: 'ZXC003', dicName: '审核通过' }, { dicCode: 'ZXC004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case '3':
                        this.tableShowType = 1;
                        this.title = '转单审核';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportZDCX`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '4':
                        this.tableShowType = 2;
                        this.title = '延期审核';
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportYQGD`;
                        this.typeList = [{ dicCode: 'YQGD000', dicName: '待审核' }, { dicCode: 'YQGD001', dicName: '审核通过' }, { dicCode: 'YQGD002', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '5':
                        this.tableShowType = 2;
                        this.title = '工单下发';
                        // this.typeList = [{ dicCode: '0', dicName: '待下发' }, { dicCode: '1', dicName: '被退回' }, { dicCode: '2', dicName: '已下发' }, { dicCode: '3', dicName: '已催办' }, { dicCode: '4', dicName: '超时' }];
                        this.typeList = [{ dicCode: 'DXF001', dicName: '待下发' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '6':
                        this.tableShowType = 3;
                        this.title = '工单指派';
                        this.typeList = [{ dicCode: 'DZP001', dicName: '待指派' }, { dicCode: 'DZP002', dicName: '被退回' }, { dicCode: 'DZP003', dicName: '已指派' }, { dicCode: 'DZP004', dicName: '超时' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '7':
                        this.tableShowType = 1;
                        this.title = '工单查询';
                        if (this.$route.query.devId) {
                            this.key = this.$route.query.devId;
                        }
                        break;
                    case '8':
                        this.tableShowType = 2;
                        this.title = '延期查询';
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '9':
                        this.tableShowType = 1;
                        this.title = '转单查询';
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '10':
                        this.tableShowType = 1;
                        this.title = '停用查询';
                        break;
                    case '11':
                        this.tableShowType = 3;
                        this.title = '维修处置';
                        this.typeList = [{ dicCode: 'WXCZ005', dicName: '新工单' }, { dicCode: 'WXCZ006', dicName: '待处理' }, { dicCode: 'WXCZ007', dicName: '超时' }, { dicCode: 'WXCZ008', dicName: '已修复' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 's5':
                        this.tableShowType = 5;
                        this.title = '工程量提报';
                        this.typeList = [{ dicCode: 'GCL001', dicName: '工程量提报' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;

                    case 's6':
                        this.tableShowType = 4;
                        this.title = '经理审核';
                        this.typeList = [{ dicCode: 'MJ001', dicName: '全部' }, { dicCode: 'MJ002', dicName: '待审核' }, { dicCode: 'MJ003', dicName: '审核通过' }, { dicCode: 'MJ004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case 's7':
                        this.tableShowType = 4;
                        this.title = '监理审核';
                        this.typeList = [{ dicCode: 'JL001', dicName: '全部' }, { dicCode: 'JL002', dicName: '待审核' }, { dicCode: 'JL003', dicName: '审核通过' }, { dicCode: 'JL004', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[1].dicCode;
                        break;
                    case 's8':
                        this.tableShowType = 4;
                        this.title = '中队验收';
                        this.typeList = [{ dicCode: 'ZDYZ001', dicName: '全部' }, { dicCode: 'ZDYZ002', dicName: '待审核' }, { dicCode: 'ZDYZ003', dicName: '审核通过' }, { dicCode: 'ZDYZ004', dicName: '审核不通过' }];
                        this.typeList = [{ dicCode: 'DYS002', dicName: '待验收' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 's9':
                        this.tableShowType = 4;
                        this.title = '大队验收';
                        this.typeList = [{ dicCode: 'DDYZ001', dicName: '全部' }, { dicCode: 'DDYZ002', dicName: '待审核' }, { dicCode: 'DDYZ003', dicName: '审核通过' }, { dicCode: 'DDYZ004', dicName: '审核不通过' }];
                        this.typeList = [{ dicCode: 'DYS001', dicName: '待验收' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 's10':
                        this.tableShowType = 4;
                        this.title = '民警验收';
                        this.typeList = [{ dicCode: 'MJYZ001', dicName: '全部' }, { dicCode: 'MJYZ002', dicName: '待审核' }, { dicCode: 'MJYZ003', dicName: '审核通过' }, { dicCode: 'MJYZ004', dicName: '审核不通过' }];
                        this.typeList = [{ dicCode: 'DYS004', dicName: '待验收' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case 's11':
                        this.tableShowType = 4;
                        this.title = '干部验收';
                        this.typeList = [{ dicCode: 'LDYZ001', dicName: '全部' }, { dicCode: 'LDYZ002', dicName: '待审核' }, { dicCode: 'LDYZ003', dicName: '审核通过' }, { dicCode: 'LDYZ004', dicName: '审核不通过' }];
                        this.typeList = [{ dicCode: 'DYS003', dicName: '待验收' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '12':
                        this.tableShowType = 4;
                        this.title = '工单确认';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/confirm`;
                        this.typeList = [{ dicCode: '0', dicName: '待确认' }, { dicCode: '1', dicName: '已确认' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '13':
                        this.tableShowType = 4;
                        this.title = '工单评价';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/score`;
                        this.typeList = [{ dicCode: '0', dicName: '待评价' }, { dicCode: '1', dicName: '已评价' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '14':
                        this.tableShowType = 3;
                        this.title = '超期工单';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/exception`;
                        this.listUrl.download = `${this.$config.efoms_HOST}/export/exportCQGD`;
                        this.typeList = [{ dicCode: '0', dicName: '已超期' }, { dicCode: '1', dicName: '已撤销' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '21':
                        this.tableShowType = 1;
                        this.title = '材料审核';
                        this.listUrl.table = `${this.$config.efoms_HOST}/opr/search/page/material`;
                        this.typeList = [{ dicCode: '0', dicName: '待审核' }, { dicCode: '1', dicName: '审核通过' }, { dicCode: '2', dicName: '审核不通过' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    case '22':
                        this.tableShowType = 1;
                        this.title = '点位校准';
                        this.listUrl.table = `${this.$config.efoms_HOST}/deviceConfirm/pageDeviceConfirm`;
                        this.typeList = [{ dicCode: '0', dicName: '未处理' }, { dicCode: '1', dicName: '已处理' }];
                        this.typeCode = this.typeList[0].dicCode;
                        break;
                    default:
                        break;
                }

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
            let a2 = this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptInfoV2.htm`, {});
            Promise.all([a1, a2]).then(res => {
                let arr0 = res[0].resultList || [];
                let arr1 = res[1].resultList || [];
                arr1.map(item => {
                    item.deptId = item.opsDeptId;
                    item.deptName = item.opsDeptName;
                });
                this.departList = [...arr0, ...arr1];
            });

            //状态
            this.getDicInfo(`${this.$config.ubms_HOST}/PublicDic/getPublicDic.htm`, {
                parentCode: "FACILITYSTATUS"
            }).then(res => {
                this.stateList = res.resultList || [];
            });
            //维修类型
            this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }, { dicCode: 'REPAIRTYPE04', dicName: '数字城管' }];
            // 设施类别
            this.facTypeList = [{ dicCode: 'REPDEVTYPE24', dicName: '电子设施' }, { dicCode: 'REPDEVTYPE21', dicName: '交通标线' }, { dicCode: 'REPDEVTYPE22', dicName: '交通护栏' }, { dicCode: 'REPDEVTYPE23', dicName: '交通标志' }, { dicCode: 'REPDEVTYPE25', dicName: '临时设施' }, { dicCode: 'REPDEVTYPE26', dicName: '其他设施' }];
            //所属大队
            // this.$api.get(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptRank: 'DEPTRANK04' }, { token: this.token }).then(res => {
            //     this.battalionList = res.resultList || [];
            // });
            this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptTree.htm`, {}).then(res => {
                this.battalionList = res.resultList || [];
            });
            //申报来源
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
            //     parentCode: "REPAIRSSOURCE"
            // }).then(res => {
            //     this.sourceList = res.resultList || [];
            // });
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
            if (to.name == 'detsheetss' || to.name == 'detrepss') {
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