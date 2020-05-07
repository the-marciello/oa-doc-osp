---
meta:
  - name: descrizione
    content: Un pacchetto basato su laravel che permette la sincronizzazione delle modifiche tra le collection di un progetto MongoDB.
gitName: laravel-mongo-auto-sync
---

# laravel-mongo-auto-sync
Un pacchetto basato su laravel che permette la sincronizzazione delle modifiche tra le collection di un progetto [MongoDB](https://www.mongodb.com).

## Installazione e setup

### Prerequisiti

Questo pacchetto è basato su [jenssegers/laravel-mongodb](https://github.com/jenssegers/laravel-mongodb) v3 e per questo motivo bisogna innanzitutto installare i driver.

Per farlo apri il terminale e lancia:

``` bash
# install pear
curl -O https://pear.php.net/go-pear.phar

# install mongoDB PHP driver
sudo pecl install mongodb
```

### Installazione

Il pacchetto può essere installato via [composer](https://getcomposer.org/) utilizzando il seguente comando:

``` bash 
composer require offlineagency/laravel-mongo-auto-sync
```

### Come funziona

::: danger
GF
:::

### Prima di partire

In questa documentazione si farà riferimento alle collection Articoli, Categorie e Categoria Primaria per spiegare al meglio il funzionamento e le potenzialità di questo pacchetto.

Tra loro esistono [relazioni](#relationships) così definite:

- Articolo [EmbedsMany](#embedsmany) Categorie
- Categoria [EmbedsMany](#embedsmany) Articoli


- Articolo [EmbedsOne](#embedsone) Categoria Primaria
- Categoria Primaria [EmbedsMany](#embedsmany) Articoli

## Model 

In questa sezione vedremo come creare un model, dalla definizione dei campi alla dichiarazione delle [relazioni](#relationships). 

Prima di partire diamo però un'occhiata a come saranno i model un volta completati.

::: danger
TODO: add image sync explain
:::

#### Articolo

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

#### Categoria

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

#### Categoria Primaria

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

class PrimaryCategory extends MDModel
{
    protected $collection = 'primaryCategory';

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

### Items Attribute

Per prima cosa va creata una nuova classe il cui nome, per convennzione, è bene corrisponda a quello della collection. Questa classè dovrà estendere [MDModel]()

``` php
class Article extends MDModel
{
    //
}
```

Fatto ciò è possibile definire il nome della collection e tutti i campi di cui si necessita. Questi andranno dichiarati come array ma di default verranno salvati come stringa.

``` php
class Article extends MDModel
{
        protected $collection = 'article';
    
        protected $items = [
            'title' => [],
            'slug' => [],
            'content' => [],
            'planned_date' => []
        ];
}
```

Se si vuole invece altre tipologie di campo si possono utilizzare le opzioni implementate nel pacchetto, esse sono:

- **is-ml (multi-lingual)**: se viene utilizzata questa opzione il pacchetto andrà a creare un array contenente coppie di chiave-valore in cui il codice del paese corrisponderà all chiave (it_IT) mentre il contenuto sarà il valore. Questo permette di lavorare in modo comodo con siti o progetti che prevedono più di una lingua.
  
  Verrà qui utilizzato su tutti i campi di articolo che potrebbero prevedere una traduzione:
  
  ``` php
  class Article extends MDModel
  {
          protected $collection = 'article';
      
          protected $items = [
              'title' => [
                  'is-ml' => true
              ],
              'slug' => [],
              'content' => [
                  'is-ml' => true
              ],
              'planned_date' => []
          ];
  }
  ```
  
- **is-md (mongo-date)**: questa opzione creerà invece un campo di tipo mongo-date che permette di compiere operazioni e calcoli in modo più semplice.

  Verrà qui utilizzato per `planned_date`:
  
  ``` php
  class Article extends MDModel
  {
          protected $collection = 'article';
      
          protected $items = [
              'title' => [
                  'is-ml' => true
              ],
              'slug' => [],
              'content' => [
                  'is-ml' => true
              ],
              'planned_date' => [
                  'is-md' => true
              ]
          ];
  }
  ```

- **is-carbon-date**: anche questa opzione serve per le date, ma questa voltà creerà un'istanza di tipo [carbon](https://carbon.nesbot.com/) che da, oltre agli stessi vantaggi di [md](#is-md), altre funzionalità che possono essere approfondite nella loro [doc](https://carbon.nesbot.com/docs/#api-introduction).
    
  Verrà utilizzato anch'esso per `planned_date` anche se nel model finale verrà tenuto solo `is-md`:
  
   ``` php
   class Article extends MDModel
   {
           protected $collection = 'article';
       
           protected $items = [
               'title' => [
                   'is-ml' => true
               ],
               'slug' => [],
               'content' => [
                   'is-ml' => true
               ],
               'planned_date' => [
                   'is-carbon-date' => true
               ]
           ];
   }
   ```
  
- **is-array**: questa opzione permette invece di creare un campo di tipo array in cui è possibile salvare diverse informazioni tra oggetti della stessa collection. Utile per esempio se si vuole utilizzare la stessa collection per diversi form che contengono alcune informazioni base uguali e altre specifiche diverse.
  
  Verrà qui utilizzato per `additional information`:
  
  ``` php
  class Article extends MDModel
  {
          protected $collection = 'article';
      
          protected $items = [
              'title' => [
                  'is-ml' => true
              ],
              'slug' => [],
              'content' => [
                  'is-ml' => true
              ],
              'planned_date' => [
                  'is-md' => true
              ], 
              'additional_information' => [
                  'is-array' => true
              ]
          ];
  }
  ```

- **$dates**: un altro metodo per salvare le date è quello di creare un array `$dates` in cui indicare i campi che devono essere salvati come data.

  Verranno qui inseriti `creation_date` e `pubblication_date`:
  
  ``` php
  class Article extends MDModel
  {
          protected $collection = 'article';
      
          protected $items = [
              'title' => [
                  'is-ml' => true
              ],
              'slug' => [],
              'content' => [
                  'is-ml' => true
              ],
              'planned_date' => [
                  'is-md' => true
              ]
          ];
          
          protected $dates = [
              'creation_date',
              'publication_date'
          ];
  }
  ```
  
  ::: warning
  Attenzione però perchè questo metodo è intercambiabile con [is-md](#is-md) mentre possono essere indicati i campi che voglioamo salvare come istanze di [carbon](#is-carbon-date). 
  :::
  
### Relationships

::: warning
Description
:::

#### MiniModel

Come suggerisce il nome si tratta di "piccoli model", una selezione di campi di un altro model, che da ora in poi verrà chiamato padre. Qui andranno infatti indicati tutti i campi che vogliamo compaiano sotto la collection con cui il padre ha una relazione.  Per esempio andranno indicati tutti i campi di categoria che devono comparire sotto un articolo.

La struttura è la stessa di un model normale e come essi può avere diverse tipologie di campo, l'unica differenza è che questo deve estendere [DefaultMini]():

**MiniArticle**

``` php
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
    protected $items = [
        'ref_id' => [],
        'title' => [
            'is-ml' => true,
        ],
        'content' => [
            'is-ml' => true,
        ],
        'publication_date' => []
    ];
}
```

**MiniCategory**

``` php
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
    protected $items = [
        'ref_id' => [],
        'name' => [
            'is-ml' => true,
        ],
        'description' => [
            'is-ml' => true,
        ]
    ];
}
```

::: tip
E' consigliato utilizzare il campo `ref_id` per salvare l'id del model padre in modo che sia più semplice trovarlo quando dovrà essere utilizzato.
:::

#### Mongo Relation Attribute

Ora che è stato precisato cosa sono i MiniModel e come funzionano si può passare alla definizione delle relazioni.

Prima di tutto va creato un array `$mongoRelation` in cui verranno indicate tutte le relazioni:

**Article**

``` php 
class Article extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        //
    ];
}
```

**Category**

``` php 
class Category extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        //
    ];
}
```

**PrimaryCategory**

``` php 
class PrimaryCategory extends MDModel
{
    {...}
    
    protected $mongoRelation = [
        //
    ];
}
```

Oa si possono definire le relazione vere e proprie:

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

Si può notare come le relazioni siano composte da diversi campi, ogni dei quali ha una specifica funzione:

- **type**: indica il tipo di relazione e può essere [EmbedsOne](#embedsone) or [EmbedsMany](#embedsmany)

- **mode**: opzionale e non più utilizzato

- **model**: è il MiniModel della collection con cui intrattiene la relazione

- **modelTarget**: è il model della collection con cui intrattiene la relazione

- **methodOnTarget**: è il nome che viene dato alla relazione nel model della collection con cui intrattiene la relazione  

- **modelOnTarget**: è il MiniModel del model in cui si si trova

#### Target

Un concetto molto importante è quello dei target ovvero, come appurato più sopra, la collection con cui si definisce la relazione.

E' buona norma indicarli soprattutto per due motivi:

- Si usa tutto il potenziale di Eloquent
- Puoi accedere ai campo della collection relazionata come fai per la principale, quella in cui ti trovi

Detto ciò si può comunque decidere di non usarli ma si dovrà modificare il codice in questa maniera(categoria primaria):

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

In questa maniera la collection Categoria Primaria non verrà creata ma verrà esclusivamente salvata sugli articoli.

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

Per evitare errori quando si salva o aggiorna un oggetto è consigliabile generare la documentazione del model. Essa farà un semplice controllo sul tipo di campo che riceve in input.

Per farlo basta utilizzare il comando [GenerateModelDocumentatio](#generatemodeldocumentation). Va quindi lanciato nel proprio terminale

``` bash
php artisan model-doc:generate {collection_name}
```

#### Drop Collection

Se invece ci fosse la necessità di eliminare una collection basterà usare il comando [DropCollection](#dropcollection)

Basta lanciare nel proprio terminale:

``` bash
drop:collection {collection_name}
```

#### Check DB consistency

::: warning
Verrà aggiunto a breve, probabilmente nella prossima release, e lo sarà reperibile [qui](#checkdbconsistency)
:::

::: warning
Sistemare la descrizione

Questo comando controllerà che le relazioni vengano salvate nel modo corretto. Permetterà infatti di assicurarsi che tutti i MiniModel vengano salvati nel target e che tutti gli items vengano salvati nella colllection con cuui si ha la relazione
:::

## Store Operation

### Description

#### Advantages

Come già annunciato questo pacchetto permette di salvare un oggetto in modo tale che ne vengano salvate anche le relazioni in tutte le rispettive collection. Seguendo infatti gli esempi fatti fin ora quando verrà salvato un nuovo articolo a cui verranno attribuite della categorie non solo esse saranno salvate al di sotto dell'articolo bensì verrà salvato anche l'articolo al di sotto di ogni categoria coinvolta.

#### Images

Ecco allora qualche immagine che rappresenta quanto appena spiegato:

::: danger
Aggiungere immagine
:::

### Usage

Ecco la pratica di quanto fin ora spiegato.

Per prima cosa va creata una funzione `store()` in cui si riceverà in input `$request`:

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

Nella `$request` saranno contenuti tutti i campi provenienti, per esempio, da un form:

::: danger 
Aggiungere immagini del form
::: 

Può essere ora creata una nuova istanza dell'oggetto che si vuole salvare, in questo caso un articolo:

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

Ora tocca al salvataggio di tutti i campi necessari.

Per prima cosa se i campi che ricevuti dal form, che sono quindi contenuti nella request, hanno lo stesso nome presente nel model essi saranno salvati direttamente in quella posizione.

::: danger
TODO - aggiungere immagine del contenuto della request
:::

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

E' arrivato il momento di aggiungere le relazioni, ovvero ricreare attraverso i campi ricevuti nella request (come per esempio l'id) il MiniModel della collection relazionate. 

Per fare ciò bisogna creare un json contenente:

- EmbedsOne: un array con l'oggetto contenente tutti i campi del [MiniModel](#minimodel);
- EmbedsMany: un array contenente tanti oggetti quanti quelli scelti durante la creazione dell'articolo; anch'essi dovranno contenere tutti i campi del [MiniModel](#minimodel).

::: tip
E' stato scelto il formato json per consentirne la creazione a frontend
:::

Esistono infiniti metodi per fare ciò ma qui ne verrà riportato uno solo che ognuno può decidere di seguire o meno:

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

#### Store Partial Request

Si può anche decidere di non salvare le relazioni ma, in questo caso, dovrà essere creata una partial request. 

E' stato predisposto un metodo semplice ed intuitivo per farlo, basterà infatti aggiungere un parametro `$options` alla funzione `storeWithSync` che verrà aggiunto proprio qui.

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

Se invece si volesse salvare anche delle relazioni basterà rimuovere l'ultimo parametro aggiunto.

### Result

#### With Relation

L'output di un salvataggio di un articolo con relative [relazioni](#store-with-relation) sarà simile a questo:

::: danger
Add images
:::

#### With Partial Request

Mentre il risultato senza di [esse](#store-partial-request) assomiglierà a questo:

::: danger
Add images
::: 

## Update Operations

### Description

#### Advantages 

Update With Sync permette di modificare un oggetto nella sua collection e in tutte le collection correlate in modo semplice e veloce. Infatti, seguendo gli esempi utilizzati fini ad ora, quando modificherai un articolo, questa modifica sarà salvata anche in tutte le collections con cui esso intrattiene una relazione. Vice versa quano una categoria verrà modificata, questo cambiamento verrà registrato anche in tutti gli articoli che la utilizzano. Questo permette innanzitutto di risparmiare molto tempo ma soprattutto di evitare errori.

#### Images

::: danger
Add images
:::
 ### Usage 

Mettiamo in pratica quanto fin ora detto.

Per prima cosa va creata una funzione `update()` in cui si riceve in input `$request` e `$id` che in questo esempio sarà "l'elemento identificativo" dell'articolo:

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

Nella $request saranno presenti tutti i campi provenienti, per esempio, da un form.

::: danger 
aggiungere immagini del form
:::

Ora va cercato l'oggetto da modificare attraverso "l'elemnto riconoscitivo" che abbiamo ricevuto in input, in questo caso `$id`.

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

#### Field

Ora si può passare alla vera e propria modifica dei campi.

Anche qui, come nello [store](#store-operation), se i campi contenuti nella $request hanno lo stesso nome presente nel model verranno aggiornati automaticamente passando, appunto, la $request nei parametri.

::: danger
add images
:::

Ovviamente se il campo da modificare non fosse uno di quelli provenienti dal form è possibile creare un array in cui la chiave corrisponderà al nome el campo definito nel model e il valore sarà quello nuovo che vorremo vedere a database:

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

Se venisse aggiunta o rimossa una categoria, o più in generale apportate delle modifiche ad una delle relazioni, perchè questa modifica abbia effetto vanno seguite le regole dello [store](#store-with-relation) riportate qui in breve:  

- EmbedsOne: un array con l'oggetto contenente tutti i campi del [MiniModel](#minimodel);
- EmbedsMany: un array contenente tanti oggetti quanti quelli scelti durante la creazione dell'articolo; anch'essi dovranno contenere tutti i campi del [MiniModel](#minimodel).

#### Update Partial Request

Se invece l'intento fosse quello di modificare dei campi della collection su cui si sta lavorando senza toccare in alcun modo le relazioni è possibile, come per lo store, stanziare una `partial request`.

Ecco il codice esempio:

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

### Result

#### With Relation

L'output di una modifica di un articolo con relative relazioni sarà simile a questa:

::: danger
add images
:::

#### With Partial Request

Mentre il risultato senza toccare le relazioni assomiglierà a questo:

::: danger
add images
:::

## Destroy Operation

::: danger
GF
:::

## Questions & issues

Ti trovi bloccato nell'utilizzo del pacchetto? Trovi un bug? Hai domande o suggerimentiper migliorare il pacchetto? Sentiti libero di creare un issue su [GitHub](https://github.com/offline-agency/laravel-mongo-auto-sync/issues), proveremo a risolverlo il primna possibile.

If you’ve found a bug regarding security please mail <support@offlineagency.com> instead of using the issue tracker.

Se trovi dei problemi relativi alla sicurezza scrivi a <support@offlineagency.com>

## About Us

[Offline Agency](https://offlineagency.it) è un agenzia di webdesign situata a Padova, in Italia

In tutti i nostri progetti utilizziamo software open source. Laravel, Nginx e Ubunto sono solo alcuni dei pacchetti che utilizziamo qutidianamente. Inolte quando riteniamo di aver risolto una problematica comune a molti, rilasciamo il nostro codice su [GitHub](https://github.com/offline-agency) in modo da poter aiutare altri sviluppatori.

This package was made by [Giacomo Fabbian](https://github.com/Giacomo92). There are [many other contributors](https://github.com/offline-agency/laravel-mongo-auto-sync/graphs/contributors) who devoted time and effort to make this package better.

Questo pacchetto è stato ideato e creato da [Giacomo Fabbian](https://github.com/Giacomo92). Ci sono inoltre molti [altri collaboratori](https://github.com/offline-agency/laravel-mongo-auto-sync/graphs/contributors) che hanno devoluto tempo e forza alla realizzazzione di questo progetto e al suo miglioramento.

## Demo

### Commands

#### GenerateModelDocumentation

#### DropCollection

#### CheckDbConsistency

## FAQ

::: warning
Questions & Answers
:::


