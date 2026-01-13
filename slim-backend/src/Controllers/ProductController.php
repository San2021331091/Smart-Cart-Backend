<?php
namespace App\Controllers;

use App\Models\Product;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProductController {

    // GET /products
    public function index(Request $request, Response $response) {
        $products = Product::getAll($request->getQueryParams());

        $response->getBody()->write(json_encode($products));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /product/{id}
    public function show(Request $request, Response $response, $args) {
        $product = Product::getById((int)$args['id']);

        if (!$product) {
            $response->getBody()->write(json_encode(['error' => 'Product not found']));
            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($product));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /trending
    public function trending(Request $request, Response $response) {
        $trending = Product::getTrending();

        $response->getBody()->write(json_encode($trending));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /similar/{id}
    public function similar(Request $request, Response $response, $args) {
        $similar = Product::getSimilar((int)$args['id']);

        if ($similar === null) {
            $response->getBody()->write(json_encode(['error' => 'Product not found']));
            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($similar));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    // GET /todays-sales
    public function todaysSales(Request $request, Response $response) {
        $sales = Product::getTodaysSales();

        $response->getBody()->write(json_encode($sales));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
