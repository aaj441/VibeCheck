import { Request, Response, NextFunction } from 'express';

interface MetricData {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

class MetricsCollector {
  private metrics: MetricData[] = [];
  
  recordRequest(data: MetricData): void {
    this.metrics.push(data);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to CloudWatch, Datadog, etc.
      this.sendToMonitoringService(data);
    }
  }
  
  private sendToMonitoringService(data: MetricData): void {
    // Implementation for sending metrics to external service
    console.log('Metric recorded:', data);
  }
  
  getMetricsSummary(): any {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    const recentMetrics = this.metrics.filter(
      m => m.timestamp.getTime() > fiveMinutesAgo
    );
    
    const summary = {
      totalRequests: recentMetrics.length,
      averageResponseTime: this.calculateAverage(
        recentMetrics.map(m => m.responseTime)
      ),
      statusCodeDistribution: this.groupBy(
        recentMetrics,
        m => m.statusCode.toString()
      ),
      endpointMetrics: this.groupBy(
        recentMetrics,
        m => `${m.method} ${m.endpoint}`
      ),
    };
    
    return summary;
  }
  
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
  
  private groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const metricsCollector = new MetricsCollector();

// Middleware to collect metrics
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  
  // Capture the original end function
  const originalEnd = res.end;
  
  // Override the end function
  res.end = function(...args: any[]): any {
    // Restore original end function
    res.end = originalEnd;
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Record metric
    metricsCollector.recordRequest({
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      timestamp: new Date(),
    });
    
    // Call original end function
    return originalEnd.apply(res, args);
  };
  
  next();
};

// Endpoint to expose metrics
export const metricsHandler = (_req: Request, res: Response): void => {
  const summary = metricsCollector.getMetricsSummary();
  res.json(summary);
};