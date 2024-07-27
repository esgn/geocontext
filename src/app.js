import express from 'express';
import { query, matchedData, validationResult } from 'express-validator';
import cors from 'cors';
import morgan from 'morgan';

import logger from './logger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => logger.info(message.trim()),
        },
    }
);
app.use(morganMiddleware);


app.get('/health', function (req, res) {
    return res.json({
        "message": "OK"
    })
});

import { getAltitudeByLocation } from './services/geoplateforme.js';

app.get('/api/altitude', [
    query("lon").notEmpty().isNumeric(),
    query("lat").notEmpty().isNumeric()
], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: "invalid parameters",
            errors: errors.array()
        });
    }

    const params = matchedData(req);
    const result = await getAltitudeByLocation(params.lon, params.lat);
    return res.json(result);
});


/*
export async function getCommune(location: Coordinate): Promise<FeatureCommune|null> {
    const cql_filter = `INTERSECTS(geom,Point(${location.lat} ${location.lon}))`;
    const url = `https://data.geopf.fr/wfs?service=WFS&request=GetFeature&typeName=ADMINEXPRESS-COG.LATEST:commune&outputFormat=application/json&cql_filter=${encodeURI(cql_filter)}`;
    const featureCollection = await fetch(url).then(res => res.json());
    if ( featureCollection.features.length == 0 ){
        return null;
    }
    
    let feature : FeatureCommune = featureCollection.features[0];
    return feature;
}
*/


export default app;

