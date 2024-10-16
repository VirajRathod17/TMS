<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_news';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'location',
        'date',
        'image',
        'slug',
        'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            $news->slug = $news->generateSlug($news->title);
        });

        static::updating(function ($news) {
            if ($news->isDirty('title')) {
                $news->slug = $news->generateSlug($news->title);
            }
        });
    }

    public static function getActiveNews()
    {
        // Return only active news, sorted by date in descending order
        return News::where('status', '1')->get();
    }
    public static function getLatestNews()
    {
        // Return only active news, sorted by date in descending order
        return News::orderBy('date', 'desc')->where('status', '1')->first();
    }

    /**
     * Generate a unique slug.
     *
     * @param  string  $name
     * @return string
     */
    protected function generateSlug($title)
    {
        $slug = Str::slug($title);
        $count = static::where('slug', 'like', "{$slug}%")->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }

    /**
     * Retrieves the URL of the news image based on the given parameters.
     *
     * @param int $id The ID of the news item. Defaults to 0.
     * @param string $img_name The name of the image file. Defaults to an empty string.
     * @param mixed $size The size of the image. Defaults to null.
     * @return string The URL of the news image.
     */

    public static function getNewsImage($id = 0, $img_name = '', $size = null)
    {
        $image = '';
    
        if ($id > 0 && !empty($img_name)) {
            // Construct the image path based on size
            if ($size) {
                $image = asset('storage/news/' . $id . '/thumb_' . $size . '_' . $img_name);
            } else {
                $image = asset('storage/news/' . $id . '/' . $img_name);
            }
        } else {
            // Fallback to a default image if no valid image is provided
            $image = asset('storage/Admin/uploads/noimg.png');
        }
    
        return $image;
    }

}