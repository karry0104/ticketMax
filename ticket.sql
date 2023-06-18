-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (arm64)
--
-- Host: localhost    Database: ticket
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hall`
--

DROP TABLE IF EXISTS `hall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hall_name` varchar(45) NOT NULL,
  `total_seats` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall`
--

LOCK TABLES `hall` WRITE;
/*!40000 ALTER TABLE `hall` DISABLE KEYS */;
INSERT INTO `hall` VALUES (1,'A',10),(2,'B',10),(3,'C',10);
/*!40000 ALTER TABLE `hall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hall_seat`
--

DROP TABLE IF EXISTS `hall_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall_seat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section` varchar(45) NOT NULL,
  `seat_row` varchar(45) NOT NULL,
  `seat_number` int NOT NULL,
  `hall_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hall_id_idx` (`hall_id`),
  CONSTRAINT `hall_id` FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall_seat`
--

LOCK TABLES `hall_seat` WRITE;
/*!40000 ALTER TABLE `hall_seat` DISABLE KEYS */;
INSERT INTO `hall_seat` VALUES (26,'A','a',9,1),(27,'A','a',10,1),(28,'A','a',4,1),(29,'A','a',1,1),(30,'A','a',3,1),(31,'A','a',2,1),(32,'A','a',5,1),(33,'A','a',7,1),(34,'A','a',8,1),(35,'A','a',6,1),(46,'A','a',5,2),(47,'A','a',4,2),(48,'A','a',3,2),(49,'A','a',6,2),(50,'A','a',1,2),(51,'A','a',10,2),(52,'A','a',7,2),(53,'A','a',8,2),(54,'A','a',9,2),(55,'A','a',2,2),(56,'A','a',4,3),(57,'A','a',1,3),(58,'A','a',5,3),(59,'A','a',2,3),(60,'A','a',7,3),(61,'A','a',10,3),(62,'A','a',3,3),(63,'A','a',9,3),(64,'A','a',6,3),(65,'A','a',8,3);
/*!40000 ALTER TABLE `hall_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Reserved','Paid','Expired','Canceled') NOT NULL DEFAULT 'Reserved',
  `user_id` int NOT NULL,
  `show_id` int NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `show_id_idx` (`show_id`),
  CONSTRAINT `fk_orders_show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (67,'2023-06-16 15:29:15','Reserved',1,50,NULL),(68,'2023-06-16 15:38:04','Reserved',1,50,NULL),(69,'2023-06-16 15:40:16','Paid',1,50,NULL),(70,'2023-06-16 15:41:44','Reserved',1,50,NULL),(71,'2023-06-16 15:46:12','Reserved',1,50,NULL),(72,'2023-06-16 15:47:20','Paid',1,50,NULL),(73,'2023-06-16 15:53:30','Paid',1,50,NULL),(74,'2023-06-16 15:53:34','Reserved',1,50,NULL),(75,'2023-06-16 16:00:32','Reserved',1,50,NULL),(76,'2023-06-17 05:29:05','Paid',1,64,NULL),(77,'2023-06-17 06:57:41','Canceled',1,64,NULL),(78,'2023-06-17 07:50:31','Paid',1,64,NULL),(79,'2023-06-17 07:51:05','Canceled',1,64,NULL),(80,'2023-06-17 07:54:07','Canceled',1,64,NULL),(81,'2023-06-17 07:54:24','Canceled',1,64,NULL),(82,'2023-06-17 07:54:53','Canceled',1,64,NULL),(83,'2023-06-17 11:24:11','Reserved',1,64,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total` int NOT NULL,
  `order_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id_idx` (`order_id`),
  CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (40,200,69,'2023-06-16 15:40:35'),(41,100,72,'2023-06-16 15:47:54'),(42,100,73,'2023-06-16 15:55:03'),(43,500,76,'2023-06-17 05:29:18'),(44,300,78,'2023-06-17 07:50:49');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `show_seat`
--

DROP TABLE IF EXISTS `show_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `show_seat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('NotReserved','Reserved','Paid') NOT NULL,
  `price` int NOT NULL,
  `hallSeat_id` int NOT NULL,
  `show_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hallSeat_id_idx` (`hallSeat_id`),
  KEY `new_order_id_idx` (`order_id`),
  KEY `show_id_idx` (`show_id`),
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `hallSeat_id` FOREIGN KEY (`hallSeat_id`) REFERENCES `hall_seat` (`id`),
  CONSTRAINT `show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show_seat`
--

LOCK TABLES `show_seat` WRITE;
/*!40000 ALTER TABLE `show_seat` DISABLE KEYS */;
INSERT INTO `show_seat` VALUES (11,'NotReserved',100,56,50,NULL),(12,'NotReserved',100,57,50,NULL),(13,'Paid',100,58,50,NULL),(14,'NotReserved',100,59,50,NULL),(15,'Reserved',100,60,50,NULL),(16,'NotReserved',100,61,50,NULL),(17,'NotReserved',100,62,50,NULL),(18,'Paid',100,63,50,69),(19,'Paid',100,64,50,72),(20,'Paid',100,65,50,69),(21,'NotReserved',500,46,53,NULL),(22,'NotReserved',500,47,53,NULL),(23,'NotReserved',500,48,53,NULL),(24,'NotReserved',500,49,53,NULL),(25,'NotReserved',500,50,53,NULL),(26,'NotReserved',500,51,53,NULL),(27,'NotReserved',500,52,53,NULL),(28,'NotReserved',500,53,53,NULL),(29,'NotReserved',500,54,53,NULL),(30,'NotReserved',500,55,53,NULL),(31,'NotReserved',2000,26,54,NULL),(32,'NotReserved',2000,27,54,NULL),(33,'NotReserved',2000,28,54,NULL),(34,'NotReserved',2000,29,54,NULL),(35,'NotReserved',2000,30,54,NULL),(36,'NotReserved',2000,31,54,NULL),(37,'NotReserved',2000,32,54,NULL),(38,'NotReserved',2000,33,54,NULL),(39,'NotReserved',2000,34,54,NULL),(40,'NotReserved',2000,35,54,NULL),(41,'NotReserved',300,56,63,NULL),(42,'NotReserved',300,57,63,NULL),(43,'NotReserved',300,58,63,NULL),(44,'NotReserved',300,59,63,NULL),(45,'NotReserved',300,60,63,NULL),(46,'NotReserved',300,61,63,NULL),(47,'NotReserved',300,62,63,NULL),(48,'NotReserved',300,63,63,NULL),(49,'NotReserved',300,64,63,NULL),(50,'NotReserved',300,65,63,NULL),(51,'NotReserved',300,26,64,NULL),(52,'Reserved',300,27,64,NULL),(53,'Reserved',300,28,64,83),(54,'NotReserved',300,29,64,NULL),(55,'NotReserved',300,30,64,NULL),(56,'NotReserved',300,31,64,NULL),(57,'NotReserved',300,32,64,NULL),(58,'Paid',300,33,64,NULL),(59,'Paid',300,34,64,78),(60,'Paid',300,35,64,76);
/*!40000 ALTER TABLE `show_seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_time` varchar(45) NOT NULL,
  `end_time` varchar(45) NOT NULL,
  `introduction` varchar(255) NOT NULL,
  `seat_chart` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `hall_id` int NOT NULL,
  `show_time` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hall_id_idx` (`hall_id`),
  CONSTRAINT `fk_shows_hall_id` FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
INSERT INTO `shows` VALUES (50,'superIdol','2023-06-15','2023-06-23','good','ftgRXZT.png','jAHfa-C.png',3,'2023-06-13T19:58'),(51,'superIdol','2023-06-15','2023-06-23','good','QHk0A4p.png','aDqlWhJ.png',3,'2023-07-12'),(52,'superIdol','2023-06-15','2023-06-23','good','FkbeVyN.png','HESa-Dt.png',3,'2023-07-12'),(53,'superIdol','2023-06-15','2023-06-23','good','jusGKK3.png','7Z051Y2.png',2,'2023-07-12'),(54,'superIdol','2023-06-15','2023-06-23','good','7bzq0Zj.png','eCo56qP.png',1,'2023-07-12'),(55,'superIdol','2023-06-15','2023-06-23','good','R7GHNyW.png','A8g4CT7.png',1,'2023-07-12'),(56,'superIdol','2023-06-15','2023-06-23','good','7pVMcdf.png','0prApQE.png',1,'2023-07-12'),(57,'superIdol','2023-06-15','2023-06-23','good','caVZB_V.png','ExKS9KU.png',1,'2023-07-12'),(58,'superIdol','2023-06-15','2023-06-23','good','A5_QM1J.png','aQ2OV4K.png',1,'2023-07-12'),(59,'superIdol','2023-06-15','2023-06-23','good','zRLIDXG.png','NVcYc8P.png',1,'2023-07-12'),(60,'superIdol','2023-06-15','2023-06-23','good','jcak0uw.png','P4oQ4ha.png',1,'2023-07-12'),(61,'superIdol','2023-06-15','2023-06-23','good','gNd--Xy.png','SoZxZjI.png',1,'2023-07-12'),(62,'superIdol','2023-06-15','2023-06-23','good','C3cGoTs.png','mgsw0r2.png',1,'2023-07-12'),(63,'idol','2023-06-16','2023-06-23','good show','Yv9jbOj.png','CurkxkX.png',3,'2023-07-12'),(64,'idol2','2023-06-13','2023-06-29','good','bowjHbg.png','sMTRNAw.png',1,'2023-06-13T19:58');
/*!40000 ALTER TABLE `shows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Karry','zhen860104@gmail.com','aaa','2023-05-19 08:55:44');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-18 19:34:50
