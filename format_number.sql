DELIMITER $$
DROP FUNCTION IF EXISTS util.format_number;
CREATE DEFINER = 'execution_read'@'127.0.0.1' FUNCTION util.format_number
(
ip_number TEXT -- Feeds in and returns TEXT here, as aggregates can return numbers larger than BIGINT UNSIGNED
)
RETURNS TEXT
COMMENT 'Takes a number value, and converts it to a human readable format.'
DETERMINISTIC
NO SQL
RETURN CASE
		WHEN ip_number IS NULL THEN NULL
		WHEN ip_number >= 1000000000000000 THEN CONCAT(ROUND(ip_number / 1000000000000000, 2), ' P')
		WHEN ip_number >= 1000000000000 THEN CONCAT(ROUND(ip_number / 1000000000000, 2), ' T')
		WHEN ip_number >= 1000000000 THEN CONCAT(ROUND(ip_number / 1000000000, 2), ' G')
		WHEN ip_number >= 1000000 THEN CONCAT(ROUND(ip_number / 1000000, 2), ' M')
		WHEN ip_number >= 1000 THEN CONCAT(ROUND(ip_number / 1000, 2), ' K')
		ELSE ROUND(ip_number, 2)
	END;
$$
DELIMITER ;
