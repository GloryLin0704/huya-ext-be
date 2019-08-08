# Host: localhost  (Version: 5.5.53)
# Date: 2019-08-07 17:45:03
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "anchor"
#

DROP TABLE IF EXISTS `anchor`;
CREATE TABLE `anchor` (
  `anchorID` varchar(110) NOT NULL DEFAULT '',
  `curPath` longtext,
  `status` varchar(2) DEFAULT NULL,
  `time` varchar(110) DEFAULT NULL,
  `gameTime` varchar(255) DEFAULT NULL,
  `rank` longtext,
  `isPaint` int(11) DEFAULT '0'
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
  `allPath` longtext,
  `allAudience` longtext
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

#
# Data for table "audience"
#

/*!40000 ALTER TABLE `audience` DISABLE KEYS */;
/*!40000 ALTER TABLE `audience` ENABLE KEYS */;
