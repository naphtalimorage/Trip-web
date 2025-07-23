# Nyandarua Trip Website 🏔️

A beautiful, responsive website for organizing a friends group trip to Nyandarua County, Kenya. Built with React, TypeScript, Tailwind CSS, and Supabase.

![Nyandarua Trip Website](https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎯 Core Features
- **Landing Page** with hero section, countdown timer, and call-to-action
- **Trip Information** with details about Nyandarua County and destinations
- **Registration System** with form validation and database storage
- **Participant Management** with payment tracking (KSh 1,500 per person)
- **Donation System** for group contributions and supplies
- **Contact Information** with WhatsApp integration
- **Mobile-First Responsive Design**

### 💰 Payment Tracking
- Track payment status for each participant (Pending, Partial, Paid)
- Monitor total revenue collection vs expected amounts
- Visual payment status indicators with color-coded badges
- Financial dashboard with collection statistics

### 🎁 Donation Management
- Participants can add items they'll contribute for group consumption
- Public donation list showing all contributions
- Donation statistics and contributor tracking
- Easy-to-use donation form with validation

### 🎨 Design Features
- Modern gradient backgrounds and glass-morphism effects
- Smooth animations and micro-interactions
- Kenya-inspired color scheme (greens, earth tones)
- Mobile-optimized layouts with touch-friendly interfaces
- Custom scrollbar and focus states for accessibility

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database functionality)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd nyandarua-trip-website
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Connect to Supabase**
   - Click "Connect to Supabase" button in the top right
   - Follow the setup instructions to connect your database
   - The database schema will be automatically created

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Yup validation
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Ready for Netlify/Vercel

## 📱 Pages Overview

### 🏠 Home Page (`/`)
- Hero section with trip branding
- Live countdown timer to August 24, 2025
- Feature highlights with animated cards
- Call-to-action buttons for registration and WhatsApp

### ℹ️ About Page (`/about`)
- Information about Nyandarua County
- Places to visit during the trip
- Photo gallery placeholders
- Embedded Google Maps integration

### 📝 Registration Page (`/register`)
- Comprehensive registration form
- Real-time form validation
- Success/error state handling
- Mobile-optimized input fields

### 👥 Participants Page (`/participants`)
- List of all registered participants
- Payment status tracking and statistics
- Financial overview dashboard
- Responsive participant cards

### 🎁 Donations Page (`/donations`)
- Add and view group contributions
- Donation statistics and metrics
- Participant selection for donations
- Public donation list

### 📞 Contact Page (`/contact`)
- Organizer contact information
- WhatsApp group integration
- Trip details and FAQ section
- Meeting point information

## 🗄️ Database Schema

### Participants Table
```sql
- id (uuid, primary key)
- full_name (text, required)
- phone_number (text, required)
- email (text, unique, required)
- number_of_guests (integer, 1-10)
- payment_status (enum: pending, partial, paid)
- amount_paid (integer, 0-15000)
- created_at (timestamp)
- updated_at (timestamp)
```

### Donations Table
```sql
- id (uuid, primary key)
- participant_id (uuid, foreign key)
- participant_name (text, required)
- item_name (text, required)
- quantity (integer, required)
- description (text, optional)
- created_at (timestamp)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Trip Configuration
Update trip details in the following files:
- `src/pages/HomePage.tsx` - Trip date and details
- `src/components/CountdownTimer.tsx` - Countdown target date
- `src/pages/ContactPage.tsx` - WhatsApp number and contact info

## 🎨 Customization

### Colors and Branding
The website uses a Kenya-inspired color scheme. Customize in `tailwind.config.js`:
- Primary: Green/Emerald gradients
- Secondary: Blue/Cyan accents
- Success: Green tones
- Warning: Yellow/Amber
- Error: Red/Pink

### Animations
Custom animations are defined in `src/index.css`:
- `animate-fade-in-up` - Smooth entrance animations
- `animate-bounce-in` - Success state animations
- `animate-shake` - Error state animations

## 📱 Mobile Responsiveness

The website is built mobile-first with:
- Responsive breakpoints (sm, md, lg, xl)
- Touch-friendly button sizes (minimum 44px)
- Optimized layouts for all screen sizes
- Smooth scrolling and navigation

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Public read access for participants and donations
- Input validation and sanitization
- Secure form handling with error boundaries

## 🚀 Deployment

### Netlify Deployment
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel Deployment
1. Import project to Vercel
2. Configure build settings automatically detected
3. Add environment variables in project settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Kenya's natural beauty and landscapes
- **Icons**: Lucide React icon library
- **Images**: Pexels for stock photography
- **Maps**: Google Maps integration

## 📞 Support

For support or questions about the website:
- Email: info@nyandaruatrip.com
- WhatsApp: +254 7XX XXX XXX
- Create an issue in this repository

---

**Built with ❤️ for the Nyandarua Adventure - August 24, 2025**
