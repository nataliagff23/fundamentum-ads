import { useState, useEffect } from "react";

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const AIRTABLE_BASE = import.meta.env.VITE_AIRTABLE_BASE;
const AIRTABLE_TABLE = "Preguntas Fundamentum";
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`;
const AIRTABLE_HEADERS = {
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
};

async function fetchEntries() {
  const res = await fetch(`${AIRTABLE_URL}?sort%5B0%5D%5Bfield%5D=Votos&sort%5B0%5D%5Bdirection%5D=desc`, {
    headers: AIRTABLE_HEADERS,
  });
  const data = await res.json();
  return (data.records || []).map((r) => ({
    id: r.id,
    nombre: r.fields.Nombre || "",
    nicho: r.fields.Nicho || "",
    tipoNegocio: r.fields["Descripción del negocio"] || "",
    pregunta: r.fields["Pregunta para el curso"] || "",
    votes: r.fields.Votos || 0,
    timestamp: new Date(r.createdTime).getTime(),
  }));
}

async function createEntry(fields) {
  const res = await fetch(AIRTABLE_URL, {
    method: "POST",
    headers: AIRTABLE_HEADERS,
    body: JSON.stringify({
      fields: {
        Nombre: fields.nombre,
        Nicho: fields.nicho,
        "Descripción del negocio": fields.tipoNegocio,
        "Pregunta para el curso": fields.pregunta,
        Votos: 0,
      },
    }),
  });
  const data = await res.json();
  return {
    id: data.id,
    nombre: data.fields.Nombre,
    nicho: data.fields.Nicho,
    tipoNegocio: data.fields["Descripción del negocio"],
    pregunta: data.fields["Pregunta para el curso"],
    votes: data.fields.Votos || 0,
    timestamp: new Date(data.createdTime).getTime(),
  };
}

async function updateVotes(recordId, newVotes) {
  await fetch(`${AIRTABLE_URL}/${recordId}`, {
    method: "PATCH",
    headers: AIRTABLE_HEADERS,
    body: JSON.stringify({
      fields: { Votos: newVotes },
    }),
  });
}

const NICHO_OPTIONS = [
  "E-commerce / Tienda online",
  "Salud y bienestar",
  "Educación / Cursos online",
  "Bienes raíces / Inmobiliaria",
  "Restaurantes / Comida",
  "Moda y belleza",
  "Tecnología / SaaS",
  "Servicios locales",
  "Turismo / Viajes",
  "Finanzas / Inversión",
  "Fitness / Deporte",
  "Marketing / Agencia",
  "Otro",
];

function getNichoColor(nicho) {
  const colors = {
    "E-commerce / Tienda online": "#f59e0b",
    "Salud y bienestar": "#10b981",
    "Educación / Cursos online": "#6366f1",
    "Bienes raíces / Inmobiliaria": "#ef4444",
    "Restaurantes / Comida": "#f97316",
    "Moda y belleza": "#ec4899",
    "Tecnología / SaaS": "#06b6d4",
    "Servicios locales": "#84cc16",
    "Turismo / Viajes": "#8b5cf6",
    "Finanzas / Inversión": "#14b8a6",
    "Fitness / Deporte": "#f43f5e",
    "Marketing / Agencia": "#a855f7",
    "Otro": "#94a3b8",
  };
  return colors[nicho] || "#94a3b8";
}

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0F0D05; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 2px; }
  .inp { background: #1A1810; border: 1px solid #3a3520; color: #D6D2C4; border-radius: 10px; padding: 12px 16px; width: 100%; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .inp:focus { border-color: #C9A84C; }
  .inp::placeholder { color: #888270; }
  select.inp option { background: #1A1810; }
  .btn-gold { background: #C9A84C; border: none; color: #0F0D05; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 14px; padding: 13px 28px; border-radius: 10px; cursor: pointer; letter-spacing: 0.04em; transition: all 0.2s; }
  .btn-gold:hover { background: #E2C06A; transform: translateY(-1px); }
  .btn-gold:disabled { background: #C9A84C; color: #0F0D05; cursor: not-allowed; transform: none; opacity: 0.5; }
  .card { background: #231F10; border: 1px solid #3a3520; border-radius: 14px; padding: 20px 22px; transition: border-color 0.2s; }
  .card:hover { border-color: #8C6E28; }
  .vote-btn { background: none; border: 1px solid #3a3520; color: #888270; border-radius: 8px; padding: 8px 10px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
  .vote-btn:hover { border-color: #C9A84C; color: #C9A84C; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fu { animation: fadeUp 0.4s ease both; }
  .lbl { font-size: 11px; color: #888270; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'DM Sans', sans-serif; font-weight: 700; display: block; margin-bottom: 6px; }
  .step-num { width: 22px; height: 22px; border-radius: 50%; background: #C9A84C20; border: 1px solid #C9A84C50; color: #C9A84C; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; flex-shrink: 0; }
  @media (max-width: 600px) {
    .inp { font-size: 14px; padding: 14px 14px; }
    .inp::placeholder { font-size: 13px; }
    .btn-gold { width: 100%; padding: 15px 20px; font-size: 15px; }
    .card { padding: 16px 14px; border-radius: 12px; }
    .vote-btn { padding: 10px 12px; }
    .lbl { font-size: 12px; }
    .step-num { display: none; }
  }
`;

// ─── MAIN ───
export default function FundamentumAds() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [nombre, setNombre] = useState("");
  const [nicho, setNicho] = useState("");
  const [nichoCustom, setNichoCustom] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [preguntas, setPreguntas] = useState([""]);

  useEffect(() => {
    fetchEntries()
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const current = preguntas[0] || "";
    if (current.trim().length > 6) {
      const words = current.toLowerCase().split(" ").filter((w) => w.length > 3);
      setSimilar(entries.filter((e) => words.some((w) => e.pregunta.toLowerCase().includes(w))).slice(0, 3));
    } else setSimilar([]);
  }, [preguntas, entries]);

  const nichoFinal = nicho === "Otro" ? nichoCustom.trim() : nicho;
  const preguntasValidas = preguntas.filter((p) => p.trim());
  const canSubmit = nombre.trim() && nichoFinal && tipoNegocio.trim() && preguntasValidas.length > 0;

  function updatePregunta(index, value) {
    const updated = [...preguntas];
    updated[index] = value;
    setPreguntas(updated);
  }

  function addPregunta() {
    setPreguntas([...preguntas, ""]);
  }

  function removePregunta(index) {
    if (preguntas.length <= 1) return;
    setPreguntas(preguntas.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    try {
      const newEntries = [];
      for (const p of preguntasValidas) {
        const newEntry = await createEntry({
          nombre: nombre.trim(),
          nicho: nichoFinal,
          tipoNegocio: tipoNegocio.trim(),
          pregunta: p.trim(),
        });
        newEntries.push(newEntry);
      }
      setEntries([...newEntries, ...entries]);
    } catch {}
    setNombre(""); setNicho(""); setNichoCustom(""); setTipoNegocio(""); setPreguntas([""]); setSimilar([]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  async function handleVote(id) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const newVotes = entry.votes + 1;
    setEntries(entries.map((e) => e.id === id ? { ...e, votes: newVotes } : e));
    try {
      await updateVotes(id, newVotes);
    } catch {}
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F0D05", color: "#D6D2C4" }}>
      <style>{SHARED_STYLES}</style>

      {/* Header */}
      <div style={{ background: "#1A1810", borderBottom: "1px solid #3a3520", padding: "0 16px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#C9A84C" }}>Fundamentum</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#888270", letterSpacing: "0.18em", textTransform: "uppercase" }}>Ads · Preguntas</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 14px" }}>

        {/* FORM */}
        <div className="fu" style={{ background: "#231F10", border: "1px solid #3a3520", borderRadius: 16, padding: "24px 18px", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#FFFFFF", marginBottom: 6 }}>
            Cuéntame sobre ti y tu negocio
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888270", lineHeight: 1.6, marginBottom: 28 }}>
            Usaré esta información para preparar lecciones con ejemplos reales y relevantes para el grupo.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* 1. Nombre */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="step-num" style={{ marginTop: 2 }}>1</div>
              <div style={{ flex: 1 }}>
                <label className="lbl">Tu nombre</label>
                <input className="inp" placeholder="Ej. Carlos Mendoza" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
            </div>

            {/* 2. Nicho */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="step-num" style={{ marginTop: 2 }}>2</div>
              <div style={{ flex: 1 }}>
                <label className="lbl">Nicho / industria</label>
                <select className="inp" value={nicho} onChange={(e) => { setNicho(e.target.value); if (e.target.value !== "Otro") setNichoCustom(""); }}>
                  <option value="">— Selecciona tu nicho —</option>
                  {NICHO_OPTIONS.map((n) => <option key={n}>{n}</option>)}
                </select>
                {nicho === "Otro" && (
                  <input className="inp" style={{ marginTop: 8 }} placeholder="Escribe tu nicho o industria" value={nichoCustom} onChange={(e) => setNichoCustom(e.target.value)} />
                )}
              </div>
            </div>

            {/* 3. Tipo de negocio */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="step-num" style={{ marginTop: 2 }}>3</div>
              <div style={{ flex: 1 }}>
                <label className="lbl">Descripción de tu negocio</label>
                <p style={{ fontSize: 12, color: "#888270", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, lineHeight: 1.5 }}>
                  ¿Qué vendes, a quién y cómo? Cuanto más específico, mejor puedo adaptar los ejemplos.
                </p>
                <textarea className="inp" rows={3} style={{ resize: "none" }}
                  placeholder="Ej. Vendo suplementos deportivos para mujeres mayores de 30 años, principalmente por Instagram y mi tienda online. Ticket promedio $800 MXN."
                  value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value)} />
              </div>
            </div>

            {/* 4. Preguntas */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="step-num" style={{ marginTop: 2 }}>4</div>
              <div style={{ flex: 1 }}>
                <label className="lbl">Tu(s) pregunta(s) para el curso</label>
                {preguntas.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <textarea className="inp" rows={3} style={{ resize: "none", flex: 1 }}
                      placeholder="Ej. ¿Cómo sé si mi presupuesto es suficiente para hacer crecer mis campañas o si debo optimizar antes de escalar?"
                      value={p} onChange={(e) => updatePregunta(i, e.target.value)} />
                    {preguntas.length > 1 && (
                      <button onClick={() => removePregunta(i)}
                        style={{ background: "none", border: "1px solid #3a3520", color: "#888270", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginTop: 2 }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addPregunta}
                  style={{ background: "none", border: "1px dashed #3a3520", color: "#C9A84C", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: "100%", transition: "all 0.2s" }}>
                  + Agregar otra pregunta
                </button>

                {/* Similar questions */}
                {similar.length > 0 && (
                  <div className="fu" style={{ marginTop: 12, background: "#1A1810", border: "1px solid #C9A84C28", borderRadius: 10, padding: "14px 16px" }}>
                    <p style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                      Preguntas similares ya registradas — revísalas:
                    </p>
                    {similar.map((e) => (
                      <div key={e.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#C9A84C", fontSize: 12, marginTop: 1 }}>→</span>
                        <div>
                          <p style={{ fontSize: 13, color: "#D6D2C4", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{e.pregunta}</p>
                          <span style={{ fontSize: 11, color: "#888270", fontFamily: "'DM Sans', sans-serif" }}>{e.nombre} · {e.nicho}</span>
                        </div>
                      </div>
                    ))}
                    <p style={{ fontSize: 12, color: "#888270", marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
                      Si la tuya es diferente, ¡envíala igual! Si ya existe, vótala abajo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #3a3520", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            {submitted ? (
              <span className="fu" style={{ fontSize: 14, color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>
                ¡Recibido! Lo usaré para preparar las lecciones.
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "#888270", fontFamily: "'DM Sans', sans-serif" }}>
                {!canSubmit ? "Completa todos los campos para enviar" : "Todo listo"}
              </span>
            )}
            <button className="btn-gold" disabled={!canSubmit} onClick={handleSubmit}>
              Enviar →
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #3a3520", paddingBottom: 12, gap: 4 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#FFFFFF" }}>Preguntas del grupo</h3>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#888270" }}>
              {entries.length} registradas · vota las que te interesan
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0", fontFamily: "'DM Sans', sans-serif", color: "#888270", fontSize: 14 }}>Cargando...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...entries].sort((a, b) => b.votes - a.votes).map((e, i) => (
                <div key={e.id} className="card fu" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#FFFFFF", lineHeight: 1.55, marginBottom: 10 }}>
                        {e.pregunta}
                      </p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#888270", fontFamily: "'DM Sans', sans-serif" }}>{e.nombre}</span>
                        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#8C6E28", display: "inline-block" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: getNichoColor(e.nicho) + "18", color: getNichoColor(e.nicho), border: `1px solid ${getNichoColor(e.nicho)}35`, padding: "2px 9px", borderRadius: 5 }}>
                          {e.nicho}
                        </span>
                        <span style={{ fontSize: 11, color: "#888270", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
                          {e.tipoNegocio.length > 55 ? e.tipoNegocio.slice(0, 55) + "…" : e.tipoNegocio}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 44 }}>
                      <button className="vote-btn" onClick={() => handleVote(e.id)}>▲</button>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: e.votes > 5 ? "#C9A84C" : "#888270" }}>{e.votes}</span>
                    </div>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 0", fontFamily: "'DM Sans', sans-serif", color: "#888270", fontSize: 14 }}>
                  Sé el primero en enviar una pregunta
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8C6E28", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Fundamentum Ads · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
