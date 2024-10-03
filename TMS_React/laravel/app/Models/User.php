<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function getImage(int $id = 0, string $imgName = "")
    {
        $image = '';

        // Check if the ID and image name are provided, and the file exists
        if ($id > 0 && $imgName !== '' && file_exists(public_path('admin/profile/' . $id . '/' . $imgName))) {
            // Return the full-size image path
            $image = asset('admin/profile/' . $id . '/' . $imgName);
        } else {
            // Return a default image if the conditions aren't met
            $image = asset('themes/admin/images/profile-default.png');
        }
        return $image;
    }

}
