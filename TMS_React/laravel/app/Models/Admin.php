<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // Change this from Model to Authenticatable
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject // Extending Authenticatable instead of Model
{
    use HasFactory;
    protected $table = 'tbl_admin';

    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'award_id',
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

    public function getAuthIdentifierName()
    {
        return 'id'; // Assuming 'id' is the primary key
    }

}
