# Call Traffic - 2002 - 2011 Phone and Message Service - Traffic Billed in US

These two visualizations depict data from the FCC International Traffic Data Reports, 2002 to 2011. The report makes available data on international message telephone, private line and miscellaneous services between the United States and other countries. 

- To view the animation of traffic by year, [view this gh-page][byyear]
- To view the animation of traffic by region, [view this gh-page][byregion]

## Purpose

This project is one of a number of visualization tools being used to communcate policy issues in new formats. These pages allow the public to investigate the call traffic data in a unique way, and to see changes in patterns by year and by region.

Information on the Annual International Traffic Report can be found on The FCC’s International Bureau page on [International Telecommunications Traffic Reports][ibpage]

Both visualizations are driven by D3.js, the javascript library by Mike Bostock.  D3 is a powerful tool for manipulating data in the browser, and can bring your “data to life”. For more information on D3, visit the [d3js.org][d3] page.

## Data

FCC makes the International Traffic data available via [this api][apipage] for traffic by year.  These data are downloaded for each year and then assembled into a single json file. These are available in the /data folder.

**Libraries used**
- D3.js version 3.0
- D3.geo library for the animated globe (we find this an important and flexible additional to working with spatial data). 

## Inspiration

The Traffic By Region (bubble chart) was inspired by this [NY Times Chart][nyt] and this [great tutorial][tutorial]. 


[byyear]:http://fcc.github.io/calltraffic/trafficbyyear.html
[byregion]:http://fcc.github.io/calltraffic/traffic2011.html 
[ibpage]:http://www.fcc.gov/encyclopedia/international-telecommunications-traffic-reports
[d3]:http://d3js.org  
[apipage]: http://www.fcc.gov/developers 
[nyt]:http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html 
[tutorial]:http://vallandingham.me/bubble_charts_in_d3.html 

