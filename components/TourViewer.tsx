"use client";
import { useState, useRef } from "react";

export default function TourViewer({ scenes }: { scenes: any[] }) {
  const [activeScene, setActiveScene] = useState(
    scenes[0]?.data?.nom_scene_krpano || "scene_seine_bureau"
  );
  const [showFiche, setShowFiche] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentScene = scenes.find(
    (s) => s.data.nom_scene_krpano === activeScene
  );

  const changeScene = (sceneName: string) => {
    setActiveScene(sceneName);
    setShowFiche(true);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { action: "loadscene", scene: sceneName },
        "*"
      );
    }
  };

  const boutons = [
    { n: "scene_seine_bureau", l: "Bureau" },
    { n: "scene_seine_bunker", l: "Bunker" },
    { n: "scene_seine_hemicycle", l: "Hémicycle" },
    { n: "scene_seine_hotel", l: "Hôtel" },
    { n: "scene_seine_tour", l: "Tour" },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <iframe
        ref={iframeRef}
        src="/vtour/tour.html"
        width="100%"
        height="100%"
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
        allowFullScreen
        title="Visite virtuelle"
      />

      {/* Menu latéral gauche */}
      <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 10 }}>
        {boutons.map((b) => (
          <button
            key={b.n}
            onClick={() => changeScene(b.n)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "12px 14px",
              background: activeScene === b.n ? "#0f6e56" : "rgba(255,255,255,0.85)",
              color: activeScene === b.n ? "white" : "#333",
              border: activeScene === b.n ? "2px solid #0f6e56" : "2px solid transparent",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              minWidth: 70,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {b.l}
          </button>
        ))}
      </div>

      {/* Fiche descriptive */}
      {showFiche && currentScene && (
        <div style={{ position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)", width: 340, background: "rgba(255,255,255,0.95)", borderRadius: 20, padding: 28, zIndex: 10, backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <button onClick={() => setShowFiche(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#666" }}>
            ✕
          </button>

          {currentScene.data.categorie && (
            <span style={{ display: "inline-block", background: "#e0f5ee", color: "#0f6e56", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              {currentScene.data.categorie}
            </span>
          )}

          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 12px", color: "#1a1a1a" }}>
            {currentScene.data.titre}
          </h2>

          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 20px" }}>
            {currentScene.data.description?.[0]?.text || ""}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {currentScene.data.institution && (
              <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Institution</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{currentScene.data.institution}</div>
              </div>
            )}
            {currentScene.data.capacite && (
              <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Capacité</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{currentScene.data.capacite}</div>
              </div>
            )}
            {currentScene.data.epoque && (
              <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Époque</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{currentScene.data.epoque}</div>
              </div>
            )}
            {currentScene.data.acces && (
              <div style={{ background: "#f5f5f5", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Accès</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{currentScene.data.acces}</div>
              </div>
            )}
          </div>

          <button style={{ width: "100%", padding: "14px 0", background: "#0f6e56", color: "white", border: "none", borderRadius: 30, fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
            Explorer l&apos;histoire →
          </button>
        </div>
      )}

      {/* Barre de navigation en bas */}
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 0, background: "rgba(255,255,255,0.9)", borderRadius: 16, overflow: "hidden", zIndex: 10, backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <p style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", color: "white", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          Explorez à 360°
        </p>
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => changeScene(scene.data.nom_scene_krpano)}
            style={{
              padding: "16px 28px",
              border: "none",
              background: activeScene === scene.data.nom_scene_krpano ? "#0f6e56" : "transparent",
              color: activeScene === scene.data.nom_scene_krpano ? "white" : "#333",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              transition: "all 0.3s",
            }}
          >
            {scene.data.titre}
          </button>
        ))}
      </div>
    </div>
  );
}