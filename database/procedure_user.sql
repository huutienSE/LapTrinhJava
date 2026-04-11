-- sp_<action>_<entity>
USE aesp_database;

DROP PROCEDURE IF EXISTS  sp_register_user;
DELIMITER \\
CREATE PROCEDURE sp_register_user(IN i_username VARCHAR(50) , IN i_password VARCHAR(255) , IN i_email VARCHAR(50))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    IF i_username IS NULL
	THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Vui lòng nhập user name";
	END IF;
    
    IF EXISTS (SELECT 1
			   FROM user
               WHERE user_name = i_username)
	THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "user name đã tồn tại";
	END IF;
    
    IF i_password IS NULL
	THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Vui lòng nhập password";
	END IF;
    
    IF i_email IS NULL
	THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Vui lòng nhập email";
	END IF;
    
    IF in_email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'email không hợp lệ';
    END IF;
    
    IF EXISTS (SELECT 1
			   FROM user
               WHERE email = i_email)
	THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "email đã tồn tại";
	END IF;
    
    START TRANSACTION;
    
    INSERT INTO user(user_name , password_hash , email , status)
    VALUES (i_username , i_password , i_email , 'ACTIVE');
    
    COMMIT;
    
END \\

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_changepassword_user
DELIMITER \\
CREATE PROCEDURE sp_changepassword_user(IN i_userid_user INT , IN i_password VARCHAR(255))
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    IF NOT EXISTS (SELECT 1
				   FROM user
                   WHERE user_id = i_userid_user)
	THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "User không tồn tại";
	END IF;
		
	IF i_password IS NULL OR
    i_password = ''
    THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Password moi khong hop le";
	END IF;
    
	IF EXISTS (SELECT 1
			   FROM user
               WHERE user_id = i_userid_user AND password_hash = i_password)
	THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "Password giống với password cũ";
	END IF;
	
    START TRANSACTION;
    
    UPDATE user 
    SET 
		password_hash = i_password
	WHERE user_id = i_userid_user;
    
    COMMIT;
    
END \\

DELIMITER ;
    
DROP PROCEDURE IF EXISTS disable_user;

DELIMITER \\
CREATE PROCEDURE disable_user(IN i_userid_user INT)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        RESIGNAL;
	END;
    
    IF NOT EXISTS (SELECT 1
				   FROM user
                   WHERE user_id = i_userid_user)
	THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = "User không tồn tại";
	END IF;
    
    START TRANSACTION;
    
    UPDATE user 
    SET 
		status = "DISABLE"
	WHERE user_id = i_userid_user;
    
    COMMIT;
    
END \\

DELIMITER ;

		
    
