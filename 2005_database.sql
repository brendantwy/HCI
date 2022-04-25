-- -------------------------------------------------------------
-- TablePlus 4.5.0(396)
--
-- https://tableplus.com/
--
-- Database: 2005_database
-- Generation Time: 2021-12-05 22:02:54.1850
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `calendar`;
CREATE TABLE `calendar` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `event_details` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `event_remarks` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  UNIQUE KEY `event_id` (`event_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `claims`;
CREATE TABLE `claims` (
  `claims_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `claims_type` varchar(255) NOT NULL DEFAULT 'NULL',
  `claims_amount` int(11) NOT NULL,
  `claims_date` datetime NOT NULL,
  `claims_approver_name` varchar(255) DEFAULT NULL,
  `claims_remark` varchar(255) DEFAULT NULL,
  `claims_file` varchar(255) DEFAULT NULL,
  `claims_last_updated` datetime DEFAULT NULL,
  `claims_status` varchar(20) DEFAULT NULL,
  UNIQUE KEY `claims_id` (`claims_id`),
  KEY `claims_ibfk_1` (`employee_id`),
  CONSTRAINT `claims_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(255) NOT NULL,
  `employee_password` varchar(255) NOT NULL,
  `employee_department` varchar(255) DEFAULT NULL,
  `employee_number` varchar(255) DEFAULT NULL,
  `employee_email` varchar(255) DEFAULT NULL,
  `employee_position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `leaves`;
CREATE TABLE `leaves` (
  `leaves_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `leaves_status` varchar(255) DEFAULT NULL,
  `leaves_file` varchar(255) DEFAULT NULL,
  `leaves_approver_name` varchar(255) DEFAULT NULL,
  `leaves_end_time` varchar(255) DEFAULT NULL,
  `leaves_end_date` date DEFAULT NULL,
  `leaves_start_time` varchar(255) DEFAULT NULL,
  `leaves_start_date` date DEFAULT NULL,
  `leaves_type` varchar(255) DEFAULT NULL,
  `leaves_remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`leaves_id`),
  KEY `employee_id` (`employee_id`) USING BTREE,
  CONSTRAINT `Leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

INSERT INTO `calendar` (`event_id`, `employee_id`, `event_details`, `start_date`, `end_date`, `event_remarks`, `start_time`, `end_time`) VALUES
(4, 15, 'Event', '2021-12-06', '2021-12-06', '', 'AM', 'PM'),
(5, 14, 'Event', '2021-12-08', '2021-12-08', '', 'AM', 'PM'),
(6, 14, 'Event', '2021-12-07', '2021-12-07', '', 'AM', 'PM'),
(7, 13, 'Event', '2021-12-11', '2021-12-11', '', 'AM', 'PM'),
(8, 13, 'Event', '2021-12-11', '2021-12-11', '', 'AM', 'PM'),
(9, 12, 'Event', '2021-12-12', '2021-12-12', '', 'AM', 'PM'),
(10, 12, 'Event', '2021-12-11', '2021-12-11', '', 'AM', 'PM'),
(11, 11, 'Event', '2021-12-11', '2021-12-11', '', 'AM', 'PM'),
(12, 11, 'Event', '2021-12-11', '2021-12-11', '', 'AM', 'PM'),
(13, 10, 'Event', '2021-12-13', '2021-12-13', '', 'AM', 'PM'),
(14, 10, 'Event', '2021-12-13', '2021-12-13', '', 'AM', 'PM'),
(15, 9, 'Event', '2021-12-14', '2021-12-14', '', 'AM', 'PM'),
(16, 9, 'Event', '2021-12-14', '2021-12-14', '', 'AM', 'PM'),
(17, 8, 'Event', '2021-12-15', '2021-12-15', '', 'AM', 'PM'),
(18, 8, 'Event', '2021-12-15', '2021-12-15', '', 'AM', 'PM'),
(19, 7, 'Event', '2021-12-18', '2021-12-18', '', 'AM', 'PM'),
(20, 7, 'Event', '2021-11-18', '2021-11-18', '', 'AM', 'PM'),
(21, 6, 'Event', '2021-11-18', '2021-11-18', '', 'AM', 'PM'),
(22, 6, 'Event', '2021-11-19', '2021-11-19', '', 'AM', 'PM'),
(23, 5, 'Event', '2021-11-18', '2021-11-18', '', 'AM', 'PM'),
(24, 5, 'Event', '2021-11-19', '2021-11-19', '', 'AM', 'PM'),
(25, 4, 'Event', '2021-11-20', '2021-11-20', '', 'AM', 'PM'),
(26, 4, 'Event', '2021-11-20', '2021-11-20', '', 'AM', 'PM'),
(27, 3, 'Event', '2021-11-20', '2021-11-20', '', 'AM', 'PM'),
(28, 3, 'Event', '2021-11-19', '2021-11-19', '', 'AM', 'PM'),
(29, 2, 'Event', '2021-11-20', '2021-11-20', '', 'AM', 'PM'),
(30, 2, 'Event', '2021-11-20', '2021-11-20', '', 'AM', 'PM'),
(32, 1, 'Event', '2021-12-21', '2021-12-21', '', 'AM', 'PM'),
(53, 1, 'Public Holiday', '2021-12-01', '2021-12-01', ' ', 'AM', 'PM'),
(55, 1, 'Public Holiday', '2021-12-25', '2021-12-25', '', 'AM', 'PM'),
(61, 1, 'holiday!!!!', '2021-12-21', '2021-12-24', ' ', 'AM', 'PM'),
(62, 1, 'Holiday!!', '2021-11-13', '2021-11-13', ' ', 'AM', 'PM'),
(74, 1, 'Birthday leave', '2021-12-01', '2021-11-04', NULL, 'AM', 'PM'),
(76, 1, 'Audit HR', '2021-11-30', '2021-12-04', ' ', 'AM', 'PM');

INSERT INTO `claims` (`claims_id`, `employee_id`, `claims_type`, `claims_amount`, `claims_date`, `claims_approver_name`, `claims_remark`, `claims_file`, `claims_last_updated`, `claims_status`) VALUES
(1, 1, 'Dental', 250, '2021-11-10 00:00:00', 'Daniel', 'Scaling & Polishing', NULL, '2021-11-10 00:00:00', 'APPROVED'),
(2, 1, 'Transport', 30, '2021-11-11 00:00:00', 'Daniel', 'Office to Office', NULL, '2021-11-11 00:00:00', 'APPROVED'),
(3, 2, 'Dental', 250, '2021-11-10 00:00:00', 'Daniel', 'Scaling & Polishing', NULL, '2021-11-10 00:00:00', 'APPROVED'),
(4, 2, 'Transport', 30, '2021-11-11 00:00:00', 'Daniel', 'Office to Office', NULL, '2021-11-11 00:00:00', 'PENDING'),
(5, 3, 'Dental', 250, '2021-11-10 00:00:00', 'Daniel', 'Scaling & Polishing', NULL, '2021-11-10 00:00:00', 'PENDING'),
(6, 3, 'Transport', 30, '2021-11-11 00:00:00', 'Daniel', 'Office to Office', NULL, '2021-11-11 00:00:00', 'PENDING'),
(15, 1, 'Medical', 100, '2021-11-17 00:00:00', 'Daniel', 'Fever', 'http://localhost:5000/claims/un.png', '2021-11-14 06:03:13', 'PENDING'),
(16, 1, 'Medical', 100, '2021-11-19 00:00:00', 'Daniel', 'Fever', 'http://localhost:5000/claims/car.png', '2021-11-29 00:00:00', 'PENDING'),
(20, 4, 'Transport', 30, '2021-11-18 00:00:00', 'Adam', 'Office to office', 'http://localhost:5000/claims/drophuman.png', '2021-11-17 06:27:59', 'PENDING'),
(27, 1, 'Medical', 30, '2021-12-06 00:00:00', 'Daniel', 'fever', 'http://localhost:5000/claims/un.png', '2021-12-05 09:58:18', 'PENDING');

INSERT INTO `employee` (`employee_id`, `employee_name`, `employee_password`, `employee_department`, `employee_number`, `employee_email`, `employee_position`) VALUES
(1, 'Adam', 'password', 'Human Resource', '91234567', 'Adam@hr.com', 'Manager'),
(2, 'Betty', 'password2', 'Accounting', '98765432', 'Betty@hr.com', 'Manager'),
(3, 'Claire', 'password3', 'Accounting', '95434354', 'Claire@hr.com', 'Intern'),
(4, 'Daniel', 'password4', 'Human Resource', '91231212', 'Daniel@hr.com', 'Manager'),
(5, 'Ezekiel', 'password5', 'IT', NULL, NULL, NULL),
(6, 'Fred', 'password6', 'IT', NULL, NULL, NULL),
(7, 'George', 'password7', 'Marketing', NULL, NULL, NULL),
(8, 'Hilda', 'password8', 'Marketing', NULL, NULL, NULL),
(9, 'Isaac', 'password9', 'Sales', NULL, NULL, NULL),
(10, 'Juliet', 'password10', 'Marketing', NULL, NULL, NULL),
(11, 'Kimberly', 'password11', 'Human Resource', NULL, NULL, NULL),
(12, 'Larry', 'password12', 'Accounting', NULL, NULL, NULL),
(13, 'Maria', 'password13', 'IT', NULL, NULL, NULL),
(14, 'Neo', 'password14', 'Human Resource', NULL, NULL, NULL),
(15, 'Ophelia', 'password15', 'Sales', NULL, NULL, NULL),
(16, 'Paul', 'password16', 'Sales', NULL, NULL, NULL);

INSERT INTO `leaves` (`leaves_id`, `employee_id`, `leaves_status`, `leaves_file`, `leaves_approver_name`, `leaves_end_time`, `leaves_end_date`, `leaves_start_time`, `leaves_start_date`, `leaves_type`, `leaves_remarks`) VALUES
(1, 1, 'APPROVED', NULL, 'Daniel', 'PM', '2021-11-27', 'AM', '2021-11-25', 'Childcare', NULL),
(2, 2, 'REJECTED', NULL, 'Daniel', 'PM', '2021-11-09', 'AM', '2021-11-01', 'Vacation', NULL),
(4, 4, 'APPROVED', NULL, 'Daniel', 'PM', '2021-11-10', 'AM', '2021-11-09', 'Vacation', NULL),
(5, 5, 'PENDING', NULL, 'Daniel', 'PM', '2021-11-19', 'AM', '2021-11-15', 'Vacation', NULL),
(24, 1, 'PENDING', 'http://localhost:5000/leaves/giphy.gif', 'Daniel', 'PM', '2021-12-06', 'AM', '2021-12-02', 'Annual Leave', 'Overseas leave'),
(29, 1, 'PENDING', 'http://localhost:5000/leaves/leave request.png', 'Daniel', 'PM', '2021-12-01', 'AM', '2021-12-01', 'Medical', NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;