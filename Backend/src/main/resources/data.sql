-- Seed permissions
INSERT IGNORE INTO permissions (id, name) VALUES
  (1, 'appointments'),
  (2, 'services'),
  (3, 'users'),
  (4, 'analytics'),
  (5, 'settings'),
  (6, 'all');

-- Seed users with BCrypt passwords
-- superadmin / SuperAdmin@2025
INSERT IGNORE INTO users (id, username, email, password, name, department, role, enabled, createdAt) VALUES
  (1, 'superadmin', 'superadmin@gov.lk', '$2a$10$J6qS4gL4f5v7K3yJQhJgAuH0qH8gZp6cYx2qHcS1eYd7Pj3nq8m2a', 'System Administrator', 'Administration', 'SUPERADMIN', true, NOW());
-- admin / admin123
INSERT IGNORE INTO users (id, username, email, password, name, department, role, enabled, createdAt) VALUES
  (2, 'admin', 'admin@gov.lk', '$2a$10$7QYpG2o6eH8iK3lM9nB2XeCqR5sT1uVwXyZ3nQpLr8sJkU1vWb5y2', 'System Administrator', 'Land Registry Department', 'ADMIN', true, NOW());

-- Assign permissions
-- superadmin gets 'all'
INSERT IGNORE INTO user_permissions (user_id, permission_id) VALUES (1, 6);
-- admin gets listed permissions
INSERT IGNORE INTO user_permissions (user_id, permission_id) VALUES
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5);
