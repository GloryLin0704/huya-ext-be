# Host: localhost  (Version: 5.5.53)
# Date: 2019-08-08 11:20:16
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "anchor"
#

DROP TABLE IF EXISTS `anchor`;
CREATE TABLE `anchor` (
  `anchorID` varchar(110) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `defaultItems` varchar(255) DEFAULT NULL,
  `chooesItems` varchar(255) DEFAULT NULL,
  `votes` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `success` varchar(255) DEFAULT NULL,
  `fail` varchar(255) DEFAULT NULL,
  `tick` varchar(255) DEFAULT NULL,
  `tickStatus` varchar(255) DEFAULT NULL,
  `lastOk` int(11) DEFAULT '0',
  `lastFail` int(11) DEFAULT '0',
  `chanceStatus` int(11) DEFAULT '0',
  `lastStatus` int(11) DEFAULT '0',
  `successChoose` varchar(255) DEFAULT NULL,
  `failChoose` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "anchor"
#

/*!40000 ALTER TABLE `anchor` DISABLE KEYS */;
/*!40000 ALTER TABLE `anchor` ENABLE KEYS */;

#
# Structure for table "audience"
#

DROP TABLE IF EXISTS `audience`;
CREATE TABLE `audience` (
  `anchorID` varchar(255) DEFAULT NULL,
  `votes` varchar(255) DEFAULT NULL,
  `lastVotes` varchar(255) DEFAULT NULL,
  `allVotes` varchar(255) DEFAULT NULL,
  `allAudience` longtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

#
# Data for table "audience"
#

/*!40000 ALTER TABLE `audience` DISABLE KEYS */;
/*!40000 ALTER TABLE `audience` ENABLE KEYS */;
