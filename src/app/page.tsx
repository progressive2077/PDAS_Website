'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight, Leaf, Award, Users, ChevronRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { api } from '@/lib/api';
import { HeroSection, Product, ContentBlock } from '@/types';
import { IMAGE } from '@/lib/assets';

const fallbackHero: HeroSection = {
  id: '',
  heading: 'Welcome to Progressive Cattle Fodder',
  subheading: "Nepal's Trusted Livestock Feed Manufacturer",
  description:
    'We provide premium-quality corn silage and feed solutions for your livestock — fresh, nutritious, and sustainable.',
  primary_cta_text: 'Contact Us Now',
  primary_cta_link: '/contact',
  secondary_cta_text: 'Explore More',
  secondary_cta_link: '/products',
  background_image_url: '',
  is_active: true,
  updated_at: '',
};

export default function HomePage() {
  const [hero, setHero] = useState<HeroSection>(fallbackHero);
  const [products, setProducts] = useState<Product[]>([]);
  const [aboutContent, setAboutContent] = useState<ContentBlock[]>([]);
  const [chairmanMsg, setChairmanMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getHero().catch(() => ({ success: false })),
      api.getPublicProducts().catch(() => ({ success: false, data: [] })),
      api.getAbout().catch(() => ({ success: false, data: [] })),
    ]).then(([heroRes, productsRes, aboutRes]) => {
      if (heroRes.success && heroRes.data) setHero(heroRes.data);
      if (productsRes.success) setProducts(productsRes.data.slice(0, 2));
      if (aboutRes.success) {
        setAboutContent(aboutRes.data);
        const chairman = aboutRes.data.find((b: ContentBlock) => b.key === 'chairman_message');
        if (chairman) setChairmanMsg(chairman.content);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  const balesilage = products.find(p => p.slug === 'bale-silage') || products[0];
  const mashFeed = products.find(p => p.slug === 'mash-cattle-feed') || products[1];

  const heroBgImage = hero.background_image_url || IMAGE.background;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-pcfi-green-900 overflow-hidden">
        {/* Dynamic Hero Background */}
        <div className="absolute inset-0">
          <Image
            src={heroBgImage}
            alt={hero.heading || "Cattle farm"}
            fill
            className="object-cover opasity-100"
            priority
            unoptimized={Boolean(hero.background_image_url)}
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-pcfi-gold-500/20 border border-pcfi-gold-400/40 rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-3.5 h-3.5 text-pcfi-gold-400" />
              <span className="text-pcfi-gold-300 text-xs font-medium">Happy Cow, Happy Farmers!</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {hero.heading}
            </h1>
            <p className="text-pcfi-green-100 text-lg md:text-xl mb-8 leading-relaxed">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={hero.primary_cta_link} className="btn-primary">
                <Phone className="w-4 h-4" />
                {hero.primary_cta_text}
              </Link>
              <Link href={hero.secondary_cta_link} className="btn-secondary">
                {hero.secondary_cta_text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-8 right-8 hidden lg:flex gap-4">
          {[
            { val: '8+', label: 'Years Experience' },
            { val: '100%', label: 'Natural Feed' },
            { val: '500+', label: 'Happy Farmers' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 text-center border border-white/20">
              <p className="text-pcfi-gold-300 text-2xl font-bold font-display">{stat.val}</p>
              <p className="text-white text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / Products intro */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Bale Silage */}
            <div>
              <p className="section-subheading">Our Products</p>
              <h2 className="section-heading">Bale Silage</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {balesilage?.short_description ||
                  'PCFI Pvt. Ltd. is a trusted manufacturer of high-quality bale silage, dedicated to improving livestock nutrition and supporting sustainable agricultural practices.'}
              </p>
              <Link href="/gallery" className="btn-primary">
                View Gallery
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product image */}
            <div className="relative">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={
                    balesilage?.image_url ||
                    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
                  }
                  alt="Bale Silage"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Mash Feed card */}
              {mashFeed && (
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 max-w-xs">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={mashFeed.image_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200'}
                      alt={mashFeed.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{mashFeed.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{mashFeed.short_description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chairman message */}
      <section className="py-16 bg-pcfi-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subheading">Leadership</p>
              <h2 className="section-heading">Message from our Chairman</h2>
              <blockquote className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-pcfi-gold-500 pl-6 mb-6">
                {chairmanMsg ||
                  '"At Cattle Fodder Nepal, we are driven by a mission to empower farmers with sustainable, high-quality fodder solutions."'}
              </blockquote>
              <p className="text-pcfi-green-700 font-semibold">— Mr. Gopal Thapa, Chairman</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-48 h-56 bg-pcfi-green-200 rounded-2xl" />
                <div className="absolute -top-4 -left-4 w-48 h-56 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={IMAGE.chairman}
                      alt="Chairman"
                      width={192}
                      height={240}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-pcfi-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-pcfi-gold-400 font-semibold text-sm uppercase tracking-widest mb-2">Who We Are</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Our Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-pcfi-green-700/50 border border-pcfi-green-600 rounded-2xl p-8">
              <div className="w-12 h-12 bg-pcfi-gold-500 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-pcfi-gold-300 mb-3">Our Mission</h3>
              <p className="text-pcfi-green-100 leading-relaxed text-sm">
                We are committed to empowering farmers and livestock owners with innovative, sustainable, and high-quality feed solutions. Our mission and vision drive us to set new standards in Nepal's agricultural sector.
              </p>
            </div>
            <div className="bg-pcfi-green-700/50 border border-pcfi-green-600 rounded-2xl p-8">
              <div className="w-12 h-12 bg-pcfi-gold-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-pcfi-gold-300 mb-3">Our Vision</h3>
              <p className="text-pcfi-green-100 leading-relaxed text-sm">
                To be Nepal's most trusted and innovative livestock feed manufacturer, supporting agricultural prosperity across every region through science-backed solutions and farmer-first values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-pcfi-gold-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to improve your livestock's nutrition?
          </h2>
          <p className="text-white/80 mb-6">
            Contact us today and let our experts help you choose the right feed solution.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-pcfi-gold-600 font-bold px-8 py-3 rounded-lg hover:bg-pcfi-green-50 transition-colors">
            View Our Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}