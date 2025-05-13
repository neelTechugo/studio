import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  VirtuFit: Your Personal Style Studio
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Upload your photo, choose an outfit, and see how it looks on you. Customize styles in real-time and find your perfect fit with our AI-powered virtual try-on tool.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/outfits" legacyBehavior passHref>
                  <Button size="lg" className="group">
                    Design Your Look
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <Image
              src="https://picsum.photos/seed/fashionmodel/600/600"
              width={600}
              height={600}
              alt="Fashion Model"
              data-ai-hint="fashion model"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How VirtuFit Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience the future of fashion. VirtuFit makes it easy to visualize yourself in any outfit, customized to your liking.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
              <h3 className="text-lg font-bold">1. Upload Your Image</h3>
              <p className="text-sm text-muted-foreground">
                Start by uploading a clear, front-facing photo of yourself. This will be your model for the virtual try-on.
              </p>
            </div>
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
              <h3 className="text-lg font-bold">2. Select an Outfit</h3>
              <p className="text-sm text-muted-foreground">
                Browse our collection of outfits. Choose a dress, gown, or any style you'd like to try.
              </p>
            </div>
            <div className="grid gap-1 p-4 rounded-lg border bg-card shadow-sm">
              <h3 className="text-lg font-bold">3. Customize & Visualize</h3>
              <p className="text-sm text-muted-foreground">
                Adjust dress length, neckline, and more with interactive controls. Our AI will render the changes on your image in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
