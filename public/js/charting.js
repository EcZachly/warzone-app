function filterChange(data, keyFilter, title, chartId) {
    console.log(data, keyFilter, title, chartId);
    let filteredObject = [];
    Object.keys(data).forEach((key) => {
        if (key.includes(keyFilter)) {
            let newPoint = {
                name: key.split('_')[0].toUpperCase(),
                y: parseFloat(data[key])
            };
            filteredObject.push(newPoint);
        }
    })
    filteredObject[0].sliced = true;
    filteredObject[0].selected = true;
    console.log(filteredObject);
    rechart(chartId, 'Placements', title, filteredObject);
}


function rechart(id, name, title, data) {
    Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br> Count: {point.y}'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: name,
            colorByPoint: true,
            data: data
        }]
    })
}
