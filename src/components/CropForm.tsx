import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Droplets,
  Leaf,
  Ruler,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  crops,
  tamilNaduDistricts,
  irrigationTypes,
  getCropVarieties,
} from "@/lib/cropData";

export interface FormData {
  crop: string;
  variety: string;
  district: string;
  block: string;
  location: string;
  farmSize: number;
  sowingDate: string;
  irrigationType: string;
  previousCrop: string;
  previousHarvestDate: string;
  fertilizer?: string;
  fertilizerOther?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface CropFormProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
}

const CropForm: React.FC<CropFormProps> = ({ formData, onFormChange }) => {
  const [varieties, setVarieties] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (formData.crop) {
      const cropVarieties = getCropVarieties(formData.crop);
      setVarieties(cropVarieties);
      if (
        cropVarieties.length > 0 &&
        !cropVarieties.includes(formData.variety)
      ) {
        onFormChange({ ...formData, variety: cropVarieties[0] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.crop]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    onFormChange({ ...formData, [field]: value });
  };

  const requestGeolocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available in your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Set coordinates and auto-fill location as lat,long string
        onFormChange({
          ...formData,
          latitude,
          longitude,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error", err);
        alert(
          "Unable to retrieve location. Please allow location access and try again."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    // If fertilizer is not 'Other', clear any custom fertilizer text
    if (
      formData.fertilizer &&
      formData.fertilizer !== "Other" &&
      formData.fertilizerOther
    ) {
      onFormChange({ ...formData, fertilizerOther: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fertilizer]);

  const cropNames = Object.keys(crops);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Crop Selection */}
      <Card variant="gradient" className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-success" />
            Crop & Variety Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crop">Select Crop *</Label>
              <Select
                value={formData.crop}
                onValueChange={(v) => handleChange("crop", v)}
              >
                <SelectTrigger id="crop" className="bg-background">
                  <SelectValue placeholder="Choose a crop" />
                </SelectTrigger>
                <SelectContent>
                  {cropNames.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Select Variety *</Label>
              <Select
                value={formData.variety}
                onValueChange={(v) => handleChange("variety", v)}
                disabled={!formData.crop}
              >
                <SelectTrigger id="variety" className="bg-background">
                  <SelectValue placeholder="Choose variety" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety} value={variety}>
                      {variety}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-info" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={formData.district}
              onValueChange={(v) => handleChange("district", v)}
            >
              <SelectTrigger id="district" className="bg-background">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {tamilNaduDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="block">Block</Label>
            <Input
              id="block"
              value={formData.block}
              onChange={(e) => handleChange("block", e.target.value)}
              placeholder="Enter block name"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Village/Location</Label>
            <div className="flex items-center gap-2">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter village name"
                className="bg-background flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={requestGeolocation}
                disabled={locating}
              >
                {locating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Use GPS"
                )}
              </Button>
            </div>
            {formData.latitude && formData.longitude && (
              <div className="text-xs text-muted-foreground mt-1">
                Coordinates: {formData.latitude.toFixed(6)},{" "}
                {formData.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Farm Details */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="w-5 h-5 text-warning" />
            Farm Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size (Acres) *</Label>
            <Input
              id="farmSize"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.farmSize || ""}
              onChange={(e) =>
                handleChange("farmSize", parseFloat(e.target.value) || 0)
              }
              placeholder="e.g., 2.5"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="irrigationType">Irrigation Type *</Label>
            <Select
              value={formData.irrigationType}
              onValueChange={(v) => handleChange("irrigationType", v)}
            >
              <SelectTrigger id="irrigationType" className="bg-background">
                <SelectValue placeholder="Select irrigation" />
              </SelectTrigger>
              <SelectContent>
                {irrigationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      {type}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fertilizer">Fertilizer (Major) </Label>
            <Select
              value={formData.fertilizer || ""}
              onValueChange={(v) => handleChange("fertilizer", v)}
            >
              <SelectTrigger id="fertilizer" className="bg-background">
                <SelectValue placeholder="Select fertilizer or Other" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Urea">Urea</SelectItem>
                <SelectItem value="DAP">DAP (Di-Ammonium Phosphate)</SelectItem>
                <SelectItem value="MOP">MOP (Muriate of Potash)</SelectItem>
                <SelectItem value="SSP">
                  SSP (Single Super Phosphate)
                </SelectItem>
                <SelectItem value="NPK">NPK (Compound Fertilizer)</SelectItem>
                <SelectItem value="Compost">Compost</SelectItem>
                <SelectItem value="Cow Manure">Cow Manure</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {formData.fertilizer === "Other" && (
              <Input
                id="fertilizerOther"
                value={formData.fertilizerOther || ""}
                onChange={(e) =>
                  handleChange("fertilizerOther", e.target.value)
                }
                placeholder="Type other fertilizer"
                className="bg-background mt-2"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-accent" />
            Sowing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sowingDate">Sowing Date *</Label>
            <Input
              id="sowingDate"
              type="date"
              value={formData.sowingDate}
              onChange={(e) => handleChange("sowingDate", e.target.value)}
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Previous Crop */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Previous Crop History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="previousCrop">Previously Grown Crop</Label>
            <Select
              value={formData.previousCrop}
              onValueChange={(v) => handleChange("previousCrop", v)}
            >
              <SelectTrigger id="previousCrop" className="bg-background">
                <SelectValue placeholder="Select previous crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None / Fallow</SelectItem>
                {cropNames.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousHarvestDate">Previous Harvest Date</Label>
            <Input
              id="previousHarvestDate"
              type="date"
              value={formData.previousHarvestDate}
              onChange={(e) =>
                handleChange("previousHarvestDate", e.target.value)
              }
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropForm;
