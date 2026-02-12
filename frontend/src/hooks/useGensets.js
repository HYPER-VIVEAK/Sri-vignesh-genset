import { useState, useEffect } from 'react';
import { gensetAPI } from '../services/api';

export function useGensets(filters = {}) {
  const [gensets, setGensets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGensets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await gensetAPI.getAll(filters);
        setGensets(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch gensets');
      } finally {
        setLoading(false);
      }
    };

    fetchGensets();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await gensetAPI.getAll(filters);
      setGensets(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch gensets');
    } finally {
      setLoading(false);
    }
  };

  return { gensets, loading, error, refetch };
}
