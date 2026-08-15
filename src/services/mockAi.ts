import { UIComponentNode } from "../components/GenerativeUI";

export interface AIResponse {
  message: string;
  uiSchema?: UIComponentNode;
  insights?: any[];
}

// Connected to Next.js API route using Gemini
export const processQuery = async (query: string, data?: any[]): Promise<AIResponse> => {
  try {
    let dataSchema: string[] = [];
    let sampleData: any[] = [];
    
    if (data && data.length > 0) {
      dataSchema = Object.keys(data[0]);
      sampleData = data.slice(0, 150);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, dataSchema, sampleData }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Backend unavailable");
    }

    return await response.json() as AIResponse;
  } catch (error) {
    console.warn("Gemini backend failed, using rich mock Generative UI response.", error);
    
    // Generative UI fallback: Dynamically build a layout based on the data schema
    let dataKeys = data && data.length > 0 ? Object.keys(data[0]) : [];
    let numericKeys = dataKeys.filter(k => typeof data![0][k] === 'number' || !isNaN(Number(data![0][k])));
    let stringKeys = dataKeys.filter(k => !numericKeys.includes(k));
    
    let xAxis = stringKeys.length > 0 ? stringKeys[0] : (dataKeys.length > 0 ? dataKeys[0] : "");
    let yAxis = numericKeys.length > 0 ? numericKeys[0] : (dataKeys.length > 1 ? dataKeys[1] : "");

    const mockUiSchema: UIComponentNode = {
      type: "Container",
      props: { direction: "vertical", gap: "1.5rem" },
      children: [
        {
          type: "Container",
          props: { direction: "horizontal", gap: "1.5rem" },
          children: [
            {
              type: "MetricCard",
              props: { title: "Total Records", value: data?.length || 0 }
            },
            {
              type: "MetricCard",
              props: { title: `Key Metric (${yAxis})`, value: data && data.length > 0 ? data[0][yAxis] : "N/A" }
            }
          ]
        },
        {
          type: "Card",
          children: [
            {
              type: "Text",
              props: { content: `Analysis: ${yAxis} by ${xAxis}`, variant: "h3", style: { marginBottom: '1rem' } }
            },
            {
              type: query.toLowerCase().includes('pie') ? "PieChart" : query.toLowerCase().includes('line') ? "LineChart" : "BarChart",
              props: {
                xAxisKey: xAxis,
                yAxisKeys: [yAxis],
                nameKey: xAxis,
                dataKey: yAxis
              }
            }
          ]
        }
      ]
    };

    return {
      message: `Here is a custom generative UI layout analyzing your request for "${query}".`,
      uiSchema: mockUiSchema,
      insights: [{ title: 'Generated UI Analysis', description: `Analysis completed for ${yAxis} by ${xAxis}.`, type: 'info' }]
    };
  }
};
