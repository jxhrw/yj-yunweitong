<template>
  <div class="ej-main">
    <div class="layout">
      <Header v-show="isHeadVisible"></Header>
      <div v-show="!isHeadVisible" style="height: 60px"></div>
      <div class="h-content h-currency">
        <div class="h-left">
          <div class="h-left-1">
            <div class="l1-box">
              <el-select v-model="deptId" placeholder="辖区选择" class="absolute" popper-class="selectClass" v-show="!isBrigade">
                <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
              <div class="li-cont">
                <p class="num">{{devFaultTotal.TOTAL_SUM||0}}</p>
                <p class="txt">设备数</p>
              </div>
            </div>
            <div class="l1-box">
              <h6 class="h-title"><span>&nbsp;</span>
                <i class="left-arrow el-icon-arrow-right" @click="wkodsVisible=true;wkodsDetail=false;"></i>
              </h6>
              <div class="li-cont">
                <p class="num">{{devFaultTotal.FAULT_SUM||0}}</p>
                <p class="txt">总故障数</p>
              </div>
            </div>
          </div>
          <div class="h-left-2">
            <div class="cor-left"></div>
            <div class="cor-right"></div>
            <div class="l2-box">
              <h6 class="h-title">
                <span>完好率
                  <el-select v-model="wellTypeCode" placeholder="系统" class="absolute posun" popper-class="selectClass">
                    <el-option v-for="item in wellTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                    </el-option>
                  </el-select>
                </span><i class="left-arrow el-icon-arrow-right" @click="openDetail('well')"></i></h6>
              <div class="l2-sg">
                <div class="l2-sg-left">
                  <!-- <div class="speed-box">
                                        <div class="speed">
                                            <i class="big"></i>
                                            <i class="small" :style="'transform:rotate('+(devFaultTotal.GOOD_RATE*180/100-135)+'deg)'"></i>
                                            <span>{{devFaultTotal.GOOD_RATE|twoDecimal}}%</span>
                                        </div>
                                    </div> -->
                  <div class="dash-box" :class="getColor(devFaultTotal.GOOD_RATE)">
                    <div class="pointer" :style="{'transform':'rotate('+(devFaultTotal.GOOD_RATE*180/100-90)+'deg) scale(0.8)'}"></div>
                    <span>{{devFaultTotal.GOOD_RATE|twoDecimal}}%</span>
                  </div>
                </div>

                <div class="l2-sg-right">
                  <ul class="l2-sg-pillar">
                    <li v-for="(item,index) in goodRateOppmTypeList" :key="index">
                      <span class="name">{{item.OPPM_TYPE_NAME}}
                        <br>
                        <i class="red">{{item.FAULT_SUM||0}}</i><i> / {{item.TOTAL_SUM||0}}</i>
                      </span>
                      <div class="line">
                        <div class="ln">
                          <span :class="'pill-color'+(index+1)" :style="'width:'+(item.GOOD_RATE=='null'?0:item.GOOD_RATE)+'%;'"></span>
                        </div>
                        <span class="wd">{{item.GOOD_RATE|decimalShow(item.TOTAL_SUM||0)}}</span>
                      </div>
                      <!-- <span class="fault">{{item.FAULT_SUM||0}} / {{item.TOTAL_SUM||0}}</span> -->
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="l2-box">
              <h6 class="h-title"><span>及时修复率</span><i class="left-arrow el-icon-arrow-right" @click="openDetail('bad')"></i></h6>
              <div class="l2-sg">
                <div class="l2-sg-left">
                  <div class="dash-box" :class="getColor(timelyRepairAll)">
                    <div class="pointer" :style="{'transform':'rotate('+(timelyRepairAll*180/100-90)+'deg) scale(0.8)'}"></div>
                    <span>{{timelyRepairAll|twoDecimal}}%</span>
                  </div>
                </div>

                <div class="l2-sg-right">
                  <ul class="l2-sg-pillar">
                    <li v-for="(item,index) in timelyRepairList" :key="index">
                      <span class="name">{{item.OPPM_TYPE_NAME}}
                        <br>
                        <i class="red">{{item.FAULT_SUM||0}}</i><i> / {{item.TOTAL_SUM||0}}</i>
                      </span>
                      <div class="line">
                        <div class="ln">
                          <span :class="'pill-color'+(index+1)" :style="'width:'+(item.GOOD_RATE=='null'?0:item.GOOD_RATE)+'%;'"></span>
                        </div>
                        <span class="wd">{{item.GOOD_RATE|decimalShow(item.TOTAL_SUM||0)}}</span>
                      </div>
                      <!-- <span class="fault">{{item.FAULT_SUM||0}} / {{item.TOTAL_SUM||0}}</span> -->
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="h-left-3">
            <div class="cor-left"></div>
            <div class="cor-right"></div>
            <div class="l3-box">
              <h6 class="h-title"><span>工单数量</span><i class="left-arrow el-icon-arrow-right" @click="openDetail('table')"></i></h6>
              <ul class="l3-ul">
                <li>
                  <p class="l3-p1">今日申报</p>
                  <p class="l3-p2">{{workordersInfo.TOTAL_SUM||0}}</p>
                </li>
                <li>
                  <p class="l3-p1">今日修复</p>
                  <p class="l3-p2">{{workordersInfo.GOOD_SUM||0}}</p>
                </li>
                <li class="orange">
                  <p class="l3-p1">今日超时</p>
                  <p class="l3-p2">{{workordersInfo.TIMEOUT_SUM||0}}</p>
                </li>
                <li>
                  <p class="l3-p1">今日优化申报</p>
                  <p class="l3-p2">{{workordersInfo.FAULT_YOU_SUM||0}}</p>
                </li>
              </ul>
            </div>
            <div class="l3-box">
              <h6 class="h-title"><span>维护资源</span>
                <i class="left-arrow el-icon-arrow-right" @click="openDetail('rank')"></i>
              </h6>
              <ul class="l3-ul">
                <li>
                  <p class="l3-p1">维护人员</p>
                  <p class="l3-p2">{{statInfo['维护人员']||0}}</p>
                </li>
                <li>
                  <p class="l3-p1">维护车辆</p>
                  <p class="l3-p2">{{statInfo['维护车辆']||0}}</p>
                </li>
                <li>
                  <p class="l3-p1">维护监理</p>
                  <p class="l3-p2">{{statInfo['维护监理']||0}}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="h-right">
          <div class="h-right-1">
            <!-- <div class="h-rt-map">
                            <span :class="{'active':mapMode=='GPS'}" @click="mapMode='GPS'">GPS模式</span>
                            <span :class="{'active':mapMode!='GPS'}" @click="mapMode='NOTGPS'">统计模式</span>
                        </div> -->
            <div class="full-screen-btn" :class="{'isActive':isMapFullScreen}" @click="isMapFullScreen=!isMapFullScreen"></div>
            <div class="h-rt-tips" v-show="!isMapFullScreen">
              <div class="cor-left small"></div>
              <div class="cor-right small"></div>
              <div class="h-rt-div color-red">
                <p class="h-rt-p">故障：</p>
                <div class="h1-wd-box" id="animateBox">
                  <p class="animate" id="animate1" :style="{'animation-duration': mtimeOne+'s'}">
                    {{faultTxt}}
                  </p>
                </div>
              </div>
              <div class="h-rt-div">
                <p class="h-rt-p">通知：</p>
                <div class="h1-wd-box" id="animateBox">
                  <p class="animate" id="animate2" :style="{'animation-duration': mtimeTwo+'s'}">
                    {{notice||'/'}}
                  </p>
                </div>
              </div>
            </div>
            <div class="m-map-new m-hz" v-show="mapMode=='NOTGPS'">
              <div class="box-map"></div>
              <ul class="m-area">
                <li v-show="getAreaRate('西湖区')>0" class="hover" :class="getColor(getAreaRate('西湖区'))" :alt="getAreaShow('西湖区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('西湖区')+'px'}"></div>
                  <p>西湖区</p>
                </li>
                <li v-show="getAreaRate('拱墅区')>0" class="hover" :class="getColor(getAreaRate('拱墅区'))" :alt="getAreaShow('拱墅区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('拱墅区')+'px'}"></div>
                  <p>拱墅区</p>
                </li>
                <li v-show="getAreaRate('下城区')>0" class="hover" :class="getColor(getAreaRate('下城区'))" :alt="getAreaShow('下城区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('下城区')+'px'}"></div>
                  <p>下城区</p>
                </li>
                <li v-show="getAreaRate('上城区')>0" class="hover" :class="getColor(getAreaRate('上城区'))" :alt="getAreaShow('上城区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('上城区')+'px'}"></div>
                  <p>上城区</p>
                </li>
                <li v-show="getAreaRate('江干区')>0" class="hover" :class="getColor(getAreaRate('江干区'))" :alt="getAreaShow('江干区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('江干区')+'px'}"></div>
                  <p>江干区</p>
                </li>
                <li v-show="getAreaRate('滨江区')>0" class="hover" :class="getColor(getAreaRate('滨江区'))" :alt="getAreaShow('滨江区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('滨江区')+'px'}"></div>
                  <p>滨江区</p>
                </li>
                <li v-show="getAreaRate('景区')>0" class="hover" :class="getColor(getAreaRate('景区'))" :alt="getAreaShow('景区')">
                  <div :style="{'height': areaPillarMaxHeight*getAreaPer('景区')+'px'}"></div>
                  <p>景区</p>
                </li>
              </ul>
            </div>
            <div class="m-map-url" :class="{'full-screen':isMapFullScreen}" v-show="mapMode=='GPS'">
              <iframe src="http://47.114.155.254:8088/dzwl/" id="iframe_or" name="right" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>
            </div>
            <div class="m-fault-list" :class="{'active':wkodsVisible}" v-show="!isMapFullScreen">
              <div class="fl-list" v-show="wkodsVisible">
                <div class="list-box" v-show="!wkodsDetail">
                  <div class="list-line list-title">
                    <p class="line-left">系统</p>
                    <p class="line-right">故障点位</p>
                  </div>
                  <el-scrollbar class="fl-scroll">
                    <div class="list-line" v-for="(item, index) in faultDevList" :key="index" @click="getWkodsDetail(item)">
                      <p class="line-left">{{item.devTypeName}}</p>
                      <p class="line-right">{{item.devName}}</p>
                    </div>
                  </el-scrollbar>
                </div>
                <div class="detail-box" v-if="wkodsDetail">
                  <div class="detail-title">
                    <i @click="wkodsDetail=false">&#8249;</i>
                    <!-- <p :class="{'active':wkodsTab=='tb1'}" @click="scrollIntoView('tb1')">工单信息</p>
                                        <p :class="{'active':wkodsTab=='tb2'}" @click="scrollIntoView('tb2')">工单状态</p> -->

                    <p :class="{'active':wkodsTab=='tb1'}" @click="clickShowView('tb1')">工单信息</p>
                    <p :class="{'active':wkodsTab=='tb2'}" @click="clickShowView('tb2')">点位信息</p>
                  </div>
                  <el-scrollbar class="fl-scroll" v-show="wkodsTab=='tb1'">
                    <ul class="detail-work" id="tb1">
                      <li>
                        <p>申报编号</p>
                        <p>{{workodsDetailInfo.workordersId || workodsDetailInfo.repairsId || '/'}}</p>
                      </li>
                      <li>
                        <p>申报单位</p>
                        <p>{{workodsDetailInfo.repDeptName || '/'}}</p>
                      </li>
                      <li>
                        <p>申报人</p>
                        <p>{{workodsDetailInfo.repPersonName || '/'}}</p>
                      </li>
                      <li>
                        <p>当前状态</p>
                        <p>{{workodsDetailInfo.workordersStatusName || workodsDetailInfo.repStatusName || '/'}}</p>
                      </li>
                      <li>
                        <p>路口点位</p>
                        <p>{{workodsDetailInfo.devName || '/'}}</p>
                      </li>
                      <li>
                        <p>管理辖区</p>
                        <p>{{workodsDetailInfo.devAreaName || '/'}}</p>
                      </li>
                      <li>
                        <p>申报地址</p>
                        <p>{{workodsDetailInfo.detailAddr || '/'}}</p>
                      </li>
                      <li>
                        <p>所属系统</p>
                        <p>{{workodsDetailInfo.devTypeName || '/'}}</p>
                      </li>
                      <li>
                        <p>维修类型</p>
                        <p>{{workodsDetailInfo.typeName || '/'}}</p>
                      </li>
                      <li>
                        <p>申报来源</p>
                        <p>{{workodsDetailInfo.repSourceName || '/'}}</p>
                      </li>
                      <li>
                        <p>申报时间</p>
                        <p>{{workodsDetailInfo.repDate || '/'}}</p>
                      </li>
                      <li>
                        <p>期限完成时间</p>
                        <p>{{workodsDetailInfo.deadlineTime || '/'}}</p>
                      </li>
                      <li>
                        <p>维护单位</p>
                        <p>{{workodsDetailInfo.oppmDeptName || '/'}}</p>
                      </li>
                      <li>
                        <p>维修组</p>
                        <p>{{appointInfoLast.opDeptName || '/'}}</p>
                      </li>
                      <li>
                        <p>维修人员</p>
                        <p>{{appointInfoLast.workordersPersonRltList|opPersonNameShow}}</p>
                      </li>
                      <li v-show="workodsDetailInfo.countdownTime">
                        <p>维修倒计时</p>
                        <p>{{workodsDetailInfo.countdownTime || '/'}}</p>
                      </li>
                      <li v-show="workodsDetailInfo.overTime">
                        <p>超时时间</p>
                        <p>{{workodsDetailInfo.overTime}}</p>
                      </li>
                      <li v-show="workodsDetailInfo.consumingTime">
                        <p>维修耗时</p>
                        <p>{{workodsDetailInfo.consumingTime}}</p>
                      </li>
                      <li>
                        <p>情况描述</p>
                        <p>{{workodsDetailInfo.failureDescrible || '/'}}</p>
                      </li>
                      <li v-show="workodsDetailInfo.optimeScheme">
                        <p>优化方案</p>
                        <p>{{workodsDetailInfo.optimeScheme}}</p>
                      </li>
                    </ul>
                    <div class="detail-process" id="tb2">
                      <el-timeline>
                        <el-timeline-item v-for="(item, index) in processList" :key="index" hide-timestamp>
                          <div class="detail-tip" slot="dot">{{item.operTypeName.substring(item.operTypeName.length - 2)}}</div>
                          <div class="detail-ctent">
                            <div class="title">
                              <label class="title-name">{{item.operTypeName || '/'}}</label>
                              <span class="title-other">{{item.operDate || '/'}}</span>
                              <span class="title-other">{{item.operPerson || '/'}}</span>
                            </div>
                            <ul class="ct-list" v-if="item.operTypeCode=='ORDEROPERTYPE03'">
                              <li>
                                <p>催办原因</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE07'||item.operTypeCode=='ORDEROPERTYPE08'">
                              <li>
                                <p>审核结果</p>
                                <p>{{item.operResult || '/'}}</p>
                              </li>
                              <li>
                                <p>审核意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE04'">
                              <li>
                                <p>运维单位</p>
                                <p>{{item.opDeptName || '/'}}</p>
                              </li>
                              <li>
                                <p>维修期限</p>
                                <p>{{item.deadlineDate || '/'}}</p>
                              </li>
                              <li>
                                <p>下发意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE15'">
                              <li>
                                <p>运维组</p>
                                <p>{{item.opDeptName || '/'}}</p>
                              </li>
                              <li>
                                <p>维修人员</p>
                                <p>{{item.workordersPersonRltList|opPersonNameShow}}</p>
                              </li>
                              <li>
                                <p>指派意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE05'">
                              <li>
                                <p>申请天数</p>
                                <p>{{item.score || '/'}}</p>
                              </li>
                              <li>
                                <p>延期原因</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE06'">
                              <li>
                                <p>审核结果</p>
                                <p>{{item.operResult || '/'}}</p>
                              </li>
                              <li>
                                <p>期限时间</p>
                                <p>{{item.deadlineDate || '/'}}</p>
                              </li>
                              <li>
                                <p>审核意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE23'">
                              <li>
                                <p>记录编号</p>
                                <p>{{item.workordersRecordId || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE24'||item.operTypeCode=='ORDEROPERTYPE25'">
                              <li>
                                <p>审核结果</p>
                                <p>{{item.operResult || '/'}}</p>
                              </li>
                              <li>
                                <p>审核意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE26'||item.operTypeCode=='ORDEROPERTYPE21'||item.operTypeCode=='ORDEROPERTYPE22'">
                              <li>
                                <p>申请材料</p>
                                <p>{{item.materialRltList|materialShow}}</p>
                              </li>
                              <li>
                                <p>备注</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='OPERRESULT10'">
                              <li>
                                <p>操作类型</p>
                                <p>{{item.operResult || '/'}}</p>
                              </li>
                              <li>
                                <p>故障类型</p>
                                <p>{{item.failureTypeName || '/'}}</p>
                              </li>
                              <li>
                                <p>故障描述</p>
                                <p>{{item.failureReason || '/'}}</p>
                              </li>
                              <li>
                                <p>结果反馈</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE08'">
                              <li>
                                <p>确认结果</p>
                                <p>{{item.operResult || '/'}}</p>
                              </li>
                              <li>
                                <p>反馈时间</p>
                                <p>{{item.operDate || '/'}}</p>
                              </li>
                              <li>
                                <p>确认意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE10'">
                              <li v-for="(res,ids) in item.evalGradeList" :key="ids">
                                <p>{{res.evalItemName||res.evalExplain || '/'}}</p>
                                <p>{{item.evalGrades}}星</p>
                              </li>
                              <li>
                                <p>意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE02'">
                              <li>
                                <p>关闭原因</p>
                                <p>{{item.operReasonName || '/'}}</p>
                              </li>
                              <li>
                                <p>意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else-if="item.operTypeCode=='ORDEROPERTYPE27'">
                              <li>
                                <p>撤销原因</p>
                                <p>{{item.operReasonName || '/'}}</p>
                              </li>
                              <li>
                                <p>意见</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>
                            <ul class="ct-list" v-else>
                              <li>
                                <p>备注</p>
                                <p>{{item.operExplain || '/'}}</p>
                              </li>
                            </ul>

                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </el-scrollbar>
                  <el-scrollbar class="fl-scroll" v-show="wkodsTab=='tb2'">
                    <ul class="detail-work" id="tb1" style="margin-bottom:0;">
                      <li>
                        <p>点位名称</p>
                        <p>{{pointDetailInfo.devName || '/'}}</p>
                      </li>
                      <li>
                        <p>经度</p>
                        <p>{{pointDetailInfo.longitude || '/'}}</p>
                      </li>
                      <li>
                        <p>纬度</p>
                        <p>{{pointDetailInfo.latitude || '/'}}</p>
                      </li>
                      <li>
                        <p>IP地址</p>
                        <p>{{pointDetailInfo.devIp || '/'}}</p>
                      </li>
                      <li>
                        <p>项目属性</p>
                        <p>{{pointDetailInfo.oppmTypeName || '/'}}</p>
                      </li>
                      <li>
                        <p>所属系统</p>
                        <p>{{pointDetailInfo.devTypeName || '/'}}</p>
                      </li>
                      <li>
                        <p>地域辖区</p>
                        <p>{{pointDetailInfo.devAreaName || '/'}}</p>
                      </li>
                      <li>
                        <p>管理标项</p>
                        <p>{{pointDetailInfo.projectName || '/'}}</p>
                      </li>
                      <li>
                        <p>大队</p>
                        <p>{{pointDetailInfo.listDepts|deptShow('DEPTRANK04')}}</p>
                      </li>
                      <li>
                        <p>中队</p>
                        <p>{{pointDetailInfo.listDepts|deptShow('DEPTRANK05')}}</p>
                      </li>
                      <li>
                        <p>巡区</p>
                        <p>{{pointDetailInfo.listDepts|deptShow('DEPTRANK07')}}</p>
                      </li>
                      <li>
                        <p>防区</p>
                        <p>{{pointDetailInfo.listDepts|deptShow('DEPTRANK08')}}</p>
                      </li>
                      <li>
                        <p>支队责任民警</p>
                        <p>{{pointDetailInfo.detaPoliceName || '/'}}</p>
                      </li>
                      <li>
                        <p>大队责任民警</p>
                        <p>{{pointDetailInfo.briPoliceName || '/'}}</p>
                      </li>
                      <li>
                        <p>支队监理单位</p>
                        <p>{{pointDetailInfo.supervisonName || '/'}}</p>
                      </li>
                      <li>
                        <p>支队维护单位</p>
                        <p>{{pointDetailInfo.oppmDeptName || '/'}}</p>
                      </li>
                      <li>
                        <p>施工单位</p>
                        <p>{{pointDetailInfo.constructionCompanyName || '/'}}</p>
                      </li>
                      <li>
                        <p>建设单位</p>
                        <p>{{pointDetailInfo.companyName || '/'}}</p>
                      </li>
                      <li>
                        <p>所属部门</p>
                        <p>{{pointDetailInfo.devDeptName || '/'}}</p>
                      </li>

                      <li>
                        <p>接入时间</p>
                        <p>{{pointDetailInfo.devBuildDate || '/'}}</p>
                      </li>
                      <li>
                        <p>验收时间</p>
                        <p>{{pointDetailInfo.checkDate || '/'}}</p>
                      </li>
                      <li>
                        <p>移交时间</p>
                        <p>{{pointDetailInfo.overTime || '/'}}</p>
                      </li>
                      <li>
                        <p>使用年限到期时间</p>
                        <p>{{pointDetailInfo.shelfLief || '/'}}</p>
                      </li>
                    </ul>
                  </el-scrollbar>
                </div>
              </div>
              <div class="fl-btn" @click="wkodsVisible=!wkodsVisible"></div>
            </div>
          </div>
          <div class="h-right-2">
            <div class="cor-left"></div>
            <div class="cor-right"></div>
            <h6 class="h-title"><span>各系统完好率</span></h6>
            <el-carousel class="r2-box" arrow="always" :autoplay="false" :loop="false" indicator-position="none" v-if="devRepDevType.length>0">
              <el-carousel-item v-for="(itemNun,indexNun) in Math.ceil(devRepDevType.length/6)" :key="itemNun">
                <ul class="r2-ul">
                  <li v-for="(item,index) in 6" :key="item+'a'">
                    <template v-if="(6*indexNun+index)<devRepDevType.length">
                      <!-- <div class="speed-box small-size" :class="getColor(devRepDevType[6*indexNun+index].GOOD_RATE)">
                                                <div class="speed">
                                                <i class="big"></i>
                                                <i class="small" :style="'transform:rotate('+(devRepDevType[6*indexNun+index].GOOD_RATE*180/100-135)+'deg)'"></i>
                                                <span>{{devRepDevType[6*indexNun+index].GOOD_RATE|twoDecimal}}%</span>
                                                </div>
                                            </div> -->
                      <div class="dash-box small-size" :class="getColor(devRepDevType[6*indexNun+index].GOOD_RATE)">
                        <div class="pointer" :style="{'transform':'rotate('+(devRepDevType[6*indexNun+index].GOOD_RATE*180/100-90)+'deg) scale(0.8)'}"></div>
                        <span>{{devRepDevType[6*indexNun+index].GOOD_RATE|twoDecimal}}%</span>
                      </div>
                      <p class="r2-p1">{{devRepDevType[6*indexNun+index].DEV_TYPE_NAME}}</p>
                      <p class="r2-p2"><span>{{devRepDevType[6*indexNun+index].FAULT_SUM||0}}</span> / {{devRepDevType[6*indexNun+index].TOTAL_SUM}}</p>
                    </template>
                  </li>
                </ul>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>

      <div class="dialog-sb" v-show="detailVisible">
        <div class="background" @click="closeDetail"></div>
        <div class="dialog-content" v-loading="dialogLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
          <div class="cor-left"></div>
          <div class="cor-right"></div>
          <ul class="screen" :class="{'between': detailType=='table'}" v-if="detailType!='rank'">
            <li class="screen-li">
              <label>统计周期：</label>
              <el-select v-model="dateTypeCode" placeholder="" class="dialog-select" popper-class="selectClass noMrTop" style="width: 100px;">
                <el-option v-for="item in dateTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
              <i class="icon el-icon-date"></i>
              <el-date-picker class="hide" v-model="dialogTimeDay" type="date" value-format="yyyy-MM-dd" placeholder="选择日" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='day'" :picker-options="{'firstDayOfWeek':1}">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeWeek" type="week" value-format="yyyy-MM-dd" placeholder="选择周" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='week'" :picker-options="{'firstDayOfWeek':1}">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeMonth" type="month" value-format="yyyy-MM-dd" placeholder="选择月" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='month'">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeYear" type="year" value-format="yyyy" placeholder="选择年" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='year'">
              </el-date-picker>

              <TimeQuarter class="hide special" :value.sync="dialogTimeQuarter" v-show="dateTypeCode=='season'"></TimeQuarter>
            </li>
            <!-- <li class="screen-li">
                            <label>辖区：</label>
                            <el-select v-show="detailType!='table'" v-model="detDeptId" placeholder="请选择" class="dialog-select" popper-class="selectClass noMrTop" clearable>
                                <el-option v-for="item in detDeptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                                </el-option>
                            </el-select>
                            <mSelectMult v-show="detailType=='table'" :list="detDeptList" :code.sync="detDeptsId" getAttr="deptId" showAttr="deptName" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
                        </li> -->
            <li class="screen-li">
              <label>维护类型：</label>
              <el-select v-model="detOppmCode" placeholder="全部" class="dialog-select" popper-class="selectClass noMrTop" clearable>
                <el-option v-for="item in oppmList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
            </li>
            <li class="screen-li">
              <label>系统：</label>
              <mSelectMult :list="devTypeList" :code.sync="detDevTypeCode" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
            </li>
            <li class="screen-li" v-show="detailType=='table'">
              <label>申报来源：</label>
              <el-select v-model="repSourceCode" placeholder="全部" class="dialog-select" popper-class="selectClass noMrTop" clearable>
                <el-option v-for="item in repSourceList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
            </li>
          </ul>
          <ul class="screen between classrk" v-if="detailType=='rank'">
            <li class="screen-li">
              <label>系统：</label>
              <mSelectMult :list="devTypeList" :code.sync="detDevTypeCode" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
              <i class="icon" :class="majorKey=='DEVTYPE'?'el-icon-star-on':'el-icon-star-off'" @click="majorKey='DEVTYPE'"></i>
            </li>
            <li class="screen-li">
              <label>大队中队：</label>
              <mSelectMult :list="detDeptList" :code.sync="detDeptsId" getAttr="deptId" showAttr="deptName" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
              <i class="icon" :class="majorKey=='DEPT'?'el-icon-star-on':'el-icon-star-off'" @click="majorKey='DEPT'"></i>
            </li>
            <li class="screen-li">
              <label>维护单位：</label>
              <mSelectMult :list="defendList" :code.sync="defendCode" getAttr="opsDeptId" showAttr="opsDeptName" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
              <i class="icon" :class="majorKey=='WHDW'?'el-icon-star-on':'el-icon-star-off'" @click="majorKey='WHDW'"></i>
            </li>
            <li class="screen-li">
              <label>监理单位：</label>
              <mSelectMult :list="supervisorList" :code.sync="supervisorCode" getAttr="opsDeptId" showAttr="opsDeptName" class="multSlt" popper-class="selectClass noMrTop"></mSelectMult>
              <i class="icon" :class="majorKey=='SUPERVISION'?'el-icon-star-on':'el-icon-star-off'" @click="majorKey='SUPERVISION'"></i>
            </li>
          </ul>
          <ul class="screen  between classrk" v-if="detailType=='rank'" style="margin-top:15px;">
            <li class="screen-li">
              <label>统计周期：</label>
              <el-select v-model="dateTypeCode" placeholder="" class="dialog-select" popper-class="selectClass noMrTop">
                <el-option v-for="item in dateTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
              <i class="icon el-icon-date"></i>
              <el-date-picker class="hide" v-model="dialogTimeDay" type="date" value-format="yyyy-MM-dd" placeholder="选择日" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='day'" :picker-options="{'firstDayOfWeek':1}">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeWeek" type="week" value-format="yyyy-MM-dd" placeholder="选择周" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='week'" :picker-options="{'firstDayOfWeek':1}">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeMonth" type="month" value-format="yyyy-MM-dd" placeholder="选择月" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='month'">
              </el-date-picker>
              <el-date-picker class="hide" v-model="dialogTimeYear" type="year" value-format="yyyy" placeholder="选择年" align="center" :clearable="false" popper-class="selectDate" v-show="dateTypeCode=='year'">
              </el-date-picker>

              <TimeQuarter class="hide special" :value.sync="dialogTimeQuarter" v-show="dateTypeCode=='season'"></TimeQuarter>
            </li>
            <li class="screen-li">
              <label>维护类型：</label>
              <el-select v-model="detOppmCode" placeholder="全部" class="dialog-select" popper-class="selectClass noMrTop" clearable>
                <el-option v-for="item in oppmList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
              <i class="icon el-icon-date transparent"></i>
            </li>
            <li class="screen-li">
              <label>申报来源：</label>
              <el-select v-model="repSourceCode" placeholder="全部" class="dialog-select" popper-class="selectClass noMrTop" clearable>
                <el-option v-for="item in repSourceList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                </el-option>
              </el-select>
              <i class="icon el-icon-date transparent"></i>
            </li>
            <li class="screen-li">
              <label></label>
              <button class="dialog-select button" @click="detailGet(true)">查 询</button>
              <i class="icon el-icon-date transparent"></i>
            </li>
          </ul>
          <div class="info">
            <h3 v-show="detailType=='well'||detailType=='bad'">{{detailType=='well'?'完好率':'修复率'}} <span style="margin-left: 15px;">日期： {{dialogTime.start==dialogTime.end?dialogTime.start:(dialogTime.start+' -- '+dialogTime.end)}}</span> </h3>
            <el-scrollbar v-if="detailType=='well'||detailType=='bad'" class="info-box-scroll">
              <div class="info-dept" :style="{'width':statHomeList.length*10+'%'}">
                <template v-for="(item, index) in statHomeList">
                  <div class="dept" :class="zdShow(item.DEV_DEPT_ID).class" :key="index" v-if="!(item.detail&&item.detail.length>0)">
                    <p class="p1">{{item.DEV_DEPT_ID}}</p>
                    <p class="p2">{{item.GOOD_RATE|oneDecimal}}</p>
                    <!-- <p class="p3"><span><i>&#8721;</i> {{item.TOTAL_NUM}}</span><span>{{item.BAD_NUM}}</span></p> -->
                  </div>
                  <el-popover v-else ref="popover" placement="right" width="250" trigger="click" :key="index" popper-class="el-pover">
                    <div class="dept" :class="zdShow(item.DEV_DEPT_ID).class" :key="index" slot="reference">
                      <p class="p1">{{item.DEV_DEPT_ID}}</p>
                      <p class="p2">{{item.GOOD_RATE|oneDecimal}}</p>
                      <!-- <p class="p3"><span><i>&#8721;</i> {{item.TOTAL_NUM}}</span><span>{{item.BAD_NUM}}</span></p> -->
                    </div>

                    <el-scrollbar class="pover-box">
                      <ul class="pover-ul" style="width:250px;">
                        <li v-for="(line,idx) in item.detail" :key="idx">
                          <span v-if="line.DAY">{{line.DAY.length>8?line.DAY.substring(5):line.DAY}}</span>
                          <span v-if="line.HOUR">{{line.HOUR}} 点</span>
                          <span v-if="line.MONTH">{{line.MONTH}}</span>
                          <el-progress :percentage="parseInt((line.GOOD_RATE||0)*10)/10" color="#26EAFF" :show-text="false"></el-progress>
                          <span style="margin:0">{{line.GOOD_RATE|oneDecimal}}</span>
                        </li>
                      </ul>
                    </el-scrollbar>
                  </el-popover>
                </template>
              </div>
            </el-scrollbar>
            <div v-show="detailType=='well'||detailType=='bad'" class="info-dev-box">
              <div class="info-devtype">
                <template v-for="item1 in Math.ceil(statDevTypeList.length/5)">
                  <template v-for="item2 in 5">
                    <div class="devtype" :class="{'transparent':((item1-1)*5+(item2-1)>=statDevTypeList.length)}" :key="item1+''+item2">
                      <template v-if="(item1-1)*5+(item2-1)<statDevTypeList.length">
                        <div class="slotdiv" v-if="!(statDevTypeList[(item1-1)*5+(item2-1)].detail&&statDevTypeList[(item1-1)*5+(item2-1)].detail.length>0)">
                          <p class="p1"><span>{{statDevTypeList[(item1-1)*5+(item2-1)].DEV_TYPE_NAME}}</span> &nbsp; <span>{{statDevTypeList[(item1-1)*5+(item2-1)].GOOD_RATE|oneDecimal}}</span></p>
                          <!-- <p class="p2"><span class="s1">{{statDevTypeList[(item1-1)*5+(item2-1)].TOTAL_NUM||0}}</span><span class="s2">{{statDevTypeList[(item1-1)*5+(item2-1)].BAD_NUM||0}}</span></p> -->
                        </div>
                        <el-popover v-else ref="popover" placement="right" width="250" trigger="click" popper-class="el-pover">
                          <div class="slotdiv" slot="reference">
                            <p class="p1"><span>{{statDevTypeList[(item1-1)*5+(item2-1)].DEV_TYPE_NAME}}</span> &nbsp; <span>{{statDevTypeList[(item1-1)*5+(item2-1)].GOOD_RATE|oneDecimal}}</span></p>
                            <!-- <p class="p2"><span class="s1">{{statDevTypeList[(item1-1)*5+(item2-1)].TOTAL_NUM||0}}</span><span class="s2">{{statDevTypeList[(item1-1)*5+(item2-1)].BAD_NUM||0}}</span></p> -->
                          </div>

                          <el-scrollbar class="pover-box">
                            <ul class="pover-ul" style="width:250px;">
                              <li v-for="(line,idx) in statDevTypeList[(item1-1)*5+(item2-1)].detail" :key="idx">
                                <span v-if="line.DAY">{{line.DAY.length>8?line.DAY.substring(5):line.DAY}}</span>
                                <span v-if="line.HOUR">{{line.HOUR}} 点</span>
                                <span v-if="line.MONTH">{{line.MONTH}}</span>
                                <el-progress :percentage="parseInt((line.GOOD_RATE||0)*10)/10" color="#26EAFF" :show-text="false"></el-progress>
                                <span style="margin:0">{{line.GOOD_RATE|oneDecimal}}</span>
                              </li>
                            </ul>
                          </el-scrollbar>
                        </el-popover>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <h3 v-show="detailType=='table'||detailType=='rank'"><span>日期： {{dialogTime.start==dialogTime.end?dialogTime.start:(dialogTime.start+' -- '+dialogTime.end)}}</span> </h3>
            <el-scrollbar class="table-box" v-show="detailType=='table'">
              <div v-show="detailType=='table'">
                <el-table :data="tableData" class="dialog-table" border>
                  <el-table-column prop="NAME" label="辖区" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="TOTAL_SUM" label="申报工单数" align="right">
                  </el-table-column>
                  <el-table-column prop="FINISH_SUM" label="修复工单数" align="right">
                  </el-table-column>
                  <el-table-column prop="TIMEOUT_SUM" label="超时工单数" align="right">
                  </el-table-column>
                  <!-- <el-table-column prop="IS_OPTIMIZE" label="优化工单总数" align="right">
                                    </el-table-column>
                                    <el-table-column prop="OPTIMIZE_UNFINISH" label="优化未完成总数" align="right">
                                    </el-table-column> -->
                </el-table>
                <!-- <div class="page-box">
                                    <el-pagination layout="prev, pager, next" :total="tableData.length" :page-size="10" :current-page.sync="currentPage">
                                    </el-pagination>
                                </div> -->
              </div>
              <div v-show="detailType=='table-old'">
                <el-table :data="tableShowData" class="dialog-table" border>
                  <el-table-column prop="OP_DEPT_NAME" label="建设单位" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="TOTAL_SUM" label="工单总数" align="right">
                  </el-table-column>
                  <el-table-column prop="TIMEOUT_SUM" label="超时工单" align="right">
                  </el-table-column>
                  <!-- <el-table-column prop="ONTIME_SUM" label="准时工单" align="right">
                                </el-table-column> -->
                  <!-- <el-table-column prop="UNFINISHED_SUM" label="未完成工单" align="right">
                                </el-table-column> -->
                  <el-table-column prop="UNFINISHED_SUM" label="未修复工单" align="right">
                  </el-table-column>
                  <el-table-column prop="POSTPONE_SUM" label="延期申请工单" align="right">
                  </el-table-column>
                  <!-- <el-table-column label="工单准时率" align="right">
                                    <template slot-scope="scope">
                                        {{scope.row.ONTIME_RATE|twoDecimal}}%
                                    </template>
                                </el-table-column>
                                <el-table-column label="工单完成率" align="right">
                                    <template slot-scope="scope">
                                        {{scope.row.FINISH_RATE|twoDecimal}}%
                                    </template>
                                </el-table-column> -->
                  <el-table-column label="及时修复率" align="right">
                    <template slot-scope="scope">
                      {{scope.row.ONTIME_RATE|twoDecimal}}%
                    </template>
                  </el-table-column>
                  <el-table-column label="修复率" align="right">
                    <template slot-scope="scope">
                      {{scope.row.FINISH_RATE|twoDecimal}}%
                    </template>
                  </el-table-column>
                  <el-table-column label="工单申请延期率" align="right" min-width="90">
                    <template slot-scope="scope">
                      {{scope.row.POSTPONE_RATE|twoDecimal}}%
                    </template>
                  </el-table-column>
                </el-table>
                <div class="page-box">
                  <el-pagination layout="prev, pager, next" :total="tableData.length" :page-size="10" :current-page.sync="currentPage">
                  </el-pagination>
                </div>
              </div>
            </el-scrollbar>
            <el-scrollbar class="table-box" v-show="detailType=='rank'">
              <div>
                <el-table :data="tableData" class="dialog-table" border>
                  <el-table-column type="index" label="序号" width="50" align="center">
                  </el-table-column>
                  <el-table-column prop="NAME" label="辖区" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="SBSL" label="设备总数" align="right" sortable>
                  </el-table-column>
                  <el-table-column prop="GDSL" label="申报工单总数" align="right" sortable>
                  </el-table-column>
                  <el-table-column prop="WHL" label="完好率" align="right" sortable>
                    <template slot-scope="scope">
                      {{scope.row.WHL|twoDecimal}}%
                    </template>
                  </el-table-column>
                  <el-table-column prop="JSXF" label="及时修复率" align="right" sortable>
                    <template slot-scope="scope">
                      {{scope.row.JSXF|twoDecimal}}%
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <div class="page-box">
                                    <el-pagination layout="prev, pager, next" :total="tableData.length" :page-size="10" :current-page.sync="currentPage">
                                    </el-pagination>
                                </div> -->
              </div>
            </el-scrollbar>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Common from "@/assets/js/common.js";
import Header from "./header_sb.vue";
import TimeQuarter from "./time_quarter.vue";
import mSelectMult from "@/components/common/selectMult";
export default {
  components: {
    Header,
    TimeQuarter,
    mSelectMult
  },
  filters: {
    twoDecimal(val) {
      return Math.round((val || 0) * 100) / 100;
    },
    decimalShow(val, total) {
      //   console.log(val, total)
      // if (total == '0') {
      //     return '— —';
      // } else {
      //     return Math.round((val == null ? 100 : val) * 100) / 100 + '%';
      // }
      if (val == 'null') return '— —';
      else return Math.round((val || 0) * 100) / 100 + '%';
    },
    oneDecimal(val) {
      if (String(val) == "undefined") {
        return '— —';
      } else {
        return Math.round((val || 0) * 10) / 10 + '%';
      }
    },
    opPersonNameShow(val) {
      let arr = [];
      if (val && val.length > 0) {
        val.map(res => {
          arr.push(res.personName);
        });
      }
      return arr.join(",") || '/';
    },
    materialShow(val) {
      let arr = [];
      val.map(res => {
        arr.push(`${res.materialName || ''}${res.materialNum || ''}${res.materialUnit || ''}`);
      });
      return arr.join(",") || '/';
    },
    deptShow(val, type) {
      let str = '';
      let list = val || [];
      let res = [];
      res = list.filter(item => item.deptRankCode == type);
      str = res.length > 0 ? res[0].deptName : '';
      return str || '/';
    },
  },
  data() {
    return {
      title: '',
      token: "",
      devFaultTotal: {},
      goodRateOppmTypeList: [],
      devRepDevType: [],
      devFaultAreaObj: {},
      areaPillarMaxHeight: 100, //区域柱形图的最高高度（单位像素）
      mapMode: 'GPS',
      timelyRepairAll: 0,
      timelyRepairList: [],
      workordersInfo: {},
      faultTxt: '',
      notice: '',
      deptId: '',
      deptList: [],
      wellTypeCode: '1',
      wellTypeList: [],
      userInfo: {},
      isHeadVisible: false,
      isHeadMenuVisible: true,
      mtimeOne: 0,
      mtimeTwo: 0,
      statInfo: {},

      //弹窗数据
      dialogLoading: false,
      detailVisible: false,
      detailType: '',
      statHomeList: [],
      statDevTypeList: [],
      tableData: [], // 所有数据
      tableShowData: [], // 展示的5条数据
      currentPage: 1,
      dateTypeCode: '',
      // { dicCode: '', dicName: '所有' },
      dateTypeList: [{ dicCode: 'day', dicName: '日' }, { dicCode: 'week', dicName: '周' }, { dicCode: 'month', dicName: '月' }, { dicCode: 'season', dicName: '季度' }, { dicCode: 'year', dicName: '年' }],
      dialogTime: { start: '', end: '' },
      dialogTimeDay: '',
      dialogTimeWeek: '',
      dialogTimeMonth: '',
      dialogTimeQuarter: '',
      dialogTimeYear: '',
      detDeptId: '',
      detDeptsId: [],
      detDeptList: [],
      detOppmCode: '',
      oppmList: [],
      repSourceCode: '',
      repSourceList: [],
      detDevTypeCode: [],
      devTypeList: [],
      defendCode: [],
      defendList: [],
      supervisorCode: [],
      supervisorList: [],
      majorKey: '',

      deptPTObj: {}, // 平通的id数据
      isBrigade: false, // 是否大队
      isIframeOnload: false, // iframe是否加载完成
      faultDevList: [],
      workodsDetailInfo: {},
      pointDetailInfo: {},
      appointInfoLast: {},
      processList: [],
      wkodsVisible: false,
      wkodsDetail: false,
      wkodsTab: '',
      isMapFullScreen: false,
    };
  },
  watch: {
    deptId(val) {
      this.initGet();
    },
    wellTypeCode(val) {
      this.getFaultTotal();
    },
    dateTypeCode(val) {
      if (val == 'day') {
        this.dialogTimeDay = '';
        setTimeout(() => {
          // 默认前一天，因为当天是没数据的，24点才会生成数据
          let a = new Date().getTime() - 0 * 24 * 60 * 60 * 1000;
          this.dialogTimeDay = Common.dateFormat('yyyy-MM-dd', new Date(a));
        });
      } else if (val == 'week') {
        this.dialogTimeWeek = '';
        setTimeout(() => {
          // 默认返回周二的日期
          let n = 2; // n:想要返回周几，例如：周一：1，周二：2，周三：3
          let today = new Date();
          today.setDate(today.getDate() + n - (today.getDay() || 7));
          this.dialogTimeWeek = Common.dateFormat('yyyy-MM-dd', new Date(today));
        })
      } else if (val == 'month') {
        this.dialogTimeMonth = '';
        setTimeout(() => {
          this.dialogTimeMonth = Common.dateFormat('yyyy-MM-01', new Date());
        });
      } else if (val == 'season') {
        this.dialogTimeQuarter = '';
        setTimeout(() => {
          let a = Common.dateFormat('yyyy-MM', new Date());
          let year = a.split('-')[0];
          let qua = parseInt((a.split('-')[1] - 1) / 3) + 1;
          this.dialogTimeQuarter = year + '-' + qua;
        });
      } else if (val == 'year') {
        this.dialogTimeYear = '';
        setTimeout(() => {
          this.dialogTimeYear = Common.dateFormat('yyyy', new Date());
        });
      } else if (val == '') {
        this.dialogTime.start = '';
        this.dialogTime.end = '';
      }
    },
    dialogTimeDay(val) {
      if (this.dateTypeCode == 'day' && val != '') {
        this.dialogTime.start = val;
        this.dialogTime.end = val;
      }
    },
    dialogTimeWeek(val) {
      //   console.log(val);
      // 默认返回周二的时间
      if (this.dateTypeCode == 'week' && val != '') {
        let a = new Date(val).getTime() - 1 * 24 * 60 * 60 * 1000;
        let b = new Date(val).getTime() + 5 * 24 * 60 * 60 * 1000;
        this.dialogTime.start = Common.dateFormat('yyyy-MM-dd', new Date(a));
        this.dialogTime.end = Common.dateFormat('yyyy-MM-dd', new Date(b));
      }
    },
    dialogTimeMonth(val) {
      // console.log(val);
      // 默认返回周每月1号的时间
      if (this.dateTypeCode == 'month' && val != '') {
        let arr = val.split('-');
        let b = '';
        if (arr.length >= 3) {
          b = new Date(arr[0], arr[1], 0)
          arr[2] = b.getDate();
        }
        this.dialogTime.start = val;
        this.dialogTime.end = arr.join('-');
      }
    },
    dialogTimeQuarter(val) {
      // console.log(val);
      if (this.dateTypeCode == 'season' && val != '') {
        let arr = val.split('-');
        let a = '',
          b = '';
        if (arr.length >= 2) {
          if (arr[1] == '1') {
            a = arr[0] + '-' + '01-01';
            b = arr[0] + '-' + '03-31';
          }
          if (arr[1] == '2') {
            a = arr[0] + '-' + '04-01';
            b = arr[0] + '-' + '06-30';
          }
          if (arr[1] == '3') {
            a = arr[0] + '-' + '07-01';
            b = arr[0] + '-' + '09-30';
          }
          if (arr[1] == '4') {
            a = arr[0] + '-' + '10-01';
            b = arr[0] + '-' + '12-31';
          }
        }
        this.dialogTime.start = a;
        this.dialogTime.end = b;
      }
    },
    dialogTimeYear(val) {
      // console.log(val);
      if (this.dateTypeCode == 'year' && val != '') {
        this.dialogTime.start = val + '-01-01';
        this.dialogTime.end = val + '-12-31';
      }
    },
    'dialogTime': {
      handler(val) {
        console.log(JSON.stringify(val));
        if (this.detailType != 'rank') {
          this.detailGet(this.detailVisible);
        }
      },
      deep: true,
    },
    detDeptId(val) {
      if (this.detailType != 'rank') {
        this.detailGet(this.detailVisible);
      }
    },
    detDeptsId(val, old) {
      if (this.detailType != 'rank') {
        if (val.join(',') != old.join(',')) this.detailGet(this.detailVisible);
      }
    },
    detOppmCode(val) {
      if (this.detailType != 'rank') {
        this.detailGet(this.detailVisible);
      }
    },
    repSourceCode(val) {
      if (this.detailType != 'rank') {
        this.detailGet(this.detailVisible);
      }
    },
    detDevTypeCode(val, old) {
      if (this.detailType != 'rank') {
        if (val.join(',') != old.join(',')) this.detailGet(this.detailVisible);
      }
    },
    currentPage(val) {
      this.tableShowData = this.tableData.slice((val - 1) * 10, val * 10);
    }
  },
  methods: {
    // 设备数和故障数
    getFaultTotal() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectTotal`, { deptId: this.deptId, isDveType: this.wellTypeCode }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.devFaultTotal = res.resultList && res.resultList.length > 0 ? res.resultList[0] : {};
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 项目类型（支队外建等）
    getFaultOppmType() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByOppmType`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            let arr = res.resultList || [];
            let order = ['支队维护', '租赁维护', '外建维护']
            let rt = [];
            for (let i = 0; i < 3; i++) {
              let qw = arr.filter(tiem => tiem.OPPM_TYPE_NAME == order[i]);
              if (qw.length > 0) {
                rt.push(qw[0]);
              } else {
                rt.push({ OPPM_TYPE_NAME: order[i], GOOD_RATE: 'null' });
              }
            }
            this.goodRateOppmTypeList = rt;
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 各子系统完好率（电警信号机等）
    getRepDevType() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevType`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.devRepDevType = res.resultList || [];
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 区域的完好率
    getFaultDevArea() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevArea`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            let arr = res.resultList || [];
            this.devFaultAreaObj = { maxNum: 0 };
            arr.map(item => {
              if (item.GOOD_RATE > this.devFaultAreaObj.maxNum) {
                this.devFaultAreaObj.maxNum = item.GOOD_RATE || 0;
              }
              switch (item.DEV_AREA_NAME) {
                case '上城区':
                case '拱墅区':
                case '滨江区':
                case '江干区':
                case '西湖区':
                case '下城区':
                case '景区':
                case '高架辖区':
                  this.devFaultAreaObj[item.DEV_AREA_NAME] = item;
                  break;
                default:
                  break;
              }
            });
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 区域完好率的百分比
    getAreaPer(name) {
      // 区域完好率里基于最大数的百分比
      // return (this.devFaultAreaObj[name] ? this.devFaultAreaObj[name].GOOD_RATE : 0) / (this.devFaultAreaObj.maxNum || 1);
      let num = this.devFaultAreaObj[name] ? (this.devFaultAreaObj[name].GOOD_RATE || 0) : 0;
      return num / 100;
    },
    // 区域里每个地区的总数和百分比
    getAreaShow(name) {
      return this.devFaultAreaObj[name] ? (`${this.devFaultAreaObj[name].TOTAL_SUM}(${Math.round((this.devFaultAreaObj[name].GOOD_RATE || 0) * 100) / 100}%)`) : '';
    },
    // 区域里每个地区的完好率
    getAreaRate(name) {
      return this.devFaultAreaObj[name] ? (this.devFaultAreaObj[name].GOOD_RATE || 0) : 0;
    },
    // 根据完好率的值给颜色
    getColor(num) {
      num = parseFloat(num);
      let arr = [98, 95, 80, 60]; // 颜色层次
      let txt = '';
      if (num >= arr[0]) {
        txt = 'color1';
      } else if (num >= arr[1]) {
        txt = 'color2';
      } else if (num >= arr[2]) {
        txt = 'color3';
      } else if (num >= arr[3]) {
        txt = 'color4';
      } else {
        txt = 'color5';
      }
      return txt;
    },
    // 整体及时修复率
    getRepairAll() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/worksTimelyRepairCollectAll`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            let num = res.resultList ? res.resultList[0].GOOD_RATE : 0;
            this.timelyRepairAll = num == 'null' ? 100 : num;
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 项目及时修复率
    getRepairOppm() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/worksTimelyRepairCollectOppm`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            let arr = res.resultList || [];
            let order = ['支队维护', '租赁维护', '外建维护']
            let rt = [];
            for (let i = 0; i < 3; i++) {
              let qw = arr.filter(tiem => tiem.OPPM_TYPE_NAME == order[i]);
              if (qw.length > 0) {
                rt.push(qw[0]);
              } else {
                rt.push({ OPPM_TYPE_NAME: order[i], GOOD_RATE: 'null' });
              }
            }
            this.timelyRepairList = rt;
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 工单数量
    getWorkorders() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/workordersRepairCollect`, { deptId: this.deptId }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.workordersInfo = res.resultList ? res.resultList[0] : {};
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 维护资源
    getStatFZJ() {
      this.$api.get(`${this.$config.efoms_HOST}/uums/stat4FZJ`, { orgId: this.deptId, roleNames: '维护人员,维护车辆,维护监理' }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.statInfo = res.resultList || {};
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 故障点位信息
    getGzList() {
      let _this = this;
      this.$api.get(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoList`, { devDeptId: this.deptId, devStatusCode: 'DEVICEALLSTATUS02', 'isControl': '0' }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.faultDevList = res.resultList || [];
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 获取故障点位的工单详情和点位详情
    getWkodsDetail(obj) {
      this.$api.get(`${this.$config.efoms_HOST}/workorders/detailByDevId`, { devId: obj.devId, devTypeCode: obj.devTypeCode }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.workodsDetailInfo = res.resultList || {};
            this.processList = this.workodsDetailInfo.workordersRecordList || [];
            let arr2 = this.workodsDetailInfo.workordersRecordMap.appointList || [];
            arr2 = arr2.filter(res => res.operResultCode === 'OPERRESULT07');
            this.appointInfoLast = arr2.length > 0 ? arr2[arr2.length - 1] : {};

            this.wkodsDetail = true;
            this.wkodsTab = 'tb1';
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });

      this.$api.get(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoById`, { devId: obj.devId, devTypeCode: obj.devTypeCode, pageSize: 1, currentPage: 1 }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.pointDetailInfo = res.resultList || {};
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    scrollIntoView(id) {
      document.getElementById(id).scrollIntoView();
      setTimeout(() => {
        this.wkodsTab = id;
      })
    },
    clickShowView(id) {
      this.wkodsTab = id;
    },
    // 消息--查询最近N条故障工单
    getLatelyFault() {
      this.$api.get(`${this.$config.efoms_HOST}/homeDevice/getDeviceLatelyFault`, {}, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            let arr = [];
            res.resultList.map(item => {
              arr.push(`${item.DEV_NAME}（${item.DEV_TYPE_NAME}） - ${item.FAILURE_DESCRIBLE}`);
            });
            this.faultTxt = arr.join('，');

            this.$nextTick(() => {
              let sudu = 6; // 代表速度，速度越大动画越慢
              let all = document.getElementById('animateBox').getBoundingClientRect().width / sudu;
              let width1 = document.getElementById('animate1').getBoundingClientRect().width;
              this.mtimeOne = width1 / all;
            });
          } else {
            Common.printErrorLog(res);
          }
        })
        .catch(err => {
          Common.printErrorLog(err);
        });
    },
    // 消息--查询最近N条通知
    getNotice() {
      // this.$api.get(`${this.$config.efoms_HOST}/homeDevice/getNoticeHisCollect`, {}, { token: this.token })
      //     .then(res => {
      //         if (res.appCode == 0) {
      //             let arr = [];
      //             let list = res.resultList || [];
      //             let forLt = list.slice(0, 100); //最多取100条
      //             res.resultList.map(item => {
      //                 arr.push(`${item.noticeContent}`);
      //             });
      //             this.notice = arr.join(' ');

      //             this.$nextTick(() => {
      //                 let sudu = 6; // 代表速度，速度越大动画越慢
      //                 let all = document.getElementById('animateBox').getBoundingClientRect().width / sudu;
      //                 let width2 = document.getElementById('animate2').getBoundingClientRect().width;
      //                 this.mtimeTwo = width2 / all;
      //             });
      //         } else {
      //             Common.printErrorLog(res);
      //         }
      //     })
      //     .catch(err => {
      //         Common.printErrorLog(err);
      //     });
    },

    // 获取用户信息
    getUserInfo() {
      let host = this.$config.efoms_HOST;
      let method = '/userCheck/selectUser';
      let token = Common.getQueryString("token");
      this.$api.getMethod(host, method, { token: token, systemKey: this.$config.systemKeyDev }, token).then(res => {
        if (res.appCode == 0) {
          this.userInfo = res.resultList || {};
          this.isBrigade = this.userInfo.userType == '0' && this.userInfo.orgId && this.userInfo.orgId.substr(0, 6) != '330100';
          if (this.isBrigade) this.deptId = this.userInfo.orgId ? (this.userInfo.orgId.substr(0, 6) + '000000') : '';

          this.initGet();
        }
      }).catch(err => {
        Common.printErrorLog(err);
      });
    },
    initGet(kind) {
      this.getFaultTotal();
      this.getFaultOppmType();
      this.getRepDevType();
      this.getFaultDevArea();
      this.getRepairAll();
      this.getRepairOppm();
      this.getWorkorders();
      this.getStatFZJ();
      this.getLatelyFault();
      this.getNotice();

      if (kind != 'update') {
        this.getGzList();
        let ifrm = document.getElementById("iframe_or");
        if (this.isIframeOnload) {
          console.log(1);
          this.handleIframe();
        } else {
          // ifrm.onload = function() {
          setTimeout(() => {
            console.log(2);
            this.isIframeOnload = true;
            this.handleIframe();
          });
          // };
        }
      }
    },
    handleIframe() {
      console.log('向地图传输了数据');
      if (document.getElementById("iframe_or").contentWindow) {
        // iframe传参
        // zoom:'' // 默认地图大小值
        // id:''//大队支队id
        // type:''//等级 1，2，3，4 分别代表支队 大队 中队 **
        let type = '1';
        let obj = { type: '1', token: this.token };
        if (this.deptId) {
          obj.type = '2';
          obj.id = this.deptId;
        }
        // if (this.deptPTObj[this.deptId]) {
        //     obj.type = '2';
        //     obj.id = this.deptPTObj[this.deptId];
        // }
        document.getElementById("iframe_or").contentWindow.postMessage(obj, "http://47.114.155.254:8088");
      }
    },

    // 字典类型接口
    getDicInfo(url, obj) {
      return this.$api.get(
        url, { token: this.token, data: JSON.stringify(obj) }, {}
      );
    },
    // 数据接口
    getDataInfo(url, obj) {
      return this.$api.get(
        url, obj, { token: this.token }
      );
    },

    // 详情数据
    // 大队/中队完好率、修复率
    getStatHomeDetail(type) {
      return new Promise((resolve, reject) => {
        let url = type == 'well' ? '/workordersRecord/statHomeDetail' : '/homeDevice/worksTimelyDetailByDept';
        this.$api.get(`${this.$config.efoms_HOST}${url}`, { parentDeptId: this.deptId, subDeptId: this.detDeptId, devTypeCode: this.detDevTypeCode.join(','), oppmType: this.detOppmCode, startTime: this.dialogTime.start, endTime: this.dialogTime.end, type: this.dateTypeCode }, { token: this.token })
          .then(res => {
            if (res.appCode == 0) {
              this.statHomeList = res.resultList || [];
            } else {
              Common.printErrorLog(res);
            }
            resolve(true);
            this.statHomeList.map(item => {
              if (item.deptId) this.getDetailListForDeptId(type, item);
            });
          })
          .catch(err => {
            Common.printErrorLog(err);
            resolve(true);
          });
      });
    },
    getDetailListForDeptId(type, data) {
      let url = type == 'well' ? '/workordersRecord/statHomeDetail/pertime' : '/homeDevice/worksTimelyDetailByDept/pertime';
      this.$api.get(`${this.$config.efoms_HOST}${url}`, { parentDeptId: data.deptId, subDeptId: '', devTypeCode: this.detDevTypeCode.join(','), oppmType: this.detOppmCode, startTime: this.dialogTime.start, endTime: this.dialogTime.end, type: this.dateTypeCode, totalNum: data.TOTAL_NUM }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.$set(data, 'detail', res.resultList || []);
          }
        });
    },
    // 设备完好率、修复率
    getStatDevTypeDetail(type) {
      return new Promise((resolve, reject) => {
        let url = type == 'well' ? '/workordersRecord/statHomeDetailByDevType' : '/homeDevice/worksTimelyDetailByDevType';
        this.$api.get(`${this.$config.efoms_HOST}${url}`, { parentDeptId: this.detDeptId || this.deptId, devTypeCode: this.detDevTypeCode.join(','), oppmType: this.detOppmCode, startTime: this.dialogTime.start, endTime: this.dialogTime.end, type: this.dateTypeCode }, { token: this.token })
          .then(res => {
            if (res.appCode == 0) {
              this.statDevTypeList = res.resultList || [];
            } else {
              Common.printErrorLog(res);
            }
            resolve(true);
            this.statDevTypeList.map(item => {
              if (item.DEV_TYPE_CODE) this.getDetailListForDevType(type, item);
            });
          })
          .catch(err => {
            Common.printErrorLog(err);
            resolve(true);
          });
      });
    },
    getDetailListForDevType(type, data) {
      let url = type == 'well' ? '/workordersRecord/statHomeDetailByDevType/pertime' : '/homeDevice/worksTimelyDetailByDevType/pertime';
      this.$api.get(`${this.$config.efoms_HOST}${url}`, { parentDeptId: this.detDeptId || this.deptId, devTypeCode: this.detDevTypeCode.join(','), oppmType: this.detOppmCode, startTime: this.dialogTime.start, endTime: this.dialogTime.end, type: this.dateTypeCode, devTypeCode: data.DEV_TYPE_CODE }, { token: this.token })
        .then(res => {
          if (res.appCode == 0) {
            this.$set(data, 'detail', res.resultList || []);
          }
        });
    },
    // 建设单位数据
    getOppmTable() {
      return new Promise((resolve, reject) => {
        this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectBySelType`, { parentDeptId: this.detDeptsId.join(',') || this.deptId, devTypeCode: this.detDevTypeCode.join(','), oppmTypeCode: this.detOppmCode, repSourceCode: this.repSourceCode, startTime: `${this.dialogTime.start ? (this.dialogTime.start + ' 00:00:00') : ''}`, endTime: `${this.dialogTime.end ? (this.dialogTime.end + ' 23:59:59') : ''}`, type: 'devDept' }, { token: this.token })
          .then(res => {
            if (res.appCode == 0) {
              this.tableData = res.resultList || [];
              this.currentPage = 1;
              this.tableShowData = this.tableData.slice(0, 10);
            } else {
              Common.printErrorLog(res);
            }
            resolve(true);
          })
          .catch(err => {
            Common.printErrorLog(err);
            resolve(true);
          });
      });
    },
    // 大队排名
    getRankTable() {
      let today = Common.dateFormat('yyyy-MM-dd', new Date());
      return new Promise((resolve, reject) => {
        this.$api.get(`${this.$config.efoms_HOST}/workordersRecord/statRank`, { devTypeCode: this.detDevTypeCode.join(','), deptId: this.detDeptsId.join(','), oppmDept: this.defendCode.join(','), supervison: this.supervisorCode.join(','), oppmType: this.detOppmCode, repSourceCode: this.repSourceCode, startTime: `${this.dialogTime.start ? (this.dialogTime.start) : today}`, endTime: `${this.dialogTime.end ? (this.dialogTime.end) : today}`, type: this.majorKey }, { token: this.token })
          .then(res => {
            if (res.appCode == 0) {
              this.tableData = res.resultList || [];
            } else {
              Common.printErrorLog(res);
            }
            resolve(true);
          })
          .catch(err => {
            Common.printErrorLog(err);
            resolve(true);
          });
      });
    },
    async detailGet(request) {
      if (request) {
        this.dialogLoading = true;
        let arr = this.$refs.popover;
        if (arr && arr.length > 0) {
          arr.map(e => {
            e.doClose();
          });
        }
        if (this.detailType == 'well') {
          await this.getStatHomeDetail(this.detailType);
          await this.getStatDevTypeDetail(this.detailType);
          this.dialogLoading = false;
        } else if (this.detailType == 'bad') {
          await this.getStatHomeDetail(this.detailType);
          await this.getStatDevTypeDetail(this.detailType);
          this.dialogLoading = false;
        } else if (this.detailType == 'table') {
          await this.getOppmTable();
          this.dialogLoading = false;
        } else if (this.detailType == 'rank') {
          await this.getRankTable();
          this.dialogLoading = false;
        }
      }
    },
    openDetail(type) {
      this.detailType = type;
      // 弹窗的辖区
      if (this.deptId) {
        this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { parentId: this.deptId, deptRank: 'DEPTRANK05', orderSeq: "sortNo asc" }).then(res => {
          this.detDeptList = res.resultList || [];
        });
      } else {
        this.detDeptList = this.deptList.filter(item => item.deptId != '');
      }

      this.dateTypeCode = 'day';
      //   this.detailGet(true);
      if (type == 'well') {
        let str = 'REPDEVTYPE01,REPDEVTYPE02,REPDEVTYPE03,REPDEVTYPE04,REPDEVTYPE08,REPDEVTYPE16';
        this.detDevTypeCode = str.split(',');
        this.$nextTick(() => {
          this.detailVisible = true;
        });
      } else if (type == 'rank') {
        this.majorKey = 'DEPT';
        this.detailVisible = true;
        this.detailGet(true);
      } else {
        this.detailVisible = true;
      }
    },
    closeDetail() {
      this.detailVisible = false;
      this.statHomeList = [];
      this.statDevTypeList = [];
      this.tableData = [];
      this.detailType = '';
      this.dateTypeCode = '';
      this.detDeptId = '';
      this.detDeptsId = [];
      this.detOppmCode = '';
      this.repSourceCode = '';
      this.detDevTypeCode = [];
      let str = 'REPDEVTYPE01,REPDEVTYPE02,REPDEVTYPE03,REPDEVTYPE04,REPDEVTYPE08,REPDEVTYPE16';
      // this.detDevTypeCode = str.split(',');
    },
    zdShow(val) {
      let str1 = val || '';
      let str2 = '';
      if (val == '总完好率' || val == '总修复率' || val == '总及时修复率') {
        // str1 = '总完好率';
        str2 = 'otherColor';
      }
      return { name: str1, class: str2 };
    }
  },
  created() {
    this.isHeadVisible = Common.getQueryString("head") != 'hide';
    this.isHeadMenuVisible = Common.getQueryString("headMenu") != 'hide';

    this.deptPTObj = {
      "330103000000": "48fa5b0908bb4fd088bf7c5d509cb464", // 下城大队
      "330102000000": "ec8e6173d9fd44309f3177336ae9cbef", // 上城大队
      "330105000000": "5f35893d0f8949d79e63196ac92da2c4", // 拱墅大队
      "330197000000": "a2b8cbcb1c5f406e904188f6da0e54e9", // 景区大队
      "330104000000": "5c24847b88b9456caaa2cda7f44c1366", // 江干大队
      "330108000000": "8dfe16585a03468e9033e35b141992a0", // 滨江大队
      "330106000000": "4b5ca26a23be4a878ae08670efced25e", // 西湖大队
    };
  },
  mounted() {
    let _this = this;
    this.token = Common.getQueryString("token");
    document.title = this.$config.cityName == 'hangzhou' ? '杭州交警智能设备运维态势' : document.title;
    // 大队
    this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptProperCode: 'DEPTPROPER01', deptRank: 'DEPTRANK04', orderSeq: "sortNo asc" }).then(res => {
      let arr = res.resultList || [];
      this.deptList = [{ deptId: '', deptName: '全部辖区' }, ...arr];
    });

    // 完好率类型
    this.wellTypeList = [{ dicCode: '1', dicName: '系统完好率' }, { dicCode: '0', dicName: '点位完好率' }];

    // 维护类型
    this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
      parentCode: "DEVICEOPPMTYPE"
    }).then(res => {
      this.oppmList = res.resultList || [];
    });
    // 申报来源
    this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
      parentCode: "REPAIRSSOURCE"
    }).then(res => {
      this.repSourceList = res.resultList || [];
    });
    // 系统
    this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
      parentCode: "REPDEVCATEGORY01"
    }).then(res => {
      this.devTypeList = res.resultList || [];

      let str = 'REPDEVTYPE01,REPDEVTYPE02,REPDEVTYPE03,REPDEVTYPE04,REPDEVTYPE08,REPDEVTYPE16';
      // this.detDevTypeCode = str.split(',');
    });
    // 维护单位
    this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { "deptTypeCode": 'OPSDEPTTYPE01' }).then(res => {
      this.defendList = res.resultList || [];
    });
    // 监理单位
    this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { "deptTypeCode": 'OPSDEPTTYPE04' }).then(res => {
      this.supervisorList = res.resultList || [];
    });

    // 心跳,统计在线人数
    let token = this.token;
    this.$api.post(`${this.$config.uums_HOST}/user/heartbeat?token=${token}&systemKey=${this.$config.systemKeyDev}`, {}, { token: token });
    setInterval(() => {
      this.$api.post(`${this.$config.uums_HOST}/user/heartbeat?token=${token}&systemKey=${this.$config.systemKeyDev}`, {}, { token: token });
    }, 5 * 60 * 1000);

    this.getUserInfo();
    // this.initGet();
    // // 一定时间后刷新页面数据
    setInterval(() => {
      this.initGet('update');
    }, 0.5 * 60 * 1000);

    // 监听窗口的变化
    let width = document.body.clientWidth;

    if (width <= 1366) {
      this.areaPillarMaxHeight = 70;
    } else if (width <= 1440) {
      this.areaPillarMaxHeight = 80;
    } else if (width <= 1600) {
      this.areaPillarMaxHeight = 90;
    } else {
      this.areaPillarMaxHeight = 100;
    }
    window.onresize = () => {
      let width = document.body.clientWidth;
      if (width <= 1366) {
        this.areaPillarMaxHeight = 70;
      } else if (width <= 1440) {
        this.areaPillarMaxHeight = 80;
      } else if (width <= 1600) {
        this.areaPillarMaxHeight = 90;
      } else {
        this.areaPillarMaxHeight = 100;
      }
    };
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/main.css";
@import "./home.less";
@import "./home_sb.less";

.absolute {
  position: absolute;
  left: 20px;
  top: 3px;

  &.posun {
    // left: 70px;
    // top: 7px;
    position: relative;
    left: 10px;
    top: -1px;

    /deep/ &.el-select {
      width: 100px;
    }
  }

  /deep/ &.el-select {
    width: 90px;

    .el-input__inner {
      background: transparent;
      border: none;
      height: 20px;
      line-height: 20px;
      padding: 0;
      font-size: 12px;
      color: #16f7fb;
    }

    .el-input__icon {
      line-height: 22px;
      font-size: 10px;
      color: #16f7fb;
    }

    ::-webkit-input-placeholder {
      /*Webkit browsers*/
      color: #16f7fb;
    }

    :-moz-placeholder {
      /*Mozilla Firefox 4 to 8*/
      color: #16f7fb;
    }

    :-ms-input-placeholder {
      /*Internet Explorer 10+*/
      color: #16f7fb;
    }
  }
}
</style>
<style>
/* 下拉框弹出样式 */
.selectClass.el-popper[x-placement^="bottom"] {
  margin-top: 4px;
}

.selectClass.noMrTop.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}

.selectClass.el-popper[x-placement^="bottom"] .popper__arrow {
  display: none;
}

.selectClass.el-select-dropdown {
  background: #040b19;
  border: 1px solid #124d78;
  border-radius: 0;
}

.selectClass .el-select-dropdown__list {
  padding: 0;
}

.selectClass .el-select-dropdown__item {
  font-size: 12px;
  padding: 0;
  /* width: 58px; */
  text-align: center;
  height: 24px;
  line-height: 24px;
  color: #d6d4d4;
  font-weight: 100;
}

.selectClass .el-select-dropdown__item.selected,
.selectClass.is-multiple .el-select-dropdown__item.selected {
  color: #ffffff;
  font-weight: 700;
}

.selectClass .el-select-dropdown__item.hover,
.selectClass .el-select-dropdown__item:hover {
  background: rgba(0, 46, 117, 0.96);
}

.selectClass.is-multiple .el-select-dropdown__item.selected,
.selectClass.is-multiple .el-select-dropdown__item.selected.hover {
  background: rgba(0, 46, 117, 0.96);
}

/* 下拉框弹出样式 */

/* 时间弹窗样式 */
.selectDate.el-picker-panel {
  transform: translateX(-27px);
  background: #040b19;
  border: 1px solid #124d78;
}

.selectDate .el-date-picker__header--bordered,
.selectDate .el-date-table th,
.selectDate.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #124d78;
}

.selectDate.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #040b19;
}

.selectDate table td .cell,
.selectDate .el-date-picker__header-label,
.selectDate .el-picker-panel__icon-btn,
.selectDate .el-date-table th,
.selectDate.el-picker-panel {
  color: #d6d4d4;
}

.selectDate .el-date-table td.next-month,
.selectDate .el-date-table td.prev-month {
  color: #606266;
}

.selectDate table td .cell.actvie,
.selectDate table td .cell:hover,
.selectDate table td.today .cell,
.selectDate .el-date-picker__header-label.active,
.selectDate .el-date-picker__header-label:hover,
.selectDate .el-picker-panel__icon-btn:hover {
  color: #409eff;
}

.selectDate table td.current:not(.disabled) .cell {
  color: #fff;
  background-color: #409eff;
  border-radius: 100px;
}

.selectDate .el-date-table.is-week-mode .el-date-table__row.current div,
.selectDate .el-date-table.is-week-mode .el-date-table__row:hover div {
  background: rgba(0, 46, 117, 0.96);
}

/* 浮窗样式 */
.el-popover.pop-table {
  background: rgba(0, 46, 117, 0.96);
  border: 1px solid #2b68c8;
  box-shadow: 0 11px 20px -6px rgba(9, 23, 73, 0.91);
  border-radius: 2px;
}

.el-popover.pop-table .popper__arrow {
  display: none;
}

/* 浮窗样式 */

/* popover样式 */
.el-pover.el-popper[x-placement^="right"],
.el-pover.el-popper[x-placement^="left"] {
  padding: 6px 0;
  background: rgba(2, 33, 66, 0.9);
  border-color: #3a5ca2;
  box-shadow: 0 2px 4px 0 rgba(7, 6, 51, 0.5);
  margin-left: 10px;
  margin-right: 10px;
}

.el-pover.el-popper[x-placement^="left"] .popper__arrow {
  border-left-color: #3a5ca2;
}

.el-pover.el-popper[x-placement^="left"] .popper__arrow::after {
  border-left-color: rgba(2, 33, 66, 0.9);
}

.el-pover.el-popper[x-placement^="right"] .popper__arrow {
  border-right-color: #3a5ca2;
}

.el-pover.el-popper[x-placement^="right"] .popper__arrow::after {
  border-right-color: rgba(2, 33, 66, 0.9);
}

.pover-box {
  /* max-height: 400px; */
}

.pover-box .el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 435px;
  margin-bottom: 0 !important;
}

.pover-box .el-scrollbar__bar.is-horizontal {
  opacity: 0;
}

.pover-ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: #c5daff;
  height: 18px;
  overflow: hidden;
}

.pover-ul span {
  width: 40px;
  text-align: right;
  font-size: 12px;
  margin-right: 10px;
  white-space: nowrap;
  text-align: right;
}

.pover-ul .el-progress {
  flex: 1;
}

.pover-ul .el-progress__text {
  font-size: 12px !important;
  color: #c5daff;
}

.pover-ul .el-progress-bar__outer {
  background-color: #2a4363;
  border-radius: 0;
}

.pover-ul .el-progress-bar__inner {
  border-radius: 0;
}

/* popover样式 */

.multSlt .content-select,
.dialog-select {
  width: 200px;
}

.multSlt .content-select .el-input__inner,
.dialog-select .el-input__inner {
  line-height: 30px;
  height: 30px;
  background: #0f2e59;
  border-color: #3068b7;
  border-radius: 0;
  color: #fff;
  font-size: 12px;
}

.multSlt .content-select .el-input__icon,
.dialog-select .el-input__icon {
  line-height: 30px;
  color: #a4caff;
}
</style>