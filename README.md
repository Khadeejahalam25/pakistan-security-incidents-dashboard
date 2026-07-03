# Pakistan Security Incidents — Interactive Dashboard

Five interactive D3.js visualizations exploring a dataset of security incidents in Pakistan
(2018–2020) — perpetrator groups, target types, incident locations, and trends over time. Built
as a Data Analysis & Visualization course project.

## Visualizations

1. **Force-Directed Graph** — network of perpetrator groups linked to the target types they've
   struck, with edge thickness showing incident frequency.
2. **Map Chart** — geographic distribution of incidents across major Pakistani cities, circle
   size scaled by fatalities, plotted over a world basemap.
3. **Timeline** — monthly incident counts from 2018–2020, with a slider and play button to
   animate the trend building up over time.
4. **Tree Map** — target types broken down by perpetrator group, area sized by incident count.
5. **Sunburst Chart** — the same target-type → perpetrator-group hierarchy in a radial layout.

## Dataset

Sourced from a GTD-style (Global Terrorism Database format) dataset covering security incidents
in Pakistan, April 2018 – December 2020: date, city, perpetrator group, fatalities, injured, and
target type for each of 1,000 recorded incidents (`data/incidents.csv`).

Incident locations are geocoded using a lookup of major Pakistani cities' known coordinates,
covering **343 of 1,000 incidents (34%)** — incidents in smaller towns and villages aren't
mapped, since the dataset only provides city names rather than coordinates. The map chart
reflects this geocoded subset; the other four visualizations use the full 1,000-record dataset.

## Tech stack

D3.js v6 · HTML/CSS/JavaScript · Python/pandas (data cleaning)

## What's in this repo

- `index.html` — landing page linking to all five visualizations.
- `js/` — one script per visualization.
- `data/` — cleaned datasets:
  - `incidents.csv` — the full cleaned 1,000-record dataset.
  - `network_data.csv` — aggregated perpetrator-group → target-type edges for the force-directed graph.
  - `map_data.csv` — geocoded incidents for the map chart.
  - `timeline_data.csv` — monthly incident counts for the timeline.
  - `hierarchy_data.csv` — target-type → perpetrator-group hierarchy for the tree map and sunburst.
- `style.css` — shared landing page styling.

## How to run it

Static site, no build step or server-side code required.

```bash
git clone https://github.com/<your-username>/pakistan-security-incidents-dashboard.git
cd pakistan-security-incidents-dashboard

python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (Opening `index.html` directly via
`file://` won't work — browsers block `d3.csv()` from loading local files without a server, due
to CORS restrictions.)

## License

MIT
