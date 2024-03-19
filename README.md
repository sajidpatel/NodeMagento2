# NodeMagento2

NodeJS implementation of the Magento 2 ORM and Microservice Framework components without using legacy PHP.

NodeMagento2 is a NodeJs service providing an additional API surface that makes product search.

Delivering great shopping experiences with Magento can be tricky, involving many factors. But two are undoubtedly part of the equation: Customers need to find what they’re looking for and they need to do it quickly. That’s why we developed NodeMagento2 for Adobe Commerce.

NodeMagento2 is written in a highly scalable event-driven NodeJS/JavaScript. JavaScript is one of the most popular programming languages and nearly every developer is familiar with it.

This repo uses the Sequelize library to connect to the Magento 2 database directly without invocation of the Magento 2 PHP framework, so we won’t have to write any MYSQL queries.

![Laragento](https://raw.githubusercontent.com/Genaker/nodegento/main/nodegento-logo.png)

Sequelize is a pretty great ORM. From their website:

“Sequelize is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite and MSSQL and features solid transaction support, relations, read replication and more.”

Sequilize ORM is really popular and has 25K stars on GitHub:

![Squilize ORM](https://user-images.githubusercontent.com/9213670/139718372-90124eeb-85bf-4b54-a556-aadf7895c765.png)
Sequilize has 1M+ weekly downloads:
![Sequlize Downlods](https://user-images.githubusercontent.com/9213670/153321396-ce7126c4-546c-4237-b233-252f25367ba3.png)


# Installation
Go to the magento root directory

```
apt install npm #if not installed
npm install https://github.com/sajidpatel/NodeMagento2/
Copy .env.sample to .env and update the Redis host, Redis port, DB host, user, password and database name
npm run src/testDatabaseConnection.ts
```
you will see the results of DB connection array

# Usage

```
npm run dev
```

To find products with search term in name, description and filter by price between minPrice and maxPrice
http://localhost:3000/api/products/search?searchTerm=search%20term&page=1&limit=10&filters=%7B%22priceRange%22%3A%2221%2C200%22%7D