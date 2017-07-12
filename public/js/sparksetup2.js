//config SparkLine
Highcharts.SparkLine = function (a, b, c) {
    var hasRenderToArg = typeof a === 'string' || a.nodeName,
        options = arguments[hasRenderToArg ? 1 : 0],
        defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 180,
                height: 30,
                style: {
                    overflow: 'visible'
                },

                // small optimalization, saves 1-2 ms each sparkline
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0]
            },
            legend: {
                enabled: false
            },
            tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h };
                }
            },
            plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                },
                column: {
                    negativeColor: '#910000',
                    borderColor: 'silver'
                }
            }
        };

    options = Highcharts.merge(defaultOptions, options);

    return hasRenderToArg ?
        new Highcharts.Chart(a, options, c) :
        new Highcharts.Chart(options, b);
};


var TableSparkLine = function(wrap, columns){

    this.wrap = $(wrap) || $("#table-sparkline");
    
    this.renderTable = function(){
        var tableHTML = $('<table><thead><tr></tr></thead><tbody></tbody></table>');
        columns.forEach(function(col) {
            tableHTML.find("thead tr").append('<th>'+col.name+'</th>');
        });

        this.wrap.html(tableHTML);
    }

    this.addRow = function(data, id){
        var that = this;

        var groupById = data.reduce(function(obj,item){
            obj[item[key]] = obj[item[key]] || [];
            obj[item[key]].push(item);
            return obj;
        }, {});

        console.log(groupById)

        data.forEach(function(item){
            var key = item[columns[0].key];
            var tr = $('<tr data-id="'+key+'"></tr>');
            columns.forEach(function(col){
                var text = item[col.key] || "";
                if(col.chart){
                    tr.append('<td data-sparkline="'+text+'" />');
                }
                else{
                    tr.append('<td>'+text+'</td>');
                }
            });

            //if exist id is update
            
            if(id){
                
                var el = that.wrap.find('tbody [data-id="'+id+'"]');
                if(el.length > 0){
                    el.replaceWith(tr);
                }
            }
            else{
                that.wrap.find("table tbody").append(tr)
            }
        });
    }

    this.renderChart = function() {
        var time = +new Date(),
            i,
            $tds = $('td[data-sparkline]'),
            len = $tds.length,
            n = 0,
            $td,
            stringdata,
            arr,
            data,
            chart;

        for (i = 0; i < len; i += 1) {
            $td = $($tds[i]);
            console.log($td)
            stringdata = $td.data('sparkline');
            arr = stringdata.split('; ');
            data = $.map(arr[0].split(/(?:,| )+/), parseFloat);
            chart = {};

            if (arr[1]) {
                chart.type = arr[1];
            }
            $td.highcharts('SparkLine', {
                series: [{
                    name: 'Random data',
                    data: (function () {
                        // generate an array of random data
                        var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        return data;
                    }())
                }],
                // tooltip: {
                //     headerFormat: '<span style="font-size: 10px">' + $td.parent().find('th').html() + ', Q{point.x}:</span><br/>',
                //     pointFormat: '<b>{point.y}.000</b> USD'
                // },
                chart: {
                    events: {
                        load: function () {

                            // set up the updating of the chart each second
                            var series = this.series[0];
                            console.log(series)
                            setInterval(function () {
                                y = Math.round(Math.random() * 10);
                                series.addPoint([y], true, true);
                            }, 2000);
                        }
                    }
                }
                
            });
        }
    }

    //run
    this.renderTable();

}