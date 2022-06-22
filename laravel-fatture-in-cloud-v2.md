---
meta:
  - name: description
    content: A simple Laravel integration with Fatture in Cloud APIs v2.
gitName: laravel-fatture-in-cloud-v2
---

# laravel-fatture-in-cloud-v2

A simple Laravel integration with [Fatture in Cloud APIs v2](https://developers.fattureincloud.it/).

[![Github](./assets/icon/github.svg "Github Icon")](https://github.com/offline-agency/laravel-fatture-in-cloud-v2)
[![Latest Stable Version](https://poser.pugx.org/offline-agency/laravel-fatture-in-cloud-v2/v/stable)](https://packagist.org/packages/offline-agency/laravel-fatture-in-cloud-v2)
[![Total Downloads](https://img.shields.io/packagist/dt/offline-agency/laravel-fatture-in-cloud-v2.svg?style=flat-square)](https://packagist.org/packages/offline-agency/laravel-fatture-in-cloud-v2)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![StyleCI](https://github.styleci.io/repos/167236902/shield)](https://styleci.io/repos/167236902)

## Installation

Install the package through [Composer](http://getcomposer.org/).

Run the Composer require command from the Terminal:

```bash
composer require offline-agency/laravel-fatture-in-cloud-v2
```

You should publish config file with:

```bash
php artisan vendor:publish --provider="Offlineagency\LaravelWebex\Providers\LaravelWebexServiceProvider"
```

## Configuration

Package provide multiple-companies handling. In your config you can provide more companies like that
```php
... 

'companies' => [
    'default' => [
        'id' => env('FCV2_DEFAULT_ID', ''),
        'bearer' => env('FCV2_DEFAULT_BEARER', '')
    ],
    'first_company' => [
        'id' => env('FCV2_FIRST_COMPANY_ID', ''),
        'bearer' => env('FCV2_FIRST_COMPANY_BEARER', '')
    ],
    'second_company' => [
        'id' => env('FCV2_SECOND_COMPANY_ID', ''),
        'bearer' => env('FCV2_SECOND_COMPANY_BEARER', '')
    ]
]
```

Then you can specify (or not) a company on class initialization:
```php
// take the default
$issued_documents = new \OfflineAgency\LaravelFattureInCloudV2\Api\IssuedDocument();

// specify company
$issued_documents = new \OfflineAgency\LaravelFattureInCloudV2\Api\IssuedDocument('first_company');
```

## Features

### Pagination
This package provides a pagination system that allow you to move between pages using simple methods:

```php
$issued_documents = new \OfflineAgency\LaravelFattureInCloudV2\Api\IssuedDocument();
$issued_document_list = $issued_documents->list('invoice');

// check if the response has more than one page
$issued_document_list->getPagination()->isSinglePage();

// check if the document has a next page
$issued_document_list->getPagination()->hasNextPage();

// check if the document has a previous page
$issued_document_list->getPagination()->hasPrevPage();

// return documents of the next page
$issued_document_list->getPagination()->goToNextPage();

// return documents of the previous page
$issued_document_list->getPagination()->goToPrevPage();

// return documents of the first page
$issued_document_list->getPagination()->goToFirstPage();

// return documents of the last page
$issued_document_list->getPagination()->goToLastPage();
```

### Bin [![HOT](https://img.shields.io/static/v1.svg?label=&message=HOT&color=red)]()
This package provides bin() method for deleted issued documents that allow you to get its detail. This is very useful, for example, when you convert a
proforma into an invoice (deleting the proforma) and you need old document's detail. Let's see an example:

```php
$issued_documents = new \OfflineAgency\LaravelFattureInCloudV2\Api\IssuedDocument();
$response = $issued_documents->bin($document_id);
```

### Rate limit [![HOT](https://img.shields.io/static/v1.svg?label=&message=HOT&color=red)]()
This package provides a method to intercept throttle errors (403, 429) and automatically retry.
You can specify limits on your config, remember to use milliseconds to indicate time:

```php
'limits' => [
    'default' => 300000,
    '403' => 300000,
    '429' => 3600000,
],
```

## Usage instructions & examples
This package provides a class for each api group like clients, issued documents, products... After instantiate one of them you can access to all its endpoints. 
Here you can see an example of just how simple this package is to use.

```php
$client = new \OfflineAgency\LaravelFattureInCloudV2\Api\Client();
$client_list = $client->list();
```

This snippet returns an instance of `\OfflineAgency\LaravelFattureInCloudV2\Entities\Client\ClientList` that provide 2 public methods:
- `getItems()` that returns an array of `\OfflineAgency\LaravelFattureInCloudV2\Entities\Client\Client` from which you can access to all client's fields
- `getPagination()` that returns an instance of `\OfflineAgency\LaravelFattureInCloudV2\Entities\Client\ClientPagination` from which you can access to all pagination's fields and [methods](#Pagination)

You can also specify query parameters passing an array:
```php
$client = new \OfflineAgency\LaravelFattureInCloudV2\Api\Client();
$client_list = $client->list([
    'per_page' => 50
]);
```

If the endpoint expect one or more required parameters and if it's a GET endpoint you can provide them as the follow:
```php
$product = new \OfflineAgency\LaravelFattureInCloudV2\Api\Product();
$product_detail = $product->detail($product_id, [
    'fields' => 'id,name,code'
]);
```

If the endpoint is a POST/PUT one you only need to provide an array with all parameters (required and not):
```php
$product = new \OfflineAgency\LaravelFattureInCloudV2\Api\Product();
$new_product = $product->create([
    'data' => [
        'name' => $product_name,
        'code' => $product_code
    ],
]);
```
The package validates body using Laravel [Validators](https://laravel.com/docs/9.x/validation#manually-creating-validators). If something goes wrong the method returns an instance of `\Illuminate\Support\MessageBag` that contains all errors.

## Api coverage

#### User

- [ ] Get User Info [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List User Companies [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Companies

- [ ] Get Company Info [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Clients ✅

- [X] List clients [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Create client [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Get client [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Modify client [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [X] Delete client [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

#### Suppliers

- [ ] List Suppliers [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create Supplier [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Supplier [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Supplier [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Supplier [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

#### Products ✅
- [X] List products [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Create product [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Get product [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Modify product [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [X] Delete product [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

#### Issued Documents ✅

- [X] List Issued Documents [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Create Issued Documents [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Get Issued Document [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Get Deleted Document [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Modify Issued Document [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [X] Delete Issued Document [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [X] Get New Issued Document Totals [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Get Existing Issued Document Totals [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Upload Issued Document Attachment [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [X] Delete Issued Document Attachment [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [X] Get Issued Document Pre-create info [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Get Email Data [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [X] Schedule Email [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()

#### Issued e-invoice

- [ ] Send the e-invoice [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Verify e-invoice XML [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Get e-invoice XML [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Get e-invoice rejection reason [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Received Documents

- [ ] List Received Documents [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create Received Document [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Received Document [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Received Document [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Received Document [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Get New Received Document Totals [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Existing Received Document Totals [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Upload Received Document Attachment [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Delete Received Document Attachment [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Get Received Document Pre-create info [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Receipts

- [ ] List Receipts [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create Receipts [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Receipts [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Receipts [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Receipts [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Get Receipts Pre-Create Info [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Get Receipts Monthly Totals [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Taxes

- [ ] List F24 [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create F24 [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get RF24 [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify F24 [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete F24 [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Upload F24 Attachment [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Delete F24 Attachment [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

#### Archive

- [ ] List Archive Documents [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create Archive Documents [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Archive Documents [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Archive Documents [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Archive Documents [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Upload Archive Documents Attachment [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()

#### Cashbook

- [ ] List Cashbook Entries [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Create Cashbook Entries [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Cashbook Entries [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Cashbook Entries [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Cashbook Entries [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

#### Info
- [ ] List Countries [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Detailed Countries [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Cities [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Languages [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Templates [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Currencies [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Units of Measure [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Delivery Notes Default Casuals [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Vat Types [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Payment Methods [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Payment Accounts [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Revenue Centers [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Cost Centers [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Product Categories [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Received Document Categories [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] List Archive Categories [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()

#### Settings
- [ ] Create Payment Method [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Payment Method [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Payment Method [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Payment Method [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Create Payment Account [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Payment Account [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Payment Account [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Payment Account [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()
- [ ] Create Vat Type [![POST method](https://img.shields.io/static/v1.svg?label=&message=POST&color=blue)]()
- [ ] Get Vat Type [![GET method](https://img.shields.io/static/v1.svg?label=&message=GET&color=green)]()
- [ ] Modify Vat Type [![PUT method](https://img.shields.io/static/v1.svg?label=&message=PUT&color=violet)]()
- [ ] Delete Vat Type [![DELETE method](https://img.shields.io/static/v1.svg?label=&message=DELETE&color=red)]()

## Testing

```bash
composer test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security-related issues, please email <support@offlineagency.com> instead of using the issue
tracker.

## Credits

- [Offline Agency](https://github.com/offline-agency)
- [Giacomo Fabbian](https://github.com/Giacomo92)
- [Nicolas Sanavia](https://github.com/SanaviaNicolas)
- [All Contributors](../../contributors)

## About us

Offline Agency is a web design agency based in Padua, Italy. You'll find an overview of our
projects [on our website](https://offlineagency.it/).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
