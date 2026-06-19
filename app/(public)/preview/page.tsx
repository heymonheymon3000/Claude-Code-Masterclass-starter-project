// preview page for newly created UI components
import Avatar from "@/components/Avatar"
import Skeleton from "@/components/Skeleton"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Avatar</h3>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Avatar name="Alice" />
        <Avatar name="TerryParrish" />
        <Avatar name="JohnDoe" />
        <Avatar name="alice" />
      </div>

      <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Skeleton</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}
