create table user (
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(100),
    password varchar(50),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO user (name, contactNumber, email, password, status, role) VALUES 
('sivakumar', '9962543540', 'sivakumar@gmail.com','welcome', 'true', 'admin');

create table category (
    id int Not NULL AUTO_INCREMENT,
    name varchar(250),
    primary key(id) 
);

create table product (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(250),
    categoryId int NOT NULL,
    description varchar(250),
    price integer,
    status varchar(20),
    primary key(id)
);

create table bill (
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(250) NOT NULL,
    name varchar(250) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);