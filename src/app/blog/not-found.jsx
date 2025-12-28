import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GeometricBackground } from "@/components/GeometricBackground";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <GeometricBackground />
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-syne text-5xl md:text-6xl font-bold mb-4 lowercase">
            post not found
          </h1>
          <p className="text-white/60 mb-8 font-mono">
            the post you're looking for doesn't exist
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 border border-white/20 hover:border-white/40 transition-colors font-mono text-sm"
          >
            back to blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

