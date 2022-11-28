// components/charts/gauge/gauge.js
import * as echarts from '../../ec-canvas/echarts.js';
const gaugeData = [{
        value: (0 / 5) * 1000,
        name: '本月总分',
        title: {
            offsetCenter: ['0%', '-50%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-35%']
        }
    },
    {
        value: 40,
        name: '本月加分',
        title: {
            offsetCenter: ['0%', '-10%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '6%']
        }
    },
    {
        value: 60,
        name: '本月扣分',
        title: {
            offsetCenter: ['0%', '30%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '46%']
        }
    }
];
let chart;

function initChart(canvas, width, height, dpr) {
    chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
    });
    canvas.setChart(chart);
    let option = {
        series: [{
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
                show: false
            },
            max: 100,
            // min: ,
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#464646'
                }
            },
            axisLine: {
                lineStyle: {
                    width: 40
                }
            },
            splitLine: {
                show: false,
                distance: 0,
                length: 10
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                distance: 50
            },
            data: gaugeData,
            title: {
                fontSize: 12
            },
            detail: {
                width: 60,
                height: 10,
                lineHeight: 10,
                fontSize: 14,
                color: 'auto',
                borderColor: 'auto',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}'
            }
        }]
    };
    chart.setOption(option);
    return chart;
}

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        chartData: {
            type: Number
        },
        addAll: {
            type: Number
        },
        delAll: {
            type: Number
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        ec: {
            onInit: initChart
        },
    },

    lifetimes: {
        attached: function () {
            this.setData({

            })
        }
    },

    observers: {
        'chartData': function (val) {
            gaugeData[0].value = val;
            gaugeData[1].value = this.properties.addAll;
            gaugeData[2].value = this.properties.delAll;
            gaugeData[0].value = val;
            if (chart) {
                chart.setOption({
                    series: [{
                        data: gaugeData
                    }]
                });
            }
        },
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
})