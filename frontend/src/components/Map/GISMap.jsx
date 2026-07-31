import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet + Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * GISMap Component
 * A premium, gov-grade interactive map for land visualization.
 * 
 * @param {Array} parcels - Array of parcel objects { parcel_id, coordinates, status, area }
 * @param {Array} center - [lat, lng] for map center
 * @param {number} zoom - Zoom level
 * @param {boolean} interactive - Whether users can interact (default: true)
 */
const GISMap = ({ parcels = [], center = [9.082, 8.6753], zoom = 6, interactive = true }) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/5 relative bg-reg-dark/20">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        zoomControl={interactive}
        className="w-full h-full grayscale-[0.3] brightness-[0.7] contrast-[1.1]"
      >
        <ChangeView center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {parcels
          .filter(parcel => Array.isArray(parcel.coordinates) && parcel.coordinates.length >= 3)
          .map((parcel, idx) => (
          <Polygon
            key={parcel.parcel_id || idx}
            positions={parcel.coordinates}
            pathOptions={{
              color: getStatusColor(parcel.status),
              fillColor: getStatusColor(parcel.status),
              fillOpacity: 0.25,
              weight: 2,
              dashArray: parcel.status === 'Active' ? '' : '5, 5'
            }}
          >
            <Popup className="premium-popup">
              <div className="p-2 space-y-1">
                <h4 className="text-sm font-black uppercase tracking-tight text-nigeria-green">Asset #{parcel.parcel_id}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-black/60">
                   <span>Status:</span>
                   <span className="text-black">{parcel.status}</span>
                   <span>Area:</span>
                   <span className="text-black">{parcel.area} SQM</span>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      {/* Map HUD Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nigeria-green animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Polygon Network Synced</span>
         </div>
      </div>
      
      <div className="absolute bottom-4 left-4 z-[1000]">
         <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none block mb-0.5">Reference Datum</span>
            <span className="text-[10px] font-mono text-white uppercase truncate">WGS-84 / EGM96</span>
         </div>
      </div>
    </div>
  )
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'verified':
      return '#059669'; // Nigeria Green
    case 'initiated':
    case 'pending':
      return '#d4af37'; // Gold
    case 'disputed':
      return '#e11d48'; // Rose
    case 'frozen':
      return '#475569'; // Slate
    default:
      return '#0ea5e9'; // Sky
  }
}

export default GISMap
