import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Metadata optimization
export const metadata: Metadata = {
  title: "Next.js Starter Template for SaaS Startups - Solid SaaS Boilerplate",
  description: "This is Home for Solid Pro",
  // Optimize meta tags
  openGraph: {
    title: "Next.js Starter Template for SaaS Startups",
    description: "This is Home for Solid Pro",
    type: "website",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

// Loading components
const LoadingSpinner = () => (
  <div className="w-full h-48 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Dynamic imports for code splitting
const Hero = dynamic(() => import("@/components/Hero"), {
  loading: LoadingSpinner,
});

const Brands = dynamic(() => import("@/components/Brands"), {
  loading: LoadingSpinner,
});

const Feature = dynamic(() => import("@/components/Features"), {
  loading: LoadingSpinner,
});

const About = dynamic(() => import("@/components/About"), {
  loading: LoadingSpinner,
});

const FeaturesTab = dynamic(() => import("@/components/FeaturesTab"), {
  loading: LoadingSpinner,
});

const FunFact = dynamic(() => import("@/components/FunFact"), {
  loading: LoadingSpinner,
});

const Integration = dynamic(() => import("@/components/Integration"), {
  loading: LoadingSpinner,
});

const CTA = dynamic(() => import("@/components/CTA"), {
  loading: LoadingSpinner,
});

const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: LoadingSpinner,
});

const Testimonial = dynamic(() => import("@/components/Testimonial"), {
  loading: LoadingSpinner,
});

const Pricing = dynamic(() => import("@/components/Pricing"), {
  loading: LoadingSpinner,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: LoadingSpinner,
});

const Blog = dynamic(() => import("@/components/Blog"), {
  loading: LoadingSpinner,
});

// Add section interface for type safety
interface SectionProps {
  children: React.ReactNode;
}

// Reusable section wrapper with error boundary
const Section = ({ children }: SectionProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    <section className="w-full">
      {children}
    </section>
  </Suspense>
);

export default function Home() {
  return (
    <main>
      <Section>
        <Hero />
      </Section>

      {/* Group related sections for better loading strategy */}
      <Section>
        <Brands />
        <Feature />
      </Section>

      <Section>
        <About />
        <FeaturesTab />
      </Section>

      <Section>
        <FunFact />
        <Integration />
      </Section>

      <Section>
        <CTA />
        <FAQ />
      </Section>

      <Section>
        <Testimonial />
        <Pricing />
      </Section>

      <Section>
        <Contact />
        <Blog />
      </Section>
    </main>
  );
}