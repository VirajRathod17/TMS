<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\MediaPartner; // Updated to MediaPartner model
use DataTables;
use Illuminate\Support\Facades\Log;

class MediaPartnerController extends Controller // Updated to MediaPartnerController
{
    protected $moduleSlug;
    protected $module;
    protected $modelObj;
    protected $viewBase;

    public function __construct()
    {
        $this->moduleSlug = "media-partner"; // Updated slug to "media-partner"
        
        // Model and Module name
        $this->module = "media-partner";
        $this->modelObj = new MediaPartner; // Updated to use MediaPartner model
        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    public function index()
    {
        $mediaPartners = MediaPartner::all();
        foreach($mediaPartners as $mediaPartner)
        {
            if($mediaPartner->status == '1')
            {
                $mediaPartner->status = 'Active';
            }
            else
            {
                $mediaPartner->status = 'Inactive';
            }
        }

        if ($mediaPartners->isNotEmpty()) {
            $mediaPartners = $mediaPartners->map(function ($item) {
                $item->image = url('admin/uploads/media-partner/' . $item->id . '/' . basename($item->image));
                return $item;
            });
        }

        return response()->json([
            'status' => $mediaPartners->isNotEmpty() ? 'success' : 'error',
            'message' => $mediaPartners->isNotEmpty() ? "Media Partners retrieved successfully" : "No data found",
            'data' => $mediaPartners,
        ]);
    }

    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',  // Updated fields
            // 'award_id' => 'required|integer',
            'website_link' => 'required|url',
            'slug' => 'nullable|unique:media-partner,slug',
            'description' => 'required|string',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            $mediaPartner = $this->modelObj::create([
                'name' => $request->name,
                'award_id' => $request->award_id,
                'website_link' => $request->website_link,
                'slug' => $request->slug,
                'description' => $request->description,
                'status' => $request->status,
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin/uploads/media-partner/' . $mediaPartner->id);

                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $mediaPartner->image = $filename;
                $mediaPartner->save();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Media Partner created successfully',
                'data' => $mediaPartner,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error occurred while creating Media Partner: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the Media Partner',
            ], 500);
        }
    }

    public function show($id)
    {
        $mediaPartner = $this->modelObj::find($id);

        if (isset($mediaPartner)) {
            $mediaPartner->image_path = url('admin/uploads/media-partner/' . $mediaPartner->id . '/' . $mediaPartner->image);

            return response()->json([
                'status' => 'success',
                'message' => "Media Partner",
                'data' => $mediaPartner,
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
            'name' => 'required|string|max:255',  // Updated fields
            'award_id' => 'required|integer',
            'website_link' => 'required|url',
            'slug' => 'nullable|unique:media-partner,slug,' . $id,
            'description' => 'required|string',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            $mediaPartner = $this->modelObj::findOrFail($id);

            $data = [
                'name' => $request->name,
                'award_id' => $request->award_id,
                'website_link' => $request->website_link,
                'slug' => $request->slug,
                'description' => $request->description,
                'status' => $request->status,
            ];

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin/uploads/media-partner/' . $mediaPartner->id);

                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $mediaPartner->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Media Partner updated successfully',
                'data' => $mediaPartner,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the Media Partner',
            ], 500);
        }
    }


    public function destroy($id)
    {
        $mediaPartner = MediaPartner::find($id);
        if ($mediaPartner) {
            // Delete image
            if ($mediaPartner->image && file_exists(public_path($mediaPartner->image))) {
                unlink(public_path($mediaPartner->image));
            }
    
            // Delete the folder if exists
            $folderPath = 'admin/uploads/media-partners/' . $mediaPartner->id;
            if (is_dir(public_path($folderPath))) {
                $this->deleteDirectory(public_path($folderPath)); // Use the helper function to delete the folder contents
            }
    
            // Delete the media partner record
            $mediaPartner->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => "Media Partner deleted successfully",
                'data' => [],
            ]);
        }
    
        return response()->json([
            'status' => 'error',
            'message' => "Media Partner not found",
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
        $mediaPartnerIds = $request->ids;
    
        if ($mediaPartnerIds) {
            foreach ($mediaPartnerIds as $id) {
                $mediaPartner = MediaPartner::find($id);
                if ($mediaPartner) {
                    // Delete image
                    if ($mediaPartner->image && file_exists(public_path($mediaPartner->image))) {
                        unlink(public_path($mediaPartner->image));
                    }
    
                    // Delete the folder
                    $folderPath = 'admin/uploads/media-partners/' . $mediaPartner->id;
                    if (is_dir(public_path($folderPath))) {
                        rmdir(public_path($folderPath));
                    }
    
                    // Delete the media partner record
                    $mediaPartner->delete();
                }
            }
    
            return response()->json([
                'status' => 'success',
                'message' => "Media Partners deleted successfully",
                'data' => [],
            ]);
        }
    
        return response()->json([
            'status' => 'error',
            'message' => "Media Partners not found",
            'data' => [],
        ]);
    }
}
