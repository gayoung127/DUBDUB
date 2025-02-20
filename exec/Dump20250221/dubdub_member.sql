-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 15.165.235.168    Database: dubdub
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_ok` bit(1) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `position` enum('AMATEUR','PRO') DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `provider` enum('KAKAO') NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'2025-02-19 14:07:06.928740','2025-02-21 01:14:36.411265','idkhm0728@naver.com',_binary '\0','강희민','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/idkhm0728@naver.com/PROFILE/b9aefb69-3f88-4a13-8952-8f23316aad8f.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6MSwiZW1haWwiOiJpZGtobTA3MjhAbmF2ZXIuY29tIiwiaWF0IjoxNzQwMDY4MDc2LCJleHAiOjE3NDAxNTQ0NzZ9.cBrQGsaQGnUJr0IO4zLpscr5w3I549d0Z-4GJ1XWA87EQTse_0jC3Y7aXVK6ibJ3'),(2,'2025-02-19 14:07:08.866193','2025-02-21 02:07:31.948494','ppoppo1217@naver.com',_binary '\0','박가영','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/ppoppo1217@naver.com/PROFILE/f746a99b-84b2-4a92-a6af-207ab5fdedff.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6MiwiZW1haWwiOiJwcG9wcG8xMjE3QG5hdmVyLmNvbSIsImlhdCI6MTc0MDA3MTI1MSwiZXhwIjoxNzQwMTU3NjUxfQ.bgUXjyIe2spVDGBdStSJi2gZcslsmPsBaP9tzEyPmSTK1RKl-xEr_qfaBauWoEls'),(3,'2025-02-19 14:08:47.748228','2025-02-21 07:25:27.073646','bang2451@naver.com',_binary '\0','현정','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/bang2451%40naver.com/PROFILE/j2profile.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6MywiZW1haWwiOiJiYW5nMjQ1MUBuYXZlci5jb20iLCJpYXQiOjE3NDAwOTAzMjcsImV4cCI6MTc0MDE3NjcyN30.NYoopXbz56DlJ1n5pULI7Xiy_cjZ73hRyXM41kv8HS_-v79w4VXaAFTPCmkswVWG'),(4,'2025-02-19 14:09:05.556485','2025-02-21 02:45:29.089885','jihunkim625@gmail.com',_binary '\0','지훈','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/jihunkim625%40gmail.com/PROFILE/image+(2).png','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6NCwiZW1haWwiOiJqaWh1bmtpbTYyNUBnbWFpbC5jb20iLCJpYXQiOjE3NDAwNzM1MjksImV4cCI6MTc0MDE1OTkyOX0.ipHreFH4xAUF0gLRzip3biaK5hNAs72k4FyIzU25-9NoNNy1BGgQIQflO2Uq9BZF'),(5,'2025-02-19 14:10:14.401672','2025-02-21 03:58:51.801049','lllop_l@nate.com',_binary '\0','이주은','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/lllop_l%40nate.com/PROFILE/TalkMedia_i_43108a40a071.jpeg.jpeg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6NSwiZW1haWwiOiJsbGxvcF9sQG5hdGUuY29tIiwiaWF0IjoxNzQwMDc3OTMxLCJleHAiOjE3NDAxNjQzMzF9.ff3ayzHxgj8yzC_7qHGH__iCMFIS8ARxeIhvUjPPyuBj-UsT7TirlRCUzMIn1zOY'),(6,'2025-02-19 14:22:33.967218','2025-02-19 14:22:53.475285','ghgghg96@naver.com',_binary '\0','혜경','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/ghgghg96@naver.com/PROFILE/1664b0e1-ba05-4d5d-a4fb-a8ce1e6e6a16.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6NiwiZW1haWwiOiJnaGdnaGc5NkBuYXZlci5jb20iLCJpYXQiOjE3Mzk5NDI1NzMsImV4cCI6MTc0MDAyODk3M30._eowOBnFS1XLZcOQcwG-wNc_0sh5GYJrVHSwZCBol_LdwS1oiFbWPBhmMBMRX-yt'),(7,'2025-02-19 14:34:35.272114','2025-02-21 00:45:29.673444','neul0516@daum.net',_binary '\0','김민지','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/neul0516%40daum.net/PROFILE/sally.png','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6NywiZW1haWwiOiJuZXVsMDUxNkBkYXVtLm5ldCIsImlhdCI6MTc0MDA2NjMyOSwiZXhwIjoxNzQwMTUyNzI5fQ.Jyi6ZVwLdCrJ7pGxO98EQeTvGZ6NmxqjghP40b_CuJ1HDeroHvmE4t5nheTGAu0Z'),(8,'2025-02-19 16:51:24.901298','2025-02-21 01:16:04.883805','ljh19980823@gmail.com',_binary '\0','이준희','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/ljh19980823@gmail.com/PROFILE/cc980c28-ecbd-4f01-9224-80218e75f654.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6OCwiZW1haWwiOiJsamgxOTk4MDgyM0BnbWFpbC5jb20iLCJpYXQiOjE3NDAwNjgxNjQsImV4cCI6MTc0MDE1NDU2NH0.6XdotfxeZPp33s28RXjJ2haDQW6OiPF9s33sAONb3Qfrl2f0Lh8dKwvr9CHoSgqg'),(9,'2025-02-21 00:25:31.506233','2025-02-21 00:26:25.641093','2000rkckd@gmail.com',_binary '\0','창순가','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/2000rkckd@gmail.com/PROFILE/a3b284b2-d843-4fa0-b4fb-e34e332dc9cb.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6OSwiZW1haWwiOiIyMDAwcmtja2RAZ21haWwuY29tIiwiaWF0IjoxNzQwMDY1MTg1LCJleHAiOjE3NDAxNTE1ODV9.fiSWthByAtER4yS6AwdFfDLBfx_2NAXg0P57LW01LsN23uTsYp64Z3H7jvTm-09r'),(10,'2025-02-21 00:44:02.330924','2025-02-21 01:19:30.671329','bigjung4@naver.com',_binary '\0','안녕','AMATEUR','https://bucket-dubdub.s3.ap-northeast-2.amazonaws.com/bigjung4@naver.com/PROFILE/aaa68623-1b24-486f-8712-faf104fc47df.jpg','KAKAO','eyJhbGciOiJIUzM4NCJ9.eyJpZCI6MTAsImVtYWlsIjoiYmlnanVuZzRAbmF2ZXIuY29tIiwiaWF0IjoxNzQwMDY4MzcwLCJleHAiOjE3NDAxNTQ3NzB9.yG5FngQ-fXhYQrydku-Agnl23ilMCN0BeoRifzYO6De3T-RjUlP8dws-KfBEMYWo');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  8:10:43
