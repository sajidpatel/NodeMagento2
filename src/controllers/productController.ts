import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { Op, Sequelize } from 'sequelize';
import Redis from 'ioredis';
import Product from '../models/Product';
import ProductName from '../models/ProductName';
import ProductDescription from '../models/ProductDescription';
import ProductPrice from '../models/ProductPrice';
import ProductCategory from '../models/ProductCategory';

// Load environment variables
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
});

const generateRedisKey = (searchTerm: string, page: number, limit: number, filters: string): string => {
    return `search:${searchTerm}:page:${page}:limit:${limit}:filters:${filters}`;
};

const searchProducts = async (req: Request, res: Response) => {
    let searchTerm: string = req.query.searchTerm as string || '';
    let page: number = parseInt(req.query.page as string) || 1;
    page = Math.max(page, 1); // Ensure page is at least 1
    const limit: number = parseInt(req.query.limit as string) || 10;
    const safeLimit = Math.min(Math.max(limit, 1), 100); // Ensure limit is between 1 and 100
    const offset = (page - 1) * safeLimit;

    let whereCondition: any = {};
    let includeModels: any[] = [];

    if (searchTerm) {
        const lowerCaseTerm = `%${searchTerm.toLowerCase()}%`;
        whereCondition[Op.or] = [
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('productNames.value')), { [Op.like]: lowerCaseTerm }),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('sku')), { [Op.like]: lowerCaseTerm }),
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('productDescriptions.value')), { [Op.like]: lowerCaseTerm }),
        ];
        includeModels.push(
            { model: ProductName, as: 'productNames', attributes: ['value'], required: false },
            { model: ProductDescription, as: 'productDescriptions', attributes: ['value'], required: false },
        );
    }

    const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
    console.log(filters);
    if (filters.priceRange) {
        const priceRange = filters.priceRange.split(',').map((price: string) => parseFloat(price));
        if (!whereCondition[Op.and]) {
            whereCondition[Op.and] = [];
        }
        whereCondition[Op.and].push(Sequelize.where(Sequelize.col('productPrices.value'), { [Op.between]: priceRange }));
        includeModels.push({ model: ProductPrice, as: 'productPrices', attributes: ['value'], required: true });
    }
    if (filters.category) {
        if (!whereCondition[Op.and]) {
            whereCondition[Op.and] = [];
        }
        includeModels.push({ model: ProductCategory, as: 'categories', where: { name: { [Op.like]: `%${filters.category}%` } }, required: true });
    }

    const redisKey = generateRedisKey(searchTerm, page, safeLimit, JSON.stringify(filters));
    console.log(`Attempting to retrieve cached results for key: ${redisKey}`);

    try {
        const cachedResults = await redis.get(redisKey);
        if (cachedResults) {
            console.log('Returning cached results');
            return res.json(JSON.parse(cachedResults));
        }

        console.log('Cached results not found, querying database...');

        const total = await Product.count({
            where: whereCondition,
            include: includeModels,
            distinct: true,
            col: 'entity_id'
        });

        const products = await Product.findAll({
            where: whereCondition,
            include: includeModels,
            limit: safeLimit,
            offset: offset,
            subQuery: false
        });

        console.log('Query successful, caching results...');
        await redis.set(redisKey, JSON.stringify({
            total: total,
            totalPages: Math.ceil(total / safeLimit),
            currentPage: page,
            data: products
        }), 'EX', 60); // Cache for 1 minute

        console.log('Returning new query results');
        res.json({
            total: total,
            totalPages: Math.ceil(total / safeLimit),
            currentPage: page,
            data: products
        });
    } catch (error: any) {
        console.error(`Error searching products: ${error.message}\n${error.stack}`);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { searchProducts };