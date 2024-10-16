<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Award;
use DataTables;

class AwardController extends Controller
{

    public function __construct()
    {
        $this->moduleSlug = "awards";
        
        // Model and Module name
        $this->module = "awards";
        $this->modelObj = new Award;
        $this->viewBase = 'Admin.' . $this->moduleSlug;
    }

    public function index()
    {
        $awards = $this->modelObj::all();

        if(isset($awards))
        {

            foreach($awards as $award)
            {
                $award->date = date('d-m-Y', strtotime($award->created_at));
            }

            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award";
            $this->responseData['data'] = $awards;
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'year' => 'required|string|min:4|max:4',
            'award_date' => 'required|date',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {
            $award = $this->modelObj::create([
                'name' => $request->name,
                'year' => $request->year,
                'award_date' => $request->award_date,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Award created successfully',
                'data' => $award,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the award',
            ], 500);
        }
    }

    public function show($id)
    {
        $awards = $this->modelObj::find($id);

        if(isset($awards))
        {
            $this->responseData['status'] = 'success';
            $this->responseData['message'] = "Award";
            $this->responseData['data'] = $awards;
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'year' => 'required|string|min:4|max:4',
            'award_date' => 'required|date',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }
    
        try {
            $award = $this->modelObj::findOrFail($id);
    
            $award->update([
                'name' => $request->name,
                'year' => $request->year,
                'award_date' => $request->award_date,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
            ]);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Award updated successfully',
                'data' => $award,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the award',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $award = $this->modelObj::findOrFail($id);

        if ($award) {
            $award->delete();

            return response()->json([
                'status' => 1,
                'success' => true,
                'message' => 'Award deleted successfully.',
            ]);
        }

        return response()->json([
            'status' => 0,
            'success' => false,
            'message' => 'Award not found.',
        ], 404);
    }

    public function deleteMultipleAwardsById(Request $request)
    {
        $ids = $request->ids;

        if (isset($ids) && count($ids) > 0) {
            foreach ($ids as $id) {

                $awards = $this->modelObj::find($id);
                if ($awards) {
                    $awards->delete();
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