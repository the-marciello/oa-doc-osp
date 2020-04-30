---
meta:
  - name: description
    content: A Laravel package that allow to sync changes between collections on MongoDB projects.
gitName: laravel-mongo-auto-sync
---

# laravel-mongo-auto-sync
A package that allow to sync changes between collections on [MongoDB](https://www.mongodb.com) projects.

## Installation and Setup

### Prerequisites

This package is build on top of [jenssegers/laravel-mongodb](https://github.com/jenssegers/laravel-mongodb) v3 and for this reason you have to install mongo driver before using it. Follow this simple steps to install it.

Open your terminal and run:

``` bash
# install pear
curl -O https://pear.php.net/go-pear.phar

# install mongoDB PHP driver
sudo pecl install mongodb
```     

### Basic Installation

You can install this package via composer using:

``` bash 
composer require offlineagency/laravel-mongo-auto-sync
```

### How does it work

::: danger
GF
:::

### Before starting 

In this documentation reference is made to Article and ArticleCategory collection to explain the powerful of this package.

Between them exist a [relation](#relationships) defined like this:

- Article [EmbedsOne](#embedsone) ArticleCategory
- ArticleCategory [EmbedsMany](#embedsmany) Article

## Model 

In this section we will see how to build a model, from the definition of the fields until the creation of [relationships](#relationships).

Before starting we look to the end result that will be created step by step in this documentation.

::: danger
TODO: add image sync explain
:::

#### Article

``` php

<?php

namespace App\Models;

use OfflineAgency\MongoAutoSync\Http\Models\MDModel;

/**
 *
 * Plain Fields
 *
 * @property string $id
 * @property array $title
 * @property string $slug
 * @property array $content
 * @property $planned_date
 *
 **/

/**
 *
 * Relationship
 *
 * @property MiniCategory articleCategory
 * 
 **/

class Article extends MDModel
{
    protected $collection = 'article';

    protected $items = array(
        'title' => array(
            'is-ml' => true,
        ),
        'slug' => array(),
        'content' => array(
            'is-ml' => true,
        ),
        'planned_date' => array(
            'is-md' => true
        )
    );

    protected $dates = array(
        'creation_date',
        'publication_date'
    );

    protected $mongoRelation = array(
        'articleCategory' => array(
            'type' => 'EmbedsOne',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\ArticleCategory',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ),
    );

    public function articleCategory()
    {
        return $this->embedsOne('App\Models\MiniCategory');
    }
}
```

#### Article Category

``` php
<?php

namespace App\Models;

use OfflineAgency\MongoAutoSync\Http\Models\MDModel;

/**
 *
 * Plain Fields
 *
 * @property string $id
 * @property array $name
 * @property string $slug
 * @property array $description
 * @property string $img
 *
 **/

/**
 *
 * Relationship
 *
 * @property MiniArticle $articleList
 *
 **/

class ArticleCategory extends MDModel
{
    protected $collection = 'articlecategory';

    protected $items = array(
        'name'        => array(
            'is-ml' => true,
        ),
        'slug'       => array(),
        'description' => array(
            'is-ml' => true,
        ),
        'img' => array()
    );

    protected $mongoRelation = array(
        'articlelist' => array(
            'type'   => 'EmbedsMany',
            'mode'   => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'articleCategory',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ),
    );

    public function articlelist()
    {
        return $this->embedsMany('App\Models\MiniArticle');
    }
}
```


### Items Attribute

First thing you have to create a new class, that will correspond with the collection that you want on DB, and it must extend [MDModel]()

``` php
class Article extends MDModel
{
    //
}
```

Now you can define the collection and all the fields that you need. Those must be declared as array but default when you create a new object they will be saved as string

``` php
class Article extends MDModel
{
        protected $collection = 'article';
    
        protected $items = array(
            'title' => array(),
            'slug' => array(),
            'content' => array(),
            'planned_date' => array()
        );
}
```

::: danger
Aggiungere breve anticipazione
:::

#### is-ml (multi-lingual)

It creates an array of key-value pairs where the the language code (like "it_IT") will be the key and the text will be the value.


``` php
class Article extends MDModel
{
        protected $collection = 'article';
    
        protected $items = array(
            'title' => array(
                'is-ml' => true
            ),
            'slug' => array(),
            'content' => array(
                'is-ml' => true
            ),
            'planned_date' => array()
        );
}
```

#### is-md

::: danger
GF - description
:::

``` php
class Article extends MDModel
{
        protected $collection = 'article';
    
        protected $items = array(
            'title' => array(
                'is-ml' => true
            ),
            'slug' => array(),
            'content' => array(
                'is-ml' => true
            ),
            'planned_date' => array(
                'is-md' => true
            )
        );
}
```

#### is-carbonDate

::: danger
GF - description
:::

::: danger 
GF - Examples
:::

#### ia-array

::: danger
GF - description
:::

::: danger 
GF - Examples
:::

#### dates

You can also create an array where you indicate all the fields that you want are saved as dates.

``` php
class Article extends MDModel
{
        protected $collection = 'article';
    
        protected $items = array(
            'title' => array(
                'is-ml' => true
            ),
            'slug' => array(),
            'content' => array(
                'is-ml' => true
            ),
            'planned_date' => array(
                'is-md' => true
            )
        );
        
        protected $dates = array(
                'creation_date',
                'publication_date'
        );
}
```

### Relationships

::: warning
Description
:::

#### MiniModel

As the name suggests MiniModel is a little model, a selection of fields from an another model that we will call father. In fact here you go to defined all the fields that you want copare in, for exaple, Article from ArticleCategory and vice-versa.

The structure is the same of a normal model but they must extend [DefaultMini](): 

``` php
# MiniArticle
use OfflineAgency\MongoAutoSync\Http\Models\DefaultMini;

/**
 *
 * Plain Fields
 *
 * @property string $id
 * @property string $ref_id
 * @property array $title
 * @property array $content
 * @property $publication_date
 *
 **/

class MiniArticle extends DefaultMini
{
    protected $items = array(
        'ref_id' => array(),
        'title' => array(
            'is-ml' => true,
        ),
        'content' => array(
            'is-ml' => true,
        ),
        'publication_date' => array()
    );
}

# MiniCategory
use OfflineAgency\MongoAutoSync\Http\Models\DefaultMini;

/**
 *
 * Plain Fields
 *
 * @property string $id
 * @property string $ref_id
 * @property array $name
 * @property array $description
 * 
 **/

class MiniCategory extends DefaultMini
{
    protected $items = array(
        'ref_id' => array(),
        'name' => array(
            'is-ml' => true,
        ),
        'description' => array(
            'is-ml' => true,
        )
    );
}
```

::: tip
Use `ref_id` field to store the id from the father model.
:::

### Mongo Relation Attribute

Now that you have understand what are MiniModels you are ready to create your first relation on your model. First of all you have to create an array that will contains all the relations that you need:

``` php 
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = array(
        //
    );
}
```

``` php 
class ArticleCategory extends MDModel
{
    {...}
    
    protected $mongoRelation = array(
        //
    );
}
```

Then you can define your relation:

``` php 
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = array(
        'articleCategory' => array(
            'type' => 'EmbedsOne',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\ArticleCategory',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ),
    );
}
```

``` php 
class ArticleCategory extends MDModel
{
    {...}
    
    protected $mongoRelation = array(
        'articlelist' => array(
            'type'   => 'EmbedsMany',
            'mode'   => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'articleCategory',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ),
    );
}
```

Now analyze what you are wrote up here:

- *type*: indicate the type of the relation and it can be [EmbedsOne](#embedsone) or [EmbedsMany](#embedsmany) METTERE GRASSETTO

- mode: opzionale non utilizzato

- model: is the MiniModel of the related collection

- modelTarget: is the related collection

- methodOnTarget: is the relation name on the model of the related collection

- modelOnTarget: is the MiniModel of the current model

::: danger
Parlare della possibilità di mettere `'hasTarget' => false`
::: 

#### EmbedsOne




#### EmbedsMany

::: warning
Description
:::

::: tip 
Examples
:::

### Utilities

#### Generate Model Documentation

Mettere il link per la demo e scrivere solamente il comand.

#### Drop Collection

Un altro comando da linkare e scrivere

#### Check DB consistency

Un altro comando che sarà nelle prossime release. Va a controllare che tutto qello che c'e nelle relazioni siapresente anche nei targhet e che tutti gli items siano presenti nella collection

## Store Operation

### Description

::: warning
Description - Mettere un nome adeguato al posto di description
:::

### Usage

::: tip 
Examples - Uso base spiegato precedentemente
:::

#### Relation

::: warning
Description
:::

::: tip 
Examples
:::

#### Partial Request

::: warning
Description
:::

::: tip 
Examples
:::


## Update Operation

### Description

::: warning
Description - Mettere un nome adeguato al posto di description
:::

### Usage

::: tip 
Examples - Uso base spiegato precedentemente
:::

#### Relation

::: warning
Description
:::

::: tip 
Examples
:::

#### Partial Request

::: warning
Description
:::

::: tip 
Examples
:::


## Destroy Operation

### Description

::: warning
Description - Mettere un nome adeguato al posto di description
:::

### Usage

::: tip 
Examples - Uso base spiegato precedentemente
:::


## Questions & issues
Find yourself stuck using the package? Found a bug? Do you have general questions or suggestions for improving the package? Feel free to create an issue on [GitHub](https://github.com/offline-agency/laravel-mongo-auto-sync/issues), we’ll try to address it as soon as possible.

If you’ve found a bug regarding security please mail <support@offlineagency.com> instead of using the issue tracker.


## About Us

[Offline Agency](https://offlineagency.it) is a webdesign agency based in Padua, Italy.

Open source software is used in all projects we deliver. Laravel, Nginx, Ubuntu are just a few of the free pieces of software we use every single day. For this, we are very grateful. When we feel we have solved a problem in a way that can help other developers, we release our code as open source software on [GitHub](https://github.com/offline-agency).


This package was made by [Giacomo Fabbian](https://github.com/Giacomo92). There are [many other contributors](https://github.com/offline-agency/laravel-mongo-auto-sync/graphs/contributors) who devoted time and effort to make this package better.


## FAQ

::: warning
Questions & Answers
:::