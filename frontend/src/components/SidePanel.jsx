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
    const panelStyle = {
        width: 340,
        borderRight: "1px solid #e5e7eb",
        padding: 16,
        overflow: "auto",
        background: "#fafafa",
    };

    const headerStyle = {
        marginTop: 0,
        marginBottom: 12,
        fontWeight: 650,
    };

    const cardStyle = {
        background: "#caf1ff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #eef2f7",
    };

    const rowBetween = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    };

    const buttonBase = {
        padding: "7px 12px",
        borderRadius: 8,
        fontSize: 14,
        cursor: "pointer",
    };

    const buttonPrimary = {
        ...buttonBase,
        border: "1px solid #1d4ed8",
        background: "#2563eb",
        color: "white",
    };

    const buttonSecondary = {
        ...buttonBase,
        border: "1px solid #d1d5db",
        background: "white",
        color: "#111827",
    };

    const buttonDanger = {
        ...buttonBase,
        border: "1px solid #ef4444",
        background: "white",
        color: "#ef4444",
    };

    const inputStyle = {
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        width: "100%",
        boxSizing: "border-box",
        fontSize: 14,
    };

    const labelStyle = { display: "grid", gap: 6 };
    const subtleText = { fontSize: 12, color: "#6b7280" };

    return (
        <div style={panelStyle}>
            <h3 style={headerStyle}>📍 Points</h3>

            {/* Create toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button
                    style={buttonPrimary}
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
                <div style={cardStyle}>
                    <div style={rowBetween}>
                        <h4 style={{ margin: 0 }}>Create</h4>
                        <button style={buttonSecondary} onClick={() => setIsCreating(false)}>
                            Cancel
                        </button>
                    </div>

                    <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <label style={labelStyle}>
                            <span style={subtleText}>Name</span>
                            <input
                                style={inputStyle}
                                value={newDraft.name}
                                onChange={(e) => updateNewDraft("name", e.target.value)}
                            />
                        </label>

                        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                            <label style={labelStyle}>
                                <span style={subtleText}>Latitude</span>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    step="any"
                                    value={newDraft.latitude}
                                    onChange={(e) =>
                                        updateNewDraft("latitude", Number(e.target.value))
                                    }
                                />
                            </label>

                            <label style={labelStyle}>
                                <span style={subtleText}>Longitude</span>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    step="any"
                                    value={newDraft.longitude}
                                    onChange={(e) =>
                                        updateNewDraft("longitude", Number(e.target.value))
                                    }
                                />
                            </label>
                        </div>

                        <label style={labelStyle}>
                            <span style={subtleText}>Order</span>
                            <input
                                style={inputStyle}
                                type="number"
                                value={newDraft.order}
                                onChange={(e) =>
                                    updateNewDraft("order", Number(e.target.value))
                                }
                            />
                        </label>

                        <button style={buttonPrimary} onClick={onCreate}>
                            Create
                        </button>
                    </div>
                </div>
            )}

            {/* Selected */}
            {selected ? (
                <div style={cardStyle}>
                    <div style={rowBetween}>
                        <h4 style={{ margin: 0 }}>{isEditing ? "Edit" : "Details"}</h4>

                        {!isEditing ? (
                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={buttonSecondary} onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                                <button style={buttonDanger} onClick={onDeleteSelected}>
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={buttonSecondary} onClick={onCancelEdit}>
                                    Cancel
                                </button>
                                <button style={buttonPrimary} onClick={onSaveEdit}>
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditing ? (
                        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                            <div>
                                <div style={subtleText}>Name</div>
                                <div style={{ fontWeight: 600 }}>{selected.name ?? "-"}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div>
                                    <div style={subtleText}>Latitude</div>
                                    <div>{selected.latitude}</div>
                                </div>
                                <div>
                                    <div style={subtleText}>Longitude</div>
                                    <div>{selected.longitude}</div>
                                </div>
                            </div>

                            <div>
                                <div style={subtleText}>Order</div>
                                <div>{selected.order}</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                            <label style={labelStyle}>
                                <span style={subtleText}>Name</span>
                                <input
                                    style={inputStyle}
                                    value={draft?.name ?? ""}
                                    onChange={(e) => updateDraft("name", e.target.value)}
                                />
                            </label>

                            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                                <label style={labelStyle}>
                                    <span style={subtleText}>Latitude</span>
                                    <input
                                        style={inputStyle}
                                        type="number"
                                        step="any"
                                        value={draft?.latitude ?? ""}
                                        onChange={(e) =>
                                            updateDraft("latitude", Number(e.target.value))
                                        }
                                    />
                                </label>

                                <label style={labelStyle}>
                                    <span style={subtleText}>Longitude</span>
                                    <input
                                        style={inputStyle}
                                        type="number"
                                        step="any"
                                        value={draft?.longitude ?? ""}
                                        onChange={(e) =>
                                            updateDraft("longitude", Number(e.target.value))
                                        }
                                    />
                                </label>
                            </div>

                            <label style={labelStyle}>
                                <span style={subtleText}>Order</span>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={draft?.order ?? ""}
                                    onChange={(e) =>
                                        updateDraft("order", Number(e.target.value))
                                    }
                                />
                            </label>
                        </div>
                    )}
                </div>
            ) : (
                <div style={cardStyle}>
                    <div style={{ fontWeight: 600 }}>No selection</div>
                    <div style={subtleText}>Select a point from the list.</div>
                </div>
            )}

            {/* List */}
            <div style={{ marginTop: 8 }}>
                {points.map((c) => {
                    const active = c.id === selectedId;

                    return (
                        <div
                            key={c.id}
                            onClick={() => {
                                clearError?.();
                                onSelect(c.id);
                            }}
                            style={{
                                background: active ? "#eff6ff" : "white",
                                border: active
                                    ? "1px solid #2563eb"
                                    : "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: "10px 12px",
                                marginBottom: 10,
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ fontWeight: 600 }}>
                                    {c.name ?? `Point ${c.id}`}
                                </div>
                                <div style={subtleText}>#{c.order}</div>
                            </div>

                            <div style={{ ...subtleText, marginTop: 4 }}>
                                {c.latitude.toFixed?.(4) ?? c.latitude},{" "}
                                {c.longitude.toFixed?.(4) ?? c.longitude}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
