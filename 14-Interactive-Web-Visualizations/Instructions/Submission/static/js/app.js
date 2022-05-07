//Wait for page to load 
$(document).ready(function() {
    //log the page load
    console.log("Page loaded");
    doWork();

    //Event listener to remake the dashboard
    $("#selDataset").on("change", function() {
        makeDashboard()
    });
});

//Cache the data once loaded to improve load times between id change
var globalData;

//print data to console
function doWork(){
    var url ="static/data/samples.json";
    requestAjax(url);
}

function makeDashboard() {
    let id = $("#selDataset").val();

    createMetadata(id);
    createBarchart(id);
    createBubblechart(id);
    createGaugechart(id);
}

function requestAjax(url) {
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            globalData = data;
            createDropdown();
            makeDashboard()
        },
        error: function(textStatus, errorThrown) {
            console.log("FAILED TO GET DATA");
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function createDropdown() {
    var names = globalData.names;
    for (let i = 0; i< names.length; i++) {
        let name = names[i];
        let html = `<option>${name}</option>`;
        $("#selDataset").append(html);
    }
}

function createMetadata(id) {
    $("sample-metadata").empty();
    let info = globalData.metadata.filter(x => x.id == id)[0];
    console.log(info);
    Object.entries(info).map(function(x) {
        let html = `<h5>${x[0]}: ${x[1]}</h5>`;
        $("#sample-metadata").append(html);
    });
}

function createBarchart(id) {
    let sample = globalData.samples.filter(x => x.id == id)[0];

    var trace1 = {
        type: "bar",
        x: sample.sample_values.slice(0, 10).reverse(),
        y: sample.otu_ids.map(x => `OTU ${x}`).slice(0, 10).reverse(),
        test: sample.otu_labels.slice(0, 10).reverse(),
        orientation: "h"
    }

    var data1 = [trace1];
    var layout = {
        "title": "OTU Count Present in Subject"
    }

    Plotly.newPlot('bar', data1, layout);
}

function createBubblechart(id) {
    let sample = globalData.samples.filter(x=> x.id == id)[0];

    var trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels.slice(0,10).reverse(),
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Earth'
        }
    }

    var data1 = [trace1];
    var layout = {
        'title': 'OTU Prevalence in Sample'
    }

    Plotly.newPlot('bubble', data1, layout);
}

function createGaugechart(id){
    let info = globalData.metadata.filter(x => x.id == id)[0];
    let avg = globalData["metadata"].map(x => x.wfreq).reduce((a, b) => a + b, 0) / globalData.metadata.length;

    var trace = {
        domain: { x: [0,1], y: [0,1]},
        value: info["wfreq"],
        title: {text: "Number of Washes per Day"},
        type: 'indicator',
        mode: 'gauge+number+delta',
        delta: {reference: avg.toFixed(2)},
        gauge: {
            axis: {range: [null, 10]},
            steps: [
                {range: [0,5], color: "lightgray"},
                {range: [5,7], color: "gray"}
            ],
            threshold: {
                line: {color: 'red', width: 4},
                thickness: 0.75,
                value: 9.5
            }
        }
    };

    var data1 = [trace];

    var layout = {
        title: 'Bellybutton Wash Frequency'
    };
    Plotly.newPlot('gauge', data1, layout);
}