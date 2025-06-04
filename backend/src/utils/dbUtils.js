// Database utility functions to handle rate limiting and retries

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute database operation with retry logic and exponential backoff
 * @param {Function} operation - The database operation to execute
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
 * @returns {Promise} - Result of the operation
 */
async function executeWithRetry(operation, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limiting error
      const isRateLimit = error.message && (
        error.message.includes('too many requests') ||
        error.message.includes('rate limit') ||
        error.message.includes('connection limit') ||
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT'
      );
      
      if (isRateLimit && attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delayTime = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limit detected, retrying in ${delayTime}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await delay(delayTime);
        continue;
      }
      
      // If it's not a rate limit error or we've exhausted retries, throw the error
      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries + 1} attempts:`, error.message);
        throw lastError;
      }
    }
  }
  
  throw lastError;
}

/**
 * Add a small delay between database operations to reduce load
 * @param {number} ms - Delay in milliseconds (default: 100ms)
 */
async function throttle(ms = 100) {
  await delay(ms);
}

/**
 * Batch database operations to reduce the number of requests
 * @param {Array} items - Array of items to process
 * @param {Function} operation - Operation to perform on each batch
 * @param {number} batchSize - Size of each batch (default: 5)
 * @param {number} delayBetweenBatches - Delay between batches in ms (default: 200)
 */
async function batchProcess(items, operation, batchSize = 5, delayBetweenBatches = 200) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    try {
      const batchResults = await Promise.all(
        batch.map(item => executeWithRetry(() => operation(item)))
      );
      results.push(...batchResults);
      
      // Add delay between batches to avoid overwhelming the database
      if (i + batchSize < items.length) {
        await delay(delayBetweenBatches);
      }
    } catch (error) {
      console.error(`Batch processing failed for batch starting at index ${i}:`, error);
      throw error;
    }
  }
  
  return results;
}

module.exports = {
  executeWithRetry,
  throttle,
  batchProcess,
  delay
};
