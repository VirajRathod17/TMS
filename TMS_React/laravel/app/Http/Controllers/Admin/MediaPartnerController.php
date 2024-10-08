<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\MediaPartner;
use Illuminate\Support\Facades\Storage;

class MediaPartnerController extends Controller
{
    // Store a new Media Partner
    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'award_id' => 'required',
            'website_link' => 'required|url',
            'slug' => 'nullable|unique:media_partners,slug',
            'description' => 'required',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'data' => [],
            ]);
        }

        // Create a new media partner record
        $mediaPartner = new MediaPartner();
        $mediaPartner->name = $request->name;
        $mediaPartner->award_id = $request->award_id;
        $mediaPartner->website_link = $request->website_link;
        $mediaPartner->slug = $request->slug;
        $mediaPartner->description = $request->description;
        $mediaPartner->status = $request->status;

        // Save to get ID for image folder
        $mediaPartner->save();

        // Handle the image upload
        if ($request->hasFile('image')) {
            $folderPath = 'admin/uploads/media-partners/' . $mediaPartner->id;

            // Ensure directory exists
            if (!file_exists(public_path($folderPath))) {
                mkdir(public_path($folderPath), 0777, true);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Move the image to the public folder
            $image->move(public_path($folderPath), $imageName);

            // Save the image path in the database
            $mediaPartner->image = $folderPath . '/' . $imageName;
        }

        // Save the media partner with the image path
        $mediaPartner->save();

        return response()->json([
            'status' => 'success',
            'message' => "Media Partner created successfully",
            'data' => $mediaPartner,
        ]);
    }

    // Get a list of all Media Partners
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
                $item->image = url('admin/uploads/media-partners/' . $item->id . '/' . basename($item->image));
                return $item;
            });
        }

        return response()->json([
            'status' => $mediaPartners->isNotEmpty() ? 'success' : 'error',
            'message' => $mediaPartners->isNotEmpty() ? "Media Partners retrieved successfully" : "No data found",
            'data' => $mediaPartners,
        ]);
    }

    // Show a specific Media Partner
    public function show($id)
    {
        $mediaPartner = MediaPartner::find($id);

        if ($mediaPartner) {
            $mediaPartner->image = url('admin/uploads/media-partners/' . $mediaPartner->id . '/' . basename($mediaPartner->image));
            return response()->json([
                'status' => 'success',
                'message' => "Media Partner retrieved successfully",
                'data' => $mediaPartner,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => "Media Partner not found",
            'data' => [],
        ]);
    }

    // Update a specific Media Partner
    public function update(Request $request, $id)
    {
        $mediaPartner = MediaPartner::find($id);

        if (!$mediaPartner) {
            return response()->json([
                'status' => 'error',
                'message' => "Media Partner not found",
                'data' => [],
            ]);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'award_id' => 'required',
            'website_link' => 'required|url',
            'description' => 'required',
            'status' => 'required|in:0,1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'data' => [],
            ]);
        }

        // Update fields
        $mediaPartner->name = $request->name;
        $mediaPartner->award_id = $request->award_id;
        $mediaPartner->website_link = $request->website_link;
        $mediaPartner->description = $request->description;
        $mediaPartner->status = $request->status;

        // Handle image upload
        if ($request->hasFile('image')) {
            $folderPath = 'admin/uploads/media-partners/' . $mediaPartner->id;

            if (!file_exists(public_path($folderPath))) {
                mkdir(public_path($folderPath), 0777, true);
            }

            // Delete the old image if it exists
            if ($mediaPartner->image && file_exists(public_path($mediaPartner->image))) {
                unlink(public_path($mediaPartner->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path($folderPath), $imageName);

            // Save the new image path in the database
            $mediaPartner->image = $folderPath . '/' . $imageName;
        }

        // Save the updated media partner
        $mediaPartner->save();

        return response()->json([
            'status' => 'success',
            'message' => "Media Partner updated successfully",
            'data' => $mediaPartner,
        ]);
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
