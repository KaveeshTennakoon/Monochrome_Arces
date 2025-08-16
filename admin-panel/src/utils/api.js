// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Check if we should use mock API
const USE_MOCK_API = process.env.NEXT_PUBLIC_BACKEND_ENABLED !== 'true';

// Mock API functions (embedded in this file for simplicity)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockAPI = {
  auth: {
    login: async (credentials) => {
      await delay(1000);
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        return {
          success: true,
          data: {
            user: {
              id: 'admin001',
              name: 'System Administrator',
              username: 'admin',
              email: 'admin@gov.lk',
              role: 'admin',
              department: 'Land Registry Department',
              permissions: ['appointments', 'services', 'users', 'analytics', 'settings']
            },
            token: 'mock-jwt-token',
            expiresIn: 3600
          }
        };
      }
      throw new Error('Invalid credentials');
    },
    
    logout: async () => {
      await delay(300);
      return { success: true };
    },
    
    verifyToken: async () => {
      await delay(200);
      return { success: true };
    },
    
    refreshToken: async () => {
      await delay(500);
      return { success: true, data: { token: 'new-mock-token' } };
    }
  },

  appointments: {
    getAppointments: async (filters = {}) => {
      await delay(800);
      
      const mockAppointments = [
        {
          id: "1",
          appointmentId: "APT-LR-2025-001",
          citizenName: "Kamal Perera",
          citizenEmail: "kamal.perera@email.com",
          citizenPhone: "+94 71 234 5678",
          citizenNIC: "875672341V",
          department: "Land Registry",
          departmentCode: "LR",
          serviceType: "Land Title Registration",
          serviceCategory: "Registration",
          appointmentDate: "2025-08-15",
          appointmentTime: "10:00 AM",
          status: "confirmed",
          officer: "Ms. Nimalka Fernando",
          officerID: "LR001",
          priority: "high",
          estimatedDuration: "60 minutes",
          fee: "LKR 5,000",
          documents: ["Title Deed", "Survey Plan", "NIC Copy"],
          notes: "First-time registration. All documents verified.",
          serviceDetails: {
            referenceId: "LAND-COL-2024-456",
            type: "land",
            location: "Colombo 07, Cinnamon Gardens",
            landType: "Residential",
            extent: "15 Perches"
          }
        },
        {
          id: "2",
          appointmentId: "APT-DMT-2025-002",
          citizenName: "Ruwan Silva",
          citizenEmail: "ruwan.silva@email.com",
          citizenPhone: "+94 77 987 6543",
          citizenNIC: "923456789V",
          department: "Department of Motor Traffic",
          departmentCode: "DMT",
          serviceType: "Driving License Renewal",
          serviceCategory: "License Services",
          appointmentDate: "2025-08-16",
          appointmentTime: "02:30 PM",
          status: "pending",
          officer: "Mr. Asanka Wijayaratne",
          officerID: "DMT015",
          priority: "medium",
          estimatedDuration: "30 minutes",
          fee: "LKR 2,500",
          documents: ["Current License", "Medical Certificate", "NIC Copy"],
          notes: "License expires next month. Medical test completed.",
          serviceDetails: {
            referenceId: "DL-B7834521",
            type: "license",
            licenseClass: "B1 (Light Vehicle)",
            expiryDate: "2025-09-15"
          }
        }
      ];
      
      // Apply basic filtering
      let filteredAppointments = [...mockAppointments];
      
      if (filters.search) {
        filteredAppointments = filteredAppointments.filter(apt =>
          apt.citizenName.toLowerCase().includes(filters.search.toLowerCase()) ||
          apt.appointmentId.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === filters.status);
      }
      
      if (filters.department && filters.department !== 'all') {
        filteredAppointments = filteredAppointments.filter(apt => apt.departmentCode === filters.department);
      }
      
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: filteredAppointments.slice(startIndex, endIndex),
        meta: {
          total: filteredAppointments.length,
          page,
          limit,
          totalPages: Math.ceil(filteredAppointments.length / limit)
        }
      };
    },

    getAppointment: async (id) => {
      await delay(500);
      // Return a mock appointment
      return {
        data: {
          id: "1",
          appointmentId: "APT-LR-2025-001",
          citizenName: "Kamal Perera",
          citizenEmail: "kamal.perera@email.com",
          citizenPhone: "+94 71 234 5678",
          citizenNIC: "875672341V",
          department: "Land Registry",
          departmentCode: "LR",
          serviceType: "Land Title Registration",
          serviceCategory: "Registration",
          appointmentDate: "2025-08-15",
          appointmentTime: "10:00 AM",
          status: "confirmed",
          officer: "Ms. Nimalka Fernando",
          officerID: "LR001",
          priority: "high",
          estimatedDuration: "60 minutes",
          fee: "LKR 5,000",
          documents: ["Title Deed", "Survey Plan", "NIC Copy"],
          notes: "First-time registration. All documents verified.",
          serviceDetails: {
            referenceId: "LAND-COL-2024-456",
            type: "land",
            location: "Colombo 07, Cinnamon Gardens",
            landType: "Residential",
            extent: "15 Perches"
          }
        }
      };
    },

    updateStatus: async (id, status, reason = null) => {
      await delay(500);
      return { data: { id, status, reason } };
    },

    reschedule: async (id, rescheduleData) => {
      await delay(700);
      return { data: { id, ...rescheduleData } };
    },

    getCalendarAppointments: async (month, year, filters = {}) => {
      await delay(600);
      
      const calendarAppointments = [
        {
          id: "1",
          appointmentId: "APT-LR-2025-001",
          citizenName: "Kamal Perera",
          department: "Land Registry",
          departmentCode: "LR",
          serviceType: "Land Title Registration",
          date: "2025-08-15",
          time: "10:00 AM",
          title: "Land Title Registration",
          status: "confirmed",
          fee: "LKR 5,000",
          color: "#1890ff"
        }
      ];
      
      return { data: calendarAppointments };
    }
  },

  departments: {
    getDepartments: async () => {
      await delay(400);
      return {
        data: [
          { code: "LR", name: "Land Registry Department", color: "#52c41a" },
          { code: "DMT", name: "Department of Motor Traffic", color: "#1890ff" },
          { code: "DIE", name: "Department of Immigration & Emigration", color: "#722ed1" },
          { code: "MUN", name: "Municipal Council", color: "#faad14" },
          { code: "MOH", name: "Ministry of Health", color: "#f5222d" },
          { code: "MOE", name: "Ministry of Education", color: "#fa8c16" }
        ]
      };
    }
  },

  analytics: {
    getKPIs: async (filters = {}) => {
      await delay(600);
      return {
        data: {
          totalAppointments: 1247,
          totalAppointmentsChange: 12.5,
          completedAppointments: 1089,
          completedRate: 87.3,
          averageWaitTime: 18.5,
          waitTimeChange: -8.2,
          citizenSatisfaction: 4.2,
          satisfactionChange: 5.8,
          totalRevenue: "LKR 2,847,500",
          revenueChange: 15.3
        }
      };
    },

    getDepartmentPerformance: async (dateRange = null) => {
      await delay(700);
      return {
        data: [
          {
            departmentCode: "LR",
            departmentName: "Land Registry",
            totalAppointments: 342,
            completionRate: 87.1,
            avgProcessingTime: 45,
            revenue: "LKR 856,000",
            satisfaction: 4.3,
            trend: "up"
          },
          {
            departmentCode: "DMT",
            departmentName: "Motor Traffic",
            totalAppointments: 289,
            completionRate: 92.4,
            avgProcessingTime: 28,
            revenue: "LKR 423,500",
            satisfaction: 4.1,
            trend: "up"
          }
        ]
      };
    },

    getOptimizationInsights: async () => {
      await delay(600);
      return {
        data: [
          {
            type: "peak_time",
            title: "Peak Hour Optimization",
            description: "Consider adding more staff during 10-11 AM and 2-3 PM slots",
            impact: "Could reduce wait times by 23%",
            priority: "high"
          },
          {
            type: "department_load",
            title: "Department Load Balancing",
            description: "Land Registry showing high volume - consider additional officers",
            impact: "Could improve completion rate by 5%",
            priority: "medium"
          }
        ]
      };
    },

    getAppointmentTrends: async () => {
      await delay(500);
      return { data: [] };
    },

    getPeakHours: async () => {
      await delay(400);
      return { data: [{ time: '10:00 - 11:00 AM', appointments: 89 }] };
    }
  },

  users: {
    getUsers: async () => {
      await delay(600);
      return {
        data: [
          {
            id: "1",
            name: "John Administrator",
            username: "admin1",
            email: "john.admin@gov.lk",
            phone: "+94 71 123 4567",
            role: "admin",
            department: "Land Registry Department",
            permissions: ["appointments", "services", "analytics"],
            status: "active",
            lastLogin: "2025-08-14T09:30:00Z"
          }
        ]
      };
    },

    createUser: async (userData) => {
      await delay(1000);
      return {
        data: {
          id: Date.now().toString(),
          ...userData,
          status: 'active',
          lastLogin: null
        }
      };
    },

    updateUser: async (id, userData) => {
      await delay(800);
      return { data: { id, ...userData } };
    },

    deleteUser: async (id) => {
      await delay(600);
      return { success: true };
    },

    updateUserStatus: async (id, status) => {
      await delay(500);
      return { data: { id, status } };
    },

    getUserStats: async () => {
      await delay(400);
      return {
        data: {
          totalUsers: 5,
          activeUsers: 4,
          departmentCount: 6
        }
      };
    }
  }
};

// API utility function
const apiCall = async (endpoint, options = {}) => {
  // If using mock API, don't make real network calls
  if (USE_MOCK_API) {
    throw new Error('Mock API should be used instead of network calls');
  }

  const token = localStorage.getItem('adminToken') || localStorage.getItem('superAdminToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION ENDPOINTS ====================

export const authAPI = {
  login: async (credentials) => {
    if (USE_MOCK_API) {
      return await mockAPI.auth.login(credentials);
    }
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.auth.logout();
    }
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  verifyToken: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.auth.verifyToken();
    }
    return apiCall('/auth/verify');
  },

  refreshToken: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.auth.refreshToken();
    }
    return apiCall('/auth/refresh', {
      method: 'POST',
    });
  },
};

// ==================== APPOINTMENTS ENDPOINTS ====================

export const appointmentsAPI = {
  getAppointments: async (filters = {}) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.getAppointments(filters);
    }
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });
    
    return apiCall(`/appointments?${params.toString()}`);
  },

  getAppointment: async (id) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.getAppointment(id);
    }
    return apiCall(`/appointments/${id}`);
  },

  createAppointment: async (appointmentData) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.createAppointment(appointmentData);
    }
    return apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  updateAppointment: async (id, appointmentData) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.updateAppointment(id, appointmentData);
    }
    return apiCall(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },

  deleteAppointment: async (id) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.deleteAppointment(id);
    }
    return apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status, reason = null) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.updateStatus(id, status, reason);
    }
    return apiCall(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  reschedule: async (id, rescheduleData) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.reschedule(id, rescheduleData);
    }
    return apiCall(`/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(rescheduleData),
    });
  },

  getAppointmentsByDateRange: async (startDate, endDate) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.getAppointments({ startDate, endDate });
    }
    return apiCall(`/appointments/range?start=${startDate}&end=${endDate}`);
  },

  getCalendarAppointments: async (month, year, filters = {}) => {
    if (USE_MOCK_API) {
      return await mockAPI.appointments.getCalendarAppointments(month, year, filters);
    }
    
    const params = new URLSearchParams({
      month,
      year,
      ...filters,
    });
    
    return apiCall(`/appointments/calendar?${params.toString()}`);
  },
};

// ==================== DEPARTMENTS ENDPOINTS ====================

export const departmentsAPI = {
  getDepartments: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.departments.getDepartments();
    }
    return apiCall('/departments');
  },

  getDepartment: async (code) => {
    if (USE_MOCK_API) {
      return await mockAPI.departments.getDepartment(code);
    }
    return apiCall(`/departments/${code}`);
  },

  getDepartmentServices: async (departmentCode) => {
    if (USE_MOCK_API) {
      return { data: [] };
    }
    return apiCall(`/departments/${departmentCode}/services`);
  },

  getDepartmentOfficers: async (departmentCode) => {
    if (USE_MOCK_API) {
      return { data: [] };
    }
    return apiCall(`/departments/${departmentCode}/officers`);
  },

  getDepartmentStats: async (departmentCode, dateRange = null) => {
    if (USE_MOCK_API) {
      return { data: {} };
    }
    const params = dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : '';
    return apiCall(`/departments/${departmentCode}/stats${params}`);
  },
};

// ==================== ANALYTICS ENDPOINTS ====================

export const analyticsAPI = {
  getKPIs: async (filters = {}) => {
    if (USE_MOCK_API) {
      return await mockAPI.analytics.getKPIs(filters);
    }
    const params = new URLSearchParams(filters);
    return apiCall(`/analytics/kpis?${params.toString()}`);
  },

  getDepartmentPerformance: async (dateRange = null) => {
    if (USE_MOCK_API) {
      return await mockAPI.analytics.getDepartmentPerformance(dateRange);
    }
    const params = dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : '';
    return apiCall(`/analytics/department-performance${params}`);
  },

  getAppointmentTrends: async (period = '6months') => {
    if (USE_MOCK_API) {
      return await mockAPI.analytics.getAppointmentTrends();
    }
    return apiCall(`/analytics/trends?period=${period}`);
  },

  getPeakHours: async (departmentCode = null) => {
    if (USE_MOCK_API) {
      return await mockAPI.analytics.getPeakHours();
    }
    const params = departmentCode ? `?department=${departmentCode}` : '';
    return apiCall(`/analytics/peak-hours${params}`);
  },

  getOptimizationInsights: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.analytics.getOptimizationInsights();
    }
    return apiCall('/analytics/optimization-insights');
  },

  getRevenueAnalytics: async (dateRange = null) => {
    if (USE_MOCK_API) {
      return { data: {} };
    }
    const params = dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : '';
    return apiCall(`/analytics/revenue${params}`);
  },

  getSatisfactionMetrics: async (departmentCode = null) => {
    if (USE_MOCK_API) {
      return { data: {} };
    }
    const params = departmentCode ? `?department=${departmentCode}` : '';
    return apiCall(`/analytics/satisfaction${params}`);
  },

  getNoShowRates: async () => {
    if (USE_MOCK_API) {
      return { data: [] };
    }
    return apiCall('/analytics/no-show-rates');
  },
};

// ==================== USERS MANAGEMENT ENDPOINTS ====================

export const usersAPI = {
  getUsers: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.users.getUsers();
    }
    return apiCall('/users');
  },

  getUser: async (id) => {
    if (USE_MOCK_API) {
      return { data: { id, name: 'Mock User' } };
    }
    return apiCall(`/users/${id}`);
  },

  createUser: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAPI.users.createUser(userData);
    }
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    if (USE_MOCK_API) {
      return await mockAPI.users.updateUser(id, userData);
    }
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    if (USE_MOCK_API) {
      return await mockAPI.users.deleteUser(id);
    }
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  updateUserStatus: async (id, status) => {
    if (USE_MOCK_API) {
      return await mockAPI.users.updateUserStatus(id, status);
    }
    return apiCall(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  resetPassword: async (id, newPassword) => {
    if (USE_MOCK_API) {
      return { success: true };
    }
    return apiCall(`/users/${id}/reset-password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword }),
    });
  },

  getUserStats: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.users.getUserStats();
    }
    return apiCall('/users/stats');
  },
};

// ==================== ERROR HANDLING ====================

export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Handle specific error cases
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
    return;
  }
  
  if (error.message.includes('403') || error.message.includes('Forbidden')) {
    throw new Error('You do not have permission to perform this action');
  }
  
  if (error.message.includes('404') || error.message.includes('Not Found')) {
    throw new Error('The requested resource was not found');
  }
  
  if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
    throw new Error('Internal server error. Please try again later.');
  }
  
  throw error;
};

// Export all APIs as a single object for convenience
export default {
  auth: authAPI,
  appointments: appointmentsAPI,
  departments: departmentsAPI,
  analytics: analyticsAPI,
  users: usersAPI,
};