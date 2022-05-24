---
meta: 
  - name: description
    content: A simple cart implementation for Laravel with fiscal support.
gitName: laravel-cart
---

# laravel-cart

A simple cart implementation for Laravel with fiscal support.

[![Github](./assets/icon/github.svg "Github Icon")](https://github.com/offline-agency/laravel-cart)
[![Latest Stable Version](https://poser.pugx.org/offline-agency/laravel-cart/v/stable)](https://packagist.org/packages/offline-agency/laravel-cart)
[![Total Downloads](https://img.shields.io/packagist/dt/offline-agency/laravel-cart.svg?style=flat-square)](https://packagist.org/packages/offline-agency/laravel-cart)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Laravel](https://github.com/offline-agency/laravel-cart/actions/workflows/laravel.yml/badge.svg?branch=main)](https://github.com/offline-agency/laravel-cart/actions/workflows/laravel.yml)
[![StyleCI](https://github.styleci.io/repos/167277388/shield)](https://styleci.io/repos/167277388)
<!--[![codecov](https://codecov.io/gh/offline-agency/laravel-cart/branch/master/graph/badge.svg?token=0BHADJQYAW)](https://codecov.io/gh/offline-agency/laravel-cart)-->

## Installation

Install the package through [Composer](https://getcomposer.org/).

Run the Composer require command from the Terminal:

``` bash
composer require offline-agency/laravel-cart
```

## Overview

Look at one of the following topics to learn more about Laravel Cart

- [Usage](#usage)
- [Collection](#collection)
- [Instances](#instances)
- [Models](#models)
- [Database](#database)
- [Exceptions](#exceptions)
- [Events](#events)
- [Example](#example)

## Usage

The Cart gives you the following methods to use:

### Cart::add()

Adding an item to the cart is really simple, you just use the add() method, which accepts a variety of parameters.

In its most basic form you can specify the id, name, quantity, price of the product you'd like to add to the cart.

``` bash
Cart::add('293ad', 'Product 1', 1, 9.99);
```

As an optional fifth parameter you can pass it options, so you can add multiple items with the same id, but with (for instance) a different size.

``` bash
Cart::add('293ad', 'Product 1', 1, 9.99, ['size' => 'large']);
```

**The `add()` method will return an CartItem instance of the item you just added to the cart**.

``` bash
Cart::add(['id' => '293ad', 'name' => 'Product 1', 'qty' => 1, 'price' => 9.99, 'options' => ['size' => 'large']]);
```

New in version 2 of the package is the possibility to work with the `Buyable` interface. 
The way this works is that you have a model implement the `Buyable` interface, which will make 
you implement a few methods so the package knows how to get the id, name and price from your 
model. This way you can just pass the `add()` method a model and the quantity, and it will 
automatically add it to the cart.

**As an added bonus it will automatically associate the model with the CartItem**

``` bash
Cart::add($product, 1, ['size' => 'large']);
```

As an optional third parameter you can add options.

``` bash
Cart::add($product, 1, ['size' => 'large']);
```

Finally, you can also add multiple items to the cart at once. You can just pass the `add() 
method an array of arrays, or an array of Buyables, and they will be added to the cart.

**When adding multiple items to the cart, the `add()` method will return an array of CartItems.**

``` bash
Cart::add([
  ['id' => '293ad', 'name' => 'Product 1', 'qty' => 1, 'price' => 10.00],
  ['id' => '4832k', 'name' => 'Product 2', 'qty' => 1, 'price' => 10.00, 'options' => ['size' => 'large']]
]);

Cart::add([$product1, $product2]);
```

### Cart::update()

To update an item in the cart, you'll first need the rowId of the item. 
Next you can use the `update()` method to update it.

If you simply want to update the quantity, you'll pass the update method the rowId and 
the new quantity:

``` bash
$rowId = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

Cart::update($rowId, 2); // Will update the quantity
```

If you want to update more attributes of the item, you can either pass the update method an 
array or a `Buyable` as the second parameter. This way you can update all information of the 
item with the given rowId.

``` bash
Cart::update($rowId, ['name' => 'Product 1']); // Will update the name

Cart::update($rowId, $product); // Will update the id, name and price
```

### Cart::remove()

To remove an item for the cart, you'll again need the rowId. This rowId you simply pass to 
the `remove()` method, and it will remove the item from the cart. If the Cart Item contains a 
coupon it will be removed from the coupons array on cart object.
    
``` bash
$rowId = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

Cart::remove($rowId);
```

### Cart::get()

If you want to get an item from the cart using its rowId, you can simply call the `get()` 
method on the cart and pass it the rowId.

``` bash
$rowId = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

Cart::get($rowId);
```

### Cart::content()

Of course, you also want to get the carts content. This is where you'll use the `content` method. 
This method will return a Collection of CartItems which you can iterate over and show the 
content to your customers.

``` bash
Cart::content();
```

This method will return the content of the current cart instance, if you want the content of 
another instance, simply chain the calls.

``` bash
Cart::instance('wishlist')->content();
```

### Cart::destroy()

If you want to completely remove the content of a cart, you can call the `destroy` method on 
the cart. This will remove all CartItems from the cart for the current cart instance.

``` bash
Cart::destroy();
```

### Cart::total()

The `total()` method can be used to get the calculated total of all items in the cart, given 
there price and quantity.

``` bash
Cart::total();
```

The method will automatically format the result, which you can tweak using the three optional parameters.

``` bash
Cart::total($decimals, $decimalSeperator, $thousandSeperator);
```

You can set the default number format in the config file.

**If you're not using the Facade, but use dependency injection in your (for instance) 
Controller, you can also simply get the total property `$cart->total`**

### Cart::vat()

The `vat()` method can be used to get the calculated amount of vat for all items in the cart, 
given there price and quantity.

``` bash
Cart::vat();
```

The method will automatically format the result, which you can tweak using the three optional parameters

``` bash
Cart::vat($decimals, $decimalSeperator, $thousandSeperator);
```

You can set the default number format in the config file.

**If you're not using the Facade, but use dependency injection in your (for instance) 
Controller, you can also simply get the tax property `$cart->vat`**

### Cart::subtotal()

The `subtotal()` method can be used to get the total of all items in the cart, minus the total amount of tax.

``` bash
Cart::subtotal();
```

The method will automatically format the result, which you can tweak using the three optional parameters

``` bash
Cart::subtotal($decimals, $decimalSeperator, $thousandSeperator);
```

You can set the default number format in the config file.

**If you're not using the Facade, but use dependency injection in your (for instance) 
Controller, you can also simply get the subtotal property `$cart->subtotal`**

### Cart::count()

If you want to know how many items there are in your cart, you can use the `count()` method. 
This method will return the total number of items in the cart. So if you've added 2 books and 
1 shirt, it will return 3 items.

``` bash
Cart::count();
``` 

### Cart::search()

To find an item in the cart, you can use the `search()` method.

**This method was changed on version 2**

Behind the scenes, the method simply uses the filter method of the Laravel Collection class. 
This means you must pass it a Closure in which you'll specify you search terms.

If you for instance want to find all items with an id of 1:

``` bash
$cart->search(function ($cartItem, $rowId) {
	return $cartItem->id === 1;
});
```

As you can see the Closure will receive two parameters. The first is the CartItem to perform 
the check against. The second parameter is the rowId of this CartItem.

**The method will return a Collection containing all CartItems that where found**

This way of searching gives you total control over the search process and gives you the 
ability to create very precise and specific searches.

## Collections

On multiple instances the Cart will return to you a Collection. 
This is just a simple Laravel Collection, so all methods you can call on a Laravel Collection 
are also available on the result.

As an example, you can quickly get the number of unique products in a cart:

``` bash
Cart::content()->count();
```

Or you can group the content by the id of the products:

``` bash
Cart::content()->groupBy('id');
```

## Instances

The package supports multiple instances of the cart. The way this works is like this:

You can set the current instance of the cart by calling `Cart::instance('newInstance')`. 
From this moment, the active instance of the cart will be `newInstance`, so when you add, 
remove or get the content of the cart, you're work with the `newInstance` instance of the cart. 
If you want to switch instances, you just call `Cart::instance('otherInstance')` again, and you're
working with the `otherInstance` again.

So a little example:

``` bash
Cart::instance('shopping')->add('192ao12', 'Product 1', 1, 9.99);

// Get the content of the 'shopping' cart
Cart::content();

Cart::instance('wishlist')->add('sdjk922', 'Product 2', 1, 19.95, ['size' => 'medium']);

// Get the content of the 'wishlist' cart
Cart::content();

// If you want to get the content of the 'shopping' cart again
Cart::instance('shopping')->content();

// And the count of the 'wishlist' cart again
Cart::instance('wishlist')->count();
```

**N.B. Keep in mind that the cart stays in the last set instance for as long as you don't 
set a different one during script execution**.

**N.B.2 The default cart instance is called `default`, so when you're not using instances,
`Cart::content(); is the same as `Cart::instance('default')->content()`**.

## Models

Because it can be very convenient to be able to directly access a model from a CartItem 
is it possible to associate a model with the items in the cart. Let's say you have a 
`Product` model in your application. With the `associate()` method, you can tell the cart 
that an item in the cart, is associated to the `Product` model.

That way you can access your model right from the `CartItem`!

The model can be accessed via the `model` property on the CartItem.

**If your model implements the `Buyable` interface, and you used your model to add the 
item to the cart, it will associate automatically**.

Here is an example:

``` bash
$product = Product::find(1);

// First we'll add the item to the cart.
$cartItem = Cart::add('293ad', 'Product 1', 1, 9.99, ['size' => 'large']);

// Next we associate a model with the item.
Cart::associate($cartItem->rowId, $product);

// Or even easier, call the associate method on the CartItem!
$cartItem->associate($product);

// You can even make it a one-liner
Cart::add('293ad', 'Product 1', 1, 9.99, ['size' => 'large'])->associate($product);

// Now, when iterating over the content of the cart, you can access the model.
foreach(Cart::content() as $row) {
	echo 'You have ' . $row->qty . ' items of ' . $row->model->name . ' with description: "' . $row->model->description . '" in your cart.';
}
```

## Database

- [Config](#config)
- [Storing the cart](#storing-the-cart)
- [Restoring the cart](#restoring-the-cart)

### Configuration

To save cart into the database, so you can retrieve it later, the package needs to know which 
database connection to use and what the name of the table is. By default, the package will use 
the default database connection and use a table named `cart`. If you want to change these options, 
you'll have to publish the `config` file.

``` bash
php artisan vendor:publish --provider="OfflineAgency\LaravelCart\CartServiceProvider" --tag="config"
```

This will give you a cart.php config file in which you can make the changes.

To make your life easy, the package also includes a ready to use migration which you can 
publish by running:

``` bash
php artisan vendor:publish --provider="OfflineAgency\LaravelCart\CartServiceProvider" --tag="migrations"
```

This will place a `cart` table's migration file into `database/migrations` directory. Now all you 
have to do is run `php artisan migrate` to migrate your database.

### Storing the cart

To store your cart instance into the database, you have to call the `store($identifier)` method. 
Where `$identifier is a random key, for instance the id or username of the user.

``` bash
Cart::store('username');

// To store a cart instance named 'wishlist'
Cart::instance('wishlist')->store('username');
```

### Restoring the cart

If you want to retrieve the cart from the database and restore it, all you have to do is call 
the `restore($identifier)` where `$identifier` is the key you specified for the `store` method.

``` bash
Cart::restore('username');

// To restore a cart instance named 'wishlist'
Cart::instance('wishlist')->restore('username');
```

### Add a coupon to cart instance for a specific cart item

``` bash
// First we'll add the item to the cart.
$cartItem = Cart::add('293ad', 'Product 1', 1, 9.99, ['size' => 'large']);

Cart::addCoupon('07d5da5550494c62daf9993cf954303f', 'BLACK_FRIDAY_2021','fixed', 100);
```

## Exceptions

The Cart package will throw exceptions if something goes wrong. This way it's easier to debug 
your code using the Cart package or to handle the error based on the type of exceptions. 
The Cart packages can throw the following exceptions:

|Exception|Reason|
|---------|------|
|*CartAlreadyStoredException*|When trying to store a cart that was already stored using the specified identifier|
|*InvalidRowIDException*|When the rowId that got passed doesn't exists in the current cart instance|
|*UnknownModelException*|When you try to associate an none existing model to a CartItem.|

## Events

The cart also has events build in. There are five events available for you to listen for.

|Event|Fired|Parameter|
|-----|-----|---------|
|cart.added|When an item was added to the cart.|The `CartItem` that was added.|
|cart.updated|When an item in the cart was updated.|The `CartItem` that was updated.|
|cart.removed|When an item is removed from the cart.|The `CartItem` that was removed.|
|cart.stored|When the content of a cart was stored.|-|
|cart.restored|When the content of a cart was restored.|-|

## Example

Below is a little example of how to list the cart content in a table:

``` bash

// Add some items in your Controller.
Cart::add('192ao12', 'Product 1', 1, 9.99);
Cart::add('1239ad0', 'Product 2', 2, 5.95, ['size' => 'large']);

// Display the content in a View.
<table>
   	<thead>
       	<tr>
           	<th>Product</th>
           	<th>Qty</th>
           	<th>Price</th>
           	<th>Subtotal</th>
       	</tr>
   	</thead>

   	<tbody>

   		<?php foreach(Cart::content() as $row) :?>

       		<tr>
           		<td>
               		<p><strong><?php echo $row->name; ?></strong></p>
               		<p><?php echo ($row->options->has('size') ? $row->options->size : ''); ?></p>
           		</td>
           		<td><input type="text" value="<?php echo $row->qty; ?>"></td>
           		<td>$<?php echo $row->price; ?></td>
           		<td>$<?php echo $row->total; ?></td>
       		</tr>

	   	<?php endforeach;?>

   	</tbody>
   	
   	<tfoot>
   		<tr>
   			<td colspan="2">&nbsp;</td>
   			<td>Subtotal</td>
   			<td><?php echo Cart::subtotal(); ?></td>
   		</tr>
   		<tr>
   			<td colspan="2">&nbsp;</td>
   			<td>Tax</td>
   			<td><?php echo Cart::vat(); ?></td>
   		</tr>
   		<tr>
   			<td colspan="2">&nbsp;</td>
   			<td>Total</td>
   			<td><?php echo Cart::total(); ?></td>
   		</tr>
   	</tfoot>
</table>
```

## Testing 

Run the tests with:

``` bash
composer test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security-related issues, please email <support@offlineagency.com> instead of using the issue tracker.

## Credits

- [Giacomo Fabbian](https://github.com/Giacomo92)
- [All Contributors](../../contributors)

## About us

Offline Agency is a web design agency based in Padua, Italy. You'll find an overview of our projects [on our website](https://offlineagency.it/).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.