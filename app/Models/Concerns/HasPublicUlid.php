<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

trait HasPublicUlid
{
    protected static function bootHasPublicUlid(): void
    {
        static::creating(function ($model): void {
            if (empty($model->ulid)) {
                $model->ulid = (string) Str::ulid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    public function resolveRouteBindingQuery($query, $value, $field = null): Builder
    {
        $field ??= $this->getRouteKeyName();

        if ($field !== $this->getRouteKeyName()) {
            return $query->where($field, $value);
        }

        return $query->where(function (Builder $builder) use ($value): void {
            $builder->where($this->getRouteKeyName(), $value);

            if (is_numeric($value)) {
                $builder->orWhere($this->getKeyName(), $value);
            }
        });
    }
}
