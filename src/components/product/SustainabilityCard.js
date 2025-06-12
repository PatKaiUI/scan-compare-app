function SustainabilityCard({ title, value, unit, color = "green" }) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-xl`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="text-gray-600">{unit}</span>}
      </div>
    </div>
  );
}

export default SustainabilityCard;
