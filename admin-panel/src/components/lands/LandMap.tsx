'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { LandParcel } from '@/types/land';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LandMapProps {
  lands?: LandParcel[];
  selectedLand?: LandParcel;
  onPolygonCreate?: (coordinates: [number, number][]) => void;
  editable?: boolean;
  center?: [number, number];
  zoom?: number;
}

// Component to handle drawing functionality
function DrawControls({ onPolygonCreate }: { onPolygonCreate?: (coordinates: [number, number][]) => void }) {
  const map = useMap();
  const drawnItems = useRef(new L.FeatureGroup());

  useEffect(() => {
    if (!onPolygonCreate) return;

    const drawControlRef = drawnItems.current;
    map.addLayer(drawControlRef);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawControlRef,
      },
      draw: {
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!',
          },
          shapeOptions: {
            color: '#2563eb',
            weight: 2,
            fillOpacity: 0.3,
          },
        },
      },
    });

    map.addControl(drawControl);

    // Handle draw events
    const handleDrawCreated = (e: any) => {
      const layer = e.layer;
      drawControlRef.addLayer(layer);
      
      if (layer instanceof L.Polygon) {
        const coordinates = layer.getLatLngs()[0].map((latLng: L.LatLng) => [
          latLng.lat,
          latLng.lng,
        ] as [number, number]);
        onPolygonCreate(coordinates);
      }
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawControlRef);
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
    };
  }, [map, onPolygonCreate]);

  return null;
}

export default function LandMap({
  lands = [],
  selectedLand,
  onPolygonCreate,
  editable = false,
  center = [7.8731, 80.7718], // Sri Lanka center
  zoom = 8,
}: LandMapProps) {
  const getPolygonColor = (land: LandParcel) => {
    if (selectedLand && land.id === selectedLand.id) {
      return '#ff4d4f'; // Red for selected
    }
    return land.isVerified ? '#52c41a' : '#faad14'; // Green for verified, orange for pending
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Satellite layer option */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        />

        {/* Render land polygons */}
        {lands.map((land) => (
          <Polygon
            key={land.id}
            positions={land.coordinates}
            pathOptions={{
              color: getPolygonColor(land),
              weight: selectedLand && land.id === selectedLand.id ? 3 : 2,
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{land.ownerName}</h3>
                <p><strong>Deed:</strong> {land.deedNumber}</p>
                <p><strong>Survey:</strong> {land.surveyPlanNumber}</p>
                <p><strong>Type:</strong> {land.landType}</p>
                <p><strong>Area:</strong> {land.area.toLocaleString()} m²</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-1 ${land.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {land.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Drawing controls for editable mode */}
        {editable && onPolygonCreate && (
          <DrawControls onPolygonCreate={onPolygonCreate} />
        )}
      </MapContainer>
    </div>
  );
}