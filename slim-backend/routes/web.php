<?php
use Slim\App;
use App\Controllers\ProductController;
use App\Controllers\CategoryController;
use App\Controllers\ReviewController;
use App\Controllers\CartController;

return function(App $app) {
    $app->get('/', fn($req,$res) => $res->getBody()->write("Server running...") && $res);

    // Products
    $product = new ProductController();
    $app->get('/products', [$product,'index']);
    $app->get('/product/{id}', [$product,'show']);
    $app->get('/trending', [$product,'trending']);
    $app->get('/similar/{id}', [$product,'similar']);
    $app->get('/todays-sales', [$product,'todaysSales']);

    // Categories
    $category = new CategoryController();
    $app->get('/categories', [$category,'index']);
    $app->get('/category/{id}', [$category,'show']);

    // Reviews
    $review = new ReviewController();
    $app->get('/reviews', [$review,'index']);
    $app->get('/reviews/{id}', [$review,'show']);
    $app->get('/reviews/product/{product_id}', [$review,'byProduct']);

    // Cart
    $cart = new CartController();
    $app->get('/cart_items', [$cart,'index']);
    $app->get('/cart_items/{id}', [$cart,'show']);
    $app->put('/cart_items/{id}/update', [$cart,'update']);
    $app->delete('/cart_items/{id}/delete', [$cart,'delete']);
};
