<template>
    <div class="ej-main">
        <div class="layoutss">
            <Header v-show="isHeadVisible"></Header>
            <div class="s-map" id="mapcontent"></div>
            <div class="s-content">
                <div class="s-left">
                    <div class="s-left-top">
                        <h5>路段黑点分析</h5>
                        <div class="s-left-top-content">
                            <ul class="s-left-ul">
                                <li v-for="(item,index) in roadList" :key="index" :class="{'active':index==roadLeftTopIndex}" @click="roadLeftTopIndex=index">
                                    <p>{{index+1}} {{item.name}}</p>
                                </li>
                            </ul>
                            <div class="s-left-img">
                                <p class="num">20</p>
                                <p class="text">设施更换次数</p>
                                <span class="a1"><i>12</i> 标牌</span>
                                <span class="a2"><i>4</i> 标线</span>
                                <span class="a3"><i>4</i> 护栏</span>
                            </div>
                        </div>
                    </div>
                    <div class="s-left-middle">
                        <h5>路口标牌总数 <span>前5名</span></h5>
                        <div class="s-left-middle-content">
                            <ul>
                                <li v-for="(item, index) in crossRankList" :key="index" :title="`${item.CROSSNAME} ${item.TOTAL_SUM}`">
                                    {{item.CROSSNAME}} {{item.TOTAL_SUM}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="s-left-bottom">
                        <h5>路段标牌总数 <span>前5名</span></h5>
                        <div class="s-left-bottom-content">
                            <ul>
                                <li v-for="(item, index) in blockRankList" :key="index">
                                    <div class="b-text">
                                        <p class="b-p">
                                            <span class="l-auto" :title="item.BLOCKNAME">{{item.BLOCKNAME}}</span>
                                            <span>长度{{item.BLOCKLEN}}m</span>
                                        </p>
                                        <span>标牌 {{item.TOTAL_SUM}}</span>
                                    </div>
                                    <div class="b-line">
                                        <div class="b-left" :style="{'width':`${item.TOTAL_SUM*100/blockNumMax}%`}"></div>
                                        <div class="b-right"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="s-center">
                    <ul class="s-center-top">
                        <li v-for="(item,index) in facTotalList" :key="index" @click="handleLayer(item.CODE)" :class="{'active':layerCode==item.CODE}">
                            <p>{{item.CODE!='06'?item.TOTAL_SUM:((item.TOTAL_RATE*100)+'%')}}</p>
                            <span>{{item.NAME}}</span>
                        </li>
                    </ul>
                    <div class="s-center-bottom" v-show="bottomVideoList.length>0">
                        <ul v-show="videosVisible">
                            <template v-for="item in 4">
                                <li :key="item">
                                    <template v-if="bottomVideoList.length>=item">
                                        <p>
                                            <span class="p-span1"><i class="el-icon-video-camera"></i>录像{{item}}</span>
                                            <span class="p-span2" :title="bottomVideoList[item-1].crossName">{{bottomVideoList[item-1].crossName}}</span>
                                        </p>
                                        <div>
                                            <video v-if="bottomVideoList[item-1].videoUrl" :src="bottomVideoList[item-1].videoUrl"></video>
                                            <i v-else class="el-icon-video-camera"></i>
                                        </div>
                                    </template>
                                </li>
                            </template>
                        </ul>
                        <i class="el-icon-arrow-up icon-switch" :class="{'active':videosVisible}" @click="videosVisible=!videosVisible"></i>
                    </div>
                </div>

                <div class="s-right">
                    <div class="s-right-top">
                        <h5><i @click="getNextData('week')">下周工作</i> / <i @click="getNextData('month')">下月工作</i></h5>
                        <div class="s-right-top-content">
                            <div class="srtc-scroll-box">
                                <el-scrollbar class="srtc-scroll">
                                    <ul>
                                        <li v-for="(item, index) in nextDataList" :key="index" :title="`${item.FACILITY_NAME}${item.TYPE_NAME}待养护`">
                                            {{item.FACILITY_NAME}}{{item.TYPE_NAME}}待养护
                                        </li>
                                    </ul>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                    <div class="s-right-middle1">
                        <h5>标牌使用年限TOP5</h5>
                        <div class="s-right-a-content" style="padding-top: 10px;">
                            <h6>标牌平均寿命30月</h6>
                            <div class="img img1"></div>
                        </div>
                    </div>
                    <div class="s-right-middle2">
                        <h5>标线使用年限TOP5</h5>
                        <div class="s-right-a-content">
                            <h6>标线平均寿命20月</h6>
                            <div class="img img2"></div>
                        </div>
                    </div>
                    <div class="s-right-bottom">
                        <h5>护栏使用年限TOP5</h5>
                        <div class="s-right-a-content">
                            <h6>护栏平均寿命20月</h6>
                            <div class="img img3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Header from "./headerss.vue";
    var _map;
    export default {
        components: {
            Header
        },
        data() {
            return {
                title: '',
                token: "",
                roadLeftTopIndex: 0,
                roadList: [],
                crossRankList: [],
                blockRankList: [],
                blockNumMax: 1,
                nextDataList: [],
                facTotalList: [],
                videosVisible: false,
                bottomVideoList: [],
                layerCode: '', // 地图显示图层对应的code

                userInfo: {},
                isHeadVisible: false,
                isHeadMenuVisible: true
            };
        },
        methods: {
            getFacCrossRank() {
                this.$api.get(`${this.$config.efoms_HOST}/homeFacility/facilitySignRankingByCross`, { sortType: 'desc', rowNumber: '5' }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.crossRankList = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getFacBlockRank() {
                this.$api.get(`${this.$config.efoms_HOST}/homeFacility/facilitySignRankingByBlock`, { sortType: 'desc', rowNumber: '5' }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.blockRankList = res.resultList || [];
                            this.blockNumMax = 1;
                            this.blockRankList.map(item => {
                                this.blockNumMax = item.TOTAL_SUM > this.blockNumMax ? item.TOTAL_SUM : this.blockNumMax;
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getNextData(type) {
                this.$api.get(`${this.$config.efoms_HOST}/homeFacility/facilityNextOppmData`, { period: type ? type : 'week' }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.nextDataList = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getFacTotal() {
                this.$api.get(`${this.$config.efoms_HOST}/homeFacility/trafficFacilityTotalCollect`, { period: 'week' }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.facTotalList = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 处理图层
            handleLayer(code) {
                // console.log(code);
                // 01常规路口，02灯控路口，03道路总里程，04护栏总数，05标牌总数，06标线覆盖率
                let _this = this;
                if (!window.json1) window.json1 = {};
                if (!window.json2) window.json2 = {};
                this.layerCode = window.historyCode == code ? '' : code;
                switch (this.layerCode) {
                    case '01':
                        if (!window.json1.id) {
                            window.json1 = {
                                "id": "cross01",
                                "type": "symbol",
                                "source": {
                                    "type": "geojson",
                                    "data": `${_this.$config.mapPattonData}&cql_filter=CROSSTYPE<>'CROSSTYPE00'`
                                },
                                "click": true,
                                "layout": {
                                    "visibility": "none",
                                    "icon-allow-overlap": true,
                                    "icon-image": "cross0",
                                    "icon-size": 0.8
                                }
                            };
                            _map.addLayer(window.json1);
                        }
                        _map.setLayerVisibleById(window.json1.id, true);
                        break;
                    case '02':
                        if (!window.json2.id) {
                            window.json2 = {
                                "id": "cross02",
                                "type": "symbol",
                                "source": {
                                    "type": "geojson",
                                    "data": `${_this.$config.mapPattonData}&cql_filter=CROSSTYPE='CROSSTYPE00'`
                                },
                                "click": true,
                                "layout": {
                                    "visibility": "none",
                                    "icon-allow-overlap": true,
                                    "icon-image": "cross0",
                                    "icon-size": 0.8
                                }
                            };
                            _map.addLayer(window.json2);
                        }
                        _map.setLayerVisibleById(window.json2.id, true);
                        break;
                    case '03':
                        _map.setLayerVisibleById('roadnet1', true);
                        _map.setLayerVisibleById('roadnet2', true);
                        _map.setLayerVisibleById('roadnet3', true);
                        break;
                    case '04':

                        break;
                    case '05':
                        _map.setLayerVisibleById('sign', true);
                        break;
                    case '06':

                        break;
                    default:

                        break;
                }
                this.hideLayer(window.historyCode);
                window.historyCode = this.layerCode;
            },
            // 隐藏图层
            hideLayer(code) {
                _map.destroyInfoSymbol("lay_popup");
                if (code == '01') {
                    _map.setLayerVisibleById(window.json1.id, false);
                } else if (code == '02') {
                    _map.setLayerVisibleById(window.json2.id, false);
                } else if (code == '03') {
                    _map.setLayerVisibleById('roadnet1', false);
                    _map.setLayerVisibleById('roadnet2', false);
                    _map.setLayerVisibleById('roadnet3', false);
                } else if (code == '04') {

                } else if (code == '05') {
                    _map.setLayerVisibleById('sign', false);
                } else if (code == '06') {

                }
            },
            // 图层弹窗处理
            layerPopup(data) {
                console.log(data);
                _map.destroyInfoSymbol("lay_popup");
                if (data.id == "cross01" || data.id == "cross02") {
                    this.$api.get(`${this.$config.ubms_HOST}/CrossInfo/getCrossInfo.htm`, { token: this.token, data: { crossId: data.properties.CROSSID } }, { token: this.token })
                        .then(res => {
                            if (res.appCode == 0) {
                                let obj = res.resultList && res.resultList.length > 0 ? res.resultList[0] : {};
                                let arr = obj.canalizFile ? obj.canalizFile.split(',') : [];
                                let imgs = [];
                                let videos = [];
                                arr.map(item => {
                                    if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item)) {
                                        imgs.push(item);
                                    }
                                    if (/\.(mp4|MP4)$/.test(item)) {
                                        videos.push(item);
                                    }
                                });
                                _map.creatInfoSymbol("lay_popup",
                                    `<div class="case-four">
                                        <div class="four-one">
                                            ${imgs.length>0?('<img src="'+imgs[0]+'"  alt="image"/>'):'<i class="el-icon-picture-outline"></i>'}
                                        </div>
                                        <div class="four-one">
                                            ${imgs.length>0?('<video src="'+videos[0]+'" autoplay="autoplay"></video>'):'<i class="el-icon-video-camera"></i>'}
                                        </div>
                                    </div>
                                    <div class="case-four">
                                        <div class="four-one">
                                            ${imgs.length>0?('<img src="'+imgs[0]+'"  alt="image"/>'):'<i class="el-icon-picture-outline"></i>'}
                                        </div>
                                        <div class="four-one">
                                            <p>路口名称：<span title="${obj.crossName}">${obj.crossName}</span></p>
                                            <p>路口子类：<span title="${obj.crossClassName}">${obj.crossClassName}</span></p>
                                            <p>路口类型：<span title="${obj.crossTypeName}">${obj.crossTypeName}</span></p>
                                            <p>所属区域：<span title="${obj.regionName}">${obj.regionName}</span></p>
                                        </div>
                                    </div>`,
                                    [data.properties.COORDX, data.properties.COORDY], [0, -10], "bottom", true);
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            Common.printErrorLog(err);
                        });
                } else if (data.id.indexOf('roadnet') > -1) {
                    let xy = [];
                    if (data.coordinates && data.coordinates[0] && data.coordinates[0][0] && typeof(data.coordinates[0][0]) != "number") {
                        xy = data.coordinates[0][0];
                    } else if (data.coordinates && data.coordinates[0]) {
                        xy = data.coordinates[0];
                    }
                    // console.log(xy);
                    _map.creatInfoSymbol("lay_popup",
                        `<div class="the-one">
                            <p>路段名称：<span title="${data.properties.BLOCKNAME}">${data.properties.BLOCKNAME}</span></p>
                            <p>路段类型：<span title="${data.properties.BLOCKTYPENAME}">${data.properties.BLOCKTYPENAME}</span></p>
                            <p>路段长度：<span title="${data.properties.BLOCKLEN}">${data.properties.BLOCKLEN}</span></p>
                            <p>路段状态：<span title="${data.properties.STATUSNAME}">${data.properties.STATUSNAME}</span></p>
                        </div>`,
                        xy, [0, -10], "bottom", true);
                } else if (data.id == 'sign') {
                    _map.creatInfoSymbol("lay_popup",
                        `<div class="the-one">
                            <p>标牌名称：<span title="${data.properties.NAME}">${data.properties.NAME}</span></p>
                            <p>标牌子类：<span title="${data.properties.DEVTYPE_NAME}">${data.properties.DEVTYPE_NAME}</span></p>
                            <p>所属部门：<span title="${data.properties.DEPTNAME}">${data.properties.DEPTNAME}</span></p>
                            <p>所属区域：<span title="${data.properties.REGION_NAME}">${data.properties.REGION_NAME}</span></p>
                        </div>`,
                        [data.properties.LONGITUDE, data.properties.LATITUDE], [0, -10], "bottom", true);
                }

            },
            // 底部视频
            getBottomVideo() {
                this.$api.get(`${this.$config.ubms_HOST}/CrossInfo/getCrossInfo.htm`, { token: this.token, data: { isImportant: 'COMMONVALUE02' } }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.bottomVideoList = res.resultList || [];
                            this.bottomVideoList.map(item => {
                                if (/\.(mp4|MP4)$/.test(item.canalizFile)) {
                                    let arr = item.canalizFile.split(',');
                                    arr.map(item2 => {
                                        if (/\.(mp4|MP4)$/.test(item2)) {
                                            item.videoUrl = item2;
                                        }
                                    });
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
            // serverpush
            tipsPush(code) {
                let _this = this;
                ServerPush.receive(code, 'message', (res) => {
                    console.log(res);
                });
            },
            // 获取用户信息
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/userCheck/selectUser';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token }, token).then(res => {
                    if (res.appCode == 0) {
                        this.userInfo = res.resultList || {};
                    }
                }).catch(err => {
                    Common.printErrorLog(err);
                });
            },
            initGet() {
                this.getFacCrossRank();
                this.getFacBlockRank();
                this.getNextData();
                this.getFacTotal();
                this.getBottomVideo();
                this.roadList = [{ name: '赣江中大道' }, { name: '迎宾大道' }, { name: '沿江南大道' }, { name: '九龙大道龙虎山大道' }, { name: '东祥路（东莲路-汇仁大道）' }, { name: '象山北路叠山路' }];
            }
        },
        created() {
            this.isHeadVisible = Common.getQueryString("head") != 'hide';
            this.isHeadMenuVisible = Common.getQueryString("headMenu") != 'hide';
            if (this.isHeadMenuVisible) {
                this.getUserInfo();
            }
        },
        mounted() {
            let _this = this;
            this.token = Common.getQueryString("token");

            if (this.isHeadMenuVisible) {
                this.tipsPush('efoms_heartbeat');
            }

            this.initGet();
            // 一定时间后刷新页面数据
            setInterval(() => {
                this.initGet();
            }, 1 * 60 * 1000);

            // 监听窗口的变化，实时调用 echarts的 resize事件
            // window.onresize = () => {
            //     this.$refs.echarts1.resize();
            // }

            _map = new EJMap("mapcontent", {
                zoom: 12,
                pitch: 45,
                bearing: -17.6,
                minZoom: 1,
                maxZoom: 17,
                fullScreen: true,
                navigation: true,
                measure: true,
                scalebar: true,
                style: "Blue",
                config: "efoms"
            });
            _map.addEventListener(EJMap.Events.onLayerAdded, function(e) {
                console.log(e);
            });
            // _map.addEventListener(EJMap.Events.onMapClick, function(e) {
            //     console.log(e);
            // });
            // 图层元素点击事件
            _map.addEventListener(EJMap.Events.onFeatureClick, function(e) {
                // console.log(e);
                _this.layerPopup(e);
            });
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "./home.less";
</style>
<style lang="less">
    .s-map {
        .mapboxgl-popup-anchor-bottom {
            max-width: 320px !important;

            .mapboxgl-popup-tip {
                border-top-color: #05203A;
            }
        }

        .mapboxgl-popup-content {
            background: #05203A;
            padding: 4px;

            .mapboxgl-popup-close-button {
                color: #999;
                font-size: 20px;
                z-index: 10;
                position: absolute;
                right: 0;
                top: 0;
                border: 0;
                border-radius: 0 3px 0 0;
                cursor: pointer;
                background-color: transparent;
            }

            .case-four {
                display: flex;

                &+.case-four {
                    margin-top: 2px;
                }

                .four-one {
                    width: 150px;
                    height: 100px;
                    color: #9ACACF;
                    text-align: center;

                    &+.four-one {
                        margin-left: 2px;
                    }

                    img,
                    video {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }

                    i {
                        font-size: 36px;
                        margin-top: 32px;
                    }

                    p {
                        transform: scale(0.9);
                        margin-top: 4px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: left;
                    }
                }
            }

            .the-one {
                width: 180px;
                height: 100px;
                color: #9ACACF;

                p {
                    transform: scale(0.9);
                    margin-top: 4px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: left;
                }
            }
        }
    }
</style>