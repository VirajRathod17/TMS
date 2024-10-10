<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Videos extends Authenticatable
{
    use HasFactory;

    protected $table = 'tbl_videos';

    protected $fillable = [
        'award_id', 'sponser_id', 'image', 'title', 'link', 'created_at'
    ];

    /**
     * Get the award that the Videos is associated with.
     */
    // public function award()
    // {
    //     return $this->belongsTo(Award::class, 'award_id', 'id');
    // }
    // /**
    //  * Get the sponser that the videos is associated with.
    //  */
    // public function sponsor()
    // {
    //     return $this->belongsTo(Sponsor::class, 'sponsored_id', 'id');
    // }


    /**
     * Retrieves the video image based on the provided id and image name.
     *
     * @param int $id The id of the video.
     * @param string $img_name The name of the image.
     * @return string The URL of the video image or the default no image URL.
     */
    // public static function getVideImage($id = 0, $img_name = '')
    // {
    //     $image = '';

    //     if ($id > 0 && $img_name !== '') {

    //         $image = asset('Admin/uploads/videos/' . $id . '/' . $img_name);
    //     } else {

    //         $image = asset('Admin/images/noimg.png');
    //     }

    //     return $image;
    // }

    public static function getVideImage($id = 0, $img_name = '', $size = null)
    {
        $image = '';
    
        if ($id > 0 && !empty($img_name)) {
            // Construct the image path based on size
            if ($size) {
                $image = asset('storage/videos/' . $id . '/thumb_' . $size . '_' . $img_name);
            } else {
                $image = asset('storage/videos/' . $id . '/' . $img_name);
            }
        } else {
            // Fallback to a default image if no valid image is provided
            $image = asset('storage/Admin/uploads/noimg.png');
        }
    
        return $image;
    }

    // public static function getAwardIdByYear($year){
    //   return Award::where('year',$year)->first();
    // }


}