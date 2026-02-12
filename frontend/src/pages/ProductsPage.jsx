import React, { useState } from 'react';
import { useGensets } from '../hooks/useGensets';
import GensetCard from '../components/GensetCard';
import FilterSidebar from '../components/FilterSidebar';

const ProductsPage = () => {
  const [filters, setFilters] = useState({});
  const { gensets, loading, error } = useGensets(filters);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">⏳ Loading gensets...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Generator Sets</h1>

      {error && <div className="text-red-600 mb-4 p-4 bg-red-100 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        <div className="lg:col-span-3">
          {gensets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-xl text-gray-600">No gensets found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Showing {gensets.length} genset{gensets.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gensets.map((genset) => (
                  <GensetCard key={genset._id} genset={genset} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
