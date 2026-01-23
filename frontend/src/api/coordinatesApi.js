const API_BASE_URL = "https://localhost:7059";
async function ensureOk(res, fallbackMsg) {
    if (res.ok) return;

    let details = "";
    try {
        details = await res.text();
    } catch {
        // ignore
    }

    const msg = details
        ? `${fallbackMsg} (${res.status}) - ${details}`
        : `${fallbackMsg} (${res.status})`;

    throw new Error(msg);
}

// GET /api/coordinates
export async function getAllCoordinates() {
    const res = await fetch(`${API_BASE_URL}/api/coordinates`);
    await ensureOk(res, "Failed to load coordinates");
    return await res.json();
}

// POST /api/coordinates
export async function createCoordinate(dto) {
    const res = await fetch(`${API_BASE_URL}/api/coordinates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });

    await ensureOk(res, "Failed to create coordinate");
    return await res.json();
}

// PUT /api/coordinates/{id}
export async function updateCoordinate(id, dto) {
    const res = await fetch(`${API_BASE_URL}/api/coordinates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });

    // Ha a backend Ok(entity)-t ad vissza:
    if (res.status === 204) return null;
    await ensureOk(res, "Failed to update coordinate");
    return await res.json();
}

// DELETE /api/coordinates/{id}
export async function deleteCoordinate(id) {
    const res = await fetch(`${API_BASE_URL}/api/coordinates/${id}`, {
        method: "DELETE",
    });

    await ensureOk(res, "Failed to delete coordinate");
}