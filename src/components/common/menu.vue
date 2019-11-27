<template>
    <el-scrollbar class="scrollview">
        <el-menu class="el-menu-vertical-demo" :class="{'wdTp':!isCollapse}" background-color="#1F212E" text-color="#646F7D" :default-active="keyPath" active-text-color="#00C187" unique-opened :collapse="isCollapse" router :default-openeds="defaultOpeneds" @select="menuSelect">
            <i class="menu-collapse" @click="isCollapse=!isCollapse"></i>
            <template v-for="(item, idx) in menus">
                <template v-if="item.checked">
                    <el-submenu v-if="item.children.length>0" :key="idx" :disabled="isabled(item.checked)" :index="item.rightName||''">
                        <template slot="title">
                            <i class="icon-menu-tools" :class="item.rightElCss||'menu-repair'"></i>
                            <span slot="title">{{item.rightName}}</span>
                        </template>

                        <template v-for="(cItem, cIdx) in item.children">
                            <template v-if="cItem.children && cItem.children.length>0">
                                <el-submenu :key="cIdx+'a'" v-if="cItem.checked" :index="cItem.rightName||''">
                                    <template slot="title">{{cItem.rightName}}</template>
                                    <el-menu-item v-for="(dItem, dIdx) in cItem.children" :key="dIdx" :index="dItem.rightUrl">{{dItem.rightName}}</el-menu-item>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item v-if="cItem.checked" class="el-menu-vertical-demo" :key="cIdx+'b'" :index="cItem.rightUrl">{{cItem.rightName}}</el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :key="idx" class="el-menu-vertical-demo no-child" :index="item.rightUrl">
                        <i class="icon-menu-tools" :class="item.rightElCss||'menu-repair'"></i>
                        <span slot="title">{{item.rightName}}</span>
                    </el-menu-item>
                </template>

            </template>



            <!-- <i class="menu-arrow el-icon-d-arrow-left" v-if="!isCollapse" @click="isCollapse=!isCollapse"></i>
        <i class="menu-arrow el-icon-d-arrow-right" v-if="isCollapse" @click="isCollapse=!isCollapse"></i> -->
        </el-menu>
    </el-scrollbar>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    export default {
        props: ["menusList"],
        data() {
            return {
                keyPath: '',
                defaultOpeneds: [],
                isCollapse: false,
                menus: [],
                token: ''
            };
        },
        watch: {
            menusList(val) {
                this.initMenu(val);
            }
        },
        methods: {
            menuSelect(index, indexPath) {
                // console.log(index, indexPath);
                sessionStorage.setItem('menuSeclect', '1');
                sessionStorage.setItem('activeKey', indexPath);
            },
            isabled(isabled) {
                return !isabled;
            },
            initMenu(val) {
                if (val.length > 0) {
                    this.token = Common.getQueryString("token");
                    let arr = val[0].children || [];
                    arr = arr.filter(val => !!val.checked);
                    for (let i = 0; i < arr.length; i++) {
                        let child = arr[i].children || [];
                        arr[i].children = child.filter(val => !!val.checked);
                    }
                    this.menus = arr;

                    setTimeout(() => {
                        if (this.$route.path != '/') {
                            let opened = [];
                            let path = `${this.$route.fullPath}`;
                            path = path.slice(1); // 把路径的/去掉
                            let hasRoute = false;
                            this.menus.map(res => {
                                if (res.rightUrl == path) {
                                    hasRoute = true;
                                } else if (res.children && res.children.length > 0) {
                                    res.children.map(item => {
                                        if (item.rightUrl == path) {
                                            hasRoute = true;
                                            opened = [res.rightName];
                                        }
                                    });
                                }
                            });

                            if (hasRoute) {
                                this.keyPath = path;
                                this.defaultOpeneds = opened;
                            } else {
                                let arr = sessionStorage.getItem('activeKey') ? sessionStorage.getItem('activeKey').split(",") : [];
                                let leg = arr.length;
                                this.keyPath = leg > 0 ? arr[leg - 1] : '';
                                this.defaultOpeneds = leg > 1 ? arr.slice(0, leg - 1) : [];
                            }
                        } else {
                            this.keyPath = this.menus[0].rightUrl || this.menus[0].children[0].rightUrl;
                            this.$router.push({
                                path: this.keyPath
                            })
                        }
                    }, 500);
                }
            }
        },
        created() {

        },
        mounted() {
            // debugger;
            let val = this.menusList || [];
            this.initMenu(val);
        }
    };
</script>
<style scoped>
    .el-menu-vertical-demo {
        max-width: 150px !important;
        font-size: 12px;
        border-right: none;
        position: relative;
    }

    .el-menu-vertical-demo.wdTp {
        width: 150px;
    }

    .el-menu-vertical-demo.no-child {
        font-size: 14px;
    }

    .menu-collapse {
        background: url('../../assets/images/icon-menu-collapsel.png') no-repeat center;
        width: 100%;
        height: 40px;
        /* overflow: hidden; */
        display: block;
        cursor: pointer;
        background-position-y: 11px;
    }

    .menu-arrow {
        position: absolute;
        width: 18px;
        height: 40px;
        line-height: 40px;
        right: -18px;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        background: #1f212e;
        color: #fff;
        cursor: pointer;
    }

    .disabled {
        color: #868d98;
    }

    .icon-menu-tools {
        position: relative;
        width: 20px;
        height: 20px;
        display: inline-block;
        left: 0;
        background: url("") no-repeat;
        /* opacity: 0.5 */
    }

    .icon-menu-tools.menu-1 {
        background-image: url('../../assets/images/menu-1.png');
    }

    .icon-menu-tools.menu-2 {
        background-image: url('../../assets/images/menu-2.png');
    }

    .icon-menu-tools.menu-3 {
        background-image: url('../../assets/images/menu-3.png');
    }

    .icon-menu-tools.menu-4 {
        background-image: url('../../assets/images/menu-4.png');
    }

    .icon-menu-tools.menu-5 {
        background-image: url('../../assets/images/menu-5.png');
    }

    .icon-menu-tools.menu-6 {
        background-image: url('../../assets/images/menu-6.png');
    }

    .icon-menu-tools.menu-7 {
        background-image: url('../../assets/images/menu-7.png');
    }

    .icon-menu-tools.menu-8 {
        background-image: url('../../assets/images/menu-8.png');
    }

    .icon-menu-tools.menu-9 {
        background-image: url('../../assets/images/menu-9.png');
    }

    .el-submenu .el-menu-item {
        height: 36px;
        line-height: 36px;
        min-width: auto;
    }

    .el-submenu__icon-arrow {
        position: relative;
    }

    .el-submenu__title span {
        padding-right: 30px;
    }

    .el-menu--popup .el-menu-item {
        height: 36px;
        line-height: 36px
    }

    .el-menu--popup .el-menu-item:focus,
    .el-menu--popup .el-menu-item:hover {
        color: #fff !important;
    }


    .scrollview {
        height: 100%;
        overflow: hidden;
        background-color: rgb(31, 33, 46);
    }

    .scrollview>>>.el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .scrollview>>>.el-scrollbar__bar.is-horizontal {
        display: none;
    }
</style>