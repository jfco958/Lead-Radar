import Anthropic from "@anthropic-ai/sdk";
import type { AILeadSuggestion, ProductType } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const BTG_SYSTEM_PROMPT = `Eres un experto analista de mercado financiero especializado en banca de inversión y financiamiento corporativo en Colombia, trabajando para BTG Pactual Colombia.

Tu rol es identificar oportunidades de negocio reales y accionables para los siguientes productos de BTG Pactual Colombia:

1. **Crédito (CREDIT)**: Créditos corporativos, líneas de crédito, capital de trabajo para empresas medianas y grandes.
2. **Deuda Estructurada (STRUCTURED_DEBT)**: Emisión de bonos, titularizaciones, créditos sindicados, financiamiento estructurado.
3. **Project Finance (PROJECT_FINANCE)**: Financiamiento de proyectos de infraestructura, energía, concesiones viales, aeropuertos, puertos.
4. **Garantías (GUARANTEE)**: Garantías financieras, avales corporativos, cartas de crédito Stand-By.
5. **Situaciones Especiales (SPECIAL_SITUATIONS)**: Restructuraciones de deuda, M&A financing, distressed assets, financiamiento puente.

**Contexto del mercado colombiano:**
- Economía con PIB de ~$350 mil millones USD
- Sectores clave: energía, infraestructura, agroindustria, manufactura, telecomunicaciones
- Marco regulatorio: Superintendencia Financiera de Colombia
- Moneda principal: Peso Colombiano (COP), también operaciones en USD
- BTG Pactual es uno de los bancos de inversión líderes en América Latina

**Al generar leads debes:**
- Identificar empresas o proyectos específicos y reales del mercado colombiano
- Proporcionar montos estimados realistas y justificados en COP o USD
- Evaluar el riesgo crediticio objetivamente
- Explicar por qué BTG Pactual tiene ventaja competitiva para este negocio
- Identificar el contacto apropiado (CFO, CEO, Vicepresidente Financiero, etc.)
- Incluir factores clave que hacen atractiva esta oportunidad

**Formato de respuesta:**
Siempre responde con un JSON válido siguiendo exactamente esta estructura. No incluyas markdown, solo el JSON puro.`;

export interface MarketAnalysisParams {
  sectors: string[];
  products: ProductType[];
  marketContext: string;
  numberOfLeads?: number;
}

export interface MarketAnalysisResponse {
  analysisId?: string;
  marketOverview: string;
  leads: AILeadSuggestion[];
  totalOpportunities: number;
  estimatedTotalAmount: number;
}

export async function runMarketAnalysis(
  params: MarketAnalysisParams
): Promise<MarketAnalysisResponse> {
  const { sectors, products, marketContext, numberOfLeads = 8 } = params;

  const productNames: Record<string, string> = {
    CREDIT: "Crédito",
    STRUCTURED_DEBT: "Deuda Estructurada",
    PROJECT_FINANCE: "Project Finance",
    GUARANTEE: "Garantías",
    SPECIAL_SITUATIONS: "Situaciones Especiales",
  };

  const userPrompt = `Realiza un análisis de mercado detallado para generar ${numberOfLeads} leads de alta calidad para BTG Pactual Colombia.

**Sectores a analizar:** ${sectors.join(", ")}
**Productos de interés:** ${products.map((p) => productNames[p] || p).join(", ")}
**Contexto adicional del mercado:** ${marketContext}

**Fecha actual:** ${new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}

Genera exactamente ${numberOfLeads} leads específicos y accionables. Para cada lead, proporciona información detallada y realista sobre empresas o proyectos del mercado colombiano que genuinamente podrían necesitar los servicios financieros de BTG Pactual.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:

{
  "marketOverview": "Análisis general del mercado colombiano en estos sectores y productos, incluyendo tendencias actuales, oportunidades y riesgos. Mínimo 200 palabras.",
  "leads": [
    {
      "companyName": "Nombre exacto de la empresa o proyecto",
      "sector": "Sector específico",
      "productType": "CREDIT|STRUCTURED_DEBT|PROJECT_FINANCE|GUARANTEE|SPECIAL_SITUATIONS",
      "opportunity": "Descripción detallada de la oportunidad específica (mínimo 100 palabras). Incluir qué necesita la empresa, por qué necesita financiamiento, cuál es el uso de los fondos.",
      "estimatedAmount": 50000000000,
      "currency": "COP",
      "riskLevel": "LOW|MEDIUM|HIGH",
      "rationale": "Por qué BTG Pactual es el socio ideal para esta operación y por qué es una buena oportunidad",
      "priority": "LOW|MEDIUM|HIGH|URGENT",
      "keyFactors": ["Factor clave 1", "Factor clave 2", "Factor clave 3"],
      "contactSuggestions": "Cargo y perfil del contacto ideal en la empresa (ej: CFO, Vicepresidente Financiero)"
    }
  ],
  "totalOpportunities": ${numberOfLeads},
  "estimatedTotalAmount": 0
}

IMPORTANTE:
- Los montos deben ser numéricos sin puntos ni comas (ej: 50000000000 para 50 mil millones COP)
- estimatedTotalAmount debe ser la suma de todos los estimatedAmount
- productType debe ser exactamente uno de los valores especificados
- Usa empresas reales del mercado colombiano cuando sea posible
- Los montos en COP deben ser realistas para operaciones de banca de inversión (mínimo 5.000 millones COP)`;

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    // @ts-expect-error - adaptive thinking available in claude-opus-4-6
    thinking: { type: "adaptive" },
    system: BTG_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const finalMessage = await stream.finalMessage();

  // Extract text content (skip thinking blocks)
  let jsonText = "";
  for (const block of finalMessage.content) {
    if (block.type === "text") {
      jsonText = block.text;
      break;
    }
  }

  // Clean up JSON - remove any markdown code fences if present
  jsonText = jsonText.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText) as MarketAnalysisResponse;
  return parsed;
}
