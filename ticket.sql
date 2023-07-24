-- MySQL dump 10.13  Distrib 8.0.33, for Linux (aarch64)
--
-- Host: database-1.ck9i9r1xarox.ap-northeast-1.rds.amazonaws.com    Database: ticket
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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `show_id` int NOT NULL,
  `image` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,69,'MueHb5D.jpeg');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall_seat`
--

LOCK TABLES `hall_seat` WRITE;
/*!40000 ALTER TABLE `hall_seat` DISABLE KEYS */;
INSERT INTO `hall_seat` VALUES (26,'A','a',9,1),(27,'A','a',10,1),(28,'A','a',4,1),(29,'A','a',1,1),(30,'A','a',3,1),(31,'A','a',2,1),(32,'A','a',5,1),(33,'A','a',7,1),(34,'A','a',8,1),(35,'A','a',6,1),(46,'A','a',5,2),(47,'A','a',4,2),(48,'A','a',3,2),(49,'A','a',6,2),(50,'A','a',1,2),(51,'A','a',10,2),(52,'A','a',7,2),(53,'A','a',8,2),(54,'A','a',9,2),(55,'A','a',2,2),(56,'A','a',4,3),(57,'A','a',1,3),(58,'A','a',5,3),(59,'A','a',2,3),(60,'A','a',7,3),(61,'A','a',10,3),(62,'A','a',3,3),(63,'A','a',9,3),(64,'A','a',6,3),(65,'A','a',8,3),(66,'A','b',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=514 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (93,'2023-06-27 16:20:41','Canceled',3,69,NULL),(94,'2023-06-27 16:21:25','Paid',3,69,NULL),(95,'2023-06-27 16:26:29','Canceled',4,69,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show_seat`
--

LOCK TABLES `show_seat` WRITE;
/*!40000 ALTER TABLE `show_seat` DISABLE KEYS */;
INSERT INTO `show_seat` VALUES (101,'NotReserved',1000,56,69,NULL),(102,'NotReserved',1000,57,69,NULL),(103,'NotReserved',1000,58,69,NULL),(104,'NotReserved',1000,59,69,NULL),(105,'NotReserved',1000,60,69,NULL),(106,'NotReserved',1000,61,69,NULL),(107,'NotReserved',1000,62,69,NULL),(108,'NotReserved',1000,63,69,NULL),(109,'NotReserved',1000,64,69,NULL),(110,'NotReserved',1000,65,69,NULL),(121,'NotReserved',500,26,74,NULL),(122,'NotReserved',500,27,74,NULL),(123,'NotReserved',500,28,74,NULL),(124,'NotReserved',500,29,74,NULL),(125,'NotReserved',500,30,74,NULL),(126,'NotReserved',500,31,74,NULL),(127,'NotReserved',500,32,74,NULL),(128,'NotReserved',500,33,74,NULL),(129,'NotReserved',500,34,74,NULL),(130,'NotReserved',500,35,74,NULL),(131,'NotReserved',1000,46,75,NULL),(132,'NotReserved',1000,47,75,NULL),(133,'NotReserved',1000,48,75,NULL),(134,'NotReserved',1000,49,75,NULL),(135,'NotReserved',1000,50,75,NULL),(136,'NotReserved',1000,51,75,NULL),(137,'NotReserved',1000,52,75,NULL),(138,'NotReserved',1000,53,75,NULL),(139,'NotReserved',1000,54,75,NULL),(140,'NotReserved',1000,55,75,NULL),(141,'NotReserved',3000,56,76,NULL),(142,'NotReserved',3000,57,76,NULL),(143,'NotReserved',3000,58,76,NULL),(144,'NotReserved',3000,59,76,NULL),(145,'NotReserved',3000,60,76,NULL),(146,'NotReserved',3000,61,76,NULL),(147,'NotReserved',3000,62,76,NULL),(148,'NotReserved',3000,63,76,NULL),(149,'NotReserved',3000,64,76,NULL),(150,'NotReserved',3000,65,76,NULL),(151,'NotReserved',700,46,77,NULL),(152,'NotReserved',700,47,77,NULL),(153,'NotReserved',700,48,77,NULL),(154,'NotReserved',700,49,77,NULL),(155,'NotReserved',700,50,77,NULL),(156,'Paid',700,51,77,509),(157,'NotReserved',700,52,77,NULL),(158,'NotReserved',700,53,77,NULL),(159,'Paid',700,54,77,510),(160,'NotReserved',700,55,77,NULL),(161,'NotReserved',300,46,73,NULL),(162,'NotReserved',300,47,73,NULL),(163,'NotReserved',300,48,73,NULL),(164,'NotReserved',300,49,73,NULL),(165,'NotReserved',300,50,73,NULL),(166,'NotReserved',300,51,73,NULL),(167,'NotReserved',300,52,73,NULL),(168,'NotReserved',300,53,73,NULL),(169,'NotReserved',300,54,73,NULL),(170,'NotReserved',300,55,73,NULL);
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
  `singer_introduction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hall_id_idx` (`hall_id`),
  CONSTRAINT `fk_shows_hall_id` FOREIGN KEY (`hall_id`) REFERENCES `hall` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
INSERT INTO `shows` VALUES (69,'告五人第一次新世界巡迴演唱會','2023-06-26','2023-07-05','宇宙的有趣，帶你飛到高雄巨蛋去！','oh8mwgn.jpeg','G4g__fq.jpeg',3,'2023-08-31T18:00',NULL),(73,'劉若英-飛行日 Final Call','2023-07-25','2023-08-24','時間是用飛的！你還在等嗎？飛行日 離家 就是為了回家。起飛 到 降落。每一刻的我們　都在累積回憶的哩程。每一天的我們　都在尋找理想的旅行。\"每一個飛行日\r\n都是我們見面的日子\" ——劉若英','','',2,'2023-08-31T13:22','劉若英受到廣大歌迷的歡迎，也是一名創作人，作曲亦寫詞， 經典的傳唱歌曲有《為愛癡狂》、翻唱日本著名歌唱組合Kiroro的《很愛很愛你（長い間）》、《後來（未來へ）》，以及《成全》、《一輩子的孤單》、《當愛在靠近》、《我們沒有在一起》等。'),(74,'陳奕迅FEAR AND DREAMS','2023-07-17','2023-07-27','演唱會主題「Fear and Dreams」是Eason在幾年前就已定好，經過這幾年他並不覺得心中所想有改變，所以仍沿用這個名稱，而FEAR AND DREAMS代表著什麼呢？Eason直言:「每人感受不同，最好現場觀看後才作解讀。」這次的演唱會海報，Eason望向兩個不同方向，中間更有色彩繽紛的鮮花恣意綻放，著名設計師朱祖兒用「Fear and Dreams」主題，以不同手法為大家帶來煥然一新的感覺，Eason也已迫不及待要帶著最新的巡演去各地方與歌迷朋友們見面。','','',1,'2023-07-28T22:10','陳奕迅曾被美國《時代雜誌》形容為影響香港樂壇風格的人物。他是千禧年代中，具代表性的粵語流行音樂男歌手之一；亦是香港樂壇繼香港四大天王後，其中一個較成功的男歌手；獲得「新一代歌神」之稱號。2010年，陳奕迅入選全球華人音樂殿堂華語金曲獎「30年經典評選」，成為1990年代出道歌手唯一代表。'),(75,'酷玩樂團2023高雄演唱會','2023-07-19','2023-08-15','還記得2017年那一夜在大雨中的感動與激情嗎?\r\n\r\n睽違六年!他們回來了!\r\n\r\n史上最暢銷的樂團之一 英倫搖滾神團Coldplay首度降臨高雄。全球最受矚目，前所未見，以永續和減碳為訴求的話題巡演。讓你的每一個跳動與尖叫都成為音樂宇宙中的能量。2023年11月11日、12日。高雄國家體育場，與Coldplay相約星際漫遊。','','',2,'2023-09-14T22:10','連續兩年獲得最佳另類搖滾專輯酷玩首張專輯《Parachutes》好評不斷，不但榮獲英國21世紀20大最暢銷專輯第12名，也在2001年以新人之姿抱走葛萊美「最佳另類搖滾專輯」。隔年酷玩火速發行第二張大碟《A Rush Of Blood To The Head》，多首暢銷單曲讓樂團聲勢推向高峰，並又一次拿到葛萊美「最佳另類搖滾專輯」，單曲《In My Place》也獲得「最佳搖滾組合」，酷玩成為21世紀最受矚目的樂團。'),(76,'MAN WITH A MISSION','2023-07-25','2023-08-24','正在瘋狂地進行世界巡迴的狼人樂團，在今年初接受媒體訪問時提到，四年來第一次的世界巡迴，團員們認為2023年最重要的mission，就是在世界各地舉辦巡迴演唱會，不管是很久沒去的國家，或是初次造訪的國家。所以從年初一直到現在，走過了日本各城市/歐洲/北美洲，終於迎來亞洲巡迴。','','',3,'2023-10-18T22:00','其樂團那明顯到不行的狼氣特色，成員設定為外觀為帶著狼的頭套，樂隊名意為“背負使命的男人”，簡稱為MWAM、マンウィズ等。此外還被人們稱為“狼人樂團”。'),(77,'Westlife The Wild Dreams','2023-07-26','2023-10-25','西城男孩台北安可場11月狂野登場！繼2023年初的高雄完售場。今年底，西城男孩將帶著首首金曲重返台北。連續兩晚，台北流行音樂中心。再次回味所有意猶未盡的感動！','','',2,'2023-11-22T22:00','1999年至2007年間，Westlife有14張單曲唱片在英國高據首位；其數量排名歷史第四位，僅次於貓王 披頭四 麥可傑克遜。西城男孩也是英國流行音樂史上唯一一支頭七支單曲空降榜首的樂隊。他們也是唯一一個在英國拿過4次「年度最佳專輯」的組合。西城男孩在世界範圍內售出超過4000萬張專輯，其中包括7張超白金專輯。');
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'aa','aa@gmail.com','$2b$07$IdwJ.5NN96NUFYCFdvebtOZxemmy46Xs/EreSqD8tYFe4SJScqU1W','2023-06-27 14:03:51'),;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-24  3:00:35
