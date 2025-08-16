# Government Services Appointment Portal

## Team: Monochrome
**Product Name:** Arces

## Overview

A centralized, user-friendly portal that allows Sri Lankan citizens to book appointments for a wide range of government services from a single platform. This solution addresses the inefficiencies in the current system where citizens spend considerable time waiting in lines, dealing with delays, or facing uncertainty around service availability.

## Problem Statement

Accessing government services in Sri Lanka often requires citizens to:
- Spend considerable time waiting in lines
- Deal with delays and uncertainty around service availability
- Face unnecessary burden on their time and energy
- Navigate multiple systems for different services

## Solution

Our prototype streamlines the appointment booking process, reduces physical waiting times, and improves the overall citizen experience through a unified digital platform.

## Architecture

### Backend
- **Framework**: Spring Boot 3.5.4 with Java 17
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security with JWT authentication
- **API Documentation**: OpenAPI/Swagger

### Frontend (Citizen Portal)
- **Framework**: React 19 with Vite
- **UI Library**: Ant Design + Material UI
- **State Management**: React Query (TanStack)
- **Styling**: Tailwind CSS

### Admin Panel
- **Framework**: Next.js 15 with React 19
- **UI Library**: Ant Design
- **Authentication**: JWT with role-based access control
- **Charts**: Recharts for analytics

## Technology Stack

### Backend (Java Spring Boot)
```
- Spring Boot 3.5.4
- Java 17
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven build system
- OpenAPI documentation
```

### Frontend (React)
```
- React 19 with Vite
- Ant Design UI components
- Material UI date pickers
- Tailwind CSS for styling
- React Query for state management
- React Router for navigation
```

### Admin Panel (Next.js)
```
- Next.js 15
- React 19
- Ant Design components
- TypeScript support
- Recharts for analytics
- JWT authentication
```

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Database Configuration**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE monochrome;
   ```

3. **Configure application properties**
   ```properties
   # Backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/monochrome?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   
   # JWT Configuration
   app.jwt.secret=your-secret-key-here
   app.jwt.access-exp-min=15
   app.jwt.refresh-exp-days=7
   ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Update .env with backend URL
   VITE_BACKEND_BASE_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Admin Panel Setup

1. **Navigate to admin-panel directory**
   ```bash
   cd admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The admin panel will be available at `http://localhost:3001`

## Run with Docker

```bash
docker-compose up --build
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Default Users

The system comes with pre-seeded admin users:

### Super Admin
- **Username**: `superadmin`
- **Password**: `SuperAdmin@2025`
- **Access**: Super Admin Panel

### Regular Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Admin Dashboard

## Features Showcase

### Citizen Portal Features
- Service discovery and appointment booking
- Interactive calendar with availability
- QR code generation for appointments
- Document upload and management
- Appointment history tracking
- Real-time notifications

### Admin Portal Features
- Comprehensive appointment management
- Calendar view with department filtering
- Analytics dashboard with KPIs
- User management (Super Admin)
- Department performance metrics
- Optimization insights

### Technical Highlights
- Secure JWT authentication
- Role-based access control
- Responsive design for mobile/desktop
- Real-time data updates
- Comprehensive error handling
- Mock API for development


## Testing

### Backend Testing
```bash
cd Backend
mvn test
```

### Frontend Testing
```bash
cd Frontend
npm run test
```

### Admin Panel Testing
```bash
cd admin-panel
npm run test
```

## Deployment

### Production Build

**Backend:**
```bash
cd Backend
mvn clean package
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

**Admin Panel:**
```bash
cd admin-panel
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Architecture Diagrams

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Citizen App   │    │   Admin Panel   │    │  Super Admin    │
│   (React)       │    │   (Next.js)     │    │   Portal        │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │    Spring Boot API      │
                    │   (JWT Authentication)  │
                    └─────────────┬───────────┘
                                 │
                         ┌───────┴───────┐
                         │  MySQL DB     │
                         │  (JPA/Hibernate)│
                         └───────────────┘
```

### Database Schema
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │    │permissions  │    │refresh_tokens│
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ username    │    │ name        │    │ token       │
│ email       │    └─────────────┘    │ user_id (FK)│
│ password    │                       │ expires_at  │
│ name        │    ┌─────────────┐    └─────────────┘
│ department  │    │user_permissions│
│ role        │    ├─────────────┤
│ enabled     │    │ user_id (FK)│
│ created_at  │    │ permission_id│
└─────────────┘    └─────────────┘
```
