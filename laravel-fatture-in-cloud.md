---
meta:
  - name: description
    content: This Laravel wrapper allows you to integrate a Laravel e-commerce platform with the invoicing program Fatture in Cloud using Api.
gitName: laravel-fatture-in-cloud
---

# laravel-fatture-in-cloud

This Laravel wrapper allows you to integrate a Laravel e-commerce platform with the invoicing program [Fatture in Cloud](https://fattureincloud.it) using Api.

## Installation and setup

### Basic installation

You can install this package via composer using:

``` bash 
composer require offline-agency/laravel-fatture-in-cloud
```

The package will automatically register its service provider.

To publish the config file to `config/backup.php` run:

``` bash 
php artisan vendor:publish --provider="OfflineAgency\FattureInCloud\FattureInCloudServiceProvider" --tag="config"    
```

## Test Environment

- Go to [Fatture in Cloud](https://www.fattureincloud.it) website.
- Create an account and a test environment. The new account has 15 trial days.
- Go to section and get **API UID** and **API KEY**

![Fatture in Cloud API section](./assets/images/fatture-in-cloud-api-section.png "Fatture in Cloud API section")

## Basic Usage
Create a new invoice on FC
## Entities

### Account

``` php
$account = new Account;
$account->getInfo(['campi'=> ['key']])
```

#### Available Methods
- **getGenericInfo()**: it checks api key and return info about api rate limit
- **getInfo()**: it returns info about (just pass the correct key instead of key see previous example ):
    - Business name - *nome*
    - Licence expiration : *durata_licenza*
    - Licence type: *tipo_licenza*
    - Currency list: *lista_valute*
    - Vat list: *lista_iva*
    - Country list: *lista_paesi*
    - Template list: *lista_template*
    - List of payment method for the sales: *lista_conti*
    - List of payment method for the purchase: *lista_metodi_pagamento*
    

### Registry

``` php
//Aliases
$customer = new Clienti;
$supplier = new Fornitori;
```

### Available Methods
- **lista()**: return  a list of all customers/suppliers;
- **nuovo()**: it allows to create a new customer/supplier
- **importa()**: it allows to create a customer/supplier in batch
- **modifica()**: it allows to edit a specific customer/supplier  
- **elimina()**: it allows to delete a specific customer/supplier

### Products <Badge text="TO DO" type="warning"/>

### Documents Issued

``` php
//Aliases
$invoice = new Fatture;
$receipt = new Ricevuta;
$quotation = new Preventivi;
$order = new Ordini;
$dealing = new Rapporti;
$credit_note = new Ndc;
$proforma_invoice = new Proforma;
$supplier_order = new OrdiniFornitori; 
$delivery_note = new Ddt;
```

The possible document are:
- invoice
- receipt
- quotation
- order
- credit note
- proforma invoice
- dealing
- order supplier
- transportation document

#### Available Methods
- **lista()**: return  a list of all documents;
- **nuovo()**: it allows to create a new document
- **importa()**: it allows to create document in batch
- **modifica()**: it allows to edit a specific document
- **elimina()**: it allows to delete a specific document

### Purchases  <Badge text="TO DO" type="warning"/>

### Compensation  <Badge text="TO DO" type="warning"/>

### Warehouse  <Badge text="TO DO" type="warning"/>

### Mail <Badge text="TO DO" type="warning"/>

### Use Cases

### Create an invoice
Using Observer pattern create an invoice on Fatture in Cloud after order creation in your E-commerce application.

### Update a customer

Using Observer pattern when update a customer propagate the change/ also in Fatture in Cloud

### Add a new product

Using a job you can publish a new product on your ecommerce from Fatture in Cloud

### Update a product availability
Using a job keep update a product avaiability on your ecommerce and also in Fatture in Cloud

## Roadmap :rocket:
- **Demo**: New repository with full examples and functionality. Synchronization from application and Fatture in Cloud and vice versa 
- **Tests**: Add test to achieve 100% of test coverage
- **More Validation**: Add more validations before send request to the API.
- **L8 Compatibility**: Add Laravel 8 support

## Questions & issues
Find yourself stuck using the package? Found a bug? Do you have general questions or suggestions for improving the plugin? Feel free to create an issue on [GitHub](https://github.com/offline-agency/laravel-fatture-in-cloud/issues), we’ll try to address it as soon as possible.

If you’ve found a bug regarding security please mail <support@offlineagency.com> instead of using the issue tracker.

## About Us

[Offline Agency](https://offlineagency.it) is an agency based in Padua, Italy.

Open source software is used in all projects we deliver. This is just a few of the free pieces of software we use every single day. For this, we are very grateful. When we feel we have solved a problem in a way that can help other developers, we release our code as open source software on [GitHub](https://github.com/offline-agency).

This package was made by [Giacomo Fabbian](https://github.com/Giacomo92). There are [many other contributors](https://github.com/offline-agency/laravel-fatture-in-cloud/graphs/contributors) who devoted time and effort to make this package better.


[^1]: **FIC (Fatture in Cloud)**: it's a software that allow you to handle invoices from pc, smartphone or tablet.
