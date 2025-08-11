function SustainabilityCard({ title, value, unit, color = "green" }) {
  return (
    <div
      data-testid="sustainability-card"
      className={`bg-${color}-50 text-${color}-600 p-6 rounded-xl`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">{value ? value : "-"}</span>
        {unit && <span className="text-gray-600">{unit}</span>}
      </div>
    </div>
  );
}

export default SustainabilityCard;
