CREATE DATABASE IF NOT EXISTS `lifesave_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lifesave_db`;
SET FOREIGN_KEY_CHECKS=0;
CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  gender ENUM('male','female','other') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  profile_image VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  district VARCHAR(100) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  status ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_status(role,status),
  INDEX idx_users_location(city,district)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS donors (
  donor_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  blood_group ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  location VARCHAR(150) NOT NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  last_donation_date DATE NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_donors_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_donor_age CHECK(age BETWEEN 18 AND 65),
  CONSTRAINT chk_donor_weight CHECK(weight >= 50),
  INDEX idx_donors_search(blood_group,is_available,location),
  INDEX idx_donors_geo(latitude,longitude)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS blood_requests (
  request_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requester_user_id BIGINT UNSIGNED NOT NULL,
  blood_group ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  units TINYINT UNSIGNED NOT NULL DEFAULT 1,
  hospital VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  city VARCHAR(100) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  needed_at DATETIME NOT NULL,
  urgency ENUM('normal','urgent','critical') NOT NULL DEFAULT 'urgent',
  contact_phone VARCHAR(20) NOT NULL,
  notes TEXT NULL,
  status ENUM('open','accepted','completed','cancelled') NOT NULL DEFAULT 'open',
  accepted_donor_id BIGINT UNSIGNED NULL,
  accepted_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_requests_user FOREIGN KEY(requester_user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_requests_donor FOREIGN KEY(accepted_donor_id) REFERENCES donors(donor_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_requests_open(blood_group,status,urgency,needed_at),
  INDEX idx_requests_requester(requester_user_id,status)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS donations (
  donation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  donor_id BIGINT UNSIGNED NOT NULL,
  request_id BIGINT UNSIGNED NULL,
  donation_date DATE NOT NULL,
  units TINYINT UNSIGNED NOT NULL DEFAULT 1,
  hospital VARCHAR(150) NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_donations_donor FOREIGN KEY(donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_donations_request FOREIGN KEY(request_id) REFERENCES blood_requests(request_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_donations_donor_date(donor_id,donation_date),
  INDEX idx_donations_request(request_id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS notifications (
  notification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  type ENUM('info','request','success','warning') NOT NULL DEFAULT 'info',
  read_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notifications_user_read(user_id,read_at,created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS admins (
  admin_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL DEFAULT 'LifeSave Administration',
  permissions JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admins_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT IGNORE INTO users (user_id,name,email,phone,gender,password_hash,role,city,district,latitude,longitude,status) VALUES
(1,'LifeSave Administrator','admin@lifesave.local','01900000001','other','$2b$10$5g5yIdzyywvF8X78pTrm2ecbYSrLdzAYDz56/DVDQqL.yzrP4Yhcm','admin','Dhaka','Dhaka',23.8103000,90.4125000,'active'),
(2,'Abdullah Al Mamun','abdullah@lifesave.local','01712345689','male','$2b$10$7AdgDN2OkZNhb76R2LZhqeNzE186r6Buomdts9ZDv/5KIIPfO2YgS','user','Dhaka','Dhaka',23.7461000,90.3742000,'active'),
(3,'Nivedita Saha','nivedita@lifesave.local','01898765432','female','$2b$10$7AdgDN2OkZNhb76R2LZhqeNzE186r6Buomdts9ZDv/5KIIPfO2YgS','user','Dhaka','Dhaka',23.8103000,90.3612000,'active'),
(4,'Rahim Ahmed','rahim@lifesave.local','01611111111','male','$2b$10$hBGq7n8ZO5MocuZKJk/ncuxXh92spbooeBS8yn6AXVInQokHfH1XS','user','Dhaka','Dhaka',23.7808000,90.4071000,'active');
INSERT IGNORE INTO admins (admin_id,user_id,department,permissions) VALUES (1,1,'LifeSave Administration',JSON_OBJECT('all',true));
INSERT IGNORE INTO donors (donor_id,user_id,blood_group,age,weight,location,latitude,longitude,last_donation_date,is_available) VALUES
(1,2,'A+',24,68,'Dhanmondi, Dhaka',23.7461000,90.3742000,'2026-02-10',1),
(2,3,'O+',22,54,'Uttara, Dhaka',23.8103000,90.3612000,'2026-07-01',1),
(3,4,'B+',28,72,'Farmgate, Dhaka',23.7570000,90.3900000,'2026-03-12',1);
INSERT IGNORE INTO blood_requests (request_id,requester_user_id,blood_group,patient_name,units,hospital,location,city,latitude,longitude,needed_at,urgency,contact_phone,notes,status) VALUES
(1,4,'A+','Sample Emergency Patient',2,'Dhaka Medical College Hospital','Bakshibazar, Dhaka','Dhaka',23.7256000,90.3976000,'2026-08-15 10:00:00','urgent','01611111111','Seed request for demonstration','open');
SET FOREIGN_KEY_CHECKS=1;
