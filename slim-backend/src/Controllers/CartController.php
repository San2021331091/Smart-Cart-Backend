<?php
namespace App\Controllers;

use App\Models\CartItem;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CartController {

    // GET /cart_items
    public function index(Request $request, Response $response) {
        $params = $request->getQueryParams();
        $items = isset($params['user_uid']) ? CartItem::getAll($params['user_uid']) : CartItem::getAll();

        $response->getBody()->write(json_encode($items));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // GET /cart_items/{id}
    public function show(Request $request, Response $response, $args) {
        $item = CartItem::getById((int)$args['id']);

        if (!$item) {
            $response->getBody()->write(json_encode(['error' => 'Cart item not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($item));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // PUT /cart_items/{id}/update
    public function update(Request $request, Response $response, $args) {
        $data = json_decode($request->getBody()->getContents(), true);
        $updatedItem = CartItem::update((int)$args['id'], $data);

        if (!$updatedItem) {
            $response->getBody()->write(json_encode(['error' => 'Cart item not found or nothing to update']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'message' => 'Cart item updated',
            'item' => $updatedItem
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // DELETE /cart_items/{id}/delete
    public function delete(Request $request, Response $response, $args) {
        $deletedItem = CartItem::delete((int)$args['id']);

        if (!$deletedItem) {
            $response->getBody()->write(json_encode(['error' => 'Cart item not found or already deleted']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode([
            'message' => 'Cart item deleted',
            'item' => $deletedItem
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
