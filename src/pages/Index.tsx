import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import GoogleTranslate from "@/components/GoogleTranslate";
import CropForm, { FormData } from "@/components/CropForm";
import SoilForm, { SoilFormData } from "@/components/SoilForm";
import ResultsDashboard from "@/components/ResultsDashboard";
import { crops, getDistrictNPK } from "@/lib/cropData";
import {
  calculateFertilizerRecommendation,
  predictYield,
  FertilizerRecommendation,
  YieldPrediction,
} from "@/lib/fertilizerCalculator";

type Step = "hero" | "crop" | "soil" | "results";

const Index = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("crop");
  const [isLoading, setIsLoading] = useState(false);
  const [geminiAdvice, setGeminiAdvice] = useState<string | null>(null);

  // Form states
  const [cropFormData, setCropFormData] = useState<FormData>({
    crop: "",
    variety: "",
    district: "",
    block: "",
    location: "",
    farmSize: 1,
    sowingDate: "",
    irrigationType: "",
    previousCrop: "none",
    previousHarvestDate: "",
    fertilizer: "",
    fertilizerOther: "",
    latitude: null,
    longitude: null,
  });

  const [soilFormData, setSoilFormData] = useState<SoilFormData>({
    N: 240,
    P: 18,
    K: 175,
    source: "manual",
    soilType: "Alluvial",
  });

  // Results
  const [fertilizerRecommendation, setFertilizerRecommendation] =
    useState<FertilizerRecommendation | null>(null);
  const [yieldPrediction, setYieldPrediction] =
    useState<YieldPrediction | null>(null);

  const handleGetStarted = () => {
    setCurrentStep("crop");
  };

  const validateCropForm = () => {
    if (!cropFormData.crop) {
      toast({ title: "Please select a crop", variant: "destructive" });
      return false;
    }
    if (!cropFormData.variety) {
      toast({ title: "Please select a variety", variant: "destructive" });
      return false;
    }
    if (!cropFormData.district) {
      toast({ title: "Please select a district", variant: "destructive" });
      return false;
    }
    if (!cropFormData.farmSize || cropFormData.farmSize <= 0) {
      toast({ title: "Please enter valid farm size", variant: "destructive" });
      return false;
    }
    if (!cropFormData.sowingDate) {
      toast({ title: "Please enter sowing date", variant: "destructive" });
      return false;
    }
    if (!cropFormData.irrigationType) {
      toast({ title: "Please select irrigation type", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCropNext = () => {
    if (validateCropForm()) {
      // Set district average NPK if no values entered
      if (
        soilFormData.source === "district_average" ||
        (soilFormData.N === 0 && soilFormData.P === 0 && soilFormData.K === 0)
      ) {
        const districtNPK = getDistrictNPK(cropFormData.district);
        setSoilFormData({
          ...soilFormData,
          N: districtNPK.N,
          P: districtNPK.P,
          K: districtNPK.K,
          source: "district_average",
        });
      }
      setCurrentStep("soil");
    }
  };

  const generateGeminiAdvice = async () => {
    setIsLoading(true);

    // For now, generate local advice since Gemini API requires backend
    // This will be replaced with actual Gemini API call once Cloud is enabled
    const cropInfo = crops[cropFormData.crop];

    const advice = `🌾 **Farming Advisory for ${cropFormData.crop} (${
      cropFormData.variety
    })**

**Optimal Growing Conditions:**
- ${cropFormData.crop} requires ${
      cropInfo?.waterRequirement?.toLowerCase() || "moderate"
    } water availability
- Expected growing period: ${cropInfo?.growingDays || 100} days
- Your ${cropFormData.irrigationType} irrigation is ${
      cropFormData.irrigationType === "Rainfed"
        ? "weather-dependent; consider supplementary irrigation during dry spells"
        : "well-suited for this crop"
    }

**Fertilizer Application Schedule:**
1. **Basal Application (At sowing):**
   - Apply 50% of DAP and 100% of MOP
   - Mix well with soil before sowing
   
2. **First Top Dressing (21-25 days after sowing):**
   - Apply 50% of Urea
   - Ensure soil moisture before application
   
3. **Second Top Dressing (40-45 days after sowing):**
   - Apply remaining 50% of Urea
   - Apply during active tillering/vegetative growth

**Region-Specific Tips for ${cropFormData.district}:**
- Monitor local weather forecasts during monsoon season
- ${
      cropFormData.district
    } typically receives adequate rainfall from June to September
- Watch for common pests in this region and apply preventive measures

**Risk Alerts:**
${
  new Date(cropFormData.sowingDate).getMonth() >= 5 &&
  new Date(cropFormData.sowingDate).getMonth() <= 7
    ? "✅ Sowing time is optimal for Kharif season"
    : "⚠️ Consider adjusting sowing date for better yield"
}

**Previous Crop Benefit:**
${
  cropFormData.previousCrop !== "none" &&
  [
    "Green Gram (Moong)",
    "Black Gram (Urad)",
    "Pigeon Pea (Arhar)",
    "Groundnut",
  ].includes(cropFormData.previousCrop)
    ? `✅ Legume rotation benefit: Your previous ${cropFormData.previousCrop} crop has added ~20-25 kg/ha of nitrogen to the soil`
    : "💡 Consider rotating with legumes next season to improve soil nitrogen naturally"
}

**Water Management:**
- ${
      cropInfo?.waterRequirement === "High"
        ? "Maintain 5-7 cm standing water during critical growth stages. Drain water 15 days before harvest."
        : "Apply irrigation at critical growth stages only. Avoid waterlogging."
    }

For personalized guidance, contact your local Krishi Vigyan Kendra (KVK) or Agriculture Department office.`;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setGeminiAdvice(advice);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    // Calculate fertilizer recommendations
    const cropInfo = crops[cropFormData.crop];
    const recommendation = calculateFertilizerRecommendation(
      {
        N: soilFormData.N,
        P: soilFormData.P,
        K: soilFormData.K,
        source: soilFormData.source,
      },
      cropInfo.idealNPK,
      cropFormData.farmSize
    );
    setFertilizerRecommendation(recommendation);

    // Calculate yield prediction
    const prediction = predictYield(
      {
        crop: cropFormData.crop,
        variety: cropFormData.variety,
        soilData: {
          N: soilFormData.N,
          P: soilFormData.P,
          K: soilFormData.K,
          source: soilFormData.source,
        },
        farmSizeAcres: cropFormData.farmSize,
        irrigationType: cropFormData.irrigationType,
        sowingDate: cropFormData.sowingDate,
        district: cropFormData.district,
        previousCrop: cropFormData.previousCrop,
      },
      cropInfo.yieldRange
    );
    setYieldPrediction(prediction);

    setCurrentStep("results");

    // Generate AI advice
    generateGeminiAdvice();

    toast({
      title: "Prediction Complete!",
      description:
        "Your crop yield prediction and fertilizer recommendations are ready.",
    });
  };

  const handleBack = () => {
    if (currentStep === "crop") return;
    else if (currentStep === "soil") setCurrentStep("crop");
    else if (currentStep === "results") setCurrentStep("soil");
  };

  const handleNewPrediction = () => {
    setCurrentStep("crop");
    setCropFormData({
      crop: "",
      variety: "",
      district: "",
      block: "",
      location: "",
      farmSize: 1,
      sowingDate: "",
      irrigationType: "",
      previousCrop: "none",
      previousHarvestDate: "",
      fertilizer: "",
      fertilizerOther: "",
      latitude: null,
      longitude: null,
    });
    setSoilFormData({
      N: 240,
      P: 18,
      K: 175,
      source: "manual",
      soilType: "Alluvial",
    });
    setFertilizerRecommendation(null);
    setYieldPrediction(null);
    setGeminiAdvice(null);
  };

  // Start directly at the crop form (hero section removed)

  return (
    <div className="min-h-screen bg-background">
      {/* Header/nav removed per user request */}

      {/* Main content - add top padding so a fixed nav bar doesn't overlap */}
      <main className="container mx-auto px-4 pb-8 pt-16">
        {currentStep === "crop" && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-2">
                Crop & Farm Details
              </h2>
              <p className="text-muted-foreground">
                Enter your crop selection and farm information for accurate
                predictions
              </p>
            </div>

            <CropForm formData={cropFormData} onFormChange={setCropFormData} />

            <div className="mt-8 flex justify-end">
              <Button onClick={handleCropNext} size="lg" className="gap-2">
                Continue to Soil Data
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "soil" && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold mb-2">
                Soil Information
              </h2>
              <p className="text-muted-foreground">
                Enter soil test values or use district averages for{" "}
                {cropFormData.district}
              </p>
            </div>

            <SoilForm
              soilData={soilFormData}
              district={cropFormData.district}
              onSoilChange={setSoilFormData}
            />

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                size="lg"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                variant="hero"
                size="lg"
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Get Prediction
              </Button>
            </div>
          </div>
        )}

        {currentStep === "results" &&
          fertilizerRecommendation &&
          yieldPrediction && (
            <div className="max-w-5xl mx-auto">
              <ResultsDashboard
                crop={cropFormData.crop}
                variety={cropFormData.variety}
                district={cropFormData.district}
                fertilizerRecommendation={fertilizerRecommendation}
                yieldPrediction={yieldPrediction}
                farmSize={cropFormData.farmSize}
                geminiAdvice={geminiAdvice}
                isLoading={isLoading}
              />

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  size="lg"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Modify Input
                </Button>
                <Button onClick={handleNewPrediction} variant="hero" size="lg">
                  Start New Prediction
                </Button>
              </div>
            </div>
          )}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          {/* Footer text removed per user request */}
        </div>
      </footer>
    </div>
  );
};

export default Index;
