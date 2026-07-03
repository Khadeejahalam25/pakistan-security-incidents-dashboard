// Sunburst: Target Type -> Perpetrator Group, radial view of the same hierarchy as the tree map

const sunburstRadius = 320;

const sunburstSvg = d3.select("#sunburst")
    .attr("width", sunburstRadius * 2)
    .attr("height", sunburstRadius * 2)
    .append("g")
    .attr("transform", `translate(${sunburstRadius}, ${sunburstRadius})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "6px 10px")
    .style("background", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

const color = d3.scaleOrdinal(d3.schemeTableau10);

d3.csv("data/hierarchy_data.csv").then(data => {
    const hierarchyData = d3.stratify()
        .id(d => d.entity)
        .parentId(d => d.parent)
        (data);

    hierarchyData.sum(d => +d.value || 0);
    hierarchyData.sort((a, b) => b.value - a.value);

    const partition = d3.partition()
        .size([2 * Math.PI, sunburstRadius]);

    const root = partition(hierarchyData);

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1);

    sunburstSvg.selectAll("path")
        .data(root.descendants().filter(d => d.depth > 0))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", d => {
            const ancestor = d.ancestors().find(a => a.depth === 1);
            return color(ancestor ? ancestor.data.entity : d.data.entity);
        })
        .attr("fill-opacity", d => d.depth === 1 ? 1 : 0.75)
        .attr("stroke", "#fff")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill-opacity", 1).attr("stroke-width", 2);
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.entity}</strong><br>Incidents: ${d.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill-opacity", d => d.depth === 1 ? 1 : 0.75).attr("stroke-width", 1);
            tooltip.style("opacity", 0);
        });
});
