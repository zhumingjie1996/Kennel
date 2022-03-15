// components/charts/gauge/gauge.js
import * as echarts from '../../ec-canvas/echarts.js';
const gaugeData = [{
    value: (0 / 5) * 100,
    name: '得分',
    title: {
        offsetCenter: ['0%', '-20%']
    },
    detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '10%']
    }
}];
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
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#464646',
                    color: '#000000'
                }
            },
            axisLine: {
                lineStyle: {
                    width: 20
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
                fontSize: 14
            },
            detail: {
                width: 50,
                height: 30,
                lineHeight: 40,
                fontSize: 18,
                color: '#000',
                borderColor: '#000',
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
            chart.setOption({
                series: [{
                    data: gaugeData
                }]
            });
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
})