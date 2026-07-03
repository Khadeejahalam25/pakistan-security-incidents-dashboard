// Timeline: Monthly incident counts, 2018-2020, with slider + play animation

const timelineWidth = 900;
const timelineHeight = 450;

const timelineSvg = d3.select("#timeline")
    .attr("width", timelineWidth)
    .attr("height", timelineHeight);

const margin = { top: 20, right: 30, bottom: 50, left: 60 };
const width = timelineWidth - margin.left - margin.right;
const height = timelineHeight - margin.top - margin.bottom;

const g = timelineSvg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

d3.csv("data/timeline_data.csv").then(data => {
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    xScale.domain(d3.extent(data, d => d.date));
    yScale.domain([0, d3.max(data, d => d.value)]);

    const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(3));
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    g.append("text")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Incidents per month");

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    g.append("path")
        .datum(data)
        .attr("class", "line-path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    const minYear = d3.min(data, d => d.date.getFullYear());
    const maxYear = d3.max(data, d => d.date.getFullYear());

    let currentYear = minYear;
    const slider = d3.select("#slider")
        .attr("min", minYear)
        .attr("max", maxYear)
        .attr("value", minYear);
    const playButton = d3.select("#play");

    slider.on("input", function() {
        currentYear = +this.value;
        updateChart();
    });

    playButton.on("click", function() {
        currentYear = minYear;
        slider.property("value", currentYear);
        let interval = setInterval(() => {
            if (currentYear >= maxYear) {
                clearInterval(interval);
            } else {
                currentYear++;
                slider.property("value", currentYear);
                updateChart();
            }
        }, 700);
    });

    function updateChart() {
        const filteredData = data.filter(d => d.date.getFullYear() <= currentYear);

        g.select(".line-path")
            .datum(filteredData)
            .attr("d", line);
    }
});
