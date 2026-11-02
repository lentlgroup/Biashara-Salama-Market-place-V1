<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketplaceState extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    protected $fillable = [
        'key',
        'schema_version',
        'revision',
        'data',
        'migrated_from_local_storage',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'schema_version' => 'integer',
            'revision' => 'integer',
            'data' => 'array',
            'migrated_from_local_storage' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }
}
