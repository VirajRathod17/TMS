<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


class SupportingAssociation extends Model implements JWTSubject
{
    use HasFactory;

    protected $table = 'tbl_supporting_associations';
    protected $fillable = [
        'award_id',
        'name',
        'image',
        'website_link',
        'slug',
        'description',
        'status',
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

        static::creating(function ($suppo_assos) {

            // Log::error('safsdfgadsgdsg:',$suppo_assos);

            $suppo_assos->slug = $suppo_assos->generateSlug($suppo_assos->name);
        });

        static::updating(function ($suppo_assos) {
            if ($suppo_assos->isDirty('name')) {
                $suppo_assos->slug = $suppo_assos->generateSlug($suppo_assos->name);
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