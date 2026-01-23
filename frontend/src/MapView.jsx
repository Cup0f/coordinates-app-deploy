import {useEffect, useMemo, useState} from "react";
import L from "leaflet";
import SidePanel from "./components/SidePanel.jsx";
import MapCanvas from "./components/MapCanvas.jsx";

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
    });

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
        setDraft((prev) => ({...prev, [field]: value}));
    };

    const updateNewDraft = (field, value) => {
        setNewDraft((prev) => ({...prev, [field]: value}));
    };

    const handleSaveEdit = async () => {
        try {
            if (!draft) return;

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
    }
    
    const handleCancelEdit = () => {
        if (!selected) return;
        // reset draft
        setDraft({
            id: selected.id,
            name: selected.name ?? "",
            latitude: selected.latitude,
            longitude: selected.longitude,
            order: selected.order,
        });
        setIsEditing(false);
    }
    
    const handleDeleteSelected = async () => {
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
    }
    
    const handleCreate = async () => {
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
    }

    return (
        <div style={{display: "flex", height: "100vh"}}>
            <SidePanel
                points={sorted}
                selectedId={selectedId}
                onSelect={setSelectedId}
                selected={selected}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                draft={draft}
                updateDraft={updateDraft}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDeleteSelected={handleDeleteSelected}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                newDraft={newDraft}
                updateNewDraft={updateNewDraft}
                onCreate={handleCreate}
                clearError={() => setError("")}
            />

            <MapCanvas
                points={sorted}
                selected={selected}
                polyPoints={polyPoints}
                loading={loading}
                error={error}
            />
        </div>
    );
}
