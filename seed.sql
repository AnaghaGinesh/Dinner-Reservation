-- SQL Script to seed Indian restaurants in Supabase
-- Run this in your Supabase SQL Editor

-- 1. Ensure the table exists (if not already created)
-- CREATE TABLE IF NOT EXISTS restaurants (
--   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
--   name text NOT NULL,
--   description text,
--   cuisine_type text,
--   price_range text,
--   rating numeric,
--   address text,
--   city text,
--   image_url text,
--   created_at timestamp with time zone DEFAULT now()
-- );

-- 2. Seed Data for Kochi
INSERT INTO restaurants (name, description, cuisine_type, price_range, rating, address, city, image_url)
VALUES 
('The Gilded Ivy', 'Fine dining with a colonial touch in the heart of Fort Kochi.', 'Continental', '$$$', 4.8, 'Fort Kochi, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'),
('Malabar Junction', 'Authentic Malabar flavors served in a heritage setting.', 'Kerala', '$$', 4.6, 'Willingdon Island, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=800'),
('Paragon Restaurant', 'Legendary biryani and seafood that Kochi loves.', 'Malabar', '$$', 4.7, 'Lulu Mall, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'),
('Rice Boat', 'Dine on a traditional kettuvallam with exquisite seafood.', 'Seafood', '$$$$', 4.9, 'Taj Malabar, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'),
('Kashi Art Cafe', 'A serene space for art lovers and coffee enthusiasts.', 'Cafe', '$', 4.5, 'Burgher St, Fort Kochi', 'Kochi', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800'),
('Ginger House', 'Museum restaurant with stunning waterfront views.', 'Indian', '$$$', 4.4, 'Jew Town, Mattancherry', 'Kochi', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'),
('Oceanos', 'Fresh catch prepared with traditional Portuguese influences.', 'Portuguese-Kerala', '$$', 4.3, 'Elphinstone Rd, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'),
('Fort House Restaurant', 'Romantic waterfront dining with authentic Kerala cuisine.', 'Kerala', '$$$', 4.6, 'Calvathy Rd, Fort Kochi', 'Kochi', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'),
('Dhe Puttu', 'Modern twist on the traditional Kerala Puttu.', 'Kerala Fusion', '$', 4.5, 'Edappally, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800'),
('Mosaic', 'Global flavors in a sophisticated contemporary setting.', 'Multi-cuisine', '$$$', 4.4, 'Crowne Plaza, Kochi', 'Kochi', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800');

-- 3. Seed Data for Mumbai
INSERT INTO restaurants (name, description, cuisine_type, price_range, rating, address, city, image_url)
VALUES 
('The Table', 'Farm-to-table dining in the heart of Colaba.', 'Global', '$$$$', 4.8, 'Colaba, Mumbai', 'Mumbai', 'https://images.unsplash.com/photo-1550966842-2849a2208869?auto=format&fit=crop&q=80&w=800'),
('Trishna', 'World-famous seafood destination in South Mumbai.', 'Seafood', '$$$', 4.7, 'Fort, Mumbai', 'Mumbai', 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800'),
('Britannia & Co.', 'Iconic Parsi cafe famous for Berry Pulav.', 'Parsi', '$$', 4.6, 'Ballard Estate, Mumbai', 'Mumbai', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'),
('Gajalee', 'Authentic coastal flavors from the Konkan region.', 'Coastal', '$$$', 4.5, 'Vile Parle, Mumbai', 'Mumbai', 'https://images.unsplash.com/photo-1512058560550-42749359a777?auto=format&fit=crop&q=80&w=800'),
('Leopold Cafe', 'Historic cafe and bar on Colaba Causeway.', 'Multi-cuisine', '$$', 4.3, 'Colaba Causeway, Mumbai', 'Mumbai', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800');

-- 4. Seed Data for Delhi
INSERT INTO restaurants (name, description, cuisine_type, price_range, rating, address, city, image_url)
VALUES 
('Indian Accent', 'Innovative Indian cuisine at its finest.', 'Modern Indian', '$$$$', 4.9, 'Lodhi Rd, Delhi', 'Delhi', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'),
('Bukhara', 'Legendary North Indian flavors and dal bukhara.', 'North Indian', '$$$$', 4.8, 'ITC Maurya, Delhi', 'Delhi', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800'),
('Karim''s', 'Historic Mughlai cuisine near Jama Masjid.', 'Mughlai', '$$', 4.5, 'Old Delhi, Delhi', 'Delhi', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800');

-- Note: You can add more restaurants for other cities following this pattern.
-- To reach 40-50 per city, you can repeat these with slight variations or use an LLM to generate more unique names and descriptions.
