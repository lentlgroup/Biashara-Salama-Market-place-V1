<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveMarketplaceStateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'schemaVersion' => ['required', 'integer', 'min:1'],
            'revision' => ['required', 'integer', 'min:0'],
            'migratedFromLocalStorage' => ['sometimes', 'boolean'],
            'data' => ['required', 'array'],
            'data.users' => ['present', 'array'],
            'data.merchants' => ['present', 'array'],
            'data.vendors' => ['present', 'array'],
            'data.products' => ['present', 'array'],
            'data.assessments' => ['present', 'array'],
            'data.recommendations' => ['present', 'array'],
            'data.handoffs' => ['present', 'array'],
            'data.quotations' => ['present', 'array'],
            'data.implementations' => ['present', 'array'],
            'data.supportTickets' => ['present', 'array'],
            'data.subscriptions' => ['present', 'array'],
            'data.commissionRules' => ['present', 'array'],
            'data.commissionLedger' => ['present', 'array'],
            'data.auditLogs' => ['present', 'array'],
            'data.dataRightsRequests' => ['present', 'array'],
            'data.consentRecords' => ['present', 'array'],
        ];
    }
}
