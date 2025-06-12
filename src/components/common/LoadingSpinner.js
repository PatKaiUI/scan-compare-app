function LoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 border-green-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
