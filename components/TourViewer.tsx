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
    { n: "scene_seine_bureau", l: "SALLES", icon: "◻" },
    { n: "scene_seine_bunker", l: "DOCUMENTS", icon: "◻◻" },
    { n: "scene_seine_hemicycle", l: "VUES", icon: "◉" },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <iframe
        ref={iframeRef}
        src="/vtour/tour.html"
        width="100%"
        height="100%"
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
        allowFullScreen
        title="Visite virtuelle"
      />

      {/* Bordure décorative */}
      <div style={{ position: "absolute", inset: 12, border: "2px solid rgba(255,255,255,0.15)", borderRadius: 20, pointerEvents: "none", zIndex: 5 }} />

      {/* Menu latéral gauche */}
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, zIndex: 10 }}>
        {boutons.map((b) => (
          <button
            key={b.n}
            onClick={() => changeScene(b.n)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "14px 16px",
              background: activeScene === b.n ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
              color: activeScene === b.n ? "#1a3a4a" : "#6b7b8a",
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              minWidth: 72,
              boxShadow: activeScene === b.n ? "0 4px 16px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ fontSize: 20, opacity: 0.7 }}>{b.icon}</span>
            {b.l}
          </button>
        ))}
      </div>

      {/* Fiche descriptive */}
      {showFiche && currentScene && (
        <div style={{
          position: "absolute",
          right: 30,
          top: "50%",
          transform: "translateY(-50%)",
          width: 360,
          background: "rgba(255,252,248,0.96)",
          borderRadius: 24,
          padding: "32px 30px 28px",
          zIndex: 10,
          backdropFilter: "blur(12px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        }}>
          {/* Bouton fermer */}
          <button onClick={() => setShowFiche(false)} style={{
            position: "absolute", top: 16, right: 18,
            background: "none", border: "none", fontSize: 18,
            cursor: "pointer", color: "#999", lineHeight: 1,
          }}>✕</button>

          {/* Catégorie + Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            {currentScene.data.badge && (
              <span style={{
                color: "#1a8a6a",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}>
                {currentScene.data.categorie}
              </span>
            )}
            {currentScene.data.badge && (
              <span style={{
                background: "#d4544a",
                color: "white",
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 9,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                {currentScene.data.badge}
              </span>
            )}
          </div>

          {/* Titre */}
          <h2 style={{
            fontSize: 28,
            fontWeight: 900,
            margin: "0 0 14px",
            color: "#1a2a35",
            lineHeight: 1.15,
          }}>
            {currentScene.data.title}
          </h2>

          {/* Description */}
          <p style={{
            fontSize: 13.5,
            color: "#5a6a75",
            lineHeight: 1.7,
            margin: "0 0 22px",
          }}>
            {currentScene.data.description?.[0]?.text || ""}
          </p>

          {/* Infos en grille */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {currentScene.data.institution && (
              <InfoCard icon="🏛" label="Institution" value={currentScene.data.institution} />
            )}
            {currentScene.data.capacite && (
              <InfoCard icon="👥" label="Capacité" value={currentScene.data.capacite} />
            )}
            {currentScene.data.epoque && (
              <InfoCard icon="🏰" label="Époque" value={currentScene.data.epoque} />
            )}
            {currentScene.data.acces && (
              <InfoCard icon="🔒" label="Accès" value={currentScene.data.acces} />
            )}
          </div>

          {/* Boutons */}
          <button style={{
            width: "100%",
            padding: "15px 0",
            background: "#1a8a6a",
            color: "white",
            border: "none",
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.8,
            marginBottom: 10,
            transition: "background 0.3s",
          }}>
            Explorer l&apos;étage →
          </button>

          <button style={{
            width: "100%",
            padding: "14px 0",
            background: "transparent",
            color: "#1a2a35",
            border: "1.5px solid #d0d5da",
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}>
            Fiche technique
          </button>
        </div>
      )}

      {/* Barre de navigation en bas */}
      <div style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        textAlign: "center",
      }}>
        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 10,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 10,
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}>
          Explorez à 360°
        </p>
        <div style={{
          display: "flex",
          gap: 0,
          background: "rgba(255,252,248,0.92)",
          borderRadius: 16,
          overflow: "hidden",
          backdropFilter: "blur(12px)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        }}>
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => changeScene(scene.data.nom_scene_krpano)}
              style={{
                padding: "16px 30px",
                border: "none",
                background: activeScene === scene.data.nom_scene_krpano ? "#1a8a6a" : "transparent",
                color: activeScene === scene.data.nom_scene_krpano ? "white" : "#1a2a35",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              {scene.data.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      background: "rgba(240,238,233,0.7)",
      borderRadius: 14,
      padding: "14px 12px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
      <div style={{
        fontSize: 9,
        color: "#8a9099",
        textTransform: "uppercase",
        letterSpacing: 1.2,
        marginBottom: 4,
        fontWeight: 700,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#1a2a35",
      }}>
        {value}
      </div>
    </div>
  );
}