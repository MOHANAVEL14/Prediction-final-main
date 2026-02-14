import React from 'react';
import { 
  TrendingUp, 
  Leaf, 
  FlaskConical, 
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FertilizerRecommendation, YieldPrediction } from '@/lib/fertilizerCalculator';
import AIAdvisoryDisplay from './AIAdvisoryDisplay';

interface ResultsDashboardProps {
  crop: string;
  variety: string;
  district: string;
  fertilizerRecommendation: FertilizerRecommendation;
  yieldPrediction: YieldPrediction;
  farmSize: number;
  geminiAdvice: string | null;
  isLoading: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  crop,
  variety,
  district,
  fertilizerRecommendation,
  yieldPrediction,
  farmSize,
  geminiAdvice,
  isLoading,
}) => {
  const getStatusIcon = (status: 'Deficient' | 'Adequate' | 'Excess') => {
    switch (status) {
      case 'Deficient':
        return <ArrowDownRight className="w-4 h-4 text-destructive" />;
      case 'Excess':
        return <ArrowUpRight className="w-4 h-4 text-warning" />;
      default:
        return <Minus className="w-4 h-4 text-success" />;
    }
  };

  const getStatusColor = (status: 'Deficient' | 'Adequate' | 'Excess') => {
    switch (status) {
      case 'Deficient':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'Excess':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-success/10 text-success border-success/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-2">Prediction Results</h2>
        <p className="text-muted-foreground">
          {crop} ({variety}) - {district} District
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Yield Prediction Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-golden opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-success" />
              Predicted Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-bold text-success">
              {yieldPrediction.predictedYieldQuintalPerAcre}
              <span className="text-lg font-normal text-muted-foreground ml-1">q/acre</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Confidence: {yieldPrediction.confidencePercent}%
              </Badge>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Range: {yieldPrediction.yieldRange.min} - {yieldPrediction.yieldRange.max} q/acre
            </div>
            <Progress value={yieldPrediction.confidencePercent} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Total Yield Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              Total Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-bold text-primary">
              {(yieldPrediction.predictedYieldQuintalPerAcre * farmSize).toFixed(1)}
              <span className="text-lg font-normal text-muted-foreground ml-1">quintals</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              For {farmSize} acres of farmland
            </div>
          </CardContent>
        </Card>

        {/* Profit Potential Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-secondary" />
              Profit Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-bold text-secondary">
              ₹{yieldPrediction.economicAnalysis.profitDifference.toLocaleString()}
              <span className="text-lg font-normal text-muted-foreground ml-1">/acre</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              With balanced NPK application
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrient Status */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-success" />
            Nutrient Status & Deficit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(['N', 'P', 'K'] as const).map((nutrient) => {
              const status = fertilizerRecommendation.nutrientStatus[nutrient];
              const deficit = fertilizerRecommendation.nutrientDeficit[nutrient];
              const labels = { N: 'Nitrogen', P: 'Phosphorus', K: 'Potassium' };
              
              return (
                <div 
                  key={nutrient}
                  className={`p-4 rounded-xl border ${getStatusColor(status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{labels[nutrient]}</span>
                    {getStatusIcon(status)}
                  </div>
                  <div className="text-2xl font-heading font-bold">
                    {deficit > 0 ? `-${deficit}` : '0'} kg/ha
                  </div>
                  <div className="text-sm mt-1 opacity-80">
                    Status: {status}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Recommendations */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-info" />
            Fertilizer Recommendations
          </CardTitle>
          <CardDescription>
            Precise application rates based on soil analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'Urea', data: fertilizerRecommendation.urea, color: 'bg-info' },
              { name: 'DAP', data: fertilizerRecommendation.dap, color: 'bg-success' },
              { name: 'MOP', data: fertilizerRecommendation.mop, color: 'bg-accent' },
            ].map((fertilizer) => (
              <div 
                key={fertilizer.name}
                className="p-5 bg-muted rounded-xl text-center"
              >
                <div className={`w-12 h-12 mx-auto ${fertilizer.color} rounded-full flex items-center justify-center mb-3`}>
                  <span className="text-white font-bold text-sm">
                    {fertilizer.name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-lg">{fertilizer.name}</h4>
                <div className="text-3xl font-bold mt-2">
                  {fertilizer.data.kgPerAcre}
                  <span className="text-sm font-normal text-muted-foreground"> kg/acre</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ({fertilizer.data.kgPerHectare} kg/ha)
                </div>
                <div className="text-sm font-medium text-primary mt-3">
                  Total: {(fertilizer.data.kgPerAcre * farmSize).toFixed(1)} kg
                </div>
              </div>
            ))}
          </div>

          {/* Warnings */}
          {fertilizerRecommendation.warnings.length > 0 && (
            <div className="mt-6 space-y-2">
              {fertilizerRecommendation.warnings.map((warning, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg text-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yield Scenarios */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Yield Improvement Scenarios</CardTitle>
          <CardDescription>
            Potential yield increase with optimized nutrient management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Current Prediction', value: yieldPrediction.predictedYieldQuintalPerAcre, color: 'bg-muted' },
              { label: '+10kg Nitrogen', value: yieldPrediction.scenarios.nPlus10, color: 'bg-info/10' },
              { label: 'Balanced NPK', value: yieldPrediction.scenarios.balancedNPK, color: 'bg-success/10' },
            ].map((scenario) => (
              <div key={scenario.label} className={`p-4 rounded-xl ${scenario.color}`}>
                <div className="text-sm text-muted-foreground">{scenario.label}</div>
                <div className="text-2xl font-heading font-bold mt-1">
                  {scenario.value} q/acre
                </div>
                {scenario.value > yieldPrediction.predictedYieldQuintalPerAcre && (
                  <Badge variant="secondary" className="mt-2">
                    +{((scenario.value - yieldPrediction.predictedYieldQuintalPerAcre) / yieldPrediction.predictedYieldQuintalPerAcre * 100).toFixed(1)}% increase
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Advisory - Enhanced Display */}
      <AIAdvisoryDisplay 
        advice={geminiAdvice || ''}
        crop={crop}
        variety={variety}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResultsDashboard;
