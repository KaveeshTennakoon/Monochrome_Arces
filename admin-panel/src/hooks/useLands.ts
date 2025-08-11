'use client';

import { useState, useEffect } from 'react';
import { LandParcel, LandSearchFilters, AddLandRequest } from '@/types/land';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { message } from 'antd';

export function useLands() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLands = async (filters?: LandSearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = filters && Object.keys(filters).length > 0 
        ? API_ENDPOINTS.LANDS.SEARCH 
        : API_ENDPOINTS.LANDS.LIST;
      
      const response = await apiClient.get<LandParcel[]>(endpoint, {
        params: filters,
      });
      
      setLands(response);
    } catch (err) {
      setError('Failed to fetch lands');
      message.error('Failed to load land data');
    } finally {
      setLoading(false);
    }
  };

  const createLand = async (landData: AddLandRequest): Promise<LandParcel> => {
    try {
      const response = await apiClient.post<LandParcel>(
        API_ENDPOINTS.LANDS.CREATE,
        landData
      );
      
      setLands(prev => [response, ...prev]);
      return response;
    } catch (err) {
      throw new Error('Failed to create land parcel');
    }
  };

  const updateLand = async (id: string, landData: Partial<AddLandRequest>): Promise<LandParcel> => {
    try {
      const response = await apiClient.put<LandParcel>(
        API_ENDPOINTS.LANDS.UPDATE(id),
        landData
      );
      
      setLands(prev => prev.map(land => 
        land.id === id ? response : land
      ));
      
      return response;
    } catch (err) {
      throw new Error('Failed to update land parcel');
    }
  };

  const deleteLand = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.LANDS.DELETE(id));
      setLands(prev => prev.filter(land => land.id !== id));
    } catch (err) {
      throw new Error('Failed to delete land parcel');
    }
  };

  const getLandById = async (id: string): Promise<LandParcel | null> => {
    try {
      const response = await apiClient.get<LandParcel>(
        API_ENDPOINTS.LANDS.GET(id)
      );
      return response;
    } catch (err) {
      message.error('Failed to fetch land details');
      return null;
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return {
    lands,
    loading,
    error,
    fetchLands,
    createLand,
    updateLand,
    deleteLand,
    getLandById,
  };
}