"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const google_polyline_1 = __importDefault(require("google-polyline"));
const gmap = new google_maps_services_js_1.Client({});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/ping', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.send({
            message: `server is healthy`
        });
    }
    catch (err) {
        next(err);
    }
}));
app.get('/directions', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sLat = (request.query.source_latitude || '').toString();
        const sLng = (request.query.source_longitude || '').toString();
        const dLat = (request.query.destination_latitude || '').toString();
        const dLng = (request.query.destination_longitude || '').toString();
        console.log(sLat, sLng, dLat, dLng);
        let direction = (yield gmap.directions({
            params: {
                origin: `${sLat},${sLng}`,
                destination: `${dLat},${dLng}`,
                optimize: false,
                key: "AIzaSyAEQvKUVouPDENLkQlCF6AAap1Ze-6zMos"
            }
        })).data;
        let path = [];
        if (direction.routes.length > 0) {
            let route = direction.routes[0];
            if (route.legs) {
                for (let leg of route.legs) {
                    let steps = leg.steps;
                    for (let step of steps) {
                        path.push(google_polyline_1.default.decode(step.polyline.points));
                    }
                }
            }
        }
        return response.send(path);
    }
    catch (err) {
        next(err);
    }
}));
app.use(function (err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(err);
        return res.status(500).json({
            message: `something went wrong`
        });
    });
});
app.listen(process.env.port || 9989, () => console.log("server started"));
//# sourceMappingURL=index.js.map