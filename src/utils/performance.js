// Performance Monitoring Utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.marks = {};
  }

  // Markiert einen Startpunkt für eine Messung
  mark(name) {
    this.marks[name] = performance.now();
  }

  // Misst die Zeit zwischen zwei Markierungen
  measure(name, startMark, endMark) {
    if (!this.marks[startMark] || !this.marks[endMark]) {
      console.warn(`Mark ${startMark} or ${endMark} not found`);
      return;
    }

    const duration = this.marks[endMark] - this.marks[startMark];
    this.metrics[name] = duration;

    // Logging in Development
    if (process.env.NODE_ENV === "development") {
      console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Misst die Rendering-Zeit einer Komponente
  measureComponentRender(componentName, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metrics[`${componentName}_render`] = duration;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `Component [${componentName}] render time: ${duration.toFixed(2)}ms`
      );
    }

    return duration;
  }

  // Misst die API-Antwortzeit
  measureApiCall(endpoint, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metrics[`api_${endpoint}`] = duration;

    if (process.env.NODE_ENV === "development") {
      console.log(`API [${endpoint}] response time: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Gibt alle gesammelten Metriken zurück
  getMetrics() {
    return this.metrics;
  }

  // Löscht alle gesammelten Metriken
  clearMetrics() {
    this.metrics = {};
    this.marks = {};
  }
}

// Singleton-Instanz
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// React Performance Hook
export const usePerformanceMeasure = (componentName) => {
  const startTime = performance.now();

  return () => {
    performanceMonitor.measureComponentRender(componentName, startTime);
  };
};
