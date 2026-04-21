CREATE DATABASE pf_system;
USE pf_system;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'employer', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pf_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  pf_number VARCHAR(50) UNIQUE NOT NULL,
  basic_salary DECIMAL(10,2),
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contributions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pf_account_id INT NOT NULL,
  month VARCHAR(20),
  year INT,
  employee_share DECIMAL(10,2),
  employer_share DECIMAL(10,2),
  interest DECIMAL(10,2),
  FOREIGN KEY (pf_account_id) REFERENCES pf_accounts(id)
);

CREATE TABLE claims (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pf_account_id INT NOT NULL,
  claim_type ENUM('withdrawal','advance','transfer'),
  amount DECIMAL(10,2),
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  reason TEXT,
  applied_date DATE,
  FOREIGN KEY (pf_account_id) REFERENCES pf_accounts(id)
);

CREATE TABLE nominations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pf_account_id INT NOT NULL,
  nominee_name VARCHAR(100),
  relationship VARCHAR(50),
  share_percentage INT,
  FOREIGN KEY (pf_account_id) REFERENCES pf_accounts(id)
);

CREATE TABLE kyc (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  aadhaar_number VARCHAR(20),
  pan_number VARCHAR(20),
  bank_account VARCHAR(30),
  ifsc_code VARCHAR(15),
  status ENUM('pending','verified') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
