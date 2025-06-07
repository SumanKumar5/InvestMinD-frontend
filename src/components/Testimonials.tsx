import React from 'react';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "InvestMinD's AI analytics have transformed how I manage client portfolios. The insights are invaluable for making data-driven decisions.",
      rating: 5
    },
    {
      name: "Michael Roberts",
      role: "Day Trader",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The real-time market analysis helps me make faster, more informed trading decisions. A game-changer for my trading strategy!",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Investment Advisor",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "My clients love the clear insights and predictions. It's made our investment discussions much more productive and strategic.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Hedge Fund Analyst",
      image: "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The AI-driven market predictions have given us a significant edge in our portfolio management strategies.",
      rating: 5
    },
    {
      name: "Rachel Martinez",
      role: "Crypto Investor",
      image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "Finally, a platform that combines traditional and crypto assets with powerful AI insights. Exactly what I needed!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Financial Planner",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
      content: "The portfolio optimization suggestions have helped my clients achieve their financial goals more efficiently.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-900/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Trusted by <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">Investment Professionals</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            Join thousands of investors who are already leveraging our AI-powered insights to make smarter investment decisions.
          </p>
        </div>
        
        {/* Testimonials Swiper */}
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination, EffectCoverflow]}
          className="testimonial-swiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 'auto',
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 40,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group mx-2 sm:mx-4 h-full">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors duration-300 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base truncate">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-gray-300 leading-relaxed italic text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;