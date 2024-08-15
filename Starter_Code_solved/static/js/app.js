
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    //const filteredMetadata = metadata.filter(meta => meta.sample === sample)[0];
    const filteredMetadata = metadata.filter(sampleObj => sampleObj.id = sample);
    const result = filteredMetadata[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("p")
        .text(`${key}: ${value}`);
    });

  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const filteredSample = samples.filter(sampleData => sampleData.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = filteredSample.otu_ids;
    const otuLabels = filteredSample.otu_labels;
    const sampleValues = filteredSample.sample_values;

  // Build a Bubble Chart
  const bubbleData = [{
    x : otuIds,
    y : sampleValues,
    text : otuLabels,
    mode : 'markers',
    marker : {
      size : sampleValues,
      color : otuIds,
      colorscale : 'Earth'

    }

  }];
  //Render the Bubble Chart
  const bubbleLayout = {
    title : 'Bateria Cultures Per Sample',
    margin : {t: 30, l: 150 },
    hovermode : 'closest',
    xaxis : {title: 'OTU ID'}

  };
    //};
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    const barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }
    ];

    // Render the Bar Chart
    const barLayout = {
      title: 'Bar Chart',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' },
      height: 600,
      width: 1000
    };
    Plotly.newPlot('bar', barData, barLayout);

  });
}
// Build the metadata panel
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach((name) => {
      dropdown.append("option")
        .text(name)
        .property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}
// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  }

// Initialize the dashboard
init();
