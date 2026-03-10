"use client";

import { useState } from "react";
import { Key, Save, CheckCircle, AlertCircle, Info } from "lucide-react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
  const [apiKeyStatus, setApiKeyStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [checking, setChecking] = useState(false);

  const checkApiKey = async () => {
    setChecking(true);
    try {
      // Simple check - try to hit the analyze endpoint with minimal data
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectors: ["Energía y Petróleo"],
          products: ["CREDIT"],
          marketContext: "Test de configuración",
          numberOfLeads: 1,
        }),
      });
      setApiKeyStatus(res.status !== 401 && res.status !== 403 ? "ok" : "error");
    } catch {
      setApiKeyStatus("error");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-btg-text">
          Configuración
        </h1>
        <p className="text-btg-text-muted text-sm mt-1">
          Ajustes del sistema BTG Lead Radar
        </p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key size={18} className="text-btg-gold" />
            <h2 className="text-base font-semibold text-btg-text">
              API de Claude (Anthropic)
            </h2>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="p-4 bg-btg-navy rounded-xl border border-btg-navy-border">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-btg-gold flex-shrink-0 mt-0.5" />
              <div className="text-sm text-btg-text-muted">
                <p>La clave API de Anthropic se configura a través de la variable de entorno{" "}
                  <code className="text-btg-gold bg-btg-navy-border px-1 rounded">ANTHROPIC_API_KEY</code>{" "}
                  en el archivo <code className="text-btg-gold bg-btg-navy-border px-1 rounded">.env</code>.
                </p>
                <p className="mt-2">
                  Esta arquitectura es más segura que almacenar la clave en el navegador.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              loading={checking}
              onClick={checkApiKey}
            >
              Verificar Conexión
            </Button>
            {apiKeyStatus === "ok" && (
              <div className="flex items-center gap-1.5 text-green-400 text-sm">
                <CheckCircle size={14} />
                Conexión exitosa
              </div>
            )}
            {apiKeyStatus === "error" && (
              <div className="flex items-center gap-1.5 text-red-400 text-sm">
                <AlertCircle size={14} />
                Error de conexión - verifica tu API key
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-btg-text">Acerca de BTG Lead Radar</h2>
        </CardHeader>
        <CardBody className="pt-0 space-y-3">
          <div className="space-y-2 text-sm text-btg-text-muted">
            <div className="flex items-center justify-between">
              <span>Versión</span>
              <span className="text-btg-text">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Organización</span>
              <span className="text-btg-text">BTG Pactual Colombia</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Modelo AI</span>
              <span className="text-btg-gold">Claude Opus 4.6</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Base de Datos</span>
              <span className="text-btg-text">SQLite (local)</span>
            </div>
          </div>
          <div className="pt-3 border-t border-btg-navy-border">
            <p className="text-btg-text-dim text-xs">
              BTG Lead Radar utiliza inteligencia artificial avanzada (Claude Opus 4.6 con Extended Thinking)
              para analizar el mercado colombiano y generar leads calificados para los productos de
              banca de inversión de BTG Pactual Colombia.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
