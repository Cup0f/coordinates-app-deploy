import { useEffect, useMemo, useState } from "react";
import {API_BASE_URL} from "./api.js";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMap } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function FlyToSelected({ selected }) {
    const map = useMap();

    useEffect(() => {
        if (!selected) return;
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.5 });
    }, [selected, map]);

    return null;
}

export default function MapView() {
    const [coords, setCoords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                
                const res = await fetch(`${API_BASE_URL}/api/coordinates`);
                if (!res.ok) throw new Error(`API error: ${res.status}`);

                const data = await res.json();
                setCoords(data);
            } catch (e) {
                setError(e?.message ?? "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);
    
    const sorted = useMemo(() => {
        return [...coords].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [coords]);
    
    const selected = useMemo(
        () => sorted.find(c => c.id === selectedId) ?? null,
        [sorted, selectedId],
    );
    
    const polyPoints = useMemo(() => {
        return sorted.map((c) => [c.latitude, c.longitude]);
    }, [sorted]);
    
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Side panel */}
            <div style={{ width: 320, borderRight: "1px solid #ddd", padding: 12, overflow: "auto" }}>
                <h3 style={{ marginTop: 0 }}>Points</h3>

                {selected ? (
                    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
                        <h4 style={{ margin: "0 0 8px 0" }}>Details</h4>
                        <div><b>Name:</b> {selected.name ?? "-"}</div>
                        <div><b>Lat:</b> {selected.latitude}</div>
                        <div><b>Lng:</b> {selected.longitude}</div>
                        <div><b>Order:</b> {selected.order}</div>

                        <button style={{ marginTop: 10 }} onClick={() => alert("Edit mode next!")}>
                            Edit
                        </button>
                    </div>
                ) : (
                    <div style={{ marginBottom: 12, opacity: 0.7 }}>
                        Select a point from the list.
                    </div>
                )}

                {sorted.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        style={{
                            padding: "8px 10px",
                            border: c.id === selectedId ? "1px solid #333" : "1px solid #eee",
                            borderRadius: 8,
                            marginBottom: 8,
                            cursor: "pointer",
                            background: c.id === selectedId ? "#f5f5f5" : "white"
                        }}
                    >
                        <b>{c.name ?? `Point ${c.id}`}</b>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>
                            Order: {c.order} • {c.latitude.toFixed?.(4) ?? c.latitude}, {c.longitude.toFixed?.(4) ?? c.longitude}
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ flex: 1 }}>
                <MapContainer
                    center={[47.4979, 19.0402]}
                    zoom={13}
                    style={{ height: "100vh", width: "100%" }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FlyToSelected selected={selected} />

                    {loading && (
                        <div
                            style={{
                                position: "absolute",
                                zIndex: 1000,
                                top: 10,
                                left: 10,
                                padding: "8px 10px",
                                background: "white",
                                borderRadius: 6,
                            }}
                        >
                            Loading...
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                position: "absolute",
                                zIndex: 1000,
                                top: 10,
                                left: 10,
                                padding: "8px 10px",
                                background: "white",
                                borderRadius: 6,
                                maxWidth: 360,
                            }}
                        >
                            <b>Error:</b> {error}
                        </div>
                    )}

                    {sorted.map((c) => (
                        <Marker key={c.id} position={[c.latitude, c.longitude]}>
                            <Popup>
                                <b>{c.name ?? `Point ${c.id}`}</b>
                                <div>Order: {c.order}</div>
                                <div>
                                    {c.latitude}, {c.longitude}
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {polyPoints.length >= 2 && <Polyline positions={polyPoints} />}
                </MapContainer>
            </div>
        </div>
    );
}
