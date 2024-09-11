#!/bin/bash
export PGPASSWORD=${POSTGRES_PASSWORD}
pg_dump -h localhost -p 5482 -U ${POSTGRES_USERNAME} --table="organisations" --data-only --column-inserts ffc_doc_statement_data > organisations.sql
pg_dump -h localhost -p 5482 -U ${POSTGRES_USERNAME} --table="totals" --data-only --column-inserts ffc_doc_statement_data > totals.sql
pg_dump -h localhost -p 5482 -U ${POSTGRES_USERNAME} --table="dax" --data-only --column-inserts ffc_doc_statement_data > dax.sql
