// Map Chart: Incident locations across Pakistan (major cities with known coordinates)

const mapWidth = 900;
const mapHeight = 600;

const mapSvg = d3.select("#mapChart")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

const mapProjection = d3.geoMercator()
    .center([69.3451, 30.3753])   // centered on Pakistan
    .scale(1400)
    .translate([mapWidth / 2, mapHeight / 2]);

const mapPath = d3.geoPath().projection(mapProjection);

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

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(geojson => {
        mapSvg.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", mapPath)
            .attr("fill", "#e8e8e8")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.5);

        d3.csv("data/map_data.csv").then(data => {
            mapSvg.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", d => mapProjection([+d.lon, +d.lat])[0])
                .attr("cy", d => mapProjection([+d.lon, +d.lat])[1])
                .attr("r", d => 3 + Math.sqrt(+d.fatalities))
                .attr("fill", "#e63946")
                .attr("fill-opacity", 0.6)
                .attr("stroke", "#900")
                .attr("stroke-width", 0.5)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "#ffb703");
                    tooltip.style("opacity", 1)
                        .html(`<strong>${d.city}</strong><br>${d.date}<br>${d.perpetrator_group}<br>Fatalities: ${d.fatalities}, Injured: ${d.injured}`)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 10}px`);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill", "#e63946");
                    tooltip.style("opacity", 0);
                });
        });
    });
