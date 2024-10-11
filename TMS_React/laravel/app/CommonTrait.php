<?php

namespace App;

// Correctly importing the ImageManagerStatic class from Intervention Image
use Intervention\Image\ImageManagerStatic as Image;

trait CommonTrait
{
    public static function createThumbnails($uploadPath, $filename, $sizes)
    {
        // Verify if the file exists before proceeding
        $orgFile = $uploadPath . $filename;
        if (!file_exists($orgFile) || !exif_imagetype($orgFile)) {
            return;
        }

        // Proceed with creating thumbnails
        $sizes = explode(',', $sizes);
        [$originalWidth, $originalHeight] = getimagesize($orgFile);

        foreach ($sizes as $size) {
            $temp = explode('x', $size);
            $thumbFile = $uploadPath . "thumb_" . $size . "_" . $filename;

            // Ensure width and height are set as integers
            $w = isset($temp[0]) ? (int)$temp[0] : 100;
            $h = isset($temp[1]) ? (int)$temp[1] : 100;

            // Ensure the thumbnail size does not exceed the original dimensions
            $w = min($w, $originalWidth);
            $h = min($h, $originalHeight);

            // Create the thumbnail using Intervention Image
            Image::make($orgFile)
                ->fit($w, $h)
                ->encode('jpg', 80)
                ->save($thumbFile);
        }
    }
}
