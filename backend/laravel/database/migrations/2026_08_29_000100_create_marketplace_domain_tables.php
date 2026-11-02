<?php

use App\Services\MarketplaceStateStore;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_users', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('role')->nullable()->index();
            $table->string('status')->nullable()->index();
            $table->string('merchant_id')->nullable()->index();
            $table->string('vendor_id')->nullable()->index();
            $table->boolean('mfa_enabled')->nullable();
        });

        Schema::create('merchants', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('business_name')->nullable()->index();
            $table->string('sector')->nullable()->index();
            $table->string('stage')->nullable()->index();
            $table->string('region')->nullable()->index();
            $table->string('city')->nullable();
            $table->string('assigned_adviser_id')->nullable()->index();
            $table->string('current_vendor_id')->nullable()->index();
            $table->string('current_product_id')->nullable()->index();
        });

        Schema::create('vendors', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('legal_name')->nullable()->index();
            $table->string('brand_name')->nullable();
            $table->string('registration_number')->nullable()->index();
            $table->string('status')->nullable()->index();
        });

        Schema::create('products', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('vendor_id')->nullable()->index();
            $table->string('name')->nullable()->index();
            $table->string('category')->nullable()->index();
            $table->string('approval_status')->nullable()->index();
        });

        Schema::create('assessments', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->unsignedInteger('version')->nullable();
            $table->boolean('is_complete')->nullable()->index();
            $table->string('adviser_id')->nullable()->index();
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('assessment_id')->nullable()->index();
            $table->unsignedInteger('version')->nullable();
            $table->string('status')->nullable()->index();
            $table->string('named_adviser_id')->nullable()->index();
        });

        Schema::create('vendor_handoffs', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('vendor_id')->nullable()->index();
            $table->string('product_id')->nullable()->index();
            $table->string('status')->nullable()->index();
        });

        Schema::create('quotations', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('recommendation_id')->nullable()->index();
            $table->unsignedInteger('version')->nullable();
            $table->string('status')->nullable()->index();
        });

        Schema::create('implementation_plans', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('quotation_id')->nullable()->index();
            $table->string('vendor_id')->nullable()->index();
            $table->string('product_id')->nullable()->index();
            $table->boolean('go_live_checklist_passed')->nullable()->index();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('vendor_id')->nullable()->index();
            $table->string('product_id')->nullable()->index();
            $table->string('status')->nullable()->index();
            $table->string('severity')->nullable()->index();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('vendor_id')->nullable()->index();
            $table->string('product_id')->nullable()->index();
            $table->string('status')->nullable()->index();
        });

        Schema::create('commission_rules', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('vendor_id')->nullable()->index();
            $table->string('basis')->nullable()->index();
        });

        Schema::create('commission_ledger_entries', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('vendor_id')->nullable()->index();
            $table->string('merchant_id')->nullable()->index();
            $table->string('period')->nullable()->index();
            $table->string('status')->nullable()->index();
        });

        Schema::create('audit_events', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('actor_id')->nullable()->index();
            $table->string('action')->nullable()->index();
            $table->string('entity_type')->nullable()->index();
            $table->string('entity_id')->nullable()->index();
        });

        Schema::create('data_rights_requests', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('request_type')->nullable()->index();
            $table->string('status')->nullable()->index();
        });

        Schema::create('consent_records', function (Blueprint $table) {
            $this->baseColumns($table);
            $table->string('merchant_id')->nullable()->index();
            $table->string('consent_version')->nullable();
            $table->string('channel')->nullable()->index();
        });

        $this->migrateExistingSnapshots();
    }

    public function down(): void
    {
        foreach (array_reverse(MarketplaceStateStore::COLLECTIONS) as $configuration) {
            Schema::dropIfExists($configuration['table']);
        }
    }

    private function baseColumns(Blueprint $table): void
    {
        $table->string('id')->primary();
        $table->unsignedInteger('position')->default(0)->index();
        $table->json('payload');
        $table->timestamps();
    }

    private function migrateExistingSnapshots(): void
    {
        DB::table('marketplace_states')->orderBy('key')->each(function (object $state) {
            $data = is_array($state->data)
                ? $state->data
                : json_decode((string) $state->data, true);

            if (is_array($data)) {
                app(MarketplaceStateStore::class)->replace($data);
            }
        });

        DB::table('marketplace_states')->update(['schema_version' => 2]);
    }
};
