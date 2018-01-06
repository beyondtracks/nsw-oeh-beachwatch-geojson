# nsw-oeh-beachwatch-geojson

The NSW Office of Environment and Heritage (OEH) [publishes a JSON feed of swimming suitability](http://www.environment.nsw.gov.au/beachmapp/Data) as part of [Beachwatch](http://www.environment.nsw.gov.au/beachmapp/), this project aims to make that feed more developer friendly.

You can either build this application into your own pipeline or use the hosted URL at https://www.beyondtracks.com/contrib/nsw-oeh-beachwatch.geojson (no service availability guarantees!), [preview it at geojson.io](http://geojson.io/#data=data:text/x-url,https://www.beyondtracks.com/contrib/nsw-oeh-beachwatch.geojson).

_NSW OEH Beachwatch Data is © State of New South Wales and Office of Environment and Heritage 2018. Licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0)._

# Where is it used?

This pipeline has been built for [www.beyondtracks.com](https://www.beyondtracks.com) to provide information about water quality of swimming spots along bushwalks.

# Features

 - **Access-Control-Allow-Origin Header** The upstream feed lacks the this header meaning web applications aren't able to use the feed directly. The sample crontab file allows you to reduce and host the Beachwatch data and serve it with your own HTTP server to add this header. This issue was reported to OEH on the 24th Nov 2015 with the reply that they will follow up with their digital strategy people and will advise once they have responded.
 - **Drop unneeded or duplicate properties**
 - **Coordinate Precision** Practically beach markers won't be more than 10m in accuracy so limiting to 4 decimal places will suffice.
 - **Unpack Overloaded fields** The upstream feed overloads properties into the `Categories` field. These key value is exploded out to make it easier to read in applications.

# Usage

Install the Node dependencies with:

    yarn install

Run the script with:

    ./bin/nsw-oeh-beachwatch-geojson nsw-oeh-beachwatch.geojson

This will download the upstream feed, process it and save the resulting GeoJSON file at `nsw-oeh-beachwatch.geojson`.

# Warranty

The use of information in the Beachwatch feed can affect peoples health.
Errors or omissions may be present and/or the upstream supplied data
structure may change without any notice causing issues. Use at your own risk.

THIS SOFTWARE IS PROVIDED ``AS IS'' AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
