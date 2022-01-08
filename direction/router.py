from fastapi import APIRouter
from starlette.responses import JSONResponse
from errors import Error
import googlemaps
from fastapi.encoders import jsonable_encoder
import polyline

router = APIRouter()
gmap = googlemaps.Client(key="AIzaSyAEQvKUVouPDENLkQlCF6AAap1Ze-6zMos")

@router.get("/directions", tags=["Direction"])
def get_direction(source_latitude: str,
                  source_longitude: str,
                  destination_latitude: str,
                  destination_longitude: str):
    
    
    direction =  gmap.directions(f'{source_latitude},{source_longitude}', f'{destination_latitude},{destination_longitude}')
    if not direction:
        return []
    route = direction[0]
    path = []
    if 'legs' in route:
        for leg in route['legs']:
            if 'steps' in leg:
                for step in leg['steps']:
                    if 'steps' in step:
                        for stepp in step['steps']:
                            points = stepp.get('polyline', {})
                            if 'points' in points:
                                coords = polyline.decode(points['points'])
                                path.extend([{'lat': x[0], 'lng': x[1]} for x in coords])

                    else:
                        points = step.get('polyline', {})
                        if 'points' in points:
                            print(points)
                            coords = polyline.decode(points['points'])
                            path.extend([{'lat': x[0], 'lng': x[1]} for x in coords])

    return path


    # except Exception as e:
    #     return JSONResponse(jsonable_encoder(Error(status="INTERNAL_SERVER_ERROR", message=str(e))), status_code=500)
