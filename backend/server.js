const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const jsPDF = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');

const app = express();
const port = 5000;

const corsOptions = {
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(cookieParser());


// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // limit 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pawningcenternew'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//insert data
app.post('/api/submit', (req, res) => {
    const {
        recepitNo,
        customerName,
        nic,
        address,
        phone,
        startDate,
        itemCategory,
        itemModel,
        itemName,
        itemNo,
        size,
        marketValue,
        estimateValue,
    } = req.body;

    // Check if customer exists
    const checkCustomerQuery = 'SELECT * FROM Customers WHERE nic = ?';
    connection.query(checkCustomerQuery, [nic], (err, results) => {
        if (err) {
            console.error('Error checking customer:', err);
            return res.status(500).json({ message: 'Error checking customer', error: err.message });
        }

        if (results.length === 0) {
            // Create new customer
            const createCustomerQuery = 'INSERT INTO Customers (customerName, nic, address, phone) VALUES (?, ?, ?, ?)';
            connection.query(createCustomerQuery, [customerName, nic, address, phone], (err) => {
                if (err) {
                    console.error('Error creating customer:', err);
                    return res.status(500).json({ message: 'Error creating customer', error: err.message });
                }
                insertProduct();
            });
        } else {
            insertProduct();
        }

        // Save item details
        function insertProduct() {
            const createItemQuery = `INSERT INTO Products 
                (recepitNo, customerName, nic, address, phone, startDate, itemCategory, itemModel, itemName, itemNo, size, marketValue, estimateValue) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                
            connection.query(createItemQuery, [
                recepitNo, customerName, nic, address, phone, startDate, itemCategory, itemModel, 
                itemName, itemNo, size, marketValue, estimateValue
            ], (err) => {
                if (err) {
                    console.error('Error saving item:', err.stack);
                    return res.status(500).json({ message: 'Error saving item', error: err.message });
                }
        
                res.status(201).json({ message: 'Data saved successfully' });
            });
        }
    });
});


//product image upload
app.post('/upload', upload.single('image'), (req, res) => {
    const { file } = req;
    const { imagePro} = file;
  
    // SQL query to insert image data as BLOB into MySQL
    const sql = `INSERT INTO product_img (imagePro) VALUES (?)`;
    db.query(sql, [imagePro], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading image');
      }
      res.status(200).send('Image uploaded successfully');
    });
  });
  
  // API endpoint to fetch image by ID
  app.get('/image/:id', (req, res) => {
    const sql = `SELECT imagePro FROM product_img WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching image');
      }
      if (result.length === 0) {
        return res.status(404).send('Image not found');
      }
  
      res.setHeader('Content-Type', result[0].mime_type);
      res.send(result[0].image_data);
    });
  });

// API to fetch categories from the database
app.get('/api/categories', (req, res) => {
    const query = 'SELECT categoryName FROM itemcategory';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ message: 'Error fetching categories' });
        }
        res.status(200).json(results);
    });
});

// API to fetch models from the database
app.get('/api/models', (req, res) => {
    const query = 'SELECT modelName FROM itemmodel'; 
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching models:', err);
            return res.status(500).json({ message: 'Error fetching models' });
        }
        res.status(200).json(results);
    });
});


// API to get all customers
app.get('/api/customers', (req, res) => {
    const getCustomersQuery = 'SELECT * FROM Customers';
    connection.query(getCustomersQuery, (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).json({ message: 'Error fetching customers' });
        }

        res.status(200).json(results);
    });
});

// Add this new route to your server.js file

app.get('/api/customer/:nic', (req, res) => {
    const { nic } = req.params;
    const query = 'SELECT * FROM Customers WHERE nic = ?';
    
    connection.query(query, [nic], (err, results) => {
        if (err) {
            console.error('Error fetching customer data:', err);
            return res.status(500).json({ message: 'Error fetching customer data' });
        }
        
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    });
});

// API to get all items
app.get('/api/products', (req, res) => {
    const getProductsQuery = 'SELECT * FROM products';
    connection.query(getProductsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }

        res.status(200).json(results);
    });
});

// Route to Update Product Payment Details
app.post('/api/pawn-payment', (req, res) => {
    const { id, status, totalDue, monthlyInterest, totalInterest, totalOutstanding, customerPaid, dueAmount, discount } = req.body;
  
    let query;
    let queryParams;
  
    if (status === 'Pawned') {
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        query = `
            UPDATE products SET 
            status = ?,
            totalDue = ?,
            monthlyInterest = ?, 
            totalInterest = ?,
            totalOutstanding = ?,
            customerPaid = ?,
            dueAmount = ?,
            discount = ?,
            endDate = ?
            WHERE id = ?
        `;
        queryParams = [status, totalDue, monthlyInterest, totalInterest, totalOutstanding, customerPaid, dueAmount, discount, currentDate, id];
    } else {
        query = `
            UPDATE products SET 
            totalDue = ?,
            monthlyInterest = ?, 
            totalInterest = ?,
            totalOutstanding = ?,
            customerPaid = ?,
            dueAmount = ?,
            discount = ?
            WHERE id = ?
        `;
        queryParams = [totalDue, monthlyInterest, totalInterest, totalOutstanding, customerPaid, dueAmount, discount, id];
    }
  
    connection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Error updating product');
        }
        res.send('Product updated successfully');
    });
});

app.put('/api/remove-item/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'UPDATE products SET status = ? WHERE id = ?';
    
    connection.query(query, ['Removed', itemId], (err, result) => {
        if (err) {
            console.error('Error removing item:', err);
            return res.status(500).json({ message: 'Error removing item' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item removed successfully' });
    });
});

app.put('/api/buyer/:id', (req, res) => {
    const { status, buyerName, buyerNic, buyerAddress, buyerPhone, sellDate, sellPrice } = req.body;
    const { id } = req.params; // Get product ID from URL params
    
    const query = `
        UPDATE products SET 
        status = ?,
        buyerName = ?,
        buyerNic = ?,
        buyerAddress = ?,
        buyerPhone = ?,
        sellDate = ?,
        sellPrice = ?
    WHERE id = ?
    `;

    const values = [status, buyerName, buyerNic, buyerAddress, buyerPhone, sellDate, sellPrice, id]; // Include ID as last value

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).json({ message: 'Error submitting data' });
        }
        res.status(201).json({ message: 'Data submitted successfully!' });
    });
});

//create a new admin
app.post('/api/admins', (req, res) => {
    const { username, password, accountType } = req.body;

    if (!username || !password || !accountType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const createAdminQuery = 'INSERT INTO admins (username, password, accountType) VALUES (?, ?, ?)';
    connection.query(createAdminQuery, [username, password, accountType], (err) => {
        if (err) {
            console.error('Error creating admin:', err);
            return res.status(500).json({ message: 'Failed to create admin' });
        }

        res.status(201).json({ message: 'Admin created successfully' });
    });
});

// Login 
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const getAdminQuery = 'SELECT * FROM admins WHERE username = ?';
    connection.query(getAdminQuery, [username], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0 && results[0].password === password) {
            // Create JWT
            const token = jwt.sign({ id: results[0].id, accountType: results[0].accountType }, SECRET_KEY, { expiresIn: '3h' });

            // Set JWT as a cookie
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ accountType: results[0].accountType });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Update customer 
app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, nic, address, phone } = req.body;

    const updateCustomerQuery = 'UPDATE Customers SET customerName = ?, nic = ?, address = ?, phone = ? WHERE id = ?';
    connection.query(updateCustomerQuery, [customerName, nic, address, phone, id], (err, results) => {
        if (err) {
            console.error('Error updating customer:', err);
            return res.status(500).json({ message: 'Error updating customer' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully' });
    });
});

// Update item 
// In server.js

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    // First, check if the customer exists
    const checkCustomerQuery = 'SELECT * FROM customers WHERE customerName = ?';
    connection.query(checkCustomerQuery, [updatedProduct.customerName], (err, results) => {
        if (err) {
            console.error('Error checking customer:', err);
            return res.status(500).json({ message: 'Error checking customer' });
        }

        if (results.length === 0) {
            // Customer doesn't exist, so create a new customer
            const createCustomerQuery = 'INSERT INTO customers (customerName, nic, address, phone) VALUES (?, ?, ?, ?)';
            connection.query(createCustomerQuery, [updatedProduct.customerName, updatedProduct.nic, updatedProduct.address, updatedProduct.phone], (err) => {
                if (err) {
                    console.error('Error creating customer:', err);
                    return res.status(500).json({ message: 'Error creating customer' });
                }
                updateProduct();
            });
        } else {
            // Customer exists, proceed with update
            updateProduct();
        }
    });

    function updateProduct() {
        const updateProductQuery = 'UPDATE products SET ? WHERE id = ?';
        connection.query(updateProductQuery, [updatedProduct, id], (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ message: 'Error updating product' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Fetch the updated product
            const getUpdatedProductQuery = 'SELECT * FROM products WHERE id = ?';
            connection.query(getUpdatedProductQuery, [id], (err, results) => {
                if (err) {
                    console.error('Error fetching updated product:', err);
                    return res.status(500).json({ message: 'Error fetching updated product' });
                }

                res.status(200).json(results[0]);
            });
        });
    }
});

// Delete customer 
app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    
   
    console.log('Received customer ID for deletion:', id);
    
    if (!id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    const deleteCustomerQuery = 'DELETE FROM Customers WHERE id = ?';

    connection.query(deleteCustomerQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).json({ message: 'Failed to delete customer' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    });
});

// Delete item 
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    const deleteItemQuery = 'DELETE FROM products WHERE id = ?';

    connection.query(deleteItemQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ message: 'Failed to delete item' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    });
});


app.get('/api/items/report', (req, res) => {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT id, customerName, nic, itemName, startDate, endDate, priceOfItem, totalPrice 
      FROM Items 
      WHERE status = 'Payment Received' AND startDate BETWEEN ? AND ?
    `;
  
    connection.query(query, [startDate, endDate], (err, results) => {
      if (err) {
        console.error('Error fetching report data:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });


  app.get('/api/generate-report', (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
    }

   
    const query = `
        SELECT
            id,
            recepitNo,
            customerName,
            itemCategory,
            itemModel,
            itemName,
            itemNo,
            size,
            marketValue,
            estimateValue,
            status,
            soldDate
        FROM products
        WHERE soldDate BETWEEN ? AND ?
    `;

    connection.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }

        
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Receipt No', 'Customer Name', 'Category', 'Model', 'Item Name', 'Item No', 'Size', 'Market Value', 'Estimated Value', 'Status', 'Sold Date']],
            body: results.map(item => [
                item.id,
                item.recepitNo,
                item.customerName,
                item.itemCategory,
                item.itemModel,
                item.itemName,
                item.itemNo,
                item.size,
                item.marketValue,
                item.estimateValue,
                item.status,
                item.soldDate.toISOString().slice(0, 10) 
            ]),
            theme: 'grid'
        });

      
        const pdfPath = path.join(__dirname, 'report.pdf');
        const pdfStream = doc.output('arraybuffer');
        fs.writeFile(pdfPath, Buffer.from(pdfStream), (err) => {
            if (err) {
                console.error('Error saving PDF file:', err);
                return res.status(500).json({ message: 'Error saving PDF file' });
            }

           
            res.sendFile(pdfPath, { root: __dirname }, (err) => {
                if (err) {
                    console.error('Error sending PDF file:', err);
                }
            });
        });
    });
});


// Authentication middleware
const SECRET_KEY = 'NMSOLUTION';
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Protected route 
app.get('/api/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route!', accountType: req.user.accountType });
  });
  

// Logout route
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
