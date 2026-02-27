import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User, 
  Utensils, 
  History, 
  Heart,
  Filter,
  Clock,
  Mail,
  Phone,
  Settings,
  LogOut,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';
import restaurantData from './data/restaurants.json';

// --- Types ---

type Page = 'home' | 'restaurants' | 'reservations' | 'profile';

interface Restaurant {
  id: string;
  name: string;
  cuisine_type: string;
  city: string;
  rating: number;
  price_range: string;
  image_url: string;
  description?: string;
  address?: string;
}

interface Reservation {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'past';
  image: string;
}

// --- Constants ---

const INDIAN_CITIES = [
  "Kochi", "Mumbai", "Delhi", "Bangalore", "Hyderabad", 
  "Chennai", "Kolkata", "Ahmedabad", "Pune", "Jaipur",
  "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore",
  "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna"
];

// --- Mock Data for Reservations ---

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    restaurantName: "The Gilded Ivy",
    date: "Friday, Oct 27",
    time: "7:30 PM",
    guests: 2,
    location: "Fort Kochi",
    status: 'confirmed',
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'res-2',
    restaurantName: "Malabar Junction",
    date: "Saturday, Oct 28",
    time: "8:00 PM",
    guests: 4,
    location: "Willingdon Island",
    status: 'pending',
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'res-3',
    restaurantName: "Paragon Restaurant",
    date: "Sep 12, 2024",
    time: "8:30 PM",
    guests: 3,
    location: "Lulu Mall, Kochi",
    status: 'past',
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
  }
];

// --- Components ---

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-sage/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-sage/5 rounded-full blur-3xl"
      />
    </div>
  );
};

const Navbar = ({ activePage, setPage }: { activePage: Page, setPage: (p: Page) => void }) => {
  return (
    <header className="sticky top-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-sage/10 px-6 md:px-20 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setPage('home')}
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Utensils size={18} />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-charcoal">Savora</h1>
      </div>

      <nav className="hidden md:flex items-center gap-10">
        {(['home', 'restaurants', 'reservations', 'profile'] as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={cn(
              "text-sm font-semibold transition-colors capitalize",
              activePage === p ? "text-primary" : "text-charcoal/60 hover:text-primary"
            )}
          >
            {p}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 text-charcoal/60 hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <div 
          className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden cursor-pointer"
          onClick={() => setPage('profile')}
        >
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const openMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${restaurant.name}, ${restaurant.address || ''}, ${restaurant.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden border border-sage/5 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-charcoal">{restaurant.rating}</span>
        </div>
        <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-charcoal transition-colors">
          <Heart size={18} />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold text-charcoal">{restaurant.name}</h3>
          <span className="text-primary font-bold">{restaurant.price_range}</span>
        </div>
        <p className="text-charcoal/50 text-sm mb-4">{restaurant.cuisine_type} • {restaurant.city}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-1 bg-sage/5 text-sage text-[10px] font-bold uppercase rounded-md tracking-wider">
            {restaurant.cuisine_type}
          </span>
          <span className="px-2 py-1 bg-sage/5 text-sage text-[10px] font-bold uppercase rounded-md tracking-wider">
            {restaurant.price_range}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-3 bg-primary hover:bg-primary/90 text-charcoal font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
            Book Now
          </button>
          <button 
            onClick={openMap}
            className="p-3 bg-beige text-charcoal/60 rounded-xl hover:bg-sage/10 transition-colors"
          >
            <MapIcon size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ReservationCard = ({ res }: { res: Reservation }) => {
  const isPast = res.status === 'past';
  
  return (
    <div className={cn(
      "bg-white rounded-2xl overflow-hidden border border-sage/5 shadow-sm flex flex-col md:flex-row transition-all",
      isPast && "opacity-70 hover:opacity-100 bg-beige/30"
    )}>
      <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden">
        <img src={res.image} alt={res.restaurantName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-xl font-bold text-charcoal">{res.restaurantName}</h4>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
              res.status === 'confirmed' ? "bg-primary/10 text-sage-dark" : 
              res.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
              res.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-charcoal/10 text-charcoal/60"
            )}>
              {res.status !== 'past' && <div className={cn("w-2 h-2 rounded-full", res.status === 'confirmed' ? "bg-primary" : "bg-yellow-500")} />}
              {res.status}
            </span>
          </div>
          <div className="space-y-2 text-charcoal/60">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} />
              <span>{res.date} • {res.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={14} />
              <span>Table for {res.guests} • {res.location}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-sage/10">
          {isPast ? (
            <>
              <button className="flex-1 md:flex-none px-6 py-2 bg-primary/10 text-sage-dark font-bold rounded-full text-xs hover:bg-primary/20 transition-colors">Rebook</button>
              <button className="flex-1 md:flex-none px-6 py-2 border border-sage/20 text-charcoal/60 font-bold rounded-full text-xs hover:bg-white transition-colors">Leave Review</button>
            </>
          ) : (
            <>
              <button className="flex-1 md:flex-none px-6 py-2 bg-primary text-charcoal font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all text-sm">Modify</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-beige text-charcoal/60 font-bold rounded-full hover:bg-red-50 hover:text-red-600 transition-colors text-sm">Cancel</button>
              <button className="flex-1 md:flex-none px-6 py-2 border border-sage/10 text-charcoal/40 font-bold rounded-full hover:bg-ivory transition-colors text-sm">View Details</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Page Components ---

const HomePage = ({ setPage, restaurants, selectedCity, setSelectedCity }: { 
  setPage: (p: Page) => void, 
  restaurants: Restaurant[],
  selectedCity: string,
  setSelectedCity: (c: string) => void
}) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 px-6 md:px-20 text-center flex flex-col items-center gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-charcoal">
            Plan your perfect dinner, <span className="text-sage italic font-medium">effortlessly.</span>
          </h1>
          <p className="text-charcoal/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Experience the art of fine dining with seamless planning and elegant reservations at the world's finest tables.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <div className="flex flex-col md:flex-row items-center p-2 bg-white rounded-[2rem] shadow-2xl shadow-sage/10 border border-sage/5">
            <div className="flex-1 flex items-center px-6 gap-3 w-full">
              <Search size={20} className="text-sage" />
              <input 
                type="text" 
                placeholder="Search for a restaurant or cuisine" 
                className="w-full border-none focus:ring-0 bg-transparent text-charcoal placeholder:text-charcoal/30 py-4"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-sage/10 mx-2" />
            <div className="flex-1 flex items-center px-6 gap-3 w-full relative">
              <MapPin size={20} className="text-sage" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border-none focus:ring-0 bg-transparent text-charcoal py-4 appearance-none cursor-pointer"
              >
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}, India</option>
                ))}
              </select>
              <div className="absolute right-6 pointer-events-none">
                <ChevronRight size={14} className="rotate-90 text-charcoal/30" />
              </div>
            </div>
            <button 
              onClick={() => setPage('restaurants')}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-charcoal px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              Find Table
            </button>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Reservation Preview */}
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal">Upcoming Reservation</h2>
          <button onClick={() => setPage('reservations')} className="text-primary font-bold text-sm hover:underline">View all</button>
        </div>
        <ReservationCard res={MOCK_RESERVATIONS[0]} />
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-charcoal">Featured in {selectedCity}</h2>
            <p className="text-charcoal/40 font-medium">Hand-picked selections for your next evening</p>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 flex items-center justify-center border border-sage/10 rounded-full hover:bg-white hover:shadow-md transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-sage/10 rounded-full hover:bg-white hover:shadow-md transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {restaurants.slice(0, 3).map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
          {restaurants.length === 0 && (
            <div className="col-span-3 py-20 text-center space-y-6 bg-white rounded-3xl border border-sage/5 shadow-sm">
              <div className="w-12 h-12 bg-beige text-sage rounded-full flex items-center justify-center mx-auto">
                <Utensils size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-charcoal">No Restaurants Found</h3>
                <p className="text-charcoal/40 text-sm">We couldn't find any restaurants in {selectedCity}.</p>
              </div>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-sage/10 text-charcoal/60 font-bold rounded-xl text-sm hover:bg-ivory transition-colors"
                >
                  Refresh
                </button>
                <button 
                  onClick={() => setPage('restaurants')}
                  className="px-6 py-2 bg-primary text-charcoal font-bold rounded-xl text-sm shadow-lg shadow-primary/20"
                >
                  Setup Database
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="bg-charcoal text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Elevate your dining experience</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Join Savora Select to get early access to reservations at the city's most exclusive tables and personalized recommendations.
            </p>
            <button className="bg-primary text-charcoal px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/10">
              Get Started for Free
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 opacity-20 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200" 
              alt="Dining" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const RestaurantsPage = ({ restaurants, loading, selectedCity, setSelectedCity, onRetry, onSeed, error }: { 
  restaurants: Restaurant[], 
  loading: boolean,
  selectedCity: string,
  setSelectedCity: (c: string) => void,
  onRetry: () => void,
  onSeed: () => void,
  error: string | null
}) => {
  const openGlobalMap = () => {
    const query = encodeURIComponent(`restaurants in ${selectedCity}, India`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-charcoal">Find your next flavor</h1>
          <p className="text-charcoal/50 font-medium">Discover the best premium dining experiences in {selectedCity}.</p>
        </div>
        <div className="flex items-center gap-2 text-charcoal/80 bg-white px-4 py-2 rounded-full border border-sage/10 shadow-sm relative">
          <MapPin size={16} className="text-primary" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none focus:ring-0 font-bold text-sm pr-6 appearance-none cursor-pointer"
          >
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}, India</option>
            ))}
          </select>
          <ChevronRight size={14} className="rotate-90 text-charcoal/30 absolute right-4 pointer-events-none" />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-charcoal font-bold rounded-full shadow-lg shadow-primary/20 whitespace-nowrap">
          <Filter size={16} />
          <span>All Filters</span>
        </button>
        {['South Indian', 'North Indian', 'Chinese', 'Price: $$', 'Rating: 4.5+'].map(filter => (
          <button key={filter} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-sage/10 text-charcoal/60 font-semibold rounded-full hover:border-primary hover:text-primary transition-all whitespace-nowrap">
            <span>{filter}</span>
            <ChevronRight size={14} className="rotate-90 opacity-30" />
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-sage/5" />
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-3xl border border-sage/5 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Settings size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-charcoal">Connection Error</h3>
            <p className="text-charcoal/50 max-w-md mx-auto">{error}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onRetry}
              className="px-8 py-3 bg-primary text-charcoal font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="py-20 text-center space-y-6 bg-white rounded-3xl border border-sage/5 shadow-sm">
          <div className="w-16 h-16 bg-beige text-sage rounded-full flex items-center justify-center mx-auto">
            <Utensils size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-charcoal">No Restaurants Found</h3>
            <p className="text-charcoal/50 max-w-md mx-auto">We couldn't find any restaurants in {selectedCity} in your database.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={onRetry}
              className="px-8 py-3 border border-sage/10 text-charcoal/60 font-bold rounded-xl hover:bg-ivory transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={onSeed}
              className="px-8 py-3 bg-primary text-charcoal font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              Seed with Demo Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}

      {/* Floating Map Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={openGlobalMap}
          className="flex items-center gap-3 px-8 py-4 bg-charcoal text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          <MapIcon size={20} />
          <span>Show Map View</span>
        </button>
      </div>
    </div>
  );
};

const ReservationsPage = () => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const upcoming = MOCK_RESERVATIONS.filter(r => r.status !== 'past');
  const past = MOCK_RESERVATIONS.filter(r => r.status === 'past');

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-20 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-charcoal">My Reservations</h1>
          <p className="text-sage font-medium">Manage your upcoming and past dining experiences.</p>
        </div>
        <div className="flex bg-beige p-1 rounded-full w-fit">
          <button 
            onClick={() => setTab('upcoming')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              tab === 'upcoming' ? "bg-white text-charcoal shadow-sm" : "text-charcoal/40"
            )}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setTab('past')}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-bold transition-all",
              tab === 'past' ? "bg-white text-charcoal shadow-sm" : "text-charcoal/40"
            )}
          >
            Past
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {tab === 'upcoming' ? (
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-charcoal/80">
              <Clock size={20} className="text-primary" />
              <h3 className="text-xl font-bold">Upcoming</h3>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {upcoming.map(res => (
                <ReservationCard key={res.id} res={res} />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-charcoal/80">
              <History size={20} className="text-sage" />
              <h3 className="text-xl font-bold">Past</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {past.map(res => (
                <div key={res.id} className="bg-beige/30 rounded-2xl p-6 border border-sage/10 flex flex-col gap-6 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-charcoal">{res.restaurantName}</h4>
                      <p className="text-[10px] text-sage font-bold uppercase tracking-widest mt-1">Visited {res.date}</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sage shadow-sm">
                      <Utensils size={18} />
                    </div>
                  </div>
                  <div className="text-sm text-charcoal/60 space-y-1">
                    <p>{res.guests} Guests • Dinner</p>
                    <p>{res.location}</p>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button className="flex-1 py-2.5 bg-primary/10 text-sage-dark font-bold rounded-full text-xs hover:bg-primary/20 transition-colors">Rebook</button>
                    <button className="flex-1 py-2.5 border border-sage/20 text-charcoal/60 font-bold rounded-full text-xs hover:bg-white transition-colors">Leave Review</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-20 py-12 space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2rem] border border-sage/5 shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
              alt="Arjun Nair" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-charcoal rounded-full shadow-lg hover:scale-110 transition-transform">
            <Settings size={16} />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-black text-charcoal">Arjun Nair</h1>
          <p className="text-charcoal/50 font-medium">Food Enthusiast • Kochi, India</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-charcoal/60 bg-beige px-4 py-1.5 rounded-full">
              <Mail size={14} />
              <span>arjun.nair@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-charcoal/60 bg-beige px-4 py-1.5 rounded-full">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-sage/5 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-bold text-charcoal">12</h3>
            <p className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">Total Bookings</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-sage/5 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-sage/10 text-sage rounded-lg flex items-center justify-center">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="font-bold text-charcoal">8</h3>
            <p className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">Favorites</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-sage/5 shadow-sm space-y-4">
          <div className="w-10 h-10 bg-terracotta/10 text-terracotta rounded-lg flex items-center justify-center">
            <Star size={20} />
          </div>
          <div>
            <h3 className="font-bold text-charcoal">4.8</h3>
            <p className="text-xs text-charcoal/40 font-bold uppercase tracking-wider">Review Average</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-charcoal">Account Settings</h2>
        <div className="bg-white rounded-2xl border border-sage/5 shadow-sm divide-y divide-sage/5">
          {['Personal Information', 'Payment Methods', 'Notification Preferences', 'Privacy & Security'].map(item => (
            <button key={item} className="w-full px-6 py-4 flex items-center justify-between hover:bg-ivory transition-colors text-left">
              <span className="text-sm font-semibold text-charcoal/80">{item}</span>
              <ChevronRight size={16} className="text-charcoal/20" />
            </button>
          ))}
          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left group">
            <span className="text-sm font-semibold text-red-500">Log Out</span>
            <LogOut size={16} className="text-red-300 group-hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-sage/10 py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="space-y-6 max-w-sm">
          <div className="flex items-center gap-2 text-sage">
            <Utensils size={24} />
            <h2 className="text-2xl font-black tracking-tight text-charcoal">Savora</h2>
          </div>
          <p className="text-charcoal/50 text-sm leading-relaxed">
            The world's most elegant dinner planning platform. Curated experiences for those who appreciate the finer things in life.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h4 className="font-bold text-charcoal">Explore</h4>
            <ul className="space-y-4 text-sm text-charcoal/50">
              <li><a href="#" className="hover:text-primary transition-colors">Restaurants</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Experiences</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gift Cards</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-charcoal">Support</h4>
            <ul className="space-y-4 text-sm text-charcoal/50">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Restaurants</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h4 className="font-bold text-charcoal">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-beige flex items-center justify-center text-charcoal/60 hover:bg-primary hover:text-charcoal transition-all">
                <Heart size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-beige flex items-center justify-center text-charcoal/60 hover:bg-primary hover:text-charcoal transition-all">
                <User size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-sage/10 text-center">
        <p className="text-charcoal/30 text-xs font-medium tracking-wide">
          © 2024 Savora Dining Experiences. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Kochi');
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('city', selectedCity);
      
      if (error) throw error;
      setRestaurants(data || []);
    } catch (err: any) {
      console.error('Error fetching restaurants:', err);
      setError(err.message || 'Failed to connect to Supabase. Please check your environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('restaurants')
        .upsert(restaurantData, { onConflict: 'name' });

      if (error) throw error;
      alert(`Successfully seeded ${restaurantData.length} restaurants!`);
      fetchRestaurants();
    } catch (err: any) {
      console.error('Error seeding data:', err);
      alert('Failed to seed data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCity]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundAnimation />
      <Navbar activePage={page} setPage={setPage} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {page === 'home' && (
              <HomePage 
                setPage={setPage} 
                restaurants={restaurants} 
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
              />
            )}
            {page === 'restaurants' && (
              <RestaurantsPage 
                restaurants={restaurants} 
                loading={loading} 
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                onRetry={fetchRestaurants}
                onSeed={seedDemoData}
                error={error}
              />
            )}
            {page === 'reservations' && <ReservationsPage />}
            {page === 'profile' && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
