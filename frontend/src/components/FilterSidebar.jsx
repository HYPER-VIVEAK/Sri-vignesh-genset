import React, { useRef } from 'react';

const FilterSidebar = ({ filters, setFilters }) => {
  const brands = ['Cummins', 'Caterpillar', 'Kohler', 'Perkins', 'Honda', 'Generac', 'Kirloskar', 'Ashok Leyland', 'Other'];
  const fuelTypes = ['Diesel', 'Natural Gas', 'Propane', 'Gasoline', 'Petrol', 'Gas', 'CNG', 'LPG', 'Bi-Fuel'];
  const conditions = ['New', 'Used', 'Refurbished'];

  const minCapacityRef = useRef(null);
  const maxCapacityRef = useRef(null);

  const handleChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value || undefined,
    });
  };

  const applyCapacityFilter = () => {
    const minValue = minCapacityRef.current?.value || '';
    const maxValue = maxCapacityRef.current?.value || '';

    setFilters({
      ...filters,
      minCapacity: minValue || undefined,
      maxCapacity: maxValue || undefined,
    });
  };

  const clearFilters = () => {
    setFilters({});
    if (minCapacityRef.current) minCapacityRef.current.value = '';
    if (maxCapacityRef.current) maxCapacityRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Brand */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Brand</label>
        <select
          value={filters.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Fuel Type</label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => handleChange('fuelType', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Condition</label>
        <select
          value={filters.condition || ''}
          onChange={(e) => handleChange('condition', e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Conditions</option>
          {conditions.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Capacity Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Capacity Range (kVA)</label>
        <input
          type="number"
          placeholder="Min"
          defaultValue={filters.minCapacity || ''}
          ref={minCapacityRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyCapacityFilter();
            }
          }}
          className="w-full border rounded-md px-3 py-2 text-sm mb-2"
        />
        <input
          type="number"
          placeholder="Max"
          defaultValue={filters.maxCapacity || ''}
          ref={maxCapacityRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyCapacityFilter();
            }
          }}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Phase */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Phase</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="phase"
              value=""
              checked={!filters.phase}
              onChange={(e) => handleChange('phase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">All Phases</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="phase"
              value="Single Phase"
              checked={filters.phase === 'Single Phase'}
              onChange={(e) => handleChange('phase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Single Phase</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="phase"
              value="Three Phase"
              checked={filters.phase === 'Three Phase'}
              onChange={(e) => handleChange('phase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Three Phase</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 rounded-md text-sm font-semibold transition"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
