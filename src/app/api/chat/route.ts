import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// We define a strict JSON schema for the Generative UI component tree so Gemini outputs it correctly
const uiSchemaDefinition: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { 
      type: Type.STRING, 
      description: "The component type. Must be one of: Container, Text, Card, MetricCard, InsightCallout, ProgressBar, Badge, Divider, BarChart, LineChart, AreaChart, ScatterChart, RadarChart, PieChart, DataGrid." 
    },
    props: {
      type: Type.OBJECT,
      description: "Props for the component. E.g. { direction: 'vertical'|'horizontal', gap: '1rem' } for Container. { content: '...', variant: 'h1'|'h2'|'h3'|'p' } for Text. { title: '...', value: '...' } for MetricCard. { xAxisKey: '...', yAxisKeys: ['...'] } for Charts. { columns: ['...'] } for DataGrid.",
      nullable: true
    },
    children: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        // Since recursion is tricky in strict OpenAPI schema definitions, we'll keep it as a generic object or use a simple nested depth.
        description: "An array of child components following the exact same schema structure."
      },
      nullable: true
    }
  },
  required: ["type"]
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, dataSchema, sampleData } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert Generative UI agent for a Business Intelligence Copilot.
      The user asked: "${query}"
      
      The user's dataset has the following column headers: ${JSON.stringify(dataSchema)}
      Here is a tiny sample of the data (max 3 rows): ${JSON.stringify(sampleData)}
      
      Design a custom, interactive UI layout to present the answer to the user's query effectively.
      You must output a root UIComponentNode containing the layout. 
      Use 'Container' for layout (props: {'direction': 'vertical' | 'horizontal', 'gap': '1rem' etc}).
      Use 'Text' for descriptions (props: {'content': '...', 'variant': 'h1'|'h2'|'h3'|'p'}).
      Use 'Card' to wrap groups of information nicely.
      Use 'InsightCallout' to highlight important findings. Props: {'title': '...', 'description': '...', 'type': 'info'|'warning'}.
      Use 'ProgressBar' to show progress or percentages. Props: {'label': '...', 'value': 75, 'max': 100}.
      Use 'Badge' for small tags. Props: {'text': '...', 'variant': 'primary'|'secondary'}.
      Use 'Divider' to visually separate sections.
      Use 'BarChart', 'LineChart', 'AreaChart', 'PieChart' for visualizations. Props must include 'xAxisKey' (string) and 'yAxisKeys' (list of strings).
      Use 'ScatterChart' for correlations. Props must include 'xAxisKey' and 'yAxisKey'.
      Use 'RadarChart' for comparative multivariate data. Props must include 'angleAxisKey' and 'radarAxisKeys' (list of strings).
      Use 'DataGrid' for tables. Props must include 'columns' (list of strings).
      Use 'MetricCard' for single value KPIs. Props must include 'title' (string) and 'value' (string or number).

      CRITICAL RULES:
      1. DO NOT always use BarCharts. Vary your visualization types! If showing a distribution or composition, use a PieChart. If showing a trend over time, use a LineChart or AreaChart. If showing multi-variable comparison, use a RadarChart. If showing correlations, use a ScatterChart.
      2. Ensure you mix and match components to build a rich, interactive dashboard layout rather than just a single chart.
      3. ALWAYS provide a textual summary or analysis of the data using 'InsightCallout' or 'Text' components to directly answer the user's prompt with insights!
      4. DATA AGGREGATION: By default, the frontend injects the raw dataset into charts. However, if the user's query requires aggregating, grouping, or filtering the data (e.g. "Total revenue by region" or "Average NPS"), you MUST calculate the aggregated data yourself based on the sample dataset provided, and pass this new array as a 'data' prop to the specific Chart or DataGrid component.
      
      Design the most optimal dashboard layout for the user's query: ${query}. 
      Make the layout look professional, use multiple components! E.g. A top Container with MetricCards and InsightCallouts, followed by a Card with a Chart.
      Output valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: uiSchemaDefinition,
        temperature: 0.2
      }
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("No text returned from Gemini");
    }

    const uiSchema = JSON.parse(resultText);

    return NextResponse.json({
      message: "Here is your generated UI.",
      uiSchema: uiSchema,
      insights: []
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate UI via Gemini.", details: error.message },
      { status: 500 }
    );
  }
}
