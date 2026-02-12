import { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';

export function useServiceRequests(filters = {}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceAPI.getAll(filters);
        setRequests(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch service requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await serviceAPI.getAll(filters);
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service requests');
    } finally {
      setLoading(false);
    }
  };

  return { requests, loading, error, refetch };
}
