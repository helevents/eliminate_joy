/*
 Navicat Premium Data Transfer

 Source Server         : smile
 Source Server Type    : MySQL
 Source Server Version : 50716
 Source Host           : 127.0.0.1:3306
 Source Schema         : redrock

 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : 65001

 Date: 17/09/2017 19:47:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for funfest
-- ----------------------------
DROP TABLE IF EXISTS `funfest`;
CREATE TABLE `funfest` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `stuid` varchar(50) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `pScore` int(5) unsigned DEFAULT NULL,
  `tScore` int(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
