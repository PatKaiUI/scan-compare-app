function PageContainer({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {title && (
            <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl text-gray-600 text-center mb-12 italic">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageContainer;
