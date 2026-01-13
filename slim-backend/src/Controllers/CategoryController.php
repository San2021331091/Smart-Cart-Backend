<?php
namespace App\Controllers;

use App\Models\Category;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CategoryController {

    // GET /categories
    public function index(Request $request, Response $response) {
        $categories = Category::getAll();

        $response->getBody()->write(json_encode($categories));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // GET /category/{id}
    public function show(Request $request, Response $response, $args) {
        $category = Category::getById((int)$args['id']);

        if (!$category) {
            $response->getBody()->write(json_encode(['error' => 'Category not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($category));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
