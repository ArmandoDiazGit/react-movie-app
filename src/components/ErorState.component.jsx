export default function ErrorState({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}
