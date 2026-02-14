import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Sun, 
  CloudRain, 
  Droplets, 
  Bug, 
  AlertTriangle, 
  Calendar,
  Leaf,
  FlaskConical,
  Target,
  ChevronDown,
  ChevronUp,
  Wheat,
  MapPin,
  Clock,
  Lightbulb,
  Shield,
  TrendingUp,
  Sprout
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AIAdvisoryDisplayProps {
  advice: string;
  crop: string;
  variety: string;
  isLoading: boolean;
}

interface ParsedSection {
  title: string;
  content: string[];
  type: 'info' | 'warning' | 'tip' | 'schedule' | 'region' | 'water' | 'fertilizer' | 'general';
  icon: React.ReactNode;
}

const AIAdvisoryDisplay: React.FC<AIAdvisoryDisplayProps> = ({
  advice,
  crop,
  variety,
  isLoading,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-0', 'section-1']);

  // Parse the AI advice into structured sections
  const parsedSections = useMemo(() => {
    if (!advice) return [];

    const sections: ParsedSection[] = [];
    const lines = advice.split('\n').filter(line => line.trim());
    
    let currentSection: ParsedSection | null = null;
    
    const detectSectionType = (title: string): ParsedSection['type'] => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('warning') || lowerTitle.includes('risk') || lowerTitle.includes('alert') || lowerTitle.includes('caution')) return 'warning';
      if (lowerTitle.includes('tip') || lowerTitle.includes('advice') || lowerTitle.includes('recommend')) return 'tip';
      if (lowerTitle.includes('schedule') || lowerTitle.includes('timing') || lowerTitle.includes('application')) return 'schedule';
      if (lowerTitle.includes('region') || lowerTitle.includes('district') || lowerTitle.includes('odisha') || lowerTitle.includes('local')) return 'region';
      if (lowerTitle.includes('water') || lowerTitle.includes('irrigation') || lowerTitle.includes('moisture')) return 'water';
      if (lowerTitle.includes('fertilizer') || lowerTitle.includes('nutrient') || lowerTitle.includes('npk')) return 'fertilizer';
      return 'general';
    };

    const getIconForType = (type: ParsedSection['type'], title: string): React.ReactNode => {
      const lowerTitle = title.toLowerCase();
      
      // Check specific keywords first
      if (lowerTitle.includes('pest') || lowerTitle.includes('insect') || lowerTitle.includes('disease')) {
        return <Bug className="w-5 h-5" />;
      }
      if (lowerTitle.includes('weather') || lowerTitle.includes('climate') || lowerTitle.includes('rain')) {
        return <CloudRain className="w-5 h-5" />;
      }
      if (lowerTitle.includes('growing') || lowerTitle.includes('condition') || lowerTitle.includes('optimal')) {
        return <Sun className="w-5 h-5" />;
      }
      if (lowerTitle.includes('previous') || lowerTitle.includes('crop rotation') || lowerTitle.includes('benefit')) {
        return <Sprout className="w-5 h-5" />;
      }
      if (lowerTitle.includes('yield') || lowerTitle.includes('production') || lowerTitle.includes('harvest')) {
        return <TrendingUp className="w-5 h-5" />;
      }
      
      // Fall back to type-based icons
      switch (type) {
        case 'warning': return <AlertTriangle className="w-5 h-5" />;
        case 'tip': return <Lightbulb className="w-5 h-5" />;
        case 'schedule': return <Calendar className="w-5 h-5" />;
        case 'region': return <MapPin className="w-5 h-5" />;
        case 'water': return <Droplets className="w-5 h-5" />;
        case 'fertilizer': return <FlaskConical className="w-5 h-5" />;
        default: return <Leaf className="w-5 h-5" />;
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Detect section headers (lines with ** or # or ending with :)
      const isHeader = 
        (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) ||
        (trimmedLine.startsWith('#')) ||
        (trimmedLine.endsWith(':') && trimmedLine.length < 80 && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('•')) ||
        (trimmedLine.match(/^\d+\.\s*\*+.*\**$/)) ||
        (trimmedLine.match(/^[A-Z][A-Za-z\s]+:$/));
      
      if (isHeader) {
        // Save previous section
        if (currentSection && currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        
        // Clean up the title
        let title = trimmedLine
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/^#+\s*/, '')
          .replace(/:$/, '')
          .replace(/^\d+\.\s*\*+|\**$/g, '')
          .replace(/^\d+\.\s*/, '')
          .trim();
        
        const type = detectSectionType(title);
        currentSection = {
          title,
          content: [],
          type,
          icon: getIconForType(type, title),
        };
      } else if (currentSection) {
        // Clean up content lines
        const cleanedLine = trimmedLine
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/^[-•*]\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .trim();
        
        if (cleanedLine) {
          currentSection.content.push(cleanedLine);
        }
      } else {
        // Create a general section for content before any header
        if (!currentSection) {
          currentSection = {
            title: 'General Advice',
            content: [],
            type: 'general',
            icon: <Leaf className="w-5 h-5" />,
          };
        }
        const cleanedLine = trimmedLine
          .replace(/^[-•*]\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .trim();
        if (cleanedLine) {
          currentSection.content.push(cleanedLine);
        }
      }
    });
    
    // Don't forget the last section
    if (currentSection && currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return sections;
  }, [advice]);

  const getCardStyles = (type: ParsedSection['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-destructive/5 to-destructive/10',
          border: 'border-destructive/30',
          iconBg: 'bg-destructive/20 text-destructive',
          badge: 'bg-destructive/20 text-destructive border-destructive/30',
        };
      case 'tip':
        return {
          bg: 'bg-gradient-to-br from-warning/5 to-warning/10',
          border: 'border-warning/30',
          iconBg: 'bg-warning/20 text-warning',
          badge: 'bg-warning/20 text-warning border-warning/30',
        };
      case 'schedule':
        return {
          bg: 'bg-gradient-to-br from-info/5 to-info/10',
          border: 'border-info/30',
          iconBg: 'bg-info/20 text-info',
          badge: 'bg-info/20 text-info border-info/30',
        };
      case 'region':
        return {
          bg: 'bg-gradient-to-br from-accent/5 to-accent/10',
          border: 'border-accent/30',
          iconBg: 'bg-accent/20 text-accent-foreground',
          badge: 'bg-accent/20 text-accent-foreground border-accent/30',
        };
      case 'water':
        return {
          bg: 'bg-gradient-to-br from-sky-500/5 to-sky-500/10',
          border: 'border-sky-500/30',
          iconBg: 'bg-sky-500/20 text-sky-600 dark:text-sky-400',
          badge: 'bg-sky-500/20 text-sky-600 border-sky-500/30',
        };
      case 'fertilizer':
        return {
          bg: 'bg-gradient-to-br from-success/5 to-success/10',
          border: 'border-success/30',
          iconBg: 'bg-success/20 text-success',
          badge: 'bg-success/20 text-success border-success/30',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-primary/5 to-primary/10',
          border: 'border-primary/30',
          iconBg: 'bg-primary/20 text-primary',
          badge: 'bg-primary/20 text-primary border-primary/30',
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
        <CardHeader className="relative pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI-Powered Farming Advice</CardTitle>
              <p className="text-sm text-muted-foreground">Personalized Recommendations Powered by Gemini AI</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-primary opacity-20 animate-ping absolute inset-0" />
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center relative">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">Generating AI Recommendations...</p>
              <p className="text-sm text-muted-foreground mt-1">Analyzing your crop data and soil conditions</p>
            </div>
            <div className="flex gap-1 mt-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!advice) {
    return (
      <Card className="border-2 border-muted overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl text-muted-foreground">AI-Powered Farming Advice</CardTitle>
              <p className="text-sm text-muted-foreground">Personalized Recommendations Powered by Gemini AI</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 bg-muted/50 rounded-xl">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">AI advice will appear here after analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 pointer-events-none" />
      
      {/* Header */}
      <CardHeader className="relative pb-4 border-b border-border/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI-Powered Farming Advice</CardTitle>
              <p className="text-sm text-muted-foreground">Personalized Recommendations Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pt-6 space-y-4">
        {/* Crop Summary Card */}
        <div className="bg-gradient-to-r from-primary/10 via-success/10 to-accent/10 rounded-xl p-5 border border-primary/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Wheat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">Crop Analysis Summary</h3>
              <p className="text-sm text-muted-foreground">Tailored advice for your selection</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-background/80 px-3 py-1.5 text-sm gap-2">
              <Wheat className="w-4 h-4 text-success" />
              {crop}
            </Badge>
            <Badge variant="outline" className="bg-background/80 px-3 py-1.5 text-sm gap-2">
              <Sprout className="w-4 h-4 text-primary" />
              {variety}
            </Badge>
            <Badge variant="outline" className="bg-background/80 px-3 py-1.5 text-sm gap-2">
              <Clock className="w-4 h-4 text-info" />
              Season-Ready
            </Badge>
            <Badge variant="outline" className="bg-background/80 px-3 py-1.5 text-sm gap-2">
              <Droplets className="w-4 h-4 text-sky-500" />
              Water Optimized
            </Badge>
          </div>
        </div>

        {/* Warning Sections First */}
        {parsedSections.filter(s => s.type === 'warning').map((section, idx) => {
          const styles = getCardStyles(section.type);
          return (
            <div 
              key={`warning-${idx}`}
              className={`${styles.bg} ${styles.border} border rounded-xl p-5 animate-fade-in`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-heading font-semibold text-destructive">{section.title}</h4>
                    <Badge variant="outline" className={styles.badge}>Alert</Badge>
                  </div>
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-destructive mt-1">•</span>
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

        {/* Other Sections as Accordion */}
        <Accordion 
          type="multiple" 
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="space-y-3"
        >
          {parsedSections.filter(s => s.type !== 'warning').map((section, idx) => {
            const styles = getCardStyles(section.type);
            return (
              <AccordionItem 
                key={`section-${idx}`}
                value={`section-${idx}`}
                className={`${styles.bg} ${styles.border} border rounded-xl overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                      {section.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-heading font-semibold">{section.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.content.length} recommendation{section.content.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="pl-[52px]">
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li 
                          key={i} 
                          className="flex items-start gap-3 text-sm bg-background/50 rounded-lg p-3 transition-all hover:bg-background/80 hover:shadow-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 font-medium">
                            {i + 1}
                          </span>
                          <span className="text-foreground/90 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="bg-success/10 rounded-lg p-4 text-center hover:bg-success/20 transition-colors cursor-pointer group">
            <Leaf className="w-6 h-6 text-success mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-success">Optimal Growth</p>
          </div>
          <div className="bg-info/10 rounded-lg p-4 text-center hover:bg-info/20 transition-colors cursor-pointer group">
            <FlaskConical className="w-6 h-6 text-info mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-info">Fertilizer Plan</p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 text-center hover:bg-warning/20 transition-colors cursor-pointer group">
            <Bug className="w-6 h-6 text-warning mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-warning">Pest Alerts</p>
          </div>
          <div className="bg-sky-500/10 rounded-lg p-4 text-center hover:bg-sky-500/20 transition-colors cursor-pointer group">
            <Droplets className="w-6 h-6 text-sky-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-sky-600 dark:text-sky-400">Water Schedule</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAdvisoryDisplay;
