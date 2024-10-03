<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AwardCategory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tbl_award_categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'award_id',
        'name',
        'description',
        'slug',
        'status',
        'credentials',
        // 'finalist',
        // 'winner',
        'main_sponsored_id',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $category->slug = $category->generateSlug($category->name);
        });

        static::updating(function ($category) {
            if ($category->isDirty('name')) {
                $category->slug = $category->generateSlug($category->name);
            }
        });
    }

    // public static function getWinnerImage($id = 0, $img_name = '', $size = null)
    // {
    //     if ($id > 0 && $img_name != '') {
    //         if ($size) {
    //             $image = asset('Admin/uploads/award-categories/winner-image/' . $id . '/thumb_' . $size . '_' . $img_name);
    //         } else {
    //             $image = asset('Admin/uploads/award-categories/winner-image/' . $id . '/' . $img_name);
    //         }
    //     } else {
    //         $image = asset('Admin/uploads/noimg.png');
    //     }
    
    //     return $image;
    // }

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
    // public static function getCategoryByYear($year)
    // {
    //     $awardId = Award::getAwardIdByYear($year);
    //     return self::where('award_id', $awardId)->where('status', '1')->orderBy('cat_order', 'asc')->get();
    // }

    // public function award()
    // {
    //     return $this->belongsTo(Award::class, 'award_id');
    // }

    // public function sponsor()
    // {
    //     return $this->belongsTo(Sponsor::class, 'main_sponsored_id');
    // }

}
