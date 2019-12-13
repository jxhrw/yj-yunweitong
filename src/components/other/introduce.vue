<template>
    <div class="app_outer">
        <!-- 头部 -->
        <div class="app-code-head">
            <div class="app-code-con-shell">
                <!-- 左 -->
                <div class="code-left-con">
                    <h1 class="code-title-ch">{{ '打造“互联网+交管”新业态，开启运维2.0时代新纪元' }}</h1>
                    <div class="code-con-ch">
                        <p>“互联网+”未知远大于已知，未来空间无限，每一点探索积水成渊，势必深刻影响重塑传统产业行业格局。</p>
                        <p>以通信、数据、策略为手段，多元感知设备姿态，按需、按岗、按类、按级报警及预警，第一时间掌握设备运行态势，辅以集接单、保障、排因、处置、知识库、终端回馈等为一体的综合监管业务，在资产全生命周期内使执行、监管透明化，为各信息化平台提供有效支撑。</p>
                    </div>
                    <div class="code-android-outer">
                        <a href="http://192.168.106.131:8081/uums-server/control/efoms-app.apk">
                            <div class="code-android">
                                <img :src="require('../../assets/images/introduce/android_icon.png')" alt="">
                                <p>Android</p>
                                <p>下载</p>
                            </div>
                        </a>
                        <img class="app-code" :src="require('../../assets/images/introduce/code.png')" alt="">
                    </div>
                </div>
                <!-- 右 -->
                <div class="code-right-img">
                    <img :src="require('../../assets/images/introduce/img1.png')" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    .app_outer {
        text-align: center;
    }

    .app-code-head {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("../../assets/images/introduce/header-BG.jpg") no-repeat;
        display: flex;
        justify-content: center;
        align-items: center;

        .app-code-con-shell {
            width: 66.7%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .code-left-con {
                text-align: left;
                width: 47.6%;

                .code-title-ch {
                    font-family: Arial-Black;
                    font-size: 34px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                }

                .code-con-ch {
                    padding-top: 20px;
                    font-family: MicrosoftYaHei;
                    font-size: 14px;
                    color: #FFFFFF;
                    letter-spacing: 0;

                    p {
                        padding-bottom: 30px;
                    }
                }

                .code-android-outer {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;

                    .app-code {
                        width: 48%;
                        min-width: 185px;
                    }

                    a {
                        width: 30%;
                        min-width: 175px;
                        display: inline-block;
                        text-decoration: none;
                    }

                    .code-android {
                        display: inline-block;
                        min-width: 185px;
                        background-color: #B6E046;
                        border-radius: 37.5px;
                        padding: 14px 22px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-family: MicrosoftYaHei;
                        font-size: 18px;
                        color: #FFFFFF;
                        letter-spacing: 0;

                        img {
                            width: 24px;
                        }
                    }
                }
            }

            .code-right-img {
                width: 42.8%;

                img {
                    width: 100%;
                }
            }



        }
    }

    @media screen and (max-width: 1500px) {
        .app-code-con-shell {
            width: 72%;

            .code-left-con {
                width: 47.6%;

                .code-title-ch {
                    font-size: 26px;
                    font-weight: 600;
                }

                .code-android-outer {
                    .app-code {
                        width: 30%;
                        min-width: 175px;
                    }

                    .code-android-outer {
                        .code-android {
                            width: 30%;
                            min-width: 175px;
                            padding: 12px 20px;
                            font-size: 16px;

                            img {
                                width: 18px;
                            }
                        }
                    }
                }
            }

            .code-right-img {
                width: 42%;
            }
        }
    }
</style>