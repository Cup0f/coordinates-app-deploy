import { useEffect, useMemo, useState } from "react";
import {API_BASE_URL} from "./api.js";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useMap } from "react-leaflet";

import {
    getAllCoordinates,
    updateCoordinate,
    deleteCoordinate,
    createCoordinate,
} from "./api/coordinatesApi.js";

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
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newDraft, setNewDraft] = useState({
        name: "",
        latitude: 47.4979,
        longitude: 19.0402,
        order: 999,
    })

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllCoordinates();
                
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
    
    useEffect(() => {
        if (!selected) {
            setIsEditing(false);
            setDraft(null);
            return;
        }
        
        setIsEditing(false);
        setDraft({
            id: selected.id,
            name: selected.name,
            latitude: selected.latitude,
            longitude: selected.longitude,
            order: selected.order,
        });
    }, [selected]);
    
    const polyPoints = useMemo(() => {
        return sorted.map((c) => [c.latitude, c.longitude]);
    }, [sorted]);

    const updateDraft = (field, value) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    const updateNewDraft = (field, value) => {
        setNewDraft((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Side panel */}
            <div style={{ width: 320, borderRight: "1px solid #ddd", padding: 12, overflow: "auto" }}>
                <h3 style={{ marginTop: 0 }}>Points</h3>

                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button
                        onClick={() => {
                            setIsCreating((v) => !v);
                            setIsEditing(false);
                        }}
                    >
                        {isCreating ? "Close" : "+ Add point"}
                    </button>
                </div>

                {isCreating && (
                    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ margin: 0 }}>Create</h4>
                            <button onClick={() => setIsCreating(false)}>Cancel</button>
                        </div>

                        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                            <label style={{ display: "grid", gap: 4 }}>
                                <span>Name</span>
                                <input
                                    value={newDraft.name}
                                    onChange={(e) => updateNewDraft("name", e.target.value)}
                                />
                            </label>

                            <label style={{ display: "grid", gap: 4 }}>
                                <span>Latitude</span>
                                <input
                                    type="number"
                                    step="any"
                                    value={newDraft.latitude}
                                    onChange={(e) => updateNewDraft("latitude", Number(e.target.value))}
                                />
                            </label>

                            <label style={{ display: "grid", gap: 4 }}>
                                <span>Longitude</span>
                                <input
                                    type="number"
                                    step="any"
                                    value={newDraft.longitude}
                                    onChange={(e) => updateNewDraft("longitude", Number(e.target.value))}
                                />
                            </label>

                            <label style={{ display: "grid", gap: 4 }}>
                                <span>Order</span>
                                <input
                                    type="number"
                                    value={newDraft.order}
                                    onChange={(e) => updateNewDraft("order", Number(e.target.value))}
                                />
                            </label>

                            <button
                                onClick={async () => {
                                    try {
                                        setError("");

                                        const dto = {
                                            name: newDraft.name,
                                            latitude: newDraft.latitude,
                                            longitude: newDraft.longitude,
                                            order: newDraft.order,
                                        };

                                        const created = await createCoordinate(dto);
                                        
                                        setCoords((prev) => [...prev, created]);
                                        setSelectedId(created.id);
                                        setIsCreating(false);
                                        
                                        setNewDraft({
                                            name: "",
                                            latitude: newDraft.latitude,
                                            longitude: newDraft.longitude,
                                            order: newDraft.order + 1,
                                        });
                                    } catch (e) {
                                        setError(e?.message ?? "Unknown error");
                                    }
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                )}


                {selected ? (
                    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ margin: 0 }}>{isEditing ? "Edit" : "Details"}</h4>

                            {!isEditing ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => setIsEditing(true)}>
                                        Edit
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (!selected) return;

                                            const ok = confirm(`Delete "${selected.name ?? `Point ${selected.id}`}"?`);
                                            if (!ok) return;

                                            try {
                                                setError("");

                                                await deleteCoordinate(selected.id);
                                                
                                                setCoords((prev) => prev.filter((c) => c.id !== selected.id));
                                                setSelectedId(null);
                                                setIsEditing(false);
                                                setDraft(null);
                                            } catch (e) {
                                                setError(e?.message ?? "Unknown error");
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => {
                                            // reset draft
                                            setDraft({
                                                id: selected.id,
                                                name: selected.name ?? "",
                                                latitude: selected.latitude,
                                                longitude: selected.longitude,
                                                order: selected.order,
                                            });
                                            setIsEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={async () => {
                                            try {
                                                setError("");

                                                const dto = {
                                                    name: draft.name,
                                                    latitude: draft.latitude,
                                                    longitude: draft.longitude,
                                                    order: draft.order,
                                                };

                                                const updated = await updateCoordinate(draft.id, dto);

                                                if (updated) {
                                                    // backend Ok(entity)
                                                    setCoords((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
                                                } else {
                                                    // backend NoContent -> reload
                                                    const data = await getAllCoordinates();
                                                    setCoords(data);
                                                }

                                                setIsEditing(false);
                                            } catch (e) {
                                                setError(e?.message ?? "Unknown error");
                                            }
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            <div style={{ marginTop: 10 }}>
                                <div><b>Name:</b> {selected.name ?? "-"}</div>
                                <div><b>Lat:</b> {selected.latitude}</div>
                                <div><b>Lng:</b> {selected.longitude}</div>
                                <div><b>Order:</b> {selected.order}</div>
                            </div>
                        ) : (
                            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                                <label style={{ display: "grid", gap: 4 }}>
                                    <span>Name</span>
                                    <input
                                        value={draft?.name ?? ""}
                                        onChange={(e) => updateDraft("name", e.target.value)}
                                    />
                                </label>

                                <label style={{ display: "grid", gap: 4 }}>
                                    <span>Latitude</span>
                                    <input
                                        type="number"
                                        step="any"
                                        value={draft?.latitude ?? ""}
                                        onChange={(e) => updateDraft("latitude", Number(e.target.value))}
                                    />
                                </label>

                                <label style={{ display: "grid", gap: 4 }}>
                                    <span>Longitude</span>
                                    <input
                                        type="number"
                                        step="any"
                                        value={draft?.longitude ?? ""}
                                        onChange={(e) => updateDraft("longitude", Number(e.target.value))}
                                    />
                                </label>

                                <label style={{ display: "grid", gap: 4 }}>
                                    <span>Order</span>
                                    <input
                                        type="number"
                                        value={draft?.order ?? ""}
                                        onChange={(e) => updateDraft("order", Number(e.target.value))}
                                    />
                                </label>
                            </div>
                        )}
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
                    style={{ height: "100%", width: "100%" }}
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
