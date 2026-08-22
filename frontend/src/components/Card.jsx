function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;