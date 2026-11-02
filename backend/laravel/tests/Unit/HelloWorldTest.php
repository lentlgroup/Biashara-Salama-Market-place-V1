<?php

use PHPUnit\Framework\TestCase;

class HelloWorldTest extends TestCase
{
    public function test_hello_world()
    {
        $this->assertEquals('Hello, World!', 'Hello, World!');
    }
}
