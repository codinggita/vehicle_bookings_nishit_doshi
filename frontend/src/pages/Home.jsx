import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import SEO from '../components/SEO'
import SchemaOrg from '../components/SchemaOrg'
import { logout } from '../store/slices/authSlice'

// MUI Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ShieldIcon from '@mui/icons-material/Shield'
import SpeedIcon from '@mui/icons-material/Speed'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import StarIcon from '@mui/icons-material/Star'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const FLEET_CATEGORIES = {
  electric: [
    { name: 'Model S Plaid', type: 'Electric Sedan', price: 149, range: '396 mi', power: '1,020 hp', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80', rating: 4.9 },
    { name: 'Taycan Turbo S', type: 'Electric Sport', price: 189, range: '222 mi', power: '750 hp', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', rating: 5.0 }
  ],
  suv: [
    { name: 'Range Rover Sport', type: 'Luxury SUV', price: 159, range: '500 mi', power: '523 hp', img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80', rating: 4.8 },
    { name: 'Escalade V-Series', type: 'Full-Size SUV', price: 199, range: '420 mi', power: '682 hp', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', rating: 4.9 }
  ],
  luxury: [
    { name: '911 Carrera GTS', type: 'Sports Coupe', price: 219, range: '450 mi', power: '473 hp', img: 'https://images.unsplash.com/photo-1611245801314-e0c5df922e23?auto=format&fit=crop&w=600&q=80', rating: 5.0 },
    { name: 'AMG GT 63 S', type: 'Luxury Coupe', price: 249, range: '480 mi', power: '630 hp', img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80', rating: 4.9 }
  ]
}

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('electric')
  const [faqOpen, setFaqOpen] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    setMobileMenuOpen(false)
  }

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <SEO 
        title="Premium Car Rental & Vehicle Booking" 
        description="Drive the future with DriveFlow. Rent premium SUVs, sports cars, and luxury electric vehicles with absolute ease and transparent pricing." 
      />
      <SchemaOrg 
        name="DriveFlow Vehicle Bookings" 
        description="Premium car rental and vehicle booking management dashboard." 
      />

      {/* Global Neon Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#090d16]/75 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
              <DirectionsCarIcon className="text-white" fontSize="medium" />
            </div>
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              DriveFlow
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#fleet" className="hover:text-white transition-colors duration-200">Fleet</a>
            <a href="#steps" className="hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors duration-200">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <RouterLink 
                  to="/dashboard" 
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Go to Dashboard
                </RouterLink>
                <button 
                  onClick={handleLogout} 
                  className="rounded-xl border border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <RouterLink 
                  to="/login" 
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </RouterLink>
                <RouterLink 
                  to="/register" 
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Get Started
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="flex md:hidden text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#090d16] px-6 py-6 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Features</a>
              <a href="#fleet" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Fleet</a>
              <a href="#steps" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">How It Works</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Testimonials</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">FAQ</a>
              
              <div className="h-px bg-slate-800 my-2" />
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <RouterLink 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-full text-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white"
                  >
                    Go to Dashboard
                  </RouterLink>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-center rounded-xl border border-slate-800 py-3 text-sm font-semibold text-slate-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <RouterLink 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-full text-center rounded-xl border border-slate-800 py-3 text-sm font-semibold text-slate-300"
                  >
                    Sign In
                  </RouterLink>
                  <RouterLink 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-full text-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white"
                  >
                    Get Started
                  </RouterLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 tracking-wide uppercase">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Premium Vehicle Rentals
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
                Rent the Perfect Ride <br />
                <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  For Any Journey.
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Unlock immediate access to a fleet of pristine, high-performance electric cars, luxury SUVs, and executive sedans. 
                Effortless online scheduling, verified driver support, and zero hidden charges.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                {isAuthenticated ? (
                  <RouterLink 
                    to="/dashboard" 
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 hover:opacity-95 hover:shadow-indigo-500/30 transition-all duration-200"
                  >
                    Access Booking Hub
                    <KeyboardArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
                  </RouterLink>
                ) : (
                  <>
                    <RouterLink 
                      to="/register" 
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/20 hover:opacity-95 hover:shadow-indigo-500/30 transition-all duration-200"
                    >
                      Browse & Book Now
                      <KeyboardArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
                    </RouterLink>
                    <a 
                      href="#fleet" 
                      className="inline-flex items-center justify-center rounded-xl border border-slate-800 px-8 py-4 text-base font-semibold text-slate-300 hover:bg-slate-900/60 hover:text-white hover:border-slate-700 transition-all duration-200"
                    >
                      View Our Fleet
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Hero Graphic Content */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-[100px] -z-10 animate-pulse" />
              <div className="relative border border-slate-800/80 bg-slate-900/30 p-4 rounded-3xl backdrop-blur-md shadow-2xl hover:border-indigo-500/30 transition-colors duration-500 group">
                <img 
                  src="/landing_car_hero.png" 
                  alt="Premium Luxury Electric SUV" 
                  className="rounded-2xl max-w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Floating Glass Overlay Card */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-4 border border-slate-800/80 bg-[#0c1221]/90 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                    <SpeedIcon />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fast Booking</h4>
                    <p className="text-xs text-slate-400">Reserved in under 2 minutes</p>
                  </div>
                </div>

                {/* Floating Glass Overlay Card 2 */}
                <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-4 border border-slate-800/80 bg-[#0c1221]/90 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <ShieldIcon />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fully Insured</h4>
                    <p className="text-xs text-slate-400">Complete roadside assistance</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800/60 bg-[#070b13] py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">10k+</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Happy Drivers</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">500+</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Premium Vehicles</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">50+</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Cities Covered</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">4.95</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Average Star Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Engineered for Excellence</h2>
            <h3 className="text-3xl md:text-5xl font-bold leading-tight">
              A Complete Vehicle Booking <br className="hidden sm:inline" />
              Management System
            </h3>
            <p className="text-slate-400 leading-relaxed font-light">
              Experience the benefits of a robust platform built for both drivers seeking rentals and operators managing large fleets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <SpeedIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Intelligent Filtering</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Find exactly what you need. Filter our large catalog by range, cost per day, fuel types, manufacturer, or rating.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Instant Confirmations</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                No waiting game. Once you select a vehicle, confirm your booking with one click and get instant access instructions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <LocalAtmIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Flexible Billing</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Digital wallets, card integrations, and detailed billing invoices are generated instantly for direct transparency.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <StarIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Rating Ecosystem</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Drive with confidence. Check community-sourced reviews and ratings on vehicles to ensure full satisfaction.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <AnalyticsIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Admin Control Center</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Full-featured dashboard metrics including revenue analysis, usage rate, booking tracking, and customer management.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <DirectionsCarIcon />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Optimized Dispatch</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Real-time tracking of vehicle statuses (Available, Booked, In-Maintenance) to prevent scheduling conflicts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section id="fleet" className="border-t border-slate-800/60 bg-[#070b13] py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Curated Catalog</h2>
              <h3 className="text-3xl md:text-5xl font-bold">Explore Our Premium Fleet</h3>
            </div>
            
            {/* Dynamic Tabs */}
            <div className="flex bg-slate-950 border border-slate-800/80 p-1.5 rounded-xl self-start md:self-end">
              {Object.keys(FLEET_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all duration-200 ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35' : 'text-slate-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FLEET_CATEGORIES[activeCategory].map((car, index) => (
              <div key={index} className="group border border-slate-800/80 bg-slate-900/10 rounded-2xl overflow-hidden hover:border-indigo-500/25 transition-all duration-300">
                <div className="relative overflow-hidden h-64 sm:h-72">
                  <img 
                    src={car.img} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 bg-[#090d16]/90 border border-slate-800 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
                    <StarIcon fontSize="inherit" />
                    {car.rating.toFixed(1)}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{car.name}</h4>
                      <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">{car.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyan-400">${car.price}</p>
                      <p className="text-xs text-slate-400 mt-0.5">per day</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800/60 pt-6">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Est. Range</p>
                      <p className="text-sm font-semibold text-slate-300 mt-0.5">{car.range}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Peak Power</p>
                      <p className="text-sm font-semibold text-slate-300 mt-0.5">{car.power}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                      className="w-full text-center rounded-xl bg-slate-950 border border-slate-800/80 group-hover:border-indigo-500/35 group-hover:bg-indigo-600 group-hover:text-white py-3.5 text-sm font-bold text-slate-300 transition-all duration-300"
                    >
                      Book Ride
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works (Steps) Section */}
      <section id="steps" className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-24">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Seamless Setup</h2>
            <h3 className="text-3xl md:text-5xl font-bold">How It Works</h3>
            <p className="text-slate-400 font-light">
              Get behind the wheel in three simple, fully digital steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Horizontal Line Connector */}
            <div className="absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 hidden md:block -z-10" />

            {/* Step 1 */}
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 shadow-xl group hover:border-indigo-500/30 transition-colors">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">1</span>
              </div>
              <h4 className="text-xl font-bold">Create Account</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs mx-auto">
                Sign up in seconds, upload your verification documents, and get approved almost instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-xl group hover:border-cyan-500/30 transition-colors">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">2</span>
              </div>
              <h4 className="text-xl font-bold">Select & Customize</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs mx-auto">
                Choose from our high-end electric, SUV, or luxury sports classes. Adjust dates and select coverage plans.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 shadow-xl group hover:border-indigo-500/30 transition-colors">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">3</span>
              </div>
              <h4 className="text-xl font-bold">Drive Away</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs mx-auto">
                Unlock the vehicle digitally or pick it up from a designated local station. Enjoy a seamless, premium ride!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="border-t border-slate-800/60 bg-[#070b13] py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Client Testimonials</h2>
            <h3 className="text-3xl md:text-5xl font-bold">What Our Drivers Say</h3>
            <p className="text-slate-400 font-light">
              Don't just take our word for it. Here is the feedback from our frequent drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="border border-slate-800/80 bg-slate-900/10 p-8 rounded-2xl space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed font-light">
                "The fleet quality here is on another level. I booked a Tesla Model S for a business trip, and it was sparkling clean, fully charged, and drove like a dream. The digital keys worked instantly."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">JD</div>
                <div>
                  <h5 className="text-sm font-semibold text-white">John Doe</h5>
                  <p className="text-xs text-slate-500">Corporate Member</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-slate-800/80 bg-slate-900/10 p-8 rounded-2xl space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed font-light">
                "Customer service was exceptional. I had to extend my rental duration for an SUV last minute, and I completed it through the portal settings in 30 seconds. No phone queues, no fuss."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">SR</div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Sarah Reynolds</h5>
                  <p className="text-xs text-slate-500">Frequent Traveler</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-slate-800/80 bg-slate-900/10 p-8 rounded-2xl space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} fontSize="small" />)}
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed font-light">
                "Finding high-performance sports models for rent is usually a massive pain with loads of paperwork. DriveFlow makes it simple, transparent, and extremely fast. Fully recommended."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400">MK</div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Marcus K.</h5>
                  <p className="text-xs text-slate-500">Sports Car Enthusiast</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Common Questions</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What do I need to rent a vehicle?', a: 'You need a valid driver\'s license (min. 2 years active driving history), a government-issued photo ID, and a digital payment method. Verification takes under 15 minutes.' },
              { q: 'Are charging costs included for electric vehicles?', a: 'Yes! Electric vehicles come with free access to our partner charging networks. You will find a RFID charging card in the glove compartment.' },
              { q: 'What is the cancellation policy?', a: 'Cancel for free up to 24 hours before your booking start time. Cancellations within 24 hours incur a small processing fee of $25.' },
              { q: 'Is roadside assistance included?', a: 'Absolutely. Every rental includes 24/7 comprehensive roadside coverage, covering flat tires, battery jumps, towing, and lockout services.' }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800/80 bg-slate-900/10 rounded-xl overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-100 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <span className={`text-2xl transform transition-transform duration-300 ${faqOpen === idx ? 'rotate-45 text-cyan-400' : 'text-slate-500'}`}>+</span>
                </button>
                {faqOpen === idx && (
                  <div className="p-6 pt-0 text-slate-400 border-t border-slate-800/40 text-sm leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto max-w-5xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-xl p-12 md:p-20 rounded-3xl text-center space-y-8 relative">
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-none">
            Ready to Get Behind the Wheel?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            Create an account today and enjoy a premium driving experience. Discover vehicles near you, unlock booking discounts, and manage rentals seamlessly.
          </p>

          <div className="flex justify-center pt-4">
            <RouterLink 
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all duration-200"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign Up and Book"}
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#060a10] py-16 px-6">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-slate-400">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <DirectionsCarIcon fontSize="small" />
              </div>
              <span className="text-white font-bold text-lg">DriveFlow</span>
            </div>
            <p className="font-light leading-relaxed">
              Premium rental experience with full-featured management utility dashboard.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-white font-semibold">Platform</h5>
            <ul className="space-y-2 font-light">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Fleet Showroom</a></li>
              <li><a href="#steps" className="hover:text-white transition-colors">How it Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h5 className="text-white font-semibold">Resources</h5>
            <ul className="space-y-2 font-light">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
              <li><RouterLink to="/login" className="hover:text-white transition-colors">Member Sign In</RouterLink></li>
              <li><RouterLink to="/register" className="hover:text-white transition-colors">Join DriveFlow</RouterLink></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h5 className="text-white font-semibold">Contact</h5>
            <p className="font-light">support@driveflow.com</p>
            <p className="font-light">+1 (800) 555-0199</p>
            <p className="font-light text-slate-500">© 2026 DriveFlow Inc. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  )
}
