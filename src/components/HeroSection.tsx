import React from "react";
import { Sprout, Droplets, Sun, LineChart, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Sprout,
      title: "Crop Prediction",
      desc: "AI-powered yield forecasting",
    },
    {
      icon: Droplets,
      title: "Fertilizer Guide",
      desc: "Precise NPK recommendations",
    },
    { icon: Sun, title: "Weather Insights", desc: "Climate-smart advisories" },
    {
      icon: LineChart,
      title: "Yield Analytics",
      desc: "Data-driven decisions",
    },
    { icon: Bot, title: "AI Advisory", desc: "Gemini-powered guidance" },
    { icon: FileText, title: "Soil Analysis", desc: "Comprehensive reports" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-golden flex items-center justify-center shadow-glow">
              <Sprout className="w-7 h-7 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-primary-foreground">
                AgriCare
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Government of Odisha
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-foreground/80 hidden sm:block">
              Transforming Agriculture
            </span>
          </div>
        </header>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
            Smart Farming!
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered crop yield prediction, precision fertilizer
            recommendations, and expert farming advice tailored for Odisha's
            unique agricultural landscape.
          </p>

          <div className="flex items-center justify-center">
            <Button
              variant="hero"
              size="xl"
              onClick={onGetStarted}
              className="w-full sm:w-auto"
            >
              <Sprout className="w-5 h-5" />
              Start Prediction
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="glass"
              className="group cursor-pointer card-hover animate-fade-in bg-primary-foreground/5 border-primary-foreground/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-golden/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-primary-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-primary-foreground/60">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "30", label: "Districts Covered" },
            { value: "8", label: "Major Crops" },
            { value: "50+", label: "Varieties Supported" },
            { value: "1M+", label: "Farmers Helped" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-heading font-bold text-darkest-green mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-darkest-green">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
