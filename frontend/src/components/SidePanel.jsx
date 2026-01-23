export default function SidePanel({
                                      points,
                                      selectedId,
                                      onSelect,

                                      // Selected detail/edit
                                      selected,
                                      isEditing,
                                      setIsEditing,
                                      draft,
                                      updateDraft,
                                      onSaveEdit,
                                      onCancelEdit,
                                      onDeleteSelected,

                                      // Create
                                      isCreating,
                                      setIsCreating,
                                      newDraft,
                                      updateNewDraft,
                                      onCreate,

                                      // UI
                                      clearError,
                                  }) {
    return (
        <div style={{width: 320, borderRight: "1px solid #ddd", padding: 12, overflow: "auto"}}>
            <h3 style={{marginTop: 0}}>Points</h3>

            {/* Create toggle */}
            <div style={{display: "flex", gap: 8, marginBottom: 12}}>
                <button
                    onClick={() => {
                        clearError?.();
                        setIsCreating((v) => !v);
                        setIsEditing(false);
                    }}
                >
                    {isCreating ? "Close" : "+ Add point"}
                </button>
            </div>

            {/* Create form */}
            {isCreating && (
                <div style={{padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h4 style={{margin: 0}}>Create</h4>
                        <button onClick={() => setIsCreating(false)}>Cancel</button>
                    </div>

                    <div style={{marginTop: 10, display: "grid", gap: 8}}>
                        <label style={{display: "grid", gap: 4}}>
                            <span>Name</span>
                            <input value={newDraft.name} onChange={(e) => updateNewDraft("name", e.target.value)}/>
                        </label>

                        <label style={{display: "grid", gap: 4}}>
                            <span>Latitude</span>
                            <input
                                type="number"
                                step="any"
                                value={newDraft.latitude}
                                onChange={(e) => updateNewDraft("latitude", Number(e.target.value))}
                            />
                        </label>

                        <label style={{display: "grid", gap: 4}}>
                            <span>Longitude</span>
                            <input
                                type="number"
                                step="any"
                                value={newDraft.longitude}
                                onChange={(e) => updateNewDraft("longitude", Number(e.target.value))}
                            />
                        </label>

                        <label style={{display: "grid", gap: 4}}>
                            <span>Order</span>
                            <input
                                type="number"
                                value={newDraft.order}
                                onChange={(e) => updateNewDraft("order", Number(e.target.value))}
                            />
                        </label>

                        <button onClick={onCreate}>Create</button>
                    </div>
                </div>
            )}

            {/* Selected details/edit */}
            {selected ? (
                <div style={{padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12}}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h4 style={{margin: 0}}>{isEditing ? "Edit" : "Details"}</h4>

                        {!isEditing ? (
                            <div style={{display: "flex", gap: 8}}>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <button onClick={onDeleteSelected}>Delete</button>
                            </div>
                        ) : (
                            <div style={{display: "flex", gap: 8}}>
                                <button onClick={onCancelEdit}>Cancel</button>
                                <button onClick={onSaveEdit}>Save</button>
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <div style={{marginTop: 10}}>
                            <div><b>Name:</b> {selected.name ?? "-"}</div>
                            <div><b>Lat:</b> {selected.latitude}</div>
                            <div><b>Lng:</b> {selected.longitude}</div>
                            <div><b>Order:</b> {selected.order}</div>
                        </div>
                    ) : (
                        <div style={{marginTop: 10, display: "grid", gap: 8}}>
                            <label style={{display: "grid", gap: 4}}>
                                <span>Name</span>
                                <input value={draft?.name ?? ""} onChange={(e) => updateDraft("name", e.target.value)}/>
                            </label>

                            <label style={{display: "grid", gap: 4}}>
                                <span>Latitude</span>
                                <input
                                    type="number"
                                    step="any"
                                    value={draft?.latitude ?? ""}
                                    onChange={(e) => updateDraft("latitude", Number(e.target.value))}
                                />
                            </label>

                            <label style={{display: "grid", gap: 4}}>
                                <span>Longitude</span>
                                <input
                                    type="number"
                                    step="any"
                                    value={draft?.longitude ?? ""}
                                    onChange={(e) => updateDraft("longitude", Number(e.target.value))}
                                />
                            </label>

                            <label style={{display: "grid", gap: 4}}>
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
                <div style={{marginBottom: 12, opacity: 0.7}}>
                    Select a point from the list.
                </div>
            )}

            {/* List */}
            {points.map((c) => (
                <div
                    key={c.id}
                    onClick={() => {
                        clearError?.();
                        onSelect(c.id);
                    }}
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
                    <div style={{fontSize: 12, opacity: 0.8}}>
                        Order: {c.order} • {c.latitude.toFixed?.(4) ?? c.latitude}, {c.longitude.toFixed?.(4) ?? c.longitude}
                    </div>
                </div>
            ))}
        </div>
    );
}
