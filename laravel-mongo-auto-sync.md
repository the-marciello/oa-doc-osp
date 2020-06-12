---
meta:
  - name: description
    content: This package provides a better support for MongoDB relationship in Laravel Projects.
gitName: laravel-mongo-auto-sync
---

# Laravel MongoDB Relationships
This package provides a better support for [MongoDB](https://www.mongodb.com) relationship in [Laravel](https://laravel.com/) Projects.
At low level all CRUD operations has been handled by [jenssegers/laravel-mongodb](https://github.com/jenssegers/laravel-mongodb)

## Features
- Sync changes between collection with relationships after CRUD operations
    - EmbedsOne & EmbedsMany 
    
#### Example without our package
  
  ``` php
  //create a new Article with title "Game of Thrones" with Category "TV Series"
  //assign data to $article       
  $article->save();
  /*
  Article::class {
    'title' => 'Game of Thrones',
    'category' => Category::class {
        'name' => 'TV Series'
     }
  }
  */
  
  //Retrieve 'TV Series' category
  $category = Category::where('name', 'TV Series')->first();
  /*
    Category::class {
        'name' => 'Game of Thrones',
        'articles' => null
    }
  */ 
  ```
  
The sub document article has not been updated with the new article. So you will need some extra code to write in order to see the new article it in the category page. The number of sync depends on the number of the relationships and on the number of the entry in every single EmbedsMany relationships.
  
Total updates = ∑ (entry in all EmbedsMany relationships) + ∑ (EmbedsOne relationships)
  
As you can see the lines of extra code can rapidly increase, and you will write many redundant code.
 
#### Example with our package
  
  ``` php
  //create a new Article with title "Game of Thrones" with Category "TV Series"
  $article->storeWithSync($request);
  /*
  Article::class {
    'title' => 'Game of Thrones',
    'category' => Category::class {
        'name' => 'TV Series'
    }
  }
   */
  //Retrieve 'TV Series' category
  $category = Category::where('name', 'TV Series')->first();   
 /*
  Category::class {
    'name' => 'Game of Thrones',
    'articles' => Article::class {
        'title' => 'Game of Thrones'
    }
  }
  */ 
  ```
The sub document article has been updated with the new article, with no need of extra code :tada: 

You can see the new article on the category page because the package synchronizes the information for you by reading the Model Setup.
  
**These example can be applied for all write operations on the database.**
- Referenced sub documents <Badge text="TO DO" type="error"/> 
- Handle sub document as Model in order to exploit Laravel ORM support during write operation (without sync feature)<Badge text="TO BE TESTED" type="warning"/> 
- Handle referenced sub document as Model in order to exploit Laravel ORM support during write operation (without sync feature)<Badge text="TO DO" type="error"/> 
- Advance cast field support

## Use cases
- Blog: see demo [here](https://github.com/offline-agency/laravel-mongodb-blog)
- Ecommerce
- API System for mobile application o for generated static site
- Any projects that require fast read operations and (slow) write operations that can be run on background

## Installation and Setup

### Prerequisites
Make sure you have the MongoDB PHP driver installed. You can find installation instructions at [http://php.net/manual/en/mongodb.installation.php](http://php.net/manual/en/mongodb.installation.php)

### Laravel version Compatibility

| Laravel     | Package     |
| ----------- | ----------- |
| 5.8.x       | 1.x         |
| 6.x         | 1.x         |
| 7.x         | <Badge text="TO BE TESTED" type="warning"/>         |

### Basic Installation

Install the package via Composer:

``` bash 
composer require offlineagency/laravel-mongo-auto-sync
```

### Before starting 

To understand how the package works we see an example based on the following Model:
- [Article](https://github.com/offline-agency/laravel-mongodb-blog/blob/master/app/Models/Article.php)
- [Category](https://github.com/offline-agency/laravel-mongodb-blog/blob/master/app/Models/Category.php)
- PrimaryCategory

and the following [MongoDB relationships](https://docs.mongodb.com/manual/applications/data-models-relationships/):

- Article [EmbedsMany](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/) Category
- Category [EmbedsMany](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/) Article
- Article [EmbedsOne](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/) PrimaryCategory
- PrimaryCategory [EmbedsMany](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/) Article

## Model setup

Your model has to extend our [MDModel](https://github.com/offline-agency/laravel-mongo-auto-sync/blob/master/src/Http/Models/MDModel.php) class in order to use our extended methods for CRUD operations.

``` php
class Article extends MDModel
{
    //
}
```

### Fields

Add ```$items``` attribute on your model class and fill it with a key-value array. 
The key indicates the name of the field and the value contain its configuration parameters. 

#### Field Types

Below is a list of all possible configurations:

 [Array](#array-is-array)<br>
 [Date](#date)<br>
 [Default]()<br>
 [Double]()<br>
 [Editable]()<br>
 [Int]()<br>
 [Multi language](#multi-language-is-ml)<br>

 
#### Array (is-array)

It creates an array field where you can save different information between an object and the others.

#### Multi language (is-ml)

It creates an array of key-value pairs where the language code (like "it_IT") will be the key and the text will be the value.

#### Date

**Utc Mongo Date (is-md)**<br>
It creates a mongo-date field.

**Carbon Date (is-carbon-date)**<br>
It creates a [carbon](https://carbon.nesbot.com/) field with which is easier make operations.



### Results

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
 * Relationship
 *
 * @property MiniCategory
 * @property MiniCategory
 *
 **/

class Article extends MDModel
{
    protected $collection = 'article';

    protected $items = [
        'title' => [
            'is-ml' => true,
        ],
        'slug' => [],
        'content' => [
            'is-ml' => true,
        ],
        'planned_date' => [
            'is-md' => true
        ]
    ];

    protected $dates = [
        'creation_date',
        'publication_date'
    ];

    protected $mongoRelation = [
        'categories' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\Category',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ],
        'primaryCategory' => [
            'type'   => 'EmbedsOne',
            'mode'   => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\PrimaryCategory',
            'methodOnTarget' => 'articles',
            'modelOnTarget' => 'App\Models\MiniArticle'
        ]
    ];

    public function primaryCategory()
    {
        return $this->embedsOne('App\Models\MiniPrimaryCategory'];
    }

    public function categories()
    {
        return $this->embedsMany('App\Models\MiniCategory'];
    }
}
```

#### Category

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
 * Relationship
 *
 * @property MiniArticle
 *
 **/

class Category extends MDModel
{
    protected $collection = 'category';

    protected $items = [
        'name' => [
            'is-ml' => true,
        ],
        'slug' => [],
        'description' => [
            'is-ml' => true,
        ],
        'img' => []
    ];

    protected $mongoRelation = [
        'articlelist' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'categories',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ]
    ];

    public function articlelist()
    {
        return $this->embedsMany('App\Models\MiniArticle'];
    }
}
```

#### Primary Category

``` php
<\    ];

    protected $mongoRelation = [
        'articles' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'primaryCategory',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ],
    ];

    public function articles()
    {
        return $this->embedsMany('App\Models\MiniArticle'];
    }
}
```

### Relationship

Then you can define your relation:

**Article**

``` php 
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        'categories' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\Category',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ],
        'primaryCategory' => [
            'type'   => 'EmbedsOne',
            'mode'   => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\PrimaryCategory',
            'methodOnTarget' => 'articles',
            'modelOnTarget' => 'App\Models\MiniArticle'
        ]
    ];
}
```

**Category**

``` php 
class Category extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        'articlelist' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'categories',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ]
    ];
}
```

**PrimaryCategory**

``` php 
class PrimaryCategory extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        'articles' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniArticle',
            'modelTarget' => 'App\Models\Article',
            'methodOnTarget' => 'primaryCategory',
            'modelOnTarget' => 'App\Models\MiniCategory',
        ]
    ];
}
```

Now analyze what you are wrote up here:

- **type**: indicate the type of the relation and it can be [EmbedsOne](#embedsone) or [EmbedsMany](#embedsmany)

- **mode**: opzionale non utilizzato

- **model**: is the MiniModel of the related collection

- **modelTarget**: is the related collection

- **methodOnTarget**: is the relation name on the model of the related collection

- **modelOnTarget**: is the MiniModel of the current model

#### Target

Targets are very important mainly for two reasons:

  - You use all the powerful of Eloquent;
  - You can access at the fields of the related collection like you access at the field of the collection

But you can also choose to don't use it, in this case the code became:

``` php
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        'categories' => [
            'type' => 'EmbedsMany',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\Category',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ],
        'primaryCategory' => [
            'type' => 'EmbedsOne',
            'mode' => 'classic',
            'model' => 'App\Models\MiniCategory',
            'has-target' => false
        ]
    ];
}
```

In this way primary category will be saved in the article collection but article will not be saved on primary category. 

#### EmbedsOne

::: warning
Description
:::

#### EmbedsMany

::: warning
Description
:::

### Utilities

#### Generate Model Documentation

I suggest you to generate the PHP doc that takes to do a check when you save or update an object. To do it use [GenerateModelDocumentation](#generatemodeldocumentation) command. Run in your terminal:

``` bash
php artisan model-doc:generate {collection_name}
```

::: tip
You can write the collection_name with capital letter or small letter
::: 

The generated doc will be like this:

``` php
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
 * Relationship
 *
 * @property MiniCategory
 *
 **/
```

The command checks if the model exist in your project and if it doesn’t it print an error message like this:
`Error: collection_name Model not found`

You can also change your model path in this file `config\laravel-mongo-auto-sync.php`: 

``` php
<?php

return [
    'model_path' => app_path() . '/Models',
    'model_namespace' => 'App\Models',
    'other_models' => [
        'user' => [
            'model_path' => app_path(),
            'model_namespace' => 'App'
        ]
    ]
];
```

It allows you to keep the current project structure.

#### Drop Collection

If you need to drop a collection you can use [DropCollection](#dropcollection) command. Run in your terminal:

``` bash
drop:collection {collection_name}
```

::: tip
You can write the collection_name with capital letter or small letter
::: 

The command checks if the model exist in your project and if it doesn’t it print an error message like this:
`Error: collection_name Model not found`

You can also change your model path in this file `config\laravel-mongo-auto-sync.php`: 

``` php
<?php

return [
    'model_path' => app_path() . '/Models',
    'model_namespace' => 'App\Models',
    'other_models' => [
        'user' => [
            'model_path' => app_path(),
            'model_namespace' => 'App'
        ]
    ]
];
```

It allows you to keep the current project structure.

#### Check DB consistency

This command, which will be added probably in the next release [here](#checkdbconsistency), allow you to check if the relations will be saved in the right way. It make sure that the [MiniModel](#minimodel) will be added on the target and check if the items will be saved on the related collection.

## Store Operation

### Description

#### Advantages

As we have already said this package allows you to store an object that automatically will be stored in all collections where it has a relation. Following the above examples when a new article is stored it will appear in the category collection while categories and primary category will be saved under article.

#### Images 
::: danger 
TODO: add images of article and category
:::

### Usage

First of all you have to create a function `store()` where you receive a `$request` in input.

``` php
<?php

namespace App\Controller;

use App\Http\Controllers\Controller;

class ArticleController extends Controller
{
    public function store($request)
    {
        //
    }
}
```

Now you have to declare a new article instance.

``` php
<?php

namespace App\Controller;

use App\Http\Controllers\Controller;
use App\Models\Aticle;

class ArticleController extends Controller
{
    public function store($request)
    {
        $article = new Article;
    }
}
```

#### Field

In `$request` you receive all the fields from a form. If they have the same name of the model they will be directly stored.

::: danger 
TODO: add an image of an article form where the user can insert title, content, planned_date, publication_date and categories.
:::

But they may not be all the fields that you need. For this reason you can create an array where you declare others fields.

``` php
<?php

namespace App\Controller;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use MongoDB\BSON\UTCDateTime;
use DateTime;

class ArticleController extends Controller
{
    public function store($request)
    {
        $arr = [
           'slug' => Str::slug($request->input('title')),
           'creation_date' => new UTCDateTime(new DateTime('now'))
        ];
    }
}
```

#### Store With Relation

Now you have to add the relationships. 

You need a json that contains: 

- EmbedsOne: an array with an object that has all the fields of the [MiniModel](#minimodel);
- EmbedsMany: an array with an object for each, in this case, category that contains all the fields of the [MiniModel](#minimodel).

Json was chosen to using in on frontend. 

For example ypu can create new functions called `getCategories` and `getPrimaryCategory`:

``` php
<?php

namespace App\Controller;

use ...

class ArticleController extends Controller
{
    public function store($request)
    {
        $article = new Article;
                
                $arr = [
                    'slug' => Str::slug($request->input('title')),
                    'creation_date' => new UTCDateTime(new DateTime('now')),
                    'categories' => $this->getCategories($request->categories_id),
                    'primaryCategory' => $this->getPrimaryCategory($request->categories_id)
                ];
    }

    public function getCategories($categories_id)
        {
            //
        }
    
        public function getPrimaryCategory($categories_id)
        {
            //
        }
}
```

And now you can define your related objects:

``` php
<?php

namespace App\Controller;

use DateTime;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Str;
use MongoDB\BSON\UTCDateTime;
use App\Http\Controllers\Controller;
use stdClass;

class ArticleController extends Controller
{
    public function store($request)
    {
        $article = new Article;

        $arr = [
            'slug' => Str::slug($request->input('title')),
            'creation_date' => new UTCDateTime(new DateTime('now')),
            'categories' => $this->getCategories($request->categories_id),
            'primaryCategory' => $this->getPrimaryCategories($request->categories_id)
        ];
    }

    public function getCategories($categories_id)
    {
        $arr = [];
        $i = 0;

        if ($categories_id != null) {
            foreach ($categories_id as $category_id) {
                $category = Category::find($category_id);

                $newCategory = new stdClass();
                $newCategory->ref_id = $category->id;
                $newCategory->name = $category->name[cl()];
                $newCategory->description = $category->description[cl()];

                $arr[$i] = $newCategory;
                $i++;
            }
            return json_encode($arr);
        } else {
            return null;
        }
    }

    public function getPrimaryCategories($categories_id)
    {
        if ($categories_id != null && count($categories_id) > 0) {
            $category = Category::find($categories_id[0]);

            $newCategory = new stdClass();
            $newCategory->ref_id = $category->id;
            $newCategory->name = $category->name[cl()];
            $newCategory->description = $category->description[cl()];

            return json_encode($newCategory);
        }else {
            return null;
        }
    }
}
```

Now you can save your new object using storeWithSync where you have to pass $request as first parameters and $arr as second.

``` php
<?php

namespace App\Controller;

use ...

class ArticleController extends Controller
{
    public function store($request)
    {
        $article = new Article;

        $arr = [
            'slug' => Str::slug($request->input('title')),
            'creation_date' => new UTCDateTime(new DateTime('now')),
            'categories' => $this->getCategories($request->categories_id),
            'primaryCategory' => $this->getPrimaryCategories($request->categories_id)
        ];
        
        $article->storeWithSync($request, $arr);
    }

    public function getCategories($categories_id)
    {
        {...}
    }

    public function getPrimaryCategories($categories_id)
    {
        {...}
    }
}
```

#### Store Partial Request

You can also decide to don't save the relation. In this case you have to add `$options`:

``` php
<?php

namespace App\Controller;

use ...

class ArticleController extends Controller
{
    public function store($request)
    {
        $article = new Article;

        $arr = [
            'slug' => Str::slug($request->input('title')),
            'creation_date' => new UTCDateTime(new DateTime('now'))
        ];

        $options = [
            'request_type' => 'partial'            
        ]
        
        $article->storeWithSync($request, $arr, $options);
    }
}
```

### Result

#### With Relation
The output with [Relation](#store-with-relation) will be like this:

::: danger
Add images
:::

#### With Partial Request

While the output using [Partial Request](#store-partial-request) will be like this:

::: danger
Add images
::: 


## Update Operation

### Description

#### Advantages

Update With Sync allows you to edit an object in its collection and in all collection that it's in a relationships with in a simple and fast way. In fact, following the above examples, when an article is updated the modification will be stored on the items of the correlated collection. Vice-versa when a categories will be updated all the articles that have this categories will be updated. This allows you to save time and avoid mistakes.

#### Images

::: danger
Add images
:::

### Usage 

#### Field

First of all you have to create an `update()` function where you receive `$request` and `$id` in input.

``` php
<?php

namespace App\Controllers;

use App\Http\Controllers\Controller;

class ArticleController extends Controller
{
    public function update($id, $request)
    {
        //
    }
}
```

After that you can search the article with the `$id`, for example:

``` php
<?php

namespace App\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function update($id, $request)
    {
        $article = Article::find($id);
    }
}
```

`$request` contains all the fields that you receive from the form and, as store, if they have the same name of the model they will be saved automatically.

::: danger
add images of the form
:::

But if you want edit a value that `$request` doesn’t contains, as for the store, you can create an array which contains this fields:

``` php
<?php

namespace App\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function update($id, $request)
    {
        $article = Article::find($id);
        
        $arr = [
            'slug' => Str::slug($request->input('title')) . '-updated'
        ];
    }
}
```

#### Update With Relation

If you change a category or you delete one, you can simply save this modification following the rules explained in the [store](#store-with-relation) method.

#### Update With Partial Request

If you don’t edit any relation you can use partial request to ensure that the fields will be deleted.

``` php
<?php

namespace App\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function update($id, $request)
    {
        $article = Article::find($id);
        
        $arr = [
            'slug' => Str::slug($request->input('title')) . '-updated'
        ];

        $options = [
            'request_type' => 'partial'
        ];
    }
}
```

Now you can save your changes:

``` php
<?php

namespace App\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function update($id, $request)
    {
        $article = Article::find($id);
        
        $arr = [
            'slug' => Str::slug($request->input('title')) . '-updated'
        ];

        $options = [
            'request_type' => 'partial'
        ];

        $article->updateWithSync($request, $arr, $options);
    }
}
```

### Result

#### With Relation

If you edit an object and its relation your result will look like this:

::: danger
add images
:::

#### With Partial Request

If you edit only simple fields your result will look like this:

::: danger
add images
:::

## Destroy Operation

::: danger
GF
:::

## Questions & issues

Find yourself stuck using the package? Found a bug? Do you have general questions or suggestions for improving the package? Feel free to create an issue on [GitHub](https://github.com/offline-agency/laravel-mongo-auto-sync/issues), we’ll try to address it as soon as possible.

If you’ve found a bug regarding security please mail <support@offlineagency.com> instead of using the issue tracker.

## About Us

[Offline Agency](https://offlineagency.it) is a webdesign agency based in Padua, Italy.

Open source software is used in all projects we deliver. Laravel, Nginx, Ubuntu are just a few of the free pieces of software we use every single day. For this, we are very grateful. When we feel we have solved a problem in a way that can help other developers, we release our code as open source software on [GitHub](https://github.com/offline-agency).

This package was made by [Giacomo Fabbian](https://github.com/Giacomo92). There are [many other contributors](https://github.com/offline-agency/laravel-mongo-auto-sync/graphs/contributors) who devoted time and effort to make this package better.
