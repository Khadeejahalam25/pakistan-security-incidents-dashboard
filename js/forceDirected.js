// Force-Directed Graph: Perpetrator Group -> Target Type
// Edge weight = number of incidents linking that group to that target type

const width = 900;
const height = 650;

const svg = d3.select("#forceGraph")
    .attr("width", width)
    .attr("height", height);

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

d3.csv("data/network_data.csv").then(data => {
    const nodes = [];
    const nodeSet = new Set();
    const links = [];

    data.forEach(row => {
        if (!nodeSet.has(row.source)) {
            nodeSet.add(row.source);
            nodes.push({ id: row.source, group: "perpetrator" });
        }
        if (!nodeSet.has(row.target)) {
            nodeSet.add(row.target);
            nodes.push({ id: row.target, group: "target" });
        }
        links.push({
            source: row.source,
            target: row.target,
            value: +row.value || 1
        });
    });

    drawForceDirectedGraph(nodes, links);
});

function drawForceDirectedGraph(nodes, links) {
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(90))
        .force("charge", d3.forceManyBody().strength(-180))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(28));

    const link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", d => d.group === "perpetrator" ? 10 : 7)
        .attr("fill", d => d.group === "perpetrator" ? "#e63946" : "#457b9d")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`<strong>${d.id}</strong><br>${d.group === "perpetrator" ? "Perpetrator group" : "Target type"}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0))
        .call(drag(simulation));

    const label = svg.selectAll(".label")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("font-size", "9px")
        .attr("fill", "#333")
        .attr("dx", 12)
        .attr("dy", 4)
        .text(d => d.id.length > 20 ? d.id.slice(0, 20) + "…" : d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
}

function drag(simulation) {
    return d3.drag()
        .on("start", function(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", function(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });
}
