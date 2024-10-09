<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\News; // Assuming your model is News
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    // Store a new News
    public function store(Request $request)
    {
        // // Validate incoming request
        $validator = Validator::make($request->all(), [

            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|unique:news,slug',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'data' => [],
            ]);
        }

        // echo "<pre>";
        // print_r($validator);
        // echo "</pre>";
        // Create a new news record
        $news = new News();
        $news->title = $request->title; // Change to the new field
        $news->date = $request->date;
        $news->location = $request->location;
        $news->slug = $request->slug;
        $news->description = $request->description;
        $news->status = $request->status;

        // Save to get ID for image folder
        $news->save();

        // Handle the image upload
        if ($request->hasFile('image')) {
            $folderPath = 'admin/uploads/news/' . $news->id;

            // Ensure directory exists
            if (!file_exists(public_path($folderPath))) {
                mkdir(public_path($folderPath), 0777, true);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

            // Move the image to the public folder
            $image->move(public_path($folderPath), $imageName);

            // Save the image path in the database
            $news->image = $folderPath . '/' . $imageName;
        }

        // Save the news with the image path
        $news->save();

        return response()->json([
            'status' => 'success',
            'message' => "News created successfully",
            'data' => $news,
        ]);
    }

    // Get a list of all News
    public function index()
    {
        $newsItems = News::all();
        foreach ($newsItems as $newsItem) {
            if ($newsItem->status == '1') {
                $newsItem->status = 'Active';
            } else {
                $newsItem->status = 'Inactive';
            }
        }

        if ($newsItems->isNotEmpty()) {
            $newsItems = $newsItems->map(function ($item) {
                $item->image = url('admin/uploads/news/' . $item->id . '/' . basename($item->image));
                return $item;
            });
        }

        return response()->json([
            'status' => $newsItems->isNotEmpty() ? 'success' : 'error',
            'message' => $newsItems->isNotEmpty() ? "News retrieved successfully" : "No data found",
            'data' => $newsItems,
        ]);
    }

    // Show a specific News
    public function show($id)
    {
        $newsItem = News::find($id);

        if ($newsItem) {
            $newsItem->image = url('admin/uploads/news/' . $newsItem->id . '/' . basename($newsItem->image));
            return response()->json([
                'status' => 'success',
                'message' => "News retrieved successfully",
                'data' => $newsItem,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => "News not found",
            'data' => [],
        ]);
    }

    // Update a specific News
    public function update(Request $request, $id)
    {
        $newsItem = News::find($id);

        if (!$newsItem) {
            return response()->json([
                'status' => 'error',
                'message' => "News not found",
                'data' => [],
            ]);
        }

        $validator = Validator::make($request->all(), [

            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'slug' => 'nullable|unique:news,slug',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
                'data' => [],
            ]);
        }
        

        $newsItem->title = $request->title; 
        $newsItem->date = $request->date;
        $newsItem->location = $request->location;
        $newsItem->description = $request->description;
        $newsItem->status = $request->status;


        // Handle image upload
        if ($request->hasFile('image')) {
            $folderPath = 'admin/uploads/news/' . $newsItem->id;

            if (!file_exists(public_path($folderPath))) {
                mkdir(public_path($folderPath), 0777, true);
            }

            // Delete the old image if it exists
            if ($newsItem->image && file_exists(public_path($newsItem->image))) {
                unlink(public_path($newsItem->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path($folderPath), $imageName);

            // Save the new image path in the database
            $newsItem->image = $folderPath . '/' . $imageName;
        }

        // Save the updated news item
        $newsItem->save();

        return response()->json([
            'status' => 'success',
            'message' => "News updated successfully",
            'data' => $newsItem,
        ]);
    }

    public function destroy($id)
    {
        $newsItem = News::find($id);
        if ($newsItem) {
            // Delete image
            if ($newsItem->image && file_exists(public_path($newsItem->image))) {
                unlink(public_path($newsItem->image));
            }

            // Delete the folder if exists
            $folderPath = 'admin/uploads/news/' . $newsItem->id;
            if (is_dir(public_path($folderPath))) {
                $this->deleteDirectory(public_path($folderPath)); // Use the helper function to delete the folder contents
            }

            // Delete the news item record
            $newsItem->delete();

            return response()->json([
                'status' => 'success',
                'message' => "News deleted successfully",
                'data' => [],
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => "News not found",
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
        $newsIds = $request->ids;

        if ($newsIds) {
            foreach ($newsIds as $id) {
                $newsItem = News::find($id);
                if ($newsItem) {
                    // Delete image
                    if ($newsItem->image && file_exists(public_path($newsItem->image))) {
                        unlink(public_path($newsItem->image));
                    }

                    // Delete the folder
                    $folderPath = 'admin/uploads/news/' . $newsItem->id;
                    if (is_dir(public_path($folderPath))) {
                        rmdir(public_path($folderPath));
                    }

                    // Delete the news item record
                    $newsItem->delete();
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => "News items deleted successfully",
                'data' => [],
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => "News items not found",
            'data' => [],
        ]);
    }
}
