export default function Avatar({ initials, color = '#1F6F6B', size = 36, style }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: color,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
