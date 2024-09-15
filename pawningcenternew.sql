-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2024 at 01:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pawningcenternew`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `accountType` enum('superadmin','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `accountType`) VALUES
(1, 'abc', '123', 'superadmin'),
(2, 'xyz', '123', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `buyer`
--

CREATE TABLE `buyer` (
  `id` int(11) NOT NULL,
  `buyerName` varchar(255) NOT NULL,
  `buyerNic` varchar(100) NOT NULL,
  `buyerAddress` varchar(255) NOT NULL,
  `buyerPhone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calculation`
--

CREATE TABLE `calculation` (
  `id` int(11) NOT NULL,
  `estimate_value` decimal(10,2) NOT NULL,
  `monthly_interest` decimal(10,2) DEFAULT 0.00,
  `total_interest` decimal(10,2) DEFAULT 0.00,
  `total_price` decimal(10,2) DEFAULT 0.00,
  `customer_paid` decimal(10,2) DEFAULT 0.00,
  `due` decimal(10,2) GENERATED ALWAYS AS (`total_price` - `customer_paid`) VIRTUAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `nic` varchar(45) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customerName`, `nic`, `address`, `phone`) VALUES
(2, 'xxxx', 'xxxx', 'xxxx', 'xxxx'),
(4, 'xyz', 'xyz', 'xyz', 'xyz'),
(6, 'ppp', 'ppp', 'ppp', 'ppp'),
(7, 'ooo', 'ooo', 'ooo', 'ooo'),
(8, 'iiii', 'iiii', 'iiii', 'iiii'),
(9, 'yyyy', 'yyyy', 'yyyy', 'yyyy'),
(15, '78', '78', '78', '78'),
(16, '45', '45', '45', '45'),
(17, '75', '57', '57', '57');

-- --------------------------------------------------------

--
-- Table structure for table `itemcategory`
--

CREATE TABLE `itemcategory` (
  `id` int(11) NOT NULL,
  `categoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `itemcategory`
--

INSERT INTO `itemcategory` (`id`, `categoryName`) VALUES
(1, 'Phone'),
(2, 'Vehicle');

-- --------------------------------------------------------

--
-- Table structure for table `itemmodel`
--

CREATE TABLE `itemmodel` (
  `id` int(11) NOT NULL,
  `modelName` varchar(100) NOT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `itemmodel`
--

INSERT INTO `itemmodel` (`id`, `modelName`, `categoryId`) VALUES
(1, 'Samsung', 1),
(2, 'Toyoto', 2);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `itemName` varchar(100) NOT NULL,
  `itemNumber` varchar(100) NOT NULL,
  `sizeWeight` varchar(50) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `modelId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `itemName`, `itemNumber`, `sizeWeight`, `categoryId`, `modelId`) VALUES
(1, 'Land Cruiser', 'Cp ABC 123', NULL, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `recepitNo` varchar(45) DEFAULT NULL,
  `customerName` varchar(255) NOT NULL,
  `nic` varchar(45) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `itemCategory` varchar(255) DEFAULT NULL,
  `itemModel` varchar(255) DEFAULT NULL,
  `itemName` varchar(255) DEFAULT NULL,
  `itemNo` varchar(255) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `marketValue` int(11) DEFAULT NULL,
  `estimateValue` int(11) DEFAULT NULL,
  `totalDue` int(255) DEFAULT NULL,
  `interest` int(255) DEFAULT NULL,
  `monthlyInterest` int(100) DEFAULT NULL,
  `totalInterest` int(11) NOT NULL,
  `totalOutstanding` int(255) DEFAULT NULL,
  `customerPaid` int(11) NOT NULL,
  `discount` int(255) NOT NULL,
  `dueAmount` int(11) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `buyerName` varchar(200) DEFAULT NULL,
  `buyerNic` varchar(100) DEFAULT NULL,
  `buyerAddress` varchar(254) DEFAULT NULL,
  `buyerPhone` varchar(100) DEFAULT NULL,
  `sellDate` date DEFAULT NULL,
  `sellPrice` int(255) DEFAULT NULL,
  `image` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `recepitNo`, `customerName`, `nic`, `address`, `phone`, `startDate`, `endDate`, `itemCategory`, `itemModel`, `itemName`, `itemNo`, `size`, `marketValue`, `estimateValue`, `totalDue`, `interest`, `monthlyInterest`, `totalInterest`, `totalOutstanding`, `customerPaid`, `discount`, `dueAmount`, `status`, `buyerName`, `buyerNic`, `buyerAddress`, `buyerPhone`, `sellDate`, `sellPrice`, `image`) VALUES
(8, 'ooo', 'ooo', 'ooo', 'ooo', 'ooo', '2024-09-20', '2024-09-14', 'Phone', 'Toyoto', 'ooo', 'ooo', 'ooo', 800, 900, NULL, NULL, NULL, 0, NULL, 0, 0, 0, 'Removed', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'iiii', 'iiii', 'iiii', 'iiii', 'iiii', '2024-09-02', NULL, 'Phone', 'Toyoto', 'iiii', 'iiii', 'iiii', 600, 500, NULL, NULL, NULL, 0, NULL, 0, 0, 0, 'Sold', 'ty', 'ty', 'ty', 'ty', '2024-10-05', 700, NULL),
(10, 'yyyy', 'yyyy', 'yyyy', 'yyyy', 'yyyy', '2024-09-28', '2024-09-15', 'Vehicle', 'Toyoto', 'yyyy', 'yyyy', 'yyyy', 500, 400, 10, NULL, 20, 100, 30, 460, 0, 10, 'Pawned', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, '56', '75', '57', '57', '57', '2024-09-06', NULL, 'Phone', 'Samsung', '57', '57', '57', 57, 57, 0, NULL, 3, 3, 60, 55, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `transactionType` varchar(45) NOT NULL,
  `transactionDate` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buyer`
--
ALTER TABLE `buyer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calculation`
--
ALTER TABLE `calculation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customerName` (`customerName`),
  ADD KEY `idx_nic` (`nic`),
  ADD KEY `idx_address` (`address`),
  ADD KEY `idx_phone` (`phone`);

--
-- Indexes for table `itemcategory`
--
ALTER TABLE `itemcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itemmodel`
--
ALTER TABLE `itemmodel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `modelId` (`modelId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_customerName` (`customerName`),
  ADD KEY `idx_products_nic` (`nic`),
  ADD KEY `idx_products_address` (`address`),
  ADD KEY `idx_products_phone` (`phone`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transaction_product` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `buyer`
--
ALTER TABLE `buyer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calculation`
--
ALTER TABLE `calculation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `itemcategory`
--
ALTER TABLE `itemcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `itemmodel`
--
ALTER TABLE `itemmodel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itemmodel`
--
ALTER TABLE `itemmodel`
  ADD CONSTRAINT `itemmodel_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `itemcategory` (`id`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `itemcategory` (`id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`modelId`) REFERENCES `itemmodel` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_products` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
