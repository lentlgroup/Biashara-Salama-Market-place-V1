<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use JsonException;

class MarketplaceStateStore
{
    /**
     * Frontend collection names mapped to their real MySQL tables and indexed columns.
     * Nested and non-indexed fields are retained losslessly in the payload column.
     *
     * @var array<string, array{table: string, columns: array<string, string>}>
     */
    public const COLLECTIONS = [
        'users' => [
            'table' => 'marketplace_users',
            'columns' => [
                'name' => 'name', 'email' => 'email', 'phone' => 'phone', 'role' => 'role',
                'status' => 'status', 'merchant_id' => 'merchantId', 'vendor_id' => 'vendorId',
                'mfa_enabled' => 'mfaEnabled',
            ],
        ],
        'merchants' => [
            'table' => 'merchants',
            'columns' => [
                'business_name' => 'businessName', 'sector' => 'sector', 'stage' => 'stage',
                'region' => 'region', 'city' => 'city', 'assigned_adviser_id' => 'assignedAdviserId',
                'current_vendor_id' => 'currentVendorId', 'current_product_id' => 'currentProductId',
            ],
        ],
        'vendors' => [
            'table' => 'vendors',
            'columns' => [
                'legal_name' => 'legalName', 'brand_name' => 'brandName',
                'registration_number' => 'registrationNumber', 'status' => 'status',
            ],
        ],
        'products' => [
            'table' => 'products',
            'columns' => [
                'vendor_id' => 'vendorId', 'name' => 'name', 'category' => 'category',
                'approval_status' => 'approvalStatus',
            ],
        ],
        'assessments' => [
            'table' => 'assessments',
            'columns' => [
                'merchant_id' => 'merchantId', 'version' => 'version',
                'is_complete' => 'isComplete', 'adviser_id' => 'adviserId',
            ],
        ],
        'recommendations' => [
            'table' => 'recommendations',
            'columns' => [
                'merchant_id' => 'merchantId', 'assessment_id' => 'assessmentId',
                'version' => 'version', 'status' => 'status', 'named_adviser_id' => 'namedAdviserId',
            ],
        ],
        'handoffs' => [
            'table' => 'vendor_handoffs',
            'columns' => [
                'merchant_id' => 'merchantId', 'vendor_id' => 'vendorId',
                'product_id' => 'productId', 'status' => 'status',
            ],
        ],
        'quotations' => [
            'table' => 'quotations',
            'columns' => [
                'merchant_id' => 'merchantId', 'recommendation_id' => 'recommendationId',
                'version' => 'version', 'status' => 'status',
            ],
        ],
        'implementations' => [
            'table' => 'implementation_plans',
            'columns' => [
                'merchant_id' => 'merchantId', 'quotation_id' => 'quotationId',
                'vendor_id' => 'vendorId', 'product_id' => 'productId',
                'go_live_checklist_passed' => 'goLiveChecklistPassed',
            ],
        ],
        'supportTickets' => [
            'table' => 'support_tickets',
            'columns' => [
                'merchant_id' => 'merchantId', 'vendor_id' => 'vendorId',
                'product_id' => 'productId', 'status' => 'status', 'severity' => 'severity',
            ],
        ],
        'subscriptions' => [
            'table' => 'subscriptions',
            'columns' => [
                'merchant_id' => 'merchantId', 'vendor_id' => 'vendorId',
                'product_id' => 'productId', 'status' => 'status',
            ],
        ],
        'commissionRules' => [
            'table' => 'commission_rules',
            'columns' => ['vendor_id' => 'vendorId', 'basis' => 'basis'],
        ],
        'commissionLedger' => [
            'table' => 'commission_ledger_entries',
            'columns' => [
                'vendor_id' => 'vendorId', 'merchant_id' => 'merchantId',
                'period' => 'period', 'status' => 'status',
            ],
        ],
        'auditLogs' => [
            'table' => 'audit_events',
            'columns' => [
                'actor_id' => 'actorId', 'action' => 'action', 'entity_type' => 'entityType',
                'entity_id' => 'entityId',
            ],
        ],
        'dataRightsRequests' => [
            'table' => 'data_rights_requests',
            'columns' => [
                'merchant_id' => 'merchantId', 'request_type' => 'requestType', 'status' => 'status',
            ],
        ],
        'consentRecords' => [
            'table' => 'consent_records',
            'columns' => [
                'merchant_id' => 'merchantId', 'consent_version' => 'version', 'channel' => 'channel',
            ],
        ],
    ];

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function read(): array
    {
        $data = [];

        foreach (self::COLLECTIONS as $collection => $configuration) {
            $data[$collection] = DB::table($configuration['table'])
                ->orderBy('position')
                ->get(['payload'])
                ->map(fn (object $row): array => $this->decodePayload($row->payload))
                ->all();
        }

        return $data;
    }

    /**
     * Replace the database representation with one complete, ordered application state.
     * This method is intended to run inside the caller's database transaction.
     *
     * @param  array<string, array<int, array<string, mixed>>>  $data
     */
    public function replace(array $data): void
    {
        $now = now();

        foreach (self::COLLECTIONS as $collection => $configuration) {
            $items = array_values($data[$collection] ?? []);
            $ids = [];
            $rows = [];

            foreach ($items as $position => $item) {
                $id = (string) $item['id'];
                $ids[] = $id;

                $row = [
                    'id' => $id,
                    'position' => $position,
                    'payload' => json_encode($item, JSON_THROW_ON_ERROR),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                foreach ($configuration['columns'] as $column => $source) {
                    $value = data_get($item, $source);
                    $row[$column] = is_bool($value) ? (int) $value : $value;
                }

                $rows[] = $row;
            }

            if ($rows !== []) {
                DB::table($configuration['table'])->upsert(
                    $rows,
                    ['id'],
                    array_merge(['position', 'payload', 'updated_at'], array_keys($configuration['columns'])),
                );
            }

            $deleteQuery = DB::table($configuration['table']);
            if ($ids !== []) {
                $deleteQuery->whereNotIn('id', $ids);
            }
            $deleteQuery->delete();
        }
    }

    /**
     * @return array<string, int>
     */
    public function counts(): array
    {
        $counts = [];

        foreach (self::COLLECTIONS as $collection => $configuration) {
            $counts[$collection] = DB::table($configuration['table'])->count();
        }

        return $counts;
    }

    /**
     * @return array<string, mixed>
     *
     * @throws JsonException
     */
    private function decodePayload(mixed $payload): array
    {
        if (is_array($payload)) {
            return $payload;
        }

        return json_decode((string) $payload, true, 512, JSON_THROW_ON_ERROR);
    }
}
