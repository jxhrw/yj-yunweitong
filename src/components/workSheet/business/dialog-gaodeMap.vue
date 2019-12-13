<template>
    <el-dialog title="定位" :visible.sync="visible" width='560px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
        <div class="dialog-main">
            <div class="revoke-reason">
                <el-input v-model="loactName" placeholder="" size='mini' class="content-select" style="width: 450px;" :clearable="true" @keyup.enter.native="searchLocat"></el-input>
                <el-button @click="searchLocat" size='mini' class="submit">搜索</el-button>
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
                        MAPCONTAIN.on('click', function(e) {
                            let point = e.lnglat.getLng() + ',' + e.lnglat.getLat();
                            var marker = new AMap.Marker();
                            var lnglat = point.split(',');
                            MAPCONTAIN.remove(_this.allMarkers);
                            _this.allMarkers.push(marker);
                            MAPCONTAIN.add(marker);
                            marker.setPosition(lnglat);

                            _this.$api.get(`${_this.$config.Gaode_Map_regeo}?location=${point}&output=json&radius=1000&key=${_this.$config.Gaode_Map_Key}&extensions=all`).then(res => {
                                if (res.regeocode) {
                                    _this.selectLocat = res.regeocode.formatted_address || '';
                                    _this.selectLnglat = { x: lnglat[0], y: lnglat[1] };
                                }
                            })
                        });
                    })
                }
            },
            visible(val) {
                this.$emit('update:dialogVisible', val);
            }
        },
        methods: {
            searchLocat() {
                let _this = this;
                this.$api.get(`${this.$config.Gaode_Map_Get}?keywords=${this.loactName}&output=json&offset=10&page=1&key=${this.$config.Gaode_Map_Key}&extensions=all`).then(res => {
                    console.log(res);
                    MAPCONTAIN.remove(this.allMarkers); // 移除所有点
                    if (res.pois && res.pois.length > 0) {
                        MAPCONTAIN.setCenter(res.pois[0].location.split(',')); // 已第一个地位居中
                        res.pois.map(item => {
                            let arr = item.location.split(',');
                            let marker = new AMap.Marker({
                                position: arr,
                                title: item.address,
                                clickable: true
                            });
                            marker.address = item.address;
                            this.allMarkers.push(marker);
                            //点标注的点击事件
                            marker.on('click', function(e) {
                                _this.selectLocat = e.target.address;
                                _this.selectLnglat = { x: e.lnglat.lng, y: e.lnglat.lat };
                            });
                            MAPCONTAIN.add(marker);
                        });
                    }
                })
            },
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
            }
        },
        mounted() {}
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/less/dialog.less";
</style>