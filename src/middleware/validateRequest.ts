import { Request, Response, NextFunction } from 'express';
import { sanitizeInput } from '../utils/sanitizeInput';

// Validate the search term presence and format
const validateSearchTerm = (req: Request, res: Response, next: NextFunction) => {
  let searchTerm = req.query.searchTerm as string;
  if (searchTerm) {
    // Trim and sanitize the search term to prevent SQL injection or other security issues
    searchTerm = sanitizeInput(searchTerm.trim());
    if (searchTerm.trim() === '') {
      console.error('Invalid characters in search term, reduced to empty after sanitization.');
      res.status(400).json({ error: 'Invalid search term provided. Please provide a valid search term.' });
      return;
    }
    console.log(`Search term validated and sanitized: ${searchTerm}`);
  } else {
    console.log('No search term provided. Proceeding without search term filter.');
    searchTerm = ''; // Adjusted to assign an empty string instead of undefined to comply with TypeScript type expectations
  }
  req.query.searchTerm = searchTerm;
  next();
};

// Validate the pagination parameters: page and limit
const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  let page = parseInt(req.query.page as string);
  let limit = parseInt(req.query.limit as string);

  if (isNaN(page) || page < 1) {
    console.log('Invalid or negative page number provided, defaulting to page 1.');
    page = 1;
  } else {
    console.log(`Page number validated: ${page}`);
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    console.log('Invalid or out-of-range limit provided, defaulting to limit 10.');
    limit = 10;
  } else {
    console.log(`Limit validated: ${limit}`);
  }

  // Ensure the pagination parameters are correctly updated
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  console.log(`Pagination validated. Page: ${req.query.page}, Limit: ${req.query.limit}`);

  next();
};

// Export the validation middleware to be used in routes
export { validateSearchTerm, validatePagination };