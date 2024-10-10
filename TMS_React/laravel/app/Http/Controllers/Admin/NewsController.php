<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\News; // Assuming you have a News model
use DataTables;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    protected $moduleSlug;
    protected $module;
    protected $modelObj;
    protected $viewBase;

    public function __construct()
    {
        $this->moduleSlug = "news"; // Updated to "news"
        
        // Model and Module name
        $this->module = "news";
        $this->modelObj = new News; // Updated to use News model
        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    // public function index()
    // {
    //     $newsItems = $this->modelObj::all();

    //     if ($newsItems->isNotEmpty()) {

    //         $newsItems = $newsItems->map(function ($item) {
    //             $item->image_path = url('admin/uploads/news/' . $item->id . '/' . $item->image);
    //             return $item;
    //         });

    //         $this->responseData['status'] = 'success';
    //         $this->responseData['message'] = "News";
    //         $this->responseData['data'] = $newsItems;
    //         return response()->json($this->responseData);
    //     } else {
    //         $this->responseData['status'] = 'error';
    //         $this->responseData['message'] = "No data found";
    //         $this->responseData['data'] = [];
    //         return response()->json($this->responseData);
    //     }
    // }


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

    public function store(Request $request)
    {   
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',  // Updated fields
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
            ], 422);
        }

        try {
            $newsItem = $this->modelObj::create([
                'title' => $request->title,
                'description' => $request->description,
                'slug' => $request->slug,
                'date' => $request->date,
                'location' => $request->location,
                'status' => $request->status,
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin/uploads/news/' . $newsItem->id);

                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $newsItem->image = $filename;
                $newsItem->save();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'News created successfully',
                'data' => $newsItem,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error occurred while creating News: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the News',
            ], 500);
        }
    }

    public function show($id)
    {
        $newsItem = $this->modelObj::find($id);

        if (isset($newsItem)) {
            $newsItem->image_path = url('admin/uploads/news/' . $newsItem->id . '/' . $newsItem->image);

            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "News";
            $this->responseData['data'] = $newsItem;
            return response()->json($this->responseData);
        } else {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    // public function show($id)
    // {
    //     $newsItem = News::find($id);

    //     if ($newsItem) {
    //         $newsItem->image = url('admin/uploads/news/' . $newsItem->id . '/' . basename($newsItem->image));
    //         return response()->json([
    //             'status' => 'success',
    //             'message' => "News retrieved successfully",
    //             'data' => $newsItem,
    //         ]);
    //     }

    //     return response()->json([
    //         'status' => 'error',
    //         'message' => "News not found",
    //         'data' => [],
    //     ]);
    // }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',  // Updated fields
            'description' => 'nullable|string',
            'slug' => 'nullable|unique:news,slug,' . $id,
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            $newsItem = $this->modelObj::findOrFail($id);

            $data = [
                'title' => $request->title,
                'description' => $request->description,
                'slug' => $request->slug,
                'date' => $request->date,
                'location' => $request->location,
                'status' => $request->status,
            ];

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin/uploads/news/' . $newsItem->id);

                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $newsItem->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'News updated successfully',
                'data' => $newsItem,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the News',
            ], 500);
        }
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
