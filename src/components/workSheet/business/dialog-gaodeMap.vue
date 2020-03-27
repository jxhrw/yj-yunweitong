<template>
    <el-dialog title="定位" :visible.sync="visible" width='560px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
        <div class="dialog-main">
            <div class="revoke-reason">
                <!-- <el-input v-model="loactName" placeholder="" size='mini' class="content-select" style="width: 450px;" :clearable="true" @keyup.enter.native="searchLocat"></el-input>
                <el-button @click="searchLocat" size='mini' class="submit">搜索</el-button> -->
                <label class="dialog-label">查询地址</label>
                <input type="text" id="tipinput" class="tip-input" />
            </div>
            <div>
                <div class="mapBox" id="mapContainer" style="width:100%;height:300px;"></div>
                <div id="searchResults"></div>
            </div>
            <div style="margin-top: 10px;">
                <label class="dialog-label">选中地址</label>
                <el-input v-model="selectLocat" placeholder="" size='mini' class="content-select" style="width: 450px;" :clearable="true"></el-input>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure" size='mini' class="submit">提 交</el-button>
            <el-button @click="visible = false" size='mini' class="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    var MAPCONTAIN; // 地图实例
    export default {
        props: ['dialogVisible'],
        data() {
            return {
                num: 0, // 第几次打开
                visible: false,
                allMarkers: [], // 地图上当前所有的点
                loactName: '',
                selectLocat: '', //地图弹窗选中的地址
                selectLnglat: {}, // 地图弹窗选中的坐标
                placeSearch: null,
                district: null, //行政区边界查询
                polygons: [],
            }
        },
        watch: {
            dialogVisible(val) {
                this.visible = val;
                if (val && this.num == 0) {
                    this.num++;
                    this.$nextTick(() => {
                        let _this = this;
                        let lg = this.$config.Gaode_Map_Center ? this.$config.Gaode_Map_Center.split(",") : [];
                        MAPCONTAIN = new AMap.Map('mapContainer', {
                            zoom: 10,
                            center: lg.length == 2 ? lg : undefined
                        });

                        //输入提示
                        var autoOptions = {
                            input: 'tipinput',
                            city: _this.$config.cityName,
                            citylimit: true, //是否强制限制在设置的城市内搜索
                        };
                        var auto = new AMap.Autocomplete(autoOptions);
                        this.placeSearch = new AMap.PlaceSearch({
                            map: MAPCONTAIN
                        }); //构造地点查询类
                        AMap.event.addListener(auto, "select", this.select); //注册监听，当选中某条记录时会触发

                        this.drawBounds();

                        MAPCONTAIN.on('click', function(e) {
                            let point = e.lnglat.getLng() + ',' + e.lnglat.getLat();
                            var geocoder = new AMap.Geocoder({
                                city: "010", //城市，默认：“全国”
                                radius: 1000 //范围，默认：500
                            });
                            var marker = new AMap.Marker();
                            var lnglat = point.split(',');
                            MAPCONTAIN.remove(_this.allMarkers);
                            _this.allMarkers.push(marker);
                            MAPCONTAIN.add(marker);
                            marker.setPosition(lnglat);

                            geocoder.getAddress(lnglat, function(status, result) {
                                if (status === 'complete' && result.regeocode) {
                                    _this.selectLocat = result.regeocode.formattedAddress;
                                    _this.selectLnglat = { x: lnglat[0], y: lnglat[1] };
                                } else {
                                    console.log('根据经纬度查询地址失败');
                                }
                            });
                        });
                    })
                }
            },
            visible(val) {
                this.$emit('update:dialogVisible', val);
            }
        },
        methods: {
            // searchLocat() {
            //     let _this = this;
            //     this.$api.get(`https://restapi.amap.com/v3/place/text?keywords=${this.loactName}&output=json&offset=10&page=1&key=28674ee9ba9db997b659143cc87f9a2c&extensions=all`).then(res => {
            //         console.log(res);
            //         MAPCONTAIN.remove(this.allMarkers); // 移除所有点
            //         if (res.pois && res.pois.length > 0) {
            //             MAPCONTAIN.setCenter(res.pois[0].location.split(',')); // 已第一个地位居中
            //             res.pois.map(item => {
            //                 let arr = item.location.split(',');
            //                 let marker = new AMap.Marker({
            //                     position: arr,
            //                     title: item.address,
            //                     clickable: true
            //                 });
            //                 marker.address = item.address;
            //                 this.allMarkers.push(marker);
            //                 //点标注的点击事件
            //                 marker.on('click', function(e) {
            //                     _this.selectLocat = e.target.address;
            //                     _this.selectLnglat = { x: e.lnglat.lng, y: e.lnglat.lat };
            //                 });
            //                 MAPCONTAIN.add(marker);
            //             });
            //         }
            //     })
            // },
            sure() {
                this.visible = false;
                // 回调数据
                this.$emit('callback', {
                    address: this.selectLocat,
                    lnglat: {
                        x: this.selectLnglat.x,
                        y: this.selectLnglat.y
                    }
                });
            },
            select(e) {
                console.log(e)
                // this.placeSearch.setCity(e.poi.adcode);
                // this.placeSearch.search(e.poi.name); //关键字查询查询
                MAPCONTAIN.remove(this.allMarkers);
                let marker = new AMap.Marker({
                    position: [e.poi.location.lng, e.poi.location.lat],
                    title: e.poi.name,
                    clickable: true
                });
                marker.address = e.poi.district + e.poi.address;
                this.allMarkers.push(marker);
                //点标注的点击事件
                // marker.on('click', function(e) {
                //     _this.selectLocat = e.target.address;
                //     _this.selectLnglat = { x: e.lnglat.lng, y: e.lnglat.lat };
                // });
                MAPCONTAIN.add(marker);
                MAPCONTAIN.setCenter([e.poi.location.lng, e.poi.location.lat]); //设置地图中心点

                this.selectLocat = e.poi.district + e.poi.address;
                this.selectLnglat = { x: e.poi.location.lng, y: e.poi.location.lat };
            },
            drawBounds() {
                let _this = this;
                //加载行政区划插件
                if (!this.district) {
                    //实例化DistrictSearch
                    var opts = {
                        subdistrict: 0, //获取边界不需要返回下级行政区
                        extensions: 'all', //返回行政区边界坐标组等具体信息
                        level: 'city' //查询行政级别为 市
                    };
                    this.district = new AMap.DistrictSearch(opts);
                }
                //行政区查询
                let city = '';
                if (this.$config.cityName == 'hangzhou') city = '杭州';
                if (this.$config.cityName == 'nanchang') city = '南昌';
                if (this.$config.cityName == 'jiujiang') city = '九江';
                this.district.search(city, function(status, result) {
                    MAPCONTAIN.remove(_this.polygons) //清除上次结果
                    _this.polygons = [];
                    var bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0.4,
                                fillColor: '#80d8ff',
                                strokeColor: '#0091ea',
                                bubble: true
                            });
                            _this.polygons.push(polygon);
                        }
                    }
                    MAPCONTAIN.add(_this.polygons)
                    // MAPCONTAIN.setFitView(_this.polygons); //视口自适应
                });
            }
        },
        mounted() {}
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/less/dialog.less";

    .tip-input {
        border-radius: 0;
        background: #F9FAFC;
        border: 1px solid #E1E7ED;
        height: 28px;
        line-height: 28px;
        box-sizing: border-box;
        display: inline-block;
        color: #606266;
        outline: 0;
        padding: 0 15px;
        width: 450px;
    }
</style>
<style>
    .amap-sug-result {
        z-index: 20001;
        box-sizing: border-box;
    }
</style>