
var TableSparkLine = function(wrap, columns){

    this.wrap = $(wrap) || $("#table-sparkline");
    
    this.renderTable = function(){
        var tableHTML = $('<table><thead><tr></tr></thead><tbody></tbody></table>');
        columns.forEach(function(col) {
            tableHTML.find("thead tr").append('<th>'+col.name+'</th>');
        });

        this.wrap.html(tableHTML);
    }

    this.addRow = function(item){
        var that = this;

        var key = item[columns[0].key]; //get column first set ID

        var el = that.wrap.find('tbody [data-id="'+key+'"]');
        console.log(el.length)
        if(el.length > 0){
            for(var i in columns){
                var text = item[columns[i].datafrom] ? item[columns[i].datafrom] : item[columns[i].key] || "";
                var td = el.find('[data-col="'+columns[i].key+'"]');
                //console.log(colKey, colKey == columns[i].key)
                
                if(columns[i].chart){
                    td.attr('data-sparkline', text);
                }
                else{
                    td.text(text);
                }
            }
        }
        else{
            var tr = $('<tr data-id="'+key+'"></tr>');
            for(var i in columns){
                var text = item[columns[i].datafrom] ? item[columns[i].datafrom] : item[columns[i].key] || "";
                
                
                if(columns[i].chart){
                    tr.append('<td data-col="'+columns[i].key+'" data-sparkline="'+text+'" />');
                }
                else{
                    tr.append('<td data-col="'+columns[i].key+'">'+text+'</td>');
                }
            };

            that.wrap.find("table tbody").append(tr);
        }

        that.renderChart(key)
    }
    

    this.renderChart = function(key) {
        
        $('[data-id="'+key+'"] > [data-sparkline]').each(function( index ) {
            var chart = $(this);
            var sparkline = chart.highcharts();

            if(sparkline){
                var value = parseInt(chart.attr('data-sparkline'));
                sparkline.series[0].addPoint([value], true, true);
            }
            else{
                new Highcharts.Chart({

                    chart: {
                        renderTo: chart[0],
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
                    series: [{
                        data: (function () {
                            // generate an array of random data
                            var data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                            console.log(parseInt(chart.attr('data-sparkline')))
                            data.push(parseInt(chart.attr('data-sparkline')))
                            return data;
                        }())
                    }],
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
                });
            }
        });

        // $('[data-id="'+key+'"] > [data-sparkline]').each(function( index ) {
        // // setInterval(function () {
        // //         var y = Math.round(Math.random() * 10);
        // //         spark.series[0].addPoint([y], true, true);
        // //     }, 2000);
            
            
        // })
 
    }

    //run
    this.renderTable();

}