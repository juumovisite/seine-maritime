"use client";
import { useState, useRef, useEffect } from "react";

export default function TourViewer({ scenes }: { scenes: any[] }) {
  const [activeScene, setActiveScene] = useState(
    scenes[0]?.data?.nom_scene_krpano || "scene_seine_bureau"
  );
  const [showFiche, setShowFiche] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoId, setInfoId] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentScene = scenes.find(
    (s) => s.data.nom_scene_krpano === activeScene
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === "scenechanged" && event.data.scene) {
        setActiveScene(event.data.scene);
        setShowFiche(false);
        setShowInfo(false);
      }
      if (event.data?.action === "showinfo" && event.data.id) {
        setInfoId(event.data.id);
        setShowInfo(true);
        setShowFiche(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const changeScene = (sceneName: string) => {
    setActiveScene(sceneName);
    setShowFiche(false);
    setShowInfo(false);
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

  const infos: Record<string, { title: string; text: string }> = {
    bureau_desk: {
      title: "Le Bureau Présidentiel",
      text: "Ce bureau en chêne massif date de 1892. Il a été le témoin de nombreuses décisions historiques pour le département de la Seine-Maritime. Son design allie fonctionnalité et prestige républicain.",
    },
    bureau_drapeaux: {
      title: "Les Drapeaux",
      text: "Le drapeau tricolore français et le drapeau européen encadrent le siège présidentiel, symboles de l'ancrage républicain et européen du département.",
    },
    hemi_tribune: {
      title: "La Tribune",
      text: "Depuis cette tribune, les élus départementaux prennent la parole lors des sessions plénières du conseil. Elle est le lieu central du débat démocratique local.",
    },
    hemi_sieges: {
      title: "L'Hémicycle",
      text: "Les 70 sièges de l'hémicycle accueillent les conseillers départementaux lors des sessions. La disposition en arc de cercle favorise le débat et l'échange.",
    },
    bunker_porte: {
      title: "Porte Blindée",
      text: "Cette porte blindée d'origine, épaisse de 30 centimètres, protégeait les occupants des bombardements. Elle témoigne de l'ingénierie militaire de l'époque.",
    },
    bunker_equipements: {
      title: "Équipements d'Époque",
      text: "Les systèmes de ventilation et de communication d'origine sont encore visibles. Ils permettaient aux occupants de rester en contact avec l'extérieur en toute sécurité.",
    },
    hotel_escalier: {
      title: "L'Escalier d'Honneur",
      text: "Cet escalier monumental en pierre de taille est l'un des joyaux architecturaux du bâtiment. Il dessert les étages nobles de l'Hôtel du Département.",
    },
    tour_vue: {
      title: "Vue Panoramique",
      text: "Depuis le sommet de la Tour des Archives, on peut admirer une vue à 360° sur Rouen, la Seine et les collines environnantes. Par temps clair, la vue s'étend sur plus de 30 kilomètres.",
    },
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <iframe
        ref={iframeRef}
        src="/vtour/tour.html"
        width="100%"
        height="100%"
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
        allowFullScreen
        title="Visite virtuelle"
      />

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
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span style={{ fontSize: 20, opacity: 0.7 }}>{b.icon}</span>
            {b.l}
          </button>
        ))}
      </div>

      {/* Bouton info en haut à droite */}
      {!showFiche && !showInfo && (
        <button
          onClick={() => setShowFiche(true)}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 48,
            height: 48,
            borderRadius: 16,
            background: "rgba(255,255,255,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
            fontSize: 22,
            color: "#1a8a6a",
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          i
        </button>
      )}

      {/* Fiche descriptive */}
      {showFiche && currentScene && (
        <div style={{
          position: "absolute",
          right: 30,
          top: "50%",
          transform: "translateY(-50%)",
          width: 380,
          borderRadius: 24,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 10,
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(180deg, rgba(139, 90, 43, 0.15) 0%, rgba(139, 90, 43, 0.05) 30%, rgba(255, 255, 255, 0.95) 50%)",
            zIndex: 0,
          }} />

          <div style={{ position: "relative", zIndex: 1, padding: "28px 24px 24px" }}>
            <button onClick={() => setShowFiche(false)} style={{
              position: "absolute", top: 16, right: 18,
              background: "none", border: "none", fontSize: 18,
              cursor: "pointer", color: "#999", lineHeight: 1,
              fontFamily: "'Inter', sans-serif",
            }}>✕</button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              {currentScene.data.categorie && (
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  color: "#e8806a", textTransform: "uppercase",
                }}>
                  {currentScene.data.categorie}
                </span>
              )}
              {currentScene.data.badge && (
                <span style={{
                  background: "#e8806a", color: "white",
                  fontSize: 10, fontWeight: 700, letterSpacing: 1,
                  padding: "6px 14px", borderRadius: 20, textTransform: "uppercase",
                }}>
                  {currentScene.data.badge}
                </span>
              )}
            </div>

            <h2 style={{
              fontSize: 28, fontWeight: 800, color: "#1a2332",
              marginBottom: 14, lineHeight: 1.15, fontFamily: "'Inter', sans-serif",
            }}>
              {currentScene.data.title}
            </h2>

            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#5a6577", marginBottom: 24 }}>
              {currentScene.data.description?.[0]?.text || ""}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {currentScene.data.institution && (
                <InfoCard icon="🏛️" label="Institution" value={currentScene.data.institution} />
              )}
              {currentScene.data.capacite && (
                <InfoCard icon="👥" label="Capacité" value={currentScene.data.capacite} />
              )}
              {currentScene.data.epoque && (
                <InfoCard icon="🕰️" label="Époque" value={currentScene.data.epoque} />
              )}
              {currentScene.data.acces && (
                <InfoCard icon="🔐" label="Accès" value={currentScene.data.acces} />
              )}
            </div>

            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: 16, border: "none", borderRadius: 16,
              background: "linear-gradient(135deg, #5bb8a9, #4da89a)",
              color: "white", fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
              textTransform: "uppercase", cursor: "pointer",
              boxShadow: "0 4px 15px rgba(91, 184, 169, 0.35)", marginBottom: 12,
            }}>
              Explorer l&apos;histoire →
            </button>

            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", padding: 16, border: "2px solid #d9dee5", borderRadius: 16,
              background: "transparent", color: "#1a2332", fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
              textTransform: "uppercase", cursor: "pointer",
            }}>
              Fiche Technique
            </button>
          </div>
        </div>
      )}

      {/* Popup info point */}
      {showInfo && infoId && infos[infoId] && (
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          borderRadius: 24,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 20,
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: 6,
            background: "linear-gradient(90deg, #E91E7A, #ff6b9d)",
          }} />

          <div style={{ padding: "32px 28px 28px" }}>
            <button onClick={() => { setShowInfo(false); }} style={{
              position: "absolute", top: 16, right: 18,
              background: "none", border: "none", fontSize: 18,
              cursor: "pointer", color: "#999",
            }}>✕</button>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(233, 30, 122, 0.1)",
              padding: "6px 14px", borderRadius: 20, marginBottom: 16,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#E91E7A">
                <circle cx="12" cy="8" r="1.5" />
                <rect x="11" y="11" width="2.5" height="7" rx="1" />
              </svg>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#E91E7A",
                textTransform: "uppercase", letterSpacing: 1.5,
              }}>
                Point d&apos;intérêt
              </span>
            </div>

            <h3 style={{
              fontSize: 24, fontWeight: 800, color: "#1a2332",
              marginBottom: 14, lineHeight: 1.2,
            }}>
              {infos[infoId].title}
            </h3>

            <p style={{
              fontSize: 14, color: "#5a6577", lineHeight: 1.7, marginBottom: 0,
            }}>
              {infos[infoId].text}
            </p>
          </div>
        </div>
      )}

      {/* Barre de navigation en bas */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)" }} />
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", margin: 0, textShadow: "0 1px 3px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
            Explorez à 360°
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)" }} />
        </div>
        <div style={{ display: "flex", gap: 0, background: "rgba(255,252,248,0.92)", borderRadius: 16, overflow: "hidden", backdropFilter: "blur(12px)", boxShadow: "0 6px 24px rgba(0,0,0,0.12)", padding: "4px 8px" }}>
          {scenes
            .filter((scene) => scene.data.nom_scene_krpano !== "scene_seine_hotel")
            .map((scene) => (
              <button
                key={scene.id}
                onClick={() => changeScene(scene.data.nom_scene_krpano)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#8B3A2A"; }}
                onMouseLeave={(e) => { if (activeScene !== scene.data.nom_scene_krpano) { e.currentTarget.style.color = "#6b7580"; }}}
                style={{
                  padding: "10px 24px",
                  border: "none",
                  background: "transparent",
                  color: activeScene === scene.data.nom_scene_krpano ? "#8B3A2A" : "#6b7580",
                  fontSize: 14,
                  fontWeight: activeScene === scene.data.nom_scene_krpano ? 700 : 500,
                  cursor: "pointer",
                  letterSpacing: 0.3,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  borderBottom: activeScene === scene.data.nom_scene_krpano ? "2px solid #8B3A2A" : "2px solid transparent",
                  paddingBottom: 8,
                  fontFamily: "'Inter', sans-serif",
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
      background: "rgba(255, 255, 255, 0.85)",
      border: "1px solid rgba(0, 0, 0, 0.06)",
      borderRadius: 16, padding: 16, textAlign: "center",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: 0.8,
        color: "#e8806a", textTransform: "uppercase", marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2332" }}>
        {value}
      </div>
    </div>
  );
}