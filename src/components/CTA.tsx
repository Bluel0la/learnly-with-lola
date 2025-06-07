
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and transform your workflow today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-12 py-6 hover-scale">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-12 py-6 hover-scale">
              Contact Sales
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
