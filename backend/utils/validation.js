// Validation middleware for genset data
const validateGenset = (req, res, next) => {
  const { model, brand, capacity, fuelType, phase, price, stock, condition } = req.body;
  const errors = [];

  // Required field validation
  if (!model || model.trim() === '') {
    errors.push('Model is required');
  }

  if (!brand || brand.trim() === '') {
    errors.push('Brand is required');
  }

  if (!fuelType || fuelType.trim() === '') {
    errors.push('Fuel type is required');
  }

  if (!phase || phase.trim() === '') {
    errors.push('Phase is required');
  }

  // Type and range validation
  if (capacity !== undefined) {
    if (typeof capacity !== 'number' || capacity <= 0) {
      errors.push('Capacity must be a positive number');
    }
  } else {
    errors.push('Capacity is required');
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a non-negative number');
    }
  } else {
    errors.push('Price is required');
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
    errors.push('Stock must be a non-negative integer');
  }

  // Validate brand
  const validBrands = ['Cummins', 'Caterpillar', 'Kohler', 'Perkins', 'Honda', 'Generac', 'Kirloskar', 'Ashok Leyland', 'Other'];
  if (brand && !validBrands.includes(brand)) {
    errors.push(`Brand must be one of: ${validBrands.join(', ')}`);
  }

  // Validate phase
  const validPhases = ['Single Phase', 'Three Phase'];
  if (phase && !validPhases.includes(phase)) {
    errors.push('Phase must be either "Single Phase" or "Three Phase"');
  }

  // Validate fuel type
  const validFuelTypes = ['Diesel', 'Natural Gas', 'Propane', 'Gasoline', 'Petrol', 'Gas', 'CNG', 'LPG', 'Bi-Fuel'];
  if (fuelType && !validFuelTypes.includes(fuelType)) {
    errors.push(`Fuel type must be one of: ${validFuelTypes.join(', ')}`);
  }

  // Validate condition
  const validConditions = ['New', 'Used', 'Refurbished'];
  if (condition && !validConditions.includes(condition)) {
    errors.push(`Condition must be one of: ${validConditions.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

module.exports = { validateGenset };
