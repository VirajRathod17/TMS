<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Videos; // Updated to Video model
use DataTables;
use Illuminate\Support\Facades\Log;

class VideosController extends Controller // Updated to VideoController
{
    protected $moduleSlug;
    protected $module;
    protected $modelObj;
    protected $viewBase;

    public function __construct()
    {
        $this->moduleSlug = "videos"; // Updated slug to "videos"
        
        // Model and Module name
        $this->module = "videos";
        $this->modelObj = new Videos; // Updated to use Video model
        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    public function index()
    {
        $videos = Videos::all();
        foreach($videos as $video)
        {
            // If you have specific logic for status, implement it here.
            // Assuming videos do not have status field, you can remove this.
        }

        if ($videos->isNotEmpty()) {
            $videos = $videos->map(function ($item) {
                $item->image = url('admin/uploads/videos/' . $item->id . '/' . basename($item->image));
                return $item;
            });
        }

        return response()->json([
            'status' => $videos->isNotEmpty() ? 'success' : 'error',
            'message' => $videos->isNotEmpty() ? "Videos retrieved successfully" : "No data found",
            'data' => $videos,
        ]);
    }

    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
              // 'award_id' => 'required|integer',
            // 'sponsored_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'link' => 'required|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }
    
        try {
            // Create video record
            $videoData = [
                'title' => $request->title,
                'link' => $request->link,
                 'award_id' => $request->award_id, // Uncomment if needed
                'sponsored_id' => $request->sponsor_id, // Uncomment if needed
            ];
    
            $video = $this->modelObj::create($videoData); // Create without sponsor_id if not needed
    
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $uploadPath = public_path('admin/uploads/videos/' . $video->id);
    
                // Create upload directory if it does not exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true); // Create directory with permissions
                }
    
                // Move image to the directory
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $video->image = $filename; // Set image filename in video object
                $video->save(); // Save updated video object
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'Video created successfully',
                'data' => $video,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error occurred while creating Video: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
    
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the Video: ' . $e->getMessage(),
            ], 500); // Provide more details about the error
        }
    }
    
    public function show($id)
    {
        $video = $this->modelObj::find($id);

        if (isset($video)) {
            $video->image_path = url('admin/uploads/videos/' . $video->id . '/' . $video->image);

            return response()->json([
                'status' => 'success',
                'message' => "Video details retrieved successfully",
                'data' => $video,
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => "No data found",
                'data' => [],
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
             // 'award_id' => 'required|integer',
            // 'sponsored_id' => 'required|integer',
            'title' => 'required|string|max:255', // Updated fields
            'link' => 'required|url', // Link field
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            $video = $this->modelObj::findOrFail($id);

            $data = [
                'award_id' => $request->award_id,
                'sponsored_id' => $request->sponsored_id,
                'title' => $request->title,
                'sponsor_id' => $request->sponsor_id,
                'link' => $request->link,
            ];

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin/uploads/videos/' . $video->id);

                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $video->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Video updated successfully',
                'data' => $video,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the Video',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $video = Videos::find($id);
        if ($video) {
            // Delete image
            if ($video->image && file_exists(public_path($video->image))) {
                unlink(public_path($video->image));
            }
    
            // Delete the folder if exists
            $folderPath = 'admin/uploads/videos/' . $video->id;
            if (is_dir(public_path($folderPath))) {
                $this->deleteDirectory(public_path($folderPath)); // Use the helper function to delete the folder contents
            }
    
            // Delete the video record
            $video->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => "Video deleted successfully",
                'data' => [],
            ]);
        }
    
        return response()->json([
            'status' => 'error',
            'message' => "Video not found",
            'data' => [],
        ]);
    }
    
    // Helper function to delete a directory and its contents
    private function deleteDirectory($dir)
    {
        if (!is_dir($dir)) {
            return false; // Return false if the directory doesn't exist
        }
    
        // Get all files and directories in the specified directory
        $files = array_diff(scandir($dir), ['.', '..']); // Exclude '.' and '..'
    
        foreach ($files as $file) {
            $path = "$dir/$file"; // Construct the path
            if (is_dir($path)) {
                // If it's a directory, recursively call deleteDirectory
                $this->deleteDirectory($path);
            } else {
                // If it's a file, delete it
                unlink($path);
            }
        }
    
        // Finally, remove the directory itself
        return rmdir($dir);
    }
    
    public function deleteMultiple(Request $request)
    {
        $videoIds = $request->ids;
    
        if ($videoIds) {
            foreach ($videoIds as $id) {
                $video = Videos::find($id);
                if ($video) {
                    // Delete image
                    if ($video->image && file_exists(public_path($video->image))) {
                        unlink(public_path($video->image));
                    }
    
                    // Delete the folder
                    $folderPath = 'admin/uploads/videos/' . $video->id;
                    if (is_dir(public_path($folderPath))) {
                        $this->deleteDirectory(public_path($folderPath));
                    }
    
                    // Delete the video record
                    $video->delete();
                }
            }
    
            return response()->json([
                'status' => 'success',
                'message' => "Videos deleted successfully",
                'data' => [],
            ]);
        }
    
        return response()->json([
            'status' => 'error',
            'message' => "Videos not found",
            'data' => [],
        ]);
    }
}
