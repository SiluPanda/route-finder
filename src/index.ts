import express, { Request, Response, NextFunction } from 'express'
import { Client } from '@googlemaps/google-maps-services-js'
import polyline from 'google-polyline'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const gmap = new Client({})

const app = express()
app.use(express.json())

app.get('/ping', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.send({
            message: `server is healthy`
        })
    } catch (err) {
        next(err)
    }
})

interface Point {
    lat: Number;
    lng: Number;
}

app.get('/directions', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const sLat: string = (request.query.source_latitude || '').toString()
        const sLng: string = (request.query.source_longitude || '').toString()

        const dLat: string = (request.query.destination_latitude || '').toString()
        const dLng: string = (request.query.destination_longitude || '').toString()


        let direction = (await gmap.directions({
            params: {
                origin: `${sLat},${sLng}`,
                destination: `${dLat},${dLng}`,
                optimize: false,
                key: process.env.APIKEY
            }
        })).data

        let path: Point[] = []
        if (direction.routes.length > 0) {
            let route = direction.routes[0]
            if (route.legs) {
                for (let leg of route.legs) {
                    let steps = leg.steps
                    for (let step of steps) {
                        let currPaths = polyline.decode(step.polyline.points)
                        for (let currPath of currPaths) {
                            path.push({ lat: currPath[0], lng: currPath[1] })
                        }
                    }
                }
            }
        }
        let coordscsv = ''
        
        for (let point of path) {
            coordscsv += point.lat + ',' + point.lng + '\n'
        }
        fs.writeFile('hello.csv', coordscsv, (err) => {
            if (err) console.log("could not write csv")
        })
        return response.send(path)
    } catch (err) {
        next(err)
    }
})

app.use(async function(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err)
    return res.status(500).json({
        message: `something went wrong`
    })

})

app.listen(process.env.PORT || 9989, () => console.log("server started"))