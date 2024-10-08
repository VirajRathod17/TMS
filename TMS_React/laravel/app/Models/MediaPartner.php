<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MediaPartner extends Model
{
    use HasFactory;

    protected $table = 'tbl_media_partners';

    protected $fillable = [
        'name', 'image', 'award_id', 'website_link', 'slug', 'description', 'status',
    ];

    /**
     * Boot the model and set up model event listeners.
     */
    protected static function boot()
    {
        parent::boot();

        // Listen for the creating event
        static::creating(function ($mediaPartner) {
            // Generate and assign the slug before creating the instance
            if (empty($mediaPartner->slug)) {
                $mediaPartner->slug = $mediaPartner->generateSlug($mediaPartner->name);
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

    public static function getMediaPartnerImage($id = 0, $img_name = '', $size = null)
    {
        $image = '';
    
        if ($id > 0 && !empty($img_name)) {
            // Construct the image path based on size
            if ($size) {
                $image = asset('storage/media_partners/' . $id . '/thumb_' . $size . '_' . $img_name);
            } else {
                $image = asset('storage/media_partners/' . $id . '/' . $img_name);
            }
        } else {
            // Fallback to a default image if no valid image is provided
            $image = asset('storage/Admin/uploads/noimg.png');
        }
    
        return $image;
    }
}
