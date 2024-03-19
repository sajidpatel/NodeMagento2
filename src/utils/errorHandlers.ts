import { Request, Response, NextFunction } from 'express';

// Defines a generic error response structure
interface ErrorResponse {
  error: boolean;
  message: string;
}

// Handles database connection errors
export const handleDatabaseConnectionError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`Database connection error: ${err.message}\n${err.stack}`);
  const response: ErrorResponse = {
    error: true,
    message: 'Failed to connect to the database. Please try again later.',
  };
  res.status(500).json(response);
};

// Handles API query errors
export const handleAPIQueryError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`API query error: ${err.message}\n${err.stack}`);
  const response: ErrorResponse = {
    error: true,
    message: 'There was an error processing your request. Please try again later.',
  };
  res.status(500).json(response);
};

// Handles invalid search term errors
export const handleInvalidSearchTermError = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Invalid search term provided');
  const response: ErrorResponse = {
    error: true,
    message: 'Invalid search term provided. Please provide a valid search term.',
  };
  res.status(400).json(response);
};

// Handles validation errors for request parameters
export const handleValidationError = (message: string, req: Request, res: Response, next: NextFunction): void => {
  console.log(`Validation error: ${message}`);
  const response: ErrorResponse = {
    error: true,
    message: message,
  };
  res.status(400).json(response);
};

// Handles invalid pagination parameters errors
export const handleInvalidPaginationParametersError = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Invalid pagination parameters provided');
  const response: ErrorResponse = {
    error: true,
    message: 'Invalid pagination parameters. Page must be a positive number and limit must be between 1 and 100.',
  };
  res.status(400).json(response);
};

// Middleware for catching and handling errors thrown in async routes
export const catchAsyncErrors = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch((error: Error) => {
    console.error(`Unhandled error in async route: ${error.message}\n${error.stack}`);
    const response: ErrorResponse = {
      error: true,
      message: 'An unexpected error occurred. Please try again later.',
    };
    res.status(500).json(response);
  });
};