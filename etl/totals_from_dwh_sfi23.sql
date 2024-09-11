--=========================================================================================
--Interim step to load data into etl_interm_finance_dax
DELETE FROM etl_interm_finance_dax;
INSERT INTO etl_interm_finance_dax (
	transdate, invoiceid, scheme,
	fund, marketingyear, "month",
	quarter, TRANSACTION_AMOUNT, agreementreference,
	siti_invoice_id, claim_id, PAYMENT_REF
) 
SELECT transdate, invoiceid, scheme::integer,
	fund, marketingyear::integer, "month", 
	quarter,
	-- lineamountmstgbp AS TRANSACTION_AMOUNT,
	CAST(
		COALESCE(
		(SELECT CAST((value - lag) / -100.00 AS DECIMAL(10,2)) AS value 
		FROM (
			SELECT value, COALESCE(LAG(value, 1) OVER ( ORDER BY S.settlement_date ASC),0) AS lag,
			S.reference
			FROM etl_stage_settlement S 
			WHERE S.invoice_number = D.invoiceid
			ORDER BY value	
		) B WHERE B.reference = D.settlementvoucher),
		lineamountmstgbp) AS DECIMAL(10,2)) AS TRANSACTION_AMOUNT,
	agreementreference, substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS siti_invoice_id,
	substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1) )::integer AS claim_id,
	settlementvoucher AS PAYMENT_REF
	FROM etl_stage_finance_dax D
	WHERE LENGTH(accountnum) = 10 
	--accounttype = 2 
	AND invoiceid LIKE 'S%Z%';
	-- (invoiceid LIKE 'S%Z%' OR invoiceid LIKE 'X%Z%'); No statements required for manual payments

--=========================================================================================
--Interim step to load data into etl_interm_calc_org
DELETE FROM etl_interm_calc_org;
INSERT INTO etl_interm_calc_org 
	(calculation_id, sbi, frn, application_id, calculation_date, id_clc_header)
SELECT CD.calculation_id, BAC.sbi, BAC.frn,
	CD.application_id, CD.calculation_dt, CD.id_clc_header
	FROM etl_stage_apps_payment_notification APN
	INNER JOIN etl_stage_css_contract_applications CLAIM ON CLAIM.application_id = APN.application_id AND CLAIM.data_source_s_code = 'CAPCLM'
	INNER JOIN etl_stage_css_contract_applications APP ON APP.contract_id = CLAIM.contract_id AND APP.data_source_s_code = '000001'
	INNER JOIN etl_interm_finance_dax D ON D.claim_id = CLAIM.application_id
	INNER JOIN etl_stage_finance_dax SD ON SD.invoiceid = D.invoiceid
	INNER JOIN etl_stage_business_address_contact_v BAC ON BAC.frn = SD.custvendac
	INNER JOIN etl_stage_calculation_details CD ON CD.application_id = APN.application_id 
		AND CD.id_clc_header = APN.id_clc_header
		AND CD.ranked = 1
	WHERE APN.notification_flag = 'P' 
	GROUP BY CD.calculation_id, BAC.sbi, BAC.frn, 
	CD.application_id, CD.calculation_dt, CD.id_clc_header;

--=========================================================================================
--Interim step to load data into etl_interm_org
DELETE FROM etl_interm_org;
INSERT INTO etl_interm_org (
	sbi, addressLine1, addressLine2,
	addressLine3, city, county,
	postcode, emailaddress, frn,
	"name", updated
)
SELECT O.sbi, A.business_address1 as addressLine1, A.business_address2 as addressLine2,
	A.business_address3 as addressLine3, A.business_city as city, A.business_county as county, 
	A.business_post_code as postcode, A.business_email_addr as emailaddress, A.frn, 
	A. business_name as name, TO_DATE(O.last_updated_on, 'DD-MON-YY') as updated 
	FROM etl_stage_organisation O 
	LEFT JOIN etl_stage_business_address_contact_v A ON A.sbi = O.sbi;

--=========================================================================================
--Interim step to load data into etl_interm_application_claim
DELETE FROM etl_interm_application_claim;
INSERT INTO etl_interm_application_claim (
	contract_id, claim_id, agreement_id
)
SELECT cc.contract_id, ca.application_id as claim_id, ca.application_id as agreement_id
	FROM etl_stage_css_contract_applications cl
	LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
	LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id
	WHERE cl.data_source_s_code = 'CAPCLM'
	GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id;

--=========================================================================================
--Interim step to load data into etl_interm_application_contract
DELETE FROM etl_interm_application_contract;
INSERT INTO etl_interm_application_contract (
	contract_id, agreementStart, agreementEnd,
	application_id
)
	SELECT cc.contract_id, cc.start_dt AS agreementStart, cc.end_dt AS agreementEnd,
	ca.application_id
	FROM etl_stage_css_contract_applications cl
	LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
	LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id AND cc.contract_state_s_code = '000020'
	WHERE cl.data_source_s_code = 'CAPCLM'
	GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id;

--=========================================================================================
--Interim step to load data into etl_interm_application_payment
DELETE FROM etl_interm_application_payment;
INSERT INTO etl_interm_application_payment (
	application_id, invoice_number, invoice_id,
	id_clc_header
)
SELECT CL.application_id, APN.invoice_number,
	substring(APN.invoice_number, position('A' in APN.invoice_number) + 2, length(APN.invoice_number) - (position('A' in invoice_number) + 1))::integer AS invoice_id,
	id_clc_header
	FROM etl_stage_apps_payment_notification APN
	INNER JOIN etl_stage_css_contract_applications CA ON APN.application_id = CA.application_id
	INNER JOIN etl_stage_css_contract_applications CL ON CA.contract_id = CL.contract_id
	WHERE CA.data_source_s_code = 'CAPCLM' AND
	CL.data_source_s_code = '000001' AND
	APN.notification_flag = 'P';
	
--=========================================================================================
--Interim step to load data into etl_interm_total
DELETE FROM etl_interm_total;
INSERT INTO etl_interm_total (
	payment_ref, quarter, total_amount,
	transdate
)
SELECT payment_ref, 
	D.quarter,
	SUM(transaction_amount) * -1 as total_amount,
	transdate 
	FROM etl_interm_finance_dax D 
	WHERE D.payment_ref 
	LIKE 'PY%' 
	--AND D.agreementreference = ''
	--AND D.transaction_amount < 0
	GROUP BY transdate,
	quarter, 
	payment_ref
	ORDER BY payment_ref;

--=========================================================================================
--Final step to load data into dax
DELETE FROM Dax;
INSERT INTO dax (
	"paymentReference", "calculationId", "paymentPeriod",
	"paymentAmount", "transactionDate"
)
SELECT T.payment_ref AS paymentReference, T.calculation_id AS calculationId, T.quarter AS paymentPeriod, 
	T.total_amount AS paymentAmount, T.transdate AS transactionDate 
	FROM etl_interm_total T;

--=========================================================================================
--Interim step to load data into etl_interm_total_claim
DELETE FROM etl_interm_total_claim;
INSERT INTO etl_interm_total_claim (claim_id, payment_ref)
SELECT
	(SELECT claim_id FROM etl_interm_finance_dax WHERE payment_ref = T.payment_ref LIMIT 1) as application_id,
	T.payment_ref
	FROM etl_interm_total T;

--=========================================================================================
--Interim step to load data into etl_interm_paymentref_application
DELETE FROM etl_interm_paymentref_application;
INSERT INTO etl_interm_paymentref_application(payment_ref, application_id)
	SELECT T.payment_ref, 
	(SELECT claim_id AS application_id FROM etl_interm_finance_dax D WHERE D.payment_ref = T.payment_ref LIMIT 1)
	FROM etl_interm_total T;

--=========================================================================================
--Interim step to load data into etl_interm_paymentref_org
DELETE FROM etl_interm_paymentref_org;
INSERT INTO etl_interm_paymentref_org (payment_ref, sbi, frn)
SELECT PA.payment_ref, O.sbi, O.frn::bigint 
	FROM etl_interm_paymentref_application PA 
	INNER JOIN etl_interm_calc_org O ON O.application_id = PA.application_id
	GROUP BY PA.payment_ref, O.sbi, O.frn;

-- SELECT PA.payment_ref, V.sbi, V.frn FROM etl_interm_paymentref_application PA
-- 	INNER JOIN etl_stage_finance_dax D ON PA.payment_ref = D.settlementvoucher
-- 	INNER JOIN etl_stage_business_address_contact_v V ON V.frn = D.custvendac
-- 	GROUP BY PA.payment_ref, V.sbi, V.frn;

--=========================================================================================
--Interim step to load data into etl_interm_paymentref_agreement_dates
DELETE FROM etl_interm_paymentref_agreement_dates;
INSERT INTO etl_interm_paymentref_agreement_dates (
	payment_ref, agreementStart, agreementEnd
)
SELECT DA.payment_ref,
	(SELECT agreementStart FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1),
	(SELECT agreementEnd FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1)
	FROM etl_interm_finance_dax DA
	INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = DA.claim_id
	GROUP BY DA.payment_ref, CA.contract_id;
	
--=========================================================================================
--Final step to load data into totals
DELETE FROM totals;
INSERT INTO totals (
	"calculationId", "sbi", "frn", "agreementNumber",
	"claimId", "schemeType", "calculationDate",
	"invoiceNumber", "agreementStart", "agreementEnd",
	"totalAdditionalPayments", "totalActionPayments", "updated",
	"datePublished", "totalPayments"  
)
SELECT
	T.calculation_id AS calculationId,
	PO.sbi::integer,
	PO.frn::bigint,
	CA2.application_id AS agreementNumber,
	PA.application_id AS claimId,
	'SFI-23' AS schemeType,
	NOW() AS calculationDate,
	'N/A' AS invoiceNumber,
	IPAD.agreementStart,
	IPAD.agreementEnd,
	T.total_amount AS totalAdditionalPayments,
	T.total_amount AS totalActionPayments,
	NOW() as updated,
	NULL as datePublished,
	T.total_amount AS totalPayments
	FROM etl_interm_total T
	INNER JOIN etl_interm_paymentref_org PO ON PO.payment_ref = T.payment_ref
	INNER JOIN etl_interm_paymentref_application PA ON PA .payment_ref = T.payment_ref
	INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = PA.application_id AND CA.data_source_s_code = 'CAPCLM'
	INNER JOIN etl_stage_css_contract_applications CA2 ON CA.contract_id = CA2.contract_id AND CA2.data_source_s_code = '000001'
	INNER JOIN etl_interm_paymentref_agreement_dates IPAD ON IPAD.payment_ref = T.payment_ref;

--=========================================================================================
--Final step to load data into organisations
	DELETE FROM organisations;
INSERT INTO organisations (
	sbi, "addressLine1", "addressLine2",
	"addressLine3", city, county,
	postcode, "emailAddress", frn,
	"name", updated
	)
	SELECT
	sbi, addressLine1, addressLine2,
	addressLine3, city, county,
	SUBSTRING(postcode,1,7), emailAddress, frn::bigint,
	"name", NOW()
	FROM etl_interm_org;

UPDATE organisations 
	SET "addressLine1" = 'Rosendo Garden',
		"addressLine2" = '169 Weston Manor',
		"addressLine3" = '',
		city = 'Port Ollie',
		county = 'Berkshire',
		postcode = 'GU15 4PQ',
		"emailAddress" = 'Ceasar.Cormier12@hotmail.com',
		name = 'Murray, Reinger and Prohaska Farm'
WHERE sbi = 106379104;

UPDATE organisations 
	SET "addressLine1" = 'Jacobson Heights',
		"addressLine2" = '2952 Weber Knoll',
		"addressLine3" = '',
		city = 'North Kody',
		county = 'Avon',
		postcode = 'B49 9GH',
		"emailAddress" = 'Griffin.Von9@yahoo.com',
		name = 'Runolfsson smallholding'
WHERE sbi = 107604121;

UPDATE organisations 
	SET "addressLine1" = 'Lakin Cape',
		"addressLine2" = '271 Kovacek Plaza',
		"addressLine3" = '',
		city = 'East Alyceborough',
		county = 'Bedfordshire',
		postcode = '52409',
		"emailAddress" = 'Elinore.Rogahn47@yahoo.com',
		name = 'King LLC'
WHERE sbi = 106308039;

UPDATE organisations 
	SET "addressLine1" = 'Darwin Flats',
		"addressLine2" = '793 Stiedemann Ridges',
		"addressLine3" = '',
		city = 'New Ariannamouth',
		county = 'Avon',
		postcode = 'CV37 0HT',
		"emailAddress" = 'Eliezer.Blanda57@yahoo.com',
		name = 'Von Ducks Poultry'
WHERE sbi = 106679243;

UPDATE organisations 
	SET "addressLine1" = 'Brittany Unions',
		"addressLine2" = '588 Lizeth Turnpike',
		"addressLine3" = '',
		city = 'Noemiefurt',
		county = 'Buckinghamshire',
		postcode = 'HP10 0DG',
		"emailAddress" = 'Ollie.OConner@yahoo.com',
		name = 'Tremblay Farm'
WHERE sbi = 106303330;

UPDATE organisations 
	SET "addressLine1" = 'Lexus Cliffs',
		"addressLine2" = '8529 McCullough Dale',
		"addressLine3" = '',
		city = 'Port Brennan',
		county = 'Berkshire',
		postcode = 'GU15 4PQ',
		"emailAddress" = 'Vicenta.Armstrong81@hotmail.com',
		name = 'Prosacco & Son'
WHERE sbi = 106699236;

UPDATE organisations 
	SET "addressLine1" = 'Rogers Ridges',
		"addressLine2" = '02670 Blanda Corners',
		"addressLine3" = '',
		city = 'Ryanton',
		county = 'Bedfordshire',
		postcode = 'MK40 1AA',
		"emailAddress" = 'Amir_Wisoky59@gmail.com',
		name = 'Gorczany and Ullrich Farm'
WHERE sbi = 200244838;

UPDATE organisations 
	SET "addressLine1" = 'Wyman Trace',
		"addressLine2" = '007 Emerson Throughway',
		"addressLine3" = '',
		city = 'Derekport',
		county = 'Buckinghamshire',
		postcode = 'HP19 0FX',
		"emailAddress" = 'Giovanna79@gmail.com',
		name = 'Twisting Heathers Farm'
WHERE sbi = 200314332;

UPDATE organisations 
	SET "addressLine1" = 'Hansen Brook',
		"addressLine2" = '127 Adriel Motorway',
		"addressLine3" = '',
		city = 'McLaughlinburgh',
		county = 'Berkshire',
		postcode = 'RG2 8SS',
		"emailAddress" = 'Rhett_Reichel65@yahoo.com',
		name = 'Little Tractor Farm'
WHERE sbi = 106507234;

UPDATE organisations 
	SET "addressLine1" = 'Eleonore Glens',
		"addressLine2" = '1380 Kamryn Gateway',
		"addressLine3" = '',
		city = 'South Sidport',
		county = 'Avon',
		postcode = '87736',
		"emailAddress" = 'Mckenzie98@hotmail.com',
		name = 'Casper LLC'
WHERE sbi = 106675751;

