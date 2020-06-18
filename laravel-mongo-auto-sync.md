---
meta:
  - name: description
    content: This package provides a better support for MongoDB relationships in Laravel Projects.
gitName: laravel-mongo-auto-sync
---

# Laravel MongoDB Relationships
This package provides a better support for [MongoDB](https://www.mongodb.com) relationships in [Laravel](https://laravel.com/) Projects.
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
- Handle sub document as Model in order to exploit Laravel ORM support during write operation (without sync feature)<Badge text="TO BE TEST" type="warning"/> 
- Handle referenced sub document as Model in order to exploit Laravel ORM support during write operation (without sync feature)<Badge text="TO DO" type="error"/> 
- Advance cast field support

## Use cases
- Blog: see demo [here](https://github.com/offline-agency/laravel-mongodb-blog)
- Ecommerce
- API System for mobile application o for generated static site
- Any projects that require fast read operations and (slow) write operations that can be run on background

## Installation

### Prerequisites
Make sure you have the MongoDB PHP driver installed. You can find installation instructions at [http://php.net/manual/en/mongodb.installation.php](http://php.net/manual/en/mongodb.installation.php)

### Laravel version Compatibility

| Laravel     | Package     |
| ----------- | ----------- |
| 5.8.x       | 1.x         |
| 6.x         | 1.x         |
| 7.x         | <Badge text="TO BE TEST" type="warning"/>         |

### Composer Installation

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

Below is a list of all possible configurations:

 [Field Types](#field-types)<br>
 [Editable](#editable-is-editable)<br>
 [Default value](#default-value)<br>

#### Field Types

Below is a list of all possible field types:

 [Array](#array-is-array)<br>
 [Boolean](#boolean) <Badge text="TO DO" type="error"/><br>
 [Date](#date)<br>
 [Default](#default) <Badge text="TO DO" type="error"/><br>
 [Double](#double) <Badge text="TO DO" type="error"/> <br>
 [GeoJSON Objects](#geojson-objects) <Badge text="TO DO" type="error"/> <br>
 [Int](#int) <Badge text="TO DO" type="error"/> <br>
 [Multi language](#multi-language-is-ml)<br>
 [Slug](#slug) <Badge text="TO DO" type="error"/> <br>
 [String](#string) <Badge text="TO DO" type="error"/> <br>
 
 **NB:**<br>
 The key is between brackets and the value is in boolean format.<br>
 ex: for Array type the key is ```is-array```
 
#### Array (is-array)
Validation or casting of an array field of any type.

#### Boolean <Badge text="TO DO" type="error"/>
Validation or casting in to a boolean value.

#### Date

 - **String (is-md)**<br> 
Validation or casting a date in a string format and save it in [UTC Mongo date time](https://www.php.net/manual/en/class.mongodb-bson-utcdatetime.php). 

- **Carbon (is-carbon-date)**<br>
Validation or casting a [Carbon](https://carbon.nesbot.com/) instance date field and save it in [UTC Mongo date time](https://www.php.net/manual/en/class.mongodb-bson-utcdatetime.php). 

#### Default 
This is the default value that is assigned if no field type is defined. No validation or casting will be applied with this field type.
 
#### Double <Badge text="TO DO" type="error"/>
Validation or casting in to a double value.

#### GeoJSON Objects <Badge text="TO DO" type="error"/>
Validation or casting in to [GeoJSON Objects](https://docs.mongodb.com/manual/reference/geojson/).

#### Int <Badge text="TO DO" type="error"/>
Validation or casting in to an int value.

#### Multi language (is-ml)
Save an array structure with where the key is the current language [^1] and the value is the string passed.

[^1]: See Laravel docs here to understand how localization works. 


``` php
  /*
  Article::class {
    'title' => [
        'en_EN' => 'Today news',
        'es_ES' => 'Noticias de hoy',
        'it_IT' => 'Notizie di oggi',
        
        .        
        .
        .

        'zh_CN'=> '今天新闻'
     }
  }
  */
  ```

#### Slug <Badge text="TO DO" type="error"/>
Validation or casting in to a slugified string value.

#### String <Badge text="TO DO" type="error"/>
Validation or casting in to a string value.

#### Editable (is-editable)
This feature prevents unexpected field update.<br>
Common use case: slug field of an article.

 **NB:**<br>
 The key is between brackets, and the value is in the boolean format.<br>
 ex: for Editable the key is ```is-array```
 
#### Default Value <Badge text="TO DO" type="error"/>
This feature allows the setting of a default value when null is passed.

### Relationship

``` php 
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        'categories' => [
            'type' => 'EmbedsMany',
            'model' => 'App\Models\MiniCategory',
            'modelTarget' => 'App\Models\Category',
            'methodOnTarget' => 'articlelist',
            'modelOnTarget' => 'App\Models\MiniArticle',
        ]
    ];
}
```

This is the possible configurations:

- **key**: This is the relation name on the current collection

- **type**: indicate the type of the relationship, and it can be [EmbedsOne](#embedsone) or [EmbedsMany](#embedsmany)

- **mode**: (optional) currently not used

- **model**: is the MiniModel of current collection

- **modelTarget**: is the Model of the related collection

- **methodOnTarget**: is the relation name on the model of the related collection

- **modelOnTarget**: is the MiniModel of sub document of the target collection

If you want to exploit all the benefits of Laravel ORM you have to define the relationships this way:

``` php
<?php

class Article extends MDModel
{
    {...}

    public function category()
    {
        return $this->embedsOne('App\Models\MiniCategory'];
    }

}

```
So now when you dump ```$article->category``` you will get an instance of ```MiniCategory``` instead of an array.
For more information about this feature you can check [here](https://github.com/jenssegers/laravel-mongodb#basic-usage-1)

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

The command checks if the model exist in your project and if it doesn’t, it will print an error message like this:
`Error: <collection_name> Model not found`

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

#### Check DB consistency <Badge text="TO DO" type="error"/> 

This command, which will be added probably in the next release (see [Roadmap](#roadmap) section), allow you to check if the relations will be saved in the right way. It makes sure the sub document exist in the current collection and on the related collection.

## Operations

### Store

#### Usage

First of all you have to create a function `store()` where you receive a `$request` in input.

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

        $additional_parameters = [
           'slug' => Str::slug($request->input('title'))
        ];

        $options = [];

        $article->storeWithSync($request, $additional_parameters, $options);
    }
}
```
You can pass to storeWithSync() two parameters:
- **$request** that is an instance of Request. If your request key is present on the $items array (see [Model Setup](#fields) section) the value will be stored to database with no extra code.
- **$additional_parameters** is an (optional) key-value array. You can pass here other fields, that can be stored to database. 
- **$options** this is an (optional) key-value array. You can pass here advance options. This is the possibile values:
    - 'partial-request' boolean

#### Store Relationships

Now you have to add the relationships. 

You need a json that contains: 

- **EmbedsOne:** an array with an object that has all the fields of the [MiniModel](#minimodel);
- **EmbedsMany:** an array with an object for each, in this case, category that contains all the fields of the [MiniModel](#minimodel).

We choose Json format to ease integration with frontend. 

For example, you can create new functions called `getCategories` and `getPrimaryCategory` as following:

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
        $article->storeWithSync($request, $arr);
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


### Update

#### Usage 

#### Field

First of all you have to create an `update()` function where you receive `$request` and `$id` in input.
After that you can search the article passing the `$id` as parameter on `find()` method.

If you want to edit an extra field you can create an array which contains this fields:

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
            'slug' => Str::slug($request->input('title'))
        ];
    }
}
```

#### Update a Relationships

This is the supported relationships type: 
 - **EmbedsOne:** an array with an object that has all the fields of the [MiniModel](#minimodel);
 - **EmbedsMany:** an array with an object for each, in this case, category that contains all the fields of the [MiniModel](#minimodel).
 
 We choose Json format to ease integration with frontend. 
 
 For example, you can create new functions called `getCategories` and `getPrimaryCategory` as following:
 
 ``` php
 <?php
 
 namespace App\Controller;
 
 use App\Models\Article;
 use App\Models\Category;
 use Illuminate\Support\Str;
 use MongoDB\BSON\UTCDateTime;
 use App\Http\Controllers\Controller;
 use stdClass;
 
 class ArticleController extends Controller
 {
     public function update($request)
     {
         $article = Article::find($id);
 
         $arr = [
             'slug' => Str::slug($request->input('title')),
             'categories' => $this->getCategories($request->categories_id),
             'primaryCategory' => $this->getPrimaryCategories($request->categories_id)
         ];
         $article->updateWithSync($request, $arr);
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
#### Update With Partial Request

If you need to edit only a partition of items and relationships you can pass `'request_type' => 'partial'` on the `$options` to the `updateWithsSync()` method. 
This configuration will disable all exceptions triggered by a missing field, and it will skip the field/relationships processing. 

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

### Destroy

#### Usage

First of all you have to create an `destroy()` function where you receive `$id` in input.
After that you can search the article passing the `$id` as parameter on `find()` method.
With the `destroyWithSync()` method you will remove the current instance from database and it will also search for any sub documents in other collection. 
 
 If you are familiar with Mysql you can find this feature similar to [ON DELETE CASCADE](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html).
``` php
<?php

namespace App\Controller;

use App\Http\Controllers\Controller;
use App\Models\Aticle;

class ArticleController extends Controller
{
    public function destroy($id)
    {
        $article = new Article;
        $article = $article->find($id);
        $article->destroyWithSync();
    }
}
```

 

## Roadmap :rocket:
- Refactor target synchronization to Observer pattern, so all this operation can be run on background using [Laravel Queue System](https://laravel.com/docs/5.8/queues). This will also speed up all the operations in the collection that is primary involved in write operations.
- Command Analyse Database: This command will analyse the database in order to find some relationship error. 
Ex: An article with a category associated that is not present on the Category's sub document.
- Refactor **save()** method in order to handle CRUD operation on relationship also without sync.
- Support for [referenced relationships](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/).
- Better support for all field types.
- DestroyWithSync() without delete sub documents on other collections.
- Add more tests.
- Fix typo errors.

## Questions & issues

Find yourself stuck using the package? Found a bug? Do you have general questions or suggestions for improving the package? Feel free to create an issue on [GitHub](https://github.com/offline-agency/laravel-mongo-auto-sync/issues), we’ll try to address it as soon as possible.

If you’ve found a bug regarding security please mail <support@offlineagency.com> instead of using the issue tracker.

## About Us

[Offline Agency](https://offlineagency.it) is a webdesign agency based in Padua, Italy.

Open source software is used in all projects we deliver. Laravel, Nginx, Ubuntu are just a few of the free pieces of software we use every single day. For this, we are very grateful. When we feel we have solved a problem in a way that can help other developers, we release our code as open source software on [GitHub](https://github.com/offline-agency).

This package was made by [Giacomo Fabbian](https://github.com/Giacomo92). There are [many other contributors](https://github.com/offline-agency/laravel-mongo-auto-sync/graphs/contributors) who devoted time and effort to make this package better.
