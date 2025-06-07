
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Globe, Smartphone, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance that loads in milliseconds, not seconds. Experience the speed difference."
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security with end-to-end encryption. Your data is always protected."
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy worldwide with our global CDN. Reach users anywhere with minimal latency."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Beautiful responsive design that works perfectly on any device, anywhere."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration and sharing features."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights that matter with comprehensive analytics and reporting tools."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you build, grow, and scale your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover-scale bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
