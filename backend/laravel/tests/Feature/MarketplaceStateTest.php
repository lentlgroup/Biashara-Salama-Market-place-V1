<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_uninitialized_state_is_reported(): void
    {
        $this->getJson('/api/marketplace-state')
            ->assertOk()
            ->assertJson([
                'initialized' => false,
                'schemaVersion' => 1,
                'revision' => 0,
                'data' => null,
            ]);
    }

    public function test_marketplace_state_can_be_saved_and_retrieved(): void
    {
        $payload = $this->payload();

        $this->putJson('/api/marketplace-state', $payload)
            ->assertOk()
            ->assertJson([
                'initialized' => true,
                'schemaVersion' => 1,
                'revision' => 1,
                'migratedFromLocalStorage' => true,
            ]);

        $this->getJson('/api/marketplace-state')
            ->assertOk()
            ->assertJsonPath('revision', 1)
            ->assertJsonPath('data.merchants.0.id', 'mrc_test');

        $this->assertDatabaseHas('marketplace_states', [
            'key' => 'default',
            'revision' => 1,
            'migrated_from_local_storage' => true,
        ]);
    }

    public function test_stale_revisions_are_rejected(): void
    {
        $this->putJson('/api/marketplace-state', $this->payload())->assertOk();

        $this->putJson('/api/marketplace-state', $this->payload())
            ->assertConflict()
            ->assertJsonPath('currentRevision', 1);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(): array
    {
        return [
            'schemaVersion' => 1,
            'revision' => 0,
            'migratedFromLocalStorage' => true,
            'data' => [
                'users' => [],
                'merchants' => [['id' => 'mrc_test']],
                'vendors' => [],
                'products' => [],
                'assessments' => [],
                'recommendations' => [],
                'handoffs' => [],
                'quotations' => [],
                'implementations' => [],
                'supportTickets' => [],
                'subscriptions' => [],
                'commissionRules' => [],
                'commissionLedger' => [],
                'auditLogs' => [],
                'dataRightsRequests' => [],
                'consentRecords' => [],
            ],
        ];
    }
}
