import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart, BookOpen, Lightbulb, Zap } from "lucide-react"

import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero")
  const prioritizationImage = PlaceHolderImages.find((img) => img.id === "prioritization")
  const stressImage = PlaceHolderImages.find((img) => img.id === "stress_reduction")
  const analyticsImage = PlaceHolderImages.find((img) => img.id === "analytics")

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "AI-Powered Prioritization",
      description: "Let our AI analyze your tasks and recommend what to focus on based on deadlines, weightage, and difficulty.",
      image: prioritizationImage,
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Stress Reduction Suggestions",
      description: "Our AI calculates your workload stress and suggests smart deadline adjustments to lighten the load.",
      image: stressImage,
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Batch Analytics for Teachers",
      description: "Get a bird's-eye view of your batch's workload with insightful statistics and visualizations.",
      image: analyticsImage,
    },
  ]

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
              Effortless Education,
              <br />
              <span className="text-primary">Intelligently Managed.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground md:text-xl">
              EduEase AI helps students and teachers navigate the complexities of modern education with powerful AI tools for prioritization, stress management, and analytics.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Smarter Way to Learn and Teach
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover how our AI-driven features can transform your educational experience.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              {feature.image && (
                <div className="relative h-56 w-full">
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={feature.image.imageHint}
                  />
                </div>
              )}
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
