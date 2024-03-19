/**
 * Utility to sanitize inputs for search terms and filters.
 * This is to ensure that user inputs are cleaned before processing to prevent
 * SQL injection or other security vulnerabilities.
 */

import { Request, Response, NextFunction } from 'express';

// Function to sanitize search terms and filter values
export const sanitizeInput = (input: string): string => {
  // Remove any potentially harmful characters and patterns
  return input.trim().replace(/[^a-zA-Z0-9 \-\+\&\'\"]/g, "");
};

// Middleware to sanitize search term
export const sanitizeSearchTerm = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const searchTerm = req.query.searchTerm as string;
    if (searchTerm) {
      console.log('Sanitizing search term...');
      req.query.searchTerm = sanitizeInput(searchTerm);
      console.log(`Search term sanitized: ${req.query.searchTerm}`);
    }
    next();
  } catch (error: any) {
    console.error('Error sanitizing search term:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error during search term sanitization.' });
  }
};

// Middleware to sanitize filter parameters
export const sanitizeFilters = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const filters = ['priceRange', 'category', 'inStock'];
    console.log('Sanitizing filter parameters...');
    filters.forEach(filter => {
      if (req.query[filter]) {
        req.query[filter] = sanitizeInput(req.query[filter] as string);
        console.log(`Filter ${filter} sanitized: ${req.query[filter]}`);
      }
    });
    next();
  } catch (error: any) {
    console.error('Error sanitizing filter parameters:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error during filter parameter sanitization.' });
  }
};