function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
    outline: "border-2 border-green-500 text-green-500 hover:bg-green-50",
    text: "text-green-500 hover:text-green-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        font-semibold
        transition-colors
        duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
