import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";

function FlyToSelected({ selected }) {
    const map = useMap();

    useEffect(() => {
        if (!selected) return;
        map.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.5 });
    }, [selected, map]);

    return null;
}

export default function MapCanvas({
                                      points,
                                      selected,
                                      polyPoints,
                                      loading,
                                      error,
                                  }) {
    return (
        <div style={{ flex: 1 }}>
            <MapContainer
                center={[47.4979, 19.0402]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FlyToSelected selected={selected} />

                {/* Optional overlay */}
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

                {points.map((c) => (
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
    );
}
