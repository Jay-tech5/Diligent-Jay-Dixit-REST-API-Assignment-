/**
 * Validate incoming expense payload
 * @param {Object} body 
 * @returns {{ isValid: boolean, errors: Array<string> }}
 */
function validateExpensePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object']
    };
  }

  const { title, amount, category, date } = body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }

  const numAmount = Number(amount);
  if (
    amount === undefined ||
    amount === null ||
    typeof amount === 'boolean' ||
    !Number.isFinite(numAmount) ||
    numAmount <= 0
  ) {
    errors.push('amount is required and must be a positive number');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }

  if (date !== undefined && date !== null && date !== '') {
    if (typeof date !== 'string' || isNaN(Date.parse(date))) {
      errors.push('date must be a valid date string (e.g. YYYY-MM-DD)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateUpdatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object']
    };
  }

  const { title, amount, category, date } = body;
  const errors = [];

  if (title === undefined && amount === undefined && category === undefined && date === undefined) {
    return {
      isValid: false,
      errors: ['At least one field (title, amount, category, date) must be provided for update']
    };
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push('title must be a non-empty string');
    }
  }

  if (amount !== undefined) {
    const numAmount = Number(amount);
    if (amount === null || typeof amount === 'boolean' || !Number.isFinite(numAmount) || numAmount <= 0) {
      errors.push('amount must be a positive number');
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      errors.push('category must be a non-empty string');
    }
  }

  if (date !== undefined && date !== null && date !== '') {
    if (typeof date !== 'string' || isNaN(Date.parse(date))) {
      errors.push('date must be a valid date string (e.g. YYYY-MM-DD)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateExpensePayload,
  validateUpdatePayload
};