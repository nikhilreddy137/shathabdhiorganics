import React from 'react';
import { Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1696371269777-88d1ce71642c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxtaWxsZXQlMjBmYXJtaW5nfGVufDB8fHx8MTc4MDY2NTM0Nnww&ixlib=rb-4.1.0&q=85"
            alt="Golden millet fields"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] mb-6">OUR STORY</p>
            <h1 className="text-7xl font-light text-gray-900 mb-8 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Nourishing Bodies,<br />Transforming Lives
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              The story of how one woman's love for her community became a movement to restore ancient wisdom and bring health back to every home.
            </p>
          </div>
        </div>
      </div>

      {/* Opening Quote */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl font-light text-gray-800 italic leading-relaxed mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            "I watched my grandmother prepare millets with such reverence. She would say, 'These grains carry the wisdom of our ancestors and the health of our children.' When I saw this knowledge fading, I knew I had to act."
          </p>
          <p className="text-sm text-gray-500 uppercase tracking-widest">— FOUNDER, SHATHABDHI ORGANICS</p>
        </div>
      </div>

      {/* Founder Story */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <img
                src="https://customer-assets.emergentagent.com/job_ancient-grains-shop/artifacts/atpfm9c4_Screenshot%202026-06-05%20at%2018.44.27.png"
                alt="Founder"
                className="w-full h-auto"
              />
            </div>

            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-5xl font-light text-gray-900 mb-8 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  When Health Becomes a Mission
                </h2>
                <div className="space-y-6 text-gray-700 text-base leading-loose font-light">
                  <p>
                    Growing up in rural Telangana, I saw two worlds colliding. The ancient grains my grandmother cherished—millets that sustained generations—were being abandoned. Meanwhile, diabetes, obesity, and lifestyle diseases were spreading like wildfire through our communities.
                  </p>
                  <p>
                    I remember sitting with my mother after she was diagnosed with diabetes. The doctor handed her a diet chart filled with imported quinoa and oats. I looked at her and thought, <em>"We have better. We have millets. Why are we looking elsewhere?"</em>
                  </p>
                  <p>
                    That moment changed everything.
                  </p>
                  <p>
                    I started visiting farms, talking to women farmers who were struggling. They knew the value of these grains but had no market. Meanwhile, urban families wanted health but didn't know where to find authentic, chemical-free food.
                  </p>
                  <p className="text-xl italic text-gray-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    "What if I could bridge this gap? What if I could bring back the foods that healed us for centuries while empowering the women who grow them?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="py-20 px-4 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-16 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            The Impact of One Woman's Dream
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-light text-gray-900 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>500+</p>
              <p className="text-sm text-gray-600 uppercase tracking-wider">Women Farmers Empowered</p>
            </div>
            <div>
              <p className="text-5xl font-light text-gray-900 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>100%</p>
              <p className="text-sm text-gray-600 uppercase tracking-wider">Organic & Chemical-Free</p>
            </div>
            <div>
              <p className="text-5xl font-light text-gray-900 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>15K+</p>
              <p className="text-sm text-gray-600 uppercase tracking-wider">Families Nourished</p>
            </div>
            <div>
              <p className="text-5xl font-light text-gray-900 mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>14</p>
              <p className="text-sm text-gray-600 uppercase tracking-wider">Years of Purpose</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Health Mission */}
      <div className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Why Millets? Why Now?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1710149468014-3d0eb40caaeb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxtaWxsZXQlMjBmYXJtaW5nfGVufDB8fHx8MTc4MDY2NTM0Nnww&ixlib=rb-4.1.0&q=85"
                alt="Hands holding millet"
                className="w-full h-[500px] object-cover mb-6"
              />
              <h3 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                A Mother's Choice
              </h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Every mother wants the best for her children. When I learned that millets could help prevent diabetes, strengthen bones, and provide sustained energy without the blood sugar spikes of refined grains, I knew this wasn't just business—this was my duty.
              </p>
            </div>

            <div>
              <img
                src="https://images.pexels.com/photos/16977456/pexels-photo-16977456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Pearl millet field"
                className="w-full h-[500px] object-cover mb-6"
              />
              <h3 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Nature's Perfect Food
              </h3>
              <p className="text-gray-700 leading-relaxed font-light">
                Low glycemic index. High in fiber. Rich in iron and calcium. Gluten-free. Climate-resilient. Millets aren't just healthy—they're a solution to many of today's health and environmental crises. Our ancestors knew this. It's time we remembered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Women Supporting Women */}
      <div className="py-24 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/20327922/pexels-photo-20327922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Women in farming"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-5xl font-light text-gray-900 mb-8 leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Women Supporting Women
              </h2>
              <div className="space-y-6 text-gray-700 text-base leading-loose font-light">
                <p>
                  As a woman entrepreneur, I understand the challenges. The doubts. The doors that don't open easily. That's why I made a promise: <strong>every woman farmer who works with us receives fair wages, training, and respect.</strong>
                </p>
                <p>
                  Today, 70% of our supply chain is powered by women. Women who plant. Women who harvest. Women who process. Women who package. <em>We rise together.</em>
                </p>
                <p>
                  When you buy from Shathabdhi Organics, you're not just purchasing millets. You're investing in a woman's ability to send her daughter to school. To build a better future. To stand tall in her community.
                </p>
                <div className="pt-6 border-t border-gray-200 mt-8">
                  <p className="text-2xl italic text-gray-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    "When women support women, incredible things happen."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery — From Farm to Family */}
      <div className="py-20 px-4 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] text-stone-600 uppercase tracking-[0.4em] mb-4">A Day at Shathabdhi</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              From Our Farms to Your Family
            </h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
                alt="Golden millet field"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Foxtail_Millet_1.jpg?v=1724434250"
                alt="Foxtail Millet packaging"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                alt="Hand-blended spices"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_15e8b739-81fa-4831-96c8-ad3368bdbc6a.webp?v=1722854573"
                alt="Turmeric powder"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://images.pexels.com/photos/20327922/pexels-photo-20327922.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Women farmers"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/1_57e6957c-15a3-4ec5-b3ed-a54f30814344.webp?v=1722857652"
                alt="Cold-pressed sunflower oil"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/Jowar-Millet-Cookies-768x768.webp?v=1721349636"
                alt="Hand baked cookies"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 group">
              <img
                src="https://cdn.shopify.com/s/files/1/0657/0832/6964/files/basmathi_rice.jpg?v=1724496761"
                alt="Aged Basmati rice"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* The Promise */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-light text-gray-900 mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Promise to You
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed font-light">
            <p>
              Every grain that reaches your home has been touched by hands that care. Women who understand that food is medicine. Farmers who treat the soil with reverence. Processors who maintain purity at every step.
            </p>
            <p>
              We don't just sell millets. We sell hope. Health. Heritage. A better future for your children and ours.
            </p>
            <p className="text-2xl text-gray-900 font-normal pt-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              From my family to yours, with love and purpose.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gray-900 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-light mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Join Our Movement for Health
          </h2>
          <p className="text-xl leading-relaxed font-light text-gray-300 mb-12">
            Every purchase is a vote for better health, sustainable farming, and women's empowerment. Together, we're not just changing diets—we're changing lives.
          </p>
          <a 
            href="/collections/best-sellers"
            className="inline-block bg-white text-gray-900 px-12 py-4 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Explore Our Collection
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
