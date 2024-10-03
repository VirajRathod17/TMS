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

    public static function getImage(int $id = 0, string $imgName = "")
    {
        // Initialize image path
        $image = '';
    
        // Construct the full path using public_path
        $filePath = public_path('admin/profile/' . $id . '/' . $imgName);
        
        // Check if ID is greater than 0 and the image name is not empty
        if ($id > 0 && !empty($imgName) && file_exists($filePath)) {
            // Return the full-size image URL
            $image = url('admin/profile/' . $id . '/' . $imgName);
        } else {
            // Return a default image if the conditions aren't met
            $image = asset('themes/admin/images/profile-default.png');
        }
    
        return $image;
    }
    
    
    public function getAuthIdentifierName()
    {
        return 'id'; // Assuming 'id' is the primary key
    }

}
