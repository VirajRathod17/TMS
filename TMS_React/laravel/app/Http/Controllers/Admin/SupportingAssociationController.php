<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\SupportingAssociation;
use DataTables;
use Illuminate\Support\Facades\Log;

class SupportingAssociationController extends Controller
{

    public function __construct()
    {
        $this->moduleSlug = "supporting-associations";
        
        // Model and Module name
        $this->module = "supporting-associations";
        $this->modelObj = new SupportingAssociation;
        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    public function index()
    {
        $suppo_assos = $this->modelObj::all();

        if(isset($suppo_assos))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Supporting Association";
            $this->responseData['data'] = $suppo_assos;
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function create(Request $request)
    {
        //
    }

    public function store(Request $request)
    {
        // echo '<pre>';
        //     print_r($request->all());
        //     echo '</pre>';
        // exit();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'website_link' => 'nullable|string|max:255',
            'image' => 'required|file|mimes:jpg,jpeg,png,gif',
            'status' => 'required',
            'award_id' => 'nullable',
            'description' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {

            $suppo_assos = $this->modelObj::create([
                'name' => $request->name,
                'website_link' => $request->website_link,
                // 'award_id' => $request->award_id,
                'status' => $request->status,
                'description' => $request->description,
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . rand(0, 9999999) . '.' . $image->getClientOriginalExtension();
                $uploadPath = public_path('admin' . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $this->moduleSlug . DIRECTORY_SEPARATOR . $suppo_assos->id);
    
                if (\File::exists($uploadPath)) {
                    \File::delete($uploadPath);
                }
                $filename = strtolower(str_replace(' ', '_', $image->getClientOriginalName()));
                $image->move($uploadPath, $filename);
                $suppo_assos->image = $filename;
                $suppo_assos->save();

            }

            return response()->json([
                'status' => 'success',
                'message' => 'Supporting Association created successfully',
                'data' => $suppo_assos,
            ], 201);
        }catch (\Exception $e) {
            // Log the error to the log file with exception details
            Log::error('Error occurred while creating Supporting Association: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
    
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the Supporting Association',
            ], 500);
        }
    }

    public function show($id)
    {
        $suppo_assos = $this->modelObj::find($id);

        if(isset($suppo_assos))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Supporting Association";
            $this->responseData['data'] = $suppo_assos;
            return response()->json($this->responseData);
        }
        else
        {
            $this->responseData['status'] = 'error';
            $this->responseData['message'] = "No data found";
            $this->responseData['data'] = [];
            return response()->json($this->responseData);
        }
    }

    public function update(Request $request, $id)
    {
        echo '<pre>';
            print_r($request->all());
            echo '</pre>';
        exit();

        $validator = Validator::make($request->all(), [
            // 'name' => 'required|string|min:2|max:100',
            // 'website_link' => 'nullable|string|max:255',
            // 'image' => 'required|file|mimes:jpg,jpeg,png,gif|max:2048',
            // 'status' => 'required',
            // 'award_id' => 'nullable',
            // 'description' => 'required',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }
    
        try {
            $suppo_assos = $this->modelObj::findOrFail($id);
    
            $suppo_assos->update([
                'name' => $request->name,
                'website_link' => $request->website_link,
                // 'award_id' => $request->award_id,
                'status' => $request->status,
                'description' => $request->description,
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Supporting Association updated successfully',
                'data' => $suppo_assos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the Supporting Association',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $suppo_assos = $this->modelObj::findOrFail($id);

        if ($suppo_assos) {
            $suppo_assos->delete();

            return response()->json([
                'status' => 1,
                'success' => true,
                'message' => 'Supporting Association deleted successfully.',
            ]);
        }

        return response()->json([
            'status' => 0,
            'success' => false,
            'message' => 'Supporting Association not found.',
        ], 404);
    }

    public function deleteMultipleSupportingAssociationsById(Request $request)
    {
        $ids = $request->ids;

        if (isset($ids) && count($ids) > 0) {
            foreach ($ids as $id) {

                $suppo_assos = $this->modelObj::find($id);
                if ($suppo_assos) {
                    $suppo_assos->delete();
                }
            }
            $response = [
                'status' => 1,
                'message' => ('success'),
            ];
        } else {
            $response = [
                'status' => 0,
                'message' => ('error'),
            ];
        }

        return response()->json($response);
    }
}