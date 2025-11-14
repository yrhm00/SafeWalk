DROP TABLE IF EXISTS product CASCADE ;

CREATE TABLE product (
    id int primary key generated always as identity,
    name text,
    price decimal
);

INSERT INTO product(name, price)
VALUES ('Playstation 5', 499.99),
       ('NVIDIA RTX 4090 FE', 1829),
       ('Xbox Series X', 499.99);