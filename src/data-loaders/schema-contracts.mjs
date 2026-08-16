export function validateContract(record, schema, label = 'record') {
  const issues = [];
  validateValue(record, schema, label, issues);
  return { ok: issues.length === 0, issues };
}

function validateValue(value, schema, path, issues) {
  if (!schema || typeof schema !== 'object') return;
  if (schema.required) {
    for (const key of schema.required) {
      if (value?.[key] === undefined || value?.[key] === null || value?.[key] === '') issues.push(`${path}.${key} is required`);
    }
  }
  if (schema.type && !matchesType(value, schema.type)) issues.push(`${path} must be ${Array.isArray(schema.type) ? schema.type.join('|') : schema.type}`);
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) issues.push(`${path} must be at least ${schema.minLength} characters`);
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) issues.push(`${path} does not match ${schema.pattern}`);
    if (schema.enum && !schema.enum.includes(value)) issues.push(`${path} must be one of ${schema.enum.join(', ')}`);
  }
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) issues.push(`${path} must be >= ${schema.minimum}`);
  if (Array.isArray(value) && schema.items) value.forEach((item, index) => validateValue(item, schema.items, `${path}[${index}]`, issues));
  if (value && typeof value === 'object' && !Array.isArray(value) && schema.properties) {
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (value[key] !== undefined) validateValue(value[key], childSchema, `${path}.${key}`, issues);
    }
  }
}

function matchesType(value, type) {
  const types = Array.isArray(type) ? type : [type];
  return types.some(expected => {
    if (expected === 'array') return Array.isArray(value);
    if (expected === 'integer') return Number.isInteger(value);
    if (expected === 'number') return typeof value === 'number' && Number.isFinite(value);
    if (expected === 'object') return value && typeof value === 'object' && !Array.isArray(value);
    return typeof value === expected;
  });
}
