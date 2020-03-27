<template>
    <div class="container">
        <div :id="id" :option="option" class="pies"></div>
    </div>
</template>
<script>
    import HighCharts, { charts } from 'highcharts'
    export default {
        props: {
            id: {
                type: String
            },
            //option 是图表的配置数据
            option: {
                type: Object
            },
        },
        data() {
            return {
                index: 0, // 初始化次数
            }
        },
        methods: {
            update() {
                if (this.option.series[0].data.length > 0) {
                    if (this.index > 0) {
                        this.option.plotOptions.pie.animation = false; //关闭初始化动画
                    }
                    HighCharts.chart(this.id, this.option);
                    this.index++;
                }
            }
        },
        mounted() {
            if (this.option.series[0].data.length > 0) {
                HighCharts.chart(this.id, this.option);
                this.index++;
            }
        }
    }
</script>

<style scoped>
    /* 容器 */
    .container {
        width: 100%;
        height: 100%;
    }

    .pies {
        width: 100%;
        height: 100%;
    }
</style>
<style>
    text.highcharts-credits {
        display: none;
    }
</style>