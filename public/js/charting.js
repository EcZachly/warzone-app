function generateGradeData(data, name) {
    let grades = ['a', 'b', 'c', 'd', 'f'];
    return grades.map((g) => {
        let key = g + '_grade_' + name.toLowerCase();
        return parseFloat(data[key])
    })
}

function rechartBar(id, title, categories, data, selectSeries){
    Highcharts.chart(id, {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0
        },
        legend: {
            reversed: true
        },
        options: {},
        plotOptions: {
            series: {
                events: {
                    show: function () {
                        var chart = this.chart,
                            series = chart.series,
                            i = series.length,
                            otherSeries;

                        while (i--) {
                            otherSeries = series[i];
                            if (otherSeries != this && otherSeries.visible) {
                                otherSeries.hide();
                            }
                        }
                    },
                    legendItemClick: function () {
                        selectSeries(this.name);
                        if (this.visible) {
                            return false;
                        }
                    }
                }
            }
        },
        series: data
    });
}