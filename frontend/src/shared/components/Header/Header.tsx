export default function Header() {
  return (
    <header
      style={{
        height: "64px",
        borderBottom: "1px solid #374151",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <input
        placeholder="Search news..."
        style={{
          width: "320px",
          padding: "10px",
        }}
      />

      <div>👤 Guest</div>
    </header>
  );
}