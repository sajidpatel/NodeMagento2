import { Router } from 'express';
import { searchProducts } from '../controllers/productController';
import { validateSearchTerm, validatePagination } from '../middleware/validateRequest';
import { catchAsyncErrors } from '../utils/errorHandlers';

const router = Router();

// Route for searching products, leveraging the dedicated controller function
router.get('/search', validateSearchTerm, validatePagination, catchAsyncErrors(searchProducts));

export default router;