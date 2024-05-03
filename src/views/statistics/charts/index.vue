<template>
  <div class="report-charts-title">仓储数据中心</div>
  <div class="report-charts">
    <div ref="chart1" class="charts"></div>
    <div ref="chart2" class="charts"></div>
<!--    <div ref="chart3" class="charts"></div>-->
<!--    <div ref="chart4" class="charts" style="margin-top: 20px;"></div>-->
<!--    <div ref="chart5" class="charts" style="margin-top: 20px;"></div>-->
    <div class="charts" style="margin-top: 20px;">
      <h3>今日实时数据监测：</h3>
      <div class="container">
        <div>
          <label>采购量：</label>
          <span>{{todayIn}} 件</span>
        </div>
        <div>
          <label>出库量：</label>
          <span>{{todayOut}} 件</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {get, tip} from "@/common";
import * as echarts from 'echarts';
import {ElMessage} from "element-plus";

const chart1 = ref();
const chart2 = ref();
const chart3 = ref();
const chart4 = ref();
const chart5 = ref();

let chartObj1;
let chartObj2;
let chartObj3;
let chartObj4;
let chartObj5;

const makeChart = (chartRef, option) => {
  const chartObj = echarts.init(chartRef.value);
  chartObj.setOption(option);
  return chartObj;
};

onMounted(() => {
  nextTick(() => {
    chartObj1 = makeChart(chart1, option1);
    chartObj1.resize({height: 280});
    chartObj2 = makeChart(chart2, option2);
    chartObj2.resize({height: 260});
    chartObj3 = makeChart(chart3, option3);
    chartObj4 = makeChart(chart4, option4);
    chartObj4.resize({height: 280});
    chartObj5 = makeChart(chart5, option5);
  });
});

// 刷新chart视图
const refreshChart = (chartObj, option) => {
  if (!chartObj) {
    nextTick(() => {
      refreshChart(chartObj, option);
    });
  } else {
    chartObj.setOption(option);
  }
};

// 1. 各仓库的库存情况
const option1 = reactive({
  title: {
    text: '在库库存信息'
  },
  legend: {
    orient: 'vertical',
    right: 5,
  },
  tooltip: {},
  dataset: {
    dimensions: ['xValue', '郑州仓库', '北京仓库'],
    source: [
      {xValue: '', '郑州仓库': 0, '北京仓库': 0},
    ]
  },
  xAxis: {type: 'category'},
  yAxis: {name: '单位：件/箱'},
  series: [{type: 'bar'}, {type: 'bar'}]
});

// 监视器
watch(option1, (newOption) => refreshChart(chartObj1, newOption));

const warehouseNames = ref([]);
const warehouseStocks = ref([]);
// 获取仓库的商品库存
const getWarehouseStock = () => {
  get('/statistics/warehouse-stock').then(res => {
    warehouseNames.value = res.data.map(item => item.warehouseName);
    warehouseStocks.value = res.data.map(item => item.totalStock);
    // 更新option1
    option1.dataset.dimensions = ['xValue', ...warehouseNames.value];
    option1.series = warehouseNames.value.map(name => ({type: 'bar'}));

    option1.dataset.source = res.data.map(item => {
      return {
        xValue: '',
        [item.warehouseName]: item.totalStock
      };
    });

  });
}
getWarehouseStock();


// 2. 占用比
const option2 = reactive({
  series: [
    {
      type: 'gauge',
      progress: {
        show: true,
        width: 8
      },
      axisLine: {
        lineStyle: {
          width: 8
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 12,
        color: '#999',
        fontSize: 13
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 20,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: true
      },
      detail: {
        valueAnimation: true,
        fontSize: 14,
        offsetCenter: [0, '60%'],
        formatter: '占用比\n{value}%'
      },
      data: [
        {
          value: 0.0,
        }
      ]
    }
  ]
});

// 监视器
watch(option2, (newOption) => refreshChart(chartObj2, newOption));

// 获取占用比
const getOccupancyRate = () => {
  get('/statistics/occupancy-rate').then(res => {
    option2.series[0].data[0].value = res.data;
    if (res.data > 80) {
      // 弹出提示
      ElMessage.error('占用比超过80%，建议优化库存！');
    }
  });
}
getOccupancyRate();

// 3. 各仓库存储走势
const option3 = reactive({
  title: {
    text: new Date().getFullYear() + '仓库存储走势'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: "vertical",
    right: 5,
    top: -5,
    data: ['仓库1', '仓库2']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {},
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    name: '单位：件/箱',
    type: 'value'
  },
  series: [
    {
      name: '仓库1',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230]
    },
    {
      name: '仓库2',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330]
    }
  ]
});

const thisRes = {
  data: {
    month: ['1月', '2月', '3月', '4月'],
    series: [
      {
        name: '仓库1',
        type: 'line',
        stack: 'Total',
        data: [100, 100, 100, 100]
      },
      {
        name: '仓库2',
        type: 'line',
        stack: 'Total',
        data: [200, 200, 200, 200]
      }
    ]
  }
};

// 监视器
watch(option3, (newOption) => refreshChart(chartObj3, newOption));

// 获取各仓库存储走势
const getWarehouseTrend = () => {
  get('/statistics/warehouse-trend').then(res => {
    console.log("res,trend ==", res);
    console.log("res,thisRes", thisRes);
    option3.xAxis.data = res.data.month;
    option3.legend.data = res.data.series.map(item => item.name);
    option3.series = res.data.series;
  });
}
// getWarehouseTrend();

// 4. 各仓库出库入库情况
const option4 = reactive({
  title: {
    text: new Date().getFullYear() + '年出入库信息'
  },
  legend: {
    orient: "horizontal",
    right: 10
  },
  tooltip: {},
  dataset: {
    dimensions: ['product', '入库', '出库'],
    source: [
      {product: '1月', '入库': 2045, '出库': 1153},
      {product: '2月', '入库': 1842, '出库': 1541},
      {product: '3月', '入库': 2684, '出库': 2315},
      {product: '4月', '入库': 2478, '出库': 1936},
    ]
  },
  xAxis: {type: 'category'},
  yAxis: {name: '单位：件/箱'},
  series: [{type: 'bar'}, {type: 'bar'}]
});

// 监视器
watch(option4, (newOption) => refreshChart(chartObj4, newOption));

// 获取各仓库出入库情况
const getWarehouseInOut = () => {
  get('/statistics/warehouse-in-out').then(res => {
    option4.dataset.source = res.data.map(item => {
      return {
        product: item.month,
        '入库': item.inStock,
        '出库': item.outStock
      };
    });
  });
}


// 5. 仓库采购量
const option5 = reactive({
  title: {
    text: '采购量占比',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '65%',
      data: [
        {value: 548, name: '洗衣机'},
        {value: 735, name: '电视机'},
        {value: 580, name: '空调'},
        {value: 1580, name: '风扇'},
        {value: 880, name: '蔬菜'},
        {value: 1980, name: '水果'},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

// 监视器
watch(option5, (newOption) => refreshChart(chartObj5, newOption));

// 获取仓库采购量
const getWarehousePurchase = () => {
  get('/statistics/category-ratio').then(res => {
    option5.series[0].data = res.data.map(item => {
      return {
        value: item.purchaseAmount,
        name: item.productName
      };
    });
  });
}

// 6. 
const todayIn = ref(0);
const todayOut = ref(0);
const getTodayInAndOut = () => {
  get('/statistics/today-in-out').then(res => {
    todayIn.value = res.data[0];
    todayOut.value = res.data[1];
  });
}
getTodayInAndOut();
</script>

<style scoped>
.report-charts-title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 20px;
  letter-spacing: 8px;
  color: #100C2A;
}

.report-charts {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.report-charts .charts {
  width: 32%;
  height: 240px;
  flex: auto;
  box-sizing: border-box;
}

.container {
  font-size: 17px;
  font-family: 黑体, sans-serif;
  display: flex;
  flex-direction: column;
}

.container > div {
  margin-top: 10px;
}
</style>