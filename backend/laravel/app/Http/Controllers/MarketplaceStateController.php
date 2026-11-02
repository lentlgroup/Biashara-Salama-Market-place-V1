<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveMarketplaceStateRequest;
use App\Models\MarketplaceState;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MarketplaceStateController extends Controller
{
    private const STATE_KEY = 'default';

    public function show(): JsonResponse
    {
        $state = MarketplaceState::query()->find(self::STATE_KEY);

        if (! $state) {
            return response()->json([
                'initialized' => false,
                'schemaVersion' => 1,
                'revision' => 0,
                'data' => null,
                'lastSyncedAt' => null,
            ]);
        }

        return response()->json($this->payload($state));
    }

    public function update(SaveMarketplaceStateRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $result = DB::transaction(function () use ($validated) {
            $state = MarketplaceState::query()
                ->lockForUpdate()
                ->find(self::STATE_KEY);

            $currentRevision = $state?->revision ?? 0;

            if ($validated['revision'] !== $currentRevision) {
                return response()->json([
                    'message' => 'The marketplace state was updated by another client.',
                    'currentRevision' => $currentRevision,
                ], 409);
            }

            $state ??= new MarketplaceState(['key' => self::STATE_KEY]);
            $state->fill([
                'schema_version' => $validated['schemaVersion'],
                'revision' => $currentRevision + 1,
                'data' => $validated['data'],
                'migrated_from_local_storage' => $state->migrated_from_local_storage
                    || ($validated['migratedFromLocalStorage'] ?? false),
                'last_synced_at' => now(),
            ]);
            $state->save();

            return response()->json($this->payload($state));
        });

        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(MarketplaceState $state): array
    {
        return [
            'initialized' => true,
            'schemaVersion' => $state->schema_version,
            'revision' => $state->revision,
            'data' => $state->data,
            'migratedFromLocalStorage' => $state->migrated_from_local_storage,
            'lastSyncedAt' => $state->last_synced_at?->toISOString(),
        ];
    }
}
