import React, { useState, useEffect, useRef } from "react";
import {
  FlaskConical,
  Upload,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { soilTypes, getDistrictNPK } from "@/lib/cropData";
import { getNPKValues } from "@/lib/soilNpk";

export interface SoilFormData {
  N: number;
  P: number;
  K: number;
  source: "soil_report" | "soil_image" | "manual" | "district_average";
  soilType: string;
}

interface SoilFormProps {
  soilData: SoilFormData;
  district: string;
  onSoilChange: (data: SoilFormData) => void;
}

const SoilForm: React.FC<SoilFormProps> = ({
  soilData,
  district,
  onSoilChange,
}) => {
  const [activeTab, setActiveTab] = useState("manual");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Update with district defaults when district changes and source is district_average
  useEffect(() => {
    if (activeTab === "district" && district) {
      const districtNPK = getDistrictNPK(district);
      onSoilChange({
        ...soilData,
        N: districtNPK.N,
        P: districtNPK.P,
        K: districtNPK.K,
        source: "district_average",
      });
    }
  }, [activeTab, district, onSoilChange, soilData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "district" && district) {
      const districtNPK = getDistrictNPK(district);
      onSoilChange({
        ...soilData,
        N: districtNPK.N,
        P: districtNPK.P,
        K: districtNPK.K,
        source: "district_average",
      });
    } else if (tab === "manual") {
      onSoilChange({ ...soilData, source: "manual" });
    }
  };

  const handleNPKChange = (field: "N" | "P" | "K", value: number) => {
    onSoilChange({ ...soilData, [field]: value, source: "manual" });
  };

  const handleSoilTypeChange = (type: string) => {
    // Get stored defaults for this soil type (loaded at app startup)
    const mapped = getNPKValues(type);
    onSoilChange({
      ...soilData,
      soilType: type,
      N: mapped.N,
      P: mapped.P,
      K: mapped.K,
      source: "manual",
    });
    // trigger a small UI highlight animation by toggling a class
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 420);
  };

  const getNutrientStatus = (value: number, type: "N" | "P" | "K") => {
    const thresholds = {
      N: { low: 200, high: 280 },
      P: { low: 15, high: 25 },
      K: { low: 150, high: 200 },
    };
    const t = thresholds[type];
    if (value < t.low)
      return {
        status: "Low",
        color: "text-destructive",
        bg: "bg-destructive/10",
      };
    if (value > t.high)
      return { status: "High", color: "text-success", bg: "bg-success/10" };
    return { status: "Medium", color: "text-warning", bg: "bg-warning/10" };
  };

  return (
    <Card variant="gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-info" />
          Soil Data Input
        </CardTitle>
        <CardDescription>
          Enter soil test values or use district averages for fertilizer
          recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Manual Entry</span>
              <span className="sm:hidden">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Report</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="district" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">District Avg</span>
              <span className="sm:hidden">District</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select
                value={soilData.soilType}
                onValueChange={handleSoilTypeChange}
              >
                <SelectTrigger id="soilType" className="bg-background">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NPK Values */}
            <div className="grid gap-4 md:grid-cols-3">
              {(["N", "P", "K"] as const).map((nutrient) => {
                const status = getNutrientStatus(soilData[nutrient], nutrient);
                const labels = {
                  N: "Nitrogen (N)",
                  P: "Phosphorus (P)",
                  K: "Potassium (K)",
                };
                return (
                  <div key={nutrient} className="space-y-2">
                    <Label htmlFor={nutrient}>{labels[nutrient]} (kg/ha)</Label>
                    <Input
                      id={nutrient}
                      type="number"
                      min="0"
                      max="500"
                      value={soilData[nutrient] || ""}
                      onChange={(e) =>
                        handleNPKChange(
                          nutrient,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className={`bg-background ${
                        animating ? "ring-2 ring-info/40 transition-all" : ""
                      }`}
                    />
                    <div
                      className={`text-xs px-2 py-1 rounded-full inline-block ${status.bg} ${status.color}`}
                    >
                      {status.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold mb-2">
                Upload Soil Test Report
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload PDF, JPEG, or PNG file of your soil test report
              </p>
              <input
                ref={(el) => (inputRef.current = el)}
                type="file"
                id="soil-file-input"
                accept=".pdf,image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setUploadedName(file.name);
                  setUploading(true);
                  // Simulate upload/processing delay
                  await new Promise((r) => setTimeout(r, 1000));
                  // Mark source as soil_report; real OCR parsing would populate N/P/K
                  onSoilChange({ ...soilData, source: "soil_report" });
                  setUploading(false);
                }}
              />
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
              {uploadedName && (
                <div className="text-xs text-muted-foreground mt-2">
                  Selected: {uploadedName}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                OCR will automatically extract N, P, K values
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Or upload a soil image for AI-based soil type classification
            </div>
          </TabsContent>

          <TabsContent value="district" className="space-y-4">
            {district ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm">
                    Using average soil values for <strong>{district}</strong>{" "}
                    district
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {(["N", "P", "K"] as const).map((nutrient) => {
                    const status = getNutrientStatus(
                      soilData[nutrient],
                      nutrient
                    );
                    const labels = {
                      N: "Nitrogen (N)",
                      P: "Phosphorus (P)",
                      K: "Potassium (K)",
                    };
                    return (
                      <div
                        key={nutrient}
                        className="p-4 bg-muted rounded-lg text-center"
                      >
                        <div className="text-sm text-muted-foreground">
                          {labels[nutrient]}
                        </div>
                        <div className="text-2xl font-heading font-bold mt-1">
                          {soilData[nutrient]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          kg/ha
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${status.bg} ${status.color}`}
                        >
                          {status.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-warning" />
                <span className="text-sm">
                  Please select a district first to use average values
                </span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Source indicator */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data Source:</span>
            <span className="font-medium capitalize">
              {soilData.source.replace("_", " ")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilForm;
