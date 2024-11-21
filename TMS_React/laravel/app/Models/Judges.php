<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Judges extends Model
{
    use HasFactory;

    protected $table = 'tbl_judges';

    protected $fillable = [
       'award_id',
        'name',
        'slug',
        'post',
        'description',
        'status',
        'is_chairman',
        'image',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($judges) {
            $judges->slug = $judges->generateSlug($judges->name);
        });

        static::updating(function ($judges) {
            if ($judges->isDirty('name')) {
                $judges->slug = $judges->generateSlug($judges->name);
            }
        });
    }


        /**
     * Retrieves the image path for the judges based on the provided ID, image name, and size.
     *
     * @param int $id The ID of the judge.
     * @param string $img_name The name of the image.
     * @param string|null $size The size of the image (optional).
     * @return string The generated image path.
     */
    public static function getJudgesImage($id = 0, $img_name = '', $size = null)
    {
        if ($id > 0 && $img_name != '') {
           
            $image = url('/admin/uploads/judges/' . $id . '/' . $img_name);
          
        } else {
            $image =  url('/admin/images/noimg.png');
        }

        return $image;
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

        // $count = static::where('slug', 'like', "{$slug}-%")->count();

        return $count ? "{$slug}-" . ($count + 1) : $slug;
        // return $count ? "{$slug}-{$count}" : $slug;
    }

    /**
     * Retrieve the award that the judge is associated with.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function award()
    {
        return $this->belongsTo(Award::class, 'award_id');
    }

}
