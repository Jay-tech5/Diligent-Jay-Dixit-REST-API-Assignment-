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
    isNaN(numAmount) ||
    numAmount <= 0
  ) {
    errors.push('amount is required and must be a positive number');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }

  if (!date || typeof date !== 'string' || isNaN(Date.parse(date))) {
    errors.push('date is required and must be a valid date string (e.g. YYYY-MM-DD)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateExpensePayload
};