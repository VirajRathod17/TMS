<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Str;

class Award extends Model implements JWTSubject
{
    use HasFactory;

    protected $table = 'tbl_awards';
    protected $fillable = [
        'name',
        'year',
        'location',
        'award_date',
        'start_date',
        'end_date',
        'slug',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($award) {
            $award->slug = $award->generateSlug($award->name);
        });

        static::updating(function ($award) {
            if ($award->isDirty('name')) {
                $award->slug = $award->generateSlug($award->name);
            }
        });
    }

    /**
     * Generate a unique slug.
     *
     * @param  string  $name
     * @return string
     */
    protected function generateSlug($name)
    {
        $slug = Str::slug($name);
        $count = static::where('slug', 'like', "{$slug}%")->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }
    public function getAuthIdentifierName()
    {
        return 'id'; // Assuming 'id' is the primary key
    }
}