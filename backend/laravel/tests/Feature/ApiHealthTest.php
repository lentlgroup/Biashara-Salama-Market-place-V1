<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiHealthTest extends TestCase
{
    public function test_the_api_health_endpoint_is_available(): void
    {
        $response = $this->getJson('/api/ping');

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'ok',
                'message' => 'pong',
            ])
            ->assertJsonStructure(['service']);
    }
}
