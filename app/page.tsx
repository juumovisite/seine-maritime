export default function Home() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <iframe
        src="/vtour/tour.html"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
        title="Visite virtuelle"
      />
    </div>
  );
}
