import { graphic } from 'echarts/lib/export';
var EchartsJs = {
    // 圆环图实心
    getRingSolid: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            itemWidth: 6,
            itemHeight: 6,
            icon: 'circle',
            // top: 'bottom',
            left: 'center',
            bottom: '5%',
            itemGap: 10,
            textStyle: {
                color: '#C0DAFF'
            },
            fontSize: 10,
            data: [
                // '直达', '邮件营销', '联盟广告'
            ]
        },
        color: ['#49517C', '#1180ff', '#3bd1f1'],
        series: [{
                name: '',
                type: 'pie',
                legendHoverLink: false,
                selectedMode: false,
                hoverAnimation: false,
                hoverOffset: 5,
                radius: ['0%', '15%'],
                cursor: 'default',
                center: ['50%', '40%'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                data: [
                    { value: 1, name: '' }
                ]
            },
            {
                name: '',
                type: 'pie',
                radius: ['40%', '60%'],
                center: ['50%', '40%'],
                hoverOffset: 8,
                legendHoverLink: true,
                hoverAnimation: true,
                selectedMode: 'single',
                selectedOffset: 0,
                label: {
                    show: true,
                    position: 'outer',
                    formatter: '{d}%',
                    fontSize: 8,
                    color: '#C0DAFF',
                    padding: [-10, -25],
                },
                labelLine: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                data: [
                    // { value: 335, name: '直达' },
                    // { value: 310, name: '邮件营销' },
                    // { value: 234, name: '联盟广告' },
                ]
            }
        ]
    },
    // 圆环图
    getRing: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
            // top: 'bottom',
            left: 'center',
            bottom: '10%',
            itemGap: 30,
            textStyle: {
                color: '#C0DAFF'
            },
            fontSize: 10,
            data: [
                // '直达', '邮件营销', '联盟广告'
            ]
        },
        color: ['rgba(213,98,0,1)', 'rgba(0,180,236,1)', 'rgba(0,90,216,1)', 'rgba(213,98,0,1)', 'rgba(213,98,0,0.6)', 'rgba(0,180,236,1)', 'rgba(0,180,236,0.6) ', 'rgba(0,90,216,1)', 'rgba(0,90,216,0.6) ', '#49517C'],
        series: [{
                name: '',
                type: 'pie',
                // legendHoverLink: false,
                selectedMode: false,
                // hoverAnimation: false,
                hoverOffset: 5,
                radius: ['20%', '35%'],
                // cursor: 'default',
                center: ['50%', '40%'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                tooltip: {
                    show: true
                },
                data: [
                    // { value: 1, name: '' }
                ]
            },
            {
                name: '',
                type: 'pie',
                radius: ['45%', '60%'],
                center: ['50%', '40%'],
                hoverOffset: 3,
                label: {
                    show: false,
                    position: 'inside',
                    formatter: '{d}%',
                    fontSize: 8
                },
                labelLine: {
                    show: false
                },
                data: [
                    // { value: 335, name: '直达' },
                    // { value: 310, name: '邮件营销' },
                    // { value: 234, name: '联盟广告' },
                ]
            }
        ]
    },
    // 圆多层次
    getCircular: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        color: ['#22B05D', '#9A56F6', '#FF8A7D', '#0397FF', '#22B05D'],
        // '#0B78FD',原第一号色, '#0C4086' 原第二号色
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['20%', '60%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
                position: 'outside',
                formatter: '{c|{d}%} \n {b|{b}}',
                fontSize: 12,
                align: 'center',
                rich: {
                    c: {
                        align: 'center',
                        color: "#ffffff",
                        fontSize: 16
                    },
                    b: {
                        align: 'center',
                        color: "#5C78A4",
                        fontSize: 12
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.6)'
                    },
                    smooth: 0,
                    length: 20,
                    length2: 10
                }
            },
            roseType: 'radius',
            data: [
                // { value: 30, name: '直达' },
                // { value: 20, name: '邮件营销' },
                // { value: 20, name: '联盟广告' },
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
                return Math.random() * 200;
            }
        }]
    },
    // 条状
    getBar: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        grid: {
            top: '15%',
            right: '5%',
            left: '15%',
            bottom: '20%'
        },
        xAxis: [{
            type: 'category',
            data: [
                // '工作票', '操作票', '抢修', '用电调查', '设备巡视', '现场勘查', '到岗到位'
            ],
            axisLine: {
                lineStyle: {
                    color: '#082F6C'
                }
            },
            axisLabel: {
                interval: 0,
                margin: 10,
                color: '#C0DAFF',
                textStyle: {
                    fontSize: 12
                },
            },
        }],
        yAxis: [{
            axisLabel: {
                formatter: '{value}',
                color: '#C0DAFF',
                textStyle: {
                    fontSize: 12
                },
            },
            axisLine: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#082F6C'
                }
            }
        }],
        series: [{
            type: 'bar',
            data: [
                // 300, 450, 770, 203, 255, 188, 156
            ],
            barWidth: '10px',
            itemStyle: {
                normal: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#1DE3FF' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#062DC5' // 100% 处的颜色
                    }], false),
                    barBorderRadius: [5, 5, 0, 0]
                }
            },
            label: {
                normal: {
                    show: false
                }
            }
        }]
    },
    // 3/4圆环
    getThreequarters: {
        tooltip: {
            trigger: 'item',
            // formatter: "{b}（{(1.25*d)}%）",
            formatter: function(params) {
                console.log(params);
                // 因为总数放大了1.25倍，所以百分比也相应放大
                let percent = Math.round(params.percent * 133.3) / 100;
                return params.name + '（未修复：' + params.value + '）' + percent + '%';
            }
        },
        legend: {
            orient: 'vertical',
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
            top: '12%',
            right: '8%',
            // bottom: '10%',
            itemGap: 15,
            textStyle: {
                color: '#C0DAFF'
            },
            fontSize: 10,
            data: [],
        },
        color: ['#1ca2fe', '#1062e1', '#b257f5', '#ff799a', '#28dcad'],
        series: []
    },

    // 设施柱状图
    // 条状
    getBarss: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        grid: {
            top: '20%',
            right: '0%',
            left: '10%',
            bottom: '15%'
        },
        xAxis: [{
            type: 'category',
            data: [
                '工作票', '操作票', '抢修', '用电调查', '设备巡视', '现场勘查', '到岗到位'
            ],
            axisLine: {
                lineStyle: {
                    color: '#061b30'
                }
            },
            axisLabel: {
                interval: 0,
                margin: 10,
                color: '#98a8b3',
                textStyle: {
                    fontSize: 12
                },
            },
        }],
        yAxis: [{
            axisLabel: {
                formatter: '{value}',
                color: '#98a8b3',
                textStyle: {
                    fontSize: 12
                },
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#061b30'
                }
            },
            name: "使用年限",
            nameGap: 21,
            nameTextStyle: {
                color: '#98a8b3'
            }
        }],
        series: [{
            type: 'bar',
            data: [
                30, 45, 77, 20, 25, 18, 15
            ],
            barWidth: '10px',
            itemStyle: {
                normal: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#18b4bf' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#002a50' // 100% 处的颜色
                    }], false),
                }
            },
            label: {
                normal: {
                    show: false
                }
            }
        }]
    },
    // 圆多层次
    getCircularss: {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        color: ['#36bdec', '#1392d0', '#2472c1', '#114589', '#02357a', '#0c275e'],
        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['0%', '80%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            label: {
                position: 'outside',
                formatter: '{a|{b}}',
                // formatter: '{c|{d}%} \n {b|{b}}',
                fontSize: 12,
                align: 'center',
                rich: {
                    a: {
                        color: "#809ebc",
                    },
                    c: {
                        align: 'center',
                        color: "#ffffff",
                        fontSize: 16
                    },
                    b: {
                        align: 'center',
                        color: "#5C78A4",
                        fontSize: 12
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.6)'
                    },
                    smooth: 0,
                    length: 20,
                    length2: 10
                }
            },
            roseType: 'radius',
            data: [
                { value: 90, name: '直达' },
                { value: 70, name: '邮件营销' },
                { value: 50, name: '联盟广告' },
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
                return Math.random() * 200;
            }
        }]
    },

    // 3d饼图
    get3dPie: {
        chart: {
            backgroundColor: 'transparent',
            type: 'pie', //饼图
            options3d: {
                enabled: true, //使用3d功能
                alpha: 60, //延y轴向内的倾斜角度
                beta: 0,
            }
        },
        title: {
            text: ''
        },
        colors: ['#22B05D', '#9A56F6', '#FF8A7D', '#0397FF', '#9A56F6', '#0397FF'],
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                animation: true, //初始化动画
                allowPointSelect: true, //每个扇块能否选中
                cursor: 'pointer', //鼠标指针
                depth: 20, //饼图的厚度
                dataLabels: {
                    enabled: true, //是否显示饼图的线形tip
                    format: '<i style="color:#bdbdbd;">{point.name}</i><br/> <i style="color:#5C78A4;font-size:10px;">{point.percentage:.1f} %</i>',
                    connectorColor: '#5C78A4',
                    style: { "color": "red", "fontSize": "11px", "fontWeight": "normal", "textOutline": "0" },
                    crop: false //显示不下是否省略
                }
            }
        },
        series: [{
            type: 'pie',
            name: '测试用1', //统一的前置词,非必须
            data: [
                // { name: '测试1', y: 12, },
                // { name: '测试2', y: 12 },
                // { name: '测试3', y: 12 },
                // { name: '测试4', y: 12 },
            ]
        }]
    }
};

export default EchartsJs;