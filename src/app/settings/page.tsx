"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Settings, Loader2, Check, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type TestStatus = "idle" | "testing" | "success" | "error";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-5-mini-2025-08-07");
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key") || "";
    const savedModel = localStorage.getItem("openai_model") || "gpt-5-mini-2025-08-07";
    setApiKey(savedApiKey);
    setModel(savedModel);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("openai_model", model);
    toast.success("Settings saved successfully!");
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key to test");
      return;
    }

    setTestStatus("testing");

    try {
      const response = await fetch("/api/quiz/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, model }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "API key test failed");
      }

      setTestStatus("success");
      toast.success("API key is valid!");

      // Auto-reset status after 3 seconds
      setTimeout(() => setTestStatus("idle"), 3000);
    } catch (error) {
      setTestStatus("error");
      toast.error(error instanceof Error ? error.message : "Failed to test API key");

      // Auto-reset status after 3 seconds
      setTimeout(() => setTestStatus("idle"), 3000);
    }
  };

  const handleClear = () => {
    setApiKey("");
    setModel("gpt-5-mini-2025-08-07");
    localStorage.removeItem("openai_api_key");
    localStorage.removeItem("openai_model");
    toast.success("Settings cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure your AutoQuiz preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              OpenAI Configuration
            </CardTitle>
            <CardDescription>
              Configure your OpenAI API key and preferred model for quiz generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally in your browser and never sent to our servers.
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  OpenAI Dashboard
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini (Default, Faster & Cheaper)</SelectItem>
                  <SelectItem value="gpt-5-nano-2025-08-07">GPT-5 Nano (Smallest & Fastest)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                GPT-5 Mini is recommended for most use cases. GPT-5 Nano is faster and cheaper but may have lower quality.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleTestKey}
                disabled={testStatus === "testing"}
                className="flex-1"
              >
                {testStatus === "testing" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {testStatus === "success" && (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                )}
                {testStatus === "error" && (
                  <X className="mr-2 h-4 w-4 text-red-600" />
                )}
                {testStatus === "testing"
                  ? "Testing..."
                  : testStatus === "success"
                  ? "Valid!"
                  : testStatus === "error"
                  ? "Failed"
                  : "Test API Key"}
              </Button>
            </div>

            <Button variant="outline" onClick={handleClear} className="w-full">
              Clear Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Privacy</h4>
              <p>
                Your API key is stored only in your browser's local storage and is never sent to
                AutoQuiz servers. All requests are made directly from your browser to OpenAI's API.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Costs</h4>
              <p>
                Quiz generation uses OpenAI's API, which incurs costs based on your usage.
                GPT-4o Mini is significantly cheaper than GPT-4o. Check{" "}
                <a
                  href="https://platform.openai.com/docs/models"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  OpenAI's pricing page
                </a>{" "}
                for current rates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Security</h4>
              <p>
                Keep your API key secure and never share it. If you believe your key has been
                compromised, revoke it immediately in your OpenAI dashboard and generate a new one.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
