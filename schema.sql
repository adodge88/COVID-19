-- DROP TABLE covid19;
CREATE TABLE covid19 (
	id 	      		SERIAL PRIMARY KEY,
    id_loc          INT,
	province_state 	VARCHAR(50),
	country_region 	VARCHAR(50),
	lat 			FLOAT NOT NULL,
	long 			FLOAT NOT NULL,
	date			DATE NOT NULL,
	confirmed_to_date	INT,
	new_confirmed  		INT,
	deaths_to_date		INT,
	new_deaths			INT,
	recovered_to_date	INT,
	new_recovered 		INT

);

SELECT * FROM covid19;