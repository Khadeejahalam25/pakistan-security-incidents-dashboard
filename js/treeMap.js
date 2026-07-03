// Tree Map: Target Type -> Perpetrator Group, sized by incident count

const treeMapWidth = 960;
const treeMapHeight = 600;

const treeMapSvg = d3.select("#treeMap")
    .append("svg")
    .attr("width", treeMapWidth)
    .attr("height", treeMapHeight);

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

    const treemapLayout = d3.treemap()
        .size([treeMapWidth, treeMapHeight])
        .paddingOuter(2)
        .paddingInner(2);

    treemapLayout(hierarchyData);

    const leaves = hierarchyData.leaves();

    treeMapSvg.selectAll("rect")
        .data(leaves)
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.parent ? d.parent.data.entity : d.data.entity))
        .attr("stroke", "#fff")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.7);
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.entity}</strong><br>Incidents: ${d.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 1);
            tooltip.style("opacity", 0);
        });

    treeMapSvg.selectAll("text")
        .data(leaves.filter(d => (d.x1 - d.x0) > 60 && (d.y1 - d.y0) > 18))
        .enter().append("text")
        .attr("x", d => d.x0 + 4)
        .attr("y", d => d.y0 + 14)
        .text(d => d.data.entity.length > 22 ? d.data.entity.slice(0, 22) + "…" : d.data.entity)
        .attr("font-size", "10px")
        .attr("fill", "white");
});
