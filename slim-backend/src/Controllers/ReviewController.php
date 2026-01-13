<?php
namespace App\Controllers;

use App\Models\Review;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ReviewController {

    // GET /reviews
    public function index(Request $request, Response $response) {
        $params = $request->getQueryParams();
        $reviews = isset($params['product_id']) ? Review::getByProduct((int)$params['product_id']) : Review::getAll();

        $response->getBody()->write(json_encode($reviews));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // GET /reviews/{id}
    public function show(Request $request, Response $response, $args) {
        $review = Review::getById((int)$args['id']);

        if (!$review) {
            $response->getBody()->write(json_encode(['error' => 'Review not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($review));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // GET /reviews/product/{product_id}
    public function byProduct(Request $request, Response $response, $args) {
        $reviews = Review::getByProduct((int)$args['product_id']);

        $response->getBody()->write(json_encode($reviews));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
