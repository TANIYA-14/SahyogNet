CREATE TABLE IF NOT EXISTS needs (
  id SERIAL PRIMARY KEY,
  zone VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,   -- 'food','medical','education','shelter'
  description TEXT NOT NULL,
  urgency INT NOT NULL,            -- 1=low, 2=medium, 3=high, 4=critical
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  status VARCHAR(20) DEFAULT 'open', -- 'open','assigned','resolved'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  skills TEXT NOT NULL,            -- comma-separated: "doctor, hindi, first aid"
  zone VARCHAR(50),
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  is_available BOOLEAN DEFAULT true,
  phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  need_id INT REFERENCES needs(id),
  volunteer_id INT REFERENCES volunteers(id),
  match_score INT,                 -- 0-100 from Gemini
  assigned_at TIMESTAMP DEFAULT NOW()
);

-- Seed 6 test volunteers (using INSERT ON CONFLICT or simple TRUNCATE to avoid duplicates on re-run)
TRUNCATE TABLE volunteers RESTART IDENTITY CASCADE;

INSERT INTO volunteers (name, skills, zone, lat, lng) VALUES
('Arnab Mukherjee', 'paramedic, first aid, hindi', 'Zone B', 23.2599, 87.0795),
('Sunita Das', 'nurse, medical, bengali', 'Zone B', 23.2611, 87.0812),
('Rahul Bose', 'first aid, driving, hindi', 'Zone C', 23.2445, 87.0654),
('Nandini Kar', 'doctor, surgery, english', 'Zone A', 23.2701, 87.0901),
('Tapas Roy', 'teaching, education, bengali', 'Zone D', 23.2388, 87.0721),
('Meera Singh', 'food distribution, logistics', 'Zone F', 23.2512, 87.0633);
